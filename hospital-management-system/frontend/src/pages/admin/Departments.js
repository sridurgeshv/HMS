import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Clock,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import axios from 'axios';

const Departments = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSidebar, setActiveSidebar] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [adminData, setAdminData] = useState({
    fullName: '',
    role: ''
  });
  const [activeTab, setActiveTab] = useState('doctors');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Toggle sidebar
  const toggleSidebar = () => {
    setActiveSidebar(!activeSidebar);
  };

  // Filter staff based on search term
  const filteredDoctors = doctors.filter(doctor => 
    doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredNurses = nurses.filter(nurse => 
    nurse.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nurse.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nurse.hospital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch doctors, nurses, and admin data
  useEffect(() => {
    setIsLoading(true);
    // Fetch doctors
    axios.get('http://localhost:8000/doctors/')
      .then(response => {
        setDoctors(response.data);
        setTimeout(() => setIsLoading(false), 800); // Simulate loading for demo
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
        setIsLoading(false);
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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('admin_id');
    navigate('/');
  };

  // Render skeleton loaders
  const renderSkeletons = (count) => {
    return Array(count).fill(0).map((_, index) => (
      <div key={index} className="staff-card skeleton-loader">
        <div className="skeleton-text-lg"></div>
        <div className="skeleton-text-sm"></div>
        <div className="skeleton-text-sm"></div>
        <div className="skeleton-text-sm"></div>
        <div className="skeleton-text-sm"></div>
      </div>
    ));
  };

  return (
    <div className={`dashboard-container ${activeSidebar ? 'sidebar-active' : 'sidebar-inactive'}`}>
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
          <div 
            onClick={handleLogout} 
            className="logout-button"
            style={{ cursor: 'pointer' }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Navigation */}
        <nav className="dashboard-nav">
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
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search staff..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
        
        {/* Departments Content */}
        <div className="dashboard-content">
          <div className="departments-header">
            <div className="departments-header-left">
              <h2 className="page-title">Staff Directory</h2>
              <div className="departments-filter">
                <Filter size={16} />
                <select>
                  <option value="all">All Hospitals</option>
                  <option value="city">City Hospital</option>
                  <option value="memorial">Memorial Hospital</option>
                  <option value="general">General Hospital</option>
                </select>
              </div>
            </div>
            
            <button className="add-department-btn">
              <Plus size={16} />
              <span>Add New Staff</span>
            </button>
          </div>
          
          {/* Department Tabs */}
          <div className="departments-tabs">
            <button 
              className={`tab-button ${activeTab === 'doctors' ? 'active' : ''}`}
              onClick={() => setActiveTab('doctors')}
            >
              Doctors ({doctors.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'nurses' ? 'active' : ''}`}
              onClick={() => setActiveTab('nurses')}
            >
              Nurses ({nurses.length})
            </button>
          </div>
          
          {/* Doctors Tab Content */}
          <div className={`staff-section ${activeTab === 'doctors' ? 'active' : 'hidden'}`}>
            <div className="department-stats">
              <div className="stat-card">
                <h3>Total Doctors</h3>
                <p className="stat-value">{doctors.length}</p>
              </div>
              <div className="stat-card">
                <h3>Specializations</h3>
                <p className="stat-value">{new Set(doctors.map(d => d.specialization)).size}</p>
              </div>
              <div className="stat-card">
                <h3>Average Experience</h3>
                <p className="stat-value">
                  {doctors.length > 0 
                    ? (doctors.reduce((sum, d) => sum + d.experience, 0) / doctors.length).toFixed(1) 
                    : 0} years
                </p>
              </div>
            </div>
            
            <div className="staff-grid">
              {isLoading ? (
                renderSkeletons(6)
              ) : filteredDoctors.length > 0 ? (
                filteredDoctors.map(doctor => (
                  <div key={doctor.id} className="staff-card">
                    <div className="staff-avatar">
                      <User size={32} />
                    </div>
                    <h3>{doctor.full_name}</h3>
                    <div className="staff-badge">{doctor.specialization}</div>
                    <div className="staff-details">
                      <p><strong>Hospital:</strong> {doctor.hospital}</p>
                      <p><strong>Experience:</strong> {doctor.experience} years</p>
                      <p><strong>Doctor ID:</strong> {doctor.doctor_id}</p>
                    </div>
                    <button className="view-profile-btn">View Profile</button>
                  </div>
                ))
              ) : (
                <div className="no-results">No doctors matching your search criteria</div>
              )}
            </div>
          </div>
          
          {/* Nurses Tab Content */}
          <div className={`staff-section ${activeTab === 'nurses' ? 'active' : 'hidden'}`}>
            <div className="department-stats">
              <div className="stat-card">
                <h3>Total Nurses</h3>
                <p className="stat-value">{nurses.length}</p>
              </div>
              <div className="stat-card">
                <h3>Departments</h3>
                <p className="stat-value">{new Set(nurses.map(n => n.department)).size}</p>
              </div>
              <div className="stat-card">
                <h3>Average Experience</h3>
                <p className="stat-value">
                  {nurses.length > 0 
                    ? (nurses.reduce((sum, n) => sum + n.experience, 0) / nurses.length).toFixed(1) 
                    : 0} years
                </p>
              </div>
            </div>
            
            <div className="staff-grid">
              {isLoading ? (
                renderSkeletons(6)
              ) : filteredNurses.length > 0 ? (
                filteredNurses.map(nurse => (
                  <div key={nurse.id} className="staff-card">
                    <div className="staff-avatar">
                      <User size={32} />
                    </div>
                    <h3>{nurse.full_name}</h3>
                    <div className="staff-badge">{nurse.department}</div>
                    <div className="staff-details">
                      <p><strong>Hospital:</strong> {nurse.hospital}</p>
                      <p><strong>Experience:</strong> {nurse.experience} years</p>
                      <p><strong>Nurse ID:</strong> {nurse.nurse_id}</p>
                    </div>
                    <button className="view-profile-btn">View Profile</button>
                  </div>
                ))
              ) : (
                <div className="no-results">No nurses matching your search criteria</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Departments;