import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <FiAlertTriangle className="mx-auto h-16 w-16 text-yellow-500" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Unauthorized Access
        </h2>
        <p className="mt-2 text-center text-lg text-gray-600">
          You don't have permission to access this page.
        </p>
        <div className="mt-5">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 