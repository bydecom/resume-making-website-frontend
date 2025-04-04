import ProfessionalBlueTemplate from './ProfessionalBlueTemplate';
import MinimalistTemplate from './MinimalistTemplate';

// Object chứa tất cả các template có sẵn
export const templates = {
  professionalBlue: {
    id: 'professionalBlue',
    name: 'Professional Blue',
    component: ProfessionalBlueTemplate,
    description: 'A professional template with blue accents, suitable for most industries.',
    previewImage: '/template-previews/professional-blue.png',
    isDefault: true
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist',
    component: MinimalistTemplate,
    description: 'A clean, minimalist design that lets your content stand out.',
    previewImage: '/template-previews/minimalist.png'
  }
};

// Lấy template mặc định
export const getDefaultTemplate = () => {
  const defaultTemplate = Object.values(templates).find(template => template.isDefault);
  return defaultTemplate || templates.professionalBlue;
};

// Lấy template theo ID
export const getTemplateById = (templateId) => {
  return templates[templateId] || getDefaultTemplate();
};

export default templates; 