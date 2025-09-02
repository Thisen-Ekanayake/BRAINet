# Binary CNN Training Script Documentation

This script trains a simple Convolutional Neural Network (CNN) to classify MRI scans as **Tumor** or **No Tumor**.

---

### **File:** `train_binary_cnn.py`

#### Dependencies
- PyTorch (`torch`, `torch.nn`, `torch.optim`)
- Matplotlib (`matplotlib.pyplot`)
- Custom modules:
  - `dataset_preprocessing.py` → Provides `train_loader` and `test_loader`
  - `binary_cnn_model.py` → Defines `SimpleCNN` model

---

#### Device Setup
```
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
```
- Uses GPU if available, otherwise CPU.

#### Model, Loss, Optimizer
```
model = SimpleCNN().to(device)
criterion = nn.BCEWithLogitsLoss()
optimizer = optim.Adam(model.parameters(), lr=1e-4)
```
- `SimpleCNN` → custom CNN for binary classification.
- `BCEWithLogitsLoss` → suitable for binary classification with logits.
- `Adam` optimizer with learning rate `1e-4`.

#### Training Loop
```
num_epochs = 5
train_losses, test_accuracies = [], []
for epoch in range(num_epochs):
    # Training
    ...
    # Validation
    ...
```

- Loops over epochs, trains the model on `train_loader`.
- Computes average training loss per epoch.
- Evaluates accuracy on test set after each epoch.
- Tracks `train_losses` and `test_accuracies` for plotting.

#### Model Saving

```
torch.save(model.state_dict(), "binary_cnn_v2.pth")
```

- Saves the trained model weights.

#### Plot Training Curves

```
plt.figure()
plt.plot(range(1, num_epochs+1), train_losses, label="Train Loss")
plt.plot(range(1, num_epochs+1), test_accuracies, label="Test Accuracy")
plt.xlabel("Epoch")
plt.ylabel("Value")
plt.title("Training Loss & Test Accuracy")
plt.legend()
plt.savefig("training_curve.png")
plt.show()
```

- Visualizes training loss vs test accuracy across epochs.
- Saves figure as `training_curve.png`.

### **Summary**

- The script provides a complete training pipeline for a binary CNN on MRI datasets.
- Tracks performance metrics and visualizes progress to detect overfitting or underfitting.