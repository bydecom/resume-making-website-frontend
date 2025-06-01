import { callApi } from '../utils/api';

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
      const response = await callApi('/api/extract/cv', 'POST', {
        text: extractedText
      });

      if (response.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to extract CV data');
      }
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
      // Kiểm tra dữ liệu đầu vào
      if (!extractedData) {
        throw new Error('No extracted data to format');
      }

      // Định dạng dữ liệu theo cấu trúc mà NewCV component có thể sử dụng
      return {
        personalInfo: {
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
        experience: this.formatArrayData(extractedData.experience, {
          position: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          description: '',
          isPresent: false
        }),
        education: this.formatArrayData(extractedData.education, {
          degree: '',
          school: '',
          location: '',
          startDate: '',
          endDate: '',
          description: '',
          isPresent: false
        }),
        skills: Array.isArray(extractedData.skills) ? extractedData.skills : [],
        projects: this.formatArrayData(extractedData.projects, {
          title: '',
          description: '',
          link: '',
          technologies: []
        }),
        certifications: this.formatArrayData(extractedData.certifications, {
          name: '',
          issuer: '',
          date: '',
          description: ''
        }),
        languages: this.formatArrayData(extractedData.languages, {
          language: '',
          proficiency: ''
        })
      };
    } catch (error) {
      console.error('Error formatting extracted data:', error);
      throw error;
    }
  }

  /**
   * Helper function để format mảng dữ liệu với default values
   * @param {Array} array - Mảng dữ liệu cần format
   * @param {Object} defaultItem - Object chứa các giá trị mặc định
   * @returns {Array} - Mảng đã được format
   */
  static formatArrayData(array, defaultItem) {
    if (!Array.isArray(array)) {
      return [];
    }
    
    return array.map(item => ({
      ...defaultItem,
      ...item
    }));
  }
}

export default CVExtractService; 