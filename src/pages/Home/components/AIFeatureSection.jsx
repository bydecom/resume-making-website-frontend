import React, { useRef, useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { FiCpu, FiEdit, FiSearch, FiTrendingUp } from 'react-icons/fi';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2 }
  }
};

const featureCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.1,
      delay: 0.1 + (i * 0.1)
    }
  }),
  hover: { 
    y: -10,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
  }
};

const AIFeatureSection = () => {
  const isMountedRef = useRef(true);
  const scoreAnimation = useAnimationControls();

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

  // Xử lý animation cho score
  useEffect(() => {
    const animateScore = async () => {
      if (isMountedRef.current && !window.isUnmounting) {
        await scoreAnimation.start({
          boxShadow: ["0 0 0 0 rgba(37, 99, 235, 0.2)", "0 0 0 10px rgba(37, 99, 235, 0)", "0 0 0 0 rgba(37, 99, 235, 0)"],
          transition: {
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }
        });
      }
    };
    
    animateScore();
  }, [scoreAnimation]);

  const features = [
    {
      title: "Smart Content Suggestions",
      description: "Our AI analyzes your experience and suggests powerful bullet points that highlight your achievements."
    },
    {
      title: "Keyword Optimization",
      description: "Automatically identify and include industry-specific keywords that help your CV pass through ATS systems."
    },
    {
      title: "Grammar & Style Check",
      description: "Advanced language processing ensures your CV is error-free and uses professional language."
    },
    {
      title: "Personalized Feedback",
      description: "Get real-time suggestions to improve weak sections of your CV based on industry standards."
    }
  ];

  return (
    <div className="bg-white py-16 relative overflow-hidden">
      {/* Animated background elements - tương tự như trong HeroSection */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/5 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-600/5 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/4 left-1/4 w-12 h-12 bg-blue-500/10 rounded-full"
          animate={{
            y: [0, -20, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-8 h-8 bg-blue-600/10 rounded-full"
          animate={{
            y: [0, 30, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-16 h-16 bg-blue-400/10 rounded-full"
          animate={{
            y: [0, 40, 0],
            x: [0, 40, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/5 w-10 h-10 bg-blue-300/10 rounded-full"
          animate={{
            y: [0, -25, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
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
            Powered by <span className="text-blue-600">Advanced AI</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Our artificial intelligence helps you create better content faster
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
              custom={index}
              variants={featureCardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-2 text-blue-600">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-12 bg-blue-100 p-8 rounded-lg"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <motion.div className="md:flex items-center" variants={itemVariants}>
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">AI Resume Score</h3>
              <p className="text-gray-600">
                Our AI analyzes your resume and provides an instant score with detailed feedback on how to improve. Get insights on content, formatting, and keyword optimization to make your resume stand out.
              </p>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <motion.div 
                className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold"
                whileHover={{ scale: 1.05 }}
                animate={scoreAnimation}
              >
                85%
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIFeatureSection; 