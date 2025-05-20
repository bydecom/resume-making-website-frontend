import React from 'react';
import { formatDate } from '../utils/formatDate';

const Certifications = ({ certifications }) => {
  if (!certifications?.length) return null;

  return (
    <div className="cv-section px-6 pb-6" data-section="certifications">
      <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Certifications</h2>
      <div className="space-y-3">
        {certifications.map((cert, index) => (
          <div key={index} className="text-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{cert.name}</h3>
                <p className="text-sm text-gray-600">{cert.issuer}</p>
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(cert.issueDate)}
                {!cert.doesNotExpire && cert.expirationDate && ` - ${formatDate(cert.expirationDate)}`}
                {cert.doesNotExpire && ' (No Expiration)'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certifications; 