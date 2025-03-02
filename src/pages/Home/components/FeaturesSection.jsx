import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiDownload, FiEdit, FiLayers, FiCheckCircle, FiClock } from 'react-icons/fi';

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

const featureCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      delay: 0.3 + (i * 0.1)
    }
  }),
  hover: { 
    y: -10,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
  }
};

const FeatureCard = ({ icon: Icon, title, description, index }) => {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md"
      custom={index}
      variants={featureCardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
    >
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="text-blue-600 w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: FiFileText,
      title: "Professional Templates",
      description: "Choose from dozens of professionally designed templates that stand out to employers."
    },
    {
      icon: FiEdit,
      title: "Easy Customization",
      description: "Customize every aspect of your CV with our intuitive drag-and-drop editor."
    },
    {
      icon: FiCheckCircle,
      title: "ATS-Friendly",
      description: "Our CVs are optimized to pass through Applicant Tracking Systems used by employers."
    },
    {
      icon: FiDownload,
      title: "Multiple Formats",
      description: "Download your CV in PDF, Word, or other formats to suit any application requirement."
    },
    {
      icon: FiLayers,
      title: "Multiple Versions",
      description: "Create and save multiple versions of your CV tailored to different job applications."
    },
    {
      icon: FiClock,
      title: "Quick & Easy",
      description: "Create a professional CV in minutes with our streamlined process."
    }
  ];

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
            Features That Make Us <span className="text-blue-600">Stand Out</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Everything you need to create winning CVs and land your dream job
          </motion.p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection; 