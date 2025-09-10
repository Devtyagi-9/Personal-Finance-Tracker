import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import apiService from './services/apiService';

type Page = 'landing' | 'auth' | 'dashboard';
type AuthMode = 'login' | 'signup';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app startup
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Verify token is still valid by making a test request
          await apiService.getDashboardData();
          setIsLoggedIn(true);
          setCurrentPage('dashboard');
        } catch (error: any) {
          // Token is invalid, clear it
          console.log('Token validation failed:', error.message);
          apiService.removeAuthToken();
          setIsLoggedIn(false);
          setCurrentPage('landing');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Global error handler for authentication errors
  useEffect(() => {
    const handleAuthError = () => {
      setIsLoggedIn(false);
      setCurrentPage('landing');
    };

    // Listen for storage changes (in case token is removed in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' && !e.newValue) {
        handleAuthError();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAuth = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    apiService.removeAuthToken();
    setIsLoggedIn(false);
    setCurrentPage('landing');
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (currentPage === 'landing') {
    return (
      <LandingPage 
        onGetStarted={() => setCurrentPage('auth')}
        onLogin={() => {
          setAuthMode('login');
          setCurrentPage('auth');
        }}
      />
    );
  }

  if (currentPage === 'auth') {
    return (
      <AuthPage
        mode={authMode}
        onModeChange={setAuthMode}
        onAuth={handleAuth}
        onBack={() => setCurrentPage('landing')}
      />
    );
  }

  return (
    <Dashboard onLogout={handleLogout} />
  );
}