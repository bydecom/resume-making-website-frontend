import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../assets/icons/easy-builder.png';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  let lastScrollPosition = 0;
  
  // Sử dụng useRef để theo dõi trạng thái mount của component
  const isMountedRef = useRef(true);

  // Thiết lập isMounted khi component mount và cleanup khi unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      // Đánh dấu component đã unmount
      isMountedRef.current = false;
    };
  }, []);

  // Kiểm tra đăng nhập khi component được render hoặc khi location thay đổi
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      if (token) {
        setIsLoggedIn(true);
        setUserName(userData.name || 'User');
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    };
    
    checkLoginStatus();
  }, [location]); // Thêm location vào dependencies để cập nhật khi route thay đổi

  const handleLogout = async () => {
    // Đóng dropdown trước khi xóa dữ liệu và chuyển hướng
    setIsProfileDropdownOpen(false);
    
    // Đánh dấu component sẽ unmount để ngăn các animation tiếp tục
    // Đặt biến global để các component khác có thể kiểm tra
    window.isUnmounting = true;
    
    // Đợi một chút để animation dropdown kết thúc
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Sau đó mới xóa dữ liệu và chuyển hướng
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    
    // Chuyển hướng đến trang login
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleScroll = () => {
    const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScrollPosition < lastScrollPosition) {
      setIsHeaderVisible(true);
    } else {
      setIsHeaderVisible(false);
    }
    lastScrollPosition = currentScrollPosition;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed w-full z-50 transition-transform duration-300 ${
        !isHeaderVisible ? '-translate-y-full' : ''
      }`}
    >
      <header className="bg-white shadow-sm border-t border-gray-200">
        <nav className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <img src={logoImage} alt="Logo" className="h-8 w-auto mr-2" />
              <span className="text-xl font-semibold text-gray-800">bestcv.io</span>
            </Link>
            
            <nav className="hidden lg:flex items-center space-x-6">
              <Link to="/dashboard" className="flex items-center hover:text-gray-800">
                Dashboard
              </Link>
              <Link to="/convert" className="hover:text-gray-800">
                Convert CV
              </Link>
              <a className="hover:text-gray-800" href="/reviewcv" rel="noopener noreferrer">
                CV Review
              </a>
              <Link to="/emaileditor" className="flex items-center hover:text-gray-800">
                Cover Letter
              </Link>
              <Link to="/enhancemail" className="flex items-center hover:text-gray-800">
                Enhance Letter
              </Link>

              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center bg-blue-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
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
                  
                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Profile
                      </Link>
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
                <Link
                  to="/login"
                  className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Login
                </Link>
              )}
            </nav>

            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-600 hover:text-gray-800 focus:outline-none"
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
        <div
          className={`lg:hidden transition-all duration-200 ease-out ${
            isMenuOpen
              ? 'transform scale-100 opacity-100'
              : 'transform scale-95 opacity-0 hidden'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/templates" className="block text-gray-600 hover:text-gray-800 py-2">
              Resume
            </Link>
            <Link to="/convert" className="block text-gray-600 hover:text-gray-800 py-2">
              Convert CV
            </Link>
            <a
              href="/reviewcv"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-600 hover:text-gray-800 py-2"
            >
              CV Review
            </a>
            <Link to="/emaileditor" className="block text-gray-600 hover:text-gray-800 py-2">
              Cover Letter
            </Link>
            <Link to="/enhancemail" className="block text-gray-600 hover:text-gray-800 py-2">
              Enhance Letter
            </Link>

            {isLoggedIn ? (
              <>
                <Link to="/profile" className="block text-gray-600 hover:text-gray-800 py-2">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 mt-2"
              >
                Login
              </Link>
            )}
          </div>
        </div>
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
