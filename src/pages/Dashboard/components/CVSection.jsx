import React, { useState } from "react";
import { Plus, MoreVertical, FileText, Download, Edit, Trash2, Eye, XCircle, Copy } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import CreateCVModal from '../../../components/CreateCVModal';

const CVSection = () => {
  const navigate = useNavigate();

  // Sample data for demonstration
  const sampleCVs = [
    {
      id: 1,
      title: "Professional Resume",
      role: "Software Engineer",
      lastEdited: "Today at 2:45 PM",
      pages: 2,
      fileSize: "245 KB",
      status: "Active",
      color: "blue",
      score: 92,
      progress: 100
    },
    {
      id: 2,
      title: "Creative CV",
      role: "UX Designer",
      lastEdited: "Yesterday",
      pages: 1,
      fileSize: "198 KB",
      status: "Active",
      color: "purple",
      score: 85,
      progress: 100
    },
    {
      id: 3,
      title: "Academic CV",
      role: "Research Assistant",
      lastEdited: "Jan 15, 2025",
      pages: 3,
      fileSize: "320 KB",
      status: "Draft",
      color: "gray",
      score: 68,
      progress: 75
    }
  ];

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [previewCV, setPreviewCV] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalKey, setCreateModalKey] = useState(0);

  const toggleMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const openPreview = (cv) => {
    setPreviewCV(cv);
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
    window.hideHeader = true;
    navigate(`/edit-cv/${cvId}`);
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

  return (
    <section className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Your CV Collection</h2>
          <p className="text-gray-500 mt-2">Manage and create professional resumes for your job applications</p>
        </div>
        <button
          onClick={handleCreateNewCV}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create New CV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleCVs.map((cv) => (
          <div key={cv.id} className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden group hover:shadow-lg transition-all duration-200">
            <div className="p-5 flex items-start justify-between border-b border-gray-100">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800">{cv.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Last edited: {cv.lastEdited}</p>

                {/* Resume Score */}
                <div className="mt-3 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="font-bold text-blue-600">{cv.score}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Resume Score</div>
                    <div className="text-xs text-gray-500">
                      {cv.score >= 90
                        ? "Excellent"
                        : cv.score >= 80
                          ? "Very Good"
                          : cv.score >= 70
                            ? "Good"
                            : cv.score >= 60
                              ? "Average"
                              : "Needs Improvement"}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Completion</span>
                    <span>{cv.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${cv.progress}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => toggleMenu(cv.id)}
                >
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                  <span className="sr-only">More options</span>
                </button>
                
                {activeMenuId === cv.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => openPreview(cv)}
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2" onClick={() => handleEditCV(cv.id)}>
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
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="h-48 bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors relative">
              <FileText className={`h-20 w-20 ${getIconColor(cv.color)} transition-colors`} />
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
              {cv.progress < 100 && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  In Progress
                </div>
              )}
              {cv.progress === 100 && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Complete
                </div>
              )}
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {cv.pages} {cv.pages === 1 ? 'page' : 'pages'} · {cv.fileSize}
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded hover:bg-gray-200 transition-colors" title="Edit" onClick={() => handleEditCV(cv.id)}>
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
    
      {previewCV && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg">CV Preview: {previewCV.title}</h3>
              <button 
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={closePreview}
              >
                <XCircle className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="p-8">
              <div className="aspect-[1/1.4] bg-gray-100 rounded flex flex-col items-center justify-center">
                <FileText className={`h-24 w-24 ${getIconColor(previewCV.color)} mb-4`} />
                <div className="text-center">
                  <h4 className="font-bold text-lg">{previewCV.title}</h4>
                  <p className="text-gray-600">{previewCV.role}</p>
                  <p className="text-sm text-gray-500 mt-2">{previewCV.pages} pages · {previewCV.fileSize}</p>
                  
                  {/* Resume Score */}
                  {previewCV.score && (
                    <div className="mt-4 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="font-bold text-blue-600">{previewCV.score}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-left">Resume Score</div>
                        <div className="text-xs text-gray-500 text-left">
                          {previewCV.score >= 90
                            ? "Excellent"
                            : previewCV.score >= 80
                              ? "Very Good"
                              : previewCV.score >= 70
                                ? "Good"
                                : previewCV.score >= 60
                                  ? "Average"
                                  : "Needs Improvement"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  onClick={closePreview}
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state if needed */}
      {sampleCVs.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No CVs created yet</h3>
          <p className="mt-2 text-gray-500">Create your first professional CV to get started</p>
          <button 
            onClick={handleCreateNewCV}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create New CV
          </button>
        </div>
      )}

      <CreateCVModal 
        key={createModalKey}
        isOpen={showCreateModal} 
        onClose={handleCloseCreateModal} 
      />
    </section>
  );
};

export default CVSection; 