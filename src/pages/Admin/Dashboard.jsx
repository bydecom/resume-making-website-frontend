import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UserDashboard from './dashboard/UserDashboard';
import ResumeDashboard from './dashboard/ResumeDashboard';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Welcome to Admin Dashboard</h2>
      <p className="text-gray-600 mb-6">Select a section from the sidebar to manage your application.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Users</h3>
          <p className="text-gray-600">Manage user accounts and permissions</p>
          <div className="mt-4">
            <Link to="/admin/users" className="text-blue-600 hover:text-blue-800 font-medium">
              View all users →
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Templates</h3>
          <p className="text-gray-600">Manage CV templates and designs</p>
          <div className="mt-4">
            <Link to="/admin/templates" className="text-blue-600 hover:text-blue-800 font-medium">
              View templates →
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
          <h3 className="text-lg font-medium text-gray-800 mb-2">AI Config</h3>
          <p className="text-gray-600">Configure AI settings</p>
          <div className="mt-4">
            <Link to="/admin/ai-config" className="text-blue-600 hover:text-blue-800 font-medium">
              Manage AI Config →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Include UserDashboard without wrapper */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">User Analytics</h3>
        <UserDashboard inlineDashboard={true} />
      </div>
      {/* Resume Dashboard Section */}
      <div className="mt-8">
        <ResumeDashboard />
      </div>
    </div>
  );
};

export default Dashboard; 