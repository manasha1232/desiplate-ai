from typing import Dict, Any, Tuple

def infer_preparation(food_name: str, visual_features: Dict[str, Any]) -> Tuple[str, str]:
    """
    Probabilistically infers likely preparation method based on visual features and food class.
    Returns: (likely_preparation_string, prep_confidence_string)
    
    IMPORTANT: Preparation inference is probabilistic and based solely on surface visual cues.
    """
    oiliness = visual_features.get("visible_oiliness", "Low")
    browning = visual_features.get("visible_browning", "Low")
    moisture = visual_features.get("moisture_appearance", "Dry")
    
    food_lower = food_name.lower()
    
    # Category 1: Gravy dishes (Dal, Sambar, Paneer curry, Vegetable curry)
    if moisture == "Moist / Gravy-rich":
        if oiliness in ["Moderate", "High"]:
            return "Gravy Curry (Tadka/Butter)", "High"
        else:
            return "Boiled / Stewed Gravy", "Moderate"
            
    # Category 2: Fried / Pan-cooked dishes (Potato fry, Dosa, Paratha)
    if browning == "High" and oiliness in ["Moderate", "High"]:
        return "Fried / Pan-cooked", "High"
        
    if browning == "High" and moisture == "Dry":
        return "Roasted / Tandoori", "Moderate"
        
    # Category 3: Sautéed / Poriyal
    if oiliness == "Moderate" and moisture == "Semi-dry":
        return "Sautéed / Poriyal", "Moderate"
        
    # Category 4: Steamed / Boiled (Steamed Rice, Idli)
    if oiliness == "Low" and browning == "Low":
        if "rice" in food_lower or "idli" in food_lower:
            return "Steamed", "High"
        elif "roti" in food_lower or "chapati" in food_lower:
            return "Griddle-baked (Dry Roti)", "High"
        else:
            return "Boiled / Steamed", "Moderate"
            
    # Default fallback
    if oiliness == "High":
        return "Deep-fried / Oil-tempered", "Moderate"
    else:
        return "Tempered / Mild Gravy", "Low"
