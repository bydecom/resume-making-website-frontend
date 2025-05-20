import React from 'react';

const Summary = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="cv-section px-6 pb-5" data-section="summary">
      <h2 className="text-lg font-bold border-b-2 border-blue-600 pb-1 mb-3">Professional Summary</h2>
      <p className="text-sm leading-relaxed cv-long-text">{summary}</p>
    </div>
  );
};

export default Summary; 