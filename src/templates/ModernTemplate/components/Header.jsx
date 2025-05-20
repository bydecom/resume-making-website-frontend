import React from 'react';
import { renderIcon } from '../utils/iconUtils';

const Header = ({ personalInfo }) => {
  return (
    <div className="bg-blue-700 text-white p-8 cv-section mb-5">
      <h1 className="text-3xl font-bold mb-2 cv-long-text">
        {personalInfo?.firstName || 'John'} {personalInfo?.lastName || 'Doe'}
      </h1>
      
      <p className="text-lg font-light mb-4 cv-long-text">
        {personalInfo?.professionalHeadline || 'Professional Title'}
      </p>
      
      <div className="flex flex-wrap gap-4 text-sm">
        {personalInfo?.email && (
          <div className="flex items-center">
            {renderIcon("fas fa-envelope", "✉")}
            <span className="ml-2 cv-long-text">{personalInfo.email}</span>
          </div>
        )}
        
        {personalInfo?.phone && (
          <div className="flex items-center">
            {renderIcon("fas fa-phone", "☎")}
            <span className="ml-2 cv-long-text">{personalInfo.phone}</span>
          </div>
        )}
        
        {(personalInfo?.location || personalInfo?.country) && (
          <div className="flex items-center">
            {renderIcon("fas fa-map-marker-alt", "📍")}
            <span className="ml-2 cv-long-text">
              {personalInfo.location}
              {personalInfo.location && personalInfo.country && ', '}
              {personalInfo.country}
            </span>
          </div>
        )}
        
        {personalInfo?.website && (
          <div className="flex items-center">
            {renderIcon("fas fa-globe", "🌐")}
            <span className="ml-2 cv-long-text">{personalInfo.website}</span>
          </div>
        )}
        
        {personalInfo?.linkedin && (
          <div className="flex items-center">
            {renderIcon("fab fa-linkedin", "in")}
            <span className="ml-2 cv-long-text">{personalInfo.linkedin}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header; 