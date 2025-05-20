import React from 'react';
import { formatDate } from '../utils/formatDate';

const Education = ({ education }) => {
  if (!education?.length) return null;

  // Helper to render description text
  const renderDescription = (description) => {
    if (!description) return null;
    
    // Check if the description has bullet points
    if (description.includes('\n') || description.match(/^[-*•]/)) {
      return (
        <ul className="cv-list list-disc ml-5 mt-2 text-sm text-gray-600 space-y-1">
          {description.split('\n').map((line, idx) => {
            const cleanLine = line.trim().replace(/^[-*•]\s*/, '');
            return cleanLine ? <li key={idx} className="cv-text">{cleanLine}</li> : null;
          }).filter(Boolean)}
        </ul>
      );
    }
    
    return <p className="mt-1 text-sm text-gray-600 cv-text">{description}</p>;
  };

  return (
    <div className="cv-section px-6 pb-5" data-section="education">
      <h2 className="text-md uppercase tracking-wider font-bold mb-2 border-b border-black pb-1">EDUCATION</h2>
      <div className="space-y-3 mt-3">
        {education.map((edu, index) => (
          <div key={index} className="text-sm">
            <div className="flex justify-between items-start">
              <div className="font-bold cv-text">{edu.degree || "BUSINESS ADMINISTRATION"}</div>
              <div className="text-gray-600 text-xs">
                {formatDate(edu.startDate) || "2018"} -{" "}
                {edu.isPresent ? "Present" : formatDate(edu.endDate) || "2020"}
              </div>
            </div>
            <p className="text-sm cv-text">{edu.institution || null}</p>
            {edu.description && renderDescription(edu.description)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education; 