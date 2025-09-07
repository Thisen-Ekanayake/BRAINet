import os
import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image
import numpy as np

class SegmentationDataset(Dataset):
    def __init__(self, image_dir, mask_dir, transform=None):
        self.image_dir = image_dir
        self.mask_dir = mask_dir
        self.transform = transform
        self.images = os.listdir(image_dir)
        
    def __len__(self):
        return len(self.images)
    
    def __getitem__(self, index):
        img_path = os.path.join(self.image_dir, self.images[index])
        mask_path = os.path.join(self.mask_dir, self.images[index].replace('.jpg', '_mask.jpg'))
        
        image = Image.open(img_path).convert("RGB")
        mask = Image.open(mask_path).convert("L")  # Grayscale for binary mask
        
        if self.transform is not None:
            image = self.transform(image)
            mask = self.transform(mask)
            
        # Convert mask to binary (0, 1)
        mask = (mask > 0.5).float()
        
        return image, mask

# Define transformations
train_transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.ToTensor(),
])

val_transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
])

# Create datasets and dataloaders
train_dataset = SegmentationDataset(
    image_dir='../Dataset_segmentation/Train/Images',
    mask_dir='../Dataset_segmentation/Train/Masks',
    transform=train_transform
)

val_dataset = SegmentationDataset(
    image_dir='../Dataset_segmentation/Val/Images',
    mask_dir='../Dataset_segmentation/Val/Masks',
    transform=val_transform
)

train_loader = DataLoader(train_dataset, batch_size=8, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=8, shuffle=False)