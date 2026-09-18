import cv2
import numpy as np
from typing import Dict, Any, Tuple, List

def extract_visual_features(image_bgr: np.ndarray, binary_mask: np.ndarray) -> Dict[str, Any]:
    """
    Extracts pixel-level visual features from the masked region of a detected food item.
    - Color profile: Mean RGB & HSV
    - Visible Browning: Low, Moderate, High
    - Visible Surface Oiliness: Low, Moderate, High
    - Moisture / Gravy Appearance: Dry, Semi-dry, Moist / Gravy-rich
    """
    # Ensure binary mask is boolean
    mask_bool = binary_mask.astype(bool)
    num_pixels = np.sum(mask_bool)
    
    if num_pixels == 0:
        return {
            "mean_rgb": [128.0, 128.0, 128.0],
            "mean_hsv": [0.0, 0.0, 128.0],
            "visible_oiliness": "Low",
            "visible_browning": "Low",
            "moisture_appearance": "Dry"
        }
        
    # Convert image to RGB and HSV
    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    image_hsv = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2HSV)
    
    # Extract masked pixels
    pixels_rgb = image_rgb[mask_bool]  # Shape: (N, 3)
    pixels_hsv = image_hsv[mask_bool]  # Shape: (N, 3)
    
    mean_rgb = [round(float(x), 1) for x in np.mean(pixels_rgb, axis=0)]
    mean_hsv = [round(float(x), 1) for x in np.mean(pixels_hsv, axis=0)]
    
    # --- A. BROWNING ANALYSIS ---
    # Browning in HSV: Hue (10-30 in OpenCV 0-180 scale), moderate Saturation, low-to-medium Value
    h_channel = pixels_hsv[:, 0]
    s_channel = pixels_hsv[:, 1]
    v_channel = pixels_hsv[:, 2]
    
    browning_pixels = np.sum((h_channel >= 5) & (h_channel <= 25) & (s_channel >= 50) & (v_channel <= 160))
    browning_ratio = browning_pixels / num_pixels
    
    if browning_ratio > 0.25:
        visible_browning = "High"
    elif browning_ratio > 0.10:
        visible_browning = "Moderate"
    else:
        visible_browning = "Low"
        
    # --- B. VISIBLE SURFACE OILINESS ANALYSIS ---
    # Surface oiliness exhibits high specular reflection: high Value (V > 210) + low Saturation (S < 60)
    # or high local brightness variance
    specular_highlights = np.sum((v_channel > 210) & (s_channel < 60))
    specular_ratio = specular_highlights / num_pixels
    val_std = np.std(v_channel)
    
    oiliness_metric = (specular_ratio * 100.0) + (val_std * 0.1)
    
    if oiliness_metric > 4.0:
        visible_oiliness = "High"
    elif oiliness_metric > 1.8:
        visible_oiliness = "Moderate"
    else:
        visible_oiliness = "Low"
        
    # --- C. MOISTURE / GRAVY APPEARANCE ANALYSIS ---
    # Gravy/Liquid dishes have low edge density and high color smoothness inside mask
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150)
    masked_edges = edges[mask_bool]
    edge_density = np.mean(masked_edges) / 255.0 if len(masked_edges) > 0 else 0.0
    
    # High saturation + high mean V + low edge density indicates liquid gravy
    if mean_hsv[1] > 100 and edge_density < 0.12 and mean_hsv[2] > 90:
        moisture_appearance = "Moist / Gravy-rich"
    elif edge_density > 0.20 or visible_browning == "High":
        moisture_appearance = "Dry"
    else:
        moisture_appearance = "Semi-dry"
        
    return {
        "mean_rgb": mean_rgb,
        "mean_hsv": mean_hsv,
        "visible_oiliness": visible_oiliness,
        "visible_browning": visible_browning,
        "moisture_appearance": moisture_appearance
    }
