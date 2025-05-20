import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiRefreshCw, FiChevronDown, FiPaperclip } from 'react-icons/fi';
import { processMessage, detectIntent, getSectionHelp } from '../../../components/AIAssistant/GlobalAIAssistant/taskMap';
import { getWelcomeMessage, sanitizeUserInput } from '../../../components/AIAssistant/GlobalAIAssistant/chatbotUtils';
import axiosInstance from '../../../utils/axios';
import { toast } from 'react-toastify';

const AIAssistant = ({ currentStep, currentAdditionalSection, formData, preventAutoScroll, mode = 'resume' }) => {
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your AI assistant. I can help you create a professional CV. What questions do you have about the current section?", 
      isUser: false,
      isInitial: true // Đánh dấu tin nhắn ban đầu
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showNewMessageAlert, setShowNewMessageAlert] = useState(false);
  const [showPdfUpload, setShowPdfUpload] = useState(false);
  const [pendingPdfUploadRequest, setPendingPdfUploadRequest] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isNearBottomRef = useRef(true);
  const isFirstRenderRef = useRef(true);
  const hasUserInteractedRef = useRef(false); // Theo dõi xem người dùng đã tương tác chưa
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let welcomeMessage = '';
    if (mode === 'cv' || mode === 'resume') {
      const currentSectionName = getCurrentStepName();
      const sectionHelp = getSectionHelp(currentSectionName);
      welcomeMessage = `I see you're working on the ${currentSectionName} section. How can I help you with this section?`;
    } else {
      welcomeMessage = getWelcomeMessage();
    }
    setMessages([
      { 
        text: welcomeMessage, 
        isUser: false,
        isInitial: true
      }
    ]);
    setShowNewMessageAlert(false);
    isFirstRenderRef.current = true;
    hasUserInteractedRef.current = false;
  }, []);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto";
      // Set the height to scrollHeight with a max height
      const newHeight = Math.min(textareaRef.current.scrollHeight, 100);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [inputText]);

  // Effect to handle showing PDF upload interface after messages have been displayed
  useEffect(() => {
    if (pendingPdfUploadRequest && !isTyping) {
      // Messages have been displayed and bot is no longer typing
      setTimeout(() => {
        setShowPdfUpload(true);
        setPendingPdfUploadRequest(false);
        
        // Add small delay to ensure the PDF upload interface is rendered before scrolling
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }, 800); // Delay for better UX
    }
  }, [pendingPdfUploadRequest, isTyping, messages]);

  // Kiểm tra xem người dùng có đang ở gần cuối cuộc trò chuyện không
  const checkIfNearBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const scrollBottom = scrollHeight - scrollTop - clientHeight;
      isNearBottomRef.current = scrollBottom < 50; // Nếu cách đáy ít hơn 50px thì coi là gần đáy
    }
  };

  // Xử lý sự kiện scroll
  const handleScroll = (e) => {
    // Ngăn chặn sự kiện scroll lan truyền lên các phần tử cha
    e.stopPropagation();
    
    // Đánh dấu người dùng đã tương tác
    hasUserInteractedRef.current = true;
    
    checkIfNearBottom();
    // Ẩn thông báo nếu người dùng đã scroll xuống gần cuối
    if (isNearBottomRef.current) {
      setShowNewMessageAlert(false);
    }
  };

  // Thêm event listener cho sự kiện scroll
  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', handleScroll);
      return () => {
        messagesContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // Xử lý scroll khi có tin nhắn mới
  useEffect(() => {
    // Nếu là lần render đầu tiên, không hiển thị thông báo
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    
    if (messagesEndRef.current && messagesContainerRef.current) {
      // Chỉ xử lý khi có tin nhắn mới và tin nhắn đó là từ AI (không phải từ người dùng)
      if (messages.length > 0 && !messages[messages.length - 1].isUser) {
        const latestMessage = messages[messages.length - 1];
        
        // Không hiển thị thông báo cho tin nhắn ban đầu
        if (latestMessage.isInitial) {
          return;
        }
        
        // Chỉ hiển thị thông báo nếu người dùng đã tương tác
        if (hasUserInteractedRef.current) {
          if (isNearBottomRef.current && !preventAutoScroll) {
            // Nếu người dùng đang ở gần cuối, tự động scroll xuống
            messagesContainerRef.current.scrollTo({
              top: messagesContainerRef.current.scrollHeight,
              behavior: 'smooth'
            });
          } else {
            // Nếu không ở gần cuối, hiển thị thông báo
            setShowNewMessageAlert(true);
          }
        } else {
          // Nếu người dùng chưa tương tác, tự động scroll xuống
          messagesContainerRef.current.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [messages, preventAutoScroll]);

  const scrollToBottom = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setShowNewMessageAlert(false);
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

  const handleChatbotActions = (actions) => {
    if (!actions || actions.length === 0) return;
    
    actions.forEach(action => {
      switch (action.type) {
        case 'REQUEST_PDF_UPLOAD':
          setPendingPdfUploadRequest(true);
          break;
        case 'SUGGEST_OPTIONS':
          // Options are already displayed in the message
          break;
        case 'SHOW_EXAMPLES':
          // Examples are already displayed in the message
          break;
        case 'SHOW_TEMPLATES':
          // Templates would be handled differently based on mode
          break;
        case 'NAVIGATE_TO':
          // Navigation would be handled differently based on mode
          break;
        default:
          console.log('Unknown action type:', action.type);
      }
    });
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
    
    // Mark user interaction
    hasUserInteractedRef.current = true;
    
    // Add user message
    const newMessages = [...messages, { text: inputText, isUser: true }];
    setMessages(newMessages);
    
    // Store the message text before clearing input
    const messageText = inputText;
    
    // Clear input and reset textarea
    setInputText('');
    if (textareaRef.current) {
      setTimeout(() => {
        textareaRef.current.style.height = "40px";
      }, 0);
    }
    
    // Hide PDF upload interface if shown
    if (showPdfUpload) {
      setShowPdfUpload(false);
    }
    
    // Scroll to bottom after sending user message
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Get current section name
      const currentSectionName = getCurrentStepName();

      // Map currentStep to taskName
      let taskName = 'RESUME_GENERAL';
      switch (currentStep) {
        case 1: taskName = 'RESUME_PERSONAL'; break;
        case 2: taskName = 'RESUME_OBJECTIVE'; break;
        case 3: taskName = 'RESUME_EXPERIENCE'; break;
        case 4: taskName = 'RESUME_EDUCATION'; break;
        case 5: taskName = 'RESUME_SKILLS'; break;
        case 6: taskName = 'RESUME_ADDITIONAL'; break;
        case 7: taskName = 'RESUME_SUMMARY'; break;
        case 8: taskName = 'RESUME_REVIEW'; break;
        default: taskName = 'RESUME_GENERAL';
      }
      if (currentStep === 6 && currentAdditionalSection) {
        taskName = `RESUME_ADDITIONAL_${currentAdditionalSection.toUpperCase()}`;
      }

      // Chuẩn bị dữ liệu gửi đi
      const requestBody = {
        userMessage: inputText,
        taskName,
        currentData: {
          personalInfo: formData.personalInfo,
          summary: formData.summary,
          experience: formData.experience,
          matchedExperience: formData.matchedExperience,
          education: formData.education,
          skills: formData.skills,
          matchedSkills: formData.matchedSkills,
          projects: formData.projects,
          matchedProjects: formData.matchedProjects,
          certifications: formData.certifications,
          matchedCertifications: formData.matchedCertifications,
          languages: formData.languages,
          matchedLanguages: formData.matchedLanguages,
          additionalInfo: formData.additionalInfo,
          customFields: formData.customFields,
          roleApply: formData.roleApply,
          originalCV: formData.originalCV,
          jobDescription: formData.jobDescriptionId
        }
      };

      // Gửi request đúng chuẩn
      const response = await axiosInstance.post('/api/chatbot', requestBody);

      if (response.data && response.data.status === 'success') {
        setMessages([...newMessages, { 
          text: response.data.output.outputMessage, 
          isUser: false,
          isInitial: false
        }]);

        // Handle any special actions returned
        if (response.data.data.actions && response.data.data.actions.length > 0) {
          handleChatbotActions(response.data.data.actions);
        }
      } else {
        throw new Error('Invalid response from chat API');
      }
    } catch (error) {
      console.error('Error in chat API:', error);
      // Add error message
      setMessages([...newMessages, { 
        text: "I apologize, but I encountered an error processing your request. Please try again.", 
        isUser: false,
        isInitial: false
      }]);
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachment = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      // Process PDF file
      // For now just acknowledge the upload
      setMessages([...messages, { 
        text: `I've received your file "${file.name}". Let me analyze it...`, 
        isUser: false,
        isInitial: false
      }]);
      
      // In a real implementation, you would send this to a backend service
      // For now, just simulate processing
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          text: "I've analyzed your resume. Would you like specific feedback on a particular section?", 
          isUser: false,
          isInitial: false
        }]);
      }, 2000);
    } else {
      setMessages([...messages, { 
        text: "Sorry, I can only process PDF files at the moment.", 
        isUser: false,
        isInitial: false
      }]);
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetConversation = () => {
    let welcomeMessage = '';
    
    if (mode === 'cv' || mode === 'resume') {
      const currentSectionName = getCurrentStepName();
      welcomeMessage = `I'm here to help you with the ${currentSectionName} section. What specific questions do you have about creating an effective ${currentSectionName.toLowerCase()}?`;
    } else {
      welcomeMessage = getWelcomeMessage();
    }
    
    setMessages([{ text: welcomeMessage, isUser: false, isInitial: true }]);
    setShowNewMessageAlert(false);
    hasUserInteractedRef.current = false;
    setShowPdfUpload(false);
  };

  // Ngăn chặn sự kiện wheel lan truyền
  const handleWheel = (e) => {
    // Đánh dấu người dùng đã tương tác
    hasUserInteractedRef.current = true;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    
    // Nếu đang ở đầu và wheel lên trên, hoặc đang ở cuối và wheel xuống dưới
    if ((scrollTop === 0 && e.deltaY < 0) || 
        (scrollTop + clientHeight >= scrollHeight && e.deltaY > 0)) {
      // Cho phép sự kiện lan truyền
    } else {
      // Ngăn chặn sự kiện lan truyền
      e.stopPropagation();
    }
  };

  // Ngăn chặn sự kiện focus làm tràn ra ngoài
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Fixed height container with proper flex layout */}
      <div className="flex flex-col h-[500px] max-h-[80vh]">
        {/* Chat Messages - Flexible height with scrolling */}
        <div className="flex-grow overflow-hidden relative">
          <div 
            ref={messagesContainerRef}
            className="h-full overflow-y-auto px-4 py-3" 
            onWheel={handleWheel}
          >
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`mb-3 ${message.isUser ? 'text-right' : ''}`}
                >
                  <div 
                    className={`inline-block p-3 rounded-lg max-w-[85%] ${
                      message.isUser 
                        ? 'bg-blue-500 text-white rounded-br-none text-left' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none text-left'
                    }`}
                    style={{ 
                      wordBreak: 'break-word', 
                      overflowWrap: 'break-word',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <div className="flex space-x-1">
                    <div className="animate-bounce h-1.5 w-1.5 bg-gray-400 rounded-full"></div>
                    <div className="animate-bounce h-1.5 w-1.5 bg-gray-400 rounded-full" style={{ animationDelay: '0.2s' }}></div>
                    <div className="animate-bounce h-1.5 w-1.5 bg-gray-400 rounded-full" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="ml-2">AI is typing...</span>
                </div>
              )}
              
              {showPdfUpload && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-3">
                  <p className="text-sm text-blue-700 mb-3">
                    Please upload your PDF resume for analysis:
                  </p>
                  <div className="flex justify-center">
                    <button
                      onClick={handleAttachment}
                      className="bg-white text-blue-600 border border-blue-300 rounded-md px-4 py-2 flex items-center hover:bg-blue-50 transition-colors"
                    >
                      <FiPaperclip className="mr-2" /> Upload Resume
                    </button>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* New message alert */}
          {showNewMessageAlert && !isFirstRenderRef.current && hasUserInteractedRef.current && (
            <button 
              type="button"
              onClick={scrollToBottom}
              className="absolute bottom-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center shadow-md hover:bg-blue-700 transition-colors z-10"
            >
              New message <FiChevronDown className="ml-1" />
            </button>
          )}
        </div>
        
        {/* Chat Input - Fixed height at bottom */}
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="flex items-start gap-2">
            <button 
              className="text-gray-400 hover:text-blue-500 p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 mt-1"
              onClick={handleAttachment}
              aria-label="Attach file"
            >
              <FiPaperclip size={20} />
            </button>
            
            <div className="flex flex-1 items-start">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                style={{ 
                  minHeight: '40px', 
                  maxHeight: '80px',
                }}
                rows="1"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className={`bg-blue-600 text-white px-4 py-2 rounded-r-md flex-shrink-0 h-[40px] ${
                  inputText.trim() === '' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
                aria-label="Send message"
              >
                <FiSend />
              </button>
            </div>
          </div>
          
          {/* Reset Conversation Button */}
          <div className="flex justify-between items-center w-full mt-2 p-2">
            <button
              type="button"
              onClick={resetConversation}
              className="text-xs text-gray-500 hover:text-blue-600 flex items-center"
            >
              <FiRefreshCw className="mr-1" /> Reset conversation
            </button>
            <p className="text-xs text-gray-500">
              Powered by AI
            </p>
          </div>
        </div>
      </div>
      
      {/* Hidden file input */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="application/pdf"
        style={{ display: 'none' }}
        aria-hidden="true"
      />
    </div>
  );
};

export default AIAssistant; 