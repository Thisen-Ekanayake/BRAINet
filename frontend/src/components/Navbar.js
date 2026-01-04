import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
  const location = useLocation();
  const { isDarkMode } = useDarkMode();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/upload', label: 'Analysis' },
    { path: '/reports', label: 'Reports' },
    { path: '/about', label: 'About' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    } border-b shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
              <img
                src="https://brainet-assets.thiesnekanayake.me/brain.png"
                alt="BRAINet"
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              BRAINet
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? isDarkMode
                      ? 'bg-teal-600 text-white'
                      : 'bg-teal-100 text-teal-700'
                    : isDarkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            
            {/* Mobile menu button */}
            <button
              className={`md:hidden p-2 rounded-md ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

