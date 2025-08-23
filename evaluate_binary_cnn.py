import torch
from dataset_preprocessing import test_loader
from binary_cnn_model import SimpleCNN

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# === load model ===
model = SimpleCNN().to(device)
model.load_state_dict(torch.load("binary_cnn.pth"))
model.eval()

# === evaluation ===
correct, total = 0, 0
with torch.no_grad():
    for images, lables in test_loader:
        images, lables = images.to(device), lables.to(device)
        outputs = model(images)
        preds = torch.sigmoid(outputs) > 0.5
        correct += (preds.squeeze() == lables).sum().item()
        total += lables.size(0)

print(f"Test Accuracy: {correct/total*100:.2f}%")