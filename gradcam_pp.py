import argparse
import os
import torch
import numpy as np
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# JET colormap (256 entries, RGB) - matches OpenCV COLORMAP_JET for server compatibility
_JET_CMAP = np.array([
    [0, 0, 131], [0, 0, 135], [0, 0, 139], [0, 0, 143], [0, 0, 147], [0, 0, 151],
    [0, 0, 155], [0, 0, 159], [0, 0, 163], [0, 0, 167], [0, 0, 171], [0, 0, 175],
    [0, 0, 179], [0, 0, 183], [0, 0, 187], [0, 0, 191], [0, 0, 195], [0, 0, 199],
    [0, 0, 203], [0, 0, 207], [0, 0, 211], [0, 0, 215], [0, 0, 219], [0, 0, 223],
    [0, 0, 227], [0, 0, 231], [0, 0, 235], [0, 0, 239], [0, 0, 243], [0, 0, 247],
    [0, 0, 251], [0, 0, 255], [0, 4, 255], [0, 8, 255], [0, 12, 255], [0, 16, 255],
    [0, 20, 255], [0, 24, 255], [0, 28, 255], [0, 32, 255], [0, 36, 255], [0, 40, 255],
    [0, 44, 255], [0, 48, 255], [0, 52, 255], [0, 56, 255], [0, 60, 255], [0, 64, 255],
    [0, 68, 255], [0, 72, 255], [0, 76, 255], [0, 80, 255], [0, 84, 255], [0, 88, 255],
    [0, 92, 255], [0, 96, 255], [0, 100, 255], [0, 104, 255], [0, 108, 255], [0, 112, 255],
    [0, 116, 255], [0, 120, 255], [0, 124, 255], [0, 128, 255], [0, 132, 255], [0, 136, 255],
    [0, 140, 255], [0, 144, 255], [0, 148, 255], [0, 152, 255], [0, 156, 255], [0, 160, 255],
    [0, 164, 255], [0, 168, 255], [0, 172, 255], [0, 176, 255], [0, 180, 255], [0, 184, 255],
    [0, 188, 255], [0, 192, 255], [0, 196, 255], [0, 200, 255], [0, 204, 255], [0, 208, 255],
    [0, 212, 255], [0, 216, 255], [0, 220, 255], [0, 224, 255], [0, 228, 255], [0, 232, 255],
    [0, 236, 255], [0, 240, 255], [0, 244, 255], [0, 248, 255], [0, 252, 255], [0, 255, 255],
    [0, 255, 251], [0, 255, 247], [0, 255, 243], [0, 255, 239], [0, 255, 235], [0, 255, 231],
    [0, 255, 227], [0, 255, 223], [0, 255, 219], [0, 255, 215], [0, 255, 211], [0, 255, 207],
    [0, 255, 203], [0, 255, 199], [0, 255, 195], [0, 255, 191], [0, 255, 187], [0, 255, 183],
    [0, 255, 179], [0, 255, 175], [0, 255, 171], [0, 255, 167], [0, 255, 163], [0, 255, 159],
    [0, 255, 155], [0, 255, 151], [0, 255, 147], [0, 255, 143], [0, 255, 139], [0, 255, 135],
    [0, 255, 131], [0, 255, 128], [0, 255, 124], [0, 255, 120], [0, 255, 116], [0, 255, 112],
    [0, 255, 108], [0, 255, 104], [0, 255, 100], [0, 255, 96], [0, 255, 92], [0, 255, 88],
    [0, 255, 84], [0, 255, 80], [0, 255, 76], [0, 255, 72], [0, 255, 68], [0, 255, 64],
    [0, 255, 60], [0, 255, 56], [0, 255, 52], [0, 255, 48], [0, 255, 44], [0, 255, 40],
    [0, 255, 36], [0, 255, 32], [0, 255, 28], [0, 255, 24], [0, 255, 20], [0, 255, 16],
    [0, 255, 12], [0, 255, 8], [0, 255, 4], [0, 255, 0], [4, 255, 0], [8, 255, 0],
    [12, 255, 0], [16, 255, 0], [20, 255, 0], [24, 255, 0], [28, 255, 0], [32, 255, 0],
    [36, 255, 0], [40, 255, 0], [44, 255, 0], [48, 255, 0], [52, 255, 0], [56, 255, 0],
    [60, 255, 0], [64, 255, 0], [68, 255, 0], [72, 255, 0], [76, 255, 0], [80, 255, 0],
    [84, 255, 0], [88, 255, 0], [92, 255, 0], [96, 255, 0], [100, 255, 0], [104, 255, 0],
    [108, 255, 0], [112, 255, 0], [116, 255, 0], [120, 255, 0], [124, 255, 0], [128, 255, 0],
    [132, 255, 0], [136, 255, 0], [140, 255, 0], [144, 255, 0], [148, 255, 0], [152, 255, 0],
    [156, 255, 0], [160, 255, 0], [164, 255, 0], [168, 255, 0], [172, 255, 0], [176, 255, 0],
    [180, 255, 0], [184, 255, 0], [188, 255, 0], [192, 255, 0], [196, 255, 0], [200, 255, 0],
    [204, 255, 0], [208, 255, 0], [212, 255, 0], [216, 255, 0], [220, 255, 0], [224, 255, 0],
    [228, 255, 0], [232, 255, 0], [236, 255, 0], [240, 255, 0], [244, 255, 0], [248, 255, 0],
    [252, 255, 0], [255, 255, 0], [255, 252, 0], [255, 248, 0], [255, 244, 0], [255, 240, 0],
    [255, 236, 0], [255, 232, 0], [255, 228, 0], [255, 224, 0], [255, 220, 0], [255, 216, 0],
    [255, 212, 0], [255, 208, 0], [255, 204, 0], [255, 200, 0], [255, 196, 0], [255, 192, 0],
    [255, 188, 0], [255, 184, 0], [255, 180, 0], [255, 176, 0], [255, 172, 0], [255, 168, 0],
    [255, 164, 0], [255, 160, 0], [255, 156, 0], [255, 152, 0], [255, 148, 0], [255, 144, 0],
    [255, 140, 0], [255, 136, 0], [255, 132, 0], [255, 128, 0], [255, 124, 0], [255, 120, 0],
    [255, 116, 0], [255, 112, 0], [255, 108, 0], [255, 104, 0], [255, 100, 0], [255, 96, 0],
    [255, 92, 0], [255, 88, 0], [255, 84, 0], [255, 80, 0], [255, 76, 0], [255, 72, 0],
    [255, 68, 0], [255, 64, 0], [255, 60, 0], [255, 56, 0], [255, 52, 0], [255, 48, 0],
    [255, 44, 0], [255, 40, 0], [255, 36, 0], [255, 32, 0], [255, 28, 0], [255, 24, 0],
    [255, 20, 0], [255, 16, 0], [255, 12, 0], [255, 8, 0], [255, 4, 0], [255, 0, 0],
    [252, 0, 0], [248, 0, 0], [244, 0, 0], [240, 0, 0], [236, 0, 0], [232, 0, 0],
    [228, 0, 0], [224, 0, 0], [220, 0, 0], [216, 0, 0], [212, 0, 0], [208, 0, 0],
    [204, 0, 0], [200, 0, 0], [196, 0, 0], [192, 0, 0], [188, 0, 0], [184, 0, 0],
    [180, 0, 0], [176, 0, 0], [172, 0, 0], [168, 0, 0], [164, 0, 0], [160, 0, 0],
    [156, 0, 0], [152, 0, 0], [148, 0, 0], [144, 0, 0], [140, 0, 0], [136, 0, 0],
    [132, 0, 0], [128, 0, 0], [124, 0, 0], [120, 0, 0], [116, 0, 0], [112, 0, 0],
    [108, 0, 0], [104, 0, 0], [100, 0, 0], [96, 0, 0], [92, 0, 0], [88, 0, 0],
    [84, 0, 0], [80, 0, 0], [76, 0, 0], [72, 0, 0], [68, 0, 0], [64, 0, 0],
    [60, 0, 0], [56, 0, 0], [52, 0, 0], [48, 0, 0], [44, 0, 0], [40, 0, 0],
    [36, 0, 0], [32, 0, 0], [28, 0, 0], [24, 0, 0], [20, 0, 0], [16, 0, 0],
    [12, 0, 0], [8, 0, 0], [4, 0, 0], [0, 0, 0]
], dtype=np.uint8)


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
#                     IMAGE PROCESSING HELPERS (PIL/numpy, no cv2)
# ================================================================
def _resize_cam(cam, out_h, out_w):
    """Resize 2D cam to (out_h, out_w) using PIL."""
    cam_uint8 = (np.clip(cam, 0, 1) * 255).astype(np.uint8)
    pil = Image.fromarray(cam_uint8).resize((out_w, out_h), Image.BILINEAR)
    return np.array(pil, dtype=np.float32) / 255.0


def _apply_jet_colormap(gray_uint8):
    """Apply JET colormap: (H,W) uint8 -> (H,W,3) RGB uint8."""
    return _JET_CMAP[np.clip(gray_uint8, 0, 255)]


def overlay_heatmap(img, cam):
    # img: (H,W,3) RGB numpy uint8
    out_h, out_w = img.shape[0], img.shape[1]
    cam = _resize_cam(cam, out_h, out_w)
    heatmap = _apply_jet_colormap((cam * 255).astype(np.uint8))
    blended = np.clip(img.astype(np.float32) * 0.6 + heatmap.astype(np.float32) * 0.4, 0, 255).astype(np.uint8)
    return blended


def draw_bounding_box(img, cam, threshold=0.5):
    out_h, out_w = img.shape[0], img.shape[1]
    cam = _resize_cam(cam, out_h, out_w)
    mask = cam > threshold
    rows, cols = np.where(mask)
    if rows.size == 0:
        return img.copy()
    y_min, y_max = int(rows.min()), int(rows.max())
    x_min, x_max = int(cols.min()), int(cols.max())
    boxed = img.copy()
    green = np.array([0, 255, 0], dtype=boxed.dtype)
    thick = 2
    boxed[y_min : y_min + thick, x_min : x_max + 1] = green
    boxed[y_max - thick + 1 : y_max + 1, x_min : x_max + 1] = green
    boxed[y_min : y_max + 1, x_min : x_min + thick] = green
    boxed[y_min : y_max + 1, x_max - thick + 1 : x_max + 1] = green
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

            img_pil = Image.open(input_path).convert("RGB")
            img = np.array(img_pil)

            input_tensor = transform(img_pil).unsqueeze(0).to(device)

            # generate CAM
            cam, class_idx = grad_cam_pp.generate(input_tensor)

            heatmap = overlay_heatmap(img, cam)
            bbox = draw_bounding_box(img, cam)

            basename = os.path.splitext(file)[0]
            heatmap_path = os.path.join(output_subfolder, f"{basename}_heatmap.png")
            bbox_path = os.path.join(output_subfolder, f"{basename}_bbox.png")

            Image.fromarray(heatmap).save(heatmap_path)
            Image.fromarray(bbox).save(bbox_path)

    print("\nDONE! All outputs saved to:", args.output_dir)

def run_gradcam(model, device, image_path, target_layer):
    # load image (PIL/numpy, no cv2)
    img_pil = Image.open(image_path).convert("RGB")
    img = np.array(img_pil)

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    input_tensor = transform(img_pil).unsqueeze(0).to(device)

    grad_cam_pp = GradCAMPP(model, target_layer)
    cam, class_idx = grad_cam_pp.generate(input_tensor)

    heatmap = overlay_heatmap(img, cam)
    bbox = draw_bounding_box(img, cam)

    return heatmap, bbox


if __name__ == "__main__":
    main()
