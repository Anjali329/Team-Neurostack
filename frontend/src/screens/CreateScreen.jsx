import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSession } from '../api';
import { Play } from 'lucide-react';

export default function CreateScreen() {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [links, setLinks] = useState(['']);
  const [checklist, setChecklist] = useState(['']);
  const navigate = useNavigate();

  const handleDynamicInput = (idx, value, list, setList) => {
    const updated = [...list];
    updated[idx] = value;
    if (idx === updated.length - 1 && value) updated.push(''); // auto add new line
    setList(updated);
  };

  const handleStart = async (e) => {
    e.preventDefault();
    const cleanLinks = links.filter(l => l.trim() !== '');
    const cleanChecklist = checklist.filter(c => c.trim() !== '');
    
    const sess = await createSession({
      title: title || 'Untitled Task',
      notes,
      links: cleanLinks,
      checklist: cleanChecklist
    });
    navigate(`/active/${sess.id}`);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Create Session</h2>
        <p className="card-desc">Define your task and goals before staring the timer.</p>
      </div>

      <form onSubmit={handleStart}>
        <div className="form-group">
          <label className="form-label">What are you working on?</label>
          <input type="text" placeholder="e.g., Fix login screen bug" value={title} onChange={e => setTitle(e.target.value)} autoFocus required />
        </div>
        
        <div className="form-group">
          <label className="form-label">Context Notes</label>
          <textarea rows="3" placeholder="Jot down initial thoughts..." value={notes} onChange={e => setNotes(e.target.value)}></textarea>
        </div>

        <div className="form-group">
          <label className="form-label">Relevant Links</label>
          {links.map((link, i) => (
            <input key={i} type="url" placeholder="https://..." value={link} onChange={e => handleDynamicInput(i, e.target.value, links, setLinks)} style={{marginBottom: '0.5rem'}} />
          ))}
        </div>

        <div className="form-group">
          <label className="form-label">Checklist Items</label>
          {checklist.map((item, i) => (
            <input key={i} type="text" placeholder="Step..." value={item} onChange={e => handleDynamicInput(i, e.target.value, checklist, setChecklist)} style={{marginBottom: '0.5rem'}} />
          ))}
        </div>

        <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>
          <Play size={20}/> Start Focus Session
        </button>
      </form>
    </div>
  );
}
