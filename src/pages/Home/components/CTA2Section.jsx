import React, { useRef, useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

const CTA2Section = () => {
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

  return (
    <div className="bg-blue-600">
      <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl font-extrabold text-white sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
          viewport={{ once: true }}
        >
          <span className="block">Ready to boost your career?</span>
          <span className="block mt-2">Create your professional CV today.</span>
        </motion.h2>
        <motion.p
          className="mt-4 text-lg leading-6 text-white/90"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1, delay: 0.05 }}
          viewport={{ once: true }}
        >
          Join thousands of job seekers who have landed their dream jobs with our professional CV builder.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <a 
            href="/templates" 
            className="mt-8 inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10"
          >
            Get started for free
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default CTA2Section;
