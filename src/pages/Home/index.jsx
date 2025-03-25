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
    // Set global unmounting flag to false when component mounts
    window.isUnmounting = false;

    return () => {
      // Set global unmounting flag to true when component is about to unmount
      window.isUnmounting = true;
      setIsMounted(false);
      controls.stop();
    };
  }, [controls]);

  // Only render animations if component is mounted
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
            animate={controls}
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