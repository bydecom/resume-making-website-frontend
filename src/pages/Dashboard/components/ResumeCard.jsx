import React from "react";
import { MoreVertical, FileText, Edit, Eye, Download } from "lucide-react";

const ResumeCard = ({ resume, openPreview, toggleMenu, activeMenuId }) => {
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

  const iconColor = resume.color ? 
    (typeof resume.color === 'string' && resume.color.startsWith('bg-') ? 
      getIconColor(extractColor(resume.color)) : 
      getIconColor(resume.color)) : 
    "text-gray-400";

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden group hover:shadow-lg transition-all duration-200">
      <div className="p-5 flex items-start justify-between border-b border-gray-100">
        <div className="flex-1 min-w-0">
          {/* Truncate title to one line */}
          <h3 className="font-semibold text-lg text-gray-800 truncate" title={resume.title}>
            {resume.title}
          </h3>
          
          {/* Truncate company name or role if present */}
          {resume.company && (
            <p className="text-gray-600 truncate" title={resume.company}>
              {resume.company}
            </p>
          )}
          {resume.role && !resume.company && (
            <p className="text-gray-600 truncate" title={resume.role}>
              {resume.role}
            </p>
          )}
          
          <p className="text-sm text-gray-500 mt-1 truncate" title={`Last edited: ${resume.lastEdited}`}>
            Last edited: {resume.lastEdited}
          </p>

          {/* Resume Score */}
          <div className="mt-3 flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <span className="font-bold text-blue-600">{resume.score}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">Resume Score</div>
              <div className="text-xs text-gray-500 truncate">
                {resume.score >= 90
                  ? "Excellent"
                  : resume.score >= 80
                    ? "Very Good"
                    : resume.score >= 70
                      ? "Good"
                      : resume.score >= 60
                        ? "Average"
                        : "Needs Improvement"}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="truncate">Completion</span>
              <span>{resume.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${resume.progress}%` }}></div>
            </div>
          </div>
        </div>
        <div className="relative ml-2">
          <button 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => toggleMenu && toggleMenu(resume.id)}
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
            <span className="sr-only">More options</span>
          </button>
        </div>
      </div>
      
      <div className="h-48 bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors relative">
        <FileText className={`h-20 w-20 ${iconColor} transition-colors`} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Overlay with Preview button on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button 
            className="px-4 py-2 bg-white text-gray-800 rounded-md font-medium hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-md"
            onClick={() => openPreview && openPreview(resume)}
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
        </div>

        {/* Completion Indicator */}
        {resume.progress < 100 && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
            In Progress
          </div>
        )}
        {resume.progress === 100 && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Complete
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <div className="text-sm text-gray-500 truncate">
          {resume.pages || 1} {(resume.pages || 1) === 1 ? 'page' : 'pages'} · {resume.fileSize || "200 KB"}
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded hover:bg-gray-200 transition-colors" title="Edit">
            <Edit className="h-4 w-4 text-gray-600" />
          </button>
          <button className="p-2 rounded hover:bg-gray-200 transition-colors" title="Download">
            <Download className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard; 