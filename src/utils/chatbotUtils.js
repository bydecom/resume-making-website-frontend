/**
 * Chatbot utilities for handling responses and events
 */

// Initial welcome message when the chat first opens
export const getWelcomeMessage = () => {
  return "Hello! I\'m your AI assistant. How can I help you with your resume-building journey today?";
};

// Check if the user wants to upload a PDF
export const isPdfUploadRequest = (userInput) => {
  const input = userInput.toLowerCase().trim();
  return input === 'pdf' || 
         input.includes('upload pdf') || 
         input.includes('import pdf') || 
         input.includes('upload a pdf') ||
         input.includes('submit pdf') ||
         input.includes('upload resume') ||
         input.includes('upload my resume') ||
         input.includes('upload cv');
};

// Get AI response based on user input
export const getAIResponse = (userInput) => {
  const input = userInput.toLowerCase();
  
  // Check for PDF upload request
  if (isPdfUploadRequest(userInput)) {
    return "You can upload your PDF resume here. I'll analyze it and provide feedback. Click the upload area below or drag and drop your file.";
  }
  
  // Simple response logic based on keywords
  if (input.includes('resume') || input.includes('cv')) {
    return "I can help you build a professional resume! Would you like some tips on optimizing your resume, or help with a specific section like work experience or skills?";
  } else if (input.includes('cover letter')) {
    return "Cover letters are a great way to introduce yourself to employers. Make sure your cover letter complements your resume and addresses the job requirements specifically.";
  } else if (input.includes('job') || input.includes('interview')) {
    return "Preparing for interviews is crucial. Research the company, practice common questions, and make sure to highlight your achievements that match the job description.";
  } else if (input.includes('thank')) {
    return "You\'re welcome! I\'m here to help with any other questions you might have about resume building or job applications.";
  } else if (input.includes('hello') || input.includes('hi')) {
    return "Hello there! How can I assist you with your resume or job search today?";
  } else if (input.includes('template') || input.includes('design')) {
    return "We offer a variety of professional resume templates. Choose one that matches the culture of the company you\'re applying to. For conservative industries, use a traditional template. For creative roles, you can use more modern designs.";
  } else if (input.includes('skill') || input.includes('skills')) {
    return "When adding skills to your resume, focus on relevant ones for the job. Use specific technical skills (like \'JavaScript\' or \'Data Analysis\') rather than vague terms. Prioritize the most important skills first.";
  } else if (input.includes('experience') || input.includes('work')) {
    return "For work experience, focus on achievements rather than duties. Use action verbs and quantify results when possible (e.g., \'Increased sales by 20%\'). List your most recent positions first.";
  } else if (input.includes('education')) {
    return "In the education section, include your degree, institution name, and graduation date. If you\'re a recent graduate, you might want to include relevant coursework or academic achievements.";
  } else if (input.includes('summary') || input.includes('profile')) {
    return "A good resume summary highlights your most relevant skills and experience in 2-3 sentences. Tailor it to each job application and include keywords from the job description.";
  } else {
    return "That\'s an interesting question. I\'m designed to help with resume building, cover letters, and job applications. Could you provide more details about what you\'re looking for?";
  }
};

// Process a new message from the user and return the AI response
export const processUserMessage = (message, callback) => {
  if (!message || message.trim() === '') return null;
  
  // In a real application, you might want to send the message to a backend API
  // For now, we'll just simulate a delay and return a response
  setTimeout(() => {
    const response = getAIResponse(message);
    if (callback) {
      callback(response);
    }
    return response;
  }, 1000);
};

// Handle file attachment
export const handleFileAttachment = () => {
  // This would typically handle file selection, validation, and upload
  // For now, we'll just return a message
  return {
    success: false,
    message: "File attachment is not yet implemented."
  };
};

// Common chatbot phrases for different situations
export const chatbotPhrases = {
  greeting: [
    "Hello! How can I assist you today?",
    "Hi there! What can I help you with?",
    "Welcome! How can I support your resume-building journey?"
  ],
  fallback: [
    "I\'m not sure I understand. Could you rephrase that?",
    "I\'m still learning. Can you provide more details?",
    "I didn\'t quite catch that. Can you explain what you need help with?"
  ],
  thankYou: [
    "You\'re welcome! Is there anything else I can help with?",
    "Happy to help! Any other questions?",
    "My pleasure! Do you need assistance with anything else?"
  ],
  closing: [
    "Thank you for chatting with me today. Feel free to return if you need more help!",
    "It was nice helping you. Come back anytime!",
    "I hope I was able to assist you. Have a great day!"
  ]
};

// Get a random phrase from a category
export const getRandomPhrase = (category) => {
  const phrases = chatbotPhrases[category];
  if (!phrases || phrases.length === 0) return "";
  
  const randomIndex = Math.floor(Math.random() * phrases.length);
  return phrases[randomIndex];
};

export default {
  getWelcomeMessage,
  getAIResponse,
  processUserMessage,
  handleFileAttachment,
  getRandomPhrase,
  chatbotPhrases
}; 