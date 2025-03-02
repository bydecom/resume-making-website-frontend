import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import CVSection from "./components/CVSection";
import ResumesSection from "./components/ResumesSection";
import TemplatesSection from "./components/TemplatesSection";
import { cvData, resumeData, templates } from "./data";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto space-y-8">
            <CVSection cvData={cvData} />
            <ResumesSection resumeData={resumeData} />
            <TemplatesSection templates={templates} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;