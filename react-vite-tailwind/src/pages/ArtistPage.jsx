import { useRouter } from '../contexts/RouterContext';
import { artists } from '../data/mockData';

const ArtistPage = ({ config }) => {
  const { params, navigate } = useRouter();
  const artist = params.artist || artists[0];

  // Handle both backend and mock data structures
  const artistName = artist.fullName || artist.name || `${artist.firstName || ''} ${artist.lastName || ''}`.trim() || 'Artist Name';
  const artistSpecialty = artist.subcategory || artist.specialty || artist.skills?.[0] || 'Professional Artist';
  const artistRating = Number(artist.rating?.average || artist.rating || 0);
  const artistReviews = artist.rating?.count || artist.reviews || 0;
  const artistPrice = artist.budget ? `₹${artist.budget.toLocaleString()}` : artist.price || 'Price on request';
  const artistImage = artist.profileImage || artist.image || '👤';
  const artistLocation = artist.location || 'Location not specified';
  const artistBio = artist.bio || `${artistName} is a highly skilled ${artistSpecialty} professional with years of experience in the industry.`;
  const isVerified = artist.verificationStatus === 'verified' || artist.verified;

  return (
    <div className="pt-24 pb-16 min-h-full" style={{ backgroundColor: config.background_color }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('home')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fadeIn">
          {/* Hero */}
          <div className="relative h-64 bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <span className="text-8xl">{artistImage}</span>
            {isVerified && (
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-semibold flex items-center gap-2">
                ✓ Verified Artist
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{artistName}</h1>
                <p className="text-lg text-gray-500 mt-1">{artistSpecialty}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500 text-xl">⭐</span>
                    <span className="font-bold text-lg">{artistRating.toFixed(1)}</span>
                    <span className="text-gray-400">({artistReviews} reviews)</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-600">{artist.category}</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-600">{artistLocation}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold" style={{ color: config.primary_action }}>
                  {artistPrice}
                </div>
                <button
                  className="mt-3 px-8 py-3 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  style={{ backgroundColor: config.primary_action }}
                >
                  Book Now
                </button>
              </div>
            </div>

            {/* About */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">
                {artistBio}
              </p>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { label: 'Projects', value: Math.floor(artistReviews * 1.5) },
                { label: 'Happy Clients', value: artistReviews },
                { label: 'Years Active', value: Math.floor(artistRating * 2) }
              ].map((stat, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold" style={{ color: config.primary_action }}>
                    {stat.value}+
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="flex-1 min-w-[140px] px-6 py-3 rounded-full font-medium border-2 border-gray-200 hover:border-brand-500 transition-colors">
                💬 Message
              </button>
              <button className="flex-1 min-w-[140px] px-6 py-3 rounded-full font-medium border-2 border-gray-200 hover:border-brand-500 transition-colors">
                ❤️ Save
              </button>
              <button className="flex-1 min-w-[140px] px-6 py-3 rounded-full font-medium border-2 border-gray-200 hover:border-brand-500 transition-colors">
                📤 Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistPage;
