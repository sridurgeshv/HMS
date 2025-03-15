import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, User, Clipboard, FileText, Bell, Package } from 'lucide-react';
import './Dashboard.css';

const PatientNotes = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const patientNotes = [
    { id: 1, patient: 'Emma Johnson', date: '10:15 AM', note: 'Patient reports feeling better after medication change. Vitals stable.' },
    { id: 2, patient: 'Robert Chen', date: 'Yesterday', note: 'Post-op care for knee replacement. Pain managed with prescribed medication.' },
    { id: 3, patient: 'Maria Garcia', date: 'Yesterday', note: 'Blood glucose levels stabilizing. Continue monitoring before meals.' },
  ];

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="avatar">JS</div>
          <div className="user-info">
            <h3>Jane Smith, RN</h3>
            <p>Medical-Surgical</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <Link to="/nurse/dashboard" className={location.pathname === "/nurse/dashboard" ? "active" : ""}>
            <Clipboard size={18} /> Dashboard
          </Link>
          <Link to="/nurse/patient-notes" className={location.pathname === "/nurse/patient-notes" ? "active" : ""}>
            <FileText size={18} /> Patient Notes
          </Link>
          <Link to="/nurse/doctor-assignments" className={location.pathname === "/nurse/doctor-assignments" ? "active" : ""}>
            <User size={18} /> Doctor Assignments
          </Link>
          <Link to="/nurse/medication-tracking" className={location.pathname === "/nurse/medication-tracking" ? "active" : ""}>
            <Package size={18} /> Medication Tracking
          </Link>
        </nav>
      </div>

      <div className="main-content">
        <header className="main-header">
          <div className="header-left">
            <h1>Patient Notes</h1>
            <div className="date-time">
              <span className="date"><Calendar size={16} /> {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="time"><Clock size={16} /> {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <div className="header-right">
            <div className="notification-bell">
              <Bell size={20} />
              {notifications > 0 && <span className="notification-badge">{notifications}</span>}
            </div>
          </div>
        </header>

        <div className="content-area">
          <div className="notes-container">
            <div className="section-header">
              <h2><FileText size={20} /> Patient Care Notes</h2>
              <button className="add-note-btn">+ Add Note</button>
            </div>
            <div className="notes-list">
              {patientNotes.map(note => (
                <div key={note.id} className="note-card">
                  <div className="note-header">
                    <h3>{note.patient}</h3>
                    <span className="note-date">{note.date}</span>
                  </div>
                  <p className="note-content">{note.note}</p>
                  <div className="note-actions">
                    <button className="edit-btn">Edit</button>
                    <button className="follow-up-btn">Follow-up</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="dashboard-summary">
            <div className="summary-card">
              <div className="summary-icon task-icon">
                <Clipboard size={20} />
              </div>
              <div className="summary-content">
                <h3>Tasks</h3>
                <p className="summary-number">5</p>
                <p className="summary-text">3 remaining</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon appointment-icon">
                <Calendar size={20} />
              </div>
              <div className="summary-content">
                <h3>Appointments</h3>
                <p className="summary-number">3</p>
                <p className="summary-text">Today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientNotes;