import torch
import torch.nn as nn
from torchvision import models



# === define helper ===
def print_trainable_layers(model, grouped=True):
    print("\n=== Layer Trainability ===")
    if grouped:
        # group by high-level layer names (conv1, layer1, layer2, fc, etc.)
        groups = {}
        for name, param in model.named_parameters():
            top_name = name.split(".")[0]  # take first part like 'conv1', 'layer1', etc.
            if top_name not in groups:
                groups[top_name] = []
            groups[top_name].append(param.requires_grad)

        for g, params in groups.items():
            status = "Trainable" if any(params) else "Frozen"
            print(f"{g:<10} : {status}")
    else:
        # detailed per-parameter printout
        for name, param in model.named_parameters():
            status = "Trainable" if param.requires_grad else "Frozen"
            print(f"{name:<30} : {status}")

    # parameter stats
    total_params = sum(p.numel() for p in model.parameters())
    trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
    print(f"\nTotal parameters: {total_params:,}")
    print(f"Trainable parameters: {trainable_params:,}")
    print(f"Frozen parameters: {total_params - trainable_params:,}")
    print("==========================\n")


# === load model architecture ===
model = models.resnet18(pretrained=True)
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, 1)  # binary classifier (same as training)

# === load your trained weights ===
model.load_state_dict(torch.load("resnet18_binary.pth", map_location="cpu"))
model.eval()

# === freeze all layers ===
for param in model.parameters():
    param.requires_grad = False

# === unfreeze only fc ===
for param in model.fc.parameters():
    param.requires_grad = True

# === now check trainability ===
print_trainable_layers(model, grouped=True)

# === visualize ===
print_trainable_layers(model, grouped=True)   # high-level overview
# print_trainable_layers(model, grouped=False)  # detailed layer-by-layer
