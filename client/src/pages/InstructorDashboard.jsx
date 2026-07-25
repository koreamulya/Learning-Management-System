import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, BookOpen, Users, DollarSign, Edit, Trash2, Video, HelpCircle, Check } from 'lucide-react';

export const InstructorDashboard = ({ setActivePage, setSelectedCourseId }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [level, setLevel] = useState('Beginner');
  const [price, setPrice] = useState(49.99);
  const [thumbnail, setThumbnail] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInstructorCourses();
  }, [user]);

  const loadInstructorCourses = async () => {
    try {
      const all = await api.getCourses();
      const myCourses = all.filter(c => c.instructor?.id === user?._id || user?.role === 'admin');
      setCourses(myCourses);
    } catch (e) {
      console.error('Error loading instructor courses:', e);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setLoading(true);

    try {
      const newCourseData = {
        title,
        description,
        category,
        level,
        price: Number(price),
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
        modules: [
          {
            id: 'mod_1',
            title: 'Module 1: Getting Started',
            lessons: [
              {
                id: 'les_new_1',
                title: lessonTitle || 'Lesson 1: Introduction',
                duration: '10:00',
                videoUrl: videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                description: 'Initial introductory lesson.'
              }
            ],
            quiz: {
              id: 'quiz_new_1',
              title: 'Module 1 Assessment',
              passingScore: 60,
              questions: [
                {
                  id: 'q1',
                  type: 'multiple-choice',
                  question: 'What is the key takeaway of this course?',
                  options: ['Hands-on mastery', 'Memorizing syntax', 'Ignoring tests'],
                  correctAnswer: 'Hands-on mastery',
                  explanation: 'Practical hands-on practice builds real skills.'
                }
              ]
            }
          }
        ]
      };

      await api.createCourse(newCourseData);
      setShowCreateModal(false);
      // Reset form
      setTitle('');
      setDescription('');
      loadInstructorCourses();
    } catch (e) {
      console.error('Failed to create course:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.deleteCourse(id);
      loadInstructorCourses();
    } catch (e) {
      console.error('Error deleting course:', e);
    }
  };

  const totalStudents = courses.reduce((acc, c) => acc + (c.totalStudents || 0), 0);
  const estimatedRevenue = courses.reduce((acc, c) => acc + ((c.totalStudents || 0) * (c.price || 49)), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Instructor Studio & Course Builder</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your published courses, record lessons, and track student enrollment metrics.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <PlusCircle size={18} /> Create New Course
        </button>
      </div>

      {/* Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{courses.length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Published Courses</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(14, 165, 233, 0.15)', color: 'var(--secondary)' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{totalStudents}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Enrolled Students</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>${estimatedRevenue.toLocaleString()}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Course Sales</div>
          </div>
        </div>
      </div>

      {/* Courses Managed Table / Grid */}
      <h2 style={{ fontSize: '1.35rem', fontWeight: '700' }}>Your Courses</h2>
      <div className="course-grid">
        {courses.map(c => (
          <div key={c._id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <img src={c.thumbnail} alt={c.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.35rem' }}>{c.title}</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Category: {c.category} • {c.totalStudents || 0} students</p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
              <button 
                className="btn btn-secondary btn-sm" 
                style={{ flex: 1 }}
                onClick={() => { setSelectedCourseId(c._id); setActivePage('course-detail'); }}
              >
                View
              </button>
              <button 
                className="btn btn-secondary btn-sm" 
                style={{ color: 'var(--danger)' }}
                onClick={() => handleDeleteCourse(c._id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '1.75rem', background: 'var(--bg-surface)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1rem' }}>Create New Course</h3>
            <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Course Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Master React 18 & Next.js"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea 
                  placeholder="Comprehensive description of learning outcomes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-subtle)', color: 'var(--text-main)' }}
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Backend Development">Backend Development</option>
                    <option value="Design">Design</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Difficulty</label>
                  <select 
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-subtle)', color: 'var(--text-main)' }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>First Video Lesson Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Lesson 1: Introduction to Architecture"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Video MP4 Stream URL (Optional, defaults to sample stream)</label>
                <input 
                  type="text" 
                  placeholder="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                  {loading ? 'Publishing...' : 'Publish Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
