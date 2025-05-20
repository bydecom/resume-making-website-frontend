import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../../../utils/axios';
import MatchedResumeTemplate from '../../../../templates/MatchedResumeTemplate';

const steps = [
  {
    id: 1,
    title: 'Analyzing CV',
    description: 'Extracting relevant information from your CV'
  },
  {
    id: 2,
    title: 'Processing Job Description',
    description: 'Identifying key requirements and skills'
  },
  {
    id: 3,
    title: 'Matching Skills',
    description: 'Finding the best matches between your experience and job requirements'
  },
  {
    id: 4,
    title: 'Generating Content',
    description: 'Creating tailored content for your resume'
  },
  {
    id: 5,
    title: 'Optimizing Format',
    description: 'Applying ATS-friendly formatting'
  }
];

const GeneratingStep = ({ onComplete, cvId, jobDescriptionId, templateId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [matchedResume, setMatchedResume] = useState(null);
  const [error, setError] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!cvId) {
      console.error('No CV ID provided to GeneratingStep');
      setError('No CV ID provided. Please select a CV first.');
    } else if (typeof cvId !== 'string' && typeof cvId !== 'object') {
      console.error('Invalid CV ID format:', cvId, typeof cvId);
      setError('Invalid CV ID format. Please try again.');
    } else {
      console.log('GeneratingStep initialized with valid CV ID:', cvId);
    }

    if (!jobDescriptionId) {
      console.error('No Job Description ID provided to GeneratingStep');
      setError('No Job Description ID provided. Please provide a job description first.');
    }

    if (!templateId) {
      console.error('No Template ID provided to GeneratingStep');
      setError('No Template ID provided. Please select a template first.');
    }
  }, [cvId, jobDescriptionId, templateId]);

  useEffect(() => {
    const generateResume = async () => {
      try {
        // Make API call with cvId and jobDescriptionId
        const response = await axiosInstance.post('/api/resumes/match', {
          cvId,
          jobDescriptionId,
          templateId
        });

        if (response.data.success) {
          // Ensure roleApply is included in the matched resume data
          const matchedData = {
            ...response.data.data,
            roleApply: response.data.data.roleApply || response.data.data.jobDescription?.position
          };
          setMatchedResume(matchedData);
          setIsReviewing(true);
        } else {
          setError(response.data.message || 'Failed to generate resume');
        }
      } catch (err) {
        console.error('Error generating resume:', err);
        // Handle different types of errors
        if (err.response) {
          setError(err.response.data.message || 'Server error occurred');
        } else if (err.request) {
          setError('No response from server. Please check your connection.');
        } else {
          setError(err.message || 'Failed to generate resume');
        }
      }
    };

    // Simulate the generation process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          generateResume(); // Make API call when progress reaches 100%
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [cvId, jobDescriptionId, templateId]);

  useEffect(() => {
    // Update current step based on progress
    const stepProgress = progress / 20; // 5 steps, so each step is 20%
    setCurrentStep(Math.min(Math.floor(stepProgress), steps.length - 1));
  }, [progress]);

  const handleApprove = () => {
    // Nếu có callback onComplete thì gọi nó
    if (onComplete) {
      onComplete(matchedResume);
    } else {
      // Lấy ID của resume mới được tạo từ response API
      const newResumeId = matchedResume._id;
      
      // Chuyển hướng trực tiếp đến trang edit với ID
      navigate(`/edit-resume/${newResumeId}`);
    }
  };

  const handleRegenerateClick = async () => {
    setIsReviewing(false);
    setProgress(0);
    setMatchedResume(null);
    // Quá trình sẽ tự động bắt đầu lại nhờ vào useEffect
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-red-50 rounded-lg">
        <h3 className="text-red-600 font-medium">Error Generating Resume</h3>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={handleRegenerateClick}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isReviewing && matchedResume) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Review Your Tailored Resume</h3>
          <p className="text-blue-600">
            We've analyzed your CV and the job description to create a tailored resume. 
            Please review the content and formatting below.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <MatchedResumeTemplate formData={matchedResume} />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleRegenerateClick}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Regenerate
          </button>
          <button
            onClick={handleApprove}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Approve and Continue
          </button>
        </div>
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
              Progress
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

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`p-4 rounded-lg transition-colors ${
              index === currentStep
                ? 'bg-blue-50 border border-blue-200'
                : index < currentStep
                ? 'bg-gray-50'
                : 'bg-white'
            }`}
          >
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  index === currentStep
                    ? 'bg-blue-500 text-white'
                    : index < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index < currentStep ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <div>
                <h3 className={`font-medium ${
                  index === currentStep ? 'text-blue-700' : 'text-gray-900'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-sm ${
                  index === currentStep ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="text-center text-sm text-gray-500">
        <p>This process typically takes about 1-2 minutes.</p>
        <p>We're making sure your resume stands out while remaining ATS-friendly.</p>
      </div>
    </div>
  );
};

export default GeneratingStep; 