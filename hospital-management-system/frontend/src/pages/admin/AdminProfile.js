import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Dashboard.css';
import { Users, Briefcase, BarChart2, Settings, Grid, Bell, Search, LogOut, Menu, X, User, Mail, Phone, Calendar, Shield, Edit, Save, Clock, Key, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const AdminProfile = () => {
  const location = useLocation();
  const [activeSidebar, setActiveSidebar] = useState(true);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  const [adminData, setAdminData] = useState({
    fullName: 'Admin User',
    email: 'admin@curashpere.com',
    phone: '+1 (555) 123-4567',
    role: 'Super Admin',
    joinDate: 'Jan 15, 2023',
    lastLogin: 'Today at 8:45 AM',
    department: 'Administration',
    password: '••••••••••'
  });

  const [formData, setFormData] = useState({...adminData});

  // Toggle sidebar
  const toggleSidebar = () => {
    setActiveSidebar(!activeSidebar);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Simulate API call
      setTimeout(() => {
        setAdminData({...formData});
        setEditMode(false);
        alert('Profile updated successfully!');
      }, 800);
      
      // In a real application, you would make an API call here
      // await axios.put('http://localhost:8000/admin/profile/', formData);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (editMode) {
      setFormData({...adminData});
    }
    setEditMode(!editMode);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Fetch admin data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);

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
          <Link to="/logout" className="logout-button">
            <LogOut size={20} />
            <span>Logout</span>
          </Link>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Navigation */}
        <nav className="dashboard-nav">
          <div className="nav-left">
            <h1>Profile Settings</h1>
            <div className="date-time-display">
              <Clock size={16} />
              <span>{currentTime}</span>
              <Calendar size={16} />
              <span>{currentDate}</span>
            </div>
          </div>
          
          <div className="nav-right">
            <div className="search-container">
              <Search size={18} />
              <input type="text" placeholder="Search..." />
            </div>
            
            <div className="notification-bell">
              <Bell size={20} />
              {notificationCount > 0 && <span className="notification-badge">{notificationCount}</span>}
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
        
        {/* Profile Content */}
        <div className="profile-content">
          {loading ? (
            <div className="profile-loading">
              <div className="profile-skeleton-header"></div>
              <div className="profile-skeleton-content">
                <div className="profile-skeleton-avatar"></div>
                <div className="profile-skeleton-details">
                  <div className="skeleton-text-lg"></div>
                  <div className="skeleton-text-sm"></div>
                  <div className="skeleton-text-sm"></div>
                </div>
              </div>
              <div className="profile-skeleton-form">
                {Array(5).fill().map((_, idx) => (
                  <div key={idx} className="skeleton-input-group">
                    <div className="skeleton-label"></div>
                    <div className="skeleton-input"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="profile-header">
                <h2 className="section-title">Admin Profile</h2>
                <button 
                  className={`profile-edit-button ${editMode ? 'save-mode' : ''}`} 
                  onClick={editMode ? handleSubmit : toggleEditMode}
                >
                  {editMode ? (
                    <>
                      <Save size={18} />
                      <span>Save Changes</span>
                    </>
                  ) : (
                    <>
                      <Edit size={18} />
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>
                {editMode && (
                  <button className="profile-cancel-button" onClick={toggleEditMode}>
                    <X size={18} />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
              
              <div className="profile-card">
                <div className="profile-info">
                  <div className="profile-avatar">
                    <div className="avatar-circle">
                      <User size={60} />
                    </div>
                    <div className={`profile-badge ${adminData.role === 'Super Admin' ? 'super-admin' : 'admin'}`}>
                      <Shield size={14} />
                    </div>
                  </div>
                  <div className="profile-details">
                    <h3 className="profile-name">{adminData.fullName}</h3>
                    <p className="profile-role">{adminData.role}</p>
                    <p className="profile-department">{adminData.department}</p>
                  </div>
                </div>
                
                <div className="profile-stats">
                  <div className="profile-stat">
                    <span className="stat-label">Member Since</span>
                    <span className="stat-value">{adminData.joinDate}</span>
                  </div>
                  <div className="profile-stat">
                    <span className="stat-label">Last Login</span>
                    <span className="stat-value">{adminData.lastLogin}</span>
                  </div>
                </div>
              </div>
              
              <div className="profile-form-container">
                <form className="profile-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="fullName">
                      <User size={16} />
                      <span>Full Name</span>
                    </label>
                    <input 
                      type="text" 
                      id="fullName" 
                      name="fullName" 
                      value={editMode ? formData.fullName : adminData.fullName} 
                      onChange={handleChange} 
                      disabled={!editMode}
                      className={`form-input ${editMode ? 'editable' : ''}`}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">
                      <Mail size={16} />
                      <span>Email Address</span>
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={editMode ? formData.email : adminData.email} 
                      onChange={handleChange} 
                      disabled={!editMode}
                      className={`form-input ${editMode ? 'editable' : ''}`}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">
                      <Phone size={16} />
                      <span>Phone Number</span>
                    </label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={editMode ? formData.phone : adminData.phone} 
                      onChange={handleChange} 
                      disabled={!editMode}
                      className={`form-input ${editMode ? 'editable' : ''}`}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="department">
                      <Briefcase size={16} />
                      <span>Department</span>
                    </label>
                    <input 
                      type="text" 
                      id="department" 
                      name="department" 
                      value={editMode ? formData.department : adminData.department} 
                      onChange={handleChange} 
                      disabled={!editMode}
                      className={`form-input ${editMode ? 'editable' : ''}`}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="password">
                      <Key size={16} />
                      <span>Password</span>
                    </label>
                    <div className="password-input-container">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        id="password" 
                        name="password" 
                        value={editMode ? formData.password : adminData.password} 
                        onChange={handleChange} 
                        disabled={!editMode}
                        className={`form-input ${editMode ? 'editable' : ''}`}
                      />
                      {editMode && (
                        <button 
                          type="button" 
                          className="password-toggle" 
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="profile-actions">
                <div className="action-card">
                  <h4>Two-Factor Authentication</h4>
                  <p>Enable additional security for your account</p>
                  <button className="action-button">Enable 2FA</button>
                </div>
                
                <div className="action-card">
                  <h4>Account Activity</h4>
                  <p>View your recent account activity and login history</p>
                  <button className="action-button">View Activity</button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;