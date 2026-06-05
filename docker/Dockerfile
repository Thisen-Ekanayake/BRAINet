# syntax=docker/dockerfile:1
#
# BRAINet — Brain Tumor Detection API (FastAPI + ResNet18)
# CPU-only image. Build context MUST be the repository root:
#   docker build -f docker/Dockerfile -t brainet:latest .

FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    HF_HOME=/opt/hf-cache

# Runtime system libraries. libgomp1 provides the OpenMP runtime PyTorch needs.
RUN apt-get update && apt-get install -y --no-install-recommends \
        libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1) CPU-only PyTorch + torchvision (no CUDA) — keeps the image small.
RUN pip install --no-cache-dir \
        torch torchvision \
        --index-url https://download.pytorch.org/whl/cpu

# 2) API runtime dependencies (everything except torch, installed above).
COPY docker/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 3) Pre-bake the model weights into the image so the container starts fast and
#    works without reaching Hugging Face at runtime. Disable with
#    --build-arg PREFETCH_MODEL=false for an offline/air-gapped build.
ARG PREFETCH_MODEL=true
RUN if [ "$PREFETCH_MODEL" = "true" ]; then \
        python -c "from huggingface_hub import hf_hub_download; hf_hub_download(repo_id='ThisenEkanayake/brain-tumor-detection', filename='multiclass-classification/multi_class_resnet.pth')"; \
    fi

# 4) Application code (only what the API serving path needs).
COPY app/ ./app/
COPY gradcam_pp.py ./gradcam_pp.py

# 5) Drop privileges: run as a non-root user.
RUN useradd --create-home --uid 10001 appuser \
    && mkdir -p /app/temp /opt/hf-cache \
    && chown -R appuser:appuser /app /opt/hf-cache
USER appuser

EXPOSE 8000

# The app loads the model at import time, so allow a generous start period.
HEALTHCHECK --interval=30s --timeout=5s --start-period=180s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health').read()" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
