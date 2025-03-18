import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, User, Clipboard, FileText, Bell, ChevronRight, Package, Settings } from 'lucide-react';
import './Dashboard.css';
import axios from 'axios';

const NurseDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);
  const location = useLocation();
  const [nurseInfo, setNurseInfo] = useState({ name: "", department: "", title: "" });
  const [loading, setLoading] = useState(true);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [patientNotes, setPatientNotes] = useState([]); // State for follow-up notes
  const [appointmentCount, setAppointmentCount] = useState(0); // State for appointment count
  const [medicationCount, setMedicationCount] = useState(0); // State for medication count
  const [patientCount, setPatientCount] = useState(0); // State for patient count
  const [followUpTaskCount, setFollowUpTaskCount] = useState(0); // State for follow-up task count

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  // Fetch appointments count
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/appointments');
        if (Array.isArray(response.data)) {
          setUpcomingAppointments(response.data);
          setAppointmentCount(response.data.length); // Set appointment count
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  // Fetch medications count
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await axios.get('http://localhost:8000/medications');
        if (Array.isArray(response.data)) {
          setMedicationCount(response.data.length); // Set medication count
        }
      } catch (error) {
        console.error("Error fetching medications:", error);
      }
    };

    fetchMedications();
  }, []);

  // Fetch patient count from doctors-with-patient-counts
  useEffect(() => {
    const fetchPatientCount = async () => {
      try {
        const response = await axios.get('http://localhost:8000/doctors-with-patient-counts');
        if (Array.isArray(response.data)) {
          const totalPatients = response.data.reduce((acc, doctor) => acc + doctor.patient_count, 0);
          setPatientCount(totalPatients); // Set patient count
        }
      } catch (error) {
        console.error("Error fetching patient count:", error);
      }
    };

    fetchPatientCount();
  }, []);

  // Fetch follow-up notes count
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
          {/* Follow-Up Notes Section */}
          <div className="tasks-container">
            <div className="section-header">
              <h2><FileText size={20} /> Follow-Up Notes</h2>
              <Link to="/nurse/follow-up-notes" className="view-all-link">View All <ChevronRight size={16} /></Link>
            </div>
            <ul className="tasks">
              {patientNotes.map(note => (
                <li key={note.id} className="task-item">
                  <div className="task-content">
                    <span className="task-description">
                      <strong>Appointment ID:</strong> {note.appointment_id} | <strong>Note:</strong> {note.note}
                    </span>
                    <span className="task-time">
                      <strong>Doctor ID:</strong> {note.doctor_id}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Upcoming Appointments Section */}
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
                      <span>{appointment.type}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard Summary Section */}
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
            <div className="summary-card">
              <div className="summary-icon medication-icon">
                <Package size={20} />
              </div>
              <div className="summary-content">
                <h3>Medications</h3>
                <p className="summary-number">{medicationCount}</p>
                <p className="summary-text">Assigned</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon patient-icon">
                <User size={20} />
              </div>
              <div className="summary-content">
                <h3>Patients</h3>
                <p className="summary-number">{patientCount}</p>
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