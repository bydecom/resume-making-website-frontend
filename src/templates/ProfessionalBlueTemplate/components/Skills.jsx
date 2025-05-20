import React from 'react';

const Skills = ({ skills }) => {
  if (!skills?.length) return null;

  return (
    <div className="cv-section px-6 pb-5" data-section="skills">
      <h2 className="text-lg font-bold border-b-2 border-blue-600 pb-1 mb-3">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span 
            key={index} 
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-xs cv-long-text overflow-hidden"
            style={{ lineHeight: '1.2', height: '2.3rem' }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Skills; 