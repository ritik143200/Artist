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
  const isImageURL = typeof artistImage === 'string' && (artistImage.startsWith('http') || artistImage.startsWith('/api/') || artistImage.startsWith('blob:'));

  const artistLocation = artist.location || 'Location not specified';
  const artistBio = artist.bio || `${artistName} is a highly skilled ${artistSpecialty} professional with years of experience in the industry.`;
    const isVerified = artist.verificationStatus === 'verified' || artist.verified;

  const showsHosted = Math.floor(artistReviews * 1.5) || 156;
  const happyClients = artistReviews || '120+';
  const experienceYears = artist.experience || '8+';

  return (
    <div className="pt-24 pb-16 min-h-full" style={{ backgroundColor: config.background_color }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('home')}
          className="mb-4 flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Content Area (Left side) */}
          <div className="flex-1 min-w-0">
            {/* Hero / Cover Image */}
            <div className="relative h-[250px] md:h-[300px] bg-gray-900 rounded-[2rem] overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1516280440503-6c9fa5c6a33b?q=80&w=2000&auto=format&fit=crop"
                alt="Cover"
                className="w-full h-full object-cover opacity-60"
              />

              {/* Action Buttons Overlay */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition border border-white/30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-5l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                </button>
                <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition border border-white/30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>
              </div>
            </div>

            {/* Profile Header Info */}
            <div className="relative px-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Profile Image - Overlapping */}
                <div className="relative -mt-16 sm:-mt-24 z-10 flex-shrink-0">
                  <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] rounded-3xl bg-white p-2 shadow-sm border border-gray-100">
                    <div className="w-full h-full bg-blue-50 rounded-2xl overflow-hidden flex items-center justify-center">
                      {isImageURL ? (
                        <img src={artistImage} alt={artistName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl">👤</span>
                      )}
                    </div>
                  </div>
                  {isVerified && (
                    <div className="absolute bottom-2 right-2 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Name & Titles */}
                <div className="pt-2 md:pt-4 flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h1 className="text-3xl font-extrabold text-blue-950 tracking-tight">{artistName}</h1>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold rounded-full flex items-center gap-1.5 uppercase tracking-wide">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Featured Artist
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-bold text-orange-500 uppercase tracking-widest text-[11px]">{artistSpecialty}</span>

                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>

                    <span className="text-gray-700 flex items-center gap-1 font-bold">
                      <svg className="w-4 h-4 text-yellow-400 mb-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {numericRating.toFixed(1)}
                      <span className="text-gray-400 font-medium text-xs ml-0.5">({artistReviews} reviews)</span>
                    </span>

                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>

                    <span className="text-gray-500 flex items-center gap-1 font-medium">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {artistLocation}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 px-2">
              <div className="bg-white rounded-3xl p-6 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <button
                  className="mt-3 px-8 py-3 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  style={{ backgroundColor: config.primary_action }}
                >
                  Book Now
                </button>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="mt-10 border-b border-gray-200">
              <nav className="flex gap-8 px-2 overflow-x-auto no-scrollbar">
                {['Overview', 'Portfolio', 'Reviews', 'Services'].map((tab, idx) => (
                  <button
                    key={tab}
                    className={`pb-4 text-xs font-black tracking-wider uppercase whitespace-nowrap border-b-2 transition-colors ${idx === 0 ? 'text-gray-900 border-orange-500' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content: Overview */}
            <div className="py-8 px-2">
              <h2 className="text-lg font-extrabold text-blue-950 flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Artist Biography
              </h2>
              <div className="text-gray-600 leading-relaxed text-[15px] max-w-2xl font-medium">
                <p>{artistBio}</p>
                {/* Fallback bio if empty or too short */}
                {artistBio.length < 50 && (
                  <p className="mt-2">Known for a commanding stage presence and fluent bilingual delivery, providing a memorable experience for all audiences. With extensive experience hosting high-profile summits, cultural festivals, and official ceremonies.</p>
                )}
              </div>

              {/* Areas of Expertise */}
              <div className="mt-10">
                <h3 className="text-[11px] font-black tracking-widest text-gray-400 uppercase mb-4">Areas of Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {['Anchor', 'Public Speaker', 'Event Host', 'Voice Over', 'Moderator'].map((skill) => (
                    <span key={skill} className="px-5 py-2.5 bg-white border border-gray-100 rounded-full text-xs font-extrabold text-gray-600 shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Media Placeholders (Showreel & Gallery) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <button className="h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition hover:border-blue-300 group">
                  <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 0a10 10 0 100 20 10 10 0 000-20zm-2 14.5v-9l6 4.5-6 4.5z" /></svg>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Watch Showreel</span>
                </button>

                <button className="h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition hover:border-blue-300 group">
                  <svg className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">View Gallery</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Area (Right Drop) */}
          <div className="w-full lg:w-[380px] lg:flex-shrink-0 lg:mt-6">
            <div className="sticky top-24 space-y-4">

              {/* Main Booking Card */}
              <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">

                {/* Price Section */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Professional Fee</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-gray-500 font-medium">Starts @</span>
                      <span className="text-3xl font-black text-blue-950">Quote</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 font-bold text-xl">
                    $
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <div className="bg-gray-50/80 rounded-2xl p-4 flex gap-3">
                    <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                      <div className="text-sm font-bold text-gray-900">Swift Response</div>
                      <div className="text-xs text-gray-500 mt-0.5">Replies in less than 2 hours</div>
                    </div>
                  </div>
                  <div className="bg-gray-50/80 rounded-2xl p-4 flex gap-3">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    <div>
                      <div className="text-sm font-bold text-gray-900">Secure Booking</div>
                      <div className="text-xs text-gray-500 mt-0.5">100% Payment Protection</div>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <button className="w-full py-4 bg-[#111827] text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-gray-800 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Check Availability
                  </button>
                  <button className="w-full py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-colors flex justify-center items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Send Inquiry
                  </button>
                </div>

                {/* Trusted Brands */}
                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Trusted By Brands</div>
                  <div className="flex justify-center gap-4 opacity-40">
                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                  </div>
                </div>
              </div>

              {/* Extra Badge Layout */}
              <div className="bg-orange-50 border border-orange-100 rounded-[2rem] p-6 flex items-start gap-4">
                <div className="text-orange-500 bg-white rounded-full p-2 shadow-sm border border-orange-100 flex-shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM6.155 10.428a.5.5 0 01.353-.122l2.427.243.682-2.31a.5.5 0 01.956 0l.682 2.31 2.427-.243a.5.5 0 01.293.896l-1.95 1.54 1.14 2H11a.5.5 0 01-.83-.342L9 12.3l-1.17 1.745a.5.5 0 01-.83.342l1.14-2-1.95-1.54a.5.5 0 01-.035-.42zM10 5a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 mb-1">Top Tier Talent</h4>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">This artist is among the top 5% of event hosts in Indore based on client feedback.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArtistPage;
