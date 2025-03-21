import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Dashboard.css';
import { 
  Users, 
  Briefcase, 
  BarChart2, 
  Settings,  
  LogOut, 
  Menu, 
  X,
  User,
  Calendar,
  Clock
} from 'lucide-react';
import axios from 'axios';

const Departments = () => {
  const location = useLocation();
  const [activeSidebar, setActiveSidebar] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [adminData, setAdminData] = useState({
    fullName: '',
    role: ''
  });

  // Toggle sidebar
  const toggleSidebar = () => {
    setActiveSidebar(!activeSidebar);
  };

  // Fetch doctors, nurses, and admin data
  useEffect(() => {
    // Fetch doctors
    axios.get('http://localhost:8000/doctors/')
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
      });

    // Fetch nurses
    axios.get('http://localhost:8000/nurses/')
      .then(response => {
        setNurses(response.data);
      })
      .catch(error => {
        console.error('Error fetching nurses:', error);
      });

    // Fetch admin data
    const fetchAdminData = async () => {
      const adminId = localStorage.getItem('admin_id');
      if (!adminId) {
        console.error("Admin ID not found in local storage");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8000/admin/${adminId}`);
        const data = response.data;
        setAdminData({
          fullName: data.full_name,
          role: data.role
        });
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();

    // Set current time and date
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`departments-container ${activeSidebar ? 'sidebar-active' : 'sidebar-inactive'}`}>
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-logo">CuraSphere</h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {activeSidebar ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <div className="sidebar-menu">
          <Link to="/admin/dashboard" className={location.pathname === '/admin/dashboard' ? 'active' : ''}>
            <BarChart2 size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/users" className={location.pathname === '/admin/users' ? 'active' : ''}>
            <Users size={20} />
            <span>User Management</span>
          </Link>
          <Link to="/admin/departments" className={location.pathname === '/admin/departments' ? 'active' : ''}>
            <Briefcase size={20} />
            <span>Departments</span>
          </Link>
          <Link to="/admin/profile" className={location.pathname === '/admin/settings' ? 'active' : ''}>
            <Settings size={20} />
            <span>Profile</span>
          </Link>
        </div>
        
        <div className="sidebar-footer">
          <Link to="/logout" className="logout-button">
            <LogOut size={20} />
            <span>Logout</span>
          </Link>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="departments-main">
        {/* Top Navigation */}
        <nav className="departments-nav">
          <div className="nav-left">
            <h1>Departments Management</h1>
            <div className="date-time-display">
              <Clock size={16} />
              <span>{currentTime}</span>
              <Calendar size={16} />
              <span>{currentDate}</span>
            </div>
          </div>
          
          <div className="nav-right">
            <div className="search-container">
            </div>
            
            <div className="admin-profile">
              <div className="admin-avatar">
                <User size={20} />
              </div>
              <div className="admin-info">
                <p className="admin-name">{adminData.fullName}</p>
                <p className="admin-role">{adminData.role}</p>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Doctors and Nurses Content */}
        <div className="departments-content">
          {/* Doctors Section */}
          <div className="staff-section">
            <h2>Doctors</h2>
            <div className="staff-grid">
              {doctors.map(doctor => (
                <div key={doctor.id} className="staff-card">
                  <h3>{doctor.full_name}</h3>
                  <p><strong>Specialization:</strong> {doctor.specialization}</p>
                  <p><strong>Hospital:</strong> {doctor.hospital}</p>
                  <p><strong>Experience:</strong> {doctor.experience} years</p>
                  <p><strong>Doctor ID:</strong> {doctor.doctor_id}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nurses Section */}
          <div className="staff-section">
            <h2>Nurses</h2>
            <div className="staff-grid">
              {nurses.map(nurse => (
                <div key={nurse.id} className="staff-card">
                  <h3>{nurse.full_name}</h3>
                  <p><strong>Department:</strong> {nurse.department}</p>
                  <p><strong>Hospital:</strong> {nurse.hospital}</p>
                  <p><strong>Experience:</strong> {nurse.experience} years</p>
                  <p><strong>Nurse ID:</strong> {nurse.nurse_id}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Departments;
