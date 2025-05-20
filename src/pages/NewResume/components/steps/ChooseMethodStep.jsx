import React from 'react';
import { Wand2, PenLine, FileText } from 'lucide-react';

// Helper function to determine score rating text
const getScoreRating = (score) => {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  if (score >= 60) return "Average";
  return "Needs Improvement";
};

const ChooseMethodStep = ({ onMethodSelect, selectedCV }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI-Powered Method */}
        <div
          onClick={() => onMethodSelect('useAI')}
          className="p-[1px] rounded-lg bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 transition-all duration-300 group cursor-pointer"
        >
          <div className="rounded-lg p-6 bg-gradient-to-br from-white via-purple-50 to-pink-50 transition-colors">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200">
                <Wand2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">AI-Powered Resume</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Let our AI analyze your CV and the job description to create a tailored resume automatically.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Instant resume generation
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Keyword optimization for ATS
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Smart content suggestions
              </li>
            </ul>
          </div>
        </div>

        {/* Manual Method */}
        <div
          onClick={() => onMethodSelect('manual')}
          className="border rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors group"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200">
              <PenLine className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Manual Creation</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Create your resume manually with full control over content and formatting.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Complete customization
            </li>
            <li className="flex items-center">
              <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Step-by-step guidance
            </li>
            <li className="flex items-center">
              <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Pre-filled from CV
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>
          Both methods will help you create an ATS-friendly resume. Choose the one that best suits your needs.
        </p>
      </div>
    </div>
  );
};

export default ChooseMethodStep; 