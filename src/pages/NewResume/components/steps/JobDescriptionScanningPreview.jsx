import React, { useState, useEffect } from 'react';

const JobDescriptionScanningPreview = ({ isOpen, onComplete, data }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const scanSteps = [
    {
      id: 'basic',
      label: 'Basic Information',
      fields: ['title', 'company', 'location', 'jobType'],
      status: 'pending'
    },
    {
      id: 'details',
      label: 'Job Details',
      fields: ['description', 'requirements', 'responsibilities'],
      status: 'pending'
    },
    {
      id: 'benefits',
      label: 'Benefits & Compensation',
      fields: ['benefits', 'salary'],
      status: 'pending'
    },
    {
      id: 'additional',
      label: 'Additional Information',
      fields: ['keywords', 'applicationDeadline', 'contactInfo'],
      status: 'pending'
    }
  ];

  useEffect(() => {
    if (isOpen && data) {
      simulateScanning();
    }
  }, [isOpen, data]);

  const simulateScanning = async () => {
    for (let i = 0; i < scanSteps.length; i++) {
      setCurrentStep(i);
      await simulateStepProcessing(i);
      updateStepStatus(i, 'completed');
    }
    // Show preview after scanning is complete
    setShowPreview(true);
  };

  const simulateStepProcessing = async (stepIndex) => {
    const startProgress = (stepIndex / scanSteps.length) * 100;
    const endProgress = ((stepIndex + 1) / scanSteps.length) * 100;
    
    return new Promise(resolve => {
      let currentProgress = startProgress;
      const interval = setInterval(() => {
        if (currentProgress >= endProgress) {
          clearInterval(interval);
          resolve();
        } else {
          currentProgress += 1;
          setProgress(currentProgress);
        }
      }, 50);
    });
  };

  const updateStepStatus = (stepIndex, status) => {
    scanSteps[stepIndex].status = status;
  };

  const handleConfirm = () => {
    onComplete(data);
  };

  // Thêm hàm kiểm tra dữ liệu
  const jobData = data;

  const renderPreview = () => {
    if (!jobData) return null;

    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Review Job Description</h2>
          <button
            onClick={() => setShowPreview(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-lg font-medium mb-3">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Job Title</label>
                <p className="font-medium">{jobData.title || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Company</label>
                <p className="font-medium">{jobData.company || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Location</label>
                <p className="font-medium">{jobData.location || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Job Type</label>
                <p className="font-medium capitalize">{jobData.jobType || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {jobData.description && (
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-lg font-medium mb-3">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{jobData.description}</p>
            </div>
          )}

          {/* Requirements */}
          {jobData.requirements?.length > 0 && (
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-lg font-medium mb-3">Requirements</h3>
              <ul className="list-disc list-inside space-y-1">
                {jobData.requirements.map((req, index) => (
                  <li key={index} className="text-gray-700">{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Responsibilities */}
          {jobData.responsibilities?.length > 0 && (
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-lg font-medium mb-3">Responsibilities</h3>
              <ul className="list-disc list-inside space-y-1">
                {jobData.responsibilities.map((resp, index) => (
                  <li key={index} className="text-gray-700">{resp}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits & Compensation */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-lg font-medium mb-3">Benefits & Compensation</h3>
            {jobData.salary && (
              <div className="mb-4">
                <h4 className="text-sm text-gray-600 mb-2">Salary</h4>
                <p className="font-medium">
                  {jobData.salary.min?.toLocaleString()} 
                  {jobData.salary.max && ` - ${jobData.salary.max.toLocaleString()}`} 
                  {jobData.salary.currency} per {jobData.salary.period}
                </p>
              </div>
            )}
            {jobData.benefits?.length > 0 && (
              <div>
                <h4 className="text-sm text-gray-600 mb-2">Benefits</h4>
                <ul className="list-disc list-inside space-y-1">
                  {jobData.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-700">{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Keywords */}
          {jobData.keywords?.length > 0 && (
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-lg font-medium mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {jobData.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-lg font-medium mb-3">Additional Information</h3>
            <div className="space-y-4">
              {jobData.applicationDeadline && (
                <div>
                  <label className="text-sm text-gray-600">Application Deadline</label>
                  <p className="font-medium">
                    {(() => {
                      const [day, month, year] = jobData.applicationDeadline.split('/');
                      const date = new Date(+year, +month - 1, +day);
                      return date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });
                    })()}
                  </p>
                </div>
              )}
              {jobData.contactInfo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobData.contactInfo.name && (
                    <div>
                      <label className="text-sm text-gray-600">Contact Person</label>
                      <p className="font-medium">{jobData.contactInfo.name}</p>
                    </div>
                  )}
                  {jobData.contactInfo.email && (
                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <p className="font-medium">{jobData.contactInfo.email}</p>
                    </div>
                  )}
                  {jobData.contactInfo.phone && (
                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <p className="font-medium">{jobData.contactInfo.phone}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => setShowPreview(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Back to Scanning
          </button>
          <button
            onClick={() => onComplete(jobData)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Confirm and Continue
          </button>
        </div>
      </>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        {!showPreview ? (
          // Scanning UI
          <>
            <h2 className="text-xl font-semibold mb-4">Processing Job Description</h2>
            <div className="h-2 w-full bg-gray-100 rounded-full mb-4">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="space-y-4">
              {scanSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border ${
                    currentStep === index
                      ? 'border-blue-500 bg-blue-50'
                      : step.status === 'completed'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      {step.status === 'completed' ? (
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : currentStep === index ? (
                        <div className="h-6 w-6">
                          <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-gray-300"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{step.label}</h3>
                      <p className="text-sm text-gray-500">
                        {currentStep === index
                          ? 'Processing...'
                          : step.status === 'completed'
                          ? 'Completed'
                          : 'Waiting'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center text-sm text-gray-500">
              Please wait while we analyze and extract information from the job description
            </div>
          </>
        ) : (
          renderPreview()
        )}
      </div>
    </div>
  );
};

export default JobDescriptionScanningPreview; 