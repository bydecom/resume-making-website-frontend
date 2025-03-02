import React from 'react';

const Profile = () => {
  // Lấy thông tin người dùng từ localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            This is your profile page. Here you can view and manage your account information.
          </p>
          
          {userData.name && (
            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-xl font-semibold mb-3">Account Information</h2>
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Role:</strong> {userData.role}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 