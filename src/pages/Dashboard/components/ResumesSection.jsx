import React, { useState, useEffect } from "react";
import { Plus, FileText, XCircle } from "lucide-react";
import ResumeCard from "./ResumeCard";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import MatchedResumeTemplate from '../../../templates/MatchedResumeTemplate';

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
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      const response = await axiosInstance.delete(`/api/resumes/${id}`);
      
      if (response.data.success) {
        // Refresh the resumes list after successful deletion
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
            />
          ))}
        </div>
      )}

      {/* Preview Modal using MatchedResumeTemplate */}
      {previewResume && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="font-semibold text-lg">Resume Preview</h3>
              <button 
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={closePreview}
              >
                <XCircle className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="p-8">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <MatchedResumeTemplate formData={previewResume} />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  onClick={closePreview}
                >
                  Close
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => handleEdit(previewResume._id)}
                >
                  Edit Resume
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