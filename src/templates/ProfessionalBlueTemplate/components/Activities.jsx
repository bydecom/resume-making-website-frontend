import React from 'react';
import { formatDate } from '../utils/formatDate';

const Activities = ({ activities }) => {
  if (!activities?.length) return null;

  return (
    <div className="cv-section px-6 pb-5" data-section="activities">
      <h2 className="text-lg font-bold border-b-2 border-blue-600 pb-1 mb-3">Activities</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="text-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold cv-long-text">{activity.organization}</h3>
                {activity.role && <p className="text-sm text-gray-600 cv-long-text">{activity.role}</p>}
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <i className="fas fa-calendar mr-1"></i>
                <span>
                  {formatDate(activity.startDate)} - {activity.isPresent ? 'Present' : formatDate(activity.endDate)}
                </span>
              </div>
            </div>
            {activity.description && <p className="mt-1 text-sm cv-long-text">{activity.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activities; 