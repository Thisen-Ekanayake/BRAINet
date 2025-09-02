import torch
import torch.nn as nn
import torch.optim as optim
import matplotlib.pyplot as plt
from torchvision import models
from dataset_preprocessing import train_loader, test_loader
import time

# === device setup ===
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# === model setup ===
model = models.resnet18(pretrained=True)
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, 1)  # binary output
model = model.to(device)

# === freeze early layers (optional) ===
for param in model.parameters():
    param.requires_grad = False
for param in model.layer4.parameters():
    param.requires_grad = True
for param in model.fc.parameters():
    param.requires_grad = True

# === loss and optimizer ===
criterion = nn.BCEWithLogitsLoss()
optimizer = optim.Adam(
    list(model.layer4.parameters()) + list(model.fc.parameters()),
    lr=1e-4
)

# === training setup ===
num_epochs = 5
train_losses, test_accuracies = [], []

# === start total timer ===
total_start = time.time()

for epoch in range(num_epochs):
    epoch_start = time.time()  # per-epoch timer

    # --- training ---
    model.train()
    running_loss = 0.0
    for images, labels in train_loader:
        images, labels = images.to(device), labels.float().unsqueeze(1).to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item()
    avg_loss = running_loss / len(train_loader)
    train_losses.append(avg_loss)

    # --- validation ---
    model.eval()
    correct, total = 0, 0
    with torch.no_grad():
        for images, labels in test_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            preds = torch.sigmoid(outputs) > 0.5
            correct += (preds.squeeze() == labels).sum().item()
            total += labels.size(0)
    acc = correct / total
    test_accuracies.append(acc)

    epoch_end = time.time()
    print(f"Epoch {epoch+1}/{num_epochs}, Loss: {avg_loss:.4f}, "
          f"Test Accuracy: {acc*100:.2f}%, "
          f"Time: {epoch_end - epoch_start:.2f} sec")

# === total training time ===
total_end = time.time()
print(f"\nTotal training time: {total_end - total_start:.2f} seconds "
      f"({(total_end - total_start)/60:.2f} minutes)")

# === save model ===
torch.save(model.state_dict(), "resnet18_binary_layer4.pth")
print("Model saved as resnet18_binary_layer4.pth")

# === plot curves ===
plt.figure()
plt.plot(range(1, num_epochs+1), train_losses, label="Train Loss")
plt.plot(range(1, num_epochs+1), test_accuracies, label="Test Accuracy")
plt.xlabel("Epoch")
plt.ylabel("Value")
plt.title("ResNet18 Training Loss & Test Accuracy")
plt.legend()
plt.savefig("resnet_training_curve.png")
plt.show()
