// This file exports all components from the components directory
import PersonalInfoStep from './PersonalInfoStep';
import EducationStep from './EducationStep';
import ExperienceStep from './ExperienceStep';
import SkillsStep from './SkillsStep';
import ProjectsStep from './ProjectsStep';
import CertificationsStep from './CertificationsStep';
import LanguagesStep from './LanguagesStep';
import ActivitiesStep from './ActivitiesStep';
import AdditionalInfoStep from './AdditionalInfoStep';
import SummaryStep from './SummaryStep';
import ReviewStep from './ReviewStep';
import AIAssistant from './AIAssistant';
import HintPanel from './HintPanel';
import AdditionalSectionsStep from './AdditionalSectionsStep';
import CustomFieldsStep from './CustomFieldsStep';
import TabInterface from './TabInterface';
// Xóa import circular
// import { useFormData } from './index';

// Import CSS styles
import '../lib/input-styles.css';

// Helper function to handle form data
import { useEffect, useState } from 'react';

// Định nghĩa useFormData helper
export const useFormData = (initialData, setStateFunction, updateDataFunction) => {
  const [formData, setFormData] = useState(initialData || {});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = () => {
    setStateFunction && setStateFunction(formData);
    updateDataFunction && updateDataFunction(formData);
  };

  return { formData, setFormData, handleChange, handleBlur };
};

// Xóa bỏ ví dụ ComponentStep không đầy đủ

export {
  PersonalInfoStep,
  EducationStep,
  ExperienceStep,
  SkillsStep,
  ProjectsStep,
  CertificationsStep,
  LanguagesStep,
  ActivitiesStep,
  AdditionalInfoStep,
  SummaryStep,
  ReviewStep,
  AIAssistant,
  HintPanel,
  AdditionalSectionsStep,
  CustomFieldsStep,
  TabInterface
}; 