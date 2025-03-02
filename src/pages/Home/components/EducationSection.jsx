import React from 'react';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const EducationSection = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
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
            className="bg-white p-6 rounded-lg shadow-md"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
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
            className="bg-white p-6 rounded-lg shadow-md"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
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