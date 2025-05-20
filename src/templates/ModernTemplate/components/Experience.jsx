import React from 'react';
import { renderIcon, formatDate } from '../utils/iconUtils';

const Experience = ({ experience }) => {
  if (!experience?.length) return null;

  return (
    <div className="mb-6 cv-section">
      <h2 className="text-lg text-blue-700 font-bold mb-3 flex items-center">
        {renderIcon("fas fa-star", "★")}
        <span className="ml-2">EXPERIENCE</span>
      </h2>
      <div className="space-y-4">
        {experience.map((job, index) => (
          <div key={index} className="border-l-2 border-blue-700 pl-4 pb-2">
            <div className="flex justify-between items-start">
              <div className="cv-flex-item" style={{ maxWidth: '70%' }}>
                <h3 className="font-bold cv-long-text">{job.position || 'Job Title'}</h3>
                <p className="text-sm text-blue-600 cv-long-text">{job.company || 'Company Name'}</p>
              </div>
              <div className="text-gray-500 flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                {renderIcon("fas fa-calendar", "📅")}
                <span className="ml-1">
                  {formatDate(job.startDate)}
                  {job.startDate && (job.endDate || job.isPresent) && ' - '}
                  {formatDate(job.endDate, job.isPresent)}
                </span>
              </div>
            </div>
            {job.description && (
              <p className="mt-2 text-sm text-gray-600 cv-long-text">{job.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience; 