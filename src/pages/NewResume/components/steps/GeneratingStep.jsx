import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

const GeneratingStep = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate the generation process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete?.();
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    // Update current step based on progress
    const stepProgress = progress / 20; // 5 steps, so each step is 20%
    setCurrentStep(Math.min(Math.floor(stepProgress), steps.length - 1));
  }, [progress]);

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