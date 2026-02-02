FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# ---------- system deps ----------
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    wget \
    libopencv-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# ---------- ONNX Runtime ----------
RUN wget https://github.com/microsoft/onnxruntime/releases/download/v1.18.1/onnxruntime-linux-x64-1.18.1.tgz \
    && tar -xzf onnxruntime-linux-x64-1.18.1.tgz \
    && mv onnxruntime-linux-x64-1.18.1 /opt/onnxruntime \
    && rm onnxruntime-linux-x64-1.18.1.tgz

ENV ONNXRUNTIME_ROOT=/opt/onnxruntime

# ---------- workspace ----------
WORKDIR /app
COPY . /app

# ---------- build ----------
RUN mkdir build && cd build && \
    cmake .. && \
    make -j$(nproc)

# ---------- run ----------
CMD ["./build/infer"]