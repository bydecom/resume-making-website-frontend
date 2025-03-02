import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.1, ease: "easeOut" },
  },
};

const SolutionSection = () => {
  const [hasHovered, setHasHovered] = useState(false);
  const pulseAnimation = useAnimationControls();
  const isMountedRef = useRef(true);

  // Thiết lập isMounted khi component mount và cleanup khi unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      // Đánh dấu component đã unmount
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHovered) {
      const pulse = async () => {
        // Kiểm tra xem component có còn mounted không trước khi gọi animation
        if (isMountedRef.current && !window.isUnmounting) {
          await pulseAnimation.start({
            y: -4,
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
            transition: { duration: 0.3, ease: "easeInOut" },
          });
        }
        
        // Kiểm tra lại sau animation đầu tiên
        if (isMountedRef.current && !window.isUnmounting) {
          await pulseAnimation.start({
            y: 0,
            boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
            transition: { duration: 0.3, ease: "easeInOut" },
          });
        }
      };

      // Nhấp nháy nhiều lần nhưng không chặn UI
      const interval = setInterval(() => {
        // Kiểm tra trước khi gọi pulse
        if (!hasHovered && isMountedRef.current && !window.isUnmounting) {
          pulse();
        }
      }, 1500);

      return () => {
        clearInterval(interval);
      };
    } else if (isMountedRef.current && !window.isUnmounting) {
      pulseAnimation.start({ y: 0, boxShadow: "0 0 0 rgba(0, 0, 0, 0)" });
    }
  }, [hasHovered, pulseAnimation]);

  // Đặt lại biến isUnmounting khi component mount
  useEffect(() => {
    window.isUnmounting = false;
  }, []);

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 className="text-3xl font-bold tracking-tighter mb-4 text-gray-800" variants={itemVariants}>
            Our Solution: <span className="text-blue-600">AI-Powered CV Builder</span>
          </motion.h2>
          <motion.p className="text-xl text-gray-600 max-w-3xl mx-auto" variants={itemVariants}>
            We combine professional design with AI technology to help you create CVs that get noticed and get results.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Stand Out From The Crowd</h3>
            <p className="text-gray-600 mb-6">
              Our platform helps you create professional, ATS-friendly CVs that highlight your strengths and get you noticed by employers.
            </p>
          </motion.div>

          <motion.div
            className="bg-gray-100 p-6 rounded-lg relative"
            variants={itemVariants}
            animate={pulseAnimation}
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.2, ease: "easeOut" },
            }}
            onHoverStart={() => setHasHovered(true)}
          >
            {!hasHovered && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
            )}
            <h3 className="text-2xl font-bold mb-2 text-blue-600">Key Benefits</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Professional templates designed by experts</li>
              <li>• AI-powered content suggestions</li>
              <li>• ATS-optimized formats</li>
              <li>• Easy to use, ready in minutes</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SolutionSection;
