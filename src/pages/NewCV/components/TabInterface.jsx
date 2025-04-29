import React from 'react';
import AIAssistant from './AIAssistant';
import HintPanel from './HintPanel';

const TabInterface = ({ currentStep, currentAdditionalSection, formData, mode }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-h-[calc(100vh-200px)] border border-black-200">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {mode === 'hints' ? 'Hints & Tips' : 'AI Assistant'}
        </h3>
      </div>
      
      {/* Content */}
      <div 
        className="p-4 overflow-y-auto w-full" 
        style={{ 
          height: mode === 'ai' ? 'fit-content' : 'calc(100vh - 280px)',
          maxHeight: 'calc(100vh - 280px)'
        }}
      >
        {mode === 'hints' ? (
          <HintPanel 
            currentStep={currentStep} 
            currentAdditionalSection={currentAdditionalSection} 
          />
        ) : (
          <AIAssistant 
            currentStep={currentStep} 
            currentAdditionalSection={currentAdditionalSection}
            formData={formData}
            preventAutoScroll={true}
          />
        )}
      </div>
    </div>
  );
};

export default TabInterface; 