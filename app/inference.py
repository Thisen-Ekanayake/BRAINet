import torch
from torchvision import transforms
from PIL import Image
from gradcam_pp import run_gradcam
import base64
import cv2

CLASS_NAMES = ["glioma", "meningioma", "notumor", "pituitary"]

def predict(model, device, image_path, target_layer):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])

    image = Image.open(image_path).convert("RGB")
    image = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        logits = model(image)
        probs = torch.softmax(logits, dim=1).cpu().numpy()[0]

    pred_index = probs.argmax()
    pred_class = CLASS_NAMES[pred_index]
    confidence = float(probs[pred_index])

    heatmap, bbox = run_gradcam(model, device, image_path, target_layer)

    _, heatmap_png = cv2.imencode('.png', heatmap)
    heatmap_b64 = base64.b64encode(heatmap_png).decode('utf-8')

    _, bbox_png = cv2.imencode('.png', bbox)
    bbox_b64 = base64.b64encode(bbox_png).decode('utf-8')

    # Read and encode original image
    original_img = cv2.imread(image_path)
    _, original_png = cv2.imencode('.png', original_img)
    original_b64 = base64.b64encode(original_png).decode('utf-8')

    return {
        "prediction": pred_class,
        "confidence": confidence,
        "all_probabilities": {
            CLASS_NAMES[i]: float(probs[i]) for i in range(len(CLASS_NAMES))
        },
        "visualizations": {
            "original": original_b64,
            "heatmap": heatmap_b64,
            "bounding_box": bbox_b64
        }
    }
