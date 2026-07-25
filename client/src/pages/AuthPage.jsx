import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';

export const AuthPage = ({ setActivePage }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) {
        setActivePage('catalog');
      } else {
        setError(res.message);
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your full name');
        setLoading(false);
        return;
      }
      const res = await register(name, email, password, role);
      if (res.success) {
        setActivePage('catalog');
      } else {
        setError(res.message);
      }
    }
    setLoading(false);
  };

  const handleDemoFill = (demoRole) => {
    if (demoRole === 'student') {
      setEmail('student@example.com');
      setPassword('student123');
    } else {
      setEmail('instructor@example.com');
      setPassword('instructor123');
    }
    setIsLogin(true);
  };

  return (
    <div style={{
      maxWidth: '480px',
      margin: '2rem auto',
      padding: '0 1rem'
    }}>
      <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
        {/* Header Toggle */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            {isLogin ? 'Welcome Back!' : 'Join EduPulse LMS'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isLogin ? 'Sign in to access your video lessons & progress' : 'Start learning and earn verifiable course certificates'}
          </p>
        </div>

        {/* Form Mode Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-surface-subtle)',
          padding: '4px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem'
        }}>
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '700',
              fontSize: '0.875rem',
              background: isLogin ? 'var(--bg-surface)' : 'transparent',
              color: isLogin ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: isLogin ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '700',
              fontSize: '0.875rem',
              background: !isLogin ? 'var(--bg-surface)' : 'transparent',
              color: !isLogin ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: !isLogin ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            color: 'var(--danger)',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            fontWeight: '600'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem 0.65rem 2.4rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.4rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.4rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                Account Type / Role
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <label style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1.5px solid ${role === 'student' ? 'var(--primary)' : 'var(--border-color)'}`,
                  background: role === 'student' ? 'var(--primary-light)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  <input type="radio" name="role" value="student" checked={role === 'student'} onChange={() => setRole('student')} />
                  Student
                </label>

                <label style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1.5px solid ${role === 'instructor' ? 'var(--accent)' : 'var(--border-color)'}`,
                  background: role === 'instructor' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  <input type="radio" name="role" value="instructor" checked={role === 'instructor'} onChange={() => setRole('instructor')} />
                  Instructor
                </label>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In to Account' : 'Create Free Account')}
          </button>
        </form>

        {/* Demo Fast Fill Credentials */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: '600' }}>
            ⚡ Instant One-Click Demo Logins:
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => handleDemoFill('student')}>
              <UserCheck size={14} color="var(--primary)" /> Demo Student
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => handleDemoFill('instructor')}>
              <ShieldCheck size={14} color="var(--accent)" /> Demo Instructor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
