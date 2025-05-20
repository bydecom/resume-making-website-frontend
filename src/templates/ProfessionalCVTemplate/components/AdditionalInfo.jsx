import React from 'react';

const AdditionalInfo = ({ additionalInfo, customFields }) => {
  const hasAdditionalInfo = additionalInfo && Object.values(additionalInfo).some((value) => value);
  const hasCustomFields = customFields && customFields.length > 0;

  if (!hasAdditionalInfo && !hasCustomFields) return null;

  // Helper function to render text as paragraphs or lists
  const renderContent = (content, asList = false) => {
    if (!content) return null;
    
    if (asList) {
      return (
        <ul className="cv-list list-disc ml-5 text-sm space-y-1">
          {content.split('\n').filter(item => item.trim() !== '').map((item, idx) => (
            <li key={idx} className="cv-text">{item}</li>
          ))}
        </ul>
      );
    }
    
    return <p className="text-sm text-gray-700 cv-text">{content}</p>;
  };

  return (
    <div className="cv-section px-6 pb-5" data-section="additionalInfo">
      <h2 className="text-md uppercase tracking-wider font-bold mb-2 border-b border-black pb-1">
        ADDITIONAL INFORMATION
      </h2>
      <div className="space-y-3 mt-3">
        {/* Interests */}
        {additionalInfo?.interests && (
          <div className="text-sm">
            <h3 className="font-bold">INTERESTS</h3>
            {renderContent(additionalInfo.interests, true)}
          </div>
        )}

        {/* Achievements */}
        {additionalInfo?.achievements && (
          <div className="text-sm">
            <h3 className="font-bold">ACHIEVEMENTS</h3>
            {renderContent(additionalInfo.achievements, true)}
          </div>
        )}

        {/* Publications */}
        {additionalInfo?.publications && (
          <div className="text-sm">
            <h3 className="font-bold">PUBLICATIONS</h3>
            {renderContent(additionalInfo.publications, true)}
          </div>
        )}

        {/* References */}
        {additionalInfo?.references && (
          <div className="text-sm">
            <h3 className="font-bold">REFERENCES</h3>
            <div className="space-y-2">
              {additionalInfo.references
                .split("\n")
                .filter((item) => item.trim() !== "")
                .map((refString, index) => {
                  try {
                    const ref = JSON.parse(refString);
                    return (
                      <div key={index} className="p-2 bg-gray-50 rounded-md">
                        <div className="font-medium cv-text">{ref.name}</div>
                        {ref.position && (
                          <div className="cv-text">
                            {ref.position}
                            {ref.company ? `, ${ref.company}` : ""}
                          </div>
                        )}
                        {(ref.email || ref.phone) && (
                          <div className="text-sm text-gray-600 cv-text">
                            {ref.email}
                            {ref.email && ref.phone && " • "}
                            {ref.phone}
                          </div>
                        )}
                      </div>
                    );
                  } catch (e) {
                    return (
                      <div key={index} className="p-2 bg-gray-50 rounded-md cv-text">
                        {refString}
                      </div>
                    );
                  }
                })}
            </div>
          </div>
        )}

        {/* Custom Fields */}
        {customFields?.length > 0 && (
          <>
            {customFields.map((field, index) => (
              <div key={index} className="text-sm">
                <h3 className="font-bold">{field.label}</h3>
                <p className="text-sm text-gray-600 cv-text">{field.value}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default AdditionalInfo; 