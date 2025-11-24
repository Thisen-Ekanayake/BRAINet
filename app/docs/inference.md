**predict(model, device, image_path)**

Runs inference on a single image using a binary classifier (brain tumor detection).

## Steps inside the function

- **Define preprocessing pipeline**

    - Resize image to 224×224
    - Convert to Tensor
    - Normalize using mean = 0.5 and std = 0.5

- **Load and prepare image**

    - Open the image and convert to RGB
    - Apply transforms
    - Add batch dimension (`unsqueeze(0)`)
    - Move tensor to the chosen device (CPU/GPU)

- **Run model inference**

    - Disable gradients (`torch.no_grad()`)
    - Pass image through the model to get raw logits
    - Apply sigmoid to convert logits → probability (binary classification)

- **Interpret prediction**

    - If probability > 0.5 → Tumor Detected
    - Else → No Tumor Detected

- **Return output**

    - `prediction`: the label
    - `confidence`: probability of that label
        - If tumor detected → prob
        - Else → (1 - prob)