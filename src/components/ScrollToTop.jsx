import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  // Check if page is scrollable
  const checkScrollable = () => {
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    setIsScrollable(documentHeight > windowHeight);
  };

  // Hiển thị nút khi scroll xuống 300px và trang có thể scroll
  const toggleVisibility = () => {
    if (window.pageYOffset > 300 && isScrollable) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // Check scrollable on mount and window resize
    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    window.addEventListener('scroll', toggleVisibility);
    
    // Initial check for visibility
    toggleVisibility();

    return () => {
      window.removeEventListener('resize', checkScrollable);
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [isScrollable]); // Add isScrollable to dependency array

  // Don't render anything if page isn't scrollable
  if (!isScrollable) return null;

  return createPortal(
    isVisible && (
      <div 
        className="scroll-button"
        style={{
        position: 'fixed',
        bottom: '150px',
        right: '32px',
        zIndex: 1
        }}
      >
        <button
          onClick={scrollToTop}
          className="bg-blue-500 text-white p-1 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 w-10 h-10 flex items-center justify-center"
          aria-label="Scroll to top"
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
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    ),
    document.body
  );
};

export default ScrollToTop;
