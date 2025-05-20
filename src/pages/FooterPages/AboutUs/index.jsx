import React from 'react';

const AboutUs = () => {
  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center">About Us</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-4">
          At Resume Builder, our mission is to empower job seekers with tools that make the resume creation process simple, 
          efficient, and effective. We believe everyone deserves access to professional-quality resume tools regardless 
          of their design skills or background.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <p className="text-gray-700 mb-4">
          Founded in 2023, Resume Builder was created by a team of HR professionals and web developers who recognized 
          the challenges job seekers face when creating resumes. After years of reviewing thousands of resumes, 
          we understood what works and what doesn't in the job application process.
        </p>
        <p className="text-gray-700 mb-4">
          We combined this expertise with cutting-edge technology to create a platform that generates 
          professional, ATS-friendly resumes quickly and easily.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Team Member Card */}
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="font-medium text-lg">John Doe</h3>
            <p className="text-gray-600">Founder & CEO</p>
          </div>
          
          {/* Team Member Card */}
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="font-medium text-lg">Jane Smith</h3>
            <p className="text-gray-600">HR Director</p>
          </div>
          
          {/* Team Member Card */}
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="font-medium text-lg">Mike Johnson</h3>
            <p className="text-gray-600">Lead Developer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 