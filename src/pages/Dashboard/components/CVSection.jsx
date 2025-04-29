import React, { useState } from "react";
import { Plus, MoreVertical, FileText, Download, Edit, Trash2, Eye, XCircle, Copy } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import CreateCVModal from '../../../components/CreateCVModal';
import CVPreviewModal from '../../../components/CVPreviewModal';
import ReusableCVHeader from '../../../components/ReusableCVHeader';
import { getDefaultTemplate } from '../../../templates';
import axiosInstance from '../../../utils/axios';

const CVSection = ({ cvData, isLoading, onEditCV, onDeleteCV, setCvData }) => {
  const navigate = useNavigate();

  // Use cvData.cvs if available, otherwise use sample data
  const cvList = cvData.cvs || [];

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewCV, setPreviewCV] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalKey, setCreateModalKey] = useState(0);
  const [selectedCVId, setSelectedCVId] = useState(null);

  const toggleMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const openPreview = (cv) => {
    // Create a format compatible with CVPreview component
    const previewData = {
      personalInfo: cv.personalInfo || {},
      summary: cv.summary || '',
      experience: cv.experience || [],
      education: cv.education || [],
      skills: cv.skills || [],
      projects: cv.projects || [],
      certifications: cv.certifications || [],
      languages: cv.languages || [],
      template: cv.template || { id: getDefaultTemplate().id }
    };
    
    setPreviewCV(previewData);
    setShowPreviewModal(true);
    setActiveMenuId(null);
    setSelectedCVId(cv._id || cv.id);
  };

  const handleApplyTemplate = async (templateId) => {
    if (!selectedCVId) return;
    try {
      // Gọi API cập nhật template cho CV
      await axiosInstance.put(`/api/cv/${selectedCVId}`, {
        template: { id: templateId }
      });
      // Cập nhật lại state local của danh sách CV
      if (typeof setCvData === 'function') {
        setCvData(prev => ({
          ...prev,
          cvs: prev.cvs.map(cv =>
            (cv._id || cv.id) === selectedCVId
              ? { ...cv, template: { id: templateId } }
              : cv
          )
        }));
      }
      // Cập nhật previewCV để modal hiển thị đúng template mới
      setPreviewCV(prev => ({ ...prev, template: { id: templateId } }));
      setShowPreviewModal(false);
    } catch (error) {
      console.error('Update template failed', error);
    }
  };

  const closePreview = () => {
    setShowPreviewModal(false);
    setPreviewCV(null);
  };

  const handleCreateNewCV = () => {
    setCreateModalKey(prev => prev + 1);
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleEditCV = (cvId) => {
    // Tìm CV cần edit từ danh sách
    const cvToEdit = cvList.find(cv => cv._id === cvId || cv.id === cvId);
    if (!cvToEdit) {
      console.error('CV not found:', cvId);
      return;
    }

    try {
      // Chuẩn bị dữ liệu để chuyển sang EditCV
      const cvData = {
        personalInfo: {
          firstName: cvToEdit.personalInfo?.firstName || '',
          lastName: cvToEdit.personalInfo?.lastName || '',
          email: cvToEdit.personalInfo?.email || '',
          phone: cvToEdit.personalInfo?.phone || '',
          location: cvToEdit.personalInfo?.location || '',
          country: cvToEdit.personalInfo?.country || '',
          professionalHeadline: cvToEdit.personalInfo?.professionalHeadline || '',
          website: cvToEdit.personalInfo?.website || '',
          linkedin: cvToEdit.personalInfo?.linkedin || '',
          github: cvToEdit.personalInfo?.github || '',
          twitter: cvToEdit.personalInfo?.twitter || '',
          facebook: cvToEdit.personalInfo?.facebook || '',
          instagram: cvToEdit.personalInfo?.instagram || '',
          youtube: cvToEdit.personalInfo?.youtube || '',
          tiktok: cvToEdit.personalInfo?.tiktok || '',
          other: cvToEdit.personalInfo?.other || ''
        },
        summary: cvToEdit.summary || '',
        experience: (cvToEdit.experience || []).map(exp => ({
          position: exp.position || '',
          company: exp.company || '',
          location: exp.location || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          isPresent: exp.isPresent || false,
          description: exp.description || ''
        })),
        education: (cvToEdit.education || []).map(edu => ({
          degree: edu.degree || '',
          institution: edu.institution || '',
          location: edu.location || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          isPresent: edu.isPresent || false,
          description: edu.description || ''
        })),
        skills: cvToEdit.skills || [],
        projects: (cvToEdit.projects || []).map(proj => ({
          title: proj.title || '',
          description: proj.description || '',
          url: proj.url || '',
          startDate: proj.startDate || '',
          endDate: proj.endDate || '',
          isPresent: proj.isPresent || false
        })),
        certifications: (cvToEdit.certifications || []).map(cert => ({
          name: cert.name || '',
          issuer: cert.issuer || '',
          issueDate: cert.issueDate || '',
          expiryDate: cert.expiryDate || '',
          credentialId: cert.credentialId || '',
          credentialUrl: cert.credentialUrl || ''
        })),
        languages: (cvToEdit.languages || []).map(lang => ({
          language: lang.language || '',
          proficiency: lang.proficiency || ''
        })),
        template: cvToEdit.template || { id: getDefaultTemplate().id },
        // Thêm các trường cần thiết cho việc update
        _id: cvToEdit._id || cvToEdit.id,
        name: cvToEdit.name || 'Untitled CV',
        progress: cvToEdit.progress || 0,
        score: cvToEdit.score || 0
      };

      // Lưu dữ liệu vào localStorage để EditCV có thể truy cập
      localStorage.setItem('editingCV', JSON.stringify(cvData));

      // Chuyển hướng đến trang EditCV
      window.hideHeader = true;
      navigate(`/edit-cv/${cvToEdit._id || cvToEdit.id}`);
    } catch (error) {
      console.error('Error preparing CV data:', error);
      // Có thể thêm thông báo lỗi cho người dùng ở đây
    }
  };
  
  const handleDeleteCV = (cvId) => {
    if (onDeleteCV) {
      onDeleteCV(cvId);
    }
  };

  const getIconColor = (color) => {
    switch (color) {
      case "blue":
        return "text-blue-500";
      case "purple":
        return "text-purple-500";
      default:
        return "text-gray-400";
    }
  };

  // Function to determine score rating text
  const getScoreRating = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Average";
    return "Needs Improvement";
  };

  return (
    <section className="max-w-6xl mx-auto mb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Your CV</h2>
          <p className="text-gray-500 mt-2">Share the journey of your life — and we'll help you write the next chapter</p>
        </div>
      </div>  

      {/* Display loading skeleton if loading */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden animate-pulse">
              <div className="p-5 flex items-start justify-between border-b border-gray-100">
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  
                  <div className="mt-4 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2"></div>
                  </div>
                </div>
              </div>
              
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <div className="h-20 w-20 bg-gray-200 rounded"></div>
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : cvList.length === 0 ? (
        // Display empty state when no CVs
        <div className="bg-white rounded-lg border border-gray-200 shadow-md p-8 text-center">
          <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No CVs Yet</h3>
          <p className="text-gray-500 mb-6">You haven't shared your story with us. Let's create your first professional CV and get things rolling!</p>
          <button
            onClick={handleCreateNewCV}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your First CV
          </button>
        </div>
      ) : (
        // Display actual CV list
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {cvList.map((cv) => (
            <div key={cv._id || cv.id} className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden group hover:shadow-lg transition-all duration-200">
              <div className="p-5 flex items-start justify-between border-b border-gray-100">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">{cv.name || 'Untitled CV'}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {cv.personalInfo?.firstName} {cv.personalInfo?.lastName || ''}
                    {cv.personalInfo?.professionalHeadline && ` • ${cv.personalInfo.professionalHeadline}`}
                  </p>

                  {/* Resume Score */}
                  <div className="mt-3 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="font-bold text-blue-600">{cv.score || 0}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Resume Score</div>
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
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${cv.progress || 0}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <button 
                    className="rounded-full hover:bg-gray-100 transition-colors"
                    onClick={() => toggleMenu(cv._id || cv.id)}
                  >
                    <MoreVertical className="h-5 w-5 text-gray-500" />
                    <span className="sr-only">More options</span>
                  </button>
                  
                  {activeMenuId === (cv._id || cv.id) && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                        <button 
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => openPreview(cv)}
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </button>
                        <button 
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2" 
                          onClick={() => handleEditCV(cv._id || cv.id)}
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button 
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          onClick={() => handleDeleteCV(cv._id || cv.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="h-48 bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors relative">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-full max-w-xs">
                    <ReusableCVHeader data={cv} templateName={cv.template?.id || ''} />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Overlay with Preview button on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button 
                    className="px-4 py-2 bg-white text-gray-800 rounded-md font-medium hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-md"
                    onClick={() => openPreview(cv)}
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </button>
                </div>

                {/* Completion Indicator */}
                {(cv.progress || 0) < 100 && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    In Progress
                  </div>
                )}
                {(cv.progress || 0) === 100 && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Complete
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {cv.createdAt ? new Date(cv.createdAt).toLocaleDateString() : 'Recent'}
                </div>
                <div className="flex gap-2">
                  <button 
                    className="p-2 rounded hover:bg-gray-200 transition-colors" 
                    title="Edit"
                    onClick={() => handleEditCV(cv._id || cv.id)}
                  >
                    <Edit className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="p-2 rounded hover:bg-gray-200 transition-colors" title="Download">
                    <Download className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    
      {/* Preview Modal */}
      {showPreviewModal && previewCV && (
        <CVPreviewModal
          isOpen={showPreviewModal}
          onClose={handleApplyTemplate}
          formData={previewCV}
        />
      )}

      {/* Create CV Modal */}
      <CreateCVModal 
        key={createModalKey}
        isOpen={showCreateModal} 
        onClose={handleCloseCreateModal} 
      />
    </section>
  );
};

export default CVSection; 