import React, { useState, useEffect } from 'react';
import api, { callApi } from '../../../../utils/api';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const JobDescriptionScanningPreview = ({ isOpen, onComplete, data }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [tempEditData, setTempEditData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [scanSteps, setScanSteps] = useState([
    {
      id: 'basic',
      label: 'Basic Information',
      fields: ['position', 'companyName', 'location', 'employmentType', 'jobLevel'],
      status: 'pending'
    },
    {
      id: 'details',
      label: 'Job Details',
      fields: ['summary', 'responsibilities', 'requirements'],
      status: 'pending'
    },
    {
      id: 'skills',
      label: 'Skills & Benefits',
      fields: ['keywords', 'benefits', 'salary'],
      status: 'pending'
    },
    {
      id: 'additional',
      label: 'Additional Information',
      fields: ['keywords', 'applicationDeadline', 'contactInfo'],
      status: 'pending'
    }
  ]);

  useEffect(() => {
    if (isOpen && data) {
      simulateScanning();
    }
  }, [isOpen, data]);

  useEffect(() => {
    if (data) {
      // Transform incoming data if needed
      const transformedData = {
        ...data,
        skillsRequired: data.keywords || [], // Map keywords to skillsRequired
        closingDate: data.applicationDeadline, // Map applicationDeadline to closingDate for backend
        experienceRequired: data.experienceRequired || {}
      };
      setEditedData(transformedData);
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
    setScanSteps(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps[stepIndex] = {
        ...newSteps[stepIndex],
        status: status
      };
      return newSteps;
    });
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

  const handleAddArrayItem = (fieldName) => {
    const currentArray = editedData[fieldName] || [];
    // Chỉ thêm mới nếu item cuối cùng không trống
    if (currentArray.length === 0 || currentArray[currentArray.length - 1].trim() !== '') {
      handleInputChange(fieldName, [...currentArray, '']);
    }
  };

  const handleArrayItemChange = (fieldName, index, value) => {
    const currentArray = [...(editedData[fieldName] || [])];
    currentArray[index] = value;
    // Lọc bỏ các giá trị trống khi lưu
    handleInputChange(fieldName, currentArray.filter(item => item.trim() !== ''));
  };

  const handleRemoveArrayItem = (fieldName, index) => {
    const currentArray = editedData[fieldName] || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    handleInputChange(fieldName, newArray);
  };

  const handleBlur = () => {
    setEditingField(null);
  };

  const handleConfirm = async () => {
    try {
      const savedJD = await saveJobDescription(editedData);
      onComplete({
        ...editedData,
        _id: savedJD._id
      });
    } catch (error) {
      console.error('Failed to process job description:', error);
    }
  };

  const saveJobDescription = async (jdData) => {
    try {
      setIsSaving(true);
      setSaveError(null);
      
      // Transform data to match backend schema
      const requestData = {
        position: jdData.position || '',
        department: jdData.department || '',
        companyName: jdData.companyName || '',
        location: jdData.location || [],
        remoteStatus: (jdData.remoteStatus === 'onsite' ? 'On-site' : 
                      jdData.remoteStatus === 'remote' ? 'Remote' : 
                      jdData.remoteStatus === 'hybrid' ? 'Hybrid' : 'On-site'),
        experienceRequired: {
          min: jdData.experienceRequired?.min || 0,
          max: jdData.experienceRequired?.max || 0,
          description: jdData.experienceRequired?.description || ''
        },
        jobLevel: jdData.jobLevel || 'Mid',
        employmentType: jdData.employmentType || 'Full-time',
        summary: jdData.summary ? [jdData.summary] : [],
        responsibilities: jdData.responsibilities || [],
        requirements: jdData.requirements || [],
        preferredQualifications: [],
        skillsRequired: jdData.keywords || [],
        benefits: jdData.benefits || [],
        salary: {
          min: jdData.salary?.min || 0,
          max: jdData.salary?.max || 0,
          currency: jdData.salary?.currency || 'VND',
          period: jdData.salary?.period || 'Monthly'
        },
        applicationDeadline: jdData.applicationDeadline || '',
        contactInfo: {
          name: jdData.contactInfo?.name || '',
          email: jdData.contactInfo?.email || '',
          phone: jdData.contactInfo?.phone || ''
        },
        language: 'en',
        status: 'draft',
        tags: ['auto-generated']
      };
      
      const response = await callApi('/api/job-descriptions', 'POST', requestData);
      return response.data;
    } catch (error) {
      setSaveError(error.message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const renderBasicInformation = () => (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="text-xl font-medium mb-6">Basic Information</h3>
      <div className="grid grid-cols-2 gap-6">
        {/* Position */}
        <div>
          <label className="text-sm text-gray-600 font-medium">Position</label>
          <div className="relative">
            {editingField === 'position' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                  value={editedData.position || ''}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  autoFocus
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => handleSave('position')}
                    className="text-green-600 hover:text-green-700 p-1"
                    title="Save"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleCancel('position')}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Cancel"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="flex justify-between items-center group cursor-pointer p-2 hover:bg-gray-50 rounded-lg"
                onClick={() => handleEditClick('position')}
              >
                <p className="font-medium">{editedData.position || 'N/A'}</p>
                <button className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Company Name */}
        <div>
          <label className="text-sm text-gray-600 font-medium">Company</label>
          <div className="relative">
            {editingField === 'companyName' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                  value={editedData.companyName || ''}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  autoFocus
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => handleSave('companyName')}
                    className="text-green-600 hover:text-green-700 p-1"
                    title="Save"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleCancel('companyName')}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Cancel"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="flex justify-between items-center group cursor-pointer p-2 hover:bg-gray-50 rounded-lg"
                onClick={() => handleEditClick('companyName')}
              >
                <p className="font-medium">{editedData.companyName || 'N/A'}</p>
                <button className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Job Level */}
        <div>
          <label className="text-sm text-gray-600 font-medium">Job Level</label>
          <div className="relative">
            {editingField === 'jobLevel' ? (
              <div className="flex items-center gap-2">
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                  value={editedData.jobLevel || 'Mid'}
                  onChange={(e) => handleInputChange('jobLevel', e.target.value)}
                  autoFocus
                >
                  <option value="Intern">Intern</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                  <option value="Manager">Manager</option>
                  <option value="Director">Director</option>
                  <option value="Executive">Executive</option>
                </select>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleSave('jobLevel')}
                    className="text-green-600 hover:text-green-700 p-1"
                    title="Save"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleCancel('jobLevel')}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Cancel"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="flex justify-between items-center group cursor-pointer p-2 hover:bg-gray-50 rounded-lg"
                onClick={() => handleEditClick('jobLevel')}
              >
                <p className="font-medium capitalize">{editedData.jobLevel || 'Mid'}</p>
                <button className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Employment Type */}
        <div>
          <label className="text-sm text-gray-600 font-medium">Employment Type</label>
          <div className="relative">
            {editingField === 'employmentType' ? (
              <div className="flex items-center gap-2">
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                  value={editedData.employmentType || 'Full-time'}
                  onChange={(e) => handleInputChange('employmentType', e.target.value)}
                  autoFocus
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleSave('employmentType')}
                    className="text-green-600 hover:text-green-700 p-1"
                    title="Save"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleCancel('employmentType')}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Cancel"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="flex justify-between items-center group cursor-pointer p-2 hover:bg-gray-50 rounded-lg"
                onClick={() => handleEditClick('employmentType')}
              >
                <p className="font-medium capitalize">{editedData.employmentType || 'Full-time'}</p>
                <button className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm text-gray-600 font-medium">Locations</label>
          <div className="relative">
            {editingField === 'location' ? (
              <div className="space-y-2">
                {(editedData.location || []).map((loc, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                      value={loc}
                      onChange={(e) => handleArrayItemChange('location', index, e.target.value)}
                    />
                    <button
                      onClick={() => handleRemoveArrayItem('location', index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddArrayItem('location')}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  + Add Location
                </button>
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => handleCancel('location')} className="text-red-600 hover:text-red-700 text-sm">Cancel</button>
                  <button onClick={() => handleSave('location')} className="text-green-600 hover:text-green-700 text-sm font-medium">Save</button>
                </div>
              </div>
            ) : (
              <div 
                className="flex justify-between items-center group cursor-pointer p-2 hover:bg-gray-50 rounded-lg"
                onClick={() => handleEditClick('location')}
              >
                <div className="flex flex-wrap gap-2">
                  {(editedData.location || []).length > 0 ? (
                    editedData.location.map((loc, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {loc}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No locations specified</p>
                  )}
                </div>
                <button className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Remote Status */}
        <div>
          <label className="text-sm text-gray-600 font-medium">Remote Status</label>
          <div className="relative">
            {editingField === 'remoteStatus' ? (
              <div className="flex items-center gap-2">
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                  value={editedData.remoteStatus || 'On-site'}
                  onChange={(e) => handleInputChange('remoteStatus', e.target.value)}
                  autoFocus
                >
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                </select>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleSave('remoteStatus')}
                    className="text-green-600 hover:text-green-700 p-1"
                    title="Save"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleCancel('remoteStatus')}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Cancel"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="flex justify-between items-center group cursor-pointer p-2 hover:bg-gray-50 rounded-lg"
                onClick={() => handleEditClick('remoteStatus')}
              >
                <p className="font-medium capitalize">{editedData.remoteStatus || 'On-site'}</p>
                <button className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Experience Required */}
        <div className="col-span-2">
          <label className="text-lg font-bold">Experience Required</label>
          <div className="relative">
            {editingField === 'experienceRequired' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Minimum (years)</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                      value={editedData.experienceRequired?.min || 0}
                      onChange={(e) => handleInputChange('experienceRequired.min', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Maximum (years)</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                      value={editedData.experienceRequired?.max || 0}
                      onChange={(e) => handleInputChange('experienceRequired.max', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                    value={editedData.experienceRequired?.description || ''}
                    onChange={(e) => handleInputChange('experienceRequired.description', e.target.value)}
                    rows={3}
                    placeholder="Describe the experience requirements in detail..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => handleCancel('experienceRequired')} className="text-red-600 hover:text-red-700 text-sm">Cancel</button>
                  <button onClick={() => handleSave('experienceRequired')} className="text-green-600 hover:text-green-700 text-sm font-medium">Save</button>
                </div>
              </div>
            ) : (
              <div 
                className="flex justify-between items-center group cursor-pointer p-2 hover:bg-gray-50 rounded-lg"
                onClick={() => handleEditClick('experienceRequired')}
              >
                <div>
                  <p className="font-medium">
                    {editedData.experienceRequired?.min === 0 && editedData.experienceRequired?.max === 0 ? (
                      'No experience required'
                    ) : (
                      `${editedData.experienceRequired.min}-${editedData.experienceRequired.max} years`
                    )}
                  </p>
                  {editedData.experienceRequired?.description && (
                    <p className="text-sm text-gray-600 mt-1">{editedData.experienceRequired.description}</p>
                  )}
                </div>
                <button className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobDetails = () => (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium">Job Details</h3>
        {editingField === 'summary' ? (
          <div className="space-x-2">
            <button onClick={() => handleCancel('summary')} className="text-red-600 hover:text-red-700 text-sm">Cancel</button>
            <button onClick={() => handleSave('summary')} className="text-green-600 hover:text-green-700 text-sm font-medium">Save</button>
          </div>
        ) : (
          <button onClick={() => handleEditClick('summary')} className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
        )}
      </div>
      {editingField === 'summary' ? (
        <textarea
          className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
          value={editedData.summary || ''}
          onChange={(e) => handleInputChange('summary', e.target.value)}
          rows={6}
          autoFocus
        />
      ) : (
        <p className="text-gray-700 whitespace-pre-line cursor-pointer hover:bg-gray-50 p-2 rounded"
           onClick={() => handleEditClick('summary')}>
          {editedData.summary || 'No description provided'}
        </p>
      )}
    </div>
  );

  const renderRequirements = () => (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium">Requirements</h3>
        {editingField === 'requirements' ? (
          <div className="space-x-2">
            <button onClick={() => handleCancel('requirements')} className="text-red-600 hover:text-red-700 text-sm">Cancel</button>
            <button onClick={() => handleSave('requirements')} className="text-green-600 hover:text-green-700 text-sm font-medium">Save</button>
          </div>
        ) : (
          <button onClick={() => handleEditClick('requirements')} className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
        )}
      </div>
      {editingField === 'requirements' ? (
        <div className="space-y-2">
          {editedData.requirements?.map((req, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                value={req}
                onChange={(e) => handleArrayItemChange('requirements', index, e.target.value)}
              />
              <button
                onClick={() => handleRemoveArrayItem('requirements', index)}
                className="text-red-500 hover:text-red-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={() => handleAddArrayItem('requirements')}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            + Add Requirement
          </button>
        </div>
      ) : (
        <ul className="list-disc list-inside space-y-1">
          {editedData.requirements?.map((req, index) => (
            <li key={index} className="text-gray-700">{req}</li>
          )) || <li className="text-gray-500">No requirements specified</li>}
        </ul>
      )}
    </div>
  );

  const renderSkillsAndBenefits = () => (
    <div className="space-y-8">
      {/* Skills Required */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium">Required Skills</h3>
          {editingField === 'keywords' ? (
            <div className="space-x-2">
              <button onClick={() => handleCancel('keywords')} className="text-red-600 hover:text-red-700 text-sm">Cancel</button>
              <button onClick={() => handleSave('keywords')} className="text-green-600 hover:text-green-700 text-sm font-medium">Save</button>
            </div>
          ) : (
            <button onClick={() => handleEditClick('keywords')} className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
          )}
        </div>
        {editingField === 'keywords' ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {editedData.keywords?.map((skill, index) => (
                <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveArrayItem('keywords', index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Add a new skill"
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    handleArrayItemChange('keywords', editedData.keywords?.length || 0, e.target.value.trim());
                    e.target.value = '';
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Add a new skill"]');
                  if (input.value.trim()) {
                    handleArrayItemChange('keywords', editedData.keywords?.length || 0, input.value.trim());
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
            {editedData.keywords?.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium">Benefits</h3>
          {editingField === 'benefits' ? (
            <div className="space-x-2">
              <button onClick={() => handleCancel('benefits')} className="text-red-600 hover:text-red-700 text-sm">Cancel</button>
              <button onClick={() => handleSave('benefits')} className="text-green-600 hover:text-green-700 text-sm font-medium">Save</button>
            </div>
          ) : (
            <button onClick={() => handleEditClick('benefits')} className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
          )}
        </div>
        {editingField === 'benefits' ? (
          <div className="space-y-2">
            {editedData.benefits?.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                  value={benefit}
                  onChange={(e) => handleArrayItemChange('benefits', index, e.target.value)}
                />
                <button
                  onClick={() => handleRemoveArrayItem('benefits', index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddArrayItem('benefits')}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              + Add Benefit
            </button>
          </div>
        ) : (
          <ul className="list-disc list-inside space-y-1">
            {editedData.benefits?.map((benefit, index) => (
              <li key={index} className="text-gray-700">{benefit}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Salary */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium">Salary</h3>
          {editingField === 'salary' ? (
            <div className="space-x-2">
              <button onClick={() => handleCancel('salary')} className="text-red-600 hover:text-red-700 text-sm">Cancel</button>
              <button onClick={() => handleSave('salary')} className="text-green-600 hover:text-green-700 text-sm font-medium">Save</button>
            </div>
          ) : (
            <button onClick={() => handleEditClick('salary')} className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
          )}
        </div>
        {editingField === 'salary' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Minimum Salary</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                value={editedData.salary?.min || 0}
                onChange={(e) => handleInputChange('salary.min', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Maximum Salary</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                value={editedData.salary?.max || 0}
                onChange={(e) => handleInputChange('salary.max', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Currency</label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                value={editedData.salary?.currency || 'VND'}
                onChange={(e) => handleInputChange('salary.currency', e.target.value)}
              >
                <option value="VND">VND</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Period</label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                value={editedData.salary?.period || 'Monthly'}
                onChange={(e) => handleInputChange('salary.period', e.target.value)}
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>
        ) : (
          <div>
            {editedData.salary?.min === 0 && editedData.salary?.max === 0 ? (
              <p className="text-gray-700">Negotiable</p>
            ) : (
              <p className="text-gray-700">
                {editedData.salary?.min?.toLocaleString()} 
                {editedData.salary?.max > 0 && ` - ${editedData.salary?.max?.toLocaleString()}`} 
                {editedData.salary?.currency} per {editedData.salary?.period}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderAdditionalInformation = () => (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium">Additional Information</h3>
        {editingField === 'additional' ? (
          <div className="space-x-2">
            <button onClick={() => handleCancel('additional')} className="text-red-600 hover:text-red-700 text-sm">Cancel</button>
            <button onClick={() => handleSave('additional')} className="text-green-600 hover:text-green-700 text-sm font-medium">Save</button>
          </div>
        ) : (
          <button onClick={() => handleEditClick('additional')} className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
        )}
      </div>
      {editingField === 'additional' ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Application Deadline</label>
            <div className="mt-1">
              <DatePicker
                selected={editedData.applicationDeadline ? new Date(editedData.applicationDeadline) : null}
                onChange={(date) => {
                  // Ensure we're working with a valid date and convert to ISO format with time
                  const validDate = date instanceof Date && !isNaN(date) ? date : null;
                  if (validDate) {
                    // Set time to end of day (23:59:59.999) for the deadline
                    validDate.setHours(23, 59, 59, 999);
                  }
                  handleInputChange('applicationDeadline', validDate ? validDate.toISOString() : null);
                }}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                placeholderText="Select a deadline"
                isClearable
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Contact Person</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                value={editedData.contactInfo?.name || ''}
                onChange={(e) => handleInputChange('contactInfo.name', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                value={editedData.contactInfo?.email || ''}
                onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Phone</label>
              <input
                type="tel"
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                value={editedData.contactInfo?.phone || ''}
                onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Only show Application Deadline if it exists and is valid */}
          {(() => {
            try {
              if (!editedData.applicationDeadline) return null;
              const date = new Date(editedData.applicationDeadline);
              if (!(date instanceof Date) || isNaN(date)) return null;
              return (
                <div>
                  <label className="text-sm text-gray-600 block">Application Deadline</label>
                  <p className="font-medium">
                    {date.toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              );
            } catch (error) {
              return null;
            }
          })()}

          {/* Only show Contact Info section if any contact field exists */}
          {editedData.contactInfo && (
            editedData.contactInfo.name || 
            editedData.contactInfo.email || 
            editedData.contactInfo.phone
          ) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Only show name if it exists */}
              {editedData.contactInfo.name && (
                <div>
                  <label className="text-sm text-gray-600 block">Contact Person</label>
                  <p className="font-medium">{editedData.contactInfo.name}</p>
                </div>
              )}
              
              {/* Only show email if it exists */}
              {editedData.contactInfo.email && (
                <div>
                  <label className="text-sm text-gray-600 block">Email</label>
                  <p className="font-medium">{editedData.contactInfo.email}</p>
                </div>
              )}
              
              {/* Only show phone if it exists */}
              {editedData.contactInfo.phone && (
                <div>
                  <label className="text-sm text-gray-600 block">Phone</label>
                  <p className="font-medium">{editedData.contactInfo.phone}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderPreview = () => {
    if (!editedData) return null;

    return (
      <div className="flex flex-col h-full">
        {/* Fixed Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b">
          <h2 className="text-2xl font-semibold">Review Job Description</h2>
          <button
            onClick={() => setShowPreview(false)}
            className="text-gray-500 hover:text-red-700 p-2"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-8">
          {renderBasicInformation()}
          {renderJobDetails()}
          {renderSkillsAndBenefits()}
          {renderRequirements()}
          {renderAdditionalInformation()}
        </div>

        {saveError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{saveError}</p>
          </div>
        )}
        </div>

        {/* Fixed Footer */}
        <div className="border-t px-8 py-6 bg-white">
          <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowPreview(false)}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            disabled={isSaving}
          >
            Back to Scanning
          </button>
          <button
            onClick={handleConfirm}
              className={`px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center ${
              isSaving ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Confirm and Continue'
            )}
          </button>
        </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl h-[92vh] flex flex-col">
        {!showPreview ? (
          // Scanning UI
          <div className="p-8">
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
          </div>
        ) : (
          renderPreview()
        )}
      </div>
    </div>
  );
};

export default JobDescriptionScanningPreview; 