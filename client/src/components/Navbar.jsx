import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  GraduationCap, 
  Sun, 
  Moon, 
  Search, 
  Award, 
  User as UserIcon, 
  LogOut, 
  BookOpen, 
  LayoutDashboard, 
  Trophy, 
  Bot 
} from 'lucide-react';

export const Navbar = ({ activePage, setActivePage, searchKeyword, setSearchKeyword, onOpenAITutor }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="glass-nav">
      <div style={{
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '0.8rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActivePage('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            padding: '0.6rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            color: '#fff'
          }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
              Edu<span style={{ color: 'var(--primary)' }}>Pulse</span>
            </span>
            <span style={{ 
              display: 'block', 
              fontSize: '0.65rem', 
              fontWeight: '700', 
              color: 'var(--text-muted)', 
              letterSpacing: '1px',
              marginTop: '-4px'
            }}>
              ADVANCED LMS
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div style={{ flex: '1', maxWidth: '400px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search courses, skills, instructors..."
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              if (activePage !== 'catalog') setActivePage('catalog');
            }}
            style={{
              width: '100%',
              padding: '0.55rem 1rem 0.55rem 2.4rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface-subtle)',
              color: 'var(--text-main)',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'var(--transition)'
            }}
          />
        </div>

        {/* Quick Nav Links & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className={`btn ${activePage === 'catalog' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setActivePage('catalog')}
          >
            <BookOpen size={16} /> Catalog
          </button>

          {user && (
            <>
              <button 
                className={`btn ${activePage === 'leaderboard' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setActivePage('leaderboard')}
              >
                <Trophy size={16} /> Ranks
              </button>

              <button 
                className="btn btn-secondary btn-sm"
                onClick={onOpenAITutor}
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
              >
                <Bot size={16} /> AI Tutor
              </button>
            </>
          )}

          {user && user.role === 'instructor' && (
            <button 
              className={`btn ${activePage === 'instructor' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setActivePage('instructor')}
            >
              <LayoutDashboard size={16} /> Studio
            </button>
          )}

          {/* Theme Switcher */}
          <button 
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            title="Toggle Light/Dark Theme"
            style={{ padding: '0.5rem' }}
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>

          {/* Auth State */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
              {/* XP Badge */}
              <div 
                className="badge badge-accent"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                onClick={() => setActivePage('profile')}
              >
                <Award size={14} /> {user.xp || 100} XP
              </div>

              {/* User Avatar & Menu */}
              <div 
                onClick={() => setActivePage('profile')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
              >
                <img 
                  src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'} 
                  alt={user.name} 
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--primary)'
                  }}
                />
                <span style={{ fontWeight: '600', fontSize: '0.875rem', display: 'none', md: 'inline' }}>
                  {user.name.split(' ')[0]}
                </span>
              </div>

              <button 
                onClick={logout}
                className="btn btn-secondary btn-sm"
                title="Logout"
                style={{ padding: '0.5rem' }}
              >
                <LogOut size={16} color="var(--danger)" />
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setActivePage('auth')}
            >
              <UserIcon size={16} /> Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
