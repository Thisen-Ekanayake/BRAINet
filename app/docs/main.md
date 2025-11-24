Provides an HTTP API for brain tumor prediction using a ResNet18 binary classifier.

## App Setup

- **Create FastAPI app**

    - Sets project title: "Brain Tumor Detection API (ResNet18 Binary Classifier)".

- **Enable CORS**

    - Allows frontend to call the backend from:

        - `http://localhost:3000`
        - `http://127.0.0.1:3000`

    - Allows all methods, headers, and credentials.

- **Load model at startup**

    - Calls `load_model()` to initialize the ML model and device once.
    - Keeps model in memory for fast predictions.

## POST /predict — Predict Brain Tumor
**Steps inside the endpoint**

- **Accept uploaded image**

    - Reads incoming file (`UploadFile`)
    - Saves it temporarily to `temp/` directory

- **Run prediction**

    - Passes saved file path to the `predict()` function
    - Receives label + confidence score

- **Cleanup**

    - Deletes temporary file after inference

- **Format API response**

    - Converts internal labels to frontend-friendly format:
        - `"Tumor Present"` / `"No Tumor Detected"`
    - Converts confidence to percent integer
    - Adds an ISO timestamp
    - Builds both:
        - `detection` block → human-facing result
        - `classification` block → alternate labeling format
    - Adds model version and processing time (placeholder)

- **Return structured JSON response**

    - Contains:
        - success flag
        - prediction results
        - timestamps
        - metadata