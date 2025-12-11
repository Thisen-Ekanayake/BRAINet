# BRAINet - Brain Radiology Analysis with Intelligent Networks

An AI-powered web application for comprehensive MRI scan analysis, featuring brain tumor detection, classification, and segmentation using deep learning models.

## Features

- **Binary Tumor Detection**: Detect presence or absence of brain tumors
- **Multi-Class Classification**: Classify tumors into glioma, meningioma, pituitary, or no tumor
- **Visualizations**: GradCAM heatmaps and bounding box visualizations
- **Report Generation**: Professional analysis reports with confidence scores
- **Modern UI**: Responsive React frontend with dark mode support

## Tech Stack

### Frontend
- React 18 with Vite
- TailwindCSS
- React Router

### Backend
- FastAPI
- PyTorch
- ResNet18 (Transfer Learning)
- Custom CNNs

## Project Structure

```
├── app/                    # FastAPI backend
│   ├── main.py            # API endpoints
│   ├── model_loader.py    # Model loading from HuggingFace
│   └── inference.py       # Prediction logic
├── frontend/              # React frontend
│   └── src/
│       ├── pages/         # Route pages
│       ├── components/    # UI components
│       └── services/      # API client
├── classification_binary/ # Binary classification models
├── classification_multi_class/ # Multi-class classification models
└── segmentation_with_unet/    # U-Net segmentation models
```

## Setup

### Prerequisites
- Python 3.10+
- Node.js 16+
- CUDA-capable GPU (optional, for faster inference)

### Backend Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the FastAPI server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

- `POST /predict` - Upload MRI scan for analysis
- `GET /health` - Health check endpoint

## Model Training

The project includes training scripts for:
- Binary CNN models (`classification_binary/`)
- Multi-class ResNet18 models (`classification_multi_class/`)
- U-Net segmentation models (`segmentation_with_unet/`)

Refer to the documentation in each directory for training instructions.

## Model Source

The production model is loaded from HuggingFace Hub:
- Repository: `ThisenEkanayake/brain-tumor-detection`
- Model: `multiclass-classification/multi_class_resnet.pth`

## License

See [LICENSE](LICENSE) file for details.

## Disclaimer

This tool is for research and educational purposes only. It is not a substitute for professional medical diagnosis or treatment.
