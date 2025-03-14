import React, { useState } from 'react';
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
  Calendar as CalendarIcon,
  Award,
  Edit
} from 'lucide-react';

const Profile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  // Sample data
  const doctorProfile = {
    name: 'Dr. Jane Smith',
    specialty: 'Cardiologist',
    email: 'dr.jane.smith@curasphere.com',
    phone: '(555) 123-4567',
    address: '123 Medical Center Drive, Healthcare City, HC 12345',
    dob: '1980-05-15',
    gender: 'Female',
    licenseNumber: 'MED123456',
    education: [
      { degree: 'M.D.', university: 'Harvard Medical School', year: '2005' },
      { degree: 'Residency', university: 'Mayo Clinic', year: '2009' },
      { degree: 'Fellowship', university: 'Johns Hopkins Hospital', year: '2011' }
    ],
    workHours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 3:00 PM'
    }
  };
  
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
            <h3>Dr. Jane Smith</h3>
            <p>Cardiologist</p>
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
          <div className="profile-header">
            <div className="profile-image-large">
              <img src="/api/placeholder/150/150" alt="Doctor profile" />
            </div>
            <div className="profile-title">
              <h1>{doctorProfile.name}</h1>
              <p>{doctorProfile.specialty}</p>
            </div>
            <button className="edit-profile-btn">
              <Edit size={18} />
              <span>Edit Profile</span>
            </button>
          </div>
          
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Information
            </button>
            <button 
              className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
              onClick={() => setActiveTab('education')}
            >
              Education & Experience
            </button>
            <button 
              className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              Schedule
            </button>
          </div>
          
          <div className="profile-content">
            {activeTab === 'personal' && (
              <div className="personal-info">
                <div className="info-card">
                  <div className="info-item">
                    <Mail size={20} />
                    <div className="info-details">
                      <label>Email</label>
                      <p>{doctorProfile.email}</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <Phone size={20} />
                    <div className="info-details">
                      <label>Phone</label>
                      <p>{doctorProfile.phone}</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <MapPin size={20} />
                    <div className="info-details">
                      <label>Address</label>
                      <p>{doctorProfile.address}</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <CalendarIcon size={20} />
                    <div className="info-details">
                      <label>Date of Birth</label>
                      <p>{new Date(doctorProfile.dob).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <User size={20} />
                    <div className="info-details">
                      <label>Gender</label>
                      <p>{doctorProfile.gender}</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <Award size={20} />
                    <div className="info-details">
                      <label>License Number</label>
                      <p>{doctorProfile.licenseNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'education' && (
              <div className="education-info">
                <div className="info-card">
                  <h3>Education</h3>
                  {doctorProfile.education.map((edu, index) => (
                    <div className="education-item" key={index}>
                      <div className="education-year">{edu.year}</div>
                      <div className="education-details">
                        <h4>{edu.degree}</h4>
                        <p>{edu.university}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'schedule' && (
              <div className="schedule-info">
                <div className="info-card">
                  <h3>Working Hours</h3>
                  <div className="schedule-grid">
                    {Object.entries(doctorProfile.workHours).map(([day, hours]) => (
                      <div className="schedule-item" key={day}>
                        <div className="schedule-day">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                        <div className="schedule-hours">{hours}</div>
                      </div>
                    ))}
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