import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Calendar, FileText, User, Pill, Activity, Bell, Clock, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PatientContext } from "../../PatientContext";
import { UserContext } from "../../UserContext";
import './Dashboard.css';

const VitalsInput = ({ onAnalyze, isAnalyzing }) => {
  const [heartRate, setHeartRate] = useState(72);
  const [bloodPressure, setBloodPressure] = useState("120/80");
  const [bloodSugar, setBloodSugar] = useState(110);

  const handleAnalyze = () => {
    onAnalyze({ heartRate, bloodPressure, bloodSugar });
  };

  return (
    <div className="patient-vitals-input">
      <h3>Input Your Vitals</h3>
      <div className="vitals-input-group">
        <label>Heart Rate (bpm)</label>
        <input
          type="range"
          min="40"
          max="120"
          value={heartRate}
          onChange={(e) => setHeartRate(parseInt(e.target.value))}
        />
        <span>{heartRate} bpm</span>
      </div>
      <div className="vitals-input-group">
        <label>Blood Pressure (mmHg)</label>
        <input
          type="text"
          value={bloodPressure}
          onChange={(e) => setBloodPressure(e.target.value)}
          placeholder="e.g., 120/80"
        />
      </div>
      <div className="vitals-input-group">
        <label>Blood Sugar (mg/dL)</label>
        <input
          type="range"
          min="70"
          max="200"
          value={bloodSugar}
          onChange={(e) => setBloodSugar(parseInt(e.target.value))}
        />
        <span>{bloodSugar} mg/dL</span>
      </div>
      <button onClick={handleAnalyze} disabled={isAnalyzing}>
        {isAnalyzing ? "Analyzing..." : "Analyze Vitals"}
      </button>
      {isAnalyzing && <div className="loading-spinner"></div>}
    </div>
  );
};

const Dashboard = () => {
  const userContext = useContext(UserContext);
  const { username } = userContext || {};
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [medications, setMedications] = useState([]);
  const [history, setHistory] = useState([]);
  const context = useContext(PatientContext);
  const patientId = context?.patientId || null;
  const location = useLocation();
  const navigate = useNavigate();
  const [vitalsResponse, setVitalsResponse] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fetch appointments
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

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/user-profile/${username}`);
      if (response.data) {
        setProfile(response.data);
        console.log("Profile data loaded:", response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch medications
  const fetchMedications = async () => {
    if (!patientId) return;
    try {
      const response = await axios.get(`http://localhost:8000/medications/${patientId}`);
      if (Array.isArray(response.data)) {
        setMedications(response.data);
      } else {
        setMedications([]);
      }
    } catch (error) {
      console.error("Error fetching medications:", error);
      setMedications([]);
    }
  };

  // Fetch medical history
  const fetchMedicalHistory = async () => {
    if (!patientId) return;
    try {
      const response = await axios.get(`http://localhost:8000/medical-history/${patientId}`);
      if (Array.isArray(response.data)) {
        setHistory(response.data);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error("Error fetching medical history:", error);
      setHistory([]);
    }
  };

  // Memoize fetch functions
  const memoizedFetchAppointments = useCallback(fetchAppointments, [patientId]);
  const memoizedFetchProfile = useCallback(fetchProfile, [username]);
  const memoizedFetchMedications = useCallback(fetchMedications, [patientId]);
  const memoizedFetchMedicalHistory = useCallback(fetchMedicalHistory, [patientId]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      console.log("Loading data with patientId:", patientId, "and username:", username);
      
      try {
        if (patientId) {
          console.log("Fetching appointments for patient:", patientId);
          await memoizedFetchAppointments();
          console.log("Fetching medications for patient:", patientId);
          await memoizedFetchMedications();
          console.log("Fetching medical history for patient:", patientId);
          await memoizedFetchMedicalHistory();
        }
        
        if (username) {
          console.log("Fetching profile for user:", username);
          await memoizedFetchProfile();
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [patientId, username, memoizedFetchAppointments, memoizedFetchProfile, memoizedFetchMedications, memoizedFetchMedicalHistory]);

  // Handle vitals analysis
  const handleAnalyzeVitals = async (vitals) => {
    setIsAnalyzing(true); // Start loading
    try {
      const response = await axios.post("http://localhost:8000/analyze-vitals", {
        heart_rate: parseInt(vitals.heartRate), // Ensure it's an integer
        blood_pressure: vitals.bloodPressure,   // Ensure it's a string
        blood_sugar: parseInt(vitals.bloodSugar), // Ensure it's an integer
      });
      setVitalsResponse(response.data.response);
    } catch (error) {
      console.error("Error analyzing vitals:", error);
      alert("Failed to analyze vitals. Please try again.");
    } finally {
      setIsAnalyzing(false); // Stop loading
    }
  };

  // Get active tab
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/appointments')) return 'appointments';
    if (path.includes('/medical-history')) return 'medical-history';
    if (path.includes('/medications')) return 'medications';
    if (path.includes('/profile')) return 'profile';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  // Get stats
  const getStats = () => {
    return [
      { title: "Upcoming Appointments", value: appointments.length.toString(), icon: <Calendar size={24} /> },
      { title: "Medications", value: medications.length.toString(), icon: <Pill size={24} /> },
      { title: "Recent Reports", value: history.length.toString(), icon: <FileText size={24} /> }
    ];
  };

  const stats = getStats();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('patient_id');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="patient-loading">
        <div className="patient-loading-spinner"></div>
        <p>Loading your health information...</p>
      </div>
    );
  }

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
            <div 
              onClick={handleLogout} 
              className="patient-nav-item"
              style={{ cursor: 'pointer' }}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </div>
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
                  {appointments.slice(0, 3).map(appointment => (
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

            {/* Vitals Input Section */}
            <VitalsInput onAnalyze={handleAnalyzeVitals} isAnalyzing={isAnalyzing} />

            {/* Vitals Response Section */}
            {vitalsResponse && (
              <div className="patient-vitals-response">
                <h3>Health Assessment</h3>
                <p>{vitalsResponse}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;