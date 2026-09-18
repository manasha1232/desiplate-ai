from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

class NutritionInfo(BaseModel):
    calories: float
    protein: float
    carbohydrates: float
    fat: float

class VisualFeatures(BaseModel):
    mean_rgb: List[float]
    mean_hsv: List[float]
    visible_oiliness: str  # Low, Moderate, High
    visible_browning: str  # Low, Moderate, High
    moisture_appearance: str  # Dry, Semi-dry, Moist / Gravy-rich

class DetectedFoodItem(BaseModel):
    id: Optional[int] = None
    name: str
    detection_confidence: float = Field(..., description="Detection confidence score (0.0 to 1.0)")
    bounding_box: List[int]  # [x1, y1, x2, y2]
    mask_url: Optional[str] = None
    visual_features: VisualFeatures
    likely_preparation: str
    prep_confidence: str
    nutrition: NutritionInfo

class MealAnalysisResponse(BaseModel):
    meal_id: Optional[int] = None
    timestamp: str
    image_url: str
    segmented_image_url: str
    foods: List[DetectedFoodItem]
    total_nutrition: NutritionInfo
    meal_observations: List[str]
    scientific_disclaimer: str

class MealHistorySummary(BaseModel):
    id: int
    timestamp: datetime
    image_url: str
    segmented_image_url: Optional[str] = None
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fat: float
    detected_foods: List[str]

class OverallMealStats(BaseModel):
    total_meals: int
    avg_calories: float
    avg_protein: float
    avg_carbs: float
    avg_fat: float
