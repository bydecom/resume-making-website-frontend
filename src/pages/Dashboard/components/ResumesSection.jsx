import React, { useState, useEffect } from "react";
import { Plus, FileText } from "lucide-react";
import ResumeCard from "./ResumeCard";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import ResumeReview from '../../../components/PreviewResume/ResumeReview';
import ResumeDownloadModal from '../../../components/ResumeDownloadModal';

const ResumesSection = () => {
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [resumeToDownload, setResumeToDownload] = useState(null);

  // Add effect to handle body scroll
  useEffect(() => {
    if (isReviewMode || isDownloadModalOpen) {
      // Disable scroll on body when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to re-enable scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isReviewMode, isDownloadModalOpen]);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.get('/api/resumes');
      
      if (response.data.success) {
        setResumes(response.data.data || []);
      } else {
        setError('Failed to fetch resumes');
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
      setError(err.response?.data?.message || 'Error loading resumes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const openPreview = async (resume) => {
    try {
      let jobDescriptionData = null;
      const hasMatchedData = resume.matchedSkills || resume.matchedExperience;

      if (resume.jobDescriptionId?._id) {
        try {
          const response = await axiosInstance.get(`/api/job-descriptions/${resume.jobDescriptionId._id}`);
          if (response.data.success || response.data.status === 'success') {
            jobDescriptionData = {
              _id: response.data.data._id,
              title: response.data.data.position,
              company: response.data.data.companyName,
              location: response.data.data.location?.[0],
              employmentType: response.data.data.employmentType,
              description: response.data.data.summary?.[0],
              requirements: response.data.data.requirements,
              preferredSkills: response.data.data.skillsRequired,
              department: response.data.data.department,
              experienceRequired: response.data.data.experienceRequired,
              benefits: response.data.data.benefits,
              salary: response.data.data.salary,
            };
          }
        } catch (error) {
          console.error('Error fetching job description:', error);
          if (resume.jobDescriptionId) {
            jobDescriptionData = {
              _id: resume.jobDescriptionId._id,
              title: resume.jobDescriptionId.position || "N/A",
            };
          }
        }
      }

      const structuredResume = {
        // === METADATA ===
        _id: resume._id,
        userId: resume.userId,
        cvId: resume.cvId,
        jobDescriptionId: resume.jobDescriptionId,
        name: resume.name,
        template: resume.template || resume.originalCV?.template || { id: 'professionalBlue', name: 'Professional Blue' },
        status: resume.status,
        roleApply: resume.roleApply,

        // === TEMPLATE DATA (LEFT PANEL) ===
        personalInfo: {
          ...(resume.personalInfo || resume.originalCV?.personalInfo),
          professionalHeadline: resume.roleApply ||
                              jobDescriptionData?.title ||
                              resume.personalInfo?.professionalHeadline ||
                              resume.originalCV?.personalInfo?.professionalHeadline ||
                              '',
        },
        summary: resume.summary || resume.originalCV?.summary || '',

        education: (resume.education || resume.originalCV?.education || []).map(edu => {
          const relevance = edu.relevance ?? (hasMatchedData ? 0 : 0);
          const comment = edu.comment || (hasMatchedData ? '' : '');
          return {
            _id: edu._id,
            degree: edu.degree || '',
            institution: edu.institution || edu.school || '',
            school: edu.school || edu.institution || '',
            startDate: edu.startDate || '',
            endDate: edu.endDate || '',
            description: edu.description || '',
            isPresent: edu.isPresent || false,
            relevance: relevance,
            comment: comment
          };
        }),

        experience: (resume.matchedExperience || resume.experience || resume.originalCV?.experience || []).map(exp => ({
          _id: exp._id,
          position: exp.title || exp.position || '',
          company: exp.company || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          description: exp.description || '',
          isPresent: exp.isPresent || false,
          location: exp.location || '',
        })),

        skills: resume.matchedSkills?.map(skillObj => skillObj.skill || '') || resume.skills || resume.originalCV?.skills || [],

        projects: (resume.matchedProjects || resume.projects || resume.originalCV?.projects || []).map(proj => ({
          _id: proj._id,
          title: proj.title || '',
          description: proj.description || '',
          url: proj.url || '',
          startDate: proj.startDate || '',
          endDate: proj.endDate || '',
          isPresent: proj.isPresent || false,
          role: proj.role || '',
        })),

        certifications: (resume.matchedCertifications || resume.certifications || resume.originalCV?.certifications || []).map(cert => ({
          _id: cert._id,
          name: cert.name || '',
          issuer: cert.issuer || '',
          issueDate: cert.date || cert.issueDate || '',
          credentialUrl: cert.url || cert.credentialUrl || '',
        })),

        languages: (resume.matchedLanguages || resume.languages || resume.originalCV?.languages || []).map(lang => ({
          _id: lang._id,
          language: lang.language || '',
          proficiency: lang.proficiency || '',
        })),

        additionalInfo: resume.additionalInfo || resume.originalCV?.additionalInfo || {},
        customFields: resume.customFields || resume.originalCV?.customFields || [],

        // === EVALUATION DATA (RIGHT PANEL) ===
        matchedSkills: (resume.matchedSkills || []).map(skill => ({
          _id: skill._id,
          skill: skill.skill || '',
          relevance: skill.relevance ?? 0,
          comment: skill.comment || ''
        })),

        matchedExperience: resume.matchedExperience ? resume.matchedExperience.map(exp => ({
          _id: exp._id,
          position: exp.position || exp.title || '',
          title: exp.title || exp.position || '',
          company: exp.company || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          description: exp.description || '',
          isPresent: exp.isPresent || false,
          location: exp.location || '',
          relevance: exp.relevance ?? 0,
          comment: exp.comment || ''
        })) : [],

        matchedProjects: resume.matchedProjects ? resume.matchedProjects.map(proj => ({
          _id: proj._id,
          title: proj.title || '',
          description: proj.description || '',
          url: proj.url || '',
          startDate: proj.startDate || '',
          endDate: proj.endDate || '',
          isPresent: proj.isPresent || false,
          role: proj.role || '',
          relevance: proj.relevance ?? 0,
          comment: proj.comment || ''
        })) : [],

        matchedCertifications: resume.matchedCertifications ? resume.matchedCertifications.map(cert => ({
          _id: cert._id,
          name: cert.name || '',
          issuer: cert.issuer || '',
          issueDate: cert.date || cert.issueDate || '',
          credentialUrl: cert.url || cert.credentialUrl || '',
          relevance: cert.relevance ?? 0,
          comment: cert.comment || ''
        })) : [],

        matchedLanguages: resume.matchedLanguages ? resume.matchedLanguages.map(lang => ({
          _id: lang._id,
          language: lang.language || '',
          proficiency: lang.proficiency || '',
          relevance: lang.relevance ?? 0,
          comment: lang.comment || ''
        })) : [],

        // === ORIGINAL CV DATA ===
        originalCV: resume.originalCV,
      };

      setSelectedResume(structuredResume);
      setJobData(jobDescriptionData);
      setIsReviewMode(true);
      setActiveMenuId(null);
    } catch (err) {
      console.error('Error preparing resume data:', err);
      const fallbackResume = {
        _id: resume._id,
        name: resume.name,
        template: resume.template || resume.originalCV?.template || { id: 'professionalBlue', name: 'Professional Blue' },
        personalInfo: resume.personalInfo || resume.originalCV?.personalInfo || {},
        education: (resume.education || resume.originalCV?.education || []).map(edu => ({
          ...edu,
          relevance: 0,
          comment: ''
        })),
        experience: resume.experience || resume.originalCV?.experience || [],
        skills: resume.skills || resume.originalCV?.skills || [],
        originalCV: resume.originalCV,
        matchedSkills: [],
        matchedExperience: [],
        matchedProjects: [],
        matchedCertifications: [],
        matchedLanguages: [],
      };
      setSelectedResume(fallbackResume);
      setJobData(null);
      setIsReviewMode(true);
      setActiveMenuId(null);
    }
  };

  const closePreview = () => {
    setIsReviewMode(false);
    setSelectedResume(null);
    setJobData(null);
  };

  const handleCreateNew = () => {
    navigate('/new-resume');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      const response = await axiosInstance.delete(`/api/resumes/${id}`);
      
      if (response.data.success) {
        fetchResumes();
        setActiveMenuId(null);
      } else {
        throw new Error(response.data.message || 'Failed to delete resume');
      }
    } catch (err) {
      console.error('Error deleting resume:', err);
      alert(err.response?.data?.message || 'Error deleting resume. Please try again.');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-resume/${id}`);
  };

  const handleDownloadResume = async (resume) => {
    try {
      // Standardize the resume data for download to match the CV data format
      // that templates expect to receive
      const standardizedResumeData = {
        personalInfo: {
          firstName: resume.personalInfo?.firstName || resume.originalCV?.personalInfo?.firstName || "",
          lastName: resume.personalInfo?.lastName || resume.originalCV?.personalInfo?.lastName || "",
          email: resume.personalInfo?.email || resume.originalCV?.personalInfo?.email || "",
          phone: resume.personalInfo?.phone || resume.originalCV?.personalInfo?.phone || "",
          location: resume.personalInfo?.location || resume.originalCV?.personalInfo?.location || "",
          country: resume.personalInfo?.country || resume.originalCV?.personalInfo?.country || "",
          professionalHeadline: resume.roleApply || // 1. Ưu tiên roleApply của Resume
                                resume.jobDescriptionId?.position || // 2. Sau đó đến position từ JD liên kết (nếu có)
                                resume.personalInfo?.professionalHeadline || // 3. Rồi mới đến headline chung của Resume
                                resume.originalCV?.personalInfo?.professionalHeadline || // 4. Cuối cùng là fallback về CV gốc
                                "", // Fallback cuối cùng nếu tất cả đều không có
          website: resume.personalInfo?.website || resume.originalCV?.personalInfo?.website || "",
          linkedin: resume.personalInfo?.linkedin || resume.originalCV?.personalInfo?.linkedin || "",
          github: resume.personalInfo?.github || resume.originalCV?.personalInfo?.github || "",
          twitter: resume.personalInfo?.twitter || resume.originalCV?.personalInfo?.twitter || "",
          facebook: resume.personalInfo?.facebook || resume.originalCV?.personalInfo?.facebook || "",
          instagram: resume.personalInfo?.instagram || resume.originalCV?.personalInfo?.instagram || "",
          youtube: resume.personalInfo?.youtube || resume.originalCV?.personalInfo?.youtube || "",
          tiktok: resume.personalInfo?.tiktok || resume.originalCV?.personalInfo?.tiktok || "",
          other: resume.personalInfo?.other || resume.originalCV?.personalInfo?.other || "",
        },
        summary: resume.summary || resume.originalCV?.summary || "",
        experience: (resume.matchedExperience || resume.experience || resume.originalCV?.experience || []).map((exp) => ({
          position: exp.position || exp.title || "",
          company: exp.company || "",
          location: exp.location || "",
          startDate: exp.startDate || "",
          endDate: exp.endDate || "",
          isPresent: exp.isPresent || false,
          description: exp.description || "",
        })),
        education: (resume.education || resume.originalCV?.education || []).map((edu) => ({
          degree: edu.degree || "",
          institution: edu.institution || edu.school || "",
          location: edu.location || "",
          startDate: edu.startDate || "",
          endDate: edu.endDate || "",
          isPresent: edu.isPresent || false,
          description: edu.description || "",
        })),
        skills: resume.matchedSkills?.map(skillObj => skillObj.skill || '') || resume.skills || resume.originalCV?.skills || [],
        projects: (resume.matchedProjects || resume.projects || resume.originalCV?.projects || []).map((proj) => ({
          title: proj.title || "",
          description: proj.description || "",
          url: proj.url || "",
          startDate: proj.startDate || "",
          endDate: proj.endDate || "",
          isPresent: proj.isPresent || false,
          role: proj.role || "",
        })),
        certifications: (resume.matchedCertifications || resume.certifications || resume.originalCV?.certifications || []).map((cert) => ({
          name: cert.name || "",
          issuer: cert.issuer || "",
          issueDate: cert.issueDate || cert.date || "",
          expiryDate: cert.expiryDate || "",
          credentialId: cert.credentialId || "",
          credentialUrl: cert.credentialUrl || cert.url || "",
        })),
        languages: (resume.matchedLanguages || resume.languages || resume.originalCV?.languages || []).map((lang) => ({
          language: lang.language || "",
          proficiency: lang.proficiency || "",
        })),
        template: resume.template || resume.originalCV?.template || { id: 'default' },
        
        // Additional metadata needed for the template
        _id: resume._id || resume.id,
        name: resume.name || `Resume for ${resume.personalInfo?.firstName || ''} ${resume.personalInfo?.lastName || ''}` || "Untitled Resume",
        progress: resume.progress || 0,
        score: resume.score || 0,
        roleApply: resume.roleApply || "",
      };

      // Set the standardized resume data and open the download modal
      setResumeToDownload(standardizedResumeData);
      setIsDownloadModalOpen(true);
    } catch (error) {
      console.error('Error preparing resume for download:', error);
      alert('Failed to prepare resume for download. Please try again.');
    }
  };

  const handleCloseDownloadModal = () => {
    setIsDownloadModalOpen(false);
    setResumeToDownload(null);
  };

  if (isLoading) {
    return (
      <section className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Your Resumes</h2>
            <p className="text-gray-500 mt-2">Manage and create professional resumes for your job applications</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden animate-pulse">
              <div className="p-5 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-48 bg-gray-100"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-red-800">Error loading resumes</h3>
          <p className="mt-2 text-red-600">{error}</p>
          <button 
            onClick={fetchResumes}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Your Resumes</h2>
            <p className="text-gray-500 mt-2">Manage and create professional resumes for your job applications</p>
          </div>
          <button 
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-5 w-5" />
            Create New Resume
          </button>
        </div>

        {resumes.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Resumes Yet</h3>
            <p className="text-gray-500 mb-6">Create your first professional resume tailored to your dream job!</p>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <ResumeCard 
                key={resume._id}
                resume={resume}
                openPreview={openPreview}
                toggleMenu={toggleMenu}
                activeMenuId={activeMenuId}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDownload={() => handleDownloadResume(resume)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Resume Review Modal */}
      {isReviewMode && selectedResume && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center min-h-screen">
          <div className="bg-white w-full h-full md:w-11/12 md:h-full rounded-lg shadow-xl relative overflow-hidden">
            <ResumeReview 
              resumeData={selectedResume} 
              jobData={jobData}
              onClose={closePreview}
            />
          </div>
        </div>
      )}

      {/* Resume Download Modal */}
      {isDownloadModalOpen && resumeToDownload && (
        <ResumeDownloadModal
          isOpen={isDownloadModalOpen}
          onClose={handleCloseDownloadModal}
          template={resumeToDownload.template}
          formData={resumeToDownload}
        />
      )}
    </>
  );
};

export default ResumesSection; 