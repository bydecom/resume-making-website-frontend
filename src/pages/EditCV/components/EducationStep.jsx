import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';
import { FaEdit, FaTrash } from 'react-icons/fa';

const EducationStep = ({ data, updateData, nextStep, prevStep }) => {
  const [educations, setEducations] = useState(data || []);
  const [currentEducation, setCurrentEducation] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    description: '',
    isPresent: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [originalEducations, setOriginalEducations] = useState([]);
  
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setEducations(data);
    }
  }, [data]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    const updatedEducation = {
      ...currentEducation,
      [name]: newValue
    };
    setCurrentEducation(updatedEducation);
    
    if (isEditing) {
      // Đang chỉnh sửa - cập nhật mục đã tồn tại
      const updatedEducations = [...educations];
      updatedEducations[editIndex] = updatedEducation;
      updateData(updatedEducations);
    } else {
      // Đang tạo mới - thêm vào mảng tạm thời để xem trước
      const tempIndex = educations.findIndex(edu => edu._isTemp === true);
      let updatedEducations = [...educations];
      
      updatedEducation._isTemp = true;
      
      if (tempIndex !== -1) {
        updatedEducations[tempIndex] = updatedEducation;
      } else {
        updatedEducations.push(updatedEducation);
      }
      
      updateData(updatedEducations);
    }
  };
  
  const validate = () => {
    return currentEducation.institution.trim() !== '' && 
           currentEducation.degree.trim() !== '' && 
           currentEducation.startDate.trim() !== '';
  };
  
  const handleAdd = () => {
    if (validate()) {
      const { _isTemp, ...finalEducation } = currentEducation;
      
      let updatedEducations = educations.filter(edu => !edu._isTemp);
      updatedEducations.push(finalEducation);
      
      setEducations(updatedEducations);
      updateData(updatedEducations);
      setCurrentEducation({
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        description: '',
        isPresent: false
      });
    } else {
      alert('Please fill in the required fields: Institution, Degree, and Start Date.');
    }
  };
  
  const handleEdit = (index) => {
    // Lưu trạng thái educations hiện tại trước khi chỉnh sửa
    setOriginalEducations([...educations]);
    setCurrentEducation(educations[index]);
    setEditIndex(index);
    setIsEditing(true);
  };
  
  const handleDelete = (index) => {
    const newEducations = educations.filter((_, i) => i !== index);
    setEducations(newEducations);
    updateData(newEducations);
  };
  
  const handleCancel = () => {
    if (isEditing) {
      // Khôi phục lại dữ liệu ban đầu trước khi chỉnh sửa
      setEducations(originalEducations);
      updateData(originalEducations);
      setEditIndex(-1);
      setIsEditing(false);
    } else {
      // Nếu đang tạo mới, xóa mục tạm thời
      const updatedEducations = educations.filter(edu => !edu._isTemp);
      setEducations(updatedEducations);
      updateData(updatedEducations);
    }
    
    setCurrentEducation({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
      isPresent: false
    });
  };
  
  const handleUpdate = () => {
    if (validate()) {
      const newEducations = [...educations];
      newEducations[editIndex] = currentEducation;
      setEducations(newEducations);
      updateData(newEducations);
      setCurrentEducation({
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        description: '',
        isPresent: false
      });
      setEditIndex(-1);
      setIsEditing(false);
    } else {
      alert('Please fill in the required fields: Institution, Degree, and Start Date.');
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Education</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Institution<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="institution"
              value={currentEducation.institution}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 cv-input"
              placeholder="University or School Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Degree<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="degree"
              value={currentEducation.degree}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 cv-input"
              placeholder="e.g., Bachelor of Science"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Field of Study</label>
            <input
              type="text"
              name="field"
              value={currentEducation.field}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 cv-input"
              placeholder="e.g., Computer Science"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date<span className="text-red-500">*</span></label>
            <input
              type="date"
              name="startDate"
              value={currentEducation.startDate}
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
                  checked={currentEducation.isPresent}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Present</span>
              </div>
            </div>
            <input
              type="date"
              name="endDate"
              value={currentEducation.endDate}
              onChange={handleChange}
              disabled={currentEducation.isPresent}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={currentEducation.description}
          onChange={handleChange}
          rows="4"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 cv-textarea"
          placeholder="Describe your academic achievements, relevant coursework, etc."
        ></textarea>
      </div>
      
      <div className="flex space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Education
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
              Add Education
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

      {educations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Your Education</h3>
          <div className="space-y-4">
            {educations.map((edu, index) => (
              <div key={index} className="p-4 border rounded-md bg-white cv-wrapper">
                <div className="flex justify-between">
                  <div className="cv-flex-item">
                    <h4 className="font-medium cv-long-text">{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                    <p className="text-sm text-gray-600 cv-long-text">{edu.institution}</p>
                    <p className="text-xs text-gray-500">
                      {edu.startDate && new Date(edu.startDate).toLocaleDateString()}
                      {edu.isPresent 
                        ? ' - Present' 
                        : edu.endDate 
                          ? ` - ${new Date(edu.endDate).toLocaleDateString()}` 
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
                {edu.description && (
                  <p className="mt-2 text-sm text-gray-600 cv-long-text">{edu.description}</p>
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

export default EducationStep; 