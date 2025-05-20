import React from 'react';
import { renderIcon, formatDate } from '../utils/iconUtils';

const Certifications = ({ certifications }) => {
  if (!certifications?.length) return null;

  return (
    <div className="mb-6 cv-section">
      <h2 className="text-lg text-blue-700 font-bold mb-3 flex items-center">
        {renderIcon("fas fa-award", "🏆")}
        <span className="ml-2">CERTIFICATIONS</span>
      </h2>
      <div className="space-y-3">
        {certifications.map((cert, index) => (
          <div key={index} className="text-sm">
            <h3 className="font-bold">{cert.name}</h3>
            <p className="text-sm text-blue-600">{cert.issuer}</p>
            <div className="text-xs flex items-center text-gray-500 mt-1">
              {renderIcon("fas fa-calendar", "📅")}
              <span className="ml-1">
                {formatDate(cert.issueDate)}
                {!cert.doesNotExpire && cert.expirationDate && ` - ${formatDate(cert.expirationDate)}`}
                {cert.doesNotExpire && ' (No Expiration)'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certifications; 