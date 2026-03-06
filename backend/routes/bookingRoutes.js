const express = require('express');
const router = express.Router();

const {
    createBooking,
    getUserBookings,
    getArtistBookings,
    updateArtistBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// Route for fetching user bookings
router.get('/my', protect, getUserBookings);

// Routes for fetching and updating artist bookings
router.get('/artist', protect, getArtistBookings);
router.patch('/artist/:id/:action', protect, updateArtistBooking);

// Route for creating a booking
router.post('/', createBooking);

module.exports = router;
