import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { VideoPlayer } from '../components/VideoPlayer';
import { QuizModal } from '../components/QuizModal';
import { CertificateModal } from '../components/CertificateModal';
import { 
  PlayCircle, 
  CheckCircle2, 
  HelpCircle, 
  Award, 
  BookOpen, 
  ChevronRight, 
  FileText, 
  Lock 
} from 'lucide-react';

export const LearnPage = ({ courseId, setActivePage }) => {
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLearningEnvironment();
  }, [courseId]);

  const loadLearningEnvironment = async () => {
    setLoading(true);
    try {
      const c = await api.getCourse(courseId);
      setCourse(c);

      const p = await api.getProgress(courseId);
      setProgress(p);

      // Default active lesson to first lesson in first module
      if (c && c.modules && c.modules.length > 0 && c.modules[0].lessons && c.modules[0].lessons.length > 0) {
        setActiveLesson(c.modules[0].lessons[0]);
      }
    } catch (e) {
      console.error('Error loading learn workspace:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUpdate = async (timestamp) => {
    if (!activeLesson) return;
    try {
      await api.updateProgress({
        courseId,
        lessonId: activeLesson.id,
        timestamp
      });
    } catch (e) {}
  };

  const handleLessonComplete = async () => {
    if (!activeLesson) return;
    try {
      const res = await api.updateProgress({
        courseId,
        lessonId: activeLesson.id,
        completed: true
      });
      if (res.progress) {
        setProgress(res.progress);
      }
    } catch (e) {
      console.error('Error updating completion:', e);
    }
  };

  const handleQuizPassed = async (score) => {
    try {
      const p = await api.getProgress(courseId);
      setProgress(p);
    } catch (e) {}
  };

  if (loading || !course) {
    return <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Loading Learning Workspace...</div>;
  }

  const completedLessons = progress?.completedLessons || [];
  const videoTimestamps = progress?.videoTimestamps || {};
  const isCourseFinished = progress?.completionPercentage === 100;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', minHeight: 'calc(100vh - 120px)' }}>
      {/* Sidebar Navigation */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.35rem' }}>{course.category}</span>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', lineHeight: '1.3' }}>{course.title}</h2>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
            <span>Overall Progress</span>
            <span style={{ color: 'var(--primary)' }}>{progress?.completionPercentage || 0}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress?.completionPercentage || 0}%` }}></div>
          </div>

          {/* Certificate Download Button if Completed */}
          {isCourseFinished && (
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setShowCertModal(true)}
              style={{ width: '100%', marginTop: '1rem', background: 'linear-gradient(135deg, #c5a059, #e9b646)', color: '#1a237e', fontWeight: '800' }}
            >
              <Award size={16} /> Download Certificate
            </button>
          )}
        </div>

        {/* Modules & Lessons List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
          {course.modules?.map((mod, mIdx) => (
            <div key={mod.id || mIdx}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                {mod.title}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {mod.lessons?.map(les => {
                  const isDone = completedLessons.includes(les.id);
                  const isActive = activeLesson?.id === les.id;

                  return (
                    <div
                      key={les.id}
                      onClick={() => setActiveLesson(les)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        background: isActive ? 'var(--primary-light)' : 'var(--bg-surface-subtle)',
                        border: `1.5px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        transition: 'var(--transition)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {isDone ? (
                          <CheckCircle2 size={16} color="var(--success)" />
                        ) : (
                          <PlayCircle size={16} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
                        )}
                        <span style={{ fontWeight: isActive ? '700' : '500' }}>{les.title}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{les.duration || '10:00'}</span>
                    </div>
                  );
                })}

                {/* Module Quiz Trigger */}
                {mod.quiz && (
                  <div
                    onClick={() => setActiveQuiz(mod.quiz)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(139, 92, 246, 0.12)',
                      color: 'var(--accent)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      marginTop: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <HelpCircle size={16} />
                      <span>{mod.quiz.title}</span>
                    </div>
                    {progress?.quizScores?.[mod.quiz.id] ? (
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                        {progress.quizScores[mod.quiz.id]}%
                      </span>
                    ) : (
                      <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>Take</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Learning Content Area */}
      <div>
        {activeLesson ? (
          <VideoPlayer
            lesson={activeLesson}
            initialTime={videoTimestamps[activeLesson.id] || 0}
            onTimeUpdate={handleTimeUpdate}
            onComplete={handleLessonComplete}
            isCompleted={completedLessons.includes(activeLesson.id)}
          />
        ) : (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <BookOpen size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h3>Select a lesson from the module list to begin</h3>
          </div>
        )}
      </div>

      {/* Quiz Modal */}
      {activeQuiz && (
        <QuizModal
          quiz={activeQuiz}
          courseId={courseId}
          onClose={() => setActiveQuiz(null)}
          onQuizPassed={handleQuizPassed}
        />
      )}

      {/* Certificate Modal */}
      {showCertModal && (
        <CertificateModal
          course={course}
          userName={user?.name}
          completionDate={progress?.completedAt ? new Date(progress.completedAt).toLocaleDateString() : new Date().toLocaleDateString()}
          onClose={() => setShowCertModal(false)}
        />
      )}
    </div>
  );
};
