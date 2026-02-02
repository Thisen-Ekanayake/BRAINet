import onnx
from onnxconverter_common import float16

FP32_MODEL = "onnx/tumor_resnet.onnx"
FP16_MODEL = "onnx/tumor_resnet_fp16.onnx"

model = onnx.load(FP32_MODEL)

# Convert model weights (and compatible ops) to FP16
model_fp16 = float16.convert_float_to_float16(model, keep_io_types=True)

onnx.save(model_fp16, FP16_MODEL)
print(f"Saved FP16 model: {FP16_MODEL}")