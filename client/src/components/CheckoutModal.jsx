import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, X, Sparkles } from 'lucide-react';

export const CheckoutModal = ({ course, onSuccess, onClose }) => {
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('•••');
  const [name, setName] = useState('Alex Rivera');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setCompleted(true);
      setTimeout(() => {
        onSuccess(course._id);
      }, 1200);
    }, 1000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '2rem',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Secure Course Checkout</h3>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        {!completed ? (
          <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Summary Box */}
            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--primary-light)',
              border: '1px solid var(--primary)',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{course.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instructor: {course.instructor?.name}</div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>
                ${course.price || 49.99}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Cardholder Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-subtle)', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Card Number</label>
              <div style={{ position: 'relative' }}>
                <CreditCard size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-subtle)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Expiry Date</label>
                <input 
                  type="text" 
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-subtle)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>CVV</label>
                <input 
                  type="password" 
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-subtle)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.785rem', color: 'var(--success)', fontWeight: '600' }}>
              <ShieldCheck size={16} /> 256-bit SSL Encrypted Secure Checkout
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              disabled={loading}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? 'Processing Payment...' : `Complete Enrollment ($${course.price || 49.99})`}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <CheckCircle2 size={56} color="var(--success)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>Payment Successful!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Redirecting to your interactive course workspace...</p>
          </div>
        )}
      </div>
    </div>
  );
};
