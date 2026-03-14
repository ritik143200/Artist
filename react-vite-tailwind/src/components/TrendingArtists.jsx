import { useEffect, useRef, useState } from 'react';
import ArtistCard from './ArtistCard';

const TrendingArtists = ({ config }) => {
  const scrollRef = useRef(null);
  const [trendingArtists, setTrendingArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001').replace(/\/$/, '');

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
        
        // Update the specific artist in the trendingArtists array
        setTrendingArtists(prev => prev.map(artist => 
          (artist._id === artistId || artist.id === artistId) 
            ? { ...artist, ...updatedArtist.data || updatedArtist }
            : artist
        ));
      }
    } catch (error) {
      console.log('Failed to refresh artist:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const normalizeNumber = (value) => {
      if (typeof value === 'number' && Number.isFinite(value)) return value;
      if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return Number.isFinite(parsed) ? parsed : 0;
      }
      return 0;
    };

    const getTrendingScore = (artist) => {
      const ratingValue = normalizeNumber(artist?.rating?.average ?? artist?.rating ?? 0);
      const ratingCount = normalizeNumber(artist?.rating?.count ?? artist?.reviews ?? 0);
      const profileViews = normalizeNumber(artist?.profileViews ?? 0);
      return ratingValue * 1000 + ratingCount * 10 + profileViews;
    };

    const fetchTrendingArtists = async () => {
      try {
        setLoading(true);

        const candidateEndpoints = [
          `${API_BASE_URL}/api/artist/search?limit=24&page=1`,
          `${API_BASE_URL}/api/artists`
        ];

        let fetchedArtists = [];
        let lastError = null;

        for (const endpoint of candidateEndpoints) {
          try {
            const response = await fetch(endpoint, {
              signal: controller.signal,
              headers: {
                'Content-Type': 'application/json'
              }
            });

            let result = null;
            try {
              result = await response.json();
            } catch {
              result = null;
            }

            if (!response.ok || result?.success === false) {
              const message = result?.message || `HTTP ${response.status}: ${response.statusText}`;
              throw new Error(message);
            }

            const artistsFromResponse = Array.isArray(result?.data)
              ? result.data
              : Array.isArray(result?.artists)
                ? result.artists
                : [];

            if (artistsFromResponse.length > 0) {
              fetchedArtists = artistsFromResponse;
              break;
            }
          } catch (endpointError) {
            if (endpointError?.name === 'AbortError') {
              throw endpointError;
            }
            lastError = endpointError;
          }
        }

        if (!fetchedArtists.length && lastError) {
          throw lastError;
        }

        const rankedArtists = fetchedArtists
          .map((artist) => ({
            ...artist,
            trending: artist.trending ?? true
          }))
          .sort((a, b) => getTrendingScore(b) - getTrendingScore(a))
          .slice(0, 12);

        if (isMounted) {
          setTrendingArtists(rankedArtists);
        }
      } catch (error) {
        if (error?.name !== 'AbortError') {
          console.error('Failed to fetch trending artists:', error);
          if (isMounted) {
            setTrendingArtists([]);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTrendingArtists();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [API_BASE_URL]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 lg:py-16" style={{ backgroundColor: config.background_color }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: config.text_color }}>
              🔥 Trending Artists
            </h2>
            <p className="text-gray-500 mt-1">Most booked this week</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-white shadow hover:shadow-md flex items-center justify-center transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-white shadow hover:shadow-md flex items-center justify-center transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-4"
        >
          {loading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`trending-skeleton-${index}`}
                className="flex-shrink-0 w-[218px] sm:w-[228px] rounded-2xl border p-3.5 animate-pulse"
                style={{
                  backgroundColor: config.surface_color,
                  borderColor: `${config.secondary_action}24`
                }}
              >
                <div className="h-40 rounded-xl mb-3" style={{ backgroundColor: `${config.secondary_action}18` }}></div>
                <div className="h-3 rounded mb-2 w-3/4" style={{ backgroundColor: `${config.secondary_action}22` }}></div>
                <div className="h-2.5 rounded mb-3 w-1/2" style={{ backgroundColor: `${config.secondary_action}1A` }}></div>
                <div className="h-8 rounded" style={{ backgroundColor: `${config.secondary_action}14` }}></div>
              </div>
            ))}

          {!loading && trendingArtists.map((artist, index) => (
            <div
              key={artist._id || artist.id || `trending-${index}`}
              className="animate-fadeIn flex-shrink-0"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <ArtistCard 
                artist={artist} 
                config={config} 
                variant="trendingCompact" 
                onRefresh={handleArtistRefresh}
              />
            </div>
          ))}

          {!loading && trendingArtists.length === 0 && (
            <div
              className="w-full rounded-2xl border p-6 text-center"
              style={{
                backgroundColor: config.surface_color,
                borderColor: `${config.secondary_action}2A`,
                color: config.secondary_action
              }}
            >
              Trending artists are not available right now.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrendingArtists;
