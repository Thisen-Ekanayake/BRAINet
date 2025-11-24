import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReportPreview from '../components/ReportPreview';
import ResultCard from '../components/ResultCard';
import { fetchReport, downloadPDFReport, getAnalysisHistory } from '../services/api';
import { useDarkMode } from '../contexts/DarkModeContext';

const ReportsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Get analysis results from navigation state or fetch from API
    const resultsFromState = location.state?.analysisResults;
    
    if (resultsFromState) {
      setAnalysisData(resultsFromState);
      setIsLoading(false);
    } else {
      // Mock fetching report data
      fetchMockReport();
    }
    
    // Load analysis history
    loadAnalysisHistory();
  }, [location.state]);

  const fetchMockReport = async () => {
    try {
      // Try to fetch from API (for future use)
      const reportData = await fetchReport();
      if (reportData && reportData.results) {
        setAnalysisData(reportData.results);
      }
    } catch (error) {
      console.error('Failed to fetch report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnalysisHistory = async () => {
    try {
      const history = await getAnalysisHistory();
      setAnalysisHistory(history);
    } catch (error) {
      console.error('Failed to load analysis history:', error);
    }
  };

  const handleDownloadPDF = async () => {
    if (!analysisData) return;
    
    setIsDownloading(true);
    try {
      const pdfBlob = await downloadPDFReport(analysisData);
      
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `BRAINet_Report_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Failed to download PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Loading analysis report...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Analysis Reports
          </h1>
          <p className={`text-xl ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Comprehensive analysis results and detailed reports
          </p>
        </div>

        {/* Quick Stats */}
        {analysisData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <ResultCard
              title="Tumor Detection"
              value={analysisData.detection.value}
              confidence={analysisData.detection.confidence}
              type="detection"
            />
            <ResultCard
              title="Tumor Classification"
              value={analysisData.classification.value}
              confidence={analysisData.classification.confidence}
              type="classification"
            />
          </div>
        )}

        {/* Main Report */}
        {analysisData && (
          <div className="mb-12">
            <ReportPreview analysisData={analysisData} />
          </div>
        )}

        {/* Analysis History */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Analysis History
            </h2>
            <button
              onClick={() => navigate('/upload')}
              className="btn-secondary"
            >
              New Analysis
            </button>
          </div>

          {analysisHistory.length > 0 ? (
            <div className="space-y-4">
              {analysisHistory.map((analysis) => (
                <div
                  key={analysis.id}
                  className={`p-4 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  } transition-colors duration-200 cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {analysis.fileName}
                      </h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {new Date(analysis.uploadDate).toLocaleDateString()} • {analysis.result}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {analysis.confidence}%
                      </p>
                      <p className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        confidence
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className={`w-16 h-16 mx-auto mb-4 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className={`text-lg ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                No analysis history found
              </p>
              <p className={`text-sm mt-2 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Upload your first MRI scan to get started
              </p>
            </div>
          )}
        </div>

        {/* Download Section */}
        <div className="mt-12 text-center">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className={`btn-primary text-lg px-8 py-4 ${
              isDownloading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isDownloading ? (
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating PDF...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download Complete Report</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

