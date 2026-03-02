import { useState, useEffect } from 'react';
import { RouterProvider, useRouter } from './contexts/RouterContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ArtistPage from './pages/ArtistPage';
import AuthPage from './pages/AuthPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import FAQPage from './pages/FAQPage';
import ArtistRegistrationPage from './pages/ArtistRegistrationPage';
import UserDashboard from './pages/UserDashboard';
import ArtistDashboard from './pages/ArtistDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { defaultConfig } from './data/mockData';

function App() {
  const [config, setConfig] = useState(defaultConfig);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-3xl font-bold text-brand-500 mx-auto mb-4 animate-pulse">
            Indori Artist
          </div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <RouterProvider>
      <AppContent config={config} />
    </RouterProvider>
  );
}

const AppContent = ({ config }) => {
  const { currentPath } = useRouter();

  // Auth pages don't show navbar
  const isAuthPage = currentPath === 'auth' || currentPath === 'artist-registration' || currentPath === 'reset-password';

  return (
    <AuthProvider>
      <div 
        className="min-h-full w-full overflow-auto"
        style={{ 
          backgroundColor: config.background_color,
          fontFamily: `${config.font_family}, sans-serif` 
        }}
      >
        {!isAuthPage && <Navbar config={config} />}
        {(currentPath === 'auth' || currentPath === 'reset-password') && <AuthPage />}
        {currentPath === 'artist-registration' && <ArtistRegistrationPage config={config} />}
        {currentPath === 'about' && <AboutPage config={config} />}
        {currentPath === 'services' && <ServicesPage config={config} />}
        {currentPath === 'faq' && <FAQPage config={config} />}
        {currentPath === 'category' && <CategoryPage config={config} />}
        {currentPath === 'artist' && <ArtistPage config={config} />}
        {currentPath === 'home' && <HomePage config={config} />}
        {currentPath === 'user-dashboard' && <UserDashboard config={config} />}
        {currentPath === 'artist-dashboard' && <ArtistDashboard config={config} />}
        {currentPath === 'admin-dashboard' && <AdminDashboard config={config} />}
      </div>
    </AuthProvider>
  );
};

export default App;
