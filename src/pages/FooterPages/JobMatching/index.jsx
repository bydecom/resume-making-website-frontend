import React from 'react';

const JobMatching = () => {
  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Job Matching</h1>
      
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Find Your Perfect Job Match</h2>
        <p className="text-gray-700 mb-4">
          Our intelligent Job Matching system connects your skills, experience, and preferences with 
          the perfect job opportunities. Get personalized job recommendations that align with your career goals.
        </p>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4 mt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md 
            transition duration-300 flex-1 text-center">
            Upload Your Resume
          </button>
          
          <button className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 
            font-medium py-2 px-6 rounded-md transition duration-300 flex-1 text-center">
            Create Profile Manually
          </button>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">How Our Job Matching Works</h2>
        
        <div className="relative mt-8">
          {/* Timeline */}
          <div className="absolute left-8 top-0 h-full w-0.5 bg-blue-200"></div>
          
          {/* Step 1 */}
          <div className="relative mb-8 pl-20">
            <div className="absolute left-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
            </div>
            <h3 className="text-xl font-medium">Resume Analysis</h3>
            <p className="text-gray-700 mt-2">
              Our AI analyzes your resume or profile to identify your skills, experience, education, and career trajectory.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="relative mb-8 pl-20">
            <div className="absolute left-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
            </div>
            <h3 className="text-xl font-medium">Preference Matching</h3>
            <p className="text-gray-700 mt-2">
              Tell us your salary expectations, desired location, work arrangement, and industry preferences.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="relative mb-8 pl-20">
            <div className="absolute left-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
            </div>
            <h3 className="text-xl font-medium">Smart Recommendations</h3>
            <p className="text-gray-700 mt-2">
              Receive personalized job matches scored by compatibility with your profile and preferences.
            </p>
          </div>
          
          {/* Step 4 */}
          <div className="relative pl-20">
            <div className="absolute left-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
            </div>
            <h3 className="text-xl font-medium">Apply With Confidence</h3>
            <p className="text-gray-700 mt-2">
              Apply directly to your matched jobs with your optimized resume and personalized cover letter.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Why Choose Our Job Matching</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-5 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-medium text-lg">Intelligent Matching</h3>
            </div>
            <p className="text-gray-700">
              Our AI algorithm considers both hard skills and soft factors like company culture fit.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-medium text-lg">Time Saving</h3>
            </div>
            <p className="text-gray-700">
              No more endless scrolling through job boards. We bring the best matches directly to you.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-medium text-lg">Higher Success Rate</h3>
            </div>
            <p className="text-gray-700">
              Users of our job matching service are 3x more likely to get interviews for positions they apply to.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-medium text-lg">Continuous Learning</h3>
            </div>
            <p className="text-gray-700">
              Our system learns from your feedback to continuously improve your job matches over time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobMatching; 