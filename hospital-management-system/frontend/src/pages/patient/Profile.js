import React, { useState, useEffect, useContext } from "react";
import { Calendar, FileText, User, Pill, Activity, Bell, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from "../../UserContext";
import { PatientContext } from "../../PatientContext";
import './Dashboard.css';

const Profile = () => {
  const { username } = useContext(UserContext) || {};
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Assuming username is stored in local storage after signup
  const context = useContext(PatientContext);
  const patientId = context?.patientId || null;
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user-profile/${username}`);
        if (!response.ok) throw new Error("Failed to fetch profile data");

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchProfile();
  }, [username]);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/appointments')) return 'appointments';
    if (path.includes('/medical-history')) return 'medical-history';
    if (path.includes('/medications')) return 'medications';
    if (path.includes('/profile')) return 'profile';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

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
              className="patient-nav-item patient-logout-button"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </Link>
          </nav>
        </div>
      </div>

      <main className="patient-content">
        <header className="patient-header">
          <h1>Personal Profile</h1>
          <div className="patient-header-controls">
            <div className="patient-notification">
              <span className="patient-notification-indicator"></span>
              <Bell size={24} />
            </div>
          </div>
        </header> 

        <div className="patient-page-content">
          <div className="patient-profile-view patient-fade-in">
            <div className="patient-section-header">
              <h2><User size={20} /> Personal Information</h2>
            </div>

            {loading && <p className="patient-loading-text">Loading profile...</p>}
            {error && <p className="patient-error-message">{error}</p>}
            {profile && (
              <div className="patient-profile-card">
                <div className="patient-profile-header">
                  <div className="patient-profile-avatar">{profile.full_name[0]}</div>
                  <div className="patient-profile-name">
                    <h3>{profile.full_name}</h3>
                    <p>Patient ID: {profile.patient_id}</p>
                  </div>
                </div>

                <div className="patient-profile-details">
                  <div className="patient-detail-group">
                    <h4>Personal Information</h4>
                    <div className="patient-detail-row">
                      <span className="patient-detail-label">Date of Birth</span>
                      <span className="patient-detail-value">{profile.date_of_birth}</span>
                    </div>
                    <div className="patient-detail-row">
                      <span className="patient-detail-label">Username</span>
                      <span className="patient-detail-value">{profile.username}</span>
                    </div>
                  </div>

                  <div className="patient-detail-group">
                    <h4>Contact Information</h4>
                    <div className="patient-detail-row">
                      <span className="patient-detail-label">Email</span>
                      <span className="patient-detail-value">{profile.email}</span>
                    </div>
                    <div className="patient-detail-row">
                      <span className="patient-detail-label">Phone</span>
                      <span className="patient-detail-value">{profile.phone}</span>
                    </div>
                    <div className="patient-detail-row">
                      <span className="patient-detail-label">Address</span>
                      <span className="patient-detail-value">{profile.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;