import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TbMessageChatbot } from "react-icons/tb";
import { FiSend, FiX, FiPaperclip, FiUpload, FiExternalLink, FiMaximize, FiMinimize, FiEye, FiChevronLeft, FiChevronRight, FiRefreshCw } from 'react-icons/fi';
import { getWelcomeMessage, sanitizeUserInput, analyzePdfResume } from './chatbotUtils';
import { processMessage, detectIntent } from './taskMap';
import TemplatePreview from './TemplatePreview';
// Import thumbnails directly
import MinimalistThumbnail from '../../../assets/cv-thumnails/minimalist.jpg';
import ModernThumbnail from '../../../assets/cv-thumnails/modern.jpg';
import ProfessionalBlueThumbnail from '../../../assets/cv-thumnails/professional-blue.jpg';
import ProfessionalCVThumbnail from '../../../assets/cv-thumnails/professional-cv.jpg';

// Map of thumbnail names to imported images
const thumbnailMap = {
  'minimalist': MinimalistThumbnail,
  'modern': ModernThumbnail, 
  'professional-blue': ProfessionalBlueThumbnail,
  'professional-cv': ProfessionalCVThumbnail
};

const GlobalAIAssistant = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: getWelcomeMessage(), 
      isUser: false,
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPdfUpload, setShowPdfUpload] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  
  // New state for pending PDF upload request
  const [pendingPdfUploadRequest, setPendingPdfUploadRequest] = useState(false);
  
  // New state for template preview
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  // Ref để theo dõi trạng thái chat thực tế
  const isChatVisibleRef = useRef(false);

  // List of routes where the AI assistant should be excluded
  const excludedRoutes = [
    '/new-cv',
    '/edit-cv',
  ];

  // Check if current path starts with any excluded route
  const isExcluded = excludedRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  // New state for templates display
  const [templates, setTemplates] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templatesLink, setTemplatesLink] = useState('');

  // Add new state for carousel scrolling
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef(null);

  // Đơn giản hóa hàm toggle chat
  const handleToggleChat = () => {
    // Nếu đang ở chế độ fullscreen và chat đang mở, thoát khỏi fullscreen
    if (showChat && isFullScreen) {
      setIsFullScreen(false);
      return;
    }
    
    // Đơn giản chỉ toggle trạng thái chat
    setShowChat(!showChat);
  };

  useEffect(() => {
    // Reset chat when reopened
    if (showChat) {
      scrollToBottom();
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [showChat]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set the height to scrollHeight
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
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

  // Also scroll whenever showPdfUpload changes
  useEffect(() => {
    if (showPdfUpload) {
      scrollToBottom();
    }
  }, [showPdfUpload]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const newMessages = [...messages, { text: inputText, isUser: true }];
    setMessages(newMessages);
    
    // Store the message text before clearing input
    const messageText = inputText;
    
    // Clear input and completely reset textarea
    setInputText('');
    
    // Reset textarea to default state
    if (textareaRef.current) {
      setTimeout(() => {
        textareaRef.current.style.height = '40px';
        textareaRef.current.style.overflow = 'hidden';
      }, 0);
    }
    
    // Hide the PDF upload interface if a new message is sent while it's shown
    if (showPdfUpload) {
      setShowPdfUpload(false);
    }
    
    // Simulate AI typing
    setIsTyping(true);
    
    // Use taskMap for local processing (for demo purposes)
    try {
      const result = processMessage(messageText, 'global');
      
      // Handle any special actions returned
      if (result.actions && result.actions.length > 0) {
        handleChatbotActions(result.actions);
      } else {
        // If no PDF upload action is returned in the result, clear any pending PDF upload request
        setPendingPdfUploadRequest(false);
      }
      
      // Set response message after a delay to simulate typing
      setTimeout(() => {
        setMessages([...newMessages, { 
          text: result.response, 
          isUser: false 
        }]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Error in local processing:', error);
      // Simple fallback for demo
      setTimeout(() => {
        setMessages([...newMessages, { 
          text: "I'm sorry, I couldn't process that request properly.", 
          isUser: false 
        }]);
        setIsTyping(false);
        // Clear any pending PDF upload request if there's an error
        setPendingPdfUploadRequest(false);
      }, 1000);
    }
  };

  // Handle actions returned from chatbot responses
  const handleChatbotActions = (actions) => {
    // Check if there's a REQUEST_PDF_UPLOAD action
    const hasPdfUploadAction = actions.some(action => action.type === 'REQUEST_PDF_UPLOAD');
    
    // If there's no PDF upload action, clear any pending PDF upload request and hide the upload interface
    if (!hasPdfUploadAction) {
      setPendingPdfUploadRequest(false);
      setShowPdfUpload(false);
    }
    
    actions.forEach(action => {
      switch (action.type) {
        case 'REQUEST_PDF_UPLOAD':
          // Mark as pending - will be shown after message is fully displayed
          setPendingPdfUploadRequest(true);
          break;
        case 'SHOW_TEMPLATES':
          setTemplates(action.templates || []);
          setShowTemplates(true);
          setTemplatesLink(action.link || '/templates');
          break;
        case 'SUGGEST_OPTIONS':
          // Could implement a UI for suggested options
          console.log('Options suggested:', action.options);
          break;
        case 'SHOW_EXAMPLES':
          // Could fetch and display examples
          console.log('Should show examples for:', action.exampleType);
          break;
        case 'NAVIGATE_TO':
          // Could navigate to a different page
          console.log('Should navigate to:', action.path);
          break;
        default:
          console.log('Unknown action type:', action.type);
      }
    });
  };

  const handleNavigateToTemplates = () => {
    if (templatesLink) {
      // First close the chat to prevent animation issues
      setShowChat(false);
      
      // Use setTimeout to ensure the chat component is unmounted before navigating
      setTimeout(() => {
        navigate(templatesLink);
        // Only reopen chat after navigation is complete
        // setShowChat(true);  // Commented out to prevent reopening chat automatically
      }, 10);
    }
  };

  const handleAttachment = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setPdfFile(selectedFile);
      setShowPdfUpload(false);
      
      // Add message showing file was uploaded
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          text: `File "${selectedFile.name}" has been uploaded. Analyzing...`, 
          isUser: false,
          isPdf: true
        }
      ]);
      
      // For demo, we'll just simulate a response after a delay
      setIsTyping(true);
      
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages, 
          { 
            text: "I've analyzed your resume. Here are some suggestions: 1) Consider adding more quantifiable achievements, 2) Your skills section could be more detailed, 3) Make sure your contact information is prominent. Would you like me to elaborate on any of these points?", 
            isUser: false
          }
        ]);
        setIsTyping(false);
      }, 2000);
    } else {
      alert("Please select a PDF file.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setPdfFile(droppedFile);
        setShowPdfUpload(false);
        
        // Add message showing file was uploaded
        setMessages(prevMessages => [
          ...prevMessages, 
          { 
            text: `File "${droppedFile.name}" has been uploaded. Analyzing...`, 
            isUser: false,
            isPdf: true
          }
        ]);
        
        // For demo, we'll just simulate a response after a delay
        setIsTyping(true);
        
        setTimeout(() => {
          setMessages(prevMessages => [
            ...prevMessages, 
            { 
              text: "I've analyzed your resume. Here are some suggestions: 1) Consider adding more quantifiable achievements, 2) Your skills section could be more detailed, 3) Make sure your contact information is prominent. Would you like me to elaborate on any of these points?", 
              isUser: false
            }
          ]);
          setIsTyping(false);
        }, 2000);
      } else {
        alert("Please drop a PDF file.");
      }
    }
  };

  // Handle clicking outside to close chat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target)) {
        // If in fullscreen mode, exit fullscreen first
        if (isFullScreen) {
          setIsFullScreen(false);
        } else {
          // Only close the chat if not in fullscreen mode
          setShowChat(false);
        }
      }
    };

    if (showChat) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showChat, isFullScreen]);

  // Add an effect to prevent body scrolling when in full-screen mode
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFullScreen]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Handle opening template preview
  const handleOpenTemplatePreview = (template) => {
    // Map template names to template IDs
    const templateIdMap = {
      'minimalist': 'minimalist',
      'modern': 'modern',
      'professional-blue': 'professionalBlue',
      'professional-cv': 'professionalCV'
    };
    
    // Determine the template ID based on the thumbnailName or name
    const templateId = template.thumbnailName ? 
      templateIdMap[template.thumbnailName] : 
      Object.values(templateIdMap).find(id => 
        id.toLowerCase().replace(/[^a-z0-9]/g, '') === template.name?.toLowerCase().replace(/[^a-z0-9]/g, '')
      );
    
    // Enhance the template with additional data if needed
    const enhancedTemplate = {
      ...template,
      id: templateId,
      description: template.description || `A professional ${template.name} template designed to highlight your skills and experience.`,
      previewImage: template.previewImage || (template.thumbnailName ? thumbnailMap[template.thumbnailName] : null)
    };
    
    setPreviewTemplate(enhancedTemplate);
    setShowTemplatePreview(true);
  };

  // Handle closing template preview
  const handleCloseTemplatePreview = () => {
    setShowTemplatePreview(false);
    setPreviewTemplate(null);
    // Don't force the chat to stay open
  };

  // Function to handle template carousel scrolling
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 200; // Adjust as needed
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(
            carouselRef.current.scrollWidth - carouselRef.current.clientWidth,
            scrollPosition + scrollAmount
          );
      
      carouselRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      
      setScrollPosition(newPosition);
    }
  };
  
  // Update scroll position when carousel scrolls
  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      setScrollPosition(carouselRef.current.scrollLeft);
    }
  };

  // Templates Carousel
  const renderTemplatesCarousel = () => {
    if (!showTemplates || templates.length === 0) return null;
    
    // Calculate if scroll buttons should be shown
    const showScrollButtons = carouselRef.current && carouselRef.current.scrollWidth > carouselRef.current.clientWidth;
    const canScrollLeft = scrollPosition > 0;
    const canScrollRight = carouselRef.current && 
      scrollPosition < (carouselRef.current.scrollWidth - carouselRef.current.clientWidth - 10);
    
    return (
      <div className="my-4 relative">
        {/* Left Scroll Button */}
        {showScrollButtons && (
          <button 
            onClick={() => scrollCarousel('left')}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1 ${
              canScrollLeft ? 'opacity-100' : 'opacity-30 cursor-not-allowed'
            }`}
            disabled={!canScrollLeft}
            style={{ marginLeft: '-10px' }}
          >
            <FiChevronLeft size={20} className="text-blue-600" />
          </button>
        )}
        
        {/* Templates Container */}
        <div 
          className="overflow-x-auto pb-2 hide-scrollbar" 
          ref={carouselRef}
          onScroll={handleCarouselScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex space-x-3" style={{ minWidth: 'min-content' }}>
            {templates.map((template) => {
              // Get thumbnail from map using thumbnailName
              // Construct thumbnail path
              const thumbnailPath = template.thumbnailName 
                ? thumbnailMap[template.thumbnailName] 
                : null;
                
              return (
                <div key={template.id} className="flex-shrink-0 w-48 border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="h-32 bg-gray-50 relative overflow-hidden">
                    {thumbnailPath ? (
                      <img 
                        src={thumbnailPath} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/200x150?text=${template.name}`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                        {template.name}
                      </div>
                    )}
                    {/* Preview button overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                      <button
                        className="bg-white rounded-md px-3 py-1.5 shadow-md hover:bg-blue-50 transition-all flex items-center gap-1.5"
                        onClick={(e) => {
                          e.stopPropagation();  
                          handleOpenTemplatePreview({
                            ...template,
                            previewImage: thumbnailPath
                          });
                        }}
                        title="Preview template"
                      >
                        <FiEye size={16} className="text-blue-600" />
                        <span className="text-blue-600 text-sm font-medium">Preview</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-2">
                    <h4 className="font-medium text-sm">{template.name}</h4>
                    <p className="text-xs text-gray-500 mb-2">{template.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Right Scroll Button */}
        {showScrollButtons && (
          <button 
            onClick={() => scrollCarousel('right')}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1 ${
              canScrollRight ? 'opacity-100' : 'opacity-30 cursor-not-allowed'
            }`}
            disabled={!canScrollRight}
            style={{ marginRight: '-10px' }}
          >
            <FiChevronRight size={20} className="text-blue-600" />
          </button>
        )}
        
        <div className="mt-2 text-center">
          <button 
            onClick={(e) => {
              e.preventDefault();
              handleNavigateToTemplates();
            }}
            className="inline-flex items-center text-blue-600 text-sm font-medium hover:text-blue-800"
          >
            Go to templates page <FiExternalLink className="ml-1" />
          </button>
        </div>
      </div>
    );
  };

  // Thêm hàm resetConversation
  const resetConversation = () => {
    setMessages([
      { 
        text: getWelcomeMessage(), 
        isUser: false,
      }
    ]);
  };

  // Don't render if we're on an excluded page
  if (isExcluded) return null;

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '30px', zIndex: 10 }}>
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef}
        style={{ display: 'none' }} 
        accept="application/pdf"
        onChange={handleFileSelect}
      />
      
      {/* Template Preview Modal */}
      {showTemplatePreview && previewTemplate && (
        <TemplatePreview 
          template={previewTemplate}
          isOpen={showTemplatePreview}
          onClose={handleCloseTemplatePreview}
        />
      )}
      
      {/* Chat Window */}
      {showChat && (
        <div 
          ref={chatContainerRef}
          className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden mb-2 chat-window"
          style={{ 
            position: isFullScreen ? 'fixed' : 'absolute',
            bottom: isFullScreen ? '0' : '60px',
            right: isFullScreen ? '0' : '0',
            left: isFullScreen ? '0' : 'auto',
            top: isFullScreen ? '0' : 'auto',
            width: isFullScreen ? '100%' : '350px',
            height: isFullScreen ? '100%' : '500px',
            maxHeight: isFullScreen ? '100%' : '80vh',
            maxWidth: isFullScreen ? '100%' : '90vw',
            marginBottom: isFullScreen ? '0' : '8px',
            zIndex: 10000,
            transition: 'all 0.3s ease'
          }}
        >
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <h3 className="font-medium">Resume Assistant</h3>
            <div className="flex items-center">
              <button 
                onClick={toggleFullScreen}
                className="text-white hover:bg-blue-700 rounded-full p-1 mr-2 transition-colors"
                title={isFullScreen ? "Exit full screen" : "Full screen"}
              >
                {isFullScreen ? <FiMinimize size={18} /> : <FiMaximize size={18} />}
              </button>
              <button 
                onClick={() => setShowChat(false)}
                className="text-white hover:bg-blue-700 rounded-full p-1 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>
          
          {/* Main Chat Container with Flex Layout */}
          <div className="flex flex-col h-[calc(100%-56px)] overflow-hidden">
            {/* Messages Container */}
            <div className="flex-grow overflow-hidden relative">
              <div 
                className="h-full overflow-y-auto px-4 py-3"
                onWheel={(e) => e.stopPropagation()}
              >
                <div className={isFullScreen ? 'max-w-4xl mx-auto' : ''}>
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
                    
                    {/* Templates Carousel */}
                    {renderTemplatesCarousel()}
                    
                    {/* PDF Upload Interface */}
                    {showPdfUpload && (
                      <div className="my-4">
                        <div 
                          className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center cursor-pointer hover:bg-blue-50 transition-colors"
                          onClick={() => fileInputRef.current.click()}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                        >
                          <FiUpload className="mx-auto text-blue-500 mb-2" size={24} />
                          <p className="text-sm text-gray-600 mb-1">
                            Drag and drop your PDF resume here
                          </p>
                          <p className="text-xs text-gray-500">
                            or click to browse files
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Typing Indicator */}
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
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Chat Input Section */}
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <div className={`flex items-start gap-2 ${isFullScreen ? 'max-w-4xl mx-auto' : ''}`}>
                <button 
                  className="text-gray-400 hover:text-blue-500 p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 mt-1"
                  onClick={handleAttachment}
                  title="Attach file"
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
                      maxHeight: '80px'
                    }}
                    rows="1"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={inputText.trim() === ''}
                    className={`bg-blue-600 text-white px-4 py-2 rounded-r-md flex-shrink-0 h-[40px] ${
                      inputText.trim() === '' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                    }`}
                  >
                    <FiSend />
                  </button>
                </div>
              </div>
              
              {/* Reset Conversation and Footer */}
              <div className={`flex justify-between items-center w-full mt-2 px-2 ${isFullScreen ? 'max-w-4xl mx-auto' : ''}`}>
                <button
                  type="button"
                  onClick={resetConversation}
                  className="text-xs text-gray-500 hover:text-blue-600 flex items-center transition-colors"
                >
                  <FiRefreshCw className="mr-1" /> Reset conversation
                </button>
                <p className="text-xs text-gray-500">
                  Powered by AI
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* AI Button */}
      <button
        onClick={handleToggleChat}
        className={`rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          showChat ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-gray-100'
        }`}
        style={{ 
          width: '48px', 
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
          transform: showChat ? 'scale(1.05)' : 'scale(1)'
        }}
      >
        <TbMessageChatbot size={26} className={`transition-transform duration-300 ${showChat ? 'rotate-12' : ''}`} />
      </button>
    </div>
  );
};

export default GlobalAIAssistant; 