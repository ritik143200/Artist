import { useState } from 'react';

const ReviewModal = ({ isOpen, onClose, onSubmit, config }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{
      background: 'rgba(30, 41, 59, 0.35)',
      backdropFilter: 'blur(8px) saturate(1.2)',
      WebkitBackdropFilter: 'blur(8px) saturate(1.2)'
    }}>
      <div
        className="relative w-full max-w-md rounded-3xl shadow-2xl border"
        style={{
          background: `linear-gradient(135deg, ${config.card_background} 80%, ${config.primary_color}10 100%)`,
          borderColor: `${config.primary_color}30`,
          boxShadow: `0 8px 40px -8px ${config.primary_color}30`
        }}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white text-gray-500 hover:text-red-500 shadow transition-all text-2xl"
          onClick={onClose}
          aria-label="Close"
          style={{ border: `1px solid ${config.primary_color}20` }}
        >
          ×
        </button>
        {/* Avatar/Icon */}
        <div className="flex flex-col items-center pt-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-200 via-yellow-100 to-blue-100 flex items-center justify-center shadow-lg mb-2 border-4" style={{ borderColor: config.primary_color }}>
            <span className="text-3xl">📝</span>
          </div>
          <h2 className="text-2xl font-extrabold mb-2 tracking-tight" style={{ color: config.text_primary }}>
            Write a Review
          </h2>
          <p className="text-sm mb-4" style={{ color: config.text_secondary }}>
            Share your experience with this artist
          </p>
        </div>
        {/* Star Rating */}
        <div className="flex justify-center gap-1 mb-4">
          {[1,2,3,4,5].map(star => (
            <button
              key={star}
              type="button"
              className={`transition-all text-4xl focus:outline-none ${star <= rating ? 'text-yellow-400 scale-110 drop-shadow' : 'text-gray-300 hover:text-yellow-300'} ${star === rating ? 'animate-bounce' : ''}`}
              onClick={() => setRating(star)}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              style={{ filter: star <= rating ? 'drop-shadow(0 2px 6px #facc15aa)' : undefined }}
            >
              ★
            </button>
          ))}
        </div>
        {/* Review Textarea */}
        <div className="px-8 mb-6">
          <textarea
            className="w-full rounded-2xl border border-gray-200 p-4 text-base font-medium focus:outline-none focus:border-blue-400 shadow-sm resize-none transition-all"
            rows={4}
            placeholder="How was your experience? Share details..."
            value={review}
            onChange={e => setReview(e.target.value)}
            style={{ backgroundColor: config.surface_color, color: config.text_primary, minHeight: 96 }}
          />
        </div>
        {/* Submit Button */}
        <div className="px-8 pb-8">
          <button
            className="w-full py-3 rounded-2xl font-extrabold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 tracking-wide"
            style={{
              background: `linear-gradient(90deg, ${config.primary_color} 60%, ${config.secondary_color} 100%)`,
              color: 'white',
              letterSpacing: '0.02em',
              boxShadow: `0 4px 24px -4px ${config.primary_color}40`
            }}
            onClick={() => {
              if (rating && review.trim()) {
                onSubmit({ rating, review });
                setRating(0);
                setReview('');
                onClose();
              }
            }}
            disabled={!rating || !review.trim()}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
