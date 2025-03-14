import React, { useState } from 'react';
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
  Filter,
  Phone,
  Mail
} from 'lucide-react';

const Patients = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Sample data
  const patients = [
    { 
      id: 101, 
      name: 'Sarah Johnson', 
      age: 42, 
      gender: 'Female',
      phone: '(555) 123-4567',
      email: 'sarah.j@example.com',
      condition: 'Hypertension',
      lastVisit: '2025-03-01'
    },
    { 
      id: 102, 
      name: 'Michael Brown', 
      age: 35, 
      gender: 'Male',
      phone: '(555) 234-5678',
      email: 'mbrown@example.com',
      condition: 'Diabetes',
      lastVisit: '2025-03-03'
    },
    { 
      id: 103, 
      name: 'Emily Davis', 
      age: 28, 
      gender: 'Female',
      phone: '(555) 345-6789',
      email: 'emily.d@example.com',
      condition: 'Asthma',
      lastVisit: '2025-02-28'
    }
  ];
  
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
          <Link to="/doctor/patients" className="nav-item active">
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
            <input type="text" placeholder="Search patients..." />
          </div>
          
          <div className="topbar-right">
            <div className="notification-bell">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </div>
          </div>
        </header>
        
        {/* Patients Content */}
        <div className="dashboard-content">
          <div className="content-header">
            <h1>Patients</h1>
            <button className="primary-button">
              <Plus size={18} />
              <span>Add Patient</span>
            </button>
          </div>
          
          <div className="filter-section">
            <button className="filter-button">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
          
          <div className="patients-table-container">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Contact</th>
                  <th>Condition</th>
                  <th>Last Visit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(patient => (
                  <tr key={patient.id}>
                    <td className="patient-name">
                      <div className="patient-avatar">
                        <img src={`/api/placeholder/40/40`} alt={patient.name} />
                      </div>
                      <span>{patient.name}</span>
                    </td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td className="patient-contact">
                      <div className="contact-item">
                        <Phone size={14} />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="contact-item">
                        <Mail size={14} />
                        <span>{patient.email}</span>
                      </div>
                    </td>
                    <td>{patient.condition}</td>
                    <td>{new Date(patient.lastVisit).toLocaleDateString()}</td>
                    <td>
                      <div className="table-actions">
                        <button className="action-btn" title="View Records">
                          <FileText size={16} />
                        </button>
                        <button className="action-btn" title="Send Message">
                          <MessageSquare size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Patients;