/**
 * Class xử lý gửi và nhận dữ liệu CV từ backend
 */
class CVParser {
  constructor(apiUrl = process.env.VITE_API_URL || '/api') {
    this.apiUrl = apiUrl;
    this.endpointParse = `${this.apiUrl}/parse-cv`;
  }

  /**
   * Gửi văn bản CV đến backend để phân tích
   * @param {string} text - Văn bản CV cần phân tích
   * @returns {Promise<Object>} - Dữ liệu CV đã được cấu trúc
   */
  async parseCV(text) {
    try {
      if (!text || text.trim() === '') {
        throw new Error('Không có văn bản CV được cung cấp.');
      }

      console.log('Đang gửi văn bản CV đến server để phân tích...');
      
      const response = await fetch(this.endpointParse, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Lỗi HTTP: ${response.status}`);
      }

      const parsedData = await response.json();
      console.log('Nhận dữ liệu đã phân tích từ server:', parsedData);
      
      return this.formatCVData(parsedData);
    } catch (error) {
      console.error('Lỗi khi phân tích CV:', error);
      throw error;
    }
  }

  /**
   * Gửi file CV (PDF, DOCX, hình ảnh) trực tiếp đến backend
   * @param {File} file - File CV cần phân tích
   * @returns {Promise<Object>} - Dữ liệu CV đã được cấu trúc
   */
  async parseFile(file) {
    try {
      if (!file) {
        throw new Error('Không có file được cung cấp.');
      }

      console.log('Đang gửi file CV đến server để phân tích:', file.name);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(this.endpointParse, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Lỗi HTTP: ${response.status}`);
      }

      const parsedData = await response.json();
      console.log('Nhận dữ liệu đã phân tích từ server:', parsedData);
      
      return this.formatCVData(parsedData);
    } catch (error) {
      console.error('Lỗi khi phân tích file CV:', error);
      throw error;
    }
  }

  /**
   * Gửi URL đến CV để phân tích
   * @param {string} url - URL đến file CV (PDF)
   * @returns {Promise<Object>} - Dữ liệu CV đã được cấu trúc
   */
  async parseURL(url) {
    try {
      if (!url || url.trim() === '') {
        throw new Error('Không có URL CV được cung cấp.');
      }

      console.log('Đang gửi URL CV đến server để phân tích:', url);
      
      const response = await fetch(this.endpointParse, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Lỗi HTTP: ${response.status}`);
      }

      const parsedData = await response.json();
      console.log('Nhận dữ liệu đã phân tích từ server:', parsedData);
      
      return this.formatCVData(parsedData);
    } catch (error) {
      console.error('Lỗi khi phân tích URL CV:', error);
      throw error;
    }
  }

  /**
   * Chuyển đổi dữ liệu từ backend sang định dạng phù hợp với frontend
   * @param {Object} data - Dữ liệu CV từ backend
   * @returns {Object} - Dữ liệu CV đã được định dạng cho frontend
   */
  formatCVData(data) {
    // Đảm bảo dữ liệu trả về chính xác khớp với cấu trúc formData trong NewCV.jsx
    return {
      personalInfo: {
        firstName: data.firstName || '',
        lastName: data.lastName || '', 
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || data.city || '',
        country: data.country || '',
        website: data.contact?.website || '',
        linkedin: data.contact?.linkedin || '',
        // Đảm bảo tất cả các trường trong personalInfo
      },
      summary: data.summary || '',
      education: Array.isArray(data.education) 
        ? data.education.map(edu => ({
            degree: edu.degree || '',
            school: edu.school || '',
            startDate: edu.startDate || '',
            endDate: edu.year || edu.endDate || '',
            description: edu.description || '',
            isPresent: false
          }))
        : [],
      experience: Array.isArray(data.experience)
        ? data.experience.map(exp => ({
            title: exp.title || '',
            company: exp.company || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            description: exp.description || '',
            isPresent: exp.period?.toLowerCase().includes('present') || false
          }))
        : [],
      skills: Array.isArray(data.skills) 
        ? data.skills.map(skill => typeof skill === 'string' ? skill : skill.name || '')
        : [],
      certifications: Array.isArray(data.certifications)
        ? data.certifications.map(cert => ({
            name: cert.name || '',
            issuer: cert.issuer || '',
            date: cert.date || '',
            description: cert.description || ''
          }))
        : [],
      projects: Array.isArray(data.projects)
        ? data.projects.map(proj => ({
            title: proj.title || '',
            role: proj.role || '',
            startDate: proj.startDate || '',
            endDate: proj.endDate || '',
            description: proj.description || '',
            url: proj.url || '',
            isPresent: false
          }))
        : [],
      languages: Array.isArray(data.languages)
        ? data.languages.map(lang => ({
            name: typeof lang === 'string' ? lang : lang.name || '',
            level: typeof lang === 'object' ? lang.level || '' : ''
          }))
        : [],
      activities: Array.isArray(data.activities) 
        ? data.activities.map(activity => ({
            name: typeof activity === 'string' ? activity : activity.name || '',
            description: typeof activity === 'object' ? activity.description || '' : ''
          }))
        : [],
      additionalInfo: {
        interests: data.interests || data.additionalInfo?.interests || '',
        achievements: data.achievements || data.additionalInfo?.achievements || '',
        publications: data.publications || data.additionalInfo?.publications || '',
        references: data.references || data.additionalInfo?.references || '',
        customSections: data.additionalInfo?.customSections || []
      },
      customFields: data.customFields || []
    };
  }
}

/**
 * Function thực hiện trích xuất và phân tích CV
 * @param {File|string} source - File CV hoặc URL hoặc văn bản
 * @param {Object} options - Tùy chọn bổ sung
 * @returns {Promise<Object>} - Dữ liệu CV đã được phân tích
 */
export async function processCV(source, options = {}) {
  try {
    // Import DocumentProcessor tại thời điểm gọi để tránh circular import
    const { default: DocumentProcessor } = await import('./DocumentProcessor');
    const parser = new CVParser();
    
    let extractedText = '';
    
    // Xác định loại nguồn dữ liệu
    if (source instanceof File) {
      if (options.useDirectUpload) {
        // Gửi file trực tiếp đến server
        return await parser.parseFile(source);
      } else {
        // Tạo instance DocumentProcessor
        const processor = new DocumentProcessor();
        // Trích xuất văn bản từ file trước khi gửi đến server
        extractedText = await processor.extractTextFromFile(source);
      }
    } else if (typeof source === 'string') {
      if (source.startsWith('http')) {
        // Nếu source là URL
        if (options.useDirectUpload) {
          return await parser.parseURL(source);
        } else {
          // Tạo instance DocumentProcessor
          const processor = new DocumentProcessor();
          extractedText = await processor.extractTextFromURL(source);
        }
      } else {
        // Nếu source là văn bản
        extractedText = source;
      }
    } else {
      throw new Error('Nguồn dữ liệu không hợp lệ');
    }
    
    // Gửi văn bản đã trích xuất đến server để phân tích
    return await parser.parseCV(extractedText);
  } catch (error) {
    console.error('Lỗi khi xử lý CV:', error);
    throw error;
  }
}

export { CVParser };
export default CVParser; 