import React from 'react';

const Header = ({ personalInfo }) => {
  return (
    <div className="cv-section px-6 pb-6 mt-5" data-section="header">
      <h1 className="text-2xl font-bold mb-1 border-b pb-2 cv-long-text">
        {personalInfo?.firstName || 'John'} {personalInfo?.lastName || 'Doe'}
      </h1>
      
      <p className="text-sm text-gray-600 my-2 cv-long-text">
        {personalInfo?.professionalHeadline || 'Professional Title'}
      </p>
      
      <div className="flex flex-wrap gap-4 text-xs text-gray-700 mt-3">
        {personalInfo?.email && (
          <div className="flex items-center">
            <i className="fas fa-envelope mr-1"></i>
            <span className="cv-long-text">{personalInfo.email}</span>
          </div>
        )}
        
        {personalInfo?.phone && (
          <div className="flex items-center">
            <i className="fas fa-phone mr-1"></i>
            <span className="cv-long-text">{personalInfo.phone}</span>
          </div>
        )}
        
        {(personalInfo?.location || personalInfo?.country) && (
          <div className="flex items-center">
            <i className="fas fa-map-marker-alt mr-1"></i>
            <span className="cv-long-text">
              {personalInfo.location}
              {personalInfo.location && personalInfo.country && ', '}
              {personalInfo.country}
            </span>
          </div>
        )}
        
        {personalInfo?.website && (
          <div className="flex items-center">
            <i className="fas fa-globe mr-1"></i>
            <span className="cv-long-text">{personalInfo.website}</span>
          </div>
        )}
        
        {personalInfo?.linkedin && (
          <div className="flex items-center">
            <i className="fab fa-linkedin mr-1"></i>
            <span className="cv-long-text">{personalInfo.linkedin}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header; 