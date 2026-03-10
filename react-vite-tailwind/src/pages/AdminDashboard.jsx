import React, { useState, useEffect } from 'react';
import { useRouter } from '../contexts/RouterContext';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = ({ config }) => {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001').replace(/\/$/, '');
  const [adminData, setAdminData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Data states
  const [users, setUsers] = useState([]);
  const [artists, setArtists] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  // Booking UI states
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [statusDropdownId, setStatusDropdownId] = useState(null);
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
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const authHeader = { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` };
        const [
          usersRes,
          bookingsRes
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/api/admin/users`, { headers: authHeader }),
          fetch(`${API_BASE_URL}/api/admin/bookings`, { headers: authHeader })
        ]);

        // Handle responses
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.data || usersData || []);
        }

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData.data || bookingsData || []);
        }

        // Mock notifications
        setNotifications([
          {
            id: 1,
            title: 'New User Registration',
            message: 'John Doe just registered on platform',
            time: '2 minutes ago',
            isRead: false,
            type: 'user'
          },
          {
            id: 2,
            title: 'New Booking',
            message: 'A new booking was made for Artist XYZ',
            time: '5 minutes ago',
            isRead: false,
            type: 'booking'
          },
          {
            id: 3,
            title: 'Pending Inquiry',
            message: 'You have 3 pending inquiries to review',
            time: '10 minutes ago',
            isRead: true,
            type: 'inquiry'
          }
        ]);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [adminData, API_BASE_URL]);

  const handleAdminBookingAction = async (bookingId, action) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/bookings/${bookingId}/${action}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Update the booking in local state without a full re-fetch
        setBookings(prev => prev.map(b =>
          (b._id === bookingId || b.id === bookingId) ? data.data : b
        ));
        setSuccessMessage(`Booking ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        alert(data.message || 'Failed to update booking');
      }
    } catch (err) {
      console.error('Error updating booking:', err);
      alert('Network error while updating booking.');
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('home');
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleMarkNotificationRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  // Theme-consistent colors from landing page
  const getThemeColor = (type) => {
    const colors = {
      primary: config?.primary_action || '#ee7711',
      secondary: config?.secondary_action || '#6b7280',
      surface: config?.surface_color || '#ffffff',
      background: config?.background_color || '#f9fafb',
      text: config?.text_color || '#1f2937'
    };
    return colors[type] || colors.text;
  };

  // Category colors from landing page
  const getCategoryColors = (index) => {
    const categoryColors = [
      'from-purple-500 to-indigo-600',
      'from-pink-500 to-rose-600',
      'from-blue-500 to-cyan-600',
      'from-amber-500 to-orange-600',
      'from-emerald-500 to-teal-600',
      'from-violet-500 to-purple-600',
      'from-red-500 to-pink-600',
      'from-yellow-500 to-amber-600'
    ];
    return categoryColors[index % categoryColors.length];
  };

  // Overview component with landing page theme
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards - Theme Consistent */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group relative overflow-hidden rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          style={{ backgroundColor: getThemeColor('surface') }}>
          <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColors(0)} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${getCategoryColors(0)} rounded-2xl flex items-center justify-center shadow-lg`}>
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-3xl font-bold" style={{ color: getThemeColor('text') }}>
                ₹{(analytics.totalRevenue / 100000).toFixed(1)}L
              </span>
            </div>
            <h3 className="font-semibold mb-2" style={{ color: getThemeColor('secondary') }}>Total Revenue</h3>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                +{((analytics.thisMonthRevenue - analytics.lastMonthRevenue) / analytics.lastMonthRevenue * 100).toFixed(1)}%
              </span>
              <span className="text-xs" style={{ color: getThemeColor('secondary') }}>from last month</span>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          style={{ backgroundColor: getThemeColor('surface') }}>
          <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColors(1)} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${getCategoryColors(1)} rounded-2xl flex items-center justify-center shadow-lg`}>
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-3xl font-bold" style={{ color: getThemeColor('text') }}>
                {analytics.totalUsers}
              </span>
            </div>
            <h3 className="font-semibold mb-2" style={{ color: getThemeColor('secondary') }}>Total Users</h3>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Active: {analytics.activeUsers}
              </span>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          style={{ backgroundColor: getThemeColor('surface') }}>
          <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColors(2)} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${getCategoryColors(2)} rounded-2xl flex items-center justify-center shadow-lg`}>
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-3xl font-bold" style={{ color: getThemeColor('text') }}>
                {analytics.totalBookings}
              </span>
            </div>
            <h3 className="font-semibold mb-2" style={{ color: getThemeColor('secondary') }}>Total Bookings</h3>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                This month: {Math.floor(analytics.thisMonthRevenue / 25000)}
              </span>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          style={{ backgroundColor: getThemeColor('surface') }}>
          <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColors(3)} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${getCategoryColors(3)} rounded-2xl flex items-center justify-center shadow-lg`}>
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-3xl font-bold" style={{ color: getThemeColor('text') }}>
                {analytics.pendingInquiries}
              </span>
            </div>
            <h3 className="font-semibold mb-2" style={{ color: getThemeColor('secondary') }}>Pending Inquiries</h3>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Needs review
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity - Theme Consistent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          style={{ backgroundColor: getThemeColor('surface') }}>
          <div className={`bg-gradient-to-r ${getCategoryColors(4)} p-6`}>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Activity
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {[
              { icon: '👤', text: 'New user registered', time: '2 minutes ago' },
              { icon: '📅', text: 'New booking created', time: '5 minutes ago' },
              { icon: '💬', text: 'New inquiry received', time: '10 minutes ago' },
              { icon: '🎨', text: 'Artist profile updated', time: '15 minutes ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-lg">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium" style={{ color: getThemeColor('text') }}>{activity.text}</p>
                  <p className="text-sm" style={{ color: getThemeColor('secondary') }}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          style={{ backgroundColor: getThemeColor('surface') }}>
          <div className={`bg-gradient-to-r ${getCategoryColors(5)} p-6`}>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Quick Stats
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
              <span className="font-medium text-blue-800">Conversion Rate</span>
              <span className="text-2xl font-bold text-blue-600">{analytics.conversionRate}%</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
              <span className="font-medium text-green-800">Total Artists</span>
              <span className="text-2xl font-bold text-green-600">{analytics.totalArtists}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl">
              <span className="font-medium text-orange-800">Avg. Booking Value</span>
              <span className="text-2xl font-bold text-orange-600">₹2,500</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Keep all other existing functions unchanged but with theme consistency
  const renderUsers = () => (
    <div className="rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      style={{ backgroundColor: getThemeColor('surface') }}>
      <div className={`bg-gradient-to-r ${getCategoryColors(1)} p-6 flex justify-between items-center`}>
        <h3 className="text-xl font-bold text-white">User Management</h3>
        <button className="px-4 py-2 bg-white text-green-600 rounded-xl font-medium hover:bg-green-50 transition-colors">
          Add New User
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No users found.</td></tr>
            ) : users.map((user) => (
              <tr key={user._id || user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium" style={{ color: getThemeColor('text') }}>{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  );


  const handleInlineStatusChange = async (bookingId, newStatus) => {
    const actionMap = { adminApproved: 'approve', rejected: 'reject', completed: 'complete' };
    const action = actionMap[newStatus];
    if (!action) return;
    setStatusDropdownId(null);
    await handleAdminBookingAction(bookingId, action);
  };

  const renderBookings = () => {
    const getStatusStyle = (status) => {
      if (status === 'adminApproved') return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', label: '✓ Approved' };
      if (status === 'rejected') return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: '✗ Rejected' };
      if (status === 'confirmed') return { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', label: '✓ Confirmed' };
      if (status === 'completed') return { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-400', label: '✓ Completed' };
      if (status === 'artistRejected') return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-400', label: '✗ Artist Declined' };
      return { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-400', label: '⏳ Pending' };
    };

    return (
      <div className="rounded-2xl shadow-lg border border-gray-100 overflow-hidden" style={{ backgroundColor: getThemeColor('surface') }}>
        {/* Header */}
        <div className={`bg-gradient-to-r ${getCategoryColors(3)} p-6 flex justify-between items-center`}>
          <div>
            <h3 className="text-xl font-bold text-white">Booking Management</h3>
            <p className="text-white/80 text-sm mt-1">
              {bookings.filter(b => b.status === 'pending').length} pending · {bookings.length} total
            </p>
          </div>
          <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium">
            {bookings.filter(b => b.status === 'adminApproved').length} awaiting artist
          </span>
        </div>

        {/* Success toast */}
        {successMessage && (
          <div className="mx-6 mt-4 px-4 py-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            {successMessage}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-rose-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-8">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Event Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Event Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-gray-400 font-medium">No bookings yet</p>
                    </div>
                  </td>
                </tr>
              ) : bookings.map((booking, idx) => {
                const bookingId = booking._id || booking.id;
                const isExpanded = expandedBookingId === bookingId;
                const showDropdown = statusDropdownId === bookingId;
                const st = getStatusStyle(booking.status);
                const artistName = booking.artistId
                  ? `${booking.artistId.firstName} ${booking.artistId.lastName}`
                  : 'Unknown Artist';

                return (
                  <React.Fragment key={bookingId}>
                    {/* Main row */}
                    <tr
                      className={`border-b border-gray-100 transition-colors cursor-pointer ${isExpanded ? 'bg-indigo-50/40' : 'hover:bg-gray-50'}`}
                      onClick={() => setExpandedBookingId(isExpanded ? null : bookingId)}
                    >
                      <td className="px-4 py-4 text-sm font-semibold text-gray-500">{idx + 1}</td>

                      <td className="px-4 py-4">
                        <div className="font-semibold text-gray-800 text-sm">{booking.userId?.name || booking.name || '—'}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{booking.userId?.email || booking.email || ''}</div>
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">{booking.phone || booking.userId?.phone || '—'}</td>

                      <td className="px-4 py-4 text-sm text-gray-700">{booking.eventType || '—'}</td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-indigo-600 font-medium">
                            {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                          </span>
                        </div>
                      </td>

                      {/* Artist type chip */}
                      <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                          </svg>
                          {booking.artistId?.artistType?.charAt(0)?.toUpperCase() || 'A'}
                        </span>
                      </td>

                      {/* Inline status dropdown */}
                      <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                        <div className="relative">
                          <button
                            onClick={() => setStatusDropdownId(showDropdown ? null : bookingId)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${st.bg} ${st.text} border-current/20 hover:shadow-sm`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
                            {st.label}
                            <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {/* Dropdown menu */}
                          {showDropdown && (
                            <div className="absolute left-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                              <div className="py-1">
                                <button
                                  onClick={() => handleInlineStatusChange(bookingId, 'pending')}
                                  disabled={booking.status === 'pending'}
                                  className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-yellow-50 transition-colors disabled:opacity-40"
                                >
                                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                                  <span className="text-yellow-700 font-medium">Pending</span>
                                </button>
                                <button
                                  onClick={() => handleInlineStatusChange(bookingId, 'adminApproved')}
                                  disabled={booking.status === 'adminApproved'}
                                  className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-green-50 transition-colors disabled:opacity-40"
                                >
                                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                  <span className="text-green-700 font-medium">✓ Approved</span>
                                </button>
                                <button
                                  onClick={() => handleInlineStatusChange(bookingId, 'rejected')}
                                  disabled={booking.status === 'rejected'}
                                  className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-red-50 transition-colors disabled:opacity-40"
                                >
                                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                  <span className="text-red-700 font-medium">✗ Rejected</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Eye icon */}
                      <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setExpandedBookingId(isExpanded ? null : bookingId)}
                          className={`p-2 rounded-full transition-all ${isExpanded ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-indigo-500 hover:bg-indigo-50'}`}
                          title="View details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </td>
                    </tr>

                    {/* Expanded detail panel */}
                    {isExpanded && (
                      <tr>
                        <td colSpan="8" className="px-0 py-0 bg-gray-50 border-b border-gray-200">
                          <div className="px-6 py-5">
                            {/* Detail grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 mb-5">
                              <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Email</p>
                                <p className="text-sm font-semibold text-gray-800">{booking.userId?.email || booking.email || '—'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Phone</p>
                                <p className="text-sm font-semibold text-gray-800">{booking.phone || '—'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Budget</p>
                                <p className="text-sm font-semibold text-gray-800">₹{(booking.budget || 0).toLocaleString('en-IN')}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Event Date</p>
                                <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString('en-IN') : '—'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">City</p>
                                <p className="text-sm font-semibold text-gray-800">{booking.eventLocation || '—'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Created On</p>
                                <p className="text-sm font-semibold text-gray-800">
                                  {booking.createdAt ? new Date(booking.createdAt).toLocaleString('en-IN') : '—'}
                                </p>
                              </div>
                              <div className="md:col-span-3">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Vendor / Artist</p>
                                <p className="text-sm font-semibold text-indigo-600">{artistName}</p>
                              </div>
                            </div>

                            {/* Message box */}
                            {booking.message && (
                              <div className="mb-5">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Message</p>
                                <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700">
                                  {booking.message}
                                </div>
                              </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex flex-wrap items-center gap-3">
                              {(booking.status === 'pending' || booking.status === 'rejected') && (
                                <button
                                  onClick={() => handleAdminBookingAction(bookingId, 'approve')}
                                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                  Forward to Artist
                                </button>
                              )}
                              {booking.status === 'adminApproved' && (
                                <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-50 text-green-700 text-sm font-semibold rounded-xl border border-green-200">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Forwarded to Artist
                                </span>
                              )}
                              {booking.status === 'confirmed' && (
                                <button
                                  onClick={() => handleAdminBookingAction(bookingId, 'complete')}
                                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Mark as Completed
                                </button>
                              )}
                              {!['rejected', 'artistRejected', 'completed'].includes(booking.status) && (
                                <button
                                  onClick={() => handleAdminBookingAction(bookingId, 'reject')}
                                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-all shadow-md hover:shadow-lg active:scale-95"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                  </svg>
                                  Make Inactive
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };


  const renderInquiries = () => (
    <div className="rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      style={{ backgroundColor: getThemeColor('surface') }}>
      <div className={`bg-gradient-to-r ${getCategoryColors(6)} p-6 flex justify-between items-center`}>
        <h3 className="text-xl font-bold text-white">Inquiry Management</h3>
        <button className="px-4 py-2 bg-white text-pink-600 rounded-xl font-medium hover:bg-pink-50 transition-colors">
          Mark All Read
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: getThemeColor('text') }}>#{inquiry.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inquiry.user}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{inquiry.message}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inquiry.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${inquiry.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {inquiry.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">Reply</button>
                  <button className="text-green-600 hover:text-green-900">Resolve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="rounded-2xl shadow-lg border border-gray-100 p-8"
      style={{ backgroundColor: getThemeColor('surface') }}>
      <h3 className="text-2xl font-bold mb-6" style={{ color: getThemeColor('text') }}>
        Analytics Dashboard
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`bg-gradient-to-br ${getCategoryColors(5)} bg-opacity-10 rounded-2xl p-6`}>
          <h4 className="text-lg font-semibold mb-4">Revenue Overview</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>This Month</span>
              <span className="font-bold">₹{analytics.thisMonthRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Month</span>
              <span className="font-bold">₹{analytics.lastMonthRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-bold">₹{analytics.totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className={`bg-gradient-to-br ${getCategoryColors(0)} bg-opacity-10 rounded-2xl p-6`}>
          <h4 className="text-lg font-semibold mb-4">User Analytics</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Users</span>
              <span className="font-bold">{analytics.totalUsers}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Users</span>
              <span className="font-bold">{analytics.activeUsers}</span>
            </div>
            <div className="flex justify-between">
              <span>Conversion Rate</span>
              <span className="font-bold">{analytics.conversionRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="rounded-2xl shadow-lg border border-gray-100 p-8"
      style={{ backgroundColor: getThemeColor('surface') }}>
      <h3 className="text-2xl font-bold mb-6" style={{ color: getThemeColor('text') }}>
        Admin Settings
      </h3>
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-2xl p-6">
          <h4 className="text-lg font-semibold mb-4">Platform Configuration</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Enable Email Notifications</span>
              <button className="w-12 h-6 bg-blue-500 rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Maintenance Mode</span>
              <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6">
          <h4 className="text-lg font-semibold mb-4">Security Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Two-Factor Authentication</span>
              <button className="w-12 h-6 bg-blue-500 rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Session Timeout</span>
              <select className="px-3 py-1 border border-gray-300 rounded-xl">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: getThemeColor('background') }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-medium" style={{ color: getThemeColor('text') }}>Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: getThemeColor('background') }}>
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Dashboard</h2>
          <p style={{ color: getThemeColor('secondary') }}>{error}</p>
        </div>
      </div>
    );
  }

  // Add top padding to prevent overlap with fixed navbar (assume navbar height ~80px)
  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: getThemeColor('background') }}>
      {/* Theme-Consistent Header */}
      <div className="shadow-lg border-b border-gray-100" style={{ backgroundColor: getThemeColor('surface') }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColors(0)} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: getThemeColor('text') }}>
                    Admin Dashboard
                  </h1>
                  <p className="text-sm font-medium" style={{ color: getThemeColor('secondary') }}>
                    Welcome back, {adminData?.name || 'Super Admin'}! 🎉
                  </p>
                  <p className="text-xs font-semibold mt-1" style={{ color: getThemeColor('primary') }}>
                    Indori Artist Platform - Real-time Management
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                        {notifications.filter(n => !n.isRead).length}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-96 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                      style={{ backgroundColor: getThemeColor('surface') }}>
                      <div className={`bg-gradient-to-r ${getCategoryColors(0)} p-4 flex justify-between items-center`}>
                        <h3 className="font-bold text-white">Notifications</h3>
                        {notifications.filter(n => !n.isRead).length > 0 && (
                          <button
                            onClick={handleMarkAllNotificationsRead}
                            className="text-xs text-white hover:bg-white hover:bg-opacity-20 px-2 py-1 rounded transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleMarkNotificationRead(notification.id)}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm" style={{ color: getThemeColor('text') }}>{notification.title}</h4>
                                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2">
                  <div className={`w-8 h-8 bg-gradient-to-br ${getCategoryColors(0)} rounded-full flex items-center justify-center`}>
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold" style={{ color: getThemeColor('text') }}>{adminData?.name || 'Admin'}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-white rounded-xl font-medium hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg"
                  style={{ backgroundColor: getThemeColor('primary') }}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme-Consistent Navigation Tabs */}
      <div className="shadow-lg border-b border-gray-100 sticky top-0 z-40" style={{ backgroundColor: getThemeColor('surface') }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-2 sm:space-x-4 scrollbar-hide">
            {['overview', 'users', 'artists', 'bookings', 'inquiries', 'analytics', 'settings'].map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`group relative px-6 py-4 font-medium text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 rounded-t-xl ${activeTab === tab
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
                style={{
                  backgroundColor: activeTab === tab ? undefined : 'transparent'
                }}
              >
                {activeTab === tab && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColors(index)} rounded-t-xl`}></div>
                )}
                <span className="relative flex items-center gap-2">
                  <span className="text-lg">
                    {tab === 'overview' && '📊'}
                    {tab === 'users' && '👥'}
                    {tab === 'artists' && '🎨'}
                    {tab === 'bookings' && '📅'}
                    {tab === 'inquiries' && '💬'}
                    {tab === 'analytics' && '📈'}
                    {tab === 'settings' && '⚙️'}
                  </span>
                  <span className="hidden sm:inline capitalize">{tab}</span>
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
          <div className="rounded-2xl shadow-lg border border-gray-100 p-8"
            style={{ backgroundColor: getThemeColor('surface') }}>
            <h3 className="text-2xl font-bold mb-4" style={{ color: getThemeColor('text') }}>
              Artist Management
            </h3>
            <p style={{ color: getThemeColor('secondary') }}>Artist management features coming soon...</p>
          </div>
        )}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'inquiries' && renderInquiries()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default AdminDashboard;
