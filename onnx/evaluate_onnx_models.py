import os
import cv2
import numpy as np
import onnxruntime as ort
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report
)

# =========================
# CONFIG
# =========================
TEST_DIR = "Dataset_multi_class/Testing"
IMG_SIZE = 224

MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD  = np.array([0.229, 0.224, 0.225], dtype=np.float32)

MODELS = {
    "ONNX_FP32": "tumor_resnet.onnx",
    "ONNX_INT8": "tumor_resnet_int8.onnx"
}

# class order MUST match ImageFolder.classes
CLASS_NAMES = sorted(os.listdir(TEST_DIR))

# =========================
# PREPROCESS (test pipeline)
# =========================
def preprocess(img_path):
    img = cv2.imread(img_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img = img.astype(np.float32) / 255.0
    img = (img - MEAN) / STD
    img = np.transpose(img, (2, 0, 1))
    return np.expand_dims(img, axis=0)


# =========================
# LOAD TEST DATA
# =========================
def load_test_set():
    images, labels = [], []
    for idx, cls in enumerate(CLASS_NAMES):
        cls_dir = os.path.join(TEST_DIR, cls)
        for f in os.listdir(cls_dir):
            if f.lower().endswith((".png", ".jpg", ".jpeg")):
                images.append(os.path.join(cls_dir, f))
                labels.append(idx)
    return images, np.array(labels)


# =========================
# EVALUATION
# =========================
def evaluate(model_path):
    sess = ort.InferenceSession(model_path, providers=["CPUExecutionProvider"])
    input_name = sess.get_inputs()[0].name

    images, labels = load_test_set()
    preds = []

    for img_path in images:
        x = preprocess(img_path)
        logits = sess.run(None, {input_name: x})[0]
        preds.append(np.argmax(logits, axis=1)[0])

    return labels, np.array(preds)


if __name__ == "__main__":
    for name, model_path in MODELS.items():
        print(f"\n===== Evaluating {name} =====")

        y_true, y_pred = evaluate(model_path)

        acc  = accuracy_score(y_true, y_pred)
        prec = precision_score(y_true, y_pred, average="weighted")
        rec  = recall_score(y_true, y_pred, average="weighted")
        f1   = f1_score(y_true, y_pred, average="weighted")

        print(f"Accuracy : {acc*100:.2f}%")
        print(f"Precision: {prec*100:.2f}%")
        print(f"Recall   : {rec*100:.2f}%")
        print(f"F1 Score : {f1*100:.2f}%")

        print("\nClassification Report:")
        print(classification_report(y_true, y_pred, target_names=CLASS_NAMES))