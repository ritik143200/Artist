// Mock Admin API Server
// Run this server to provide demo data for Admin Dashboard
// Usage: node mock-server.js

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5175', 'http://localhost:3000', 'http://127.0.0.1:5175'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Mock data
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', createdAt: '2024-01-01' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active', createdAt: '2024-01-02' },
  { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', createdAt: '2024-01-03' },
  { id: 4, name: 'Robert Wilson', email: 'robert@example.com', role: 'user', status: 'inactive', createdAt: '2024-01-04' },
  { id: 5, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'user', status: 'active', createdAt: '2024-01-05' }
];

const mockArtists = [
  { id: 1, name: 'Elena Rodriguez', email: 'elena@example.com', specialty: 'Jazz Guitar', rating: 4.9, status: 'verified', createdAt: '2024-01-01' },
  { id: 2, name: 'Marcus Chen', email: 'marcus@example.com', specialty: 'Portrait Photography', rating: 4.8, status: 'verified', createdAt: '2024-01-02' },
  { id: 3, name: 'Aria Williams', email: 'aria@example.com', specialty: 'Abstract Art', rating: 5.0, status: 'verified', createdAt: '2024-01-03' },
  { id: 4, name: 'David Kim', email: 'david@example.com', specialty: 'Contemporary Dance', rating: 4.7, status: 'pending', createdAt: '2024-01-04' }
];

const mockBookings = [
  { id: 1, user: 'John Doe', artist: 'Elena Rodriguez', date: '2024-01-15', amount: 500, status: 'completed', createdAt: '2024-01-15' },
  { id: 2, user: 'Jane Smith', artist: 'Marcus Chen', date: '2024-01-16', amount: 350, status: 'pending', createdAt: '2024-01-16' },
  { id: 3, user: 'Robert Wilson', artist: 'Aria Williams', date: '2024-01-17', amount: 800, status: 'completed', createdAt: '2024-01-17' },
  { id: 4, user: 'Sarah Johnson', artist: 'David Kim', date: '2024-01-18', amount: 450, status: 'pending', createdAt: '2024-01-18' }
];

const mockInquiries = [
  { id: 1, user: 'John Doe', message: 'Looking for a photographer for wedding', date: '2024-01-15', status: 'pending', createdAt: '2024-01-15' },
  { id: 2, user: 'Jane Smith', message: 'Need a musician for birthday party', date: '2024-01-16', status: 'resolved', createdAt: '2024-01-16' },
  { id: 3, user: 'Robert Wilson', message: 'Portrait photography session needed', date: '2024-01-17', status: 'pending', createdAt: '2024-01-17' }
];

// Admin API Routes
app.get('/api/admin/users', (req, res) => {
  console.log('📊 Admin Users API called');
  res.json({
    success: true,
    data: mockUsers,
    message: 'Users retrieved successfully'
  });
});

app.get('/api/admin/artists', (req, res) => {
  console.log('🎨 Admin Artists API called');
  res.json({
    success: true,
    data: mockArtists,
    message: 'Artists retrieved successfully'
  });
});

app.get('/api/admin/bookings', (req, res) => {
  console.log('📅 Admin Bookings API called');
  res.json({
    success: true,
    data: mockBookings,
    message: 'Bookings retrieved successfully'
  });
});

app.get('/api/admin/inquiries', (req, res) => {
  console.log('💬 Admin Inquiries API called');
  res.json({
    success: true,
    data: mockInquiries,
    message: 'Inquiries retrieved successfully'
  });
});

app.get('/api/admin/analytics', (req, res) => {
  console.log('📈 Admin Analytics API called');
  res.json({
    success: true,
    data: {
      totalRevenue: 2500000,
      thisMonthRevenue: 450000,
      lastMonthRevenue: 380000,
      totalUsers: mockUsers.length,
      totalArtists: mockArtists.length,
      totalBookings: mockBookings.length,
      pendingInquiries: mockInquiries.filter(i => i.status === 'pending').length,
      activeUsers: mockUsers.filter(u => u.status === 'active').length,
      conversionRate: 15
    },
    message: 'Analytics retrieved successfully'
  });
});

// POST routes for data manipulation
app.post('/api/admin/users', (req, res) => {
  console.log('📝 Create/Update User API called');
  const newUser = req.body;
  newUser.id = mockUsers.length + 1;
  mockUsers.push(newUser);
  res.json({
    success: true,
    data: newUser,
    message: 'User created/updated successfully'
  });
});

app.post('/api/admin/artists', (req, res) => {
  console.log('🎨 Create/Update Artist API called');
  const newArtist = req.body;
  newArtist.id = mockArtists.length + 1;
  mockArtists.push(newArtist);
  res.json({
    success: true,
    data: newArtist,
    message: 'Artist created/updated successfully'
  });
});

app.post('/api/admin/bookings', (req, res) => {
  console.log('📅 Create/Update Booking API called');
  const newBooking = req.body;
  newBooking.id = mockBookings.length + 1;
  mockBookings.push(newBooking);
  res.json({
    success: true,
    data: newBooking,
    message: 'Booking created/updated successfully'
  });
});

app.post('/api/admin/inquiries', (req, res) => {
  console.log('💬 Create/Update Inquiry API called');
  const newInquiry = req.body;
  newInquiry.id = mockInquiries.length + 1;
  mockInquiries.push(newInquiry);
  res.json({
    success: true,
    data: newInquiry,
    message: 'Inquiry created/updated successfully'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Mock Admin API Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('❌ Route not found:', req.method, req.url);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
    availableRoutes: [
      'GET /api/admin/users',
      'GET /api/admin/artists', 
      'GET /api/admin/bookings',
      'GET /api/admin/inquiries',
      'GET /api/admin/analytics',
      'GET /api/health'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock Admin API Server running on port ${PORT}`);
  console.log('📊 Available endpoints:');
  console.log('   GET /api/admin/users - Get all users');
  console.log('   POST /api/admin/users - Create/update user');
  console.log('   GET /api/admin/artists - Get all artists');
  console.log('   POST /api/admin/artists - Create/update artist');
  console.log('   GET /api/admin/bookings - Get all bookings');
  console.log('   POST /api/admin/bookings - Create/update booking');
  console.log('   GET /api/admin/inquiries - Get all inquiries');
  console.log('   POST /api/admin/inquiries - Create/update inquiry');
  console.log('   GET /api/admin/analytics - Get analytics data');
  console.log('   GET /api/health - Health check');
  console.log('');
  console.log('🌐 Server is ready to handle Admin Dashboard requests!');
});
