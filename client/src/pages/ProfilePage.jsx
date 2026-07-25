import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { CertificateModal } from '../components/CertificateModal';
import { User, Award, BookOpen, Edit3, Shield, CheckCircle2, Save, Sparkles } from 'lucide-react';

export const ProfilePage = ({ setActivePage, setSelectedCourseId }) => {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userProgressMap, setUserProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCertCourse, setSelectedCertCourse] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setAvatar(user.avatar || '');
      fetchUserCourses();
    }
  }, [user]);

  const fetchUserCourses = async () => {
    setLoading(true);
    try {
      const allCourses = await api.getCourses();
      const enrolledIds = user?.enrolledCourses || [];
      
      const progMap = {};
      const enrolledList = [];

      for (const c of allCourses) {
        try {
          const p = await api.getProgress(c._id);
          if (p && p.enrolledAt) {
            progMap[c._id] = p;
            enrolledList.push(c);
          }
        } catch (e) {}
      }

      setEnrolledCourses(enrolledList);
      setUserProgressMap(progMap);
    } catch (e) {
      console.error('Error fetching enrolled courses:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.updateProfile({ name, bio, avatar });
      await refreshUser();
      setEditing(false);
    } catch (e) {
      console.error('Failed to update profile:', e);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Please sign in to view your profile dashboard</h2>
        <button className="btn btn-primary" onClick={() => setActivePage('auth')} style={{ marginTop: '1rem' }}>
          Sign In
        </button>
      </div>
    );
  }

  const completedCount = enrolledCourses.filter(c => userProgressMap[c._id]?.isCompleted).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      {/* Header Profile Card */}
      <div className="glass-card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <img 
            src={avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=me'} 
            alt={user.name}
            style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
          />

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{user.name}</h1>
              <span className="badge badge-accent" style={{ textTransform: 'capitalize' }}>{user.role}</span>
              <span className="badge badge-primary">
                <Award size={14} /> {user.xp || 100} XP
              </span>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '0.75rem', maxWidth: '600px' }}>
              {user.bio || 'Learner on EduPulse LMS'}
            </p>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
              📧 {user.email}
            </div>
          </div>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setEditing(!editing)}
          >
            <Edit3 size={16} /> {editing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* Edit Profile Form */}
        {editing && (
          <form onSubmit={handleUpdateProfile} style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Avatar Image URL</label>
                <input 
                  type="text" 
                  value={avatar} 
                  onChange={(e) => setAvatar(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-subtle)', color: 'var(--text-main)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Short Bio</label>
              <textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-subtle)', color: 'var(--text-main)' }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-sm" style={{ width: 'fit-content' }}>
              <Save size={16} /> Save Changes
            </button>
          </form>
        )}
      </div>

      {/* Stats Counter Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>{user.xp || 100}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total XP Earned</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--secondary)' }}>{enrolledCourses.length}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Enrolled Courses</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--success)' }}>{completedCount}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Certificates Earned</div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={20} color="var(--accent)" /> Achievements & Unlocked Badges
        </h3>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {(user.badges || ['Welcome Onboard']).map((b, idx) => (
            <div key={idx} className="glass-card" style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: '1.5px solid var(--accent)',
              background: 'rgba(139, 92, 246, 0.12)',
              fontSize: '0.85rem',
              fontWeight: '700',
              color: 'var(--accent)'
            }}>
              <Sparkles size={14} /> {b}
            </div>
          ))}
        </div>
      </div>

      {/* Enrolled Courses Progress & Certificates */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '1rem' }}>Your Enrolled Courses</h2>

        {loading ? (
          <div style={{ color: 'var(--text-muted)' }}>Loading enrolled courses...</div>
        ) : enrolledCourses.length > 0 ? (
          <div className="course-grid">
            {enrolledCourses.map(course => {
              const prog = userProgressMap[course._id];
              const pct = prog ? prog.completionPercentage || 0 : 0;
              const isFinished = prog?.isCompleted || pct === 100;

              return (
                <div key={course._id} className="glass-card hover-lift" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{course.title}</h3>

                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px' }}>
                        <span>Completion Rate</span>
                        <span style={{ color: 'var(--primary)' }}>{pct}%</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => { setSelectedCourseId(course._id); setActivePage('learn'); }}
                    >
                      <BookOpen size={14} /> Learn
                    </button>

                    {isFinished && (
                      <button 
                        className="btn btn-secondary btn-sm"
                        style={{ background: 'linear-gradient(135deg, #c5a059, #e9b646)', color: '#1a237e', fontWeight: '800', flex: 1 }}
                        onClick={() => setSelectedCertCourse(course)}
                      >
                        <Award size={14} /> Certificate
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ marginBottom: '1rem' }}>You are not enrolled in any courses yet.</p>
            <button className="btn btn-primary" onClick={() => setActivePage('catalog')}>
              Explore Courses Now
            </button>
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {selectedCertCourse && (
        <CertificateModal
          course={selectedCertCourse}
          userName={user.name}
          completionDate={userProgressMap[selectedCertCourse._id]?.completedAt ? new Date(userProgressMap[selectedCertCourse._id].completedAt).toLocaleDateString() : new Date().toLocaleDateString()}
          onClose={() => setSelectedCertCourse(null)}
        />
      )}
    </div>
  );
};
