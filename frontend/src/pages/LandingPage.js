import React from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';

const LandingPage = () => {
  const { isDarkMode } = useDarkMode();

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Tumor Detection',
      description: 'Advanced CNN models detect brain tumors with high accuracy using MRI scans.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: 'Tumor Classification',
      description: 'Classify tumors into Glioma, Meningioma, Pituitary, or No Tumor categories.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Tumor Segmentation',
      description: 'U-Net architecture provides precise tumor boundary segmentation.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 medical-pattern"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center shadow-2xl">
                <img 
                    src="/brain.png" 
                    alt="Logo"
                    className="w-12 h-12 object-contain"
                />
              </div>
            </div>
            
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              BRAINet
            </h1>
            
            <p className={`text-xl md:text-2xl mb-4 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Brain Radiology Analysis with Intelligent Networks
            </p>
            
            <p className={`text-lg mb-12 max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Leveraging advanced deep learning models including CNNs, Transfer Learning, 
              and U-Net architectures for comprehensive MRI scan analysis and brain tumor detection.
            </p>
            
            <Link
              to="/upload"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2 hover:scale-105 transform transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Upload MRI Scan</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Advanced AI Capabilities
            </h2>
            <p className={`text-xl ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Three powerful analysis modes for comprehensive brain tumor assessment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-16 h-16 gradient-bg rounded-xl flex items-center justify-center text-white mb-6 mx-auto`}>
                  {feature.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-4 text-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`text-center ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Medical Illustration Placeholder */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className={`text-4xl font-bold mb-8 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Medical-Grade Analysis
            </h2>
            
            <div className={`w-full h-96 rounded-2xl border-2 border-dashed ${
              isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-100'
            } flex items-center justify-center`}>
              <div className="text-center">
                <svg className={`w-24 h-24 mx-auto mb-6 ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <p className={`text-xl ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Medical Illustration Placeholder
                </p>
                <p className={`text-sm mt-2 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Brain MRI scan visualization will be displayed here
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Analyze Your MRI Scan?
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Upload your MRI scan and get instant AI-powered analysis with detailed reports and segmentation results.
          </p>
          <Link
            to="/upload"
            className="bg-white text-teal-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 hover:scale-105 transform inline-flex items-center space-x-2"
          >
            <span>Start Analysis</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

