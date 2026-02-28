import React, { useState } from 'react';
import { useRouter } from '../contexts/RouterContext';

const ArtistRegistrationPage = ({ config }) => {
  const { navigate } = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Category Selection
    artistType: '',
    category: '',
    subcategory: '',
    
    // Step 3: Professional Information
    experience: '',
    skills: [],
    bio: '',
    location: '',
    budgetMin: '',
    budgetMax: '',
    
    // Step 4: Portfolio & Verification
    portfolio: [],
    socialLinks: {
      instagram: '',
      youtube: '',
      facebook: '',
      website: ''
    },
    idProof: null,
    termsAccepted: false
  });

  const [showSubcategories, setShowSubcategories] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [selectedCategoryData, setSelectedCategoryData] = useState(null);

  const allCategoriesData = {
    singers: {
      name: 'Singers',
      icon: '🎤',
      subcategories: {
        western: { name: 'Western', icon: '🎸', items: ['Jazz', 'Blues', 'Opera', 'Pop', 'Country', 'Gospel'] },
        bollywood: { name: 'Bollywood', icon: '🎬', items: ['Playback', 'Cover', 'Mashup'] },
        folk: { name: 'Folk', icon: '🪘', items: ['Rajasthani', 'Punjabi', 'Bhojpuri', 'Malwi', 'Lavani', 'Baul', 'Tribal'] },
        devotional: { name: 'Devotional', icon: '🙏', items: ['Bhajan', 'Kirtan', 'Gurbani', 'Aarti'] },
        modern: { name: 'Modern', icon: '🎧', items: ['Indie', 'Rap', 'Hip-Hop', 'EDM Vocalists'] },
        classical: { name: 'Classical', icon: '🎵', items: ['Hindustani', 'Carnatic', 'Ghazal', 'Sufi', 'Qawwali'] }
      }
    },
    anchors: {
      name: 'Anchors',
      icon: '🎤',
      subcategories: {
        wedding: { name: 'Wedding Anchors', icon: '💒', items: ['Wedding Anchors', 'Event Anchors', 'Ceremony Anchors'] },
        corporate: { name: 'Corporate Anchors', icon: '🏢', items: ['Corporate Anchors', 'Business Anchors', 'Conference Anchors'] },
        government: { name: 'Government Event Anchors', icon: '🏛️', items: ['Government Anchors', 'Official Event Anchors', 'Public Service Anchors'] },
        festival: { name: 'Festival / Public Anchors', icon: '🎉', items: ['Festival Anchors', 'Public Event Anchors', 'Community Anchors'] }
      }
    },
    bands: {
      name: 'Bands',
      icon: '🎸',
      subcategories: {
        classical: { name: 'Classical', icon: '🎵', items: ['Hindustani', 'Carnatic', 'Ghazal', 'Sufi', 'Qawwali'] },
        devotional: { name: 'Devotional', icon: '🙏', items: ['Bhajan', 'Kirtan', 'Gurbani', 'Aarti'] },
        bollywood: { name: 'Bollywood Bands', icon: '🎬', items: ['Bollywood Bands', 'Film Bands', 'Music Bands'] },
        folk: { name: 'Folk Bands', icon: '🪘', items: ['Folk Bands', 'Traditional Bands', 'Cultural Bands'] },
        western: { name: 'Western Bands', icon: '🎸', items: ['Rock Bands', 'Pop Bands', 'Jazz Bands'] },
        modern: { name: 'Modern Bands', icon: '🎧', items: ['Indie', 'Rap', 'Hip-Hop', 'EDM'] },
        rock: { name: 'Rock / Metal / Fusion Bands', icon: '🎸', items: ['Rock Bands', 'Metal Bands', 'Fusion Bands'] },
        wedding: { name: 'Wedding & College Bands', icon: '💒', items: ['Wedding Bands', 'College Bands', 'Event Bands'] },
        acoustic: { name: 'Acoustic / EDM / Techno Groups', icon: '🎵', items: ['Acoustic Groups', 'EDM Groups', 'Techno Groups'] }
      }
    },
    instrumentalists: {
      name: 'Instrumentalists',
      icon: '🎼',
      subcategories: {
        indian_classical: { name: 'Indian Classical', icon: '🎵', items: ['Flute', 'Sitar', 'Tabla', 'Veena', 'Harmonium'] },
        western: { name: 'Western', icon: '🎸', items: ['Guitar', 'Piano', 'Violin', 'Saxophone', 'Drums'] },
        fusion: { name: 'Fusion', icon: '🎵', items: ['Handpan', 'Cajón', 'Loop Station', 'Beatboxing'] }
      }
    },
    dancers: {
      name: 'Dancers',
      icon: '💃',
      subcategories: {
        classical: { name: 'Classical', icon: '🎭', items: ['Bharatanatyam', 'Kathak', 'Odissi', 'Kuchipudi', 'Manipuri'] },
        folk: { name: 'Folk', icon: '🪘', items: ['Bhangra', 'Garba', 'Ghoomar', 'Lavani', 'Baul'] },
        western: { name: 'Western', icon: '💃', items: ['Salsa', 'Tango', 'Ballroom', 'Swing'] },
        street: { name: 'Street', icon: '🕺', items: ['Hip-Hop', 'B-Boying', 'Krumping', 'Waacking'] },
        contemporary: { name: 'Contemporary', icon: '🩰', items: ['Ballet', 'Jazz Fusion', 'Modern Dance'] },
        specialty: { name: 'Specialty', icon: '🔥', items: ['Belly Dance', 'Aerial', 'Fire Dance', 'LED Dance'] }
      }
    },
    choreographers: {
      name: 'Choreographers',
      icon: '🕺',
      subcategories: {
        bollywood: { name: 'Bollywood / Film', icon: '🎬', items: ['Film Choreographers', 'Bollywood Choreographers', 'Music Video'] },
        wedding: { name: 'Wedding', icon: '💒', items: ['Wedding Choreographers', 'Sangeet Choreographers'] },
        reality: { name: 'Reality Shows', icon: '📺', items: ['Reality Show Choreographers', 'TV Show Choreographers'] },
        school: { name: 'School / College Events', icon: '🏫', items: ['School Choreographers', 'College Event Choreographers'] },
        fitness: { name: 'Fitness Dance', icon: '💪', items: ['Zumba', 'BollyFit', 'Dance Fitness'] },
        corporate: { name: 'Corporate Flashmob', icon: '🏢', items: ['Corporate Choreographers', 'Flashmob Organizers'] }
      }
    },
    cultural_artists: {
      name: 'Cultural Artists',
      icon: '🎭',
      subcategories: {
        traditional: { name: 'Traditional', icon: '🪘', items: ['Lavani', 'Nautanki', 'Tamasha'] },
        puppetry: { name: 'Puppetry', icon: '🎭', items: ['Glove Puppets', 'Shadow Puppets', 'String Puppets'] },
        tribal: { name: 'Tribal Artists', icon: '👤', items: ['Baiga', 'Gond', 'Bhil', 'Tribal Art'] },
        martial: { name: 'Martial Folk Arts', icon: '�', items: ['Martial Arts', 'Fighting Arts', 'Combat Sports'] }
      }
    },
    carnival_artists: {
      name: 'Carnival Artists',
      icon: '🎪',
      subcategories: {
        performance: { name: 'Performance', icon: '🎭', items: ['Stilt Walkers', 'Jugglers', 'Fire Performers'] },
        visual: { name: 'Visual', icon: '👤', items: ['Human Statues', 'Mime', 'Living Statues'] },
        comedy: { name: 'Comedy', icon: '😄', items: ['Clowns', 'Balloon Artists', 'Comedy Acts'] },
        acrobatic: { name: 'Acrobatic', icon: '🤸', items: ['Acrobats', 'Rope Walkers', 'Trapeze Artists'] }
      }
    },
    makeup_artists: {
      name: 'Makeup Artists',
      icon: '💄',
      subcategories: {
        bridal: { name: 'Bridal', icon: '💒', items: ['Bridal Makeup', 'Wedding Makeup', 'Traditional Bridal'] },
        fashion: { name: 'Fashion', icon: '👗', items: ['Fashion Makeup', 'Runway Makeup', 'Editorial Makeup'] },
        celebrity: { name: 'Celebrity', icon: '⭐', items: ['Celebrity Makeup', 'Red Carpet Makeup', 'TV Makeup'] },
        theatre: { name: 'Theatre / Film', icon: '🎬', items: ['Theatre Makeup', 'Film Makeup', 'Special Effects'] },
        sfx: { name: 'SFX', icon: '🎭', items: ['Special Effects', 'Prosthetic Makeup', 'Creature Makeup'] },
        hair: { name: 'Hair Stylists', icon: '💇', items: ['Hair Stylists', 'Hair Artists', 'Hair Designers'] }
      }
    },
    fitness_artists: {
      name: 'Fitness Artists',
      icon: '🏋️',
      subcategories: {
        zumba: { name: 'Zumba', icon: '💃', items: ['Zumba', 'Dance Fitness', 'Aerobics'] },
        yoga: { name: 'Yoga', icon: '🧘', items: ['Yoga', 'Meditation', 'Wellness'] },
        martial: { name: 'Martial Arts', icon: '🥋', items: ['Martial Arts', 'Karate', 'Taekwondo'] },
        pole: { name: 'Pole Fitness', icon: '🕺', items: ['Pole Dance', 'Pole Fitness', 'Aerial Fitness'] }
      }
    },
    painters: {
      name: 'Painters',
      icon: '🎨',
      subcategories: {
        traditional: { name: 'Traditional', icon: '🖼️', items: ['Oil', 'Watercolor', 'Acrylic'] },
        style: { name: 'Style', icon: '🎨', items: ['Realism', 'Abstract', 'Hyperrealism'] },
        modern: { name: 'Modern', icon: '🎨', items: ['Street', 'Graffiti', 'Digital', 'Mural'] }
      }
    },
    sketch_artists: {
      name: 'Sketch Artists',
      icon: '✏️',
      subcategories: {
        traditional: { name: 'Traditional', icon: '✏️', items: ['Pencil', 'Charcoal', 'Ink'] },
        creative: { name: 'Creative', icon: '🎨', items: ['Caricature', 'Comic', 'Anime'] },
        body: { name: 'Body Art', icon: '🎭', items: ['Tattoo Art', 'Body Painting', 'Henna'] },
        digital: { name: 'Digital', icon: '💻', items: ['Digital Art', '3D Art', 'NFT Art'] }
      }
    },
    rjs: {
      name: 'RJs',
      icon: '🎙️',
      subcategories: {
        fm: { name: 'FM RJs', icon: '📻', items: ['FM Radio', 'Music Radio', 'Entertainment Radio'] },
        digital: { name: 'Digital RJs', icon: '💻', items: ['Online Radio', 'Podcast Radio', 'Digital Radio'] },
        event: { name: 'Event RJs', icon: '🎤', items: ['Event RJs', 'Live Event Radio', 'Show RJs'] },
        storytelling: { name: 'Storytelling RJs', icon: '📖', items: ['Storytelling', 'Narrative Radio', 'Audio Stories'] }
      }
    },
    voice_artists: {
      name: 'Voice Artists',
      icon: '🎧',
      subcategories: {
        commercial: { name: 'Ads / Commercial', icon: '📺', items: ['Commercial Voice', 'Advertisement Voice', 'Jingle Voice'] },
        dubbing: { name: 'Dubbing', icon: '🎬', items: ['Film Dubbing', 'OTT Dubbing', 'Animation Dubbing'] },
        animation: { name: 'Animation Voices', icon: '🎭', items: ['Cartoon Voices', 'Animation Voice', 'Character Voice'] },
        audiobook: { name: 'Audiobooks / Podcast', icon: '🎧', items: ['Audiobook Narration', 'Podcast Hosting', 'Voice Acting'] },
        corporate: { name: 'IVR / Corporate', icon: '🏢', items: ['IVR Voice', 'Corporate Voice', 'Training Voice'] }
      }
    },
    writers: {
      name: 'Writers',
      icon: '✍️',
      subcategories: {
        poetry: { name: 'Poets', icon: '📜', items: ['Poets', 'Shayars', 'Poetry Writers'] },
        storytelling: { name: 'Storytellers', icon: '📖', items: ['Storytellers', 'Fiction Writers', 'Narrative Writers'] },
        script: { name: 'Script Writers', icon: '🎬', items: ['Script Writers', 'Screenplay Writers', 'Dialogue Writers'] },
        lyric: { name: 'Lyricists', icon: '🎵', items: ['Lyricists', 'Song Writers', 'Music Writers'] },
        content: { name: 'Content Writers', icon: '📝', items: ['Content Writers', 'Blog Writers', 'Copy Writers'] }
      }
    },
    djs: {
      name: 'DJs',
      icon: '🎧',
      subcategories: {
        wedding: { name: 'Wedding DJs', icon: '💒', items: ['Wedding DJs', 'Event DJs', 'Party DJs'] },
        club: { name: 'Club DJs', icon: '🎵', items: ['Club DJs', 'Nightclub DJs', 'Bar DJs'] },
        edm: { name: 'EDM / Techno', icon: '🎧', items: ['EDM DJs', 'Techno DJs', 'Electronic DJs'] },
        bollywood: { name: 'Bollywood DJs', icon: '🎬', items: ['Bollywood DJs', 'Desi DJs', 'Indian Music DJs'] },
        fusion: { name: 'DJ + Instrument Fusion', icon: '🎸', items: ['Live DJ', 'DJ Musicians', 'Instrument Fusion'] }
      }
    },
    wellness_artists: {
      name: 'Wellness Artists',
      icon: '🧘',
      subcategories: {
        meditation: { name: 'Meditation', icon: '🧘', items: ['Meditation', 'Mantra', 'Mindfulness'] },
        healing: { name: 'Sound Healing', icon: '🎵', items: ['Sound Healing', 'Music Therapy', 'Vibrational Healing'] },
        reiki: { name: 'Reiki Healing', icon: '✋', items: ['Reiki', 'Energy Healing', 'Spiritual Healing'] },
        spiritual: { name: 'Spiritual Storytelling', icon: '📖', items: ['Spiritual Storytelling', 'Motivational Speaking', 'Inspirational Talks'] }
      }
    },
    fashion_artists: {
      name: 'Fashion Artists',
      icon: '👗',
      subcategories: {
        design: { name: 'Fashion Designers', icon: '👗', items: ['Fashion Designers', 'Clothing Designers', 'Apparel Designers'] },
        costume: { name: 'Costume Designers', icon: '🎭', items: ['Costume Designers', 'Theatre Costumes', 'Film Costumes'] },
        styling: { name: 'Stylists', icon: '💇', items: ['Fashion Stylists', 'Personal Stylists', 'Wardrobe Stylists'] },
        jewelry: { name: 'Jewellery Designers', icon: '💍', items: ['Jewellery Designers', 'Accessory Designers', 'Ornament Designers'] }
      }
    },
    culinary_artists: {
      name: 'Culinary Artists',
      icon: '🍰',
      subcategories: {
        cake: { name: 'Cake Artists', icon: '🎂', items: ['Cake Artists', 'Cake Designers', 'Pastry Chefs'] },
        chocolate: { name: 'Chocolate Artists', icon: '🍫', items: ['Chocolate Artists', 'Chocolatiers', 'Confectionery'] },
        carving: { name: 'Food Carving', icon: '🔪', items: ['Food Carving', 'Fruit Carving', 'Ice Carving'] }
      }
    },
    children_artists: {
      name: 'Children Artists',
      icon: '🧸',
      subcategories: {
        entertainment: { name: 'Kids Entertainers', icon: '🤡', items: ['Kids Entertainers', 'Children Shows', 'Kids Parties'] },
        puppet: { name: 'Puppet Shows', icon: '🎭', items: ['Puppet Shows', 'Puppeteers', 'Marionette Shows'] },
        magic: { name: 'Magic Shows', icon: '🎩', items: ['Magic Shows', 'Kids Magic', 'Family Magic'] },
        storytelling: { name: 'Storytelling', icon: '📖', items: ['Storytelling', 'Kids Stories', 'Educational Stories'] },
        diy: { name: 'DIY Workshops', icon: '🛠️', items: ['DIY Workshops', 'Craft Workshops', 'Kids Activities'] }
      }
    },
    special_artists: {
      name: 'Special Artists',
      icon: '🌟',
      subcategories: {
        traditional: { name: 'Traditional', icon: '🎨', items: ['Rangoli', 'Mehendi', 'Henna Art'] },
        sand: { name: 'Sand Art', icon: '🏖️', items: ['Sand Art', 'Sand Sculptures', 'Beach Art'] },
        calligraphy: { name: 'Calligraphy', icon: '✍️', items: ['Calligraphy', 'Hand Lettering', 'Typography'] },
        ice: { name: 'Ice Sculptors', icon: '🧊', items: ['Ice Sculptors', 'Ice Carving', 'Ice Art'] }
      }
    },
    visual_tech_artists: {
      name: 'Visual Tech Artists',
      icon: '💡',
      subcategories: {
        laser: { name: 'Laser Shows', icon: '🔴', items: ['Laser Shows', 'Light Shows', 'Visual Effects'] },
        hologram: { name: 'Hologram Shows', icon: '👤', items: ['Hologram Shows', '3D Shows', 'Projection Shows'] },
        led: { name: 'LED Performers', icon: '💡', items: ['LED Performers', 'Light Artists', 'Visual Artists'] },
        mapping: { name: 'Video Mapping', icon: '📹', items: ['Video Mapping', 'Projection Mapping', 'Visual Mapping'] }
      }
    },
    circus_artists: {
      name: 'Circus Artists',
      icon: '🎪',
      subcategories: {
        aerial: { name: 'Aerial', icon: '🎪', items: ['Trapeze', 'Aerial Silks', 'Aerial Hoop'] },
        fire: { name: 'Fire', icon: '🔥', items: ['Fire Breathers', 'Fire Eaters', 'Fire Performers'] },
        knife: { name: 'Knife', icon: '🔪', items: ['Knife Throwers', 'Knife Jugglers', 'Blade Artists'] },
        contortion: { name: 'Contortionists', icon: '🤸', items: ['Contortionists', 'Flexibility Artists', 'Body Artists'] }
      }
    },
    actors: {
      name: 'Actors',
      icon: '🎬',
      subcategories: {
        theatre: { name: 'Theatre', icon: '🎭', items: ['Theatre Actors', 'Stage Actors', 'Live Theatre'] },
        film: { name: 'Film / TV', icon: '📺', items: ['Film Actors', 'TV Actors', 'Web Series'] },
        voice: { name: 'Voice Acting', icon: '🎤', items: ['Voice Acting', 'Dubbing Artists', 'Animation Voice'] }
      }
    },
    magicians: {
      name: 'Magicians',
      icon: '🎩',
      subcategories: {
        stage: { name: 'Stage Magic', icon: '🎭', items: ['Stage Magicians', 'Live Magic', 'Performance Magic'] },
        illusion: { name: 'Illusionists', icon: '👁️', items: ['Illusionists', 'Mind Readers', 'Mentalists'] },
        kids: { name: 'Kids Magicians', icon: '🤡', items: ['Kids Magicians', 'Family Magic', 'Children Magic'] }
      }
    },
    digital_artists: {
      name: 'Digital Artists',
      icon: '💻',
      subcategories: {
        nft: { name: 'NFT Artists', icon: '🎨', items: ['NFT Artists', 'Crypto Art', 'Digital Collectibles'] },
        ar_vr: { name: 'AR/VR Artists', icon: '🥽', items: ['AR Artists', 'VR Artists', 'Mixed Reality'] },
        drone: { name: 'Drone Shows', icon: '🚁', items: ['Drone Shows', 'Aerial Photography', 'Drone Art'] },
        installation: { name: 'Installation Artists', icon: '🎨', items: ['Installation Artists', '3D Installations', 'Interactive Art'] }
      }
    },
    musicians: {
      name: 'Musicians',
      icon: '🎸',
      subcategories: {
        classical: { name: 'Classical Musicians', icon: '🎵', items: ['Classical Guitar', 'Classical Piano', 'Classical Violin', 'Classical Flute'] },
        modern: { name: 'Modern Musicians', icon: '🎸', items: ['Rock Guitar', 'Pop Piano', 'Jazz Saxophone', 'Electronic Keyboard'] },
        traditional: { name: 'Traditional Musicians', icon: '🪘', items: ['Dholak', 'Tabla', 'Sitar', 'Flute', 'Harmonium'] },
        session: { name: 'Session Musicians', icon: '🎵', items: ['Studio Musicians', 'Live Session Players', 'Recording Artists'] }
      }
    },
    photographers: {
      name: 'Photographers',
      icon: '📷',
      subcategories: {
        wedding: { name: 'Wedding Photography', icon: '💒', items: ['Wedding Shoots', 'Pre-Wedding', 'Candid Wedding', 'Traditional Wedding'] },
        fashion: { name: 'Fashion Photography', icon: '👗', items: ['Fashion Shoots', 'Portfolio', 'Magazine', 'Runway'] },
        product: { name: 'Product Photography', icon: '📦', items: ['E-commerce', 'Product Catalogs', 'Food Photography', 'Still Life'] },
        portrait: { name: 'Portrait Photography', icon: '👤', items: ['Studio Portraits', 'Outdoor Portraits', 'Corporate Headshots', 'Family Portraits'] },
        event: { name: 'Event Photography', icon: '🎉', items: ['Corporate Events', 'Birthday Parties', 'Concerts', 'Festivals'] }
      }
    },
    videographers: {
      name: 'Videographers',
      icon: '🎥',
      subcategories: {
        wedding: { name: 'Wedding Videography', icon: '💒', items: ['Wedding Films', 'Cinematic Wedding', 'Traditional Wedding', 'Highlight Reels'] },
        corporate: { name: 'Corporate Videography', icon: '🏢', items: ['Corporate Films', 'Training Videos', 'Promotional Videos', 'Event Coverage'] },
        music: { name: 'Music Videos', icon: '🎵', items: ['Music Video Production', 'Live Performance', 'Behind the Scenes', 'Teaser Videos'] },
        documentary: { name: 'Documentary', icon: '📹', items: ['Documentary Films', 'Short Films', 'Travel Videos', 'Storytelling'] }
      }
    },
    hair_stylists: {
      name: 'Hair Stylists',
      icon: '💇',
      subcategories: {
        bridal: { name: 'Bridal Hair', icon: '💒', items: ['Bridal Hairstyles', 'Wedding Hair', 'Traditional Bridal', 'Modern Bridal'] },
        fashion: { name: 'Fashion Hair', icon: '👗', items: ['Runway Hair', 'Fashion Shoots', 'Editorial Hair', 'Avant Garde'] },
        salon: { name: 'Salon Services', icon: '💇', items: ['Haircuts', 'Hair Coloring', 'Hair Treatments', 'Hair Styling'] },
        creative: { name: 'Creative Hair', icon: '🎨', items: ['Creative Color', 'Hair Art', 'Special Effects Hair', 'Fantasy Hair'] }
      }
    },
    comedians: {
      name: 'Comedians',
      icon: '😄',
      subcategories: {
        standup: { name: 'Stand-up Comedy', icon: '🎤', items: ['Stand-up Comedy', 'Open Mic', 'Comedy Clubs', 'Comedy Specials'] },
        sketch: { name: 'Sketch Comedy', icon: '📺', items: ['Sketch Shows', 'Comedy Series', 'Web Series', 'Short Films'] },
        improv: { name: 'Improvisation', icon: '🎭', items: ['Improv Comedy', 'Improv Shows', 'Spontaneous Comedy', 'Interactive Comedy'] },
        digital: { name: 'Digital Comedy', icon: '📱', items: ['Social Media Comedy', 'Memes', 'Short Videos', 'Online Content'] }
      }
    },
    models: {
      name: 'Models',
      icon: '👤',
      subcategories: {
        fashion: { name: 'Fashion Modeling', icon: '👗', items: ['Runway Models', 'Fashion Shows', 'Magazine Covers', 'Fashion Campaigns'] },
        commercial: { name: 'Commercial Modeling', icon: '📺', items: ['TV Commercials', 'Print Ads', 'Brand Ambassador', 'Product Modeling'] },
        fitness: { name: 'Fitness Modeling', icon: '💪', items: ['Fitness Models', 'Athletic Wear', 'Gym Brands', 'Health Products'] },
        plus_size: { name: 'Plus Size Modeling', icon: '🌟', items: ['Plus Size Fashion', 'Body Positivity', 'Inclusive Brands', 'Plus Size Campaigns'] }
      }
    },
    fashion_designers: {
      name: 'Fashion Designers',
      icon: '👗',
      subcategories: {
        bridal: { name: 'Bridal Wear', icon: '💒', items: ['Wedding Dresses', 'Bridal Collections', 'Traditional Bridal', 'Modern Bridal'] },
        casual: { name: 'Casual Wear', icon: '👕', items: ['Daily Wear', 'Street Style', 'Casual Collections', 'Ready to Wear'] },
        ethnic: { name: 'Ethnic Wear', icon: '🪘', items: ['Traditional Wear', 'Cultural Outfits', 'Fusion Wear', 'Regional Styles'] },
        luxury: { name: 'Luxury Fashion', icon: '✨', items: ['Haute Couture', 'Luxury Brands', 'Designer Wear', 'High Fashion'] }
      }
    },
    content_creators: {
      name: 'Content Creators',
      icon: '📱',
      subcategories: {
        youtube: { name: 'YouTube Creators', icon: '📺', items: ['Vloggers', 'Educational Content', 'Entertainment', 'Tutorial Videos'] },
        instagram: { name: 'Instagram Creators', icon: '📷', items: ['Reels Creators', 'Lifestyle Content', 'Travel Content', 'Food Content'] },
        blog: { name: 'Bloggers', icon: '📝', items: ['Travel Bloggers', 'Food Bloggers', 'Fashion Bloggers', 'Tech Bloggers'] },
        podcast: { name: 'Podcasters', icon: '🎙️', items: ['Interview Podcasts', 'Storytelling Podcasts', 'Educational Podcasts', 'Entertainment Podcasts'] }
      }
    },
    influencers: {
      name: 'Influencers',
      icon: '🌟',
      subcategories: {
        fashion: { name: 'Fashion Influencers', icon: '👗', items: ['Fashion Bloggers', 'Style Influencers', 'Outfit Ideas', 'Fashion Trends'] },
        lifestyle: { name: 'Lifestyle Influencers', icon: '🌟', items: ['Lifestyle Content', 'Daily Routine', 'Home Decor', 'Lifestyle Tips'] },
        travel: { name: 'Travel Influencers', icon: '✈️', items: ['Travel Bloggers', 'Destination Guides', 'Travel Tips', 'Adventure Content'] },
        fitness: { name: 'Fitness Influencers', icon: '💪', items: ['Workout Content', 'Fitness Tips', 'Nutrition', 'Wellness'] }
      }
    },
    tattoo_artists: {
      name: 'Tattoo Artists',
      icon: '🎨',
      subcategories: {
        traditional: { name: 'Traditional Tattoo', icon: '🎨', items: ['Traditional Tattoos', 'Old School', 'American Traditional', 'Tribal Tattoos'] },
        modern: { name: 'Modern Tattoo', icon: '🎭', items: ['Modern Tattoos', 'Contemporary', 'Illustrative', 'Geometric'] },
        realistic: { name: 'Realistic Tattoo', icon: '👤', items: ['Realistic Portraits', '3D Tattoos', 'Hyperrealistic', 'Black & Gray'] },
        watercolor: { name: 'Watercolor Tattoo', icon: '🎨', items: ['Watercolor Tattoos', 'Brush Style', 'Colorful Tattoos', 'Artistic Tattoos'] }
      }
    },
    graphic_designers: {
      name: 'Graphic Designers',
      icon: '🖼️',
      subcategories: {
        branding: { name: 'Branding Design', icon: '🏷️', items: ['Logo Design', 'Brand Identity', 'Business Cards', 'Brand Guidelines'] },
        web: { name: 'Web Design', icon: '💻', items: ['Website Design', 'UI/UX Design', 'Mobile Apps', 'Landing Pages'] },
        print: { name: 'Print Design', icon: '📄', items: ['Brochures', 'Flyers', 'Posters', 'Magazine Layouts'] },
        social: { name: 'Social Media Design', icon: '📱', items: ['Social Media Posts', 'Instagram Stories', 'Facebook Covers', 'Twitter Headers'] }
      }
    },
    voice_over_artists: {
      name: 'Voice Over Artists',
      icon: '🎤',
      subcategories: {
        commercial: { name: 'Commercial Voice', icon: '📺', items: ['TV Commercials', 'Radio Ads', 'Jingle Voice', 'Brand Voice'] },
        animation: { name: 'Animation Voice', icon: '🎭', items: ['Cartoon Voices', 'Character Voices', 'Dubbing', 'Video Games'] },
        narration: { name: 'Narration', icon: '📖', items: ['Documentary Narration', 'Audiobooks', 'E-learning', 'Training Videos'] },
        corporate: { name: 'Corporate Voice', icon: '🏢', items: ['Corporate Videos', 'Training Modules', 'IVR Systems', 'Presentations'] }
      }
    },
    poets: {
      name: 'Poets',
      icon: '📜',
      subcategories: {
        traditional: { name: 'Traditional Poetry', icon: '📜', items: ['Classical Poetry', 'Shayari', 'Ghazals', 'Folk Poetry'] },
        modern: { name: 'Modern Poetry', icon: '✍️', items: ['Modern Poetry', 'Spoken Word', 'Slam Poetry', 'Performance Poetry'] },
        romantic: { name: 'Romantic Poetry', icon: '❤️', items: ['Love Poems', 'Romantic Shayari', 'Couplets', 'Romantic Verses'] },
        motivational: { name: 'Motivational Poetry', icon: '🌟', items: ['Inspirational Poetry', 'Motivational Verses', 'Life Poetry', 'Uplifting Words'] }
      }
    },
    standup_artists: {
      name: 'Stand-up Artists',
      icon: '🎤',
      subcategories: {
        observational: { name: 'Observational Comedy', icon: '👀', items: ['Observational Humor', 'Everyday Life', 'Social Commentary', 'Relatable Comedy'] },
        satire: { name: 'Satire Comedy', icon: '😏', items: ['Satirical Comedy', 'Political Satire', 'Social Satire', 'Dark Humor'] },
        clean: { name: 'Clean Comedy', icon: '😄', items: ['Family Friendly', 'Clean Humor', 'All Ages', 'Wholesome Comedy'] },
        alternative: { name: 'Alternative Comedy', icon: '🎭', items: ['Alternative Comedy', 'Experimental', 'Improvisational', 'Niche Humor'] }
      }
    },
    music_producers: {
      name: 'Music Producers',
      icon: '🎵',
      subcategories: {
        electronic: { name: 'Electronic Music', icon: '🎧', items: ['EDM Production', 'Techno', 'House Music', 'Trance', 'Dubstep'] },
        hip_hop: { name: 'Hip-Hop Production', icon: '🎤', items: ['Hip-Hop Beats', 'Trap Music', 'R&B Production', 'Urban Music'] },
        bollywood: { name: 'Bollywood Music', icon: '🎬', items: ['Bollywood Production', 'Film Music', 'Indian Pop', 'Fusion Music'] },
        classical: { name: 'Classical Production', icon: '🎵', items: ['Classical Arrangement', 'Orchestral Production', 'Classical Recording', 'Traditional Music'] }
      }
    }
  };

  const artistCategories = [
    { id: 'singers', name: 'Singer', icon: '🎤' },
    { id: 'musicians', name: 'Musician', icon: '🎸' },
    { id: 'dancers', name: 'Dancer', icon: '💃' },
    { id: 'djs', name: 'DJ', icon: '🎧' },
    { id: 'photographers', name: 'Photographer', icon: '📷' },
    { id: 'videographers', name: 'Videographer', icon: '🎥' },
    { id: 'makeup_artists', name: 'Makeup Artist', icon: '💄' },
    { id: 'hair_stylists', name: 'Hair Stylist', icon: '💇' },
    { id: 'fashion_designers', name: 'Fashion Designer', icon: '👗' },
    { id: 'models', name: 'Model', icon: '👤' },
    { id: 'actors', name: 'Actor', icon: '🎬' },
    { id: 'comedians', name: 'Comedian', icon: '😄' },
    { id: 'anchors', name: 'Anchor / Host', icon: '�️' },
    { id: 'content_creators', name: 'Content Creator', icon: '📱' },
    { id: 'influencers', name: 'Influencer', icon: '🌟' },
    { id: 'painters', name: 'Painter', icon: '🎨' },
    { id: 'sketch_artists', name: 'Sketch Artist', icon: '✏️' },
    { id: 'tattoo_artists', name: 'Tattoo Artist', icon: '�' },
    { id: 'graphic_designers', name: 'Graphic Designer', icon: '🖼️' },
    { id: 'digital_artists', name: 'Digital Artist', icon: '🎨' },
    { id: 'voice_over_artists', name: 'Voice Over Artist', icon: '🎤' },
    { id: 'writers', name: 'Writer', icon: '✍️' },
    { id: 'poets', name: 'Poet', icon: '📜' },
    { id: 'magicians', name: 'Magician', icon: '🎩' },
    { id: 'standup_artists', name: 'Stand-up Artist', icon: '�' },
    { id: 'choreographers', name: 'Choreographer', icon: '🕺' },
    { id: 'music_producers', name: 'Music Producer', icon: '🎵' },
    { id: 'instrumentalists', name: 'Instrumentalist', icon: '🎵' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
    
    // Show subcategories popup for any category that has subcategories
    if (field === 'category' && allCategoriesData[value]) {
      setSelectedCategoryData(allCategoriesData[value]);
      setShowSubcategories(true);
      setShowCategoryPopup(true);
    } else if (field === 'category') {
      setShowSubcategories(false);
      setShowCategoryPopup(false);
      setSelectedCategoryData(null);
    }
  };

  const handleFileChange = (field, files) => {
    setFormData(prev => ({
      ...prev,
      [field]: files
    }));
  };

  const handleSubcategorySelect = (subcategory) => {
    setFormData(prev => ({
      ...prev,
      subcategory: subcategory
    }));
    setError('');
  };

  const closeCategoryPopup = () => {
    setShowCategoryPopup(false);
  };

  const validateStep = (step) => {
    setError('');
    
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.dateOfBirth || !formData.gender || !formData.password || !formData.confirmPassword) {
        setError('Please fill all required fields');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    
    if (step === 2) {
      if (!formData.artistType || !formData.category) {
        setError('Please select artist type and category');
        return false;
      }
    }
    
    if (step === 3) {
      if (!formData.experience || !formData.bio || !formData.location) {
        setError('Please fill all required fields');
        return false;
      }
    }
    
    // No validation for Step 4
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'socialLinks') {
          formDataToSend.append('socialLinks', JSON.stringify(formData[key]));
        } else if (key === 'portfolio') {
          Array.from(formData[key]).forEach(file => {
            formDataToSend.append('portfolio', file);
          });
        } else if (key === 'idProof') {
          if (formData[key] && formData[key].length > 0) {
            formDataToSend.append('idProof', formData[key][0]);
          }
        } else if (key === 'skills') {
          formDataToSend.append('skills', formData[key].join(','));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      const response = await fetch('http://localhost:5001/api/artist/register', {
        method: 'POST',
        body: formDataToSend
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Registration successful! Your application is under review.');
        setTimeout(() => {
          navigate('auth');
        }, 3000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6" style={{ color: config.text_color }}>
        Personal Information
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
            placeholder="Enter your first name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
            placeholder="Enter your last name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
            placeholder="your.email@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
            placeholder="+91 98765 43210"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
            placeholder="Create a strong password (min 6 characters)"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
            placeholder="Confirm your password"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6" style={{ color: config.text_color }}>
        Category Selection
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Artist Type</label>
          <select
            value={formData.artistType}
            onChange={(e) => handleInputChange('artistType', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
          >
            <option value="">Select Artist Type</option>
            <option value="solo">Solo Artist</option>
            <option value="group">Group/Band</option>
            <option value="duo">Duo</option>
            <option value="trio">Trio</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <div className="max-h-96 overflow-y-auto border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {artistCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleInputChange('category', category.id)}
                  className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    formData.category === category.id
                      ? 'border-brand-500 bg-brand-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 bg-white shadow-md hover:shadow-lg'
                  }`}
                >
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <div className="text-sm font-medium">{category.name}</div>
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Scroll to see all categories</p>
        </div>

        {/* Singer Subcategories - Only show when singer is selected and popup is closed */}
        {showSubcategories && formData.category === 'singers' && !showCategoryPopup && (
          <div className="animate-in slide-in-from-top duration-300">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <span className="text-brand-500">🎤</span>
                Select Singer Subcategory
              </span>
            </label>
            <div className="border-2 border-brand-200 rounded-xl p-6 bg-gradient-to-br from-brand-50 to-white">
              <div className="space-y-4">
                {Object.entries(allCategoriesData.singers?.subcategories || {}).map(([key, subcategory]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{subcategory.icon}</span>
                      <h4 className="font-semibold text-gray-800">{subcategory.name}</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {subcategory.items.map((item) => (
                        <button
                          key={item}
                          onClick={() => handleSubcategorySelect(item)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                            formData.subcategory === item
                              ? 'bg-brand-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Selected Subcategory Display */}
              {formData.subcategory && (
                <div className="mt-4 p-3 bg-brand-100 border border-brand-300 rounded-lg">
                  <p className="text-sm font-medium text-brand-700">
                    Selected: <span className="font-bold">{formData.subcategory}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6" style={{ color: config.text_color }}>
        Professional Information
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
          <select
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
          >
            <option value="">Select Experience</option>
            <option value="0-1">0-1 Years</option>
            <option value="1-3">1-3 Years</option>
            <option value="3-5">3-5 Years</option>
            <option value="5-10">5-10 Years</option>
            <option value="10+">10+ Years</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
            placeholder="Tell us about yourself and your artistic journey..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
            placeholder="City, State"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expected Budget Range (₹)</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Starting From</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">₹</span>
                </div>
                <input
                  type="number"
                  value={formData.budgetMin}
                  onChange={(e) => handleInputChange('budgetMin', e.target.value)}
                  className="w-full px-4 py-3 pl-8 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
                  placeholder="Starting amount"
                  min="0"
                  step="1000"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Upto</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">₹</span>
                </div>
                <input
                  type="number"
                  value={formData.budgetMax}
                  onChange={(e) => handleInputChange('budgetMax', e.target.value)}
                  className="w-full px-4 py-3 pl-8 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
                  placeholder="Maximum amount"
                  min="0"
                  step="1000"
                />
              </div>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Enter your budget range for performances, events, or services (e.g., Starting from ₹15,000 to ₹50,000)
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6" style={{ color: config.text_color }}>
        Social Media & Verification
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Links</label>
          <div className="space-y-4">
            <input
              type="url"
              value={formData.socialLinks.instagram}
              onChange={(e) => handleInputChange('socialLinks', {...formData.socialLinks, instagram: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
              placeholder="Instagram Profile URL"
            />
            <input
              type="url"
              value={formData.socialLinks.youtube}
              onChange={(e) => handleInputChange('socialLinks', {...formData.socialLinks, youtube: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
              placeholder="YouTube Channel URL"
            />
            <input
              type="url"
              value={formData.socialLinks.facebook}
              onChange={(e) => handleInputChange('socialLinks', {...formData.socialLinks, facebook: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
              placeholder="Facebook Page URL"
            />
            <input
              type="url"
              value={formData.socialLinks.website}
              onChange={(e) => handleInputChange('socialLinks', {...formData.socialLinks, website: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
              placeholder="Personal Website URL"
            />
          </div>
        </div>
        
        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
              className="w-5 h-5 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
            />
            <span className="text-sm text-gray-700">
              I accept the Terms of Service and Privacy Policy
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  // Category Selection Popup
  const CategoryPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
        {/* Popup Header */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">{selectedCategoryData?.icon || '🎤'}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedCategoryData?.name || 'Category'} Selected!</h3>
                <p className="text-brand-100 text-sm">Choose your specific style</p>
              </div>
            </div>
            <button
              onClick={closeCategoryPopup}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Popup Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-brand-500 rounded-full animate-pulse"></div>
              <h4 className="text-lg font-semibold text-gray-800">Select Your {selectedCategoryData?.name || 'Category'} Style</h4>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              You've selected <span className="font-bold text-brand-600">{selectedCategoryData?.name || 'Category'}</span> as your category. 
              Now choose your specific style from the options below to help us find the perfect opportunities for you.
            </p>
          </div>

          {/* Subcategories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 max-h-60 overflow-y-auto">
            {selectedCategoryData?.subcategories && Object.entries(selectedCategoryData.subcategories).map(([key, subcategory]) => (
              <div key={key} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{subcategory.icon}</span>
                  <h5 className="font-semibold text-gray-800">{subcategory.name}</h5>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {subcategory.items.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleSubcategorySelect(item)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                        formData.subcategory === item
                          ? 'bg-brand-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Subcategory Display */}
          {formData.subcategory && (
            <div className="bg-brand-50 border border-brand-300 rounded-lg p-4">
              <p className="text-sm font-medium text-brand-700">
                Selected: <span className="font-bold">{formData.subcategory}</span>
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-brand-800">
                  Choose your specific style from the options above
                </p>
                <p className="text-xs text-brand-600 mt-1">
                  Each subcategory has multiple styles to choose from
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={closeCategoryPopup}
              className="flex-1 px-4 py-3 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 transition-all"
            >
              Got it, I've chosen
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-16 min-h-full" style={{ backgroundColor: config.background_color }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button 
            onClick={() => navigate('home')}
            className="w-10 h-10 rounded-full bg-white shadow hover:shadow-md flex items-center justify-center transition-all mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: config.text_color }}>
            Artist Registration
          </h1>
          <p className="text-gray-600">Join our community of talented artists</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
            {success}
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step <= currentStep
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                <div className={`ml-3 text-sm font-medium ${
                  step <= currentStep ? 'text-brand-600' : 'text-gray-500'
                }`}>
                  {step === 1 && 'Personal Info'}
                  {step === 2 && 'Category Selection'}
                  {step === 3 && 'Professional Info'}
                  {step === 4 && 'Portfolio'}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-4 ${
                    step < currentStep ? 'bg-brand-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 transition-all"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          )}
        </div>
      </div>

      {/* Category Selection Popup */}
      {showCategoryPopup && <CategoryPopup />}
    </div>
  );
};

export default ArtistRegistrationPage;
