import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ScrollDownButton = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  // Check if page is scrollable
  const checkScrollable = () => {
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    setIsScrollable(documentHeight > windowHeight);
  };

  // Check if we're at the top of the page and not at the bottom
  const checkPosition = () => {
    if (!isScrollable) {
      setIsVisible(false);
      return;
    }

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Hide button when at the bottom of the page
    if (windowHeight + scrollTop >= documentHeight - 50) {
      setIsAtBottom(true);
    } else {
      setIsAtBottom(false);
    }
    
    // Hide button when scrolled down past initial view
    if (scrollTop > windowHeight) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // Check scrollable on mount and window resize
    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    window.addEventListener('scroll', checkPosition);
    
    // Initial check for position
    checkPosition();
    
    return () => {
      window.removeEventListener('resize', checkScrollable);
      window.removeEventListener('scroll', checkPosition);
    };
  }, [isScrollable]); // Add isScrollable to dependency array

  // Don't render anything if page isn't scrollable
  if (!isScrollable) return null;

  return createPortal(
    isVisible && !isAtBottom && (
      <div 
        className="scroll-button"
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '32px',
          zIndex: 1
        }}
      >
        <button
          onClick={scrollToBottom}
          className="bg-blue-500 text-white p-1 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 w-10 h-10 flex items-center justify-center"
          aria-label="Scroll to bottom"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </div>
    ),
    document.body
  );
};

export default ScrollDownButton; 