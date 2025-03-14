import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Bell, 
  Search,
  Menu,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  Edit,
  Key,
  LogOut,
  Calendar as CalendarIcon,
  Briefcase
} from 'lucide-react';
import './Dashboard.css';

const DoctorProfile = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  // Sample doctor data - in a real app, this would be fetched from an API
  const doctorData = {
    id: 1,
    name: 'Dr. Jane Smith',
    specialty: 'Cardiologist',
    email: 'jane.smith@curasphere.com',
    phone: '(555) 123-4567',
    location: 'Curasphere Medical Center, Building A, Suite 302',
    education: [
      { degree: 'MD', institution: 'Harvard Medical School', year: '2010' },
      { degree: 'Residency, Internal Medicine', institution: 'Mass General Hospital', year: '2013' },
      { degree: 'Fellowship, Cardiology', institution: 'Cleveland Clinic', year: '2016' }
    ],
    certifications: [
      { name: 'Board Certified, Cardiology', year: '2016' },
      { name: 'Advanced Cardiac Life Support (ACLS)', year: '2023' },
      { name: 'Basic Life Support (BLS)', year: '2023' }
    ],
    experience: [
      { position: 'Attending Cardiologist', institution: 'Curasphere Medical Center', period: '2018 - Present' },
      { position: 'Associate Cardiologist', institution: 'Metro Hospital', period: '2016 - 2018' }
    ],
    availability: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 12:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 3:00 PM',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    profileImage: '/api/placeholder/200/200'
  };
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isMenuOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="logo">Curasphere</h2>
          <button className="close-menu" onClick={toggleMenu}>
            <X size={24} />
          </button>
        </div>
        
        <div className="doctor-profile">
          <div className="profile-image">
            <img src={doctorData.profileImage} alt="Doctor profile" />
          </div>
          <div className="profile-info">
            <h3>{doctorData.name}</h3>
            <p>{doctorData.specialty}</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/doctor/dashboard" className="nav-item">
            <Calendar size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/doctor/appointments" className="nav-item">
            <Clock size={20} />
            <span>Appointments</span>
          </Link>
          <Link to="/doctor/patients" className="nav-item">
            <Users size={20} />
            <span>Patients</span>
          </Link>
          <Link to="/doctor/medical-records" className="nav-item">
            <FileText size={20} />
            <span>Medical Records</span>
          </Link>
          <Link to="/doctor/profile" className="nav-item active">
            <User size={20} />
            <span>Profile</span>
          </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <button className="menu-toggle" onClick={toggleMenu}>
            <Menu size={24} />
          </button>
          
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Search..." />
          </div>
          
          <div className="topbar-right">
            <div className="current-time">
              <Clock size={18} />
              <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            
            <div className="notification-bell">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </div>
          </div>
        </header>
        
        {/* Profile Content */}
        <div className="dashboard-content">
          <div className="profile-container">
            <div className="profile-header">
              <div className="profile-avatar">
                <img src={doctorData.profileImage} alt={doctorData.name} />
              </div>
              
              <div className="profile-title">
                <h1>{doctorData.name}</h1>
                <p className="specialty">{doctorData.specialty}</p>
                <button className="edit-profile-btn">
                  <Edit size={16} />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
            
            <div className="profile-tabs">
              <button 
                className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
                onClick={() => handleTabChange('personal')}
              >
                Personal Information
              </button>
              <button 
                className={`tab-button ${activeTab === 'education' ? 'active' : ''}`}
                onClick={() => handleTabChange('education')}
              >
                Education & Experience
              </button>
              <button 
                className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
                onClick={() => handleTabChange('schedule')}
              >
                Schedule & Availability
              </button>
              <button 
                className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => handleTabChange('security')}
              >
                Account & Security
              </button>
            </div>
            
            <div className="profile-content">
              {activeTab === 'personal' && (
                <div className="personal-info">
                  <div className="profile-section">
                    <h2>Contact Information</h2>
                    
                    <div className="info-grid">
                      <div className="info-item">
                        <div className="info-icon">
                          <Mail size={18} />
                        </div>
                        <div className="info-content">
                          <label>Email Address</label>
                          <p>{doctorData.email}</p>
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <div className="info-icon">
                          <Phone size={18} />
                        </div>
                        <div className="info-content">
                          <label>Phone Number</label>
                          <p>{doctorData.phone}</p>
                        </div>
                      </div>
                      
                      <div className="info-item wide">
                        <div className="info-icon">
                          <MapPin size={18} />
                        </div>
                        <div className="info-content">
                          <label>Office Location</label>
                          <p>{doctorData.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="profile-section">
                    <h2>Certifications</h2>
                    <div className="certifications-list">
                      {doctorData.certifications.map((cert, index) => (
                        <div className="certification-item" key={index}>
                          <div className="cert-icon">
                            <Award size={16} />
                          </div>
                          <div className="cert-content">
                            <p className="cert-name">{cert.name}</p>
                            <p className="cert-year">Issued: {cert.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'education' && (
                <div className="education-experience">
                  <div className="profile-section">
                    <h2>Education</h2>
                    <div className="timeline">
                      {doctorData.education.map((edu, index) => (
                        <div className="timeline-item" key={index}>
                          <div className="timeline-marker"></div>
                          <div className="timeline-content">
                            <h3>{edu.degree}</h3>
                            <p className="timeline-institution">{edu.institution}</p>
                            <p className="timeline-year">{edu.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="profile-section">
                    <h2>Professional Experience</h2>
                    <div className="timeline">
                      {doctorData.experience.map((exp, index) => (
                        <div className="timeline-item" key={index}>
                          <div className="timeline-marker"></div>
                          <div className="timeline-content">
                            <h3>{exp.position}</h3>
                            <p className="timeline-institution">{exp.institution}</p>
                            <p className="timeline-year">{exp.period}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'schedule' && (
                <div className="schedule-availability">
                  <div className="profile-section">
                    <h2>Weekly Schedule</h2>
                    <div className="schedule-grid">
                      {Object.entries(doctorData.availability).map(([day, hours]) => (
                        <div className="schedule-item" key={day}>
                          <div className="day-icon">
                            <CalendarIcon size={18} />
                          </div>
                          <div className="day-details">
                            <h3 className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
                            <p className="day-hours">{hours}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="profile-section">
                    <h2>Availability Settings</h2>
                    <div className="availability-actions">
                      <button className="availability-btn">
                        <span>Set Out of Office</span>
                      </button>
                      <button className="availability-btn">
                        <span>Manage Working Hours</span>
                      </button>
                      <button className="availability-btn">
                        <span>Appointment Preferences</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div className="account-security">
                  <div className="profile-section">
                    <h2>Account Settings</h2>
                    <div className="security-options">
                      <button className="security-btn">
                        <Key size={18} />
                        <span>Change Password</span>
                      </button>
                      
                      <button className="security-btn">
                        <User size={18} />
                        <span>Update Account Details</span>
                      </button>
                      
                      <button className="security-btn">
                        <Bell size={18} />
                        <span>Notification Preferences</span>
                      </button>
                      
                      <button className="security-btn logout">
                        <LogOut size={18} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorProfile;