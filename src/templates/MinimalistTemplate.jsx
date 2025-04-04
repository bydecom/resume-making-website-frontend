import React from 'react';
import { FiMail, FiPhone, FiMapPin, FiGlobe, FiLinkedin } from 'react-icons/fi';
import '../pages/NewCV/lib/input-styles.css';

const MinimalistTemplate = ({ formData }) => {
  // Destructure data để dễ sử dụng
  const {
    personalInfo,
    summary,
    education,
    experience,
    skills,
    certifications,
    projects,
    languages,
    activities,
    additionalInfo,
    customFields
  } = formData || {};

  // Hàm format ngày tháng an toàn
  const formatDate = (dateString, isPresent = false) => {
    if (isPresent) return 'Present';
    if (!dateString) return '';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };

  return (
    <div className="cv-preview bg-white rounded-lg overflow-hidden shadow-lg cv-wrapper" 
      style={{ 
        fontFamily: '"Inter", sans-serif', 
        color: '#333333', 
        fontSize: '0.9rem'
      }}>
      {/* Header Section */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-1 border-b pb-2 cv-long-text">
          {personalInfo?.firstName || 'John'} {personalInfo?.lastName || 'Doe'}
        </h1>
        
        <p className="text-sm text-gray-600 my-2 cv-long-text">
          {personalInfo?.headline || 'Professional Title'}
        </p>
        
        {/* Contact Info */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-700 mt-3">
          {personalInfo?.email && (
            <div className="flex items-center">
              <FiMail className="mr-1" />
              <span className="cv-long-text">{personalInfo.email}</span>
            </div>
          )}
          
          {personalInfo?.phone && (
            <div className="flex items-center">
              <FiPhone className="mr-1" />
              <span className="cv-long-text">{personalInfo.phone}</span>
            </div>
          )}
          
          {(personalInfo?.location || personalInfo?.country) && (
            <div className="flex items-center">
              <FiMapPin className="mr-1" />
              <span className="cv-long-text">
                {personalInfo.location}
                {personalInfo.location && personalInfo.country && ', '}
                {personalInfo.country}
              </span>
            </div>
          )}
          
          {personalInfo?.website && (
            <div className="flex items-center">
              <FiGlobe className="mr-1" />
              <span className="cv-long-text">{personalInfo.website}</span>
            </div>
          )}
          
          {personalInfo?.linkedin && (
            <div className="flex items-center">
              <FiLinkedin className="mr-1" />
              <span className="cv-long-text">{personalInfo.linkedin}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="px-6 pb-6">
        {/* Summary Section */}
        {summary && (
          <div className="mb-5">
            <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Summary</h2>
            <p className="text-sm leading-relaxed text-gray-700 cv-long-text">{summary}</p>
          </div>
        )}
        
        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <div className="mb-5">
            <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Experience</h2>
            <div className="space-y-3">
              {experience.map((job, index) => (
                <div key={index} className="text-sm">
                  <div className="flex flex-wrap justify-between items-start">
                    <div className="cv-flex-item" style={{ maxWidth: '70%' }}>
                      <h3 className="font-medium cv-long-text">{job.position || 'Job Title'}</h3>
                      <p className="cv-long-text">{job.company || 'Company Name'}</p>
                    </div>
                    <div className="text-gray-500 whitespace-normal text-xs">
                      {formatDate(job.startDate)}
                      {job.startDate && (job.endDate || job.isPresent) && ' - '}
                      {formatDate(job.endDate, job.isPresent)}
                    </div>
                  </div>
                  {job.description && (
                    <p className="mt-1 text-gray-600 cv-long-text">{job.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Education Section */}
        {education && education.length > 0 && (
          <div className="mb-5">
            <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Education</h2>
            <div className="space-y-3">
              {education.map((edu, index) => (
                <div key={index} className="text-sm">
                  <div className="flex flex-wrap justify-between items-start">
                    <div className="cv-flex-item" style={{ maxWidth: '70%' }}>
                      <h3 className="font-medium cv-long-text">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                      <p className="cv-long-text">{edu.institution || 'Institution'}</p>
                    </div>
                    <div className="text-gray-500 whitespace-normal text-xs">
                      {formatDate(edu.startDate)}
                      {edu.startDate && (edu.endDate || edu.isPresent) && ' - '}
                      {formatDate(edu.endDate, edu.isPresent)}
                    </div>
                  </div>
                  {edu.description && (
                    <p className="mt-1 text-gray-600 cv-long-text">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <div className="mb-5">
            <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="border border-gray-300 px-2 py-1 rounded text-xs cv-long-text overflow-hidden"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Projects */}
        {projects && projects.length > 0 && (
          <div className="mb-5">
            <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Projects</h2>
            <div className="space-y-3">
              {projects.map((project, index) => (
                <div key={index} className="text-sm">
                  <div className="flex flex-wrap justify-between items-start">
                    <div className="cv-flex-item" style={{ maxWidth: '70%' }}>
                      <h3 className="font-medium cv-long-text">{project.title}</h3>
                      {project.role && <p className="text-sm cv-long-text text-gray-600">{project.role}</p>}
                    </div>
                    <div className="text-xs text-gray-500 whitespace-normal">
                      {formatDate(project.startDate)} - {project.isPresent ? 'Present' : formatDate(project.endDate)}
                    </div>
                  </div>
                  {project.description && (
                    <p className="mt-1 text-gray-600 cv-long-text">{project.description}</p>
                  )}
                  {project.url && (
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mt-1 text-xs flex items-center cv-long-text text-gray-600" 
                    >
                      <FiGlobe className="mr-1" /> {project.url}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div className="mb-5">
            <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Certifications</h2>
            <div className="space-y-3">
              {certifications.map((cert, index) => (
                <div key={index} className="text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{cert.name}</h3>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(cert.issueDate)}
                      {!cert.doesNotExpire && cert.expirationDate && ` - ${formatDate(cert.expirationDate)}`}
                      {cert.doesNotExpire && ' (No Expiration)'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Languages */}
        {languages && languages.length > 0 && (
          <div className="mb-5">
            <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Languages</h2>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">{lang.language}</span>
                  <span className="ml-2 text-xs text-gray-600">({lang.proficiency})</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Activities */}
        {activities && activities.length > 0 && (
          <div className="mb-5">
            <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Activities</h2>
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <div key={index} className="text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{activity.organization}</h3>
                      {activity.role && <p className="text-sm text-gray-600">{activity.role}</p>}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(activity.startDate)} - {activity.isPresent ? 'Present' : formatDate(activity.endDate)}
                    </div>
                  </div>
                  {activity.description && <p className="mt-1 text-sm text-gray-600">{activity.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Additional Info Section */}
        {additionalInfo && (
          <>
            {/* Interests */}
            {additionalInfo.interests && (
              <div className="mb-5">
                <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Interests</h2>
                <p className="text-sm text-gray-700 cv-long-text">{additionalInfo.interests}</p>
              </div>
            )}
            
            {/* Achievements */}
            {additionalInfo.achievements && (
              <div className="mb-5">
                <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Achievements</h2>
                <p className="text-sm text-gray-700 cv-long-text">{additionalInfo.achievements}</p>
              </div>
            )}
            
            {/* Publications */}
            {additionalInfo.publications && (
              <div className="mb-5">
                <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Publications</h2>
                <p className="text-sm text-gray-700 cv-long-text">{additionalInfo.publications}</p>
              </div>
            )}
            
            {/* References */}
            {additionalInfo.references && (
              <div className="mb-5">
                <h2 className="text-md uppercase tracking-wider font-semibold mb-2">References</h2>
                <div className="space-y-3">
                  {additionalInfo.references.split('\n').filter(item => item.trim() !== '').map((refString, index) => {
                    try {
                      const ref = JSON.parse(refString);
                      return (
                        <div key={index} className="p-3 bg-gray-50 rounded-md">
                          <div className="font-medium">{ref.name}</div>
                          {ref.position && <div>{ref.position}{ref.company ? `, ${ref.company}` : ''}</div>}
                          {(ref.email || ref.phone) && (
                            <div className="text-sm text-gray-600">
                              {ref.email}
                              {ref.email && ref.phone && " • "}
                              {ref.phone}
                            </div>
                          )}
                        </div>
                      );
                    } catch (e) {
                      return <div key={index} className="p-3 bg-gray-50 rounded-md">{refString}</div>;
                    }
                  })}
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Custom Fields Section */}
        {customFields && customFields.length > 0 && (
          <div className="mb-5">
            <h2 className="text-md uppercase tracking-wider font-semibold mb-2">Additional Information</h2>
            <div className="space-y-3">
              {customFields.map((field, index) => (
                <div key={index} className="text-sm">
                  <h3 className="font-medium">{field.label}</h3>
                  <p className="text-sm text-gray-600">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinimalistTemplate; 