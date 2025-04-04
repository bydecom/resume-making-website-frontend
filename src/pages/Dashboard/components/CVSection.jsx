import React, { useState } from "react";
import { Plus, MoreVertical, FileText, Download, Edit, Trash2, Eye, XCircle, Copy } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import CreateCVModal from '../../../components/CreateCVModal';
import CVPreview from '../../NewCV/components/CVPreview';
import { getDefaultTemplate } from '../../../templates';

const CVSection = ({ cvData, isLoading, onEditCV, onDeleteCV }) => {
  const navigate = useNavigate();

  // Use cvData.cvs if available, otherwise use sample data
  const cvList = cvData.cvs || [];

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [previewCV, setPreviewCV] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalKey, setCreateModalKey] = useState(0);

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
    setActiveMenuId(null);
  };

  const closePreview = () => {
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
    if (onEditCV) {
      onEditCV(cvId);
    } else {
      window.hideHeader = true;
      navigate(`/edit-cv/${cvId}`);
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
          <h2 className="text-3xl font-bold text-gray-800">Your CV Collection</h2>
          <p className="text-gray-500 mt-2">Manage and create professional resumes for your job applications</p>
        </div>
        <button
          onClick={handleCreateNewCV}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New CV
        </button>
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No CVs Found</h3>
          <p className="text-gray-500 mb-6">You haven't created any CVs yet. Get started by creating your first professional CV.</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvList.map((cv) => (
            <div key={cv._id || cv.id} className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden group hover:shadow-lg transition-all duration-200">
              <div className="p-5 flex items-start justify-between border-b border-gray-100">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">{cv.name || 'Untitled CV'}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {cv.personalInfo?.firstName} {cv.personalInfo?.lastName || ''}
                    {cv.personalInfo?.headline && ` • ${cv.personalInfo.headline}`}
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
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
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
                          <Copy className="h-4 w-4" />
                          Duplicate
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
                <FileText className="h-20 w-20 text-blue-500 transition-colors" />
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
    
      {previewCV && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-screen overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg">CV Preview</h3>
              <button 
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={closePreview}
              >
                <XCircle className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="p-8">
              <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                <div className="w-full max-h-[70vh] overflow-y-auto">
                  <CVPreview formData={previewCV} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <CreateCVModal 
        key={createModalKey}
        isOpen={showCreateModal} 
        onClose={handleCloseCreateModal} 
      />
    </section>
  );
};

export default CVSection; 