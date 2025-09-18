import torch
from classification_binary.binary_cnn_model import SimpleCNN  # Replace with your actual model class import

# ===== CONFIG =====
MODEL_PATH = "binary_cnn_v2.pth"  # path to your .pth file
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ===== LOAD MODEL =====
model = SimpleCNN().to(DEVICE)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model.eval()

# ===== TOTAL & TRAINABLE PARAMETERS =====
total_params = sum(p.numel() for p in model.parameters())
trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)

print(f"Total parameters: {total_params:,}")
print(f"Trainable parameters: {trainable_params:,}\n")

# ===== LAYER-WISE PARAMETERS =====
print("Layer-wise parameter counts:")
for name, param in model.named_parameters():
    print(f"{name:40s}: {param.numel():,} {'(trainable)' if param.requires_grad else '(frozen)'}")
