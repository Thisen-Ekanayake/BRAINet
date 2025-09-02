# Brain Tumor Dataset Preprocessing

This document explains the purpose and workings of the `dataset_preprocessing.py` script, which prepares the Kaggle Brain Tumor dataset for training and testing a deep learning model using PyTorch.

---

## **Project Structure**

brain-tumor-detection-&-mri-scan-analysis/
│
├── Dataset/
│ ├── training/
│ │ ├── glioma/
│ │ ├── meningioma/
│ │ ├── pituitary/
│ │ └── no_tumor/
│ └── testing/
│ ├── glioma/
│ ├── meningioma/
│ ├── pituitary/
│ └── no_tumor/
│
├── dataset_preprocessing.py
│
└── requirements.txt


---

## **Script Overview**

The `dataset_preprocessing.py` script performs the following:

1. **Load Dataset**:  
   Uses `torchvision.datasets.ImageFolder` to load images from `training` and `testing` folders. Each subfolder represents a class, which PyTorch automatically maps to numeric labels.

2. **Apply Transformations**:
   - **Training images**:
     - Resize to 224x224 pixels
     - Random horizontal flip (50% chance)
     - Random rotation (±10 degrees)
     - Convert to PyTorch tensor
     - Normalize to [-1, 1] range
   - **Testing images**:
     - Resize to 224x224
     - Convert to tensor
     - Normalize to [-1, 1]

3. **Create DataLoaders**:
   - Wraps the datasets in `DataLoader` objects for **batch training and evaluation**.
   - Batch size is set to 16.
   - Training DataLoader shuffles images; testing DataLoader does not.

4. **Quick Verification**:
   - Prints the number of training/testing samples.
   - Prints the class names.
   - Demonstrates how a batch of images and labels looks.

---

## **Example Output**

- Number of training samples: 5712
- Number of testing samples: 1311
- Classes: ['glioma', 'meningioma', 'notumor', 'pituitary']
- Batch image shape: torch.Size([16, 3, 224, 224])
- Batch labels: tensor([1, 1, 3, 3, 1, 3, 0, 1, 3, 1, 0, 2, 3, 2, 3, 0])


### **Explanation**
- **Training samples:** Total images in the training set.
- **Testing samples:** Total images in the testing set.
- **Classes:** Categories in the dataset; mapped to numbers `[0, 1, 2, 3]`.
  - `0` → glioma  
  - `1` → meningioma  
  - `2` → no_tumor  
  - `3` → pituitary  
- **Batch image shape:** `[batch_size, channels, height, width]`  
  - `16` images per batch  
  - `3` color channels (RGB)  
  - `224 x 224` image size
- **Batch labels:** Numeric labels corresponding to each image in the batch.

---

## **How to Use**

1. Install dependencies:

```
pip install -r requirements.txt
```

2. Run the preprocessing script:
```
python dataset_preprocessing.py
```
3. Output:

- Loads and augments training images.
- Loads testing images for evaluation.
- Prints summary info and a sample batch for verification.