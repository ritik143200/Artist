import { useRouter } from '../contexts/RouterContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import ArtistInquiry from './ArtistInquiry';

const ArtistCard = ({ artist, config, fullWidth = false }) => {
  const { navigate } = useRouter();
  const { isAuthenticated } = useAuth();
  const [showInquiry, setShowInquiry] = useState(false);

  console.log('🔄 ArtistCard rendered, showInquiry:', showInquiry);

  // Handle both backend and mock data structures
  const artistName = artist.fullName ||
    `${artist.firstName || ''} ${artist.lastName || ''}`.trim() ||
    artist.name ||
    'Artist Name';
  const artistSpecialty = artist.subcategory || artist.specialty || artist.skills?.[0] || 'Professional Artist';
  const artistRating = typeof artist.rating?.average === 'number' ? artist.rating.average :
    typeof artist.rating === 'number' ? artist.rating :
      0;
  const artistReviews = typeof artist.rating?.count === 'number' ? artist.rating.count :
    typeof artist.reviews === 'number' ? artist.reviews :
      0;
  // Enhanced budget handling with string conversion
  const budgetMin = artist.budgetMin ? (typeof artist.budgetMin === 'string' ? parseInt(artist.budgetMin) : artist.budgetMin) : null;
  const budgetMax = artist.budgetMax ? (typeof artist.budgetMax === 'string' ? parseInt(artist.budgetMax) : artist.budgetMax) : null;
  const budget = artist.budget ? (typeof artist.budget === 'string' ? parseInt(artist.budget) : artist.budget) : null;

  const artistPrice = budgetMin && budgetMax
    ? `₹${budgetMin.toLocaleString()} - ₹${budgetMax.toLocaleString()}`
    : budgetMin && !budgetMax
      ? `Starting from ₹${budgetMin.toLocaleString()}`
      : budgetMax && !budgetMin
        ? `Upto ₹${budgetMax.toLocaleString()}`
        : budget
          ? `₹${budget.toLocaleString()}`
          : artist.price || 'Price on request';

  console.log('💰 Enhanced budget data:', {
    artist: artist.name || artist.fullName,
    originalBudgetMin: artist.budgetMin,
    originalBudgetMax: artist.budgetMax,
    originalBudget: artist.budget,
    convertedBudgetMin: budgetMin,
    convertedBudgetMax: budgetMax,
    convertedBudget: budget,
    artistPrice: artistPrice,
    budgetType: budgetMin && budgetMax ? 'Range' :
      budgetMin && !budgetMax ? 'Min Only' :
        budgetMax && !budgetMin ? 'Max Only' :
          budget ? 'Single' : 'None',
    budgetMinType: typeof artist.budgetMin,
    budgetMaxType: typeof artist.budgetMax,
    budgetTypeType: typeof artist.budget,
    priceType: typeof artist.price
  });
  // Improved image handling
  const artistImage = artist.profileImage || artist.image || 'https://picsum.photos/seed/artist-default/400/400.jpg';
  const isImageURL = typeof artistImage === 'string' && (
    artistImage.startsWith('http') ||
    artistImage.startsWith('/api/') ||
    artistImage.startsWith('data:') ||
    artistImage.startsWith('blob:')
  );
  const artistLocation = artist.location || 'Location not specified';
  const isVerified = artist.verificationStatus === 'verified' || artist.verified;

  // Ensure config has default values
  const themeConfig = {
    primary_color: config?.primary_color || '#ee7711',
    secondary_color: config?.secondary_color || '#ee7711',
    primary_action: config?.primary_action || '#ee7711',
    success_color: config?.success_color || '#ee7711',
    warning_color: config?.warning_color || '#f59e0b',
    text_primary: config?.text_primary || '#1f2937',
    text_secondary: config?.text_secondary || '#6b7280',
    text_muted: config?.text_muted || '#9ca3af',
    card_background: config?.card_background || '#ffffff'
  };

  // Category information
  const artistCategory = artist.category || artist.categoryName || 'Artist';
  const artistSubcategory = artist.subcategory || artist.specialty || 'Professional';
  const artistSubOptions = artist.subOptions || artist.styles || artist.skills || [];
  const artistGenre = artist.genre || artist.type || '';

  // Debug category values
  console.log('🏷️ Category Debug:', {
    artist: artist.name || artist.fullName,
    category: artist.category,
    categoryName: artist.categoryName,
    subcategory: artist.subcategory,
    specialty: artist.specialty,
    genre: artist.genre,
    type: artist.type,
    finalCategory: artistCategory,
    finalSubcategory: artistSubcategory,
    finalGenre: artistGenre
  });

  // Return modal if open
  if (showInquiry) {
    return <ArtistInquiry artist={artist} config={config} onClose={() => setShowInquiry(false)} />;
  }

  // Full width layout (row-wise)
  if (fullWidth) {
    return (
      <div
        onClick={() => navigate('artist', { artist })}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:border-blue-200"
      >
        <div className="flex items-start gap-8">
          {/* Artist Image */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <div className="relative" style={{ width: '140px', aspectRatio: '1/1.54' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner">
                  {isImageURL ? (
                    <img
                      src={artistImage}
                      alt={artistName}
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center" style={{ display: isImageURL ? 'none' : 'flex' }}>
                    <span className="text-5xl text-gray-400">👤</span>
                  </div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="absolute -top-2 -right-2 flex flex-col gap-2">
                {isVerified && (
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {artist.trending && (
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xs">🔥</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Artist Info */}
          <div className="flex-1 min-w-0">
            {/* Category Breadcrumb */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="px-3 py-1 text-xs font-semibold rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${themeConfig.primary_color}, ${themeConfig.secondary_color})`,
                  color: 'white'
                }}
              >
                {artistCategory}
              </span>
              <svg className="w-3 h-3" style={{ color: themeConfig.text_muted }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span
                className="px-3 py-1 text-xs font-semibold rounded-full"
                style={{
                  backgroundColor: `${themeConfig.secondary_color}10`,
                  color: themeConfig.secondary_color
                }}
              >
                {artistSubcategory}
              </span>
              {artistGenre && (
                <>
                  <svg className="w-3 h-3" style={{ color: themeConfig.text_muted }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span
                    className="px-3 py-1 text-xs font-semibold rounded-full"
                    style={{
                      backgroundColor: `${themeConfig.primary_color}10`,
                      color: themeConfig.primary_color
                    }}
                  >
                    {artistGenre}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold truncate" style={{ color: config.text_primary }}>{artistName}</h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isVerified && (
                      <span
                        className="px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1"
                        style={{
                          backgroundColor: `${config.success_color}10`,
                          color: config.success_color
                        }}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    )}
                    {artist.trending && (
                      <span
                        className="px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1"
                        style={{
                          backgroundColor: `${config.warning_color}10`,
                          color: config.warning_color
                        }}
                      >
                        🔥 Trending
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-lg mb-3 font-medium" style={{ color: config.text_secondary }}>{artistSpecialty}</p>

                {/* Sub-options/Styles */}
                {artistSubcategory && (
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-wide font-medium mb-2" style={{ color: config.text_muted }}>Specializations</p>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className="px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1"
                        style={{
                          background: `linear-gradient(135deg, ${config.primary_color}05, ${config.secondary_color}05)`,
                          color: config.primary_color,
                          border: `1px solid ${config.primary_color}20`
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.primary_color }}></span>
                        {artistSubcategory}
                      </span>
                      <span
                        className="px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1"
                        style={{
                          background: `linear-gradient(135deg, ${config.primary_color}05, ${config.secondary_color}05)`,
                          color: config.primary_color,
                          border: `1px solid ${config.primary_color}20`
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.primary_color }}></span>
                        Professional
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm" style={{ color: config.warning_color }}>⭐</span>
                      <span className="font-bold" style={{ color: config.text_primary }}>{artistRating.toFixed(1)}</span>
                    </div>
                    <span style={{ color: config.text_muted }}>({artistReviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1" style={{ color: config.text_muted }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{artistLocation}</span>
                  </div>
                  {artist.experience && (
                    <div className="flex items-center gap-1" style={{ color: config.text_muted }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{artist.experience} years</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price and Action */}
              <div className="text-right flex-shrink-0 ml-6">
                <div className="mb-2">
                  <p className="text-xs uppercase tracking-wide font-medium mb-1" style={{ color: themeConfig.text_muted }}>Starting From</p>
                  <div
                    className="text-3xl font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${themeConfig.primary_color}, ${themeConfig.secondary_color})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: themeConfig.primary_color, // Fallback for browsers that don't support text gradient
                      fontSize: '1.875rem',
                      fontWeight: '700'
                    }}
                  >
                    {artistPrice}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (artist._id || artist.id) {
                        navigate(`/artist/${artist._id || artist.id}`);
                      } else {
                        navigate('artist', { artist });
                      }
                    }}
                    className="px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${themeConfig.primary_action}, ${themeConfig.primary_color})`,
                      color: 'white',
                      border: 'none',
                      fontWeight: '700',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}
                    onMouseEnter={(e) => {
                      console.log('🎨 Button hover - themeConfig:', themeConfig);
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = `0 15px 35px -5px ${themeConfig.primary_action}40`;
                      e.currentTarget.style.background = `linear-gradient(135deg, ${themeConfig.primary_color}, ${themeConfig.secondary_color})`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = `0 10px 25px -5px ${themeConfig.primary_action}30`;
                      e.currentTarget.style.background = `linear-gradient(135deg, ${themeConfig.primary_action}, ${themeConfig.primary_color})`;
                    }}
                  >
                    View Profile
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('🎯 Contact button clicked!');
                      if (!isAuthenticated) {
                        navigate('auth');
                        return;
                      }
                      console.log('🔄 Before setShowInquiry:', showInquiry);
                      setShowInquiry(true);
                      console.log('🔄 After setShowInquiry call');
                    }}
                    className="px-6 py-2 rounded-xl font-bold transition-all duration-300 relative z-10"
                    style={{
                      border: `2px solid ${themeConfig.primary_action}`,
                      color: themeConfig.primary_action,
                      backgroundColor: 'transparent',
                      fontWeight: '600',
                      letterSpacing: '0.3px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${themeConfig.primary_action}15`;
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = `0 8px 25px -5px ${themeConfig.primary_action}25`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>

            {/* Bio/Description */}
            {artist.bio && (
              <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: `${config.primary_color}05` }}>
                <p className="text-sm line-clamp-2" style={{ color: config.text_secondary }}>{artist.bio}</p>
              </div>
            )}

            {/* Stats Row */}
            <div className="mt-4 flex items-center gap-8 pt-4" style={{ borderTop: `1px solid ${config.primary_color}10` }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.success_color }}></div>
                <span className="text-sm" style={{ color: config.text_secondary }}>Available for bookings</span>
              </div>
              {artist.completedEvents && (
                <div className="text-sm" style={{ color: config.text_secondary }}>
                  <span className="font-semibold" style={{ color: config.text_primary }}>{artist.completedEvents}</span> events completed
                </div>
              )}
              {artist.responseTime && (
                <div className="text-sm" style={{ color: config.text_secondary }}>
                  Response time: <span className="font-semibold" style={{ color: config.text_primary }}>{artist.responseTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original card layout (grid)
  return (
    <div
      onClick={() => {
        if (artist._id || artist.id) {
          navigate(`/artist/${artist._id || artist.id}`);
        } else {
          navigate('artist', { artist });
        }
      }}
      className="flex-shrink-0 w-64 lg:w-72 bg-white rounded-2xl overflow-hidden shadow-lg card-hover cursor-pointer"
    >
      <div className="relative" style={{ aspectRatio: '1/1.54' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
          {isImageURL ? (
            <img
              src={artistImage}
              alt={artistName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="absolute inset-0 flex items-center justify-center" style={{ display: isImageURL ? 'none' : 'flex' }}>
            <span className="text-6xl">👤</span>
          </div>
        </div>
        {artist.trending && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-semibold">
            🔥 Trending
          </div>
        )}
        {isVerified && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
            ✓ Verified
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1">{artistName}</h3>
        <p className="text-sm text-gray-600 mb-3">{artistSpecialty}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500 text-sm">⭐</span>
            <span className="font-bold text-sm">{artistRating.toFixed(1)}</span>
            <span className="text-gray-400 text-xs">({artistReviews})</span>
          </div>
          <span className="text-lg font-bold text-brand-600">{artistPrice}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log('🔘 Profile button clicked for artist:', artist.name || artist.fullName);
            console.log('🆔 Artist ID:', artist._id || artist.id);
            console.log('📋 Full artist object:', artist);
            console.log('🎨 Grid button themeConfig:', themeConfig);
            navigate('artist', { artist });
          }}
          className="w-full py-2 rounded-lg font-bold text-sm transition-all hover:shadow-md transform hover:scale-105"
          style={{
            backgroundColor: themeConfig.primary_action,
            color: 'white',
            fontWeight: '700',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            border: 'none'
          }}
          onMouseEnter={(e) => {
            console.log('🎨 Grid button hover - themeConfig.primary_action:', themeConfig.primary_action);
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = `0 8px 25px -5px ${themeConfig.primary_action}40`;
            e.currentTarget.style.backgroundColor = themeConfig.primary_color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.backgroundColor = themeConfig.primary_action;
          }}
        >
          Profile
        </button>
      </div>
    </div>
  );

  // Return modal if open, otherwise the card
  if (showInquiry) {
    return <ArtistInquiry artist={artist} config={config} onClose={() => setShowInquiry(false)} />;
  }

  return (
    <div
      onClick={() => {
        console.log('🖱️ Container clicked for artist:', artist.name || artist.fullName);
        console.log('🆔 Artist ID:', artist._id || artist.id);
        navigate('artist', { artist });
      }}
      className="rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
      style={{
        backgroundColor: config.card_background,
        border: `1px solid ${config.primary_color}10`,
        boxShadow: `0 10px 30px -10px ${config.primary_color}15`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 20px 40px -10px ${config.primary_color}25`;
        e.currentTarget.style.borderColor = `${config.primary_color}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 10px 30px -10px ${config.primary_color}15`;
        e.currentTarget.style.borderColor = `${config.primary_color}10`;
      }}
    >
      {/* Grid layout content */}
      <div className="flex flex-col h-full">
        {/* Artist Image */}
        <div className="relative mb-4">
          <div className="relative" style={{ width: '100%', aspectRatio: '1/1.54' }}>
            <div className="absolute inset-0 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner"
              style={{
                background: `linear-gradient(135deg, ${config.primary_color}05, ${config.secondary_color}10)`
              }}
            >
              {isImageURL ? (
                <img
                  src={artistImage}
                  alt={artistName}
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="text-4xl" style={{ display: isImageURL ? 'none' : 'flex' }}>
                {artistImage}
              </div>
            </div>
          </div>
        </div>

        {/* Artist Info */}
        <div className="flex-1 flex flex-col">
          <h3 className="font-bold mb-1" style={{ color: config.text_primary }}>{artistName}</h3>
          <p className="text-sm mb-3" style={{ color: config.text_secondary }}>{artistSpecialty}</p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <span className="text-sm" style={{ color: themeConfig.warning_color }}>⭐</span>
              <span className="font-bold text-sm" style={{ color: themeConfig.text_primary }}>{artistRating.toFixed(1)}</span>
              <span className="text-xs" style={{ color: themeConfig.text_muted }}>({artistReviews})</span>
            </div>
            <span className="text-lg font-bold" style={{
              background: `linear-gradient(135deg, ${themeConfig.primary_color}, ${themeConfig.secondary_color})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: themeConfig.primary_color, // Fallback for browsers that don't support text gradient
              fontSize: '1.125rem',
              fontWeight: '700'
            }}>{artistPrice}</span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('artist', { artist });
              }}
              className="w-full py-2 rounded-lg font-medium text-sm transition-all hover:shadow-md transform hover:scale-105"
              style={{
                backgroundColor: config.primary_action,
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = `0 4px 15px -5px ${config.primary_action}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              View Profile
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('🎯 Contact button clicked (grid layout)!');
                if (!isAuthenticated) {
                  navigate('auth');
                  return;
                }
                console.log('🔄 Before setShowInquiry (grid):', showInquiry);
                setShowInquiry(true);
                console.log('🔄 After setShowInquiry call (grid)');
              }}
              className="w-full py-2 rounded-lg font-bold text-sm transition-all hover:shadow-md transform hover:scale-105 relative z-10"
              style={{
                border: `2px solid ${themeConfig.primary_action}`,
                color: themeConfig.primary_action,
                backgroundColor: 'transparent',
                fontWeight: '600',
                letterSpacing: '0.3px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${themeConfig.primary_action}15`;
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = `0 8px 25px -5px ${themeConfig.primary_action}25`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
