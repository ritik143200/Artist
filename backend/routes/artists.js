const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');

// Get all artists with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, subcategory, search } = req.query;
    
    // Build query
    let query = { isActive: true };
    
    // Add category filter
    if (category) {
      query.category = category;
    }
    
    // Add subcategory filter
    if (subcategory) {
      query.$or = [
        { subcategory: subcategory },
        { skills: { $in: [subcategory] } }
      ];
    }
    
    // Add search filter
    if (search) {
      const searchTerms = search.toLowerCase().split(' ');
      const searchRegex = searchTerms.map(term => new RegExp(term, 'i'));
      
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { name: { $in: searchRegex } },
          { category: { $in: searchRegex } },
          { skills: { $in: searchRegex } },
          { bio: { $in: searchRegex } }
        ]
      });
    }
    
    // Fetch artists from MongoDB
    const artists = await Artist.find(query)
      .select('name category subcategory skills bio profileImage rating experience location verified isActive firstName lastName budget budgetMin budgetMax')
      .sort({ rating: -1, createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      count: artists.length,
      artists: artists
    });
    
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch artists',
      error: error.message
    });
  }
});

// Get artist by ID
router.get('/:id', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }
    
    res.json({
      success: true,
      artist: artist
    });
    
  } catch (error) {
    console.error('Error fetching artist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch artist',
      error: error.message
    });
  }
});

// Create new artist
router.post('/', async (req, res) => {
  try {
    const artistData = {
      ...req.body,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const artist = new Artist(artistData);
    await artist.save();
    
    res.status(201).json({
      success: true,
      message: 'Artist created successfully',
      artist: artist
    });
    
  } catch (error) {
    console.error('Error creating artist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create artist',
      error: error.message
    });
  }
});

// Update artist
router.put('/:id', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const artist = await Artist.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Artist updated successfully',
      artist: artist
    });
    
  } catch (error) {
    console.error('Error updating artist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update artist',
      error: error.message
    });
  }
});

// Delete artist
router.delete('/:id', async (req, res) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);
    
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Artist deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting artist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete artist',
      error: error.message
    });
  }
});

module.exports = router;
