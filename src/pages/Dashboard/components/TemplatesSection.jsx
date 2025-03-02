import React from "react";
import TemplateCard from "./TemplateCard";

const TemplatesSection = ({ templates }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Choose Template</h2>
        <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
          View All
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </section>
  );
};

export default TemplatesSection; 