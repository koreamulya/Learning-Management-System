import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Trophy, Award, Crown, Star, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

export const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const data = await api.getLeaderboard();
      setLeaderboard(data || []);
    } catch (e) {
      console.error('Error fetching leaderboard:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
        Loading Global Rankings...
      </div>
    );
  }

  const top3 = leaderboard.slice(0, 3);

  // Map podium positions: [1st (Center), 0th (Left/2nd), 2nd (Right/3rd)]
  const podiumOrder = top3.length >= 3 
    ? [top3[1], top3[0], top3[2]] 
    : top3;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '3rem' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
        <div className="badge badge-accent" style={{ marginBottom: '0.75rem', padding: '0.4rem 1rem' }}>
          <Trophy size={14} /> Global Learner Leaderboard
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Hall of Fame & Top Achievers
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Earn XP points by completing video lessons, passing module quizzes, and actively engaging in course discussions.
        </p>
      </div>

      {/* Podium Showcase for Top 3 */}
      {top3.length > 0 && (
        <div style={{
          display: 'flex',
          justify: 'center',
          alignItems: 'flex-end',
          gap: '1.25rem',
          padding: '1.5rem 0'
        }}>
          {/* Second Place */}
          {podiumOrder[0] && (
            <div className="glass-card hover-lift" style={{
              flex: '1',
              maxWidth: '240px',
              padding: '1.5rem 1rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(180deg, rgba(148, 163, 184, 0.15) 0%, var(--bg-surface) 100%)',
              borderTop: '3px solid #cbd5e1'
            }}>
              <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                <img 
                  src={podiumOrder[0].avatar} 
                  alt={podiumOrder[0].name}
                  style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid #cbd5e1' }} 
                />
                <span style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#cbd5e1',
                  color: '#0f172a',
                  fontWeight: '800',
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)'
                }}>#2</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.2rem' }}>{podiumOrder[0].name}</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{podiumOrder[0].role}</div>
              <div className="badge badge-primary" style={{ fontSize: '0.8rem' }}>
                <Award size={12} /> {podiumOrder[0].xp} XP
              </div>
            </div>
          )}

          {/* First Place (Winner) */}
          {podiumOrder[1] && (
            <div className="glass-card hover-lift" style={{
              flex: '1',
              maxWidth: '260px',
              padding: '2rem 1rem 1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(180deg, rgba(234, 179, 8, 0.2) 0%, var(--bg-surface) 100%)',
              borderTop: '4px solid #eab308',
              transform: 'scale(1.05)',
              zIndex: 2
            }}>
              <Crown size={28} color="#eab308" style={{ marginBottom: '4px' }} />
              <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                <img 
                  src={podiumOrder[1].avatar} 
                  alt={podiumOrder[1].name}
                  style={{ width: '76px', height: '76px', borderRadius: '50%', border: '3px solid #eab308' }} 
                />
                <span style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#eab308',
                  color: '#0f172a',
                  fontWeight: '800',
                  fontSize: '0.8rem',
                  padding: '2px 10px',
                  borderRadius: 'var(--radius-full)'
                }}>#1 CHAMPION</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.2rem' }}>{podiumOrder[1].name}</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{podiumOrder[1].role}</div>
              <div className="badge badge-warning" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
                <Award size={14} /> {podiumOrder[1].xp} XP
              </div>
            </div>
          )}

          {/* Third Place */}
          {podiumOrder[2] && (
            <div className="glass-card hover-lift" style={{
              flex: '1',
              maxWidth: '240px',
              padding: '1.5rem 1rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(180deg, rgba(217, 119, 6, 0.15) 0%, var(--bg-surface) 100%)',
              borderTop: '3px solid #d97706'
            }}>
              <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                <img 
                  src={podiumOrder[2].avatar} 
                  alt={podiumOrder[2].name}
                  style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid #d97706' }} 
                />
                <span style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#d97706',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)'
                }}>#3</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.2rem' }}>{podiumOrder[2].name}</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{podiumOrder[2].role}</div>
              <div className="badge badge-accent" style={{ fontSize: '0.8rem' }}>
                <Award size={12} /> {podiumOrder[2].xp} XP
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="glass-card" style={{ padding: '1.5rem', overflow: 'hidden' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem' }}>All Ranked Learners</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {leaderboard.map((user, idx) => (
            <div 
              key={user._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1.15rem',
                borderRadius: 'var(--radius-sm)',
                background: idx < 3 ? 'var(--primary-light)' : 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-color)',
                gap: '1rem',
                fontSize: '0.9rem'
              }}
            >
              {/* Rank Number */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: idx === 0 ? '#eab308' : idx === 1 ? '#cbd5e1' : idx === 2 ? '#d97706' : 'var(--border-color)',
                color: idx < 3 ? '#0f172a' : 'var(--text-main)',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                flexShrink: 0
              }}>
                {idx + 1}
              </div>

              {/* User Avatar & Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                <img 
                  src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=rank'} 
                  alt={user.name}
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ textTransform: 'capitalize' }}>{user.role}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <BookOpen size={12} /> {user.completedCount} Courses Enrolled
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges Earned */}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {user.badges?.slice(0, 3).map((b, bIdx) => (
                  <span key={bIdx} className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
                    {b}
                  </span>
                ))}
              </div>

              {/* XP score */}
              <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--primary)', flexShrink: 0 }}>
                {user.xp} XP
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
