import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiRefreshCw, FiChevronDown } from 'react-icons/fi';

const AIAssistant = ({ currentStep, currentAdditionalSection, formData, preventAutoScroll }) => {
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
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isNearBottomRef = useRef(true);
  const isFirstRenderRef = useRef(true);
  const hasUserInteractedRef = useRef(false); // Theo dõi xem người dùng đã tương tác chưa

  useEffect(() => {
    // Cập nhật tin nhắn chào mừng mới khi chuyển bước
    const welcomeMessage = `I see you're working on the ${getCurrentStepName()} section. How can I help you with this?`;
    setMessages([
      { 
        text: welcomeMessage, 
        isUser: false,
        isInitial: true // Đánh dấu tin nhắn ban đầu
      }
    ]);
    
    // Reset trạng thái khi chuyển bước
    setShowNewMessageAlert(false);
    isFirstRenderRef.current = true; // Reset lại trạng thái render đầu tiên
    hasUserInteractedRef.current = false; // Reset lại trạng thái tương tác
  }, [currentStep, currentAdditionalSection]);

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

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Đánh dấu người dùng đã tương tác
    hasUserInteractedRef.current = true;
    
    // Add user message
    const newMessages = [...messages, { text: inputText, isUser: true }];
    setMessages(newMessages);
    setInputText('');
    
    // Simulate AI typing
    setIsTyping(true);
    
    // Đảm bảo scroll xuống sau khi gửi tin nhắn người dùng
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      let response = '';
      
      // Simple response logic based on keywords
      const lowercaseInput = inputText.toLowerCase();
      const currentSectionName = getCurrentStepName();
      
      if (lowercaseInput.includes('example') || lowercaseInput.includes('sample')) {
        response = `Here's an example for the ${currentSectionName} section: [Example would be provided based on the current step]`;
      } else if (lowercaseInput.includes('help') || lowercaseInput.includes('how')) {
        response = `To complete the ${currentSectionName} section effectively, focus on being clear, concise, and relevant to your target job. What specific part are you struggling with?`;
      } else if (lowercaseInput.includes('thank') || lowercaseInput.includes('thanks')) {
        response = "You're welcome! I'm here to help make your CV creation process easier. Any other questions?";
      } else {
        response = `I understand you're working on the ${currentSectionName} section. Could you provide more details about what you need help with?`;
      }
      
      // Kiểm tra lại vị trí scroll trước khi thêm tin nhắn AI
      checkIfNearBottom();
      
      setMessages([...newMessages, { text: response, isUser: false, isInitial: false }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetConversation = () => {
    const welcomeMessage = `I'm here to help you with the ${getCurrentStepName()} section. What questions do you have?`;
    setMessages([{ text: welcomeMessage, isUser: false, isInitial: true }]);
    setShowNewMessageAlert(false);
    hasUserInteractedRef.current = false;
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
    <div className="flex flex-col h-full overflow-hidden max-w-full">
      <p className="text-sm text-blue-600 mb-3 truncate">
        Currently helping with: {getCurrentStepName()}
      </p>
      
      <div className="relative flex-grow w-full">
        <div 
          ref={messagesContainerRef}
          className="mb-3 border border-gray-100 rounded-lg p-3 bg-gray-50 h-[300px] overflow-y-auto w-full"
          onWheel={handleWheel}
          style={{ boxSizing: 'border-box' }}
        >
          {/* Hiển thị tất cả tin nhắn trong cuộc hội thoại */}
          <div className="space-y-3 w-full">
            {messages.map((message, index) => (
              <div key={index} className={`${message.isUser ? 'text-right' : 'text-left'} w-full`}>
                <div 
                  className={`inline-block max-w-[85%] rounded-lg p-2 text-sm break-words ${
                    message.isUser 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {message.isUser ? 'You' : 'AI Assistant'} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-left">
                <div className="inline-block max-w-[85%] rounded-lg p-2 text-sm bg-gray-200 text-gray-800">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Thông báo tin nhắn mới */}
        {showNewMessageAlert && !isFirstRenderRef.current && hasUserInteractedRef.current && (
          <button 
            type="button"
            onClick={scrollToBottom}
            className="absolute bottom-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center shadow-md hover:bg-blue-700 transition-colors"
          >
            New message <FiChevronDown className="ml-1" />
          </button>
        )}
      </div>
      
      <div className="relative w-full">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your question here..."
          className="w-full border border-gray-300 rounded-lg p-4 pr-12 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none box-border"
          style={{ 
            boxSizing: 'border-box',
            transition: 'none',
            maxWidth: '100%'
          }}
          rows="2"
        />
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={!inputText.trim()}
          className={`absolute right-2 bottom-2 rounded-full p-2 ${
            inputText.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500'
          }`}
        >
          <FiSend />
        </button>
      </div>
      
      <div className="mt-3 flex justify-between items-center w-full">
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
  );
};

export default AIAssistant; 