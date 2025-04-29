import React from 'react';
import { FiMail, FiPhone, FiMapPin, FiGlobe, FiLinkedin } from 'react-icons/fi';

const ReusableCVHeader = ({ data, templateName }) => {
  const personalInfo = data?.personalInfo || {};
  const roleApply = data?.roleApply;

  // Style theo template nếu cần
  const templateClass =
    templateName === 'professional-blue'
      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
      : templateName === 'matched'
      ? 'bg-blue-600 text-white'
      : '';

  return (
    <div className={`p-6 rounded-t-lg ${templateClass}`}>
      <h1 className="text-2xl font-bold mb-1">
        {personalInfo.firstName || 'John'} {personalInfo.lastName || 'Doe'}
      </h1>
      <p className={`my-2 ${templateClass ? 'text-lg' : 'text-sm text-gray-600'}`}>
        {roleApply || personalInfo.professionalHeadline || 'Professional Title'}
      </p>
      <div className={`flex flex-wrap gap-4 mt-3 ${templateClass ? 'text-blue-50' : 'text-xs text-gray-700'}`}>
        {personalInfo.email && (
          <div className="flex items-center">
            <FiMail className="mr-1" />
            <span>{personalInfo.email}</span>
          </div>
        )}
        {personalInfo.phone && (
          <div className="flex items-center">
            <FiPhone className="mr-1" />
            <span>{personalInfo.phone}</span>
          </div>
        )}
        {(personalInfo.location || personalInfo.country) && (
          <div className="flex items-center">
            <FiMapPin className="mr-1" />
            <span>
              {personalInfo.location}
              {personalInfo.location && personalInfo.country && ', '}
              {personalInfo.country}
            </span>
          </div>
        )}
        {personalInfo.website && (
          <div className="flex items-center">
            <FiGlobe className="mr-1" />
            <span>{personalInfo.website}</span>
          </div>
        )}
        {personalInfo.linkedin && (
          <div className="flex items-center">
            <FiLinkedin className="mr-1" />
            <span>{personalInfo.linkedin}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReusableCVHeader; 