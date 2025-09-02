import torch
import os
from torchvision import datasets, transforms
from torch.utils.data import DataLoader, WeightedRandomSampler
import numpy as np

# === directories ===
train_dir = 'Dataset_multi/Training'
test_dir = 'Dataset_multi/Testing'

# === transformation ===
train_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(10),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

test_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# === datasets ===
train_dataset = datasets.ImageFolder(root=train_dir, transform=train_transforms)
test_dataset = datasets.ImageFolder(root=test_dir, transform=test_transforms)

# === calculate class weights for imbalanced data ===
class_counts = []
for root, dirs, files in os.walk(train_dir):
    if not dirs:  # leaf directory
        class_counts.append(len(files))

class_weights = 1. / torch.tensor(class_counts, dtype=torch.float)
print(f"Class counts: {class_counts}")
print(f"Class weights: {class_weights}")

# === create weighted sampler ===
sample_weights = [0] * len(train_dataset)
for idx, (data, label) in enumerate(train_dataset):
    sample_weights[idx] = class_weights[label]

sampler = WeightedRandomSampler(sample_weights, num_samples=len(sample_weights), replacement=True)

# === data loaders ===
train_loader = DataLoader(train_dataset, batch_size=16, sampler=sampler)
test_loader = DataLoader(test_dataset, batch_size=16, shuffle=False)

# === quick check ===
print(f"Number of training samples: {len(train_dataset)}")
print(f"Number of testing samples: {len(test_dataset)}")
print(f"Classes: {train_dataset.classes}")