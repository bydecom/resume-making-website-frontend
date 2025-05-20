import React from 'react';

const Skills = ({ skills }) => {
  if (!skills?.length) return null;

  return (
    <div className="cv-section px-6 pb-5" data-section="skills">
      <h2 className="text-md uppercase tracking-wider font-bold mb-2 border-b border-black pb-1">SKILLS</h2>
      <div className="grid grid-cols-2 gap-3 mt-3">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center skill-item">
            <div className="w-3 h-3 bg-gray-800 rounded-sm mr-2 dot"></div>
            <span className="text-sm cv-text" style={{ transform: 'translateY(-10px)' }}>{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills; 