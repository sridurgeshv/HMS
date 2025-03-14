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
  Filter,
  Phone,
  Mail,
  PlusCircle,
  Sliders
} from 'lucide-react';
import './Dashboard.css';

const DoctorPatients = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filterCondition, setFilterCondition] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  // Sample data - in a real app, this would be fetched from an API
  const allPatients = [
    { 
      id: 101, 
      name: 'Sarah Johnson', 
      age: 42, 
      gender: 'Female',
      lastVisit: '2025-03-01', 
      condition: 'Hypertension',
      nextAppointment: '2025-03-18',
      email: 'sarah.johnson@example.com',
      phone: '(555) 123-4567',
      bloodType: 'A+',
      allergies: ['Penicillin', 'Peanuts'],
      image: '/api/placeholder/100/100'
    },
    { 
      id: 102, 
      name: 'Michael Brown', 
      age: 35, 
      gender: 'Male',
      lastVisit: '2025-03-03', 
      condition: 'Diabetes',
      nextAppointment: '2025-03-24',
      email: 'michael.brown@example.com',
      phone: '(555) 234-5678',
      bloodType: 'O-',
      allergies: ['Sulfa drugs'],
      image: '/api/placeholder/100/100'
    },
    { 
      id: 103, 
      name: 'Emily Davis', 
      age: 28, 
      gender: 'Female',
      lastVisit: '2025-02-28', 
      condition: 'Asthma',
      nextAppointment: '2025-03-30',
      email: 'emily.davis@example.com',
      phone: '(555) 345-6789',
      bloodType: 'B+',
      allergies: ['Latex', 'Dust'],
      image: '/api/placeholder/100/100'
    },
    { 
      id: 104, 
      name: 'James Wilson', 
      age: 52, 
      gender: 'Male',
      lastVisit: '2025-03-10', 
      condition: 'Arthritis',
      nextAppointment: '2025-04-07',
      email: 'james.wilson@example.com',
      phone: '(555) 456-7890',
      bloodType: 'AB+',
      allergies: ['Aspirin'],
      image: '/api/placeholder/100/100'
    },
    { 
      id: 105, 
      name: 'Lisa Anderson', 
      age: 31, 
      gender: 'Female',
      lastVisit: '2025-03-05', 
      condition: 'Migraine',
      nextAppointment: '2025-03-19',
      email: 'lisa.anderson@example.com',
      phone: '(555) 567-8901',
      bloodType: 'O+',
      allergies: [],
      image: '/api/placeholder/100/100'
    },
    { 
      id: 106, 
      name: 'Robert Taylor', 
      age: 67, 
      gender: 'Male',
      lastVisit: '2025-02-20', 
      condition: 'Hypertension',
      nextAppointment: '2025-03-20',
      email: 'robert.taylor@example.com',
      phone: '(555) 678-9012',
      bloodType: 'A-',
      allergies: ['Iodine'],
      image: '/api/placeholder/100/100'
    }
  ];
  
  const [patients, setPatients] = useState(allPatients);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Filter patients by condition
  useEffect(() => {
    if (filterCondition === 'all') {
      setPatients(allPatients);
    } else {
      const filtered = allPatients.filter(
        patient => patient.condition.toLowerCase() === filterCondition.toLowerCase()
      );
      setPatients(filtered);
    }
  }, [filterCondition]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  const handleFilterChange = (condition) => {
    setFilterCondition(condition);
    setIsFilterOpen(false);
  };
  
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };
  
  // Get unique conditions for filter
  const uniqueConditions = [...new Set(allPatients.map(patient => patient.condition))];
  
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
        
        {/* Patients Content */}
        <div className="dashboard-content">
          <div className="patients-header">
            <h1>My Patients</h1>
            
            <div className="patients-actions">
              <div className="filter-dropdown">
                <button className="filter-button" onClick={handleFilterToggle}>
                  <Filter size={16} />
                  <span>Filter: {filterCondition === 'all' ? 'All Conditions' : filterCondition}</span>
                  <ChevronDown size={16} />
                </button>
                
                {isFilterOpen && (
                  <div className="filter-options">
                    <button 
                      className={filterCondition === 'all' ? 'active' : ''} 
                      onClick={() => handleFilterChange('all')}
                    >
                      All Conditions
                    </button>
                    {uniqueConditions.map(condition => (
                      <button 
                        key={condition}
                        className={filterCondition === condition ? 'active' : ''} 
                        onClick={() => handleFilterChange(condition)}
                      >
                        {condition}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button className="view-toggle" onClick={toggleViewMode}>
                <Sliders size={16} />
                <span>{viewMode === 'grid' ? 'List View' : 'Grid View'}</span>
              </button>
              
              <button className="add-patient-btn">
                <PlusCircle size={16} />
                <span>Add Patient</span>
              </button>
            </div>
          </div>
          
          {patients.length > 0 ? (
            <div className={`patients-container ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
              {patients.map(patient => (
                <div key={patient.id} className="patient-profile-card">
                  <div className="patient-card-header">
                    <div className="patient-avatar">
                      <img src={patient.image} alt={patient.name} />
                    </div>
                    
                    <div className="patient-basic-info">
                      <h3>{patient.name}</h3>
                      <p className="patient-demographics">{patient.age} yrs • {patient.gender} • {patient.bloodType}</p>
                      <span className="condition-tag">{patient.condition}</span>
                    </div>
                  </div>
                  
                  <div className="patient-card-body">
                    <div className="patient-contact">
                      <div className="contact-item">
                        <Mail size={14} />
                        <span>{patient.email}</span>
                      </div>
                      <div className="contact-item">
                        <Phone size={14} />
                        <span>{patient.phone}</span>
                      </div>
                    </div>
                    
                    <div className="patient-visits">
                      <div className="visit-item">
                        <strong>Last Visit:</strong>
                        <span>{formatDate(patient.lastVisit)}</span>
                      </div>
                      <div className="visit-item">
                        <strong>Next Appointment:</strong>
                        <span>{formatDate(patient.nextAppointment)}</span>
                      </div>
                    </div>
                    
                    <div className="patient-allergies">
                      <strong>Allergies:</strong>
                      {patient.allergies.length > 0 ? (
                        <span>{patient.allergies.join(', ')}</span>
                      ) : (
                        <span className="no-allergies">None reported</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="patient-card-actions">
                    <button className="action-btn patient-history">
                      <FileText size={16} />
                      <span>Medical Records</span>
                    </button>
                    <button className="action-btn schedule-appointment">
                      <Clock size={16} />
                      <span>Schedule</span>
                    </button>
                    <button className="action-btn message-patient">
                      <MessageSquare size={16} />
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-patients">
              <p>No patients found with the selected condition.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorPatients;