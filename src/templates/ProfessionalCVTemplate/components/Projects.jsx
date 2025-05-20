import React from 'react';
import { formatDate } from '../utils/formatDate';

const Projects = ({ projects }) => {
  if (!projects?.length) return null;

  // Helper function to render description as paragraphs or bullets
  const renderDescription = (description) => {
    if (!description) return null;
    
    // Check if description contains bullet points (lines starting with - or *)
    if (description.split('\n').some(line => line.trim().match(/^[-*•]/))) {
      return (
        <ul className="cv-list list-disc ml-5 mt-2 text-sm text-gray-600 space-y-1">
          {description.split('\n').map((line, idx) => {
            // Remove bullet characters if present
            const cleanLine = line.trim().replace(/^[-*•]\s*/, '');
            return cleanLine ? <li key={idx} className="cv-text">{cleanLine}</li> : null;
          }).filter(Boolean)}
        </ul>
      );
    }
    
    // Otherwise render as paragraph
    return <p className="mt-1 text-sm text-gray-600 cv-text">{description}</p>;
  };

  return (
    <div className="cv-section px-6 pb-5" data-section="projects">
      <h2 className="text-md uppercase tracking-wider font-bold mb-2 border-b border-black pb-1">PROJECTS</h2>
      <div className="space-y-3 mt-3">
        {projects.map((project, index) => (
          <div key={index} className="text-sm">
            <div className="flex justify-between items-start">
              <div className="font-bold cv-text">{project.title || null}</div>
              <div className="text-gray-600 text-xs">
                {formatDate(project.startDate)} - {project.isPresent ? "Present" : formatDate(project.endDate)}
              </div>
            </div>
            {project.role && <p className="text-sm italic cv-text">{project.role}</p>}
            {project.description && renderDescription(project.description)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects; 