import os
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

# === directories ===
train_dir = 'Dataset_binary/Training'
test_dir = 'Dataset_binary/Testing'

# === transformation ===
train_transforms = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(10),
    transforms.ToTensor(),
    transforms.Normalize([0.5], [0.5])
])

test_transforms = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize([0.5], [0.5])
])

# === datasets ===
train_dataset = datasets.ImageFolder(root=train_dir, transform=train_transforms)
test_dataset = datasets.ImageFolder(root=test_dir, transform=test_transforms)

# === data loaders ===
train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=16, shuffle=False)

# === quick check ===
print(f"Number of training samples: {len(train_dataset)}")
print(f"Number of testing samples: {len(test_dataset)}")
print(f"Classes: {train_dataset.classes}")

# === example of iterating through a batch ===
for images, labels in train_loader:
    print(f"Batch image shape: {images.shape}")
    print(f"Batch labels: {labels}")
    break