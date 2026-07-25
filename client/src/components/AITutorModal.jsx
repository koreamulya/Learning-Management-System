import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, User } from 'lucide-react';
import { api } from '../services/api';

export const AITutorModal = ({ courseTitle, lessonTitle, onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am your AI Learning Assistant. Ask me anything about ${courseTitle || 'your current course'}, technical concepts, or quiz topics!`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await api.askAI({
        question: userText,
        courseTitle,
        lessonTitle
      });

      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: res.answer || 'Thank you for your question!' }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: 'I encountered an issue processing that. Please try rephrasing your question!' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 900,
      width: '380px',
      maxWidth: 'calc(100vw - 32px)',
      height: '520px',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.3)'
    }} className="glass-card">
      {/* Header */}
      <div style={{
        padding: '1rem 1.25rem',
        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles size={20} />
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>AI Learning Tutor</div>
            <div style={{ fontSize: '0.725rem', opacity: 0.85 }}>Powered by EduPulse AI</div>
          </div>
        </div>
        <button onClick={onClose} style={{ color: '#fff', opacity: 0.9 }}>
          <X size={18} />
        </button>
      </div>

      {/* Message Chat List */}
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {messages.map((m, idx) => (
          <div 
            key={idx}
            style={{
              display: 'flex',
              gap: '0.5rem',
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            {m.sender === 'ai' && (
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Bot size={16} />
              </div>
            )}
            <div style={{
              padding: '0.65rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              background: m.sender === 'user' ? 'var(--primary)' : 'var(--bg-surface-subtle)',
              color: m.sender === 'user' ? '#fff' : 'var(--text-main)',
              fontSize: '0.875rem',
              lineHeight: '1.4',
              border: m.sender === 'ai' ? '1px solid var(--border-color)' : 'none'
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            AI Tutor is typing...
          </div>
        )}
      </div>

      {/* Prompt Form */}
      <form onSubmit={handleSend} style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text"
          placeholder="Ask AI Tutor a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: '0.5rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-surface-subtle)',
            color: 'var(--text-main)',
            fontSize: '0.85rem',
            outline: 'none'
          }}
        />
        <button type="submit" className="btn btn-primary btn-sm" style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem' }}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
