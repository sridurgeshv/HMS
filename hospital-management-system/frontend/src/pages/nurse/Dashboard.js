import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, User, Clipboard, FileText, Activity, Bell, ChevronRight, Package, Settings } from 'lucide-react';
import './Dashboard.css';

const NurseDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const todayTasks = [
    { id: 1, time: '08:00 AM', task: 'Check vitals - Room 302', priority: 'high', completed: false },
    { id: 2, time: '09:30 AM', task: 'Medication - John Smith', priority: 'medium', completed: true },
    { id: 3, time: '11:00 AM', task: 'Assist Dr. Thompson - Room 315', priority: 'high', completed: false },
  ];

  const upcomingAppointments = [
    { id: 1, time: '10:00 AM', patient: 'Emma Johnson', room: '304', doctor: 'Dr. Wilson', type: 'Check-up' },
    { id: 2, time: '11:30 AM', patient: 'Michael Brown', room: '310', doctor: 'Dr. Thompson', type: 'Post-surgery' },
  ];

  const toggleTaskStatus = (id) => {
    // Update task status logic would go here
    console.log(`Toggling task ${id}`);
  };

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
          <Link to="/nurse/profile" className={location.pathname === "/nurse/profile" ? "active" : ""}>
            <Settings size={18} /> Profile
          </Link>
        </nav>
      </div>

      <div className="main-content">
        <header className="main-header">
          <div className="header-left">
            <h1>Nurse Dashboard</h1>
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
          <div className="tasks-container">
            <div className="section-header">
              <h2><Activity size={20} /> Today's Tasks</h2>
              <Link to="/nurse/appointments" className="view-all-link">View All <ChevronRight size={16} /></Link>
            </div>
            <ul className="tasks">
              {todayTasks.map(task => (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''} priority-${task.priority}`}>
                  <div className="task-checkbox" onClick={() => toggleTaskStatus(task.id)}>
                    {task.completed ? '✓' : ''}
                  </div>
                  <div className="task-content">
                    <span className="task-time">{task.time}</span>
                    <span className="task-description">{task.task}</span>
                  </div>
                  <div className="task-priority">
                    <span className="priority-indicator"></span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="appointments-list">
            <div className="section-header">
              <h2><Calendar size={20} /> Upcoming Appointments</h2>
              <Link to="/nurse/appointments" className="view-all-link">View All <ChevronRight size={16} /></Link>
            </div>
            <ul className="appointments">
              {upcomingAppointments.map(appointment => (
                <li key={appointment.id} className="appointment-item">
                  <div className="appointment-time">{appointment.time}</div>
                  <div className="appointment-details">
                    <h3>{appointment.patient}</h3>
                    <div className="appointment-meta">
                      <span><User size={14} /> {appointment.doctor}</span>
                      <span>Room {appointment.room}</span>
                      <span>{appointment.type}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
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
                <p className="summary-number">12</p>
                <p className="summary-text">Assigned</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;