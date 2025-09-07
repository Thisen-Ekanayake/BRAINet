import torch
import numpy as np
import matplotlib.pyplot as plt
from unet_model import UNet
from segmentation_dataset_preprocessing import val_loader
from loss_functions import dice_coefficient
import torch.nn.functional as F

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load model
model = UNet(n_channels=3, n_classes=1).to(device)
model.load_state_dict(torch.load('best_unet_model.pth'))
model.eval()

# Evaluate on validation set
dice_scores = []
with torch.no_grad():
    for images, masks in val_loader:
        images = images.to(device)
        masks = masks.to(device)
        
        outputs = model(images)
        dice = dice_coefficient(outputs, masks)
        dice_scores.append(dice.item())

print(f'Average Dice Coefficient: {np.mean(dice_scores):.4f}')

# Visualize some predictions
def visualize_predictions(num_samples=5):
    fig, axes = plt.subplots(num_samples, 3, figsize=(12, 4*num_samples))
    
    for i in range(num_samples):
        # Get a random sample
        idx = np.random.randint(0, len(val_loader.dataset))
        image, mask = val_loader.dataset[idx]
        
        # Add batch dimension and predict
        image_tensor = image.unsqueeze(0).to(device)
        with torch.no_grad():
            output = model(image_tensor)
            prediction = torch.sigmoid(output)
            prediction = (prediction > 0.5).float()
        
        # Convert to numpy for plotting
        image = image.permute(1, 2, 0).cpu().numpy()
        mask = mask.squeeze().cpu().numpy()
        prediction = prediction.squeeze().cpu().numpy()
        
        # Plot
        axes[i, 0].imshow(image)
        axes[i, 0].set_title('Input Image')
        axes[i, 0].axis('off')
        
        axes[i, 1].imshow(mask, cmap='gray')
        axes[i, 1].set_title('Ground Truth')
        axes[i, 1].axis('off')
        
        axes[i, 2].imshow(prediction, cmap='gray')
        axes[i, 2].set_title('Prediction')
        axes[i, 2].axis('off')
    
    plt.tight_layout()
    plt.savefig('unet_predictions.png')
    plt.show()

visualize_predictions()