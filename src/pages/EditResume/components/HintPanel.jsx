import React from 'react';
import { motion } from 'framer-motion';
import { FiInfo } from 'react-icons/fi';

const HintPanel = ({ currentStep, currentAdditionalSection, tips }) => {
  console.log('Tips received:', tips);
  
  // Xác định nội dung gợi ý dựa trên bước hiện tại và section phụ (nếu có)
  const getHints = () => {
    // If we have job-specific tips and we're in the relevant section, show those tips
    if (tips?.data) {
      const currentTips = (() => {
        switch (currentStep) {
          case 1: // Personal Information
            return tips.data.personalInformationTips?.tips || [];
          case 2: // Career Objective
            return tips.data.summaryTips?.tips || [];
          case 3: // Work Experience
            return tips.data.experienceTips?.tips || [];
          case 4: // Education
            return tips.data.educationTips?.tips || [];
          case 5: // Skills
            return tips.data.skillTips?.tips || [];
          case 6: // Additional Sections
            if (currentAdditionalSection) {
              switch (currentAdditionalSection) {
                case 'certifications':
                  return tips.data.certificationTips?.tips || [];
                case 'projects':
                  return tips.data.projectTips?.tips || [];
                case 'languages':
                  return tips.data.languagesTips?.tips || [];
                case 'activities':
                  return tips.data.activitiesTips?.tips || [];
                case 'additionalInfo':
                  return tips.data.additionalInformationTips?.tips || [];
                case 'customFields':
                  // customFieldsTips.tips is a string, so wrap it in an array
                  return typeof tips.data.customFieldsTips?.tips === 'string' 
                    ? [tips.data.customFieldsTips.tips] 
                    : [];
                default:
                  return [];
              }
            }
            return [];
          case 7: // Review
            return [];
          default:
            return [];
        }
      })();

      return currentTips.length > 0 ? currentTips : getDefaultHints();
    }

    return getDefaultHints();
  };

  const getDefaultHints = () => {
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
            'Add any relevant achievements or awards',
            'Include publications or research work if applicable',
            'List professional memberships or affiliations'
          ];
        case 'customFields':
          return [
            'Use custom fields to add unique sections that showcase your strengths',
            'Keep the information relevant to your target job',
            'Structure the content clearly and concisely'
          ];
        default:
          return [];
      }
    }
    
    // Nếu không, hiển thị gợi ý cho bước chính
    switch (currentStep) {
      case 1: // Personal Information
        return [
          'Use a professional email address',
          'Include your LinkedIn profile if available',
          'Make sure your contact information is up-to-date',
          'Consider adding a professional headline that matches your target role'
        ];
      case 2: // Career Objective
        return [
          'Keep it concise and focused on your career goals',
          'Highlight your most relevant skills and experience',
          'Tailor it to the specific job or industry',
          'Avoid generic statements; be specific about what you can offer'
        ];
      case 3: // Work Experience
        return [
          'List your experience in reverse chronological order',
          'Use action verbs to describe your achievements',
          'Quantify your achievements when possible',
          'Focus on relevant experience for your target role'
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
          'Make sure your Resume has a consistent format and style'
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

  // Show example if available
  const getExample = () => {
    if (!tips?.data) return null;
    const data = tips.data;

    switch (currentStep) {
      case 1: // Personal Information
        const personalExample = data.personalInformationTips?.example;
        if (personalExample) {
          return `${personalExample.name}\n${personalExample.email}\n${personalExample.phone}`;
        }
        return null;
      case 2: // Career Objective
        const summaryExample = data.summaryTips?.example;
        if (summaryExample) {
          return `${summaryExample.title}\n${summaryExample.description}`;
        }
        return null;
      case 3: // Work Experience
        const expExample = data.experienceTips?.example;
        if (expExample) {
          return `${expExample.title}\n${expExample.description}`;
        }
        return null;
      case 4: // Education
        return data.educationTips?.example;
      case 5: // Skills
        return data.skillTips?.example;
      case 6: // Additional Sections
        if (currentAdditionalSection) {
          switch (currentAdditionalSection) {
            case 'certifications':
              return data.certificationTips?.example;
            case 'projects':
              return data.projectTips?.example;
            case 'languages':
              return data.languagesTips?.example;
            case 'activities':
              return data.activitiesTips?.example;
            case 'additionalInfo':
              const addInfo = data.additionalInformationTips?.example;
              if (addInfo) {
                const sections = [];
                if (addInfo.interests?.length > 0) {
                  sections.push('Interests:', ...addInfo.interests);
                }
                if (addInfo.achievements?.length > 0) {
                  sections.push('\nAchievements:', ...addInfo.achievements);
                }
                if (addInfo.publications?.length > 0) {
                  sections.push('\nPublications:', ...addInfo.publications);
                }
                return sections.join('\n');
              }
              return null;
            case 'customFields':
              return data.customFieldsTips?.example;
            default:
              return null;
          }
        }
        return null;
      default:
        return null;
    }
  };

  const example = getExample();

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex-shrink-0">Hints for {getCurrentStepName()}</h2>
      
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {/* Example Section */}
        {example && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Example:</h3>
            <p className="text-sm text-blue-700 whitespace-pre-line">{example}</p>
          </div>
        )}

        {/* Tips Section */}
        <div className="space-y-3">
          {hints.map((hint, index) => (
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
            These hints are tailored based on the job description you provided.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HintPanel; 