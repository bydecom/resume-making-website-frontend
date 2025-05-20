import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ExperienceStep = ({ data, updateData, nextStep, prevStep, formData }) => {
  // Extract experience data from the most appropriate source
  const extractExperience = () => {
    // If data is already an array with experience objects, use it directly
    if (data && Array.isArray(data) && data.length > 0) {
      return data;
    }
    
    // If formData has matchedExperience, use that
    if (formData?.matchedExperience?.length > 0) {
      return formData.matchedExperience;
    }
    
    // If formData has experience, use that
    if (formData?.experience?.length > 0) {
      return formData.experience;
    }
    
    // Fallback to empty array
    return [];
  };

  const [experiences, setExperiences] = useState(extractExperience() || []);
  const [currentExperience, setCurrentExperience] = useState({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    isPresent: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [originalExperiences, setOriginalExperiences] = useState([]);

  useEffect(() => {
    // Update experiences when data or formData changes
    const extractedExperience = extractExperience();
    if (extractedExperience && Array.isArray(extractedExperience)) {
      console.log('Experience data loaded:', extractedExperience);
      setExperiences(extractedExperience);
    }
  }, [data, formData]);

  // Helper function to update both experience and matchedExperience in parent component
  const updateBothExperienceFields = (updatedExperiences) => {
    // Update both fields in the parent component
    updateData(updatedExperiences);
    
    // This will be handled by the parent component's updateFormData function
    // which should update both experience and matchedExperience fields
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    const updatedExperience = {
      ...currentExperience,
      [name]: newValue
    };
    setCurrentExperience(updatedExperience);
    
    if (isEditing) {
      const updatedExperiences = [...experiences];
      updatedExperiences[editIndex] = updatedExperience;
      updateBothExperienceFields(updatedExperiences);
    } else {
      const tempIndex = experiences.findIndex(exp => exp._isTemp === true);
      let updatedExperiences = [...experiences];
      
      updatedExperience._isTemp = true;
      
      if (tempIndex !== -1) {
        updatedExperiences[tempIndex] = updatedExperience;
      } else {
        updatedExperiences.push(updatedExperience);
      }
      
      updateBothExperienceFields(updatedExperiences);
    }
  };

  const validate = () => {
    return currentExperience.company?.trim() !== '' && 
           currentExperience.position?.trim() !== '';
  };

  const handleAdd = () => {
    if (validate()) {
      const { _isTemp, ...finalExperience } = currentExperience;
      
      let updatedExperiences = experiences.filter(exp => !exp._isTemp);
      updatedExperiences.push(finalExperience);
      
      setExperiences(updatedExperiences);
      updateBothExperienceFields(updatedExperiences);
      setCurrentExperience({
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        isPresent: false
      });
    } else {
      alert('Please provide company name and position.');
    }
  };

  const handleEdit = (index) => {
    setOriginalExperiences([...experiences]);
    setCurrentExperience(experiences[index]);
    setEditIndex(index);
    setIsEditing(true);
  };

  const handleDelete = (index) => {
    const newExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(newExperiences);
    updateBothExperienceFields(newExperiences);
  };

  const handleCancel = () => {
    if (isEditing) {
      setExperiences(originalExperiences);
      updateBothExperienceFields(originalExperiences);
      setEditIndex(-1);
      setIsEditing(false);
    } else {
      const updatedExperiences = experiences.filter(exp => !exp._isTemp);
      setExperiences(updatedExperiences);
      updateBothExperienceFields(updatedExperiences);
    }
    
    setCurrentExperience({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      isPresent: false
    });
  };

  const handleUpdate = () => {
    if (validate()) {
      const newExperiences = [...experiences];
      newExperiences[editIndex] = currentExperience;
      setExperiences(newExperiences);
      updateBothExperienceFields(newExperiences);
      setCurrentExperience({
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        isPresent: false
      });
      setEditIndex(-1);
      setIsEditing(false);
    } else {
      alert('Please provide company name and position.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Work Experience</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="company"
              value={currentExperience.company}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 cv-input"
              placeholder="e.g., Acme Corporation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Position<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="position"
              value={currentExperience.position}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 cv-input"
              placeholder="e.g., Software Engineer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={currentExperience.location}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 cv-input"
              placeholder="e.g., New York, NY"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={currentExperience.startDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPresent"
                  checked={currentExperience.isPresent}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Present</span>
              </div>
            </div>
            <input
              type="date"
              name="endDate"
              value={currentExperience.endDate}
              onChange={handleChange}
              disabled={currentExperience.isPresent}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={currentExperience.description}
          onChange={handleChange}
          rows="4"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 cv-textarea"
          placeholder="Describe your responsibilities and achievements"
        ></textarea>
      </div>
      <div className="flex space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Experience
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Experience
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Clear
            </button>
          </>
        )}
      </div>

      {experiences.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Your Work Experience</h3>
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div key={index} className="p-4 border rounded-md bg-white cv-wrapper">
                <div className="flex justify-between">
                  <div className="cv-flex-item">
                    <h4 className="font-medium cv-long-text">{exp.position}</h4>
                    <p className="text-sm text-gray-600 cv-long-text">{exp.company}</p>
                    {exp.location && <p className="text-sm text-gray-500 cv-long-text">{exp.location}</p>}
                    <p className="text-xs text-gray-500">
                      {exp.startDate && new Date(exp.startDate).toLocaleDateString()}
                      {exp.isPresent 
                        ? ' - Present' 
                        : exp.endDate 
                          ? ` - ${new Date(exp.endDate).toLocaleDateString()}` 
                          : ''}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                {exp.description && (
                  <p className="mt-2 text-sm text-gray-600 cv-long-text">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ExperienceStep; 