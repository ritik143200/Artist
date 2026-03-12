import { useState, useEffect, useRef } from 'react';
import { useRouter } from '../contexts/RouterContext';

// Import all categories data from ArtistRegistrationPage
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
  }
  // Add more categories as needed...
};

const SearchBar = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { navigate } = useRouter();
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Generate search suggestions based on input
  const generateSuggestions = (query) => {
    const results = [];
    const lowerQuery = query.toLowerCase();

    // Search through all categories
    Object.entries(allCategoriesData).forEach(([categoryId, category]) => {
      // Check if category name matches
      if (category.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'category',
          id: categoryId,
          name: category.name,
          icon: category.icon,
          subcategories: category.subcategories
        });
      }

      // Search through subcategories
      Object.entries(category.subcategories).forEach(([subId, subcategory]) => {
        if (subcategory.name.toLowerCase().includes(lowerQuery)) {
          results.push({
            type: 'subcategory',
            id: `${categoryId}-${subId}`,
            name: subcategory.name,
            icon: subcategory.icon,
            parent: category.name,
            items: subcategory.items
          });
        }

        // Search through items
        subcategory.items.forEach(item => {
          if (item.toLowerCase().includes(lowerQuery)) {
            results.push({
              type: 'item',
              id: `${categoryId}-${subId}-${item}`,
              name: item,
              parent: subcategory.name,
              grandParent: category.name
            });
          }
        });
      });
    });

    return results.slice(0, 8); // Limit to 8 results for better UX
  };

  useEffect(() => {
    if (searchQuery.length >= 1) {
      const timer = setTimeout(() => {
        const results = generateSuggestions(searchQuery);
        setSuggestions(results);
        setShowSuggestions(true);
      }, 150); // Faster response
      
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? suggestions.length - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    // Navigate to category page with search parameters
    navigate('category', { 
      search: suggestion.name,
      type: suggestion.type,
      category: suggestion.type === 'category' ? suggestion.id : suggestion.grandParent,
      subcategory: suggestion.type === 'subcategory' ? suggestion.parent : null
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate('category', { search: searchQuery });
      setShowSuggestions(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="relative group">
        {/* Search Input with Modern Design */}
        <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 focus-within:border-brand-500 focus-within:shadow-lg focus-within:shadow-brand-500/20">
          {/* Search Icon - Left Side */}
          <div className="pl-4 pr-2">
            <svg className="w-5 h-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Input Field */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search artists, categories, skills..."
            className="flex-1 py-3 text-gray-700 placeholder-gray-400 bg-transparent border-0 focus:outline-none text-sm"
          />
          
          {/* Clear Button - When typing */}
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSuggestions(false);
              }}
              className="mr-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          {/* Search Button - Right Side */}
          <button
            onClick={handleSearch}
            className="mr-2 p-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Modern Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top duration-200"
        >
          {/* Dropdown Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-brand-50 to-blue-50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Search Suggestions</span>
              <span className="text-xs text-gray-500">{suggestions.length} results</span>
            </div>
          </div>
          
          {/* Suggestions List */}
          <div className="max-h-64 overflow-y-auto">
            {suggestions.slice(0, 8).map((suggestion, index) => (
              <div
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`group cursor-pointer transition-all border-b border-gray-50 last:border-b-0 ${
                  index === selectedIndex 
                    ? 'bg-gradient-to-r from-brand-50 to-blue-50 border-l-4 border-l-brand-500' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="px-4 py-3 flex items-center gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:from-brand-100 group-hover:to-brand-200 transition-all">
                    <span className="text-sm">
                      {suggestion.type === 'item' ? '🔍' : suggestion.icon || '🎭'}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate text-sm">
                      {suggestion.name}
                    </div>
                    
                    {/* Hierarchy info */}
                    <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                      <span>
                        {suggestion.type === 'category' && 'Main Category'}
                        {suggestion.type === 'subcategory' && `${suggestion.parent} • Subcategory`}
                        {suggestion.type === 'item' && `${suggestion.parent} • ${suggestion.grandParent}`}
                      </span>
                    </div>
                  </div>
                  
                  {/* Type indicator with modern design */}
                  <div className="flex-shrink-0">
                    {suggestion.type === 'category' && (
                      <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-xs rounded-full font-medium shadow-sm">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                        </svg>
                        Category
                      </span>
                    )}
                    {suggestion.type === 'subcategory' && (
                      <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full font-medium shadow-sm">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100 4h2a1 1 0 100 2 2 2 0 01-2 2H6a2 2 0 01-2-2V5z"/>
                        </svg>
                        Subcategory
                      </span>
                    )}
                    {suggestion.type === 'item' && (
                      <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded-full font-medium shadow-sm">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                        </svg>
                        Skill
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Modern Footer */}
          <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono shadow-sm">↑↓</kbd>
                <span className="mx-1">navigate</span>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono shadow-sm">Enter</kbd>
                <span className="mx-1">select</span>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono shadow-sm">Esc</kbd>
                <span className="mx-1">close</span>
              </div>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
