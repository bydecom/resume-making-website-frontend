import React from 'react';
import { formatDate } from '../utils/formatDate';

const Experience = ({ experience }) => {
  if (!experience?.length) return null;

  return (
    <div className="cv-section px-6 pb-6" data-section="experience">
      <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Experience</h2>
      <div className="space-y-3">
        {experience.map((job, index) => (
          <div key={index} className="text-sm">
            <div className="flex flex-wrap justify-between items-start">
              <div className="cv-flex-item" style={{ maxWidth: '70%' }}>
                <h3 className="font-medium cv-long-text">{job.position || 'Job Title'}</h3>
                <p className="cv-long-text">{job.company || 'Company Name'}</p>
              </div>
              <div className="text-gray-500 whitespace-normal text-xs">
                {formatDate(job.startDate)}
                {job.startDate && (job.endDate || job.isPresent) && ' - '}
                {formatDate(job.endDate, job.isPresent)}
              </div>
            </div>
            {job.description && (
              <p className="mt-1 text-gray-600 cv-long-text">{job.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience; 