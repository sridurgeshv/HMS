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
  ChevronDown,
  Filter
} from 'lucide-react';
import './Dashboard.css';

const DoctorAppointments = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Sample data - in a real app, this would be fetched from an API
  const allAppointments = [
    { id: 1, patient: 'Sarah Johnson', time: '09:00 AM', date: '2025-03-14', status: 'Confirmed', type: 'Check-up' },
    { id: 2, patient: 'Michael Brown', time: '10:30 AM', date: '2025-03-14', status: 'Confirmed', type: 'Follow-up' },
    { id: 3, patient: 'Emily Davis', time: '01:00 PM', date: '2025-03-14', status: 'Confirmed', type: 'Consultation' },
    { id: 4, patient: 'James Wilson', time: '03:30 PM', date: '2025-03-14', status: 'Tentative', type: 'Follow-up' },
    { id: 5, patient: 'Lisa Anderson', time: '09:15 AM', date: '2025-03-15', status: 'Confirmed', type: 'Annual exam' },
    { id: 6, patient: 'Robert Taylor', time: '11:00 AM', date: '2025-03-15', status: 'Pending', type: 'New patient' },
    { id: 7, patient: 'Jennifer Moore', time: '02:00 PM', date: '2025-03-15', status: 'Confirmed', type: 'Follow-up' },
    { id: 8, patient: 'David Clark', time: '10:00 AM', date: '2025-03-16', status: 'Cancelled', type: 'Check-up' },
    { id: 9, patient: 'Michelle Lee', time: '11:30 AM', date: '2025-03-16', status: 'Confirmed', type: 'Consultation' },
  ];
  
  const [appointments, setAppointments] = useState(allAppointments);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Filter appointments by status
  useEffect(() => {
    if (filterStatus === 'all') {
      setAppointments(allAppointments);
    } else {
      const filtered = allAppointments.filter(
        appointment => appointment.status.toLowerCase() === filterStatus.toLowerCase()
      );
      setAppointments(filtered);
    }
  }, [filterStatus]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setIsFilterOpen(false);
  };
  
  const groupAppointmentsByDate = () => {
    const grouped = {};
    
    appointments.forEach(appointment => {
      if (!grouped[appointment.date]) {
        grouped[appointment.date] = [];
      }
      grouped[appointment.date].push(appointment);
    });
    
    return grouped;
  };
  
  const groupedAppointments = groupAppointmentsByDate();
  
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
        
        {/* Appointments Content */}
        <div className="dashboard-content">
          <div className="appointments-header">
            <h1>Appointments</h1>
            
            <div className="appointments-actions">
              <div className="filter-dropdown">
                <button className="filter-button" onClick={handleFilterToggle}>
                  <Filter size={16} />
                  <span>Filter: {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}</span>
                  <ChevronDown size={16} />
                </button>
                
                {isFilterOpen && (
                  <div className="filter-options">
                    <button 
                      className={filterStatus === 'all' ? 'active' : ''} 
                      onClick={() => handleFilterChange('all')}
                    >
                      All
                    </button>
                    <button 
                      className={filterStatus === 'confirmed' ? 'active' : ''} 
                      onClick={() => handleFilterChange('confirmed')}
                    >
                      Confirmed
                    </button>
                    <button 
                      className={filterStatus === 'pending' ? 'active' : ''} 
                      onClick={() => handleFilterChange('pending')}
                    >
                      Pending
                    </button>
                    <button 
                      className={filterStatus === 'tentative' ? 'active' : ''} 
                      onClick={() => handleFilterChange('tentative')}
                    >
                      Tentative
                    </button>
                    <button 
                      className={filterStatus === 'cancelled' ? 'active' : ''} 
                      onClick={() => handleFilterChange('cancelled')}
                    >
                      Cancelled
                    </button>
                  </div>
                )}
              </div>
              
              <button className="add-appointment-btn">
                <span>+ New Appointment</span>
              </button>
            </div>
          </div>
          
          <div className="appointments-list-container">
            {Object.keys(groupedAppointments).length > 0 ? (
              Object.keys(groupedAppointments).sort().map(date => (
                <div key={date} className="appointments-date-group">
                  <h2 className="date-header">{formatDate(date)}</h2>
                  
                  <div className="expanded-appointments-list">
                    {groupedAppointments[date].map(appointment => (
                      <div className="appointment-card expanded" key={appointment.id}>
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
                        
                        <div className="appointment-actions">
                          <button className="action-btn view-patient">
                            <Users size={16} />
                          </button>
                          <button className="action-btn send-message">
                            <MessageSquare size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-appointments">
                <p>No appointments found with the selected filter.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorAppointments;