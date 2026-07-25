import React, { useState, useEffect } from 'react';
import { CourseCard } from '../components/CourseCard';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Filter, Search, SlidersHorizontal, BookOpen } from 'lucide-react';

export const CourseCatalogPage = ({ searchKeyword, setSearchKeyword, setSelectedCourseId, setActivePage }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);
  const [userProgressMap, setUserProgressMap] = useState({});

  const categories = ['All', 'Web Development', 'Backend Development', 'Design', 'Data Science'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedLevel, sortBy, searchKeyword]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const list = await api.getCourses({
        category: selectedCategory,
        level: selectedLevel,
        sort: sortBy,
        search: searchKeyword
      });
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
    } catch (err) {
      console.error('Error loading course catalog:', err);
    } finally {
      setLoading(false);
    }
  };

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      {/* Header Banner */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.35rem' }}>
          Explore Interactive Course Catalog
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Enhance your technical skills with video modules, hands-on quizzes, and downloadable resources.
        </p>
      </div>

      {/* Category Pills & Filters */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Categories Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Level Filter & Sorting Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          {/* Level Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Difficulty Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              {levels.map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersHorizontal size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Additions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          Loading courses...
        </div>
      ) : courses.length > 0 ? (
        <div className="course-grid">
          {courses.map(course => (
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
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No Courses Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Try resetting your filters or search terms to find available courses.
          </p>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => { setSelectedCategory('All'); setSelectedLevel('All'); setSearchKeyword(''); }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
