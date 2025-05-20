import React from 'react';

const Skills = ({ skills }) => {
  if (!skills?.length) return null;

  return (
    <div className="cv-section px-6 pb-6" data-section="skills">
      <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Skills</h2>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {skills.map((skill, index) => (
          <span 
            key={index} 
            className="border border-gray-300 px-2 rounded text-xs inline-flex justify-center"
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