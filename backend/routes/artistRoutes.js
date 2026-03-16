const express = require('express');
const router = express.Router();
const {
  registerArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
  searchArtists,
  uploadProfilePicture,
  upload
} = require('../controllers/artistController');

console.log('Upload middleware in artistRoutes:', typeof upload);

// Configure file upload middleware
const uploadMiddleware = upload.fields([
  { name: 'portfolio', maxCount: 10 },
  { name: 'idProof', maxCount: 1 }
]);

const profileUpload = upload.single('profileImage');

// Public routes
router.post('/register', uploadMiddleware, registerArtist);
router.get('/search', searchArtists);
router.get('/:id', getArtistById);

// Protected routes (add authentication middleware later)
router.get('/', getAllArtists);
router.put('/:id', updateArtist);
router.post('/:id/upload-profile-picture', profileUpload, uploadProfilePicture);
router.delete('/:id', deleteArtist);

module.exports = router;
