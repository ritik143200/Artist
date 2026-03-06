const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    eventType: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    eventLocation: {
        type: String,
        required: true,
        trim: true
    },
    requirements: [{
        type: String
    }],
    message: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'adminApproved', 'confirmed', 'rejected', 'artistRejected', 'completed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
