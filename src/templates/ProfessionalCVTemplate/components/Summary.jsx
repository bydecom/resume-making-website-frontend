import React from 'react';

const Summary = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="cv-section px-6 pb-5" data-section="summary">
      <h2 className="text-md uppercase tracking-wider font-bold mb-2 border-b border-black pb-1">
        SUMMARY
      </h2>
      <p className="text-sm leading-relaxed text-gray-700 mt-3 cv-long-text">{summary}</p>
    </div>
  );
};

export default Summary; 