## Overview
This script analyzes and displays the trainability status of layers in a pre-trained `ResNet18` model that has been fine-tuned for binary classification.

## Detailed Code Explanation

### 1. Import Statements
```
import torch
import torch.nn as nn
from torchvision import models
```

- `torch`: Main PyTorch library for deep learning
- `torch.nn`: Neural network module containing layers, loss functions, etc.
- `torchvision.models`: Pre-trained computer vision models like ResNet, VGG, etc.

### 2. Helper Function: print_trainable_layers()
```
def print_trainable_layers(model, grouped=True):
```
This function analyzes and prints which layers of the model are trainable (will be updated during training) and which are frozen (won't be updated).

**Parameters:**

- `model`: The neural network model to analyze
- `grouped`: If True, groups layers by high-level names; if False, shows detailed per-parameter info

**Grouped Analysis Section:**
```
if grouped:
    groups = {}
    for name, param in model.named_parameters():
        top_name = name.split(".")[0]  # Extract first part of parameter name
        if top_name not in groups:
            groups[top_name] = []
        groups[top_name].append(param.requires_grad)
```

- Creates a dictionary to group parameters by their top-level name (e.g., 'conv1', 'layer1')
- `named_parameters()` returns both parameter names and their values
- `param.requires_grad` indicates if the parameter will be updated during training

**Printing Grouped Results:**
```
for g, params in groups.items():
    status = "Trainable" if any(params) else "Frozen"
    print(f"{g:<10} : {status}")
```

- For each group, checks if any parameter is trainable
- Prints the group name and its trainability status

**Detailed Analysis Section:**
```
else:
    for name, param in model.named_parameters():
        status = "Trainable" if param.requires_grad else "Frozen"
        print(f"{name:<30} : {status}")
```

- Shows detailed information for every individual parameter
- Useful for debugging specific layer trainability

**Parameter Statistics:**
```
total_params = sum(p.numel() for p in model.parameters())
trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
```

- `numel()` returns the number of elements in a parameter tensor
- Calculates total parameters and trainable parameters
- Prints summary statistics showing the scale of the model

### 3. Model Loading and Setup
```
model = models.resnet18(pretrained=True)
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, 1)
```

- Loads pre-trained ResNet18 model with ImageNet weights
- `model.fc.in_features` gets the number of input features to the final fully connected layer
- Replaces the final layer with a new linear layer for binary classification (1 output neuron)

### 4. Load Trained Weights
```
model.load_state_dict(torch.load("resnet18_binary.pth", map_location="cpu"))
model.eval()
```

- Loads previously trained weights from file
- `map_location="cpu"` ensures weights are loaded to CPU (useful if training was on GPU)
- `model.eval()` sets the model to evaluation mode (affects dropout, batch normalization, etc.)

### 5. Freezing Layers
```
for param in model.parameters():
    param.requires_grad = False
```

- Freezes ALL parameters in the model by setting `requires_grad = False`
- This means no gradients will be computed for these parameters during training

### 6. Unfreezing Specific Layers
```
for param in model.fc.parameters():
    param.requires_grad = True
```

- Unfreezes only the parameters in the final fully connected (fc) layer
- Only these parameters will be updated during training

### 7. Trainability Check
```
print_trainable_layers(model, grouped=True)
print_trainable_layers(model, grouped=True)
# print_trainable_layers(model, grouped=False)  # Uncomment for detailed view
```

- Calls the helper function to display layer trainability
- Called twice (possibly for demonstration)
- Commented line shows how to get detailed per-parameter information

## Key Concepts for Beginners

### Transfer Learning
This script demonstrates transfer learning - using a pre-trained model and adapting it for a new task. We freeze most layers and only train the final layer.

### Parameter Freezing
Freezing parameters prevents them from being updated during training, which:

- Reduces computation time
- Prevents overfitting
- Preserves learned features from pre-training

### `requires_grad` Attribute
- `True`: Parameter will be updated during training (gradients computed)
- `False`: Parameter won't be updated (no gradients computed)

### Model Modes
- `model.train()`: Training mode (enables dropout, batch norm updates)
- `model.eval()`: Evaluation mode (disables dropout, uses running stats for batch norm)

### Usage
Run this script to verify which layers are trainable before starting training. This helps ensure your fine-tuning strategy is implemented correctly.