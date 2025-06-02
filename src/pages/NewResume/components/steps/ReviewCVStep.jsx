import React, { useState, useRef, useEffect } from 'react';
import { FileText, Edit, Eye, Upload, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import CVPreview from '../../../NewCV/components/CVPreview';
import ReviewStep from '../../../NewCV/components/ReviewStep';
import { getDefaultTemplate } from '../../../../templates';
import CVScanningPreview from '../../../../components/CVScanningPreview';
import CVExtractService from '../../../../services/cvExtractService';
import DocumentProcessor from '../../../../services/DocumentProcessor';
import cvService from '../../../../services/cvService';
import { useCVData } from '../../../../contexts/CVDataContext';

const ReviewCVStep = ({ cvData, isLoading, onSelect, initialCV, setCvData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cvData: contextCvData } = useCVData();
  const [showPreview, setShowPreview] = useState(false);
  const [previewCV, setPreviewCV] = useState(null);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('existing'); // 'existing' or 'upload'
  const [documentText, setDocumentText] = useState('');
  const [showScanningPreview, setShowScanningPreview] = useState(false);
  const [tempCV, setTempCV] = useState(null);
  const [showEditMode, setShowEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedCV, setSelectedCV] = useState(null);
  const [selectLoading, setSelectLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [cvToSelect, setCvToSelect] = useState(null);

  // Helper function to determine score rating text
  const getScoreRating = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Average";
    return "Needs Improvement";
  };

  // When component mounts, set the first CV as selected if available
  useEffect(() => {
    if (cvData && cvData.cvs && cvData.cvs.length > 0 && !selectedCV) {
      setSelectedCV(cvData.cvs[0]);
    } else if (tempCV && !selectedCV) {
      setSelectedCV(tempCV);
    }
  }, [cvData, tempCV, selectedCV]);

  // Add a new effect to update selectedCV when tab changes
  useEffect(() => {
    if (activeTab === 'existing' && cvData && cvData.cvs && cvData.cvs.length > 0) {
      // When on existing tab, select the first CV from cvData
      setSelectedCV(cvData.cvs[0]);
    } else if (activeTab === 'temp' && tempCV) {
      // When on temp tab, select the tempCV
      setSelectedCV(tempCV);
    }
  }, [activeTab, cvData, tempCV]);

  // Add useEffect to control scroll locking when edit modal is open
  useEffect(() => {
    if (showEditMode) {
      // Save the original style
      const originalStyle = window.getComputedStyle(document.body).overflow;
      
      // Hide scrollbar and prevent scrolling
      document.body.style.overflow = 'hidden';
      
      // Cleanup when component unmounts or modal closes
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [showEditMode]);

  const openPreview = (cv) => {
    setPreviewCV({
      personalInfo: cv.personalInfo || {},
      summary: cv.summary || '',
      experience: cv.experience || [],
      education: cv.education || [],
      skills: cv.skills || [],
      projects: cv.projects || [],
      certifications: cv.certifications || [],
      languages: cv.languages || [],
      template: cv.template || { id: getDefaultTemplate().id }
    });
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewCV(null);
  };

  const handleEditCV = (cv) => {
    // Chuẩn bị dữ liệu để edit
    const editableCV = {
      ...cv,
      personalInfo: cv.personalInfo || {},
      summary: cv.summary || "",
      experience: cv.experience || [],
      education: cv.education || [],
      skills: cv.skills || [],
      projects: cv.projects || [],
      certifications: cv.certifications || [],
      languages: cv.languages || [],
      template: cv.template || { id: getDefaultTemplate().id },
      name: cv.name || "Untitled CV",
      progress: cv.progress || 0,
      score: cv.score || 0
    };

    // Set edit data và hiển thị modal
    setEditData(editableCV);
    setShowEditMode(true);
  };

  const handleUpdateFormData = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = async () => {
    try {
      if (editData.isTemporary) {
        // Cập nhật temporary CV
        setTempCV({...editData});
        if (selectedCV && selectedCV._id === editData._id) {
          setSelectedCV({...editData});
        }
      } else {
        // Cập nhật existing CV trong cvData
        if (cvData && cvData.cvs) {
          const updatedCvs = cvData.cvs.map(cv => 
            cv._id === editData._id ? {...editData} : cv
          );
          
          // Cập nhật state ở component cha
          setCvData({
            ...cvData,
            cvs: updatedCvs
          });

          // Cập nhật selectedCV nếu đang được chọn
          if (selectedCV && selectedCV._id === editData._id) {
            setSelectedCV({...editData});
          }

          try {
            // Gọi API để cập nhật CV trong database
            await cvService.updateCV(editData._id, editData);
          } catch (error) {
            console.error('Error updating CV in database:', error);
            // Rollback changes if API call fails
            setCvData({...cvData});
            setSelectedCV(selectedCV);
            throw new Error('Failed to save changes to database');
          }
        }
      }
      
      // Đóng modal
      setShowEditMode(false);
      setEditData(null);
    } catch (error) {
      console.error('Error saving CV:', error);
      alert('Error saving CV: ' + error.message);
    }
  };

  const handleCancelEdit = () => {
    // Exit edit mode without saving
    setShowEditMode(false);
    setEditData(null);
  };

  // Handle file upload functions
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if file is PDF, DOCX or TXT
      if (selectedFile.type === 'application/pdf' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          selectedFile.type === 'text/plain' ||
          selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
        console.log("File selected:", selectedFile.name);
      } else {
        alert('Please select a PDF, Word document (.docx), Text file (.txt), or Image file');
        fileInputRef.current.value = '';
      }
    }
  };

  const handleBrowseClick = (e) => {
    if (e) e.preventDefault();
    
    // Trigger click on hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (droppedFile.type === 'application/pdf' || 
          droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          droppedFile.type === 'text/plain' ||
          droppedFile.type.startsWith('image/')) {
        setFile(droppedFile);
        console.log("File dropped:", droppedFile.name);
      } else {
        alert('Please select a PDF, Word document (.docx), Text file (.txt), or Image file');
      }
    }
  };

  // Handle processing the uploaded CV
  const handleProcessCV = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      let extractedText = '';
      
      // Extract text based on file type
      if (file.type === 'text/plain') {
        // For text files, read directly
        const reader = new FileReader();
        extractedText = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsText(file);
        });
      } else {
        // For PDF, images or other formats, use DocumentProcessor
        extractedText = await DocumentProcessor.extractTextFromFile(file);
      }
      
      // Set the extracted text to show in the scanning preview
      setDocumentText(extractedText);
      
      // Show the scanning preview
      setShowScanningPreview(true);
      
    } catch (error) {
      console.error('Error processing CV:', error);
      alert('Error processing your CV: ' + error.message);
      setIsProcessing(false);
    }
  };

  // Handle completion of CV scanning process
  const handleScanningComplete = async (extractedData) => {
    try {
      // The extractedData already contains the processed information from the CVScanningPreview
      // No need to call the API again since CVScanningPreview already processed the document text
      
      // Format the extracted data into a temporary CV
      const newTempCV = {
        _id: 'temp-' + Date.now(), // Temporary ID
        name: file.name.replace(/\.(pdf|docx|txt|jpe?g|png|gif)$/i, '') || 'Uploaded CV',
        personalInfo: extractedData.personalInfo || {},
        summary: extractedData.summary || '',
        experience: extractedData.experience || [],
        education: extractedData.education || [],
        skills: extractedData.skills || [],
        projects: extractedData.projects || [],
        certifications: extractedData.certifications || [],
        languages: extractedData.languages || [],
        template: { id: getDefaultTemplate().id },
        isTemporary: true, // Flag to indicate this is a temporary CV
        progress: 100, // Assume complete
        score: 80 // Default score
      };

      // Store the temporary CV
      setTempCV(newTempCV);
      
      // Set it as the selected CV for preview
      setSelectedCV(newTempCV);
      
      // Hide the scanning preview and return to the main interface
      setShowScanningPreview(false);
      setIsProcessing(false);
      setFile(null);
      
      // Switch to show the temporary CV
      setActiveTab('temp');
      
    } catch (error) {
      console.error('Error in CV data processing:', error);
      alert('Error processing CV data: ' + error.message);
      setShowScanningPreview(false);
      setIsProcessing(false);
    }
  };

  // First let's create a function to handle saving temp CV to database
  const saveTemporaryCV = async (cv) => {
    try {
      // Remove the temporary ID and any fields that shouldn't be sent to the API
      const { _id, isTemporary, ...cvDataToSave } = cv;
      
      // No need to manually set is_deleted flag as the API will handle it
      const dataToSave = {
        ...cvDataToSave,
        name: cv.name + ' (Temporary)'
      };
      
      // Save to database using the dedicated temp CV endpoint
      console.log('Saving temporary CV with data:', dataToSave);
      
      // Use the dedicated temp CV creation endpoint
      const response = await cvService.createTempCV(dataToSave);
      
      // Return the saved CV with real MongoDB ID
      console.log('Saved temporary CV with real ID:', response.data);
      
      // Make sure we're returning a CV object with the correct ID format
      return {
        ...cv,
        _id: response.data._id // Replace temporary ID with real MongoDB ID
      };
    } catch (error) {
      console.error('Error saving temporary CV:', error);
      throw error;
    }
  };

  // Function to save CV as permanent
  const savePermanentCV = async (cv) => {
    try {
      // Remove the temporary ID and any fields that shouldn't be sent to the API
      const { _id, isTemporary, ...cvDataToSave } = cv;
      
      const dataToSave = {
        ...cvDataToSave,
        name: cv.name || 'My CV' // Use a default name if none provided
      };
      
      console.log('Saving permanent CV with data:', dataToSave);
      
      // Use the regular CV creation endpoint
      const response = await cvService.createCV(dataToSave);
      
      console.log('Saved permanent CV with ID:', response.data);
      
      return {
        ...cv,
        _id: response.data._id,
        isTemporary: false
      };
    } catch (error) {
      console.error('Error saving permanent CV:', error);
      throw error;
    }
  };

  // Now let's update the handle select function
  const handleSelect = async (cv, e) => {
    if (e) e.stopPropagation();
    
    try {
      // If it's a temporary CV and no CV exists in context, show confirmation modal
      if (cv._id && cv._id.toString().startsWith('temp-') && (!contextCvData.cv || contextCvData.cv === null)) {
        setCvToSelect(cv);
        setShowConfirmationModal(true);
        return;
      }
      
      setSelectLoading(true);
      console.log('Original CV selected:', cv);
      
      // If it's a temporary CV (has a temp ID starting with 'temp-'), save it to DB first
      if (cv._id && cv._id.toString().startsWith('temp-')) {
        console.log('Saving temporary CV to database...');
        const savedCV = await saveTemporaryCV(cv);
        console.log('Received saved CV from database:', savedCV);
        // Call the parent component's onSelect with the saved CV that now has a proper MongoDB ID
        onSelect(savedCV);
      } else {
        console.log('Using existing CV with ID:', cv._id);
        // If it's a regular CV, just call the parent's onSelect
        onSelect(cv);
      }
    } catch (error) {
      console.error('Error selecting CV:', error);
      alert('Error selecting CV: ' + (error.message || 'Please try again'));
    } finally {
      setSelectLoading(false);
    }
  };

  // Function to handle confirmation modal response
  const handleConfirmation = async (savePermanently) => {
    if (!cvToSelect) return;
    
    try {
      setSelectLoading(true);
      
      if (savePermanently) {
        // Save as permanent CV
        console.log('Saving as permanent CV...');
        const savedCV = await savePermanentCV(cvToSelect);
        onSelect(savedCV);
      } else {
        // Save as temporary CV
        console.log('Saving as temporary CV...');
        const savedCV = await saveTemporaryCV(cvToSelect);
        onSelect(savedCV);
      }
    } catch (error) {
      console.error('Error handling CV selection:', error);
      alert('Error processing CV: ' + (error.message || 'Please try again'));
    } finally {
      setSelectLoading(false);
      setShowConfirmationModal(false);
      setCvToSelect(null);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex w-full mb-6">
        <button
          onClick={() => {
            setActiveTab('existing');
            if (cvData && cvData.cvs && cvData.cvs.length > 0) {
              setSelectedCV(cvData.cvs[0]);
            }
          }}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            activeTab === 'existing'
              ? 'bg-white text-blue-600 border-b-2 border-blue-600'
              : 'bg-gray-50 text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText className="h-5 w-5 mx-auto mb-2" />
          Use Existing CV
        </button>
        <button
          onClick={() => {
            setActiveTab('upload');
            // Clear selected CV when going to upload tab
            setSelectedCV(null);
          }}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            activeTab === 'upload'
              ? 'bg-white text-blue-600 border-b-2 border-blue-600'
              : 'bg-gray-50 text-gray-500 hover:text-gray-700'
          }`}
        >
          <Upload className="h-5 w-5 mx-auto mb-2" />
          Upload New CV
        </button>
        {tempCV && (
          <button
            onClick={() => {
              setActiveTab('temp');
              setSelectedCV(tempCV);
            }}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'temp'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'bg-gray-50 text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="h-5 w-5 mx-auto mb-2" />
            Temporary CV
          </button>
        )}
      </div>

      {/* Split View Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* If we're on upload tab, always use full width */}
        {activeTab === 'upload' ? (
          <div className="w-full">
            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Upload New CV
                </h3>
                <p className="text-gray-500">
                  This will replace your existing CV
                </p>
              </div>

              <div className="mt-6">
                <div 
                  className={`border-2 border-dashed ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} rounded-lg p-8 flex flex-col items-center justify-center h-64`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="flex flex-col items-center">
                      <FileText className="text-blue-500 text-5xl mb-2" />
                      <p className="font-medium text-blue-800">{file.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="mt-4 text-red-500 text-sm hover:underline"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="text-blue-400 text-4xl mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Drag and drop your CV here</p>
                      <p className="text-gray-600 mb-4">or</p>
                      <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                        onClick={handleBrowseClick}
                      >
                        Browse Files
                      </button>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.txt,.jpg,.jpeg,.png,.gif,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Supports PDF, DOCX, TXT, or Image files (Max 5MB)
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleProcessCV}
                  disabled={!file || isProcessing}
                  className={`px-4 py-2 rounded-md text-white ${
                    !file || isProcessing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : 'Upload and Continue'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Left Side - CV List */}
            <div className="w-full lg:w-2/5">
              {/* Tab Content */}
              {activeTab === 'existing' && (
                <div className="space-y-4">
                  {(!cvData.cvs || cvData.cvs.length === 0) ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No existing CV found. Try uploading a new one.</p>
                      <button
                        onClick={() => setActiveTab('upload')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Upload CV
                      </button>
                    </div>
                  ) : (
                    cvData.cvs.map((cv) => (
                      <div 
                        key={cv._id} 
                        className={`bg-white rounded-lg border ${activeTab === 'existing' && selectedCV && selectedCV._id === cv._id ? 'border-blue-500 border-2' : 'border-gray-200'} shadow-md overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCV(cv);
                        }}
                      >
                        <div className="p-5 flex items-start justify-between border-b border-gray-100">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-800">{cv.name || 'Untitled CV'}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {cv.personalInfo?.firstName} {cv.personalInfo?.lastName || ''}
                              {cv.personalInfo?.professionalHeadline && ` • ${cv.personalInfo.professionalHeadline}`}
                            </p>

                            {/* CV Score */}
                            <div className="mt-3 flex items-center">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <span className="font-bold text-blue-600">{cv.score || 0}</span>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">CV Score</div>
                                <div className="text-xs text-gray-500">
                                  {getScoreRating(cv.score || 0)}
                                </div>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-3">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Completion</span>
                                <span>{cv.progress || 0}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${cv.progress || 0}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCV(cv);
                              }}
                              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              Edit CV
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelect(cv, e);
                              }}
                              disabled={selectLoading}
                              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                              {selectLoading ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Saving...
                                </>
                              ) : 'Select'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Temporary CV Tab Content */}
              {activeTab === 'temp' && tempCV && (
                <div 
                  className={`bg-white rounded-lg border ${activeTab === 'temp' && selectedCV && selectedCV._id === tempCV._id ? 'border-blue-500 border-2' : 'border-gray-200'} shadow-md overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCV(tempCV);
                  }}
                >
                  <div className="p-5 flex items-start justify-between border-b border-gray-100">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="font-semibold text-lg text-gray-800">{tempCV.name || 'Temporary CV'}</h3>
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Temporary</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {tempCV.personalInfo?.firstName} {tempCV.personalInfo?.lastName || ''}
                        {tempCV.personalInfo?.professionalHeadline && ` • ${tempCV.personalInfo.professionalHeadline}`}
                      </p>

                      {/* CV Score */}
                      <div className="mt-3 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <span className="font-bold text-blue-600">{tempCV.score || 0}</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">CV Score</div>
                          <div className="text-xs text-gray-500">
                            {getScoreRating(tempCV.score || 0)}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Completion</span>
                          <span>{tempCV.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${tempCV.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCV(tempCV);
                        }}
                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit CV
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(tempCV, e);
                        }}
                        disabled={selectLoading}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        {selectLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : 'Select'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - CV Preview */}
            <div className="w-full lg:w-3/5">
              {selectedCV ? (
                <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                  <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                  </div>
                  <div className="p-6">
                    <CVPreview formData={selectedCV} />
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 flex items-center justify-center h-64">
                  <p className="text-gray-500 text-center">
                    Select a CV to preview its content
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal for Temporary CV */}
      {showEditMode && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden">
          <div className="bg-white rounded-lg shadow-xl w-[95%] max-w-7xl h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Edit CV</h3>
              <button 
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              {/* Left side - Edit Form */}
              <div className="w-full md:w-1/2 overflow-auto border-r border-gray-200">
                <div className="p-6">
                  <ReviewStep 
                    data={editData} 
                    updateFormData={handleUpdateFormData} 
                    handleSubmit={() => {}}
                    prevStep={() => {}}
                  />
                </div>
              </div>
              
              {/* Right side - CV Preview */}
              <div className="w-full md:w-1/2 overflow-auto bg-gray-50">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Preview</h3>
                  <CVPreview formData={editData} />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-3"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="font-semibold text-lg mb-4">Save as Permanent CV?</h3>
            <p className="text-gray-600 mb-6">
              You don't have a permanent CV yet. Would you like to save this CV permanently for future use, or keep it as a temporary CV?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => handleConfirmation(false)}
                disabled={selectLoading}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                {selectLoading ? 'Processing...' : 'Save as Temporary'}
              </button>
              <button
                onClick={() => handleConfirmation(true)}
                disabled={selectLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {selectLoading ? 'Processing...' : 'Save as Permanent CV'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CV Scanning Preview Modal */}
      <CVScanningPreview 
        isOpen={showScanningPreview}
        onComplete={handleScanningComplete}
        documentText={documentText}
      />
    </div>
  );
};

export default ReviewCVStep;