import ProfessionalBlueTemplate from './ProfessionalBlueTemplate/index.jsx';
import MinimalistTemplate from './MinimalistTemplate/index.jsx';
import ModernTemplate from './ModernTemplate/index.jsx';
import ProfessionalCVTemplate from './ProfessionalCVTemplate/index.jsx';
import { callApi } from '../utils/api';

// Import preview images
import professionalBluePreview from '../assets/cv-thumnails/professional-blue.jpg';
import minimalistPreview from '../assets/cv-thumnails/minimalist.jpg';
import modernPreview from '../assets/cv-thumnails/modern.jpg';
import professionalCVPreview from '../assets/cv-thumnails/professional-cv.jpg';

// Static template components and preview images - for backward compatibility
export const templates = {
  professionalBlue: {
    id: 'professionalBlue',
    name: 'Professional Blue',
    component: ProfessionalBlueTemplate,
    description: 'A professional template with blue accents, suitable for most industries.',
    category: ['All', 'Professional', 'Business'],
    isDefault: true,
    isActive: true
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist',
    component: MinimalistTemplate,
    description: 'A clean, minimalist design that lets your content stand out.',
    category: ['All', 'Minimalist', 'Creative'],
    isActive: true
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    component: ModernTemplate,
    description: 'A modern, two-column design with a bold header and clean sections.',
    category: ['All', 'Modern', 'Tech', 'Creative'],
    isActive: true
  },
  professionalCV: {
    id: 'professionalCV',
    name: 'Professional CV',
    component: ProfessionalCVTemplate,
    description: 'A professional CV template with a clean timeline design and Vietnamese language support.',
    category: ['All', 'Professional', 'Academic', 'Business'],
    isActive: true
  }
};

// Function to fetch active templates from API
export const fetchActiveTemplates = async () => {
  try {
    const response = await callApi('/api/templates/active', 'GET');
    const activeTemplatesData = response.data;

    // Combine API data with static component data
    const dynamicTemplates = {};
    activeTemplatesData.forEach(template => {
      if (templates[template.templateId]) {
        dynamicTemplates[template.templateId] = {
          ...template,
          component: templates[template.templateId].component // Use component from static templates
        };
      }
    });

    return dynamicTemplates;
  } catch (error) {
    console.error('Error fetching active templates:', error);
    return templates; // Fallback to static templates if API fails
  }
};

// Get default template
export const getDefaultTemplate = (templatesData = templates) => {
  const defaultTemplate = Object.values(templatesData).find(template => template.isDefault);
  return defaultTemplate || Object.values(templatesData)[0];
};

// Get template by ID
export const getTemplateById = (templateId, templatesData = templates) => {
  return templatesData[templateId] || getDefaultTemplate(templatesData);
};

export default templates; 