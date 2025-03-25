import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import api, { handleApiError } from '../../../utils/api';

// Icon components
const UserIcon = () => (
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  </div>
);

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

const Register = () => {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [registerError, setRegisterError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  // Validation state
  const [validation, setValidation] = useState({
    name: { isValid: false, showError: false, message: '' },
    email: { isValid: false, showError: false, message: '' },
    password: { isValid: false, showError: false, message: '' },
    confirmPassword: { isValid: false, showError: false, message: '' }
  });

  // Refs để truy cập các input
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  // Mapping ref theo field name
  const inputRefs = {
    name: nameInputRef,
    email: emailInputRef,
    password: passwordInputRef,
    confirmPassword: confirmPasswordInputRef
  };

  // Focus vào input không hợp lệ
  useEffect(() => {
    Object.keys(validation).forEach(field => {
      if (validation[field].showError && inputRefs[field]?.current) {
        inputRefs[field].current.focus();
      }
    });
  }, [validation]);

  // Validation functions
  const validateName = (name) => {
    if (!name || name.trim().length < 2) {
      return {
        isValid: false,
        message: 'Name must be at least 2 characters'
      };
    }
    return {
      isValid: true,
      message: ''
    };
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return {
        isValid: false,
        message: 'Please enter a valid email address'
      };
    }
    return {
      isValid: true,
      message: ''
    };
  };

  const validatePassword = (password) => {
    if (!password || password.length < 6) {
      return {
        isValid: false,
        message: 'Password must be at least 6 characters'
      };
    }
    return {
      isValid: true,
      message: ''
    };
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) {
      return {
        isValid: false,
        message: 'Please confirm your password'
      };
    }
    if (confirmPassword !== registerData.password) {
      return {
        isValid: false,
        message: 'Passwords do not match'
      };
    }
    return {
      isValid: true,
      message: ''
    };
  };

  // Validate field by name
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return validateName(value);
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'confirmPassword':
        return validateConfirmPassword(value);
      default:
        return { isValid: true, message: '' };
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));

    // Validate và cập nhật trạng thái
    const result = validateField(name, value);
    setValidation(prev => ({
      ...prev,
      [name]: {
        ...result,
        showError: result.isValid ? false : prev[name].showError
      }
    }));

    // Cập nhật lại validation của confirmPassword khi password thay đổi
    if (name === 'password' && registerData.confirmPassword) {
      const confirmResult = validateConfirmPassword(registerData.confirmPassword);
      setValidation(prev => ({
        ...prev,
        confirmPassword: {
          ...confirmResult,
          showError: confirmResult.isValid ? false : prev.confirmPassword.showError
        }
      }));
    }
  };

  const handleFocus = (name) => {
    setFocusedField(name);
    
    // Tắt thông báo lỗi khi focus
    setValidation(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        showError: false
      }
    }));
  };

  const handleBlur = (name) => {
    setFocusedField(null);
    
    // Validate khi blur - chỉ cần kiểm tra nếu đã nhập giá trị
    if (registerData[name]) {
      const result = validateField(name, registerData[name]);
      
      setValidation(prev => ({
        ...prev,
        [name]: {
          ...result,
          showError: !result.isValid
        }
      }));
      
      // Focus lại nếu không hợp lệ
      if (!result.isValid && inputRefs[name]?.current) {
        setTimeout(() => {
          inputRefs[name].current.focus();
        }, 10);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate tất cả các trường
    let hasError = false;
    const newValidation = { ...validation };
    
    Object.keys(registerData).forEach(field => {
      // Bỏ qua confirmPassword khi gửi API
      if (field !== 'confirmPassword') {
        const result = validateField(field, registerData[field]);
        if (!result.isValid) {
          hasError = true;
          newValidation[field] = { ...result, showError: true };
        }
      } else {
        // Validate confirmPassword riêng
        const result = validateConfirmPassword(registerData.confirmPassword);
        if (!result.isValid) {
          hasError = true;
          newValidation.confirmPassword = { ...result, showError: true };
        }
      }
    });
    
    if (hasError) {
      setValidation(newValidation);
      
      // Focus vào trường đầu tiên có lỗi
      for (const field of Object.keys(newValidation)) {
        if (!newValidation[field].isValid && inputRefs[field]?.current) {
          inputRefs[field].current.focus();
          break;
        }
      }
      
      return;
    }
    
    if (isLoading) return;

    try {
      setIsLoading(true);
      setRegisterError('');
      
      // Tạo data object để gửi lên server (loại bỏ confirmPassword)
      const { confirmPassword, ...dataToSubmit } = registerData;
      
      const response = await api.post('/api/users/register', dataToSubmit);
      
      if (response.data.status === 'success') {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('role', response.data.data.role);
        localStorage.setItem('userData', JSON.stringify(response.data.data));
        navigate('/');
      }
    } catch (error) {
      const errorMessage = handleApiError(error, navigate);
      setRegisterError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper để tạo className cho input fields với màu nền giống autofill
  const getInputClassName = (field) => `peer w-full pl-10 pr-${field === 'password' || field === 'confirmPassword' ? '10' : '4'} pt-7 pb-2 h-14 border rounded-md focus:outline-none focus:ring-2 transition-colors
    ${focusedField === field 
      ? 'border-blue-500 focus:ring-blue-200' 
      : validation[field].isValid && registerData[field]
        ? 'border-green-500 focus:ring-green-200 bg-[#e8f0fe]' // Màu nền giống autofill
        : validation[field].showError
          ? 'border-red-500 focus:ring-red-200 bg-red-50'
          : 'border-gray-200'
    }`;

  // Helper để tạo className cho labels
  const getLabelClassName = (field) => `absolute left-10 text-gray-400 transition-all duration-200
    peer-placeholder-shown:text-base peer-placeholder-shown:top-4
    peer-focus:top-2 peer-focus:text-xs
    ${focusedField === field
      ? 'text-blue-500'
      : validation[field].isValid && registerData[field]
        ? 'text-green-500'
        : validation[field].showError
          ? 'text-red-500'
          : ''
    }
    top-2 text-xs`;

  // Khi toggle hiển thị password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div className="relative">
        <UserIcon />
        <Input
          ref={nameInputRef}
          id="name"
          type="text"
          name="name"
          placeholder=" "
          className={getInputClassName('name')}
          value={registerData.name}
          onChange={handleChange}
          onFocus={() => handleFocus('name')}
          onBlur={() => handleBlur('name')}
          required
        />
        <Label
          htmlFor="name"
          className={getLabelClassName('name')}
        >
          Full Name
        </Label>
        
        {/* Show check icon when name is valid */}
        {validation.name.isValid && !focusedField && registerData.name && (
          <Check className="absolute right-3 top-4 h-5 w-5 text-green-500" />
        )}
      </div>
      
      {/* Name error message */}
      {validation.name.showError && (
        <div className="flex items-center space-x-2 -mt-1 text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
          <AlertCircle className="h-4 w-4" />
          <span>{validation.name.message}</span>
        </div>
      )}

      {/* Email Field */}
      <div className="relative">
        <MailIcon />
        <Input
          ref={emailInputRef}
          id="register-email"
          type="email"
          name="email"
          placeholder=" "
          className={getInputClassName('email')}
          value={registerData.email}
          onChange={handleChange}
          onFocus={() => handleFocus('email')}
          onBlur={() => handleBlur('email')}
          required
        />
        <Label
          htmlFor="register-email"
          className={getLabelClassName('email')}
        >
          Email address
        </Label>
        
        {/* Show check icon when email is valid */}
        {validation.email.isValid && !focusedField && registerData.email && (
          <Check className="absolute right-3 top-4 h-5 w-5 text-green-500" />
        )}
      </div>
      
      {/* Email error message */}
      {validation.email.showError && (
        <div className="flex items-center space-x-2 -mt-1 text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
          <AlertCircle className="h-4 w-4" />
          <span>{validation.email.message}</span>
        </div>
      )}

      {/* Password Field */}
      <div className="relative">
        <LockIcon />
        <Input
          ref={passwordInputRef}
          id="register-password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder=" "
          className={getInputClassName('password')}
          value={registerData.password}
          onChange={handleChange}
          onFocus={() => handleFocus('password')}
          onBlur={() => handleBlur('password')}
          required
        />
        <Label
          htmlFor="register-password"
          className={getLabelClassName('password')}
        >
          Password
        </Label>
        
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>
      
      {/* Password error message */}
      {validation.password.showError && (
        <div className="flex items-center space-x-2 -mt-1 text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
          <AlertCircle className="h-4 w-4" />
          <span>{validation.password.message}</span>
        </div>
      )}

      {/* Confirm Password Field - đã bỏ nút hiển thị mật khẩu nhưng vẫn giữ dấu tích xanh */}
      <div className="relative">
        <LockIcon />
        <Input
          ref={confirmPasswordInputRef}
          id="confirm-password"
          type={showPassword ? "text" : "password"} // Sử dụng cùng state showPassword
          name="confirmPassword"
          placeholder=" "
          className={getInputClassName('confirmPassword')}
          value={registerData.confirmPassword}
          onChange={handleChange}
          onFocus={() => handleFocus('confirmPassword')}
          onBlur={() => handleBlur('confirmPassword')}
          required
        />
        <Label
          htmlFor="confirm-password"
          className={getLabelClassName('confirmPassword')}
        >
          Confirm Password
        </Label>
        
        {/* Hiển thị dấu tích xanh khi confirm password đúng */}
        {validation.confirmPassword.isValid && !focusedField && registerData.confirmPassword && (
          <Check className="absolute right-3 top-4 h-5 w-5 text-green-500" />
        )}
      </div>
      
      {/* Confirm Password error message */}
      {validation.confirmPassword.showError && (
        <div className="flex items-center space-x-2 -mt-1 text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
          <AlertCircle className="h-4 w-4" />
          <span>{validation.confirmPassword.message}</span>
        </div>
      )}

      {/* Error Display for server errors */}
      {registerError && (
        <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
          <AlertCircle className="h-4 w-4" />
          <span>{registerError}</span>
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
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  );
};

export default Register;