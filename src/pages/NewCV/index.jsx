import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, Check,Save } from 'lucide-react';
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import {
  PersonalInfoStep,
  EducationStep,
  ExperienceStep,
  SkillsStep,
  ProjectsStep,
  CertificationsStep,
  LanguagesStep,
  ActivitiesStep,
  AdditionalInfoStep,
  SummaryStep,
  ReviewStep,
  CustomFieldsStep,
  AdditionalSectionsStep
} from './components';
import TabInterface from './components/TabInterface';
import CVPreview from './components/CVPreview';
import CVPreviewModal from '../../components/CVPreviewModal';
import CVNameModal from './components/CVNameModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api, { handleApiError, callApi } from '../../utils/api';
import CVSaveConfirmation from '../../components/CVSaveConfirmation';

const mainSteps = [
  { number: 1, name: 'Personal' },
  { number: 2, name: 'Summary' },
  { number: 3, name: 'Experience' },
  { number: 4, name: 'Education' },
  { number: 5, name: 'Skills' },
  { number: 6, name: 'Additional Sections' },
  { number: 7, name: 'Review' }
];

const NewCV = () => {
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [progressBarHeight, setProgressBarHeight] = useState(0);
  
  // State để theo dõi các section phụ đã chọn và đã hoàn thành
  const [selectedSections, setSelectedSections] = useState([]);
  const [completedSections, setCompletedSections] = useState([]);
  
  // State để theo dõi section phụ hiện tại đang được hiển thị
  const [currentAdditionalSection, setCurrentAdditionalSection] = useState(null);
  
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      country: '',
      website: '',
      linkedin: ''
    },
    summary: '',
    education: [],
    experience: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: [],
    activities: [],
    additionalInfo: {
      interests: '',
      achievements: '',
      publications: '',
      references: '',
      customSections: []
    },
    customFields: []
  });

  // Thêm state mới cho popup
  const [showFullPagePreview, setShowFullPagePreview] = useState(false);

  // Thêm state cho name modal
  const [showNameModal, setShowNameModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Thêm vào phần state
  const [isEditing, setIsEditing] = useState(false);
  const [cvId, setCvId] = useState(null);

  // Thêm các state khác nếu cần
  const [sections, setSections] = useState([]); // Định nghĩa sections
  const [prompt, setPrompt] = useState(''); // Định nghĩa prompt nếu sử dụng

  // Thêm state cho Save Confirmation
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  // Thêm state để quản lý popup xác nhận khi thiếu thông tin
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  // Thêm state để quản lý các lỗi từng trường
  const [validationErrors, setValidationErrors] = useState({});

  // Định nghĩa các bước chính (thay đổi thành tabs)
  const mainSteps = [
    { number: 1, name: 'Personal' },
    { number: 2, name: 'Summary' },
    { number: 3, name: 'Experience' },
    { number: 4, name: 'Education' },
    { number: 5, name: 'Skills' },
    { number: 6, name: 'Additional Sections' },
    { number: 7, name: 'Review' }
  ];

  // Định nghĩa các section phụ
  const additionalSections = [
    { id: 'certifications', name: 'Certifications', component: CertificationsStep },
    { id: 'projects', name: 'Projects', component: ProjectsStep },
    { id: 'languages', name: 'Languages', component: LanguagesStep },
    { id: 'activities', name: 'Activities', component: ActivitiesStep },
    { id: 'additionalInfo', name: 'Additional Information', component: AdditionalInfoStep },
    { id: 'customFields', name: 'Custom Fields', component: CustomFieldsStep }
  ];

  useEffect(() => {
    document.body.classList.add('hide-header');
    return () => {
      document.body.classList.remove('hide-header');
    };
  }, []);

  useEffect(() => {
    // Đo chiều cao của progress bar sau khi component mount
    const progressBar = document.getElementById('progress-bar-container');
    if (progressBar) {
      setProgressBarHeight(progressBar.offsetHeight);
    }
    
    // Cập nhật chiều cao khi cửa sổ thay đổi kích thước
    const handleResize = () => {
      if (progressBar) {
        setProgressBarHeight(progressBar.offsetHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateFormData = (section, data) => {
    console.log(`Updating ${section} with:`, data);
    setFormData(prevData => {
      const newData = {
        ...prevData,
        [section]: data
      };
      console.log("New form data after update:", newData);
      return newData;
    });
  };

  const checkRequiredFields = () => {
    // Kiểm tra xem formData và personalInfo có tồn tại không
    if (!formData || !formData.personalInfo) {
      return false;
    }
    
    // Lấy dữ liệu từ formData.personalInfo và loại bỏ khoảng trắng
    const { firstName = "", lastName = "", email = "" } = formData.personalInfo;
    
    // Trim và kiểm tra từng trường
    const trimmedFirstName = firstName.toString().trim();
    const trimmedLastName = lastName.toString().trim();
    const trimmedEmail = email.toString().trim();
    
    // Kiểm tra từng trường riêng biệt
    const isFirstNameFilled = trimmedFirstName.length > 0;
    const isLastNameFilled = trimmedLastName.length > 0;
    const isEmailFilled = trimmedEmail.length > 0;
    
    // Kiểm tra tất cả các trường bắt buộc
    const allFieldsFilled = isFirstNameFilled && isLastNameFilled && isEmailFilled;
    
    // Nếu tất cả các trường đã được điền, kiểm tra định dạng email
    if (allFieldsFilled) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmailValid = emailRegex.test(trimmedEmail);
      
      if (!isEmailValid) {
        return false;
      }
    }
    
    return allFieldsFilled;
  };

  const handleSubmit = () => {
    // Kiểm tra và thu thập các lỗi từ các trường bắt buộc
    const validation = validateRequiredFields();
    
    if (!validation.valid) {
      // Lưu lại các lỗi vào state và hiển thị popup
      setValidationErrors(validation.errors);
      setShowConfirmationDialog(true);
      return;
    }
    
    // Nếu đã có đủ thông tin, hiển thị popup xác nhận lưu
    setShowSaveConfirmation(true);
  };
  
  // Thêm vào useEffect để kiểm tra xem có đang edit CV không
  useEffect(() => {
    // Kiểm tra nếu có cvId trong location state (từ trang dashboard)
    if (location.state?.cvId) {
      setCvId(location.state.cvId);
      setIsEditing(true);
      
      // Fetch dữ liệu CV hiện có từ API
      const token = localStorage.getItem('authToken');
      const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/cv/${location.state.cvId}`;
      
      fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch CV data');
        return response.json();
      })
      .then(data => {
        // Cập nhật formData với dữ liệu từ server
        setFormData(data.data);
      })
      .catch(error => {
        console.error('Error fetching CV:', error);
        alert('Could not load CV data. Please try again.');
      });
    }
  }, [location.state]);

  // Hàm xử lý sau khi người dùng đặt tên CV
  const handleSaveWithName = (cvName) => {
    setShowNameModal(false);
    
    // Nếu không có tên, tạo tên mặc định
    const finalName = cvName || `Untitled${Math.floor(Math.random() * 1000)}`;
    
    console.log("Submitting CV with name:", finalName);
    
    // Hiển thị trạng thái đang xử lý
    setIsSubmitting(true);
    
    // Format dữ liệu theo đúng cấu trúc API yêu cầu
    const formattedData = {
      name: finalName,
      personalInfo: formData.personalInfo,
      summary: formData.summary,
      education: formData.education,
      experience: formData.experience,
      skills: formData.skills,
      projects: formData.projects || [],
      certifications: formData.certifications || [],
      languages: formData.languages || [],
      additionalInfo: formData.additionalInfo || {
        interests: '',
        achievements: '',
        publications: '',
        references: ''
      },
      customFields: formData.customFields || []
    };
    
    // Phần xử lý token và gọi API
    try {
      // Lấy token từ localStorage với đúng key
      const token = localStorage.getItem('token');
      
      console.log('Using token:', token ? 'Found token' : 'No token found');
      
      if (!token) {
        console.error('No token found in localStorage');
        toast.error('You need to login to save your CV');
        setIsSubmitting(false);
        return;
      }
      
      // URL của API endpoint
      const apiUrl = 'http://localhost:5000/api/cv';
      console.log('Saving CV to API:', apiUrl);
      
      // Gọi API để lưu CV
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      })
      .then(response => {
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          if (response.status === 401) {
            toast.error('Your session has expired. Please login again.');
            // Xóa token hết hạn
            localStorage.removeItem('token');
            throw new Error('Authentication failed');
          } else {
            return response.text().then(text => {
              try {
                const errorData = JSON.parse(text);
                throw new Error(errorData.message || `Error ${response.status}`);
              } catch (e) {
                throw new Error(`Error ${response.status}: ${text || response.statusText}`);
              }
            });
          }
        }
        return response.json();
      })
      .then(data => {
        console.log('CV saved successfully:', data);
        
        toast.success(`CV "${finalName}" saved successfully!`);
        
        // Chuyển hướng đến trang Dashboard
        navigate('/dashboard', { 
          state: { 
            message: 'CV saved successfully!',
            cvId: data.data?._id
          } 
        });
      })
      .catch(error => {
        console.error('Error saving CV:', error);
        toast.error(`Failed to save CV: ${error.message}`);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
    } catch (error) {
      console.error('Error in API call preparation:', error);
      toast.error('An error occurred while preparing the request.');
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    navigate(-1); // Quay lại trang trước đó trong lịch sử
  };
  
  // Cập nhật hàm selectAdditionalSection để phù hợp với logic mới
  const selectAdditionalSection = (sectionId) => {
    // Nếu section chưa được chọn, thêm vào danh sách
    if (!selectedSections.includes(sectionId)) {
      setSelectedSections([...selectedSections, sectionId]);
      
      // Đảm bảo formData có phần cho section này
      if (!formData[sectionId]) {
        updateFormData(sectionId, []);
      }
    }
  };
  


  const renderStep = () => {
    console.log("Rendering step:", step);
    
    switch (step) {
      case 1:
        return (
          <PersonalInfoStep
            data={formData.personalInfo}
            updateData={(data) => updateFormData('personalInfo', data)}
            nextStep={nextStep}
            externalErrors={validationErrors}
          />
        );
      case 2:
        return (
          <SummaryStep
            data={formData.summary}
            updateData={(data) => updateFormData('summary', data)}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <ExperienceStep
            data={formData.experience}
            updateData={(data) => updateFormData('experience', data)}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <EducationStep
            data={formData.education}
            updateData={(data) => updateFormData('education', data)}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 5:
        return (
          <SkillsStep
            data={formData.skills}
            updateData={(data) => updateFormData('skills', data)}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 6:
        return (
          <AdditionalSectionsStep
            selectedSections={selectedSections}
            completedSections={completedSections}
            onSelectSection={selectAdditionalSection}
            nextStep={nextStep}
            prevStep={prevStep}
            updateFormData={updateFormData}
            formData={formData}
          />
        );
      case 7:
        return (
          <ReviewStep
            data={formData}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            updateFormData={updateFormData}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  

  const goToStep = (stepNumber) => {
    console.log("Attempting to go to step:", stepNumber);
    
    // Nếu đang ở bước Additional Sections và đang hiển thị một section phụ
    if (step === 6 && currentAdditionalSection) {
      setCurrentAdditionalSection(null);
    }
    
    setStep(stepNumber);
    if (stepNumber > maxStepReached) {
      setMaxStepReached(stepNumber);
    }
  };

  const nextStep = () => {
    // Nếu đang ở bước Personal Information (step 1), kiểm tra các trường bắt buộc
    if (step === 1) {
      const isReady = validateRequiredFields();
      if (!isReady) {
        return;
      }
    }

    // Nếu đang ở bước Additional Sections và đang hiển thị một section phụ
    if (step === 6 && currentAdditionalSection) {
      // Đánh dấu section hiện tại là đã hoàn thành
      if (!completedSections.includes(currentAdditionalSection)) {
        setCompletedSections([...completedSections, currentAdditionalSection]);
      }
      
      // Quay lại màn hình chọn section
      setCurrentAdditionalSection(null);
      return;
    }
    
    const newStep = step + 1;
    setStep(newStep);
    if (newStep > maxStepReached) {
      setMaxStepReached(newStep);
    }
  };

  const prevStep = () => {
    // Nếu đang ở bước Additional Sections và đang hiển thị một section phụ
    if (step === 6 && currentAdditionalSection) {
      // Quay lại màn hình chọn section
      setCurrentAdditionalSection(null);
      return;
    }
    
    setStep(step - 1);
  };

  useEffect(() => {
    // Ngăn chặn scroll tự động khi component re-render
    const preventScrollReset = () => {
      // Lưu vị trí scroll hiện tại
      const scrollPosition = window.scrollY;
      
      // Sử dụng requestAnimationFrame để đảm bảo việc này xảy ra sau khi browser đã xử lý render
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPosition);
      });
    };
    
    // Thêm event listener cho sự kiện scroll
    window.addEventListener('scroll', preventScrollReset, { once: true });
    
    return () => {
      window.removeEventListener('scroll', preventScrollReset);
    };
  }, [step, currentAdditionalSection]); // Chỉ chạy khi step hoặc currentAdditionalSection thay đổi

  // Thêm hàm này vào cùng với các hàm khác
  const toggleFullPagePreview = () => {
    setShowFullPagePreview(!showFullPagePreview);
  };

  // Thêm useEffect để xử lý dữ liệu từ document upload
  useEffect(() => {
    // Kiểm tra nếu có dữ liệu được truyền từ trang upload
    if (location.state?.fromUpload && location.state?.extractedData) {
      const uploadedData = location.state.extractedData;
      console.log('Received extracted data:', uploadedData);
      
      // Cập nhật formData với dữ liệu đã được phân tích
      setFormData(prevData => ({
        ...prevData,
        ...uploadedData
      }));
      
      // Xóa state để tránh tình trạng load lại data khi refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Hàm hiển thị thông báo
  const showNotification = (message) => {
    // Implement your notification logic here
    console.log(message);
    // Ví dụ: toast(message) nếu dùng react-toastify
  };

  // Sửa các hàm gọi API
  const fetchTemplates = async () => {
    try {
      const response = await api.get('/templates');
      setTemplates(response.data);
    } catch (error) {
      const errorMessage = handleApiError(error, navigate);
      setError(errorMessage);
    }
  }

  const saveResume = async () => {
    try {
      const resumeData = {
        // Your resume data structure
      };
      
      const response = await api.post('/resumes', resumeData);
      setResumeId(response.data.id);
      showNotification('Resume saved successfully!');
    } catch (error) {
      const errorMessage = handleApiError(error, navigate);
      setError(errorMessage);
    }
  }

  // Nếu dùng callApi cũ
  const generateResumeWithAI = async () => {
    try {
      setGenerating(true);
      const data = await callApi('/generate-resume', 'POST', { 
        prompt, sections 
      });
      setGeneratedContent(data.content);
    } catch (error) {
      const errorMessage = handleApiError(error, navigate);
      setError(errorMessage);
    } finally {
      setGenerating(false);
    }
  }

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Thêm hàm xử lý khi đóng popup xác nhận
  const handleCloseSaveConfirmation = () => {
    setShowSaveConfirmation(false);
  };
  
  // Hàm xử lý khi người dùng xác nhận tiếp tục lưu dù thiếu thông tin
  const handleConfirmProceed = () => {
    setShowConfirmationDialog(false);
    setShowSaveConfirmation(true);
  };

  // Thêm hàm xử lý khi xác nhận lưu
  const handleConfirmSave = () => {
    setShowSaveConfirmation(false);
    // Hiển thị modal để đặt tên CV
    setShowNameModal(true);
  };

  const validateRequiredFields = () => {
    const errors = {};
    
    // Kiểm tra xem formData và personalInfo có tồn tại không
    if (!formData || !formData.personalInfo) {
      return { valid: false, errors: { general: 'Personal information is missing' } };
    }
    
    // Lấy dữ liệu từ formData.personalInfo
    const { firstName = "", lastName = "", email = "", headline = "" } = formData.personalInfo;
    
    // Trim và kiểm tra từng trường
    const trimmedFirstName = firstName.toString().trim();
    const trimmedLastName = lastName.toString().trim();
    const trimmedEmail = email.toString().trim();
    const trimmedHeadline = headline.toString().trim();
    
    // Kiểm tra từng trường riêng biệt
    if (trimmedFirstName.length === 0) {
      errors.firstName = 'First name is required';
    }
    
    if (trimmedLastName.length === 0) {
      errors.lastName = 'Last name is required';
    }
    
    if (trimmedEmail.length === 0) {
      errors.email = 'Email is required';
    } else {
      // Kiểm tra định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        errors.email = 'Email is invalid';
      }
    }
    
    if (trimmedHeadline.length === 0) {
      errors.headline = 'Professional headline is required';
    }
    
    // Trả về kết quả
    return { 
      valid: Object.keys(errors).length === 0,
      errors: errors
    };
  };

  // Sửa lại hàm đóng popup xác nhận
  const handleCancelConfirmation = () => {
    setShowConfirmationDialog(false);
    // Chuyển đến tab Personal và giữ lỗi validation để hiển thị
    goToStep(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              {/* Nút Back bên trái */}
              <button
                onClick={goBack}
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <ArrowLeft className="mr-1" /> Back
              </button>
              
              {/* Nút Save màu xanh có icon bên phải */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    <span className="ml-2">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span className="ml-2">Save</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Tab navigation - hiển thị đầy đủ các trường */}
            <div className="mt-6 overflow-x-auto">
              <div className="flex justify-center bg-gray-100 rounded-lg overflow-hidden">
                {/* Tab cho Personal */}
                <button
                  onClick={() => goToStep(1)}
                  className={`py-3 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    step === 1 ? 'bg-white text-black' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Personal
                </button>
                
                {/* Tab cho Summary */}
                <button
                  onClick={() => goToStep(2)}
                  className={`py-3 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    step === 2 ? 'bg-white text-black' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Summary
                </button>
                
                {/* Tab cho Experience */}
                <button
                  onClick={() => goToStep(3)}
                  className={`py-3 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    step === 3 ? 'bg-white text-black' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Experience
                </button>
                
                {/* Tab cho Education */}
                <button
                  onClick={() => goToStep(4)}
                  className={`py-3 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    step === 4 ? 'bg-white text-black' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Education
                </button>
                
                {/* Tab cho Skills */}
                <button
                  onClick={() => goToStep(5)}
                  className={`py-3 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    step === 5 ? 'bg-white text-black' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Skills
                </button>
                
                {/* Tab cho Additional Sections */}
                <button
                  onClick={() => goToStep(6)}
                  className={`py-3 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    step === 6 && !currentAdditionalSection ? 'bg-white text-black' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Additional
                </button>
                
                {/* Tab cho Review */}
                <button
                  onClick={() => goToStep(7)}
                  className={`py-3 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    step === 7 ? 'bg-white text-black' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Review
                </button>
              </div>
            </div>
            
            {/* Hiển thị sub-tabs cho Additional Sections nếu đang ở bước 6 */}
            {step === 6 && currentAdditionalSection && (
              <div className="mt-2 ml-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span>Additional &gt; </span>
                  <span className="font-medium ml-1">
                    {additionalSections.find(s => s.id === currentAdditionalSection)?.name || 'Section'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow pt-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col md:flex-row md:space-x-6">
            {/* Tab Interface (Hint Panel + AI Assistant) */}
            <div className="md:w-1/4 mb-6 md:mb-0">
              <TabInterface 
                currentStep={step} 
                currentAdditionalSection={currentAdditionalSection}
                formData={formData}
              />
            </div>
            
            {/* Main Form */}
            <div className="md:w-3/8 flex-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                {renderStep()}
              </div>
              <div className="pb-20"></div>
            </div>
            
            {/* Preview Section */}
            <div className="md:w-3/8 flex-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">CV Preview</h2>
                  <button 
                    onClick={toggleFullPagePreview}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="View in full page"
                  >
                    <HiArrowTopRightOnSquare size={20} />
                  </button>
                </div>
                <div className="max-h-[calc(100vh-150px)] overflow-y-auto cv-wrapper">
                  <div className="w-full cv-wrapper">
                    <CVPreview formData={formData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Thêm CVNameModal */}
      <CVNameModal
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        onSave={handleSaveWithName}
        defaultName={
          isEditing && formData.name 
            ? formData.name
            : (formData.personalInfo?.firstName 
                ? `${formData.personalInfo.firstName}'s CV` 
                : `Untitled${Math.floor(Math.random() * 1000)}`)
        }
      />
      
      {/* Thêm CVSaveConfirmation */}
      <CVSaveConfirmation
        isOpen={showSaveConfirmation}
        onClose={handleCloseSaveConfirmation}
        onSave={handleConfirmSave}
        cvData={formData}
      />
      
      {/* Các modal khác */}
      <CVPreviewModal 
        isOpen={showFullPagePreview}
        onClose={toggleFullPagePreview}
        formData={formData}
      />
      
      {/* Thêm Modal Xác nhận khi thiếu thông tin */}
      {showConfirmationDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            {/* Nút đóng "X" */}
            <button 
              onClick={handleCancelConfirmation} 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Missing Information</h3>
            <p className="text-gray-600 mb-2">
              Some required information is missing or invalid:
            </p>
            <ul className="list-disc pl-5 text-gray-600 mb-5">
              {validationErrors.firstName && <li>First Name is required</li>}
              {validationErrors.lastName && <li>Last Name is required</li>}
              {validationErrors.email && <li>Email {validationErrors.email.includes('invalid') ? 'is invalid' : 'is required'}</li>}
              {validationErrors.headline && <li>Professional headline is required</li>}
            </ul>
            <p className="text-gray-600 mb-5">Do you still want to save this CV?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelConfirmation}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmProceed}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Still Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default NewCV;
