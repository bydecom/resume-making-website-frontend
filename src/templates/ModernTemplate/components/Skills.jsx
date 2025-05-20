import React from 'react';
import { renderIcon } from '../utils/iconUtils';

const Skills = ({ skills }) => {
  if (!skills?.length) return null;

  return (
    <div className="mb-6 cv-section">
      <h2 className="text-lg text-blue-700 font-bold mb-3 flex items-center">
        {renderIcon("fas fa-star", "★")}
        <span className="ml-2">SKILLS</span>
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span 
            key={index} 
            className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs font-medium cv-long-text"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Skills; 