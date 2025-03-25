import React, { useState } from 'react';
import CVPreview from '../pages/NewCV/components/CVPreview';
import { FaExchangeAlt, FaLightbulb } from 'react-icons/fa';
import '../pages/NewCV/lib/input-styles.css';

const CVPreviewModal = ({ 
  isOpen, 
  onClose, 
  formData
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  
  // Danh sách các template mẫu
  const templates = [
    { id: 'template1', name: 'Professional' },
    { id: 'template2', name: 'Modern' },
    { id: 'template3', name: 'Creative' },
    { id: 'template4', name: 'Simple' },
    { id: 'template5', name: 'Elegant' }
  ];
  
  // Danh sách các lời khuyên
  const tips = [
    "Keep your CV concise and relevant to the job you're applying for.",
    "Use action verbs to describe your achievements and responsibilities.",
    "Quantify your achievements with numbers when possible.",
    "Proofread carefully to avoid spelling and grammar errors.",
    "Use a professional email address.",
    "Include relevant skills and certifications.",
    "Tailor your CV for each job application.",
    "Use a clean, professional layout with consistent formatting."
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full h-full max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">CV Preview</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-grow overflow-auto flex">
          {/* Left sidebar - Template Selection - 1/4 width */}
          <div className="w-1/4 border-r p-4 overflow-y-auto">
            <div className="flex items-center mb-4">
              <FaExchangeAlt className="text-blue-600 mr-2" />
              <h3 className="text-lg font-medium">Choose Template</h3>
            </div>
            
            <div className="space-y-3">
              {templates.map(template => (
                <div 
                  key={template.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate === template.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Click to preview this template
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Apply Template
              </button>
            </div>
          </div>
          
          {/* Middle section - CV Preview - 2/4 width */}
          <div className="w-2/4 p-4 overflow-y-auto flex justify-center bg-gray-50">
            <div className="max-w-[600px] w-full bg-white shadow-md rounded-lg overflow-hidden cv-wrapper">
              <CVPreview formData={formData} />
            </div>
          </div>
          
          {/* Right sidebar - CV Tips - 1/4 width */}
          <div className="w-1/4 border-l p-4 overflow-y-auto">
            <div className="flex items-center mb-4">
              <FaLightbulb className="text-yellow-500 mr-2" />
              <h3 className="text-lg font-medium">CV Tips</h3>
            </div>
            
            <div className="space-y-4">
              {tips.map((tip, index) => (
                <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-700 mb-2">Need more help?</h4>
              <p className="text-sm text-gray-700">
                Our AI assistant can provide personalized advice for your CV. Click the AI Assistant tab in the main editor.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t p-4 flex justify-between">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Download CV
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVPreviewModal;