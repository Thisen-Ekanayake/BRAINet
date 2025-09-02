# SimpleCNN Model Documentation

This file defines a **simple Convolutional Neural Network (CNN)** for **binary classification** of MRI scans: Tumor vs No Tumor.

---

### **File:** `binary_cnn_model.py`

#### Dependencies
- PyTorch (`torch`, `torch.nn`)

---

#### Model Class
```
class SimpleCNN(nn.Module):
    def __init__(self):
        super(SimpleCNN, self).__init__()
```

- `SimpleCNN` inherits from `nn.Module`.
- Constructor initializes the feature extraction and classification layers.

#### Feature Extraction Layers
```
self.features = nn.Sequential(
    nn.Conv2d(3, 32, kernel_size=3, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(2),

    nn.Conv2d(32, 64, kernel_size=3, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(2),

    nn.Conv2d(64, 128, kernel_size=3, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(2),
)
```
- **Conv2d layers:**
    - First layer: input channels = 3 (RGB), output channels = 32, kernel = 3x3.
    - Second layer: 32 → 64 channels.
    - Third layer: 64 → 128 channels.
- **ReLU activations** for non-linearity.
- **MaxPooling2d (2x2)** reduces spatial dimensions by half after each block.

**Effect:** Extracts hierarchical features from the MRI images while downsampling spatial dimensions.

#### Classifier Layers
```
self.classifier = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(128*28*28, 256),
    nn.ReLU(),
    nn.Dropout(0.5),
    nn.Linear(256, 1)
)
```
- **Dropout(0.5):** Prevents overfitting.
- **Linear layer 128 x 28 x 28 → 256:** Flattens feature maps to feed into fully connected layer.
- **Linear layer 256 → 1:** Outputs a single value for binary classification.
    - Output is raw logits; apply `sigmoid()` during evaluation/training for probability.
>Note: The input images are assumed to be 224x224 pixels, so after 3 MaxPool2d layers (2x2 each), the feature map size is 28x28.

#### Forward Pass
```
def forward(self, x):
    x = self.features(x)
    x = x.view(x.size(0), -1)
    x = self.classifier(x)
    return x
```
- Passes input through feature extractor.
- Flattens output to a vector: `x.view(x.size(0), -1)`.
- Passes through classifier for final output.

### **Summary**

- **SimpleCNN** is a straightforward CNN for binary MRI classification.
- Includes:
    - 3 convolutional blocks with ReLU + MaxPooling.
    - Dropout + Fully connected layers for classification.
- Output: Single logit for binary output (Tumor / No Tumor).
- Designed for **224x224 RGB MRI scans**.