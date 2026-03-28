import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessions, updateSession, pauseSession } from '../api';
import { Pause, CheckCircle2, Circle } from 'lucide-react';

export default function ActiveScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState('');
  const timerRef = useRef(null);

  const fetchFullSession = async () => {
    const all = await getSessions();
    const found = all.find(s => s.id === id);
    if (found) {
      setSession(found);
      setNotes(found.notes);
      setElapsed(found.live_elapsed_seconds || 0);
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    fetchFullSession();
    timerRef.current = setInterval(() => setElapsed(prev => prev + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [id, navigate]);

  const handlePause = async () => {
    await pauseSession(id);
    navigate('/');
  };

  const toggleCheck = async (idx) => {
    if (!session) return;
    const newList = [...session.checklist];
    newList[idx].done = !newList[idx].done;
    
    // Optimistic update
    setSession({ ...session, checklist: newList });
    await updateSession(id, { checklist: newList });
  };

  const handleNotes = (val) => {
    setNotes(val);
    updateSession(id, { notes: val });
  };

  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  if (!session) return <div style={{textAlign: 'center', padding: '2rem'}}>Loading...</div>;

  return (
    <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
      <div className="card-header" style={{ textAlign: 'center' }}>
        <h2 className="card-title">{session.title}</h2>
        <div className="live-timer">{formatTime(elapsed)}</div>
        <button onClick={handlePause} className="btn btn-danger" style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}>
          <Pause size={24}/> Pause Timer
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        {/* Left Col: Checklist */}
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Active Checklist</h3>
          {session.checklist.map((item, i) => (
            <div key={i} className={`check-item ${item.done ? 'done' : ''}`} onClick={() => toggleCheck(i)} style={{ cursor: 'pointer' }}>
              {item.done ? <CheckCircle2 color="var(--primary)" size={18}/> : <Circle color="var(--text-muted)" size={18}/>}
              <span>{item.text}</span>
            </div>
          ))}
          {session.checklist.length === 0 && <p className="card-desc">No checklist items.</p>}
        </div>

        {/* Right Col: Notes & Links */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Context Notes</h3>
            <textarea 
              rows="6" 
              value={notes} 
              onChange={e => handleNotes(e.target.value)}
              placeholder="Jot down notes as you work..."
            ></textarea>
          </div>
          
          {session.links?.length > 0 && (
            <div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', color: 'var(--text-muted)' }}>Helpful Links</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {session.links.map((link, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>
                    <a href={link} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>→ {link}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
