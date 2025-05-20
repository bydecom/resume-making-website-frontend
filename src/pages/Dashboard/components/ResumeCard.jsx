import React from "react";
import { MoreVertical, FileText, Edit, Eye, Download, Trash2 } from "lucide-react";
import ReusableCVHeader from '../../../components/ReusableCVHeader';

const ResumeCard = ({ resume, openPreview, toggleMenu, activeMenuId, onEdit, onDelete, onDownload }) => {
  // Convert bg-blue-500 to blue for icon color
  const getIconColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    return "text-gray-400";
  };

  // Function to determine score rating text
  const getScoreRating = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Average";
    return "Needs Improvement";
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate completion percentage
  const calculateProgress = () => {
    let totalFields = 0;
    let completedFields = 0;

    // Check personal info
    if (resume.personalInfo) {
      const personalInfoFields = ['firstName', 'lastName', 'email', 'phone'];
      personalInfoFields.forEach(field => {
        totalFields++;
        if (resume.personalInfo[field]) completedFields++;
      });
    }

    // Check summary
    totalFields++;
    if (resume.summary) completedFields++;

    // Check experience
    totalFields++;
    if (resume.experience && resume.experience.length > 0) completedFields++;

    // Check education
    totalFields++;
    if (resume.education && resume.education.length > 0) completedFields++;

    // Check skills
    totalFields++;
    if (resume.skills && resume.skills.length > 0) completedFields++;

    // Check roleApply
    totalFields++;
    if (resume.roleApply) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  };

  const progress = resume.progress || calculateProgress();

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden group hover:shadow-lg transition-all duration-200">
      <div className="p-5 flex items-start justify-between border-b border-gray-100">
        <div className="flex-1 min-w-0">
          {/* Title and Basic Info */}
          <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
            {resume.name || `Resume for ${resume.personalInfo?.firstName} ${resume.personalInfo?.lastName}` || 'Untitled Resume'}
          </h3>
          <p className="text-sm text-gray-500 mt-1 truncate">
            {resume.roleApply || resume.jobDescription?.position || resume.personalInfo?.professionalHeadline || 'No position specified'}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {resume.company || resume.jobDescription?.companyName || (resume.experience && resume.experience[0]?.company) || 'No company specified'}
          </p>

          {/* Resume Score */}
          <div className="mt-3 flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <span className="font-bold text-blue-600">
                {Math.round((resume.matchedSkills?.reduce((acc, skill) => acc + skill.relevance, 0) / 
                  (resume.matchedSkills?.length || 1)) || 0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">Match Score</div>
              <div className="text-xs text-gray-500 truncate">
                {getScoreRating(resume.score || 0)}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="truncate">Completion</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  progress >= 80 ? 'bg-green-600' : progress >= 40 ? 'bg-blue-600' : 'bg-yellow-600'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Menu Button */}
        <div className="relative ml-2">
          <button 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => toggleMenu(resume._id)}
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>

          {/* Dropdown Menu */}
          {activeMenuId === resume._id && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
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
                  onClick={() => onEdit(resume._id)}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => onDownload(resume)}
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  onClick={() => onDelete(resume._id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div className="h-48 bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors relative">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full max-w-xs">
            <ReusableCVHeader data={resume} templateName={resume.template?.id || ''} />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button 
            className="px-4 py-2 bg-white text-gray-800 rounded-md font-medium hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-md"
            onClick={() => openPreview(resume)}
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
        </div>

        {/* Status Badge */}
        {(progress < 100) && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
            In Progress
          </div>
        )}
        {(progress === 100) && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Complete
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Created {formatDate(resume.createdAt)}
        </div>
        <div className="flex gap-2">
          <button 
            className="p-2 rounded hover:bg-gray-200 transition-colors" 
            title="Edit"
            onClick={() => onEdit(resume._id)}
          >
            <Edit className="h-4 w-4 text-gray-600" />
          </button>
          <button 
            className="p-2 rounded hover:bg-gray-200 transition-colors" 
            title="Download"
            onClick={() => onDownload(resume)}
          >
            <Download className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard; 