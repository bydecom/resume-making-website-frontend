import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CVPreview from '../pages/NewCV/components/CVPreview';
import { FaExchangeAlt, FaLightbulb } from 'react-icons/fa';
import '../pages/NewCV/lib/input-styles.css';
import { templates, getTemplateById } from '../templates';

const CVPreviewModal = ({ 
  isOpen, 
  onClose, 
  formData
}) => {
  const navigate = useNavigate();
  const initialTemplateId = formData.template?.id || Object.keys(templates)[0];
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  
  // Template tips
  const templateTips = [
    "Professional template is perfect for traditional industries like banking, law, and consulting",
    "Modern template works great for tech, creative, and startup roles",
    "Simple template helps your content stand out and is ATS-friendly",
    "Each template is designed to highlight different aspects of your experience"
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

  // Tạo bản sao của formData với template được chọn
  const previewData = {
    ...formData,
    template: { id: selectedTemplateId }
  };

  // Áp dụng template được chọn vào formData chính
  const applyTemplate = () => {
    onClose(selectedTemplateId);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white flex-shrink-0 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Choose Template</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onClose()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={applyTemplate}
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
                      <div className="text-xs text-gray-500 mt-0.5">
                        {template.description}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Template Tips Section */}
                <div className="flex-shrink-0 mt-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-700 mb-2">Need more templates?</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    We've selected the 5 best CV templates for you. Want more options? Choose how you'd like to view them!
                  </p>
                  <div className="flex gap-3">
                    <button 
                      className="flex-1 bg-white text-blue-600 py-2 px-4 rounded-md border border-blue-600 hover:bg-blue-50 transition-colors text-sm"
                      onClick={() => setShowAllTemplates(true)}
                    >
                      Show Here
                    </button>
                    <button 
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                      onClick={() => navigate('/templates')}
                    >
                      Go to Templates
                    </button>
                  </div>
                </div>
              </div>
                {/* Remove the old Browse More Button */}
              </div>
            </div>
          </div>
          
          {/* Middle Column - CV Preview */}
          <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
            <div className="max-w-[850px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="cv-wrapper">
                <CVPreview formData={previewData} />
              </div>
            </div>
          </div>
          
          {/* Right Column - CV Tips */}
          <div className="w-1/4 border-l bg-gray-50 flex flex-col">
            {/* Fixed Header */}
            <div className="flex-shrink-0 p-6 pb-3 bg-gray-50 border-b">
              <div className="flex items-center text-yellow-600">
                <FaLightbulb className="mr-2" />
                <h3 className="text-lg font-medium">CV Writing Tips</h3>
              </div>
            </div>
            
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-hidden flex flex-col p-6 pt-3">
              {/* Tips Section */}
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {tips.map((tip, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 hover:shadow-md transition-shadow"
                    >
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fixed Bottom Section */}
              <div className="flex-shrink-0 mt-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-700 mb-2">Need more help?</h4>
                  <p className="text-sm text-gray-700">
                    Our AI assistant can provide personalized advice for your CV. Click the AI Assistant tab in the main editor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVPreviewModal;