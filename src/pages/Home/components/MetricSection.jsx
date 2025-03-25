import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiBriefcase, FiAward, FiThumbsUp } from 'react-icons/fi';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
      delayChildren: 0.1
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

const metricCardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: i => ({ 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5,
      delay: 0.1 + (i * 0.1)
    }
  }),
  hover: { 
    y: -5,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
  }
};

const MetricCard = ({ icon: Icon, value, label, index }) => {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md text-center"
      custom={index}
      variants={metricCardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
    >
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="text-blue-600 w-8 h-8" />
      </div>
      <h3 className="text-3xl font-bold mb-2 text-blue-600">{value}</h3>
      <p className="text-gray-600">{label}</p>
    </motion.div>
  );
};

const MetricSection = () => {
  const metrics = [
    {
      icon: FiUsers,
      value: "300K+",
      label: "Users Worldwide"
    },
    {
      icon: FiBriefcase,
      value: "1M+",
      label: "Resumes Created"
    },
    {
      icon: FiAward,
      value: "85%",
      label: "Success Rate"
    },
    {
      icon: FiThumbsUp,
      value: "4.8/5",
      label: "User Rating"
    }
  ];

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
          <motion.h2 
            className="text-3xl font-bold tracking-tighter mb-4 text-gray-800"
            variants={itemVariants}
          >
            Our Metrics
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            See how we're doing
          </motion.p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-4">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              icon={metric.icon}
              value={metric.value}
              label={metric.label}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricSection;    