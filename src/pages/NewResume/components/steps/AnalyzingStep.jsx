import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../../../utils/axios';

const AnalyzingStep = ({ cvId, jobDescriptionId, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [tips, setTips] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchTips = async () => {
      try {
        // Make API call to get tips
        const tipsResponse = await axiosInstance.post('/api/resumes/tips', {
          cvId,
          jobDescriptionId
        });
        
        // Create a draft resume and get its ID
        const draftResponse = await axiosInstance.post('/api/resumes/draft', {
          cvId,
          jobDescriptionId
        });



        // Check if response has data property
        if (tipsResponse.data && draftResponse.data.data) {
          setTips(tipsResponse.data);
          
          // After getting tips, wait 2 seconds before navigating to edit the draft resume
          setTimeout(() => {
            // if (onComplete) {
            //   onComplete(tipsResponse.data);
            // } else {
              // Navigate to edit-resume with the draft resume ID and tips
              navigate('/resume/create-new', {
                state: {
                  fromAnalyzing: true,
                  tips: tipsResponse.data,
                  resumeId: draftResponse.data.data._id,
                  isNewResume: true,
                  // Include template if available
                  template: location.state?.template ? {
                    id: location.state.template,
                    ...location.state.templateData
                  } : null
                }
              });
            // }
          }, 2000);
        } else {
          setError('Failed to analyze CV and job description');
        }
      } catch (err) {
        console.error('Error analyzing:', err);
        if (err.response) {
          setError(err.response.data.message || 'Server error occurred');
        } else if (err.request) {
          setError('No response from server. Please check your connection.');
        } else {
          setError(err.message || 'Failed to analyze');
        }
      }
    };

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          fetchTips(); // Make API call when progress reaches 100%
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [cvId, jobDescriptionId, navigate, onComplete, location.state]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-red-50 rounded-lg">
        <h3 className="text-red-600 font-medium">Error Analyzing</h3>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => navigate('/new-resume')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Progress Bar */}
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              Analyzing
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600">
              {progress}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
          />
        </div>
      </div>

      {/* Analysis Steps */}
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-medium text-blue-800 mb-4">Analyzing Your CV and Job Description</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${progress >= 30 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                {progress >= 30 ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : "1"}
              </div>
              <div>
                <h4 className="font-medium text-blue-700">Identifying Key Requirements</h4>
                <p className="text-sm text-blue-600">Extracting the most important skills and qualifications</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${progress >= 60 ? 'bg-green-500 text-white' : progress >= 30 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {progress >= 60 ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : "2"}
              </div>
              <div>
                <h4 className="font-medium text-blue-700">Analyzing Your Experience</h4>
                <p className="text-sm text-blue-600">Finding your most relevant achievements</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${progress >= 90 ? 'bg-green-500 text-white' : progress >= 60 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {progress >= 90 ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : "3"}
              </div>
              <div>
                <h4 className="font-medium text-blue-700">Preparing Resume Tips</h4>
                <p className="text-sm text-blue-600">Creating personalized suggestions for your resume</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="text-center text-sm text-gray-500">
        <p>We're analyzing your information to provide customized resume tips.</p>
        <p>You'll be redirected to the resume editor once analysis is complete.</p>
      </div>

      {/* Display tips if available */}
      {tips && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 animate-fade-in">
          <h3 className="text-xl font-medium text-green-800 mb-4">Analysis Complete</h3>
          <p className="text-green-600">Redirecting to resume editor...</p>
        </div>
      )}
    </div>
  );
};

export default AnalyzingStep; 