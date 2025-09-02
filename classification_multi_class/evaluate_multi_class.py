import torch
import torch.nn as nn
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report
)
from multi_class_dataset_preprocessing import test_loader, train_dataset
from multi_class_cnn_model import MultiClassCNN
from torchvision import models

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Choose which model to evaluate (CNN or ResNet)
model_type = "resnet"  # Change to "cnn" if evaluating CNN model

if model_type == "cnn":
    model = MultiClassCNN(num_classes=4).to(device)
    model.load_state_dict(torch.load("multi_class_cnn.pth"))
else:
    model = models.resnet18(pretrained=False)
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, 4)
    model = model.to(device)
    model.load_state_dict(torch.load("multi_class_resnet.pth"))

model.eval()

# === evaluation ===
all_preds, all_labels = [], []
with torch.no_grad():
    for images, labels in test_loader:
        images, labels = images.to(device), labels.to(device)
        outputs = model(images)
        _, preds = torch.max(outputs, 1)
        all_preds.extend(preds.cpu().numpy())
        all_labels.extend(labels.cpu().numpy())

# === metrics ===
acc = accuracy_score(all_labels, all_preds)
prec = precision_score(all_labels, all_preds, average='weighted')
rec = recall_score(all_labels, all_preds, average='weighted')
f1 = f1_score(all_labels, all_preds, average='weighted')

print(f"Accuracy: {acc*100:.2f}%")
print(f"Precision: {prec*100:.2f}%")
print(f"Recall: {rec*100:.2f}%")
print(f"F1 Score: {f1*100:.2f}%")

# === classification report ===
class_names = train_dataset.classes
print("\nClassification Report:")
print(classification_report(all_labels, all_preds, target_names=class_names))

# === confusion matrix ===
cm = confusion_matrix(all_labels, all_preds)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", 
            xticklabels=class_names, 
            yticklabels=class_names)
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Multi-Class Confusion Matrix")
plt.tight_layout()
plt.savefig("multi_class_confusion_matrix.png")
plt.show()