cmake_minimum_required(VERSION 3.10)
project(edge_inference)

set(CMAKE_CXX_STANDARD 17)

find_package(OpenCV REQUIRED)

include_directories(
    ${OpenCV_INCLUDE_DIRS}
    $ENV{ONNXRUNTIME_ROOT}/include
)

link_directories($ENV{ONNXRUNTIME_ROOT}/lib)

add_executable(infer main.cpp)

target_link_libraries(infer
    ${OpenCV_LIBS}
    onnxruntime
)