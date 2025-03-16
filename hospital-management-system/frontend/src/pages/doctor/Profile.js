import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, FileText, Bell, Search, Menu, X, User, Mail, Phone, MapPin, Calendar as CalendarIcon, Award, Edit } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [doctorProfile, setDoctorProfile] = useState({
    name: '',
    specialty: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    gender: '',
    licenseNumber: '',
    education: [],
    workHours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 3:00 PM'
    }
  });

  useEffect(() => {
    // Fetch doctor profile data
    const fetchDoctorProfile = async () => {
      const doctorId = localStorage.getItem('doctor_id'); // Retrieve doctor_id from local storage
      if (!doctorId) {
        alert("Doctor ID not found. Please log in again.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8000/doctor/${doctorId}`);
        setDoctorProfile(response.data);
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
        alert("Failed to fetch doctor profile. Please try again.");
      }
    };

    fetchDoctorProfile();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
            <img src="/api/placeholder/100/100" alt="Doctor profile" />
          </div>
          <div className="profile-info">
            <h3>{doctorProfile.name}</h3>
            <p>{doctorProfile.specialty}</p>
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
            <div className="notification-bell">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </div>
          </div>
        </header>
        
        {/* Profile Content */}
        <div className="dashboard-content">
          <div className="profile-container">
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="profile-pic">
                  <img src="/api/placeholder/150/150" alt="Doctor profile" />
                </div>
                <h2 className="profile-name">{doctorProfile.name}</h2>
                <p className="profile-title">{doctorProfile.specialty}</p>
              </div>
              
              <div className="profile-detail">
                <div className="profile-detail-icon">
                  <Mail size={16} />
                </div>
                <div className="profile-detail-content">
                  <span className="profile-detail-label">Email</span>
                  <p className="profile-detail-value">{doctorProfile.email}</p>
                </div>
              </div>
              
              <div className="profile-detail">
                <div className="profile-detail-icon">
                  <Phone size={16} />
                </div>
                <div className="profile-detail-content">
                  <span className="profile-detail-label">Phone</span>
                  <p className="profile-detail-value">{doctorProfile.phone}</p>
                </div>
              </div>
              
              <div className="profile-detail">
                <div className="profile-detail-icon">
                  <Award size={16} />
                </div>
                <div className="profile-detail-content">
                  <span className="profile-detail-label">License</span>
                  <p className="profile-detail-value">{doctorProfile.licenseNumber}</p>
                </div>
              </div>
            </div>
            
            <div className="profile-content">
              <div className="tabs">
                <div 
                  className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
                  onClick={() => setActiveTab('personal')}
                >
                  Personal Information
                </div>
                <div 
                  className={`tab ${activeTab === 'education' ? 'active' : ''}`}
                  onClick={() => setActiveTab('education')}
                >
                  Education & Experience
                </div>
                <div 
                  className={`tab ${activeTab === 'schedule' ? 'active' : ''}`}
                  onClick={() => setActiveTab('schedule')}
                >
                  Schedule
                </div>
              </div>
              
              <div className={`tab-content ${activeTab === 'personal' ? 'active' : ''}`}>
                <div className="profile-section">
                  <div className="profile-section-header">
                    <h3 className="profile-section-title">Personal Details</h3>
                    <button className="profile-edit-button">
                      <Edit size={16} /> Edit
                    </button>
                  </div>
                  
                  <div className="profile-card">
                    <div className="profile-detail">
                      <div className="profile-detail-icon">
                        <User size={16} />
                      </div>
                      <div className="profile-detail-content">
                        <span className="profile-detail-label">Gender</span>
                        <p className="profile-detail-value">{doctorProfile.gender}</p>
                      </div>
                    </div>
                    
                    <div className="profile-detail">
                      <div className="profile-detail-icon">
                        <CalendarIcon size={16} />
                      </div>
                      <div className="profile-detail-content">
                        <span className="profile-detail-label">Date of Birth</span>
                        <p className="profile-detail-value">{new Date(doctorProfile.dob).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="profile-detail">
                      <div className="profile-detail-icon">
                        <MapPin size={16} />
                      </div>
                      <div className="profile-detail-content">
                        <span className="profile-detail-label">Address</span>
                        <p className="profile-detail-value">{doctorProfile.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`tab-content ${activeTab === 'education' ? 'active' : ''}`}>
                <div className="profile-section">
                  <div className="profile-section-header">
                    <h3 className="profile-section-title">Education</h3>
                    <button className="profile-edit-button">
                      <Edit size={16} /> Edit
                    </button>
                  </div>
                  
                  <div className="profile-card">
                    <div className="timeline">
                      {doctorProfile.education.map((edu, index) => (
                        <div className="timeline-item" key={index}>
                          <div className="timeline-dot"></div>
                          <div className="timeline-content">
                            <div className="timeline-date">{edu.year}</div>
                            <h4 className="timeline-title">{edu.degree}</h4>
                            <p className="timeline-description">{edu.university}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`tab-content ${activeTab === 'schedule' ? 'active' : ''}`}>
                <div className="profile-section">
                  <div className="profile-section-header">
                    <h3 className="profile-section-title">Working Hours</h3>
                    <button className="profile-edit-button">
                      <Edit size={16} /> Edit
                    </button>
                  </div>
                  
                  <div className="profile-card">
                    <div className="schedule-grid">
                      {Object.entries({
                        monday: '9:00 AM - 5:00 PM',
                        tuesday: '9:00 AM - 5:00 PM',
                        wednesday: '9:00 AM - 5:00 PM',
                        thursday: '9:00 AM - 5:00 PM',
                        friday: '9:00 AM - 3:00 PM'
                      }).map(([day, hours]) => (
                        <div className="schedule-item" key={day}>
                          <div className="schedule-day">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                          <div className="schedule-hours">{hours}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;