import React from 'react';
import { Link } from 'react-router-dom';

const AIResumeWriter = () => {
  const features = [
    {
      id: 1,
      title: 'Smart Content Generation',
      description: 'Our AI analyzes your experience and job targets to suggest compelling bullet points that highlight your achievements and skills.',
      icon: (
        <svg className="w-10 h-10 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      id: 2,
      title: 'Language Enhancement',
      description: 'Transform bland job descriptions into powerful statements that grab recruiters\' attention and showcase your value.',
      icon: (
        <svg className="w-10 h-10 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
    },
    {
      id: 3,
      title: 'ATS Optimization',
      description: 'Our AI ensures your resume includes relevant keywords for your industry and target position to pass through Applicant Tracking Systems.',
      icon: (
        <svg className="w-10 h-10 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: 4,
      title: 'Job-Specific Suggestions',
      description: 'Get tailored content suggestions based on the specific job you\'re applying for, highlighting your most relevant experiences.',
      icon: (
        <svg className="w-10 h-10 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 5,
      title: 'Writer\'s Block Eliminator',
      description: 'Never struggle with what to write again. Our AI helps you articulate your experiences even when you\'re not sure how to describe them.',
      icon: (
        <svg className="w-10 h-10 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      id: 6,
      title: 'Achievement Quantifier',
      description: 'Our AI helps you add measurable results to your experiences, turning basic duties into impressive achievements with real impact.',
      icon: (
        <svg className="w-10 h-10 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Enter Your Basic Information',
      description: 'Start by providing your basic details like name, contact information, and job history.',
    },
    {
      number: 2,
      title: 'Select Your Target Job',
      description: 'Tell our AI what position you\'re applying for so it can tailor your resume accordingly.',
    },
    {
      number: 3,
      title: 'Review AI Suggestions',
      description: 'Our AI will analyze your information and suggest compelling content for each section of your resume.',
    },
    {
      number: 4,
      title: 'Edit and Personalize',
      description: 'Fine-tune the AI-generated content to match your voice and add any personal touches.',
    },
    {
      number: 5,
      title: 'Download Your Polished Resume',
      description: 'Export your professionally written resume in PDF or Word format, ready to impress employers.',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-6">
                AI-Powered Resume Writer
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Create a professional, ATS-optimized resume in minutes with our advanced AI technology.
                Let artificial intelligence help you land your dream job.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="bg-white text-blue-600 font-medium px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/resume-examples"
                  className="bg-transparent border border-white text-white font-medium px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
                >
                  See Examples
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="bg-white p-6 rounded-lg shadow-xl transform rotate-3">
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-400">AI Resume Writer Demo</span>
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
            <h2 className="text-3xl font-bold mb-4">How Our AI Helps You Write Better Resumes</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our advanced AI technology analyzes millions of successful resumes to help you create content that gets noticed by recruiters and passes through applicant tracking systems.
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
              Creating a professional resume with our AI is easy. Just follow these simple steps to get started.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {steps.map((step) => (
              <div key={step.number} className="flex items-start mb-8">
                <div className="flex-shrink-0 bg-blue-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center mr-4">
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

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Thousands of job seekers have used our AI Resume Writer to improve their job prospects. Here's what they have to say.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 w-12 h-12 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Michael Tran</h4>
                  <p className="text-gray-500 text-sm">Software Engineer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I was struggling to describe my technical projects in a way that non-technical recruiters would understand. The AI Writer helped me transform technical jargon into clear achievements that got me three interview calls within a week!"
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 w-12 h-12 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-500 text-sm">Marketing Specialist</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The AI Writer helped me quantify my marketing achievements with specific metrics and results. It suggested powerful action verbs and helped me emphasize my most relevant skills. I landed my dream job at a top agency thanks to this tool!"
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 w-12 h-12 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">David Wilson</h4>
                  <p className="text-gray-500 text-sm">Recent Graduate</p>
                </div>
              </div>
              <p className="text-gray-600">
                "As a recent graduate, I wasn't sure how to present my limited experience. The AI Writer helped me highlight transferable skills from my coursework and internships. The suggestions were spot on and helped me create a resume that got noticed despite my limited work history."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Create Your AI-Powered Resume?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
            Join thousands of successful job seekers who have used our AI Resume Writer to land interviews and job offers.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 font-medium px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors inline-block"
          >
            Get Started Free
          </Link>
          <p className="mt-4 text-blue-200 text-sm">
            No credit card required. Free plan includes one AI-powered resume.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AIResumeWriter; 