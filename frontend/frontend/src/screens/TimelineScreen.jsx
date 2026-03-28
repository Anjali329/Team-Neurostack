import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSessions } from '../api';
import { Clock, Play } from 'lucide-react';

export default function TimelineScreen() {
  const [sessions, setSessions] = useState([]);
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    getSessions().then(data => {
      setSessions(data);
      const total = data.reduce((acc, s) => acc + s.live_elapsed_seconds, 0);
      setTotalSeconds(total);
    });
  }, []);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Daily Timeline</h2>
        <p className="card-desc">Total focused time: <strong>{formatTime(totalSeconds)}</strong></p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sessions.map(s => (
          <div key={s.id} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: s.status === 'active' ? 'rgba(16, 185, 129, 0.05)' : 'white' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{s.title}</h3>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', gap: '1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={14}/> {formatTime(s.live_elapsed_seconds)}
                </span>
                <span style={{ 
                  color: s.status === 'active' ? 'var(--secondary)' : 'var(--warning)', 
                  fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem'
                }}>
                  {s.status === 'active' ? '● Active' : '⏸ Paused'}
                </span>
              </div>
            </div>
            
            {s.status === 'active' ? (
              <Link to={`/active/${s.id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                <Play size={16}/> View Session
              </Link>
            ) : (
              <Link to={`/resume/${s.id}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                <Play size={16}/> Resume Packet
              </Link>
            )}
          </div>
        ))}
        {sessions.length === 0 && <p style={{color: 'var(--text-muted)'}}>No sessions today. Start your first task!</p>}
      </div>
    </div>
  );
}
