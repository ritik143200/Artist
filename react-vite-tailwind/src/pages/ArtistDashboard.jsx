import React, { useState, useEffect } from 'react';
import { useRouter } from '../contexts/RouterContext';

const ArtistDashboard = ({ config }) => {
  const { navigate } = useRouter();
  const [artistData, setArtistData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [earnings, setEarnings] = useState({
    total: 0,
    thisMonth: 0,
    pending: 0
  });

  useEffect(() => {
    // Load artist data from localStorage
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setArtistData(JSON.parse(storedUser));
    }

    // Load mock data
    setBookings([
      {
        id: 1,
        clientName: 'Rahul Sharma',
        eventDate: '2024-03-15',
        status: 'confirmed',
        amount: 25000,
        event: 'Wedding Reception',
        location: 'Delhi'
      },
      {
        id: 2,
        clientName: 'Priya Patel',
        eventDate: '2024-04-20',
        status: 'pending',
        amount: 15000,
        event: 'Birthday Party',
        location: 'Mumbai'
      },
      {
        id: 3,
        clientName: 'Amit Kumar',
        eventDate: '2024-02-28',
        status: 'completed',
        amount: 20000,
        event: 'Corporate Event',
        location: 'Bangalore'
      }
    ]);

    setPortfolio([
      { id: 1, title: 'Wedding Performance', type: 'video', thumbnail: '🎵', date: '2024-01-15' },
      { id: 2, title: 'Concert Highlights', type: 'image', thumbnail: '🎸', date: '2024-02-10' },
      { id: 3, title: 'Studio Session', type: 'video', thumbnail: '🎤', date: '2024-03-01' }
    ]);

    setEarnings({
      total: 125000,
      thisMonth: 35000,
      pending: 40000
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('home');
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-800">₹{earnings.total.toLocaleString()}</span>
        </div>
        <h3 className="text-gray-600 text-sm font-medium">Total Earnings</h3>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-800">₹{earnings.thisMonth.toLocaleString()}</span>
        </div>
        <h3 className="text-gray-600 text-sm font-medium">This Month</h3>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-800">{bookings.length}</span>
        </div>
        <h3 className="text-gray-600 text-sm font-medium">Total Bookings</h3>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-800">₹{earnings.pending.toLocaleString()}</span>
        </div>
        <h3 className="text-gray-600 text-sm font-medium">Pending</h3>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-800">Recent Bookings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.clientName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{booking.event}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{booking.eventDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{booking.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">₹{booking.amount.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-brand-600 hover:text-brand-900 mr-3">View</button>
                  {booking.status === 'pending' && (
                    <button className="text-green-600 hover:text-green-900">Accept</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {portfolio.map((item) => (
        <div key={item.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
          <div className="h-48 bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center relative">
            <span className="text-6xl">{item.thumbnail}</span>
            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{item.date}</p>
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.type === 'video'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
                }`}>
                {item.type}
              </span>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-600 hover:text-brand-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-600 hover:text-brand-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <p className="text-gray-600 font-medium">Add New Item</p>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Upload Portfolio</h3>
          <p className="text-gray-600 text-sm mb-4">Add your latest performance</p>
          <button className="w-full px-4 py-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors font-medium">
            Upload Now
          </button>
        </div>
      </div>
    </div>
  );

  const renderEarnings = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Earnings Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800 mb-2">₹{earnings.total.toLocaleString()}</div>
          <p className="text-gray-600 text-sm">Total Earnings</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800 mb-2">₹{earnings.thisMonth.toLocaleString()}</div>
          <p className="text-gray-600 text-sm">This Month</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800 mb-2">₹{earnings.pending.toLocaleString()}</div>
          <p className="text-gray-600 text-sm">Pending</p>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-medium text-gray-800 mb-4">Recent Transactions</h4>
        <div className="space-y-3">
          {bookings.slice(0, 5).map((booking) => (
            <div key={booking.id} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
              <div>
                <div className="font-medium text-gray-800">{booking.clientName}</div>
                <div className="text-sm text-gray-600">{booking.event}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-800">₹{booking.amount.toLocaleString()}</div>
                <div className="text-sm text-gray-600">{booking.eventDate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-full pt-20 lg:pt-24" style={{ backgroundColor: config.background_color }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Artist Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {artistData?.name || 'Artist'}!</p>
                <p className="text-xs text-brand-500 mt-1">Indori Artist Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
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
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['overview', 'bookings', 'portfolio', 'profile', 'settings'].map((tab) => (
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'portfolio' && renderPortfolio()}
        {activeTab === 'earnings' && renderEarnings()}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Artist Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Artist Name</label>
                <input
                  type="text"
                  defaultValue={artistData?.name || ''}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all">
                  <option>Singer</option>
                  <option>Dancer</option>
                  <option>Band</option>
                  <option>DJ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all">
                  <option>0-1 years</option>
                  <option>1-3 years</option>
                  <option>3-5 years</option>
                  <option>5+ years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  defaultValue="Delhi, India"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  rows={4}
                  defaultValue="Professional artist with extensive experience in live performances and events."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
                />
              </div>
            </div>
            <button className="mt-6 px-6 py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors font-medium">
              Save Changes
            </button>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Account Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <h4 className="text-lg font-medium text-gray-800">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive email updates about new bookings</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand-500 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <h4 className="text-lg font-medium text-gray-800">Profile Visibility</h4>
                  <p className="text-sm text-gray-600">Make your profile visible to potential clients</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand-500 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>
              <div className="pt-4">
                <button className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistDashboard;
