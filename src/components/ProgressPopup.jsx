import React from 'react';
import { motion } from 'framer-motion';

const ProgressPopup = ({ currentStep, steps, isError = false, errorMessage = '', onRetry = null }) => {
  const calculateProgress = () => {
    return ((currentStep) / steps.length) * 100;
  };

  // Animation variants for items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-center text-gray-800">
            {isError ? 'Processing Error' : 'Processing Your CV'}
          </h3>
        </div>
        
        {!isError ? (
          <motion.div 
            className="p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-8 overflow-hidden">
              <motion.div 
                className="bg-blue-600 h-2.5 rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${calculateProgress()}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
            
            {/* Steps */}
            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-start gap-3"
                  variants={itemVariants}
                >
                  <div className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border text-sm font-medium
                    ${index < currentStep - 1
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : index === currentStep - 1
                        ? 'bg-blue-100 border-blue-600 text-blue-600' 
                        : 'bg-background border-gray-300 text-gray-500'
                    }
                  `}>
                    {index < currentStep - 1 ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : index === currentStep - 1 ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="absolute animate-ping h-full w-full rounded-full bg-blue-200 opacity-30"></div>
                        <div className="h-5 w-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                      </div>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-base font-medium
                      ${index < currentStep - 1
                        ? 'text-gray-900' 
                        : index === currentStep - 1
                          ? 'text-blue-600' 
                          : 'text-gray-500'
                      }
                    `}>
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-5">
              <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-red-600 mb-3">Processing Failed</h4>
            <p className="text-gray-600 mb-6">{errorMessage || 'An error occurred while processing your CV. Please try again later.'}</p>
            {onRetry && (
              <motion.button
                onClick={onRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Try Again
              </motion.button>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProgressPopup; 