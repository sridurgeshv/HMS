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
  Filter,
  Download,
  Eye
} from 'lucide-react';

const MedicalRecords = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Sample data
  const records = [
    { 
      id: 201, 
      patient: 'Sarah Johnson', 
      recordType: 'Blood Test',
      date: '2025-03-01',
      doctor: 'Dr. Jane Smith',
      status: 'Completed'
    },
    { 
      id: 202, 
      patient: 'Michael Brown', 
      recordType: 'X-Ray',
      date: '2025-03-03',
      doctor: 'Dr. Jane Smith',
      status: 'Pending'
    },
    { 
      id: 203, 
      patient: 'Emily Davis', 
      recordType: 'Prescription',
      date: '2025-02-28',
      doctor: 'Dr. Jane Smith',
      status: 'Completed'
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
          <Link to="/doctor/patients" className="nav-item">
            <Users size={20} />
            <span>Patients</span>
          </Link>
          <Link to="/doctor/medical-records" className="nav-item active">
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
            <input type="text" placeholder="Search records..." />
          </div>
          
          <div className="topbar-right">
            <div className="notification-bell">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </div>
          </div>
        </header>
        
        {/* Medical Records Content */}
        <div className="dashboard-content">
          <div className="content-header">
            <h1>Medical Records</h1>
            <div className="header-actions">
              <button className="secondary-button">
                <Filter size={18} />
                <span>Filter</span>
              </button>
            </div>
          </div>
          
          <div className="cards-grid">
            {records.map(record => (
              <div className="card" key={record.id}>
                <div className="card-header">
                  <h3 className="card-title">{record.recordType}</h3>
                  <span className={`card-badge ${record.status.toLowerCase()}`}>
                    {record.status}
                  </span>
                </div>
                <div className="card-body">
                  <div className="card-detail">
                    <span className="card-detail-label">Patient</span>
                    <p className="card-detail-value">{record.patient}</p>
                  </div>
                  <div className="card-detail">
                    <span className="card-detail-label">Date</span>
                    <p className="card-detail-value">{new Date(record.date).toLocaleDateString()}</p>
                  </div>
                  <div className="card-detail">
                    <span className="card-detail-label">Doctor</span>
                    <p className="card-detail-value">{record.doctor}</p>
                  </div>
                </div>
                <div className="card-footer">
                  <button className="action-btn" title="View Record">
                    <Eye size={16} />
                  </button>
                  <button className="action-btn" title="Download">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="records-table-container">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Record Type</th>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.id}>
                    <td>{record.patient}</td>
                    <td>{record.recordType}</td>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.doctor}</td>
                    <td>
                      <span className={`status-badge ${record.status.toLowerCase()}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="action-btn" title="View Record">
                          <Eye size={16} />
                        </button>
                        <button className="action-btn" title="Download">
                          <Download size={16} />
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

export default MedicalRecords;