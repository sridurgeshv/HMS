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
  User,
  Plus,
  Filter
} from 'lucide-react';
import axios from 'axios';

const Appointments = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedView, setSelectedView] = useState('all');
  const [appointments, setAppointments] = useState([]); // Initialize as an empty array
  const [doctor, setDoctor] = useState({ full_name: "", specialization: "" });
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  // Fetch appointments data
  useEffect(() => {
    const fetchAppointments = async () => {
      const doctorId = localStorage.getItem('doctor_id'); // Retrieve doctor_id from local storage
      if (!doctorId) {
        setError("Doctor ID not found. Please log in again.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8000/doctor-appointments/${doctorId}`);
        // Ensure data is an array before setting it in the state
        if (Array.isArray(response.data)) {
          setAppointments(response.data);
        } else {
          setAppointments([]); // Set to empty array if data is not an array
        }
      } catch (error) {
        setError("Failed to fetch appointments. Please try again.");
        setAppointments([]); // Set to empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

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
            <h3>{doctor.full_name || "Loading..."}</h3>
            <p>{doctor.specialization || "Loading..."}</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/doctor/dashboard" className="nav-item">
            <Calendar size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/doctor/appointments" className="nav-item active">
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
            <input type="text" placeholder="Search appointments..." />
          </div>
          
          <div className="topbar-right">
            <div className="notification-bell">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </div>
          </div>
        </header>
        
        {/* Appointments Content */}
        <div className="dashboard-content">
          <div className="content-header">
            <h1>Appointments</h1>
            <button className="primary-button">
              <Plus size={18} />
              <span>New Appointment</span>
            </button>
          </div>
          
          <div className="filter-section">
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${selectedView === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedView('all')}
              >
                All
              </button>
              <button 
                className={`toggle-btn ${selectedView === 'upcoming' ? 'active' : ''}`}
                onClick={() => setSelectedView('upcoming')}
              >
                Upcoming
              </button>
              <button 
                className={`toggle-btn ${selectedView === 'past' ? 'active' : ''}`}
                onClick={() => setSelectedView('past')}
              >
                Past
              </button>
            </div>
            
            <button className="filter-button">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
          
          <div className="appointments-list">
            {appointments.length === 0 ? (
              <p className="no-appointments-message">No appointments found.</p>
            ) : (
              appointments.map(appointment => (
                <div className="appointment-card detailed" key={appointment.id}>
                  <div className="appointment-date-time">
                    <div className="appointment-date">
                      <Calendar size={16} />
                      <span>{new Date(appointment.date).toLocaleDateString()}</span>
                    </div>
                    <div className="appointment-time">
                      <Clock size={16} />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                  
                  <div className="appointment-details">
                    <h3>{appointment.patient}</h3>
                    <p>{appointment.type}</p>
                  </div>
                  
                  <div className={`appointment-status ${appointment.status.toLowerCase()}`}>
                    {appointment.status}
                  </div>
                  
                  <div className="appointment-actions">
                    <button className="action-btn">
                      <MessageSquare size={16} />
                    </button>
                    <button className="action-btn edit">
                      Edit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Appointments;