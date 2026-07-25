import React, { useState, useEffect } from 'react';
import { Star, Trash2, Send, MessageSquare } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ReviewSection = ({ courseId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [courseId]);

  const loadReviews = async () => {
    try {
      const res = await api.getReviews(courseId);
      setReviews(res || []);
    } catch (e) {
      console.error('Failed to load reviews:', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true);
    try {
      await api.addReview(courseId, { rating, comment });
      setComment('');
      loadReviews();
    } catch (e) {
      console.error('Failed to add review:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteReview(id);
      loadReviews();
    } catch (e) {
      console.error('Failed to delete review:', e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MessageSquare size={20} color="var(--primary)" /> Student Ratings & Reviews ({reviews.length})
      </h3>

      {/* Review Submission Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem' }}>
            Leave a Course Review
          </h4>

          {/* Star selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                style={{ color: star <= rating ? 'var(--warning)' : 'var(--text-light)' }}
              >
                <Star size={20} fill={star <= rating ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>

          <textarea
            placeholder="Share your learning experience, what you liked, or feedback for the instructor..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface-subtle)',
              color: 'var(--text-main)',
              outline: 'none',
              marginBottom: '0.75rem',
              resize: 'vertical'
            }}
          />

          <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
            <Send size={14} /> Submit Review
          </button>
        </form>
      ) : (
        <div className="glass-card" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Please sign in to rate and review this course.
        </div>
      )}

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reviews.map((r) => (
          <div key={r._id} className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <img 
                  src={r.userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=rev'} 
                  alt={r.userName}
                  style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{r.userName}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--warning)', fontSize: '0.75rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill={i < r.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                </div>
              </div>

              {user && (user._id === r.userId || user.role === 'admin') && (
                <button 
                  onClick={() => handleDelete(r._id)} 
                  style={{ color: 'var(--danger)', opacity: 0.8 }}
                  title="Delete Review"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              {r.comment}
            </p>
          </div>
        ))}

        {reviews.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
            No reviews yet. Be the first student to review this course!
          </div>
        )}
      </div>
    </div>
  );
};
