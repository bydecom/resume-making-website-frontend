import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const faqCategories = [
    { id: 'general', name: 'General Questions' },
    { id: 'account', name: 'Account & Billing' },
    { id: 'resumes', name: 'Resumes & Templates' },
    { id: 'features', name: 'Features & Tools' },
  ];

  const [activeCategory, setActiveCategory] = useState('general');
  
  const faqData = {
    'general': [
      {
        id: 'g1',
        question: 'What is Resume Builder?',
        answer: 'Resume Builder is an online platform that helps you create professional resumes quickly and easily. Our service offers modern templates, AI-powered content suggestions, and tools to optimize your resume for job applications.'
      },
      {
        id: 'g2',
        question: 'Do I need to create an account to use Resume Builder?',
        answer: 'Yes, creating an account is required to save your progress and access your resumes later. Registration is free and only takes a minute.'
      },
      {
        id: 'g3',
        question: 'Can I use Resume Builder on my mobile device?',
        answer: 'Yes, Resume Builder is fully responsive and works on desktops, tablets, and mobile phones. However, we recommend using a desktop for the best experience when creating detailed resumes.'
      },
      {
        id: 'g4',
        question: 'Is my data secure?',
        answer: 'Yes, we take data security very seriously. All your personal information and resume data are encrypted and stored securely. We never share your information with third parties without your consent.'
      },
    ],
    'account': [
      {
        id: 'a1',
        question: 'How do I create an account?',
        answer: 'To create an account, click on the "Sign Up" button in the top-right corner of the homepage. You can register using your email address or sign up with Google or Facebook.'
      },
      {
        id: 'a2',
        question: 'What are the differences between free and premium accounts?',
        answer: 'Free accounts allow you to create and download one resume with basic templates. Premium accounts offer unlimited resumes, all premium templates, AI-powered content suggestions, cover letter creation, and more advanced features.'
      },
      {
        id: 'a3',
        question: 'How do I cancel my subscription?',
        answer: 'You can cancel your subscription at any time by going to your Account Settings, selecting the "Subscription" tab, and clicking "Cancel Subscription". Your premium features will remain active until the end of your billing cycle.'
      },
      {
        id: 'a4',
        question: 'Do you offer refunds?',
        answer: "Yes, we offer a 14-day money-back guarantee if you\'re not satisfied with our service. Contact our support team to request a refund."
      },
    ],
    'resumes': [
      {
        id: 'r1',
        question: 'How many templates do you offer?',
        answer: 'We currently offer 20+ professionally designed templates across various categories including modern, professional, creative, and minimalist designs.'
      },
      {
        id: 'r2',
        question: 'Can I change my template after creating my resume?',
        answer: 'Yes, premium users can switch between templates at any time without losing content. Free users can change templates for their single resume.'
      },
      {
        id: 'r3',
        question: 'Are the templates ATS-friendly?',
        answer: 'Yes, all our templates are designed to be ATS (Applicant Tracking System) friendly, ensuring your resume gets past automated screening systems used by many employers.'
      },
      {
        id: 'r4',
        question: 'Can I customize the design of my resume?',
        answer: 'Yes, you can customize colors, fonts, section layouts, and spacing to match your personal style while maintaining a professional look.'
      },
    ],
    'features': [
      {
        id: 'f1',
        question: 'What is the AI Resume Writer feature?',
        answer: 'AI Resume Writer uses artificial intelligence to help you write compelling bullet points and content for your resume. It can suggest improvements to your existing content or generate new content based on your job title and experience.'
      },
      {
        id: 'f2',
        question: 'What file formats can I download my resume in?',
        answer: 'You can download your resume as a PDF file (all users) or as a Word document (premium users). PDFs maintain formatting across all devices and are the recommended format for job applications.'
      },
      {
        id: 'f3',
        question: 'What is the Resume Checker?',
        answer: 'Resume Checker is a tool that analyzes your resume for potential issues, including spelling and grammar errors, formatting inconsistencies, and content gaps. It also provides suggestions for improvement.'
      },
      {
        id: 'f4',
        question: 'Can I create a cover letter to match my resume?',
        answer: 'Yes, premium users can create matching cover letters using our Cover Letter Builder. The design automatically matches your selected resume template for a consistent application package.'
      },
    ],
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  // Accordion functionality for mobile view
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (questionId) => {
    if (openQuestion === questionId) {
      setOpenQuestion(null);
    } else {
      setOpenQuestion(questionId);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-4 text-center">Frequently Asked Questions</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Find answers to common questions about Resume Builder. Can\'t find what you\'re looking for?{' '}
        <Link to="/contact" className="text-blue-600 hover:underline">Contact our support team</Link>.
      </p>
      
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center mb-8 gap-2">
        {faqCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              activeCategory === category.id
                ? 'bg-blue-100 text-blue-600 font-medium'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* FAQ Items */}
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {faqData[activeCategory].map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleQuestion(item.id)}
                className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
              >
                <h3 className="font-semibold text-lg">{item.question}</h3>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    openQuestion === item.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              
              <div 
                className={`px-6 pb-6 transition-all duration-300 ${
                  openQuestion === item.id ? 'block' : 'hidden'
                }`}
              >
                <p className="text-gray-700">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Still Have Questions */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          If you couldn't find the answer to your question, our support team is ready to help.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default FAQ; 