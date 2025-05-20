import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

import { FaExchangeAlt, FaLightbulb } from 'react-icons/fa';
import { defaultTemplateData } from './templateDefaultData';
import { templates, getTemplateById } from '../../../templates';

import MinimalistThumbnail from '../../../assets/cv-thumnails/minimalist.jpg';
import ModernThumbnail from '../../../assets/cv-thumnails/modern.jpg';
import ProfessionalBlueThumbnail from '../../../assets/cv-thumnails/professional-blue.jpg';
import ProfessionalCVThumbnail from '../../../assets/cv-thumnails/professional-cv.jpg';

// Map of template IDs to imported thumbnail images
const thumbnailMap = {
  'minimalist': MinimalistThumbnail,
  'modern': ModernThumbnail, 
  'professionalBlue': ProfessionalBlueThumbnail,
  'professionalCV': ProfessionalCVThumbnail
};

const TemplatePreview = ({ template, isOpen, onClose }) => {
  // Extract template details from props
  const navigate = useNavigate();

  const { name, thumbnailName, previewImage, id } = template || {};
  
  // Find the initial template ID
  const initialTemplateId = id || 
    (name ? Object.values(templates).find(t => t.name === name)?.id : null) || 
    Object.keys(templates)[0];
  
  // Use state to track the selected template
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId);
  
  if (!isOpen) return null;
  
  // Get the actual template component from templates
  const templateInfo = getTemplateById(selectedTemplateId);
  const TemplateComponent = templateInfo.component;
  
  // Get the thumbnail image for the selected template
  const getThumbnailForTemplate = (templateId) => {
    return thumbnailMap[templateId] || null;
  };
  
  // Tips for CV writing
  const tips = [
    "Keep your CV concise and relevant to the job you're applying for.",
    "Use action verbs to describe your achievements and responsibilities.",
    "Quantify your achievements with numbers when possible.",
    "Proofread carefully to avoid spelling and grammar errors."
  ];
  
  // Template tips
  const templateTips = [
    "Professional template is perfect for traditional industries like banking, law, and consulting",
    "Modern template works great for tech, creative, and startup roles",
    "Simple template helps your content stand out and is ATS-friendly"
  ];

  // Create a copy of formData with selected template
  const previewData = {
    ...defaultTemplateData,
    template: { id: selectedTemplateId }
  };

  return (
    <div className="fixed inset-0 bg-white z-[10001] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white flex-shrink-0 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Choose Template</h2>
        <div className="flex items-center gap-4">
        <button 
            onClick={(e) => {
                e.stopPropagation(); 
                onClose();          
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
            Cancel
        </button>

          <button 
            onClick={(e) => {
              console.log('Use this template clicked', selectedTemplateId);
              
              // Store the template selection in localStorage as fallback
              localStorage.setItem('selectedTemplate', selectedTemplateId);
              localStorage.setItem('scrollToBottom', 'true');
              
              // Create the URL for the Templates page with the template ID
              const templatesUrl = `/templates?template=${selectedTemplateId}`;
              
              e.stopPropagation();
              
              // Close the preview modal first
              onClose();
              
              // Navigate to the Templates page with a slight delay to ensure the modal is closed
              // Use React Router's navigate function which properly handles URL parameters
              setTimeout(() => {
                // Instead of just navigating, we'll force a complete page reload
                // This ensures the URL parameters are properly processed
                window.location.href = templatesUrl;
                
                // Alternatively: navigate with replace to ensure clean navigation
                // navigate(templatesUrl, { replace: true });
              }, 100);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            Apply Template
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Left Column - Template Selection */}
          <div className="w-1/4 border-r bg-gray-50 flex flex-col">
            {/* Fixed Header */}
            <div className="flex-shrink-0 p-6 pb-3 bg-gray-50 border-b">
              <div className="flex items-center text-blue-600">
                <FaExchangeAlt className="mr-2" />
                <h3 className="text-lg font-medium">Choose Template</h3>
              </div>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-hidden flex flex-col p-6 pt-3">
              {/* Templates Section */}
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-3 px-0.5">
                  {Object.values(templates).map(template => (
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
                      <div className="text-xs text-gray-500 mt-0.5">
                        {template.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template Tips Section */}
              <div className="flex-shrink-0 mt-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-700 mb-2">Need more templates?</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    We've selected the best CV templates for you. Choose the one that best fits your career goals!
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Middle Column - CV Preview */}
          <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
            <div className="max-w-[850px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="cv-wrapper">
                {/* Render the actual template component with default data */}
                <TemplateComponent formData={previewData} />
              </div>
            </div>
          </div>
          
          {/* Right Column - Template Details */}
          <div className="w-1/4 border-l bg-gray-50 flex flex-col">
            {/* Fixed Header */}
            <div className="flex-shrink-0 p-6 pb-3 bg-gray-50 border-b">
              <div className="flex items-center text-blue-600">
                <FaLightbulb className="mr-2" />
                <h3 className="text-lg font-medium">Template Details</h3>
              </div>
            </div>
            
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-hidden flex flex-col p-6 pt-3">
              {/* Template Image */}
              {thumbnailMap[selectedTemplateId] && (
                <div className="mb-4">
                  <img 
                    src={thumbnailMap[selectedTemplateId]} 
                    alt={`${templateInfo.name} template thumbnail`}
                    className="w-full object-contain border rounded"
                  />
                </div>
              )}
              
              <div className="font-medium text-lg text-gray-900 mb-2">{templateInfo.name}</div>
              <div className="text-sm text-gray-600 mb-4">
                {templateInfo.description}
              </div>
              
              {/* Template Tips Section */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Template Tips</h4>
                <div className="space-y-3">
                  {templateTips.map((tip, index) => (
                    <div 
                      key={index} 
                      className="p-3 bg-blue-50 rounded-lg border border-blue-100"
                    >
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CV Tips Section */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-2">CV Writing Tips</h4>
                <div className="space-y-3">
                  {tips.map((tip, index) => (
                    <div 
                      key={index} 
                      className="p-3 bg-yellow-50 rounded-lg border border-yellow-100"
                    >
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview; 