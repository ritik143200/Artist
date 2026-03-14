import { useState, useEffect, useRef } from 'react';
import { useRouter } from '../contexts/RouterContext';
import { artists as mockArtists } from '../data/mockData';
import ArtistCard from '../components/ArtistCard';

// Categories data - Same as Artist Registration Page
const allCategoriesData = {
  singers: {
    name: 'Singers',
    icon: '🎤',
    color: 'from-purple-500 to-pink-600',
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
    color: 'from-blue-500 to-cyan-600',
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
    color: 'from-indigo-500 to-purple-600',
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
    color: 'from-green-500 to-emerald-600',
    subcategories: {
      indian_classical: { name: 'Indian Classical', icon: '🎵', items: ['Flute', 'Sitar', 'Tabla', 'Veena', 'Harmonium'] },
      western: { name: 'Western', icon: '🎸', items: ['Guitar', 'Piano', 'Violin', 'Saxophone', 'Drums'] },
      fusion: { name: 'Fusion', icon: '🎵', items: ['Handpan', 'Cajón', 'Loop Station', 'Beatboxing'] }
    }
  },
  dancers: {
    name: 'Dancers',
    icon: '💃',
    color: 'from-pink-500 to-rose-600',
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
    color: 'from-purple-500 to-pink-600',
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
    color: 'from-orange-500 to-red-600',
    subcategories: {
      traditional: { name: 'Traditional', icon: '🪘', items: ['Lavani', 'Nautanki', 'Tamasha'] },
      puppetry: { name: 'Puppetry', icon: '🎭', items: ['Glove Puppets', 'Shadow Puppets', 'String Puppets'] },
      tribal: { name: 'Tribal Artists', icon: '👤', items: ['Baiga', 'Gond', 'Bhil', 'Tribal Art'] },
      martial: { name: 'Martial Folk Arts', icon: '🥋', items: ['Martial Arts', 'Fighting Arts', 'Combat Sports'] }
    }
  },
  carnival_artists: {
    name: 'Carnival Artists',
    icon: '🎪',
    color: 'from-yellow-500 to-orange-600',
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
    color: 'from-pink-500 to-rose-600',
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
    color: 'from-green-500 to-emerald-600',
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
    color: 'from-blue-500 to-purple-600',
    subcategories: {
      traditional: { name: 'Traditional', icon: '🖼️', items: ['Oil', 'Watercolor', 'Acrylic'] },
      style: { name: 'Style', icon: '🎨', items: ['Realism', 'Abstract', 'Hyperrealism'] },
      modern: { name: 'Modern', icon: '🎨', items: ['Street', 'Graffiti', 'Digital', 'Mural'] }
    }
  },
  sketch_artists: {
    name: 'Sketch Artists',
    icon: '✏️',
    color: 'from-gray-500 to-gray-600',
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
    color: 'from-purple-500 to-pink-600',
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
    color: 'from-indigo-500 to-purple-600',
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
    color: 'from-blue-500 to-gray-600',
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
    color: 'from-purple-500 to-pink-600',
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
    color: 'from-green-500 to-emerald-600',
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
    color: 'from-pink-500 to-rose-600',
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
    color: 'from-orange-500 to-red-600',
    subcategories: {
      cake: { name: 'Cake Artists', icon: '🎂', items: ['Cake Artists', 'Cake Designers', 'Pastry Chefs'] },
      chocolate: { name: 'Chocolate Artists', icon: '🍫', items: ['Chocolate Artists', 'Chocolatiers', 'Confectionery'] },
      carving: { name: 'Food Carving', icon: '🔪', items: ['Food Carving', 'Fruit Carving', 'Ice Carving'] }
    }
  },
  children_artists: {
    name: 'Children Artists',
    icon: '🧸',
    color: 'from-yellow-500 to-orange-600',
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
    color: 'from-purple-500 to-pink-600',
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
    color: 'from-blue-500 to-purple-600',
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
    color: 'from-red-500 to-orange-600',
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
    color: 'from-purple-500 to-pink-600',
    subcategories: {
      theatre: { name: 'Theatre', icon: '🎭', items: ['Theatre Actors', 'Stage Actors', 'Live Theatre'] },
      film: { name: 'Film / TV', icon: '📺', items: ['Film Actors', 'TV Actors', 'Web Series'] },
      voice: { name: 'Voice Acting', icon: '🎤', items: ['Voice Acting', 'Dubbing Artists', 'Animation Voice'] }
    }
  },
  magicians: {
    name: 'Magicians',
    icon: '🎩',
    color: 'from-purple-500 to-pink-600',
    subcategories: {
      stage: { name: 'Stage Magic', icon: '🎭', items: ['Stage Magicians', 'Live Magic', 'Performance Magic'] },
      illusion: { name: 'Illusionists', icon: '👁️', items: ['Illusionists', 'Mind Readers', 'Mentalists'] },
      kids: { name: 'Kids Magicians', icon: '🤡', items: ['Kids Magicians', 'Family Magic', 'Children Magic'] }
    }
  },
  digital_artists: {
    name: 'Digital Artists',
    icon: '💻',
    color: 'from-blue-500 to-purple-600',
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
    color: 'from-indigo-500 to-purple-600',
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
    color: 'from-blue-500 to-cyan-600',
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
    color: 'from-red-500 to-pink-600',
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
    color: 'from-pink-500 to-rose-600',
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
    color: 'from-yellow-500 to-orange-600',
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
    color: 'from-purple-500 to-pink-600',
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
    color: 'from-pink-500 to-rose-600',
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
    color: 'from-blue-500 to-purple-600',
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
    color: 'from-purple-500 to-pink-600',
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
    color: 'from-gray-500 to-gray-600',
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
    color: 'from-blue-500 to-gray-600',
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
    color: 'from-purple-500 to-pink-600',
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
    color: 'from-blue-500 to-gray-600',
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
    color: 'from-yellow-500 to-orange-600',
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
    color: 'from-indigo-500 to-purple-600',
    subcategories: {
      electronic: { name: 'Electronic Music', icon: '🎧', items: ['EDM Production', 'Techno', 'House Music', 'Trance', 'Dubstep'] },
      hip_hop: { name: 'Hip-Hop Production', icon: '🎤', items: ['Hip-Hop Beats', 'Trap Music', 'R&B Production', 'Urban Music'] },
      bollywood: { name: 'Bollywood Music', icon: '🎬', items: ['Bollywood Production', 'Film Music', 'Indian Pop', 'Fusion Music'] },
      classical: { name: 'Classical Production', icon: '🎵', items: ['Classical Arrangement', 'Orchestral Production', 'Classical Recording', 'Traditional Music'] }
    }
  }
};

const CategoryPage = ({ config }) => {
  const { params, navigate } = useRouter();
  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001').replace(/\/$/, '');
  const searchQuery = params.search;
  const subcategory = params.subcategory;
  
  // Refresh handler for individual artist
  const handleArtistRefresh = async (artistId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/artists/${artistId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const updatedArtist = await response.json();
        
        // Update the specific artist in the artists array
        setArtists(prev => prev.map(artist => 
          (artist._id === artistId || artist.id === artistId) 
            ? { ...artist, ...updatedArtist.data || updatedArtist }
            : artist
        ));
      }
    } catch (error) {
      console.log('Failed to refresh artist:', error);
    }
  };
  
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    minBudget: '',
    maxBudget: '',
    subcategory: 'all',
    skill: '',
    sortBy: 'relevance'
  });
  
  // Category data state
  const [selectedCategoryData, setSelectedCategoryData] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState('All Subcategories');
  const [expandedCategory, setExpandedCategory] = useState(null); // Track which category dropdown is open
  const hasFetchedRef = useRef(false);
  
  // Display artists state
  const [displayArtists, setDisplayArtists] = useState([]);
  let pageTitle = 'Artists';
  let pageDescription = 'Browse artists';

  console.log('🔄 CategoryPage component mounted');
  console.log('📊 Initial state:', { loading, error, artistsCount: artists.length });

  // Fetch artists from MongoDB
  useEffect(() => {
    if (hasFetchedRef.current) {
      return;
    }
    hasFetchedRef.current = true;

    const fetchArtists = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching artists from backend...');
        console.log(`🌐 API URL: ${API_BASE_URL}/api/artists`);
        
        // Fetch from backend API
        const response = await fetch(`${API_BASE_URL}/api/artists`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('📡 Response status:', response.status);
        
        const result = await response.json();
        
        console.log('📡 Full API Response:', result);
        
        if (response.ok && result.success) {
          const artistsData = result.artists || [];
          setArtists(artistsData);
          console.log('✅ Artists fetched successfully:', artistsData.length, 'artists');
          
          // Log budget data for debugging
          if (artistsData.length > 0) {
            console.log('💰 Sample artist budget data:');
            artistsData.slice(0, 3).forEach((artist, index) => {
              console.log(`  ${index + 1}. ${artist.fullName || artist.name}:`, {
                budget: artist.budget,
                budgetMin: artist.budgetMin,
                budgetMax: artist.budgetMax,
                price: artist.price,
                hasBudget: !!artist.budget,
                hasBudgetMin: !!artist.budgetMin,
                hasBudgetMax: !!artist.budgetMax,
                allFields: Object.keys(artist)
              });
            });
          }
        } else {
          throw new Error(result.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        
      } catch (err) {
        console.error('❌ Error fetching artists:', err);
        console.log('🔄 Backend unavailable, using mock artists fallback');
        setArtists(mockArtists || []);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [API_BASE_URL]);

  // Dynamic Filter-Based Artist Evaluation and Sorting
  useEffect(() => {
    let allArtists = [...artists];
    
    console.log('🔄 Filtering triggered with:');
    console.log('   - Total artists:', allArtists.length);
    console.log('   - Selected category:', selectedCategoryData?.name);
    console.log('   - Filters:', filters);
    
    // Calculate relevance score for each artist based on ALL filters
    const scoredArtists = allArtists.map(artist => {
      let score = 0;
      let matchDetails = [];

      // Category Matching - Highest Priority (15 points exact)
      if (selectedCategoryData && selectedCategoryData.name && artist.category) {
        const selectedCategoryName = selectedCategoryData.name.toLowerCase().trim();
        const artistCategoryName = artist.category.toLowerCase().trim();
        
        // Exact match
        if (artistCategoryName === selectedCategoryName) {
          score += 15;
          matchDetails.push('Exact category match');
        }
        // Partial match (contains)
        else if (artistCategoryName.includes(selectedCategoryName) || selectedCategoryName.includes(artistCategoryName)) {
          score += 10;
          matchDetails.push('Partial category match');
        }
      }

      // Subcategory Matching - Higher Priority (12 points exact, 8 points skills)
      if (filters.subcategory && filters.subcategory !== 'all') {
        if (artist.subcategory === filters.subcategory) {
          score += 12;
          matchDetails.push('Exact subcategory match');
        }
        if (artist.skills?.includes(filters.subcategory)) {
          score += 8;
          matchDetails.push('Skills match');
        }
        if (artist.specialty === filters.subcategory) {
          score += 8;
          matchDetails.push('Specialty match');
        }
      }

      // Location Matching - High Priority (10 points exact, 5 points partial)
      if (filters.location) {
        const searchLocation = filters.location.toLowerCase();
        const artistLocation = artist.location?.toLowerCase() || '';

        if (artistLocation === searchLocation) {
          score += 10;
          matchDetails.push('Exact location match');
        } else if (artistLocation.includes(searchLocation)) {
          score += 5;
          matchDetails.push('Partial location match');
        }
      }

      // Skills Matching - Medium Priority (7 points exact, 4 points partial)
      if (filters.skill) {
        const searchSkill = filters.skill.toLowerCase();

        // Exact skill match
        if (artist.skills?.some(skill => skill.toLowerCase() === searchSkill)) {
          score += 7;
          matchDetails.push('Exact skill match');
        }
        // Partial skill match
        else if (artist.skills?.some(skill => skill.toLowerCase().includes(searchSkill))) {
          score += 4;
          matchDetails.push('Partial skill match');
        }
        // Specialty exact match
        else if (artist.specialty?.toLowerCase() === searchSkill) {
          score += 5;
          matchDetails.push('Specialty match');
        }
        // Specialty partial match
        else if (artist.specialty?.toLowerCase().includes(searchSkill)) {
          score += 3;
          matchDetails.push('Partial specialty match');
        }
        // Category exact match
        else if (artist.category?.toLowerCase() === searchSkill) {
          score += 4;
          matchDetails.push('Category match');
        }
        // Category partial match
        else if (artist.category?.toLowerCase().includes(searchSkill)) {
          score += 2;
          matchDetails.push('Partial category match');
        }
      }

      // Budget Range Matching - Medium Priority (up to 5 points)
      if (filters.minBudget || filters.maxBudget) {
        const artistPrice = artist.budget || 0;
        const minPrice = parseInt(filters.minBudget) || 0;
        const maxPrice = parseInt(filters.maxBudget) || Infinity;

        if (artistPrice >= minPrice && artistPrice <= maxPrice) {
          const rangeMid = (minPrice + maxPrice) / 2;
          const deviation = Math.abs(artistPrice - rangeMid);
          const budgetScore = Math.max(1, 5 - (deviation / 10000));
          score += budgetScore;
          matchDetails.push(`Budget match (${budgetScore.toFixed(1)} points)`);
        }
      }

      // Quality Bonuses
      if (artist.verificationStatus === 'verified') {
        score += 2;
        matchDetails.push('Verified artist');
      }
      if (artist.trending) {
        score += 1;
        matchDetails.push('Trending artist');
      }

      return {
        ...artist,
        relevanceScore: score,
        matchDetails: matchDetails
      };
    });
    
    // If a category is selected, group and sort artists by category match first
    if (selectedCategoryData && selectedCategoryData.name) {
      const categoryName = selectedCategoryData.name.toLowerCase();
      scoredArtists.sort((a, b) => {
        const aCat = (a.category || '').toLowerCase() === categoryName ? 1 : 0;
        const bCat = (b.category || '').toLowerCase() === categoryName ? 1 : 0;
        if (bCat !== aCat) return bCat - aCat; // Group matching category at top
        // Within group, sort by relevance, then rating, then completed events
        if (b.relevanceScore !== a.relevanceScore) return b.relevanceScore - a.relevanceScore;
        const ratingA = a.rating?.average || a.rating || 0;
        const ratingB = b.rating?.average || b.rating || 0;
        if (ratingB !== ratingA) return ratingB - ratingA;
        const eventsA = a.completedEvents || 0;
        const eventsB = b.completedEvents || 0;
        return eventsB - eventsA;
      });
    } else {
      // Default: sort by relevance, then rating, then completed events
      scoredArtists.sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) return b.relevanceScore - a.relevanceScore;
        const ratingA = a.rating?.average || a.rating || 0;
        const ratingB = b.rating?.average || b.rating || 0;
        if (ratingB !== ratingA) return ratingB - ratingA;
        const eventsA = a.completedEvents || 0;
        const eventsB = b.completedEvents || 0;
        return eventsB - eventsA;
      });
    }
    
    // Apply alternative sorting if specifically selected
    if (filters.sortBy === 'price-low') {
      scoredArtists.sort((a, b) => (a.budget || 0) - (b.budget || 0));
    } else if (filters.sortBy === 'price-high') {
      scoredArtists.sort((a, b) => (b.budget || 0) - (a.budget || 0));
    } else if (filters.sortBy === 'rating') {
      scoredArtists.sort((a, b) => {
        const ratingA = a.rating?.average || a.rating || 0;
        const ratingB = b.rating?.average || b.rating || 0;
        
        if (ratingA !== ratingB) {
          return ratingB - ratingA;
        }
        
        const reviewsA = a.rating?.count || a.reviews || 0;
        const reviewsB = b.rating?.count || b.reviews || 0;
        return reviewsB - reviewsA;
      });
    } else if (filters.sortBy === 'experience') {
      scoredArtists.sort((a, b) => {
        const experienceOrder = { '0-1': 0, '1-3': 1, '3-5': 2, '5-10': 3, '10+': 4 };
        const expA = experienceOrder[a.experience] || 0;
        const expB = experienceOrder[b.experience] || 0;
        
        if (expA !== expB) {
          return expB - expA;
        }
        
        const eventsA = a.completedEvents || 0;
        const eventsB = b.completedEvents || 0;
        return eventsB - eventsA;
      });
    }
    
    // Log scoring details for debugging
    if (filters.location || filters.skill || filters.subcategory !== 'all' || filters.minBudget || filters.maxBudget || selectedCategoryData) {
      console.log('🎯 Filter Results - Top 5 Artists:');
      scoredArtists.slice(0, 5).forEach((artist, index) => {
        console.log(`${index + 1}. ${artist.fullName} - Score: ${artist.relevanceScore} - ${artist.matchDetails.join(', ')}`);
      });
    }
    
    setDisplayArtists(scoredArtists);
  }, [artists, filters, selectedCategoryData]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-full" style={{ backgroundColor: config.background_color }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading artists...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 min-h-full" style={{ backgroundColor: config.background_color }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load artists</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const clearFilters = () => {
    setFilters({
      location: '',
      minBudget: '',
      maxBudget: '',
      subcategory: 'all',
      skill: '',
      sortBy: 'relevance'
    });
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Category selection handler
  const handleCategorySelect = (categoryKey) => {
    console.log('🎯 Category selected:', categoryKey);
    
    if (allCategoriesData[categoryKey]) {
      const categoryData = allCategoriesData[categoryKey];
      console.log('📝 Category data:', categoryData.name);
      
      setSelectedCategoryData(categoryData);
      setExpandedCategory(expandedCategory === categoryKey ? null : categoryKey); // Toggle dropdown
      setSelectedSubcategory('All Subcategories');
      setFilters(prev => ({ ...prev, subcategory: 'all' }));
      
      console.log('✅ Category selection completed:', categoryData.name);
    }
  };

  // Handle subcategory selection
  const handleSubcategorySelect = (option) => {
    setSelectedSubcategory(option.label);
    setFilters(prev => ({ ...prev, subcategory: option.value }));
    setExpandedCategory(null); // Close dropdown after selection
  };

  // Default category for demo
  const category = allCategoriesData.dancers || allCategoriesData.singers;

  console.log('🎯 Using category:', category?.name);
  console.log('🎨 Category color:', category?.color);

  return (
    <div className="pt-20 sm:pt-24 pb-10 sm:pb-16 min-h-full" style={{ backgroundColor: config?.background_color || '#f9fafb' }}>
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="flex flex-col md:block">
        {/* Left Sidebar - Filters - Fixed Position */}
        <div className="w-full md:fixed md:left-0 md:top-24 md:w-80 bg-white shadow-sm md:shadow-lg border-b md:border-b-0 md:border-r border-gray-200 z-30 md:z-30 md:h-[calc(100vh-6rem)]">
          <div className="p-4 md:h-full md:overflow-y-auto">
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              {(filters.location || filters.minBudget || filters.maxBudget || filters.subcategory !== 'all') && (
                <button 
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Horizontal Scrollable Categories */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
                <div className="relative">
                  {/* Gradient indicators for scroll */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
                  
                  {/* Horizontal scroll container */}
                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-2 pb-2" style={{ minWidth: 'max-content' }}>
                      {Object.entries(allCategoriesData).map(([key, cat]) => (
                        <div key={key} className="flex-shrink-0">
                          <button
                            onClick={() => handleCategorySelect(key)}
                            className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 min-w-[80px] ${
                              selectedCategoryData?.name === cat.name
                                ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105'
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                            }`}
                          >
                            <div className={`text-2xl mb-1 ${
                              selectedCategoryData?.name === cat.name ? 'animate-bounce' : ''
                            }`}>
                              {cat.icon}
                            </div>
                            <span className="text-xs font-medium text-center text-gray-700">
                              {cat.name}
                            </span>
                          </button>
                          
                          {/* Expandable Subcategory Dropdown */}
                          {expandedCategory === key && cat.subcategories && (
                            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden animate-fadeIn">
                              <div className="max-h-60 overflow-y-auto">
                                {Object.entries(cat.subcategories).map(([subKey, subcat]) => (
                                  <div key={subKey} className="border-b border-gray-100 last:border-b-0">
                                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm">{subcat.icon}</span>
                                        <span className="text-sm font-medium text-gray-900">{subcat.name}</span>
                                        <span className="text-xs text-gray-500">({subcat.items.length})</span>
                                      </div>
                                    </div>
                                    <div className="p-1">
                                      {subcat.items.map((item, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleSubcategorySelect({ 
                                            label: item, 
                                            value: item,
                                            icon: subcat.icon 
                                          })}
                                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                            selectedSubcategory === item || filters.subcategory === item
                                              ? 'bg-blue-100 text-blue-700 font-medium'
                                              : 'text-gray-700 hover:bg-gray-100'
                                          }`}
                                        >
                                          {item}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Category Display */}
              {selectedCategoryData && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Selected Style</h4>
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{selectedCategoryData.icon}</span>
                        <span className="text-sm font-medium text-blue-900">{selectedCategoryData.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCategoryData(null);
                          setExpandedCategory(null);
                          setSelectedSubcategory('All Subcategories');
                          setFilters(prev => ({ ...prev, subcategory: 'all' }));
                        }}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    {selectedSubcategory !== 'All Subcategories' && (
                      <div className="mt-2 text-xs text-blue-700">
                        Style: {selectedSubcategory}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Location Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Location</h4>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => updateFilter('location', e.target.value)}
                    placeholder="Search by city or area..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Budget Range</h4>
                <p className="text-xs text-gray-500 mb-2">Per event</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
                    <input
                      type="number"
                      value={filters.minBudget}
                      onChange={(e) => updateFilter('minBudget', e.target.value)}
                      placeholder="Min"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <span className="text-gray-400 text-center">—</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
                    <input
                      type="number"
                      value={filters.maxBudget}
                      onChange={(e) => updateFilter('maxBudget', e.target.value)}
                      placeholder="Max"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Specific Skills */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Specific Skills</h4>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={filters.skill || ''}
                    onChange={(e) => updateFilter('skill', e.target.value)}
                    placeholder="e.g., Classical, Bollywood..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - With Left Margin for Fixed Sidebar */}
        <div className="w-full md:ml-80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-6 mt-4 md:mt-0">
              <button 
                onClick={() => navigate && navigate('home')}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow hover:shadow-md flex items-center justify-center transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${category?.color || 'from-blue-500 to-purple-600'} flex items-center justify-center text-2xl sm:text-3xl shadow-lg`}>
                {category?.icon || '🎭'}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: config?.text_color || '#111827' }}>{pageTitle}</h1>
                <p className="text-sm sm:text-base text-gray-500">{pageDescription}</p>
              </div>
            </div>

            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">{pageTitle}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Showing {displayArtists.length} of {artists.length} artists</span>
                    {(filters.location || filters.minBudget || filters.maxBudget || filters.subcategory !== 'all' || filters.skill) && (
                      <>
                        <span>•</span>
                        <span className="text-blue-600 font-medium">Filters applied</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="text-sm text-gray-500">
                    Sort by:
                    <select 
                      value={filters.sortBy || 'relevance'}
                      onChange={(e) => updateFilter('sortBy', e.target.value)}
                      className="ml-2 w-full sm:w-auto text-sm border border-gray-300 rounded-md px-3 py-2 sm:py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Rating: High to Low</option>
                      <option value="experience">Experience: High to Low</option>
                    </select>
                  </div>
                  {(filters.location || filters.minBudget || filters.maxBudget || filters.subcategory !== 'all' || filters.skill) && (
                    <button 
                      onClick={clearFilters}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
              
              {/* Active Filters Display */}
              {(filters.location || filters.minBudget || filters.maxBudget || filters.subcategory !== 'all' || filters.skill) && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500 font-medium">Active filters:</span>
                    {filters.location && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                        📍 {filters.location}
                        <button 
                          onClick={() => updateFilter('location', '')}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {(filters.minBudget || filters.maxBudget) && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                        💰 {filters.minBudget || '0'} - {filters.maxBudget || '∞'}
                        <button 
                          onClick={() => { updateFilter('minBudget', ''); updateFilter('maxBudget', ''); }}
                          className="text-green-500 hover:text-green-700"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.subcategory && filters.subcategory !== 'all' && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                        🎭 {filters.subcategory}
                        <button 
                          onClick={() => updateFilter('subcategory', 'all')}
                          className="text-purple-500 hover:text-purple-700"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.skill && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full flex items-center gap-1">
                        🎨 {filters.skill}
                        <button 
                          onClick={() => updateFilter('skill', '')}
                          className="text-orange-500 hover:text-orange-700"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Artists Grid - Row Wise Full Width */}
            {displayArtists.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:gap-4 w-full min-w-0">
                {displayArtists.map((artist, index) => (
                  <div 
                    key={artist._id || artist.id || index}
                    className="w-full min-w-0"
                  >
                    {ArtistCard && <ArtistCard artist={artist} config={config || {}} fullWidth={true} onRefresh={handleArtistRefresh} />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No artists found</h3>
                <p className="text-gray-600 mb-4">
                  {loading ? 'Loading artists...' : 'No artists found matching your criteria'}
                </p>
                <button 
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
