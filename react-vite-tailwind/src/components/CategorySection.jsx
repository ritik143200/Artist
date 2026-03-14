import { useEffect, useRef, useState } from 'react';
import ArtistCard from './ArtistCard';
import { useRouter } from '../contexts/RouterContext';

const CategorySection = ({ category, config }) => {
  const scrollRef = useRef(null);
  const { navigate } = useRouter();
  const [categoryArtists, setCategoryArtists] = useState([]);
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
        
        // Update the specific artist in the categoryArtists array
        setCategoryArtists(prev => prev.map(artist => 
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

    const getArtistScore = (artist) => {
      const ratingValue = normalizeNumber(artist?.rating?.average ?? artist?.rating ?? 0);
      const ratingCount = normalizeNumber(artist?.rating?.count ?? artist?.reviews ?? 0);
      const profileViews = normalizeNumber(artist?.profileViews ?? 0);
      return ratingValue * 1000 + ratingCount * 10 + profileViews;
    };

    const fetchCategoryArtists = async () => {
      try {
        setLoading(true);

        const categoryName = encodeURIComponent(category.name);
        const endpoints = [
          `${API_BASE_URL}/api/artists?category=${categoryName}`,
          `${API_BASE_URL}/api/artist/search?category=${categoryName}&limit=24&page=1`
        ];

        let fetchedArtists = [];
        let lastError = null;

        for (const endpoint of endpoints) {
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
          .sort((a, b) => getArtistScore(b) - getArtistScore(a))
          .slice(0, 12);

        if (isMounted) {
          setCategoryArtists(rankedArtists);
        }
      } catch (error) {
        if (error?.name !== 'AbortError') {
          console.error(`Failed to fetch artists for ${category.name}:`, error);
          if (isMounted) {
            setCategoryArtists([]);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategoryArtists();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [API_BASE_URL, category.name]);

  // Always render the section. Show a message if no artists are found.
  const showNoArtists = !loading && categoryArtists.length === 0;

  const artistCount = loading ? category.count || 0 : categoryArtists.length;

  return (
    <section className="py-10 lg:py-14" style={{ backgroundColor: config.surface_color }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl shadow-lg`}>
              {category.icon}
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold" style={{ color: config.text_color }}>
                {category.name}
              </h2>
              <p className="text-sm text-gray-500">{artistCount.toLocaleString()} artists</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('category', { category })}
            className="text-sm font-semibold hover:underline transition-colors"
            style={{ color: config.primary_action }}
          >
            View All →
          </button>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto hide-scrollbar pb-4"
        >
          {loading &&
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`category-skeleton-${category.id}-${index}`}
                className="w-64 lg:w-72 rounded-2xl border p-4 animate-pulse flex-shrink-0"
                style={{
                  backgroundColor: config.surface_color,
                  borderColor: `${config.secondary_action}24`
                }}
              >
                <div className="h-52 rounded-xl mb-4" style={{ backgroundColor: `${config.secondary_action}18` }}></div>
                <div className="h-4 rounded mb-2 w-2/3" style={{ backgroundColor: `${config.secondary_action}20` }}></div>
                <div className="h-3 rounded mb-3 w-1/2" style={{ backgroundColor: `${config.secondary_action}18` }}></div>
                <div className="h-9 rounded-lg" style={{ backgroundColor: `${config.secondary_action}14` }}></div>
              </div>
            ))}

          {!loading && categoryArtists.map((artist, index) => (
            <div
              key={artist._id || artist.id || `${category.id}-${index}`}
              className="animate-slideIn"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <ArtistCard artist={artist} config={config} variant="trendingCompact" onRefresh={handleArtistRefresh} />
            </div>
          ))}
        </div>
          {showNoArtists && (
            <div className="w-full text-center text-gray-400 py-8">
              This category data not found.
            </div>
          )}
      </div>
    </section>
  );
};

export default CategorySection;
