# BRAINet - Complete Documentation

**Brain Radiology Analysis with Intelligent Networks**

Deep learning - powered MRI analysis for brain tumor detection, classification, and segmentation.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Installation & Setup](#installation--setup)
4. [Project Structure](#project-structure)
5. [Backend Documentation](#backend-documentation)
6. [Frontend Documentation](#frontend-documentation)
7. [Model Documentation](#model-documentation)
8. [Training & Evaluation](#training--evaluation)
9. [API Documentation](#api-documentation)
10. [Utilities & Tools](#utilities--tools)
11. [Deployment](#deployment)
12. [Contributing](#contributing)

---

## Project Overview

BRAINet is a comprehensive deep learning system for brain tumor detection and classification from MRI scans. The system provides:

- **Binary Tumor Detection**: Detects presence or absence of brain tumors
- **Multi-Class Classification**: Classifies tumors into glioma, meningioma, pituitary, or no tumor
- **Visual Explanations**: GradCAM++ heatmaps and bounding box visualizations
- **Professional Reports**: PDF report generation with analysis results
- **Modern Web Interface**: Responsive React frontend with dark mode support

### Key Features

- **Multiple Model Architectures**: Custom CNNs and ResNet18 transfer learning
- **Model Quantization**: Dynamic quantization support for optimized inference
- **Explainable AI**: GradCAM++ visualizations for model interpretability
- **Production-Ready API**: FastAPI backend with CORS support
- **Model Hosting**: Models loaded from HuggingFace Hub

---

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│  React Frontend │
│   (Port 3000)   │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│ FastAPI Backend │
│   (Port 8000)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  PyTorch Models │
│  (ResNet18/CNN) │
└─────────────────┘
```

### Data Flow

1. **User Upload**: MRI scan uploaded via React frontend
2. **API Processing**: FastAPI receives file, validates, and saves temporarily
3. **Model Inference**: Preprocessed image passed to PyTorch model
4. **GradCAM++**: Visualization generated for explainability
5. **Response**: Results returned as JSON with base64-encoded visualizations
6. **Frontend Display**: Results rendered with visualizations and PDF report option

---

## Installation & Setup

### Prerequisites

- **Python**: 3.10 or higher
- **Node.js**: 16 or higher
- **CUDA-capable GPU**: Optional, for faster training and inference
- **Operating System**: Linux, macOS, or Windows

### Backend Setup

1. **Clone the repository**:
```bash
git clone https://github.com/Thisen-Ekanayake/BRAINet.git
cd BRAINet
```

2. **Create a virtual environment** (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install Python dependencies**:
```bash
pip install -r requirements.txt
```

4. **Verify installation**:
```bash
python -c "import torch; print(f'PyTorch version: {torch.__version__}')"
python -c "import fastapi; print('FastAPI installed')"
```

5. **Run the FastAPI server**:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install Node.js dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

---

## Project Structure

```
Brain Tumor Detection & MRI Scan Analysis/
├── app/                          # FastAPI backend application
│   ├── main.py                   # API endpoints and CORS configuration
│   ├── inference.py              # Prediction logic and preprocessing
│   ├── model_loader.py           # Model loading from HuggingFace Hub
│   └── docs/                     # Backend documentation
│       ├── main.md
│       ├── inference.md
│       └── model_loader.md
│
├── frontend/                     # React frontend application
│   ├── src/
│   │   ├── App.js                # Main app component with routing
│   │   ├── index.js              # React entry point
│   │   ├── index.css             # Global styles
│   │   ├── pages/                # Route pages
│   │   │   ├── LandingPage.js
│   │   │   ├── UploadPage.js
│   │   │   ├── ReportsPage.js
│   │   │   └── AboutPage.js
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Navbar.js
│   │   │   ├── UploadBox.js
│   │   │   ├── ResultCard.js
│   │   │   ├── ReportPreview.js
│   │   │   └── DarkModeToggle.js
│   │   ├── contexts/             # React contexts
│   │   │   └── DarkModeContext.js
│   │   └── services/             # API client and utilities
│   │       └── api.js
│   ├── public/                   # Static assets
│   ├── package.json              # Node.js dependencies
│   └── vite.config.js           # Vite configuration
│
├── classification_binary/        # Binary classification models
│   ├── binary_cnn_model.py       # Custom CNN architecture
│   ├── dataset_preprocessing.py  # Data loading and transforms
│   ├── train_binary_cnn.py       # CNN training script
│   ├── train_resnet_binary.py    # ResNet18 training script
│   ├── evaluate_binary_cnn.py    # CNN evaluation script
│   ├── evaluate_resnet_binary.py # ResNet18 evaluation script
│   ├── quantize_and_compare.py   # Model quantization utility
│   ├── docs/                     # Binary classification docs
│   └── *.pth                     # Trained model weights
│
├── classification_multi_class/    # Multi-class classification models
│   ├── multi_class_cnn_model.py  # Custom CNN architecture
│   ├── multi_class_dataset_preprocessing.py  # Data loading
│   ├── train_multi_class_cnn.py  # CNN training script
│   ├── train_multi_class_resnet.py  # ResNet18 training script
│   ├── evaluate_multi_class.py   # Evaluation script
│   ├── docs/                     # Multi-class classification docs
│   └── *.pth                     # Trained model weights
│
├── Dataset_binary/               # Binary classification dataset
│   ├── Training/
│   └── Testing/
│
├── Dataset_multi_class/          # Multi-class classification dataset
│   ├── Training/
│   └── Testing/
│
├── charts/                       # Training curves and confusion matrices
├── gradcam/                      # GradCAM visualization outputs
├── temp/                         # Temporary file storage
│
├── gradcam_pp.py                 # GradCAM++ implementation
├── check_layers.py               # Model layer analysis utility
├── parameter_analysis.py         # Model parameter analysis
├── h5_file_viewer.py             # HDF5 file viewer utility
│
├── requirements.txt              # Python dependencies
├── README.md                     # Project README
├── LICENSE                       # License file
└── DOCUMENTATION.md              # This file
```

---

## Backend Documentation

### FastAPI Application (`app/main.py`)

The main FastAPI application provides REST API endpoints for brain tumor detection.

#### Endpoints

**POST `/predict`**
- **Description**: Upload and analyze an MRI scan
- **Request**: Multipart form data with `file` field
- **Response**: JSON with detection, classification, probabilities, and visualizations
- **File Size Limit**: 50MB
- **Supported Formats**: PNG, JPG, JPEG, DICOM

**Response Structure**:
```json
{
  "success": true,
  "results": {
    "detection": {
      "value": "Tumor Present" | "No Tumor Detected",
      "confidence": 0-100,
      "timestamp": "ISO timestamp"
    },
    "classification": {
      "value": "glioma" | "meningioma" | "pituitary" | "notumor",
      "confidence": 0-100,
      "timestamp": "ISO timestamp"
    },
    "all_probabilities": {
      "glioma": 0.0-1.0,
      "meningioma": 0.0-1.0,
      "notumor": 0.0-1.0,
      "pituitary": 0.0-1.0
    },
    "visualizations": {
      "original": "base64-encoded PNG",
      "heatmap": "base64-encoded PNG",
      "bounding_box": "base64-encoded PNG"
    }
  },
  "processingTime": "N/A",
  "modelVersion": "ResNet18 Multi-Class Classifier"
}
```

**GET `/health`**
- **Description**: Health check endpoint
- **Response**: `{"status": "healthy", "model_loaded": true/false}`

#### CORS Configuration

The API supports CORS with configurable allowed origins:
- Default: `localhost:3000`, `127.0.0.1:3000`, and production domains
- Configure via `ALLOWED_ORIGINS` environment variable

### Model Loader (`app/model_loader.py`)

Loads the production ResNet18 model from HuggingFace Hub.

**Function**: `load_model()`
- **Returns**: `(model, device, target_layer)`
- **Model Source**: `ThisenEkanayake/brain-tumor-detection`
- **Model File**: `multiclass-classification/multi_class_resnet.pth`
- **Architecture**: ResNet18 with 4-class output layer
- **Target Layer**: `layer4[-1].conv2` (for GradCAM++)

**Device Selection**: Automatically uses CUDA if available, otherwise CPU.

### Inference Engine (`app/inference.py`)

Handles image preprocessing, model inference, and visualization generation.

**Function**: `predict(model, device, image_path, target_layer)`

**Process**:
1. Load and preprocess image (resize to 224x224, normalize)
2. Run model inference
3. Compute class probabilities
4. Generate GradCAM++ heatmap and bounding box
5. Encode visualizations as base64

**Preprocessing**:
- Resize: 224x224 pixels
- Normalization: ImageNet statistics (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
- Input format: RGB

**Classes**: `["glioma", "meningioma", "notumor", "pituitary"]`

---

## Frontend Documentation

### React Application Structure

The frontend is built with React 18, Vite, TailwindCSS, and React Router.

### Pages

**LandingPage** (`pages/LandingPage.js`)
- Homepage with project overview and features
- Call-to-action to upload scans

**UploadPage** (`pages/UploadPage.js`)
- File upload interface
- Real-time analysis display
- Results visualization with GradCAM++ heatmaps
- PDF report generation

**ReportsPage** (`pages/ReportsPage.js`)
- View analysis history
- Access previous reports
- Local storage-based history management

**AboutPage** (`pages/AboutPage.js`)
- Project information
- Technology stack
- Disclaimer and usage guidelines

### Components

**Navbar** (`components/Navbar.js`)
- Navigation menu
- Dark mode toggle
- Responsive design

**UploadBox** (`components/UploadBox.js`)
- Drag-and-drop file upload
- File validation
- Upload progress indication

**ResultCard** (`components/ResultCard.js`)
- Display detection results
- Confidence scores
- Probability distributions
- Visualization display

**ReportPreview** (`components/ReportPreview.js`)
- PDF report preview
- Download functionality

**DarkModeToggle** (`components/DarkModeToggle.js`)
- Theme switching
- Persistent theme preference

### Services

**API Client** (`services/api.js`)

Functions:
- `analyzeScan(file)`: Upload and analyze MRI scan
- `fetchReport(analysisId)`: Retrieve saved report
- `downloadPDFReport(analysisData)`: Generate and download PDF
- `getAnalysisHistory()`: Get analysis history
- `saveAnalysisToHistory(data, fileName)`: Save analysis to history
- `validateFileFormat(file)`: Validate file format

**Features**:
- Automatic timeout handling (2 minutes)
- Error handling and user-friendly messages
- Base64 image encoding for PDF generation
- Local storage management

### Dark Mode

Implemented via React Context (`contexts/DarkModeContext.js`):
- System preference detection
- Manual toggle
- Persistent storage
- Smooth transitions

---

## Model Documentation

### Binary Classification Models

#### Custom CNN (`classification_binary/binary_cnn_model.py`)

**Architecture**: `SimpleCNN`

```
Input (3, 224, 224)
  ↓
Conv2d(3→32) + ReLU + MaxPool2d
  ↓
Conv2d(32→64) + ReLU + MaxPool2d
  ↓
Conv2d(64→128) + ReLU + MaxPool2d
  ↓
Flatten
  ↓
Dropout(0.5) → Linear(128*28*28 → 256) + ReLU
  ↓
Dropout(0.5) → Linear(256 → 1)
  ↓
Output (Binary: Tumor/No Tumor)
```

**Parameters**: ~2.5M trainable parameters

**Loss Function**: `BCEWithLogitsLoss`

**Optimizer**: Adam (lr=1e-4)

#### ResNet18 Binary (`classification_binary/train_resnet_binary.py`)

**Architecture**: ResNet18 with binary output
- Transfer learning from ImageNet
- Final layer: `Linear(in_features=512, out_features=1)`
- Freezing strategy: Configurable (typically layer4 + fc trainable)

**Loss Function**: `BCEWithLogitsLoss`

**Optimizer**: Adam (lr=1e-4)

### Multi-Class Classification Models

#### Custom CNN (`classification_multi_class/multi_class_cnn_model.py`)

**Architecture**: `MultiClassCNN`

```
Input (3, 224, 224)
  ↓
Conv2d(3→32) + ReLU + MaxPool2d
  ↓
Conv2d(32→64) + ReLU + MaxPool2d
  ↓
Conv2d(64→128) + ReLU + MaxPool2d
  ↓
Flatten
  ↓
Dropout(0.5) → Linear(128*28*28 → 256) + ReLU
  ↓
Dropout(0.5) → Linear(256 → 4)
  ↓
Output (4 classes: glioma, meningioma, notumor, pituitary)
```

**Parameters**: ~2.5M trainable parameters

**Loss Function**: `CrossEntropyLoss` (with class weights)

**Optimizer**: Adam (lr=1e-4)

#### ResNet18 Multi-Class (`classification_multi_class/train_multi_class_resnet.py`)

**Architecture**: ResNet18 with 4-class output
- Transfer learning from ImageNet pretrained weights
- Final layer: `Linear(in_features=512, out_features=4)`
- Freezing: Early layers frozen, layer4 and fc trainable

**Loss Function**: `CrossEntropyLoss` (with class weights for imbalanced data)

**Optimizer**: Adam (lr=1e-4, only trainable parameters)

**Class Weights**: Automatically calculated from training data distribution

---

## Training & Evaluation

### Dataset Structure

**Binary Classification Dataset** (`Dataset_binary/`)
```
Dataset_binary/
├── Training/
│   ├── yes/          # Tumor present
│   └── no/           # No tumor
└── Testing/
    ├── yes/
    └── no/
```

**Multi-Class Classification Dataset** (`Dataset_multi_class/`)
```
Dataset_multi_class/
├── Training/
│   ├── glioma/
│   ├── meningioma/
│   ├── notumor/
│   └── pituitary/
└── Testing/
    ├── glioma/
    ├── meningioma/
    ├── notumor/
    └── pituitary/
```

### Data Preprocessing

#### Binary Classification (`classification_binary/dataset_preprocessing.py`)

**Training Transforms**:
- Resize: 224x224
- Random horizontal flip (p=0.5)
- Random rotation (±10 degrees)
- ToTensor
- Normalize: mean=[0.5], std=[0.5]

**Test Transforms**:
- Resize: 224x224
- ToTensor
- Normalize: mean=[0.5], std=[0.5]

**Batch Size**: 16

#### Multi-Class Classification (`classification_multi_class/multi_class_dataset_preprocessing.py`)

**Training Transforms**:
- Resize: 224x224
- Random horizontal flip (p=0.5)
- Random rotation (±10 degrees)
- ColorJitter (brightness=0.2, contrast=0.2)
- ToTensor
- Normalize: ImageNet statistics

**Test Transforms**:
- Resize: 224x224
- ToTensor
- Normalize: ImageNet statistics

**Batch Size**: 16

**Class Balancing**: WeightedRandomSampler for imbalanced datasets

### Training Scripts

#### Binary CNN Training (`classification_binary/train_binary_cnn.py`)

```bash
cd classification_binary
python train_binary_cnn.py
```

**Configuration**:
- Epochs: 5
- Loss: BCEWithLogitsLoss
- Optimizer: Adam (lr=1e-4)
- Validation: Test set accuracy after each epoch
- Output: `binary_cnn_v2.pth`

#### Multi-Class ResNet Training (`classification_multi_class/train_multi_class_resnet.py`)

```bash
cd classification_multi_class
python train_multi_class_resnet.py
```

**Configuration**:
- Epochs: 10
- Loss: CrossEntropyLoss (weighted)
- Optimizer: Adam (lr=1e-4, only layer4 + fc)
- Validation: Test set accuracy after each epoch
- Output: `multi_class_resnet.pth`
- Visualizations: Training curves saved as PNG

### Evaluation Scripts

#### Binary CNN Evaluation (`classification_binary/evaluate_binary_cnn.py`)

**Metrics**:
- Accuracy
- Precision
- Recall
- F1 Score
- Confusion Matrix (visualized)

**Usage**:
```bash
cd classification_binary
python evaluate_binary_cnn.py
```

#### Multi-Class Evaluation (`classification_multi_class/evaluate_multi_class.py`)

**Metrics**:
- Accuracy
- Precision (per-class and macro)
- Recall (per-class and macro)
- F1 Score (per-class and macro)
- Confusion Matrix (visualized)
- Classification Report

**Usage**:
```bash
cd classification_multi_class
python evaluate_multi_class.py
```

**Model Selection**: Edit `model_type` variable to choose between "cnn" or "ResNet"

### Model Quantization

**Script**: `classification_binary/quantize_and_compare.py`

**Purpose**: Dynamic quantization for model optimization

**Process**:
1. Load original model
2. Apply dynamic quantization
3. Compare accuracy and size
4. Save quantized model

**Usage**:
```bash
cd classification_binary
python quantize_and_compare.py
```

---

## API Documentation

### Endpoint Details

#### POST `/predict`

**Request**:
- Method: POST
- Content-Type: multipart/form-data
- Body: `file` (image file)

**Response Codes**:
- `200`: Success
- `400`: Bad request (no file, file too large, invalid format)
- `500`: Server error

**Example Request** (cURL):
```bash
curl -X POST "http://localhost:8000/predict" \
  -F "file=@path/to/mri_scan.png"
```

**Example Response**:
```json
{
  "success": true,
  "results": {
    "detection": {
      "value": "Tumor Present",
      "confidence": 87,
      "timestamp": "2026-01-15T10:30:00.123456"
    },
    "classification": {
      "value": "glioma",
      "confidence": 87,
      "timestamp": "2026-01-15T10:30:00.123456"
    },
    "all_probabilities": {
      "glioma": 0.87,
      "meningioma": 0.08,
      "notumor": 0.03,
      "pituitary": 0.02
    },
    "visualizations": {
      "original": "iVBORw0KGgoAAAANS...",
      "heatmap": "iVBORw0KGgoAAAANS...",
      "bounding_box": "iVBORw0KGgoAAAANS..."
    }
  },
  "processingTime": "N/A",
  "modelVersion": "ResNet18 Multi-Class Classifier"
}
```

#### GET `/health`

**Request**:
- Method: GET
- No parameters

**Response**:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### Error Handling

**File Size Error**:
```json
{
  "detail": "File size too large. Maximum size is 50MB."
}
```

**Invalid File Error**:
```json
{
  "detail": "No file provided"
}
```

**Processing Error**:
```json
{
  "detail": "Error processing image: [error message]"
}
```

---

## Utilities & Tools

### GradCAM++ (`gradcam_pp.py`)

**Purpose**: Generate GradCAM++ visualizations for model interpretability

**Class**: `GradCAMPP`
- Implements GradCAM++ algorithm
- Generates class activation maps
- Supports bounding box detection

**Functions**:
- `run_gradcam(model, device, image_path, target_layer)`: Generate heatmap and bounding box
- `overlay_heatmap(img, cam)`: Overlay heatmap on image
- `draw_bounding_box(img, cam, threshold=0.5)`: Draw bounding box around activation

**Usage** (CLI):
```bash
python gradcam_pp.py --input_dir path/to/images --output_dir path/to/output
```

**Usage** (Python):
```python
from gradcam_pp import run_gradcam
heatmap, bbox = run_gradcam(model, device, image_path, target_layer)
```

### Layer Analysis (`check_layers.py`)

**Purpose**: Analyze model layer trainability and parameters

**Features**:
- Print trainable vs frozen layers
- Parameter count statistics
- Grouped or detailed layer information

**Usage**:
```bash
python check_layers.py
```

### Parameter Analysis (`parameter_analysis.py`)

**Purpose**: Analyze model parameters and architecture

**Features**:
- Total parameter count
- Trainable parameter count
- Layer-wise parameter breakdown

**Usage**:
```bash
python parameter_analysis.py
```

### H5 File Viewer (`h5_file_viewer.py`)

**Purpose**: View HDF5 file contents (for BraTS dataset)

**Usage**: Edit file path in script and run:
```bash
python h5_file_viewer.py
```

---

## Deployment

### Backend Deployment

#### Using Uvicorn (Production)

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### Using Gunicorn (Recommended for Production)

```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

#### Environment Variables

```bash
export ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
export CUDA_VISIBLE_DEVICES=0  # GPU selection
```

### Frontend Deployment

#### Build for Production

```bash
cd frontend
npm run build
```

#### Deploy Static Files

The `dist/` directory contains static files ready for deployment:
- Nginx
- Apache
- Vercel
- Netlify
- AWS S3 + CloudFront

#### Environment Configuration

Create `.env.production`:
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Docker Deployment (Optional)

**Dockerfile Example** (Backend):
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/
COPY gradcam_pp.py .
COPY classification_multi_class/multi_class_resnet.pth ./classification_multi_class/

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Dockerfile Example** (Frontend):
```dockerfile
FROM node:16-alpine AS build

WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Model Hosting

Models are hosted on HuggingFace Hub:
- Repository: `ThisenEkanayake/brain-tumor-detection`
- Model: `multiclass-classification/multi_class_resnet.pth`

To update models:
1. Train new model
2. Upload to HuggingFace Hub
3. Update `app/model_loader.py` if needed

---

## Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Make changes**: Follow code style guidelines
4. **Test changes**: Ensure all tests pass
5. **Commit changes**: Use descriptive commit messages
6. **Push to branch**: `git push origin feature/your-feature`
7. **Create Pull Request**: Provide detailed description

### Code Style

**Python**:
- Follow PEP 8
- Use type hints where possible
- Document functions with docstrings
- Maximum line length: 100 characters

**JavaScript**:
- Use ES6+ features
- Follow React best practices
- Use functional components and hooks
- Consistent indentation (2 spaces)

### Testing

**Backend Testing**:
```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest tests/
```

**Frontend Testing**:
```bash
cd frontend
npm test
```

### Documentation

- Update this documentation for significant changes
- Add docstrings to new functions/classes
- Update API documentation for endpoint changes
- Include examples in documentation

---

## Troubleshooting

### Common Issues

**Issue**: Model not loading from HuggingFace
- **Solution**: Check internet connection, verify HuggingFace credentials if private repo

**Issue**: CUDA out of memory
- **Solution**: Reduce batch size, use CPU, or use smaller model

**Issue**: CORS errors in frontend
- **Solution**: Check `ALLOWED_ORIGINS` environment variable, ensure frontend URL is included

**Issue**: File upload fails
- **Solution**: Check file size (max 50MB), verify file format (PNG/JPG/JPEG/DICOM)

**Issue**: GradCAM visualization not generating
- **Solution**: Verify target layer exists in model, check image preprocessing

### Performance Optimization

**Backend**:
- Use GPU for inference: `CUDA_VISIBLE_DEVICES=0`
- Enable model quantization for faster inference
- Use batch processing for multiple images

**Frontend**:
- Optimize image sizes before upload
- Use lazy loading for reports page
- Cache API responses where appropriate

---

## License

See [LICENSE](LICENSE) file for details.

---

## Disclaimer

**IMPORTANT**: This tool is for research and educational purposes only. It is not a substitute for professional medical diagnosis or treatment. All results should be interpreted by qualified healthcare professionals, and the system should be used in conjunction with established medical protocols and guidelines.

---

## Acknowledgments

- PyTorch team for the deep learning framework
- FastAPI for the modern web framework
- React team for the frontend library
- HuggingFace for model hosting infrastructure
- Medical imaging research community

---

## Contact & Support

For issues, questions, or contributions, please refer to the project repository.

---

**Last Updated**: 2026.01.14
**Version**: 1.0.0