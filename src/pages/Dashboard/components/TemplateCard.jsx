import React from "react";

const TemplateCard = ({ template }) => {
  return (
    <div
      className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className={`h-48 ${template.color} flex items-center justify-center`}>
        <img
          src={template.thumbnail}
          alt={template.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-3 text-center">
        <h3 className="font-medium">{template.name}</h3>
      </div>
    </div>
  );
};

export default TemplateCard; 