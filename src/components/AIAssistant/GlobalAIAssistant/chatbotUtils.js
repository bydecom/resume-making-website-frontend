/**
 * Chatbot utilities for handling responses and events
 */

// Initial welcome message when the chat first opens
export const getWelcomeMessage = () => {
  return "Hello! I\'m your AI assistant. How can I help you with your resume-building journey today?";
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

// Handle file attachment
export const handleFileAttachment = () => {
  // This would typically handle file selection, validation, and upload
  // For now, we'll just return a message
  return {
    success: false,
    message: "File attachment is not yet implemented."
  };
};

// Format and sanitize user input
export const sanitizeUserInput = (input) => {
  if (!input) return '';
  return input.trim();
};

// Utility to analyze uploaded PDF (placeholder)
export const analyzePdfResume = (file) => {
  return {
    success: true,
    analysis: {
      suggestions: [
        "Consider adding more quantifiable achievements",
        "Your skills section could be more detailed",
        "Make sure your contact information is prominent"
      ],
      strengths: [
        "Good overall structure",
        "Clear job titles and dates"
      ]
    }
  };
};

export default {
  getWelcomeMessage,
  getRandomPhrase,
  handleFileAttachment,
  chatbotPhrases,
  sanitizeUserInput,
  analyzePdfResume
}; 