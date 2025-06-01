"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  CheckCircle,
  FileText,
  Briefcase,
  Award,
  Languages,
  User,
  ThumbsUp,
  AlertCircle,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  ClipboardList,
  Download,
  X,
  Edit
} from "lucide-react"
import { getTemplateById } from '../../templates'
import JobDescriptionDetails from './JobDescriptionDetails'

// Custom components
const CustomTooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false)
  const tooltipRef = useRef(null)

  return (
    <div className="relative inline-block">
      <div onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)} className="inline-block">
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className="absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
        >
          {content}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  )
}

const CustomBadge = ({ children, variant = "default", className = "" }) => {
  let badgeClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium "

  if (variant === "default") {
    badgeClasses += "bg-teal-100 text-teal-800 "
  } else if (variant === "outline") {
    badgeClasses += "border border-gray-200 text-gray-700 "
  } else if (variant === "destructive") {
    badgeClasses += "bg-red-100 text-red-800 "
  }

  return <span className={`${badgeClasses} ${className}`}>{children}</span>
}

const CustomButton = ({ children, variant = "default", size = "default", className = "", disabled = false, onClick }) => {
  let buttonClasses =
    "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500 disabled:opacity-50 disabled:pointer-events-none "

  if (variant === "default") {
    buttonClasses += "bg-teal-600 text-white hover:bg-teal-700 "
  } else if (variant === "outline") {
    buttonClasses += "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 "
  } else if (variant === "destructive") {
    buttonClasses += "bg-red-600 text-white hover:bg-red-700 "
  }

  if (size === "default") {
    buttonClasses += "h-10 px-4 py-2 rounded-md "
  } else if (size === "sm") {
    buttonClasses += "h-8 px-3 text-sm rounded-md "
  } else if (size === "lg") {
    buttonClasses += "h-12 px-6 rounded-md "
  } else if (size === "icon") {
    buttonClasses += "h-8 w-8 rounded-md "
  }

  return (
    <button className={`${buttonClasses} ${className}`} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

const CustomProgress = ({ value = 0, className = "" }) => {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
      <div
        className="h-full bg-teal-600 transition-all"
        style={{ width: `${value}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      ></div>
    </div>
  )
}

const ResumeReview = ({ resumeData, jobData, onClose, onEdit }) => {
  const [activeView, setActiveView] = useState("cv")
  const [evaluationTab, setEvaluationTab] = useState("overview")
  const [approvalStatus, setApprovalStatus] = useState("pending")
  const [showLeftPanel, setShowLeftPanel] = useState(true)
  const [showRightPanel, setShowRightPanel] = useState(true)

  // Get the actual resume data from the response structure
  const actualResumeData = resumeData?.data?.[0] || resumeData;

  // Add debug logs
  useEffect(() => {
    console.log("Resume Data:", actualResumeData);
    console.log("Matched Experience:", actualResumeData?.matchedExperience);
  }, [actualResumeData]);

  // Add effect to handle body class and scroll
  useEffect(() => {
    // Add class to body when modal is open
    document.body.classList.add('modal-open');
    
    // Cleanup function
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Get the appropriate template component
  const templateId = actualResumeData?.template?.id || 'professionalBlue';
  const Template = getTemplateById(templateId).component;

  const formatDate = (dateString) => {
    if (!dateString) {
      return ""; 
    }

    // 2. Thử tạo đối tượng Date
    const date = new Date(dateString);

    // 3. Kiểm tra xem đối tượng Date có hợp lệ không
    //    isNaN(date.getTime()) là cách phổ biến để kiểm tra "Invalid Date"
    //    Hoặc bạn có thể kiểm tra trực tiếp isNaN(date) trong một số môi trường JavaScript
    if (isNaN(date.getTime())) {
      // console.warn(`Invalid date string received by formatDate: "${dateString}"`); // Ghi log để debug nếu cần
      return ""; // Hoặc trả về chính dateString, hoặc "", "N/A"
    }

    // 4. Nếu hợp lệ, tiến hành định dạng
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" }).format(date);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0)}${lastName?.charAt(0)}`.toUpperCase()
  }

  const getSkillRelevanceColor = (relevance) => {
    if (relevance >= 70) return "bg-green-500"
    if (relevance >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getSkillRelevanceTextColor = (relevance) => {
    if (relevance >= 70) return "text-green-700"
    if (relevance >= 50) return "text-yellow-700"
    return "text-red-700"
  }

  const getSkillRelevanceBgColor = (relevance) => {
    if (relevance >= 70) return "bg-green-100"
    if (relevance >= 50) return "bg-yellow-100"
    return "bg-red-100"
  }

  const handleApprove = () => {
    setApprovalStatus("approved")
    // In a real app, you would send this to your API
    console.log("Resume approved")
  }

  const handleReject = () => {
    setApprovalStatus("rejected")
    // In a real app, you would send this to your API
    console.log("Resume rejected")
  }

  // Calculate overall match percentage
  const calculateOverallMatch = () => {
    if (!actualResumeData?.matchedSkills?.length) return 0
    const sum = actualResumeData.matchedSkills.reduce((acc, skill) => acc + skill.relevance, 0)
    return Math.round(sum / actualResumeData.matchedSkills.length)
  }

  const overallMatch = calculateOverallMatch()

  // Add handleEdit function
  const handleEdit = () => {
    if (onEdit && actualResumeData?._id) {
      onEdit(actualResumeData._id);
    }
  };

  return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Backdrop with higher z-index */}
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999]" onClick={onClose}></div>
        
        {/* Modal content with even higher z-index */}
        <div className="fixed inset-0 z-[10000] flex flex-col bg-gray-50">
        {/* Header */}
          <header className="bg-white border-b px-6 py-3">
            <div className="max-w-6xl mx-auto flex items-center justify-between w-full">
              {/* Left - User Info */}
              <div className="flex-1 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-medium">
                  {getInitials(actualResumeData?.personalInfo?.firstName, actualResumeData?.personalInfo?.lastName)}
                </div>
            <div>
              <h1 className="text-lg font-semibold">
                    {actualResumeData?.personalInfo?.firstName} {actualResumeData?.personalInfo?.lastName}
              </h1>
                  <p className="text-sm text-gray-500">{jobData?.title}</p>
            </div>
          </div>

              {/* Center - Tabs */}
          <div className="flex items-center gap-2">
                <button
              onClick={() => setActiveView("jd")}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                    activeView === "jd"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
            >
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">JD</span>
                </button>
                <button
              onClick={() => setActiveView("evaluation")}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                    activeView === "evaluation"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Evaluation</span>
                </button>
                {/* <button
                  onClick={() => setActiveView("cv")}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                    activeView === "cv"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Template</span>
                </button> */}
          </div>

              {/* Right - Actions */}
              <div className="flex-1 flex items-center justify-end gap-2">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Edit className="h-5 w-5" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <X className="h-5 w-5" />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
              </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left panel - CV */}
          {(showLeftPanel || !showRightPanel) && (
            <div
              className={`${showRightPanel ? "w-1/2" : "w-full"} h-full overflow-auto border-r bg-white transition-all duration-300`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-teal-600" />
                    Resume
                  </h2>
                    <CustomBadge variant="outline" className="text-xs">
                      {actualResumeData?.template?.name || getTemplateById(templateId).name}
                    </CustomBadge>
                </div>

                  <div className="h-[calc(100vh-180px)] overflow-auto pr-4">
                    <Template formData={actualResumeData} />
                  </div>
                </div>
            </div>
          )}

          {/* Right panel - JD or Evaluation */}
          {(showRightPanel || !showLeftPanel) && (
            <div
              className={`${showLeftPanel ? "w-1/2" : "w-full"} h-full overflow-auto bg-white transition-all duration-300`}
            >
              {activeView === "jd" ? (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-teal-600" />
                      Job Description
                    </h2>
                      <CustomBadge>{jobData?.employmentType}</CustomBadge>
                  </div>

                    <div className="h-[calc(100vh-180px)] overflow-auto pr-4">
                      <JobDescriptionDetails jobData={jobData} />
                    </div>
                </div>
                ) : activeView === "evaluation" ? (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-teal-600" />
                      Evaluation
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Overall Match</span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSkillRelevanceBgColor(
                            overallMatch
                          )} ${getSkillRelevanceTextColor(overallMatch)}`}
                      >
                        {overallMatch}%
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex space-x-1 border-b">
                        <button
                          onClick={() => setEvaluationTab("overview")}
                          className={`px-4 py-2 text-sm font-medium ${
                            evaluationTab === "overview"
                              ? "border-b-2 border-teal-600 text-teal-600"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          Overview
                        </button>
                        <button
                          onClick={() => setEvaluationTab("skills")}
                          className={`px-4 py-2 text-sm font-medium ${
                            evaluationTab === "skills"
                              ? "border-b-2 border-teal-600 text-teal-600"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          Skills
                        </button>
                        <button
                          onClick={() => setEvaluationTab("details")}
                          className={`px-4 py-2 text-sm font-medium ${
                            evaluationTab === "details"
                              ? "border-b-2 border-teal-600 text-teal-600"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          Details
                        </button>
                    </div>
                  </div>

                    <div className="h-[calc(100vh-230px)] overflow-auto pr-4">
                      {evaluationTab === "overview" && (
                        <div className="space-y-6">
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                              <ThumbsUp className="h-5 w-5 text-teal-600" />
                              <h3 className="text-lg font-medium">Match Level</h3>
                            </div>
                            <div className="space-y-6">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium">Overall</span>
                                  <span className="text-sm font-medium">{overallMatch}%</span>
                                </div>
                                <CustomProgress value={overallMatch} className={getSkillRelevanceColor(overallMatch)} />
                              </div>

                              {/* Education */}
                              {actualResumeData?.education?.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium mb-2">Education</h4>
                                  {actualResumeData.education.map((edu, index) => (
                                    <div key={index} className="mb-3">
                                      <div className="flex justify-between mb-1">
                                        <span className="text-sm">{edu.degree} - {edu.institution}</span>
                                        <span className="text-sm">{edu.relevance}%</span>
                                      </div>
                                      <CustomProgress value={edu.relevance} className={getSkillRelevanceColor(edu.relevance)} />
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Experience */}
                              {actualResumeData?.matchedExperience?.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium mb-2">Experience</h4>
                                  {actualResumeData.matchedExperience.map((exp, index) => (
                                    <div key={index} className="mb-3">
                                      <div className="flex justify-between mb-1">
                                        <span className="text-sm">{exp.position} - {exp.company}</span>
                                        <span className="text-sm">{exp.relevance}%</span>
                                      </div>
                                      <CustomProgress value={exp.relevance} className={getSkillRelevanceColor(exp.relevance)} />
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Skills */}
                              {actualResumeData?.matchedSkills?.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium mb-2">Skills</h4>
                                  {actualResumeData.matchedSkills.map((skill, index) => (
                                    <div key={index} className="mb-3">
                                      <div className="flex justify-between mb-1">
                                        <span className="text-sm">{skill.skill}</span>
                                        <span className="text-sm">{skill.relevance}%</span>
                                      </div>
                                      <CustomProgress value={skill.relevance} className={getSkillRelevanceColor(skill.relevance)} />
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Projects */}
                              {actualResumeData?.matchedProjects?.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium mb-2">Projects</h4>
                                  {actualResumeData.matchedProjects.map((project, index) => (
                                    <div key={index} className="mb-3">
                                      <div className="flex justify-between mb-1">
                                        <span className="text-sm">{project.title}</span>
                                        <span className="text-sm">{project.relevance}%</span>
                                      </div>
                                      <CustomProgress value={project.relevance} className={getSkillRelevanceColor(project.relevance)} />
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Certifications */}
                              {actualResumeData?.matchedCertifications?.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium mb-2">Certifications</h4>
                                  {actualResumeData.matchedCertifications.map((cert, index) => (
                                    <div key={index} className="mb-3">
                                      <div className="flex justify-between mb-1">
                                        <span className="text-sm">{cert.name}</span>
                                        <span className="text-sm">{cert.relevance}%</span>
                                      </div>
                                      <CustomProgress value={cert.relevance} className={getSkillRelevanceColor(cert.relevance)} />
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Languages */}
                              {actualResumeData?.matchedLanguages?.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium mb-2">Languages</h4>
                                  {actualResumeData.matchedLanguages.map((lang, index) => (
                                    <div key={index} className="mb-3">
                                      <div className="flex justify-between mb-1">
                                        <span className="text-sm">{lang.language} ({lang.proficiency})</span>
                                        <span className="text-sm">{lang.relevance}%</span>
                                      </div>
                                      <CustomProgress value={lang.relevance} className={getSkillRelevanceColor(lang.relevance)} />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {evaluationTab === "skills" && (
                        <div className="space-y-6">
                          {actualResumeData?.matchedSkills?.map((skill, index) => (
                            <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                                <div className="flex justify-between items-center mb-2">
                                  <h3 className="font-medium text-lg">{skill.skill}</h3>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSkillRelevanceBgColor(
                                    skill.relevance
                                  )} ${getSkillRelevanceTextColor(skill.relevance)}`}
                                  >
                                    {skill.relevance}%
                                </span>
                              </div>
                              <CustomProgress value={skill.relevance} className={getSkillRelevanceColor(skill.relevance)} />
                              <p className="text-sm text-gray-500 mt-4">{skill.comment}</p>
                                </div>
                          ))}
                        </div>
                      )}

{evaluationTab === "details" && (
                        <div className="space-y-6">
                          {/* Education Details */}
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                              <GraduationCap className="h-5 w-5 text-teal-600" />
                              <h3 className="text-lg font-medium">Education</h3>
                            </div>
                            {actualResumeData?.education?.map((edu, index) => (
                              <div key={index} className="mb-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">{edu.degree} - {edu.institution}</h4>
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSkillRelevanceBgColor(edu.relevance)} ${getSkillRelevanceTextColor(edu.relevance)}`}>
                                    {edu.relevance}%
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{edu.comment}</p>
                              </div>
                            ))}
                          </div>

                          {/* Experience Details */}
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                              <Briefcase className="h-5 w-5 text-teal-600" />
                              <h3 className="text-lg font-medium">Experience</h3>
                            </div>
                            {actualResumeData?.matchedExperience?.map((exp, index) => (
                              <div key={index} className="mb-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">{exp.position} - {exp.company}</h4>
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSkillRelevanceBgColor(exp.relevance)} ${getSkillRelevanceTextColor(exp.relevance)}`}>
                                    {exp.relevance}%
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{exp.comment}</p>
                              </div>
                            ))}
                          </div>

                          {/* Skills Details */}
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                              <CheckCircle className="h-5 w-5 text-teal-600" />
                              <h3 className="text-lg font-medium">Skills</h3>
                            </div>
                            {actualResumeData?.matchedSkills?.map((skill, index) => (
                              <div key={index} className="mb-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">{skill.skill}</h4>
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSkillRelevanceBgColor(skill.relevance)} ${getSkillRelevanceTextColor(skill.relevance)}`}>
                                    {skill.relevance}%
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{skill.comment}</p>
                              </div>
                            ))}
                          </div>

                          {/* Projects Details */}
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                              <FileText className="h-5 w-5 text-teal-600" />
                              <h3 className="text-lg font-medium">Projects</h3>
                            </div>
                            {actualResumeData?.matchedProjects?.map((project, index) => (
                              <div key={index} className="mb-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">{project.title}</h4>
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSkillRelevanceBgColor(project.relevance)} ${getSkillRelevanceTextColor(project.relevance)}`}>
                                    {project.relevance}%
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{project.comment}</p>
                              </div>
                            ))}
                          </div>

                          {/* Certifications Details */}
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                              <Award className="h-5 w-5 text-teal-600" />
                              <h3 className="text-lg font-medium">Certifications</h3>
                            </div>
                            {actualResumeData?.matchedCertifications?.map((cert, index) => (
                              <div key={index} className="mb-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">{cert.name}</h4>
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSkillRelevanceBgColor(cert.relevance)} ${getSkillRelevanceTextColor(cert.relevance)}`}>
                                    {cert.relevance}%
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{cert.comment}</p>
                              </div>
                            ))}
                          </div>

                          {/* Languages Details */}
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                              <Languages className="h-5 w-5 text-teal-600" />
                              <h3 className="text-lg font-medium">Languages</h3>
                            </div>
                            {actualResumeData?.matchedLanguages?.map((lang, index) => (
                              <div key={index} className="mb-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">{lang.language} ({lang.proficiency})</h4>
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSkillRelevanceBgColor(lang.relevance)} ${getSkillRelevanceTextColor(lang.relevance)}`}>
                                    {lang.relevance}%
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{lang.comment}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
                </div>
              )}
            </div>
        </div>
      </div>
  )
}

export default ResumeReview

// Add global styles for modal
const style = document.createElement('style');
style.textContent = `
  .modal-open {
    overflow: hidden !important;
  }
  .modal-open .scroll-button {
    display: none !important;
  }
`;
document.head.appendChild(style);
