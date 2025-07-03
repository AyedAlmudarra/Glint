import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import SimulationsPage from './pages/SimulationsPage';
import ProfilePage from './pages/ProfilePage';
import GenericSimulationPage from './components/GenericSimulationPage';
import AyedPage from './pages/AyedPage';
import CheckEmailPage from './pages/CheckEmailPage';
import CareerBriefingPage from './pages/CareerBriefingPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = () => {
    const { session, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">جاري التحميل...</div>;
    }

    return session ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Marketing Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Protected App Routes */}
        <Route 
          element={
            <AuthProvider>
              <ProtectedRoute />
            </AuthProvider>
          }
        >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/simulations" element={<SimulationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/simulations/task/:simulationId" element={<GenericSimulationPage />} />
            <Route path="/simulations/briefing/:simulationId" element={<CareerBriefingPage />} />
            <Route path="/ayed" element={<AyedPage />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App; 