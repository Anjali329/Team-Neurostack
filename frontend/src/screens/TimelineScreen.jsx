import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSessions } from '../api';
import { Clock, Play, BarChart3, PlaySquare, BookOpen, Calendar as CalendarIcon, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TimelineScreen() {
  const [sessions, setSessions] = useState([]);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });

  useEffect(() => {
    getSessions().then(data => {
      setSessions(data);
      const total = data.reduce((acc, s) => acc + s.live_elapsed_seconds, 0);
      setTotalSeconds(total);

      // Calculate overall project progress
      let comp = 0, tot = 0;
      data.forEach(s => {
        s.checklist.forEach(item => {
          tot++;
          if (item.done) comp++;
        });
      });
      setProgress({ completed: comp, total: tot });
    });
  }, []);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  // Group by Date for Calendar-wise display
  const groupedByDay = sessions.reduce((acc, s) => {
    const day = new Date(s.created_at).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    if (!acc[day]) acc[day] = [];
    acc[day].push(s);
    return acc;
  }, {});

  const chartData = sessions.map(s => ({
    name: s.title.substring(0, 15) + '...',
    minutes: Math.round(s.live_elapsed_seconds / 60)
  })).reverse();

  const progressPercent = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Project Progress Tracker */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-card) 0%, #fdf2f8 100%)', border: '1px solid #fbcfe8' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
              <Target size={24} /> Overall Project Progress
            </h2>
            <p className="card-desc">Your hackathon sprint completion</p>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
            {progressPercent}%
          </div>
        </div>
        
        {/* Animated Progress Bar */}
        <div style={{ width: '100%', height: '16px', background: 'var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', 
            width: `${progressPercent}%`, 
            background: 'linear-gradient(90deg, var(--secondary) 0%, var(--primary) 100%)',
            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' 
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span>{progress.completed} Tasks Complete</span>
          <span>{progress.total - progress.completed} Pending</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Left Col: Calendar Learning Journey */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarIcon size={24} color="var(--primary)" /> Learning Journey
          </h2>

          {Object.entries(groupedByDay).map(([dayLabel, daySessions], dayIdx) => (
            <div key={dayLabel} className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ background: 'var(--primary)', color: 'white', padding: '1rem 1.5rem', fontWeight: 600 }}>
                Day {Object.keys(groupedByDay).length - dayIdx}: {dayLabel}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {daySessions.map(s => (
                  <div key={s.id} style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{s.title}</h3>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', gap: '1rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={14}/> {formatTime(s.live_elapsed_seconds)} invested
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

                    {/* YouTube Review Section */}
                    {(s.youtube_link || s.revision_summary) && (
                      <div style={{ background: 'var(--bg)', borderRadius: '8px', padding: '1rem', marginTop: '1rem', borderLeft: '4px solid #ef4444' }}>
                        {s.youtube_link && (
                          <a href={s.youtube_link} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', textDecoration: 'none', fontWeight: 600, marginBottom: '0.5rem' }}>
                            <PlaySquare size={18}/> Watch YouTube Revision Playlist
                          </a>
                        )}
                        {s.revision_summary && (
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                            <BookOpen size={16} style={{ color: 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }}/>
                            <p><strong>Next Day Summary:</strong> {s.revision_summary}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Col: Analytics Graph */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ flex: 1 }}>
            <div className="card-header" style={{ marginBottom: '1rem' }}>
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart3 size={20} color="var(--primary)" /> Activity Analytics
              </h2>
              <p className="card-desc">Time invested per session</p>
            </div>
            
            {sessions.length > 0 ? (
              <div style={{ width: '100%', height: 300, marginTop: '1rem' }}>
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
        </div>
      </div>
    
    </div>
  );
}
