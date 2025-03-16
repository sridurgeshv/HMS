import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Calendar, FileText, User, Pill, Activity, Bell, Clock, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PatientContext } from "../../PatientContext";
import { UserContext } from "../../UserContext";
import './Dashboard.css';

const Dashboard = () => {
  const userContext = useContext(UserContext);
  const { username } = userContext || {};
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const context = useContext(PatientContext);
  const patientId = context?.patientId || null;
  const location = useLocation();
  const navigate = useNavigate();

  // Move the function declarations before useCallback
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
      const response = await axios.get(`http://localhost:8000/user-profile/${username}`);
      if (response.data) {
        setProfile(response.data);
        console.log("Profile data loaded:", response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Don't set profile to null here, keep the previous value
    } finally {
      // Make sure we're not stuck in loading state
      setIsLoading(false);
    }
  };

  const memoizedFetchAppointments = useCallback(fetchAppointments, [patientId]);
  const memoizedFetchProfile = useCallback(fetchProfile, [username]);

  useEffect(() => {
    // Fetch the patient's data
    const loadData = async () => {
      console.log("Loading data with patientId:", patientId, "and username:", username);
      
      try {
        if (patientId) {
          console.log("Fetching appointments for patient:", patientId);
          await memoizedFetchAppointments();
        }
        
        if (username) {
          console.log("Fetching profile for user:", username);
          await memoizedFetchProfile();
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        // Always set loading to false, even if there are errors
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [patientId, username, memoizedFetchAppointments, memoizedFetchProfile]);

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
      <div className="patient-loading">
        <div className="patient-loading-spinner"></div>
        <p>Loading your health information...</p>
      </div>
    );
  }

  const handleLogout = () => {
    // Clear all local storage items
    localStorage.removeItem('username');
    localStorage.removeItem('patient_id');
    
    // Redirect to welcome page
    navigate('/');
  };

  return (
    <div className="patient-layout">
      <div className="patient-sidebar">
        <div className="patient-sidebar-brand">
          <h2 className="patient-logo">CuraSphere</h2>
        </div>
        <div className="patient-sidebar-body">
          <div className="patient-user-card">
            <div className="patient-user-avatar">{profile ? profile.full_name[0] : username ? username[0] : "JD"}</div>
            <div className="patient-user-details">
              <h3>{profile ? profile.full_name : "John Doe"}</h3>
              <p>Patient ID: {profile ? profile.patient_id : patientId || "12345678"}</p>
            </div>
          </div>
          <nav className="patient-nav">
            <Link 
              to="/patient/dashboard" 
              className={`patient-nav-item ${activeTab === 'dashboard' ? 'patient-nav-active' : ''}`}
            >
              <Activity size={20} />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/patient/appointments" 
              className={`patient-nav-item ${activeTab === 'appointments' ? 'patient-nav-active' : ''}`}
            >
              <Calendar size={20} />
              <span>Appointments</span>
            </Link>
            <Link 
              to="/patient/medical-history" 
              className={`patient-nav-item ${activeTab === 'medical-history' ? 'patient-nav-active' : ''}`}
            >
              <FileText size={20} />
              <span>Medical History</span>
            </Link>
            <Link 
              to="/patient/medications" 
              className={`patient-nav-item ${activeTab === 'medications' ? 'patient-nav-active' : ''}`}
            >
              <Pill size={20} />
              <span>Medications</span>
            </Link>
            <Link 
              to="/patient/profile" 
              className={`patient-nav-item ${activeTab === 'profile' ? 'patient-nav-active' : ''}`}
            >
               <User size={20} />
              <span>Profile</span>
            </Link>
            <Link 
              onClick={handleLogout} 
              className="patient-nav-item"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </Link>
          </nav>
        </div>
      </div>

      <main className="patient-content">
        <header className="patient-header">
          <h1>Personal Health Dashboard</h1>
          <div className="patient-header-controls">
            <div className="patient-notification">
              <span className="patient-notification-indicator"></span>
              <Bell size={24} />
            </div>
          </div>
        </header> 

        <div className="patient-page-content">
          <div className="patient-dashboard-view patient-fade-in">
            <div className="patient-section-header">
              <h2><Activity size={20} /> Health Overview</h2>
            </div>
            
            <div className="patient-metric-grid">
              {stats.map((stat, index) => (
                <div className="patient-metric-tile" key={index}>
                  <div className="patient-metric-icon">{stat.icon}</div>
                  <div className="patient-metric-info">
                    <h3>{stat.title}</h3>
                    <p className="patient-metric-value">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Upcoming Appointments Section */}
            {appointments.length > 0 && (
              <div className="patient-appointments-container">
                <h3>Upcoming Appointments</h3>
                <div className="patient-appointments-grid">
                  {appointments.slice(0, 2).map(appointment => (
                    <div className="patient-appointment-tile" key={appointment.id}>
                      <div className="patient-appointment-date">
                        <div className="patient-appointment-month">{new Date(appointment.date).toLocaleString('default', { month: 'short' })}</div>
                        <div className="patient-appointment-day">{new Date(appointment.date).getDate()}</div>
                      </div>
                      <div className="patient-appointment-info">
                        <h3>{appointment.doctor_name || "Doctor will be assigned"}</h3>
                        <p className="patient-appointment-dept">{appointment.department}</p>
                        <p className="patient-appointment-time"><Clock size={14} /> {appointment.time}</p>
                      </div>
                      <Link to="/patient/appointments" className="patient-action-link">
                        Manage
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="patient-vitals-container">
              <h3>Health Vitals</h3>
              <div className="patient-vitals-grid">
                <div className="patient-vital-tile">
                  <Activity size={20} />
                  <h4>Heart Rate</h4>
                  <div className="patient-vital-measurement">72 <span>bpm</span></div>
                  <div className="patient-vital-graph"></div>
                </div>
                <div className="patient-vital-tile">
                  <Activity size={20} />
                  <h4>Blood Pressure</h4>
                  <div className="patient-vital-measurement">120/80 <span>mmHg</span></div>
                  <div className="patient-vital-graph"></div>
                </div>
                <div className="patient-vital-tile">
                  <Activity size={20} />
                  <h4>Blood Sugar</h4>
                  <div className="patient-vital-measurement">110 <span>mg/dL</span></div>
                  <div className="patient-vital-graph"></div>
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