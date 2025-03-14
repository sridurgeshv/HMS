import React, { useState, useEffect, useContext } from "react";
import { Calendar, FileText, User, Pill, Activity, Bell, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PatientContext } from "../../PatientContext";
import './Dashboard.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Assuming username is stored in local storage after signup
  const username = localStorage.getItem("username");
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
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="logo">CuraSphere</h2>
        </div>
        <div className="sidebar-content">
          <div className="user-profile">
            <div className="avatar">{profile ? profile.full_name[0] : username ? username[0] : "U"}</div>
            <div className="user-info">
              <h3>{profile ? profile.full_name : "Loading..."}</h3>
              <p>Patient ID: {profile ? profile.patient_id : patientId || "..."}</p>
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
            <button 
              onClick={handleLogout}
              className="menu-item logout-button"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      <main className="dashboard-main">
        <header className="main-header">
          <h1>Personal Profile</h1>
          <div className="header-actions">
            <div className="notification-bell">
              <span className="notification-dot"></span>
              <Bell size={24} />
            </div>
          </div>
        </header> 

        <div className="dashboard-content">
          <div className="tab-content profile fade-in">
            <div className="content-header">
              <h2>
                <User size={20} /> Personal Information
              </h2>
            </div>

            {loading && <p>Loading profile...</p>}
            {error && <p className="error">{error}</p>}
            {profile && (
              <div className="profile-card">
                <div className="profile-header">
                  <div className="profile-avatar">{profile.full_name[0]}</div>
                  <div className="profile-name">
                    <h3>{profile.full_name}</h3>
                    <p>Patient ID: {profile.patient_id}</p>
                  </div>
                </div>

                <div className="profile-details">
                  <div className="detail-group">
                    <h4>Personal Information</h4>
                    <div className="detail-row">
                      <span className="detail-label">Date of Birth</span>
                      <span className="detail-value">{profile.date_of_birth}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Username</span>
                      <span className="detail-value">{profile.username}</span>
                    </div>
                  </div>

                  <div className="detail-group">
                    <h4>Contact Information</h4>
                    <div className="detail-row">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{profile.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Phone</span>
                      <span className="detail-value">{profile.phone}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Address</span>
                      <span className="detail-value">{profile.address}</span>
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