import torch
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from dataset_preprocessing import test_loader
from binary_cnn_model import SimpleCNN

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# === load model ===
model = SimpleCNN().to(device)
model.load_state_dict(torch.load("binary_cnn_v2.pth"))
model.eval()

# === evaluation ===
all_preds, all_lables = [], []
with torch.no_grad():
    for images, lables in test_loader:
        images, lables = images.to(device), lables.to(device)
        outputs = model(images)
        preds = (torch.sigmoid(outputs) > 0.5).int()
        all_preds.extend(preds.cpu().numpy())
        all_lables.extend(lables.cpu().numpy())

# === metrics ===
acc = accuracy_score(all_lables, all_preds)
prec = precision_score(all_lables, all_preds)
rec = recall_score(all_lables, all_preds)
f1 = f1_score(all_lables, all_preds)

print(f"Accuracy: {acc*100:.2f}%")
print(f"Precision: {prec*100:.2f}%")
print(f"Recall: {rec*100:.2f}%")
print(f"F1 Score: {f1*100:.2f}%")

# === confusion matrix ===
cm = confusion_matrix(all_lables, all_preds)
plt.figure(figsize=(5,4))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=["No Tumor", "Tumor"], yticklabels=["No Tumor", "Tumor"])
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.savefig("confusion_matrix.png")
plt.show()