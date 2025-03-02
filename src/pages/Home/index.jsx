import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
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

// Animation variants for sections - giảm duration xuống 0.1
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.1, ease: "easeOut" }
  }
};

const Home = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <HeroSection />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <StatsSection />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <ProblemStatementSection />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <EducationSection />
      </motion.div>
      <hr className="border-t border-gray-200" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <SolutionSection />
      </motion.div>
      <hr className="border-t border-gray-200" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <CTA2Section />
      </motion.div>
      <hr className="border-t border-gray-200" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <ReviewsSection />
      </motion.div>
      <hr className="border-t border-gray-200" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <AIFeatureSection />
      </motion.div>
      <hr className="border-t border-gray-200" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <FeaturesSection />
      </motion.div>
      <hr className="border-t border-gray-200" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <MetricSection />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <CTASection />
      </motion.div>
      <ScrollToTop />
    </div>
  );
};

export default Home;