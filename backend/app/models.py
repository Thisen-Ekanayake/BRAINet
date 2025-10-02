import torch
from torchvision import transforms
from PIL import Image
import numpy as np

# Load model
MODEL_PATH = "classification_multi_class/multi_class_resnet.pth"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

checkpoint = torch.load(MODEL_PATH, map_location=device)
model = checkpoint['model']
model.load_state_dict(checkpoint['model_state_dict'])
model.eval()
model.to(device)

classes = checkpoint.get('classes', ['No Tumor', 'Glioma', 'Meningioma', 'Pituitary'])

# Preprocessing function
def preprocess_image(image: Image.Image):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.5], [0.5])
    ])
    return transform(image).unsqueeze(0).to(device)

# Inference function
def predict(image: Image.Image):
    tensor = preprocess_image(image)
    with torch.no_grad():
        outputs = model(tensor)
        probs = torch.softmax(outputs, dim=1).cpu().numpy()[0]
        predicted_idx = np.argmax(probs)
        return {
            "tumor_type": classes[predicted_idx],
            "confidence": float(probs[predicted_idx])
        }
