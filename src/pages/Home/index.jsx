import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import HeroSection from './components/HeroSection';
import ReviewsSection from './components/ReviewsSection';
import FeaturesSection from './components/FeaturesSection';
import CTASection from './components/CTASection';
import MetricSection from './components/MetricSection';
import ScrollToTop from './components/ScrollToTop';
import ProblemStatementSection from './components/ProblemStatementSection';
import SolutionSection from './components/SolutionSection';
import EducationSection from './components/EducationSection';
import AIFeatureSection from './components/AIFeatureSection';
import StatsSection from './components/StatsSection';
import CTA2Section from './components/CTA2Section';

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.1, ease: "easeOut" }
  }
};

const Home = () => {
  const [isMounted, setIsMounted] = useState(false);
  const controls = useAnimation();

  // Handle component mount and cleanup
  useEffect(() => {
    setIsMounted(true);
    window.scrollTo(0, 0);
    
    // Tạo một biến kiểm tra mount state cho component này
    const mountedRef = { current: true };

    return () => {
      // Đánh dấu component đã unmount
      mountedRef.current = false;
      setIsMounted(false);
      controls.stop();
    };
  }, [controls]);

  // Tạo một function an toàn để chạy animation
  const safeAnimate = async (animation) => {
    // Kiểm tra nếu component vẫn mounted và window.isUnmounting không true
    if (isMounted && !window.isUnmounting) {
      return controls.start(animation);
    }
    return Promise.resolve();
  };

  // Chỉ render animations nếu component được mount
  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <HeroSection />
      {[
        StatsSection,
        ProblemStatementSection,
        EducationSection,
        SolutionSection,
        CTA2Section,
        ReviewsSection,
        AIFeatureSection,
        FeaturesSection,
        MetricSection,
        CTASection
      ].map((Section, index) => (
        <React.Fragment key={index}>
          {index > 0 && <hr className="border-t border-gray-200" />}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            // Thay vì dùng animate trực tiếp, sử dụng custom animate prop
            custom={safeAnimate}
          >
            <Section />
          </motion.div>
        </React.Fragment>
      ))}
      <ScrollToTop />
    </div>
  );
};

export default Home;