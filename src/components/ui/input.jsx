import React from 'react';

export const Input = ({ 
  id, 
  className = '', 
  type = 'text', 
  placeholder = '',
  value,
  onChange,
  disabled = false,
  name,
  required = false
}) => {
  return (
    <input
      id={id}
      name={name || id}
      type={type}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
    />
  );
}; 