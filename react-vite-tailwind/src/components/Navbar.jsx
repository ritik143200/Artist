import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../contexts/RouterContext';
import SearchBar from './SearchBar';
import { categories } from '../data/mockData';

const Navbar = ({ config }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDashboardMenu, setShowDashboardMenu] = useState(false);
  const { navigate } = useRouter();

  // Check if user is logged in
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDashboardMenu && !event.target.closest('.dashboard-menu')) {
        setShowDashboardMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDashboardMenu]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo - Left Side */}
          <div 
            className="flex items-center cursor-pointer flex-shrink-0" 
            onClick={() => navigate('home')}
          >
            <img 
              src="/IndoriArtist_Logo.avif" 
              alt="Indori Artist" 
              className="h-8 w-auto sm:h-10 lg:h-12"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'%3E%3Ctext x='10' y='40' font-family='Arial' font-size='20' font-weight='bold' fill='%233b82f6'%3EIndori Artist%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
            {/* Search Bar */}
            <SearchBar className="w-56 lg:w-64 xl:w-80" />
          </div>

          {/* Right Side Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {/* Navigation Links */}
            <div className="hidden xl:flex items-center gap-4 xl:gap-6">
              {/* Home Link */}
              <button 
                onClick={() => navigate('home')}
                className="font-medium text-gray-700 hover:text-brand-600 transition-colors whitespace-nowrap"
              >
                Home
              </button>

              {/* Services Link */}
              <button 
                onClick={() => navigate('services')}
                className="font-medium text-gray-700 hover:text-brand-600 transition-colors whitespace-nowrap"
              >
                Services
              </button>

              {/* About Link */}
              <button 
                onClick={() => navigate('about')}
                className="font-medium text-gray-700 hover:text-brand-600 transition-colors whitespace-nowrap"
              >
                About
              </button>

              {/* FAQ Link */}
              <button 
                onClick={() => navigate('faq')}
                className="font-medium text-gray-700 hover:text-brand-600 transition-colors whitespace-nowrap"
              >
                FAQ
              </button>
            </div>

            {/* Sign In Link */}
            {!userData ? (
              <button 
                onClick={() => navigate('auth')}
                className="font-medium text-gray-700 hover:text-brand-600 transition-colors whitespace-nowrap"
              >
                Sign In
              </button>
            ) : (
              /* Dashboard Menu */
              <div className="relative dashboard-menu">
                <button 
                  onClick={() => setShowDashboardMenu(!showDashboardMenu)}
                  className="font-medium text-gray-700 hover:text-brand-600 transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  Dashboard
                  <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dashboard Dropdown */}
                {showDashboardMenu && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[100]">
                    {userData?.role === 'user' && (
                      <button
                        onClick={() => {
                          navigate('user-dashboard');
                          setShowDashboardMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-3"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 007 7z" />
                        </svg>
                        <div>
                          <div className="font-medium">User Dashboard</div>
                          <div className="text-xs text-gray-500">Manage your bookings</div>
                        </div>
                      </button>
                    )}
                    
                    {userData?.role === 'artist' && (
                      <button
                        onClick={() => {
                          navigate('artist-dashboard');
                          setShowDashboardMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-3"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.707.293.707.293V17a2 2 0 01-2 2H8a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <div className="font-medium">Artist Dashboard</div>
                          <div className="text-xs text-gray-500">Manage your portfolio</div>
                        </div>
                      </button>
                    )}
                    
                    {userData?.role === 'admin' && (
                      <button
                        onClick={() => {
                          navigate('admin-dashboard');
                          setShowDashboardMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-3"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        </svg>
                        <div>
                          <div className="font-medium">Admin Dashboard</div>
                          <div className="text-xs text-gray-500">System administration</div>
                        </div>
                      </button>
                    )}
                    
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <button
                        onClick={() => {
                          localStorage.removeItem('userToken');
                          localStorage.removeItem('userData');
                          setUserData(null);
                          navigate('home');
                          setShowDashboardMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-900 transition-colors flex items-center gap-3"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4 4m4-4H3m2 4h6M5 12H3m2 4h6m6 4h6m2 4h6a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <div className="font-medium">Logout</div>
                          <div className="text-xs text-red-500">Sign out of your account</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Artist Registration Link */}
            <button 
              onClick={() => navigate('artist-registration')}
              className="px-4 xl:px-5 py-2.5 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 whitespace-nowrap"
              style={{ backgroundColor: config.primary_action }}
            >
              Artist Registration
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 py-4 animate-fadeIn absolute top-full left-0 right-0 shadow-lg z-50">
            <div className="px-4 pb-4">
              <SearchBar />
            </div>
            <div className="space-y-1 px-2">
              <button
                onClick={() => {
                  navigate('home');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50"
              >
                <span className="font-medium">Home</span>
              </button>
              <button
                onClick={() => {
                  navigate('services');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50"
              >
                <span className="font-medium">Services</span>
              </button>
              <button
                onClick={() => {
                  navigate('about');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50"
              >
                <span className="font-medium">About</span>
              </button>
              <button
                onClick={() => {
                  navigate('faq');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50"
              >
                <span className="font-medium">FAQ</span>
              </button>
              {!userData ? (
                <button
                  onClick={() => {
                    navigate('auth');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50"
                >
                  <span className="font-medium">Sign In</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate(`${userData.role}-dashboard`);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50"
                  >
                    <span className="font-medium">Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('userToken');
                      localStorage.removeItem('userData');
                      setUserData(null);
                      navigate('home');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600"
                  >
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              )}
              
              <button
                onClick={() => {
                  navigate('artist-registration');
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: config.primary_action }}
              >
                Artist Registration
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
