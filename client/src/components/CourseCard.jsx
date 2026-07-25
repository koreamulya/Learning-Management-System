import React from 'react';
import { Star, Clock, Users, BookOpen, CheckCircle, Award } from 'lucide-react';

export const CourseCard = ({ course, userProgress, onSelectCourse, onEnroll }) => {
  const isEnrolled = !!userProgress;
  const progressPct = userProgress ? userProgress.completionPercentage || 0 : 0;
  const isCompleted = userProgress ? userProgress.isCompleted : false;

  return (
    <div className="glass-card hover-lift" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Thumbnail Header */}
      <div style={{ position: 'relative', width: '100%', height: '170px', overflow: 'hidden' }}>
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          gap: '6px'
        }}>
          <span className="badge badge-primary">{course.category || 'Web Development'}</span>
          <span className="badge badge-accent">{course.level || 'Beginner'}</span>
        </div>

        {isCompleted && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'var(--success)',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            fontWeight: '700'
          }}>
            <Award size={14} /> Completed
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Title */}
          <h3 
            onClick={() => onSelectCourse(course._id)}
            style={{ 
              fontSize: '1.05rem', 
              fontWeight: '700', 
              lineHeight: '1.4', 
              marginBottom: '0.5rem',
              cursor: 'pointer',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {course.title}
          </h3>

          {/* Instructor & Rating */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img 
                src={course.instructor?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=inst'} 
                alt={course.instructor?.name}
                style={{ width: '24px', height: '24px', borderRadius: '50%' }}
              />
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                {course.instructor?.name || 'Instructor'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--warning)' }}>
              <Star size={14} fill="currentColor" />
              <span>{course.rating || 5.0}</span>
              <span style={{ color: 'var(--text-light)', fontWeight: '400', fontSize: '0.75rem' }}>
                ({course.totalRatings || 1})
              </span>
            </div>
          </div>
        </div>

        {/* Footer info & Actions */}
        <div>
          {/* Enrolled Progress Bar */}
          {isEnrolled ? (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px' }}>
                <span>Learning Progress</span>
                <span style={{ color: 'var(--primary)' }}>{progressPct}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
              </div>
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justify: 'space-between', 
              fontSize: '0.8rem', 
              color: 'var(--text-muted)',
              marginBottom: '1rem',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '0.75rem'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} /> {course.modules?.length || 2} Modules
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={14} /> {course.totalStudents || 0} enrolled
              </span>
            </div>
          )}

          {/* Action Button */}
          {isEnrolled ? (
            <button 
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => onSelectCourse(course._id)}
            >
              <BookOpen size={16} /> Continue Learning
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => onSelectCourse(course._id)}
              >
                Overview
              </button>
              <button 
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => onEnroll(course._id)}
              >
                Enroll Free
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
