import React, { useRef } from 'react';
import { Award, Download, Printer, X, ShieldCheck } from 'lucide-react';

export const CertificateModal = ({ course, userName, completionDate, onClose }) => {
  const certRef = useRef(null);
  const certId = `EDU-${course?._id?.substring(0, 6)?.toUpperCase() || 'LMS'}-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrintDownload = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '860px',
        maxHeight: '95vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        overflow: 'auto'
      }}>
        {/* Header toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={24} color="#c5a059" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Course Completion Certificate</h3>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrintDownload}>
              <Printer size={16} /> Save PDF / Print
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div ref={certRef} className="certificate-preview">
          <div className="certificate-inner">
            {/* Top Seal & Brand */}
            <div>
              <div style={{ fontSize: '0.85rem', letterSpacing: '4px', color: '#1a237e', fontWeight: '800', textTransform: 'uppercase' }}>
                EDUPULSE ONLINE LEARNING ACADEMY
              </div>
              <div className="certificate-title" style={{ marginTop: '0.25rem' }}>
                Certificate of Completion
              </div>
              <div className="certificate-subtitle" style={{ marginTop: '0.25rem' }}>
                This is proudly presented to
              </div>
            </div>

            {/* Candidate Name */}
            <div style={{ width: '100%' }}>
              <div className="certificate-name">
                {userName || 'Alex Rivera'}
              </div>
              <p style={{ fontSize: '0.95rem', color: '#555', marginTop: '0.75rem', lineHeight: '1.5' }}>
                for successfully completing the comprehensive online curriculum and assessments for
              </p>
              <h3 style={{ fontSize: '1.35rem', color: '#1a237e', fontWeight: '800', marginTop: '0.4rem' }}>
                {course?.title || 'Masterclass Online Learning Course'}
              </h3>
            </div>

            {/* Footer Verification & Signatures */}
            <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderTop: '1px solid #e0e0e0', paddingTop: '1rem' }}>
              {/* Date & ID */}
              <div style={{ textAlign: 'left', fontSize: '0.8rem', color: '#666' }}>
                <div><strong>Issue Date:</strong> {completionDate || new Date().toLocaleDateString()}</div>
                <div><strong>Credential ID:</strong> {certId}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2e7d32', marginTop: '2px', fontWeight: '600' }}>
                  <ShieldCheck size={14} /> Verified Authentic Certificate
                </div>
              </div>

              {/* Gold Medal Badge */}
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #f9d976 0%, #e9b646 100%)',
                boxShadow: '0 4px 12px rgba(233,182,70,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1a237e',
                fontWeight: '900',
                fontSize: '0.7rem',
                textAlign: 'center',
                border: '2px solid #fff'
              }}>
                EXCELLENCE
              </div>

              {/* Instructor Signature */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'serif', fontSize: '1.2rem', fontStyle: 'italic', color: '#1a237e', borderBottom: '1px solid #999', paddingBottom: '2px' }}>
                  {course?.instructor?.name || 'Dr. Sarah Jenkins'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>Lead Course Instructor</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
