import os
import cv2
import numpy as np
from onnxruntime.quantization import (
    quantize_static,
    CalibrationDataReader,
    QuantType,
    CalibrationMethod
)

# =========================
# CONFIG
# =========================
FP32_MODEL = "tumor_resnet.onnx"
INT8_MODEL = "tumor_resnet_int8.onnx"

CALIB_DIR = "Dataset_multi_class/Training"  # uses real training images
IMG_SIZE = 224

MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD  = np.array([0.229, 0.224, 0.225], dtype=np.float32)

# =========================
# PREPROCESS (matches test_transforms)
# =========================
def preprocess(img_path):
    img = cv2.imread(img_path)
    if img is None:
        return None

    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img = img.astype(np.float32) / 255.0
    img = (img - MEAN) / STD
    img = np.transpose(img, (2, 0, 1))  # CHW
    img = np.expand_dims(img, axis=0)   # NCHW
    return img


# =========================
# CALIBRATION DATA READER
# =========================
class TumorCalibrationReader(CalibrationDataReader):
    def __init__(self, image_root):
        self.image_paths = []
        for root, _, files in os.walk(image_root):
            for f in files:
                if f.lower().endswith((".png", ".jpg", ".jpeg")):
                    self.image_paths.append(os.path.join(root, f))

        self.index = 0

    def get_next(self):
        if self.index >= len(self.image_paths):
            return None

        img = preprocess(self.image_paths[self.index])
        self.index += 1

        if img is None:
            return self.get_next()

        return {"input": img}


# =========================
# RUN QUANTIZATION
# =========================
if __name__ == "__main__":
    print("Starting INT8 quantization...")

    dr = TumorCalibrationReader(CALIB_DIR)

    quantize_static(
        model_input=FP32_MODEL,
        model_output=INT8_MODEL,
        calibration_data_reader=dr,
        activation_type=QuantType.QUInt8,
        weight_type=QuantType.QInt8,
        calibrate_method=CalibrationMethod.MinMax
    )

    print(f"INT8 model saved as: {INT8_MODEL}")

"""
import onnxruntime as ort

sess = ort.InferenceSession(
    "tumor_resnet_int8.onnx",
    providers=["CPUExecutionProvider"]
)

print("INT8 model loaded successfully")
"""