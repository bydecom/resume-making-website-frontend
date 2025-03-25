import React, { useState } from 'react';
import { FiMessageSquare, FiInfo, SlSizeFullscreen,SlSizeActualHi, ArrowTopRightOnSquare } from 'react-icons/fi';
import AIAssistant from './AIAssistant';
import HintPanel from './HintPanel';

const TabInterface = ({ currentStep, currentAdditionalSection, formData }) => {
  const [activeTab, setActiveTab] = useState('hints'); // 'hints' or 'assistant'

  // Đơn giản hóa hoàn toàn hàm chuyển tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-6 max-h-[calc(100vh-160px)] w-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 w-full">
        <button
          type="button"
          onClick={() => handleTabChange('hints')}
          className={`flex items-center justify-center py-3 px-4 text-sm font-medium w-1/2 ${
            activeTab === 'hints'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FiInfo className="mr-2" />
          Hints
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('assistant')}
          className={`flex items-center justify-center py-3 px-4 text-sm font-medium w-1/2 ${
            activeTab === 'assistant'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FiMessageSquare className="mr-2" />
          AI Assistant
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 overflow-hidden w-full" style={{ height: activeTab === 'assistant' ? 'fit-content' : 'auto' }}>
        {activeTab === 'hints' ? (
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