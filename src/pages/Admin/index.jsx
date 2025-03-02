import React, { useState } from 'react';
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
  FiLogOut
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
} from "../../components/ui/sidebar";

const AdminPage = () => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen">
          <Sidebar className="!bg-blue-500">
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

                {/* Logout */}
                <SidebarMenuItem className="mt-auto pt-4 border-t border-blue-400">
                  <SidebarMenuButton onClick={handleLogout} className="hover:!bg-blue-600 text-white">
                    <FiLogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>

          {/* Main Content Area */}
          <main className="flex-1 p-6 bg-gray-50">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminPage;
