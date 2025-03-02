import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axios';
import { ArrowLeft } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      
      const response = await axios.post('/api/users/register', formData);
      
      if (response.data.status === 'success') {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('role', response.data.data.role);
        localStorage.setItem('userData', JSON.stringify(response.data.data));
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative">
      <button 
        onClick={handleGoBack}
        className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors flex items-center justify-center"
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </button>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-500 text-center">{error}</div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div>
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div>
                <input
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
