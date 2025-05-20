import React from 'react';
import Header from './components/Header';
import Summary from './components/Summary';
import Experience from './components/Experience';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Languages from './components/Languages';
import Activities from './components/Activities';
import AdditionalInfo from './components/AdditionalInfo';
import '../../pages/NewCV/lib/input-styles.css';


const ProfessionalBlueTemplate = ({ formData }) => {
  console.log(formData);
  return (
    <div className="cv-preview bg-white rounded-lg overflow-hidden shadow-lg cv-wrapper" 
      style={{ 
        fontFamily: '"Roboto", sans-serif', 
        color: '#374151', 
        fontSize: '0.9rem'
      }}>
      <Header personalInfo={formData?.personalInfo} />
      <div className="content-wrapper">
        <Summary summary={formData?.summary} />
        <Experience experience={formData?.experience} />
        <Education education={formData?.education} />
        <Skills skills={formData?.skills} />
        <Projects projects={formData?.projects} />
        <Certifications certifications={formData?.certifications} />
        <Languages languages={formData?.languages} />
        <Activities activities={formData?.activities} />
        <AdditionalInfo 
          additionalInfo={formData?.additionalInfo}
          customFields={formData?.customFields}
        />
      </div>
    </div>
  );
};

export default ProfessionalBlueTemplate; 