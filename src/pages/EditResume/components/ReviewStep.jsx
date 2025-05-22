import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';

const ReviewStep = ({ data, prevStep, handleSubmit, updateFormData }) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [localFormData, setLocalFormData] = useState(data);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  // Cập nhật localFormData khi prop data thay đổi
  useEffect(() => {
    setLocalFormData(data);
  }, [data]);

  // Đảm bảo input được focus khi bắt đầu chỉnh sửa
  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingField]);

  // Hàm tự động điều chỉnh chiều cao của textarea
  const adjustTextareaHeight = (element) => {
    if (element) {
      element.style.height = 'auto';
      element.style.height = element.scrollHeight + 'px';
    }
  };

  // Xử lý khi textarea thay đổi
  const handleTextareaChange = (e, fieldPath) => {
    handleInputChange(fieldPath, e.target.value);
    adjustTextareaHeight(e.target);
  };

  // Đảm bảo textarea có chiều cao đúng khi hiển thị
  useEffect(() => {
    if (editingField && textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
  }, [editingField]);

  // Hàm xử lý khi click vào một trường để chỉnh sửa
  const handleEditClick = (fieldPath) => {
    setEditingField(fieldPath);
  };

  // Hàm xử lý khi input thay đổi
  const handleInputChange = (fieldPath, value) => {
    // Tách đường dẫn trường, vd: "personalInfo.firstName"
    const pathParts = fieldPath.split('.');
    
    // Clone dữ liệu hiện tại
    const newData = {...localFormData};
    
    // Đi đến đúng vị trí trong dữ liệu và cập nhật giá trị
    let current = newData;
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]]) {
        current[pathParts[i]] = {};
      }
      current = current[pathParts[i]];
    }
    current[pathParts[pathParts.length - 1]] = value;
    
    // Cập nhật state local
    setLocalFormData(newData);
    
    // Cập nhật state form data ở component cha
    if (pathParts.length === 1) {
      // Nếu là trường dữ liệu ở cấp cao nhất (summary, skills,...)
      updateFormData(pathParts[0], newData[pathParts[0]]);
    } else if (pathParts.length > 1) {
      // Nếu là trường dữ liệu con (personalInfo.firstName,...)
      updateFormData(pathParts[0], newData[pathParts[0]]);
    }
  };

  // Kết thúc chỉnh sửa khi click ra ngoài
  const handleBlur = () => {
    setEditingField(null);
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setIsGenerating(true);
    
    try {
      // Giả lập quá trình tạo CV (sẽ thay thế bằng API call khi có backend)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Gọi hàm handleSubmit từ props
      handleSubmit();
      
      // Chuyển hướng đến trang Dashboard
      navigate('/dashboard', { 
        state: { message: 'Resume created successfully!' } 
      });
    } catch (error) {
      console.error('Error generating resume:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const getNestedValue = (obj, path) => {
    const pathParts = path.split('.');
    let current = obj;
    for (const part of pathParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }
    return current;
  };

  return (
    <div className="space-y-6 overflow-hidden">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Review Your Resume</h2>
      <p className="text-gray-600 mb-6">
        Click on any field to edit it directly. Changes will be reflected instantly in the preview.
      </p>

      <div className="space-y-8">
        {/* Personal Information */}
        <section className="overflow-hidden">
          <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 font-medium">First Name</p>
              {editingField === 'personalInfo.firstName' ? (
                <input
                  ref={inputRef}
                  type="text"
                  className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={localFormData.personalInfo?.firstName || ''}
                  onChange={(e) => handleInputChange('personalInfo.firstName', e.target.value)}
                  onBlur={handleBlur}
                />
              ) : (
                <p 
                  className="text-gray-800 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                  onClick={() => handleEditClick('personalInfo.firstName')}
                >
                  {localFormData.personalInfo?.firstName || '(Not specified)'}
                </p>
              )}
            </div>
            
            <div>
              <p className="text-gray-600 font-medium">Last Name</p>
              {editingField === 'personalInfo.lastName' ? (
                <input
                  ref={inputRef}
                  type="text"
                  className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                  value={localFormData.personalInfo?.lastName || ''}
                  onChange={(e) => handleInputChange('personalInfo.lastName', e.target.value)}
                  onBlur={handleBlur}
                />
              ) : (
                <p 
                  className="text-gray-800 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                  onClick={() => handleEditClick('personalInfo.lastName')}
                >
                  {localFormData.personalInfo?.lastName || '(Not specified)'}
                </p>
              )}
            </div>
            
            <div>
              <p className="text-gray-600 font-medium">Email</p>
              {editingField === 'personalInfo.email' ? (
                <input
                  ref={inputRef}
                  type="text"
                  className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                  value={localFormData.personalInfo?.email || ''}
                  onChange={(e) => handleInputChange('personalInfo.email', e.target.value)}
                  onBlur={handleBlur}
                />
              ) : (
                <p 
                  className="text-gray-800 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                  onClick={() => handleEditClick('personalInfo.email')}
                >
                  {localFormData.personalInfo?.email || '(Not specified)'}
                </p>
              )}
            </div>
            
            <div>
              <p className="text-gray-600 font-medium">Phone</p>
              {editingField === 'personalInfo.phone' ? (
                <input
                  ref={inputRef}
                  type="text"
                  className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                  value={localFormData.personalInfo?.phone || ''}
                  onChange={(e) => handleInputChange('personalInfo.phone', e.target.value)}
                  onBlur={handleBlur}
                />
              ) : (
                <p 
                  className="text-gray-800 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                  onClick={() => handleEditClick('personalInfo.phone')}
                >
                  {localFormData.personalInfo?.phone || '(Not specified)'}
                </p>
              )}
            </div>
            
            <div>
              <p className="text-gray-600 font-medium">Location</p>
              {editingField === 'personalInfo.location' ? (
                <input
                  ref={inputRef}
                  type="text"
                  className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                  value={localFormData.personalInfo?.location || ''}
                  onChange={(e) => handleInputChange('personalInfo.location', e.target.value)}
                  onBlur={handleBlur}
                />
              ) : (
                <p 
                  className="text-gray-800 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                  onClick={() => handleEditClick('personalInfo.location')}
                >
                  {localFormData.personalInfo?.location || '(Not specified)'}
                </p>
              )}
            </div>
            
            <div>
              <p className="text-gray-600 font-medium">Country</p>
              {editingField === 'personalInfo.country' ? (
                <input
                  ref={inputRef}
                  type="text"
                  className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                  value={localFormData.personalInfo?.country || ''}
                  onChange={(e) => handleInputChange('personalInfo.country', e.target.value)}
                  onBlur={handleBlur}
                />
              ) : (
                <p 
                  className="text-gray-800 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                  onClick={() => handleEditClick('personalInfo.country')}
                >
                  {localFormData.personalInfo?.country || '(Not specified)'}
                </p>
              )}
            </div>
            
            <div>
              <p className="text-gray-600 font-medium">Professional Headline</p>
              {editingField === 'personalInfo.professionalHeadline' ? (
                <input
                  ref={inputRef}
                  type="text"
                  className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                  value={localFormData.personalInfo?.professionalHeadline || ''}
                  onChange={(e) => handleInputChange('personalInfo.professionalHeadline', e.target.value)}
                  onBlur={handleBlur}
                />
              ) : (
                <p 
                  className="text-gray-800 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                  onClick={() => handleEditClick('personalInfo.professionalHeadline')}
                >
                  {localFormData.personalInfo?.professionalHeadline || '(Not specified)'}
                </p>
              )}
            </div>
            
            <div>
              <p className="text-gray-600 font-medium">Website</p>
              {editingField === 'personalInfo.website' ? (
                <input
                  ref={inputRef}
                  type="text"
                  className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                  value={localFormData.personalInfo?.website || ''}
                  onChange={(e) => handleInputChange('personalInfo.website', e.target.value)}
                  onBlur={handleBlur}
                />
              ) : (
                <p 
                  className="text-gray-800 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                  onClick={() => handleEditClick('personalInfo.website')}
                >
                  {localFormData.personalInfo?.website || '(Not specified)'}
                </p>
              )}
            </div>
            
            <div>
              <p className="text-gray-600 font-medium">LinkedIn</p>
              {editingField === 'personalInfo.linkedin' ? (
                <input
                  ref={inputRef}
                  type="text"
                  className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                  value={localFormData.personalInfo?.linkedin || ''}
                  onChange={(e) => handleInputChange('personalInfo.linkedin', e.target.value)}
                  onBlur={handleBlur}
                />
              ) : (
                <p 
                  className="text-gray-800 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                  onClick={() => handleEditClick('personalInfo.linkedin')}
                >
                  {localFormData.personalInfo?.linkedin || '(Not specified)'}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Summary */}
        {localFormData.summary !== undefined && (
          <section className="col-span-2 overflow-hidden">
            <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
              Professional Summary
            </h3>
            <div>
              <p className="text-gray-600 font-medium">Summary</p>
              {editingField === 'summary' ? (
                <textarea
                  ref={textareaRef}
                  className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 cv-textarea resize-none overflow-hidden"
                  value={localFormData.summary || ''}
                  onChange={(e) => handleTextareaChange(e, 'summary')}
                  onBlur={handleBlur}
                  rows={1}
                />
              ) : (
                <p 
                  className="text-gray-800 break-words cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors whitespace-pre-wrap"
                  onClick={() => handleEditClick('summary')}
                  title="Click to edit"
                >
                  {localFormData.summary || '(Not specified)'}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {localFormData.experience && localFormData.experience.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
              Work Experience
            </h3>
            <div className="space-y-4">
              {localFormData.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4 py-2 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-gray-600 font-medium">Position</p>
                    {editingField === `experience.${index}.position` ? (
                      <input
                        ref={inputRef}
                        type="text"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                        value={exp.position || ''}
                        onChange={(e) => handleInputChange(`experience.${index}.position`, e.target.value)}
                        onBlur={handleBlur}
                      />
                    ) : (
                      <p 
                        className="font-medium text-gray-800 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                        onClick={() => handleEditClick(`experience.${index}.position`)}
                      >
                        {exp.position || '(Not specified)'}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-gray-600 font-medium">Company</p>
                    {editingField === `experience.${index}.company` ? (
                      <input
                        ref={inputRef}
                        type="text"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                        value={exp.company || ''}
                        onChange={(e) => handleInputChange(`experience.${index}.company`, e.target.value)}
                        onBlur={handleBlur}
                      />
                    ) : (
                      <p 
                        className="text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                        onClick={() => handleEditClick(`experience.${index}.company`)}
                      >
                        {exp.company || '(Not specified)'}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-gray-600 font-medium">Description</p>
                    {editingField === `experience.${index}.description` ? (
                      <textarea
                        ref={textareaRef}
                        className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 cv-textarea resize-none overflow-hidden"
                        value={exp.description || ''}
                        onChange={(e) => handleTextareaChange(e, `experience.${index}.description`)}
                        onBlur={handleBlur}
                        rows={1}
                      />
                    ) : (
                      <p 
                        className="mt-1 text-gray-700 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                        onClick={() => handleEditClick(`experience.${index}.description`)}
                      >
                        {exp.description || '(No description provided)'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {localFormData.skills && localFormData.skills.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
              Skills
            </h3>
            <div className="border-l-4 border-blue-400 pl-4 py-2 hover:bg-gray-50 transition-colors">
              <p className="text-gray-600 font-medium mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {localFormData.skills.map((skill, index) => (
                <div key={index} className="relative">
                  {editingField === `skills.${index}` ? (
                    <input
                      ref={inputRef}
                      type="text"
                      className="border border-gray-300 rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                      value={skill}
                      onChange={(e) => handleInputChange(`skills.${index}`, e.target.value)}
                      onBlur={handleBlur}
                      size={skill.length + 2}
                    />
                  ) : (
                    <span 
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-200 transition-colors break-words"
                      onClick={() => handleEditClick(`skills.${index}`)}
                    >
                      {skill}
                    </span>
                  )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Education Section */}
        {localFormData.education && localFormData.education.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
              Education
            </h3>
            <div className="space-y-4">
              {localFormData.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-gray-600 font-medium">Institution</p>
                    {editingField === `education.${index}.institution` ? (
                      <input
                        ref={inputRef}
                        type="text"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                        value={edu.institution || ''}
                        onChange={(e) => handleInputChange(`education.${index}.institution`, e.target.value)}
                        onBlur={handleBlur}
                      />
                    ) : (
                      <p 
                        className="font-medium text-gray-800 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                        onClick={() => handleEditClick(`education.${index}.institution`)}
                      >
                        {edu.institution || '(Not specified)'}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-gray-600 font-medium">Degree</p>
                    {editingField === `education.${index}.degree` ? (
                      <input
                        ref={inputRef}
                        type="text"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                        value={edu.degree || ''}
                        onChange={(e) => handleInputChange(`education.${index}.degree`, e.target.value)}
                        onBlur={handleBlur}
                      />
                    ) : (
                      <p 
                        className="text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                        onClick={() => handleEditClick(`education.${index}.degree`)}
                      >
                        {edu.degree || '(Not specified)'}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-gray-600 font-medium">Field of Study</p>
                    {editingField === `education.${index}.field` ? (
                      <input
                        ref={inputRef}
                        type="text"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                        value={edu.field || ''}
                        onChange={(e) => handleInputChange(`education.${index}.field`, e.target.value)}
                        onBlur={handleBlur}
                      />
                    ) : (
                      <p 
                        className="text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                        onClick={() => handleEditClick(`education.${index}.field`)}
                      >
                        {edu.field || '(Not specified)'}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-gray-600 font-medium">Start Date</p>
                      {editingField === `education.${index}.startDate` ? (
                        <input
                          ref={inputRef}
                          type="date"
                          className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                          value={edu.startDate || ''}
                          onChange={(e) => handleInputChange(`education.${index}.startDate`, e.target.value)}
                          onBlur={handleBlur}
                        />
                      ) : (
                        <p 
                          className="text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                          onClick={() => handleEditClick(`education.${index}.startDate`)}
                        >
                          {edu.startDate ? formatDate(edu.startDate) : '(Not specified)'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-gray-600 font-medium">End Date</p>
                      {editingField === `education.${index}.endDate` ? (
                        <input
                          ref={inputRef}
                          type="date"
                          className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                          value={edu.endDate || ''}
                          onChange={(e) => handleInputChange(`education.${index}.endDate`, e.target.value)}
                          onBlur={handleBlur}
                          disabled={edu.isPresent}
                        />
                      ) : (
                        <p 
                          className="text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                          onClick={() => handleEditClick(`education.${index}.endDate`)}
                        >
                          {edu.isPresent ? 'Present' : (edu.endDate ? formatDate(edu.endDate) : '(Not specified)')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-gray-600 font-medium">Description</p>
                    {editingField === `education.${index}.description` ? (
                      <textarea
                        ref={textareaRef}
                        className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 cv-textarea resize-none overflow-hidden"
                        value={edu.description || ''}
                        onChange={(e) => handleTextareaChange(e, `education.${index}.description`)}
                        onBlur={handleBlur}
                        rows={1}
                      />
                    ) : (
                      <p 
                        className="mt-1 text-gray-700 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                        onClick={() => handleEditClick(`education.${index}.description`)}
                      >
                        {edu.description || '(No description provided)'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {localFormData.projects && localFormData.projects.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
              Projects
            </h3>
            <div className="space-y-4">
              {localFormData.projects.map((project, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-4 py-2 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-gray-600 font-medium">Project Title</p>
                    {editingField === `projects.${index}.title` ? (
                      <input
                        ref={inputRef}
                        type="text"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                        value={project.title || ''}
                        onChange={(e) => handleInputChange(`projects.${index}.title`, e.target.value)}
                        onBlur={handleBlur}
                      />
                    ) : (
                      <p 
                        className="font-medium text-gray-800 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                        onClick={() => handleEditClick(`projects.${index}.title`)}
                      >
                        {project.title || '(Not specified)'}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-gray-600 font-medium">Role</p>
                    {editingField === `projects.${index}.role` ? (
                      <input
                        ref={inputRef}
                        type="text"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                        value={project.role || ''}
                        onChange={(e) => handleInputChange(`projects.${index}.role`, e.target.value)}
                        onBlur={handleBlur}
                      />
                    ) : (
                      <p 
                        className="text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                        onClick={() => handleEditClick(`projects.${index}.role`)}
                      >
                        {project.role || '(Not specified)'}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-gray-600 font-medium">Start Date</p>
                      {editingField === `projects.${index}.startDate` ? (
                        <input
                          ref={inputRef}
                          type="date"
                          className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                          value={project.startDate || ''}
                          onChange={(e) => handleInputChange(`projects.${index}.startDate`, e.target.value)}
                          onBlur={handleBlur}
                        />
                      ) : (
                        <p 
                          className="text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                          onClick={() => handleEditClick(`projects.${index}.startDate`)}
                        >
                          {project.startDate ? formatDate(project.startDate) : '(Not specified)'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-gray-600 font-medium">End Date</p>
                      {editingField === `projects.${index}.endDate` ? (
                        <input
                          ref={inputRef}
                          type="date"
                          className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                          value={project.endDate || ''}
                          onChange={(e) => handleInputChange(`projects.${index}.endDate`, e.target.value)}
                          onBlur={handleBlur}
                          disabled={project.isPresent}
                        />
                      ) : (
                        <p 
                          className="text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                          onClick={() => handleEditClick(`projects.${index}.endDate`)}
                        >
                          {project.isPresent ? 'Present' : (project.endDate ? formatDate(project.endDate) : '(Not specified)')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-gray-600 font-medium">Description</p>
                    {editingField === `projects.${index}.description` ? (
                      <textarea
                        ref={textareaRef}
                        className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 cv-textarea resize-none overflow-hidden"
                        value={project.description || ''}
                        onChange={(e) => handleTextareaChange(e, `projects.${index}.description`)}
                        onBlur={handleBlur}
                        rows={1}
                      />
                    ) : (
                      <p 
                        className="mt-1 text-gray-700 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                        onClick={() => handleEditClick(`projects.${index}.description`)}
                      >
                        {project.description || '(No description provided)'}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-gray-600 font-medium">URL</p>
                    {editingField === `projects.${index}.url` ? (
                      <input
                        ref={inputRef}
                        type="url"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                        value={project.url || ''}
                        onChange={(e) => handleInputChange(`projects.${index}.url`, e.target.value)}
                        onBlur={handleBlur}
                      />
                    ) : (
                      <p 
                        className="text-blue-600 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                        onClick={() => handleEditClick(`projects.${index}.url`)}
                      >
                        {project.url || '(No URL provided)'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {localFormData.certifications && localFormData.certifications.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
              Certifications
            </h3>
            <div className="space-y-4">
              {localFormData.certifications.map((cert, index) => (
                <div key={index} className="border-l-4 border-yellow-500 pl-4 py-2 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-gray-600 font-medium">Certification Name</p>
                    {editingField === `certifications.${index}.name` ? (
                      <input
                        ref={inputRef}
                        type="text"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                        value={cert.name || ''}
                        onChange={(e) => handleInputChange(`certifications.${index}.name`, e.target.value)}
                        onBlur={handleBlur}
                      />
                    ) : (
                      <p 
                        className="font-medium text-gray-800 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                        onClick={() => handleEditClick(`certifications.${index}.name`)}
                      >
                        {cert.name || '(Not specified)'}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-gray-600 font-medium">Issuing Organization</p>
                    {editingField === `certifications.${index}.issuer` ? (
                      <input
                        ref={inputRef}
                        type="text"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                        value={cert.issuer || ''}
                        onChange={(e) => handleInputChange(`certifications.${index}.issuer`, e.target.value)}
                        onBlur={handleBlur}
                      />
                    ) : (
                      <p 
                        className="text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                        onClick={() => handleEditClick(`certifications.${index}.issuer`)}
                      >
                        {cert.issuer || '(Not specified)'}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-gray-600 font-medium">Issue Date</p>
                      {editingField === `certifications.${index}.issueDate` ? (
                        <input
                          ref={inputRef}
                          type="date"
                          className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                          value={cert.issueDate || ''}
                          onChange={(e) => handleInputChange(`certifications.${index}.issueDate`, e.target.value)}
                          onBlur={handleBlur}
                        />
                      ) : (
                        <p 
                          className="text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                          onClick={() => handleEditClick(`certifications.${index}.issueDate`)}
                        >
                          {cert.issueDate ? formatDate(cert.issueDate) : '(Not specified)'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-gray-600 font-medium">Expiration Date</p>
                      {editingField === `certifications.${index}.expirationDate` ? (
                        <input
                          ref={inputRef}
                          type="date"
                          className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                          value={cert.expirationDate || ''}
                          onChange={(e) => handleInputChange(`certifications.${index}.expirationDate`, e.target.value)}
                          onBlur={handleBlur}
                          disabled={cert.doesNotExpire}
                        />
                      ) : (
                        <p 
                          className="text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                          onClick={() => handleEditClick(`certifications.${index}.expirationDate`)}
                        >
                          {cert.doesNotExpire ? 'No Expiration' : (cert.expirationDate ? formatDate(cert.expirationDate) : '(Not specified)')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-gray-600 font-medium">Credential URL</p>
                    {editingField === `certifications.${index}.credentialURL` ? (
                      <input
                        ref={inputRef}
                        type="url"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                        value={cert.credentialURL || ''}
                        onChange={(e) => handleInputChange(`certifications.${index}.credentialURL`, e.target.value)}
                        onBlur={handleBlur}
                      />
                    ) : (
                      <p 
                        className="text-blue-600 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                        onClick={() => handleEditClick(`certifications.${index}.credentialURL`)}
                      >
                        {cert.credentialURL || '(No URL provided)'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages Section */}
        {localFormData.languages && localFormData.languages.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
              Languages
            </h3>
            <div className="space-y-4">
              {localFormData.languages.map((lang, index) => (
                <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 font-medium">Language</p>
                      {editingField === `languages.${index}.language` ? (
                        <input
                          ref={inputRef}
                          type="text"
                          className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                          value={lang.language || ''}
                          onChange={(e) => handleInputChange(`languages.${index}.language`, e.target.value)}
                          onBlur={handleBlur}
                        />
                      ) : (
                        <p 
                          className="font-medium text-gray-800 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                          onClick={() => handleEditClick(`languages.${index}.language`)}
                        >
                          {lang.language || '(Not specified)'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-gray-600 font-medium">Proficiency</p>
                      {editingField === `languages.${index}.proficiency` ? (
                        <select
                          ref={inputRef}
                          className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                          value={lang.proficiency || 'Beginner'}
                          onChange={(e) => handleInputChange(`languages.${index}.proficiency`, e.target.value)}
                          onBlur={handleBlur}
                        >
                          <option value="Native">Native</option>
                          <option value="Fluent">Fluent</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Elementary">Elementary</option>
                        </select>
                      ) : (
                        <p 
                          className="text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                          onClick={() => handleEditClick(`languages.${index}.proficiency`)}
                        >
                          {lang.proficiency || 'Beginner'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Activities Section */}
        {localFormData.activities && localFormData.activities.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
              Volunteer Activities
            </h3>
            <div className="space-y-4">
              {localFormData.activities.map((activity, index) => (
                <div key={index} className="border-l-4 border-pink-500 pl-4 py-2 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-gray-600 font-medium">Organization</p>
                    {editingField === `activities.${index}.organization` ? (
                      <input
                        ref={inputRef}
                        type="text"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                        value={activity.organization || ''}
                        onChange={(e) => handleInputChange(`activities.${index}.organization`, e.target.value)}
                        onBlur={handleBlur}
                      />
                    ) : (
                      <p 
                        className="font-medium text-gray-800 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                        onClick={() => handleEditClick(`activities.${index}.organization`)}
                      >
                        {activity.organization || '(Not specified)'}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-gray-600 font-medium">Role</p>
                    {editingField === `activities.${index}.role` ? (
                      <input
                        ref={inputRef}
                        type="text"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                        value={activity.role || ''}
                        onChange={(e) => handleInputChange(`activities.${index}.role`, e.target.value)}
                        onBlur={handleBlur}
                      />
                    ) : (
                      <p 
                        className="text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                        onClick={() => handleEditClick(`activities.${index}.role`)}
                      >
                        {activity.role || '(Not specified)'}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-gray-600 font-medium">Start Date</p>
                      {editingField === `activities.${index}.startDate` ? (
                        <input
                          ref={inputRef}
                          type="date"
                          className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                          value={activity.startDate || ''}
                          onChange={(e) => handleInputChange(`activities.${index}.startDate`, e.target.value)}
                          onBlur={handleBlur}
                        />
                      ) : (
                        <p 
                          className="text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                          onClick={() => handleEditClick(`activities.${index}.startDate`)}
                        >
                          {activity.startDate ? formatDate(activity.startDate) : '(Not specified)'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-gray-600 font-medium">End Date</p>
                      {editingField === `activities.${index}.endDate` ? (
                        <input
                          ref={inputRef}
                          type="date"
                          className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full overflow-x-auto"
                          value={activity.endDate || ''}
                          onChange={(e) => handleInputChange(`activities.${index}.endDate`, e.target.value)}
                          onBlur={handleBlur}
                          disabled={activity.isPresent}
                        />
                      ) : (
                        <p 
                          className="text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                          onClick={() => handleEditClick(`activities.${index}.endDate`)}
                        >
                          {activity.isPresent ? 'Present' : (activity.endDate ? formatDate(activity.endDate) : '(Not specified)')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-gray-600 font-medium">Description</p>
                    {editingField === `activities.${index}.description` ? (
                      <textarea
                        ref={textareaRef}
                        className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 cv-textarea resize-none overflow-hidden"
                        value={activity.description || ''}
                        onChange={(e) => handleTextareaChange(e, `activities.${index}.description`)}
                        onBlur={handleBlur}
                        rows={1}
                      />
                    ) : (
                      <p 
                        className="mt-1 text-gray-700 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors break-words"
                        onClick={() => handleEditClick(`activities.${index}.description`)}
                      >
                        {activity.description || '(No description provided)'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Additional Info Section */}
        {localFormData.additionalInfo && (
          <section>
            <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
              Additional Information
            </h3>
            
            <div className="space-y-4">
              {/* Interests - Chỉ hiển thị khi có dữ liệu */}
              {localFormData.additionalInfo.interests && (
                <div className="border-l-4 border-teal-500 pl-4 py-2 hover:bg-gray-50 transition-colors">
                  <p className="text-gray-600 font-medium">Interests</p>
                  {editingField === 'additionalInfo.interests' ? (
                    <textarea
                      ref={textareaRef}
                      className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 cv-textarea resize-none overflow-hidden"
                      value={localFormData.additionalInfo.interests || ''}
                      onChange={(e) => handleTextareaChange(e, 'additionalInfo.interests')}
                      onBlur={handleBlur}
                      rows={1}
                    />
                  ) : (
                    <div 
                      className="text-gray-800 break-words cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                      onClick={() => handleEditClick('additionalInfo.interests')}
                      title="Click to edit"
                    >
                      <ul className="list-disc pl-5">
                        {localFormData.additionalInfo.interests.split('\n').filter(item => item.trim() !== '').map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {/* Achievements - Chỉ hiển thị khi có dữ liệu */}
              {localFormData.additionalInfo.achievements && (
                <div className="border-l-4 border-teal-500 pl-4 py-2 hover:bg-gray-50 transition-colors">
                  <p className="text-gray-600 font-medium">Achievements</p>
                  {editingField === 'additionalInfo.achievements' ? (
                    <textarea
                      ref={textareaRef}
                      className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 cv-textarea resize-none overflow-hidden"
                      value={localFormData.additionalInfo.achievements || ''}
                      onChange={(e) => handleTextareaChange(e, 'additionalInfo.achievements')}
                      onBlur={handleBlur}
                      rows={1}
                    />
                  ) : (
                    <div 
                      className="text-gray-800 break-words cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                      onClick={() => handleEditClick('additionalInfo.achievements')}
                      title="Click to edit"
                    >
                      <ul className="list-disc pl-5">
                        {localFormData.additionalInfo.achievements.split('\n').filter(item => item.trim() !== '').map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {/* Publications - Chỉ hiển thị khi có dữ liệu */}
              {localFormData.additionalInfo.publications && (
                <div className="border-l-4 border-teal-500 pl-4 py-2 hover:bg-gray-50 transition-colors">
                  <p className="text-gray-600 font-medium">Publications</p>
                  {editingField === 'additionalInfo.publications' ? (
                    <textarea
                      ref={textareaRef}
                      className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 cv-textarea resize-none overflow-hidden"
                      value={localFormData.additionalInfo.publications || ''}
                      onChange={(e) => handleTextareaChange(e, 'additionalInfo.publications')}
                      onBlur={handleBlur}
                      rows={1}
                    />
                  ) : (
                    <div 
                      className="text-gray-800 break-words cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                      onClick={() => handleEditClick('additionalInfo.publications')}
                      title="Click to edit"
                    >
                      <ul className="list-disc pl-5">
                        {localFormData.additionalInfo.publications.split('\n').filter(item => item.trim() !== '').map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {/* References Section */}
              {localFormData.additionalInfo.references && (
                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">References</h2>
                    <button 
                      onClick={() => handleEditClick('additionalInfo.references')}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit />
                    </button>
                  </div>
                  
                  {editingField === 'additionalInfo.references' ? (
                    <textarea
                      value={localFormData.additionalInfo.references}
                      onChange={(e) => handleInputChange('additionalInfo.references', e.target.value)}
                      className="w-full p-2 border rounded mt-2 cv-textarea max-w-full overflow-x-auto"
                      rows={5}
                      onBlur={handleBlur}
                    />
                  ) : (
                    <div className="mt-2 space-y-3">
                      {localFormData.additionalInfo.references.split('\n').filter(item => item.trim() !== '').map((refString, index) => {
                        try {
                          const ref = JSON.parse(refString);
                          return (
                            <div key={index} className="p-3 bg-gray-50 rounded-md">
                              <div className="font-medium">{ref.name}</div>
                              {ref.position && <div>{ref.position}{ref.company ? `, ${ref.company}` : ''}</div>}
                              {(ref.email || ref.phone) && (
                                <div className="text-sm text-gray-600">
                                  {ref.email}
                                  {ref.email && ref.phone && " • "}
                                  {ref.phone}
                                </div>
                              )}
                              {ref.relationship && <div className="text-sm mt-1">{ref.relationship}</div>}
                              {ref.available && <div className="text-sm italic">Available upon request</div>}
                            </div>
                          );
                        } catch (e) {
                          return <div key={index} className="p-3 bg-gray-50 rounded-md">{refString}</div>;
                        }
                      })}
                    </div>
                  )}
                </div>
              )}
              
              {/* Custom Sections - Hiển thị nếu có */}
              {localFormData.additionalInfo.customSections && localFormData.additionalInfo.customSections.length > 0 && (
                localFormData.additionalInfo.customSections.map((section, idx) => (
                  section.title && section.content && (
                    <div key={idx} className="border-l-4 border-teal-500 pl-4 py-2 hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-gray-600 font-medium">Custom: {section.title}</p>
                        {editingField === `additionalInfo.customSections.${idx}.content` ? (
                          <textarea
                            ref={textareaRef}
                            className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 cv-textarea resize-none overflow-hidden"
                            value={section.content || ''}
                            onChange={(e) => handleTextareaChange(e, `additionalInfo.customSections.${idx}.content`)}
                            onBlur={handleBlur}
                            rows={1}
                          />
                        ) : (
                          <p 
                            className="text-gray-800 break-words cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                            onClick={() => handleEditClick(`additionalInfo.customSections.${idx}.content`)}
                          >
                            {section.content}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                ))
              )}
            </div>
          </section>
        )}
      </div>

      <div className="mt-10">
        <form onSubmit={handleReviewSubmit} className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Ready to Generate Your CV?</h3>
            <p className="text-gray-700">
              Click the button below to generate your professional CV. You can download, share, or edit it later from your dashboard.
            </p>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Previous
            </button>
            <button
              type="submit"
              disabled={isGenerating || editingField !== null}
              className={`px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                isGenerating || editingField !== null ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center`}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating CV...
                </>
              ) : (
                <>
                  Generate CV
                  <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewStep; 