// Mock API functions for BRAINet frontend
// These would be replaced with actual API calls in production

/**
 * Mock function to upload MRI scan
 * @param {File} file - The MRI scan file
 * @returns {Promise<Object>} Upload response
 */
export const uploadMRI = async (file) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    fileId: `file_${Date.now()}`,
    fileName: file.name,
    fileSize: file.size,
    uploadTime: new Date().toISOString(),
  };
};

/**
 * Mock function to analyze MRI scan
 * @param {string} fileId - The uploaded file ID
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeScan = async (fileId) => {
  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock analysis results
  const tumorTypes = ['Glioma', 'Meningioma', 'Pituitary', 'No Tumor'];
  const hasTumor = Math.random() > 0.3; // 70% chance of tumor detection
  
  const detectionResult = hasTumor ? 'Tumor Present' : 'No Tumor Detected';
  const classificationResult = hasTumor 
    ? tumorTypes[Math.floor(Math.random() * 3)] // Random tumor type
    : 'No Tumor';
  
  const confidence = Math.floor(Math.random() * 30) + 70; // 70-100% confidence
  
  return {
    success: true,
    analysisId: `analysis_${Date.now()}`,
    results: {
      detection: {
        value: detectionResult,
        confidence: confidence,
        timestamp: new Date().toISOString(),
      },
      classification: {
        value: classificationResult,
        confidence: hasTumor ? Math.floor(Math.random() * 25) + 75 : 95,
        timestamp: new Date().toISOString(),
      },
      segmentation: {
        maskUrl: '/api/segmentation-mask', // Placeholder URL
        overlayUrl: '/api/segmentation-overlay', // Placeholder URL
        timestamp: new Date().toISOString(),
      },
    },
    processingTime: '2.3 seconds',
    modelVersion: 'BRAINet v2.1',
  };
};

/**
 * Mock function to fetch analysis report
 * @param {string} analysisId - The analysis ID
 * @returns {Promise<Object>} Report data
 */
export const fetchReport = async (analysisId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    reportId: analysisId,
    analysisData: {
      detection: {
        value: 'Tumor Present',
        confidence: 87,
      },
      classification: {
        value: 'Glioma',
        confidence: 82,
      },
      segmentation: {
        maskGenerated: true,
        overlayGenerated: true,
      },
    },
    metadata: {
      scanDate: new Date().toISOString(),
      analysisDate: new Date().toISOString(),
      patientId: 'PATIENT_001', // Mock patient ID
      scanType: 'T1-weighted MRI',
    },
    recommendations: [
      'Further imaging recommended',
      'Consult with neurosurgeon',
      'Follow-up scan in 3 months',
    ],
  };
};

/**
 * Mock function to download PDF report
 * @param {string} reportId - The report ID
 * @returns {Promise<Blob>} PDF blob
 */
export const downloadPDFReport = async (reportId) => {
  // Simulate PDF generation delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real implementation, this would generate an actual PDF
  // For now, we'll create a mock blob
  const mockPDFContent = `BRAINet Analysis Report
Report ID: ${reportId}
Generated: ${new Date().toLocaleString()}

Analysis Results:
- Tumor Detection: Tumor Present (87% confidence)
- Tumor Type: Glioma (82% confidence)
- Segmentation: Completed

Disclaimer: This is a research tool and not a substitute for professional medical diagnosis.`;
  
  return new Blob([mockPDFContent], { type: 'application/pdf' });
};

/**
 * Mock function to get analysis history
 * @returns {Promise<Array>} List of previous analyses
 */
export const getAnalysisHistory = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: 'analysis_001',
      fileName: 'brain_scan_001.jpg',
      uploadDate: '2024-01-15T10:30:00Z',
      result: 'Tumor Present - Glioma',
      confidence: 89,
    },
    {
      id: 'analysis_002',
      fileName: 'mri_scan_002.png',
      uploadDate: '2024-01-14T14:20:00Z',
      result: 'No Tumor Detected',
      confidence: 94,
    },
    {
      id: 'analysis_003',
      fileName: 'patient_scan_003.dcm',
      uploadDate: '2024-01-13T09:15:00Z',
      result: 'Tumor Present - Meningioma',
      confidence: 76,
    },
  ];
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
 * Mock function to get system status
 * @returns {Promise<Object>} System status information
 */
export const getSystemStatus = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    status: 'operational',
    models: {
      detection: 'active',
      classification: 'active',
      segmentation: 'active',
    },
    queue: {
      pending: 3,
      processing: 1,
    },
    uptime: '99.9%',
    lastUpdate: new Date().toISOString(),
  };
};

