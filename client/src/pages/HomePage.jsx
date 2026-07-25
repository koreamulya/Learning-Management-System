import React, { useEffect, useState } from 'react';
import { CourseCard } from '../components/CourseCard';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sparkles, PlayCircle, Award, Users, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';

export const HomePage = ({ setActivePage, setSelectedCourseId }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [userProgressMap, setUserProgressMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await api.getCourses({ sort: 'popular' });
        setCourses(list || []);

        if (user) {
          const progMap = {};
          for (const c of list) {
            try {
              const p = await api.getProgress(c._id);
              if (p && p.completionPercentage !== undefined) {
                progMap[c._id] = p;
              }
            } catch (e) {}
          }
          setUserProgressMap(progMap);
        }
      } catch (e) {
        console.error('Error fetching home courses:', e);
      }
    };
    fetchData();
  }, [user]);

  const handleEnroll = async (courseId) => {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <section className="glass-card" style={{
        padding: '3.5rem 2.5rem',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(139, 92, 246, 0.15) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '780px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="badge badge-accent animate-pulse-subtle" style={{ width: 'fit-content', padding: '0.4rem 1rem' }}>
            <Sparkles size={14} /> Next-Generation LMS Platform
          </div>
          
          <h1 style={{ fontSize: '2.8rem', fontWeight: '800', lineHeight: '1.15', letterSpacing: '-1px' }}>
            Master High-Demand Tech Skills with <span style={{ color: 'var(--primary)' }}>Interactive Video Lessons & AI</span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Browse expert-curated courses, track video watch time automatically, evaluate your knowledge with auto-graded quizzes, and earn verifiable certificates.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => setActivePage('catalog')}
            >
              Explore Course Catalog <ArrowRight size={18} />
            </button>
            {!user && (
              <button 
                className="btn btn-secondary btn-lg"
                onClick={() => setActivePage('auth')}
              >
                Create Free Account
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stats Counter Banner */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem'
      }}>
        {[
          { label: 'Active Learners', val: '12,500+', icon: <Users size={24} color="var(--primary)" /> },
          { label: 'Video Lessons', val: '450+ Hours', icon: <PlayCircle size={24} color="var(--secondary)" /> },
          { label: 'Certificates Earned', val: '8,900+', icon: <Award size={24} color="var(--accent)" /> },
          { label: 'Quiz Completion Rate', val: '96.4%', icon: <ShieldCheck size={24} color="var(--success)" /> }
        ].map((item, idx) => (
          <div key={idx} className="glass-card hover-lift" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>{item.icon}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>{item.val}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>{item.label}</div>
          </div>
        ))}
      </section>

      {/* Featured Courses */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Popular & Trending Courses</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Hand-crafted learning paths designed by industry experts</p>
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage('catalog')}
          >
            View All Courses <ArrowRight size={14} />
          </button>
        </div>

        <div className="course-grid">
          {courses.slice(0, 3).map(course => (
            <CourseCard
              key={course._id}
              course={course}
              userProgress={userProgressMap[course._id]}
              onSelectCourse={(id) => {
                setSelectedCourseId(id);
                setActivePage(userProgressMap[id] ? 'learn' : 'course-detail');
              }}
              onEnroll={handleEnroll}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
