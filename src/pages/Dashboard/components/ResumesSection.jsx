import React, { useState } from "react";
import { Plus, MoreVertical, FileText, Download, Edit, Trash2, Eye, XCircle, Copy } from "lucide-react";
import ResumeCard from "./ResumeCard";

const ResumesSection = ({ resumeData }) => {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [previewResume, setPreviewResume] = useState(null);

  const toggleMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const openPreview = (resume) => {
    setPreviewResume(resume);
    setActiveMenuId(null);
  };

  const closePreview = () => {
    setPreviewResume(null);
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

  // Convert bg-blue-500 to blue for icon color
  const extractColor = (bgColor) => {
    if (bgColor.includes("blue")) return "blue";
    if (bgColor.includes("purple")) return "purple";
    return "gray";
  };

  return (
    <section className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Your Resumes</h2>
          <p className="text-gray-500 mt-2">Manage and create professional resumes for your job applications</p>
        </div>
        <button className="px-4 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
          <Plus className="h-5 w-5" />
          Create New Resume
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumeData.map((resume) => (
          <div key={resume.id} className="relative">
            <ResumeCard 
              resume={resume} 
              openPreview={openPreview} 
              toggleMenu={toggleMenu} 
              activeMenuId={activeMenuId} 
            />
            
            {activeMenuId === resume.id && (
              <div className="absolute top-7 right-7 z-10">
                <div className="w-48 bg-white rounded-md shadow-lg border border-gray-200">
                  <div className="py-1">
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => openPreview(resume)}
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
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
              </div>
            )}
          </div>
        ))}
      </div>

      {previewResume && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Resume Preview: {previewResume.title}</h3>
              <button 
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={closePreview}
              >
                <XCircle className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="p-8">
              <div className="aspect-[1/1.4] bg-gray-100 rounded flex flex-col items-center justify-center">
                <FileText className={`h-24 w-24 ${getIconColor(extractColor(previewResume.color || ""))} mb-4`} />
                <div className="text-center">
                  <h4 className="font-bold text-lg">{previewResume.title}</h4>
                  <p className="text-gray-600">{previewResume.role || "No role specified"}</p>
                  <p className="text-sm text-gray-500 mt-2">{previewResume.pages || 1} pages · {previewResume.fileSize || "200 KB"}</p>
                  
                  {/* Resume Score */}
                  {previewResume.score && (
                    <div className="mt-4 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="font-bold text-blue-600">{previewResume.score}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-left">Resume Score</div>
                        <div className="text-xs text-gray-500 text-left">
                          {previewResume.score >= 90
                            ? "Excellent"
                            : previewResume.score >= 80
                              ? "Very Good"
                              : previewResume.score >= 70
                                ? "Good"
                                : previewResume.score >= 60
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
      {resumeData.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No resumes created yet</h3>
          <p className="mt-2 text-gray-500">Create your first professional resume to get started</p>
          <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 inline-flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Resume
          </button>
        </div>
      )}
    </section>
  );
};

export default ResumesSection; 