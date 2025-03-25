import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiX, FiInfo, FiStar, FiBook, FiUser } from 'react-icons/fi';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AdditionalInfoStep = ({ data, updateData, nextStep, prevStep, hideTitle = false }) => {
  // State cho dữ liệu
  const [additionalInfo, setAdditionalInfo] = useState({
    interests: '',
    achievements: '',
    publications: '',
    references: '',
    customSections: []
  });

  // State cho việc edit trực tiếp
  const [editingField, setEditingField] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState('');
  const inputRef = useRef(null);

  // State cho new item inputs
  const [newInterest, setNewInterest] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [newPublication, setNewPublication] = useState('');
  
  // State cho references
  const [newReference, setNewReference] = useState({
    name: '',
    position: '',
    company: '',
    email: '',
    phone: '',
    relationship: '',
    available: false
  });
  
  // Để tracking chuỗi dưới dạng mảng
  const [interestsList, setInterestsList] = useState([]);
  const [achievementsList, setAchievementsList] = useState([]);
  const [publicationsList, setPublicationsList] = useState([]);
  const [referencesList, setReferencesList] = useState([]);

  // Thêm state cho việc edit reference trực tiếp
  const [editingReference, setEditingReference] = useState(null);

  // Cập nhật state từ data khi props thay đổi
  useEffect(() => {
    if (data) {
      const newInfo = {
        interests: data.interests || '',
        achievements: data.achievements || '',
        publications: data.publications || '',
        references: data.references || '',
        customSections: data.customSections || []
      };
      
      setAdditionalInfo(newInfo);
      
      // Cập nhật các danh sách
      setInterestsList(parseTextToArray(newInfo.interests));
      setAchievementsList(parseTextToArray(newInfo.achievements));
      setPublicationsList(parseTextToArray(newInfo.publications));
      setReferencesList(parseTextToArray(newInfo.references));
    }
  }, [data]);

  // Focus input khi bắt đầu edit
  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingField]);

  // Hàm chuyển đổi từ chuỗi ngăn cách bởi dòng mới thành mảng
  const parseTextToArray = (text) => {
    if (!text) return [];
    return text.split('\n').filter(item => item.trim() !== '');
  };

  // Hàm chuyển đổi từ mảng thành chuỗi ngăn cách bởi dòng mới
  const parseArrayToText = (arr) => {
    if (!arr || !Array.isArray(arr)) return '';
    return arr.join('\n');
  };

  // Hàm xử lý khi click vào một trường để edit
  const handleEditClick = (fieldName, index = null) => {
    const editKey = index !== null ? `${fieldName}.${index}` : fieldName;
    setEditingField(editKey);
  };

  // Hàm xử lý khi input thay đổi
  const handleDirectEdit = (fieldName, value, index = null) => {
    let updatedInfo = { ...additionalInfo };
    
    if (index !== null) {
      // Đang edit một item cụ thể trong list
      let updatedList = [];
      
      switch (fieldName) {
        case 'interests':
          updatedList = [...interestsList];
          updatedList[index] = value;
          setInterestsList(updatedList);
          updatedInfo.interests = parseArrayToText(updatedList);
          break;
        case 'achievements':
          updatedList = [...achievementsList];
          updatedList[index] = value;
          setAchievementsList(updatedList);
          updatedInfo.achievements = parseArrayToText(updatedList);
          break;
        case 'publications':
          updatedList = [...publicationsList];
          updatedList[index] = value;
          setPublicationsList(updatedList);
          updatedInfo.publications = parseArrayToText(updatedList);
          break;
        case 'references':
          updatedList = [...referencesList];
          updatedList[index] = value;
          setReferencesList(updatedList);
          updatedInfo.references = parseArrayToText(updatedList);
          break;
        default:
          break;
      }
    } else {
      // Đang edit một trường text
      updatedInfo[fieldName] = value;
    }
    
    setAdditionalInfo(updatedInfo);
    updateData(updatedInfo);
  };

  // Hàm thêm mục mới
  const handleAddItem = (value, listName) => {
    if (value.trim()) {
      let updated, updatedField;
      
      // Cập nhật danh sách tương ứng
      switch (listName) {
        case 'interests':
          updated = [...interestsList, value.trim()];
          setInterestsList(updated);
          updatedField = 'interests';
          setNewInterest('');
          break;
        case 'achievements':
          updated = [...achievementsList, value.trim()];
          setAchievementsList(updated);
          updatedField = 'achievements';
          setNewAchievement('');
          break;
        case 'publications':
          updated = [...publicationsList, value.trim()];
          setPublicationsList(updated);
          updatedField = 'publications';
          setNewPublication('');
          break;
        default:
          return;
      }
      
      // Cập nhật chuỗi trong additionalInfo
      const updatedInfo = { ...additionalInfo };
      updatedInfo[updatedField] = parseArrayToText(updated);
      setAdditionalInfo(updatedInfo);
      updateData(updatedInfo);
    }
  };
  
  // Hàm xử lý thêm reference mới
  const handleAddReference = () => {
    if (newReference.name.trim() && newReference.position.trim()) {
      // Tạo object reference
      const reference = {
        name: newReference.name.trim(),
        position: newReference.position.trim(),
        company: newReference.company.trim(),
        email: newReference.email.trim(),
        phone: newReference.phone.trim(),
        relationship: newReference.relationship.trim(),
        available: newReference.available
      };
      
      const referenceText = JSON.stringify(reference);
      const updated = [...referencesList, referenceText];
      setReferencesList(updated);
      
      const updatedInfo = { ...additionalInfo };
      updatedInfo.references = parseArrayToText(updated);
      setAdditionalInfo(updatedInfo);
      updateData(updatedInfo);
      
      // Reset form
      setNewReference({
        name: '',
        position: '',
        company: '',
        email: '',
        phone: '',
        relationship: '',
        available: false
      });
    } else {
      alert('Please provide at least the name and position for the reference.');
    }
  };

  // Hàm xóa mục
  const handleRemoveItem = (index, listName) => {
    let updated, updatedField;
    
    // Cập nhật danh sách tương ứng
    switch (listName) {
      case 'interests':
        updated = interestsList.filter((_, i) => i !== index);
        setInterestsList(updated);
        updatedField = 'interests';
        break;
      case 'achievements':
        updated = achievementsList.filter((_, i) => i !== index);
        setAchievementsList(updated);
        updatedField = 'achievements';
        break;
      case 'publications':
        updated = publicationsList.filter((_, i) => i !== index);
        setPublicationsList(updated);
        updatedField = 'publications';
        break;
      case 'references':
        updated = referencesList.filter((_, i) => i !== index);
        setReferencesList(updated);
        updatedField = 'references';
        break;
      default:
        return;
    }
    
    // Cập nhật chuỗi trong additionalInfo
    const updatedInfo = { ...additionalInfo };
    updatedInfo[updatedField] = parseArrayToText(updated);
    setAdditionalInfo(updatedInfo);
    updateData(updatedInfo);
  };

  // Hàm xử lý khi nhấn phím tắt trong input
  const handleKeyDown = (e, value, listName) => {
    if (e.key === 'Enter') {
      // Enter để thêm mục trong interests
      if (listName === 'interests') {
        e.preventDefault();
        handleAddItem(value, listName);
      } 
      // Enter để thêm mục trong achievements, publications (thay vì Ctrl+Enter)
      else if (listName === 'achievements' || listName === 'publications') {
        e.preventDefault();
        handleAddItem(value, listName);
      }
    }
  };

  // Kết thúc chỉnh sửa khi blur
  const handleBlur = () => {
    setEditingField(null);
  };

  // Xử lý thay đổi input cho reference fields
  const handleReferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewReference(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Lưu tất cả thay đổi và chuyển trang
  const handleSaveChanges = () => {
    if (nextStep) nextStep();
  };

  // Lấy thông tin reference từ chuỗi JSON
  const parseReferenceFromString = (refString) => {
    try {
      return JSON.parse(refString);
    } catch (e) {
      // Nếu không phải JSON, thử xử lý dạng text thông thường
      const parts = refString.split(',').map(part => part.trim());
      return {
        name: parts[0] || '',
        position: parts[1] || '',
        company: parts[2] || '',
        email: parts[3] || '',
        phone: parts[4] || '',
        relationship: parts[5] || '',
        available: refString.includes('Available upon request')
      };
    }
  };

  // Hàm mới xử lý click edit reference
  const handleEditReference = (index) => {
    try {
      const ref = parseReferenceFromString(referencesList[index]);
      setEditingReference({...ref, index});
    } catch (e) {
      console.error("Error parsing reference:", e);
    }
  };

  // Hàm mới xử lý thay đổi giá trị khi edit reference
  const handleEditReferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingReference(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Hàm mới xử lý cập nhật reference sau khi edit
  const handleUpdateReference = () => {
    if (editingReference && editingReference.name && editingReference.position) {
      const { index, ...refData } = editingReference;
      
      // Cập nhật giá trị trong mảng
      const updatedList = [...referencesList];
      updatedList[index] = JSON.stringify(refData);
      
      // Cập nhật state và data
      setReferencesList(updatedList);
      const updatedInfo = { ...additionalInfo };
      updatedInfo.references = parseArrayToText(updatedList);
      setAdditionalInfo(updatedInfo);
      updateData(updatedInfo);
      
      // Reset form edit
      setEditingReference(null);
    } else {
      alert('Please provide at least the name and position for the reference.');
    }
  };

  // Hàm hủy edit reference
  const handleCancelEditReference = () => {
    setEditingReference(null);
  };

  return (
    <div className="space-y-6">
      {!hideTitle && <h2 className="text-2xl font-bold mb-6">Additional Information</h2>}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Additional Information</h2>
          {!hideTitle && (
            <button className="text-gray-400 hover:text-gray-600 text-xl" onClick={prevStep}>
              <FiX />
            </button>
          )}
        </div>

        {/* Interests Section */}
        <div className="mb-6 relative">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <FiStar className="mr-2 text-gray-600" />
              <span className="font-medium text-gray-700">Interests</span>
              <div className="relative ml-2">
                <FiInfo 
                  className="text-gray-400 cursor-help"
                  onMouseEnter={() => setActiveTooltip('interests')}
                  onMouseLeave={() => setActiveTooltip('')}
                />
                {activeTooltip === 'interests' && (
                  <div className="absolute z-10 top-full right-0 mt-1 bg-gray-800 text-white text-xs rounded py-1 px-2 w-60">
                    Add your hobbies, interests, and activities that demonstrate skills or personal qualities.
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, newInterest, 'interests')}
            placeholder="Programming, Photography, Travel, Music Production, Hiking..."
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Press Enter to add each interest</span>
            <span>Recommended: 3-5 items</span>
          </div>
          
          {interestsList.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {interestsList.map((interest, index) => (
                <div key={index} className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-md flex items-center text-sm">
                  {editingField === `interests.${index}` ? (
                    <input
                      ref={inputRef}
                      type="text"
                      className="px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={interest}
                      onChange={(e) => handleDirectEdit('interests', e.target.value, index)}
                      onBlur={handleBlur}
                      onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
                    />
                  ) : (
                    <>
                      <span className="cursor-pointer" onClick={() => handleEditClick('interests', index)}>
                        {interest}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(index, 'interests')}
                        className="ml-2 text-gray-400 hover:text-red-500"
                      >
                        <FiX size={14} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements Section */}
        <div className="mb-6 relative">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <FiStar className="mr-2 text-gray-600" />
              <span className="font-medium text-gray-700">Achievements</span>
              <div className="relative ml-2">
                <FiInfo 
                  className="text-gray-400 cursor-help"
                  onMouseEnter={() => setActiveTooltip('achievements')}
                  onMouseLeave={() => setActiveTooltip('')}
                />
                {activeTooltip === 'achievements' && (
                  <div className="absolute z-10 top-full right-0 mt-1 bg-gray-800 text-white text-xs rounded py-1 px-2 w-60">
                    Include awards, recognition, or personal accomplishments that enhance your profile.
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <textarea
            value={newAchievement}
            onChange={(e) => setNewAchievement(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, newAchievement, 'achievements')}
            placeholder="First place in regional hackathon (2023)&#10;Increased team productivity by 30% through process improvements&#10;Volunteer of the Year award (2022)"
            className="w-full border border-gray-300 rounded-md p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Press Enter for each new achievement</span>
            <span>Focus on measurable results</span>
          </div>
          
          {achievementsList.length > 0 && (
            <div className="mt-3 space-y-2">
              {achievementsList.map((achievement, index) => (
                <div key={index} className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-md flex items-center text-sm">
                  {editingField === `achievements.${index}` ? (
                    <textarea
                      ref={inputRef}
                      className="w-full border border-blue-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={achievement}
                      onChange={(e) => handleDirectEdit('achievements', e.target.value, index)}
                      onBlur={handleBlur}
                      rows={2}
                    ></textarea>
                  ) : (
                    <>
                      <div className="flex-1 cursor-pointer text-sm" onClick={() => handleEditClick('achievements', index)}>
                        {achievement}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(index, 'achievements')}
                        className="ml-2 text-gray-400 hover:text-red-500"
                      >
                        <FiX size={14} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Publications Section */}
        <div className="mb-6 relative">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <FiBook className="mr-2 text-gray-600" />
              <span className="font-medium text-gray-700">Publications</span>
              <div className="relative ml-2">
                <FiInfo 
                  className="text-gray-400 cursor-help"
                  onMouseEnter={() => setActiveTooltip('publications')}
                  onMouseLeave={() => setActiveTooltip('')}
                />
                {activeTooltip === 'publications' && (
                  <div className="absolute z-10 top-full right-0 mt-1 bg-gray-800 text-white text-xs rounded py-1 px-2 w-60">
                    List your published works including articles, research papers, books, etc.
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <textarea
            value={newPublication}
            onChange={(e) => setNewPublication(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, newPublication, 'publications')}
            placeholder="Smith, J. (2023). Innovations in Machine Learning. Journal of AI Research, 12(3), 45-67.&#10;&#10;Brown, T. & Smith, J. (2022). The Future of Sustainable Technology. Tech Review."
            className="w-full border border-gray-300 rounded-md p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Press Enter to add publication</span>
            <span>Most recent first</span>
          </div>
          
          {publicationsList.length > 0 && (
            <div className="mt-3 space-y-2">
              {publicationsList.map((publication, index) => (
                <div key={index} className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-md flex items-center text-sm">
                  {editingField === `publications.${index}` ? (
                    <textarea
                      ref={inputRef}
                      className="w-full border border-blue-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={publication}
                      onChange={(e) => handleDirectEdit('publications', e.target.value, index)}
                      onBlur={handleBlur}
                      rows={2}
                    ></textarea>
                  ) : (
                    <>
                      <div className="flex-1 cursor-pointer text-sm" onClick={() => handleEditClick('publications', index)}>
                        {publication}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(index, 'publications')}
                        className="ml-2 text-gray-400 hover:text-red-500"
                      >
                        <FiX size={14} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* References Section */}
        <div className="mb-6 relative">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <FiUser className="mr-2 text-gray-600" />
              <span className="font-medium text-gray-700">References</span>
              <div className="relative ml-2">
                <FiInfo 
                  className="text-gray-400 cursor-help"
                  onMouseEnter={() => setActiveTooltip('references')}
                  onMouseLeave={() => setActiveTooltip('')}
                />
                {activeTooltip === 'references' && (
                  <div className="absolute z-10 top-full right-0 mt-1 bg-gray-800 text-white text-xs rounded py-1 px-2 w-60">
                    Add professional contacts who can vouch for your skills and experience.
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {!editingReference ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="name"
                  value={newReference.name}
                  onChange={handleReferenceChange}
                  placeholder="Full Name"
                  className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="position"
                  value={newReference.position}
                  onChange={handleReferenceChange}
                  placeholder="Position"
                  className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="company"
                  value={newReference.company}
                  onChange={handleReferenceChange}
                  placeholder="Company"
                  className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="email"
                  value={newReference.email}
                  onChange={handleReferenceChange}
                  placeholder="Email"
                  className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="phone"
                  value={newReference.phone}
                  onChange={handleReferenceChange}
                  placeholder="Phone"
                  className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="relationship"
                  value={newReference.relationship}
                  onChange={handleReferenceChange}
                  placeholder="Relationship"
                  className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mt-3 flex items-center">
                <input
                  type="checkbox"
                  name="available"
                  checked={newReference.available}
                  onChange={handleReferenceChange}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">Available upon request</label>
              </div>
              
              <button
                onClick={handleAddReference}
                className="mt-3 px-4 py-2 border border-gray-300 rounded-md text-gray-600 text-sm hover:bg-gray-50 w-full flex items-center justify-center"
              >
                <FiPlus className="mr-2" /> Add Reference
              </button>
            </>
          ) : (
            <div className="border rounded-md p-4 bg-blue-50">
              <h3 className="text-md font-medium text-gray-900 mb-3">Edit Reference</h3>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="name"
                  value={editingReference.name}
                  onChange={handleEditReferenceChange}
                  placeholder="Full Name"
                  className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="position"
                  value={editingReference.position}
                  onChange={handleEditReferenceChange}
                  placeholder="Position"
                  className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="company"
                  value={editingReference.company}
                  onChange={handleEditReferenceChange}
                  placeholder="Company"
                  className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="email"
                  value={editingReference.email}
                  onChange={handleEditReferenceChange}
                  placeholder="Email"
                  className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="phone"
                  value={editingReference.phone}
                  onChange={handleEditReferenceChange}
                  placeholder="Phone"
                  className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="relationship"
                  value={editingReference.relationship}
                  onChange={handleEditReferenceChange}
                  placeholder="Relationship"
                  className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mt-3 flex items-center">
                <input
                  type="checkbox"
                  name="available"
                  checked={editingReference.available}
                  onChange={handleEditReferenceChange}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">Available upon request</label>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={handleUpdateReference}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Reference
                </button>
                <button
                  onClick={handleCancelEditReference}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {referencesList.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Your References</h3>
              <div className="space-y-4">
                {referencesList.map((refString, index) => {
                  const ref = parseReferenceFromString(refString);
                  return (
                    <div key={index} className="p-4 border rounded-md bg-white cv-wrapper">
                      <div className="flex justify-between">
                        <div className="cv-flex-item">
                          <h4 className="font-medium cv-long-text">{ref.name}</h4>
                          {ref.position && <p className="text-sm text-gray-600 cv-long-text">{ref.position}</p>}
                          {ref.company && <p className="text-sm text-gray-600 cv-long-text">{ref.company}</p>}
                          {(ref.email || ref.phone) && (
                            <p className="text-xs text-gray-500">
                              {ref.email}
                              {ref.email && ref.phone && " • "}
                              {ref.phone}
                            </p>
                          )}
                          {ref.available && (
                            <p className="text-xs italic text-gray-500 mt-1">Available upon request</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditReference(index)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleRemoveItem(index, 'references')}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      {ref.relationship && (
                        <p className="mt-2 text-sm text-gray-600 cv-long-text">{ref.relationship}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {(nextStep || prevStep) && !hideTitle && (
        <div className="flex justify-between mt-6">
          {prevStep && (
            <button
              onClick={prevStep}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => {
                // Reset form về dữ liệu ban đầu nếu có
                if (data) {
                  setInterestsList(parseTextToArray(data.interests || ''));
                  setAchievementsList(parseTextToArray(data.achievements || ''));
                  setPublicationsList(parseTextToArray(data.publications || ''));
                  setReferencesList(parseTextToArray(data.references || ''));
                  setAdditionalInfo({
                    interests: data.interests || '',
                    achievements: data.achievements || '',
                    publications: data.publications || '',
                    references: data.references || '',
                    customSections: data.customSections || []
                  });
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {nextStep ? 'Next' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalInfoStep; 