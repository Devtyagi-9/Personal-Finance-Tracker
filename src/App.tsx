import { useState } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

type Page = 'landing' | 'auth' | 'dashboard';
type AuthMode = 'login' | 'signup';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [, setIsLoggedIn] = useState(false);

  const handleAuth = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('landing');
  };

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