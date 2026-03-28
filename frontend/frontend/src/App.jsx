import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Calendar, PlusCircle } from 'lucide-react';
import TimelineScreen from './screens/TimelineScreen';
import CreateScreen from './screens/CreateScreen';
import ActiveScreen from './screens/ActiveScreen';
import ResumePacketScreen from './screens/ResumePacketScreen';

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <header className="navbar">
          <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
            <div className="dot"></div> Resume Packet
          </Link>
          <nav>
            <Link to="/" className="nav-link"><Calendar size={18}/> Timeline</Link>
            <Link to="/create" className="nav-btn"><PlusCircle size={18}/> New Session</Link>
          </nav>
        </header>
        <main className="content">
          <Routes>
            <Route path="/" element={<TimelineScreen />} />
            <Route path="/create" element={<CreateScreen />} />
            <Route path="/active/:id" element={<ActiveScreen />} />
            <Route path="/resume/:id" element={<ResumePacketScreen />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
