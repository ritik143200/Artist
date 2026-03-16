const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('Cloudinary configured with individual credentials');
} else if (process.env.CLOUDINARY_URL) {
  // Fallback to URL if individual keys are missing
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL
  });
  console.log('Cloudinary configured with URL');
} else {
  console.warn('No Cloudinary credentials found in environment');
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    console.log('Multer processing file:', file.fieldname, file.originalname);
    let folder = 'artisthub/portfolio';
    let resource_type = 'image'; // Default to image

    if (file.fieldname === 'profileImage') {
      folder = 'artisthub/profiles';
    } else if (file.fieldname === 'idProof') {
      folder = 'artisthub/id_proofs';
    } else if (file.fieldname === 'portfolio') {
       // Check if video or image
       if (file.mimetype.startsWith('video')) {
         resource_type = 'video';
       }
    }

    console.log('Saving to Cloudinary folder:', folder, 'Resource type:', resource_type);

    return {
      folder: folder,
      resource_type: resource_type,
      public_id: file.fieldname + '-' + Date.now(),
    };
  },
});

const upload = multer({ storage: storage });

module.exports = {
  cloudinary,
  storage,
  upload
};
