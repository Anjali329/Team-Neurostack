import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSessions } from '../api';
import { Clock, Play, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

  // Prepare chart data (minutes spent per session)
  const chartData = sessions.map(s => ({
    name: s.title.substring(0, 15) + '...',
    minutes: Math.round(s.live_elapsed_seconds / 60)
  })).reverse(); // chronological order usually left to right

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Chart Section */}
      <div className="card">
        <div className="card-header" style={{ marginBottom: '1rem' }}>
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={20} color="var(--primary)" /> Activity Analytics
          </h2>
          <p className="card-desc">Time invested per session</p>
        </div>
        
        {sessions.length > 0 ? (
          <div style={{ width: '100%', height: 200, marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: 'var(--text-muted)'}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 12, fill: 'var(--text-muted)'}} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(128, 0, 32, 0.05)'}}
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
                />
                <Bar dataKey="minutes" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p style={{color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0'}}>No data to display</p>
        )}
      </div>

      {/* Timeline Section */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Daily Timeline</h2>
          <p className="card-desc">Total focused time: <strong>{formatTime(totalSeconds)}</strong></p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sessions.map(s => (
            <div key={s.id} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: s.status === 'active' ? 'rgba(128, 0, 32, 0.05)' : 'white' }}>
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
    
    </div>
  );
}
