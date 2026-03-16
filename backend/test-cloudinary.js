require('dotenv').config();
const cloudinary = require('cloudinary').v2;

console.log('Testing Cloudinary configuration...');
console.log('CLOUDINARY_URL present:', !!process.env.CLOUDINARY_URL);

if (!process.env.CLOUDINARY_URL) {
  console.error('ERROR: CLOUDINARY_URL is missing in .env');
  process.exit(1);
}

// Cloudinary picks up the URL automatically, but let's check if it can ping
cloudinary.api.ping((error, result) => {
  if (error) {
    console.error('Cloudinary Ping FAILED:', error);
  } else {
    console.log('Cloudinary Ping SUCCESS:', result);
  }
  process.exit(error ? 1 : 0);
});
