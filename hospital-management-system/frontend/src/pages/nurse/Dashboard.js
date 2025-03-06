import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Clipboard, FileText, Activity, Bell, ChevronRight, Package } from 'lucide-react';
import './Dashboard.css';

const NurseDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('tasks');
  const [notifications, setNotifications] = useState(3);

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
    { id: 4, time: '12:30 PM', task: 'Lunch break', priority: 'low', completed: false },
    { id: 5, time: '01:30 PM', task: 'Patient intake - Room 307', priority: 'medium', completed: false },
  ];

  const upcomingAppointments = [
    { id: 1, time: '10:00 AM', patient: 'Emma Johnson', room: '304', doctor: 'Dr. Wilson', type: 'Check-up' },
    { id: 2, time: '11:30 AM', patient: 'Michael Brown', room: '310', doctor: 'Dr. Thompson', type: 'Post-surgery' },
    { id: 3, time: '02:00 PM', patient: 'Sarah Davis', room: '305', doctor: 'Dr. Roberts', type: 'Medication review' },
  ];

  const patientNotes = [
    { id: 1, patient: 'Emma Johnson', date: '10:15 AM', note: 'Patient reports feeling better after medication change. Vitals stable.' },
    { id: 2, patient: 'Robert Chen', date: 'Yesterday', note: 'Post-op care for knee replacement. Pain managed with prescribed medication.' },
    { id: 3, patient: 'Maria Garcia', date: 'Yesterday', note: 'Blood glucose levels stabilizing. Continue monitoring before meals.' },
  ];

  const doctorAssignments = [
    { id: 1, doctor: 'Dr. Wilson', specialty: 'Cardiology', patients: 5, location: 'West Wing' },
    { id: 2, doctor: 'Dr. Thompson', specialty: 'Orthopedics', patients: 3, location: 'East Wing' },
    { id: 3, doctor: 'Dr. Roberts', specialty: 'Internal Medicine', patients: 7, location: 'West Wing' },
  ];

  const medicationSchedule = [
    { id: 1, time: '09:30 AM', patient: 'John Smith', medication: 'Lisinopril 10mg', room: '302', status: 'Completed' },
    { id: 2, time: '10:00 AM', patient: 'Emma Johnson', medication: 'Metformin 500mg', room: '304', status: 'Pending' },
    { id: 3, time: '11:00 AM', patient: 'Michael Brown', medication: 'Hydrocodone 5mg', room: '310', status: 'Pending' },
    { id: 4, time: '02:30 PM', patient: 'Sarah Davis', medication: 'Atorvastatin 20mg', room: '305', status: 'Pending' },
  ];

  const toggleTaskStatus = (id) => {
    // Update task status logic would go here
    console.log(`Toggling task ${id}`);
  };

  return (
    <div className="nurse-dashboard">
      <div className="dashboard-header">
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
          <div className="user-profile">
            <div className="avatar">JS</div>
            <div className="user-info">
              <h3>Jane Smith, RN</h3>
              <p>Floor 3 - Medical-Surgical</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'tasks' ? 'active' : ''}`} 
          onClick={() => setActiveTab('tasks')}
        >
          <Clipboard size={18} /> Tasks & Appointments
        </button>
        <button 
          className={`tab ${activeTab === 'notes' ? 'active' : ''}`} 
          onClick={() => setActiveTab('notes')}
        >
          <FileText size={18} /> Patient Notes
        </button>
        <button 
          className={`tab ${activeTab === 'doctors' ? 'active' : ''}`} 
          onClick={() => setActiveTab('doctors')}
        >
          <User size={18} /> Doctor Assignments
        </button>
        <button 
          className={`tab ${activeTab === 'medications' ? 'active' : ''}`} 
          onClick={() => setActiveTab('medications')}
        >
          <Package size={18} /> Medication Tracking
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'tasks' && (
          <div className="tasks-container animate-fade-in">
            <div className="task-list">
              <div className="section-header">
                <h2><Activity size={20} /> Today's Tasks</h2>
                <a href="/nurse/appointments" className="view-all-link">View All <ChevronRight size={16} /></a>
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
                <a href="/nurse/appointments" className="view-all-link">View All <ChevronRight size={16} /></a>
              </div>
              <ul className="appointments">
                {upcomingAppointments.map(appointment => (
                  <li key={appointment.id} className="appointment-item animate-slide-in">
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
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="notes-container animate-fade-in">
            <div className="section-header">
              <h2><FileText size={20} /> Patient Care Notes</h2>
              <button className="add-note-btn">+ Add Note</button>
            </div>
            <div className="notes-list">
              {patientNotes.map(note => (
                <div key={note.id} className="note-card animate-slide-in">
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
        )}

        {activeTab === 'doctors' && (
          <div className="doctors-container animate-fade-in">
            <div className="section-header">
              <h2><User size={20} /> Doctor Assignments</h2>
            </div>
            <div className="doctors-list">
              {doctorAssignments.map(doctor => (
                <div key={doctor.id} className="doctor-card animate-slide-in">
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
        )}

        {activeTab === 'medications' && (
          <div className="medications-container animate-fade-in">
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
        )}
      </div>

      <div className="dashboard-summary">
        <div className="summary-card animate-fade-in">
          <div className="summary-icon task-icon">
            <Clipboard size={20} />
          </div>
          <div className="summary-content">
            <h3>Tasks</h3>
            <p className="summary-number">5</p>
            <p className="summary-text">3 remaining</p>
          </div>
        </div>
        <div className="summary-card animate-fade-in">
          <div className="summary-icon appointment-icon">
            <Calendar size={20} />
          </div>
          <div className="summary-content">
            <h3>Appointments</h3>
            <p className="summary-number">3</p>
            <p className="summary-text">Today</p>
          </div>
        </div>
        <div className="summary-card animate-fade-in">
          <div className="summary-icon medication-icon">
            <Package size={20} />
          </div>
          <div className="summary-content">
            <h3>Medications</h3>
            <p className="summary-number">4</p>
            <p className="summary-text">1 completed</p>
          </div>
        </div>
        <div className="summary-card animate-fade-in">
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
  );
};

export default NurseDashboard;