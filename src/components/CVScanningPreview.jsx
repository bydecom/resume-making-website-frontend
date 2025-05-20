import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import CVExtractService from '../services/cvExtractService';

// Mock CV data mẫu - sẽ được thay thế bằng API thực
const mockCVData = {
  name: "My Professional CV 2023",
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    location: "New York",
    country: "USA",
    website: "www.johndoe.com",
    linkedin: "linkedin.com/in/johndoe",
  },
  summary: "Experienced software developer with 5+ years of experience in web development and cloud technologies.",
  education: [
    {
      degree: "Bachelor of Computer Science",
      institution: "University of Technology",
      startDate: "2015-09",
      endDate: "2019-06",
      description: "Graduated with honors. Specialization in Software Engineering.",
      isPresent: false,
    },
  ],
  experience: [
    {
      title: "Senior Developer",
      company: "Tech Solutions Inc.",
      startDate: "2019-07",
      endDate: "",
      description: "Leading a team of 5 developers. Implemented CI/CD pipeline reducing deployment time by 40%.",
      isPresent: true,
    },
  ],
  skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "SQL", "Git"],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2021-05",
      url: "https://aws.amazon.com/certification",
    },
  ],
  languages: [
    {
      language: "English",
      proficiency: "Native",
    },
    {
      language: "Spanish",
      proficiency: "Intermediate",
    },
  ],
  additionalInfo: {
    interests: "Machine learning, blockchain technology, hiking, photography",
  },
};

const CVScanningPreview = ({ isOpen, onComplete = () => {}, data = {}, documentText = '' }) => {
  const [progress, setProgress] = useState(0);
  const [cvData, setCVData] = useState(null);
  const [extractedData, setExtractedData] = useState({});
  const [processingStep, setProcessingStep] = useState("initial-scan");
  
  // Refs for scrolling
  const sectionRefs = useRef({});
  const previewSectionRefs = useRef({});
  const scanningContainerRef = useRef(null);
  const previewContainerRef = useRef(null);
  
  // Define sections to scan
  const [scanSections, setScanSections] = useState([
    {
      id: "personalInfo",
      label: "Personal Information",
      status: "pending",
      expanded: true,
      items: [
        { id: "firstName", label: "First Name", value: null, status: "pending" },
        { id: "lastName", label: "Last Name", value: null, status: "pending" },
        { id: "professionalHeadline", label: "Professional Headline", value: null, status: "pending" },
        { id: "email", label: "Email", value: null, status: "pending" },
        { id: "phone", label: "Phone", value: null, status: "pending" },
        { id: "location", label: "Location", value: null, status: "pending" },
      ],
    },
    {
      id: "summary",
      label: "Professional Summary",
      status: "pending",
      expanded: false,
      items: [{ id: "summary", label: "Summary", value: null, status: "pending" }],
    },
    {
      id: "education",
      label: "Education",
      status: "pending",
      expanded: false,
      items: [
        { id: "degree", label: "Degree", value: null, status: "pending" },
        { id: "institution", label: "institution", value: null, status: "pending" },
        { id: "eduDates", label: "Dates", value: null, status: "pending" },
      ],
    },
    {
      id: "experience",
      label: "Work Experience",
      status: "pending",
      expanded: false,
      items: [
        { id: "position", label: "Job Position", value: null, status: "pending" },
        { id: "company", label: "Company", value: null, status: "pending" },
        { id: "expDates", label: "Dates", value: null, status: "pending" },
        { id: "description", label: "Description", value: null, status: "pending" },
      ],
    },
    {
      id: "skills",
      label: "Skills",
      status: "pending",
      expanded: false,
      items: [{ id: "skills", label: "Skills List", value: null, status: "pending" }],
    },
    {
      id: "additional",
      label: "Additional Information",
      status: "pending",
      expanded: false,
      items: [
        { id: "certifications", label: "Certifications", value: null, status: "pending" },
        { id: "languages", label: "Languages", value: null, status: "pending" },
        { id: "interests", label: "Interests", value: null, status: "pending" }
      ],
    },
  ]);
  
  // Xử lý trích xuất dữ liệu từ API hoặc dùng mock data
  useEffect(() => {
    if (!isOpen) return;
    
    const processCV = async () => {
      try {
        // Reset trạng thái
        setProgress(0);
        setExtractedData({});
        setProcessingStep("initial-scan");
        
        // Simulate API call or use real API
        let data;
        if (documentText) {
          // Dùng API thực nếu có documentText
          animateProgress(0, 10);
          data = await CVExtractService.extractCVData(documentText);
        } else {
          // Dùng mock data cho demo
          animateProgress(0, 10);
          await new Promise(resolve => setTimeout(resolve, 2000));
          data = mockCVData;
        }
        
        // Lưu data
        setCVData(data);
        
        // Chuyển sang bước chi tiết
        setProcessingStep("detailed-extraction");
        
        // Bắt đầu quá trình phân tích từng phần
        await scanAllSections(data);
        
        // Hoàn thành
        const formattedData = documentText ? 
          CVExtractService.formatDataForNewCV(data) : 
          data;
          
        // Lưu data đã format vào state
        setExtractedData(formattedData);
        
      } catch (error) {
        console.error('Error processing CV data:', error);
        // Xử lý lỗi ở đây
      }
    };
    
    processCV();
  }, [isOpen, documentText]);
  
  // Thêm useEffect để kiểm soát scroll của trang khi modal đang mở
  useEffect(() => {
    if (isOpen) {
      // Lưu lại kiểu overflow ban đầu
      const originalStyle = window.getComputedStyle(document.body).overflow;
      
      // Ẩn thanh scroll và ngăn cuộn trang
      document.body.style.overflow = 'hidden';
      
      // Cleanup khi component unmount hoặc khi modal đóng
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);
  
  // Hàm quét qua tất cả các phần
  const scanAllSections = async (data) => {
    // 1. Basic Information
    await scanSection("personalInfo", data, 10, 25);
    
    // 2. Professional Summary
    await scanSection("summary", data, 25, 40);
    
    // 3. Education
    await scanSection("education", data, 40, 55);
    
    // 4. Work Experience
    await scanSection("experience", data, 55, 70);
    
    // 5. Skills
    await scanSection("skills", data, 70, 85);
    
    // 6. Additional Information
    await scanSection("additional", data, 85, 100);
  };
  
  // Hàm quét từng phần
  const scanSection = async (sectionId, data, startProgress, endProgress) => {
    // Cập nhật trạng thái của phần đang được quét
    updateSectionStatus(sectionId, "scanning");
    toggleSectionExpanded(sectionId);
    scrollToSection(sectionId, "scanning");
    animateProgress(startProgress, endProgress);
    
    // Xử lý theo từng phần
    switch (sectionId) {
      case "personalInfo":
        await processBasicInfo(data);
        break;
      case "summary":
        await processSummary(data);
        break;
      case "education":
        await processEducation(data);
        break;
      case "experience":
        await processExperience(data);
        break;
      case "skills":
        await processSkills(data);
        break;
      case "additional":
        await processAdditional(data);
        break;
      default:
        break;
    }
    
    // Đánh dấu phần này đã hoàn thành
    updateSectionStatus(sectionId, "completed");
  };
  
  // Xử lý các phần cụ thể
  const processBasicInfo = async (data) => {
    // Cập nhật trạng thái các item
    updateItemStatus("personalInfo", "firstName", "scanning");
    await simulateProcessingDelay(300);
    
    // First Name
    const firstName = data.personalInfo?.firstName || '';
    updateItemValue("personalInfo", "firstName", firstName);
    setExtractedData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, firstName } }));
    
    // Last Name
    updateItemStatus("personalInfo", "lastName", "scanning");
    await simulateProcessingDelay(300);
    const lastName = data.personalInfo?.lastName || '';
    updateItemValue("personalInfo", "lastName", lastName);
    setExtractedData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, lastName } }));
    
    updateItemStatus("personalInfo", "professionalHeadline", "scanning");
    await simulateProcessingDelay(300);
    const professionalHeadline = data.personalInfo?.professionalHeadline || '';
    updateItemValue("personalInfo", "professionalHeadline", professionalHeadline);
    setExtractedData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, professionalHeadline } }));

    // Email
    updateItemStatus("personalInfo", "email", "scanning");
    await simulateProcessingDelay(300);
    const email = data.personalInfo?.email || '';
    updateItemValue("personalInfo", "email", email);
    setExtractedData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, email } }));
    
    // Phone
    updateItemStatus("personalInfo", "phone", "scanning");
    await simulateProcessingDelay(300);
    const phone = data.personalInfo?.phone || '';
    updateItemValue("personalInfo", "phone", phone);
    setExtractedData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, phone } }));
    
    // Location
    updateItemStatus("personalInfo", "location", "scanning");
    await simulateProcessingDelay(300);
    const location = data.personalInfo?.location || '';
    updateItemValue("personalInfo", "location", location);
    setExtractedData(prev => ({ 
      ...prev, 
      personalInfo: { 
        ...prev.personalInfo, 
        location,
        country: data.personalInfo?.country || '',
        website: data.personalInfo?.website || '',
        linkedin: data.personalInfo?.linkedin || ''
      },
      name: data.name || 'My Professional CV'
    }));
  };
  
  // Xử lý phần Professional Summary
  const processSummary = async (data) => {
    updateItemStatus("summary", "summary", "scanning");
    await simulateProcessingDelay(800);
    
    const summary = data.summary || '';
    updateItemValue("summary", "summary", summary);
    setExtractedData(prev => ({ ...prev, summary }));
  };
  
  // Xử lý phần Education
  const processEducation = async (data) => {
    if (!data.education || data.education.length === 0) {
      updateItemStatus("education", "degree", "completed");
      updateItemStatus("education", "institution", "completed");
      updateItemStatus("education", "eduDates", "completed");
      return;
    }
    
    const firstEducation = data.education[0];
    
    // Degree
    updateItemStatus("education", "degree", "scanning");
    await simulateProcessingDelay(400);
    const degree = firstEducation.degree || '';
    updateItemValue("education", "degree", degree);
    
    // institution
    updateItemStatus("education", "institution", "scanning");
    await simulateProcessingDelay(400);
    const institution = firstEducation.institution || '';
    updateItemValue("education", "institution", institution);
    
    // Dates
    updateItemStatus("education", "eduDates", "scanning");
    await simulateProcessingDelay(400);
    const startDate = firstEducation.startDate ? formatDate(firstEducation.startDate) : '';
    const endDate = firstEducation.isPresent 
      ? 'Present' 
      : firstEducation.endDate 
        ? formatDate(firstEducation.endDate) 
        : '';
    const eduDates = `${startDate} - ${endDate}`;
    updateItemValue("education", "eduDates", eduDates);
    
    // Update extracted data
    setExtractedData(prev => ({ ...prev, education: data.education }));
  };
  
  // Xử lý phần Experience
  const processExperience = async (data) => {
    if (!data.experience || data.experience.length === 0) {
      updateItemStatus("experience", "position", "completed");
      updateItemStatus("experience", "company", "completed");
      updateItemStatus("experience", "expDates", "completed");
      updateItemStatus("experience", "description", "completed");
      return;
    }
    
    const firstExperience = data.experience[0];
    
    // Job Position
    updateItemStatus("experience", "position", "scanning");
    await simulateProcessingDelay(300);
    const position = firstExperience.position || '';
    updateItemValue("experience", "position", position);
    
    // Company
    updateItemStatus("experience", "company", "scanning");
    await simulateProcessingDelay(300);
    const company = firstExperience.company || '';
    updateItemValue("experience", "company", company);
    
    // Dates
    updateItemStatus("experience", "expDates", "scanning");
    await simulateProcessingDelay(300);
    const startDate = firstExperience.startDate ? formatDate(firstExperience.startDate) : '';
    const endDate = firstExperience.isPresent 
      ? 'Present' 
      : firstExperience.endDate 
        ? formatDate(firstExperience.endDate) 
        : '';
    const expDates = `${startDate} - ${endDate}`;
    updateItemValue("experience", "expDates", expDates);
    
    // Description
    updateItemStatus("experience", "description", "scanning");
    await simulateProcessingDelay(300);
    const description = firstExperience.description || '';
    updateItemValue("experience", "description", description);
    
    // Update extracted data
    setExtractedData(prev => ({ ...prev, experience: data.experience }));
  };
  
  // Xử lý phần Skills
  const processSkills = async (data) => {
    updateItemStatus("skills", "skills", "scanning");
    await simulateProcessingDelay(800);
    
    if (!data.skills || data.skills.length === 0) {
      updateItemStatus("skills", "skills", "completed");
      return;
    }
    
    const skillsText = data.skills.join(', ');
    updateItemValue("skills", "skills", skillsText);
    
    // Update extracted data
    setExtractedData(prev => ({ ...prev, skills: data.skills }));
  };
  
  // Xử lý phần Additional Information
  const processAdditional = async (data) => {
    // Certifications
    updateItemStatus("additional", "certifications", "scanning");
    await simulateProcessingDelay(400);
    if (data.certifications && data.certifications.length > 0) {
      const certText = data.certifications.map(cert => cert.name).join(', ');
      updateItemValue("additional", "certifications", certText);
    } else {
      updateItemStatus("additional", "certifications", "completed");
    }
    
    // Languages
    updateItemStatus("additional", "languages", "scanning");
    await simulateProcessingDelay(400);
    if (data.languages && data.languages.length > 0) {
      const langText = data.languages.map(lang => `${lang.language} (${lang.proficiency})`).join(', ');
      updateItemValue("additional", "languages", langText);
    } else {
      updateItemStatus("additional", "languages", "completed");
    }
    
    // Interests
    updateItemStatus("additional", "interests", "scanning");
    await simulateProcessingDelay(400);
    const interests = data.additionalInfo?.interests || '';
    updateItemValue("additional", "interests", interests);
    
    // Update extracted data
    setExtractedData(prev => ({ 
      ...prev, 
      certifications: data.certifications || [],
      languages: data.languages || [],
      additionalInfo: data.additionalInfo || {}
    }));
  };
  
  // Hàm delay mô phỏng
  const simulateProcessingDelay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  
  // Helper utilities
  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const [year, month] = dateStr.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };
  
  const toggleSectionExpanded = (sectionId) => {
    setScanSections(sections => 
      sections.map(section => 
        section.id === sectionId 
          ? { ...section, expanded: !section.expanded } 
          : section
      )
    );
  };
  
  const updateSectionStatus = (sectionId, status) => {
    setScanSections(sections => 
      sections.map(section => 
        section.id === sectionId 
          ? { ...section, status } 
          : section
      )
    );
  };
  
  const updateItemStatus = (sectionId, itemId, status) => {
    setScanSections(sections => 
      sections.map(section => 
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map(item => 
                item.id === itemId ? { ...item, status } : item
              )
            }
          : section
      )
    );
  };
  
  const updateItemValue = (sectionId, itemId, value) => {
    setScanSections(sections => 
      sections.map(section => 
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map(item => 
                item.id === itemId ? { ...item, value, status: "completed" } : item
              )
            }
          : section
      )
    );
  };
  
  const animateProgress = (start, end) => {
    const duration = 1000; // ms
    const interval = 20; // ms
    const steps = duration / interval;
    const increment = (end - start) / steps;
    let currentProgress = start;
    
    const timer = setInterval(() => {
      currentProgress += increment;
      if ((increment > 0 && currentProgress >= end) || 
          (increment < 0 && currentProgress <= end)) {
        clearInterval(timer);
        setProgress(end);
      } else {
        setProgress(currentProgress);
      }
    }, interval);
  };
  
  const scrollToSection = (sectionId, side) => {
    const container = side === "scanning" ? scanningContainerRef.current : previewContainerRef.current;
    const sectionRef = side === "scanning" ? sectionRefs.current[sectionId] : previewSectionRefs.current[sectionId];
    
    if (container && sectionRef) {
      container.scrollTo({
        top: sectionRef.offsetTop - 20,
        behavior: "smooth"
      });
    }
  };
  
  // Hàm lấy icon trạng thái
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return (
          <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "scanning":
        return (
          <div className="h-6 w-6 flex items-center justify-center">
            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        );
      default:
        return (
          <div className="h-6 w-6 rounded-full border border-gray-300 flex items-center justify-center">
            <span className="text-gray-400 text-xs">{String.fromCharCode(8226)}</span>
          </div>
        );
    }
  };
  
  // If the modal is not open, don't render anything
  if (!isOpen) return null;
  
  // Render UI
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-[90%] max-h-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">CV Processing</h2>
          <button 
            onClick={() => onComplete(extractedData)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-grow overflow-hidden flex flex-col md:flex-row">
          {processingStep === "initial-scan" ? (
            <div className="flex items-center justify-center w-full p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <h3 className="text-xl font-medium text-gray-800">Processing Your CV</h3>
                <p className="text-sm text-gray-500 mt-2">Please wait while we analyze your document</p>
              </div>
            </div>
          ) : (
            <>
              {/* Left Side - CV Data Extraction */}
              <div 
                ref={scanningContainerRef}
                className="w-full md:w-1/2 border-r border-gray-200 overflow-auto p-6"
              >
                <h2 className="text-xl font-semibold mb-4">Processing Your CV</h2>
                
                {/* Progress Bar */}
                <div className="h-2 w-full bg-gray-100 rounded-full mb-2">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-500 mb-6">{Math.round(progress)}% Complete</p>
                
                {/* Scanning Sections */}
                <div className="space-y-3">
                  {scanSections.map((section) => (
                    <div 
                      key={section.id}
                      ref={el => sectionRefs.current[section.id] = el} 
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div 
                        className={`p-3 flex justify-between items-center cursor-pointer ${
                          section.status === "scanning" ? "bg-blue-50" : ""
                        }`}
                        onClick={() => toggleSectionExpanded(section.id)}
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(section.status)}
                          <span className={`font-medium ${section.status === "scanning" ? "text-blue-600" : ""}`}>
                            {section.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          {section.status === "scanning" && (
                            <span className="text-blue-600 text-sm mr-2">Scanning...</span>
                          )}
                          <svg
                            className={`h-5 w-5 text-gray-400 transform transition-transform ${
                              section.expanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      
                      {section.expanded && (
                        <div className="p-3 border-t border-gray-200 bg-gray-50">
                          <div className="space-y-3">
                            {section.items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {item.status === "pending" ? (
                                    <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                                  ) : item.status === "scanning" ? (
                                    <div className="animate-pulse h-2 w-2 rounded-full bg-blue-500"></div>
                                  ) : (
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                  )}
                                  <span className="text-gray-700">{item.label}</span>
                                </div>
                                <div className="text-gray-900 font-medium max-w-[60%] truncate">
                                  {item.value === null ? (
                                    <span className="text-gray-400">...</span>
                                  ) : (
                                    item.value
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Information Box */}
                <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">What's happening?</h3>
                  <p className="text-sm text-gray-700">
                    We're using AI to extract and organize information from your CV. This process is automated and takes about a minute to complete.
                  </p>
                </div>
              </div>
              
              {/* Right Side - CV Preview */}
              <div 
                ref={previewContainerRef} 
                className="w-full md:w-1/2 bg-gray-50 overflow-auto p-6"
              >
                <h2 className="text-xl font-semibold mb-4">CV Preview</h2>
                
                {Object.keys(extractedData).length === 0 ? (
                  <div className="h-80 flex items-center justify-center text-center">
                    <div>
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-500">Preview will appear as data is extracted</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white shadow-sm rounded-lg p-6">
                    {/* CV Header */}
                    <div ref={el => previewSectionRefs.current.header = el} className="border-b pb-4 mb-4">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {extractedData.personalInfo?.firstName || ''} {extractedData.personalInfo?.lastName || ''}
                      </h1>
                      
                      {extractedData.personalInfo?.professionalHeadline && (
                        <h2 className="text-lg text-gray-600 mb-3">{extractedData.personalInfo.professionalHeadline}</h2>
                      )}
                      
                      <div className="flex flex-wrap gap-3 text-sm mt-2">
                        {extractedData.personalInfo?.email && (
                          <div className="flex items-center gap-1">
                            <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>{extractedData.personalInfo.email}</span>
                          </div>
                        )}
                        
                        {extractedData.personalInfo?.phone && (
                          <div className="flex items-center gap-1">
                            <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{extractedData.personalInfo.phone}</span>
                          </div>
                        )}
                        
                        {extractedData.personalInfo?.location && (
                          <div className="flex items-center gap-1">
                            <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{extractedData.personalInfo.location}{extractedData.personalInfo.country ? `, ${extractedData.personalInfo.country}` : ''}</span>
                          </div>
                        )}
                        
                        {extractedData.personalInfo?.website && (
                          <div className="flex items-center gap-1">
                            <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            <span>{extractedData.personalInfo.website}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Summary */}
                    {extractedData.summary && (
                      <div ref={el => previewSectionRefs.current.summary = el} className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Professional Summary</h3>
                        <p className="text-gray-700">{extractedData.summary}</p>
                      </div>
                    )}
                    
                    {/* Work Experience */}
                    {extractedData.experience && extractedData.experience.length > 0 && (
                      <div ref={el => previewSectionRefs.current.experience = el} className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Work Experience</h3>
                        {extractedData.experience.map((job, index) => (
                          <div key={index} className="mb-3">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{job.position}</h4>
                              <div className="text-sm text-gray-500">
                                {job.startDate && formatDate(job.startDate)} - {job.isPresent ? 'Present' : job.endDate && formatDate(job.endDate)}
                              </div>
                            </div>
                            <div className="text-gray-600">{job.company}</div>
                            {job.description && <p className="text-sm mt-1 text-gray-600">{job.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Education */}
                    {extractedData.education && extractedData.education.length > 0 && (
                      <div ref={el => previewSectionRefs.current.education = el} className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Education</h3>
                        {extractedData.education.map((edu, index) => (
                          <div key={index} className="mb-3">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{edu.degree}</h4>
                              <div className="text-sm text-gray-500">
                                {edu.startDate && formatDate(edu.startDate)} - {edu.isPresent ? 'Present' : edu.endDate && formatDate(edu.endDate)}
                              </div>
                            </div>
                            <div className="text-gray-600">{edu.institution}</div>
                            {edu.description && <p className="text-sm mt-1 text-gray-600">{edu.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Skills */}
                    {extractedData.skills && extractedData.skills.length > 0 && (
                      <div ref={el => previewSectionRefs.current.skills = el} className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {extractedData.skills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Additional Information */}
                    <div ref={el => previewSectionRefs.current.additional = el}>
                      {/* Certifications */}
                      {extractedData.certifications && extractedData.certifications.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold mb-2">Certifications</h3>
                          <div className="space-y-2">
                            {extractedData.certifications.map((cert, index) => (
                              <div key={index} className="flex items-start">
                                <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <div>
                                  <div className="font-medium">{cert.name}</div>
                                  <div className="text-sm text-gray-600">
                                    {cert.issuer}{cert.date ? ` • ${formatDate(cert.date)}` : ''}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Languages */}
                      {extractedData.languages && extractedData.languages.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold mb-2">Languages</h3>
                          <div className="space-y-2">
                            {extractedData.languages.map((lang, index) => (
                              <div key={index} className="flex items-center">
                                <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                </svg>
                                <span className="font-medium">{lang.language}</span>
                                <span className="text-sm text-gray-600 ml-2">({lang.proficiency})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Interests */}
                      {extractedData.additionalInfo?.interests && (
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold mb-2">Interests</h3>
                          <p className="text-gray-700">{extractedData.additionalInfo.interests}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* Footer with Continue button */}
        <div className="border-t border-gray-200 p-4 flex justify-end">
          {processingStep !== "initial-scan" && (
            <button
              onClick={() => onComplete(extractedData)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              disabled={progress < 100}
            >
              {progress < 100 ? 'Processing...' : 'Continue'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVScanningPreview; 