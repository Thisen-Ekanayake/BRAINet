import torch
import torch.nn as nn
from torchvision import models
from huggingface_hub import hf_hub_download

def load_model():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    """model_path = hf_hub_download(
        repo_id="ThisenEkanayake/brain-tumor-detection",
        filename="multiclass-classification/multi_class_resnet.pth"
    )"""

    model_path = "classification_multi_class/multi_class_resnet.pth"

    model = models.resnet18(weights=None)
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, 4)      # 4 classes

    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device)
    model.eval()

    return model, device
