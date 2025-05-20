import React from 'react';

const AdditionalInfo = ({ additionalInfo, customFields }) => {
  // Helper to check if a section is available
  const renderSection = (title, content, type = "paragraph") => {
    if (!content) return null;
    
    return (
      <div className="cv-section px-6 pb-5" data-section={title.toLowerCase()}>
        <h2 className="text-lg font-bold border-b-2 border-blue-600 pb-1 mb-3">{title}</h2>
        {type === "list" ? (
          <ul className="list-disc pl-5 space-y-1">
            {content.split('\n').filter(item => item.trim() !== '').map((item, index) => (
              <li key={index} className="text-sm leading-relaxed cv-long-text">{item}</li>
            ))}
          </ul>
        ) : type === "references" ? (
          <div className="space-y-4">
            {content.split('\n').filter(item => item.trim() !== '').map((refString, index) => {
              try {
                const ref = JSON.parse(refString);
                return (
                  <div key={index} className="p-3 bg-gray-50 rounded-md">
                    <div className="font-medium cv-long-text">{ref.name}</div>
                    {ref.position && <div className="cv-long-text">{ref.position}{ref.company ? `, ${ref.company}` : ''}</div>}
                    {(ref.email || ref.phone) && (
                      <div className="text-sm text-gray-600">
                        {ref.email}
                        {ref.email && ref.phone && " • "}
                        {ref.phone}
                      </div>
                    )}
                    {ref.relationship && <div className="text-sm mt-1 cv-long-text">{ref.relationship}</div>}
                  </div>
                );
              } catch (e) {
                return <div key={index} className="p-3 bg-gray-50 rounded-md cv-long-text">{refString}</div>;
              }
            })}
          </div>
        ) : (
          <p className="text-sm cv-long-text">{content}</p>
        )}
      </div>
    );
  };
  
  // Custom Fields
  const renderCustomFields = () => {
    if (!customFields?.length) return null;
    
    return (
      <div className="cv-section px-6 pb-5" data-section="additionalInfo">
        <h2 className="text-lg font-bold border-b-2 border-blue-600 pb-1 mb-3">Additional Information</h2>
        <div className="space-y-3">
          {customFields.map((field, index) => (
            <div key={index} className="text-sm">
              <h3 className="font-semibold">{field.label}</h3>
              <p className="text-sm text-gray-600 cv-long-text">{field.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!additionalInfo && !customFields?.length) return null;

  return (
    <>
      {additionalInfo?.interests && renderSection("Interests", additionalInfo.interests, "list")}
      {additionalInfo?.achievements && renderSection("Achievements", additionalInfo.achievements, "list")}
      {additionalInfo?.publications && renderSection("Publications", additionalInfo.publications, "list")}
      {additionalInfo?.references && renderSection("References", additionalInfo.references, "references")}
      {customFields?.length > 0 && renderCustomFields()}
    </>
  );
};

export default AdditionalInfo; 