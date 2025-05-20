import React from 'react';
import { renderIcon, formatDate } from '../utils/iconUtils';

const Activities = ({ activities }) => {
  if (!activities?.length) return null;

  return (
    <div className="mb-6 cv-section">
      <h2 className="text-lg text-blue-700 font-bold mb-3 flex items-center">
        {renderIcon("fas fa-star", "★")}
        <span className="ml-2">ACTIVITIES</span>
      </h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="border-l-2 border-blue-700 pl-4 pb-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{activity.organization}</h3>
                {activity.role && <p className="text-sm text-blue-600">{activity.role}</p>}
              </div>
              <div className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center text-gray-500">
                {renderIcon("fas fa-calendar", "📅")}
                <span className="ml-1">
                  {formatDate(activity.startDate)} - {activity.isPresent ? 'Present' : formatDate(activity.endDate)}
                </span>
              </div>
            </div>
            {activity.description && <p className="mt-2 text-sm text-gray-600">{activity.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activities; 