import React, { useState, useEffect, useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

// Import các icon từ react-icons
import { 
  FiLayout, 
  FiUsers, 
  FiFileText, 
  FiPenTool, 
  FiMessageSquare, 
  FiChevronDown, 
  FiUserPlus, 
  FiSettings, 
  FiUserCheck,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiActivity,
  FiUserX,
  FiHome
} from 'react-icons/fi';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarContext,
  useSidebar
} from "../../components/ui/sidebar";

import api, { handleApiError, callApi } from '../../utils/api';

// Define a consistent transition duration to use throughout the application
const TRANSITION_DURATION = "300ms";

// Custom sidebar toggle button component
const SidebarToggle = () => {
  const { isOpen, setIsOpen } = useContext(SidebarContext);

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={`fixed top-1/2 -translate-y-1/2 z-50 h-10 w-5 rounded-r-full bg-blue-500 text-white flex items-center justify-center shadow-md hover:bg-blue-600 focus:outline-none`}
      style={{
        left: isOpen ? '16rem' : '0', // Match rem value with sidebar width
        transition: `left ${TRANSITION_DURATION} ease-in-out`
      }}
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
    >
      {isOpen ? <FiChevronLeft className="h-4 w-4" /> : <FiChevronRight className="h-4 w-4" />}
    </button>
  );
};

// Main content that uses sidebar context
const MainContent = () => {
  const { isOpen } = useContext(SidebarContext);
  
  return (
    <main 
      style={{
        marginLeft: isOpen ? '16rem' : '0',
        transition: `margin-left ${TRANSITION_DURATION} ease-in-out`
      }}
      className="p-6 bg-gray-50 min-h-screen"
    >
      <Outlet />
    </main>
  );
};

const AdminPage = () => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogsMenuOpen, setIsLogsMenuOpen] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kiểm tra quyền admin ngay khi component mount
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const role = localStorage.getItem('role');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    console.log('Admin Page Check:');
    console.log('token:', token);
    console.log('userRole:', userRole);
    console.log('role:', role);
    console.log('userData.role:', userData.role);
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    const effectiveRole = userRole || role || userData.role;
    if (effectiveRole !== 'admin') {
      navigate('/unauthorized');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const fetchData = async () => {
    try {
      const response = await api.get('/admin/data');
      setData(response.data);
    } catch (error) {
      const errorMessage = handleApiError(error, navigate);
      setError(errorMessage);
    }
  }

  return (
    <div className="min-h-screen">
      <SidebarProvider defaultOpen={true}>
        {/* Sidebar */}
        <Sidebar 
          className="!bg-blue-500 fixed top-0 left-0 h-screen z-40" 
          transitionDuration={TRANSITION_DURATION}
        >
            <SidebarHeader className="border-b border-blue-400 p-4">
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {/* Dashboard */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="hover:!bg-blue-600 text-white">
                    <Link to="/admin">
                      <FiLayout className="h-4 w-4 mr-2" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* User Management with Submenu */}
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="hover:!bg-blue-600 text-white">
                    <FiUsers className="h-4 w-4 mr-2" />
                    <span>User Management</span>
                    <FiChevronDown
                      className={`ml-auto h-4 w-4 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                    />
                  </SidebarMenuButton>
                  {isUserMenuOpen && (
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild className="hover:!bg-blue-600 text-white">
                          <Link to="/admin/users">
                            <FiUsers className="h-4 w-4 mr-2" />
                            <span>All Users</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild className="hover:!bg-blue-600 text-white">
                          <Link to="/admin/users/add">
                            <FiUserPlus className="h-4 w-4 mr-2" />
                            <span>Add User</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>

                {/* CV Templates */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="hover:!bg-blue-600 text-white">
                    <Link to="/admin/templates">
                      <FiFileText className="h-4 w-4 mr-2" />
                      <span>CV Templates</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* UI Management */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="hover:!bg-blue-600 text-white">
                    <Link to="/admin/ui">
                      <FiPenTool className="h-4 w-4 mr-2" />
                      <span>UI Management</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* AI Prompts */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="hover:!bg-blue-600 text-white">
                    <Link to="/admin/prompts">
                      <FiMessageSquare className="h-4 w-4 mr-2" />
                      <span>AI Prompts</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* AI Config */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="hover:!bg-blue-600 text-white">
                    <Link to="/admin/ai-config">
                      <FiSettings className="h-4 w-4 mr-2" />
                      <span>AI Config</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Logs with Submenu */}
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setIsLogsMenuOpen(!isLogsMenuOpen)} className="hover:!bg-blue-600 text-white">
                    <FiActivity className="h-4 w-4 mr-2" />
                    <span>Logs</span>
                    <FiChevronDown
                      className={`ml-auto h-4 w-4 transition-transform ${isLogsMenuOpen ? "rotate-180" : ""}`}
                    />
                  </SidebarMenuButton>
                  {isLogsMenuOpen && (
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild className="hover:!bg-blue-600 text-white">
                          <Link to="/admin/logs">
                            <FiUserCheck className="h-4 w-4 mr-2" />
                            <span>Admin Logs</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild className="hover:!bg-blue-600 text-white">
                          <Link to="/admin/user-logs">
                            <FiUserX className="h-4 w-4 mr-2" />
                            <span>User Logs</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>

                {/* Home and Logout Section */}
                <SidebarMenuItem className="mt-auto pt-4 border-t border-blue-400">
                  {/* Home Button */}
                  <SidebarMenuButton asChild className="hover:!bg-blue-600 text-white">
                    <Link to="/">
                      <FiHome className="h-4 w-4 mr-2" />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Logout */}
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout} className="hover:!bg-blue-600 text-white">
                    <FiLogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>

        {/* Sidebar Toggle Button - outside of both Sidebar and MainContent */}
        <SidebarToggle />

        {/* Main Content */}
        <MainContent />
      </SidebarProvider>
    </div>
  );
};

export default AdminPage;
