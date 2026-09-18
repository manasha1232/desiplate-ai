import os
import datetime
from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
import json

from database import engine, get_db, Base
import models_db
import schemas
from inference.detector import detector_pipeline
from evaluation.evaluate import run_evaluation

# Initialize SQLite database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DesiPlate AI API",
    description="Mask R-CNN Based Preparation-Aware Indian Meal Analysis Backend",
    version="1.0.0"
)

# Enable CORS for local React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
OUTPUTS_DIR = os.path.join(PROJECT_ROOT, "outputs")
DATA_DIR = os.path.join(PROJECT_ROOT, "data")

os.makedirs(os.path.join(OUTPUTS_DIR, "masks"), exist_ok=True)
os.makedirs(os.path.join(OUTPUTS_DIR, "predictions"), exist_ok=True)
os.makedirs(os.path.join(OUTPUTS_DIR, "evaluation"), exist_ok=True)

# Mount static file directories for image serving
app.mount("/outputs", StaticFiles(directory=OUTPUTS_DIR), name="outputs")
app.mount("/data", StaticFiles(directory=DATA_DIR), name="data")

@app.get("/")
def root():
    return {
        "status": "online",
        "system": "DesiPlate AI",
        "algorithm": "Mask R-CNN (torchvision.models.detection.maskrcnn_resnet50_fpn)",
        "version": "1.0.0"
    }

@app.get("/api/sample-images")
def get_sample_images():
    sample_dir = os.path.join(DATA_DIR, "sample_meals")
    images = []
    if os.path.exists(sample_dir):
        for f in os.listdir(sample_dir):
            if f.endswith(('.jpg', '.png', '.jpeg')):
                display_title = f.replace('_', ' ').replace('.jpg', '').replace('.png', '').title()
                images.append({
                    "filename": f,
                    "title": display_title,
                    "url": f"/data/sample_meals/{f}"
                })
    return images

@app.post("/api/analyze", response_model=schemas.MealAnalysisResponse)
async def analyze_meal(
    file: Optional[UploadFile] = File(None),
    sample_filename: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Executes Mask R-CNN detection, segmentation, feature extraction, preparation inference, 
    and nutrition estimation on uploaded image or selected sample image.
    Stores result in database history.
    """
    image_bytes = None
    saved_filename = ""
    
    if sample_filename:
        sample_path = os.path.join(DATA_DIR, "sample_meals", sample_filename)
        if not os.path.exists(sample_path):
            raise HTTPException(status_code=404, detail="Sample image not found.")
        with open(sample_path, "rb") as f:
            image_bytes = f.read()
        saved_filename = sample_filename
    elif file:
        image_bytes = await file.read()
        timestamp_str = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        saved_filename = f"upload_{timestamp_str}_{file.filename}"
        save_path = os.path.join(OUTPUTS_DIR, "predictions", saved_filename)
        with open(save_path, "wb") as f:
            f.write(image_bytes)
    else:
        raise HTTPException(status_code=400, detail="Must provide either an uploaded file or sample_filename.")

    # Execute complete Mask R-CNN Pipeline
    results = detector_pipeline.analyze_meal_image(
        image_bytes=image_bytes,
        output_dir=OUTPUTS_DIR,
        confidence_threshold=0.45
    )
    
    # Save to SQLite Database
    meal_db = models_db.MealHistory(
        image_filename=saved_filename,
        image_path=results["segmented_image_url"],
        segmented_image_url=results["segmented_image_url"],
        total_calories=results["total_nutrition"]["calories"],
        total_protein=results["total_nutrition"]["protein"],
        total_carbs=results["total_nutrition"]["carbohydrates"],
        total_fat=results["total_nutrition"]["fat"],
        meal_summary=" | ".join(results["meal_observations"])
    )
    db.add(meal_db)
    db.commit()
    db.refresh(meal_db)
    
    for food in results["foods"]:
        item_db = models_db.DetectedItem(
            meal_id=meal_db.id,
            food_name=food["name"],
            detection_confidence=food["detection_confidence"],
            bounding_box=food["bounding_box"],
            mask_url=food["mask_url"],
            visible_oiliness=food["visual_features"]["visible_oiliness"],
            visible_browning=food["visual_features"]["visible_browning"],
            moisture_appearance=food["visual_features"]["moisture_appearance"],
            likely_preparation=food["likely_preparation"],
            prep_confidence=food["prep_confidence"],
            calories=food["nutrition"]["calories"],
            protein=food["nutrition"]["protein"],
            carbohydrates=food["nutrition"]["carbohydrates"],
            fat=food["nutrition"]["fat"]
        )
        db.add(item_db)
    db.commit()
    
    response_data = {
        "meal_id": meal_db.id,
        "timestamp": meal_db.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        "image_url": results["segmented_image_url"],
        "segmented_image_url": results["segmented_image_url"],
        "foods": results["foods"],
        "total_nutrition": results["total_nutrition"],
        "meal_observations": results["meal_observations"],
        "scientific_disclaimer": results["scientific_disclaimer"]
    }
    return response_data

@app.get("/api/meals", response_model=List[schemas.MealHistorySummary])
def get_meal_history(db: Session = Depends(get_db)):
    """Retrieves all past scanned meals."""
    meals = db.query(models_db.MealHistory).order_by(models_db.MealHistory.timestamp.desc()).all()
    summaries = []
    for m in meals:
        food_names = [item.food_name for item in m.items]
        summaries.append({
            "id": m.id,
            "timestamp": m.timestamp,
            "image_url": m.segmented_image_url or m.image_path,
            "segmented_image_url": m.segmented_image_url,
            "total_calories": m.total_calories,
            "total_protein": m.total_protein,
            "total_carbs": m.total_carbs,
            "total_fat": m.total_fat,
            "detected_foods": food_names
        })
    return summaries

@app.get("/api/meals/stats", response_model=schemas.OverallMealStats)
def get_meal_stats(db: Session = Depends(get_db)):
    """Computes average calories, protein, carbs, fat across all scanned meals."""
    meals = db.query(models_db.MealHistory).all()
    if not meals:
        return {
            "total_meals": 0,
            "avg_calories": 0.0,
            "avg_protein": 0.0,
            "avg_carbs": 0.0,
            "avg_fat": 0.0
        }
    count = len(meals)
    avg_cal = sum(m.total_calories for m in meals) / count
    avg_prot = sum(m.total_protein for m in meals) / count
    avg_carbs = sum(m.total_carbs for m in meals) / count
    avg_fat = sum(m.total_fat for m in meals) / count
    
    return {
        "total_meals": count,
        "avg_calories": round(avg_cal, 1),
        "avg_protein": round(avg_prot, 1),
        "avg_carbs": round(avg_carbs, 1),
        "avg_fat": round(avg_fat, 1)
    }

@app.get("/api/meals/{meal_id}")
def get_meal_details(meal_id: int, db: Session = Depends(get_db)):
    """Gets details for a specific historical meal."""
    meal = db.query(models_db.MealHistory).filter(models_db.MealHistory.id == meal_id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found.")
        
    items = []
    for item in meal.items:
        items.append({
            "id": item.id,
            "name": item.food_name,
            "detection_confidence": item.detection_confidence,
            "bounding_box": item.bounding_box,
            "mask_url": item.mask_url,
            "visual_features": {
                "mean_rgb": [200.0, 150.0, 100.0],
                "mean_hsv": [30.0, 100.0, 180.0],
                "visible_oiliness": item.visible_oiliness,
                "visible_browning": item.visible_browning,
                "moisture_appearance": item.moisture_appearance
            },
            "likely_preparation": item.likely_preparation,
            "prep_confidence": item.prep_confidence,
            "nutrition": {
                "calories": item.calories,
                "protein": item.protein,
                "carbohydrates": item.carbohydrates,
                "fat": item.fat
            }
        })
        
    return {
        "meal_id": meal.id,
        "timestamp": meal.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        "image_url": meal.segmented_image_url,
        "segmented_image_url": meal.segmented_image_url,
        "foods": items,
        "total_nutrition": {
            "calories": meal.total_calories,
            "protein": meal.total_protein,
            "carbohydrates": meal.total_carbs,
            "fat": meal.total_fat
        },
        "meal_observations": meal.meal_summary.split(" | ") if meal.meal_summary else []
    }

@app.get("/api/evaluate")
def evaluate_model():
    """Executes Mask R-CNN evaluation suite and returns metrics, plots, and failure cases."""
    results = run_evaluation(
        data_dir=os.path.join(DATA_DIR, "test_set"),
        output_dir=os.path.join(OUTPUTS_DIR, "evaluation")
    )
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
