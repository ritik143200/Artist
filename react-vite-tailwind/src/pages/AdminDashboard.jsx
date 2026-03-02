import React, { useState, useEffect } from 'react';
import { useRouter } from '../contexts/RouterContext';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = ({ config }) => {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Data states
  const [users, setUsers] = useState([]);
  const [artists, setArtists] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    thisMonthRevenue: 0,
    lastMonthRevenue: 0,
    totalUsers: 0,
    totalArtists: 0,
    totalBookings: 0,
    pendingInquiries: 0,
    activeUsers: 0,
    conversionRate: 0
  });

  // Check admin role
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      console.log('🚫 Access denied: Not an admin');
      navigate('home');
      return;
    }
    setAdminData(user);
  }, [user, navigate]);

  // Fetch data from backend APIs
  useEffect(() => {
    if (!adminData) return;
    
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all data in parallel
        const [
          usersRes, 
          artistsRes, 
          bookingsRes, 
          inquiriesRes,
          analyticsRes
        ] = await Promise.all([
          fetch('http://localhost:5001/api/admin/users', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
          }),
          fetch('http://localhost:5001/api/admin/artists', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
          }),
          fetch('http://localhost:5001/api/admin/bookings', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
          }),
          fetch('http://localhost:5001/api/admin/inquiries', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
          }),
          fetch('http://localhost:5001/api/admin/analytics', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
          })
        ]);

        // Parse responses
        const usersData = usersRes.ok ? await usersRes.json() : [];
        const artistsData = artistsRes.ok ? await artistsRes.json() : [];
        const bookingsData = bookingsRes.ok ? await bookingsRes.json() : [];
        const inquiriesData = inquiriesRes.ok ? await inquiriesRes.json() : [];
        const analyticsData = analyticsRes.ok ? await analyticsRes.json() : {};

        // Update state
        setUsers(usersData);
        setArtists(artistsData);
        setBookings(bookingsData);
        setInquiries(inquiriesData);
        setAnalytics(analyticsData);

        console.log('📊 Dashboard data loaded:', {
          users: usersData.length,
          artists: artistsData.length,
          bookings: bookingsData.length,
          inquiries: inquiriesData.length,
          analytics: analyticsData
        });

      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
        
        // Fallback to mock data for development
        setUsers([
          { _id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'user', joinDate: '2024-01-15', status: 'active', lastLogin: '2024-03-15' },
          { _id: 2, name: 'Priya Patel', email: 'priya@example.com', role: 'user', joinDate: '2024-02-20', status: 'active', lastLogin: '2024-03-14' },
          { _id: 3, name: 'Amit Kumar', email: 'amit@example.com', role: 'artist', joinDate: '2024-01-10', status: 'pending', lastLogin: '2024-03-10' }
        ]);

        setArtists([
          { _id: 1, name: 'Melody Band', category: 'Bands', rating: 4.8, bookings: 25, status: 'verified', earnings: 125000, joinDate: '2024-01-01' },
          { _id: 2, name: 'DJ Storm', category: 'DJs', rating: 4.9, bookings: 18, status: 'verified', earnings: 95000, joinDate: '2024-01-15' },
          { _id: 3, name: 'Sara Singh', category: 'Singers', rating: 4.7, bookings: 12, status: 'pending', earnings: 68000, joinDate: '2024-02-01' }
        ]);

        setBookings([
          { _id: 1, user: 'Rahul Sharma', artist: 'Melody Band', date: '2024-03-15', amount: 25000, status: 'completed', paymentStatus: 'paid' },
          { _id: 2, user: 'Priya Patel', artist: 'DJ Storm', date: '2024-04-20', amount: 15000, status: 'confirmed', paymentStatus: 'pending' },
          { _id: 3, user: 'Amit Kumar', artist: 'Sara Singh', date: '2024-02-28', amount: 20000, status: 'pending', paymentStatus: 'pending' }
        ]);

        setInquiries([
          { _id: 1, user: 'Rahul Sharma', artist: 'Melody Band', subject: 'Wedding Booking', message: 'Need band for wedding', date: '2024-03-15', status: 'new' },
          { _id: 2, user: 'Priya Patel', artist: 'DJ Storm', subject: 'Birthday Party', message: 'DJ needed for birthday', date: '2024-03-14', status: 'responded' },
          { _id: 3, user: 'Amit Kumar', artist: 'Sara Singh', subject: 'Corporate Event', message: 'Singer for corporate event', date: '2024-03-13', status: 'new' }
        ]);

        setAnalytics({
          totalRevenue: 2880000,
          thisMonthRevenue: 350000,
          lastMonthRevenue: 280000,
          totalUsers: 150,
          totalArtists: 45,
          totalBookings: 89,
          pendingInquiries: 12,
          activeUsers: 89,
          conversionRate: 68.5
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [adminData]);

  // Real-time data refresh
  useEffect(() => {
    if (!adminData) return;

    const interval = setInterval(async () => {
      try {
        const analyticsRes = await fetch('http://localhost:5001/api/admin/analytics', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
        });
        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          setAnalytics(analyticsData);
        }
      } catch (error) {
        console.log('🔄 Real-time update failed:', error);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [adminData]);

  // Action handlers
  const handleUserAction = async (userId, action) => {
    try {
      setSuccessMessage(null);
      setError(null);
      
      const response = await fetch(`http://localhost:5001/api/admin/users/${userId}/${action}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Refresh users data
        const usersRes = await fetch('http://localhost:5001/api/admin/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
        });
        if (usersRes.ok) {
          const updatedUsers = await usersRes.json();
          setUsers(updatedUsers);
          
          // Show success message
          const user = updatedUsers.find(u => u._id === userId);
          if (action === 'toggle-status') {
            setSuccessMessage(`User "${user?.name || 'Unknown'}" ${user?.status === 'active' ? 'deactivated' : 'activated'} successfully`);
          } else if (action === 'delete') {
            setSuccessMessage(`User deleted successfully`);
          }
          
          // Clear success message after 3 seconds
          setTimeout(() => setSuccessMessage(null), 3000);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || `Failed to ${action} user`);
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error(`❌ Error ${action} user:`, error);
      setError(`Network error: ${error.message}`);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleArtistAction = async (artistId, action) => {
    try {
      const response = await fetch(`http://localhost:5001/api/admin/artists/${artistId}/${action}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Refresh artists data
        const artistsRes = await fetch('http://localhost:5001/api/admin/artists', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
        });
        if (artistsRes.ok) {
          setArtists(await artistsRes.json());
        }
      }
    } catch (error) {
      console.error(`❌ Error ${action} artist:`, error);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      const response = await fetch(`http://localhost:5001/api/admin/bookings/${bookingId}/${action}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Refresh bookings data
        const bookingsRes = await fetch('http://localhost:5001/api/admin/bookings', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
        });
        if (bookingsRes.ok) {
          setBookings(await bookingsRes.json());
        }
      }
    } catch (error) {
      console.error(`❌ Error ${action} booking:`, error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('home');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center" style={{ backgroundColor: config?.background_color || '#f9fafb' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-full flex items-center justify-center" style={{ backgroundColor: config?.background_color || '#f9fafb' }}>
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Overview component
  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <span className="text-2xl font-bold" style={{ color: config?.primary_color || '#3b82f6' }}>
            ₹{(analytics.totalRevenue / 100000).toFixed(1)}L
          </span>
        </div>
        <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
        <p className="text-xs text-green-600 mt-2">
          +{((analytics.thisMonthRevenue - analytics.lastMonthRevenue) / analytics.lastMonthRevenue * 100).toFixed(1)}% from last month
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <span className="text-2xl font-bold" style={{ color: config?.primary_color || '#3b82f6' }}>
            {analytics.totalUsers}
          </span>
        </div>
        <h3 className="text-gray-600 text-sm font-medium">Total Users</h3>
        <p className="text-xs text-green-600 mt-2">Active: {analytics.activeUsers}</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-2xl font-bold" style={{ color: config?.primary_color || '#3b82f6' }}>
            {analytics.totalBookings}
          </span>
        </div>
        <h3 className="text-gray-600 text-sm font-medium">Total Bookings</h3>
        <p className="text-xs text-green-600 mt-2">This month: {analytics.thisMonthRevenue / 25000}</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-2xl font-bold" style={{ color: config?.primary_color || '#3b82f6' }}>
            {analytics.totalArtists}
          </span>
        </div>
        <h3 className="text-gray-600 text-sm font-medium">Active Artists</h3>
        <p className="text-xs text-green-600 mt-2">Pending: {inquiries.filter(i => i.status === 'new').length}</p>
      </div>
    </div>
  );

  // Users table component with enhanced features
  const renderUsers = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold" style={{ color: config?.text_primary || '#1f2937' }}>
            User Management
          </h3>
          <p className="text-sm mt-1" style={{ color: config?.text_secondary || '#6b7280' }}>
            Manage platform users and their permissions
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => {
              // Refresh users data
              const fetchUsers = async () => {
                try {
                  const response = await fetch('http://localhost:5001/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
                  });
                  if (response.ok) {
                    setUsers(await response.json());
                  }
                } catch (error) {
                  console.error('❌ Error refreshing users:', error);
                }
              };
              fetchUsers();
            }}
            className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center gap-2 text-sm sm:text-base"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">↻</span>
          </button>
          <button 
            onClick={() => navigate('auth')} 
            className="px-3 sm:px-4 py-2 rounded-xl font-medium transition-all hover:shadow-md transform hover:scale-105 flex items-center gap-2 text-sm sm:text-base"
            style={{ 
              backgroundColor: config?.primary_color || '#3b82f6',
              color: 'white'
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add User</span>
            <span className="sm:hidden">+</span>
          </button>
          <button className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center gap-2 text-sm sm:text-base">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">↓</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: config?.primary_color || '#3b82f6' }}></div>
          <span className="ml-3" style={{ color: config?.text_secondary || '#6b7280' }}>Loading users...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-red-800 font-medium">Error loading users</h4>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-green-800 font-medium">Success</h4>
              <p className="text-green-600 text-sm mt-1">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] sm:min-w-0">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Join Date</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Last Login</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 sm:px-6 py-8 sm:py-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                      <p className="text-gray-500 text-sm sm:text-base">Get started by adding your first user to the platform.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-2 sm:mr-3" 
                             style={{ backgroundColor: `${config?.primary_color || '#3b82f6'}20` }}>
                          <span className="text-sm sm:text-lg font-medium" style={{ color: config?.primary_color || '#3b82f6' }}>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium" style={{ color: config?.text_primary || '#1f2937' }}>
                            {user.name || 'Unknown User'}
                          </div>
                          <div className="text-xs" style={{ color: config?.text_secondary || '#6b7280' }}>
                            ID: {user._id ? user._id.slice(-8) : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm" style={{ color: config?.text_secondary || '#6b7280' }}>
                        {user.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className={`px-2 sm:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : user.role === 'artist'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm" style={{ color: config?.text_secondary || '#6b7280' }}>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm" style={{ color: config?.text_secondary || '#6b7280' }}>
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Never'}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className={`px-2 sm:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status || 'inactive'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button 
                          onClick={() => handleUserAction(user._id, 'toggle-status')}
                          className="px-2 sm:px-3 py-1 rounded-lg text-xs font-medium transition-colors hover:shadow-sm"
                          style={{ 
                            backgroundColor: user.status === 'active' ? '#fef2f2' : '#f0fdf4',
                            color: user.status === 'active' ? '#dc2626' : '#16a34a'
                          }}
                        >
                          <span className="hidden sm:inline">{user.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                          <span className="sm:hidden">{user.status === 'active' ? '⊘' : '✓'}</span>
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete user "${user.name || 'Unknown'}"? This action cannot be undone.`)) {
                              handleUserAction(user._id, 'delete');
                            }
                          }}
                          className="px-2 sm:px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                        >
                          <span className="hidden sm:inline">Delete</span>
                          <span className="sm:hidden">🗑</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && users.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{users.length}</span> users
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Continue with other components...
  return (
    <div className="min-h-full pt-20 lg:pt-24" style={{ backgroundColor: config?.background_color || '#f9fafb' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold" style={{ color: config?.text_primary || '#1f2937' }}>
                    Admin Dashboard
                  </h1>
                  <p className="text-sm" style={{ color: config?.text_secondary || '#6b7280' }}>
                    Welcome back, {adminData?.name || 'Admin'}!
                  </p>
                  <p className="text-xs mt-1" style={{ color: config?.primary_color || '#3b82f6' }}>
                    Indori Artist Platform - Real-time Management
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <button 
                  onClick={handleLogout}
                  className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-6 sm:space-x-8 scrollbar-hide">
            {['overview', 'users', 'artists', 'bookings', 'inquiries', 'analytics', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="hidden sm:inline">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                <span className="sm:hidden">
                  {tab === 'overview' && '📊'}
                  {tab === 'users' && '👥'}
                  {tab === 'artists' && '🎨'}
                  {tab === 'bookings' && '📅'}
                  {tab === 'inquiries' && '💬'}
                  {tab === 'analytics' && '📈'}
                  {tab === 'settings' && '⚙️'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'artists' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-bold mb-4" style={{ color: config?.text_primary || '#1f2937' }}>
              Artist Management
            </h3>
            <p className="text-sm" style={{ color: config?.text_secondary || '#6b7280' }}>
              Artist management features coming soon...
            </p>
          </div>
        )}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-bold mb-4" style={{ color: config?.text_primary || '#1f2937' }}>
              Booking Management
            </h3>
            <p className="text-sm" style={{ color: config?.text_secondary || '#6b7280' }}>
              Booking management features coming soon...
            </p>
          </div>
        )}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-bold mb-4" style={{ color: config?.text_primary || '#1f2937' }}>
              Inquiry Management
            </h3>
            <p className="text-sm" style={{ color: config?.text_secondary || '#6b7280' }}>
              Inquiry management features coming soon...
            </p>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-bold mb-4" style={{ color: config?.text_primary || '#1f2937' }}>
              Analytics Dashboard
            </h3>
            <p className="text-sm" style={{ color: config?.text_secondary || '#6b7280' }}>
              Advanced analytics coming soon...
            </p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-bold mb-6" style={{ color: config?.text_primary || '#1f2937' }}>
              System Settings
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <h4 className="text-lg font-medium" style={{ color: config?.text_primary || '#1f2937' }}>
                    User Registration
                  </h4>
                  <p className="text-sm" style={{ color: config?.text_secondary || '#6b7280' }}>
                    Allow new users to register
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                        style={{ backgroundColor: config?.primary_color || '#3b82f6' }}>
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
