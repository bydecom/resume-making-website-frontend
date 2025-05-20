import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { templates } from '../../templates';
import TemplateModal from './TemplateModal';

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

const Templates = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [localTemplates, setLocalTemplates] = useState([]);

  // Fetch templates when component mounts
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/templates');
        const fetchedTemplates = response.data.data;
        setLocalTemplates(fetchedTemplates);
      } catch (error) {
        console.error('Error fetching templates:', error);
        toast.error('Failed to load templates');
        // Fallback to static templates if API fails
        setLocalTemplates(
          Object.entries(templates).map(([templateId, template]) => ({
            ...template,
            templateId
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Get unique categories from all templates
  const filterCategories = ['All', ...new Set(localTemplates.flatMap(template => 
    template.category.filter(cat => cat !== 'All')
  ))];

  const syncTemplates = async () => {
    setIsSyncing(true);
    try {
      const templatesArray = localTemplates.map(template => ({
        templateId: template.templateId,
        name: template.name,
        description: template.description,
        category: template.category,
        isDefault: template.isDefault,
        isActive: template.isActive
      }));

      const response = await api.post('/api/templates/sync', {
        templates: templatesArray
      });

      toast.success('Templates synchronized successfully!');
      console.log('Templates synced:', response.data);
    } catch (err) {
      console.error('Error syncing templates:', err);
      toast.error(err.response?.data?.message || 'Failed to sync templates. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleUpdateTemplate = (templateId, updatedData) => {
    setLocalTemplates(prev => 
      prev.map(template => 
        template.templateId === templateId
          ? { ...template, ...updatedData }
          : template
      )
    );
  };

  const handleToggleActive = async (templateId, currentStatus) => {
    try {
      const response = await api.put(`/api/templates/${templateId}`, {
        isActive: !currentStatus
      });
      
      if (response.data.status === 'success') {
        setLocalTemplates(prev => 
          prev.map(template => 
            template.templateId === templateId
              ? { ...template, ...response.data.data }
              : template
          )
        );
        
        toast.success(`Template ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      } else {
        throw new Error(response.data.message || 'Failed to update template status');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update template status');
      console.error('Error updating template status:', error);
    }
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
    <div>
          <h2 className="text-2xl font-semibold mb-2">CV Templates</h2>
          <p className="text-gray-600">Manage and preview available CV templates</p>
        </div>
        <button
          onClick={syncTemplates}
          disabled={isSyncing}
          className={`
            px-4 py-2 rounded-lg
            ${isSyncing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
            }
            text-white font-medium
            transition duration-200
            flex items-center gap-2
          `}
        >
          {isSyncing ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Syncing...
            </>
          ) : (
            'Sync Templates'
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading templates...</div>
        </div>
      ) : (
        <>
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
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
            {localTemplates
              .filter(template => 
                activeFilter === 'All' || template.category.includes(activeFilter)
              )
              .map((template) => (
                <div
                  key={template.templateId}
                  className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200"
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
                      <p className="text-gray-600 text-sm mb-2">{template.description}</p>
                      
                      {/* Categories */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {template.category.map(cat => (
                          <span
                            key={cat}
                            className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                      
                      {/* Status Tags */}
                      <div className="flex items-center gap-2">
                        {template.isDefault && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            Default
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleActive(template.templateId, template.isActive);
                          }}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                            template.isActive
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {template.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                    </div>

                    {/* Preview Button Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300">
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handlePreview(template)}
                          className="px-6 py-2 bg-white text-gray-800 rounded-full font-medium hover:bg-gray-100 transition-colors"
                        >
                          Preview Template
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      <p className="text-gray-600 mt-6">
        Use the sync button above to synchronize these templates with the database.
        This will ensure all template metadata is up to date.
      </p>

      {/* Template Modal */}
      {selectedTemplate && (
        <TemplateModal
          template={selectedTemplate}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdate={handleUpdateTemplate}
        />
      )}
    </div>
  );
};

export default Templates; 