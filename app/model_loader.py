"""import torch
import torch.nn as nn
from torchvision import models

def load_model():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model = models.resnet18(weights=None)
    
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, 1)

    model.load_state_dict(torch.load("classification_binary/resnet18_binary_layer4.pth", map_location=device))
    model.to(device)
    model.eval()

    return model, device
"""

import torch
import torch.nn as nn
from torchvision import models
from huggingface_hub import hf_hub_download

def load_model():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model_path = hf_hub_download(
        repo_id="ThisenEkanayake/brain-tumor-detection",
        filename="binary-classification/resnet18_binary.pth"
    )

    model = models.resnet18(weights=None)
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, 1)

    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device)
    model.eval()

    return model, device
