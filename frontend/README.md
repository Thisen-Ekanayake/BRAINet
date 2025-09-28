# BRAINet Frontend

A modern, responsive React frontend for BRAINet - Brain Radiology Analysis with Intelligent Networks.

## Features

- **Modern UI/UX**: Clean, medical-themed design with light/dark mode support
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode**: Persistent dark mode toggle with localStorage
- **File Upload**: Drag-and-drop MRI scan upload with format validation
- **Analysis Results**: Real-time display of detection, classification, and segmentation results
- **Report Generation**: Professional PDF report generation with BRAINet branding
- **Analysis History**: Track and view previous analysis results

## Pages

1. **Landing Page**: Project branding, features overview, and call-to-action
2. **Upload Page**: MRI scan upload and analysis interface
3. **Reports Page**: Detailed analysis results and report generation
4. **About Page**: Technology overview, dataset credits, and ethical disclaimers

## Technology Stack

- **React 18**: Modern functional components with hooks
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework with custom medical theme
- **Context API**: Dark mode state management
- **Mock API**: Placeholder API functions for development

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Navigation bar with dark mode toggle
│   ├── UploadBox.js    # File upload component
│   ├── ResultCard.js   # Analysis result display
│   ├── ReportPreview.js # Report generation component
│   └── DarkModeToggle.js # Dark mode switch
├── contexts/           # React contexts
│   └── DarkModeContext.js # Dark mode state management
├── pages/              # Page components
│   ├── LandingPage.js  # Home page
│   ├── UploadPage.js   # Upload and analysis page
│   ├── ReportsPage.js  # Results and reports page
│   └── AboutPage.js    # About and information page
├── services/           # API and utility functions
│   └── api.js          # Mock API functions
├── App.js              # Main app component with routing
├── index.js            # React app entry point
└── index.css           # Global styles and Tailwind imports
```

## Customization

### Colors and Theme

The app uses a custom medical-themed color palette defined in `tailwind.config.js`:

- **Primary**: Teal/cyan colors for medical feel
- **Light Mode**: White backgrounds with soft blue highlights
- **Dark Mode**: Dark gray/black backgrounds with teal accents

### Components

All components are modular and reusable. Key components include:

- `UploadBox`: Handles file upload with drag-and-drop
- `ResultCard`: Displays analysis results with confidence scores
- `ReportPreview`: Shows detailed analysis reports
- `DarkModeToggle`: Persistent dark mode switching

## API Integration

The app includes mock API functions in `src/services/api.js` that simulate:

- File upload (`uploadMRI`)
- Scan analysis (`analyzeScan`)
- Report generation (`fetchReport`, `downloadPDFReport`)
- Analysis history (`getAnalysisHistory`)

Replace these with actual API calls when integrating with the backend.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is part of the BRAINet research initiative. See the main project LICENSE file for details.

