import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the login page
    navigate('/login');
  }, [navigate]);

  return null; // This component will not render anything as it immediately redirects
};

export default Register; 