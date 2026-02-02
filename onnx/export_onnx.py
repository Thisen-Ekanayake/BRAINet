import torch
import torchvision.models as models
import torch.onnx
import numpy as np
import onnx
import onnxruntime as ort

# ----------------------------
# 1) Load your trained model
# ----------------------------

# Change this if you used a custom ResNet definition
model = models.resnet18(weights=None)

# Replace final linear layer with 4 classes
in_features = model.fc.in_features
model.fc = torch.nn.Linear(in_features, 4)

# Load your saved weights
checkpoint = torch.load("classification_multi_class/multi_class_resnet.pth", map_location="cpu")
model.load_state_dict(checkpoint)

model.eval()  # important for export

print("Model loaded and set to eval.")

# --------------------------------
# 2) Export to ONNX
# --------------------------------

onnx_path = "tumor_resnet.onnx"

# Fixed dummy input matching training
dummy_input = torch.randn(1, 3, 224, 224)

torch.onnx.export(
    model,
    dummy_input,
    onnx_path,
    input_names=["input"],
    output_names=["logits"],
    opset_version=18,
    do_constant_folding=True,
    dynamic_axes={"input": {0: "batch"}, "logits": {0: "batch"}}
)

print(f"Export completed: {onnx_path}")

# --------------------------------
# 3) Sanity check: load and run ONNX
# --------------------------------

onnx_model = onnx.load(onnx_path)
onnx.checker.check_model(onnx_model)
print("ONNX model structure verified.")

# Run ONNX Runtime for the same dummy
ort_sess = ort.InferenceSession(onnx_path, providers=["CPUExecutionProvider"])

# PyTorch prediction
with torch.no_grad():
    pt_output = model(dummy_input).numpy()

# ONNX Runtime prediction
onnx_input = {"input": dummy_input.numpy()}
ort_output = ort_sess.run(["logits"], onnx_input)[0]

# Compare
diff = np.max(np.abs(pt_output - ort_output))
print(f"Max absolute difference between PyTorch and ONNX: {diff:.6f}")

if diff < 1e-4:
    print("✔ ONNX output matches PyTorch (within tolerance).")
else:
    print("⚠ Outputs differ. Check preprocessing or opset version.")
