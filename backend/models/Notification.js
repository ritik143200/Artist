const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['booking', 'user', 'inquiry', 'general'],
        required: true,
        default: 'general'
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        // Optional reference depending on type
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
