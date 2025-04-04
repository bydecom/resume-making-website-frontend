import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ResumesSection from './components/ResumesSection';
import CVSection from './components/CVSection';
import TemplatesSection from './components/TemplatesSection';
import { resumeData, cvData, templates } from './data';
import CreateCVModal from '../../components/CreateCVModal';
import ScrollToTop from '../Home/components/ScrollToTop';
import { getDefaultTemplate } from '../../templates';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [resumes, setResumes] = useState(resumeData);
  
  // States for CV data fetching and processing
  const [isLoading, setIsLoading] = useState(false);
  const [cvList, setCvList] = useState([]);
  const [error, setError] = useState(null);
  
  const handleCreateNewClick = () => {
    setShowCreateModal(true);
  };

  const handleEditCV = (id) => {
    navigate(`/cv/edit/${id}`);
  };

  const handleDeleteCV = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this CV?");
    if (confirmDelete) {
      setResumes(resumes.filter(resume => resume.id !== id));
      
      // Also remove from cached data
      if (cvList.length > 0) {
        const updatedCVs = cvList.filter(cv => (cv._id || cv.id) !== id);
        setCvList(updatedCVs);
        
        // Update sessionStorage cache
        sessionStorage.setItem('dashboardCVData', JSON.stringify(updatedCVs));
      }
    }
  };
  
  // Fetch CV data from API without showing progress popup
  const fetchCVData = async () => {
    // First check if we have cached data
    const cachedData = sessionStorage.getItem('dashboardCVData');
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        setCvList(parsedData);
        setIsLoading(false);
        return;
      } catch (err) {
        console.error('Error parsing cached data:', err);
        // Continue with fetching new data if cache parsing fails
      }
    }
    
    setIsLoading(true);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Actual API call to fetch CVs
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
      
      // Process the CV data
      const processedCVs = data.data.map(cv => ({
        ...cv,
        template: cv.template || { id: getDefaultTemplate().id },
        score: calculateCVScore(cv),
        progress: calculateCVProgress(cv)
      }));
      
      setCvList(processedCVs);
      
      // Cache the data in sessionStorage
      sessionStorage.setItem('dashboardCVData', JSON.stringify(processedCVs));
      
    } catch (err) {
      console.error('Error fetching CV data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate CV score based on content completeness
  const calculateCVScore = (cv) => {
    let score = 50; // Base score
    
    // Check for personal info
    if (cv.personalInfo) {
      if (cv.personalInfo.firstName && cv.personalInfo.lastName) score += 5;
      if (cv.personalInfo.email) score += 3;
      if (cv.personalInfo.phone) score += 3;
      if (cv.personalInfo.location) score += 2;
      if (cv.personalInfo.linkedin) score += 2;
    }
    
    // Check for other sections
    if (cv.summary && cv.summary.length > 0) score += 5;
    if (cv.experience && cv.experience.length > 0) score += 10;
    if (cv.education && cv.education.length > 0) score += 10;
    if (cv.skills && cv.skills.length > 0) score += 5;
    if (cv.projects && cv.projects.length > 0) score += 5;
    if (cv.certifications && cv.certifications.length > 0) score += 3;
    if (cv.languages && cv.languages.length > 0) score += 2;
    
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
      // Clear cache and fetch fresh data
      sessionStorage.removeItem('dashboardCVData');
      fetchCVData();
      
      // Clear the state to prevent continuous refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);
  
  // Fetch CV data when component mounts (only if no cached data)
  useEffect(() => {
    fetchCVData();
  }, []);

  return (
    <div className="bg-gray-100">
      {/* Main content */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6 mt-16">
            <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
           
          </div>
          
          {/* Content sections - thêm class 'scrollable' */}
          <div className="scrollable">
            <CVSection 
              cvData={cvList.length > 0 ? { cvs: cvList } : cvData} 
              isLoading={isLoading} 
              onEditCV={handleEditCV}
              onDeleteCV={handleDeleteCV}
            />
            <ResumesSection resumeData={resumes} />
            <TemplatesSection templates={templates} />
          </div>
        </div>
      </main>

      {/* Modal */}
      <CreateCVModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
      
      {/* Nút scroll to top */}
      <ScrollToTop />
    </div>
  );
};

export default Dashboard;