import React, { useState, useEffect } from 'react';

const JobDescriptionScanningPreview = ({ isOpen, onComplete, data }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [tempEditData, setTempEditData] = useState(null);

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

  useEffect(() => {
    if (data) {
      setEditedData(data);
    }
  }, [data]);

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

  const handleEditClick = (fieldName) => {
    setEditingField(fieldName);
    setTempEditData(editedData);
  };

  const handleSave = (fieldName) => {
    setEditingField(null);
  };

  const handleCancel = (fieldName) => {
    setEditingField(null);
    setEditedData(tempEditData);
  };

  const handleInputChange = (fieldName, value) => {
    setEditedData(prev => {
      const newData = { ...prev };
      if (fieldName.includes('.')) {
        const [section, key] = fieldName.split('.');
        newData[section] = { ...newData[section], [key]: value };
      } else {
        newData[fieldName] = value;
      }
      return newData;
    });
  };

  const handleBlur = () => {
    setEditingField(null);
  };

  const handleConfirm = () => {
    onComplete(editedData);
  };

  const renderPreview = () => {
    if (!editedData) return null;

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
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Basic Information</h3>
              {editingField === 'basic' ? (
                <div className="space-x-2">
                  <button
                    onClick={() => handleCancel('basic')}
                    className="text-gray-600 hover:text-gray-700 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave('basic')}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEditClick('basic')}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Job Title</label>
                {editingField === 'title' ? (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                    value={editedData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    onBlur={handleBlur}
                    autoFocus
                  />
                ) : (
                  <p 
                    className="font-medium cursor-pointer hover:bg-gray-50 p-1 rounded"
                    onClick={() => handleEditClick('title')}
                  >
                    {editedData.title || 'N/A'}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-600">Company</label>
                {editingField === 'company' ? (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                    value={editedData.company || ''}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    onBlur={handleBlur}
                    autoFocus
                  />
                ) : (
                  <p 
                    className="font-medium cursor-pointer hover:bg-gray-50 p-1 rounded"
                    onClick={() => handleEditClick('company')}
                  >
                    {editedData.company || 'N/A'}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-600">Location</label>
                {editingField === 'location' ? (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                    value={editedData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    onBlur={handleBlur}
                    autoFocus
                  />
                ) : (
                  <p 
                    className="font-medium cursor-pointer hover:bg-gray-50 p-1 rounded"
                    onClick={() => handleEditClick('location')}
                  >
                    {editedData.location || 'N/A'}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-600">Job Type</label>
                {editingField === 'jobType' ? (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                    value={editedData.jobType || ''}
                    onChange={(e) => handleInputChange('jobType', e.target.value)}
                    onBlur={handleBlur}
                    autoFocus
                  />
                ) : (
                  <p 
                    className="font-medium cursor-pointer hover:bg-gray-50 p-1 rounded"
                    onClick={() => handleEditClick('jobType')}
                  >
                    {editedData.jobType || 'N/A'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {editedData.description && (
            <div className="bg-white rounded-lg border p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Description</h3>
                {editingField === 'description' ? (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleCancel('description')}
                      className="text-gray-600 hover:text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave('description')}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick('description')}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingField === 'description' ? (
                <textarea
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                  value={editedData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  onBlur={handleBlur}
                  rows={6}
                  autoFocus
                />
              ) : (
                <p 
                  className="text-gray-700 whitespace-pre-line cursor-pointer hover:bg-gray-50 p-2 rounded"
                  onClick={() => handleEditClick('description')}
                >
                  {editedData.description}
                </p>
              )}
            </div>
          )}

          {/* Requirements */}
          {editedData.requirements?.length > 0 && (
            <div className="bg-white rounded-lg border p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Requirements</h3>
                {editingField === 'requirements' ? (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleCancel('requirements')}
                      className="text-gray-600 hover:text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave('requirements')}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick('requirements')}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingField === 'requirements' ? (
                <div className="space-y-2">
                  {editedData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                        value={req}
                        onChange={(e) => {
                          const newReqs = [...editedData.requirements];
                          newReqs[index] = e.target.value;
                          handleInputChange('requirements', newReqs);
                        }}
                      />
                      <button
                        onClick={() => {
                          const newReqs = editedData.requirements.filter((_, i) => i !== index);
                          handleInputChange('requirements', newReqs);
                        }}
                        className="text-red-500 hover:text-red-600"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      handleInputChange('requirements', [...editedData.requirements, '']);
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + Add Requirement
                  </button>
                </div>
              ) : (
                <ul className="list-disc list-inside space-y-1">
                  {editedData.requirements.map((req, index) => (
                    <li key={index} className="text-gray-700">{req}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Responsibilities */}
          {editedData.responsibilities?.length > 0 && (
            <div className="bg-white rounded-lg border p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Responsibilities</h3>
                {editingField === 'responsibilities' ? (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleCancel('responsibilities')}
                      className="text-gray-600 hover:text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave('responsibilities')}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick('responsibilities')}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingField === 'responsibilities' ? (
                <div className="space-y-2">
                  {editedData.responsibilities.map((resp, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                        value={resp}
                        onChange={(e) => {
                          const newResps = [...editedData.responsibilities];
                          newResps[index] = e.target.value;
                          handleInputChange('responsibilities', newResps);
                        }}
                      />
                      <button
                        onClick={() => {
                          const newResps = editedData.responsibilities.filter((_, i) => i !== index);
                          handleInputChange('responsibilities', newResps);
                        }}
                        className="text-red-500 hover:text-red-600"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      handleInputChange('responsibilities', [...editedData.responsibilities, '']);
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + Add Responsibility
                  </button>
                </div>
              ) : (
                <ul className="list-disc list-inside space-y-1">
                  {editedData.responsibilities.map((resp, index) => (
                    <li key={index} className="text-gray-700">{resp}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Benefits & Compensation */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Benefits & Compensation</h3>
              {editingField === 'benefits' ? (
                <div className="space-x-2">
                  <button
                    onClick={() => handleCancel('benefits')}
                    className="text-gray-600 hover:text-gray-700 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave('benefits')}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEditClick('benefits')}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
              )}
            </div>
            {editingField === 'benefits' ? (
              <div className="space-y-2">
                {editedData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                      value={benefit}
                      onChange={(e) => {
                        const newBenefits = [...editedData.benefits];
                        newBenefits[index] = e.target.value;
                        handleInputChange('benefits', newBenefits);
                      }}
                    />
                    <button
                      onClick={() => {
                        const newBenefits = editedData.benefits.filter((_, i) => i !== index);
                        handleInputChange('benefits', newBenefits);
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    handleInputChange('benefits', [...editedData.benefits, '']);
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  + Add Benefit
                </button>
              </div>
            ) : (
              <div>
                <h4 className="text-sm text-gray-600 mb-2">Benefits</h4>
                <ul className="list-disc list-inside space-y-1">
                  {editedData.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-700">{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Salary */}
          {editedData.salary && (
            <div className="bg-white rounded-lg border p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Salary</h3>
                {editingField === 'salary' ? (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleCancel('salary')}
                      className="text-gray-600 hover:text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave('salary')}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick('salary')}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingField === 'salary' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Minimum Salary</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                      value={editedData.salary.min?.toLocaleString()}
                      onChange={(e) => handleInputChange('salary.min', e.target.value)}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Maximum Salary</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                      value={editedData.salary.max?.toLocaleString()}
                      onChange={(e) => handleInputChange('salary.max', e.target.value)}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Currency</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                      value={editedData.salary.currency}
                      onChange={(e) => handleInputChange('salary.currency', e.target.value)}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Period</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                      value={editedData.salary.period}
                      onChange={(e) => handleInputChange('salary.period', e.target.value)}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <h4 className="text-sm text-gray-600 mb-2">Salary</h4>
                  <p className="font-medium">
                    {editedData.salary.min?.toLocaleString()} 
                    {editedData.salary.max && ` - ${editedData.salary.max.toLocaleString()}`} 
                    {editedData.salary.currency} per {editedData.salary.period}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Keywords */}
          {editedData.keywords?.length > 0 && (
            <div className="bg-white rounded-lg border p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Required Skills</h3>
                {editingField === 'keywords' ? (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleCancel('keywords')}
                      className="text-gray-600 hover:text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave('keywords')}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick('keywords')}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingField === 'keywords' ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {editedData.keywords.map((skill, index) => (
                      <div 
                        key={index}
                        className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => {
                            const newSkills = editedData.keywords.filter((_, i) => i !== index);
                            handleInputChange('keywords', newSkills);
                          }}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add a new skill"
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          const newSkills = [...(editedData.keywords || []), e.target.value.trim()];
                          handleInputChange('keywords', newSkills);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add a new skill"]');
                        if (input.value.trim()) {
                          const newSkills = [...(editedData.keywords || []), input.value.trim()];
                          handleInputChange('keywords', newSkills);
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {editedData.keywords.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Additional Information */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Additional Information</h3>
              {editingField === 'additional' ? (
                <div className="space-x-2">
                  <button
                    onClick={() => handleCancel('additional')}
                    className="text-gray-600 hover:text-gray-700 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave('additional')}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEditClick('additional')}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
              )}
            </div>
            {editingField === 'additional' ? (
              <div className="space-y-4">
                {editedData.applicationDeadline && (
                  <div>
                    <label className="text-sm text-gray-600">Application Deadline</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                      value={editedData.applicationDeadline}
                      onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                      onBlur={handleBlur}
                    />
                  </div>
                )}
                {editedData.contactInfo && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editedData.contactInfo.name && (
                      <div>
                        <label className="text-sm text-gray-600">Contact Person</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                          value={editedData.contactInfo.name}
                          onChange={(e) => handleInputChange('contactInfo.name', e.target.value)}
                          onBlur={handleBlur}
                        />
                      </div>
                    )}
                    {editedData.contactInfo.email && (
                      <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                          value={editedData.contactInfo.email}
                          onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                          onBlur={handleBlur}
                        />
                      </div>
                    )}
                    {editedData.contactInfo.phone && (
                      <div>
                        <label className="text-sm text-gray-600">Phone</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                          value={editedData.contactInfo.phone}
                          onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                          onBlur={handleBlur}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {editedData.applicationDeadline && (
                  <div>
                    <label className="text-sm text-gray-600">Application Deadline</label>
                    <p className="font-medium">
                      {(() => {
                        const [day, month, year] = editedData.applicationDeadline.split('/');
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
                {editedData.contactInfo && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editedData.contactInfo.name && (
                      <div>
                        <label className="text-sm text-gray-600">Contact Person</label>
                        <p className="font-medium">{editedData.contactInfo.name}</p>
                      </div>
                    )}
                    {editedData.contactInfo.email && (
                      <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <p className="font-medium">{editedData.contactInfo.email}</p>
                      </div>
                    )}
                    {editedData.contactInfo.phone && (
                      <div>
                        <label className="text-sm text-gray-600">Phone</label>
                        <p className="font-medium">{editedData.contactInfo.phone}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
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
            onClick={handleConfirm}
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