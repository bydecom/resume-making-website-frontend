import React from 'react';
import { renderIcon, formatDate } from '../utils/iconUtils';

const Projects = ({ projects }) => {
  if (!projects?.length) return null;

  return (
    <div className="mb-6 cv-section">
      <h2 className="text-lg text-blue-700 font-bold mb-3 flex items-center">
        {renderIcon("fas fa-star", "★")}
        <span className="ml-2">PROJECTS</span>
      </h2>
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index} className="border-l-2 border-blue-700 pl-4 pb-2">
            <div className="flex justify-between items-start">
              <div className="cv-flex-item" style={{ maxWidth: '70%' }}>
                <h3 className="font-bold cv-long-text">{project.title}</h3>
                {project.role && <p className="text-sm text-blue-600 cv-long-text">{project.role}</p>}
              </div>
              <div className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center text-gray-500">
                {renderIcon("fas fa-calendar", "📅")}
                <span className="ml-1">
                  {formatDate(project.startDate)} - {project.isPresent ? 'Present' : formatDate(project.endDate)}
                </span>
              </div>
            </div>
            {project.description && (
              <p className="mt-2 text-sm text-gray-600 cv-long-text">{project.description}</p>
            )}
            {project.url && (
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-2 text-xs flex items-center cv-long-text text-blue-600" 
              >
                {renderIcon("fas fa-globe", "🌐")}
                <span className="ml-1">{project.url}</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects; 