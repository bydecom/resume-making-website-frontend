import React from 'react';
import { formatDate } from '../utils/formatDate';

const Activities = ({ activities }) => {
  if (!activities?.length) return null;

  return (
    <div className="cv-section px-6 pb-5" data-section="activities">
      <h2 className="text-md uppercase tracking-wider font-bold mb-2 border-b border-black pb-1">ACTIVITIES</h2>
      <div className="space-y-3 mt-3">
        {activities.map((activity, index) => (
          <div key={index} className="text-sm">
            <div className="flex justify-between items-start">
              <div className="font-bold cv-long-text">{activity.organization}</div>
              <div className="text-gray-600 text-xs">
                {formatDate(activity.startDate)} - {activity.isPresent ? "Present" : formatDate(activity.endDate)}
              </div>
            </div>
            {activity.role && <p className="text-sm italic cv-long-text">{activity.role}</p>}
            {activity.description && <p className="mt-1 text-sm text-gray-600 cv-long-text">{activity.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activities; 