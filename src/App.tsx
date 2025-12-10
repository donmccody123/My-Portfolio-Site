import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';

function AppContent() {
  const [activeSection, setActiveSection] = useState('home');
  const [showAdmin, setShowAdmin] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setShowAdmin(true);
    }
  }, []);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (showAdmin) {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return user ? <AdminDashboard /> : <Login />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={handleNavigate} activeSection={activeSection} />
      <Hero onNavigate={handleNavigate} />
      <Portfolio />
      <About />
      <Services />
      <Contact />

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} BM TECH SOLUTIONS. All rights reserved.
            </p>
            <button
              onClick={() => setShowAdmin(true)}
              className="mt-4 text-gray-500 hover:text-gray-400 text-sm"
            >
              Admin
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
