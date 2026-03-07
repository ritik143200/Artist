import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from '../contexts/RouterContext';
import { categories } from '../data/mockData';

const CategoryCircles = ({ config }) => {
  const scrollRef = useRef(null);
  const { navigate } = useRouter();
  const [dynamicCounts, setDynamicCounts] = useState({});
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

  const normalizeCategoryName = (value) => String(value || '').trim().toLowerCase();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchCategoryCounts = async () => {
      try {
        const endpoints = [
          `${API_BASE_URL}/api/artists/category-counts`,
          `${API_BASE_URL}/api/artists`
        ];

        let countMap = {};
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

            if (Array.isArray(result?.counts)) {
              countMap = result.counts.reduce((acc, item) => {
                const key = normalizeCategoryName(item?.category);
                const value = Number(item?.count) || 0;
                if (key) {
                  acc[key] = (acc[key] || 0) + value;
                }
                return acc;
              }, {});
              break;
            }

            const artistsFromResponse = Array.isArray(result?.artists)
              ? result.artists
              : Array.isArray(result?.data)
                ? result.data
                : [];

            if (artistsFromResponse.length > 0) {
              countMap = artistsFromResponse.reduce((acc, artist) => {
                const key = normalizeCategoryName(artist?.category);
                if (key) {
                  acc[key] = (acc[key] || 0) + 1;
                }
                return acc;
              }, {});
              break;
            }
          } catch (endpointError) {
            if (endpointError?.name === 'AbortError') {
              throw endpointError;
            }
            lastError = endpointError;
          }
        }

        if (!Object.keys(countMap).length && lastError) {
          throw lastError;
        }

        if (isMounted && Object.keys(countMap).length) {
          setDynamicCounts(countMap);
        }
      } catch (error) {
        if (error?.name !== 'AbortError') {
          console.error('Failed to fetch category counts:', error);
        }
      }
    };

    fetchCategoryCounts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [API_BASE_URL]);

  const resolvedCategories = useMemo(
    () =>
      categories.map((category) => {
        const key = normalizeCategoryName(category.name);
        const dynamicCount = dynamicCounts[key];
        return {
          ...category,
          count: typeof dynamicCount === 'number' ? dynamicCount : category.count
        };
      }),
    [dynamicCounts]
  );

  const totalArtists = resolvedCategories.reduce((total, category) => total + category.count, 0);

  const quickHighlights = [
    {
      id: 'verified',
      icon: '🛡️',
      title: 'Trusted Profiles',
      description: 'Explore curated artist profiles with clear specialties and transparent details.'
    },
    {
      id: 'fast',
      icon: '⚡',
      title: 'Faster Discovery',
      description: 'Navigate categories quickly and shortlist talent suited to your event style.'
    },
    {
      id: 'connect',
      icon: '🤝',
      title: 'Direct Connections',
      description: 'Move from discovery to inquiry in just a few clicks with a clean booking flow.'
    }
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 lg:py-16" style={{ backgroundColor: config.surface_color }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: config.text_color }}>
            Browse Categories
          </h2>
          <div className="hidden sm:flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto hide-scrollbar pb-4"
        >
          {resolvedCategories.map((cat, index) => (
            <button
              key={cat.id}
              onClick={() => navigate('category', { category: cat })}
              className="flex-shrink-0 group animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center text-4xl lg:text-5xl shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110`}>
                {cat.icon}
              </div>
              <div className="mt-3 text-center">
                <div className="font-semibold text-gray-900">{cat.name}</div>
                <div className="text-sm text-gray-500">{cat.count.toLocaleString()}</div>
              </div>
            </button>
          ))}
        </div>

        <div
          className="mt-10 lg:mt-12 rounded-3xl p-6 lg:p-8 border"
          style={{
            background: `linear-gradient(135deg, ${config.primary_action}12 0%, ${config.surface_color} 45%, ${config.secondary_action}10 100%)`,
            borderColor: `${config.primary_action}25`,
            boxShadow: `0 18px 40px -28px ${config.primary_action}66`
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: config.secondary_action }}
              >
                Discover Better
              </p>
              <h3 className="text-xl lg:text-2xl font-bold mt-2" style={{ color: config.text_color }}>
                A modern and clean way to find artists
              </h3>
              <p className="text-sm lg:text-base mt-2" style={{ color: config.secondary_action }}>
                Compare categories, shortlist talent, and connect confidently with the right creative professionals.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span
                className="px-4 py-2 rounded-full text-sm font-semibold border"
                style={{
                  backgroundColor: config.surface_color,
                  color: config.text_color,
                  borderColor: `${config.secondary_action}30`
                }}
              >
                {resolvedCategories.length} Categories
              </span>
              <span
                className="px-4 py-2 rounded-full text-sm font-semibold border"
                style={{
                  backgroundColor: config.surface_color,
                  color: config.text_color,
                  borderColor: `${config.primary_action}35`
                }}
              >
                {totalArtists.toLocaleString()} Artists
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickHighlights.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: config.surface_color,
                  border: `1px solid ${config.secondary_action}22`
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-3"
                  style={{ backgroundColor: `${config.primary_action}14` }}
                >
                  {item.icon}
                </div>
                <h4 className="font-semibold text-base mb-2" style={{ color: config.text_color }}>
                  {item.title}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: config.secondary_action }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryCircles;
