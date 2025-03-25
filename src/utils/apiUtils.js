/**
 * Xử lý lỗi API chung
 * @param {Error} error - Lỗi từ API
 * @param {Function} navigate - Function navigate từ react-router
 * @returns {string} Thông báo lỗi
 */
export const handleApiError = (error, navigate) => {
  console.error('API Error:', error);
  
  // Nếu lỗi 401 (Unauthorized), chuyển hướng về trang đăng nhập
  if (error.status === 401) {
    alert('Your session has expired. Please log in again.');
    navigate('/login');
    return 'Authentication failed';
  }
  
  // Hiển thị thông báo lỗi dựa trên response
  if (error.data && error.data.message) {
    return error.data.message;
  }
  
  // Thông báo lỗi mặc định
  return error.message || 'An unexpected error occurred';
};

/**
 * Gọi API với JWT token
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {Object} data - Dữ liệu gửi lên API
 * @returns {Promise} Promise với kết quả từ API
 */
export const callApi = async (endpoint, method = 'GET', data = null) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const url = `${API_URL}${endpoint}`;
  
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || response.statusText);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }
  
  return response.json();
}; 