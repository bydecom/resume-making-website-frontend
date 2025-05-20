/**
 * taskMap.js
 * Maps user intents to handler functions for the AI assistant
 */
import axiosInstance from '../../../utils/axios';
// Example handlers for different intents
const handleGreeting = (data) => {
  return {
    response: `Hello! I'm your AI assistant. How can I help you with your resume-building journey today?`,
    actions: []
  };
};

const handleHelp = (data) => {
    return {
      response: `Hello! I'm your AI assistant. I can help you build a professional resume!`,
      actions: [{
        type: 'SUGGEST_OPTIONS',
        options: ['Resume Format', 'Work Experience', 'Skills Section', 'Education Section']
      }]
    };
  };

const handleResumeHelp = (data) => {
  return {
    response: "I can help you build a professional resume! What specific part do you need help with? I can guide you on format, content, or specific sections.",
    actions: [
      {
        type: 'SUGGEST_OPTIONS',
        options: ['Resume Format', 'Work Experience', 'Skills Section', 'Education Section']
      }
    ]
  };
};

const handleCoverLetterHelp = (data) => {
  return {
    response: "Cover letters are crucial to make a good impression. Would you like tips on structure, content, or customization for specific jobs?",
    actions: [
      {
        type: 'SUGGEST_OPTIONS',
        options: ['Cover Letter Structure', 'Cover Letter Examples', 'Customization Tips']
      }
    ]
  };
};

const handleSkillsSection = (data) => {
  return {
    response: "For your skills section, focus on relevant, specific skills for the job you're applying to. Include both hard skills (technical abilities) and soft skills (interpersonal traits). Would you like examples?",
    actions: [
      {
        type: 'SHOW_EXAMPLES',
        exampleType: 'skills'
      }
    ]
  };
};

const handleWorkExperience = (data) => {
  return {
    response: "When writing your work experience, use action verbs and focus on achievements rather than responsibilities. Quantify results when possible (e.g., 'Increased sales by 20%'). Need more specific help?",
    actions: []
  };
};

const handleEducationSection = (data) => {
  return {
    response: "For your education section, include your degree, institution, graduation date, and relevant coursework. Recent graduates should place education near the top, while experienced professionals can place it after work experience.",
    actions: []
  };
};

const handleResumeReview = (data) => {
  // This would normally connect to a backend service
  return {
    response: "I'd be happy to review your resume! Please upload your current resume as a PDF, and I'll provide feedback on its structure, content, and formatting.",
    actions: [
      {
        type: 'REQUEST_PDF_UPLOAD'
      }
    ]
  };
};

const handleJobSearchTips = (data) => {
  return {
    response: "Finding the right job takes strategy. Would you like tips on job search platforms, networking, or preparing for interviews?",
    actions: [
      {
        type: 'SUGGEST_OPTIONS',
        options: ['Job Platforms', 'Networking Tips', 'Interview Preparation']
      }
    ]
  };
};

const handleInterviewPrep = (data) => {
  return {
    response: "Preparing for interviews is crucial. Research the company, practice common questions, and prepare examples that highlight your achievements. Would you like some common interview questions?",
    actions: [
      {
        type: 'SHOW_EXAMPLES',
        exampleType: 'interview_questions'
      }
    ]
  };
};

const handleResumeTemplates = (data) => {
  return {
    response: "Here are some of our popular resume templates. You can browse and select one to get started.",
    actions: [
      {
        type: 'SHOW_TEMPLATES',
        templates: [
          {
            id: 'minimalist',
            name: 'Minimalist',
            description: 'A clean and minimalist template.',
            thumbnailName: 'minimalist'
          },
          {
            id: 'modern',
            name: 'Modern',
            description: 'Contemporary and professional design.',
            thumbnailName: 'modern'
          },
          {
            id: 'professional-blue',
            name: 'Professional Blue',
            description: 'Classic blue professional theme.',
            thumbnailName: 'professional-blue'
          },
          {
            id: 'professional-cv',
            name: 'Professional CV',
            description: 'Traditional CV format.',
            thumbnailName: 'professional-cv'
          }
        ],
        link: '/templates'
      }
    ]
  };
};

const handleFallback = (data) => {
  return {
    response: "I'm not sure I understand. Could you rephrase that or select one of these common topics?",
    actions: [
      {
        type: 'SUGGEST_OPTIONS',
        options: ['Resume Help', 'Cover Letter', 'Job Search', 'Interview Prep']
      }
    ]
  };
};

const handleThankYou = (data) => {
  return {
    response: "You're welcome! Is there anything else I can help you with today?",
    actions: []
  };
};

const handleGoodbye = (data) => {
  return {
    response: "Thank you for chatting with me today. Good luck with your resume and job search! Feel free to return anytime you need assistance.",
    actions: []
  };
};

// Intent to handler mapping
const taskMap = {
  'greeting': handleGreeting,
  'resume_help': handleResumeHelp,
  'cover_letter': handleCoverLetterHelp,
  'skills_section': handleSkillsSection,
  'help': handleHelp,
  'work_experience': handleWorkExperience,
  'education_section': handleEducationSection,
  'resume_review': handleResumeReview,
  'job_search': handleJobSearchTips,
  'interview_prep': handleInterviewPrep,
  'resume_templates': handleResumeTemplates,
  'thank_you': handleThankYou,
  'goodbye': handleGoodbye,
  'fallback': handleFallback
};

// Function to process user input based on detected intent
export const processIntent = (intent, data = {}) => {
  // Get the appropriate handler or fallback to default
  const handler = taskMap[intent] || taskMap.fallback;
  
  // Execute the handler with the provided data
  return handler(data);
};

// Function to analyze user message and detect intent
// This is a simplified version - in production, you'd use NLP on the backend
export const detectIntent = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Check for template display requests
  if (lowerMessage.match(/show template|templates|resume template|cv template|see template|view template|browse template|template gallery/)) {
    return 'resume_templates';
  }
  
  // Check for PDF upload request specifically
  if (lowerMessage === 'pdf' || 
      lowerMessage.includes('upload pdf') || 
      lowerMessage.includes('import pdf') || 
      lowerMessage.includes('upload a pdf') ||
      lowerMessage.includes('submit pdf') ||
      lowerMessage.includes('upload resume') ||
      lowerMessage.includes('upload my resume') ||
      lowerMessage.includes('upload cv')) {
    return 'resume_review';
  }
  
  // Simple keyword matching for intent detection
  if (lowerMessage.match(/hello|hi|hey|greetings/)) {
    return 'greeting';
  } else if (lowerMessage.match(/resume help|create resume|build resume|improve resume/)) {
    return 'resume_help';
    
  } else if (lowerMessage.match(/resume help|create resume|build resume|improve resume/)) {
    return 'help';
  } else if (lowerMessage.match(/cover letter/)) {
    return 'cover_letter';
  } else if (lowerMessage.match(/skills section|skills list|add skills/)) {
    return 'skills_section';
  } else if (lowerMessage.match(/work experience|job history|employment|work history/)) {
    return 'work_experience';
  } else if (lowerMessage.match(/education|school|university|college|degree/)) {
    return 'education_section';
  } else if (lowerMessage.match(/review|check|analyze|feedback/)) {
    return 'resume_review';
  } else if (lowerMessage.match(/job search|find job|job hunting/)) {
    return 'job_search';
  } else if (lowerMessage.match(/interview|prepare interview/)) {
    return 'interview_prep';
  } else if (lowerMessage.match(/thank|thanks|appreciate/)) {
    return 'thank_you';
  } else if (lowerMessage.match(/bye|goodbye|see you|farewell/)) {
    return 'goodbye';
  } else {
    return 'fallback';
  }
};

// Function to get section-specific help for CV sections
export const getSectionHelp = (sectionName) => {
  switch(sectionName?.toLowerCase()) {
    case 'personal information':
      return {
        response: "For the Personal Information section, make sure to include your full name, professional title, email, phone number, and location. Consider adding links to your professional profiles like LinkedIn or a personal website if relevant.",
        actions: []
      };
    case 'career objective':
      return {
        response: "Your Career Objective should be concise (2-3 sentences) and highlight your professional goals, key skills, and what you can bring to a potential employer. Tailor it to the specific job you're applying for.",
        actions: []
      };
    case 'work experience':
      return {
        response: "In the Work Experience section, list your positions in reverse chronological order. For each role, include the company name, your title, dates of employment, and 3-5 bullet points highlighting your achievements. Use action verbs and quantify results when possible.",
        actions: []
      };
    case 'education':
      return {
        response: "For Education, include your degree, institution name, graduation date, and relevant coursework or achievements. List your most recent education first. If you're a recent graduate, place education before work experience.",
        actions: []
      };
    case 'skills':
      return {
        response: "In your Skills section, organize your abilities into categories (e.g., Technical Skills, Soft Skills). Be specific and relevant to the job you're applying for. Consider using a rating system or grouping by proficiency level.",
        actions: []
      };
    case 'certifications':
      return {
        response: "For Certifications, include the name of the certification, the issuing organization, date received, and expiration date if applicable. List the most relevant or recent certifications first.",
        actions: []
      };
    case 'projects':
      return {
        response: "When listing Projects, include the project name, your role, technologies used, and a brief description highlighting your contributions and the project's impact. Include links to the project if available.",
        actions: []
      };
    case 'languages':
      return {
        response: "In the Languages section, list each language along with your proficiency level (e.g., Native, Fluent, Intermediate, Basic). Start with the languages most relevant to the job you're applying for.",
        actions: []
      };
    case 'activities':
      return {
        response: "For Activities, include volunteer work, community involvement, or extracurricular activities that demonstrate valuable skills or personal qualities. Include your role, the organization, dates, and key contributions.",
        actions: []
      };
    case 'additional information':
      return {
        response: "In Additional Information, you can include relevant interests, achievements, publications, or other details that might strengthen your application but don't fit elsewhere in your CV.",
        actions: []
      };
    case 'summary':
      return {
        response: "The Summary section should provide a brief overview of your professional profile, highlighting your experience, key skills, and career achievements. Keep it concise (3-5 sentences) and impactful.",
        actions: []
      };
    case 'review':
      return {
        response: "When reviewing your CV, check for consistency in formatting, proper spelling and grammar, and ensure all information is accurate and up-to-date. Make sure your CV is tailored to the specific job you're applying for.",
        actions: []
      };
    default:
      return {
        response: "I can provide specific guidance on different sections of your CV. What particular section are you working on?",
        actions: []
      };
  }
};

// Thêm hàm xử lý API chatbot
export const processChatbotAPI = async (userMessage, taskName, currentData = {}) => {
  try {
    // Gọi API chatbot
    const response = await axiosInstance.post('/api/chatbot', {
      userMessage,
      taskName,
      currentData
    });
    
    // Trả về kết quả từ API
    return response.data;
  } catch (error) {
    console.error('Error calling chatbot API:', error);
    // Fallback nếu API lỗi
    return {
      response: "I'm sorry, I couldn't connect to the server. Please try again later.",
      actions: []
    };
  }
};

// Cập nhật hàm processMessage để sử dụng API cho CV và Resume mode
export const processMessage = async (message, mode = 'global', currentStep = 1, currentData = {}) => {
  // Nếu là CV hoặc Resume mode, sử dụng API
  if (mode === 'cv' || mode === 'resume') {
    // Map currentStep sang taskName
    let taskName = '';
    const prefix = mode.toUpperCase(); // 'CV' hoặc 'RESUME'
    
    switch (currentStep) {
      case 1:
        taskName = `${prefix}_PERSONAL`;
        break;
      case 2:
        taskName = `${prefix}_OBJECTIVE`;
        break;
      case 3:
        taskName = `${prefix}_EXPERIENCE`;
        break;
      case 4:
        taskName = `${prefix}_EDUCATION`;
        break;
      case 5:
        taskName = `${prefix}_SKILLS`;
        break;
      case 6:
        taskName = `${prefix}_ADDITIONAL`;
        break;
      case 7:
        taskName = `${prefix}_SUMMARY`;
        break;
      case 8:
        taskName = `${prefix}_REVIEW`;
        break;
      default:
        taskName = `GENERAL`;
    }
    
    // Gọi API chatbot
    try {
      const apiResponse = await processChatbotAPI(message, taskName, currentData);
      return apiResponse;
    } catch (error) {
      console.error('Error in API processing:', error);
      
      // Fallback to local processing if API fails
      const intent = detectIntent(message);
      let response = processIntent(intent, { userMessage: message, mode });
      
      // Customize response based on current step
      const sectionName = getSectionNameFromStep(currentStep);
      if (sectionName) {
        const sectionHelp = getSectionHelp(sectionName);
        if (sectionHelp) {
          return sectionHelp;
        }
      }
      
      return response;
    }
  } else {
    // Xử lý local cho mode global
    const intent = detectIntent(message);
    let response = processIntent(intent, { userMessage: message, mode });
    return response;
  }
};

// Helper function to get section name from step
const getSectionNameFromStep = (step) => {
  switch (step) {
    case 1: return 'personal information';
    case 2: return 'career objective';
    case 3: return 'work experience';
    case 4: return 'education';
    case 5: return 'skills';
    case 6: return 'additional sections';
    case 7: return 'summary';
    case 8: return 'review';
    default: return '';
  }
};

export default {
  processIntent,
  detectIntent,
  processMessage,
  getSectionHelp,
  taskMap
}; 