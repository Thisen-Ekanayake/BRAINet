import argparse
import os
import cv2
import torch
import numpy as np
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# ================================================================
#                     GRAD-CAM++ CLASS
# ================================================================
class GradCAMPP:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.gradients = []
        self.activations = []

        target_layer.register_forward_hook(self.save_activation)
        target_layer.register_full_backward_hook(self.save_gradient)

    def save_activation(self, module, input, output):
        self.activations.append(output)

    def save_gradient(self, module, grad_input, grad_output):
        self.gradients.append(grad_output[0])

    def generate(self, input_tensor, class_idx=None):
        self.model.eval()
        self.gradients = []
        self.activations = []

        output = self.model(input_tensor)

        if class_idx is None:
            class_idx = output.argmax(dim=1).item()

        self.model.zero_grad()
        output[0, class_idx].backward()

        grad = self.gradients[0].squeeze(0)
        act = self.activations[0].squeeze(0)

        numerator = grad.pow(2)
        denominator = 2 * grad.pow(2) + (act * grad.pow(3)).sum((1, 2), keepdim=True)
        alpha = numerator / (denominator + 1e-7)

        weights = (alpha * F.relu(grad)).sum(dim=(1, 2))
        cam = torch.zeros(act.shape[1:], dtype=torch.float32)

        for i, w in enumerate(weights):
            cam += w * act[i]

        cam = F.relu(cam)
        cam = cam - cam.min()
        cam = cam / (cam.max() + 1e-7)

        cam = cam.detach().cpu().numpy()

        return cam, class_idx


# ================================================================
#                     IMAGE PROCESSING HELPERS
# ================================================================
def overlay_heatmap(img, cam):
    cam = cv2.resize(cam, (img.shape[1], img.shape[0]))
    heatmap = (cam * 255).astype(np.uint8)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    blended = cv2.addWeighted(img, 0.6, heatmap, 0.4, 0)
    return blended


def draw_bounding_box(img, cam, threshold=0.5):
    cam = cv2.resize(cam, (img.shape[1], img.shape[0]))
    mask = (cam > threshold).astype("uint8") * 255

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return img

    biggest = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(biggest)

    boxed = img.copy()
    cv2.rectangle(boxed, (x, y), (x + w, y + h), (0, 255, 0), 2)
    return boxed


# ================================================================
#                     MAIN FUNCTION
# ================================================================
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input_dir", type=str, required=True, help="Path to dataset folder")
    parser.add_argument("--output_dir", type=str, required=True, help="Folder to save heatmaps/bboxes")
    args = parser.parse_args()

    # ------------------- Load model -------------------
    print("\nLoading model ...")
    model = models.resnet18(weights=None)
    num_ftrs = model.fc.in_features
    model.fc = torch.nn.Linear(num_ftrs, 4)

    model.load_state_dict(torch.load("classification_multi_class/multi_class_resnet.pth", map_location=device))
    model = model.to(device)
    model.eval()

    target_layer = model.layer4[-1].conv2
    grad_cam_pp = GradCAMPP(model, target_layer)

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    # ------------------- Process directory -------------------
    for root, dirs, files in os.walk(args.input_dir):
        for file in files:
            if not file.lower().endswith((".png", ".jpg", ".jpeg")):
                continue

            input_path = os.path.join(root, file)

            # preserve subfolder structure
            relative = os.path.relpath(root, args.input_dir)
            output_subfolder = os.path.join(args.output_dir, relative)
            os.makedirs(output_subfolder, exist_ok=True)

            print(f"Processing {input_path} ...")

            img = cv2.imread(input_path)
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img_pil = Image.fromarray(img_rgb)

            input_tensor = transform(img_pil).unsqueeze(0).to(device)

            # generate CAM
            cam, class_idx = grad_cam_pp.generate(input_tensor)

            heatmap = overlay_heatmap(img, cam)
            bbox = draw_bounding_box(img, cam)

            basename = os.path.splitext(file)[0]
            heatmap_path = os.path.join(output_subfolder, f"{basename}_heatmap.png")
            bbox_path = os.path.join(output_subfolder, f"{basename}_bbox.png")

            cv2.imwrite(heatmap_path, heatmap)
            cv2.imwrite(bbox_path, bbox)

    print("\nDONE! All outputs saved to:", args.output_dir)


if __name__ == "__main__":
    main()
