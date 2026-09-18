import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from database import Base

class MealHistory(Base):
    __tablename__ = "meal_history"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    image_filename = Column(String, nullable=False)
    image_path = Column(String, nullable=False)
    segmented_image_url = Column(String, nullable=True)
    
    # Nutrition aggregates
    total_calories = Column(Float, default=0.0)
    total_protein = Column(Float, default=0.0)
    total_carbs = Column(Float, default=0.0)
    total_fat = Column(Float, default=0.0)
    
    # Summary observation
    meal_summary = Column(Text, nullable=True)
    
    # Relationships
    items = relationship("DetectedItem", back_populates="meal", cascade="all, delete-orphan")


class DetectedItem(Base):
    __tablename__ = "detected_items"

    id = Column(Integer, primary_key=True, index=True)
    meal_id = Column(Integer, ForeignKey("meal_history.id"))
    
    food_name = Column(String, nullable=False)
    detection_confidence = Column(Float, nullable=False)
    bounding_box = Column(JSON, nullable=False)  # [x1, y1, x2, y2]
    mask_url = Column(String, nullable=True)
    
    # Visual features
    visible_oiliness = Column(String, nullable=False)  # Low, Moderate, High
    visible_browning = Column(String, nullable=False)  # Low, Moderate, High
    moisture_appearance = Column(String, nullable=False)  # Dry, Semi-dry, Moist / Gravy-rich
    likely_preparation = Column(String, nullable=False)
    prep_confidence = Column(String, nullable=False)
    
    # Nutrition per item
    calories = Column(Float, default=0.0)
    protein = Column(Float, default=0.0)
    carbohydrates = Column(Float, default=0.0)
    fat = Column(Float, default=0.0)

    meal = relationship("MealHistory", back_populates="items")
