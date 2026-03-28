const BASE_URL = 'http://localhost:5000/sessions';

export async function createSession(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create session');
  return res.json();
}

export async function getSessions() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch sessions');
  return res.json();
}

export async function getResumePacket(id) {
  const res = await fetch(`${BASE_URL}/${id}/resume-packet`);
  if (!res.ok) throw new Error('Failed to get resume packet');
  return res.json();
}

export async function updateSession(id, updates) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update session');
  return res.json();
}

export async function pauseSession(id) {
  const res = await fetch(`${BASE_URL}/${id}/pause`, { method: 'PATCH' });
  if (!res.ok) throw new Error('Failed to pause session');
  return res.json();
}

export async function resumeSession(id) {
  const res = await fetch(`${BASE_URL}/${id}/resume`, { method: 'PATCH' });
  if (!res.ok) throw new Error('Failed to resume session');
  return res.json();
}
