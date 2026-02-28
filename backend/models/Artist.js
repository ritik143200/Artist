const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['artist'],
    default: 'artist'
  },

  // Professional Information
  artistType: {
    type: String,
    enum: ['solo', 'group', 'duo', 'trio'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    default: ''
  },
  experience: {
    type: String,
    enum: ['0-1', '1-3', '3-5', '5-10', '10+'],
    required: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  bio: {
    type: String,
    required: true,
    maxlength: 1000
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  budget: {
    type: Number,
    required: false,
    default: 0
  },
  budgetMin: {
    type: Number,
    required: false,
    default: 0
  },
  budgetMax: {
    type: Number,
    required: false,
    default: 0
  },

  // Portfolio & Social
  profileImage: {
    type: String,
    default: '/api/placeholder/artist-avatar.jpg'
  },
  portfolio: [{
    type: String, // File URLs
    trim: true
  }],
  socialLinks: {
    instagram: {
      type: String,
      default: ''
    },
    youtube: {
      type: String,
      default: ''
    },
    facebook: {
      type: String,
      default: ''
    },
    website: {
      type: String,
      default: ''
    }
  },

  // Verification
  idProof: {
    type: String, // File URL
    required: false, // Made optional
    default: ''
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },

  // System Fields
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profileViews: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

// Index for better search performance
artistSchema.index({ email: 1 });
artistSchema.index({ category: 1 });
artistSchema.index({ location: 1 });
artistSchema.index({ verificationStatus: 1 });

// Virtual for full name
artistSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON output
artistSchema.set('toJSON', { virtuals: true });
artistSchema.set('toObject', { virtuals: true });

// Pre-save middleware to update lastUpdated
artistSchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Artist', artistSchema);
