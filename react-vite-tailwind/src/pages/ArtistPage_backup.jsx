import { useRouter } from '../contexts/RouterContext';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import ArtistInquiry from '../components/ArtistInquiry';
import ReviewModal from '../components/ReviewModal';

const ArtistPage = ({ config }) => {
  const { params, navigate } = useRouter();
  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001').replace(/\/$/, '');
  const { isAuthenticated } = useAuth();
  const [artistData, setArtistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const normalizeArtist = (fetchedArtist) => ({
    id: fetchedArtist._id || fetchedArtist.id,
    name: fetchedArtist.fullName || fetchedArtist.name || `${fetchedArtist.firstName || ''} ${fetchedArtist.lastName || ''}`.trim() || 'Artist Name',
    specialty: fetchedArtist.subcategory || fetchedArtist.specialty || fetchedArtist.skills?.[0] || 'Professional Artist',
    category: fetchedArtist.category || 'Entertainment',
    rating: Number(fetchedArtist.rating?.average || fetchedArtist.rating || 0),
    reviews: fetchedArtist.rating?.count || fetchedArtist.reviews || 0,
    budget: fetchedArtist.budgetMin && fetchedArtist.budgetMax
      ? `₹${fetchedArtist.budgetMin.toLocaleString()} - ₹${fetchedArtist.budgetMax.toLocaleString()}`
      : fetchedArtist.budgetMin && !fetchedArtist.budgetMax
        ? `Starting from ₹${fetchedArtist.budgetMin.toLocaleString()}`
        : fetchedArtist.budgetMax && !fetchedArtist.budgetMin
          ? `Upto ₹${fetchedArtist.budgetMax.toLocaleString()}`
          : fetchedArtist.budget
            ? `₹${fetchedArtist.budget.toLocaleString()}`
            : fetchedArtist.price || 'Price on request',
    location: fetchedArtist.location || 'Location not specified',
    bio: fetchedArtist.bio || fetchedArtist.description || 'No bio available for this artist.',
    experience: fetchedArtist.experience || 'Experience not specified',
    showsHosted: fetchedArtist.showsHosted || fetchedArtist.events || 0,
    happyClients: fetchedArtist.happyClients || fetchedArtist.clients || 0,
    responseTime: fetchedArtist.responseTime || 'Response time not specified',
    skills: fetchedArtist.skills || fetchedArtist.services || [],
    languages: fetchedArtist.languages || ['English'],
    portfolio: fetchedArtist.portfolio || [],
    socialLinks: fetchedArtist.socialLinks || {
      instagram: '#',
      facebook: '#',
      twitter: '#',
      website: '#'
    },
    verified: fetchedArtist.verified || false,
    trending: fetchedArtist.trending || false,
    image: fetchedArtist.profileImage || fetchedArtist.image || ''
  });

  useEffect(() => {
    const artistId = params.artistId || params.artist?._id || params.artist?.id;
    const normalizedArtistId = artistId !== undefined && artistId !== null ? String(artistId) : '';
    const isMongoObjectId = /^[a-fA-F0-9]{24}$/.test(normalizedArtistId);
    const controller = new AbortController();
    const fallbackArtist = params.artist ? normalizeArtist(params.artist) : null;

    const fetchArtistData = async () => {
      setLoading(true);
      try {
        if (!artistId && fallbackArtist) {
          setArtistData(fallbackArtist);
          return;
        }

        if (!artistId) {
          throw new Error('Artist ID is missing');
        }

        if (!isMongoObjectId && fallbackArtist) {
          setArtistData(fallbackArtist);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/artists/${encodeURIComponent(normalizedArtistId)}`, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        const fetchedArtist = result.artist || result.data;

        if (fetchedArtist) {
          setArtistData(normalizeArtist(fetchedArtist));
          return;
        }

        throw new Error('Artist data not found in response');
      } catch (error) {
        if (error?.name !== 'AbortError') {
          console.error('Error fetching artist data:', error);
        }

        if (fallbackArtist) {
          setArtistData(fallbackArtist);
        } else {
          setArtistData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();

    return () => {
      controller.abort();
    };
  }, [params.artist, params.artistId, API_BASE_URL]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-full flex items-center justify-center" style={{ backgroundColor: config.background_color }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading artist profile...</p>
        </div>
      </div>
    );
  }

  if (!artistData) {
    return (
      <div className="pt-24 pb-16 min-h-full flex items-center justify-center" style={{ backgroundColor: config.background_color }}>
        <div className="text-center">
          <p className="text-gray-600">Artist not found</p>
          <button
            onClick={() => navigate('home')}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isImageURL = typeof artistData.image === 'string' && (
  artistData.image.startsWith('http') || 
  artistData.image.startsWith('/api/') || 
  artistData.image.startsWith('blob:') ||
  artistData.image.startsWith('data:')
);

// Debug image handling
console.log('🖼️ Artist Image Debug:', {
  artistData,
  image: artistData.image,
  isImageURL,
  imageType: typeof artistData.image,
  imageStartsWith: artistData.image?.substring(0, 20)
});

  return (
    <div className="pt-24 pb-16 min-h-full" style={{ backgroundColor: config.background_color }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('home')}
          className="mb-6 flex items-center gap-2 transition-colors font-medium text-sm"
          style={{ color: config.text_muted }}
          onMouseEnter={(e) => e.currentTarget.style.color = config.text_primary}
          onMouseLeave={(e) => e.currentTarget.style.color = config.text_muted}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Artists
        </button>

        {/* Hero Section */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl mb-8"
          style={{
            background: `linear-gradient(135deg, ${config.primary_color} 0%, ${config.secondary_color} 100%)`,
            boxShadow: `0 20px 40px -10px ${config.primary_color}20`
          }}
        >
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <img
            src="https://images.unsplash.com/photo-1516280440503-6c9fa5c6a33b?q=80&w=2000&auto=format&fit=crop"
            alt="Artist Background"
            className="w-full h-64 object-cover opacity-30"
          />

          <div className="relative z-10 p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div
                  className="w-32 h-32 rounded-2xl p-2 shadow-lg"
                  style={{ backgroundColor: config.background_color }}
                >
                  <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center" style={{ backgroundColor: config.card_background }}>
                    {isImageURL && artistData.image ? (
                      <img 
                        src={artistData.image} 
                        alt={artistData.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log('❌ Image failed to load:', artistData.image);
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                        onLoad={() => {
                          console.log('✅ Image loaded successfully:', artistData.image);
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{ 
                        display: (isImageURL && artistData.image) ? 'none' : 'flex',
                        backgroundColor: config.card_background 
                      }}
                    >
                      <span className="text-5xl">🎭</span>
                    </div>
                  </div>
                </div>
                {artistData.verified && (
                  <div
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white border-2 shadow-lg"
                    style={{
                      backgroundColor: config.success_color,
                      borderColor: config.background_color
                    }}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Artist Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-white">{artistData.name}</h1>
                  {artistData.verified && (
                    <span
                      className="px-3 py-1 text-xs font-bold rounded-full"
                      style={{
                        backgroundColor: config.success_color,
                        color: 'white'
                      }}
                    >
                      ✓ Verified
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/90 mb-4">
                  <span className="font-semibold text-lg">{artistData.specialty}</span>
                  <span className="w-1 h-1 rounded-full bg-white/50"></span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {artistData.location}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/50"></span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {artistData.rating.toFixed(1)} ({artistData.reviews} reviews)
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-white/80 text-sm">
                  <span>🎭 {artistData.showsHosted} Shows Hosted</span>
                  <span>😊 {artistData.happyClients} Happy Clients</span>
                  <span>⏰ {artistData.responseTime} Response Time</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex-shrink-0 flex items-center gap-3">
                {/* Review Button - sticker style */}
                <button
                  className="px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${config.secondary_color} 0%, ${config.primary_color} 100%)`,
                    color: config.text_primary,
                    border: `2px solid ${config.primary_color}40`,
                    boxShadow: `0 4px 16px -4px ${config.primary_color}30`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = `0 10px 30px -5px ${config.primary_color}40`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = `0 4px 16px -4px ${config.primary_color}30`;
                  }}
                  onClick={() => setShowReviewModal(true)}
                >
                  <span role="img" aria-label="review">📝</span> Review
                </button>
                {/* Book Now Button (unchanged) */}
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('auth');
                      return;
                    }
                    setShowInquiryModal(true);
                  }}
                  className="px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  style={{
                    backgroundColor: config.primary_action,
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = `0 10px 30px -5px ${config.primary_action}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = `0 10px 20px -5px ${config.primary_action}30`;
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div 
              className="rounded-2xl p-8 shadow-lg"
              style={{ 
                backgroundColor: config.card_background,
                boxShadow: `0 10px 30px -10px ${config.primary_color}15`
              }}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: config.text_primary }}>
                <svg className="w-6 h-6" style={{ color: config.primary_color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About {artistData.name}
              </h2>
              <p className="leading-relaxed mb-6" style={{ color: config.text_secondary }}>
                {artistData.bio}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  className="text-center p-4 rounded-xl"
                  style={{ backgroundColor: `${config.primary_color}10` }}
                >
                  <div className="text-2xl font-bold" style={{ color: config.primary_color }}>{artistData.experience}</div>
                  <div className="text-sm" style={{ color: config.text_muted }}>Experience</div>
                </div>
                <div
                  className="text-center p-4 rounded-xl"
                  style={{ backgroundColor: `${config.success_color}10` }}
                >
                  <div className="text-2xl font-bold" style={{ color: config.success_color }}>{artistData.languages.length}</div>
                  <div className="text-sm" style={{ color: config.text_muted }}>Languages</div>
                </div>
                <div
                  className="text-center p-4 rounded-xl"
                  style={{ backgroundColor: `${config.secondary_color}10` }}
                >
                  <div className="text-2xl font-bold" style={{ color: config.secondary_color }}>{artistData.skills.length}</div>
                  <div className="text-sm" style={{ color: config.text_muted }}>Skills</div>
                </div>
                <div
                  className="text-center p-4 rounded-xl"
                  style={{ backgroundColor: `${config.warning_color}10` }}
                >
                  <div className="text-2xl font-bold" style={{ color: config.warning_color }}>{artistData.rating.toFixed(1)}</div>
                  <div className="text-sm" style={{ color: config.text_muted }}>Rating</div>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div 
              className="rounded-2xl p-8 shadow-lg"
              style={{ 
                backgroundColor: config.card_background,
                boxShadow: `0 10px 30px -10px ${config.primary_color}15`
              }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: config.text_primary }}>
                <svg className="w-6 h-6" style={{ color: config.success_color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-3">
                {artistData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:shadow-md"
                    style={{ 
                      background: `linear-gradient(135deg, ${config.primary_color}10, ${config.secondary_color}10)`,
                      color: config.text_primary,
                      border: `1px solid ${config.primary_color}20`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = config.primary_action + '10';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = config.surface_color;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages Section */}
            <div 
              className="rounded-2xl p-8 shadow-lg"
              style={{ 
                backgroundColor: config.card_background,
                boxShadow: `0 10px 30px -10px ${config.primary_color}15`
              }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: config.text_primary }}>
                <svg className="w-6 h-6" style={{ color: config.secondary_color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 8 19h8c-.07-3.39-3.783-8.23-4.249-14z" />
                </svg>
                Languages
              </h2>
              <div className="flex flex-wrap gap-3">
                {artistData.languages.map((language, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:shadow-md"
                    style={{ 
                      backgroundColor: `${config.secondary_color}10`,
                      color: config.secondary_color,
                      border: `1px solid ${config.secondary_color}20`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = config.secondary_action + '10';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = config.surface_color;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            {/* Portfolio Section */}
            <div 
              className="rounded-2xl p-8 shadow-lg"
              style={{ 
                backgroundColor: config.card_background,
                boxShadow: `0 10px 30px -10px ${config.primary_color}15`
              }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: config.text_primary }}>
                <svg className="w-6 h-6" style={{ color: config.warning_color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Portfolio
              </h2>
              {artistData.portfolio.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {artistData.portfolio.map((item, index) => (
                    <div
                      key={index}
                      className="relative group cursor-pointer rounded-xl overflow-hidden transition-all hover:shadow-xl"
                      style={{ boxShadow: `0 4px 15px -5px ${config.primary_color}20` }}
                    >
                      <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                      <div
                        className="absolute inset-0 transition-all rounded-xl"
                        style={{
                          background: `linear-gradient(to top, ${config.primary_color}80, transparent)`,
                          opacity: 0
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                      >
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white font-semibold">{item.title}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="text-center py-12 rounded-xl"
                  style={{ backgroundColor: `${config.primary_color}05` }}
                >
                  <p style={{ color: config.text_muted }}>Portfolio coming soon...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Booking Card */}
            <div 
              className="rounded-2xl p-6 shadow-lg sticky top-24"
              style={{ 
                backgroundColor: config.card_background,
                boxShadow: `0 10px 30px -10px ${config.primary_color}15`
              }}
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold mb-2" style={{ color: config.primary_action }}>{artistData.budget}</div>
                <div className="text-sm" style={{ color: config.text_muted }}>Starting price</div>
              </div>

              <div className="space-y-3 mb-6">
                <div
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: `${config.success_color}10` }}
                >
                  <svg className="w-5 h-5" style={{ color: config.success_color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: config.text_primary }}>Available</div>
                    <div className="text-xs" style={{ color: config.text_muted }}>Ready for booking</div>
                  </div>
                </div>
                <div
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: `${config.primary_color}10` }}
                >
                  <svg className="w-5 h-5" style={{ color: config.primary_color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: config.text_primary }}>Quick Response</div>
                    <div className="text-xs" style={{ color: config.text_muted }}>Replies in {artistData.responseTime}</div>
                  </div>
                </div>
                <div
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: `${config.secondary_color}10` }}
                >
                  <svg className="w-5 h-5" style={{ color: config.secondary_color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: config.text_primary }}>Secure Booking</div>
                    <div className="text-xs" style={{ color: config.text_muted }}>100% payment protection</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('auth');
                      return;
                    }
                    setShowInquiryModal(true);
                  }}
                  className="w-full py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  style={{
                    backgroundColor: config.primary_action,
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = `0 10px 30px -5px ${config.primary_action}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = `0 10px 20px -5px ${config.primary_action}30`;
                  }}
                >
                  Send Inquiry
                </button>
                <button
                  className="w-full py-3 rounded-xl font-bold transition-all"
                  style={{
                    border: `1px solid ${config.primary_color}30`,
                    color: config.text_primary,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${config.primary_color}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Check Availability
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div
              className="rounded-2xl p-6 shadow-lg"
              style={{
                backgroundColor: config.card_background,
                boxShadow: `0 10px 30px -10px ${config.primary_color}15`
              }}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: config.text_primary }}>Connect</h3>
              <div className="flex gap-3">
                <a
                  href={artistData.socialLinks.instagram}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:shadow-lg hover:scale-110"
                  style={{ backgroundColor: '#E4405F' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                  </svg>
                </a>
                <a
                  href={artistData.socialLinks.facebook}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:shadow-lg hover:scale-110"
                  style={{ backgroundColor: '#1877F2' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href={artistData.socialLinks.twitter}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:shadow-lg hover:scale-110"
                  style={{ backgroundColor: '#1DA1F2' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.006-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href={artistData.socialLinks.website}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:shadow-lg hover:scale-110"
                  style={{ backgroundColor: config.text_muted }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Artist Inquiry Modal */}
      {showInquiryModal && (
        <ArtistInquiry
          isOpen={showInquiryModal}
          onClose={() => setShowInquiryModal(false)}
          artist={{
            name: artistData.name,
            specialty: artistData.specialty,
            category: artistData.category,
            location: artistData.location,
            price: artistData.budget
          }}
          config={config}
        />
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmit={({ rating, review }) => {
            // TODO: Integrate backend API for review submission
            // For now, just log
            console.log('Review submitted:', { rating, review });
          }}
          config={config}
        />
      )}
    </div>
  );
};

export default ArtistPage;
