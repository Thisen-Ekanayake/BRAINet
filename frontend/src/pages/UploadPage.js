import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadBox from '../components/UploadBox';
import ResultCard from '../components/ResultCard';
import { analyzeScan, validateFileFormat, saveAnalysisToHistory } from '../services/api';
import { useDarkMode } from '../contexts/DarkModeContext';

const UploadPage = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const handleFileUpload = async (file) => {
    setError(null);
    
    // Validate file format
    if (!validateFileFormat(file)) {
      setError('Unsupported file format. Please upload PNG, JPG, JPEG, or DICOM files.');
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size too large. Please upload files smaller than 50MB.');
      return;
    }

    setUploadedFile(file);
  };

  const handleAnalysis = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResults(null);

    try {
      // Upload and analyze the file
      const analysisResponse = await analyzeScan(uploadedFile);
      
      if (analysisResponse && analysisResponse.success && analysisResponse.results) {
        // Validate response structure
        if (!analysisResponse.results.classification) {
          throw new Error('Invalid response structure from server');
        }
        
        setAnalysisResults(analysisResponse.results);
        
        // Save to history (with error handling)
        try {
          saveAnalysisToHistory(analysisResponse.results, uploadedFile.name);
        } catch (saveError) {
          console.warn('Failed to save to history:', saveError);
          // Don't fail the whole operation if history save fails
        }
        
        // Navigate to reports page after successful analysis
        setTimeout(() => {
          navigate('/reports', { state: { analysisResults: analysisResponse.results } });
        }, 2000);
      } else {
        setError('Invalid response from server. Please try again.');
        setIsAnalyzing(false);
      }
      
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Analysis failed. Please try again.');
      setIsAnalyzing(false);
      setAnalysisResults(null);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            MRI Scan Analysis
          </h1>
          <p className={`text-xl ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Upload your MRI scan for comprehensive brain tumor analysis
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="mb-12">
          <UploadBox
            onFileUpload={handleFileUpload}
            uploadedFile={uploadedFile}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Analysis Button */}
        {uploadedFile && !analysisResults && (
          <div className="text-center mb-12">
            <button
              onClick={handleAnalysis}
              disabled={isAnalyzing}
              className={`btn-primary text-lg px-8 py-4 ${
                isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isAnalyzing ? (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Running BRAINet Analysis...</span>
                </div>
              ) : (
                'Run BRAINet Analysis'
              )}
            </button>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResults && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className={`text-3xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Analysis Results
              </h2>
              <p className={`text-lg ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                BRAINet has completed the analysis of your MRI scan
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Detection Result */}
              {analysisResults.detection && (
                <ResultCard
                  title="Tumor Detection"
                  value={analysisResults.detection.value}
                  confidence={analysisResults.detection.confidence}
                  type="detection"
                />
              )}

              {/* Classification Result */}
              {analysisResults.classification && (
                <ResultCard
                  title="Tumor Classification"
                  value={analysisResults.classification.value}
                  confidence={analysisResults.classification.confidence}
                  type="classification"
                />
              )}
            </div>

            {/* Segmentation Preview */}
            <div className="card">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`p-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className={`text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Segmentation Preview
                </h3>
              </div>
              
              <div className={`w-full h-64 rounded-lg border-2 border-dashed ${
                isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-100'
              } flex items-center justify-center`}>
                <div className="text-center">
                  <svg className={`w-16 h-16 mx-auto mb-4 ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className={`${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Segmentation overlay will appear here
                  </p>
                </div>
              </div>
            </div>

            {/* View Full Report Button */}
            <div className="text-center">
              <button
                onClick={() => navigate('/reports', { state: { analysisResults } })}
                className="btn-primary text-lg px-8 py-4"
              >
                View Full Report
              </button>
            </div>
          </div>
        )}

        {/* File Requirements */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="card">
            <h3 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              File Requirements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Supported Formats
                </h4>
                <ul className={`text-sm space-y-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <li>• PNG (Portable Network Graphics)</li>
                  <li>• JPG/JPEG (Joint Photographic Experts Group)</li>
                  <li>• DICOM (Digital Imaging and Communications in Medicine)</li>
                </ul>
              </div>
              <div>
                <h4 className={`font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  File Specifications
                </h4>
                <ul className={`text-sm space-y-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <li>• Maximum file size: 50MB</li>
                  <li>• Recommended resolution: 512x512 or higher</li>
                  <li>• Single slice or multi-slice MRI scans</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;

