import React from 'react';
import { X } from 'lucide-react';

// Hàm tạo đánh giá CV dựa trên dữ liệu CV
const generateCVAssessment = (cvData) => {
  const assessment = {
    score: 0,
    strengths: [],
    improvements: [],
    tips: [],
  };

  // Tính điểm và tạo phản hồi
  let totalScore = 0;
  let totalFactors = 0;

  // Kiểm tra thông tin cá nhân
  const personalInfoFields = Object.keys(cvData.personalInfo || {}).filter(key => 
    ['firstName', 'lastName', 'email', 'phone', 'location', 'country'].includes(key)
  );
  const personalInfoScore =
    personalInfoFields.filter(key => cvData.personalInfo[key]).length / personalInfoFields.length;
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

  // Kiểm tra skills
  if (cvData.skills && cvData.skills.length >= 5) {
    totalScore += 1;
    assessment.strengths.push("You have a good range of skills listed.");
  } else if (cvData.skills && cvData.skills.length > 0) {
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
  assessment.score = Math.round((totalScore / totalFactors) * 100);

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
  const assessment = generateCVAssessment(cvData);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-auto">
      <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-hidden relative">
        {/* Header */}
        <div className="p-6 pb-2 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Save Your CV</h2>
            <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 pt-2">
          {/* Left Column - CV Assessment */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">CV Assessment</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span>Overall Score</span>
                  <span className="font-bold">{assessment.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      width: `${assessment.score}%`,
                      backgroundColor:
                        assessment.score >= 80 ? "#10b981" : assessment.score >= 60 ? "#f59e0b" : "#ef4444",
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="border-b">
                <div className="flex border-b">
                  <button className="px-4 py-2 border-b-2 border-blue-500 font-medium">Strengths</button>
                  <button className="px-4 py-2 text-gray-500 hover:text-gray-700">Improvements</button>
                  <button className="px-4 py-2 text-gray-500 hover:text-gray-700">Tips</button>
                </div>
                
                <div className="py-2 max-h-[300px] overflow-y-auto scrollable">
                  <ul className="space-y-2">
                    {assessment.strengths.length > 0 ? (
                      assessment.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span>{strength}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 italic">No strengths identified yet.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                Are you sure you want to save this CV? You can always edit it later.
              </p>
            </div>
          </div>

          {/* Middle and Right Columns - CV Preview */}
          <div className="md:col-span-2">
            <div className="border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-600 text-white p-6">
                <h2 className="text-3xl font-bold">
                  {cvData.personalInfo?.firstName} {cvData.personalInfo?.lastName}
                </h2>
                <p className="text-xl mt-1">{cvData.experience?.[0]?.title || "Professional"}</p>
                <div className="flex flex-wrap gap-3 mt-3 text-sm">
                  {cvData.personalInfo?.email && (
                    <div className="flex items-center">
                      <span className="mr-1">✉️</span>
                      <span>{cvData.personalInfo.email}</span>
                    </div>
                  )}
                  {cvData.personalInfo?.phone && (
                    <div className="flex items-center">
                      <span className="mr-1">📱</span>
                      <span>{cvData.personalInfo.phone}</span>
                    </div>
                  )}
                  {cvData.personalInfo?.location && (
                    <div className="flex items-center">
                      <span className="mr-1">📍</span>
                      <span>
                        {cvData.personalInfo.location}
                        {cvData.personalInfo.country && `, ${cvData.personalInfo.country}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-[400px] p-6 overflow-y-auto scrollable">
                {/* Summary Section */}
                {cvData.summary && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold border-b pb-1 mb-2">Summary</h3>
                    <p>{cvData.summary}</p>
                  </div>
                )}

                {/* Experience Section */}
                {cvData.experience && cvData.experience.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold border-b pb-1 mb-2">Experience</h3>
                    <div className="space-y-4">
                      {cvData.experience.map((exp, index) => (
                        <div key={index}>
                          <div className="flex justify-between">
                            <h4 className="font-semibold">{exp.title}</h4>
                            <span className="text-sm text-gray-600">
                              {formatDate(exp.startDate)} - {exp.isPresent ? "Present" : formatDate(exp.endDate)}
                            </span>
                          </div>
                          <p className="text-gray-700">{exp.company}</p>
                          {exp.description && <p className="mt-1 text-sm">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education Section */}
                {cvData.education && cvData.education.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold border-b pb-1 mb-2">Education</h3>
                    <div className="space-y-4">
                      {cvData.education.map((edu, index) => (
                        <div key={index}>
                          <div className="flex justify-between">
                            <h4 className="font-semibold">{edu.degree}</h4>
                            <span className="text-sm text-gray-600">
                              {formatDate(edu.startDate)} - {edu.isPresent ? "Present" : formatDate(edu.endDate)}
                            </span>
                          </div>
                          <p className="text-gray-700">{edu.school}</p>
                          {edu.description && <p className="mt-1 text-sm">{edu.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional sections would go here, similar to above */}
                
                <div className="text-center text-gray-500 text-xs mt-6">Created with Resume Builder</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 pt-2 border-t flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save CV
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVSaveConfirmation; 