import React from 'react';

const Languages = ({ languages }) => {
  if (!languages?.length) return null;

  return (
    <div className="cv-section px-6 pb-5" data-section="languages">
      <h2 className="text-md uppercase tracking-wider font-bold mb-2 border-b border-black pb-1">LANGUAGES</h2>
      <div className="grid grid-cols-2 gap-3 mt-3">
        {languages.map((lang, index) => (
          <div key={index} className="text-sm">
            <span className="font-bold cv-long-text">{lang.language}</span>
            <span className="ml-2 text-xs text-gray-600">({lang.proficiency})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Languages; 