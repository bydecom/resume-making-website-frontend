import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms of Service</h1>
      <p className="text-gray-600 mb-8 text-center">Last updated: May 2023</p>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-700 mb-4">
            Welcome to Resume Builder. These Terms of Service ("Terms") govern your access to and use of the Resume Builder website and services, including any content, functionality, and services offered on or through our website (collectively, the "Service").
          </p>
          <p className="text-gray-700">
            By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the Service.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Account Registration</h2>
          <p className="text-gray-700 mb-4">
            To access certain features of the Service, you may be required to register for an account. When you register, you agree to provide accurate, current, and complete information about yourself and to update this information to keep it accurate, current, and complete.
          </p>
          <p className="text-gray-700">
            You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately if you suspect any unauthorized use of your account or access to your password.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Subscription and Payment</h2>
          <p className="text-gray-700 mb-4">
            Some features of our Service require a paid subscription. By subscribing to our premium services, you agree to the following:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>You will be billed on a recurring basis (monthly or annually) until you cancel</li>
            <li>You may cancel your subscription at any time through your account settings</li>
            <li>Refunds are provided in accordance with our refund policy</li>
            <li>We reserve the right to change our subscription fees upon reasonable notice</li>
          </ul>
          <p className="text-gray-700">
            All payments are processed securely through our third-party payment processors. We do not store your full credit card information on our servers.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. User Content</h2>
          <p className="text-gray-700 mb-4">
            Our Service allows you to create, upload, and share content such as resume information, profile pictures, and other materials ("User Content"). You retain ownership of your User Content, but by uploading or sharing it through our Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your User Content for the purpose of providing and improving our Service.
          </p>
          <p className="text-gray-700">
            You are solely responsible for your User Content and represent that you have all necessary rights to share it. You agree not to upload or share any User Content that infringes on third-party rights or violates any applicable laws.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Prohibited Uses</h2>
          <p className="text-gray-700 mb-4">
            You agree not to use the Service for any purpose that is unlawful or prohibited by these Terms. Prohibited uses include:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Using the Service in any way that could disable, overburden, damage, or impair the Service</li>
            <li>Attempting to gain unauthorized access to secured portions of the Service</li>
            <li>Using the Service to distribute unsolicited promotional content or spam</li>
            <li>Collecting or harvesting any information from other users</li>
            <li>Impersonating or attempting to impersonate our company, employees, or other users</li>
            <li>Engaging in any conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            The Service and its original content, features, and functionality are owned by Resume Builder and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
          <p className="text-gray-700">
            Our templates, designs, and tools are provided for your personal or business use but remain our intellectual property. You may not copy, modify, distribute, or create derivative works based on our Service without our explicit permission.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Termination</h2>
          <p className="text-gray-700">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
          <p className="text-gray-700">
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. Limitation of Liability</h2>
          <p className="text-gray-700">
            IN NO EVENT SHALL RESUME BUILDER BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE, WHETHER BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER LEGAL THEORY, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">10. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <div className="mt-2">
            <p className="font-medium">Email: legal@resumebuilder.com</p>
            <p className="font-medium">Address: 123 Resume Street, New York, NY 10001, United States</p>
          </div>
          <p className="mt-4 text-gray-700">
            For privacy-related inquiries, please see our{' '}
            <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService; 