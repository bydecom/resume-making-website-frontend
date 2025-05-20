import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { FaExchangeAlt, FaLightbulb, FaDownload, FaChartBar } from 'react-icons/fa';
import api from '../../utils/api';
import { templates } from '../../templates';
import { exportCVToPDF } from '../../services/pdfExportService';

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

// Complete mock data for all templates
const completeMockData = {
  name: "John Doe's Resume",
  template: {
    id: "professionalBlue",
    name: "Professional Blue"
  },
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York City",
    country: "United States",
    professionalHeadline: "Senior Software Engineer",
    linkedin: "linkedin.com/in/johndoe",
    website: "johndoe.dev"
  },
  summary: "Experienced software engineer with 8+ years of expertise in full-stack development, cloud architecture, and team leadership. Proven track record of delivering high-impact projects and mentoring junior developers. Passionate about creating scalable solutions and adopting emerging technologies.",
  experience: [
    {
      position: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      startDate: "2020-01",
      endDate: "2024-01",
      description: "Lead developer for cloud-based enterprise applications serving 1M+ users. Architected and implemented microservices architecture reducing system latency by 40%. Mentored team of 5 junior developers.",
      isPresent: false
    },
    {
      position: "Software Engineer",
      company: "Digital Innovations Corp",
      startDate: "2017-03",
      endDate: "2019-12",
      description: "Full-stack developer for e-commerce platform. Implemented responsive design patterns and optimized database queries. Collaborated with UX team for improved user experience.",
      isPresent: false
    }
  ],
  education: [
    {
      degree: "Master of Science",
      institution: "Massachusetts Institute of Technology",
      startDate: "2015-01",
      endDate: "2017-01",
      description: "Focus on Artificial Intelligence and Distributed Systems",
      isPresent: false
    },
    {
      degree: "Bachelor of Science",
      institution: "University of California, Berkeley",
      startDate: "2011-01",
      endDate: "2015-01",
      description: "Computer Science major with Minor in Mathematics",
      isPresent: false
    }
  ],
  skills: [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "AWS",
    "Docker",
    "Kubernetes",
    "System Architecture",
    "Team Leadership",
    "Problem Solving"
  ],
  projects: [
    {
      title: "AI-Powered Analytics Platform",
      role: "Lead Developer",
      startDate: "2023-01",
      endDate: "2024-01",
      description: "Developed a machine learning platform for real-time data analytics. Processed 1TB+ of data daily, reduced analysis time by 60%, served 100K+ daily active users.",
      url: "https://github.com/johndoe/analytics-platform",
      isPresent: false
    },
    {
      title: "E-commerce Microservices",
      role: "System Architect",
      startDate: "2022-01",
      endDate: "2022-12",
      description: "Built scalable microservices architecture for e-commerce platform. Handled 1M+ daily transactions with 99.99% uptime achievement.",
      url: "https://github.com/johndoe/ecommerce-microservices",
      isPresent: false
    }
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2022-01",
      url: "https://aws.amazon.com/certification/verify"
    },
    {
      name: "Google Cloud Professional Developer",
      issuer: "Google",
      date: "2021-01",
      url: "https://google.com/cloud/certifications"
    }
  ],
  languages: [
    {
      language: "English",
      proficiency: "Native"
    },
    {
      language: "Spanish",
      proficiency: "Professional Working"
    },
    {
      language: "French",
      proficiency: "Elementary"
    }
  ],
  customFields: [],
  status: "draft",
  isDefault: false
};

// Add this constant at the top of the file
const AVAILABLE_CATEGORIES = ['Professional', 'Minimalist', 'Modern', 'Creative', 'Academic'];

const TemplateModal = ({ template: initialTemplate, isOpen, onClose, onUpdate }) => {
  const [template, setTemplate] = useState(initialTemplate);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [otherTemplates, setOtherTemplates] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const cvElementRef = useRef(null);
  const [formData, setFormData] = useState({
    description: initialTemplate.description,
    category: initialTemplate.category,
    isActive: initialTemplate.isActive,
    isDefault: initialTemplate.isDefault
  });
  const [templateStats, setTemplateStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch all templates to check default status
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get('/api/templates');
        const fetchedTemplates = response.data.data.filter(t => t.templateId !== template.templateId);
        setOtherTemplates(fetchedTemplates);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    if (isOpen && !template.isDefault) {
      fetchTemplates();
    }
  }, [isOpen, template.templateId, template.isDefault]);

  // Check if any other template is set as default
  const hasOtherDefault = otherTemplates.some(t => t.isDefault);

  // Fetch template data when component mounts or template ID changes
  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/templates/${initialTemplate.templateId}`);
        const fetchedTemplate = response.data.data;
        setTemplate(fetchedTemplate);
        setFormData({
          description: fetchedTemplate.description,
          category: fetchedTemplate.category,
          isActive: fetchedTemplate.isActive,
          isDefault: fetchedTemplate.isDefault
        });
      } catch (error) {
        console.error('Error fetching template:', error);
        toast.error('Failed to load template data');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && initialTemplate.templateId) {
      fetchTemplateData();
    }
  }, [isOpen, initialTemplate.templateId]);

  // Add stats fetching
  useEffect(() => {
    const fetchTemplateStats = async () => {
      try {
        setLoadingStats(true);
        const response = await api.get('/api/templates/stats');
        const stats = response.data.data.templates.find(
          t => t.templateId === initialTemplate.templateId
        );
        setTemplateStats(stats);
      } catch (error) {
        console.error('Error fetching template stats:', error);
        toast.error('Failed to load template statistics');
      } finally {
        setLoadingStats(false);
      }
    };

    if (isOpen && initialTemplate.templateId) {
      fetchTemplateStats();
    }
  }, [isOpen, initialTemplate.templateId]);

  const mockFormData = {
    ...completeMockData,
    template: { id: template.templateId }
  };

  // Get the actual template component
  const TemplateComponent = templates[template.templateId]?.component;

  // Add fonts ready check
  useEffect(() => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        console.log('All fonts are loaded and ready');
        setFontsReady(true);
      });
    } else {
      setTimeout(() => {
        setFontsReady(true);
      }, 2000);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (!formData.category.includes(value)) {
      setFormData(prev => ({
        ...prev,
        category: [...prev.category, value]
      }));
    }
  };

  const removeCategory = (categoryToRemove) => {
    if (categoryToRemove === 'All') return; // Prevent removing 'All' category
    setFormData(prev => ({
      ...prev,
      category: prev.category.filter(cat => cat !== categoryToRemove)
    }));
  };

  // Get available categories (those not already selected)
  const getAvailableCategories = () => {
    return AVAILABLE_CATEGORIES.filter(cat => !formData.category.includes(cat));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const templateMetadata = {
        description: formData.description,
        category: formData.category,
        isActive: formData.isActive,
        isDefault: formData.isDefault
      };

      const response = await api.put(`/api/templates/${template.templateId}`, templateMetadata);
      
      if (response.data.status === 'success') {
        toast.success('Template updated successfully!');
        // Update local state with new data
        setTemplate(response.data.data);
        onUpdate(template.templateId, response.data.data);
        setIsEditing(false);
      } else {
        throw new Error(response.data.message || 'Failed to update template');
      }
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error(error.response?.data?.message || 'Failed to update template');
    }
  };

  const handleDownload = async () => {
    if (!fontsReady) {
      toast.warning('Fonts are still loading. Please wait a moment and try again.');
      return;
    }

    try {
      setIsDownloading(true);
      await exportCVToPDF({
        cvElement: cvElementRef.current,
        formData: mockFormData,
        onStatusChange: setIsDownloading,
        onError: (error) => {
          toast.error('Failed to generate PDF. Please try again.');
        }
      });
    } catch (error) {
      console.error('Error in handleDownload:', error);
      toast.error('Failed to download template preview');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white flex-shrink-0 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Template Preview</h2>
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : (
            <>
              <button
                onClick={handleDownload}
                disabled={isDownloading || !fontsReady}
                className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 ${
                  (isDownloading || !fontsReady) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FaDownload className="h-4 w-4" />
                {isDownloading ? 'Generating PDF...' : (!fontsReady ? 'Loading Fonts...' : 'Download Preview')}
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Template'}
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading template data...</div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Left Column - Template Info */}
            <div className="w-1/4 border-r bg-gray-50 flex flex-col">
              {/* Fixed Header */}
              <div className="flex-shrink-0 p-6 pb-3 bg-gray-50 border-b">
                <div className="flex items-center text-blue-600">
                  <FaExchangeAlt className="mr-2" />
                  <h3 className="text-lg font-medium">Template Details</h3>
                </div>
              </div>

              {/* Scrollable Content Container */}
              <div className="flex-1 overflow-y-auto p-6 pt-3 space-y-6">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">{template.name}</h3>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="Enter template description..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Add Category</label>
                      <div className="relative">
                        <select
                          onChange={handleCategoryChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-10"
                          disabled={getAvailableCategories().length === 0}
                        >
                          <option value="">
                            {getAvailableCategories().length === 0 
                              ? 'All categories added' 
                              : 'Select a category...'}
                          </option>
                          {getAvailableCategories().map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                          All
                        </span>
                        {formData.category.map(cat => (
                          <span
                            key={cat}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
                          >
                            {cat}
                            {cat !== 'All' && (
                              <button
                                type="button"
                                onClick={() => removeCategory(cat)}
                                className="ml-2 -mr-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                              >
                                ×
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="isActive"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="isActive" className="ml-3 text-sm font-medium text-gray-700">
                            Active
                          </label>
                        </div>
                        <div className="text-xs text-gray-500">
                          Template will be available for use
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="isDefault"
                            id="isDefault"
                            checked={formData.isDefault}
                            onChange={handleChange}
                            disabled={!formData.isDefault && hasOtherDefault}
                            className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500
                              ${!formData.isDefault && hasOtherDefault ? 'cursor-not-allowed opacity-50' : ''}`}
                          />
                          <label 
                            htmlFor="isDefault" 
                            className={`ml-3 text-sm font-medium ${
                              !formData.isDefault && hasOtherDefault ? 'text-gray-400' : 'text-gray-700'
                            }`}
                          >
                            Default Template
                          </label>
                        </div>
                        <div className="text-xs text-gray-500">
                          {!formData.isDefault && hasOtherDefault ? (
                            'Another template is set as default'
                          ) : (
                            'Will be used as the default template'
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">{template.name}</h3>
                      <p className="text-gray-600 mt-1">{template.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        {template.category.map(cat => (
                          <span
                            key={cat}
                            className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {template.isDefault && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          Default
                        </span>
                      )}
                      {template.isActive ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Thumbnail Preview Section */}
                <div className="border-t pt-6">
                  <div className="flex items-center text-yellow-600 mb-4">
                    <FaLightbulb className="mr-2" />
                    <h3 className="text-lg font-medium">Preview Thumbnail</h3>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={thumbnailMap[template.templateId]}
                      alt={template.name}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Template Preview */}
            <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
              <div className="max-w-[850px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div ref={cvElementRef}>
                  {TemplateComponent ? (
                    <TemplateComponent formData={mockFormData} />
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      Template preview not available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Template Statistics */}
            <div className="w-1/4 border-l bg-gray-50 flex flex-col">
              <div className="flex-shrink-0 p-6 pb-3 bg-gray-50 border-b">
                <div className="flex items-center text-purple-600">
                  <FaChartBar className="mr-2" />
                  <h3 className="text-lg font-medium">Template Statistics</h3>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 pt-3">
                {loadingStats ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500">Loading statistics...</div>
                  </div>
                ) : templateStats ? (
                  <div className="space-y-6">
                    {/* CV Statistics */}
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <h4 className="text-lg font-medium text-gray-900 mb-3">CV Usage</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Created:</span>
                          <span className="font-medium">{templateStats.usage.cv.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Active CVs:</span>
                          <span className="font-medium">{templateStats.usage.cv.active}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Downloads:</span>
                          <span className="font-medium text-blue-600">{templateStats.usage.cv.downloads}</span>
                        </div>
                      </div>
                    </div>

                    {/* Resume Statistics */}
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Resume Usage</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Created:</span>
                          <span className="font-medium">{templateStats.usage.resume.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Active Resumes:</span>
                          <span className="font-medium">{templateStats.usage.resume.active}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Downloads:</span>
                          <span className="font-medium text-blue-600">{templateStats.usage.resume.downloads}</span>
                        </div>
                      </div>
                    </div>

                    {/* Total Statistics */}
                    <div className="bg-purple-50 rounded-lg p-4 shadow-sm border border-purple-100">
                      <h4 className="text-lg font-medium text-purple-900 mb-3">Overall Usage</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-700">Total Created:</span>
                          <span className="font-medium">{templateStats.usage.total.created}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-purple-700">Active Documents:</span>
                          <span className="font-medium">{templateStats.usage.total.active}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-purple-700">Total Downloads:</span>
                          <span className="font-medium text-purple-600 text-lg">
                            {templateStats.usage.total.downloads}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    No statistics available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add PDF export styles */}
      <style jsx global>{`
        .exporting-pdf .fas,
        .exporting-pdf .fab,
        .exporting-pdf .far {
          font-weight: 900 !important;
          font-family: 'Font Awesome 5 Free' !important;
        }
        
        .exporting-pdf .fas:before,
        .exporting-pdf .fab:before,
        .exporting-pdf .far:before {
          font-size: 1.2em !important;
        }
      `}</style>
    </div>
  );
};

export default TemplateModal; 