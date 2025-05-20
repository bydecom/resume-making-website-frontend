import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ProjectsStep = ({ data = [], updateData, nextStep, prevStep, hideTitle = false }) => {
  const [projects, setProjects] = useState(data || []);
  const [currentProject, setCurrentProject] = useState({
    title: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    url: '',
    isPresent: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [originalProjects, setOriginalProjects] = useState([]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setProjects(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = value;
    
    // Trim whitespace for URL field
    if (name === 'url') {
      finalValue = value.trim();
    }
    
    const updatedProject = {
      ...currentProject,
      [name]: finalValue
    };
    setCurrentProject(updatedProject);
    
    if (isEditing) {
      // Đang chỉnh sửa - cập nhật mục đã tồn tại
      const updatedProjects = [...projects];
      updatedProjects[editIndex] = updatedProject;
      updateData(updatedProjects);
    } else {
      // Đang tạo mới - thêm vào mảng tạm thời để xem trước
      const tempIndex = projects.findIndex(proj => proj._isTemp === true);
      let updatedProjects = [...projects];
      
      updatedProject._isTemp = true;
      
      if (tempIndex !== -1) {
        updatedProjects[tempIndex] = updatedProject;
      } else {
        updatedProjects.push(updatedProject);
      }
      
      updateData(updatedProjects);
    }
  };

  const validate = () => {
    return currentProject.title.trim() !== '';
  };

  const handleAdd = () => {
    if (validate()) {
      const { _isTemp, ...finalProject } = currentProject;
      
      let updatedProjects = projects.filter(proj => !proj._isTemp);
      updatedProjects.push(finalProject);
      
      setProjects(updatedProjects);
      updateData(updatedProjects);
      setCurrentProject({
        title: '',
        role: '',
        startDate: '',
        endDate: '',
        description: '',
        url: '',
        isPresent: false
      });
    } else {
      alert('Please provide a project title.');
    }
  };

  const handleEdit = (index) => {
    // Lưu trạng thái projects hiện tại trước khi chỉnh sửa
    setOriginalProjects([...projects]);
    setCurrentProject(projects[index]);
    setEditIndex(index);
    setIsEditing(true);
  };

  const handleDelete = (index) => {
    const newProjects = projects.filter((_, i) => i !== index);
    setProjects(newProjects);
    updateData(newProjects);
  };

  const handleCancel = () => {
    if (isEditing) {
      // Khôi phục lại dữ liệu ban đầu trước khi chỉnh sửa
      setProjects(originalProjects);
      updateData(originalProjects);
      setEditIndex(-1);
      setIsEditing(false);
    } else {
      // Nếu đang tạo mới, xóa mục tạm thời
      const updatedProjects = projects.filter(proj => !proj._isTemp);
      setProjects(updatedProjects);
      updateData(updatedProjects);
    }
    
    setCurrentProject({
      title: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
      url: '',
      isPresent: false
    });
  };

  const handleUpdate = () => {
    if (validate()) {
      const newProjects = [...projects];
      newProjects[editIndex] = currentProject;
      setProjects(newProjects);
      updateData(newProjects);
      setCurrentProject({
        title: '',
        role: '',
        startDate: '',
        endDate: '',
        description: '',
        url: '',
        isPresent: false
      });
      setEditIndex(-1);
      setIsEditing(false);
    } else {
      alert('Please provide a project title.');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Title<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="title"
              value={currentProject.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 cv-input"
              placeholder="e.g., E-commerce Website"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              name="role"
              value={currentProject.role}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 cv-input"
              placeholder="e.g., Lead Developer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="text"
              name="url"
              value={currentProject.url}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 cv-input"
              placeholder="e.g., https://github.com/username/project"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={currentProject.startDate}
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
                  checked={currentProject.isPresent}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Present</span>
              </div>
            </div>
            <input
              type="date"
              name="endDate"
              value={currentProject.endDate}
              onChange={handleChange}
              disabled={currentProject.isPresent}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={currentProject.description}
          onChange={handleChange}
          rows="4"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 cv-textarea"
          placeholder="Describe your project, technologies used, and your role"
        ></textarea>
      </div>
      <div className="flex space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Project
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
              Add Project
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

      {projects.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Your Projects</h3>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index} className="p-4 border rounded-md bg-white cv-wrapper">
                <div className="flex justify-between">
                  <div className="cv-flex-item">
                    <h4 className="font-medium cv-long-text">{project.title}</h4>
                    {project.role && <p className="text-sm text-gray-600 cv-long-text">{project.role}</p>}
                    <p className="text-xs text-gray-500">
                      {project.startDate && new Date(project.startDate).toLocaleDateString()}
                      {project.isPresent 
                        ? ' - Present' 
                        : project.endDate 
                          ? ` - ${new Date(project.endDate).toLocaleDateString()}` 
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
                {project.description && (
                  <p className="mt-2 text-sm text-gray-600 cv-long-text">{project.description}</p>
                )}
                {project.url && (
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-1 text-xs text-blue-600 hover:underline block cv-long-text"
                  >
                    {project.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Đã xóa phần Previous và Next buttons */}
    </div>
  );
};

export default ProjectsStep; 