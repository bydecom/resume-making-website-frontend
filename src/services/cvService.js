import api from '../utils/api';

const cvService = {
  /**
   * Tạo CV mới
   * @param {Object} cvData - Dữ liệu CV
   * @returns {Promise} - Promise kết quả từ API
   */
  createCV: async (cvData) => {
    try {
      const response = await api.post('/api/cv', cvData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Cập nhật CV hiện có
   * @param {string} cvId - ID của CV cần cập nhật
   * @param {Object} cvData - Dữ liệu CV cập nhật
   * @returns {Promise} - Promise kết quả từ API
   */
  updateCV: async (cvId, cvData) => {
    try {
      const response = await api.put(`/api/cv/${cvId}`, cvData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy chi tiết CV
   * @param {string} cvId - ID của CV
   * @returns {Promise} - Promise kết quả từ API
   */
  getCV: async (cvId) => {
    try {
      const response = await api.get(`/api/cv/${cvId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy danh sách CV của người dùng
   * @param {number} page - Số trang
   * @param {number} limit - Số lượng CV mỗi trang
   * @returns {Promise} - Promise kết quả từ API
   */
  getCVs: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/cv?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Xóa CV
   * @param {string} cvId - ID của CV cần xóa
   * @returns {Promise} - Promise kết quả từ API
   */
  deleteCV: async (cvId) => {
    try {
      const response = await api.delete(`/api/cv/${cvId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default cvService; 