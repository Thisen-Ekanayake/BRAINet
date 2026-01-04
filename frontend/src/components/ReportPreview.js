import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';

const ReportPreview = ({ analysisData }) => {
  const { isDarkMode } = useDarkMode();

  const handleDownloadPDF = () => {
    // Mock PDF download functionality
    console.log('Downloading PDF report...');
    // In a real app, this would generate and download a PDF
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Analysis Report
        </h2>
        {/*
        <button
          onClick={handleDownloadPDF}
          className="btn-primary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download PDF</span>
        </button>
        */}
      </div>

      <div className="space-y-6">
        {/* Analysis Summary */}
        <div className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Analysis Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Tumor Detection:
              </span>
              <p className={`font-medium ${
                analysisData?.detection?.value === 'Tumor Present'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-green-600 dark:text-green-400'
              }`}>
                {analysisData?.detection?.value || 'No Tumor Detected'}
              </p>
            </div>
            <div>
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Tumor Type:
              </span>
              <p className={`font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {analysisData?.classification?.value || 'N/A'}
              </p>
            </div>
            <div>
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Confidence:
              </span>
              <p className={`font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {analysisData?.detection?.confidence || 0}%
              </p>
            </div>
            <div>
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Analysis Date:
              </span>
              <p className={`font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Segmentation Preview */}
        <div>
          <h3 className={`text-lg font-semibold mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Segmentation Preview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisData?.visualizations?.heatmap && (
              <div className="text-center">
                <p className={`mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Heatmap</p>
                <img
                  src={`data:image/png;base64,${analysisData.visualizations.heatmap}`}
                  alt="Heatmap"
                  className="rounded-lg border w-full h-auto"
                />
              </div>
            )}
            {analysisData?.visualizations?.bounding_box && (
              <div className="text-center">
                <p className={`mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Bounding Box</p>
                <img
                  src={`data:image/png;base64,${analysisData.visualizations.bounding_box}`}
                  alt="Bounding Box"
                  className="rounded-lg border w-full h-auto"
                />
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className={`p-4 rounded-lg border-l-4 border-yellow-500 ${
          isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'
        }`}>
          <div className="flex items-start space-x-3">
            <svg className={`w-6 h-6 mt-0.5 ${
              isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className={`font-semibold ${
                isDarkMode ? 'text-yellow-400' : 'text-yellow-800'
              }`}>
                Important Disclaimer
              </h4>
              <p className={`text-sm mt-1 ${
                isDarkMode ? 'text-yellow-200' : 'text-yellow-700'
              }`}>
                BRAINet is a research tool designed for educational and research purposes. 
                It is not a substitute for professional medical diagnosis, treatment, or advice. 
                Always consult with qualified healthcare professionals for medical decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;

