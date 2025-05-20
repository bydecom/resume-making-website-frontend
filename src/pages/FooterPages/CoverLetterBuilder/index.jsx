import React from 'react';
import { Link } from 'react-router-dom';

const CoverLetterBuilder = () => {
  const features = [
    {
      id: 1,
      title: 'Matching Resume Design',
      description: 'Create a cover letter that perfectly matches your resume for a cohesive, professional application package.',
      icon: (
        <svg className="w-10 h-10 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: 2,
      title: 'AI-Powered Content Suggestions',
      description: 'Our AI analyzes your resume and the job description to suggest compelling content tailored to the position.',
      icon: (
        <svg className="w-10 h-10 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      id: 3,
      title: 'Multiple Style Templates',
      description: 'Choose from various cover letter formats, from traditional to modern, depending on your industry and preferences.',
      icon: (
        <svg className="w-10 h-10 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
    },
    {
      id: 4,
      title: 'Employer-Targeted Customization',
      description: 'Easily customize your cover letter for different employers, highlighting relevant skills and experiences.',
      icon: (
        <svg className="w-10 h-10 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 5,
      title: 'Real-Time Preview',
      description: 'See how your cover letter looks as you create it, with real-time updates for a seamless editing experience.',
      icon: (
        <svg className="w-10 h-10 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      id: 6,
      title: 'Expert-Approved Templates',
      description: 'Our cover letter templates are designed by HR professionals and career experts for maximum impact.',
      icon: (
        <svg className="w-10 h-10 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Select a Template',
      description: 'Choose from our collection of professional cover letter templates designed to match your resume.',
    },
    {
      number: 2,
      title: 'Fill in Your Details',
      description: 'Enter your personal information, work experience, and qualifications. We\'ll automatically pull information from your resume if you\'ve already created one.',
    },
    {
      number: 3,
      title: 'Add Job-Specific Information',
      description: 'Input details about the position and company you\'re applying to, so we can personalize your cover letter.',
    },
    {
      number: 4,
      title: 'Customize Your Content',
      description: 'Review AI-generated content suggestions and edit your cover letter to highlight your most relevant skills and experiences.',
    },
    {
      number: 5,
      title: 'Download and Share',
      description: 'Download your cover letter as a PDF or Word document, ready to submit with your job application.',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-6">
                Create the Perfect Cover Letter
              </h1>
              <p className="text-xl mb-8 text-green-100">
                Make a strong first impression with a professionally designed cover letter that complements your resume. Our Cover Letter Builder makes it easy to create a standout letter in minutes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="bg-white text-green-600 font-medium px-6 py-3 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/cover-letter-examples"
                  className="bg-transparent border border-white text-white font-medium px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
                >
                  See Examples
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="bg-white p-6 rounded-lg shadow-xl transform rotate-3">
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-400">Cover Letter Preview</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-white p-6 rounded-lg shadow-xl transform -rotate-3 -z-10">
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Features That Make the Difference</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our Cover Letter Builder is packed with features to help you create a professional, personalized cover letter that gets you noticed by employers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-center">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Creating a professional cover letter has never been easier. Follow these simple steps to craft a compelling cover letter in minutes.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {steps.map((step) => (
              <div key={step.number} className="flex items-start mb-8">
                <div className="flex-shrink-0 bg-green-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Do's and Don'ts Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Cover Letter Do&apos;s and Don&apos;ts</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Follow these tips to create an effective cover letter that stands out from the competition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Do's */}
            <div className="bg-green-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-6 text-green-700 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Do's
              </h3>
              <ul className="space-y-4">
                <li className="flex">
                  <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Tailor your cover letter for each job application</span>
                </li>
                <li className="flex">
                  <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Address the hiring manager by name if possible</span>
                </li>
                <li className="flex">
                  <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Highlight your most relevant skills and achievements</span>
                </li>
                <li className="flex">
                  <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Show enthusiasm for the role and company</span>
                </li>
                <li className="flex">
                  <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Keep it concise and to the point (one page maximum)</span>
                </li>
              </ul>
            </div>
            
            {/* Don'ts */}
            <div className="bg-red-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-6 text-red-700 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Don&apos;ts
              </h3>
              <ul className="space-y-4">
                <li className="flex">
                  <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Use a generic "To Whom It May Concern" greeting</span>
                </li>
                <li className="flex">
                  <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Simply repeat what's on your resume</span>
                </li>
                <li className="flex">
                  <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Include irrelevant personal information</span>
                </li>
                <li className="flex">
                  <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Use overly complex language or industry jargon</span>
                </li>
                <li className="flex">
                  <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Send without proofreading for spelling and grammar errors</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Create Your Cover Letter?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-green-100">
            Stand out from other applicants with a professionally written cover letter that complements your resume.
          </p>
          <Link
            to="/register"
            className="bg-white text-green-600 font-medium px-8 py-4 rounded-lg hover:bg-green-50 transition-colors inline-block"
          >
            Create Your Cover Letter
          </Link>
          <p className="mt-4 text-green-200 text-sm">
            No credit card required. Free plan includes one cover letter.
          </p>
        </div>
      </section>
    </div>
  );
};

export default CoverLetterBuilder; 