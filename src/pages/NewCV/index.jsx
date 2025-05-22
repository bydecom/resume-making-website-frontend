import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { TbMessageChatbot } from "react-icons/tb";
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
import { getDefaultTemplate, getTemplateById } from '../../templates';

// Add these styles at the beginning of the file, after the imports
const styles = `
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 0.5;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  }

  .animate-ripple-1 {
    animation: ripple 2s linear infinite;
  }

  .animate-ripple-2 {
    animation: ripple 2s linear infinite;
    animation-delay: 0.5s;
  }
`;

const NewCV = () => {
  const [error, setError] = useState(null);
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
  
  // Thêm state để xác định mode edit
  const [isEditing, setIsEditing] = useState(location.state?.isEditing || false);
  const [cvId, setCvId] = useState(location.state?.editData?._id);
  const returnPath = location.state?.returnPath || '/dashboard';

  // Khởi tạo formData với dữ liệu edit nếu có
  const [formData, setFormData] = useState(() => {
    if (location.state?.isEditing && location.state?.editData) {
      return location.state.editData;
    }
    return {
      personalInfo: {
        firstName: '',
        lastName: '',
        professionalHeadline: '',
        email: '',
        phone: '',
        location: '',
        country: '',
        website: '',
        linkedin: ''
      },
      template: { id: getDefaultTemplate().id },
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
    };
  });

  // Thêm state mới cho popup
  const [showFullPagePreview, setShowFullPagePreview] = useState(false);

  // Thêm state cho name modal
  const [showNameModal, setShowNameModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Thêm các state khác nếu cần
  const [sections, setSections] = useState([]); // Định nghĩa sections
  const [prompt, setPrompt] = useState(''); // Định nghĩa prompt nếu sử dụng

  // Thêm state cho Save Confirmation
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  // Thêm state để quản lý popup xác nhận khi thiếu thông tin
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  // Thêm state để quản lý các lỗi từng trường
  const [validationErrors, setValidationErrors] = useState({});

  // Kiểm tra xem có dữ liệu được truyền từ trang upload không
  const extractedData = location.state?.extractedData;
  const fromUpload = location.state?.fromUpload;
  
  // Thêm state mới cho TabInterface
  const [showHints, setShowHints] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [tips, setTips] = useState(location.state?.tips || null);
  const [isNewResume, setIsNewResume] = useState(location.state?.isNewResume || false);

  // Thêm state mới cho Preview Toggle Button
  const [showPreview, setShowPreview] = useState(location.state?.isEditing || false);

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
    // Nếu đến từ trang analyzing và có tips
    if (location.state?.fromAnalyzing && location.state?.tips) {
      setTips(location.state.tips);
      setShowHints(true);
      setIsNewResume(true);
      return; // Không cần fetch CV data
    }

    // Kiểm tra nếu có cvId trong location state (từ trang dashboard)
    if (location.state?.cvId) {
      setCvId(location.state.cvId);
      setIsEditing(true);
      
      // Fetch dữ liệu CV hiện có từ API
      const token = localStorage.getItem('token');
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
        // Đảm bảo template ID hợp lệ
        const template = data.data.template || { id: getDefaultTemplate().id };
        
        // Kiểm tra xem template ID từ server có tồn tại trong hệ thống không
        const validTemplate = getTemplateById(template.id);
        if (!validTemplate) {
          template.id = getDefaultTemplate().id;
        }
        
        setFormData({
          ...data.data,
          template: template
        });
      })
      .catch(error => {
        console.error('Error fetching CV:', error);
        toast.error('Could not load CV data. Please try again.');
      });
    }
  }, [location.state]);

  // Cập nhật handleSaveWithName để xử lý cả create và update
  const handleSaveWithName = async (cvName) => {
    setShowNameModal(false);
    const finalName = cvName || formData.name || `Untitled${Math.floor(Math.random() * 1000)}`;
    setIsSubmitting(true);

    const templateId = formData.template?.id || getDefaultTemplate().id;
    const templateInfo = getTemplateById(templateId);
    
    const formattedData = {
      name: finalName,
      template: {
        id: templateId,
        name: templateInfo.name
      },
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

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You need to login to save your Resume');
        setIsSubmitting(false);
        return;
      }

      // Xác định phương thức và URL API dựa vào mode
      const method = isEditing ? 'PUT' : 'POST';
      const apiUrl = isEditing 
        ? `http://localhost:5000/api/cv/${cvId}`
        : 'http://localhost:5000/api/cv';

      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Your session has expired. Please login again.');
          localStorage.removeItem('token');
          throw new Error('Authentication failed');
        }
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      toast.success(`Resume "${finalName}" ${isEditing ? 'updated' : 'saved'} successfully!`);

      // Chuyển hướng về trang được chỉ định hoặc dashboard
      navigate(returnPath, {
        state: { 
          message: `Resume ${isEditing ? 'updated' : 'saved'} successfully!`,
          cvId: data.data?._id
        },
        replace: true
      });
    } catch (error) {
      console.error('Error saving Resume:', error);
      toast.error(`Failed to save Resume: ${error.message}`);
    } finally {
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

  // Thêm hàm xử lý chọn template
  const handleTemplateChange = (templateId) => {
    // Đóng modal trước
    setShowFullPagePreview(false);
    
    // Nếu nhận templateId, cập nhật template trong formData
    if (templateId) {
      updateFormData('template', { id: templateId });
    }
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
    const { firstName = "", lastName = "", email = "", professionalHeadline = "" } = formData.personalInfo;
    
    // Trim và kiểm tra từng trường
    const trimmedFirstName = firstName.toString().trim();
    const trimmedLastName = lastName.toString().trim();
    const trimmedEmail = email.toString().trim();
    const trimmedProfessionalHeadline = professionalHeadline.toString().trim();
    
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
    
    if (trimmedProfessionalHeadline.length === 0) {
      errors.professionalHeadline = 'Professional headline is required';
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

  // Hiển thị thông báo khi có dữ liệu được trích xuất
  useEffect(() => {
    if (fromUpload && extractedData) {
      // Xóa state sau khi đã sử dụng để tránh duplicate nếu trang được refresh
      navigate('/new-cv', { replace: true });
    }
  }, []);

  // Thêm effect để kiểm soát scroll của trang khi modal đang mở
  useEffect(() => {
    // Kiểm tra nếu bất kỳ modal nào đang mở
    const isAnyModalOpen = showFullPagePreview || showNameModal || showSaveConfirmation || showConfirmationDialog;
    
    // Thêm hoặc xóa class để vô hiệu hóa scroll
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden'; // Ẩn thanh scroll và ngăn cuộn trang
    } else {
      document.body.style.overflow = ''; // Khôi phục scroll mặc định
    }
    
    // Cleanup khi component unmount
    return () => {
      document.body.style.overflow = ''; // Đảm bảo khôi phục scroll khi thoát trang
    };
  }, [showFullPagePreview, showNameModal, showSaveConfirmation, showConfirmationDialog]);

  // Thêm useEffect để theo dõi thay đổi của isEditing
  useEffect(() => {
    if (isEditing) {
      setShowPreview(true);
    }
  }, [isEditing]);

  // Add useEffect to handle tips data
  useEffect(() => {
    if (location.state?.tips && location.state?.isNewResume) {
      setTips(location.state.tips);
      setShowHints(true);
      setIsNewResume(true);
      
      // Show a notification that tips are available
      toast.info("Job-specific resume tips are available! Check the hints panel.", {
        autoClose: 5000,
        position: "bottom-right",
      });
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={goBack}
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <ArrowLeft className="mr-1" /> Back
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors ${
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
                    <span className="ml-2">{isEditing ? 'Update' : 'Save'}</span>
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
          <div 
            className={`flex flex-col md:flex-row relative w-full ${
              !showPreview ? 'overflow-x-hidden' : ''
            }`}
            style={{
              overscrollBehaviorX: !showPreview ? 'none' : 'auto',
              msOverflowStyle: !showPreview ? 'none' : 'auto',
              scrollbarWidth: !showPreview ? 'none' : 'auto',
            }}
          >
            <div className={`w-full flex justify-center ${!showPreview ? 'overflow-x-hidden' : ''}`}>
              {/* Main Form - centered by default, slides left when preview shows */}
              <motion.div
                initial={false}
                animate={{
                  width: '50vw',
                  x: showPreview ? '-25vw' : '0',
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 0.8
                }}
                className="relative"
                style={{
                  maxWidth: showPreview ? '50%' : '50%',
                }}
              >
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 scrollable">
                  {renderStep()}
                </div>
                <div className="pb-20"></div>
              </motion.div>
            </div>
            
            {/* Preview Section - slides in from right */}
            <motion.div
              initial={{ width: '0%', x: '50vw' }}
              animate={{
                width: showPreview ? '50%' : '0%',
                x: showPreview ? '0' : '50vw',
                opacity: showPreview ? 1 : 0
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8
              }}
              className={`absolute top-0 right-0 h-full ${showPreview ? '' : 'hidden md:block'}`}
              style={{
                width: showPreview ? '50%' : '0%',
                pointerEvents: showPreview ? 'auto' : 'none'
              }}
            >
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
                <div className="max-h-[calc(100vh-150px)] overflow-y-auto scrollable cv-wrapper">
                  <div className="w-full cv-wrapper">
                    <CVPreview formData={formData} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Vertical Sidebar for Hints and AI - Moved to bottom right */}
            <div className="fixed right-4 bottom-4 flex flex-col gap-4 z-10">
              {/* Preview Toggle Button */}
              <motion.button
                onClick={() => {
                  setShowPreview(!showPreview);
                  if (showPreview) {
                    setShowFullPagePreview(false);
                  }
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
                  showPreview ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                title={showPreview ? "Hide Preview" : "Show Preview"}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  {showPreview ? (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 3l18 18M10.94 6.08A6.93 6.93 0 0112 6c3.18 0 6.17 2.29 7.91 6a15.23 15.23 0 01-.9 1.64m-5.7-5.7a3 3 0 11-4.24 4.24M3 3l18 18m-6.28-6.28a3 3 0 11-4.24-4.24"
                    />
                  ) : (
                    <>
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </>
                  )}
                </svg>
              </motion.button>

              {/* Hint Button */}
              <motion.button
                onClick={() => {
                  setShowHints(!showHints);
                  if (showAI) setShowAI(false);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
                  showHints ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                title="Show Hints"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.button>

              {/* AI Assistant Button */}
              <motion.button
                onClick={() => {
                  setShowAI(!showAI);
                  if (showHints) setShowHints(false);
                }}
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -10, 10, -10, 0],
                  transition: {
                    rotate: {
                      repeat: Infinity,
                      duration: 0.5
                    }
                  }
                }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-3 rounded-full shadow-lg transition-all duration-300 overflow-hidden ${
                  showAI ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                title="AI Assistant"
              >
                <TbMessageChatbot className="h-6 w-6 relative z-10" />
                {/* Ripple effect elements */}
                <div className={`absolute inset-0 ${showAI ? 'bg-blue-500' : 'bg-gray-100'}`}>
                  <div className="absolute inset-0 animate-ripple-1 bg-opacity-20 bg-white rounded-full transform scale-0"></div>
                  <div className="absolute inset-0 animate-ripple-2 bg-opacity-20 bg-white rounded-full transform scale-0"></div>
                </div>
              </motion.button>
            </div>

            {/* Collapsible Sidebar Content - Moved to bottom right */}
            <motion.div
              initial={{ width: 0, opacity: 0, y: 20 }}
              animate={{ 
                width: showHints || showAI ? '300px' : 0,
                opacity: showHints || showAI ? 1 : 0,
                y: showHints || showAI ? 0 : 20
              }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              className={`fixed right-4 bottom-20 bg-white rounded-lg shadow-lg overflow-hidden z-10 ${
                showHints || showAI ? '' : 'hidden'
              }`}
              style={{ maxHeight: 'calc(120vh - 200px)' }}
            >
              <div className="relative">
                {/* Close button */}
                <button
                  onClick={() => {
                    setShowHints(false);
                    setShowAI(false);
                  }}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Tab content */}
                <TabInterface 
                  currentStep={step} 
                  currentAdditionalSection={currentAdditionalSection}
                  formData={formData}
                  mode={showHints ? 'hints' : 'ai'}
                  tips={tips}
                />
              </div>
            </motion.div>
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
                ? `${formData.personalInfo.firstName}'s Resume` 
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
        onClose={handleTemplateChange}
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
            <div className="max-h-60 overflow-y-auto scrollable">
              <ul className="list-disc pl-5 text-gray-600 mb-5">
                {validationErrors.firstName && <li>First Name is required</li>}
                {validationErrors.lastName && <li>Last Name is required</li>}
                {validationErrors.email && <li>Email {validationErrors.email.includes('invalid') ? 'is invalid' : 'is required'}</li>}
                {validationErrors.professionalHeadline && <li>Professional headline is required</li>}
              </ul>
            </div>
            <p className="text-gray-600 mb-5">Do you still want to save this Resume?</p>
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

      {/* Add this style tag to the component's JSX, right after the opening <div> of the main container */}
      <style>{styles}</style>
    </div>
  );
};

export default NewCV;
