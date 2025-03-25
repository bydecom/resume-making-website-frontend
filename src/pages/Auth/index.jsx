import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import AuthLeftPanel from './components/AuthLeftPanel';
import Login from './components/Login';
import Register from './components/Register';

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === '/register' ? false : true;

  // Prevent scrolling on mount
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleFormSwitch = () => {
    navigate(isLogin ? '/register' : '/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors flex items-center justify-center z-10"
        aria-label="Go back"
      >
        <ArrowRightIcon />
      </button>

      <div className="fixed inset-0 flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel */}
        <AuthLeftPanel 
          title="Create Your Professional Resume"
          description="Join thousands of job seekers who have successfully landed their dream jobs using our platform."
          imageSrc="/resume-builder-illustration.svg"
        />

        {/* Right Panel - Forms */}
        <div className="flex flex-col justify-center items-center p-4 md:p-8 md:w-1/2 overflow-y-auto">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight">
                {isLogin ? "Sign in to your account" : "Create an account"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {isLogin ? "Enter your credentials to access your account" : "Enter your information to get started"}
              </p>
            </div>

            {/* Forms */}
            <div className="relative">
              {isLogin ? <Login /> : <Register />}
            </div>

            {/* Toggle between login and register */}
            <div className="text-center">
              <Button
                variant="link"
                className="text-sm text-gray-500"
                onClick={handleFormSwitch}
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
