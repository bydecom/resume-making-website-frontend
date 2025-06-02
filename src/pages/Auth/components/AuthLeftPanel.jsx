import React from "react";
import { motion } from "framer-motion";
import image from "../../../assets/Image.png";
const AuthLeftPanel = ({
  title = "Welcome to BestCV.io",
  description = "Log in to your account to access your personalized dashboard and continue building your professional profile.",

}) => {
  return (
    <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
      {/* Background pattern with reduced opacity */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content container */}
      <div className="flex items-center justify-center w-full h-full p-8 z-10">
        <div className="max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-blue-600 mb-4">{title}</h1>
            <p className="text-base text-gray-600 mb-8">{description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full aspect-square max-w-sm mx-auto"
          >
            <div className="w-full h-full rounded-lg shadow-xl overflow-hidden bg-white">
              <div className="absolute inset-0 bg-blue-100 opacity-50 z-0"></div>
              <img
                src={image}
                alt="Login illustration"
                className="object-cover w-full h-full relative z-10"
              />

              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-200 rounded-full opacity-70"></div>
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-blue-300 rounded-full opacity-50"></div>
            </div>
          </motion.div>

          {/* Additional decorative elements */}
          <div className="mt-8 flex justify-center space-x-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="w-2 h-2 rounded-full bg-blue-400"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="w-2 h-2 rounded-full bg-blue-500"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="w-2 h-2 rounded-full bg-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLeftPanel; 