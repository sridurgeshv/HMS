import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Dashboard.css';
import { 
  Users, 
  Briefcase, 
  BarChart2, 
  Settings, 
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
  const [adminData, setAdminData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    password: '••••••••••',
    adminCode: ''
  });

  // Toggle sidebar
  const toggleSidebar = () => {
    setActiveSidebar(!activeSidebar);
  };

  // Fetch users and admin data
  useEffect(() => {
    // Fetch users from the backend
    axios.get('http://localhost:8000/users/')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
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
          email: data.email,
          phone: data.phone,
          role: data.role,
          department: data.department,
          password: '••••••••••',
          adminCode: data.admin_code
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

  // Filter users based on role and search query
  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === 'All' || user.role === selectedRole;
    const matchesSearch = user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase()));
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

  // Get user ID based on role
  const getUserId = (user) => {
    if (user.role === 'patient') return user.patient_id;
    if (user.role === 'doctor') return user.doctor_id;
    if (user.role === 'nurse') return user.nurse_id;
    return 'N/A';
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
                <p className="admin-name">{adminData.fullName}</p>
                <p className="admin-role">{adminData.role}</p>
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
                    <th>ID</th>
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
                            <span>{user.full_name}</span>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge role-${user.role.toLowerCase()}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{user.department || 'N/A'}</td>
                        <td>
                          <span className={`status-indicator ${user.status.toLowerCase()}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>{getUserId(user)}</td>
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
        </div>
      </main>
    </div>
  );
};

export default UserManagement;