import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, X } from 'lucide-react';
import { api } from '../services/api';

export const QuizModal = ({ quiz, courseId, onClose, onQuizPassed }) => {
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (qId, value) => {
    setUserAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.submitQuiz({
        courseId,
        quizId: quiz.id,
        userAnswers
      });
      setResult(res);
      setSubmitted(true);
      if (res.passed && onQuizPassed) {
        onQuizPassed(res.score);
      }
    } catch (err) {
      console.error('Quiz submit failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setUserAnswers({});
    setSubmitted(false);
    setResult(null);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div 
        className="glass-card" 
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--bg-surface)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={20} color="var(--primary)" /> {quiz.title}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Passing score: {quiz.passingScore || 60}%
            </span>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {quiz.questions.map((q, idx) => (
                <div 
                  key={q.id || idx}
                  style={{
                    padding: '1.25rem',
                    background: 'var(--bg-surface-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.85rem' }}>
                    Q{idx + 1}. {q.question}
                  </h4>

                  {/* Multiple Choice & True/False */}
                  {(q.type === 'multiple-choice' || q.type === 'true-false') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {q.options.map((opt, oIdx) => (
                        <label 
                          key={oIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.65rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            background: userAnswers[q.id || idx] === opt ? 'var(--primary-light)' : 'var(--bg-surface)',
                            border: `1.5px solid ${userAnswers[q.id || idx] === opt ? 'var(--primary)' : 'var(--border-color)'}`,
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: userAnswers[q.id || idx] === opt ? '600' : '400'
                          }}
                        >
                          <input
                            type="radio"
                            name={`q_${q.id || idx}`}
                            value={opt}
                            checked={userAnswers[q.id || idx] === opt}
                            onChange={() => handleOptionChange(q.id || idx, opt)}
                            style={{ accentColor: 'var(--primary)' }}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Fill in the Blanks */}
                  {q.type === 'fill-blank' && (
                    <div>
                      <input
                        type="text"
                        placeholder="Type your answer here..."
                        value={userAnswers[q.id || idx] || ''}
                        onChange={(e) => handleOptionChange(q.id || idx, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-surface)',
                          color: 'var(--text-main)',
                          outline: 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}

              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={loading}
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {loading ? 'Evaluating Answers...' : 'Submit Assessment'}
              </button>
            </form>
          ) : (
            /* Results Screen */
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: result.passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: result.passed ? 'var(--success)' : 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                {result.passed ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>
                {result.passed ? 'Congratulations! Quiz Passed' : 'Keep Practicing!'}
              </h2>

              <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                You scored <strong style={{ color: 'var(--primary)' }}>{result.score}%</strong> ({result.correctCount}/{result.totalQuestions} correct)
              </p>

              {result.xpEarned > 0 && (
                <div className="badge badge-accent" style={{ fontSize: '0.9rem', padding: '0.4rem 1rem', marginBottom: '1.5rem' }}>
                  <Award size={16} /> Earned +{result.xpEarned} XP Points!
                </div>
              )}

              {/* Answers Breakdown */}
              <div style={{ textAlign: 'left', margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Review Answers:</h4>
                {result.results.map((r, i) => (
                  <div 
                    key={i}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface-subtle)',
                      borderLeft: `4px solid ${r.isCorrect ? 'var(--success)' : 'var(--danger)'}`
                    }}
                  >
                    <p style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                      {i + 1}. {r.questionText}
                    </p>
                    <div style={{ fontSize: '0.85rem', color: r.isCorrect ? 'var(--success)' : 'var(--danger)' }}>
                      Your Answer: {r.userAnswer || '(No answer provided)'}
                    </div>
                    {!r.isCorrect && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Correct Answer: {r.correctAnswer}
                      </div>
                    )}
                    {r.explanation && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.4rem', italic: 'true' }}>
                        💡 {r.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn-secondary" onClick={handleRetake} style={{ flex: 1 }}>
                  <RotateCcw size={16} /> Retake Quiz
                </button>
                <button className="btn btn-primary" onClick={onClose} style={{ flex: 1 }}>
                  Continue Course
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
