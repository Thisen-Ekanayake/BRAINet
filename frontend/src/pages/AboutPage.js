import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';

const AboutPage = () => {
  const { isDarkMode } = useDarkMode();

  const technologies = [
    {
      name: 'Convolutional Neural Networks (CNNs)',
      description: 'Deep learning models specialized for image recognition and analysis.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      name: 'Transfer Learning',
      description: 'Leveraging pre-trained models for improved accuracy with limited data.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      name: 'U-Net Architecture',
      description: 'Specialized CNN architecture for precise medical image segmentation.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const datasets = [
    {
      name: 'BraTS (Brain Tumor Segmentation)',
      description: 'Multi-institutional dataset for brain tumor segmentation challenges.',
      source: 'Medical Image Computing and Computer Assisted Intervention Society',
    },
    {
      name: 'Figshare Brain MRI Dataset',
      description: 'Comprehensive collection of brain MRI scans for research purposes.',
      source: 'Figshare Digital Repository',
    },
    {
      name: 'Kaggle Brain MRI Images',
      description: 'Community-contributed dataset for brain tumor classification.',
      source: 'Kaggle Community',
    },
  ];

  const features = [
    'Automated tumor detection with high accuracy',
    'Multi-class tumor classification (Glioma, Meningioma, Pituitary)',
    'Precise tumor boundary segmentation',
    'Confidence scoring for all predictions',
    'Professional medical report generation',
    'Research-grade analysis tools',
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-3xl">B</span>
            </div>
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            About BRAINet
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Brain Radiology Analysis with Intelligent Networks - Advanced AI-powered 
            MRI scan analysis for brain tumor detection, classification, and segmentation.
          </p>
        </div>

        {/* Overview Section */}
        <section className="mb-16">
          <div className="card">
            <h2 className={`text-3xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Overview
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className={`text-lg leading-relaxed mb-6 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                BRAINet leverages state-of-the-art deep learning models including Convolutional 
                Neural Networks (CNNs), Transfer Learning techniques, and U-Net architectures 
                to provide comprehensive MRI scan analysis. Our system is designed to assist 
                medical professionals and researchers in detecting, classifying, and segmenting 
                brain tumors with high accuracy and confidence.
              </p>
              <p className={`text-lg leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                The platform combines multiple AI models to deliver three core capabilities: 
                binary tumor detection, multi-class tumor classification, and precise tumor 
                segmentation. Each analysis provides detailed confidence scores and professional 
                reports suitable for medical research and educational purposes.
              </p>
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              AI Technologies
            </h2>
            <p className={`text-xl ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Advanced deep learning models powering BRAINet's analysis capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="card hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center text-white mb-6">
                  {tech.icon}
                </div>
                <h3 className={`text-xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {tech.name}
                </h3>
                <p className={`${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <div className="card">
            <h2 className={`text-3xl font-bold mb-8 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 gradient-bg rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className={`${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dataset Credits */}
        <section className="mb-16">
          <div className="card">
            <h2 className={`text-3xl font-bold mb-8 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Dataset Credits
            </h2>
            <div className="space-y-6">
              {datasets.map((dataset, index) => (
                <div key={index} className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {dataset.name}
                  </h3>
                  <p className={`mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {dataset.description}
                  </p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Source: {dataset.source}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ethical Disclaimer */}
        <section className="mb-16">
          <div className={`p-6 rounded-xl border-l-4 border-yellow-500 ${
            isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'
          }`}>
            <div className="flex items-start space-x-4">
              <svg className={`w-8 h-8 mt-1 ${
                isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className={`text-xl font-bold mb-3 ${
                  isDarkMode ? 'text-yellow-400' : 'text-yellow-800'
                }`}>
                  Ethical AI in Healthcare
                </h3>
                <p className={`text-lg leading-relaxed ${
                  isDarkMode ? 'text-yellow-200' : 'text-yellow-700'
                }`}>
                  BRAINet is designed as a research and educational tool to advance medical AI 
                  capabilities. It is not intended to replace professional medical diagnosis, 
                  treatment, or clinical decision-making. All results should be interpreted 
                  by qualified healthcare professionals, and the system should be used in 
                  conjunction with established medical protocols and guidelines.
                </p>
                <p className={`text-sm mt-4 ${
                  isDarkMode ? 'text-yellow-300' : 'text-yellow-600'
                }`}>
                  <strong>Important:</strong> This tool is for research purposes only and should 
                  not be used as the sole basis for medical decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact/Support Section */}
        <section className="text-center">
          <div className="card">
            <h2 className={`text-3xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Research & Development
            </h2>
            <p className={`text-lg mb-8 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              BRAINet is continuously evolving with ongoing research and development efforts 
              to improve accuracy, expand capabilities, and enhance user experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                View Research Papers
              </button>
              <button className="btn-secondary">
                Contribute to Development
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;

