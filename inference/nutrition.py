from typing import Dict, List, Any

# Indian Food Nutrient Reference Database (Standard 100g Base Serving)
NUTRITION_DATABASE: Dict[str, Dict[str, float]] = {
    "rice": {
        "calories": 130.0,
        "protein": 2.7,
        "carbohydrates": 28.0,
        "fat": 0.3,
        "display_name": "Steamed White Rice"
    },
    "chapati_roti": {
        "calories": 120.0,
        "protein": 3.5,
        "carbohydrates": 22.0,
        "fat": 1.8,
        "display_name": "Whole Wheat Roti / Chapati"
    },
    "dal": {
        "calories": 115.0,
        "protein": 6.8,
        "carbohydrates": 16.0,
        "fat": 2.5,
        "display_name": "Yellow Dal / Tadka Dal"
    },
    "sambar": {
        "calories": 85.0,
        "protein": 3.2,
        "carbohydrates": 12.0,
        "fat": 2.2,
        "display_name": "Sambar Lentil Stew"
    },
    "potato_dish": {
        "calories": 110.0,
        "protein": 2.0,
        "carbohydrates": 20.0,
        "fat": 2.0,
        "display_name": "Potato Poriyal / Aloo Masala"
    },
    "paneer_dish": {
        "calories": 240.0,
        "protein": 11.5,
        "carbohydrates": 6.0,
        "fat": 19.0,
        "display_name": "Paneer Curry / Butter Gravy"
    },
    "curd_yogurt": {
        "calories": 60.0,
        "protein": 3.5,
        "carbohydrates": 4.5,
        "fat": 3.0,
        "display_name": "Plain Curd / Fresh Raita"
    },
    "vegetable_curry": {
        "calories": 95.0,
        "protein": 2.5,
        "carbohydrates": 10.0,
        "fat": 4.5,
        "display_name": "Mixed Vegetable Poriyal / Sabzi"
    },
    "dosa_idli": {
        "calories": 140.0,
        "protein": 3.8,
        "carbohydrates": 26.0,
        "fat": 2.1,
        "display_name": "Crispy Dosa / Soft Idli"
    }
}

PREPARATION_NUTRITION_MULTIPLIERS = {
    "Boiled": {"calories": 0.95, "fat": 0.8},
    "Steamed": {"calories": 0.95, "fat": 0.75},
    "Sautéed / Pan-cooked": {"calories": 1.15, "fat": 1.3},
    "Fried / Deep-fried": {"calories": 1.45, "fat": 2.2},
    "Roasted / Tandoori": {"calories": 1.05, "fat": 1.1},
    "Gravy Curry (Tadka/Butter)": {"calories": 1.25, "fat": 1.6},
    "Tempered / Mild Gravy": {"calories": 1.10, "fat": 1.2}
}

def calculate_item_nutrition(food_key: str, likely_prep: str, bbox_area_factor: float = 1.0) -> Dict[str, float]:
    """
    Computes approximate item nutrition based on reference database and preparation multipliers.
    """
    base_info = NUTRITION_DATABASE.get(food_key, {
        "calories": 100.0,
        "protein": 3.0,
        "carbohydrates": 15.0,
        "fat": 3.0,
        "display_name": food_key.replace("_", " ").title()
    })
    
    multiplier = PREPARATION_NUTRITION_MULTIPLIERS.get(likely_prep, {"calories": 1.0, "fat": 1.0})
    
    # Scale slightly by estimated visual area factor (between 0.8 and 1.5)
    scale = max(0.8, min(1.5, bbox_area_factor))
    
    cal = round(base_info["calories"] * multiplier["calories"] * scale, 1)
    prot = round(base_info["protein"] * scale, 1)
    carbs = round(base_info["carbohydrates"] * scale, 1)
    fat = round(base_info["fat"] * multiplier["fat"] * scale, 1)
    
    return {
        "calories": cal,
        "protein": prot,
        "carbohydrates": carbs,
        "fat": fat
    }

def synthesize_meal_observations(detected_items: List[Dict[str, Any]]) -> List[str]:
    """
    Synthesizes meal-level observations based on detected components and preparation types.
    """
    if not detected_items:
        return ["No food items detected in the image."]
    
    names = [item["name"].lower() for item in detected_items]
    preps = [item.get("likely_preparation", "") for item in detected_items]
    oiliness = [item.get("visual_features", {}).get("visible_oiliness", "Low") for item in detected_items]
    
    observations = []
    
    # Carbohydrates
    carbs = [n for n in names if any(c in n for c in ["rice", "roti", "chapati", "dosa", "idli"])]
    if carbs:
        observations.append(f"Main carbohydrate base detected: {', '.join(carbs).title()}.")
        
    # Protein & Dairy
    proteins = [n for n in names if any(p in n for p in ["dal", "sambar", "paneer", "curd"])]
    if proteins:
        observations.append(f"Protein & dairy sources identified: {', '.join(proteins).title()}.")
        
    # Oiliness / Cooking observation
    high_oil = [names[i] for i, oil in enumerate(oiliness) if oil in ["Moderate", "High"]]
    if high_oil:
        observations.append(f"Visible surface oiliness observed in: {', '.join(high_oil).title()}.")
    else:
        observations.append("Meal exhibits low overall visible surface oiliness.")
        
    # Preparation diversity
    if len(set(preps)) > 1:
        observations.append("Meal features a balanced mix of dry preparations and liquid gravy dishes.")
        
    return observations
