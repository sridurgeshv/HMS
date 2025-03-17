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
  Filter,
  Phone,
  Mail
} from 'lucide-react';
import axios from 'axios';

const Patients = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [patients, setPatients] = useState([]); // Initialize as an empty array
  const [doctor, setDoctor] = useState({ full_name: "", specialization: "" });
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    // Fetch patients from the backend
    const fetchPatients = async () => {
      const doctorId = localStorage.getItem('doctor_id'); // Retrieve doctor_id from local storage
      if (!doctorId) {
        setError("Doctor ID not found. Please log in again.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/doctor-patients/${doctorId}`);
        if (!response.ok) throw new Error("Failed to fetch patients");

        const data = await response.json();
        // Ensure data is an array before setting it in the state
        if (Array.isArray(data)) {
          setPatients(data);
        } else {
          setPatients([]); // Set to empty array if data is not an array
        }
      } catch (error) {
        setError(error.message);
        setPatients([]); // Set to empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
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
        <p>Loading patients...</p>
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
            {patients.length === 0 ? (
              <p className="no-patients-message">No patients found.</p>
            ) : (
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
                          <img src={`/api/placeholder/40/40`} alt={patient.full_name} />
                        </div>
                        <span>{patient.full_name}</span>
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
                      <td>
                        {patient.medical_history.map((history, index) => (
                          <div key={index}>
                            {history.medications}
                          </div>
                        ))}
                      </td>
                      <td>
                        {patient.medical_history.map((history, index) => (
                          <div key={index}>
                            {new Date(history.visit_date).toLocaleDateString()}
                          </div>
                        ))}
                      </td>
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Patients;