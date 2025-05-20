import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const CustomFieldsStep = ({ data = [], updateData }) => {
  const [customFields, setCustomFields] = useState(data || []);
  const [currentField, setCurrentField] = useState({
    label: '',
    value: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [originalFields, setOriginalFields] = useState([]);

  // Cập nhật state khi data prop thay đổi
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setCustomFields(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const updatedField = {
      ...currentField,
      [name]: value
    };
    setCurrentField(updatedField);
    
    if (isEditing) {
      // Đang chỉnh sửa - cập nhật mục đã tồn tại
      const updatedFields = [...customFields];
      updatedFields[editIndex] = updatedField;
      updateData(updatedFields);
    } else {
      // Đang tạo mới - thêm vào mảng tạm thời để xem trước
      const tempIndex = customFields.findIndex(field => field._isTemp === true);
      let updatedFields = [...customFields];
      
      updatedField._isTemp = true;
      
      if (tempIndex !== -1) {
        updatedFields[tempIndex] = updatedField;
      } else {
        updatedFields.push(updatedField);
      }
      
      updateData(updatedFields);
    }
  };

  const validate = () => {
    return currentField.label.trim() !== '' && currentField.value.trim() !== '';
  };

  const handleAddField = () => {
    if (validate()) {
      const { _isTemp, ...finalField } = currentField;
      
      let updatedFields = customFields.filter(field => !field._isTemp);
      updatedFields.push(finalField);
      
      setCustomFields(updatedFields);
      updateData(updatedFields);
      setCurrentField({
        label: '',
        value: ''
      });
    } else {
      alert('Please provide both a label and a value for the custom field.');
    }
  };

  const handleEdit = (index) => {
    // Lưu trạng thái customFields hiện tại trước khi chỉnh sửa
    setOriginalFields([...customFields]);
    setCurrentField(customFields[index]);
    setEditIndex(index);
    setIsEditing(true);
  };

  const handleDelete = (index) => {
    const newFields = customFields.filter((_, i) => i !== index);
    setCustomFields(newFields);
    updateData(newFields);
  };

  const handleCancel = () => {
    if (isEditing) {
      // Khôi phục lại dữ liệu ban đầu trước khi chỉnh sửa
      setCustomFields(originalFields);
      updateData(originalFields);
      setEditIndex(-1);
      setIsEditing(false);
    } else {
      // Nếu đang tạo mới, xóa mục tạm thời
      const updatedFields = customFields.filter(field => !field._isTemp);
      setCustomFields(updatedFields);
      updateData(updatedFields);
    }
    
    setCurrentField({
      label: '',
      value: ''
    });
  };

  const handleUpdate = () => {
    if (validate()) {
      const newFields = [...customFields];
      newFields[editIndex] = currentField;
      setCustomFields(newFields);
      updateData(newFields);
      setCurrentField({
        label: '',
        value: ''
      });
      setEditIndex(-1);
      setIsEditing(false);
    } else {
      alert('Please provide both a label and a value for the custom field.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Field Label<span className="text-red-500">*</span></label>
          <input
            type="text"
            name="label"
            value={currentField.label}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g., Portfolio, Blog, GitHub"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Field Value<span className="text-red-500">*</span></label>
          <input
            type="text"
            name="value"
            value={currentField.value}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g., https://portfolio.com"
          />
        </div>
      </div>
      <div className="flex space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Field
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
              onClick={handleAddField}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Custom Field
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

      {customFields.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Your Custom Fields</h3>
          <div className="space-y-4">
            {customFields.map((field, index) => (
              <div key={index} className="p-4 border rounded-md bg-white flex justify-between items-center">
                <div className="flex-grow">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{field.label}:</span>
                    <span className="text-gray-700">{field.value}</span>
                  </div>
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

export default CustomFieldsStep; 