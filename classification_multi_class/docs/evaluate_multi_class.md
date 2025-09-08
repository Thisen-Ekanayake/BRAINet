# Model Evaluation Script

## Overview
This script evaluates trained multi-class classification models (either custom CNN or ResNet-18) on the test dataset, computes performance metrics, and visualizes results.

## Key Components

### 1. Model Loading
- Supports two model types: custom CNN or pre-trained ResNet-18
- Loads pre-trained weights from saved model files
- Sets model to evaluation mode

### 2. Evaluation Process
- Iterates through test dataloader
- Computes predictions using argmax on model outputs
- Collects all predictions and ground truth labels

### 3. Performance Metrics
- **Accuracy**: Overall correctness of predictions
- **Precision**: Weighted precision across all classes
- **Recall**: Weighted recall across all classes  
- **F1 Score**: Harmonic mean of precision and recall
- **Classification Report**: Detailed per-class metrics
- **Confusion Matrix**: Visual representation of prediction vs actual

### 4. Visualization
- Generates heatmap of confusion matrix using seaborn
- Saves visualization as PNG file
- Displays comprehensive performance metrics

## Usage
Set `model_type` to either "cnn" or "ResNet" to evaluate the corresponding model.