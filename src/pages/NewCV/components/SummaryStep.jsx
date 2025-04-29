import React, { useState, useEffect } from 'react';
import { FiInfo, FiSearch } from 'react-icons/fi';

const SummaryStep = ({ data, updateData, nextStep, prevStep }) => {
  const [summary, setSummary] = useState(data || '');
  const [showExamples, setShowExamples] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const allExamples = [
      {
        title: "Frontend Developer",
        text: "Skilled frontend developer with 4+ years of experience building responsive web applications. Proficient in HTML, CSS, JavaScript, and React. Improved page load speed by 35% on average across projects through performance optimizations."
      },
      {
        title: "Backend Developer",
        text: "Experienced backend engineer with 6+ years of experience in Node.js, Python, and PostgreSQL. Designed and maintained RESTful APIs for applications serving over 500,000 users monthly."
      },
      {
        title: "DevOps Engineer",
        text: "DevOps specialist with 5 years of experience automating CI/CD pipelines using Jenkins, GitHub Actions, and Docker. Reduced deployment times by 60% and improved system uptime to 99.99%."
      },
      {
        title: "Cloud Architect",
        text: "Certified AWS Solutions Architect with 8+ years of cloud infrastructure experience. Successfully migrated 20+ enterprise systems to AWS, reducing infrastructure cost by 40%."
      },
      {
        title: "Cybersecurity Analyst",
        text: "Security-focused IT professional with 7+ years in threat detection and vulnerability management. Implemented security protocols that reduced phishing incidents by 70%."
      },
      {
        title: "UI/UX Designer",
        text: "Creative UI/UX designer with a passion for user-centered design. Led redesign of a SaaS dashboard that improved user task completion rate by 45%. Skilled in Figma, Sketch, and usability testing."
      },
      {
        title: "Mobile App Developer",
        text: "Mobile developer with 5+ years of experience building native and cross-platform apps in Swift and Flutter. Deployed apps with over 1 million combined downloads on iOS and Android."
      },
      {
        title: "Machine Learning Engineer",
        text: "ML engineer with expertise in deep learning, NLP, and data pipelines. Built a recommendation engine that improved product click-through rate by 25% using TensorFlow and PyTorch."
      },
      {
        title: "IT Project Manager",
        text: "Certified PMP project manager with over 10 years of experience delivering software projects on time and within budget. Managed cross-functional teams of 15+ people across 5 international projects."
      },
      {
        title: "Data Engineer",
        text: "Detail-oriented data engineer with 6+ years of experience building scalable data pipelines with Spark, Kafka, and Airflow. Optimized ETL processes, reducing processing time by 50%."
      },
      {
        title: "QA Engineer",
        text: "Quality assurance engineer with 4+ years of experience in manual and automated testing. Developed test suites using Selenium and Jest, reducing post-release bugs by 35%."
      },
      {
        title: "Product Manager",
        text: "Strategic product manager with 6+ years of experience leading product lifecycle from ideation to launch. Successfully launched 3 SaaS products, generating over $2M in ARR."
      },
      {
        title: "System Administrator",
        text: "Reliable system admin with 9 years of experience managing Linux and Windows servers. Improved server uptime to 99.98% and implemented automated monitoring with Nagios and Prometheus."
      },
      {
        title: "IT Support Specialist",
        text: "Customer-focused IT support specialist with 3+ years resolving Level 1 & 2 tickets. Achieved 96% customer satisfaction score and reduced average ticket resolution time by 40%."
      },
      {
        title: "Network Engineer",
        text: "Network engineer with 7 years of experience in configuring and maintaining LAN/WAN environments. Reduced network latency by 30% and upgraded infrastructure for a 2,000-user company."
      },
      {
        title: "Database Administrator",
        text: "Experienced DBA with 8+ years managing MySQL, Oracle, and MongoDB databases. Improved query performance by 60% and ensured zero data loss through regular backup automation."
      },
      {
        title: "Technical Writer",
        text: "Clear and concise technical writer with experience producing documentation for APIs, software products, and onboarding guides. Reduced support requests by 20% through improved documentation."
      },
      {
        title: "AI Researcher",
        text: "Innovative AI researcher with a PhD in Computer Science and 10+ published papers. Developed a generative model improving document summarization accuracy by 18%."
      },
      {
        title: "Full-Stack Developer",
        text: "Versatile full-stack developer with 6+ years working across frontend and backend. Delivered 15+ full-featured web apps using React, Node.js, and PostgreSQL."
      },
      {
        title: "IT Consultant",
        text: "Strategic IT consultant with 12 years of experience advising Fortune 500 clients on digital transformation. Led ERP migration projects saving clients over $5M annually."
      }    
  ];

  const [displayedExamples, setDisplayedExamples] = useState(allExamples.slice(0, 3));
  
  useEffect(() => {
    setSummary(data || '');
  }, [data]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = allExamples.filter(example => 
        example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        example.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDisplayedExamples(filtered);
    } else {
      setDisplayedExamples(allExamples.slice(0, 3));
    }
  }, [searchTerm]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSummary(value);
    updateData(value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };
  
  const insertExample = (text) => {
    setSummary(text);
    updateData(text);
    setShowExamples(false);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Professional Summary</h2>
      
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md flex items-start">
        <FiInfo className="text-blue-500 mt-1 mr-3 flex-shrink-0" size={20} />
        <div>
          <p className="text-sm text-gray-700">
            Your professional summary is a brief overview of your skills, experience, and career goals. It's often the first thing employers read, so make it compelling!
          </p>
          <button
            type="button"
            onClick={() => setShowExamples(!showExamples)}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {showExamples ? "Hide Examples" : "Show Examples"}
          </button>
        </div>
      </div>
      
      {showExamples && (
        <div className="border border-gray-200 rounded-md">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Example Summaries
            </h3>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search examples..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
            {displayedExamples.length > 0 ? (
              displayedExamples.map((example, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition duration-200 shadow">
                  <h4 className="font-medium text-gray-700">{example.title}</h4>
                  <p className="text-sm text-gray-600 my-2">{example.text}</p>
                  <button
                    type="button"
                    onClick={() => insertExample(example.text)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Use this example
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No examples found matching your search
              </div>
            )}
          </div>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Professional Summary<span className="text-red-500">*</span>
        </label>
        <textarea
          value={summary}
          onChange={handleChange}
          rows="6"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 cv-textarea"
          placeholder="Write a concise summary of your professional background, key skills, and career goals..."
        />
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SummaryStep; 