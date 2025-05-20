import React from 'react';
import { formatDate } from '../utils/formatDate';

const Education = ({ education }) => {
  if (!education?.length) return null;

  return (
    <div className="cv-section px-6 pb-6" data-section="education">
      <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Education</h2>
      <div className="space-y-3">
        {education.map((edu, index) => (
          <div key={index} className="text-sm">
            <div className="flex flex-wrap justify-between items-start">
              <div className="cv-flex-item" style={{ maxWidth: '70%' }}>
                <h3 className="font-medium cv-long-text">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                <p className="cv-long-text">{edu.institution || 'Institution'}</p>
              </div>
              <div className="text-gray-500 whitespace-normal text-xs">
                {formatDate(edu.startDate)}
                {edu.startDate && (edu.endDate || edu.isPresent) && ' - '}
                {formatDate(edu.endDate, edu.isPresent)}
              </div>
            </div>
            {edu.description && (
              <p className="mt-1 text-gray-600 cv-long-text">{edu.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education; 