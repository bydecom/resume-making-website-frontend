import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import api, { handleApiError } from '../../../utils/api';

// Icon components
const MailIcon = () => (
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  </div>
);

const LockIcon = () => (
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState({
    email: { isValid: false, showError: false }
  });
  const [focusedField, setFocusedField] = useState(null);
  
  // Refs để truy cập trực tiếp vào DOM elements
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Kiểm tra giá trị email và focus nếu không hợp lệ
  useEffect(() => {
    if (validation.email.showError && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [validation.email.showError]);

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
          // Nếu email hợp lệ, tắt thông báo lỗi; nếu không, giữ nguyên trạng thái hiển thị lỗi
          showError: isValid ? false : prev.email.showError
        }
      }));
    }
  };

  const handleFocus = (name) => {
    setFocusedField(name);
  };

  const handleBlur = (name) => {
    setFocusedField(null);
    
    // Validate khi blur
    if (name === 'email' && loginData.email) {
      const isValid = validateEmail(loginData.email);
      
      setValidation(prev => ({
        ...prev,
        email: {
          isValid,
          showError: !isValid // Hiển thị lỗi nếu không hợp lệ
        }
      }));
      
      // Nếu không hợp lệ, tự động focus lại vào trường email
      if (!isValid && emailInputRef.current) {
        // Đặt setTimeout để đảm bảo focus sau khi blur hoàn tất
        setTimeout(() => {
          emailInputRef.current.focus();
        }, 10);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email trước khi submit
    if (loginData.email && !validateEmail(loginData.email)) {
      setValidation(prev => ({
        ...prev,
        email: {
          isValid: false,
          showError: true
        }
      }));
      
      // Focus vào email nếu không hợp lệ
      if (emailInputRef.current) {
        emailInputRef.current.focus();
      }
      
      return;
    }
    
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

      const redirectPath = localStorage.getItem('redirectAfterLogin');
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath || '/');
    } catch (error) {
      const errorMessage = handleApiError(error, navigate);
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div className="relative">
        <MailIcon />
        <Input
          id="email"
          type="email"
          name="email"
          placeholder=" "
          className={`peer w-full pl-10 pr-10 pt-7 pb-2 h-14 border rounded-md focus:outline-none focus:ring-2 transition-colors
            ${focusedField === 'email' 
              ? 'border-blue-500 focus:ring-blue-200' 
              : validation.email.isValid && loginData.email
                ? 'border-green-500 focus:ring-green-200'
                : validation.email.showError
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-200'
            }`}
          value={loginData.email}
          onChange={handleChange}
          onFocus={() => handleFocus('email')}
          onBlur={() => handleBlur('email')}
          required
        />
        <Label
          htmlFor="email"
          className={`absolute left-10 text-gray-400 transition-all duration-200
            peer-placeholder-shown:text-base peer-placeholder-shown:top-4
            peer-focus:top-2 peer-focus:text-xs
            ${focusedField === 'email'
              ? 'text-blue-500'
              : validation.email.isValid && loginData.email
                ? 'text-green-500'
                : validation.email.showError
                  ? 'text-red-500'
                  : ''
            }
            top-2 text-xs`}
        >
          Email address
        </Label>
        
        {/* Show check icon when valid */}
        {validation.email.isValid && !focusedField && loginData.email && (
          <Check className="absolute right-3 top-4 h-5 w-5 text-green-500" />
        )}
      </div>
      
      {/* Email error message */}
      {validation.email.showError && (
        <div className="flex items-center space-x-2 -mt-1 text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
          <AlertCircle className="h-4 w-4" />
          <span>Please include an '@' in the email address. 'aaaa' is missing an '@'.</span>
        </div>
      )}

      {/* Password Field */}
      <div className="relative mt-6">
        <LockIcon />
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder=" "
          className={`peer w-full pl-10 pr-10 pt-7 pb-2 h-14 border rounded-md focus:outline-none focus:ring-2 transition-colors
            ${focusedField === 'password'
              ? 'border-blue-500 focus:ring-blue-200'
              : 'border-gray-200'
            }`}
          value={loginData.password}
          onChange={handleChange}
          onFocus={() => handleFocus('password')}
          onBlur={() => handleBlur('password')}
          required
        />
        <Label
          htmlFor="password"
          className={`absolute left-10 text-gray-400 transition-all duration-200
            peer-placeholder-shown:text-base peer-placeholder-shown:top-4
            peer-focus:top-2 peer-focus:text-xs
            ${focusedField === 'password' ? 'text-blue-500' : ''}
            top-2 text-xs`}
        >
          Password
        </Label>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Remember Me and Forgot Password */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="remember" className="ml-2 text-gray-600">
            Remember me
          </label>
        </div>
        <Button
          variant="link"
          className="text-blue-600 hover:text-blue-500"
          onClick={(e) => {
            e.preventDefault();
            // Add forgot password logic
          }}
        >
          Forgot password?
        </Button>
      </div>

      {/* Error Display */}
      {loginError && (
        <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
          <span>{loginError}</span>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="animate-spin mr-2">⌛</span>
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  );
};

export default Login;