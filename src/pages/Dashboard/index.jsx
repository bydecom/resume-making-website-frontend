import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ResumesSection from './components/ResumesSection';
import CVSection from './components/CVSection';
import TemplatesSection from './components/TemplatesSection';
import { resumeData, cvData, templates } from './data';
import CreateCVModal from '../../components/CreateCVModal';
import ScrollToTop from '../Home/components/ScrollToTop';
import { getDefaultTemplate } from '../../templates';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [resumes, setResumes] = useState(resumeData);
  const [cvData, setCvData] = useState({ cvs: [] });
  
  // States for CV data fetching and processing
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
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

        // If delete successful, update the UI
        setResumes(resumes.filter(resume => resume.id !== id));
        setCvData(prevData => ({
          ...prevData,
          cvs: prevData.cvs.filter(cv => (cv._id || cv.id) !== id)
        }));

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
      
      setCvData({ cvs: processedCVs });
      
    } catch (err) {
      console.error('Error fetching CV data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
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
  
  // Fetch CV data when component mounts
  useEffect(() => {
    fetchCVData();
  }, []);

  const handleCreateNewResume = () => {
    console.log('Current CV data:', cvData); // For debugging
    
    // Chuẩn bị dữ liệu CV nếu có
    const selectedCV = cvData && cvData.cvs && cvData.cvs.length > 0 
      ? {
          ...cvData.cvs[0],
          personalInfo: cvData.cvs[0].personalInfo || {},
          summary: cvData.cvs[0].summary || '',
          experience: cvData.cvs[0].experience || [],
          education: cvData.cvs[0].education || [],
          skills: cvData.cvs[0].skills || [],
          projects: cvData.cvs[0].projects || [],
          certifications: cvData.cvs[0].certifications || [],
          languages: cvData.cvs[0].languages || [],
          template: cvData.cvs[0].template || { id: getDefaultTemplate().id },
          _id: cvData.cvs[0]._id,
          name: cvData.cvs[0].name || 'Untitled CV',
          progress: calculateCVProgress(cvData.cvs[0]),
          score: calculateCVScore(cvData.cvs[0])
        }
      : null;

    // Luôn chuyển đến new-resume, kèm theo dữ liệu CV nếu có
    navigate('/new-resume', { 
      state: { selectedCV }
    });
  };

  return (
    <div className="bg-gray-100">
      {/* Main content */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6 mt-16">
           
          </div>
          
          {/* Content sections - thêm class 'scrollable' */}
          <div className="scrollable">
            <CVSection 
              cvData={cvData} 
              isLoading={isLoading} 
              onEditCV={handleEditCV}
              onDeleteCV={handleDeleteCV}
              setCvData={setCvData}
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