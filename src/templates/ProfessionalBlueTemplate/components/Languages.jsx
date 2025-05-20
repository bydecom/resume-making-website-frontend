import React from 'react';

const Languages = ({ languages }) => {
  if (!languages?.length) return null;

  return (
    <div className="cv-section px-6 pb-5" data-section="languages">
      <h2 className="text-lg font-bold border-b-2 border-blue-600 pb-1 mb-3">Languages</h2>
      <div className="grid grid-cols-2 gap-2">
        {languages.map((lang, index) => (
          <div key={index} className="text-sm flex items-center">
            <i className="fas fa-globe mr-2 text-blue-600"></i>
            <span className="font-medium cv-long-text">{lang.language}</span>
            <span className="ml-2 text-xs text-gray-600">({lang.proficiency})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Languages; 