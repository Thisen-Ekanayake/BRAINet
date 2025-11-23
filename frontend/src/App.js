import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DarkModeProvider } from './contexts/DarkModeContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import ReportsPage from './pages/ReportsPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </DarkModeProvider>
  );
}

export default App;

