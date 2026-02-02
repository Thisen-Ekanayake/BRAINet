# Quantization Analysis – Brain Tumor ResNet Model
## Context

A ResNet18-based multi-class brain tumor classification model was trained using MRI images with ImageNet-style preprocessing (RGB, 224×224, mean/std normalization). The model achieved high accuracy in FP32 and was exported to ONNX for edge deployment.

The objective was to reduce model size and inference cost via quantization while preserving diagnostic accuracy.

---

## Step 1: FP32 ONNX Export Validation

- The trained PyTorch model was exported to ONNX (`tumor_resnet.onnx`).
- FP32 ONNX inference was evaluated on the test dataset.
- Results matched PyTorch closely:

**FP32 ONNX Performance**

- Accuracy ≈ 99.1%
- Precision / Recall / F1 ≈ 99%
- Class-wise performance preserved

>Conclusion: **ONNX export was correct and numerically stable.**

---

## Step 2: Full INT8 Quantization (Weights + Activations)

- Static post-training INT8 quantization was applied using ONNX Runtime.
- Calibration used real training images with test-time preprocessing.
- Resulting model: `tumor_resnet_int8.onnx`

**INT8 Evaluation Results**

- Accuracy dropped to ~59.6%
- Severe class-specific failures observed:
    - Glioma recall ≈ 0.03
    - “No tumor” recall ≈ 1.00
- Model strongly biased toward predicting the majority / easy class

>Conclusion: **Full INT8 quantization caused catastrophic accuracy degradation.**

---

## Root Cause Analysis

The failure is **expected** given the model and domain:

### Medical imaging (MRI)
- Low contrast, subtle spatial features
- Small activation dynamic ranges

### Frozen early ResNet layers

- Early layers were pretrained and not adapted for quantization noise
- Activations are fragile under INT8 clipping

### ReLU-heavy CNN architecture

- Activation quantization causes irreversible information loss

### Class-weighted loss

- Produces asymmetric logits that are highly sensitive to quantization

Overall, **INT8 activation quantization destroyed discriminative tumor features**, while weights alone were not the main issue.

---

## Key Insight

>**Full INT8 (weights + activations) is unsafe for this medical CNN.**

This is not a tooling error or calibration issue, but a **fundamental limitation of aggressive quantization for medical vision models.**

---

<details>
<summary>Click to expand</summary>
Results

===== Evaluating ONNX_FP32 =====
Accuracy : 99.08%
Precision: 99.09%
Recall   : 99.08%
F1 Score : 99.08%

Classification Report:
              precision    recall  f1-score   support

      glioma       0.99      0.98      0.98       300
  meningioma       0.98      0.99      0.99       306
     notumor       1.00      1.00      1.00       405
   pituitary       0.99      0.99      0.99       300

    accuracy                           0.99      1311
   macro avg       0.99      0.99      0.99      1311
weighted avg       0.99      0.99      0.99      1311


===== Evaluating ONNX_INT8 =====
Accuracy : 59.65%
Precision: 70.90%
Recall   : 59.65%
F1 Score : 52.56%

Classification Report:
              precision    recall  f1-score   support

      glioma       0.82      0.03      0.06       300
  meningioma       0.62      0.74      0.67       306
     notumor       0.51      1.00      0.68       405
   pituitary       0.95      0.48      0.64       300

    accuracy                           0.60      1311
   macro avg       0.73      0.56      0.51      1311
weighted avg       0.71      0.60      0.53      1311


**Code files used for this evaluation is in `initial_quantization` directory**
</details>