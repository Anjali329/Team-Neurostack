import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResumePacket, resumeSession } from '../api';
import { Play, Sparkles, Clock, ExternalLink } from 'lucide-react';

export default function ResumePacketScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packet, setPacket] = useState(null);

  useEffect(() => {
    getResumePacket(id)
      .then(setPacket)
      .catch(() => navigate('/'));
  }, [id, navigate]);

  const handleResume = async () => {
    await resumeSession(id);
    navigate(`/active/${id}`);
  };

  if (!packet) return <div style={{textAlign:'center', padding:'2rem'}}>Restoring Context...</div>;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      
      {/* THE DIFFERENTIATOR: Context Re-entry Alert */}
      <div className="gap-alert">
        <Clock className="gap-icon" size={24} />
        <div className="gap-text">
          <h3>Context Re-entry Required</h3>
          <p>You last worked on this <strong>{packet.gap_label}</strong>.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
            We've assembled this Resume Packet to get you back into the flow immediately.
          </p>
        </div>
      </div>

      <div className="card" style={{ borderTop: '4px solid var(--secondary)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="card-title" style={{ fontSize: '1.8rem' }}>{packet.title}</h2>
          <p className="card-desc">Review your pending items and notes before starting the timer.</p>
        </div>

        <div style={{ display: 'flex', gap: '2rem' }}>
          
          {/* DIFFERENTIATOR: ONLY Pending Items */}
          <div style={{ flex: 1.2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Pending Checklist</h3>
              <span style={{ fontSize: '0.8rem', background: 'var(--bg)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                {packet.completed_checklist_count} / {packet.total_checklist_count} Completed
              </span>
            </div>
            
            {packet.pending_checklist.map((item, i) => (
              <div key={i} className="check-item" style={{ background: 'var(--bg)', borderColor: 'transparent' }}>
                <span style={{ width: '8px', height: '8px', background: 'var(--secondary)', borderRadius: '50%', flexShrink: 0 }}></span>
                <span>{item.text}</span>
              </div>
            ))}
            
            {packet.pending_checklist.length === 0 && (
              <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '8px', color: 'var(--secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18}/> All checklist items completed!
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Last Notes</h3>
            <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '8px', whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: 'var(--text-main)', minHeight: '120px' }}>
              {packet.notes || <span style={{color: 'var(--text-muted)'}}>No notes recorded.</span>}
            </div>
            
            {packet.links?.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Required Context</h3>
                {packet.links.map((link, i) => (
                  <a key={i} href={link} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <ExternalLink size={14}/> {new URL(link).hostname.replace('www.','')}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <button onClick={handleResume} className="btn btn-secondary" style={{ width: '100%', fontSize: '1.2rem', padding: '1rem' }}>
            <Play size={20}/> I have context, Resume Timer
          </button>
        </div>
      </div>
    </div>
  );
}
