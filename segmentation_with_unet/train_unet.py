import torch
import torch.optim as optim
from torch.utils.tensorboard import SummaryWriter
from unet_model import UNet
from segmentation_dataset_preprocessing import train_loader, val_loader
from loss_functions import DiceBCELoss, dice_coefficient
import matplotlib.pyplot as plt
import numpy as np

# Initialize model, loss, optimizer
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = UNet(n_channels=3, n_classes=1).to(device)
criterion = DiceBCELoss()
optimizer = optim.Adam(model.parameters(), lr=1e-4)

# Tensorboard writer
writer = SummaryWriter('runs/unet_experiment')

# Training loop
num_epochs = 50
best_dice = 0

train_losses = []
val_dice_scores = []

for epoch in range(num_epochs):
    # Training phase
    model.train()
    running_loss = 0.0
    
    for images, masks in train_loader:
        images = images.to(device)
        masks = masks.to(device)
        
        # Forward pass
        outputs = model(images)
        loss = criterion(outputs, masks)
        
        # Backward and optimize
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item()
    
    # Validation phase
    model.eval()
    val_dice = 0.0
    with torch.no_grad():
        for images, masks in val_loader:
            images = images.to(device)
            masks = masks.to(device)
            
            outputs = model(images)
            val_dice += dice_coefficient(outputs, masks).item()
    
    # Calculate metrics
    epoch_loss = running_loss / len(train_loader)
    epoch_dice = val_dice / len(val_loader)
    
    train_losses.append(epoch_loss)
    val_dice_scores.append(epoch_dice)
    
    # Save best model
    if epoch_dice > best_dice:
        best_dice = epoch_dice
        torch.save(model.state_dict(), 'best_unet_model.pth')
    
    # Log to tensorboard
    writer.add_scalar('Loss/train', epoch_loss, epoch)
    writer.add_scalar('Dice/val', epoch_dice, epoch)
    
    print(f'Epoch [{epoch+1}/{num_epochs}], Loss: {epoch_loss:.4f}, Dice: {epoch_dice:.4f}')

# Plot training curves
plt.figure(figsize=(10, 5))
plt.subplot(1, 2, 1)
plt.plot(train_losses, label='Training Loss')
plt.title('Training Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')

plt.subplot(1, 2, 2)
plt.plot(val_dice_scores, label='Validation Dice')
plt.title('Validation Dice Score')
plt.xlabel('Epoch')
plt.ylabel('Dice Coefficient')

plt.tight_layout()
plt.savefig('unet_training_curves.png')
plt.show()

writer.close()