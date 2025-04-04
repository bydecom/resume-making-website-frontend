import axios from 'axios';

// BASE URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Tạo axios instance
const api = axios.create({
  baseURL: API_URL
});

// Thêm token xác thực vào mỗi request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi và token hết hạn
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    
    // Xử lý lỗi 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Kiểm tra xem đây có phải là lỗi từ endpoint đăng nhập không
      const isLoginEndpoint = error.config.url.includes('/api/users/login');
      
      // Nếu là endpoint đăng nhập - để Login.jsx xử lý lỗi
      if (isLoginEndpoint) {
        return Promise.reject(error);
      }
      
      // Nếu không phải endpoint đăng nhập, xem như là token hết hạn
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      
      // Chuyển hướng đến trang đăng nhập
      alert('Your session has expired. Please log in again.');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

/**
 * Xử lý lỗi API chung
 * @param {Error} error - Lỗi từ API
 * @param {Function} navigate - Function navigate từ react-router
 * @returns {string} Thông báo lỗi
 */
export const handleApiError = (error, navigate) => {
  console.error('API Error:', error);
  
  // Nếu lỗi 401 (Unauthorized), chuyển hướng về trang đăng nhập
  if (error.response?.status === 401) {
    alert('Your session has expired. Please log in again.');
    navigate('/login');
    return 'Authentication failed';
  }
  
  // Hiển thị thông báo lỗi dựa trên response
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Thông báo lỗi mặc định
  return error.message || 'An unexpected error occurred';
};

/**
 * Gọi API với JWT token (sử dụng axios)
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {Object} data - Dữ liệu gửi lên API
 * @returns {Promise} Promise với kết quả từ API
 */
export const callApi = async (endpoint, method = 'GET', data = null) => {
  try {
    const config = {
      method: method,
      url: endpoint
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await api(config);
    return response.data;
  } catch (error) {
    const errorData = error.response?.data || {};
    const customError = new Error(errorData.message || error.message);
    customError.status = error.response?.status;
    customError.data = errorData;
    throw customError;
  }
};

export default api; 