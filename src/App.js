import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/Footer';
import './App.css';

// Import page components
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Convert from './pages/Convert';
import EmailEditor from './pages/EmailEditor';
import EnhanceMail from './pages/EnhanceMail';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminRegister from './pages/AdminRegister';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// Import Admin sub-pages
import AdminDashboard from './pages/Admin/Dashboard';
import AllUsers from './pages/Admin/Users/AllUsers';
import AddUser from './pages/Admin/Users/AddUser';
import UserRoles from './pages/Admin/Users/UserRoles';
import AdminTemplates from './pages/Admin/Templates';
import UIManagement from './pages/Admin/UIManagement';
import Prompts from './pages/Admin/Prompts';
import AdminPage from './pages/Admin';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

// Layout Component
const Layout = ({ children }) => {
  const location = useLocation();
  const noHeaderFooterRoutes = [
    '/login', 
    '/register', 
    '/admin-register', 
    '/unauthorized'
  ];
  
  // Check if the current path is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  const shouldShowHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname) && !isAdminRoute;
  
  if (!shouldShowHeaderFooter) {
    // Return children directly without header/footer for login, register, admin pages, etc.
    return children;
  }
  
  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto">
        {children}
      </main>
      <Footer />
    </>
  );
};

// AppRoutes component to use the Layout with useLocation hook
const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Home page is now public */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/convert" 
          element={
            <ProtectedRoute>
              <Convert />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/email-editor" 
          element={
            <ProtectedRoute>
              <EmailEditor />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/enhance-mail" 
          element={
            <ProtectedRoute>
              <EnhanceMail />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminPage />
            </ProtectedRoute>
          } 
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/roles" element={<UserRoles />} />
          <Route path="templates" element={<AdminTemplates />} />
          <Route path="ui" element={<UIManagement />} />
          <Route path="prompts" element={<Prompts />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
