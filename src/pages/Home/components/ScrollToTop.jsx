import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Hiển thị nút khi scroll xuống 300px
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
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
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return createPortal(
    isVisible && (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999
      }}>
        <button
          onClick={scrollToTop}
          className="bg-blue-500 text-white p-1 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 w-8 h-8 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <svg
            className="w-4 h-4"
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
