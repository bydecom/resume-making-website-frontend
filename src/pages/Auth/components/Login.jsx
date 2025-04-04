import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import api from '../../../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState({
    email: { isValid: false, showError: false }
  });
  
  // Refs để truy cập trực tiếp vào DOM elements
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));

    if (name === 'email') {
      const isValid = validateEmail(value);
      setValidation(prev => ({
        ...prev,
        email: {
          isValid: isValid,
          showError: isValid ? false : prev.email.showError
        }
      }));
    }
  };

  const handleBlur = (name) => {
    if (name === 'email' && loginData.email) {
      const isValid = validateEmail(loginData.email);
      
      setValidation(prev => ({
        ...prev,
        email: {
          isValid,
          showError: !isValid
        }
      }));
      
      if (!isValid && emailInputRef.current) {
        setTimeout(() => {
          emailInputRef.current.focus();
        }, 10);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoading) return;

    try {
      setIsLoading(true);
      setLoginError('');

      const response = await api.post('/api/users/login', loginData);
      
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('userId', response.data.data._id);
      localStorage.setItem('userName', response.data.data.name);
      localStorage.setItem('userRole', response.data.data.role);
      localStorage.setItem('userData', JSON.stringify(response.data.data));

      const userRole = response.data.data.role;
      
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      localStorage.removeItem('redirectAfterLogin');
      
      if (userRole === 'admin') {
        console.log('User is admin, redirecting to /admin');
        navigate('/admin');
      } else {
        console.log('User is not admin, redirecting to', redirectPath || '/');
        navigate(redirectPath || '/');
      }
    } catch (error) {
      console.log("Login error:", error);
      
      const errorResponse = error.response?.data;
      const statusCode = error.response?.status;
      const errorMessage = errorResponse?.message || errorResponse?.error || error.message;
      
      console.log("Error details:", { statusCode, errorMessage });
      
      // Xử lý lỗi 400 - Bad Request (thường là sai tài khoản/thông tin)
      if (statusCode === 400) {
        
        // Đánh dấu email không hợp lệ để hiển thị viền đỏ
        setValidation(prev => ({
          ...prev,
          email: {
            isValid: false,
            showError: true,
            errorMessage: 'Account not found. Please check your email or create a new account.'
          }
        }));
        
        // Focus vào trường email để người dùng có thể sửa
        if (emailInputRef.current) {
          setTimeout(() => {
            emailInputRef.current.focus();
          }, 100);
        }
      }
      // Xử lý lỗi mật khẩu không đúng (thường có status 401)
      else if (statusCode === 401 || 
          errorMessage?.includes('Password mismatch') || 
          errorMessage?.includes('password') || 
          errorMessage?.toLowerCase().includes('incorrect') ||
          error.stack?.includes('Password mismatch')) {
        
        setLoginError('Incorrect password. Please try again.');
        
        if (passwordInputRef.current) {
          setTimeout(() => {
            passwordInputRef.current.focus();
            setLoginData(prev => ({ ...prev, password: '' }));
          }, 100);
        }
      } 
      // Xử lý lỗi email không tồn tại
      else if (errorMessage?.includes('User not found') || 
               errorMessage?.includes('user not found') || 
               errorMessage?.includes('no user')) {
        // Đánh dấu email không hợp lệ để hiển thị viền đỏ
        setValidation(prev => ({
          ...prev,
          email: {
            isValid: false,
            showError: true,
            errorMessage: 'Email address not found. Please check or create an account.'
          }
        }));
        
        setLoginError('Email address not found. Please check your email or create an account.');
        
        if (emailInputRef.current) {
          setTimeout(() => {
            emailInputRef.current.focus();
          }, 100);
        }
      } 
      // Các lỗi khác
      else {
        setLoginError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Field */}
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <Input
            ref={emailInputRef}
            id="email"
            type="email"
            name="email"
            placeholder="name@example.com"
            className={`w-full pl-10 pr-3 py-2 border ${
              validation.email.showError 
                ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
            } rounded-md focus:outline-none focus:ring-2`}
            value={loginData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            required
          />
        </div>
        
        {validation.email.showError && (
          <div className="mt-1 text-red-500 text-sm">
            <span>{validation.email.errorMessage || 'Please enter a valid email address'}</span>
          </div>
        )}
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <a 
            href="#" 
            className="text-sm text-blue-600 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              // Add forgot password logic
            }}
          >
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <Input
            ref={passwordInputRef}
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={loginData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Remember Me */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="remember"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
          Remember me for 30 days
        </label>
      </div>

      {/* Error Display */}
      {loginError && (
        <div className="mt-2 text-red-600 text-sm p-2">
          <span>{loginError}</span>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
};

export default Login;