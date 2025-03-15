import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, User, Clipboard, FileText, Bell, Package } from 'lucide-react';
import './Dashboard.css';

const DoctorAssignments = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const doctorAssignments = [
    { id: 1, doctor: 'Dr. Wilson', specialty: 'Cardiology', patients: 5, location: 'West Wing' },
    { id: 2, doctor: 'Dr. Thompson', specialty: 'Orthopedics', patients: 3, location: 'East Wing' },
    { id: 3, doctor: 'Dr. Roberts', specialty: 'Internal Medicine', patients: 7, location: 'West Wing' },
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
            <h1>Doctor Assignments</h1>
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
          <div className="doctors-container">
            <div className="section-header">
              <h2><User size={20} /> Doctor Assignments</h2>
            </div>
            <div className="doctors-list">
              {doctorAssignments.map(doctor => (
                <div key={doctor.id} className="doctor-card">
                  <div className="doctor-avatar">{doctor.doctor.split(' ')[1][0]}</div>
                  <div className="doctor-info">
                    <h3>{doctor.doctor}</h3>
                    <p>{doctor.specialty}</p>
                    <div className="doctor-meta">
                      <span>{doctor.patients} Patients</span>
                      <span>{doctor.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="dashboard-summary">
            <div className="summary-card">
              <div className="summary-icon doctor-icon">
                <User size={20} />
              </div>
              <div className="summary-content">
                <h3>Doctors</h3>
                <p className="summary-number">3</p>
                <p className="summary-text">On duty</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon patient-icon">
                <User size={20} />
              </div>
              <div className="summary-content">
                <h3>Patients</h3>
                <p className="summary-number">15</p>
                <p className="summary-text">Assigned</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAssignments;