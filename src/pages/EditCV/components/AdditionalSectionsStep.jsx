import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

// Import các component
import ProjectsStep from './ProjectsStep';
import CertificationsStep from './CertificationsStep';
import LanguagesStep from './LanguagesStep';
import ActivitiesStep from './ActivitiesStep';
import CustomFieldsStep from './CustomFieldsStep';
import AdditionalInfoStep from './AdditionalInfoStep';

const AdditionalSectionsStep = ({ 
  selectedSections, 
  completedSections, 
  onSelectSection, 
  nextStep, 
  prevStep,
  updateFormData,
  formData
}) => {
  const [activeSections, setActiveSections] = useState([]);
  // Tham chiếu đến section đang active để scroll
  const activeSectionRefs = useRef({});
  
  // Hàm kiểm tra section có dữ liệu hay không
  const hasData = (sectionId) => {
    if (!formData || !formData[sectionId]) return false;
    
    if (sectionId === 'additionalInfo') {
      // Với additionalInfo, kiểm tra có bất kỳ trường nào có dữ liệu không
      const info = formData.additionalInfo;
      return info && (
        (info.interests && info.interests.trim() !== '') ||
        (info.achievements && info.achievements.trim() !== '') ||
        (info.publications && info.publications.trim() !== '') ||
        (info.references && info.references.trim() !== '') ||
        (info.customSections && info.customSections.length > 0)
      );
    }
    
    // Với các section khác, kiểm tra mảng có phần tử hay không
    return Array.isArray(formData[sectionId]) && formData[sectionId].length > 0;
  };

  // useEffect để scroll xuống section được mở
  useEffect(() => {
    if (activeSections.length > 0) {
      const lastActiveSection = activeSections[activeSections.length - 1];
      const ref = activeSectionRefs.current[lastActiveSection];
      
      if (ref) {
        setTimeout(() => {
          ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [activeSections]);

  const handleSelectSection = (e, sectionId) => {
    e.preventDefault();
    
    // Nếu section đã active thì không làm gì
    if (activeSections.includes(sectionId)) return;
    
    // Tự động đóng section hiện tại nếu có
    if (activeSections.length === 1 && activeSections[0] !== sectionId) {
      // Tự lưu dữ liệu (không cần làm gì thêm vì dữ liệu đã được lưu theo thời gian thực)
      
      // Đóng section cũ, mở section mới
      setActiveSections([sectionId]);
    } else {
      // Thêm section mới vào danh sách active
      onSelectSection(sectionId);
      setActiveSections(prev => [...prev, sectionId]);
    }
  };

  const handleCloseSection = (e, sectionId) => {
    e.preventDefault();
    // Tự lưu dữ liệu (đã được lưu theo thời gian thực)
    
    // Cập nhật state để đánh dấu section đã hoàn thành nếu cần
    if (!hasData(sectionId)) {
      onSelectSection(sectionId);
    }
    
    // Đóng section
    setActiveSections(prev => prev.filter(id => id !== sectionId));
  };

  const availableSections = [
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'languages', label: 'Languages' },
    { id: 'activities', label: 'Activities' },
    { id: 'additionalInfo', label: 'Additional Information' },
    { id: 'customFields', label: 'Custom Fields' }
  ];

  const renderSectionForm = (sectionId) => {
    const commonProps = {
      data: formData[sectionId] || [],
      updateData: (data) => updateFormData(sectionId, data),
    };

    switch (sectionId) {
      case 'projects': return <ProjectsStep {...commonProps} />;
      case 'certifications': return <CertificationsStep {...commonProps} />;
      case 'languages': return <LanguagesStep {...commonProps} />;
      case 'activities': return <ActivitiesStep {...commonProps} />;
      case 'additionalInfo': 
        return <AdditionalInfoStep 
          data={formData.additionalInfo || {}} 
          updateData={(data) => updateFormData('additionalInfo', data)}
          nextStep={() => {}}
          prevStep={() => {}}
        />;
      case 'customFields': return <CustomFieldsStep {...commonProps} />;
      default: return null;
    }
  };

  const renderSectionFormWithHiddenTitle = (sectionId) => {
    const commonProps = {
      data: formData[sectionId] || [],
      updateData: (data) => updateFormData(sectionId, data),
      hideTitle: true,
    };

    switch (sectionId) {
      case 'projects': return <ProjectsStep {...commonProps} />;
      case 'certifications': return <CertificationsStep {...commonProps} />;
      case 'languages': return <LanguagesStep {...commonProps} />;
      case 'activities': return <ActivitiesStep {...commonProps} />;
      case 'additionalInfo': 
        return <AdditionalInfoStep 
          data={formData.additionalInfo || {}} 
          updateData={(data) => updateFormData('additionalInfo', data)}
          nextStep={() => {}}
          prevStep={() => {}}
          hideTitle={true}
        />;
      case 'customFields': return <CustomFieldsStep {...commonProps} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Additional Sections</h2>
      
      <p className="text-sm text-gray-600 mb-4">
        Select additional sections to enhance your CV
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {availableSections.map(({ id, label }) => {
          const sectionHasData = hasData(id);
          return (
            <button
              key={id}
              type="button"
              onClick={(e) => handleSelectSection(e, id)}
              disabled={activeSections.includes(id)}
              className={`p-4 border rounded-md flex items-center justify-between shadow-sm ${
                activeSections.includes(id)
                  ? 'bg-gray-50 border-gray-300 cursor-not-allowed'
                  : sectionHasData
                    ? 'bg-blue-50 hover:bg-blue-100 border-gray-300'
                    : 'bg-white hover:bg-gray-50 border-gray-300'
              }`}
            >
              <span className="text-sm font-medium text-gray-700">{label}</span>
              {completedSections.includes(id) && (
                <FaCheckCircle className="text-green-500" />
              )}
            </button>
          );
        })}
      </div>

      {activeSections.length > 0 && (
        <div className="space-y-4">
          {activeSections.map((sectionId) => (
            <div 
              key={sectionId} 
              className="p-4 border rounded-md bg-white"
              ref={(el) => activeSectionRefs.current[sectionId] = el}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-medium text-gray-900">
                  {availableSections.find(s => s.id === sectionId)?.label}
                </h3>
                <button 
                  type="button"
                  onClick={(e) => handleCloseSection(e, sectionId)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <FaTimes />
                </button>
              </div>
              {renderSectionFormWithHiddenTitle(sectionId)}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdditionalSectionsStep;