import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ActivitiesStep = ({ data = [], updateData }) => {
  const [activities, setActivities] = useState(data || []);
  const [currentActivity, setCurrentActivity] = useState({
    organization: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    isPresent: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [originalActivities, setOriginalActivities] = useState([]);

  // Cập nhật state khi data prop thay đổi
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setActivities(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    const updatedActivity = {
      ...currentActivity,
      [name]: newValue
    };
    setCurrentActivity(updatedActivity);
    
    if (isEditing) {
      // Đang chỉnh sửa - cập nhật mục đã tồn tại
      const updatedActivities = [...activities];
      updatedActivities[editIndex] = updatedActivity;
      updateData(updatedActivities);
    } else {
      // Đang tạo mới - thêm vào mảng tạm thời để xem trước
      const tempIndex = activities.findIndex(act => act._isTemp === true);
      let updatedActivities = [...activities];
      
      updatedActivity._isTemp = true;
      
      if (tempIndex !== -1) {
        updatedActivities[tempIndex] = updatedActivity;
      } else {
        updatedActivities.push(updatedActivity);
      }
      
      updateData(updatedActivities);
    }
  };

  const validate = () => {
    return currentActivity.organization.trim() !== '';
  };

  const handleAdd = () => {
    if (validate()) {
      const { _isTemp, ...finalActivity } = currentActivity;
      
      let updatedActivities = activities.filter(act => !act._isTemp);
      updatedActivities.push(finalActivity);
      
      setActivities(updatedActivities);
      updateData(updatedActivities);
      setCurrentActivity({
        organization: '',
        role: '',
        startDate: '',
        endDate: '',
        description: '',
        isPresent: false
      });
    } else {
      alert('Please provide an organization name.');
    }
  };

  const handleEdit = (index) => {
    // Lưu trạng thái activities hiện tại trước khi chỉnh sửa
    setOriginalActivities([...activities]);
    setCurrentActivity(activities[index]);
    setEditIndex(index);
    setIsEditing(true);
  };

  const handleDelete = (index) => {
    const newActivities = activities.filter((_, i) => i !== index);
    setActivities(newActivities);
    updateData(newActivities);
  };

  const handleCancel = () => {
    if (isEditing) {
      // Khôi phục lại dữ liệu ban đầu trước khi chỉnh sửa
      setActivities(originalActivities);
      updateData(originalActivities);
      setEditIndex(-1);
      setIsEditing(false);
    } else {
      // Nếu đang tạo mới, xóa mục tạm thời
      const updatedActivities = activities.filter(act => !act._isTemp);
      setActivities(updatedActivities);
      updateData(updatedActivities);
    }
    
    setCurrentActivity({
      organization: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
      isPresent: false
    });
  };

  const handleUpdate = () => {
    if (validate()) {
      const newActivities = [...activities];
      newActivities[editIndex] = currentActivity;
      setActivities(newActivities);
      updateData(newActivities);
      setCurrentActivity({
        organization: '',
        role: '',
        startDate: '',
        endDate: '',
        description: '',
        isPresent: false
      });
      setEditIndex(-1);
      setIsEditing(false);
    } else {
      alert('Please provide an organization name.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Organization<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="organization"
              value={currentActivity.organization}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g., Volunteer Organization"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              name="role"
              value={currentActivity.role}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g., Volunteer"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={currentActivity.startDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              name="isPresent"
              checked={currentActivity.isPresent}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Current Activity</label>
          </div>
          {!currentActivity.isPresent && (
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="endDate"
                value={currentActivity.endDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={currentActivity.description}
          onChange={handleChange}
          rows="4"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Describe your activities and responsibilities"
        ></textarea>
      </div>
      <div className="flex space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Activity
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
              Add Activity
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

      {activities.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Your Activities</h3>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="p-4 border rounded-md bg-white">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{activity.organization}</h4>
                    {activity.role && <p className="text-sm text-gray-600">{activity.role}</p>}
                    <p className="text-xs text-gray-500">
                      {activity.startDate && new Date(activity.startDate).toLocaleDateString()}
                      {activity.isPresent 
                        ? ' - Present' 
                        : activity.endDate 
                          ? ` - ${new Date(activity.endDate).toLocaleDateString()}` 
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
                {activity.description && (
                  <p className="mt-2 text-sm text-gray-600">{activity.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesStep; 