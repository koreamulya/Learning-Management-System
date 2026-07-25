import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { CourseCatalogPage } from './pages/CourseCatalogPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { LearnPage } from './pages/LearnPage';
import { AuthPage } from './pages/AuthPage';
import { InstructorDashboard } from './pages/InstructorDashboard';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AITutorModal } from './components/AITutorModal';

import { GraduationCap, Heart, Github, Twitter, Linkedin, Sparkles } from 'lucide-react';

const AppContent = () => {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const [selectedCourseId, setSelectedCourseId] = useState('course_react_101');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showAITutor, setShowAITutor] = useState(false);

  return (
    <div className="app-container">
      {/* Top Sticky Glass Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        onOpenAITutor={() => setShowAITutor(true)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activePage === 'home' && (
          <HomePage 
            setActivePage={setActivePage} 
            setSelectedCourseId={setSelectedCourseId} 
          />
        )}

        {activePage === 'catalog' && (
          <CourseCatalogPage
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            setSelectedCourseId={setSelectedCourseId}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'course-detail' && (
          <CourseDetailPage
            courseId={selectedCourseId}
            setActivePage={setActivePage}
            setSelectedCourseId={setSelectedCourseId}
          />
        )}

        {activePage === 'learn' && (
          <LearnPage
            courseId={selectedCourseId}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'auth' && (
          <AuthPage
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'instructor' && (
          <InstructorDashboard
            setActivePage={setActivePage}
            setSelectedCourseId={setSelectedCourseId}
          />
        )}

        {activePage === 'leaderboard' && (
          <LeaderboardPage />
        )}

        {activePage === 'profile' && (
          <ProfilePage
            setActivePage={setActivePage}
            setSelectedCourseId={setSelectedCourseId}
          />
        )}
      </main>

      {/* Floating AI Tutor Popup */}
      {showAITutor && (
        <AITutorModal
          courseTitle="React & Node.js Masterclass"
          onClose={() => setShowAITutor(false)}
        />
      )}

      {/* Footer */}
      <footer style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-color)',
        padding: '3rem 1.5rem 1.5rem',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1320px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <GraduationCap size={24} color="var(--primary)" />
              <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>EduPulse LMS</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.6' }}>
              Empowering learners worldwide with interactive video lessons, automated quiz assessments, AI tutoring, and verifiable certificates.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.85rem' }}>Quick Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => setActivePage('home')}>Home</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setActivePage('catalog')}>Course Catalog</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setActivePage('leaderboard')}>Rankings & Leaderboard</span>
              {user?.role === 'instructor' && (
                <span style={{ cursor: 'pointer' }} onClick={() => setActivePage('instructor')}>Instructor Studio</span>
              )}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.85rem' }}>Features</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <span>🎥 Video Progress Tracking</span>
              <span>📝 Auto-graded Quizzes</span>
              <span>📜 Printable PDF Certificates</span>
              <span>🤖 Interactive AI Tutor</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.85rem' }}>Technology Stack</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <span>React 18 & Vite</span>
              <span>Node.js & Express API</span>
              <span>JWT & bcrypt Security</span>
              <span>JSON Store & MongoDB API</span>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: '1320px',
          margin: '0 auto',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.825rem',
          color: 'var(--text-muted)'
        }}>
          <div>© 2026 EduPulse Online Learning Platform. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Built with <Heart size={14} color="var(--danger)" fill="currentColor" /> for advanced online education
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
