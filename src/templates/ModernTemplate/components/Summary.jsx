import React from 'react';
import { renderIcon } from '../utils/iconUtils';

const Summary = ({ summary }) => {
  if (!summary) return null;
  
  return (
    <div className="mb-6 cv-section">
      <h2 className="text-lg text-blue-700 font-bold mb-3 flex items-center">
        {renderIcon("fas fa-bookmark", "📑")} 
        <span className="ml-2">SUMMARY</span>
      </h2>
      <p className="text-sm leading-relaxed cv-long-text">{summary}</p>
    </div>
  );
};

export default Summary; 