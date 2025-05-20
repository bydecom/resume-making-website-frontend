import React from 'react';
import { X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import CVPreview from '../pages/NewCV/components/CVPreview';
import CVAssessment from './CVAssessment';

// Hàm tạo đánh giá CV dựa trên dữ liệu CV
const generateCVAssessment = (cvData) => {
  // Handle null or undefined data
  if (!cvData) {
    return {
      score: 0,
      strengths: ["No data available for assessment."],
      improvements: ["Please complete your profile information."],
      tips: ["Fill in your personal details to get started."],
    };
  }

  const assessment = {
    score: 0,
    strengths: [],
    improvements: [],
    tips: [],
  };

  // Tính điểm và tạo phản hồi
  let totalScore = 0;
  let totalFactors = 0;

  // Safely check for personalInfo
  const personalInfo = cvData.personalInfo || {};
  
  // Kiểm tra thông tin cá nhân
  const personalInfoFields = Object.keys(personalInfo).filter(key => 
    ['firstName', 'lastName', 'professionalHeadline', 'email', 'phone', 'location', 'country'].includes(key)
  );
  
  const filledFields = personalInfoFields.filter(key => personalInfo[key]);
  const personalInfoScore = personalInfoFields.length > 0 ? 
    filledFields.length / personalInfoFields.length : 0;
  
  totalScore += personalInfoScore;
  totalFactors++;

  // Kiểm tra summary
  if (cvData.summary && cvData.summary.length > 30) {
    totalScore += 1;
    assessment.strengths.push("Your summary provides a good overview of your professional background.");
  } else {
    assessment.improvements.push("Consider expanding your professional summary to highlight your key strengths.");
  }
  totalFactors++;

  // Kiểm tra education
  if (cvData.education && cvData.education.length > 0) {
    totalScore += 1;
    assessment.strengths.push("Your education section is well-documented.");
  } else {
    assessment.improvements.push("Add your educational background to strengthen your CV.");
  }
  totalFactors++;

  // Kiểm tra experience
  if (cvData.experience && cvData.experience.length > 0) {
    const hasDetailedExperience = cvData.experience.some((exp) => exp.description && exp.description.length > 50);
    if (hasDetailedExperience) {
      totalScore += 1;
      assessment.strengths.push("Your work experience is detailed and informative.");
    } else {
      totalScore += 0.5;
      assessment.improvements.push("Add more details to your work experience descriptions.");
    }
  } else {
    assessment.improvements.push("Add your work experience to make your CV more compelling.");
  }
  totalFactors++;

  // Kiểm tra skills - handle both array and string formats
  const skills = Array.isArray(cvData.skills) ? cvData.skills : [];
  if (skills.length >= 5) {
    totalScore += 1;
    assessment.strengths.push("You have a good range of skills listed.");
  } else if (skills.length > 0) {
    totalScore += 0.5;
    assessment.improvements.push("Consider adding more relevant skills to your profile.");
  } else {
    assessment.improvements.push("Add skills to showcase your technical and professional capabilities.");
  }
  totalFactors++;

  // Kiểm tra projects
  if (cvData.projects && cvData.projects.length > 0) {
    totalScore += 1;
    assessment.strengths.push("Including projects demonstrates practical application of your skills.");
  } else {
    assessment.improvements.push("Consider adding projects to showcase your practical experience.");
  }
  totalFactors++;

  // Tính điểm cuối cùng
  assessment.score = totalFactors > 0 ? Math.round((totalScore / totalFactors) * 100) : 0;

  // Thêm tips chung
  assessment.tips = [
    "Keep your CV concise and relevant to the job you're applying for.",
    "Use action verbs to describe your achievements and responsibilities.",
    "Quantify your achievements with numbers when possible.",
    "Proofread carefully to avoid spelling and grammar errors.",
    "Use a professional email address.",
    "Include relevant skills and certifications.",
    "Tailor your CV for each job application.",
  ];

  return assessment;
};

// Format date từ YYYY-MM sang Month YYYY
const formatDate = (dateString) => {
  if (!dateString) return "Present";

  const [year, month] = dateString.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const CVSaveConfirmation = ({ isOpen, onClose, onSave, cvData }) => {
  const location = useLocation();
  const isResume = location.pathname.includes('/resume/');
  const assessment = generateCVAssessment(cvData);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white flex-shrink-0 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Save Your {isResume ? 'Resume' : 'CV'}</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
            Save {isResume ? 'Resume' : 'CV'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Left Column - CV Assessment */}
          <div className="w-1/4 border-r bg-gray-50 p-6 overflow-y-auto">
            <CVAssessment assessment={assessment} />
          </div>

          {/* Right Column - Preview */}
          <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
            <div className="max-w-[850px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="cv-wrapper">
                <CVPreview formData={cvData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVSaveConfirmation; 