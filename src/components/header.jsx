import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../assets/icons/easy-builder.png';

// Helper function to check if user is admin
const isAdminUser = (userData, storedRole, storedUserRole) => {
  // Get role from userData object if it exists
  const userDataRole = userData && userData.role ? userData.role : null;
  
  // Try all possible sources of role information
  const effectiveRole = storedUserRole || storedRole || userDataRole;
  
  // Return true only if role is exactly 'admin'
  return effectiveRole === 'admin';
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  let lastScrollPosition = 0;
  
  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userRole = localStorage.getItem('userRole');
    const role = localStorage.getItem('role');
    
    if (token) {
      setIsLoggedIn(true);
      setUserName(userData.name || 'User');
      
      // Use the helper function for more robust admin check
      const adminStatus = isAdminUser(userData, role, userRole);
      setIsAdmin(adminStatus);
      
      // Debug the role determination
      console.log('Role check:', { 
        userRole, 
        role, 
        userDataRole: userData.role, 
        isAdmin: adminStatus
      });
    } else {
      setIsLoggedIn(false);
      setUserName('');
      setIsAdmin(false);
    }
  };

  const handleNavigation = (path) => {
    // Nếu chưa đăng nhập và đang cố truy cập các trang cần auth
    if (!isLoggedIn && ['/dashboard', '/profile', '/convert', '/reviewcv'].includes(path)) {
      // Lưu đường dẫn muốn đến vào localStorage
      localStorage.setItem('redirectAfterLogin', path);
      // Chuyển hướng đến trang login
      navigate('/login');
      return;
    }

    // Nếu đã đăng nhập hoặc đường dẫn không cần auth thì xử lý bình thường
    window.isUnmounting = true;
    setIsNavigating(true);
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    // Đánh dấu đang chuyển trang
    setIsNavigating(true);
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
    
    // Đặt biến global để báo hiệu các component khác dừng animations
    window.isUnmounting = true;
    
    // Xóa dữ liệu đăng nhập
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    
    // Explicitly set state
    setIsLoggedIn(false);
    setIsAdmin(false);
    
    // Đợi một chút để các animation kết thúc và components có thể dừng
    setTimeout(() => {
      navigate('/login');
    }, 50); // Tăng timeout lên một chút để đảm bảo animations có thời gian dừng
  };

  const toggleMenu = () => {
    if (!isNavigating) {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const toggleProfileDropdown = () => {
    if (!isNavigating) {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
    }
  };

  const handleScroll = () => {
    if (!isNavigating) {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScrollPosition < lastScrollPosition) {
        setIsHeaderVisible(true);
      } else {
        setIsHeaderVisible(false);
      }
      lastScrollPosition = currentScrollPosition;
    }
  };

  useEffect(() => {
    checkLoginStatus();
    window.addEventListener('scroll', handleScroll);
    
    // Add storage event listener to detect changes to localStorage
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkLoginStatus);
      setIsNavigating(false);
    };
  }, []);

  // Re-check login status whenever location changes
  useEffect(() => {
    // Reset navigation state after route change
    setIsNavigating(false);
    // Re-check login status
    checkLoginStatus();
  }, [location]);

  // Thêm điều kiện kiểm tra đường dẫn để ẩn header
  if (location.pathname === '/new-cv' || 
      location.pathname.includes('/edit-cv/') || 
      location.pathname === '/new-resume') {
    return null;
  }

  return (
    <div
      className={`fixed w-full z-50 transition-transform duration-300 ${
        !isHeaderVisible ? '-translate-y-full' : ''
      }`}
    >
      <header className="bg-white shadow-sm border-t border-gray-200">
        <nav className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <button onClick={() => handleNavigation('/')} className="flex items-center">
              <img src={logoImage} alt="Logo" className="h-8 w-auto mr-2" />
              <span className="text-xl font-semibold text-gray-800">BestResume.io</span>
            </button>
            
            <nav className="hidden lg:flex items-center space-x-6">
              <button onClick={() => handleNavigation('/templates')} className="hover:text-gray-800">
                Template
              </button>
              <button onClick={() => handleNavigation('/dashboard')} className="flex items-center hover:text-gray-800">
                Dashboard
              </button>
                        
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center bg-blue-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                    disabled={isNavigating}
                  >
                    <span className="mr-2">{userName}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isProfileDropdownOpen && !isNavigating && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <button 
                        onClick={() => handleNavigation('/profile')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </button>
                      {isAdmin && (
                        <button 
                          onClick={() => handleNavigation('/admin')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Admin
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleNavigation('/login')}
                  className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                  disabled={isNavigating}
                >
                  Login
                </button>
              )}
            </nav>

            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-600 hover:text-gray-800 focus:outline-none"
                disabled={isNavigating}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {!isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && !isNavigating && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button onClick={() => handleNavigation('/templates')} className="block w-full text-left text-gray-600 hover:text-gray-800 py-2">
                Resume
              </button>
              <button onClick={() => handleNavigation('/convert')} className="block w-full text-left text-gray-600 hover:text-gray-800 py-2">
                Convert CV
              </button>
              <button onClick={() => handleNavigation('/reviewcv')} className="block w-full text-left text-gray-600 hover:text-gray-800 py-2">
                CV Review
              </button>
              <button onClick={() => handleNavigation('/emaileditor')} className="block w-full text-left text-gray-600 hover:text-gray-800 py-2">
                Cover Letter
              </button>
              <button onClick={() => handleNavigation('/enhancemail')} className="block w-full text-left text-gray-600 hover:text-gray-800 py-2">
                Enhance Letter
              </button>

              {isLoggedIn ? (
                <>
                  <button onClick={() => handleNavigation('/profile')} className="block w-full text-left text-gray-600 hover:text-gray-800 py-2">
                    Profile
                  </button>
                  {isAdmin && (
                    <button onClick={() => handleNavigation('/admin')} className="block w-full text-left text-gray-600 hover:text-gray-800 py-2">
                      Admin
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 mt-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavigation('/login')}
                  className="block w-full text-left bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 mt-2"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <style jsx>{`
        .fixed {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
        }

        .z-50 {
          z-index: 50;
        }

        .transition-transform {
          transition-property: transform;
        }

        .duration-300 {
          transition-duration: 100ms;
        }

        .-translate-y-full {
          transform: translateY(-100%);
        }
      `}</style>
    </div>
  );
};

export default Header;
