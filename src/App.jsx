import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const SimulationsPage = lazy(() => import('./pages/SimulationsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const GenericSimulationPage = lazy(() => import('./components/GenericSimulationPage'));
const SanadPage = lazy(() => import('./pages/SanadPage'));
const CheckEmailPage = lazy(() => import('./pages/CheckEmailPage'));
const CareerBriefingPage = lazy(() => import('./pages/CareerBriefingPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Loading fallback component
const PageLoader = () => (
    <div className="flex justify-center items-center h-screen bg-[var(--color-bg-primary)]">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[var(--color-text-secondary)] font-medium">جاري التحميل...</span>
        </div>
    </div>
);

const ProtectedRoute = () => {
    const { session, loading } = useAuth();

    if (loading) {
        return <PageLoader />;
    }

    if (!session) {
        globalThis.location.href = '/login';
        return null;
    }

    return <Outlet />;
};

function App() {
  return (
    <ToastProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
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
                <Route path="/sanad" element={<SanadPage />} />
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Router>
    </ToastProvider>
  );
}

export default App; 