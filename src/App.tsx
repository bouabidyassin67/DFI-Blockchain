
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";

import Dashboard from "./pages/Index";
import NotFound from "./pages/NotFound";
import Courses from "./pages/Courses";
import Calendar from "./pages/Calendar";
import IQTests from "./pages/IQTests";
import Quizzes from "./pages/Quizzes";
import Music from "./pages/Music";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import GlobalChatPopup from './components/GlobalChatPopup';
import MusicPlayerPopup from './components/MusicPlayerPopup';
import MusicPlayer from './components/MusicPlayer';
import ProtectedRoute from "@/components/ProtectedRoute";
import LivePodcast from "./pages/LivePodcast";
import Subscription from "./pages/Subscription";
import LandingPage from "./pages/LandingPage";
import EmailVerification from "./pages/EmailVerification";
import PasswordReset from "./pages/PasswordReset";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import AdminSetupPage from "./pages/AdminSetup";

// Import student pages
import Certificates from "./pages/student/Certificates";
import CertificateDetail from "./pages/student/CertificateDetail";
import Progress from "./pages/student/Progress";
import CourseProgressDetail from "./pages/student/CourseProgressDetail";
import Communication from "./pages/student/Communication";
import Profile from "./pages/student/Profile";
import Payments from "./pages/student/Payments";
import Gamification from "./pages/student/Gamification";

// Import admin pages
import AdminUsers from "./pages/admin/Users";
import AdminCourses from "./pages/admin/Courses";
import AdminEnrollments from "./pages/admin/Enrollments";
import AdminFinance from "./pages/admin/Finance";
import AdminContent from "./pages/admin/Content";
import AdminReports from "./pages/admin/Reports";
import IQTestManagement from "./pages/admin/IQTestManagement";

// Import detail pages
import UserDetail from "./pages/admin/UserDetail";
import CourseDetail from "./pages/admin/CourseDetail";
import CalendarManagement from "./pages/admin/CalendarManagement";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public landing page */}
              <Route path="/home" element={<LandingPage />} />
              
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/email-verification" element={<EmailVerification />} />
              <Route path="/reset-password" element={<PasswordReset />} />
              <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
              <Route path="/admin-setup" element={<AdminSetupPage />} />
              
              {/* Protected routes - Student */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/courses" element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              } />
              <Route path="/calendar" element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              } />
              <Route path="/iq-tests" element={
                <ProtectedRoute>
                  <IQTests />
                </ProtectedRoute>
              } />
              <Route path="/quizzes" element={
                <ProtectedRoute>
                  <Quizzes />
                </ProtectedRoute>
              } />
              <Route path="/music" element={
                <ProtectedRoute>
                  <Music />
                </ProtectedRoute>
              } />
              <Route path="/certificates" element={
                <ProtectedRoute>
                  <Certificates />
                </ProtectedRoute>
              } />
              <Route path="/certificates/:id" element={
                <ProtectedRoute>
                  <CertificateDetail />
                </ProtectedRoute>
              } />
              <Route path="/progress" element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              } />
              <Route path="/progress/:id" element={
                <ProtectedRoute>
                  <CourseProgressDetail />
                </ProtectedRoute>
              } />
              <Route path="/communication" element={
                <ProtectedRoute>
                  <Communication />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/payments" element={
                <ProtectedRoute>
                  <Payments />
                </ProtectedRoute>
              } />
              <Route path="/gamification" element={
                <ProtectedRoute>
                  <Gamification />
                </ProtectedRoute>
              } />
              <Route path="/live-podcast" element={
                <ProtectedRoute>
                  <LivePodcast />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/users/:id" element={
                <ProtectedRoute adminOnly={true}>
                  <UserDetail />
                </ProtectedRoute>
              } />
              <Route path="/admin/courses" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminCourses />
                </ProtectedRoute>
              } />
              <Route path="/admin/courses/:id" element={
                <ProtectedRoute adminOnly={true}>
                  <CourseDetail />
                </ProtectedRoute>
              } />
              <Route path="/admin/enrollments" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminEnrollments />
                </ProtectedRoute>
              } />
              <Route path="/admin/finance" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminFinance />
                </ProtectedRoute>
              } />
              <Route path="/admin/content" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminContent />
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminReports />
                </ProtectedRoute>
              } />
              <Route path="/admin/iq-test-management" element={
                <ProtectedRoute adminOnly={true}>
                  <IQTestManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/calendar" element={
                <ProtectedRoute adminOnly={true}>
                  <CalendarManagement />
                </ProtectedRoute>
              } />
              
              {/* Fallback routes */}
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
            <MusicPlayer />
            <GlobalChatPopup />
            <MusicPlayerPopup />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
