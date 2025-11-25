// API functions for BRAINet frontend
// Connected to FastAPI backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Upload and analyze MRI scan
 * @param {File} file - The MRI scan file
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeScan = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to analyze scan' }));
      throw new Error(error.detail || `Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. The server is taking too long to respond. Please try again.');
    }
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection and ensure the backend is running.');
    }
    
    throw error;
  }
};

/**
 * Fetch analysis report (for compatibility - uses local storage or passed data)
 * @param {string} analysisId - The analysis ID (optional, for future use)
 * @returns {Promise<Object>} Report data
 */
export const fetchReport = async (analysisId) => {
  // For now, return data from local storage or return null
  // In the future, this could fetch from a backend endpoint
  const storedData = localStorage.getItem('lastAnalysis');
  if (storedData) {
    return JSON.parse(storedData);
  }
  return null;
};

/**
 * Download PDF report (generates client-side PDF)
 * @param {Object} analysisData - The analysis data
 * @returns {Promise<Blob>} PDF blob
 */
export const downloadPDFReport = async (analysisData) => {
  // Generate a simple text-based report
  // In a real implementation, you might use a library like jsPDF
  const reportContent = `BRAINet Analysis Report
Generated: ${new Date().toLocaleString()}

Analysis Results:
- Tumor Detection: ${analysisData?.detection?.value || 'N/A'} (${analysisData?.detection?.confidence || 0}% confidence)
- Classification: ${analysisData?.classification?.value || 'N/A'} (${analysisData?.classification?.confidence || 0}% confidence)

Model Version: ResNet18 Binary Classifier

Disclaimer: This is a research tool and not a substitute for professional medical diagnosis.`;
  
  return new Blob([reportContent], { type: 'text/plain' });
};

/**
 * Get analysis history from local storage
 * @returns {Promise<Array>} List of previous analyses
 */
export const getAnalysisHistory = async () => {
  const history = localStorage.getItem('analysisHistory');
  if (history) {
    return JSON.parse(history);
  }
  return [];
};

/**
 * Mock function to validate file format
 * @param {File} file - The file to validate
 * @returns {boolean} Whether the file format is supported
 */
export const validateFileFormat = (file) => {
  const supportedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/dicom',
  ];
  
  const supportedExtensions = ['.png', '.jpg', '.jpeg', '.dcm'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  return supportedTypes.includes(file.type) || supportedExtensions.includes(fileExtension);
};

/**
 * Save analysis to history
 * @param {Object} analysisData - The analysis data to save
 */
export const saveAnalysisToHistory = (analysisData, fileName) => {
  const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
  
  // Safely get detection and classification values
  const detectionValue = analysisData.detection?.value || 'Unknown';
  const classificationValue = analysisData.classification?.value || 'Unknown';
  const confidence = analysisData.detection?.confidence || analysisData.classification?.confidence || 0;
  
  const newEntry = {
    id: `analysis_${Date.now()}`,
    fileName: fileName,
    uploadDate: new Date().toISOString(),
    result: `${detectionValue} - ${classificationValue}`,
    confidence: confidence,
    data: analysisData,
  };
  history.unshift(newEntry);
  // Keep only last 50 analyses
  const limitedHistory = history.slice(0, 50);
  localStorage.setItem('analysisHistory', JSON.stringify(limitedHistory));
  localStorage.setItem('lastAnalysis', JSON.stringify(analysisData));
};

