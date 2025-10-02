import torch
import torch.nn as nn
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from binary_cnn_model import SimpleCNN
from dataset_preprocessing import test_loader

device = torch.device("cpu")  # Dynamic quantization works only on CPU

# === File paths ===
original_model_path = "binary_cnn_v2.pth"
quantized_model_path = "binary_cnn_quantized_dynamic.pth"

# === Function to evaluate model ===
def evaluate_model(model, loader):
    model.eval()
    all_labels = []
    all_preds = []
    with torch.no_grad():
        for images, labels in loader:
            images = images.to(device)
            labels = labels.to(device)
            outputs = model(images)

            preds = torch.sigmoid(outputs) > 0.5
            all_labels.extend(labels.cpu().numpy())
            all_preds.extend(preds.cpu().numpy())

    acc = accuracy_score(all_labels, all_preds)
    prec = precision_score(all_labels, all_preds)
    rec = recall_score(all_labels, all_preds)
    f1 = f1_score(all_labels, all_preds)
    return acc, prec, rec, f1

# === Load original model ===
original_model = SimpleCNN()
original_model.load_state_dict(torch.load(original_model_path, map_location=device))
original_model.to(device)

# === Evaluate original model ===
acc_orig, prec_orig, rec_orig, f1_orig = evaluate_model(original_model, test_loader)

# === Dynamic Quantization on Linear layers ===
quantized_model = torch.quantization.quantize_dynamic(
    original_model, {nn.Linear}, dtype=torch.qint8
)

# Save quantized model
torch.save(quantized_model.state_dict(), quantized_model_path)
print(f"Dynamic quantized model saved as {quantized_model_path}")

# === Evaluate quantized model ===
acc_quant, prec_quant, rec_quant, f1_quant = evaluate_model(quantized_model, test_loader)

# === Print comparison ===
print("\n=== Model Comparison ===")
print(f"{'Metric':<10} {'Original':<10} {'Quantized':<10}")
print(f"{'Accuracy':<10} {acc_orig:.4f}     {acc_quant:.4f}")
print(f"{'Precision':<10} {prec_orig:.4f}     {prec_quant:.4f}")
print(f"{'Recall':<10} {rec_orig:.4f}     {rec_quant:.4f}")
print(f"{'F1-Score':<10} {f1_orig:.4f}     {f1_quant:.4f}")
