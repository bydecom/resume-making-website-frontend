import React from 'react';
import cvSample from '../../../assets/cv-sample.jpg';

const CTASection = () => {
  return (
    <div className="bg-indigo-800 py-16 text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-4xl font-bold mb-6">Beautiful ready-to-use resume templates</h2>
            <p className="text-xl mb-8">
              Win over employers and recruiters by using one of our 25+ elegant,
              professionally-designed resume templates. Download to PNG or PDF.
            </p>
            <a
              href="/templates"
              className="bg-white text-indigo-800 px-8 py-4 rounded-md text-lg font-semibold hover:bg-indigo-100 transition duration-300"
            >
              Select template
            </a>
            <div className="mt-8 flex items-center">
              <div className="text-3xl text-green-400 mr-4">★★★★★</div>
              <div>
                <div className="text-xl font-bold">4.9 out of 5</div>
                <div className="text-sm">based on 51,569 reviews from Community</div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="flex justify-end">
              <img
                src={cvSample}
                alt="Resume Template 1"
                className="w-3/4 h-auto object-cover shadow-lg rounded-md z-10 relative"
              />
              <img
                src={cvSample}
                alt="Resume Template 2"
                className="w-3/4 h-auto object-cover shadow-lg rounded-md absolute top-8 right-16"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection; 