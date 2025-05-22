import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, HeadingLevel, AlignmentType, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Converts CV data to DOCX format and triggers download
 * @param {Object} options - Export options
 * @param {Object} options.formData - CV data
 * @param {Function} options.onStatusChange - Callback for export status changes
 * @param {Function} options.onError - Callback for handling errors
 */
export const exportCVToDocx = async ({ formData, onStatusChange, onError }) => {
  try {
    onStatusChange?.(true);
    
    // Normalize the data to match the expected format for docx creation
    const normalizedData = normalizeData(formData);
    const doc = createDocxFromCV(normalizedData);
    
    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, `${normalizedData.personal?.name || formData.name || 'CV'}.docx`);
    
    onStatusChange?.(false);
    return true;
  } catch (error) {
    console.error('Error exporting CV to DOCX:', error);
    onStatusChange?.(false);
    onError?.(error);
    return false;
  }
};

/**
 * Converts Resume data to DOCX format and triggers download
 * @param {Object} options - Export options
 * @param {Object} options.formData - Resume data
 * @param {Function} options.onStatusChange - Callback for export status changes
 * @param {Function} options.onError - Callback for handling errors
 */
export const exportResumeToDocx = async ({ formData, onStatusChange, onError }) => {
  try {
    onStatusChange?.(true);
    
    // Use the same normalizeData and createDocxFromCV functions
    // Since resume structure is similar to CV structure
    const normalizedData = normalizeData(formData);
    const doc = createDocxFromCV(normalizedData);
    
    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, `${normalizedData.personal?.name || formData.name || 'Resume'}.docx`);
    
    onStatusChange?.(false);
    return true;
  } catch (error) {
    console.error('Error exporting Resume to DOCX:', error);
    onStatusChange?.(false);
    onError?.(error);
    return false;
  }
};

/**
 * Check if a value is considered empty or N/a
 * @param {any} value - Value to check
 * @returns {boolean} - True if value is empty or N/a
 */
function isEmpty(value) {
  return value === undefined 
    || value === null 
    || value === '' 
    || value === 'N/a' 
    || value === 'n/a'
    || value === 'N/A'
    || value === 'Invalid Date'
    || value === 'NaN'
    || (typeof value === 'string' && value.trim() === '');
}

/**
 * Normalize CV data to match the expected format for docx creation
 * @param {Object} data - CV data from database or form
 * @returns {Object} - Normalized data
 */
function normalizeData(data) {
  // Create a normalized structure that the docx creation function expects
  const normalizedData = {
    personal: {
      name: data.personalInfo?.firstName && data.personalInfo?.lastName 
        ? `${data.personalInfo.firstName} ${data.personalInfo.lastName}`
        : data.personal?.name || data.name || '',
      title: !isEmpty(data.personalInfo?.professionalHeadline) ? data.personalInfo.professionalHeadline : 
             !isEmpty(data.personal?.title) ? data.personal.title : '',
      email: !isEmpty(data.personalInfo?.email) ? data.personalInfo.email : 
             !isEmpty(data.personal?.email) ? data.personal.email : '',
      phone: !isEmpty(data.personalInfo?.phone) ? data.personalInfo.phone : 
             !isEmpty(data.personal?.phone) ? data.personal.phone : '',
      location: !isEmpty(data.personalInfo?.location) ? data.personalInfo.location : 
                !isEmpty(data.personal?.location) ? data.personal.location : '',
      country: !isEmpty(data.personalInfo?.country) ? data.personalInfo.country : 
               !isEmpty(data.personal?.country) ? data.personal.country : '',
      website: !isEmpty(data.personalInfo?.website) ? data.personalInfo.website : 
               !isEmpty(data.personal?.website) ? data.personal.website : '',
      linkedin: !isEmpty(data.personalInfo?.linkedin) ? data.personalInfo.linkedin : 
                !isEmpty(data.personal?.linkedin) ? data.personal.linkedin : ''
    },
    objective: !isEmpty(data.summary) ? data.summary : 
               !isEmpty(data.objective) ? data.objective : '',
    
    experience: Array.isArray(data.experience) 
      ? data.experience
          .filter(exp => !isEmpty(exp.position) || !isEmpty(exp.company)) // Filter out completely empty entries
          .map(exp => ({
            position: !isEmpty(exp.position) ? exp.position : 
                      !isEmpty(exp.title) ? exp.title : '',
            company: !isEmpty(exp.company) ? exp.company :
                     !isEmpty(exp.employer) ? exp.employer : '',
            startDate: !isEmpty(exp.startDate) ? exp.startDate : 
                       !isEmpty(exp.start_date) ? exp.start_date : '',
            endDate: exp.isPresent ? 'Present' : 
                     !isEmpty(exp.endDate) ? exp.endDate :
                     !isEmpty(exp.end_date) ? exp.end_date : '',
            current: !!exp.isPresent,
            description: !isEmpty(exp.description) ? exp.description : '',
            location: !isEmpty(exp.location) ? exp.location : ''
          }))
      : [],
      
    education: Array.isArray(data.education)
      ? data.education
          .filter(edu => !isEmpty(edu.degree) || !isEmpty(edu.institution)) // Filter out completely empty entries
          .map(edu => ({
            degree: !isEmpty(edu.degree) ? edu.degree : '',
            institution: !isEmpty(edu.institution) ? edu.institution :
                         !isEmpty(edu.school) ? edu.school : '',
            startDate: !isEmpty(edu.startDate) ? edu.startDate :
                       !isEmpty(edu.start_date) ? edu.start_date : '',
            endDate: edu.isPresent ? 'Present' :
                     !isEmpty(edu.endDate) ? edu.endDate :
                     !isEmpty(edu.end_date) ? edu.end_date : '',
            current: !!edu.isPresent,
            description: !isEmpty(edu.description) ? edu.description : '',
            location: !isEmpty(edu.location) ? edu.location : ''
          }))
      : [],
      
    skills: Array.isArray(data.skills)
      ? (typeof data.skills[0] === 'string' 
         ? data.skills
             .filter(skill => !isEmpty(skill))
             .map(skill => ({ name: skill })) 
         : data.skills.filter(skill => !isEmpty(skill.name)))
      : [],
      
    projects: Array.isArray(data.projects)
      ? data.projects
          .filter(proj => !isEmpty(proj.title) || !isEmpty(proj.name)) // Filter out completely empty entries
          .map(proj => ({
            title: !isEmpty(proj.title) ? proj.title : 
                   !isEmpty(proj.name) ? proj.name : '',
            role: !isEmpty(proj.role) ? proj.role : '',
            startDate: !isEmpty(proj.startDate) ? proj.startDate :
                       !isEmpty(proj.start_date) ? proj.start_date : '',
            endDate: proj.isPresent ? 'Present' :
                     !isEmpty(proj.endDate) ? proj.endDate :
                     !isEmpty(proj.end_date) ? proj.end_date : '',
            current: !!proj.isPresent,
            description: !isEmpty(proj.description) ? proj.description : '',
            url: !isEmpty(proj.url) ? proj.url :
                 !isEmpty(proj.link) ? proj.link : ''
          }))
      : [],
      
    certifications: Array.isArray(data.certifications)
      ? data.certifications
          .filter(cert => !isEmpty(cert.name) || !isEmpty(cert.title)) // Filter out completely empty entries
          .map(cert => ({
            name: !isEmpty(cert.name) ? cert.name :
                  !isEmpty(cert.title) ? cert.title : '',
            issuer: !isEmpty(cert.issuer) ? cert.issuer :
                    !isEmpty(cert.organization) ? cert.organization : '',
            date: !isEmpty(cert.date) ? cert.date : '',
            url: !isEmpty(cert.url) ? cert.url :
                 !isEmpty(cert.link) ? cert.link : ''
          }))
      : [],
      
    languages: Array.isArray(data.languages)
      ? data.languages
          .filter(lang => !isEmpty(lang.language) || !isEmpty(lang.name)) // Filter out completely empty entries
          .map(lang => ({
            name: !isEmpty(lang.language) ? lang.language :
                  !isEmpty(lang.name) ? lang.name : '',
            level: !isEmpty(lang.proficiency) ? lang.proficiency :
                   !isEmpty(lang.level) ? lang.level : ''
          }))
      : [],
      
    additional: []
  };
  
  // Add additional info sections if they exist
  if (data.additionalInfo) {
    const additionalInfo = data.additionalInfo;
    
    if (!isEmpty(additionalInfo.interests)) {
      normalizedData.additional.push({
        title: 'Interests',
        items: [{ description: additionalInfo.interests }]
      });
    }
    
    if (!isEmpty(additionalInfo.achievements)) {
      normalizedData.additional.push({
        title: 'Achievements',
        items: [{ description: additionalInfo.achievements }]
      });
    }
    
    if (!isEmpty(additionalInfo.publications)) {
      normalizedData.additional.push({
        title: 'Publications',
        items: [{ description: additionalInfo.publications }]
      });
    }
    
    if (!isEmpty(additionalInfo.references)) {
      normalizedData.additional.push({
        title: 'References',
        items: [{ description: additionalInfo.references }]
      });
    }
  }
  
  // Add custom fields if they exist
  if (Array.isArray(data.customFields) && data.customFields.length > 0) {
    const validCustomFields = data.customFields.filter(field => !isEmpty(field.label) && !isEmpty(field.value));
    
    if (validCustomFields.length > 0) {
      normalizedData.additional.push({
        title: 'Additional Information',
        items: validCustomFields.map(field => ({
          title: field.label,
          description: field.value
        }))
      });
    }
  }
  
  return normalizedData;
}

/**
 * Extract plain text from HTML string
 * @param {string} html - HTML string
 * @returns {string} - Plain text
 */
function extractTextFromHtml(html) {
  if (!html || typeof html !== 'string') return '';
  
  // Simple regex to remove HTML tags
  return html.replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

/**
 * Format date string to a readable format
 * @param {string} dateString - Date string
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
  if (isEmpty(dateString)) return '';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is invalid
    if (isNaN(date.getTime())) {
      return ''; // Return empty string for invalid dates
    }
    
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  } catch (e) {
    return ''; // Return empty string if parsing fails
  }
}

/**
 * Creates a DOCX Document from CV data
 * @param {Object} formData - CV data
 * @returns {Document} - DOCX Document object
 */
function createDocxFromCV(formData) {
  const sections = [];
  
  // Personal Information Section
  if (formData.personal) {
    const personal = formData.personal;
    
    // Title with name
    sections.push(
      new Paragraph({
        text: personal.name || '',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      })
    );
    
    // Professional title if available
    if (personal.title) {
      sections.push(
        new Paragraph({
          text: personal.title,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        })
      );
    }
    
    // Contact details in a subtle format
    const contactDetails = [];
    if (personal.email) contactDetails.push(new TextRun({ text: personal.email, color: "666666" }));
    if (personal.phone) {
      if (contactDetails.length > 0) contactDetails.push(new TextRun({ text: " • ", color: "666666" }));
      contactDetails.push(new TextRun({ text: personal.phone, color: "666666" }));
    }
    if (personal.location) {
      if (contactDetails.length > 0) contactDetails.push(new TextRun({ text: " • ", color: "666666" }));
      contactDetails.push(new TextRun({ text: personal.location, color: "666666" }));
    }
    
    sections.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: contactDetails,
        spacing: { after: 200 }
      })
    );
    
    // Add links (LinkedIn, website, etc.)
    const links = [];
    if (personal.linkedin) links.push(new TextRun({ text: "LinkedIn: " + personal.linkedin, color: "666666" }));
    if (personal.website) {
      if (links.length > 0) links.push(new TextRun({ text: " • ", color: "666666" }));
      links.push(new TextRun({ text: "Website: " + personal.website, color: "666666" }));
    }
    
    if (links.length > 0) {
      sections.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: links,
          spacing: { after: 400 }
        })
      );
    }
  }
  
  // Objective/Professional Summary
  if (formData.objective && typeof formData.objective === 'string' && formData.objective.trim()) {
    sections.push(
      new Paragraph({
        text: "Professional Summary",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: extractTextFromHtml(formData.objective),
        spacing: { after: 300 }
      })
    );
  } else if (formData.summary && typeof formData.summary === 'string' && formData.summary.trim()) {
    sections.push(
      new Paragraph({
        text: "Professional Summary",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: extractTextFromHtml(formData.summary),
        spacing: { after: 300 }
      })
    );
  }
  
  // Work Experience
  if (Array.isArray(formData.experience) && formData.experience.length > 0) {
    sections.push(
      new Paragraph({
        text: "Work Experience",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      })
    );
    
    formData.experience.forEach(job => {
      const position = job.position || job.title || '';
      const company = job.company || job.employer || '';
      
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: position, bold: true }),
            position && company ? new TextRun({ text: " at " }) : new TextRun({ text: "" }),
            new TextRun({ text: company, bold: true }),
          ],
          spacing: { after: 100 }
        })
      );
      
      // Format dates
      const startDate = formatDate(job.startDate || job.start_date);
      const endDate = job.current ? 'Present' : formatDate(job.endDate || job.end_date) || 'Present';
      
      if (startDate || endDate) {
        sections.push(
          new Paragraph({
            text: `${startDate} - ${endDate}`,
            spacing: { after: 100 }
          })
        );
      }
      
      // Add location if available
      if (job.location) {
        sections.push(
          new Paragraph({
            text: job.location,
            spacing: { after: 100 }
          })
        );
      }
      
      // Handle description - could be string, HTML, or bullet points
      if (job.description) {
        if (typeof job.description === 'string') {
          sections.push(
            new Paragraph({
              text: extractTextFromHtml(job.description),
              spacing: { after: 200 }
            })
          );
        } else if (Array.isArray(job.description)) {
          // If it's an array of bullet points
          job.description.forEach(bullet => {
            sections.push(
              new Paragraph({
                text: '• ' + (typeof bullet === 'string' ? extractTextFromHtml(bullet) : ''),
                spacing: { before: 80, after: 80 },
                indent: { left: 360 }
              })
            );
          });
        }
      } else if (job.responsibilities && Array.isArray(job.responsibilities)) {
        // Alternative field name for job duties
        job.responsibilities.forEach(responsibility => {
          sections.push(
            new Paragraph({
              text: '• ' + extractTextFromHtml(responsibility),
              spacing: { before: 80, after: 80 },
              indent: { left: 360 }
            })
          );
        });
      } else if (job.achievements && Array.isArray(job.achievements)) {
        // Alternative field for achievements
        job.achievements.forEach(achievement => {
          sections.push(
            new Paragraph({
              text: '• ' + extractTextFromHtml(achievement),
              spacing: { before: 80, after: 80 },
              indent: { left: 360 }
            })
          );
        });
      }
      
      // Add extra space between jobs
      sections.push(
        new Paragraph({
          text: '',
          spacing: { after: 200 }
        })
      );
    });
  }
  
  // Education
  if (Array.isArray(formData.education) && formData.education.length > 0) {
    sections.push(
      new Paragraph({
        text: "Education",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      })
    );
    
    formData.education.forEach(edu => {
      const degree = edu.degree || edu.qualification || '';
      const institution = edu.institution || edu.school || '';
      
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: degree, bold: true }),
            institution ? new TextRun({ text: " - " + institution }) : '',
          ],
          spacing: { after: 100 }
        })
      );
      
      // Format dates
      const startDate = formatDate(edu.startDate || edu.start_date);
      const endDate = edu.current ? 'Present' : formatDate(edu.endDate || edu.end_date) || 'Present';
      
      if (startDate || endDate) {
        sections.push(
          new Paragraph({
            text: `${startDate} - ${endDate}`,
            spacing: { after: 100 }
          })
        );
      }
      
      // Add location if available
      if (edu.location) {
        sections.push(
          new Paragraph({
            text: edu.location,
            spacing: { after: 100 }
          })
        );
      }
      
      // Add grade/GPA if available
      if (edu.grade || edu.gpa) {
        sections.push(
          new Paragraph({
            text: `Grade/GPA: ${edu.grade || edu.gpa}`,
            spacing: { after: 100 }
          })
        );
      }
      
      // Add description or courses if available
      if (edu.description) {
        sections.push(
          new Paragraph({
            text: extractTextFromHtml(edu.description),
            spacing: { after: 200 }
          })
        );
      } else if (Array.isArray(edu.courses) && edu.courses.length > 0) {
        sections.push(
          new Paragraph({
            text: "Relevant Courses:",
            spacing: { after: 100 }
          })
        );
        
        edu.courses.forEach(course => {
          sections.push(
            new Paragraph({
              text: '• ' + course,
              spacing: { after: 80 },
              indent: { left: 360 }
            })
          );
        });
      }
      
      // Add extra space between education entries
      sections.push(
        new Paragraph({
          text: '',
          spacing: { after: 200 }
        })
      );
    });
  }
  
  // Skills
  if (Array.isArray(formData.skills) && formData.skills.length > 0) {
    sections.push(
      new Paragraph({
        text: "Skills",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      })
    );
    
    // Check if skills have categories
    const hasCategories = formData.skills.some(skill => skill.category);
    
    if (hasCategories) {
      // Group skills by category
      const skillsByCategory = formData.skills.reduce((acc, skill) => {
        const category = skill.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(skill);
        return acc;
      }, {});
      
      // Add each category
      Object.entries(skillsByCategory).forEach(([category, categorySkills]) => {
        sections.push(
          new Paragraph({
            text: category,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          })
        );
        
        // Create skill bullets for this category
        categorySkills.forEach(skill => {
          const skillText = skill.level ? `${skill.name} (${skill.level})` : skill.name;
          sections.push(
            new Paragraph({
              text: '• ' + skillText,
              spacing: { after: 80 },
              indent: { left: 360 }
            })
          );
        });
      });
    } else {
      // Create a table for skills without categories
      const skillRows = [];
      const skillsPerRow = 3;
      
      for (let i = 0; i < formData.skills.length; i += skillsPerRow) {
        const cells = [];
        
        for (let j = 0; j < skillsPerRow; j++) {
          if (i + j < formData.skills.length) {
            const skill = formData.skills[i + j];
            const skillText = typeof skill === 'string' ? skill : (skill.level ? `${skill.name} (${skill.level})` : skill.name);
            
            cells.push(
              new TableCell({
                children: [new Paragraph({ text: skillText })],
                width: {
                  size: 33.33,
                  type: WidthType.PERCENTAGE,
                }
              })
            );
          } else {
            cells.push(
              new TableCell({
                children: [new Paragraph({ text: '' })],
                width: {
                  size: 33.33,
                  type: WidthType.PERCENTAGE,
                }
              })
            );
          }
        }
        
        skillRows.push(new TableRow({ children: cells }));
      }
      
      if (skillRows.length > 0) {
        sections.push(
          new Table({
            rows: skillRows,
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            }
          })
        );
      }
    }
  }
  
  // Languages
  if (Array.isArray(formData.languages) && formData.languages.length > 0) {
    sections.push(
      new Paragraph({
        text: "Languages",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      })
    );
    
    formData.languages.forEach(language => {
      const langText = language.level ? `${language.name} (${language.level})` : language.name;
      sections.push(
        new Paragraph({
          text: '• ' + langText,
          spacing: { after: 80 },
          indent: { left: 360 }
        })
      );
    });
  }
  
  // Certifications
  if (Array.isArray(formData.certifications) && formData.certifications.length > 0) {
    sections.push(
      new Paragraph({
        text: "Certifications",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      })
    );
    
    formData.certifications.forEach(cert => {
      sections.push(
        new Paragraph({
          text: cert.name || '',
          bold: true,
          spacing: { after: 80 }
        })
      );
      
      if (cert.issuer) {
        sections.push(
          new Paragraph({
            text: cert.issuer,
            spacing: { after: 80 }
          })
        );
      }
      
      if (cert.date) {
        sections.push(
          new Paragraph({
            text: formatDate(cert.date),
            spacing: { after: 100 }
          })
        );
      }
      
      // Add extra space between certifications
      sections.push(
        new Paragraph({
          text: '',
          spacing: { after: 100 }
        })
      );
    });
  }
  
  // Projects
  if (Array.isArray(formData.projects) && formData.projects.length > 0) {
    sections.push(
      new Paragraph({
        text: "Projects",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      })
    );
    
    formData.projects.forEach(project => {
      sections.push(
        new Paragraph({
          text: project.title || project.name || '',
          bold: true,
          spacing: { after: 80 }
        })
      );
      
      // Add role if available
      if (project.role) {
        sections.push(
          new Paragraph({
            text: `Role: ${project.role}`,
            spacing: { after: 80 }
          })
        );
      }
      
      // Format dates
      const startDate = formatDate(project.startDate || project.start_date);
      const endDate = project.current ? 'Present' : formatDate(project.endDate || project.end_date) || '';
      
      if (startDate || endDate) {
        sections.push(
          new Paragraph({
            text: `${startDate}${startDate && endDate ? ' - ' : ''}${endDate}`,
            spacing: { after: 80 }
          })
        );
      }
      
      if (project.description) {
        sections.push(
          new Paragraph({
            text: extractTextFromHtml(project.description),
            spacing: { after: 100 }
          })
        );
      }
      
      // Add technologies/tools if available
      if (project.technologies) {
        const techText = Array.isArray(project.technologies) 
          ? project.technologies.join(', ') 
          : project.technologies;
        
        sections.push(
          new Paragraph({
            text: 'Technologies: ' + techText,
            spacing: { after: 100 }
          })
        );
      }
      
      // Add link if available
      if (project.url || project.link) {
        sections.push(
          new Paragraph({
            text: 'Link: ' + (project.url || project.link),
            spacing: { after: 100 }
          })
        );
      }
      
      // Add extra space between projects
      sections.push(
        new Paragraph({
          text: '',
          spacing: { after: 100 }
        })
      );
    });
  }
  
  // Additional Sections
  if (Array.isArray(formData.additional) && formData.additional.length > 0) {
    formData.additional.forEach(section => {
      if (section.title && Array.isArray(section.items) && section.items.length > 0) {
        sections.push(
          new Paragraph({
            text: section.title,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 200 }
          })
        );
        
        section.items.forEach(item => {
          if (item.title) {
            sections.push(
              new Paragraph({
                text: item.title,
                bold: true,
                spacing: { after: 80 }
              })
            );
          }
          
          if (item.subtitle) {
            sections.push(
              new Paragraph({
                text: item.subtitle,
                spacing: { after: 80 }
              })
            );
          }
          
          if (item.date) {
            sections.push(
              new Paragraph({
                text: formatDate(item.date),
                spacing: { after: 80 }
              })
            );
          }
          
          if (item.description) {
            sections.push(
              new Paragraph({
                text: extractTextFromHtml(item.description),
                spacing: { after: 100 }
              })
            );
          }
          
          // Add extra space between items
          sections.push(
            new Paragraph({
              text: '',
              spacing: { after: 100 }
            })
          );
        });
      }
    });
  }
  
  // Create a new document and add all sections
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sections,
      },
    ],
  });
  
  return doc;
}

export default { exportCVToDocx, exportResumeToDocx };
