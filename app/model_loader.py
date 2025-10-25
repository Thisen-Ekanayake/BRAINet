import torch
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
