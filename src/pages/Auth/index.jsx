import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import axios from '../../utils/axios';

// Tạo các component icon đơn giản thay vì sử dụng react-icons
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(
    location.pathname === '/register' ? false : true
  );

  // Login state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Register state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [registerError, setRegisterError] = useState('');
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  // Update URL when tab changes
  useEffect(() => {
    navigate(isLogin ? '/login' : '/register', { replace: true });
  }, [isLogin, navigate]);

  // Prevent scrolling on mount
  useEffect(() => {
    // Lưu lại overflow style ban đầu
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Ngăn scroll
    document.body.style.overflow = 'hidden';
    
    // Khôi phục khi component unmount
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (isLoginLoading) return;

    try {
      setIsLoginLoading(true);
      setLoginError('');

      const response = await axios.post('/api/users/login', loginData);
      
      if (response.data.status === 'success') {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('role', response.data.data.role);
        localStorage.setItem('userData', JSON.stringify(response.data.data));
        
        if (response.data.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setLoginError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (isRegisterLoading) return;

    try {
      setIsRegisterLoading(true);
      setRegisterError('');
      
      const response = await axios.post('/api/users/register', registerData);
      
      if (response.data.status === 'success') {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('role', response.data.data.role);
        localStorage.setItem('userData', JSON.stringify(response.data.data));
        navigate('/');
      } else {
        setRegisterError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      setRegisterError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 grid lg:grid-cols-2 overflow-hidden">
      <div className="hidden lg:block bg-blue-600">
        <div className="flex h-full items-center justify-center">
          <div className="text-center text-white px-8">
            <h1 className="text-4xl font-bold mb-4">BestCV.io</h1>
            <p className="text-xl">Create professional resumes in minutes with our easy-to-use builder</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8 overflow-y-auto max-h-screen">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">{isLogin ? "Welcome back" : "Create an account"}</h1>
            <p className="text-gray-500">
              {isLogin ? "Enter your credentials to access your account" : "Enter your information to get started"}
            </p>
          </div>
          
          {/* Login Form */}
          <div
            className={`space-y-4 transition-all duration-300 ${
              isLogin 
                ? "translate-x-0 opacity-100" 
                : "absolute -translate-x-full opacity-0 pointer-events-none"
            }`}
          >
            <form onSubmit={handleLoginSubmit}>
              {loginError && (
                <div className="text-red-500 text-center mb-4">{loginError}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <MailIcon />
                  </div>
                  <Input 
                    id="email"
                    name="email"
                    placeholder="m@example.com" 
                    type="email" 
                    className="pl-10"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                    disabled={isLoginLoading}
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <LockIcon />
                  </div>
                  <Input 
                    id="password"
                    name="password"
                    type="password" 
                    className="pl-10"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    disabled={isLoginLoading}
                  />
                </div>
              </div>
              <Button 
                className="w-full mt-6"
                type="submit"
                disabled={isLoginLoading}
              >
                {isLoginLoading ? 'Signing in...' : 'Sign in'}
                <ArrowRightIcon />
              </Button>
            </form>
          </div>
          
          {/* Register Form */}
          <div
            className={`space-y-4 transition-all duration-300 ${
              !isLogin 
                ? "translate-x-0 opacity-100" 
                : "absolute translate-x-full opacity-0 pointer-events-none"
            }`}
          >
            <form onSubmit={handleRegisterSubmit}>
              {registerError && (
                <div className="text-red-500 text-center mb-4">{registerError}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <UserIcon />
                  </div>
                  <Input 
                    id="name"
                    name="name"
                    placeholder="John Doe" 
                    className="pl-10"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    required
                    disabled={isRegisterLoading}
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <MailIcon />
                  </div>
                  <Input 
                    id="register-email"
                    name="email"
                    placeholder="m@example.com" 
                    type="email" 
                    className="pl-10"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                    disabled={isRegisterLoading}
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <LockIcon />
                  </div>
                  <Input 
                    id="register-password"
                    name="password"
                    type="password" 
                    className="pl-10"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                    disabled={isRegisterLoading}
                  />
                </div>
              </div>
              <Button 
                className="w-full mt-6"
                type="submit"
                disabled={isRegisterLoading}
              >
                {isRegisterLoading ? 'Creating account...' : 'Create Account'}
                <ArrowRightIcon />
              </Button>
            </form>
          </div>
          
          {/* Toggle between login and register */}
          <div className="text-center">
            <Button
              variant="link"
              className="text-sm text-gray-500"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
