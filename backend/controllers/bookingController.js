const Booking = require('../models/Booking');
const Artist = require('../models/Artist');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create a new booking/inquiry
// @route   POST /api/bookings
// @access  Public
exports.createBooking = async (req, res) => {
    try {
        const {
            artistId,
            name,
            email,
            phone,
            eventType,
            eventDate,
            budget,
            eventLocation,
            requirements,
            message
        } = req.body;

        // userId can come from the request body or from the authenticated session
        const userId = req.body.userId || (req.user && req.user._id);

        // Validate required fields
        if (!artistId || !userId || !name || !email || !phone || !eventType || !eventDate || budget === undefined || budget === null || budget === '' || !eventLocation) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        // Verify artist exists
        const artist = await Artist.findById(artistId);
        if (!artist) {
            return res.status(404).json({ success: false, message: 'Artist not found' });
        }

        // Create booking
        const booking = await Booking.create({
            artistId,
            userId,
            name,
            email,
            phone,
            eventType,
            eventDate,
            budget,
            eventLocation,
            requirements: requirements || [],
            message: message || '',
            status: 'pending'
        });

        // Trigger an admin notification
        try {
            await Notification.create({
                type: 'booking',
                message: `New booking request from ${name} for artist ${artist.firstName} ${artist.lastName}`,
                relatedId: booking._id
            });
        } catch (notifError) {
            console.error('Non-blocking error: Failed to create admin notification for booking', notifError);
        }

        res.status(201).json({
            success: true,
            message: 'Booking inquiry sent successfully',
            data: booking
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating booking',
            error: error.message
        });
    }
};

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my
// @access  Private (User/Artist)
exports.getUserBookings = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const bookings = await Booking.find({ userId: req.user._id })
            .populate('artistId', 'firstName lastName profileImage')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching bookings',
            error: error.message
        });
    }
};

// @desc    Get bookings for logged-in artist
// @route   GET /api/bookings/artist
// @access  Private/Artist
exports.getArtistBookings = async (req, res) => {
    try {
        // Only allow artists to access this route
        if (req.user.role !== 'artist') {
            return res.status(403).json({ success: false, message: 'Not authorized as an artist' });
        }

        // Only show bookings that have been approved by admin, or artists have already interacted with
        const bookings = await Booking.find({
            artistId: req.user._id,
            status: { $in: ['adminApproved', 'confirmed', 'completed', 'artistRejected'] }
        })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching artist bookings:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Update booking status by artist
// @route   PATCH /api/bookings/artist/:id/:action
// @access  Private/Artist
exports.updateArtistBooking = async (req, res) => {
    try {
        if (req.user.role !== 'artist') {
            return res.status(403).json({ success: false, message: 'Not authorized as an artist' });
        }

        const { id, action } = req.params;

        let status;
        if (action === 'accept') status = 'confirmed';
        else if (action === 'decline' || action === 'reject') status = 'artistRejected';
        else if (action === 'complete') status = 'completed';
        else return res.status(400).json({ success: false, message: 'Invalid action' });

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Verify booking belongs to this artist
        if (booking.artistId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to modify this booking' });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({ success: true, booking });
    } catch (error) {
        console.error(`Error updating artist booking:`, error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
