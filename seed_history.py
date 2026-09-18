import os
import datetime
from sqlalchemy.orm import Session
from database import engine, SessionLocal, Base
import models_db

Base.metadata.create_all(bind=engine)

def seed_database():
    db: Session = SessionLocal()
    
    # Check if history already populated
    existing_count = db.query(models_db.MealHistory).count()
    if existing_count >= 5:
        print(f"Database already has {existing_count} records. Skipping seed.")
        db.close()
        return

    now = datetime.datetime.now()
    
    realistic_meals = [
        {
            "days_ago": 0,
            "filename": "south_indian_thali.jpg",
            "url": "/data/sample_meals/south_indian_thali.jpg",
            "summary": "Main carbohydrate base detected: Steamed White Rice. | Protein & dairy sources identified: Yellow Dal, Fresh Raita, Sambar. | Visible surface oiliness observed in: Potato Poriyal.",
            "items": [
                {"name": "Steamed White Rice", "conf": 0.94, "bbox": [230, 225, 420, 355], "oil": "Low", "brown": "Low", "moist": "Dry", "prep": "Steamed", "prep_conf": "High", "cal": 220.0, "prot": 4.5, "carbs": 48.0, "fat": 0.5},
                {"name": "Yellow Dal / Tadka Dal", "conf": 0.91, "bbox": [145, 105, 255, 215], "oil": "Moderate", "brown": "Low", "moist": "Moist / Gravy-rich", "prep": "Gravy Curry (Tadka/Butter)", "prep_conf": "High", "cal": 145.0, "prot": 8.5, "carbs": 20.0, "fat": 3.5},
                {"name": "Potato Poriyal", "conf": 0.88, "bbox": [400, 110, 500, 210], "oil": "High", "brown": "High", "moist": "Dry", "prep": "Fried / Pan-cooked", "prep_conf": "High", "cal": 175.0, "prot": 3.0, "carbs": 24.0, "fat": 7.5},
                {"name": "Plain Curd / Fresh Raita", "conf": 0.92, "bbox": [135, 275, 225, 365], "oil": "Low", "brown": "Low", "moist": "Moist / Gravy-rich", "prep": "Tempered / Fresh Dairy", "prep_conf": "High", "cal": 70.0, "prot": 4.0, "carbs": 5.0, "fat": 3.5},
                {"name": "Mixed Vegetable Sabzi", "conf": 0.85, "bbox": [425, 275, 515, 365], "oil": "Moderate", "brown": "Moderate", "moist": "Semi-dry", "prep": "Sautéed / Poriyal", "prep_conf": "Moderate", "cal": 110.0, "prot": 3.2, "carbs": 12.0, "fat": 5.0}
            ]
        },
        {
            "days_ago": 1,
            "filename": "north_indian_thali.jpg",
            "url": "/data/sample_meals/north_indian_thali.jpg",
            "summary": "Main carbohydrate base detected: Whole Wheat Roti. | Protein & dairy sources identified: Dal Tadka, Paneer Butter Masala. | Visible surface oiliness observed in: Paneer Butter Masala.",
            "items": [
                {"name": "Whole Wheat Roti", "conf": 0.93, "bbox": [220, 130, 415, 280], "oil": "Low", "brown": "Moderate", "moist": "Dry", "prep": "Griddle-baked (Dry Roti)", "prep_conf": "High", "cal": 210.0, "prot": 6.8, "carbs": 40.0, "fat": 2.5},
                {"name": "Dal Tadka", "conf": 0.89, "bbox": [150, 260, 270, 380], "oil": "Moderate", "brown": "Low", "moist": "Moist / Gravy-rich", "prep": "Gravy Curry (Tadka/Butter)", "prep_conf": "High", "cal": 150.0, "prot": 8.0, "carbs": 21.0, "fat": 4.0},
                {"name": "Paneer Butter Masala", "conf": 0.90, "bbox": [380, 250, 500, 370], "oil": "High", "brown": "Moderate", "moist": "Moist / Gravy-rich", "prep": "Gravy Curry (Tadka/Butter)", "prep_conf": "High", "cal": 310.0, "prot": 14.2, "carbs": 8.5, "fat": 24.0}
            ]
        },
        {
            "days_ago": 2,
            "filename": "dosa_sambar.jpg",
            "url": "/data/sample_meals/dosa_sambar.jpg",
            "summary": "Main carbohydrate base detected: Crispy Masala Dosa. | Protein & dairy sources identified: Sambar Lentil Stew. | Visible surface oiliness was moderate in the griddle preparation.",
            "items": [
                {"name": "Crispy Dosa", "conf": 0.95, "bbox": [140, 150, 510, 330], "oil": "Moderate", "brown": "High", "moist": "Dry", "prep": "Fried / Pan-cooked", "prep_conf": "High", "cal": 260.0, "prot": 5.5, "carbs": 42.0, "fat": 7.5},
                {"name": "Sambar Lentil Stew", "conf": 0.92, "bbox": [155, 75, 245, 165], "oil": "Low", "brown": "Low", "moist": "Moist / Gravy-rich", "prep": "Boiled / Stewed Gravy", "prep_conf": "High", "cal": 95.0, "prot": 4.0, "carbs": 14.0, "fat": 2.5},
                {"name": "Coconut Chutney", "conf": 0.86, "bbox": [410, 80, 490, 160], "oil": "Moderate", "brown": "Low", "moist": "Semi-dry", "prep": "Tempered / Fresh Dip", "prep_conf": "Moderate", "cal": 110.0, "prot": 1.5, "carbs": 4.0, "fat": 10.0}
            ]
        },
        {
            "days_ago": 3,
            "filename": "aloo_fry_rice.jpg",
            "url": "/data/sample_meals/aloo_fry_rice.jpg",
            "summary": "Main carbohydrate base detected: Steamed Rice. | Visible surface oiliness observed in: Crispy Aloo Fry. | Balanced mix of dry fry and vegetable curry.",
            "items": [
                {"name": "Steamed White Rice", "conf": 0.93, "bbox": [215, 180, 435, 340], "oil": "Low", "brown": "Low", "moist": "Dry", "prep": "Steamed", "prep_conf": "High", "cal": 210.0, "prot": 4.2, "carbs": 46.0, "fat": 0.4},
                {"name": "Crispy Aloo Fry", "conf": 0.89, "bbox": [145, 155, 255, 245], "oil": "High", "brown": "High", "moist": "Dry", "prep": "Fried / Pan-cooked", "prep_conf": "High", "cal": 185.0, "prot": 2.8, "carbs": 26.0, "fat": 8.0},
                {"name": "Mixed Vegetable Sabzi", "conf": 0.87, "bbox": [395, 155, 505, 245], "oil": "Moderate", "brown": "Moderate", "moist": "Semi-dry", "prep": "Sautéed / Poriyal", "prep_conf": "Moderate", "cal": 105.0, "prot": 3.0, "carbs": 11.0, "fat": 5.2}
            ]
        },
        {
            "days_ago": 5,
            "filename": "south_indian_thali.jpg",
            "url": "/data/sample_meals/south_indian_thali.jpg",
            "summary": "Main carbohydrate base detected: Steamed White Rice. | Protein & dairy sources identified: Sambar, Yellow Dal, Curd. | Healthy high-protein meal.",
            "items": [
                {"name": "Steamed White Rice", "conf": 0.92, "bbox": [230, 225, 420, 355], "oil": "Low", "brown": "Low", "moist": "Dry", "prep": "Steamed", "prep_conf": "High", "cal": 220.0, "prot": 4.5, "carbs": 48.0, "fat": 0.5},
                {"name": "Sambar Lentil Stew", "conf": 0.90, "bbox": [145, 105, 255, 215], "oil": "Low", "brown": "Low", "moist": "Moist / Gravy-rich", "prep": "Boiled / Stewed Gravy", "prep_conf": "High", "cal": 90.0, "prot": 3.8, "carbs": 13.0, "fat": 2.2},
                {"name": "Plain Curd", "conf": 0.94, "bbox": [135, 275, 225, 365], "oil": "Low", "brown": "Low", "moist": "Moist / Gravy-rich", "prep": "Fresh Dairy", "prep_conf": "High", "cal": 65.0, "prot": 3.8, "carbs": 4.8, "fat": 3.2}
            ]
        }
    ]

    for meal_data in realistic_meals:
        meal_time = now - datetime.timedelta(days=meal_data["days_ago"], hours=2, minutes=15)
        
        tot_cal = sum(item["cal"] for item in meal_data["items"])
        tot_prot = sum(item["prot"] for item in meal_data["items"])
        tot_carbs = sum(item["carbs"] for item in meal_data["items"])
        tot_fat = sum(item["fat"] for item in meal_data["items"])
        
        meal_db = models_db.MealHistory(
            timestamp=meal_time,
            image_filename=meal_data["filename"],
            image_path=meal_data["url"],
            segmented_image_url=meal_data["url"],
            total_calories=round(tot_cal, 1),
            total_protein=round(tot_prot, 1),
            total_carbs=round(tot_carbs, 1),
            total_fat=round(tot_fat, 1),
            meal_summary=meal_data["summary"]
        )
        db.add(meal_db)
        db.commit()
        db.refresh(meal_db)
        
        for item in meal_data["items"]:
            item_db = models_db.DetectedItem(
                meal_id=meal_db.id,
                food_name=item["name"],
                detection_confidence=item["conf"],
                bounding_box=item["bbox"],
                mask_url=meal_data["url"],
                visible_oiliness=item["oil"],
                visible_browning=item["brown"],
                moisture_appearance=item["moist"],
                likely_preparation=item["prep"],
                prep_confidence=item["prep_conf"],
                calories=item["cal"],
                protein=item["prot"],
                carbohydrates=item["carbs"],
                fat=item["fat"]
            )
            db.add(item_db)
        db.commit()

    print("Successfully seeded database with realistic meal history!")
    db.close()

if __name__ == "__main__":
    seed_database()
