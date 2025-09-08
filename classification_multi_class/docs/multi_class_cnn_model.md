# Custom CNN Architecture

## Overview
Defines a custom Convolutional Neural Network for multi-class image classification with 4 classes.

## Network Architecture

### Feature Extraction Layers
1. **Conv2d (3→32)**: 3x3 kernel, padding=1, ReLU activation
2. **MaxPool2d**: 2x2 pooling (reduces spatial dimensions by half)
3. **Conv2d (32→64)**: 3x3 kernel, padding=1, ReLU activation  
4. **MaxPool2d**: 2x2 pooling
5. **Conv2d (64→128)**: 3x3 kernel, padding=1, ReLU activation
6. **MaxPool2d**: 2x2 pooling

### Classifier Layers
1. **Dropout (0.5)**: Regularization to prevent overfitting
2. **Linear (128*28*28 → 256)**: Fully connected layer with ReLU
3. **Dropout (0.5)**: Additional regularization
4. **Linear (256 → 4)**: Final classification layer

## Input/Output Specifications
- **Input**: 3-channel images (224×224 after preprocessing)
- **Output**: 4-class logits (before softmax)

## Design Considerations
- Progressive feature extraction with increasing channels
- Max pooling for spatial hierarchy and translation invariance
- Dropout for regularization against overfitting
- Suitable for moderate complexity classification tasks