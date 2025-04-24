import React, { useState, useEffect } from "react";
import { Plus, MoreVertical, FileText, Download, Edit, Trash2, Eye, XCircle, Copy } from "lucide-react";
import ResumeCard from "./ResumeCard";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResumesSection = () => {
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [previewResume, setPreviewResume] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/resumes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
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

  const openPreview = (resume) => {
    setPreviewResume(resume);
    setActiveMenuId(null);
  };

  const closePreview = () => {
    setPreviewResume(null);
  };

  const handleCreateNew = () => {
    navigate('/new-resume');
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/resumes/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        // Refresh the resumes list after successful deletion
        fetchResumes();
      } else {
        throw new Error(response.data.message || 'Failed to delete resume');
      }
    } catch (err) {
      console.error('Error deleting resume:', err);
      // You might want to show an error toast here
      alert(err.response?.data?.message || 'Error deleting resume. Please try again.');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-resume/${id}`);
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
          <p className="text-gray-500 mb-6">You haven't shared your story with us. Let's create your first professional resume and get things rolling!</p>
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
            <div key={resume._id || resume.id} className="relative">
              <ResumeCard 
                resume={resume} 
                openPreview={openPreview} 
                toggleMenu={toggleMenu} 
                activeMenuId={activeMenuId} 
              />
              
              {activeMenuId === (resume._id || resume.id) && (
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
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => handleEdit(resume._id || resume.id)}
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
                        onClick={() => handleDelete(resume._id || resume.id)}
                      >
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
      )}

      {previewResume && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Resume Preview: {previewResume.name}</h3>
              <button 
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={closePreview}
              >
                <XCircle className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="p-8">
              <div className="aspect-[1/1.4] bg-gray-100 rounded flex flex-col items-center justify-center">
                <FileText className="h-24 w-24 text-blue-500 mb-4" />
                <div className="text-center">
                  <h4 className="font-bold text-lg">{previewResume.name}</h4>
                  <p className="text-gray-600">{previewResume.personalInfo?.professionalHeadline || "No headline specified"}</p>
                  
                  {/* Resume Score */}
                  <div className="mt-4 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="font-bold text-blue-600">
                        {Math.round((previewResume.matchedSkills?.reduce((acc, skill) => acc + skill.relevance, 0) / 
                          (previewResume.matchedSkills?.length || 1)) || 0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-left">Match Score</div>
                      <div className="text-xs text-gray-500 text-left">
                        Based on job requirements
                      </div>
                    </div>
                  </div>
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
    </section>
  );
};

export default ResumesSection; 