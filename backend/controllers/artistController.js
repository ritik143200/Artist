const Artist = require('../models/Artist');
const Notification = require('../models/Notification');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'idProof') {
      cb(null, 'uploads/id-proofs/');
    } else {
      cb(null, 'uploads/portfolio/');
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images and videos
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'));
    }
  }
});

// Register new artist
const registerArtist = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      password,
      artistType,
      category,
      subcategory,
      experience,
      skills,
      bio,
      location,
      socialLinks,
      termsAccepted
    } = req.body;

    // Check if artist already exists
    const existingArtist = await Artist.findOne({ email });
    if (existingArtist) {
      return res.status(400).json({
        success: false,
        message: 'Artist with this email already exists'
      });
    }

    // Handle portfolio files
    let portfolioFiles = [];
    if (req.files && req.files.portfolio) {
      portfolioFiles = req.files.portfolio.map(file => `/uploads/portfolio/${file.filename}`);
    }

    // Handle ID proof
    let idProofFile = '';
    if (req.files && req.files.idProof) {
      idProofFile = `/uploads/id-proofs/${req.files.idProof[0].filename}`;
    }

    // Parse skills if it's a string
    let parsedSkills = skills;
    if (typeof skills === 'string') {
      parsedSkills = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    }

    // Parse social links if it's a string
    let parsedSocialLinks = socialLinks;
    if (typeof socialLinks === 'string') {
      parsedSocialLinks = JSON.parse(socialLinks);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new artist
    const newArtist = new Artist({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      password: hashedPassword,
      artistType,
      category,
      subcategory,
      experience,
      skills: parsedSkills,
      bio,
      location,
      portfolio: portfolioFiles,
      socialLinks: parsedSocialLinks,
      idProof: idProofFile,
      termsAccepted: termsAccepted === 'true'
    });

    await newArtist.save();

    try {
      await Notification.create({
        type: 'general',
        message: `New artist registration: ${newArtist.firstName} ${newArtist.lastName}`,
        relatedId: newArtist._id
      });
    } catch (err) {
      console.error('Failed to create notification for new artist:', err);
    }

    res.status(201).json({
      success: true,
      message: 'Artist registration successful! Your application is under review.',
      data: {
        id: newArtist._id,
        fullName: newArtist.fullName,
        email: newArtist.email,
        role: newArtist.role,
        verificationStatus: newArtist.verificationStatus
      }
    });

  } catch (error) {
    console.error('Artist registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: error.message
    });
  }
};

// Get all artists (for admin)
const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find({}).sort({ registrationDate: -1 });
    res.status(200).json({
      success: true,
      count: artists.length,
      data: artists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch artists',
      error: error.message
    });
  }
};

// Get artist by ID
const getArtistById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid artist ID'
      });
    }

    const artist = await Artist.findById(req.params.id);
    
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    // Increment profile views
    artist.profileViews += 1;
    await artist.save();

    res.status(200).json({
      success: true,
      data: artist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch artist',
      error: error.message
    });
  }
};

// Update artist profile
const updateArtist = async (req, res) => {
  try {
    const artistId = req.params.id;
    const updateData = req.body;

    const artist = await Artist.findByIdAndUpdate(
      artistId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Artist profile updated successfully',
      data: artist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update artist',
      error: error.message
    });
  }
};

// Delete artist (for admin)
const deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);
    
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Artist deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete artist',
      error: error.message
    });
  }
};

// Search artists
const searchArtists = async (req, res) => {
  try {
    const { 
      category, 
      location, 
      experience, 
      artistType,
      search,
      page = 1,
      limit = 10 
    } = req.query;

    // Build search query
    let query = { verificationStatus: 'verified', isActive: true };

    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (experience) query.experience = experience;
    if (artistType) query.artistType = artistType;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (page - 1) * limit;

    const artists = await Artist.find(query)
      .sort({ 'rating.average': -1, profileViews: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Artist.countDocuments(query);

    res.status(200).json({
      success: true,
      count: artists.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: artists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
};

module.exports = {
  registerArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
  searchArtists,
  upload
};
