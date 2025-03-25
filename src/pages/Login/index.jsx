import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import loginImage from '../../assets/resume-01.jpg'; // Update this path to your actual image
import { Loader2, Mail, Lock, AlertCircle, User, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Prevent scrolling on mount
  useEffect(() => {
    // Save the original overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
    
    // Restore when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call the login API endpoint
      const response = await api.post('/api/users/login', {
        email,
        password
      });
      
      // Extract user data from response
      const { token, _id, name, role } = response.data.data;
      
      // Store user information in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', _id);
      localStorage.setItem('userName', name);
      localStorage.setItem('userRole', role);
      
      // Store full user data for the header component
      localStorage.setItem('userData', JSON.stringify({
        _id,
        name,
        role
      }));
      
      // Redirect based on user role
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Call the register API endpoint
      const response = await api.post('/api/users/register', {
        name,
        email,
        password
      });
      
      // Extract user data from response
      const { token, _id, role } = response.data.data;
      
      // Store user information in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', _id);
      localStorage.setItem('userName', name);
      localStorage.setItem('userRole', role);
      
      // Store full user data for the header component
      localStorage.setItem('userData', JSON.stringify({
        _id,
        name,
        role
      }));
      
      // Redirect to home page after successful registration
      navigate('/home');
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLoginSuccess = () => {
    // Lấy đường dẫn đã lưu từ localStorage
    const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
    // Xóa redirectPath khỏi localStorage
    localStorage.removeItem('redirectAfterLogin');
    // Chuyển hướng người dùng
    navigate(redirectPath);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <button 
        onClick={handleGoBack}
        className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors flex items-center justify-center z-10"
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </button>
      <div className="fixed inset-0 flex flex-col md:flex-row overflow-hidden">
        {/* Left side - Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-blue-50">
          <div className="flex items-center justify-center w-full h-full p-8">
            <div className="max-w-md">
              <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome to BestResume.io</h1>
              <p className="text-base text-gray-600 mb-6">
                Log in to your account to access your personalized dashboard and continue building your professional
                profile.
              </p>
              <div className="relative w-full aspect-square max-w-sm">
                <img
                  src={loginImage}
                  alt="Login illustration"
                  className="rounded-lg shadow-xl object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login/Register form */}
        <div className="flex flex-col justify-center items-center p-4 md:p-8 md:w-1/2 overflow-hidden">
          <div className="w-full max-w-md">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight">
                {isLogin ? "Sign in to your account" : "Create an account"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {isLogin 
                  ? "Enter your credentials to access your account" 
                  : "Enter your information to get started"}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded mb-4 animate-in fade-in-50">
                <div className="flex">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <p className="ml-2 text-xs text-red-700">{error}</p>
                </div>
              </div>
            )}

            {isLogin ? (
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="name@example.com"
                        className="appearance-none block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <button 
                        type="button"
                        className="text-xs font-medium text-blue-600 hover:text-blue-500"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        placeholder="••••••••"
                        className="appearance-none block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="remember-me" className="block text-xs text-gray-700">
                      Remember me for 30 days
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>

                <div className="text-center text-sm">
                  <span className="text-gray-500 text-xs">Don't have an account?</span>{" "}
                  <button
                    type="button"
                    className="text-xs font-medium text-blue-600 hover:text-blue-500"
                    onClick={() => {
                      setIsLogin(false);
                      setError('');
                    }}
                  >
                    Sign up
                  </button>
                </div>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleRegister}>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        placeholder="John Doe"
                        className="appearance-none block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        id="register-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="name@example.com"
                        className="appearance-none block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        id="register-password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        placeholder="••••••••"
                        className="appearance-none block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        placeholder="••••••••"
                        className="appearance-none block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Sign up"
                  )}
                </button>

                <div className="text-center text-sm">
                  <span className="text-gray-500 text-xs">Already have an account?</span>{" "}
                  <button
                    type="button"
                    className="text-xs font-medium text-blue-600 hover:text-blue-500"
                    onClick={() => {
                      setIsLogin(true);
                      setError('');
                    }}
                  >
                    Sign in
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 