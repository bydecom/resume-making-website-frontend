import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CVNameModal = ({ isOpen, onClose, onSave, defaultName }) => {
  const [name, setName] = useState(defaultName || '');
  
  useEffect(() => {
    // Reset name when modal opens
    if (isOpen) {
      setName(defaultName || '');
    }
  }, [isOpen, defaultName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(name.trim() || defaultName);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Name your Resume</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="cvName" className="block text-sm font-medium text-gray-700 mb-1">
              Resume Name
            </label>
            <input
              type="text"
              id="cvName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for your CV"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>
          <div className="text-sm text-gray-500 mb-6">
            Give your CV a unique name to easily identify it later.
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CVNameModal; 