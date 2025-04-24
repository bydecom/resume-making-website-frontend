import React from 'react';
import { motion } from 'framer-motion';
import { FiInfo } from 'react-icons/fi';
import { all } from 'axios';

const HintPanel = ({ currentStep, currentAdditionalSection }) => {
  // Xác định nội dung gợi ý dựa trên bước hiện tại và section phụ (nếu có)
  const getHints = () => {
    // Nếu đang ở bước Additional Sections và đang hiển thị một section phụ
    if (currentStep === 6 && currentAdditionalSection) {
      switch (currentAdditionalSection) {
        case 'certifications':
          return [
            'Include the name of the certification, issuing organization, and date received',
            'List certifications in reverse chronological order (most recent first)',
            'Include certification ID or verification link if available'
          ];
        case 'projects':
          return [
            'Include project name, your role, and technologies used',
            `Describe the project's purpose and your specific contributions`,
            'Include links to the project if available (GitHub, live demo, etc.)'
          ];
        case 'languages':
          return [
            'List languages you speak and your proficiency level',
            'Use clear proficiency indicators (Fluent, Intermediate, Basic)',
            'Consider including relevant language certifications'
          ];
        case 'activities':
          return [
            'Include volunteer work, extracurricular activities, or hobbies',
            'Focus on activities that demonstrate relevant skills',
            'Include your role and responsibilities in each activity'
          ];
        case 'additionalInfo':
          return [
            `Include any other relevant information that doesn't fit elsewhere`,
            'Consider adding publications, achievements, or references',
            `Keep this section concise and relevant to the job you're applying for`
          ];
        case 'customFields':
          return [
            'Create custom sections for unique aspects of your background',
            'Use clear section titles that employers will understand',
            'Focus on information that adds value to your application'
          ];
        default:
          return [];
      }
    }
    
    // Nếu không, hiển thị gợi ý dựa trên bước chính
    switch (currentStep) {
      case 1: // Personal Information
        return [
          'Use a professional email address',
          'Include your LinkedIn profile if you have one',
          'Make sure your phone number is correct',
          'Your location should include city and country/state, not your full address',
          'Use your full legal name as it appears on official documents'
        ];
      case 2: // Career Objective
        return [
          'Keep your objective concise and focused',
          'Tailor it to the specific job or industry',
          'Highlight your most relevant skills and experience'
        ];
      case 3: // Work Experience
        return [
          'List your work experience in reverse chronological order',
          'Use action verbs to describe your responsibilities',
          'Quantify your achievements when possible',
          'Focus on relevant experience for the job you are applying to'
        ];
      case 4: // Education
        return [
          'List your education in reverse chronological order',
          'Include degree name, institution, location, and graduation date',
          'Add relevant coursework, honors, or academic achievements',
          'For recent graduates, education should be more detailed than for experienced professionals'
        ];
      case 5: // Skills
        return [
          'Include both technical and soft skills',
          'Prioritize skills mentioned in the job description',
          'Be honest about your proficiency level',
          'Consider grouping skills by category for better organization'
        ];
      case 6: // Additional Sections
        return [
          'Choose sections that are relevant to your target job',
          'You can always come back and add more sections later',
          'Focus on quality over quantity'
        ];
      case 7: // Summary
        return [
          'Keep your summary concise (3-5 sentences)',
          'Highlight your most impressive achievements',
          `Tailor your summary to the job you're applying for`,
          'Avoid using generic statements; be specific about what makes you unique'
        ];
      case 8: // Review
        return [
          'Check for spelling and grammar errors',
          'Ensure all information is accurate and up-to-date',
          'Make sure your CV has a consistent format and style'
        ];
      default:
        return [];
    }
  };

  const getCurrentStepName = () => {
    if (currentStep === 6 && currentAdditionalSection) {
      // Nếu đang ở bước Additional Sections và đang hiển thị một section phụ
      switch (currentAdditionalSection) {
        case 'certifications': return 'Certifications';
        case 'projects': return 'Projects';
        case 'languages': return 'Languages';
        case 'activities': return 'Activities';
        case 'additionalInfo': return 'Additional Information';
        case 'customFields': return 'Custom Fields';
        default: return 'Additional Section';
      }
    }
    
    // Nếu không, hiển thị tên bước chính
    switch (currentStep) {
      case 1: return 'Personal Information';
      case 2: return 'Career Objective';
      case 3: return 'Work Experience';
      case 4: return 'Education';
      case 5: return 'Skills';
      case 6: return 'Additional Sections';
      case 7: return 'Summary';
      case 8: return 'Review';
      default: return '';
    }
  };

  const hints = getHints();
  // Hiển thị tất cả gợi ý
  const displayHints = hints;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Hints for {getCurrentStepName()}</h2>
      
      <div className="space-y-3">
        {displayHints.map((hint, index) => (
          <motion.div 
            key={index}
            className="flex items-start"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.1 }}
          >
            <div className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5 mr-2 flex-shrink-0">
              {index + 1}
            </div>
            <p className="text-gray-600">{hint}</p>
          </motion.div>
        ))}
        
        {hints.length === 0 && (
          <p className="text-sm text-gray-500">No hints available for this step.</p>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 italic">
          These hints are designed to help you create a professional and effective CV that stands out to employers.
        </p>
      </div>
    </div>
  );
};

export default HintPanel; 