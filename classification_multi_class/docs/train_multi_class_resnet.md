# ResNet-18 Transfer Learning Training

## Overview
Transfer learning implementation using pre-trained ResNet-18 for multi-class classification with fine-tuning strategy.

## Model Configuration

### Base Architecture
- **ResNet-18**: Pre-trained on ImageNet
- **Modified Final Layer**: 4-class output (original: 1000 classes)
- Transfer learning leverages pre-learned features

### Fine-Tuning Strategy
- **Frozen Layers**: Early convolutional layers (fixed feature extractor)
- **Trainable Layers**: 
  - Layer4 (deeper features)
  - Fully connected classifier
- Balanced approach: preserves general features while adapting to specific task

## Training Setup

### Loss Function
- **Weighted CrossEntropyLoss**: Handles class imbalance
- Weights applied to mitigate bias toward frequent classes

### Optimizer
- **Adam optimizer**: Learning rate 1e-4
- Only updates parameters of trainable layers
- Efficient fine-tuning with reduced parameter updates

## Training Process

### Epoch Execution
1. **Training Phase**:
   - Forward propagation through entire network
   - Loss computation with class weights
   - Backward pass (only through trainable layers)
   - Parameter updates for selected layers

2. **Validation Phase**:
   - Full model evaluation on test set
   - Accuracy computation
   - Performance benchmarking

### Additional Features
- **Timing**: Measures epoch duration for performance monitoring
- **Progress Reporting**: Detailed epoch statistics

## Model Persistence
- Saves fine-tuned model to `multi_class_resnet.pth`
- Retains both pre-trained features and task-specific adaptations

## Advantages of Transfer Learning
- Faster convergence (leverages pre-trained features)
- Better performance with limited data
- Reduced risk of overfitting
- State-of-the-art feature extraction capabilities