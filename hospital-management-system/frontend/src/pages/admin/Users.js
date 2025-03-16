import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Dashboard.css';
import { 
  Users, 
  Briefcase, 
  BarChart2, 
  Settings, 
  Grid, 
  Bell, 
  Search, 
  LogOut, 
  Menu, 
  X,
  User,
  Calendar,
  Clock,
  Filter,
  Plus,
  Edit,
  Trash2,
  ChevronDown
} from 'lucide-react';
import axios from 'axios';

const UserManagement = () => {
  const location = useLocation();
  const [activeSidebar, setActiveSidebar] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle sidebar
  const toggleSidebar = () => {
    setActiveSidebar(!activeSidebar);
  };

  // Fetch users and set time
  useEffect(() => {
    // Simulate API call for users
    setTimeout(() => {
      setUsers([
        { id: 1, name: 'Dr. Sarah Smith', email: 'sarah.smith@example.com', role: 'Doctor', department: 'Cardiology', status: 'Active', lastActive: '10 minutes ago' },
        { id: 2, name: 'Nurse Johnson', email: 'johnson@example.com', role: 'Nurse', department: 'Emergency', status: 'Active', lastActive: '1 hour ago' },
        { id: 3, name: 'Admin Williams', email: 'williams@example.com', role: 'Admin', department: 'IT', status: 'Inactive', lastActive: '3 days ago' },
        { id: 4, name: 'Dr. Michael Chen', email: 'michael.chen@example.com', role: 'Doctor', department: 'Neurology', status: 'Active', lastActive: '4 hours ago' },
        { id: 5, name: 'Technician Davis', email: 'davis@example.com', role: 'Technician', department: 'Radiology', status: 'Active', lastActive: '2 days ago' },
        { id: 6, name: 'Nurse Rodriguez', email: 'rodriguez@example.com', role: 'Nurse', department: 'Pediatrics', status: 'Active', lastActive: '5 hours ago' }
      ]);
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

  // Filter users based on role and search query
  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === 'All' || user.role === selectedRole;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle role filter
  const handleRoleFilter = (role) => {
    setSelectedRole(role);
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
            <h1>User Management</h1>
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
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchQuery}
                onChange={handleSearch}
              />
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
                <p className="admin-name">Admin User</p>
                <p className="admin-role">Super Admin</p>
              </div>
            </div>
          </div>
        </nav>
        
        {/* User Management Content */}
        <div className="dashboard-content">
          <section className="users-section">
            <div className="section-header">
              <h2 className="section-title">User Directory</h2>
              <div className="section-actions">
                <div className="filter-dropdown">
                  <button className="btn-filter">
                    <Filter size={16} />
                    <span>Filter: {selectedRole}</span>
                    <ChevronDown size={16} />
                  </button>
                  <div className="dropdown-content">
                    <div className="dropdown-item" onClick={() => handleRoleFilter('All')}>All</div>
                    <div className="dropdown-item" onClick={() => handleRoleFilter('Doctor')}>Doctor</div>
                    <div className="dropdown-item" onClick={() => handleRoleFilter('Nurse')}>Nurse</div>
                    <div className="dropdown-item" onClick={() => handleRoleFilter('Admin')}>Admin</div>
                    <div className="dropdown-item" onClick={() => handleRoleFilter('Technician')}>Technician</div>
                  </div>
                </div>
                <button className="btn-primary">
                  <Plus size={16} />
                  Add User
                </button>
              </div>
            </div>
            
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Last Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array(6).fill().map((_, idx) => (
                      <tr key={idx} className="skeleton-loader">
                        <td><div className="skeleton-text"></div></td>
                        <td><div className="skeleton-text"></div></td>
                        <td><div className="skeleton-text"></div></td>
                        <td><div className="skeleton-text"></div></td>
                        <td><div className="skeleton-text"></div></td>
                        <td><div className="skeleton-text"></div></td>
                        <td><div className="skeleton-actions"></div></td>
                      </tr>
                    ))
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <tr key={user.id} className="fade-in-table-row">
                        <td>
                          <div className="user-info">
                            <div className="user-avatar">
                              <User size={16} />
                            </div>
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge role-${user.role.toLowerCase()}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{user.department}</td>
                        <td>
                          <span className={`status-indicator ${user.status.toLowerCase()}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>{user.lastActive}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-icon btn-edit" title="Edit User">
                              <Edit size={16} />
                            </button>
                            <button className="btn-icon btn-delete" title="Delete User">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-results">No users found matching your criteria</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="pagination">
              <button className="pagination-btn active">1</button>
              <button className="pagination-btn">2</button>
              <button className="pagination-btn">3</button>
              <button className="pagination-btn">Next</button>
            </div>
          </section>
          
          <section className="user-stats-section">
            <div className="stats-summary">
              <div className="stats-card">
                <div className="stats-card-header">
                  <h3>User Statistics</h3>
                </div>
                <div className="stats-card-body">
                  <div className="stats-item">
                    <span className="stats-label">Total Users</span>
                    <span className="stats-value">245</span>
                  </div>
                  <div className="stats-item">
                    <span className="stats-label">Active Users</span>
                    <span className="stats-value">189</span>
                  </div>
                  <div className="stats-item">
                    <span className="stats-label">New This Month</span>
                    <span className="stats-value">24</span>
                  </div>
                </div>
              </div>
              
              <div className="stats-card">
                <div className="stats-card-header">
                  <h3>Role Distribution</h3>
                </div>
                <div className="stats-card-body">
                  <div className="role-distribution">
                    <div className="role-bar">
                      <div className="role-fill doctor" style={{width: "40%"}} title="Doctors: 40%"></div>
                      <div className="role-fill nurse" style={{width: "35%"}} title="Nurses: 35%"></div>
                      <div className="role-fill admin" style={{width: "15%"}} title="Admins: 15%"></div>
                      <div className="role-fill technician" style={{width: "10%"}} title="Technicians: 10%"></div>
                    </div>
                    <div className="role-legend">
                      <div className="legend-item">
                        <span className="legend-color doctor"></span>
                        <span>Doctors</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color nurse"></span>
                        <span>Nurses</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color admin"></span>
                        <span>Admins</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color technician"></span>
                        <span>Technicians</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;