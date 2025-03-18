import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, User, Clipboard, FileText, Bell, Package, Settings } from 'lucide-react';
import './Dashboard.css';

const DoctorAssignments = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [nurseInfo, setNurseInfo] = useState({ name: "", department: "" , title:"" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch doctors and their patient counts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:8000/doctors-with-patient-counts');
        if (!response.ok) throw new Error("Failed to fetch doctors");

        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
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
    

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading doctor assignments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

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
              {doctors.map((doctor, index) => (
                <div key={index} className="doctor-card">
                  <div className="doctor-avatar">
                    {doctor.doctor_name && doctor.doctor_name.split(' ').length > 1
                      ? doctor.doctor_name.split(' ')[1][0]
                      : doctor.doctor_name?.[0] || 'D'}
                  </div>
                  <div className="doctor-info">
                    <h3>{doctor.doctor_name}</h3>
                    <p>{doctor.department}</p>
                    <div className="doctor-meta">
                      <span>{doctor.patient_count} Patients</span>
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
                <p className="summary-number">{doctors.length}</p>
                <p className="summary-text">On duty</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon patient-icon">
                <User size={20} />
              </div>
              <div className="summary-content">
                <h3>Patients</h3>
                <p className="summary-number">
                  {doctors.reduce((total, doctor) => total + doctor.patient_count, 0)}
                </p>
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