import React, { useState } from 'react';
import { FileText, Edit, Eye } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import CVPreview from '../../../NewCV/components/CVPreview';
import { getDefaultTemplate } from '../../../../templates';

const ReviewCVStep = ({ cvData, isLoading, onSelect, initialCV }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPreview, setShowPreview] = useState(false);
  const [previewCV, setPreviewCV] = useState(null);

  // Helper function to determine score rating text
  const getScoreRating = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Average";
    return "Needs Improvement";
  };

  const openPreview = (cv) => {
    setPreviewCV({
      personalInfo: cv.personalInfo || {},
      summary: cv.summary || '',
      experience: cv.experience || [],
      education: cv.education || [],
      skills: cv.skills || [],
      projects: cv.projects || [],
      certifications: cv.certifications || [],
      languages: cv.languages || [],
      template: cv.template || { id: getDefaultTemplate().id }
    });
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewCV(null);
  };

  const handleEditCV = (cvId) => {
    window.hideHeader = true;
    navigate(`/edit-cv/${cvId}`, {
      state: { 
        returnPath: '/new-resume',
        // Lưu lại state hiện tại của trang new-resume để khi quay lại
        previousState: {
          selectedCV: initialCV,
          currentStep: location.state?.currentStep || 1
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!cvData.cvs || cvData.cvs.length === 0) {
    return (
      <div className="text-center p-8">
        <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No CV Found</h3>
        <p className="text-gray-500 mb-6">Please create a CV first before creating a resume.</p>
        <a 
          href="/new-cv"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Create New CV
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cvData.cvs.map((cv) => (
          <div key={cv._id} className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
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
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${cv.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-48 bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors relative">
              <FileText className="h-20 w-20 text-blue-500 transition-colors" />
              
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

            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCV(cv._id)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit CV
                </button>
                <button
                  onClick={() => onSelect(cv)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {showPreview && previewCV && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto m-4">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg">CV Preview</h3>
              <button 
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <CVPreview formData={previewCV} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCVStep;  