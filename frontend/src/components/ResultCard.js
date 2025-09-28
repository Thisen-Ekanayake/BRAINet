import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';

const ResultCard = ({ title, value, confidence, type = 'detection' }) => {
  const { isDarkMode } = useDarkMode();

  const getTypeColor = (type) => {
    switch (type) {
      case 'detection':
        return value === 'Tumor Present' 
          ? 'text-red-600 dark:text-red-400' 
          : 'text-green-600 dark:text-green-400';
      case 'classification':
        return 'text-blue-600 dark:text-blue-400';
      case 'segmentation':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'detection':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'classification':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'segmentation':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="card hover:shadow-xl transition-all duration-300">
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          {getTypeIcon(type)}
        </div>
        
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h3>
          
          <p className={`text-2xl font-bold mt-2 ${getTypeColor(type)}`}>
            {value}
          </p>
          
          {confidence && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm">
                <span className={`${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Confidence
                </span>
                <span className={`font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {confidence}%
                </span>
              </div>
              <div className={`w-full h-2 rounded-full mt-1 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-1000"
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;

