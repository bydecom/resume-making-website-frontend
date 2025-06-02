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
import ResumeSaveConfirmation from '../../components/ResumeSaveConfirmation';
import './lib/input-styles.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api, { callApi } from '../../utils/api';
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

const EditResume = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  console.log("EditResume RENDER - location.state:", location.state); // <<-- LOG QUAN TRỌNG 1


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
  const [resumeId, setResumeId] = useState(null);
  const returnPath = location.state?.returnPath || '/dashboard';

  // Khởi tạo formData với dữ liệu edit nếu có
  const [formData, setFormData] = useState(() => {
    if (location.state?.isEditing && location.state?.editData) {
      // Ensure roleApply takes precedence for professional headline
      const editData = location.state.editData;
      
      // Store the original personalInfo for later use when saving
      const originalPersonalInfo = { ...editData.personalInfo };
      
      // Process skills data - ensure we have both skills array and matchedSkills
      const processedSkills = editData.skills || 
                             (editData.matchedSkills?.map(item => item.skill || '') || []);
      
      return {
        ...editData,
        // Store original personalInfo separately
        originalPersonalInfo: originalPersonalInfo,
        personalInfo: {
          ...editData.personalInfo,
          // Override professionalHeadline with roleApply if available
          professionalHeadline: editData.roleApply || 
                               editData.jobDescriptionId?.position || 
                               editData.personalInfo?.professionalHeadline || ''
        },
        // Ensure we have both the matched fields and regular fields
        skills: processedSkills,
        matchedSkills: editData.matchedSkills || 
                      (processedSkills?.map(skill => typeof skill === 'string' ? { skill, relevance: 100 } : skill)) || 
                      [],
        
        // Ensure we have both experience and matchedExperience
        experience: editData.experience || editData.matchedExperience || [],
        matchedExperience: editData.matchedExperience || editData.experience || [],
        
        // Ensure we have both projects and matchedProjects
        projects: editData.projects || editData.matchedProjects || [],
        matchedProjects: editData.matchedProjects || editData.projects || [],
        
        // Ensure we have both certifications and matchedCertifications
        certifications: editData.certifications || editData.matchedCertifications || [],
        matchedCertifications: editData.matchedCertifications || editData.certifications || [],
        
        // Ensure we have both languages and matchedLanguages
        languages: editData.languages || editData.matchedLanguages || [],
        matchedLanguages: editData.matchedLanguages || editData.languages || []
      };
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
      originalPersonalInfo: null, // Add this field
      template: { id: getDefaultTemplate().id },
      summary: '',
      education: [],
      experience: [],
      matchedExperience: [],
      skills: [],
      matchedSkills: [],
      projects: [],
      matchedProjects: [],
      certifications: [],
      matchedCertifications: [],
      languages: [],
      matchedLanguages: [],
      activities: [],
      additionalInfo: {
        interests: '',
        achievements: '',
        publications: '',
        references: '',
        customSections: []
      },
      customFields: [],
      // Resume specific fields
      roleApply: '',
      jobDescriptionId: null
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
      let newData = {
        ...prevData,
        [section]: data
      };
      
      // Special handling for skills to update both skills and matchedSkills
      if (section === 'skills') {
        // When skills are updated, also update matchedSkills
        newData.matchedSkills = data.map(skill => {
          // If the skill already exists in matchedSkills, preserve its data
          const existingSkill = prevData.matchedSkills?.find(s => 
            s.skill === skill || (typeof s === 'object' && s.skill === skill)
          );
          
          if (existingSkill) {
            return existingSkill;
          }
          
          // Otherwise create a new skill object with default relevance
          return {
            skill: skill,
            relevance: 100
          };
        });
      }
      
      // Special handling for experience to update both experience and matchedExperience
      if (section === 'experience') {
        // When experience is updated, also update matchedExperience
        newData.matchedExperience = data;
      } else if (section === 'matchedExperience') {
        // When matchedExperience is updated, also update experience
        newData.experience = data;
      }
      
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
  
  // Thêm vào useEffect để kiểm tra xem có đang edit Resume không
  useEffect(() => {
    // Nếu đến từ trang analyzing và có tips
    if (location.state?.fromAnalyzing && location.state?.tips) {
      setTips(location.state.tips);
      setShowHints(true);
      setIsNewResume(true);
      
      // Nếu có resumeId, fetch dữ liệu resume
      if (location.state?.resumeId) {
        setResumeId(location.state.resumeId);
        setIsEditing(true);
        
        // Fetch dữ liệu Resume
        callApi(`/api/resumes/${location.state.resumeId}`, 'GET')
          .then(response => {
            if (response && (response.success || response.status === 'success')) {
              const resumeData = response.data;
              
              // Đảm bảo template ID hợp lệ
              const template = resumeData.template || { id: getDefaultTemplate().id };
              const validTemplate = getTemplateById(template.id);
              if (!validTemplate) {
                template.id = getDefaultTemplate().id;
              }
              
              // Store the original personalInfo for later use when saving
              const originalPersonalInfo = { ...resumeData.personalInfo };
              
              // Process skills data - ensure we have both skills array and matchedSkills
              const processedSkills = resumeData.skills || 
                                     (resumeData.matchedSkills?.map(item => item.skill || '') || []);
              
              // Apply correct priority for professionalHeadline
              const updatedResumeData = {
                ...resumeData,
                template: template,
                // Store original personalInfo separately
                originalPersonalInfo: originalPersonalInfo,
                personalInfo: {
                  ...resumeData.personalInfo,
                  // Override professionalHeadline with roleApply if available
                  professionalHeadline: resumeData.roleApply || 
                                       resumeData.jobDescriptionId?.position || 
                                       resumeData.personalInfo?.professionalHeadline || 
                                       resumeData.originalCV?.personalInfo?.professionalHeadline || ''
                },
                // Ensure we have both the matched fields and regular fields
                skills: processedSkills,
                matchedSkills: resumeData.matchedSkills || 
                              (processedSkills?.map(skill => typeof skill === 'string' ? { skill, relevance: 100 } : skill)) || 
                              [],
                
                // Ensure we have both experience and matchedExperience
                experience: resumeData.experience || resumeData.matchedExperience || [],
                matchedExperience: resumeData.matchedExperience || resumeData.experience || [],
                
                // Ensure we have both projects and matchedProjects
                projects: resumeData.projects || resumeData.matchedProjects || [],
                matchedProjects: resumeData.matchedProjects || resumeData.projects || [],
                
                // Ensure we have both certifications and matchedCertifications
                certifications: resumeData.certifications || resumeData.matchedCertifications || [],
                matchedCertifications: resumeData.matchedCertifications || resumeData.certifications || [],
                
                // Ensure we have both languages and matchedLanguages
                languages: resumeData.languages || resumeData.matchedLanguages || [],
                matchedLanguages: resumeData.matchedLanguages || resumeData.languages || []
              };
              
              setFormData(updatedResumeData);
            } else {
              throw new Error('Failed to fetch Resume data');
            }
          })
          .catch(error => {
            console.error('Error fetching Resume:', error);
            toast.error('Could not load Resume data. Please try again.');
          });
      }
      
      return; // Không tiếp tục các trường hợp khác
    }

    // Kiểm tra nếu có resumeId trong params (từ URL)
    const params = new URLSearchParams(location.search);
    const urlResumeId = location.pathname.split('/').pop();
    
    // Nếu có ID từ URL hoặc trong location state
    if (urlResumeId && urlResumeId !== 'create-new' && urlResumeId !== 'edit-resume') {
      setResumeId(urlResumeId);
      setIsEditing(true);
      
      // Fetch dữ liệu Resume hiện có từ API
      callApi(`/api/resumes/${urlResumeId}`, 'GET')
        .then(response => {
          if (response && (response.success || response.status === 'success')) {
            const resumeData = response.data;
            
            // Đảm bảo template ID hợp lệ
            const template = resumeData.template || { id: getDefaultTemplate().id };
            const validTemplate = getTemplateById(template.id);
            if (!validTemplate) {
              template.id = getDefaultTemplate().id;
            }
            
            // Store the original personalInfo for later use when saving
            const originalPersonalInfo = { ...resumeData.personalInfo };
            
            // Process skills data - ensure we have both skills array and matchedSkills
            const processedSkills = resumeData.skills || 
                                   (resumeData.matchedSkills?.map(item => item.skill || '') || []);
            
            // Apply correct priority for professionalHeadline
            const updatedResumeData = {
              ...resumeData,
              template: template,
              // Store original personalInfo separately
              originalPersonalInfo: originalPersonalInfo,
              personalInfo: {
                ...resumeData.personalInfo,
                // Override professionalHeadline with roleApply if available
                professionalHeadline: resumeData.roleApply || 
                                     resumeData.jobDescriptionId?.position || 
                                     resumeData.personalInfo?.professionalHeadline || 
                                     resumeData.originalCV?.personalInfo?.professionalHeadline || ''
              },
              // Ensure we have both the matched fields and regular fields
              skills: processedSkills,
              matchedSkills: resumeData.matchedSkills || 
                            (processedSkills?.map(skill => typeof skill === 'string' ? { skill, relevance: 100 } : skill)) || 
                            [],
              
              // Ensure we have both experience and matchedExperience
              experience: resumeData.experience || resumeData.matchedExperience || [],
              matchedExperience: resumeData.matchedExperience || resumeData.experience || [],
              
              // Ensure we have both projects and matchedProjects
              projects: resumeData.projects || resumeData.matchedProjects || [],
              matchedProjects: resumeData.matchedProjects || resumeData.projects || [],
              
              // Ensure we have both certifications and matchedCertifications
              certifications: resumeData.certifications || resumeData.matchedCertifications || [],
              matchedCertifications: resumeData.matchedCertifications || resumeData.certifications || [],
              
              // Ensure we have both languages and matchedLanguages
              languages: resumeData.languages || resumeData.matchedLanguages || [],
              matchedLanguages: resumeData.matchedLanguages || resumeData.languages || []
            };
            
            setFormData(updatedResumeData);
          } else {
            throw new Error('Failed to fetch Resume data');
          }
        })
        .catch(error => {
          console.error('Error fetching Resume:', error);
          toast.error('Could not load Resume data. Please try again.');
        });
    } else if (location.state?.editData) {
      // Nếu có dữ liệu chỉnh sửa trong location state (từ trang khác chuyển đến)
      setResumeId(location.state.editData._id);
      setIsEditing(true);
      setFormData(location.state.editData);
    }
  }, [location]);

  // Cập nhật handleSaveWithName để luôn sử dụng PUT
  const handleSaveWithName = async (resumeName) => {
    setShowNameModal(false);
    const finalName = resumeName || formData.name || `Untitled${Math.floor(Math.random() * 1000)}`;
    setIsSubmitting(true);

    const templateId = formData.template?.id || getDefaultTemplate().id;
    const templateInfo = getTemplateById(templateId);
    
    // Extract the original professionalHeadline from the database data
    // This ensures we don't overwrite it with the displayed value
    const originalProfessionalHeadline = formData.originalPersonalInfo?.professionalHeadline || formData.personalInfo?.professionalHeadline;
    
    // Ensure roleApply is set correctly with proper priority
    const roleApply = formData.roleApply || 
                     formData.jobDescriptionId?.position || 
                     formData.personalInfo?.professionalHeadline || '';
    
    // Preserve the original matched fields from the resume
    const formattedData = {
      name: finalName,
      template: {
        id: templateId,
        name: templateInfo.name
      },
      personalInfo: {
        ...formData.personalInfo,
        // Keep the original professionalHeadline, not the displayed one
        professionalHeadline: originalProfessionalHeadline
      },
      summary: formData.summary,
      
      // For resume, we need to preserve the original matched fields
      education: formData.education || [],
      
      // For experience, use matchedExperience if available, otherwise use experience
      experience: formData.experience || [],
      matchedExperience: formData.matchedExperience || formData.experience || [],
      
      // For skills, preserve matchedSkills if available
      skills: formData.skills || [],
      matchedSkills: formData.matchedSkills || 
                    (formData.skills?.map(skill => typeof skill === 'string' ? { skill, relevance: 100 } : skill)) || 
                    [],
      
      // For projects, use matchedProjects if available, otherwise use projects
      projects: formData.projects || [],
      matchedProjects: formData.matchedProjects || formData.projects || [],
      
      // For certifications, use matchedCertifications if available, otherwise use certifications
      certifications: formData.certifications || [],
      matchedCertifications: formData.matchedCertifications || formData.certifications || [],
      
      // For languages, use matchedLanguages if available, otherwise use languages
      languages: formData.languages || [],
      matchedLanguages: formData.matchedLanguages || formData.languages || [],
      
      additionalInfo: formData.additionalInfo || {
        interests: '',
        achievements: '',
        publications: '',
        references: ''
      },
      customFields: formData.customFields || [],
      
      // Resume specific fields
      roleApply: roleApply, // Use the prioritized roleApply
      jobDescriptionId: formData.jobDescriptionId || null,
      
      // Preserve other fields from the original data
      originalCV: formData.originalCV || null,
      cvId: formData.cvId || null,
      userId: formData.userId || null,
      status: formData.status || 'draft'
    };

    try {
      // Lấy ID từ location.state trước, nếu không có thì lấy từ state
      const id = location.state?.resumeId || resumeId;
      
      if (!id) {
        throw new Error('Resume ID not found. Cannot update resume.');
      }
      
      // Luôn sử dụng PUT để cập nhật resume
      const response = await callApi(`/api/resumes/${id}`, 'PUT', formattedData);

      if (response && (response.success || response.status === 'success')) {
        toast.success(`Resume "${finalName}" updated successfully!`);

        // Chuyển hướng về trang được chỉ định hoặc dashboard
        navigate(returnPath, {
          state: { 
            message: `Resume updated successfully!`,
            resumeId: response.data?._id || id
          },
          replace: true
        });
      } else {
        throw new Error('Failed to update resume');
      }
    } catch (error) {
      console.error('Error updating Resume:', error);
      toast.error(`Failed to update Resume: ${error.message || 'Unknown error'}`);
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
            formData={formData}
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
            formData={formData}
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
    const validation = validateRequiredFields();
    
    // Nếu đang ở bước Personal Information (step 1), kiểm tra các trường bắt buộc
    if (step === 1 && !validation.valid) {
      setValidationErrors(validation.errors);
        return;
    }

    // Nếu đang ở bước Additional Sections và đang hiển thị một section phụ
    if (step === 6 && currentAdditionalSection) {
      // Đánh dấu section hiện tại là đã hoàn thành
      if (!completedSections.includes(currentAdditionalSection)) {
        setCompletedSections([...completedSections, currentAdditionalSection]);
      }
      
      // Quay lại danh sách các section phụ
      setCurrentAdditionalSection(null);
      return;
    }
    
    const nextStepNumber = step + 1;
    
    // Kiểm tra xem có vượt quá số bước không
    if (nextStepNumber <= 7) {
      setStep(nextStepNumber);
      if (nextStepNumber > maxStepReached) {
        setMaxStepReached(nextStepNumber);
      }
    }
  };

  const prevStep = () => {
    // Nếu đang ở bước Additional Sections và đang hiển thị một section phụ
    if (step === 6 && currentAdditionalSection) {
      setCurrentAdditionalSection(null);
      return;
    }
    
    const prevStepNumber = step - 1;
    
    // Kiểm tra xem có vượt quá số bước không
    if (prevStepNumber >= 1) {
      setStep(prevStepNumber);
    }
  };

  // Ngăn chặn cuộn trang khi chuyển step
    const preventScrollReset = () => {
    console.log("Preventing scroll reset");
    
    // Lưu vị trí cuộn hiện tại
    const scrollY = window.scrollY;
    
    // Đặt lại vị trí cuộn sau khi DOM đã cập nhật
    setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 10);
  };

  // Hàm để hiển thị preview toàn màn hình
  const toggleFullPagePreview = () => {
    setShowFullPagePreview(!showFullPagePreview);
  };

  // Hàm để thay đổi template
  const handleTemplateChange = (templateId) => {
    // Nếu được gọi từ toggleFullPagePreview
    if (typeof templateId === 'boolean') {
    setShowFullPagePreview(false);
      return;
    }
    
    // Nếu được gọi từ templatesModal với templateId mới
    if (templateId && typeof templateId === 'string') {
      const template = getTemplateById(templateId);
      
      if (template) {
        // Cập nhật formData với template mới
        setFormData(prevFormData => ({
          ...prevFormData,
          template: {
            id: templateId,
            name: template.name
          }
        }));
        
        // Đóng modal
        setShowFullPagePreview(false);
      }
    } else {
      // Chỉ đóng modal
      setShowFullPagePreview(false);
    }
  };

  // Đóng modal xác nhận lưu
  const handleCloseSaveConfirmation = () => {
    setShowSaveConfirmation(false);
  };
  
  // Xử lý khi người dùng chọn "Proceed Anyway" trong popup cảnh báo
  const handleConfirmProceed = () => {
    setShowConfirmationDialog(false);
    handleConfirmSave();
  };

  // Hiển thị modal đặt tên Resume
  const handleConfirmSave = () => {
    setShowSaveConfirmation(false);
    setShowNameModal(true);
  };

  // Kiểm tra các trường bắt buộc
  const validateRequiredFields = () => {
    const errors = {};
    let valid = true;

    // Kiểm tra dữ liệu PersonalInfo
    if (!formData.personalInfo) {
      formData.personalInfo = {};
    }

    // Validate firstName
    if (!formData.personalInfo.firstName || formData.personalInfo.firstName.trim() === '') {
      errors.firstName = 'First name is required';
      valid = false;
    }
    
    // Validate lastName
    if (!formData.personalInfo.lastName || formData.personalInfo.lastName.trim() === '') {
      errors.lastName = 'Last name is required';
      valid = false;
    }
    
    // Validate email
    if (!formData.personalInfo.email || formData.personalInfo.email.trim() === '') {
      errors.email = 'Email is required';
      valid = false;
    } else {
      // Kiểm tra định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.personalInfo.email.trim())) {
        errors.email = 'Invalid email format';
        valid = false;
      }
    }

    // Validate số điện thoại (optional)
    if (formData.personalInfo.phone && formData.personalInfo.phone.trim() !== '') {
      // Simple phone validation (optional)
      const phoneRegex = /^[0-9+\-() ]{6,20}$/; 
      if (!phoneRegex.test(formData.personalInfo.phone.trim())) {
        errors.phone = 'Invalid phone number format';
        valid = false;
      }
    }

    return { valid, errors };
  };

  // Đóng popup cảnh báo
  const handleCancelConfirmation = () => {
    setShowConfirmationDialog(false);
    setValidationErrors({});
  };

  // Add to stylesheet
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Xác định các bước trong tiến trình
  const steps = [
    { number: 1, title: "Personal Info" },
    { number: 2, title: "Summary" },
    { number: 3, title: "Experience" },
    { number: 4, title: "Education" },
    { number: 5, title: "Skills" },
    { number: 6, title: "Additional Sections" },
    { number: 7, title: "Review" }
  ];

  console.log('location.state:', location.state);
  console.log('resumeId:', resumeId);

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
                  <h2 className="text-xl font-semibold">Resume Preview</h2>
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
              style={{ maxHeight: 'calc(110vh - 200px)' }}
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
      <ResumeSaveConfirmation
        isOpen={showSaveConfirmation}
        onClose={handleCloseSaveConfirmation}
        onSave={handleConfirmSave}
        resumeData={formData}
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

export default EditResume;
