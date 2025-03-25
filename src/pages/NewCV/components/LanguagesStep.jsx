import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const LanguagesStep = ({ data = [], updateData }) => {
  const [languages, setLanguages] = useState(data || []);
  const [currentLanguage, setCurrentLanguage] = useState({
    language: '',
    proficiency: 'Beginner'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [originalLanguages, setOriginalLanguages] = useState([]);

  const proficiencyLevels = [
    'Native',
    'Fluent',
    'Advanced',
    'Intermediate',
    'Beginner',
    'Elementary'
  ];

  // Cập nhật state khi data prop thay đổi
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setLanguages(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const updatedLanguage = {
      ...currentLanguage,
      [name]: value
    };
    setCurrentLanguage(updatedLanguage);
    
    if (isEditing) {
      // Đang chỉnh sửa - cập nhật mục đã tồn tại
      const updatedLanguages = [...languages];
      updatedLanguages[editIndex] = updatedLanguage;
      updateData(updatedLanguages);
    } else {
      // Đang tạo mới - thêm vào mảng tạm thời để xem trước
      const tempIndex = languages.findIndex(lang => lang._isTemp === true);
      let updatedLanguages = [...languages];
      
      updatedLanguage._isTemp = true;
      
      if (tempIndex !== -1) {
        updatedLanguages[tempIndex] = updatedLanguage;
      } else {
        updatedLanguages.push(updatedLanguage);
      }
      
      updateData(updatedLanguages);
    }
  };

  const validate = () => {
    return currentLanguage.language.trim() !== '';
  };

  const handleAdd = () => {
    if (validate()) {
      const { _isTemp, ...finalLanguage } = currentLanguage;
      
      let updatedLanguages = languages.filter(lang => !lang._isTemp);
      updatedLanguages.push(finalLanguage);
      
      setLanguages(updatedLanguages);
      updateData(updatedLanguages);
      setCurrentLanguage({
        language: '',
        proficiency: 'Beginner'
      });
    } else {
      alert('Please provide a language name.');
    }
  };

  const handleEdit = (index) => {
    // Lưu trạng thái languages hiện tại trước khi chỉnh sửa
    setOriginalLanguages([...languages]);
    setCurrentLanguage(languages[index]);
    setEditIndex(index);
    setIsEditing(true);
  };

  const handleDelete = (index) => {
    const newLanguages = languages.filter((_, i) => i !== index);
    setLanguages(newLanguages);
    updateData(newLanguages);
  };

  const handleCancel = () => {
    if (isEditing) {
      // Khôi phục lại dữ liệu ban đầu trước khi chỉnh sửa
      setLanguages(originalLanguages);
      updateData(originalLanguages);
      setEditIndex(-1);
      setIsEditing(false);
    } else {
      // Nếu đang tạo mới, xóa mục tạm thời
      const updatedLanguages = languages.filter(lang => !lang._isTemp);
      setLanguages(updatedLanguages);
      updateData(updatedLanguages);
    }
    
    setCurrentLanguage({
      language: '',
      proficiency: 'Beginner'
    });
  };

  const handleUpdate = () => {
    if (validate()) {
      const newLanguages = [...languages];
      newLanguages[editIndex] = currentLanguage;
      setLanguages(newLanguages);
      updateData(newLanguages);
      setCurrentLanguage({
        language: '',
        proficiency: 'Beginner'
      });
      setEditIndex(-1);
      setIsEditing(false);
    } else {
      alert('Please provide a language name.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Language<span className="text-red-500">*</span> </label>
          <input
            type="text"
            name="language"
            value={currentLanguage.language}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g., English, Spanish, French"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Proficiency Level</label>
          <select
            name="proficiency"
            value={currentLanguage.proficiency}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            {proficiencyLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Language
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
              Add Language
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

      {languages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Your Languages</h3>
          <div className="space-y-4">
            {languages.map((lang, index) => (
              <div key={index} className="p-4 border rounded-md bg-white flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{lang.language}</h4>
                  <p className="text-sm text-gray-600">{lang.proficiency}</p>
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguagesStep; 