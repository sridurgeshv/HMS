import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, User, Clipboard, FileText, Bell, Package, Settings } from 'lucide-react';
import './Dashboard.css';

const Profile = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const nurseInfo = {
    name: "Jane Smith",
    title: "RN, BSN",
    department: "Medical-Surgical",
    floor: "Floor 3",
    employeeId: "NS-7842",
    email: "jane.smith@hospital.org",
    phone: "(555) 123-4567",
    startDate: "June 15, 2022",
    certification: "Critical Care Certified (CCRN)",
    licenseNumber: "RN-723645",
    licenseExpiry: "December 31, 2025",
    education: "Bachelor of Science in Nursing, State University, 2020",
    skills: ["IV Administration", "Wound Care", "Critical Care", "Patient Education", "Electronic Medical Records"],
    languages: ["English (Native)", "Spanish (Conversational)"]
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
            <h1>My Profile</h1>
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
          <div className="profile-container">
            <div className="profile-header">
              <div className="profile-avatar">JS</div>
              <div className="profile-title">
                <h2>{nurseInfo.name}, {nurseInfo.title}</h2>
                <p>{nurseInfo.department} | {nurseInfo.floor}</p>
              </div>
              <button className="edit-profile-btn">Edit Profile</button>
            </div>

            <div className="profile-content">
              <div className="profile-section">
                <h3>Personal Information</h3>
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <label>Employee ID</label>
                    <p>{nurseInfo.employeeId}</p>
                  </div>
                  <div className="profile-info-item">
                    <label>Email</label>
                    <p>{nurseInfo.email}</p>
                  </div>
                  <div className="profile-info-item">
                    <label>Phone</label>
                    <p>{nurseInfo.phone}</p>
                  </div>
                  <div className="profile-info-item">
                    <label>Start Date</label>
                    <p>{nurseInfo.startDate}</p>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>Credentials</h3>
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <label>Certification</label>
                    <p>{nurseInfo.certification}</p>
                  </div>
                  <div className="profile-info-item">
                    <label>License Number</label>
                    <p>{nurseInfo.licenseNumber}</p>
                  </div>
                  <div className="profile-info-item">
                    <label>License Expiry</label>
                    <p>{nurseInfo.licenseExpiry}</p>
                  </div>
                  <div className="profile-info-item">
                    <label>Education</label>
                    <p>{nurseInfo.education}</p>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>Skills & Languages</h3>
                <div className="profile-skills">
                  {nurseInfo.skills.map((skill, index) => (
                    <span key={index} className="skill-badge">{skill}</span>
                  ))}
                </div>
                <h4>Languages</h4>
                <ul className="languages-list">
                  {nurseInfo.languages.map((language, index) => (
                    <li key={index}>{language}</li>
                  ))}
                </ul>
              </div>

              <div className="profile-section">
                <h3>Schedule Preferences</h3>
                <div className="schedule-preferences">
                  <div className="schedule-day">
                    <span>Monday</span>
                    <span className="time-pref">07:00 - 19:00</span>
                  </div>
                  <div className="schedule-day">
                    <span>Tuesday</span>
                    <span className="time-pref">07:00 - 19:00</span>
                  </div>
                  <div className="schedule-day">
                    <span>Wednesday</span>
                    <span className="time-pref">Off</span>
                  </div>
                  <div className="schedule-day">
                    <span>Thursday</span>
                    <span className="time-pref">Off</span>
                  </div>
                  <div className="schedule-day">
                    <span>Friday</span>
                    <span className="time-pref">07:00 - 19:00</span>
                  </div>
                  <div className="schedule-day">
                    <span>Saturday</span>
                    <span className="time-pref">07:00 - 19:00</span>
                  </div>
                  <div className="schedule-day">
                    <span>Sunday</span>
                    <span className="time-pref">Off</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;