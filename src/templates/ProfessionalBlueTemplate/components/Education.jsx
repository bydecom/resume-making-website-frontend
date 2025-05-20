import React from 'react';
import { formatDate } from '../utils/formatDate';

const Education = ({ education }) => {
  if (!education?.length) return null;

  return (
    <div className="cv-section px-6 pb-5" data-section="education">
      <h2 className="text-lg font-bold border-b-2 border-blue-600 pb-1 mb-3">Education</h2>
      <div className="space-y-3">
        {education.map((edu, index) => (
          <div key={index} className="text-sm">
            <div className="flex flex-wrap justify-between items-start">
              <div className="cv-flex-item" style={{ maxWidth: '70%' }}>
                <h3 className="font-bold cv-long-text">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                <p className="text-blue-600 cv-long-text">{edu.institution || 'Institution'}</p>
              </div>
              {/* Chỉ hiển thị date section nếu có startDate hoặc endDate */}
              {(edu.startDate || edu.endDate) && (
                <div className="flex items-center text-gray-500 whitespace-normal">
                  <i className="fas fa-calendar mr-1 flex-shrink-0" style={{ fontSize: '12px' }}></i>
                  <span>
                    {formatDate(edu.startDate)}
                    {edu.startDate && (edu.endDate || edu.isPresent) && ' - '}
                    {formatDate(edu.endDate, edu.isPresent)}
                  </span>
                </div>
              )}
            </div>
            {edu.description && (
              <p className="mt-2 cv-long-text">{edu.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education; 