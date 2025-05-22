import React, { useState, useEffect, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { getTemplateById, getDefaultTemplate, templates } from '../templates';
import { exportResumeToPDF } from '../services/pdfExportService';
import { exportResumeToDocx } from '../services/docxExportService';
import apiInstance from '../utils/axios';

// Internal ResumePreview component to avoid external dependencies
const ResumePreview = ({ formData }) => {
  const [processedData, setProcessedData] = useState(formData);

  // Update processedData when formData changes
  useEffect(() => {
    console.log("Resume Preview received new data:", formData);
    setProcessedData(formData);
  }, [formData]);

  // Determine which template to use
  const templateId = processedData?.template?.id;
  const template = templateId ? getTemplateById(templateId) : getDefaultTemplate();
  const TemplateComponent = template.component;

  // Render the chosen template with resume data
  return <TemplateComponent formData={processedData} />;
};

const ResumeDownloadModal = ({ isOpen, onClose, template, formData }) => {
  // Use template ID from props or formData
  const initialTemplateId = template?.id || formData?.template?.id || Object.keys(templates)[0];
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf'); // Add exportFormat state
  
  // Create ref to access the Resume element
  const resumeElementRef = useRef(null);
  
  // Update selectedTemplateId when template prop changes
  useEffect(() => {
    if (template?.id) {
      setSelectedTemplateId(template.id);
    }
  }, [template]);

  // Monitor font loading status
  useEffect(() => {
    // Ensure all fonts are loaded before exporting PDF
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        console.log('All fonts are loaded and ready');
        setFontsReady(true);
      });
    } else {
      // Fallback for browsers that don't support document.fonts
      setTimeout(() => {
        setFontsReady(true);
      }, 2000);
    }
  }, [isOpen]);

  const downloadTips = [
    "Your Resume can be downloaded as PDF or DOCX",
    "Double-check the formatting in the preview",
    "PDF format retains exact formatting for online applications",
    "DOCX format allows easy editing for customization",
    "Save different versions for different job applications",
    "Ensure your contact information is correct",
    "Check if all sections are properly aligned"
  ];

  const handleDownload = async () => {
    if (!fontsReady) {
      alert('Fonts are still loading. Please wait a moment and try again.');
      return;
    }

    try {
      // Log the download action first
      const resumeId = formData._id || formData.id;
      if (resumeId) {
        try {
          await apiInstance.get(`/api/downloads/resume/${resumeId}`, {
            params: {
              format: exportFormat,
              templateId: selectedTemplateId,
              templateName: templates[selectedTemplateId]?.name || 'Default Template'
            }
          });
          console.log('Resume download logged successfully');
        } catch (error) {
          console.error('Error logging resume download:', error);
          // Continue with download even if logging fails
        }
      }

      // Generate and download the file based on selected format
      if (exportFormat === 'pdf') {
        await exportResumeToPDF({
          resumeElement: resumeElementRef.current,
          formData,
          onStatusChange: setIsDownloading,
          onError: (error) => {
            alert('Failed to generate PDF. Please try again.');
          }
        });
      } else if (exportFormat === 'docx') {
        await exportResumeToDocx({
          formData,
          onStatusChange: setIsDownloading,
          onError: (error) => {
            alert('Failed to generate DOCX. Please try again.');
          }
        });
      }
    } catch (error) {
      console.error(`Error in handleDownload (${exportFormat}):`, error);
    }
  };

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  const previewData = {
    ...formData,
    template: { id: selectedTemplateId }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white flex-shrink-0 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Download Resume</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          
          {/* Format Selection Dropdown */}
          <div className="relative">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors appearance-none pr-8"
            >
              <option value="pdf">PDF Format</option>
              <option value="docx">DOCX Format</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <button 
            onClick={handleDownload}
            disabled={isDownloading || !fontsReady}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 ${
              (isDownloading || !fontsReady) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {/* Use SVG instead of FontAwesome icon to ensure display in PDF */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {isDownloading ? 'Generating file...' : (!fontsReady ? 'Loading Fonts...' : `Download ${exportFormat.toUpperCase()}`)}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Left Column - Template Selection */}
          <div className="w-1/4 border-r bg-gray-50 flex flex-col">
            <div className="flex-shrink-0 p-6 pb-3 bg-gray-50 border-b">
              <div className="flex items-center text-blue-600">
                {/* Use SVG instead of FontAwesome icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                </svg>
                <h3 className="text-lg font-medium">Select Template</h3>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col p-6 pt-3">
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-3 px-0.5">
                  {Object.values(showAllTemplates ? templates : Object.fromEntries(
                    Object.entries(templates).slice(0, 5)
                  )).map(template => (
                    <div 
                      key={template.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:z-10 ${
                        selectedTemplateId === template.id 
                          ? 'border-blue-500 bg-blue-50 shadow-sm' 
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                      }`}
                      style={{
                        transform: selectedTemplateId === template.id ? 'scale(1.01)' : 'scale(1)',
                        transformOrigin: 'center'
                      }}
                      onClick={() => setSelectedTemplateId(template.id)}
                    >
                      <div className="font-medium text-sm text-gray-900">{template.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{template.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Middle Column - Resume Preview */}
          <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
            <div className="max-w-[850px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="resume-wrapper" ref={resumeElementRef}>
                <ResumePreview formData={previewData} />
              </div>
            </div>
          </div>
          
          {/* Right Column - Download Tips */}
          <div className="w-1/4 border-l bg-gray-50 flex flex-col">
            <div className="flex-shrink-0 p-6 pb-3 bg-gray-50 border-b">
              <div className="flex items-center text-yellow-600">
                {/* Use SVG instead of FontAwesome icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
                <h3 className="text-lg font-medium">Download Tips</h3>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col p-6 pt-3">
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {downloadTips.map((tip, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 hover:shadow-md transition-shadow"
                    >
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-shrink-0 mt-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-700 mb-2">Ready to download?</h4>
                  <p className="text-sm text-gray-700">
                    Select your preferred format and click the download button to save your Resume.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for PDF export */}
      <style jsx global>{`
        /* Styles specifically applied when exporting PDF */
        .exporting-pdf .fas,
        .exporting-pdf .fab,
        .exporting-pdf .far {
          /* Increase visibility of icons when exporting */
          font-weight: 900 !important;
          font-family: 'Font Awesome 5 Free' !important;
        }
        
        /* Increase icon size when exporting to ensure clearer display */
        .exporting-pdf .fas:before,
        .exporting-pdf .fab:before,
        .exporting-pdf .far:before {
          font-size: 1.2em !important;
        }
      `}</style>
    </div>
  );
};

export default ResumeDownloadModal;
