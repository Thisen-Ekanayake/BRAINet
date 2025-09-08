# Custom CNN Training Script

## Overview
Training pipeline for the custom CNN model with class imbalance handling and performance monitoring.

## Training Configuration

### Model Setup
- Initializes custom CNN architecture
- Transfers model to available device (GPU/CPU)

### Loss Function
- **Weighted CrossEntropyLoss**: Accounts for class imbalance
- Weights are inversely proportional to class frequencies
- Prevents bias toward majority classes

### Optimizer
- **Adam optimizer**: Learning rate 1e-4
- Adaptive learning rate with momentum
- Suitable for image classification tasks

## Training Loop

### Epoch Execution
1. **Training Phase**:
   - Model set to training mode
   - Forward pass, loss computation, backward pass
   - Parameter updates via optimizer
   - Loss tracking per epoch

2. **Validation Phase**:
   - Model set to evaluation mode
   - No gradient computation for efficiency
   - Accuracy computation on test set
   - Performance monitoring

### Metrics Tracking
- **Training Loss**: Average loss per epoch
- **Test Accuracy**: Classification accuracy on validation set
- Real-time progress reporting

## Model Persistence
- Saves best model weights to `multi_class_cnn.pth`
- Preserves trained parameters for inference

## Visualization
- Generates training curves (loss and accuracy)
- Saves plots as PNG for analysis
- Helps identify overfitting/underfitting