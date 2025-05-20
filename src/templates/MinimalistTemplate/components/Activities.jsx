import React from 'react';
import { formatDate } from '../utils/formatDate';

const Activities = ({ activities }) => {
  if (!activities?.length) return null;

  return (
    <div className="cv-section px-6 pb-6" data-section="activities">
      <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Activities</h2>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="text-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{activity.organization}</h3>
                {activity.role && <p className="text-sm text-gray-600">{activity.role}</p>}
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(activity.startDate)} - {activity.isPresent ? 'Present' : formatDate(activity.endDate)}
              </div>
            </div>
            {activity.description && <p className="mt-1 text-sm text-gray-600">{activity.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activities; 