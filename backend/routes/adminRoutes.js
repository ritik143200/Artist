const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const {
    getAllBookings, updateBookingStatus,
    getAllUsers, updateUserAction, deleteUser
} = require('../controllers/adminController');
const {
    getAdminNotifications, markAsRead, markAllAsRead
} = require('../controllers/notificationController');

// Ensure only admins can access these routes
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

// Apply auth & admin checks to all routes
router.use(protect);
router.use(adminOnly);

// Route for fetching all bookings
router.get('/bookings', getAllBookings);

// Route for updating booking status
router.post('/bookings/:id/:action', updateBookingStatus);

// Users Routing
router.get('/users', getAllUsers);
router.post('/users/:id/:action', updateUserAction);
router.delete('/users/:id', deleteUser);

// Notifications Routing
router.get('/notifications', getAdminNotifications);
router.patch('/notifications/read-all', markAllAsRead);
router.patch('/notifications/:id/read', markAsRead);

module.exports = router;
