import React, { useRef, useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.1 }
  }
};

const EducationSection = () => {
  const isMountedRef = useRef(true);
  const bgAnimation1 = useAnimationControls();
  const bgAnimation2 = useAnimationControls();
  const bgAnimation3 = useAnimationControls();
  const bgAnimation4 = useAnimationControls();
  const bgAnimation5 = useAnimationControls();

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

  // Xử lý animation cho background elements
  useEffect(() => {
    const animateBackground = async () => {
      if (isMountedRef.current && !window.isUnmounting) {
        bgAnimation1.start({
          scale: [1, 1.1, 1],
          rotate: [0, 90, 0],
          transition: {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }
        });
        
        bgAnimation2.start({
          scale: [1, 1.2, 1],
          rotate: [0, -90, 0],
          transition: {
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }
        });
        
        bgAnimation3.start({
          y: [0, -20, 0],
          x: [0, 20, 0],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }
        });
        
        bgAnimation4.start({
          y: [0, 30, 0],
          x: [0, -30, 0],
          transition: {
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }
        });
        
        bgAnimation5.start({
          y: [0, 40, 0],
          x: [0, 40, 0],
          transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }
        });
      }
    };
    
    animateBackground();
  }, [bgAnimation1, bgAnimation2, bgAnimation3, bgAnimation4, bgAnimation5]);

  return (
    <div className="bg-gray-50 py-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/5 rounded-full"
          animate={bgAnimation1}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-600/5 rounded-full"
          animate={bgAnimation2}
        />
        <motion.div
          className="absolute top-1/4 left-1/4 w-12 h-12 bg-blue-500/10 rounded-full"
          animate={bgAnimation3}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-8 h-8 bg-blue-600/10 rounded-full"
          animate={bgAnimation4}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-16 h-16 bg-blue-400/10 rounded-full"
          animate={bgAnimation5}
        />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div 
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl font-bold tracking-tighter mb-4 text-gray-800"
            variants={itemVariants}
          >
            Learn How to <span className="text-blue-600">Craft the Perfect CV</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Our resources help you understand what makes a CV effective
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-md relative z-10"
            variants={itemVariants}
            whileHover={{ 
              y: -5, 
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.1 }
            }}
          >
            <h3 className="text-xl font-bold mb-4 text-blue-600">CV Writing Tips</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Tailor your CV to each job application</li>
              <li>• Use action verbs to describe achievements</li>
              <li>• Quantify your accomplishments with numbers</li>
              <li>• Keep it concise and relevant</li>
              <li>• Proofread carefully for errors</li>
            </ul>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-md relative z-10"
            variants={itemVariants}
            whileHover={{ 
              y: -5, 
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.1 }
            }}
          >
            <h3 className="text-xl font-bold mb-4 text-blue-600">Free Resources</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Industry-specific CV examples</li>
              <li>• Video tutorials on CV writing</li>
              <li>• Guides for career changers</li>
              <li>• Interview preparation tips</li>
              <li>• Cover letter templates</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EducationSection; 