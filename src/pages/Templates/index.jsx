import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { fetchActiveTemplates } from '../../templates';

// Import ảnh thumbnail
import MinimalistThumbnail from '../../assets/cv-thumnails/minimalist.jpg';
import ModernThumbnail from '../../assets/cv-thumnails/modern.jpg';
import ProfessionalBlueThumbnail from '../../assets/cv-thumnails/professional-blue.jpg';
import ProfessionalCVThumbnail from '../../assets/cv-thumnails/professional-cv.jpg';

// Map thumbnails to template IDs
const thumbnailMap = {
  minimalist: MinimalistThumbnail,
  modern: ModernThumbnail,
  professionalBlue: ProfessionalBlueThumbnail,
  professionalCV: ProfessionalCVThumbnail
};

// Inline CSS cho hiệu ứng lướt lên xuống
const bounceStyle = document.createElement('style');
bounceStyle.innerHTML = `
  @keyframes bounce-vertical {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  .animate-bounce-slow {
    animation: bounce-vertical 2s infinite ease-in-out;
  }
`;
document.head.appendChild(bounceStyle);

// Component ScrollToBottom với hiệu ứng lướt lên xuống
const ScrollToBottom = () => {
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return createPortal(
    <div 
      style={{
        position: 'fixed',
        bottom: '100px',
        right: '32px',
        zIndex: 9998,
        animation: 'bounce-vertical 2s infinite ease-in-out'
      }}
    >
      <button
        onClick={scrollToBottom}
        className="bg-blue-500 text-white p-1 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 w-10 h-10 flex items-center justify-center"
        aria-label="Scroll to bottom"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>
    </div>,
    document.body
  );
};

const ImprovedTemplateSelector = ({ onSelectTemplate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use React Router's hooks
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch templates from API
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const templatesData = await fetchActiveTemplates();
        // Convert templates object to array
        const templatesArray = Object.entries(templatesData).map(([id, template]) => ({
          ...template
        }));
        setTemplates(templatesArray);
        setError(null);
      } catch (err) {
        console.error('Error loading templates:', err);
        setError('Failed to load templates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // Handle URL parameters and localStorage for template selection
  useEffect(() => {
    const templateParam = searchParams.get('template');
    const storedTemplate = localStorage.getItem('selectedTemplate');
    const shouldScrollToBottom = localStorage.getItem('scrollToBottom') === 'true';
    
    localStorage.removeItem('selectedTemplate');
    localStorage.removeItem('scrollToBottom');
    
    if (templateParam) {
      setSelectedTemplate(templateParam);
      const template = templates.find(t => t.templateId === templateParam);
      if (template && template.category && template.category.length > 0) {
        setActiveFilter(template.category[0]);
      }
      
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 800);
      
    } else if (storedTemplate) {
      setSelectedTemplate(storedTemplate);
      const template = templates.find(t => t.templateId === storedTemplate);
      if (template && template.category && template.category.length > 0) {
        setActiveFilter(template.category[0]);
      }
      
      if (shouldScrollToBottom) {
        setTimeout(() => {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
          });
        }, 800);
      }
    }
  }, [searchParams, location.search, templates]);

  // Get unique categories from all templates, excluding 'All' from template categories
  const filterCategories = ['All', ...new Set(templates.flatMap(template => 
    (template.category || ['Professional']).filter(cat => cat !== 'All')
  ))];

  // Khi template được chọn, hiển thị nút scroll
  useEffect(() => {
    if (selectedTemplate) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  }, [selectedTemplate]);

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template.templateId);
    if (onSelectTemplate) {
      onSelectTemplate(template.templateId);
    }
  };

  // Add navigation handler for continue button
  const handleContinue = () => {
    const template = templates.find(t => t.templateId === selectedTemplate);
    const templateBasicInfo = {
      id: template.templateId,
      name: template.name
    };

    navigate('/new-resume', {
      state: {
        selectedTemplate: templateBasicInfo
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-32 max-w-7xl">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Choose Your Resume Template</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Select from our professionally designed templates to create your perfect resume
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {filterCategories.map(category => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              activeFilter === category
                ? 'bg-blue-100 text-blue-600 font-medium'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-gray-500">
            No templates available at the moment.
          </div>
        ) : (
          templates
            .filter(template => 
              activeFilter === 'All' || (template.category && template.category.includes(activeFilter))
            )
            .map((template) => (
          <div
                key={template.templateId}
            className={`group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 ${
                  selectedTemplate === template.templateId ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleSelectTemplate(template)}
          >
                {/* Template Preview */}
            <div className="relative bg-white">
              <div 
                className="relative w-full" 
                    style={{ paddingTop: '120%' }}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <img 
                        src={thumbnailMap[template.templateId]} 
                    alt={`${template.name} Template Preview`}
                    className="w-full h-full object-contain p-3"
                  />
                </div>
              </div>

              {/* Template Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/90 to-transparent p-4">
                <h3 className="text-lg font-semibold mb-1">{template.name}</h3>
                <p className="text-gray-600 text-sm">{template.description}</p>
              </div>

              {/* Selection Overlay */}
              <div 
                className={`absolute inset-0 transition-opacity duration-300 ${
                      selectedTemplate === template.templateId 
                    ? 'bg-blue-500/10 opacity-100' 
                    : 'opacity-0 group-hover:bg-gray-500/5 group-hover:opacity-100'
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className={`px-4 py-2 rounded-full transition-all duration-300 ${
                        selectedTemplate === template.templateId
                      ? 'bg-blue-600 text-white opacity-100 transform scale-100'
                      : 'bg-blue-500 text-white opacity-0 transform scale-95 group-hover:opacity-100 group-hover:scale-100'
                  }`}>
                        {selectedTemplate === template.templateId ? 'Selected' : 'Use Template'}
                  </button>
                </div>
              </div>
            </div>
          </div>
            ))
        )}
      </div>

      {/* Action Button */}
      {selectedTemplate && (
        <div className="mt-8 text-center">
          <button 
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            onClick={handleContinue}
          >
            Continue with selected template
          </button>
        </div>
      )}

      {/* ScrollToBottom Component */}
      {showScrollButton && <ScrollToBottom />}
    </div>
  );
};

export default ImprovedTemplateSelector; 