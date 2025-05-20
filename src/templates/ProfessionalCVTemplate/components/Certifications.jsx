import React from 'react';
import { formatDate } from '../utils/formatDate';

const Certifications = ({ certifications }) => {
  if (!certifications?.length) return null;

  return (
    <div className="cv-section px-6 pb-5" data-section="certifications">
      <h2 className="text-md uppercase tracking-wider font-bold mb-2 border-b border-black pb-1">CERTIFICATIONS</h2>
      <div className="space-y-3 mt-3">
        {certifications.map((cert, index) => (
          <div key={index} className="text-sm">
            <div className="flex justify-between items-start">
              <div className="font-bold cv-text">{cert.name}</div>
              <div className="text-gray-600 text-xs">
                {formatDate(cert.issueDate)}
                {!cert.doesNotExpire && cert.expirationDate && ` - ${formatDate(cert.expirationDate)}`}
              </div>
            </div>
            <p className="text-sm cv-text">{cert.issuer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certifications; 