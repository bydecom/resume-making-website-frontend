import React from "react";
import { useNavigate } from "react-router-dom";
import TemplateCard from "./TemplateCard";
import { Plus } from "lucide-react";

const TemplatesSection = ({ templates }) => {
  const navigate = useNavigate();

  return (
    <section className="max-w-6xl mx-auto mb-12 mt-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Resume Templates</h2>
          <p className="text-gray-500 mt-2">Choose from our collection of professional templates to create your perfect resume</p>
        </div>
        <button 
          onClick={() => navigate('/templates')}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="h-5 w-5" />
          View All Templates
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="h-16 w-16 mx-auto text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Templates Available</h3>
          <p className="text-gray-500 mb-6">We're working on adding more professional templates for you!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </section>
  );
};

export default TemplatesSection; 