import React from 'react';
import { renderIcon } from '../utils/iconUtils';

const Languages = ({ languages }) => {
  if (!languages?.length) return null;

  const getProficiencyWidth = (proficiency) => {
    switch (proficiency) {
      case 'Native': return '100%';
      case 'Fluent': return '90%';
      case 'Advanced': return '80%';
      case 'Intermediate': return '60%';
      case 'Basic': return '40%';
      case 'Beginner': return '20%';
      default: return '50%';
    }
  };

  return (
    <div className="mb-6 cv-section">
      <h2 className="text-lg text-blue-700 font-bold mb-3 flex items-center">
        {renderIcon("fas fa-globe", "🌐")}
        <span className="ml-2">LANGUAGES</span>
      </h2>
      <div className="space-y-2">
        {languages.map((lang, index) => (
          <div key={index} className="mb-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">{lang.language}</span>
              <span className="text-xs text-gray-600">{lang.proficiency}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div 
                className="bg-blue-600 h-1.5 rounded-full" 
                style={{ width: getProficiencyWidth(lang.proficiency) }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Languages; 