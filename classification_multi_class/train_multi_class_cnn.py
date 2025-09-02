import torch
import torch.nn as nn
import torch.optim as optim
import matplotlib.pyplot as plt
from multi_class_dataset_preprocessing import train_loader, test_loader, class_weights
from multi_class_cnn_model import MultiClassCNN

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# === model, loss, optimizer ===
model = MultiClassCNN(num_classes=4).to(device)
# Use weighted CrossEntropyLoss for class imbalance
criterion = nn.CrossEntropyLoss(weight=class_weights.to(device))
optimizer = optim.Adam(model.parameters(), lr=1e-4)

num_epochs = 10
train_losses, test_accuracies = [], []

for epoch in range(num_epochs):
    # === training ===
    model.train()
    running_loss = 0.0
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item()
    avg_loss = running_loss / len(train_loader)
    train_losses.append(avg_loss)

    # === validation ===
    model.eval()
    correct, total = 0, 0
    with torch.no_grad():
        for images, labels in test_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            _, preds = torch.max(outputs, 1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)
    acc = correct / total
    test_accuracies.append(acc)

    print(f"Epoch {epoch+1}/{num_epochs}, Loss: {avg_loss:.4f}, Test Accuracy: {acc*100:.2f}%")

# === save model ===
torch.save(model.state_dict(), "multi_class_cnn.pth")
print("Model saved as multi_class_cnn.pth")

# === plot training curves ===
plt.figure(figsize=(10, 5))
plt.subplot(1, 2, 1)
plt.plot(train_losses, label="Training Loss")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(test_accuracies, label="Test Accuracy")
plt.xlabel("Epoch")
plt.ylabel("Accuracy")
plt.legend()

plt.tight_layout()
plt.savefig("multi_class_training_curves.png")
plt.show()