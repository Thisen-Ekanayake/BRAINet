import torch
import torch.nn as nn
import torch.optim as optim
import matplotlib.pyplot as plt
from dataset_preprocessing import train_loader, test_loader
from binary_cnn_model import SimpleCNN

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# === model, loss, optimizer ===
model =  SimpleCNN().to(device)
criterion = nn.BCEWithLogitsLoss()
optimizer = optim.Adam(model.parameters(), lr=1e-4)

num_epochs = 5
train_losses, test_accuracies = [], []

for epoch in range(num_epochs):
    # === training ===
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

    # === validation (on test set after each epoch) ===
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

    print(f"Epoch {epoch+1}/{num_epochs}, Loss: {running_loss/len(train_loader):.4f}, Test Accuracy: {acc*100:.2f}%")

# === save model ===
torch.save(model.state_dict(), "binary_cnn_v2.pth")
print("Model saved as binary_cnn_v2.pth")

# === plot loss vs accuracy ===
plt.figure()
plt.plot(range(1, num_epochs+1), train_losses, label="Train Loss")
plt.plot(range(1, num_epochs+1), test_accuracies, label="Test Accuracy")
plt.xlabel("Epoch")
plt.ylabel("Value")
plt.title("Training Loss& Test Accuracy")
plt.legend()
plt.savefig("training_curve.png")
plt.show()