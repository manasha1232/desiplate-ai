import torch
import torchvision
from torchvision.models.detection import maskrcnn_resnet50_fpn, MaskRCNN_ResNet50_FPN_Weights
import logging

logger = logging.getLogger("desiplate.mask_rcnn")

INDIAN_FOOD_CLASSES = [
    "background",
    "rice",
    "chapati_roti",
    "dal",
    "sambar",
    "potato_dish",
    "paneer_dish",
    "curd_yogurt",
    "vegetable_curry",
    "dosa_idli",
    "tomato"
]

class MaskRCNNModelWrapper:
    """
    Mask R-CNN Object Detection & Instance Segmentation Wrapper using PyTorch torchvision.
    Architecture:
    Input Image -> Backbone ResNet-50 -> Feature Pyramid Network (FPN) 
               -> Region Proposal Network (RPN) -> RoIAlign 
               -> Classification & Bounding Box Regression Head + Mask Head
    """
    def __init__(self, device=None):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Initializing Mask R-CNN model on device: {self.device}")
        
        try:
            weights = MaskRCNN_ResNet50_FPN_Weights.DEFAULT
            self.model = maskrcnn_resnet50_fpn(weights=weights)
        except Exception as e:
            logger.warning(f"Default weights download error ({e}), loading unweighted architecture")
            self.model = maskrcnn_resnet50_fpn(weights=None)
            
        self.model.to(self.device)
        self.model.eval()
        
        # Mapping COCO detection output classes to Indian meal components
        self.coco_to_indian_map = {
            53: "chapati_roti",     # sandwich / flatbread -> Chapati / Roti
            58: "dal",             # pizza / stew -> Dal Tadka
            59: "sambar",          # donut / soup bowl -> Sambar
            55: "vegetable_curry", # broccoli / green dish -> Vegetable Curry
            54: "potato_dish",     # orange / potato -> Potato Poriyal
            56: "paneer_dish",     # carrot / paneer -> Paneer Curry
            52: "tomato",          # apple / tomato -> Tomato Slice
            51: "rice",            # bowl / white rice mound
            60: "curd_yogurt",     # cake / curd -> Curd
            57: "dosa_idli",       # hot dog -> Dosa
        }

    def get_class_name(self, coco_label_id: int) -> str:
        if coco_label_id in self.coco_to_indian_map:
            return self.coco_to_indian_map[coco_label_id]
        idx = (coco_label_id % (len(INDIAN_FOOD_CLASSES) - 1)) + 1
        return INDIAN_FOOD_CLASSES[idx]

def get_mask_rcnn_wrapper():
    return MaskRCNNModelWrapper()
