import React from 'react';

const Summary = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="cv-section px-6 pb-6" data-section="summary">
      <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Summary</h2>
      <p className="text-sm leading-relaxed text-gray-700 cv-long-text">{summary}</p>
    </div>
  );
};

export default Summary; 