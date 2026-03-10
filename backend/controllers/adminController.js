const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Get all bookings (Admin)
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'name email phone')
            .populate('artistId', 'firstName lastName profileImage')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching all bookings',
            error: error.message
        });
    }
};

// @desc    Update booking status (Admin)
// @route   PATCH /api/admin/bookings/:id/:action
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
    try {
        const { id, action } = req.params;

        let status;
        if (action === 'approve') status = 'adminApproved';
        else if (action === 'reject') status = 'rejected';
        else if (action === 'complete') status = 'completed';
        else return res.status(400).json({ success: false, message: 'Invalid action. Use: approve, reject, complete' });

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.status = status;
        await booking.save();

        // Return fully populated booking so frontend can update state directly
        const populated = await Booking.findById(id)
            .populate('userId', 'name email phone')
            .populate('artistId', 'firstName lastName profileImage');

        res.status(200).json({ success: true, data: populated });
    } catch (error) {
        console.error(`Error updating booking status:`, error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating booking',
            error: error.message
        });
    }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching users', error: error.message });
    }
};

// @desc    Update user status (Admin)
// @route   POST /api/admin/users/:id/:action
// @access  Private/Admin
const updateUserAction = async (req, res) => {
    try {
        const { id, action } = req.params;

        let status;
        if (action === 'block') status = 'blocked';
        else if (action === 'unblock') status = 'active';
        else if (action === 'suspend') status = 'suspended';
        else return res.status(400).json({ message: 'Invalid action' });

        const user = await User.findById(id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.status = status;
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        console.error(`Error updating user status:`, error);
        res.status(500).json({ success: false, message: 'Server error while updating user', error: error.message });
    }
};

// @desc    Delete user permanently (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ success: true, message: 'User deleted permanently' });
    } catch (error) {
        console.error(`Error deleting user:`, error);
        res.status(500).json({ success: false, message: 'Server error while deleting user', error: error.message });
    }
};

module.exports = {
    getAllBookings,
    updateBookingStatus,
    getAllUsers,
    updateUserAction,
    deleteUser
};
