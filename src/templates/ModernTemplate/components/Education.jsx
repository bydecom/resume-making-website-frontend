import React from 'react';
import { renderIcon, formatDate } from '../utils/iconUtils';

const Education = ({ education }) => {
  if (!education?.length) return null;

  return (
    <div className="mb-6 cv-section">
      <h2 className="text-lg text-blue-700 font-bold mb-3 flex items-center">
        {renderIcon("fas fa-award", "🎓")}
        <span className="ml-2">EDUCATION</span>
      </h2>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="mb-3">
            <h3 className="font-bold cv-long-text">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
            <p className="text-sm text-blue-600 cv-long-text">{edu.institution || 'Institution'}</p>
            <div className="text-xs flex items-center text-gray-500 mt-1">
              {renderIcon("fas fa-calendar", "📅")}
              <span className="ml-1">
                {formatDate(edu.startDate)}
                {edu.startDate && (edu.endDate || edu.isPresent) && ' - '}
                {formatDate(edu.endDate, edu.isPresent)}
              </span>
            </div>
            {edu.description && (
              <p className="mt-2 text-sm text-gray-600 cv-long-text">{edu.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education; 