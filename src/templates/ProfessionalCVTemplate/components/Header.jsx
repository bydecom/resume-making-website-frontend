import React from 'react';

const Header = ({ personalInfo }) => {
  return (
    <div className="cv-section p-6 flex justify-between border-b border-gray-200 mb-5 " data-section="header">
      <div>
        <h1 className="text-2xl font-bold mb-1 cv-long-text">
          {personalInfo?.firstName || "John"} {personalInfo?.lastName || "Doe"}
        </h1>

        <p className="text-sm text-yellow-600 my-2 cv-long-text">
          {personalInfo?.professionalHeadline || "Sales Manager"}
        </p>
      </div>

      {/* Contact Info */}
      <div className="flex flex-col text-xs text-gray-700 space-y-1">
        {personalInfo?.phone && (
          <div className="flex items-center">
            <i className="fas fa-phone mr-1"></i>
            <span className="cv-long-text">{personalInfo.phone || "012-345-6789"}</span>
          </div>
        )}

        {personalInfo?.email && (
          <div className="flex items-center">
            <i className="fas fa-envelope mr-1"></i>
            <span className="cv-long-text">{personalInfo.email || "example@gmail.com"}</span>
          </div>
        )}

        {(personalInfo?.location || personalInfo?.country) && (
          <div className="flex items-center">
            <i className="fas fa-map-marker-alt mr-1"></i>
            <span className="cv-long-text">
              {personalInfo.location || "District X"}
              {personalInfo.location && personalInfo.country && ", "}
              {personalInfo.country || "Vietnam"}
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