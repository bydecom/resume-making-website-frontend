import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axios';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
    if (isLoading) return; // Prevent multiple submissions

    try {
      setIsLoading(true);
      setError('');

      const response = await axios.post('/api/users/login', formData);
      console.log('Login response:', response.data); // Debug log

      if (response.data.status === 'success') {
        // Lưu token và user data
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('role', response.data.data.role);
        localStorage.setItem('userData', JSON.stringify(response.data.data));
        
        // Debug log
        console.log('User role:', response.data.data.role);
        
        // Kiểm tra role
        const role = response.data.data.role;
        
        // Chuyển hướng dựa vào role
        if (role === 'admin') {
          console.log('Redirecting to admin...'); // Debug log
          navigate('/admin');
        } else {
          console.log('Redirecting to home...'); // Debug log
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Login error:', err); // Debug log
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
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
