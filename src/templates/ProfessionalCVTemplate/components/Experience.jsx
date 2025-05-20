import React from 'react';
import { formatDate } from '../utils/formatDate';

const Experience = ({ experience }) => {
  if (!experience?.length) return null;

  return (
    <div className="cv-section px-6
    " data-section="experience">
      <h2 className="text-md uppercase tracking-wider font-bold mb-3 border-b border-black pb-1">
        WORK EXPERIENCE
      </h2>
      <div className="space-y-2 py-2 px-6 pb-5">
        {experience.map((job, index) => (
          <div key={index}>
            <div className="relative cv-experience-item mb-4">
              <div className="experience-container"> 
                {/* Using table-like structure for better PDF rendering */}
                <div className="experience-table">
                  <div className="experience-row">
                    <div className="experience-company-cell">
                      <div className="font-bold text-sm cv-text">{job.company || null}</div>
                    </div>
                    <div className="experience-date-cell">
                      <div className="text-gray-600 text-xs">
                        {formatDate(job.startDate) || "08/2020"} -{" "}
                        {job.isPresent ? "Present" : formatDate(job.endDate) || "08/2022"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-1 content">
                  <h3 className="font-bold text-sm uppercase cv-text">
                    {job.position || null}
                  </h3>
                  {job.description && (
                    <div className="mt-2 text-sm text-gray-700 space-y-1">
                      {job.description.split("\n").map((line, i) => (
                        <p key={i} className="cv-text">
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Add divider line between jobs, but not after the last one */}
            {index < experience.length - 1 && (
              <div className="job-divider mx-auto mb-4"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;