import React, { useState } from 'react';

const CVAssessment = ({ assessment }) => {
  const [activeTab, setActiveTab] = useState('strengths');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'strengths':
        return (
          <ul className="space-y-2">
            {assessment.strengths.length > 0 ? (
              assessment.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{strength}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic">No strengths identified yet.</li>
            )}
          </ul>
        );
      case 'improvements':
        return (
          <ul className="space-y-2">
            {assessment.improvements.length > 0 ? (
              assessment.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-orange-500 mr-2">!</span>
                  <span>{improvement}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic">No improvements needed.</li>
            )}
          </ul>
        );
      case 'tips':
        return (
          <ul className="space-y-2">
            {assessment.tips.length > 0 ? (
              assessment.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">💡</span>
                  <span>{tip}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic">No tips available.</li>
            )}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">CV Assessment</h3>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span>Overall Score</span>
            <span className="font-bold">{assessment.score}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full transition-all duration-300"
              style={{
                width: `${assessment.score}%`,
                backgroundColor:
                  assessment.score >= 80 ? "#10b981" : assessment.score >= 60 ? "#f59e0b" : "#ef4444",
              }}
            ></div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b">
          <div className="flex border-b">
            <button 
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                activeTab === 'strengths' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('strengths')}
            >
              Strengths
            </button>
            <button 
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                activeTab === 'improvements' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('improvements')}
            >
              Improvements
            </button>
            <button 
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                activeTab === 'tips' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('tips')}
            >
              Tips
            </button>
          </div>
          
          <div className="py-2 max-h-[300px] overflow-y-auto scrollable">
            {renderTabContent()}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          Are you sure you want to save this CV? You can always edit it later.
        </p>
      </div>
    </div>
  );
};

export default CVAssessment; 