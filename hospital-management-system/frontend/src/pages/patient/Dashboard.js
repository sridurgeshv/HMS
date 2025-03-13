import React, { useState, useEffect, useContext } from 'react';
import { Calendar, FileText, User, Pill, Activity, Bell, Clock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { PatientContext } from "../../PatientContext";
import './Dashboard.css';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const context = useContext(PatientContext);
  const patientId = context?.patientId || null;
  const location = useLocation();
  
  // Assuming username is stored in local storage after signup
  const username = localStorage.getItem("username");
  
  useEffect(() => {
    // Fetch the patient's data
    const loadData = async () => {
      if (patientId) {
        await fetchAppointments();
      }
      
      if (username) {
        await fetchProfile();
      }
      
      // Simulate other data loading
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
    
    loadData();
  }, [patientId, username]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/appointments/${patientId}`);
      if (Array.isArray(response.data)) {
        setAppointments(response.data);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    }
  };
  
  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8000/user-profile/${username}`);
      if (!response.ok) throw new Error("Failed to fetch profile data");
      
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/appointments')) return 'appointments';
    if (path.includes('/medical-history')) return 'medical-history';
    if (path.includes('/medications')) return 'medications';
    if (path.includes('/profile')) return 'profile';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  // Get stats based on fetched data
  const getStats = () => {
    return [
      { title: "Upcoming Appointments", value: appointments.length.toString(), icon: <Calendar size={24} /> },
      { title: "Medications", value: "3", icon: <Pill size={24} /> },
      { title: "Recent Reports", value: "1", icon: <FileText size={24} /> }
    ];
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="pulse-loader"></div>
        <p>Loading your health information...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="logo">CuraSphere</h2>
        </div>
        <div className="sidebar-content">
          <div className="user-profile">
            <div className="avatar">{profile ? profile.full_name[0] : username ? username[0] : "JD"}</div>
            <div className="user-info">
              <h3>{profile ? profile.full_name : "John Doe"}</h3>
              <p>Patient ID: {profile ? profile.patient_id : patientId || "12345678"}</p>
            </div>
          </div>
          <nav className="sidebar-menu">
            <Link 
              to="/patient/dashboard" 
              className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            >
              <Activity size={20} />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/patient/appointments" 
              className={`menu-item ${activeTab === 'appointments' ? 'active' : ''}`}
            >
              <Calendar size={20} />
              <span>Appointments</span>
            </Link>
            <Link 
              to="/patient/medical-history" 
              className={`menu-item ${activeTab === 'medical-history' ? 'active' : ''}`}
            >
              <FileText size={20} />
              <span>Medical History</span>
            </Link>
            <Link 
              to="/patient/medications" 
              className={`menu-item ${activeTab === 'medications' ? 'active' : ''}`}
            >
              <Pill size={20} />
              <span>Medications</span>
            </Link>
            <Link 
              to="/patient/profile" 
              className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
            >
              <User size={20} />
              <span>Profile</span>
            </Link>
          </nav>
        </div>
      </div>

      <main className="dashboard-main">
        <header className="main-header">
          <h1>Personal Health Dashboard</h1>
          <div className="header-actions">
            <div className="notification-bell">
              <span className="notification-dot"></span>
              <Bell size={24} />
            </div>
          </div>
        </header> 

        <div className="dashboard-content">
          <div className="tab-content dashboard-home fade-in">
            <div className="content-header">
              <h2><Activity size={20} /> Health Overview</h2>
            </div>
            
            <div className="stats-cards">
              {stats.map((stat, index) => (
                <div className="stat-card" key={index}>
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-details">
                    <h3>{stat.title}</h3>
                    <p className="stat-value">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Upcoming Appointments Section */}
            {appointments.length > 0 && (
              <div className="upcoming-appointments mt-30">
                <h3>Upcoming Appointments</h3>
                <div className="appointment-cards">
                  {appointments.slice(0, 2).map(appointment => (
                    <div className="appointment-card" key={appointment.id}>
                      <div className="appointment-date">
                        <div className="month">{new Date(appointment.date).toLocaleString('default', { month: 'short' })}</div>
                        <div className="day">{new Date(appointment.date).getDate()}</div>
                      </div>
                      <div className="appointment-details">
                        <h3>{appointment.doctor_name || "Doctor will be assigned"}</h3>
                        <p className="specialty">{appointment.department}</p>
                        <p className="time"><Clock size={14} /> {appointment.time}</p>
                      </div>
                      <Link to="/patient/appointments" className="view-more-link">
                        Manage
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="health-vitals mt-30">
              <h3>Health Vitals</h3>
              <div className="vitals-cards">
                <div className="vital-card">
                  <Activity size={20} />
                  <h4>Heart Rate</h4>
                  <div className="vital-reading">72 <span>bpm</span></div>
                  <div className="vital-chart"></div>
                </div>
                <div className="vital-card">
                  <Activity size={20} />
                  <h4>Blood Pressure</h4>
                  <div className="vital-reading">120/80 <span>mmHg</span></div>
                  <div className="vital-chart"></div>
                </div>
                <div className="vital-card">
                  <Activity size={20} />
                  <h4>Blood Sugar</h4>
                  <div className="vital-reading">110 <span>mg/dL</span></div>
                  <div className="vital-chart"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;