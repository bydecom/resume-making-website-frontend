import React from 'react';
import { formatDate } from '../utils/formatDate';

const Experience = ({ experience }) => {
  if (!experience?.length) return null;

  return (
    <div className="cv-section px-6 pb-5" data-section="experience">
      <h2 className="text-lg font-bold border-b-2 border-blue-600 pb-1 mb-3">Work Experience</h2>
      <div className="space-y-3">
        {experience.map((job, index) => (
          <div key={index} className="text-sm">
            <div className="flex flex-wrap justify-between items-start">
              <div className="cv-flex-item" style={{ maxWidth: '70%' }}>
                <h3 className="font-bold cv-long-text">{job.position || 'Job Title'}</h3>
                <p className="text-blue-600 cv-long-text">{job.company || 'Company Name'}</p>
              </div>
              {(job.startDate || job.endDate) && (
                <div className="flex items-center text-gray-500 whitespace-normal">
                  <i className="fas fa-calendar mr-1 flex-shrink-0" style={{ fontSize: '12px' }}></i>
                  <span>
                    {formatDate(job.startDate)}
                    {job.startDate && (job.endDate || job.isPresent) && ' - '}
                    {formatDate(job.endDate, job.isPresent)}
                  </span>
                </div>
              )}
            </div>
            {job.description && (
              <p className="mt-2 cv-long-text">{job.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience; 