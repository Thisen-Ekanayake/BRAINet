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
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;
  
  // Helper function to add image
  const addImage = async (base64Data, label, width = 80) => {
    if (!base64Data) return yPos;
    
    // Check if we need a new page
    if (yPos + width + 20 > pageHeight - margin) {
      pdf.addPage();
      yPos = margin;
    }
    
    try {
      // Create image element to get dimensions
      const img = new Image();
      img.src = `data:image/png;base64,${base64Data}`;
      
      await new Promise((resolve, reject) => {
        img.onload = () => {
          try {
            const aspectRatio = img.height / img.width;
            const imgHeight = width * aspectRatio;
            
            // Center the image
            const xPos = (pageWidth - width) / 2;
            
            // Add image using base64 data directly
            pdf.addImage(`data:image/png;base64,${base64Data}`, 'PNG', xPos, yPos, width, imgHeight);
            yPos += imgHeight + 5;
            
            // Add label
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text(label, pageWidth / 2, yPos, { align: 'center' });
            yPos += 8;
            resolve();
          } catch (error) {
            console.error('Error adding image to PDF:', error);
            reject(error);
          }
        };
        img.onerror = () => {
          console.error('Error loading image');
          reject(new Error('Failed to load image'));
        };
      });
    } catch (error) {
      console.error('Error adding image:', error);
    }
    
    return yPos;
  };
  
  // Title
  pdf.setFontSize(20);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont(undefined, 'bold');
  pdf.text('BRAINet Analysis Report', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;
  
  // Date and Time
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const timeStr = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated: ${dateStr} at ${timeStr}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // Analysis Results Section
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Analysis Results', margin, yPos);
  yPos += 8;
  
  pdf.setFontSize(11);
  pdf.setFont(undefined, 'normal');
  
  // Tumor Detection
  const detectionValue = analysisData?.detection?.value || 'N/A';
  const detectionConfidence = analysisData?.detection?.confidence || 0;
  pdf.text(`Tumor Detection: ${detectionValue}`, margin, yPos);
  yPos += 6;
  pdf.text(`Confidence: ${detectionConfidence}%`, margin + 5, yPos);
  yPos += 8;
  
  // Tumor Type (if present)
  const classificationValue = analysisData?.classification?.value || 'N/A';
  const classificationConfidence = analysisData?.classification?.confidence || 0;
  
  if (detectionValue === 'Tumor Present' && classificationValue !== 'notumor') {
    pdf.text(`Tumor Type: ${classificationValue.charAt(0).toUpperCase() + classificationValue.slice(1)}`, margin, yPos);
    yPos += 6;
    pdf.text(`Classification Confidence: ${classificationConfidence}%`, margin + 5, yPos);
    yPos += 10;
  } else {
    pdf.text(`Classification: ${classificationValue.charAt(0).toUpperCase() + classificationValue.slice(1)}`, margin, yPos);
    yPos += 10;
  }
  
  // Original MRI Image
  if (analysisData?.visualizations?.original) {
    if (yPos + 100 > pageHeight - margin) {
      pdf.addPage();
      yPos = margin;
    }
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('Original MRI Image', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    yPos = await addImage(analysisData.visualizations.original, 'Original MRI Scan', 80);
    yPos += 5;
  }
  
  // GradCAM Heatmap with Bounding Box
  if (analysisData?.visualizations?.bounding_box) {
    if (yPos + 100 > pageHeight - margin) {
      pdf.addPage();
      yPos = margin;
    }
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('GradCAM Heatmap with Bounding Box', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    yPos = await addImage(analysisData.visualizations.bounding_box, 'GradCAM Visualization with Bounding Box', 80);
    yPos += 5;
  }
  
  // Disclaimer Section (Highlighted)
  if (yPos + 60 > pageHeight - margin) {
    pdf.addPage();
    yPos = margin;
  }
  
  yPos += 10;
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(200, 0, 0); // Red color for emphasis
  pdf.text('IMPORTANT DISCLAIMER', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;
  
  // Draw highlighted box
  const disclaimerY = yPos - 2;
  const disclaimerHeight = 35;
  pdf.setDrawColor(200, 0, 0);
  pdf.setLineWidth(0.5);
  pdf.rect(margin, disclaimerY, contentWidth, disclaimerHeight);
  
  // Fill with light red background
  pdf.setFillColor(255, 240, 240);
  pdf.rect(margin, disclaimerY, contentWidth, disclaimerHeight, 'F');
  pdf.rect(margin, disclaimerY, contentWidth, disclaimerHeight); // Redraw border
  
  // Disclaimer text
  pdf.setFontSize(9);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(0, 0, 0);
  
  const disclaimerText = [
    'BRAINet is designed as a research and educational tool to advance medical AI',
    'capabilities. It is not intended to replace professional medical diagnosis,',
    'treatment, or clinical decision-making. All results should be interpreted by',
    'qualified healthcare professionals, and the system should be used in',
    'conjunction with established medical protocols and guidelines.',
    '',
    'Important: This tool is for research purposes only and should not be used',
    'as the sole basis for medical decisions.'
  ];
  
  let disclaimerYPos = disclaimerY + 5;
  disclaimerText.forEach(line => {
    pdf.text(line, margin + 2, disclaimerYPos);
    disclaimerYPos += 4;
  });
  
  yPos = disclaimerY + disclaimerHeight + 10;
  
  // Generate PDF blob
  const pdfBlob = pdf.output('blob');
  return pdfBlob;
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

