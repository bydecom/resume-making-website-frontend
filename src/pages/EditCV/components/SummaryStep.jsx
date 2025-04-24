import React, { useState, useEffect } from 'react';
import { FiInfo } from 'react-icons/fi';

const SummaryStep = ({ data, updateData, nextStep, prevStep }) => {
  const [summary, setSummary] = useState(data || '');
  const [showExamples, setShowExamples] = useState(false);
  
  useEffect(() => {
    setSummary(data || '');
  }, [data]);
  
  const handleChange = (e) => {
    const value = e.target.value;
    setSummary(value);
    updateData(value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };
  
  const examples = [
    {
      title: "IT Professional",
      text: "Results-driven software engineer with 5+ years of experience in developing scalable web applications. Proficient in JavaScript, React, and Node.js with a strong focus on code quality and performance optimization. Passionate about solving complex problems and delivering user-friendly solutions."
    },
    {
      title: "Marketing Specialist",
      text: "Creative marketing professional with expertise in digital marketing strategies and brand development. Proven track record of increasing engagement and conversion rates through data-driven campaigns. Skilled in social media management, content creation, and SEO optimization."
    },
    {
      title: "Healthcare Worker",
      text: "Compassionate healthcare professional with 8+ years of experience in patient care. Dedicated to providing high-quality care with empathy and attention to detail. Strong communication skills and ability to work effectively in fast-paced environments."
    }
  ];
  
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
          <h3 className="text-lg font-medium text-gray-900 p-4 border-b border-gray-200">
            Example Summaries
          </h3>
          <div className="p-4 space-y-4 ">
            {examples.map((example, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-md hover:bg-gray-200 transition duration-200 shadow">
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
            ))}
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