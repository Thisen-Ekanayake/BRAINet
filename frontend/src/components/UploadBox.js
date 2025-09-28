import React, { useState, useRef } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';

const UploadBox = ({ onFileUpload, uploadedFile, isAnalyzing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const { isDarkMode } = useDarkMode();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
          isDragOver
            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
            : isDarkMode
            ? 'border-gray-600 hover:border-gray-500 bg-gray-800'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.dcm"
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploadedFile ? (
          <div className="space-y-4">
            <div className="w-32 h-32 mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <img
                src={URL.createObjectURL(uploadedFile)}
                alt="Uploaded MRI scan"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <p className={`text-lg font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {uploadedFile.name}
              </p>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="btn-secondary"
            >
              Choose Different File
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <svg
                className="w-8 h-8 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className={`text-lg font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Upload MRI Scan
              </p>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Drag and drop your MRI scan here, or click to browse
              </p>
              <p className={`text-xs mt-2 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Supports PNG, JPG, JPEG, DICOM files
              </p>
            </div>
          </div>
        )}
      </div>

      {uploadedFile && (
        <div className="mt-6 text-center">
          <button
            onClick={() => {/* Handle analysis */}}
            disabled={isAnalyzing}
            className={`btn-primary ${
              isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isAnalyzing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </div>
            ) : (
              'Run BRAINet Analysis'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadBox;

