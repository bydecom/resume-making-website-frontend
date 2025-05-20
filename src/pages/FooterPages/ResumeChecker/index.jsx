import React from 'react';

const ResumeChecker = () => {
  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Resume Checker</h1>
      
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Make Your Resume Stand Out</h2>
        <p className="text-gray-700 mb-4">
          Our Resume Checker analyzes your resume against industry standards and best practices to ensure 
          it makes the best impression on employers and passes through Applicant Tracking Systems (ATS).
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
          <p className="font-medium">Employers spend an average of just 7 seconds scanning your resume!</p>
          <p className="text-sm mt-2">Our Resume Checker helps you make every second count.</p>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md 
          transition duration-300 mt-4">
          Check Your Resume Now
        </button>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="font-medium text-lg mb-2">Upload</h3>
            <p className="text-gray-600">Upload your existing resume in PDF, DOCX, or other common formats</p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="font-medium text-lg mb-2">Analysis</h3>
            <p className="text-gray-600">Our AI scans your resume for content, formatting, and ATS compatibility</p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="font-medium text-lg mb-2">Results</h3>
            <p className="text-gray-600">Get detailed feedback and suggestions to improve your resume</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">What We Check</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="text-green-500 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">ATS Compatibility</h3>
              <p className="text-sm text-gray-600">Ensure your resume can be properly read by Applicant Tracking Systems</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="text-green-500 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Content Quality</h3>
              <p className="text-sm text-gray-600">Analyze the strength of your skills, experiences, and accomplishments</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="text-green-500 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Formatting & Design</h3>
              <p className="text-sm text-gray-600">Check that your resume is visually appealing and easy to read</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="text-green-500 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Keyword Optimization</h3>
              <p className="text-sm text-gray-600">Detect and suggest industry-specific keywords to increase match rate</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResumeChecker; 