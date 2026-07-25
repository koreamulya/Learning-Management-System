import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ReviewSection } from '../components/ReviewSection';
import { DiscussionBoard } from '../components/DiscussionBoard';
import { Star, Clock, Users, BookOpen, Award, CheckCircle2, PlayCircle, HelpCircle } from 'lucide-react';

export const CourseDetailPage = ({ courseId, setActivePage, setSelectedCourseId }) => {
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseDetails();
  }, [courseId, user]);

  const loadCourseDetails = async () => {
    setLoading(true);
    try {
      const data = await api.getCourse(courseId);
      setCourse(data);

      if (user) {
        try {
          const prog = await api.getProgress(courseId);
          if (prog && prog.completionPercentage !== undefined) {
            setUserProgress(prog);
          }
        } catch (e) {}
      }
    } catch (e) {
      console.error('Error fetching course detail:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      setActivePage('auth');
      return;
    }
    try {
      await api.enrollCourse(courseId);
      setSelectedCourseId(courseId);
      setActivePage('learn');
    } catch (e) {
      console.error('Enroll error:', e);
    }
  };

  if (loading || !course) {
    return <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Loading course details...</div>;
  }

  const isEnrolled = !!userProgress;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      {/* Course Banner Card */}
      <div className="glass-card" style={{ padding: '2.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-primary">{course.category}</span>
              <span className="badge badge-accent">{course.level}</span>
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: '1.25', marginBottom: '0.75rem' }}>
              {course.title}
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              {course.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--warning)', fontWeight: '700' }}>
                <Star size={16} fill="currentColor" /> {course.rating || 5.0} ({course.totalRatings || 1} ratings)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                <Users size={16} /> {course.totalStudents || 0} Students Enrolled
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                <Clock size={16} /> {course.modules?.length || 0} Modules
              </div>
            </div>

            {/* Instructor Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
              <img 
                src={course.instructor?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=inst'} 
                alt={course.instructor?.name}
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
              />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Created by</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>{course.instructor?.name || 'Dr. Sarah Jenkins'}</div>
              </div>
            </div>

            {/* Actions */}
            {isEnrolled ? (
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => { setSelectedCourseId(courseId); setActivePage('learn'); }}
              >
                <BookOpen size={18} /> Continue Learning ({userProgress.completionPercentage || 0}%)
              </button>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={handleEnroll}>
                <Award size={18} /> Enroll Free Now
              </button>
            )}
          </div>

          <div style={{ width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            <img 
              src={course.thumbnail} 
              alt={course.title} 
              style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        {['overview', 'reviews', 'discussions'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '700',
              fontSize: '0.9rem',
              textTransform: 'capitalize',
              background: activeTab === tab ? 'var(--primary-light)' : 'transparent',
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Course Syllabus & Modules</h2>
          {course.modules && course.modules.length > 0 ? (
            course.modules.map((mod, idx) => (
              <div key={mod.id || idx} className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--primary)' }}>
                  {mod.title}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {mod.lessons && mod.lessons.map(les => (
                    <div 
                      key={les.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-surface-subtle)',
                        fontSize: '0.9rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <PlayCircle size={18} color="var(--primary)" />
                        <span style={{ fontWeight: '600' }}>{les.title}</span>
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{les.duration || '10:00'}</span>
                    </div>
                  ))}

                  {mod.quiz && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(139, 92, 246, 0.12)',
                      color: 'var(--accent)',
                      fontSize: '0.9rem',
                      fontWeight: '700'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <HelpCircle size={18} />
                        <span>Module Assessment: {mod.quiz.title}</span>
                      </div>
                      <span>{mod.quiz.questions?.length || 3} Questions</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No modules added yet for this course.</p>
          )}
        </div>
      )}

      {activeTab === 'reviews' && <ReviewSection courseId={courseId} />}
      {activeTab === 'discussions' && <DiscussionBoard courseId={courseId} />}
    </div>
  );
};
