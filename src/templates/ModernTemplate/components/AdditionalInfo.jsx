import React from 'react';
import { renderIcon } from '../utils/iconUtils';

const AdditionalInfo = ({ additionalInfo, customFields }) => {
  if (!additionalInfo && !customFields?.length) return null;

  return (
    <>
      {additionalInfo && (
        <>
          {/* Interests */}
          {additionalInfo.interests && (
            <div className="mb-6 cv-section">
              <h2 className="text-lg text-blue-700 font-bold mb-3 flex items-center">
                {renderIcon("fas fa-bookmark", "📌")}
                <span className="ml-2">INTERESTS</span>
              </h2>
              <p className="text-sm text-gray-700 cv-long-text">{additionalInfo.interests}</p>
            </div>
          )}
          
          {/* Achievements */}
          {additionalInfo.achievements && (
            <div className="mb-6 cv-section">
              <h2 className="text-lg text-blue-700 font-bold mb-3 flex items-center">
                {renderIcon("fas fa-award", "🏅")}
                <span className="ml-2">ACHIEVEMENTS</span>
              </h2>
              <p className="text-sm text-gray-700 cv-long-text">{additionalInfo.achievements}</p>
            </div>
          )}
          
          {/* Publications */}
          {additionalInfo.publications && (
            <div className="mb-6 cv-section">
              <h2 className="text-lg text-blue-700 font-bold mb-3 flex items-center">
                {renderIcon("fas fa-bookmark", "📚")}
                <span className="ml-2">PUBLICATIONS</span>
              </h2>
              <p className="text-sm text-gray-700 cv-long-text">{additionalInfo.publications}</p>
            </div>
          )}
          
          {/* References */}
          {additionalInfo.references && (
            <div className="mb-6 cv-section">
              <h2 className="text-lg text-blue-700 font-bold mb-3 flex items-center">
                {renderIcon("fas fa-star", "👤")}
                <span className="ml-2">REFERENCES</span>
              </h2>
              <div className="space-y-3">
                {additionalInfo.references.split('\n').filter(item => item.trim() !== '').map((refString, index) => {
                  try {
                    const ref = JSON.parse(refString);
                    return (
                      <div key={index} className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                        <div className="font-bold">{ref.name}</div>
                        {ref.position && <div className="text-sm text-blue-600">{ref.position}{ref.company ? `, ${ref.company}` : ''}</div>}
                        {(ref.email || ref.phone) && (
                          <div className="text-xs text-gray-600 mt-1">
                            {ref.email}
                            {ref.email && ref.phone && " • "}
                            {ref.phone}
                          </div>
                        )}
                      </div>
                    );
                  } catch (e) {
                    return <div key={index} className="p-3 bg-blue-50 border border-blue-100 rounded-md">{refString}</div>;
                  }
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Custom Fields Section */}
      {customFields?.length > 0 && (
        <div className="mb-6 cv-section">
          <h2 className="text-lg text-blue-700 font-bold mb-3 flex items-center">
            {renderIcon("fas fa-bookmark", "📋")}
            <span className="ml-2">ADDITIONAL INFO</span>
          </h2>
          <div className="space-y-3">
            {customFields.map((field, index) => (
              <div key={index} className="text-sm bg-gray-50 p-3 rounded">
                <h3 className="font-bold">{field.label}</h3>
                <p className="text-sm text-gray-600 mt-1">{field.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AdditionalInfo; 