import React from 'react';
import { formatDate } from '../utils/formatDate';

const Certifications = ({ certifications }) => {
  if (!certifications?.length) return null;

  return (
    <div className="cv-section px-6 pb-5" data-section="certifications">
      <h2 className="text-lg font-bold border-b-2 border-blue-600 pb-1 mb-3">Certifications</h2>
      <div className="space-y-3">
        {certifications.map((cert, index) => (
          <div key={index} className="text-sm">
            <div className="flex flex-wrap justify-between items-start">
              <div className="cv-flex-item" style={{ maxWidth: '70%' }}>
                <h3 className="font-bold cv-long-text">{cert.name}</h3>
                <p className="text-blue-600 cv-long-text">{cert.issuer}</p>
              </div>
              {cert.issueDate && (
                <div className="flex items-center text-gray-500 whitespace-normal">
                  <i className="fas fa-calendar mr-1 flex-shrink-0" style={{ fontSize: '12px' }}></i>
                  <span>{formatDate(cert.issueDate)}</span>
                </div>
              )}
            </div>
            {cert.description && (
              <p className="mt-2 cv-long-text">{cert.description}</p>
            )}
            {cert.credentialURL && (
              <a 
                href={cert.credentialURL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-1 text-xs flex items-center text-blue-600" 
              >
                <i className="fas fa-globe mr-1"></i> View Credential
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certifications; 