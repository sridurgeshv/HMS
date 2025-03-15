import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, User, Clipboard, FileText, Bell, Package } from 'lucide-react';
import './Dashboard.css';

const MedicationTracking = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const medicationSchedule = [
    { id: 1, time: '09:30 AM', patient: 'John Smith', medication: 'Lisinopril 10mg', room: '302', status: 'Completed' },
    { id: 2, time: '10:00 AM', patient: 'Emma Johnson', medication: 'Metformin 500mg', room: '304', status: 'Pending' },
    { id: 3, time: '11:00 AM', patient: 'Michael Brown', medication: 'Hydrocodone 5mg', room: '310', status: 'Pending' },
    { id: 4, time: '02:30 PM', patient: 'Sarah Davis', medication: 'Atorvastatin 20mg', room: '305', status: 'Pending' },
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
            <h1>Medication Tracking</h1>
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
          <div className="medications-container">
            <div className="section-header">
              <h2><Package size={20} /> Medication Schedule</h2>
            </div>
            <table className="medications-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Medication</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {medicationSchedule.map(med => (
                  <tr key={med.id} className={`med-row ${med.status.toLowerCase()}`}>
                    <td>{med.time}</td>
                    <td>{med.patient}</td>
                    <td>{med.medication}</td>
                    <td>{med.room}</td>
                    <td>
                      <span className="status-pill">{med.status}</span>
                    </td>
                    <td>
                      {med.status === 'Pending' && (
                        <button className="administer-btn">Administer</button>
                      )}
                      {med.status === 'Completed' && (
                        <button className="view-details-btn">Details</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="dashboard-summary">
            <div className="summary-card">
              <div className="summary-icon medication-icon">
                <Package size={20} />
              </div>
              <div className="summary-content">
                <h3>Medications</h3>
                <p className="summary-number">4</p>
                <p className="summary-text">1 completed</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon patient-icon">
                <User size={20} />
              </div>
              <div className="summary-content">
                <h3>Patients</h3>
                <p className="summary-number">4</p>
                <p className="summary-text">With medications</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationTracking;