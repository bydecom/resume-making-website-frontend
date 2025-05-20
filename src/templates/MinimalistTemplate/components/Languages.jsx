import React from 'react';

const Languages = ({ languages }) => {
  if (!languages?.length) return null;

  return (
    <div className="cv-section px-6 pb-6" data-section="languages">
      <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Languages</h2>
      <div className="grid grid-cols-2 gap-2">
        {languages.map((lang, index) => (
          <div key={index} className="text-sm">
            <span className="font-medium">{lang.language}</span>
            <span className="ml-2 text-xs text-gray-600">({lang.proficiency})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Languages; 