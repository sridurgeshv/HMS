import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  MessageSquare,
  Bell, 
  Search,
  Menu,
  X,
  User
} from 'lucide-react';
import './Dashboard.css';
import axios from 'axios';

const DoctorDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedView, setSelectedView] = useState('daily');
  const [appointments, setAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [doctor, setDoctor] = useState({ full_name: "", specialization: "" });


  // Fetch doctor profile data
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      const doctorId = localStorage.getItem('doctor_id');
      if (!doctorId) return;

      try {
        const response = await axios.get(`http://localhost:8000/doctor/${doctorId}`);
        setDoctor({
          full_name: response.data.name,
          specialization: response.data.specialty
        });
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      }
    };

    fetchDoctorProfile();
  }, []);


  // Fetch appointments and patients data
  useEffect(() => {
    const fetchData = async () => {
      const doctorId = localStorage.getItem('doctor_id'); // Retrieve doctor_id from local storage
      if (!doctorId) {
        alert("Doctor ID not found. Please log in again.");
        return;
      }

      try {
        // Fetch appointments
        const appointmentsResponse = await fetch(`http://localhost:8000/doctor-appointments/${doctorId}`);
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);

        // Fetch patients
        const patientsResponse = await fetch(`http://localhost:8000/doctor-patients/${doctorId}`);
        const patientsData = await patientsResponse.json();
        setRecentPatients(Array.isArray(patientsData) ? patientsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar - Keeping original */}
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
          <h3>{doctor.full_name || "Loading..."}</h3>
          <p>{doctor.specialization || "Loading..."}</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/doctor/dashboard" className="nav-item active">
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
          <Link to="/doctor/profile" className="nav-item">
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
            <input type="text" placeholder="Search patients, appointments..." />
          </div>
          
          <div className="topbar-right">
            <div className="current-time">
              <Clock size={18} />
              <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            
            <div className="notification-bell">
              <Bell size={20} />
              <span className="notification-badge">{notifications.length}</span>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="welcome-section">
            <div className="welcome-text">
              <h1>Welcome back, {doctor.full_name} </h1>
              <p>{formatDate(currentTime)}</p>
            </div>
            
            <div className="quick-stats">
              <div className="stat-card">
                <div className="stat-icon appointments-icon">
                  <Clock size={24} />
                </div>
                <div className="stat-info">
                  <h3>{appointments.length}</h3>
                  <p>Today's Appointments</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon patients-icon">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <h3>{recentPatients.length}</h3>
                  <p>Active Patients</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Appointment Schedule */}
          <section className="appointments-section">
            <div className="section-header">
              <h2>Appointment Schedule</h2>
              <div className="view-toggle">
                <button 
                  className={`toggle-btn ${selectedView === 'daily' ? 'active' : ''}`}
                  onClick={() => setSelectedView('daily')}
                >
                  Daily
                </button>
                <button 
                  className={`toggle-btn ${selectedView === 'weekly' ? 'active' : ''}`}
                  onClick={() => setSelectedView('weekly')}
                >
                  Weekly
                </button>
              </div>
            </div>
            
            <div className="appointment-list">
              {appointments.map(appointment => (
                <div className="appointment-card" key={appointment.id}>
                  <div className="appointment-time">
                    <Clock size={16} />
                    <span>{appointment.time}</span>
                  </div>
                  
                  <div className="appointment-details">
                    <h3>{appointment.patient}</h3>
                    <p>{appointment.type}</p>
                  </div>
                  
                  <div className={`appointment-status ${appointment.status.toLowerCase()}`}>
                    {appointment.status}
                  </div>
                </div>
              ))}
            </div>
          </section>
          
         {/* Two Column Layout */}
<div className="dashboard-columns">
  {/* Recent Patients */}
  <section className="recent-patients-section">
    <div className="section-header">
      <h2>Recent Patients</h2>
      <Link to="/doctor/patients" className="view-all">View All</Link>
    </div>

    <div className="patients-list">
      {recentPatients.length === 0 ? (
        <p className="no-recentPatients-message">No appointments found.</p>
      ) : (
        recentPatients.map(patient => (  // ✅ Remove extra {}
          <div className="patient-card" key={patient.id}>
            <div className="patient-avatar">
              <img src={`/api/placeholder/40/40`} alt={patient.full_name} />
            </div>

            <div className="patient-info">
              <h3>{patient.full_name}</h3>
              <p>Age: {patient.age} • Gender: {patient.gender}</p>
              <p className="last-visit">Last visit: {patient.medical_history[0]?.visit_date || 'N/A'}</p>
            </div>

            <div className="patient-actions">
              <button className="action-btn view-records">
                <FileText size={16} />
              </button>
              <button className="action-btn send-message">
                <MessageSquare size={16} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </section>
</div>

            {/* Notifications */}
            <section className="notifications-section">
              <div className="section-header">
                <h2>Notifications</h2>
                <button className="mark-all-read">Mark all as read</button>
              </div>
              
              <div className="notifications-list">
                {notifications.map(notification => (
                  <div className="notification-card" key={notification.id}>
                    <div className="notification-icon">
                      <Bell size={16} />
                    </div>
                    
                    <div className="notification-content">
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
  );
};

export default DoctorDashboard;