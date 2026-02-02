#include <onnxruntime_cxx_api.h>
#include <opencv2/opencv.hpp>
#include <iostream>
#include <vector>
#include <chrono>
#include <cmath>

static const int IMG_SIZE = 224;

static const std::vector<std::string> CLASS_NAMES = {
    "glioma", "meningioma", "notumor", "pituitary"
};

static const float MEAN[3] = {0.485f, 0.456f, 0.406f};
static const float STD[3]  = {0.229f, 0.224f, 0.225f};

/* ---------------- Preprocess ---------------- */
std::vector<float> preprocess(const std::string& image_path) {
    cv::Mat img = cv::imread(image_path);
    if (img.empty()) {
        throw std::runtime_error("Failed to load image");
    }

    cv::cvtColor(img, img, cv::COLOR_BGR2RGB);
    cv::resize(img, img, cv::Size(IMG_SIZE, IMG_SIZE));
    img.convertTo(img, CV_32F, 1.0 / 255.0);

    std::vector<cv::Mat> channels(3);
    cv::split(img, channels);

    for (int c = 0; c < 3; ++c) {
        channels[c] = (channels[c] - MEAN[c]) / STD[c];
    }

    cv::merge(channels, img);

    // HWC → CHW
    std::vector<float> tensor(3 * IMG_SIZE * IMG_SIZE);
    for (int c = 0; c < 3; ++c) {
        for (int h = 0; h < IMG_SIZE; ++h) {
            for (int w = 0; w < IMG_SIZE; ++w) {
                tensor[c * IMG_SIZE * IMG_SIZE + h * IMG_SIZE + w] =
                    img.at<cv::Vec3f>(h, w)[c];
            }
        }
    }

    return tensor;
}

/* ---------------- Softmax ---------------- */
std::vector<float> softmax(const float* logits, size_t n) {
    std::vector<float> probs(n);
    float max_logit = logits[0];
    for (size_t i = 1; i < n; ++i)
        max_logit = std::max(max_logit, logits[i]);

    float sum = 0.0f;
    for (size_t i = 0; i < n; ++i) {
        probs[i] = std::exp(logits[i] - max_logit);
        sum += probs[i];
    }
    for (float& p : probs) p /= sum;
    return probs;
}

/* ---------------- Main ---------------- */
int main(int argc, char** argv) {
    if (argc != 2) {
        std::cerr << "Usage: ./infer <image_path>\n";
        return 1;
    }

    std::string image_path = argv[1];

    Ort::Env env(ORT_LOGGING_LEVEL_WARNING, "edge");
    Ort::SessionOptions opts;
    opts.SetGraphOptimizationLevel(GraphOptimizationLevel::ORT_ENABLE_ALL);
    opts.SetIntraOpNumThreads(2);

    Ort::Session session(env, "tumor_resnet_fp16.onnx", opts);

    auto input_tensor_values = preprocess(image_path);

    std::vector<int64_t> input_shape = {1, 3, IMG_SIZE, IMG_SIZE};

    Ort::MemoryInfo mem_info = Ort::MemoryInfo::CreateCpu(
        OrtArenaAllocator, OrtMemTypeDefault
    );

    Ort::Value input_tensor = Ort::Value::CreateTensor<float>(
        mem_info,
        input_tensor_values.data(),
        input_tensor_values.size(),
        input_shape.data(),
        input_shape.size()
    );

    const char* input_names[] = {"input"};
    const char* output_names[] = {"logits"};

    auto start = std::chrono::high_resolution_clock::now();
    auto output_tensors = session.Run(
        Ort::RunOptions{nullptr},
        input_names,
        &input_tensor,
        1,
        output_names,
        1
    );
    auto end = std::chrono::high_resolution_clock::now();

    float* logits = output_tensors[0].GetTensorMutableData<float>();
    auto probs = softmax(logits, CLASS_NAMES.size());

    int best_idx = std::max_element(probs.begin(), probs.end()) - probs.begin();

    double latency_ms =
        std::chrono::duration<double, std::milli>(end - start).count();

    std::cout << "Prediction : " << CLASS_NAMES[best_idx] << "\n";
    std::cout << "Confidence : " << probs[best_idx] * 100.0 << "%\n";
    std::cout << "Latency    : " << latency_ms << " ms\n";

    return 0;
}