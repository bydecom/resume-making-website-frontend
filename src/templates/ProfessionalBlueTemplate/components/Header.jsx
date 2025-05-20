import React from 'react';

const Header = ({ personalInfo }) => {
  console.log(personalInfo);
  return (
    <div className="cv-section p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white mb-5 " data-section="header">
      <h1 className="text-2xl font-bold mb-1 cv-long-text">
        {personalInfo?.firstName || 'John'} {personalInfo?.lastName || 'Doe'}
      </h1>
      <p className="text-sm opacity-90 mb-4 cv-long-text">
        {personalInfo?.professionalHeadline || 'Professional Title'}
      </p>
      
      {/* First row: Email, Phone, Location */}
      <div className="flex text-xs mb-2">
        {personalInfo?.email && (
          <div className="flex items-center cv-flex-item">  
            <i className="fas fa-envelope mr-1 flex-shrink-0"></i>
            <span className="cv-long-text">{personalInfo.email}</span>
          </div>
        )}
        
        {personalInfo?.phone && (
          <div className="flex items-center cv-flex-item ml-6">
            <i className="fas fa-phone mr-1 flex-shrink-0"></i>
            <span className="cv-long-text">{personalInfo.phone}</span>
          </div>
        )}
        
        {(personalInfo?.location || personalInfo?.country) && (
          <div className="flex items-center cv-flex-item ml-6">
            <i className="fas fa-map-marker-alt mr-1 flex-shrink-0"></i>
            <span className="cv-long-text">
              {personalInfo.location}
              {personalInfo.location && personalInfo.country && ', '}
              {personalInfo.country}
            </span>
          </div>
        )}
      </div>
      
      {/* Second row: Website and LinkedIn */}
      <div className="flex flex-wrap gap-3 text-xs">
        {personalInfo?.website && (
          <div className="flex items-center cv-flex-item">
            <i className="fas fa-globe mr-1 flex-shrink-0"></i>
            <span className="cv-long-text">{personalInfo.website}</span>
          </div>
        )}
        
        {personalInfo?.linkedin && (
          <div className="flex items-center cv-flex-item">
            <i className="fab fa-linkedin mr-1 flex-shrink-0"></i>
            <span className="cv-long-text">{personalInfo.linkedin}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header; 