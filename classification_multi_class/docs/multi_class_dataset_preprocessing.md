# Data Preprocessing Pipeline

## Overview
Handles dataset loading, transformation, and preparation for multi-class image classification with class imbalance handling.

## Directory Structure
- **Training Data**: `../Dataset_multi_class/Training/`
- **Testing Data**: `../Dataset_multi_class/Testing/`
- Assumes class-subfolder organization (standard ImageFolder structure)

## Data Transformations

### Training Transformations
1. **Resize**: 224×224 pixels
2. **Random Horizontal Flip**: 50% probability for data augmentation
3. **Random Rotation**: ±10 degrees for robustness
4. **Color Jitter**: Brightness and contrast variation (0.2 factor)
5. **ToTensor**: Convert PIL image to tensor
6. **Normalization**: ImageNet mean/std normalization

### Testing Transformations
1. **Resize**: 224×224 pixels  
2. **ToTensor**: Convert to tensor format
3. **Normalization**: Same as training for consistency

## Class Imbalance Handling

### Weighted Sampling
- **Class Weights**: Inverse frequency weighting (1/class_count)
- **WeightedRandomSampler**: Ensures balanced batch sampling during training
- Prevents model bias toward majority classes

### Implementation Details
- Automatically calculates class counts from directory structure
- Generates sample weights for each training example
- Creates sampler for balanced mini-batch training

## Data Loaders
- **Training**: Weighted sampler with batch size 16
- **Testing**: Standard sequential loading, batch size 16
- Proper separation of training and testing data