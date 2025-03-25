import React, { useRef, useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import heroImage from '../../../assets/resume-02.webp';
import { FiChevronRight } from 'react-icons/fi';

const HeroSection = () => {
  const isMountedRef = useRef(true);
  const resumeAnimation = useAnimationControls();
  const bgAnimation1 = useAnimationControls();
  const bgAnimation2 = useAnimationControls();
  const bgAnimation3 = useAnimationControls();
  const bgAnimation4 = useAnimationControls();
  const bgAnimation5 = useAnimationControls();
  const bgAnimation6 = useAnimationControls();

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

  // Xử lý animation cho resume
  useEffect(() => {
    const animateResume = async () => {
      if (isMountedRef.current && !window.isUnmounting) {
        await resumeAnimation.start({
          y: [0, -10, 0],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }
        });
      }
    };
    
    animateResume();
  }, [resumeAnimation]);

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
        
        bgAnimation6.start({
          y: [0, -25, 0],
          x: [0, -15, 0],
          transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }
        });
      }
    };
    
    animateBackground();
  }, [bgAnimation1, bgAnimation2, bgAnimation3, bgAnimation4, bgAnimation5, bgAnimation6]);

  return (
    <div className="bg-gray-50 py-12 md:py-24 overflow-hidden relative">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid gap-8 py-16 lg:grid-cols-2 lg:gap-12 items-center">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2 
              className="text-blue-900 text-base font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.3 }}
            >
              ONLINE CURRICULUM VITAE BUILDER
            </motion.h2>
            
            <motion.h1 
              className="text-4xl font-bold tracking-tighter sm:text-5xl text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              Only 2% of <motion.span 
                className="text-blue-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >CVs</motion.span> make it pass
              the first round.<br /> Be in the top 2%
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              Easy to use and ready in just minutes. Try it for free now!
            </motion.p>
            
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              <motion.a
                href="/templates"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-4 rounded-md text-xl font-semibold hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create my resume <FiChevronRight className="ml-2 h-4 w-4" />
              </motion.a>
              <motion.p 
                className="text-sm text-gray-500 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <motion.span
                  className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                30 resumes created today
              </motion.p>

            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative h-full flex items-start"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <motion.div
              className="bg-white shadow-2xl overflow-hidden rounded-lg absolute top-0 bottom-0 w-full"
              style={{
                height: "calc(100% + 200px)",
                top: "-10px",
                maxHeight: "none"
              }}
              animate={resumeAnimation}
            >
              <img 
                src={heroImage} 
                alt="CV Sample" 
                className="object-cover w-full h-full" 
                style={{
                  objectPosition: "top center",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/10 rounded-full"
          animate={bgAnimation1}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-600/10 rounded-full"
          animate={bgAnimation2}
        />
        <motion.div
          className="absolute top-1/4 left-1/4 w-12 h-12 bg-blue-500/20 rounded-full"
          animate={bgAnimation3}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-8 h-8 bg-blue-600/20 rounded-full"
          animate={bgAnimation4}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-16 h-16 bg-blue-400/15 rounded-full"
          animate={bgAnimation5}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/5 w-10 h-10 bg-blue-300/15 rounded-full"
          animate={bgAnimation6}
        />
      </div>
    </div>
  );
};

export default HeroSection; 