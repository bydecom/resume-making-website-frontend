import React from 'react';

export const Button = ({ 
  children, 
  className = '', 
  variant = 'default', 
  onClick, 
  type = 'button',
  disabled = false
}) => {
  const baseStyles = "flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 py-2 px-4",
    link: "bg-transparent text-blue-600 hover:text-blue-800 p-0 underline",
  };
  
  const variantStyle = variants[variant] || variants.default;
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyle} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}; 