const mongoose = require('mongoose');
const Artist = require('./models/Artist');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/artisthub', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Enhanced artist data with more realistic information
const categories = ['singers', 'dancers', 'musicians', 'photographers', 'videographers', 'makeup_artists', 'decorators', 'mehendi_artists'];
const subcategories = {
  singers: ['Classical', 'Bollywood', 'Sufi', 'Ghazal', 'Pop', 'Rock', 'Folk', 'Carnatic', 'Hindustani', 'Qawwali'],
  dancers: ['Classical', 'Bollywood', 'Hip-Hop', 'Contemporary', 'Folk', 'Bhangra', 'Garba', 'Kathak', 'Bharatanatyam', 'Odissi'],
  musicians: ['Guitarist', 'Pianist', 'Drummer', 'Flute', 'Violin', 'Tabla', 'Sitar', 'Saxophone', 'DJ', 'Music Producer'],
  photographers: ['Wedding', 'Portrait', 'Fashion', 'Product', 'Event', 'Wildlife', 'Street', 'Food', 'Architecture', 'Sports'],
  videographers: ['Wedding', 'Event', 'Commercial', 'Documentary', 'Music Video', 'Corporate', 'Travel', 'Cinematic', 'Drone', 'Short Film'],
  makeup_artists: ['Bridal', 'Fashion', 'Party', 'Special Effects', 'Character', 'Editorial', 'Theatrical', 'Airbrush', 'HD Makeup', 'Prosthetic'],
  decorators: ['Wedding', 'Event', 'Birthday', 'Corporate', 'Festival', 'Theme', 'Floral', 'Balloon', 'Lighting', 'Stage'],
  mehendi_artists: ['Traditional', 'Arabic', 'Bridal', 'Fusion', 'Modern', 'Rajasthani', 'Indo-Arabic', 'Moroccan', 'Pakistani', 'African']
};

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Indore', 'Ahmedabad', 'Chandigarh', 'Goa', 'Kochi', 'Bhopal'];
const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Rohit', 'Anjali', 'Vikram', 'Kavita', 'Arjun', 'Neha', 'Karan', 'Pooja', 'Aditya', 'Swati', 'Manish', 'Riya', 'Vivek', 'Meera', 'Suresh', 'Tina', 'Raj', 'Anita', 'Deepak', 'Pallavi', 'Ajay', 'Kavita', 'Rohit', 'Divya', 'Aakash', 'Sonia'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Agarwal', 'Jain', 'Singh', 'Kumar', 'Mishra', 'Pandey', 'Chopra', 'Malhotra', 'Bansal', 'Goel', 'Tandon', 'Chauhan', 'Reddy', 'Nair', 'Patel', 'Yadav', 'Mishra'];

// Predefined realistic artist profiles
const predefinedArtists = [
  {
    firstName: 'Manish',
    lastName: 'Sharma',
    email: 'manish.sharma@gmail.com',
    phone: '9876543210',
    dateOfBirth: new Date(1992, 5, 15),
    gender: 'male',
    password: 'artist123',
    artistType: 'solo',
    category: 'Dancers',
    subcategory: 'Bhangra',
    experience: '5-10',
    skills: ['Bhangra', 'Bollywood', 'Folk', 'Stage Performance', 'Choreography'],
    bio: 'Professional Bhangra dancer with over 8 years of experience. Specialized in Punjabi folk dance and Bollywood performances. Available for weddings, corporate events, and cultural shows.',
    location: 'Bangalore',
    budgetMin: 35000, // Starting from ₹35,000
    budgetMax: 60000, // Upto ₹60,000
    socialLinks: {
      instagram: 'https://instagram.com/manishbhangra',
      youtube: 'https://youtube.com/manishbhangra',
      facebook: 'https://facebook.com/manishsharma',
      website: 'https://manishsharma.com'
    },
    verificationStatus: 'verified',
    isActive: true,
    profileViews: 1250,
    trending: true,
    completedEvents: 150,
    responseTime: '2h',
    genre: 'Traditional',
    subOptions: ['Bhangra', 'Giddha', 'Ludi', 'Jhumar'],
    rating: { average: 4.7, count: 12 }
  },
  {
    firstName: 'Priya',
    lastName: 'Singh',
    email: 'priya.singh@gmail.com',
    phone: '9876543211',
    dateOfBirth: new Date(1994, 8, 22),
    gender: 'female',
    password: 'artist123',
    artistType: 'solo',
    category: 'Dancers',
    subcategory: 'Bharatanatyam',
    experience: '3-5',
    skills: ['Bharatanatyam', 'Classical', 'Carnatic', 'Temple Dance', 'Traditional'],
    bio: 'Trained Bharatanatyam dancer with 4 years of professional experience. Expert in classical dance forms and temple dance traditions. Perfect for cultural and religious events.',
    location: 'Mumbai',
    budgetMin: 25000, // Starting from ₹25,000
    budgetMax: 45000, // Upto ₹45,000
    socialLinks: {
      instagram: 'https://instagram.com/priyabharatnatyam',
      youtube: 'https://youtube.com/priyabharatnatyam',
      facebook: 'https://facebook.com/priyasingh',
      website: 'https://priyasingh.com'
    },
    verificationStatus: 'verified',
    isActive: true,
    profileViews: 890,
    completedEvents: 89,
    responseTime: '4h',
    genre: 'Classical',
    subOptions: ['Bharatanatyam', 'Mohiniyattam', 'Kuchipudi', 'Odissi'],
    rating: { average: 4.9, count: 8 }
  },
  {
    firstName: 'Rahul',
    lastName: 'Kumar',
    email: 'rahul.kumar@gmail.com',
    phone: '9876543212',
    dateOfBirth: new Date(1991, 3, 10),
    gender: 'male',
    password: 'artist123',
    artistType: 'solo',
    category: 'Dancers',
    subcategory: 'Hip-Hop',
    experience: '5-10',
    skills: ['Hip-Hop', 'Contemporary', 'Street Dance', 'Freestyle', 'Break Dance'],
    bio: 'Professional hip-hop dancer and choreographer with 7 years of experience. Specialized in street dance, freestyle, and contemporary fusion. Available for parties, concerts, and dance competitions.',
    location: 'Delhi',
    budgetMin: 20000, // Starting from ₹20,000
    budgetMax: 35000, // Upto ₹35,000
    socialLinks: {
      instagram: 'https://instagram.com/rahulhiphop',
      youtube: 'https://youtube.com/rahulhiphop',
      facebook: 'https://facebook.com/rahulkumar',
      website: 'https://rahulkumar.com'
    },
    verificationStatus: 'verified',
    isActive: true,
    profileViews: 2100,
    completedEvents: 200,
    responseTime: '1h',
    genre: 'Modern',
    subOptions: ['Hip-Hop', 'Break Dance', 'Popping', 'Locking', 'Krumping'],
    rating: { average: 4.6, count: 15 }
  },
  {
    firstName: 'Anjali',
    lastName: 'Verma',
    email: 'anjali.verma@gmail.com',
    phone: '9876543213',
    dateOfBirth: new Date(1993, 7, 18),
    gender: 'female',
    password: 'artist123',
    artistType: 'solo',
    category: 'Singers',
    subcategory: 'Bollywood',
    experience: '3-5',
    skills: ['Bollywood', 'Sufi', 'Classical', 'Live Performance', 'Studio Recording'],
    bio: 'Versatile Bollywood singer with expertise in Sufi and classical fusion. Performed at various concerts and corporate events. Available for live shows, recordings, and special performances.',
    location: 'Hyderabad',
    budget: 32000,
    socialLinks: {
      instagram: 'https://instagram/anjalisinger',
      youtube: 'https://youtube.com/anjalisinger',
      facebook: 'https://facebook.com/anjaliverma',
      website: 'https://anjaliverma.com'
    },
    verificationStatus: 'verified',
    isActive: true,
    profileViews: 1560,
    completedEvents: 120,
    responseTime: '3h',
    genre: 'Contemporary',
    subOptions: ['Bollywood', 'Sufi', 'Ghazal', 'Folk', 'Pop'],
    rating: { average: 4.8, count: 20 }
  },
  {
    firstName: 'Vikram',
    lastName: 'Gupta',
    email: 'vikram.gupta@gmail.com',
    phone: '9876543214',
    dateOfBirth: new Date(1990, 11, 5),
    gender: 'male',
    password: 'artist123',
    artistType: 'solo',
    category: 'Musicians',
    subcategory: 'Guitarist',
    experience: '10+',
    skills: ['Guitar', 'Classical Guitar', 'Electric Guitar', 'Music Composition', 'Live Performance'],
    bio: 'Professional guitarist with 12 years of experience in classical and electric guitar. Expert in various genres including rock, jazz, and classical. Available for concerts, studio sessions, and teaching.',
    location: 'Chennai',
    budget: 45000,
    socialLinks: {
      instagram: 'https://instagram.com/vikramguitar',
      youtube: 'https://youtube.com/vikramguitar',
      facebook: 'https://facebook.com/vikramgupta',
      website: 'https://vikramgupta.com'
    },
    verificationStatus: 'verified',
    isActive: true,
    profileViews: 3200,
    trending: true,
    completedEvents: 300,
    responseTime: '1h',
    genre: 'Contemporary',
    subOptions: ['Classical Guitar', 'Electric Guitar', 'Acoustic', 'Bass Guitar', 'Ukulele'],
    rating: { average: 4.9, count: 25 }
  },
  {
    firstName: 'Sneha',
    lastName: 'Patel',
    email: 'sneha.patel@gmail.com',
    phone: '9876543215',
    dateOfBirth: new Date(1995, 2, 14),
    gender: 'female',
    password: 'artist123',
    artistType: 'solo',
    category: 'Photographers',
    subcategory: 'Wedding',
    experience: '3-5',
    skills: ['Wedding Photography', 'Portrait', 'Candid Photography', 'Photo Editing', 'Album Design'],
    bio: 'Professional wedding photographer specializing in candid and traditional photography. Expert in capturing precious moments with artistic vision. Available for weddings, pre-wedding shoots, and events.',
    location: 'Jaipur',
    budget: 38000,
    socialLinks: {
      instagram: 'https://instagram.com/snehaphotography',
      youtube: 'https://youtube.com/snehaphotography',
      facebook: 'https://facebook.com/sneha.patel',
      website: 'https://sneha.patel.com'
    },
    verificationStatus: 'verified',
    isActive: true,
    profileViews: 1890,
    completedEvents: 95,
    responseTime: '2h',
    genre: 'Traditional',
    subOptions: ['Wedding', 'Pre-Wedding', 'Candid', 'Traditional', 'Destination'],
    rating: { average: 4.7, count: 18 }
  },
  {
    firstName: 'Amit',
    lastName: 'Jain',
    email: 'amit.jain@gmail.com',
    phone: '9876543216',
    dateOfBirth: new Date(1989, 6, 25),
    gender: 'male',
    password: 'artist123',
    artistType: 'solo',
    category: 'Videographers',
    subcategory: 'Wedding',
    experience: '5-10',
    skills: ['Wedding Videography', 'Cinematic', 'Video Editing', 'Drone Photography', 'Storytelling'],
    bio: 'Cinematic wedding videographer with 8 years of experience. Specialized in creating emotional wedding stories with drone footage and professional editing. Available for weddings and corporate events.',
    location: 'Pune',
    budget: 52000,
    socialLinks: {
      instagram: 'https://instagram.com/amitcinematic',
      youtube: 'https://youtube.com/amitcinematic',
      facebook: 'https://facebook.com/amitjain',
      website: 'https://amitjain.com'
    },
    verificationStatus: 'verified',
    isActive: true,
    profileViews: 2400,
    trending: true,
    completedEvents: 180,
    responseTime: '1h',
    genre: 'Cinematic',
    subOptions: ['Cinematic', 'Documentary', 'Drone', 'Traditional', 'Highlight Reel'],
    rating: { average: 4.8, count: 22 }
  },
  {
    firstName: 'Kavita',
    lastName: 'Reddy',
    email: 'kavita.reddy@gmail.com',
    phone: '9876543217',
    dateOfBirth: new Date(1992, 9, 8),
    gender: 'female',
    password: 'artist123',
    artistType: 'solo',
    category: 'Makeup Artists',
    subcategory: 'Bridal',
    experience: '5-10',
    skills: ['Bridal Makeup', 'HD Makeup', 'Airbrush', 'Party Makeup', 'Special Effects'],
    bio: 'Professional bridal makeup artist with 7 years of experience. Expert in HD makeup, airbrush techniques, and traditional bridal looks. Uses premium products for long-lasting results.',
    location: 'Bangalore',
    budget: 25000,
    socialLinks: {
      instagram: 'https://instagram.com/kavitamakeup',
      youtube: 'https://youtube.com/kavitamakeup',
      facebook: 'https://facebook.com/kavita.reddy',
      website: 'https://kavita.reddy.com'
    },
    verificationStatus: 'verified',
    isActive: true,
    profileViews: 3100,
    completedEvents: 220,
    responseTime: '2h',
    genre: 'Traditional',
    subOptions: ['Bridal', 'Engagement', 'Reception', 'Sangeet', 'Mehendi'],
    rating: { average: 4.9, count: 30 }
  },
  {
    firstName: 'Rohit',
    lastName: 'Agarwal',
    email: 'rohit.agarwal@gmail.com',
    phone: '9876543218',
    dateOfBirth: new Date(1991, 4, 30),
    gender: 'male',
    password: 'artist123',
    artistType: 'solo',
    category: 'Decorators',
    subcategory: 'Wedding',
    experience: '3-5',
    skills: ['Wedding Decoration', 'Floral Design', 'Lighting', 'Theme Decoration', 'Stage Setup'],
    bio: 'Creative wedding decorator with expertise in floral arrangements and theme-based decorations. Transform venues into dream spaces with innovative designs and lighting effects.',
    location: 'Delhi',
    budget: 65000,
    socialLinks: {
      instagram: 'https://instagram.com/rohitdecor',
      youtube: 'https://youtube.com/rohitdecor',
      facebook: 'https://facebook.com/rohit.agarwal',
      website: 'https://rohitagarwal.com'
    },
    verificationStatus: 'verified',
    isActive: true,
    profileViews: 1750,
    completedEvents: 110,
    responseTime: '3h',
    genre: 'Contemporary',
    subOptions: ['Floral', 'Theme', 'Lighting', 'Stage', 'Mandap'],
    rating: { average: 4.6, count: 16 }
  },
  {
    firstName: 'Divya',
    lastName: 'Mishra',
    email: 'divya.mishra@gmail.com',
    phone: '9876543219',
    dateOfBirth: new Date(1993, 10, 12),
    gender: 'female',
    password: 'artist123',
    artistType: 'solo',
    category: 'Mehendi Artists',
    subcategory: 'Bridal',
    experience: '5-10',
    skills: ['Bridal Mehendi', 'Arabic Mehendi', 'Traditional', 'Fusion', 'Modern'],
    bio: 'Professional mehendi artist specializing in bridal and Arabic designs. Expert in traditional and fusion mehendi art with natural henna. Creates intricate designs for weddings and festivals.',
    location: 'Lucknow',
    budget: 18000,
    socialLinks: {
      instagram: 'https://instagram.com/divyamehendi',
      youtube: 'https://youtube.com/divyamehendi',
      facebook: 'https://facebook.com/divya.mishra',
      website: 'https://divyamehendi.com'
    },
    verificationStatus: 'verified',
    isActive: true,
    profileViews: 1450,
    completedEvents: 160,
    responseTime: '2h',
    genre: 'Traditional',
    subOptions: ['Bridal', 'Arabic', 'Rajasthani', 'Indo-Arabic', 'Fusion'],
    rating: { average: 4.8, count: 14 }
  }
];

const generateRandomArtist = (index) => {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const categorySubcategories = subcategories[category] || ['General'];
  const subcategory = categorySubcategories[Math.floor(Math.random() * categorySubcategories.length)];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  
  return {
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}${lastName.toLowerCase()}${index}@gmail.com`,
    phone: `987654321${index.toString().padStart(2, '0')}`,
    dateOfBirth: new Date(1990 + Math.floor(Math.random() * 15), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    gender: ['male', 'female', 'other'][Math.floor(Math.random() * 3)],
    password: 'artist123',
    artistType: ['solo', 'group', 'duo', 'trio'][Math.floor(Math.random() * 4)],
    category: category.charAt(0).toUpperCase() + category.slice(1),
    subcategory,
    experience: ['0-1', '1-3', '3-5', '5-10', '10+'][Math.floor(Math.random() * 5)],
    skills: [subcategory, 'Professional', 'Experienced', 'Event Performance'],
    bio: `Professional ${subcategory} artist with over ${Math.floor(Math.random() * 10) + 1} years of experience. Specialized in ${subcategory} performances and events. Available for weddings, parties, and corporate events.`,
    location: city,
    budgetMin: Math.floor(Math.random() * 30000) + 10000, // Starting from ₹10,000 - ₹40,000
    budgetMax: Math.floor(Math.random() * 50000) + 40000, // Upto ₹40,000 - ₹90,000
    socialLinks: {
      instagram: `https://instagram.com/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      youtube: `https://youtube.com/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      facebook: `https://facebook.com/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      website: `https://${firstName.toLowerCase()}${lastName.toLowerCase()}.com`
    },
    verificationStatus: ['pending', 'verified'][Math.floor(Math.random() * 2)],
    isActive: true,
    profileViews: Math.floor(Math.random() * 3000) + 500,
    trending: Math.random() > 0.7,
    completedEvents: Math.floor(Math.random() * 200) + 50,
    responseTime: ['1h', '2h', '3h', '4h', '24h'][Math.floor(Math.random() * 5)],
    genre: ['Traditional', 'Modern', 'Contemporary', 'Classical', 'Fusion'][Math.floor(Math.random() * 5)],
    subOptions: Array.from({length: Math.floor(Math.random() * 4) + 2}, () => 
      categorySubcategories[Math.floor(Math.random() * categorySubcategories.length)]
    ),
    rating: {
      average: parseFloat((Math.random() * 2 + 3).toFixed(1)),
      count: Math.floor(Math.random() * 40) + 5
    }
  };
};

// Seed function
const seedArtists = async () => {
  try {
    console.log('🌱 Starting to seed artists...');
    
    // Clear existing artists
    const existingCount = await Artist.countDocuments();
    console.log(`📊 Existing artists: ${existingCount}`);
    
    if (existingCount > 0) {
      console.log('🗑️  Clearing existing artists...');
      await Artist.deleteMany({});
      console.log('✅ Cleared all existing artists');
    }
    
    // Combine predefined and random artists
    const allArtists = [...predefinedArtists];
    
    // Generate additional random artists
    for (let i = 1; i <= 20; i++) {
      allArtists.push(generateRandomArtist(i + predefinedArtists.length));
    }
    
    console.log(`📝 Generated ${allArtists.length} artists (${predefinedArtists.length} predefined + 20 random)`);
    
    // Insert into database
    const insertedArtists = await Artist.insertMany(allArtists);
    
    console.log(`✅ Successfully seeded ${insertedArtists.length} artists!`);
    console.log('🎨 Sample artists:');
    
    // Display sample data
    insertedArtists.slice(0, 5).forEach((artist, index) => {
      const budgetDisplay = artist.budgetMin && artist.budgetMax 
        ? `₹${artist.budgetMin.toLocaleString()} - ₹${artist.budgetMax.toLocaleString()}`
        : artist.budget 
          ? `₹${artist.budget.toLocaleString()}`
          : '₹0';
      
      console.log(`\n${index + 1}. ${artist.fullName} - ${artist.category} (${artist.subcategory})`);
      console.log(`   📍 ${artist.location} | 💰 ${budgetDisplay} | ⭐ ${artist.rating.average}`);
      console.log(`   🎭 ${artist.genre} | 🎨 ${artist.subOptions?.slice(0, 3).join(', ')}`);
      console.log(`   📊 Budget Min: ${artist.budgetMin}, Max: ${artist.budgetMax}`);
    });
    
    // Display statistics
    const stats = {
      total: insertedArtists.length,
      verified: insertedArtists.filter(a => a.verificationStatus === 'verified').length,
      trending: insertedArtists.filter(a => a.trending).length,
      categories: {}
    };
    
    insertedArtists.forEach(artist => {
      stats.categories[artist.category] = (stats.categories[artist.category] || 0) + 1;
    });
    
    console.log('\n📊 Seeding Statistics:');
    console.log(`   Total Artists: ${stats.total}`);
    console.log(`   Verified: ${stats.verified}`);
    console.log(`   Trending: ${stats.trending}`);
    console.log('   By Category:');
    Object.entries(stats.categories).forEach(([cat, count]) => {
      console.log(`     ${cat}: ${count}`);
    });
    
    console.log('\n🚀 Seeding completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding artists:', error);
    process.exit(1);
  }
};

// Run the seed
seedArtists();
