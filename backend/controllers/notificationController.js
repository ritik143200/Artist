const Notification = require('../models/Notification');

// @desc    Get all notifications (Admin)
// @route   GET /api/admin/notifications
// @access  Private/Admin
const getAdminNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find()
            .sort({ createdAt: -1 })
            .limit(50); // limit to most recent 50

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching notifications', error: error.message });
    }
};

// @desc    Mark specific notification as read
// @route   PATCH /api/admin/notifications/:id/read
// @access  Private/Admin
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({ success: true, notification });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ success: false, message: 'Server error while marking notification as read' });
    }
};

// @desc    Mark all unread notifications as read
// @route   PATCH /api/admin/notifications/read-all
// @access  Private/Admin
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ isRead: false }, { isRead: true });
        res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ success: false, message: 'Server error while marking all notifications as read' });
    }
};

module.exports = {
    getAdminNotifications,
    markAsRead,
    markAllAsRead
};
