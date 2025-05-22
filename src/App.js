import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/Footer';
import GlobalAIAssistant from './components/AIAssistant/GlobalAIAssistant';
import ScrollToTopButton from './components/ScrollToTop';
import ScrollDownButton from './components/ScrollDownButton';
import './App.css';

// Import page components
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Convert from './pages/Convert';
import EmailEditor from './pages/EmailEditor';
import EnhanceMail from './pages/EnhanceMail';
import About from './pages/About';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Templates from './pages/Templates';

import AdminRegister from './pages/AdminRegister';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import NewCV from './pages/NewCV';
import EditResume from './pages/EditResume';
import NewResume from './pages/NewResume';
// Import Admin sub-pages
import AdminDashboard from './pages/Admin/Dashboard';
import AllUsers from './pages/Admin/Users/AllUsers';
import AddUser from './pages/Admin/Users/AddUser';
import UserRoles from './pages/Admin/Users/UserRoles';
import AdminTemplates from './pages/Admin/Templates';
import UIManagement from './pages/Admin/UIManagement';
import Prompts from './pages/Admin/Prompts';
import AdminPage from './pages/Admin';
import ExportPDF from './test/exportPDF';
import Logs from './pages/Admin/Logs';
import UserLogs from './pages/Admin/UserLogs';
import AIConfig from './pages/Admin/AIConfig';
// Import FooterPages
import AboutUs from './pages/FooterPages/AboutUs';
import Contact from './pages/FooterPages/Contact';
import TermsOfService from './pages/FooterPages/TermsOfService';
import PrivacyPolicy from './pages/FooterPages/PrivacyPolicy';
import FAQ from './pages/FooterPages/FAQ';
import AIResumeWriter from './pages/FooterPages/AIResumeWriter';
import ResumeChecker from './pages/FooterPages/ResumeChecker';
import JobMatching from './pages/FooterPages/JobMatching';
import CareerBlog from './pages/FooterPages/CareerBlog';
import BlogPost from './pages/FooterPages/CareerBlog/BlogPost';
import CoverLetterBuilder from './pages/FooterPages/CoverLetterBuilder';
import CoverLetterExamples from './pages/FooterPages/CoverLetterExamples';
import ResumeExamples from './pages/FooterPages/ResumeExamples';
import HelpCenter from './pages/FooterPages/HelpCenter';
import Reviews from './pages/FooterPages/Reviews';
import Pricing from './pages/FooterPages/Pricing';
// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  
  // Kiểm tra role từ nhiều nguồn
  const userRole = localStorage.getItem('userRole');
  const role = localStorage.getItem('role');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  
  // Console log để debug
  console.log('Protected Route Check:');
  console.log('token:', token);
  console.log('userRole:', userRole);
  console.log('role:', role);
  console.log('userData.role:', userData.role);
  
  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/login" />;
  }
  
  // Kiểm tra role từ nhiều nguồn
  const effectiveRole = userRole || role || userData.role;
  console.log('Effective role:', effectiveRole);
  console.log('Required role:', allowedRole);
  
  if (allowedRole && effectiveRole !== allowedRole) {
    console.log('Role mismatch, redirecting to unauthorized');
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

// ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
};

// Layout Component
const Layout = ({ children }) => {
  const location = useLocation();
  const noHeaderFooterRoutes = [
    '/login', 
    '/register', 
    '/admin-register', 
    '/unauthorized',
    '/new-cv',
    '/new-resume',
    '/resume/create-new'
  ];
  
  // Check if the current path is an admin route or edit-cv route
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isEditCVRoute = location.pathname.startsWith('/edit-cv');
  const isEditResumeRoute = location.pathname.startsWith('/edit-resume');
  
  // Check if the current path is a specific edit-resume route with an ID
  const isEditResumeWithId = /^\/edit-resume\/[a-zA-Z0-9]+$/.test(location.pathname);
  
  // Add check for resume/create-new route
  const isCreateNewResume = location.pathname === '/resume/create-new';
  
  const shouldShowHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname) && !isAdminRoute && !isEditCVRoute && !isEditResumeRoute;
  
  if (!shouldShowHeaderFooter) {
    // Return children directly without header/footer for login, register, admin pages, etc.
    const noScrollDownButtonRoutes = ['/templates', '/unauthorized', '/new-cv', '/new-resume', '/edit-resume', '/resume/create-new'];
    const shouldShowScrollDownButton = !noScrollDownButtonRoutes.includes(location.pathname) && !isEditCVRoute && !isEditResumeRoute;
    
    return (
      <>
        {children}
        {!isEditResumeWithId && !isCreateNewResume && !noHeaderFooterRoutes.includes(location.pathname) && <GlobalAIAssistant />}
        {shouldShowScrollDownButton && <ScrollDownButton />}
      </>
    );
  }

  const noScrollDownButtonRoutes = [
    '/templates',
    '/unauthorized',
    '/new-cv',
    '/new-resume',
    '/edit-resume',
    '/resume/create-new'
  ];
  const shouldShowScrollDownButton = !noScrollDownButtonRoutes.includes(location.pathname) && !isEditCVRoute && !isEditResumeRoute;
  
  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto">
        {children}
      </main>
      <Footer />
      {!isEditResumeWithId && !isCreateNewResume && !noHeaderFooterRoutes.includes(location.pathname) && <GlobalAIAssistant />}
      <ScrollToTopButton />
      {shouldShowScrollDownButton && <ScrollDownButton />}
    </>
  );
};

// AppRoutes component to use the Layout with useLocation hook
const AppRoutes = () => {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/templates" element={<Templates />} />
        
        {/* Home page is now public */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        {/* {FooterPages} */}
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/career-blog" element={<CareerBlog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/resume-checker" element={<ResumeChecker />} />
        <Route path="/job-matching" element={<JobMatching />} />
        <Route path="/cover-letter-builder" element={<CoverLetterBuilder />} />
        <Route path="/cover-letter-examples" element={<CoverLetterExamples />} />
        <Route path="/resume-examples" element={<ResumeExamples />} />
        <Route path="/ai-resume-writer" element={<AIResumeWriter />} />
        
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
          path="/test"
          element={<ExportPDF />}
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
        <Route 
          path="/new-cv" 
          element={
            <ProtectedRoute>
              <NewCV />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-cv/:cvId" 
          element={
            <ProtectedRoute>
              <NewCV />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/new-resume" 
          element={
            <ProtectedRoute>
              <NewResume />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/resume/create-new" 
          element={
            <ProtectedRoute>
              <EditResume />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-resume" 
          element={
            <ProtectedRoute>
              <EditResume />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-resume/:resumeId" 
          element={
            <ProtectedRoute>
              <EditResume />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ai-resume-writer" 
          element={<AIResumeWriter />}
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
          <Route path="ai-config" element={<AIConfig />} />
          <Route path="logs" element={<Logs />} />
          <Route path="user-logs" element={<UserLogs />} />
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
