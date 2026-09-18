# DesiPlate AI: Mask R-CNN Based Preparation-Aware Indian Meal Analysis

**DesiPlate AI** is an advanced Computer Vision web application for analyzing Indian meal photographs using **Mask R-CNN** for object detection and instance segmentation. Beyond basic food identification, the system isolates pixel-level instance masks to quantify visual surface characteristics (visible oiliness, browning, moisture/gravy) and infers likely cooking preparation methods (e.g., pan-fried vs boiled vs gravy curry) to provide preparation-aware approximate nutritional estimations.

---

## 🔬 Core Algorithm: Pure Mask R-CNN Architecture

This system uses **Mask R-CNN** (`torchvision.models.detection.maskrcnn_resnet50_fpn`) as its **primary and only** object detection and instance segmentation algorithm.

```
Input Image 
    ↓
Backbone ResNet-50 CNN 
    ↓
Feature Pyramid Network (FPN) 
    ↓
Region Proposal Network (RPN) 
    ↓
RoI Align Processing 
    ↓
├── Classification Branch (Food Class Name)
├── Bounding Box Regression Branch (Coordinates [x1, y1, x2, y2])
└── Mask Branch (Binary Pixel Instance Segmentation Mask)
```

> [!IMPORTANT]
> **Strict Algorithm Policy**: No YOLO, SAM, or alternative object detectors are used anywhere in this project. All pixel feature extraction operates strictly on binary instance masks produced by Mask R-CNN.

---

## 🛠 Project Structure

```
desiplate-ai/
├── backend/
│   ├── main.py                    # FastAPI server endpoints & static routes
│   ├── database.py                # SQLite database session configuration
│   ├── models_db.py               # SQLAlchemy ORM models (MealHistory, DetectedItem)
│   ├── schemas.py                 # Pydantic request & response schemas
│   ├── models/
│   │   └── mask_rcnn_loader.py    # PyTorch torchvision Mask R-CNN wrapper
│   ├── inference/
│   │   ├── detector.py            # Meal detector & segmentation pipeline
│   │   ├── features.py            # Color, browning, oiliness, moisture visual extraction
│   │   ├── preparation.py         # Probabilistic preparation inference engine
│   │   ├── segmentation.py        # Instance mask overlay & PNG exporter
│   │   └── nutrition.py           # Indian food nutrient reference database
│   └── evaluation/
│       ├── evaluate.py            # Evaluation suite (mAP@50, mAP@50:95, Mask IoU, FPS)
│       ├── metrics.py             # Precision, recall, dice score, confusion matrix
│       └── visualization.py       # Plot generators for evaluation results
├── frontend/
│   ├── src/
│   │   ├── components/            # Header, Footer, FoodCard, PrepCard, NutritionChart
│   │   ├── pages/                 # Home, Upload, Processing, Results, History, Evaluation
│   │   ├── services/api.js        # Axios API client
│   │   ├── App.jsx
│   │   └── index.css              # Tailwind CSS styles
│   ├── package.json
│   └── vite.config.js
├── data/
│   ├── sample_meals/              # 1-click test sample meal images
│   └── test_set/                  # Ground truth test dataset
└── outputs/
    ├── masks/                     # Exported instance PNG masks
    ├── predictions/               # Composite Mask R-CNN visual overlays
    └── evaluation/                # Confusion matrix & summary metric plots
```

---

## 🚀 Quick Start & Local Running Instructions

### 1. Backend Server Setup (FastAPI)

```bash
cd backend
C:\Users\manas\Python311\python.exe main.py
```
The FastAPI backend server runs on `http://localhost:8000`. API docs are available at `http://localhost:8000/docs`.

### 2. Frontend Application Setup (React + Vite)

```bash
cd frontend
C:\Users\manas\nodejs\npm.cmd install
C:\Users\manas\nodejs\npm.cmd run dev
```
The React frontend dashboard opens on `http://localhost:5173`.

---

## 📊 Evaluation Metrics & Error Analysis

Run the Mask R-CNN evaluation suite:
```bash
C:\Users\manas\Python311\python.exe backend/evaluation/evaluate.py
```
Calculates:
- Bounding Box Precision, Recall, F1-Score
- Detection mAP@50 & mAP@50:95
- Instance Segmentation Mask IoU & Dice Score
- Inference Latency (ms) & FPS
- Confusion Matrix Heatmap (`outputs/evaluation/confusion_matrix.png`)

---

## ⚠️ Scientific Limitations

1. **Single RGB View**: A single 2D photograph provides visual surface indications and approximate volume estimations.
2. **Oiliness Quantification**: Visible surface oiliness measures specular highlights and surface glossiness. It does not measure exact grams of cooked oil.
3. **Probabilistic Preparation**: Cooking methods are inferred from visual surface patterns (browning, glossiness, gravy texture).
4. **Confidence vs Accuracy**: "Detection Confidence" represents model classification certainty, not verified ground truth accuracy.
