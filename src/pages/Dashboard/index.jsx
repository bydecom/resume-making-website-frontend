import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ResumesSection from './components/ResumesSection';
import CVSection from './components/CVSection';
import JDSection from './components/JDSection';
import { resumeData, templates } from './data';
import CreateCVModal from '../../components/CreateCVModal';
import ScrollToTop from '../../components/ScrollToTop';
import { getDefaultTemplate } from '../../templates';
import { Plus, Download } from 'lucide-react';
import CVDownloadModal from '../../components/CVDownloadModal';
import { useCVData } from '../../contexts/CVDataContext';
import axiosInstance from '../../utils/axios';
const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCVData: setContextCVData } = useCVData();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [resumes, setResumes] = useState(resumeData);
  const [cvData, setCvData] = useState({ cv: null });
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  // States for CV data fetching and processing
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Added state for job descriptions
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [jobDescriptionsLoading, setJobDescriptionsLoading] = useState(true);
  const [jobDescriptionsError, setJobDescriptionsError] = useState(null);
  // Active section state - changed default to 'resumes'
  const [activeSection, setActiveSection] = useState('resumes');
  
  const handleCreateNewClick = () => {
    setShowCreateModal(true);
  };

  const handleEditCV = (id) => {
    navigate(`/cv/edit/${id}`);
  };

  const handleDeleteCV = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this CV?");
    if (confirmDelete) {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Call API to delete CV
        const response = await fetch(`http://localhost:5000/api/cv/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to delete CV: ${response.statusText}`);
        }

        // Set CV to null in both local state and context
        setCvData({ cv: null });
        setContextCVData({ 
          cv: null,
          isLoading: false,
          error: null
        });

        // Show success message
        alert('CV deleted successfully!');
      } catch (error) {
        console.error('Error deleting CV:', error);
        alert('Failed to delete CV. Please try again.');
      }
    }
  };
  
  // Fetch CV data from API
  const fetchCVData = async () => {
    setIsLoading(true);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Actual API call to fetch CV
      const response = await fetch('http://localhost:5000/api/cv', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch CV data: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Process the CV data - assuming API returns a single CV or the first one
      // If data.data is an array, take the first item (the active CV)
      const cvItem = Array.isArray(data.data) ? data.data[0] : data.data;
      
      if (cvItem) {
        const processedCV = {
          ...cvItem,
          template: cvItem.template || { id: getDefaultTemplate().id },
          score: calculateCVScore(cvItem),
          progress: calculateCVProgress(cvItem)
        };
        
        // Update local state with single CV
        setCvData({ cv: processedCV });
        
        // Store in global context
        setContextCVData({
          cv: processedCV,
          isLoading: false,
          error: null
        });
      } else {
        // No CV found
        setCvData({ cv: null });
        setContextCVData({
          cv: null,
          isLoading: false,
          error: null
        });
      }
      
    } catch (err) {
      console.error('Error fetching CV data:', err);
      setError(err.message);
      setContextCVData({
        cv: null,
        isLoading: false,
        error: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch job descriptions from API
  const fetchJobDescriptions = async () => {
    setJobDescriptionsLoading(true);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // API call to fetch job descriptions
      const response = await axiosInstance.get('http://localhost:5000/api/job-descriptions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // If successful, update state with job descriptions
      if (response.data.status === 'success') {
        setJobDescriptions(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch job descriptions');
      }
    } catch (err) {
      console.error('Error fetching job descriptions:', err);
      setJobDescriptionsError(err.message || 'Error loading job descriptions');
    } finally {
      setJobDescriptionsLoading(false);
    }
  };
  
  // Calculate CV score based on content completeness
  const calculateCVScore = (cv) => {
    let score = 0; // Base score
    
    // Check for personal info
    if (cv.personalInfo) {
      if (cv.personalInfo.firstName && cv.personalInfo.lastName) score += 10;
      if (cv.personalInfo.email) score += 6;
      if (cv.personalInfo.phone) score += 6;
      if (cv.personalInfo.location) score += 4;
      if (cv.personalInfo.linkedin) score += 4;
    }
    
    // Check for other sections
    if (cv.summary && cv.summary.length > 0) score += 10;
    if (cv.experience && cv.experience.length > 0) score += 20;
    if (cv.education && cv.education.length > 0) score += 20;
    if (cv.skills && cv.skills.length > 0) score += 10;
    if (cv.projects && cv.projects.length > 0) score += 10;
    if (cv.certifications && cv.certifications.length > 0) score += 6;
    if (cv.languages && cv.languages.length > 0) score += 4;
    
    return Math.min(score, 100); // Ensure score is max 100
  };
  
  // Calculate CV completion percentage
  const calculateCVProgress = (cv) => {
    let totalFields = 8; // Total number of main sections
    let filledFields = 0;
    
    // Check for personal info (required)
    if (cv.personalInfo && cv.personalInfo.firstName && cv.personalInfo.lastName && cv.personalInfo.email) {
      filledFields += 1;
    }
    
    // Check for other sections
    if (cv.summary && cv.summary.length > 0) filledFields += 1;
    if (cv.experience && cv.experience.length > 0) filledFields += 1;
    if (cv.education && cv.education.length > 0) filledFields += 1;
    if (cv.skills && cv.skills.length > 0) filledFields += 1;
    if (cv.projects && cv.projects.length > 0) filledFields += 1;
    if (cv.certifications && cv.certifications.length > 0) filledFields += 1;
    if (cv.languages && cv.languages.length > 0) filledFields += 1;
    
    return Math.round((filledFields / totalFields) * 100);
  };
  
  // Check for navigation events that should trigger a refresh
  useEffect(() => {
    // If we're coming from a CV edit or create operation, refresh data
    if (location.state?.message === 'CV saved successfully!' || location.state?.forceCVRefresh) {
      fetchCVData();
      
      // Clear the state to prevent continuous refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);
  
  // Fetch CV data and job descriptions when component mounts
  useEffect(() => {
    fetchCVData();
    fetchJobDescriptions();
  }, []);

  const handleCreateNewResume = () => {
    console.log('Current CV data:', cvData); // For debugging
    
    // Chuẩn bị dữ liệu CV nếu có
    const selectedCV = cvData && cvData.cv
      ? {
          ...cvData.cv,
          personalInfo: cvData.cv.personalInfo || {},
          summary: cvData.cv.summary || '',
          experience: cvData.cv.experience || [],
          education: cvData.cv.education || [],
          skills: cvData.cv.skills || [],
          projects: cvData.cv.projects || [],
          certifications: cvData.cv.certifications || [],
          languages: cvData.cv.languages || [],
          template: cvData.cv.template || { id: getDefaultTemplate().id },
          _id: cvData.cv._id,
          name: cvData.cv.name || 'Untitled CV',
          progress: calculateCVProgress(cvData.cv),
          score: calculateCVScore(cvData.cv)
        }
      : null;

    // Luôn chuyển đến new-resume, kèm theo dữ liệu CV nếu có
    navigate('/new-resume', { 
      state: { selectedCV }
    });
  };

  const handleDownloadCV = (cv) => {
    setSelectedCV(cv);
    setIsDownloadModalOpen(true);
  };

  return (
    <div className="bg-gray-100">
      {/* Main content */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Section navigation tabs - reordered tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6 mt-16">
            <div className="flex border-b">
              <button
                className={`px-6 py-4 text-lg font-medium ${
                  activeSection === 'resumes' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveSection('resumes')}
              >
                Your Resumes
              </button>
              <button
                className={`px-6 py-4 text-lg font-medium ${
                  activeSection === 'cv' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveSection('cv')}
              >
                Your CV
              </button>
              <button
                className={`px-6 py-4 text-lg font-medium ${
                  activeSection === 'job-descriptions' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveSection('job-descriptions')}
              >
                Your Job Applications
              </button>
            </div>
          </div>
          
          {/* Content sections */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {activeSection === 'resumes' && (
              <ResumesSection resumeData={resumes} />
            )}
            
            {activeSection === 'cv' && (
              <CVSection 
                cvData={{ cv: cvData.cv }} 
                isLoading={isLoading} 
                onEditCV={handleEditCV}
                onDeleteCV={handleDeleteCV}
                onDownloadCV={handleDownloadCV}
                setCvData={setCvData}
              />
            )}
            
            {activeSection === 'job-descriptions' && (
              <JDSection 
                jobDescriptions={jobDescriptions} 
                isLoading={jobDescriptionsLoading} 
                error={jobDescriptionsError}
                refreshJobDescriptions={fetchJobDescriptions}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      <CreateCVModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
      
      {/* Add CVDownloadModal */}
      <CVDownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => {
          setIsDownloadModalOpen(false);
          setSelectedCV(null);
        }}
        template={selectedCV?.template}
        formData={selectedCV}
      />
      
      {/* Nút scroll to top */}
      <ScrollToTop />
    </div>
  );
};

export default Dashboard;