import api from '../utils/api';

/**
 * Service để gửi dữ liệu CV đã trích xuất đến API và nhận về các thông tin đã phân tích
 */
class CVExtractService {
  /**
   * Gửi văn bản đã trích xuất từ CV đến API để phân tích
   * @param {string} extractedText - Văn bản đã trích xuất từ CV
   * @returns {Promise<Object>} - Dữ liệu CV đã được phân tích
   */
  static async extractCVData(extractedText) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/extract/cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: extractedText })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error extracting CV data:', error);
      throw error;
    }
  }

  /**
   * Chuyển đổi dữ liệu CV đã phân tích thành dạng dữ liệu mà component NewCV có thể sử dụng
   * @param {Object} extractedData - Dữ liệu CV đã được phân tích từ API
   * @returns {Object} - Dữ liệu CV được định dạng cho NewCV
   */
  static formatDataForNewCV(extractedData) {
    try {
      // Nếu không có dữ liệu, throw error
      if (!extractedData) {
        throw new Error('No extracted data to format');
      }

      // Định dạng dữ liệu theo cấu trúc mà NewCV component có thể sử dụng
      const formattedData = {
        personalInfo: {
          ...extractedData.personalInfo,
          // Đảm bảo các trường cần thiết đều có
          firstName: extractedData.personalInfo?.firstName || '',
          lastName: extractedData.personalInfo?.lastName || '',
          professionalHeadline: extractedData.personalInfo?.professionalHeadline || '',
          email: extractedData.personalInfo?.email || '',
          phone: extractedData.personalInfo?.phone || '',
          location: extractedData.personalInfo?.location || '',
          country: extractedData.personalInfo?.country || '',
          website: extractedData.personalInfo?.website || '',
          linkedin: extractedData.personalInfo?.linkedin || '',
        },
        summary: extractedData.summary || '',
        experience: Array.isArray(extractedData.experience) 
          ? extractedData.experience.map(exp => ({
              ...exp,
              position: exp.position || '',
              company: exp.company || '',
              location: exp.location || '',
              startDate: exp.startDate || '',
              endDate: exp.endDate || '',
              description: exp.description || '',
              isPresent: exp.isPresent || false
            }))
          : [],
        education: Array.isArray(extractedData.education)
          ? extractedData.education.map(edu => ({
              ...edu,
              degree: edu.degree || '',
              school: edu.school || '',
              location: edu.location || '',
              startDate: edu.startDate || '',
              endDate: edu.endDate || '',
              description: edu.description || '',
              isPresent: edu.isPresent || false
            }))
          : [],
        skills: Array.isArray(extractedData.skills) 
          ? extractedData.skills 
          : [],
        projects: Array.isArray(extractedData.projects)
          ? extractedData.projects.map(proj => ({
              ...proj,
              title: proj.title || '',
              description: proj.description || '',
              link: proj.link || '',
              technologies: Array.isArray(proj.technologies) ? proj.technologies : []
            }))
          : [],
        certifications: Array.isArray(extractedData.certifications)
          ? extractedData.certifications.map(cert => ({
              ...cert,
              name: cert.name || '',
              issuer: cert.issuer || '',
              date: cert.date || '',
              description: cert.description || ''
            }))
          : [],
        languages: Array.isArray(extractedData.languages)
          ? extractedData.languages.map(lang => ({
              ...lang,
              language: lang.language || '',
              proficiency: lang.proficiency || ''
            }))
          : []
      };

      return formattedData;
    } catch (error) {
      console.error('Error formatting extracted data:', error);
      throw error;
    }
  }
}

export default CVExtractService; 