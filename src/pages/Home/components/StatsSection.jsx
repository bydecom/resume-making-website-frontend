import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { FiFileText, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Import các logo (giả định bạn có các file này)
import bookingLogo from "../../../assets/logos/booking.png";
import appleLogo from "../../../assets/logos/apple.png";
import dhlLogo from "../../../assets/logos/dhl.png";
import amazonLogo from "../../../assets/logos/amazon.png";
import amexLogo from "../../../assets/logos/amex.png";
import accentureLogo from "../../../assets/logos/accenture.png";
import kpmgLogo from "../../../assets/logos/kpmg.png";

const ResumeStatsSection = () => {
  const [count, setCount] = useState(0);
  const targetCount = 44743;
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMountedRef = useRef(true);

  // Thiết lập isMounted khi component mount và cleanup khi unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      // Đánh dấu component đã unmount
      isMountedRef.current = false;
    };
  }, []);

  // Đặt lại biến isUnmounting khi component mount
  useEffect(() => {
    window.isUnmounting = false;
  }, []);

  // Company logos data
  const companies = [
    { name: "Booking.com", logo: bookingLogo, width: 150 },
    { name: "Apple", logo: appleLogo, width: 40 },
    { name: "DHL", logo: dhlLogo, width: 120 },
    { name: "Amazon", logo: amazonLogo, width: 120 },
    { name: "American Express", logo: amexLogo, width: 120 },
    { name: "Accenture", logo: accentureLogo, width: 120 },
    { name: "KPMG", logo: kpmgLogo, width: 120 },
  ];

  const totalSlides = Math.ceil(companies.length / 4);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !isMountedRef.current || window.isUnmounting) return;

    const duration = 1200;
    const startTime = Date.now();
    const startCount = Math.floor(targetCount * 0.7);

    const updateCount = () => {
      if (!isMountedRef.current || window.isUnmounting) return;
      
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;

      if (elapsedTime < duration) {
        const progress = elapsedTime / duration;
        const easedProgress = progress;
        const currentCount = Math.floor(
          startCount + (targetCount - startCount) * easedProgress
        );
        setCount(currentCount);
        requestAnimationFrame(updateCount);
      } else {
        setCount(targetCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isVisible, targetCount]);

  // Auto-rotate carousel
  useEffect(() => {
    if (!isMountedRef.current || window.isUnmounting) return;
    
    const interval = setInterval(() => {
      if (isMountedRef.current && !window.isUnmounting) {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="bg-white py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Stats section - Điều chỉnh layout để icon gần với số hơn */}
        <div
          ref={countRef}
          className="bg-blue-50 rounded-xl p-5 md:p-6 flex items-center justify-center gap-3 shadow-sm max-w-3xl mx-auto"
        >
          {/* Đặt icon và số liệu trong cùng một container */}
          <div className="flex items-center gap-3">
            <div className="text-blue-400">
              <FiFileText size={40} className="transform rotate-6" />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2">
              <span className="text-3xl md:text-4xl font-bold text-blue-900">
                {count.toLocaleString()}
              </span>
              <span className="text-lg md:text-xl text-blue-800">
                resumes created today
              </span>
            </div>
          </div>
        </div>

        {/* Companies carousel section */}
        <div className="mt-16 text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-blue-900 mb-8">
            Our candidates have been hired at:
          </h2>

          {/* Giảm bề rộng của carousel bằng cách thêm max-w-4xl và mx-auto */}
          <div className="relative max-w-4xl mx-auto">
            {/* Carousel container */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {/* Create a slide for each group of 4 companies */}
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div
                    key={slideIndex}
                    className="min-w-full grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center"
                  >
                    {companies
                      .slice(slideIndex * 4, slideIndex * 4 + 4)
                      .map((company, index) => (
                        <div
                          key={`${slideIndex}-${index}`}
                          className="grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                        >
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="h-7 object-contain" // Giảm kích thước logo
                            style={{ maxWidth: company.width + "px" }}
                          />
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
              aria-label="Previous slide"
            >
              <FiChevronLeft className="h-5 w-5 text-blue-900" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
              aria-label="Next slide"
            >
              <FiChevronRight className="h-5 w-5 text-blue-900" />
            </button>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === index
                      ? "w-6 bg-blue-500"
                      : "w-2 bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeStatsSection;