import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BookingPage from './pages/BookingPage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage'; // Import
import CreateEventPage from './pages/CreateEventPage'; // Import
import ProfilePage from './pages/ProfilePage'; // Import
import SettingsPage from './pages/SettingsPage'; // Import
import NotificationsPage from './pages/NotificationsPage'; // Import
import UserManagementPage from './pages/admin/UserManagementPage'; // Import Admin Page
import ResourceManagementPage from './pages/admin/ResourceManagementPage'; // Import Admin Page
import ClubManagementPage from './pages/admin/ClubManagementPage'; // Import Admin Page
import AllEventsManagementPage from './pages/admin/AllEventsManagementPage'; // Import Admin Page
import AnalyticsReportsPage from './pages/admin/AnalyticsReportsPage'; // Import Admin Page
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OTPVerificationPage from './pages/OTPVerificationPage';
import ParticipantDashboard from './pages/ParticipantDashboard';
import MyRegisteredEventsPage from './pages/MyRegisteredEventsPage';
import MyClubsPage from './pages/MyClubsPage';
import ClubDetailsPage from './pages/ClubDetailsPage'; // New Page
import ResetPasswordPage from './pages/ResetPasswordPage';
import FavoritesPage from './pages/FavoritesPage';
import ForbiddenPage from './pages/ForbiddenPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<OTPVerificationPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/clubs/:id" element={<ClubDetailsPage />} />
            <Route path="/events/create" element={<CreateEventPage />} />
            <Route path="/events/:id/edit" element={<CreateEventPage />} />
            <Route path="/bookings" element={<BookingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/participant-dashboard" element={<ParticipantDashboard />} />
            <Route path="/my-events" element={<MyRegisteredEventsPage />} />
            <Route path="/my-clubs" element={<MyClubsPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/resources" element={<ResourceManagementPage />} />
            <Route path="/admin/clubs" element={<ClubManagementPage />} />
            <Route path="/admin/events" element={<AllEventsManagementPage />} />
            <Route path="/admin/analytics" element={<AnalyticsReportsPage />} />
          </Route>

          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
