import { useState } from 'react';
import { useRouter } from '../contexts/RouterContext';
import { useAuth } from '../contexts/AuthContext';

const ArtistInquiry = ({ isOpen, onClose, artist, config }) => {
  const { navigate } = useRouter();
  const { user } = useAuth();
  console.log('🎯 ArtistInquiry component rendered for:', artist.fullName || artist.name);
  console.log('👤 Logged-in user:', user);

  // Use real logged-in user data from auth context
  const loggedInUser = user || {
    name: '',
    email: '',
    phone: ''
  };

  const [formData, setFormData] = useState({
    name: loggedInUser.name || '',
    email: loggedInUser.email || '',
    phone: loggedInUser.phone || '',
    eventType: '',
    eventDate: '',
    eventLocation: '',
    budget: '',
    message: '',
    requirements: []
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Handle both backend and mock data structures
  const artistName = artist.fullName ||
    `${artist.firstName || ''} ${artist.lastName || ''}`.trim() ||
    artist.name ||
    'Artist Name';
  const artistCategory = artist.category || artist.categoryName || 'Artist';
  const artistSpecialty = artist.subcategory || artist.specialty || artist.skills?.[0] || 'Professional Artist';
  const artistPrice = artist.budget ? `₹${artist.budget.toLocaleString()}` : artist.price || 'Price on request';
  const artistLocation = artist.location || 'Location not specified';

  const commonRequirements = [
    'Full Performance',
    'Sound System',
    'Lighting Setup',
    'Travel Included',
    'Accommodation',
    'Stage Setup',
    'Costume/Outfit',
    'Makeup/Hair',
    'Photography/Videography',
    'Custom Performance'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Word count validation for event type (max 30 words)
    if (name === 'eventType') {
      const words = value.trim().split(/\s+/).filter(word => word.length > 0);
      if (words.length > 30) {
        return; // Don't update if exceeds 30 words
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRequirementToggle = (requirement) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.includes(requirement)
        ? prev.requirements.filter(r => r !== requirement)
        : [...prev.requirements, requirement]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        artistId: artist._id || artist.id,
        userId: user._id || user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        budget: formData.budget,
        eventLocation: formData.eventLocation,
        requirements: formData.requirements,
        message: formData.message
      };

      const response = await fetch('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit inquiry');
      }

      console.log('📨 Inquiry submitted:', data);

      setSubmitted(true);

      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (error) {
      console.error('❌ Error submitting inquiry:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Inquiry Sent!</h3>
          <p className="text-gray-600 mb-4">
            Your inquiry has been sent to {artistName}. They will contact you soon.
          </p>
          <div className="text-sm text-gray-500">
            Closing automatically in 3 seconds...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            {/* Left Side - Send Inquiry Section */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">Send Inquiry</h2>
              <p className="text-gray-600 mt-1">Contact {artistName} for your event</p>
            </div>

            {/* Right Side - Artist Information */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-xl">
                🎭
              </div>
              <div className="text-right">
                <h3 className="font-bold text-gray-900">{artistName}</h3>
                <p className="text-sm text-gray-600">{artistSpecialty} • {artistCategory}</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 justify-end">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {artistLocation}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Starting from {artistPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors ml-4"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Two-Column Layout with Unified Scrolling */}
        <div className="flex flex-col lg:flex-row max-h-[70vh] overflow-y-auto">
          {/* Left Side - Categories & Information */}
          <div className="lg:w-1/3 bg-gradient-to-br from-gray-50 to-blue-50/30 border-r border-gray-100">
            {/* Explore Categories Section */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Explore Categories</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '🎤', name: 'Singers', color: 'from-blue-500 to-blue-600' },
                  { icon: '🎸', name: 'Bands', color: 'from-purple-500 to-purple-600' },
                  { icon: '🎵', name: 'Instrumentalists', color: 'from-green-500 to-green-600' },
                  { icon: '💃', name: 'Dancers', color: 'from-pink-500 to-pink-600' },
                  { icon: '🎭', name: 'Cultural', color: 'from-orange-500 to-orange-600' },
                  { icon: '🎪', name: 'Carnival', color: 'from-red-500 to-red-600' },
                  { icon: '💄', name: 'Makeup', color: 'from-rose-500 to-rose-600' },
                  { icon: '💪', name: 'Fitness', color: 'from-indigo-500 to-indigo-600' },
                  { icon: '🎨', name: 'Painters', color: 'from-cyan-500 to-cyan-600' },
                  { icon: '✏️', name: 'Sketching', color: 'from-teal-500 to-teal-600' },
                  { icon: '🎙️', name: 'RJs', color: 'from-amber-500 to-amber-600' },
                  { icon: '🗣️', name: 'Voice', color: 'from-lime-500 to-lime-600' },
                  { icon: '✍️', name: 'Writers', color: 'from-emerald-500 to-emerald-600' },
                  { icon: '🎧', name: 'DJs', color: 'from-violet-500 to-violet-600' },
                  { icon: '🧘', name: 'Wellness', color: 'from-sky-500 to-sky-600' },
                  { icon: '👗', name: 'Fashion', color: 'from-fuchsia-500 to-fuchsia-600' },
                  { icon: '👨‍🍳', name: 'Culinary', color: 'from-yellow-500 to-yellow-600' },
                  { icon: '🤡', name: 'Children', color: 'from-blue-400 to-blue-500' },
                  { icon: '✨', name: 'Special', color: 'from-purple-400 to-purple-500' },
                  { icon: '🔮', name: 'Visual', color: 'from-pink-400 to-pink-500' },
                  { icon: '🎪', name: 'Circus', color: 'from-red-400 to-red-500' },
                  { icon: '🎬', name: 'Actors', color: 'from-green-400 to-green-500' },
                  { icon: '🎩', name: 'Magicians', color: 'from-orange-400 to-orange-500' },
                  { icon: '💻', name: 'Tech', color: 'from-gray-500 to-gray-600' }
                ].map((category, index) => (
                  <button
                    key={index}
                    className={`group relative overflow-hidden rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg ${artistCategory?.toLowerCase() === category.name.toLowerCase()
                      ? 'bg-gradient-to-br ' + category.color + ' text-white shadow-lg'
                      : 'bg-white border border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="relative z-10">
                      <div className="text-2xl mb-2">{category.icon}</div>
                      <div className={`text-xs font-bold ${artistCategory?.toLowerCase() === category.name.toLowerCase()
                        ? 'text-white'
                        : 'text-gray-700 group-hover:text-gray-900'
                        }`}>
                        {category.name}
                      </div>
                    </div>
                    {artistCategory?.toLowerCase() === category.name.toLowerCase() && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Tips Section */}
            <div className="p-6 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Quick Tips</h3>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3 p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-orange-600">1</span>
                  </div>
                  <div className="text-sm text-gray-700">
                    <div className="font-medium">Book Early</div>
                    <div className="text-xs text-gray-500">Popular artists get booked 2-3 weeks in advance</div>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">2</span>
                  </div>
                  <div className="text-sm text-gray-700">
                    <div className="font-medium">Clear Requirements</div>
                    <div className="text-xs text-gray-500">Specify event details for better quotes</div>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-green-50/50 rounded-xl border border-green-100">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-600">3</span>
                  </div>
                  <div className="text-sm text-gray-700">
                    <div className="font-medium">Compare Options</div>
                    <div className="text-xs text-gray-500">Check multiple artists for best fit</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form Only */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="p-6">
              {/* Enhanced Form Container */}
              <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50/30 rounded-2xl border border-gray-100/60 shadow-sm overflow-hidden">
                {/* Container Header */}
                <div className="bg-gradient-to-r from-blue-600/5 to-purple-600/5 border-b border-gray-100/60 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Event Inquiry Form</h3>
                      <p className="text-sm text-gray-600">Fill in the details to send your inquiry</p>
                    </div>
                  </div>
                </div>

                {/* Form Content - Compact Layout */}
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Your Information Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">Your Information</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
                      </div>

                      <div className="space-y-3">
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            Full Name *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              disabled
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed font-medium transition-all group-hover:border-gray-300"
                              placeholder="Enter your full name"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Auto-filled from your profile
                          </p>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            Email Address *
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              disabled
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed font-medium transition-all group-hover:border-gray-300"
                              placeholder="your.email@example.com"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Auto-filled from your profile
                          </p>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            Phone Number *
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                              disabled={!!loggedInUser.phone}
                              className={`w-full px-4 py-3 border-2 rounded-xl font-medium transition-all ${loggedInUser.phone ? 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed group-hover:border-gray-300' : 'border-gray-200 bg-white group-hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'}`}
                              placeholder="+91 98765 43210"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Auto-filled from your profile
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Event Information Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">Event Details</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
                      </div>

                      <div className="space-y-3">
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                            Event Type *
                            <span className="text-xs text-gray-500 ml-2 bg-purple-50 px-2 py-1 rounded-full">(Up to 30 words)</span>
                          </label>
                          <textarea
                            name="eventType"
                            value={formData.eventType}
                            onChange={handleInputChange}
                            required
                            rows={2}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none font-medium"
                            placeholder="Describe your event type in detail (e.g., 'Grand wedding reception with live music and dance performances for 500 guests')"
                          />
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500">
                              Words used: <span className="font-bold text-purple-600">{formData.eventType.trim().split(/\s+/).filter(word => word.length > 0).length}</span> / 30
                            </p>
                            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
                                style={{ width: `${Math.min((formData.eventType.trim().split(/\s+/).filter(word => word.length > 0).length / 30) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                              Event Date *
                            </label>
                            <div className="relative">
                              <input
                                type="date"
                                name="eventDate"
                                value={formData.eventDate}
                                onChange={handleInputChange}
                                required
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium"
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                              Budget Range
                            </label>
                            <div className="relative">
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  name="budget"
                                  value={formData.budget}
                                  onChange={handleInputChange}
                                  required
                                  min="0"
                                  step="500"
                                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium"
                                  placeholder="Enter your budget"
                                />
                                <div className="flex items-center px-4 py-3 bg-gradient-to-r from-purple-100 to-purple-50 border-2 border-purple-200 rounded-xl text-purple-700 font-bold">
                                  ₹
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                            Event Location *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="eventLocation"
                              value={formData.eventLocation}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium"
                              placeholder="City, Venue, Address"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Requirements Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">Additional Requirements</h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent"></div>
                    </div>

                    <div className="bg-green-50/30 border border-green-100/60 rounded-xl p-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {commonRequirements.map(requirement => (
                          <label
                            key={requirement}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all group ${formData.requirements.includes(requirement)
                              ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100 text-green-700 shadow-sm'
                              : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.requirements.includes(requirement)}
                              onChange={() => handleRequirementToggle(requirement)}
                              className="w-4 h-4 text-green-600 rounded focus:ring-green-500 focus:ring-2"
                            />
                            <span className="text-sm font-medium">{requirement}</span>
                            {formData.requirements.includes(requirement) && (
                              <svg className="w-4 h-4 text-green-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Message Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">Additional Message</h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
                    </div>

                    <div className="bg-orange-50/30 border border-orange-100/60 rounded-xl p-4">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none font-medium bg-white"
                        placeholder="Tell us more about your event requirements, special requests, or any other details..."
                      />
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Optional: Share any special requirements or preferences
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Submit Button Container */}
              <div className="mt-6 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl border border-gray-100/60 p-6">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </span>
                    <div className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Sending Inquiry...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Send Inquiry
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </div>

                {/* Security & Trust Badges */}
                <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Secure & Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Quick Response</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                    <span>No Spam Policy</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistInquiry;
