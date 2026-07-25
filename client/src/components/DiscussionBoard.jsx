import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Reply, User, PlusCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const DiscussionBoard = ({ courseId }) => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    loadDiscussions();
  }, [courseId]);

  const loadDiscussions = async () => {
    try {
      const list = await api.getDiscussions(courseId);
      setDiscussions(list || []);
    } catch (e) {
      console.error('Failed to load discussions:', e);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      await api.createDiscussion(courseId, { title, content });
      setTitle('');
      setContent('');
      setShowNewPost(false);
      loadDiscussions();
    } catch (e) {
      console.error('Failed to post discussion:', e);
    }
  };

  const handleReplySubmit = async (postId) => {
    const text = replyText[postId];
    if (!text || !text.trim()) return;
    try {
      await api.replyDiscussion(postId, { content: text });
      setReplyText(prev => ({ ...prev, [postId]: '' }));
      loadDiscussions();
    } catch (e) {
      console.error('Failed to post reply:', e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={20} color="var(--primary)" /> Course Discussion Q&A
        </h3>
        {user && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowNewPost(!showNewPost)}>
            <PlusCircle size={16} /> Ask Question
          </button>
        )}
      </div>

      {showNewPost && user && (
        <form onSubmit={handlePostSubmit} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Question title e.g. How to handle state updates in useEffect?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface-subtle)',
              color: 'var(--text-main)',
              outline: 'none',
              fontWeight: '600'
            }}
          />
          <textarea
            placeholder="Describe your question or code issue in detail..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface-subtle)',
              color: 'var(--text-main)',
              outline: 'none',
              resize: 'vertical'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowNewPost(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Post Question
            </button>
          </div>
        </form>
      )}

      {/* Discussion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {discussions.map(post => (
          <div key={post._id} className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <img 
                src={post.author?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=qa'} 
                alt={post.author?.name}
                style={{ width: '28px', height: '28px', borderRadius: '50%' }}
              />
              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{post.author?.name}</span>
              {post.author?.role === 'instructor' && <span className="badge badge-accent">Instructor</span>}
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.35rem' }}>{post.title}</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{post.content}</p>

            {/* Replies */}
            {post.replies && post.replies.length > 0 && (
              <div style={{ marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '2px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                {post.replies.map(r => (
                  <div key={r._id} style={{ background: 'var(--bg-surface-subtle)', padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.825rem' }}>{r.author?.name}</span>
                      {r.author?.role === 'instructor' && <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Instructor</span>}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{r.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input */}
            {user && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText[post._id] || ''}
                  onChange={(e) => setReplyText({ ...replyText, [post._id]: e.target.value })}
                  style={{
                    flex: 1,
                    padding: '0.45rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.825rem',
                    outline: 'none'
                  }}
                />
                <button className="btn btn-secondary btn-sm" onClick={() => handleReplySubmit(post._id)}>
                  <Reply size={14} /> Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
