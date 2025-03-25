import React, { useEffect, useState, memo } from 'react';
import { FiMail, FiPhone, FiMapPin, FiGlobe, FiLinkedin, FiCalendar, FiBriefcase, FiBook, FiAward, FiCode, FiGlobe as FiLanguage } from 'react-icons/fi';

const CVPreview = ({ formData }) => {
  // State để lưu trữ dữ liệu đã xử lý
  const [processedData, setProcessedData] = useState(formData);

  // Cập nhật processedData khi formData thay đổi
  useEffect(() => {
    console.log("CV Preview received new data:", formData);
    setProcessedData(formData);
  }, [formData]);

  // Destructure processedData để dễ sử dụng
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
  } = processedData || {};

  // Template styles
  const styles = {
    primary: '#2563eb', // Blue color
    secondary: '#f3f4f6', // Light gray
    text: '#374151', // Dark gray
    lightText: '#6b7280', // Medium gray
    fontPrimary: '"Roboto", sans-serif',
    fontSecondary: '"Open Sans", sans-serif',
  };

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
        fontFamily: styles.fontPrimary, 
        color: styles.text, 
        fontSize: '0.9rem'
      }}>
      {/* Header Section */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <h1 className="text-2xl font-bold mb-1 cv-long-text">
          {personalInfo?.firstName || 'John'} {personalInfo?.lastName || 'Doe'}
        </h1>
        <p className="text-sm opacity-90 mb-4 cv-long-text">
          {personalInfo?.headline || 'Professional Title'}
        </p>
        
        {/* First row: Email, Phone, Location */}
        <div className="flex text-xs mb-2">
          {personalInfo?.email && (
            <div className="flex items-center cv-flex-item">
              <FiMail className="mr-1 flex-shrink-0" />
              <span className="cv-long-text">{personalInfo.email}</span>
            </div>
          )}
          
          {personalInfo?.phone && (
            <div className="flex items-center cv-flex-item ml-6">
              <FiPhone className="mr-1 flex-shrink-0" />
              <span className="cv-long-text">{personalInfo.phone}</span>
            </div>
          )}
          
          {(personalInfo?.location || personalInfo?.country) && (
            <div className="flex items-center cv-flex-item ml-6">
              <FiMapPin className="mr-1 flex-shrink-0" />
              <span className="cv-long-text">
                {personalInfo.location}
                {personalInfo.location && personalInfo.country && ', '}
                {personalInfo.country}
              </span>
            </div>
          )}
        </div>
        
        {/* Second row: Website and LinkedIn */}
        <div className="flex flex-wrap gap-3 text-xs">
          {personalInfo?.website && (
            <div className="flex items-center cv-flex-item">
              <FiGlobe className="mr-1 flex-shrink-0" />
              <span className="cv-long-text">{personalInfo.website}</span>
            </div>
          )}
          
          {personalInfo?.linkedin && (
            <div className="flex items-center cv-flex-item">
              <FiLinkedin className="mr-1 flex-shrink-0" />
              <span className="cv-long-text">{personalInfo.linkedin}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-6">
        {/* Summary Section */}
        {summary && (
          <div className="mb-5">
            <h2 className="text-lg font-bold border-b-2 border-blue-600 pb-1 mb-3">Professional Summary</h2>
            <p className="text-sm leading-relaxed cv-long-text">{summary}</p>
          </div>
        )}
        
        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <div className="mb-5">
            <h2 className="text-lg font-bold border-b-2 border-blue-600 pb-1 mb-3">Work Experience</h2>
            <div className="space-y-3">
              {experience.map((job, index) => (
                <div key={index} className="text-sm">
                  <div className="flex flex-wrap justify-between items-start">
                    <div className="cv-flex-item" style={{ maxWidth: '70%' }}>
                      <h3 className="font-bold cv-long-text">{job.position || 'Job Title'}</h3>
                      <p className="text-blue-600 cv-long-text">{job.company || 'Company Name'}</p>
                    </div>
                    <div className="flex items-center text-gray-500 whitespace-normal">
                      <FiCalendar className="mr-1 flex-shrink-0" size={12} />
                      <span>
                        {formatDate(job.startDate)}
                        {job.startDate && (job.endDate || job.isPresent) && ' - '}
                        {formatDate(job.endDate, job.isPresent)}
                      </span>
                    </div>
                  </div>
                  {job.description && (
                    <p className="mt-2 cv-long-text">{job.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Education Section */}
        {education && education.length > 0 && (
          <div className="mb-5">
            <h2 className="text-lg font-bold border-b-2 border-blue-600 pb-1 mb-3">Education</h2>
            <div className="space-y-3">
              {education.map((edu, index) => (
                <div key={index} className="text-sm">
                  <div className="flex flex-wrap justify-between items-start">
                    <div className="cv-flex-item" style={{ maxWidth: '70%' }}>
                      <h3 className="font-bold cv-long-text">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                      <p className="text-blue-600 cv-long-text">{edu.institution || 'Institution'}</p>
                    </div>
                    <div className="flex items-center text-gray-500 whitespace-normal">
                      <FiCalendar className="mr-1 flex-shrink-0" size={12} />
                      <span>
                        {formatDate(edu.startDate)}
                        {edu.startDate && (edu.endDate || edu.isPresent) && ' - '}
                        {formatDate(edu.endDate, edu.isPresent)}
                      </span>
                    </div>
                  </div>
                  {edu.description && (
                    <p className="mt-2 cv-long-text">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <div className="mb-5">
            <h2 className="text-lg font-bold border-b-2 border-blue-600 pb-1 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs cv-long-text overflow-hidden"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Projects */}
        {projects && projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b-2 pb-1 mb-3" style={{ borderColor: styles.primary, color: styles.text }}>
              Projects
            </h2>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index} className="text-sm">
                  <div className="flex flex-wrap justify-between items-start">
                    <div className="cv-flex-item" style={{ maxWidth: '70%' }}>
                      <h3 className="font-semibold cv-long-text">{project.title}</h3>
                      {project.role && <p className="text-sm cv-long-text" style={{ color: styles.lightText }}>{project.role}</p>}
                    </div>
                    <div className="flex items-center text-xs whitespace-normal" style={{ color: styles.lightText }}>
                      <FiCalendar className="mr-1" />
                      <span>
                        {formatDate(project.startDate)} - {project.isPresent ? 'Present' : formatDate(project.endDate)}
                      </span>
                    </div>
                  </div>
                  {project.description && (
                    <p className="mt-2 cv-long-text">{project.description}</p>
                  )}
                  {project.url && (
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mt-1 text-xs flex items-center cv-long-text" 
                      style={{ color: styles.primary }}
                    >
                      <FiGlobe className="mr-1 flex-shrink-0" /> {project.url}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b-2 pb-1 mb-3" style={{ borderColor: styles.primary, color: styles.text }}>
              Certifications
            </h2>
            <div className="space-y-3">
              {certifications.map((cert, index) => (
                <div key={index} className="text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{cert.name}</h3>
                      <p className="text-sm" style={{ color: styles.lightText, wordBreak: 'break-all' }}>{cert.issuer}</p>
                    </div>
                    <div className="flex items-center text-xs" style={{ color: styles.lightText }}>
                      <FiCalendar className="mr-1" />
                      <span>
                        {formatDate(cert.issueDate)}
                        {!cert.doesNotExpire && cert.expirationDate && ` - ${formatDate(cert.expirationDate)}`}
                        {cert.doesNotExpire && ' (No Expiration)'}
                      </span>
                    </div>
                  </div>
                  {cert.credentialURL && (
                    <a 
                      href={cert.credentialURL} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mt-1 text-xs flex items-center" 
                      style={{ color: styles.primary }}
                    >
                      <FiGlobe className="mr-1" /> View Credential
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Languages */}
        {languages && languages.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b-2 pb-1 mb-3" style={{ borderColor: styles.primary, color: styles.text }}>
              Languages
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang, index) => (
                <div key={index} className="text-sm flex items-center">
                  <FiLanguage className="mr-2" style={{ color: styles.primary }} />
                  <span className="font-medium" style={{ wordBreak: 'break-all' }}>{lang.language}</span>
                  <span className="ml-2 text-xs" style={{ color: styles.lightText }}>({lang.proficiency})</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Activities */}
        {activities && activities.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b-2 pb-1 mb-3" style={{ borderColor: styles.primary, color: styles.text }}>
              Activities
            </h2>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{activity.organization}</h3>
                      {activity.role && <p className="text-sm" style={{ color: styles.lightText, wordBreak: 'break-all' }}>{activity.role}</p>}
                    </div>
                    <div className="flex items-center text-xs" style={{ color: styles.lightText }}>
                      <FiCalendar className="mr-1" />
                      <span>
                        {formatDate(activity.startDate)} - {activity.isPresent ? 'Present' : formatDate(activity.endDate)}
                      </span>
                    </div>
                  </div>
                  {activity.description && <p className="mt-1 text-sm" style={{ wordBreak: 'break-all' }}>{activity.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Custom Fields Section */}
        {customFields && customFields.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b-2 pb-1 mb-3" style={{ borderColor: styles.primary, color: styles.text }}>
              Additional Information
            </h2>
            <div className="space-y-3">
              {customFields.map((field, index) => (
                <div key={index} className="text-sm">
                  <h3 className="font-semibold">{field.label}</h3>
                  <p className="text-sm" style={{ color: styles.lightText, wordBreak: 'break-all' }}>{field.value}</p>
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
              <div className="mb-6">
                <h2 className="text-lg font-bold border-b-2 pb-1 mb-3" style={{ borderColor: styles.primary, color: styles.text }}>
                  Interests
                </h2>
                <ul className="list-disc pl-5 space-y-1">
                  {additionalInfo.interests.split('\n').filter(item => item.trim() !== '').map((item, index) => (
                    <li key={index} className="text-sm leading-relaxed cv-long-text">{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Achievements */}
            {additionalInfo.achievements && (
              <div className="mb-6">
                <h2 className="text-lg font-bold border-b-2 pb-1 mb-3" style={{ borderColor: styles.primary, color: styles.text }}>
                  Achievements
                </h2>
                <ul className="list-disc pl-5 space-y-1">
                  {additionalInfo.achievements.split('\n').filter(item => item.trim() !== '').map((item, index) => (
                    <li key={index} className="text-sm leading-relaxed cv-long-text">{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Publications */}
            {additionalInfo.publications && (
              <div className="mb-6">
                <h2 className="text-lg font-bold border-b-2 pb-1 mb-3" style={{ borderColor: styles.primary, color: styles.text }}>
                  Publications
                </h2>
                <ul className="list-disc pl-5 space-y-1">
                  {additionalInfo.publications.split('\n').filter(item => item.trim() !== '').map((item, index) => (
                    <li key={index} className="text-sm leading-relaxed cv-long-text">{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* References */}
            {additionalInfo?.references && (
              <div className="mb-6">
                <h2 className="text-lg font-bold border-b-2 pb-1 mb-3" style={{ borderColor: styles.primary, color: styles.text }}>
                  References
                </h2>
                <div className="space-y-4">
                  {additionalInfo.references.split('\n').filter(item => item.trim() !== '').map((refString, index) => {
                    try {
                      const ref = JSON.parse(refString);
                      return (
                        <div key={index} className="text-sm">
                          <div className="flex flex-wrap justify-between items-start">
                            <div className="cv-flex-item">
                              <h3 className="font-semibold cv-long-text">{ref.name}</h3>
                              <p className="text-sm cv-long-text" style={{ color: styles.lightText }}>
                                {ref.position}{ref.company ? `, ${ref.company}` : ''}
                              </p>
                              {(ref.email || ref.phone) && (
                                <p className="text-xs cv-long-text" style={{ color: styles.lightText }}>
                                  {ref.email}
                                  {ref.email && ref.phone && " • "}
                                  {ref.phone}
                                </p>
                              )}
                              {ref.available && (
                                <p className="text-xs italic mt-1" style={{ color: styles.lightText }}>
                                  Available upon request
                                </p>
                              )}
                            </div>
                          </div>
                          {ref.relationship && (
                            <p className="mt-1 text-sm cv-long-text">{ref.relationship}</p>
                          )}
                        </div>
                      );
                    } catch (e) {
                      // Fallback for non-JSON references
                      return (
                        <li key={index} className="text-sm leading-relaxed cv-long-text">{refString}</li>
                      );
                    }
                  })}
                </div>
              </div>
            )}
            
            {/* Custom Sections */}
            {additionalInfo.customSections && additionalInfo.customSections.length > 0 && (
              additionalInfo.customSections.map((section, index) => (
                <div key={index} className="mb-6">
                  <h2 className="text-lg font-bold border-b-2 pb-1 mb-3" style={{ borderColor: styles.primary, color: styles.text }}>
                    {section.title}
                  </h2>
                  <p className="text-sm leading-relaxed cv-long-text">{section.content}</p>
                </div>
              ))
            )}
          </>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-4 bg-gray-50 text-center text-xs text-gray-500">
        Created with Resume Builder
      </div>
    </div>
  );
};

// Sử dụng memo để tối ưu hóa việc render lại
export default memo(CVPreview); 