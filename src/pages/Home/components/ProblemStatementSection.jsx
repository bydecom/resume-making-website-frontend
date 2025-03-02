import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const ProblemStatementSection = () => {
  // State và refs cho animation đếm số
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0]);
  const targetCounts = [6.25, 2, 59];
  const sectionRef = useRef(null);
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

  // Stats data
  const stats = [
    { value: 6.25, text: "seconds spent reviewing a CV" },
    { value: 2, text: "of applicants get an interview", suffix: "%" },
    { value: 59, text: "of CVs rejected due to errors", suffix: "%" }
  ];

  // Phát hiện khi section xuất hiện trong viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Animation đếm số
  useEffect(() => {
    if (!isVisible || !isMountedRef.current || window.isUnmounting) return;

    const duration = 800; // Giảm từ 1500 xuống 800
    const startTime = Date.now();
    const startCounts = [0, 0, 0];

    const updateCounts = () => {
      if (!isMountedRef.current || window.isUnmounting) return;
      
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;

      if (elapsedTime < duration) {
        const progress = elapsedTime / duration;
        // Easing function
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        const newCounts = targetCounts.map((target, index) => {
          return startCounts[index] + (target - startCounts[index]) * easedProgress;
        });
        
        setCounts(newCounts);
        requestAnimationFrame(updateCounts);
      } else {
        setCounts(targetCounts);
      }
    };

    requestAnimationFrame(updateCounts);
  }, [isVisible]);

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05, // Giảm từ 0.2 xuống 0.05
        delayChildren: 0.1 // Giảm từ 0.3 xuống 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.1 } // Giảm từ 0.6 xuống 0.1
    },
    hover: { 
      y: -10,
      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)"
    }
  };

  return (
    <div className="bg-gray-50 py-16 md:py-24 relative overflow-hidden" ref={sectionRef}>
      {/* Accent circles */}
      <div className="absolute w-36 h-36 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 top-[10%] left-[5%] -z-10"></div>
      <div className="absolute w-36 h-36 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 bottom-[10%] right-[5%] -z-10"></div>
      
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.1 }} // Giảm từ 0.6 xuống 0.1
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800 mb-4">
            Struggling to Get Your <span className="text-blue-600">CV Noticed?</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The job application process is competitive. Here's why your CV needs to stand out:
          </p>
        </motion.div>

        <motion.div 
          className="grid gap-6 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 md:p-10 rounded-2xl shadow-lg text-center flex flex-col items-center"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="text-3xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
                {counts[index].toFixed(index === 0 ? 2 : 0)}
                {stat.suffix}
              </div>
              <p className="text-lg text-gray-600">{stat.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ProblemStatementSection; 