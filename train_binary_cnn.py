import torch
import torch.nn as nn
import torch.optim as optim
from dataset_preprocessing import train_loader, test_loader
from binary_cnn_model import SimpleCNN

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# === model, loss, optimizer ===
model =  SimpleCNN().to(device)
criterion = nn.BCEWithLogitsLoss()
optimizer = optim.Adam(model.parameters(), lr=1e-4)

num_epochs = 5

for epoch in range(num_epochs):
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
    print(f"Epoch {epoch+1}/{num_epochs}, Loss: {running_loss/len(train_loader):.4f}")

# === save model ===
torch.save(model.state_dict(), "binary_cnn.pth")
print("Model saved as binary_cnn.pth")