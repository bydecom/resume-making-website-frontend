import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ResumesSection from './components/ResumesSection';
import CVSection from './components/CVSection';
import TemplatesSection from './components/TemplatesSection';
import { resumeData, cvData, templates } from './data';
import CreateCVModal from '../../components/CreateCVModal';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [resumes, setResumes] = useState(resumeData);

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
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-800 mt-4">Dashboard</h1>
            </div>
            <CVSection cvData={cvData} />
            <ResumesSection resumeData={resumes} />
            <TemplatesSection templates={templates} />
          </div>
        </main>
      </div>



      {/* No resumes message */}
      {resumes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You don't have any CVs yet</p>
          <button
            onClick={handleCreateNewClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create your first CV
          </button>
        </div>
      )}

      {/* Modal để chọn cách tạo CV */}
      <CreateCVModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
};

export default Dashboard;