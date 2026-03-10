import React, { useState, useEffect } from 'react';
import { useRouter } from '../contexts/RouterContext';

const UserDashboard = ({ config }) => {
  const { navigate } = useRouter();
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastStatusUpdate, setLastStatusUpdate] = useState(null);
  const [bookingFilter, setBookingFilter] = useState('all');

  // Change Password state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          console.log('❌ No token found - user not logged in');
          // Try to get user data to check login status
          const userData = localStorage.getItem('userData');
          if (userData) {
            console.log('📝 User data found but no token - authentication issue');
          }
          return;
        }

        // Try multiple possible API base URLs
        const possibleUrls = [
          import.meta.env.VITE_API_BASE_URL,
          'http://localhost:5001',
          'http://127.0.0.1:5001',
          'http://localhost:5000',
          'http://127.0.0.1:5000'
        ].filter(Boolean);

        let bookingData = null;
        let workingUrl = null;

        for (const baseUrl of possibleUrls) {
          try {
            const endpoint = `${baseUrl}/api/bookings/my`;
            console.log(`� Trying URL: ${endpoint}`);

            // Test health first
            const healthCheck = await fetch(`${baseUrl}/api/health`, {
              method: 'GET',
              headers: { 'Accept': 'application/json' }
            });

            if (healthCheck.ok) {
              console.log(`✅ Health check passed for ${baseUrl}`);

              // Now try bookings endpoint
              const res = await fetch(endpoint, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
              });

              console.log(`📡 Response from ${baseUrl}:`, res.status);

              if (res.ok) {
                const data = await res.json();
                if (data.success) {
                  bookingData = data.data;
                  workingUrl = baseUrl;
                  console.log(`✅ Success with ${baseUrl}:`, data.data.length, 'bookings');
                  break;
                }
              } else {
                const errorText = await res.text();
                console.error(`❌ Error from ${baseUrl}:`, {
                  status: res.status,
                  body: errorText
                });
              }
            }
          } catch (error) {
            console.error(`❌ Failed with ${baseUrl}:`, error.message);
          }
        }

        if (bookingData !== null) {
          setBookings(bookingData);
          console.log(`✅ Bookings loaded from ${workingUrl}:`, bookingData.length);
        } else {
          console.error('❌ All URLs failed - backend may be down or wrong configuration');
        }

      } catch (error) {
        console.error("❌ Critical error in fetchBookings:", error);
      }
    };

    fetchBookings();

    // Listen for booking status updates from Admin Panel
    const handleBookingStatusUpdate = (event) => {
      const { bookingId, newStatus, timestamp } = event.detail;

      // Update local booking state with new status
      setBookings(prev => prev.map(booking =>
        (booking._id === bookingId || booking.id === bookingId)
          ? { ...booking, status: newStatus }
          : booking
      ));

      const statusStyle = getStatusStyle(newStatus);
      setLastStatusUpdate({
        bookingId,
        newStatus: statusStyle.label,
        timestamp: new Date(timestamp).toLocaleString()
      });

      // Clear the status update message after 5 seconds
      setTimeout(() => setLastStatusUpdate(null), 5000);
    };

    // Add event listener for booking updates
    window.addEventListener('bookingStatusUpdated', handleBookingStatusUpdate);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('bookingStatusUpdated', handleBookingStatusUpdate);
    };

    setFavoriteArtists([
      { id: 1, name: 'Melody Band', category: 'Bands', rating: 4.8, image: '🎸' },
      { id: 2, name: 'DJ Storm', category: 'DJs', rating: 4.9, image: '🎧' },
      { id: 3, name: 'Sara Singh', category: 'Singers', rating: 4.7, image: '🎤' }
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('home');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      const token = localStorage.getItem('userToken');
      const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001').replace(/\/$/, '');
      const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordSuccess('Password successfully updated!');
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setPasswordSuccess('');
        }, 2000);
      } else {
        setPasswordError(data.message || 'Failed to update password');
      }
    } catch (error) {
      setPasswordError('Network error. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Helper function to get status styling (consistent with Admin Panel)
  const getStatusStyle = (status) => {
    if (status === 'adminApproved') return { bg: 'bg-purple-100', text: 'text-purple-800', label: '✓ Approved' };
    if (status === 'rejected') return { bg: 'bg-red-100', text: 'text-red-800', label: '✗ Rejected' };
    if (status === 'confirmed') return { bg: 'bg-green-100', text: 'text-green-800', label: '✓ Confirmed' };
    if (status === 'completed') return { bg: 'bg-blue-100', text: 'text-blue-800', label: '✓ Completed' };
    if (status === 'artistRejected') return { bg: 'bg-red-100', text: 'text-red-800', label: '✗ Artist Declined' };
    return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⏳ Pending' };
  };

  // Helper function to get inquiry progress
  const getInquiryProgress = (booking) => {
    const steps = [
      { key: 'pending', label: 'Inquiry Submitted', completed: booking.status === 'pending' },
      { key: 'adminApproved', label: 'Admin Approved', completed: booking.status === 'adminApproved' },
      { key: 'confirmed', label: 'Artist Confirmed', completed: booking.status === 'confirmed' },
      { key: 'completed', label: 'Event Completed', completed: booking.status === 'completed' }
    ];

    const currentStepIndex = steps.findIndex(step => step.completed);
    const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

    return { steps, currentStepIndex, progressPercentage };
  };

  // Helper function to filter bookings based on status
  const getFilteredBookings = () => {
    if (bookingFilter === 'all') {
      return bookings;
    }

    const statusMap = {
      'pending': 'pending',
      'approved': 'adminApproved',
      'confirmed': 'confirmed',
      'completed': 'completed',
      'rejected': 'rejected',
      'artistRejected': 'artistRejected'
    };

    const targetStatus = statusMap[bookingFilter];
    return bookings.filter(booking => booking.status === targetStatus);
  };

  const renderUser = () => (
    <div className="space-y-6">
      {/* User Profile Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">User Profile</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Picture */}
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {userData?.profileImage ? (
                <img
                  src={userData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-4xl text-gray-400">
                  {userData?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <button className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
              Change Photo
            </button>
          </div>

          {/* User Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={userData?.name || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={userData?.email || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={userData?.phone || 'Not provided'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={userData?.location || 'Not provided'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-800">1</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Account Age</h3>
          <p className="text-gray-500 text-xs mt-1">Member since 2024</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-800">{favoriteArtists.length}</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Favorite Artists</h3>
          <p className="text-gray-500 text-xs mt-1">Artists you love</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-800">{bookings.filter(b => b.status === 'completed').length}</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Completed Events</h3>
          <p className="text-gray-500 text-xs mt-1">Successfully attended</p>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Account Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Change Password</h4>
                <p className="text-sm text-gray-500">Update your account password</p>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
            >
              Update
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Notifications</h4>
                <p className="text-sm text-gray-500">Manage email and push notifications</p>
              </div>
            </div>
            <button className="px-4 py-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
              Configure
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Privacy Settings</h4>
                <p className="text-sm text-gray-500">Control your data and privacy preferences</p>
              </div>
            </div>
            <button className="px-4 py-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-800">{bookings.length}</span>
        </div>
        <h3 className="text-gray-600 text-sm font-medium">Total Bookings</h3>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-800">{bookings.filter(b => b.status === 'completed').length}</span>
        </div>
        <h3 className="text-gray-600 text-sm font-medium">Completed Events</h3>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-800">{bookings.filter(b => ['pending', 'adminApproved', 'confirmed'].includes(b.status)).length}</span>
        </div>
        <h3 className="text-gray-600 text-sm font-medium">Upcoming Events</h3>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-800">{favoriteArtists.length}</span>
        </div>
        <h3 className="text-gray-600 text-sm font-medium">Favorite Artists</h3>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-xl font-bold text-gray-800">My Bookings</h3>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Filter:</label>
            <select
              value={bookingFilter}
              onChange={(e) => setBookingFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
            >
              <option value="all">All Bookings</option>
              <option value="pending">⏳ Pending</option>
              <option value="approved">✓ Approved</option>
              <option value="confirmed">✓ Confirmed</option>
              <option value="completed">✓ Completed</option>
              <option value="rejected">✗ Rejected</option>
              <option value="artistRejected">✗ Artist Declined</option>
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        {bookingFilter !== 'all' && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Showing <span className="font-semibold text-brand-600">{getFilteredBookings().length}</span> {bookingFilter} bookings
            </span>
            <button
              onClick={() => setBookingFilter('all')}
              className="text-xs text-brand-600 hover:text-brand-700 font-medium"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {getFilteredBookings().length > 0 ? getFilteredBookings().map((booking, index) => {
              const progress = getInquiryProgress(booking);
              return (
                <tr key={booking._id || booking.id || `booking-${index}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {booking.artistId?.profileImage && (
                        <img
                          src={booking.artistId.profileImage}
                          alt="Artist"
                          className="w-8 h-8 rounded-full border border-gray-200 mr-3"
                        />
                      )}
                      <div className="text-sm font-medium text-gray-900">
                        {booking.artistId ? `${booking.artistId.firstName} ${booking.artistId.lastName}` : 'Unknown Artist'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{booking.eventType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{new Date(booking.eventDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{booking.budget?.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(booking.status).bg} ${getStatusStyle(booking.status).text}`}>
                      {getStatusStyle(booking.status).label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Visual Progress Indicator */}
                    <div className="w-32">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600">Progress</span>
                        <span className="text-xs font-bold text-brand-600">{progress.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-brand-400 to-brand-600"
                          style={{ width: `${progress.progressPercentage}%` }}
                        />
                      </div>
                      <div className="mt-2 space-y-1">
                        {progress.steps.map((step, stepIndex) => (
                          <div key={step.key} className="flex items-center text-xs">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 ${step.completed
                                ? 'bg-brand-500 text-white'
                                : stepIndex === progress.currentStepIndex
                                  ? 'bg-brand-300 text-white animate-pulse'
                                  : 'bg-gray-300 text-gray-600'
                              }`}>
                              {step.completed ? (
                                <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-8-8a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 00-1.414 1.414l2-2a1 1 0 001.414 1.414z" clipRule="evenodd" />
                                </svg>
                              ) : stepIndex === progress.currentStepIndex ? (
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              ) : (
                                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                              )}
                            </div>
                            <span className={`${step.completed
                                ? 'text-gray-900 font-medium'
                                : stepIndex === progress.currentStepIndex
                                  ? 'text-brand-600 font-medium'
                                  : 'text-gray-500'
                              }`}>
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                  {bookingFilter === 'all'
                    ? 'No bookings found. Discover artists to make your first booking!'
                    : `No ${bookingFilter} bookings found. Try selecting a different filter.`
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favoriteArtists.map((artist) => (
        <div key={artist.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
          <div className="h-48 bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
            <span className="text-6xl">{artist.image}</span>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{artist.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{artist.category}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm text-gray-600">{artist.rating}</span>
              </div>
              <button className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm font-medium">
                Book Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-full pt-20 lg:pt-24" style={{ backgroundColor: config.background_color }}>
      {/* Status Update Notification */}
      {lastStatusUpdate && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[300px]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Booking Status Updated</p>
                <p className="text-xs text-gray-600 mt-1">
                  Status changed to <span className="font-medium text-green-600">{lastStatusUpdate.newStatus}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{lastStatusUpdate.timestamp}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">User Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {userData?.name || 'User'}!</p>
                <p className="text-xs text-brand-500 mt-1">Indori Artist Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4 4m4-4H3m2 4h6M5 12H3m2 4h6m6 4h6m2 4h6a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex space-x-8 px-6">
            {['overview', 'bookings', 'favorites', 'user'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'favorites' && renderFavorites()}
        {activeTab === 'user' && renderUser()}
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Change Password</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordError('');
                  setPasswordSuccess('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="p-6">
              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
                  {passwordSuccess}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                    placeholder="Enter new password (min 6 chars)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors font-medium disabled:opacity-50 flex items-center"
                >
                  {isChangingPassword ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                      Updating...
                    </>
                  ) : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
