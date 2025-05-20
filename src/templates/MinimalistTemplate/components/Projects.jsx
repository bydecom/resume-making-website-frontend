import React from 'react';
import { formatDate } from '../utils/formatDate';

const Projects = ({ projects }) => {
  if (!projects?.length) return null;

  return (
    <div className="cv-section px-6 pb-6" data-section="projects">
      <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Projects</h2>
      <div className="space-y-3">
        {projects.map((project, index) => (
          <div key={index} className="text-sm">
            <div className="flex flex-wrap justify-between items-start">
              <div className="cv-flex-item" style={{ maxWidth: '70%' }}>
                <h3 className="font-medium cv-long-text">{project.title}</h3>
                {project.role && <p className="text-sm cv-long-text text-gray-600">{project.role}</p>}
              </div>
              <div className="text-xs text-gray-500 whitespace-normal">
                {formatDate(project.startDate)} - {project.isPresent ? 'Present' : formatDate(project.endDate)}
              </div>
            </div>
            {project.description && (
              <p className="mt-1 text-gray-600 cv-long-text">{project.description}</p>
            )}
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" 
                className="mt-1 text-xs flex items-center cv-long-text text-gray-600">
                <i className="fas fa-globe mr-1"></i> {project.url}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects; 