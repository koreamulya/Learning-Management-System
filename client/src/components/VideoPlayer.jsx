import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, CheckCircle2, Download, FastForward, FileText } from 'lucide-react';

export const VideoPlayer = ({ lesson, initialTime = 0, onTimeUpdate, onComplete, isCompleted }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (videoRef.current && initialTime > 0) {
      videoRef.current.currentTime = initialTime;
    }
  }, [lesson, initialTime]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(cur);

    // Save timestamp periodically
    if (onTimeUpdate && Math.floor(cur) % 5 === 0) {
      onTimeUpdate(cur);
    }

    // Auto complete if watched >90%
    if ((cur / dur) > 0.90 && !isCompleted && onComplete) {
      onComplete();
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Video Container */}
      <div 
        className="glass-card" 
        style={{ 
          position: 'relative', 
          width: '100%', 
          aspectRatio: '16/9', 
          background: '#000', 
          borderRadius: 'var(--radius-md)', 
          overflow: 'hidden' 
        }}
      >
        <video
          ref={videoRef}
          src={lesson.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          onEnded={() => {
            setIsPlaying(false);
            if (onComplete && !isCompleted) onComplete();
          }}
          onClick={togglePlay}
        />

        {/* Overlay Completion Tag */}
        {isCompleted && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'var(--success)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: '700',
            fontSize: '0.85rem'
          }}>
            <CheckCircle2 size={16} /> Completed
          </div>
        )}
      </div>

      {/* Control Toolbar */}
      <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-primary btn-sm" onClick={togglePlay}>
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Timeline Slider */}
        <input 
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          style={{ flex: 1, minWidth: '150px', cursor: 'pointer', accentColor: 'var(--primary)' }}
        />

        {/* Speed & Mark Complete Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.825rem' }}>
            <FastForward size={14} color="var(--text-muted)" />
            {[0.75, 1.0, 1.25, 1.5, 2.0].map(speed => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: playbackSpeed === speed ? '700' : '400',
                  background: playbackSpeed === speed ? 'var(--primary)' : 'var(--bg-surface-subtle)',
                  color: playbackSpeed === speed ? '#fff' : 'var(--text-muted)'
                }}
              >
                {speed}x
              </button>
            ))}
          </div>

          <button 
            className={`btn ${isCompleted ? 'btn-secondary' : 'btn-primary'} btn-sm`}
            onClick={onComplete}
            disabled={isCompleted}
          >
            <CheckCircle2 size={16} /> {isCompleted ? 'Completed' : 'Mark Done'}
          </button>
        </div>
      </div>

      {/* Lesson Description & Attachments */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          {lesson.title}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          {lesson.description || 'No description available for this lesson.'}
        </p>

        {lesson.resources && lesson.resources.length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.925rem', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} color="var(--primary)" /> Lesson Resources & Downloads
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {lesson.resources.map((res, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '0.65rem 1rem',
                    background: 'var(--bg-surface-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{res.name}</span>
                  <a 
                    href={res.url} 
                    download
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Download size={14} /> Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
