import React, { useEffect } from 'react';
import '../../pages/NewCV/lib/input-styles.css';
import Header from './components/Header';
import Summary from './components/Summary';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Activities from './components/Activities';
import Education from './components/Education';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Languages from './components/Languages';
import AdditionalInfo from './components/AdditionalInfo';

const ModernTemplate = ({ formData }) => {
  // Font Awesome setup
  useEffect(() => {
    if (!document.getElementById('font-awesome-css')) {
      const link = document.createElement('link');
      link.id = 'font-awesome-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      document.head.appendChild(link);
    }
  }, []);

  // PDF icon styles
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'pdf-icon-styles';
    style.innerHTML = `
      .pdf-safe-icon { position: relative; }
      .pdf-icon-fallback { display: none; margin-right: 8px; }
      .cv-wrapper.for-pdf .pdf-icon-fallback { display: inline-block; }
      .cv-wrapper.for-pdf i.fas, 
      .cv-wrapper.for-pdf i.far, 
      .cv-wrapper.for-pdf i.fab { display: none; }
    `;
    if (!document.getElementById('pdf-icon-styles')) {
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="cv-preview bg-white rounded-lg overflow-hidden shadow-lg cv-wrapper" 
      style={{ 
        fontFamily: '"Roboto", sans-serif', 
        color: '#2d3748', 
        fontSize: '0.9rem'
      }}>
      <Header personalInfo={formData?.personalInfo} />
      
      <div className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column */}
          <div className="w-full md:w-2/3">
            <Summary summary={formData?.summary} />
            <Experience experience={formData?.experience} />
            <Projects projects={formData?.projects} />
            <Activities activities={formData?.activities} />
          </div>
          
          {/* Right Column */}
          <div className="w-full md:w-1/3">
            <Education education={formData?.education} />
            <Skills skills={formData?.skills} />
            <Certifications certifications={formData?.certifications} />
            <Languages languages={formData?.languages} />
            <AdditionalInfo additionalInfo={formData?.additionalInfo} customFields={formData?.customFields} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
