# Binary CNN Evaluation Script Documentation

This script evaluates a trained **Binary CNN** on a test set of MRI scans, computing accuracy, precision, recall, F1 score, and plotting a confusion matrix.

---

### **File:** `evaluate_binary_cnn.py`

#### Dependencies
- PyTorch (`torch`)
- Matplotlib (`matplotlib.pyplot`)
- Seaborn (`seaborn`)
- Scikit-learn metrics (`accuracy_score`, `precision_score`, `recall_score`, `f1_score`, `confusion_matrix`)
- Custom modules:
  - `dataset_preprocessing.py` → Provides `test_loader`
  - `binary_cnn_model.py` → Defines `SimpleCNN` model

---

#### Device Setup
```
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
```
- Uses GPU if available, otherwise CPU.

#### Load Trained Model
```
model = SimpleCNN().to(device)
model.load_state_dict(torch.load("binary_cnn_v2.pth"))
model.eval()
```
- Loads saved model weights for evaluation.
- Switches model to evaluation mode.

#### Predictions & Metrics
```
all_preds, all_labels = [], []
with torch.no_grad():
    for images, labels in test_loader:
        ...
```

- Iterates over test data.
- Applies sigmoid and threshold >0.5 for binary prediction.
- Computes:
    - Accuracy: Correct predictions / total
    - Precision: True Positives / (True Positives + False Positives)
    - Recall: True Positives / (True Positives + False Negatives)
    - F1 Score: Harmonic mean of precision & recall

#### Confusion Matrix
```
cm = confusion_matrix(all_labels, all_preds)
plt.figure(figsize=(5,4))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
            xticklabels=["No Tumor", "Tumor"],
            yticklabels=["No Tumor", "Tumor"])
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.savefig("confusion_matrix.png")
plt.show()
```
- Visualizes how many samples were correctly/incorrectly classified.
- Saves as `confusion_matrix.png`.

### **Summary**

- Evaluates a trained binary CNN model on MRI scans.
- Provides a full metrics breakdown and visualization of performance.
- Helps in detecting model weaknesses or class imbalance issues.