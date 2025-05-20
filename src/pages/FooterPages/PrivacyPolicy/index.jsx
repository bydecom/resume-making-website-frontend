import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
      <p className="text-gray-600 mb-8 text-center">Last updated: May 2023</p>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-700 mb-4">
            Welcome to Resume Builder. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our application.
          </p>
          <p className="text-gray-700">
            We take your privacy seriously and are committed to protecting the personal information you share with us. Please read this Privacy Policy carefully. By accessing our Service, you accept the practices and policies outlined in this Privacy Policy.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
          <p className="text-gray-700 mb-4">We may collect the following types of information:</p>
          
          <h3 className="text-lg font-medium mb-2">2.1 Personal Information</h3>
          <p className="text-gray-700 mb-4">
            Personal information you provide to us when you register for an account, update your profile, or create a resume, including:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Address and location</li>
            <li>Professional experience</li>
            <li>Education history</li>
            <li>Skills and qualifications</li>
            <li>Profile picture</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-2">2.2 Usage Information</h3>
          <p className="text-gray-700 mb-4">
            Information about how you use our Service, including:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>Log data (e.g., IP address, browser type, pages visited)</li>
            <li>Device information</li>
            <li>Usage patterns and preferences</li>
            <li>Time spent on the Service</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">We may use the information we collect for various purposes, including:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Providing and maintaining our Service</li>
            <li>Creating and managing your account</li>
            <li>Generating resumes and related documents</li>
            <li>Improving and personalizing our Service</li>
            <li>Communicating with you about our Service</li>
            <li>Responding to your inquiries and requests</li>
            <li>Analyzing usage patterns and trends</li>
            <li>Protecting our legal rights and preventing misuse</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Sharing Your Information</h2>
          <p className="text-gray-700 mb-4">
            We do not sell, trade, or otherwise transfer your personal information to outside parties, except in the following circumstances:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>With your consent</li>
            <li>With service providers who assist us in operating our website and serving you</li>
            <li>To comply with legal requirements, such as a law, regulation, court order, or subpoena</li>
            <li>To protect our rights, property, or safety, or the rights, property, or safety of others</li>
            <li>In connection with a business transaction, such as a merger, acquisition, or asset sale</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Your Choices and Rights</h2>
          <p className="text-gray-700 mb-4">
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Accessing your personal information</li>
            <li>Correcting inaccurate or incomplete information</li>
            <li>Deleting your personal information</li>
            <li>Restricting or objecting to our use of your information</li>
            <li>Withdrawing your consent</li>
            <li>Data portability</li>
          </ul>
          <p className="text-gray-700 mt-4">
            To exercise these rights, please contact us using the information provided in the "Contact Us" section.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Security</h2>
          <p className="text-gray-700">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">7. Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
          </p>
          <div className="mt-4">
            <p className="font-medium">Email: privacy@resumebuilder.com</p>
            <p className="font-medium">Address: 123 Resume Street, New York, NY 10001, United States</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 