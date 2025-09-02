## Overview
This script trains a ResNet18 model for binary classification using transfer learning, specifically fine-tuning the last layer and layer4 while freezing earlier layers.

## Detailed Code Explanation

### 1. Imports
```
import torch
import torch.nn as nn
import torch.optim as optim
import matplotlib.pyplot as plt
from torchvision import models
from dataset_preprocessing import train_loader, test_loader
import time
```

- **torch.optim:** Optimization algorithms (Adam, SGD, etc.)
- **time:** For measuring training duration
- **dataset_preprocessing:** Custom module with data loaders

### 2. Device Setup
```
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
```

### 3. Model Initialization
```
model = models.resnet18(pretrained=True)
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, 1)
model = model.to(device)
```

- Loads ResNet18 with ImageNet pre-trained weights
- Replaces final layer for binary classification
- Moves model to appropriate device

### 4. Layer Freezing Strategy
```
for param in model.parameters():
    param.requires_grad = False
for param in model.layer4.parameters():
    param.requires_grad = True
for param in model.fc.parameters():
    param.requires_grad = True
```

- **Freezes all parameters** initially
- **Unfreezes layer4** (the last residual block)
- **Unfreezes fc** (the final classification layer)
- This is a common transfer learning approach

### 5. Loss Function and Optimizer
```
criterion = nn.BCEWithLogitsLoss()
optimizer = optim.Adam(
    list(model.layer4.parameters()) + list(model.fc.parameters()),
    lr=1e-4
)
```

- **BCEWithLogitsLoss:** Binary Cross Entropy loss with built-in sigmoid
- **Adam optimizer:** Only optimizes unfrozen parameters (layer4 + fc)
- **Learning rate 1e-4:** Small LR for fine-tuning pre-trained models

### 6. Training Setup
```
num_epochs = 5
train_losses, test_accuracies = [], []
total_start = time.time()
```

- **5 epochs:** Limited training for fine-tuning
- Tracks loss and accuracy over time
- Starts timer for total training duration

### 7. Training Loop
```
for epoch in range(num_epochs):
    epoch_start = time.time()
    model.train()
    running_loss = 0.0
```

- Loops through specified number of epochs
- Starts epoch timer
- Sets model to training mode

### 8. Training Phase
```
for images, labels in train_loader:
    images, labels = images.to(device), labels.float().unsqueeze(1).to(device)
    optimizer.zero_grad()
    outputs = model(images)
    loss = criterion(outputs, labels)
    loss.backward()
    optimizer.step()
    running_loss += loss.item()
```

**Data preparation:** Moves data to device, converts labels to float and adds dimension
**zero_grad():** Clears previous gradients
**Forward pass:** Computes predictions
**Loss calculation:** Compares predictions with true labels
**Backward pass:** Computes gradients
**Optimizer step:** Updates parameters
**Loss tracking:** Accumulates batch losses

### 9. Validation Phase
```
model.eval()
correct, total = 0, 0
with torch.no_grad():
    for images, labels in test_loader:
        images, labels = images.to(device), labels.to(device)
        outputs = model(images)
        preds = torch.sigmoid(outputs) > 0.5
        correct += (preds.squeeze() == labels).sum().item()
        total += labels.size(0)
```

- `model.eval()`: Sets model to evaluation mode
- `torch.no_grad()`: Disables gradient computation
- Computes predictions on test data
- Counts correct predictions for accuracy calculation

### 10. Progress Reporting
```
epoch_end = time.time()
print(f"Epoch {epoch+1}/{num_epochs}, Loss: {avg_loss:.4f}, "
      f"Test Accuracy: {acc*100:.2f}%, "
      f"Time: {epoch_end - epoch_start:.2f} sec")
```

- Shows epoch progress, loss, accuracy, and time taken
- Helps monitor training progress

### 11. Final Reporting and Saving
```
total_end = time.time()
print(f"\nTotal training time: {total_end - total_start:.2f} seconds "
      f"({(total_end - total_start)/60:.2f} minutes)")

torch.save(model.state_dict(), "resnet18_binary_layer4.pth")
```

- Reports total training time
- Saves trained model weights to file

### 12. Training Curves Visualization
```
plt.plot(range(1, num_epochs+1), train_losses, label="Train Loss")
plt.plot(range(1, num_epochs+1), test_accuracies, label="Test Accuracy")
```

- Plots loss and accuracy over epochs
- Helps visualize training progress and detect overfitting

## Key Concepts for Beginners

### Transfer Learning Strategy

- Freeze early layers: Preserves general feature extraction capabilities
- Fine-tune later layers: Adapts specific features for the new task
- Small learning rate: Prevents overwriting useful pre-trained weights

### Training Process

**1. Forward pass:** Compute predictions
**2. Loss calculation:** Measure prediction error
**3. Backward pass:** Compute gradients
**4. Parameter update:** Adjust weights using optimizer

### Batch Processing

- Data is processed in batches (not all at once)
- Reduces memory requirements
- Provides noisy gradient estimates that help generalization

### Model Saving

- `state_dict()` contains only learned parameters (not architecture)
- Much smaller file size than saving entire model
- Model architecture must be recreated when loading

### Usage
Run this script to fine-tune a pre-trained ResNet18 model for your specific binary classification task. Adjust epochs, learning rate, and frozen layers based on your dataset size and similarity to ImageNet.