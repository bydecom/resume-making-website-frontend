import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReviewCVStep from './components/steps/ReviewCVStep';
import ChooseMethodStep from './components/steps/ChooseMethodStep';
import JobDescriptionStep from './components/steps/JobDescriptionStep';
import GeneratingStep from './components/steps/GeneratingStep';
import AnalyzingStep from './components/steps/AnalyzingStep';
import { getDefaultTemplate } from '../../templates';
import axiosInstance from '../../utils/axios';

const steps = [
  {
    id: 1,
    title: 'Review CV',
    description: ''
  },
  {
    id: 2,
    title: 'Choose Method',
    description: 'Select how you want to create your resume'
  },
  {
    id: 3,
    title: 'Job Description',
    description: 'Enter the job description to tailor your resume'
  },
  {
    id: 4,
    title: 'Processing',
    description: 'Processing your resume'
  }
];

const NewResume = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCV, setSelectedCV] = useState(location.state?.selectedCV || null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(location.state?.selectedTemplate || null);
  const [cvData, setCvData] = useState({ cvs: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Fetch CV data
  const fetchCVData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/cv', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch CV data: ${response.statusText}`);
      }

      const data = await response.json();
      const processedCVs = data.data.map(cv => ({
        ...cv,
        template: cv.template || { id: getDefaultTemplate().id },
        score: calculateCVScore(cv),
        progress: calculateCVProgress(cv)
      }));

      setCvData({ cvs: processedCVs });

      // If we have a selectedCV from navigation state, find and select it
      if (location.state?.selectedCV) {
        const cvFromState = processedCVs.find(
          cv => cv._id === location.state.selectedCV._id
        );
        if (cvFromState) {
          setSelectedCV(cvFromState);
        }
      }
    } catch (err) {
      console.error('Error fetching CV data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate CV score (copy from Dashboard)
  const calculateCVScore = (cv) => {
    let score = 50;
    if (cv.personalInfo) {
      if (cv.personalInfo.firstName && cv.personalInfo.lastName) score += 5;
      if (cv.personalInfo.email) score += 3;
      if (cv.personalInfo.phone) score += 3;
      if (cv.personalInfo.location) score += 2;
      if (cv.personalInfo.linkedin) score += 2;
    }
    if (cv.summary && cv.summary.length > 0) score += 5;
    if (cv.experience && cv.experience.length > 0) score += 10;
    if (cv.education && cv.education.length > 0) score += 10;
    if (cv.skills && cv.skills.length > 0) score += 5;
    if (cv.projects && cv.projects.length > 0) score += 5;
    if (cv.certifications && cv.certifications.length > 0) score += 3;
    if (cv.languages && cv.languages.length > 0) score += 2;
    return Math.min(score, 100);
  };

  // Calculate CV progress (copy from Dashboard)
  const calculateCVProgress = (cv) => {
    let totalFields = 8;
    let filledFields = 0;
    if (cv.personalInfo && cv.personalInfo.firstName && cv.personalInfo.lastName && cv.personalInfo.email) {
      filledFields += 1;
    }
    if (cv.summary && cv.summary.length > 0) filledFields += 1;
    if (cv.experience && cv.experience.length > 0) filledFields += 1;
    if (cv.education && cv.education.length > 0) filledFields += 1;
    if (cv.skills && cv.skills.length > 0) filledFields += 1;
    if (cv.projects && cv.projects.length > 0) filledFields += 1;
    if (cv.certifications && cv.certifications.length > 0) filledFields += 1;
    if (cv.languages && cv.languages.length > 0) filledFields += 1;
    return Math.round((filledFields / totalFields) * 100);
  };

  useEffect(() => {
    fetchCVData();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCVSelect = (cv) => {
    console.log('CV selected in NewResume:', cv);
    setSelectedCV(cv);
    handleNext();
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    handleNext();
  };

  const handleJobDescriptionSubmit = (data) => {
    if (!data._id) {
      console.error('No job description ID received');
      return;
    }
    setJobDescription(data);
    handleNext();
  };

  // Function to handle navigation to CreateNew after generating resume
  const handleGeneratedResume = (matchedResume) => {
    console.log("Received matched resume data:", matchedResume);
    
    // Thay vì điều hướng đến /resume/create-new
    // Điều hướng trực tiếp đến /edit-resume/:id
    navigate(`/edit-resume/${matchedResume._id}`);
  };

  // Function to handle navigation to CreateNew after analyzing CV and job description
  const handleAnalyzedResume = (tips) => {
    console.log("Received resume tips:", tips);
    // Navigate to CreateNew with the tips data
    navigate('/resume/create-new', { 
      state: { 
        fromAnalyzing: true,
        tips,
        cvId: selectedCV?._id,
        jobDescriptionId: jobDescription?._id
      } 
    });
  };

  const handleJobDescriptionComplete = (jdData) => {
    if (jdData.method === 'useAI') {
      // Show GeneratingStep
      setCurrentStep(<GeneratingStep 
        onComplete={handleGeneratedResume}
        cvId={selectedCV._id} 
        jobDescriptionId={jdData._id} 
      />);
    } else {
      // Show AnalyzingStep
      setCurrentStep(<AnalyzingStep 
        cvId={selectedCV._id} 
        jobDescriptionId={jdData._id}
        onComplete={handleAnalyzedResume}
      />);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ReviewCVStep 
          cvData={cvData}
          isLoading={isLoading}
          onSelect={handleCVSelect}
          initialCV={selectedCV}
        />;
      case 2:
        return <ChooseMethodStep onMethodSelect={handleMethodSelect} selectedCV={selectedCV} />;
      case 3:
        return (
          <JobDescriptionStep 
            onSubmit={handleJobDescriptionSubmit} 
            selectedCV={selectedCV}
            selectedMethod={selectedMethod}
          />
        );
      case 4:
        console.log('Rendering step 4 with CV:', selectedCV);
        console.log('Selected CV ID being passed to GeneratingStep:', selectedCV?._id);
        console.log('Selected template being passed to GeneratingStep:', selectedTemplate?.id);
        
        return selectedMethod === 'useAI' ? (
          <GeneratingStep 
            onComplete={handleGeneratedResume}
            cvId={selectedCV?._id}
            jobDescriptionId={jobDescription?._id}
            templateId={selectedTemplate?.id || 'professionalBlue'}
          />
        ) : (
          <AnalyzingStep 
            cvId={selectedCV?._id}
            jobDescriptionId={jobDescription?._id}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create New Resume</h1>
          <div className="w-14"></div> {/* Spacer for alignment */}
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`flex-1 ${
                  step.id === steps.length ? '' : 'relative'
                }`}
              >
                <div 
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center relative z-10 ${
                    step.id <= currentStep 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.id}
                </div>
                {step.id !== steps.length && (
                  <div 
                    className={`absolute top-4 left-1/2 w-full h-0.5 ${
                      step.id < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                )}
                <div className="text-center mt-2">
                  <span className="text-sm font-medium text-gray-500">
                    {step.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </div>

          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        {currentStep !== 4 && (
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-4 py-2 rounded-md ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !selectedCV) ||
                (currentStep === 2 && !selectedMethod) ||
                (currentStep === 3 && !jobDescription)
              }
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {currentStep === steps.length ? 'Finish' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewResume;
