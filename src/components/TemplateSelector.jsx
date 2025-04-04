import React from 'react';
import { templates } from '../templates';

const TemplateSelector = ({ currentTemplateId, onSelectTemplate }) => {
  return (
    <div className="w-full p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Choose a Template</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(templates).map((template) => (
          <div 
            key={template.id}
            className={`border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200 
              ${currentTemplateId === template.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
            onClick={() => onSelectTemplate(template.id)}
          >
            <div className="aspect-w-3 aspect-h-4 bg-gray-100">
              {template.previewImage ? (
                <img 
                  src={template.previewImage} 
                  alt={template.name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/fallback-template.png";
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No preview
                </div>
              )}
            </div>
            
            <div className="p-3">
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{template.description}</p>
            </div>
            
            {currentTemplateId === template.id && (
              <div className="bg-blue-500 text-white text-xs text-center p-1">
                Selected
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector; 