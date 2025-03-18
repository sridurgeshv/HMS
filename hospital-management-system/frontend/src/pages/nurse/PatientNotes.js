import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, User, Clipboard, FileText, Bell, Package, Settings } from 'lucide-react';
import './Dashboard.css';
import axios from 'axios';

const PatientNotes = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);
  const location = useLocation();
  const [nurseInfo, setNurseInfo] = useState({ name: "", department: "", title: "" });
  const [loading, setLoading] = useState(true);
  const [patientNotes, setPatientNotes] = useState([]);
  const [followUpTaskCount, setFollowUpTaskCount] = useState(0); // State for follow-up task count
  const [appointmentCount, setAppointmentCount] = useState(0); // State for appointment count

  // Fetch nurse details
  useEffect(() => {
    const fetchNurseDetails = async () => {
      const nurseId = localStorage.getItem('nurse_id');
      if (!nurseId) {
        console.error("Nurse ID not found in local storage");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/nurse/${nurseId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch nurse details");
        }
        const data = await response.json();
        setNurseInfo(data);
      } catch (error) {
        console.error("Error fetching nurse details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNurseDetails();
  }, []);

  // Fetch follow-up notes
  useEffect(() => {
    const fetchFollowUpNotes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/follow-up-notes');
        if (Array.isArray(response.data)) {
          setPatientNotes(response.data);
          setFollowUpTaskCount(response.data.length); // Set follow-up task count
        }
      } catch (error) {
        console.error("Error fetching follow-up notes:", error);
      }
    };

    fetchFollowUpNotes();
  }, []);

  // Fetch appointment count using doctors-with-patient-counts route
  useEffect(() => {
    const fetchAppointmentCount = async () => {
      try {
        const response = await axios.get('http://localhost:8000/doctors-with-patient-counts');
        if (Array.isArray(response.data)) {
          const totalAppointments = response.data.reduce((acc, doctor) => acc + doctor.patient_count, 0);
          setAppointmentCount(totalAppointments); // Set appointment count
        }
      } catch (error) {
        console.error("Error fetching appointment count:", error);
      }
    };

    fetchAppointmentCount();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="avatar">JS</div>
          <div className="user-info">
            <h2>{nurseInfo.name}, {nurseInfo.title}</h2>
            <p>{nurseInfo.department} | {nurseInfo.floor}</p>
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
                    <h3>{note.appointment_id}</h3>
                    <span className="note-date">{note.doctor_id}</span>
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
                <p className="summary-number">{followUpTaskCount}</p>
                <p className="summary-text">Follow-Up Notes</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon appointment-icon">
                <Calendar size={20} />
              </div>
              <div className="summary-content">
                <h3>Appointments</h3>
                <p className="summary-number">{appointmentCount}</p>
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