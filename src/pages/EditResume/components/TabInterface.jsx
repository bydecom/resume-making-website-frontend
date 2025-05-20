import React from 'react';
import AIAssistant from './AIAssistant';
import HintPanel from './HintPanel';
import { FiMessageSquare, FiHelpCircle } from 'react-icons/fi';

const TabInterface = ({ currentStep, currentAdditionalSection, formData, mode, tips }) => {
  // Determine which mode to use for AIAssistant
  const aiMode = mode === 'ai' ? 'cv' : mode; // Default to 'cv' mode if mode is 'ai'
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-h-[calc(100vh-200px)] border border-gray-200">
      {/* Header */}
      <div className="bg-blue-600 px-4 py-3 border-b border-blue-700 text-white">
        <h3 className="text-lg font-medium flex items-center">
          {mode === 'hints' ? (
            <>
              <FiHelpCircle className="mr-2" />
              Hints & Tips
            </>
          ) : (
            <>
              <FiMessageSquare className="mr-2" />
              AI Assistant
            </>
          )}
        </h3>
      </div>
      
      {/* Content */}
      <div 
        className="h-fit w-full" 
        style={{ 
          height: mode === 'ai' ? 'fit-content' : 'calc(100vh - 280px)',
          maxHeight: 'fit-content'
        }}
      >
        {mode === 'hints' ? (
          <HintPanel 
            currentStep={currentStep} 
            currentAdditionalSection={currentAdditionalSection}
            tips={tips}
          />
        ) : (
          <AIAssistant 
            currentStep={currentStep} 
            currentAdditionalSection={currentAdditionalSection}
            formData={formData}
            preventAutoScroll={true}
            mode={aiMode}
          />
        )}
      </div>
    </div>
  );
};

export default TabInterface; 