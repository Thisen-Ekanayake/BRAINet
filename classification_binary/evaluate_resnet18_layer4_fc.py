import torch
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, roc_curve, auc
)
from dataset_preprocessing import test_loader
from torchvision import models
import numpy as np

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# === load model ===
model = models.resnet18(pretrained=False)
num_ftrs = model.fc.in_features
model.fc = torch.nn.Linear(num_ftrs, 1)
model = model.to(device)
model.load_state_dict(torch.load("resnet18_binary_layer4.pth"))
model.eval()

# === evaluation ===
all_preds, all_labels, all_probs = [], [], []

with torch.no_grad():
    for images, labels in test_loader:
        images, labels = images.to(device), labels.to(device)
        outputs = model(images)
        probs = torch.sigmoid(outputs).squeeze()
        preds = (probs > 0.5).int()

        all_probs.extend(probs.cpu().numpy())
        all_preds.extend(preds.cpu().numpy())
        all_labels.extend(labels.cpu().numpy())

all_labels = np.array(all_labels)
all_preds = np.array(all_preds)
all_probs = np.array(all_probs)

# === metrics ===
acc = accuracy_score(all_labels, all_preds)
prec = precision_score(all_labels, all_preds)
rec = recall_score(all_labels, all_preds)
f1 = f1_score(all_labels, all_preds)
print(f"Accuracy: {acc*100:.2f}%")
print(f"Precision: {prec*100:.2f}%")
print(f"Recall: {rec*100:.2f}%")
print(f"F1 Score: {f1*100:.2f}%")

# === per-class accuracy ===
classes = ['No Tumor', 'Tumor']
for i, cls in enumerate(classes):
    idx = all_labels == i
    cls_acc = accuracy_score(all_labels[idx], all_preds[idx])
    print(f"{cls} Accuracy: {cls_acc*100:.2f}%")

# === confusion matrix (%) ===
cm = confusion_matrix(all_labels, all_preds)
cm_percent = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis] * 100
plt.figure(figsize=(6,5))
sns.heatmap(cm_percent, annot=True, fmt=".2f", cmap="Blues",
            xticklabels=classes, yticklabels=classes)
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("ResNet18 Confusion Matrix (%)")
plt.savefig("resnet18_eval_confusion_matrix_percent.png")
plt.show()

# === ROC curve & AUC ===
fpr, tpr, thresholds = roc_curve(all_labels, all_probs)
roc_auc = auc(fpr, tpr)
plt.figure(figsize=(6,5))
plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (AUC = {roc_auc:.4f})')
plt.plot([0,1], [0,1], color='navy', lw=2, linestyle='--')
plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.title("ResNet18 ROC Curve")
plt.legend(loc="lower right")
plt.savefig("resnet18_eval_roc_curve.png")
plt.show()

# === probability histogram for each class ===
plt.figure(figsize=(6,5))
sns.histplot(all_probs[all_labels==0], color='blue', label='No Tumor', kde=True, stat="density", bins=30)
sns.histplot(all_probs[all_labels==1], color='red', label='Tumor', kde=True, stat="density", bins=30)
plt.xlabel("Predicted Probability")
plt.ylabel("Density")
plt.title("ResNet18 Predicted Probability Distribution")
plt.legend()
plt.savefig("resnet18_eval_prob_histogram.png")
plt.show()
