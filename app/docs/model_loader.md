Loads a binary classification ResNet-18 model and prepares it for inference.

## Steps inside the function

- **Select device**
    - Use GPU if available, otherwise CPU.

- **Initialize model**
    - Create a ResNet-18 with no pretrained weights.

- **Modify final layer**
    - Get number of features from the original fully connected layer.
    - Replace the final FC layer with a new `nn.Linear` that outputs 1 value (binary classifier).

- **Load trained weights**

    - Load weights from `resnet18_binary_layer4.pth` into the model.
    - Map tensors to the selected device.

- **Prepare model for inference**

    - Move model to device.
    - Set model to evaluation mode (`eval()`).

- **Return**
    - The loaded model.
    - The selected device.