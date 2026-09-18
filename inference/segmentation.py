import os
import cv2
import numpy as np
import uuid
from typing import List, Dict, Any, Tuple

# Vibrant modern color palette for instance segmentation masks (BGR format)
MASK_COLOR_PALETTE = [
    {"name": "Purple", "bgr": (219, 112, 147), "border": (219, 112, 147)},  # Phulka / Roti (Purple)
    {"name": "Red",    "bgr": (80, 50, 235),   "border": (80, 50, 235)},    # Sambar (Red/Pink)
    {"name": "Cyan",   "bgr": (225, 200, 0),   "border": (225, 200, 0)},    # Veg Curry (Cyan)
    {"name": "Green",  "bgr": (50, 205, 50),   "border": (50, 205, 50)},    # Dal Tadka (Green)
    {"name": "Orange", "bgr": (0, 140, 255),   "border": (0, 140, 255)},    # Tomato / Potato (Orange)
    {"name": "Gold",   "bgr": (0, 215, 255),   "border": (0, 215, 255)},    # Rice (Gold)
]

def generate_segmented_overlay(
    image_bgr: np.ndarray,
    detections: List[Dict[str, Any]],
    output_dir: str
) -> Tuple[str, List[str]]:
    """
    Renders clean instance segmentation mask contours + modern floating pill badges (matching Image 2)
    and exports individual mask PNG files.
    Returns: (segmented_overlay_filename, list_of_individual_mask_filenames)
    """
    os.makedirs(output_dir, exist_ok=True)
    overlay = image_bgr.copy()
    h, w = image_bgr.shape[:2]
    
    unique_id = str(uuid.uuid4())[:8]
    mask_filenames = []
    
    for idx, item in enumerate(detections):
        mask_bool = item["mask"]
        bbox = item["bounding_box"]  # [x1, y1, x2, y2]
        food_name = item["name"]
        confidence = item["detection_confidence"]
        
        color_entry = MASK_COLOR_PALETTE[idx % len(MASK_COLOR_PALETTE)]
        color_bgr = color_entry["bgr"]
        
        # 1. Apply semi-transparent mask color fill inside the mask region (0.25 opacity)
        colored_mask = np.zeros_like(image_bgr, dtype=np.uint8)
        colored_mask[mask_bool] = color_bgr
        overlay = cv2.addWeighted(overlay, 1.0, colored_mask, 0.25, 0)
        
        # 2. Draw sharp, anti-aliased 3px contour border around the exact food instance mask
        mask_uint8 = mask_bool.astype(np.uint8) * 255
        contours, _ = cv2.findContours(mask_uint8, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        cv2.drawContours(overlay, contours, -1, color_bgr, 3, cv2.LINE_AA)
        
        # 3. Format clean floating pill badge text (e.g. "Phulka / Roti 96%", "Sambar 92%")
        display_title = food_name.replace('_', ' ').title()
        if "Chapati" in display_title or "Roti" in display_title:
            display_title = "Phulka / Roti"
        elif "Potato" in display_title:
            display_title = "Potato Poriyal"
        elif "Vegetable" in display_title:
            display_title = "Vegetable Curry"
        elif "Dal" in display_title:
            display_title = "Dal Tadka"
        elif "Rice" in display_title:
            display_title = "Steamed Rice"
            
        badge_text = f"{display_title} {int(confidence * 100)}%"
        
        # Calculate badge position near top-center of contour or bbox
        x1, y1, x2, y2 = bbox
        top_cx = (x1 + x2) // 2
        top_cy = max(15, y1 - 8)
        
        # Render clean floating pill badge (White background + 3px colored border + Dark bold text)
        _draw_floating_pill_badge(overlay, badge_text, (top_cx, top_cy), color_bgr)
        
        # 4. Save individual mask image
        mask_filename = f"mask_{unique_id}_{idx}_{food_name}.png"
        mask_filepath = os.path.join(output_dir, mask_filename)
        cv2.imwrite(mask_filepath, mask_uint8)
        mask_filenames.append(mask_filename)
        
    # Save composite segmented overlay image
    composite_filename = f"overlay_{unique_id}.jpg"
    composite_filepath = os.path.join(output_dir, composite_filename)
    cv2.imwrite(composite_filepath, overlay)
    
    return composite_filename, mask_filenames

def _draw_floating_pill_badge(img: np.ndarray, text: str, pos: Tuple[int, int], color_bgr: Tuple[int, int, int]):
    """
    Renders a modern floating pill badge matching Image 2:
    - White pill box background
    - 3px colored border matching mask contour color
    - Dark crisp text inside
    """
    h_img, w_img = img.shape[:2]
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 0.55
    thickness = 2
    
    (text_w, text_h), baseline = cv2.getTextSize(text, font, font_scale, thickness)
    pad_x, pad_y = 10, 6
    
    box_w = text_w + pad_x * 2
    box_h = text_h + pad_y * 2
    
    # Position pill centered horizontally over anchor point, constrained to image bounds
    cx, cy = pos
    x = max(10, min(w_img - box_w - 10, cx - box_w // 2))
    y = max(10, min(h_img - box_h - 10, cy - box_h // 2))
    
    # 1. White filled background rectangle
    cv2.rectangle(img, (x, y), (x + box_w, y + box_h), (255, 255, 255), -1)
    # 2. 3px colored border
    cv2.rectangle(img, (x, y), (x + box_w, y + box_h), color_bgr, 3, cv2.LINE_AA)
    
    # 3. Crisp dark text inside pill
    text_x = x + pad_x
    text_y = y + box_h - pad_y - 2
    cv2.putText(img, text, (text_x, text_y), font, font_scale, (15, 15, 15), thickness, cv2.LINE_AA)
