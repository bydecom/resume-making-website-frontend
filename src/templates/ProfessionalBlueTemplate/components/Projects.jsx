import React from 'react';
import { formatDate } from '../utils/formatDate';

const Projects = ({ projects }) => {
  if (!projects?.length) return null;

  return (
    <div className="cv-section px-6 pb-5" data-section="projects">
      <h2 className="text-lg font-bold border-b-2 border-blue-600 pb-1 mb-3">Projects</h2>
      <div className="space-y-3">
        {projects.map((project, index) => (
          <div key={index} className="text-sm">
            <div className="flex flex-wrap justify-between items-start">
              <div className="cv-flex-item" style={{ maxWidth: '70%' }}>
                <h3 className="font-bold cv-long-text">{project.name}</h3>
                <p className="text-blue-600 cv-long-text">{project.role || 'Role'}</p>
              </div>
              {/* Chỉ hiển thị date nếu có startDate và endDate/isPresent */}
              {project.startDate && (project.endDate || project.isPresent) && (
                <div className="flex items-center text-gray-500 whitespace-normal">
                  <i className="fas fa-calendar mr-1 flex-shrink-0" style={{ fontSize: '12px' }}></i>
                  <span>
                    {formatDate(project.startDate)}
                    {project.isPresent ? ' - Present' : project.endDate ? ` - ${formatDate(project.endDate)}` : ''}
                  </span>
                </div>
              )}
            </div>
            {project.description && (
              <p className="mt-2 cv-long-text">{project.description}</p>
            )}
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" 
                 className="text-blue-600 hover:underline mt-1 block">
                <i className="fas fa-link mr-1"></i>
                {project.url}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects; 