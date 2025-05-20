import React from 'react';

const AdditionalInfo = ({ additionalInfo, customFields }) => {
  if (!additionalInfo && !customFields?.length) return null;

  return (
    <div className="cv-section px-6 pb-6" data-section="additional-info">
      {additionalInfo?.interests && (
        <div className="mb-5">
          <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Interests</h2>
          <p className="text-sm text-gray-700 cv-long-text">{additionalInfo.interests}</p>
        </div>
      )}
      
      {additionalInfo?.achievements && (
        <div className="mb-5">
          <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Achievements</h2>
          <p className="text-sm text-gray-700 cv-long-text">{additionalInfo.achievements}</p>
        </div>
      )}
      
      {additionalInfo?.publications && (
        <div className="mb-5">
          <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Publications</h2>
          <p className="text-sm text-gray-700 cv-long-text">{additionalInfo.publications}</p>
        </div>
      )}
      
      {customFields?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Additional Information</h2>
          <div className="space-y-3">
            {customFields.map((field, index) => (
              <div key={index} className="text-sm">
                <h3 className="font-medium">{field.label}</h3>
                <p className="text-sm text-gray-600">{field.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalInfo; 