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
  PlusCircle,
  Edit,
  Trash2,
  User,
  Calendar,
  Clock,
  Filter,
  ChevronDown
} from 'lucide-react';
import axios from 'axios';

const Departments = () => {
  const location = useLocation();
  const [activeSidebar, setActiveSidebar] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [filterOption, setFilterOption] = useState('all');

  // Toggle sidebar
  const toggleSidebar = () => {
    setActiveSidebar(!activeSidebar);
  };

  // Fetch departments data
  useEffect(() => {
    // Simulate API call for departments
    setTimeout(() => {
      setDepartments([
        { 
          id: 1, 
          name: 'Emergency', 
          head: 'Dr. Michael Torres', 
          staffCount: 24, 
          capacity: 92, 
          status: 'Active',
          rooms: 12,
          description: 'Handles emergency cases requiring immediate medical attention.'
        },
        { 
          id: 2, 
          name: 'Cardiology', 
          head: 'Dr. Sarah Johnson', 
          staffCount: 18, 
          capacity: 74, 
          status: 'Active',
          rooms: 8,
          description: 'Specialized in diagnosing and treating heart conditions and diseases.'
        },
        { 
          id: 3, 
          name: 'Pediatrics', 
          head: 'Dr. Emily Chen', 
          staffCount: 15, 
          capacity: 63, 
          status: 'Active',
          rooms: 10,
          description: 'Provides medical care for infants, children, and adolescents.'
        },
        { 
          id: 4, 
          name: 'Neurology', 
          head: 'Dr. James Wilson', 
          staffCount: 12, 
          capacity: 55, 
          status: 'Active',
          rooms: 6,
          description: 'Treats disorders of the nervous system, including the brain and spinal cord.'
        },
        { 
          id: 5, 
          name: 'Oncology', 
          head: 'Dr. Patricia Miller', 
          staffCount: 16, 
          capacity: 70, 
          status: 'Active',
          rooms: 9,
          description: 'Specializes in the diagnosis and treatment of cancer.'
        },
        { 
          id: 6, 
          name: 'Radiology', 
          head: 'Dr. Robert Brown', 
          staffCount: 10, 
          capacity: 60, 
          status: 'Maintenance',
          rooms: 7,
          description: 'Uses imaging technologies to diagnose and treat diseases.'
        },
        { 
          id: 7, 
          name: 'Orthopedics', 
          head: 'Dr. Susan Taylor', 
          staffCount: 14, 
          capacity: 65, 
          status: 'Active',
          rooms: 8,
          description: 'Concerned with the musculoskeletal system, including bones, joints, and muscles.'
        },
        { 
          id: 8, 
          name: 'Psychiatry', 
          head: 'Dr. David Lee', 
          staffCount: 9, 
          capacity: 50, 
          status: 'Active',
          rooms: 5,
          description: 'Treats mental disorders and provides mental health services.'
        }
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

  // Handle department form toggle
  const toggleAddDepartment = () => {
    setShowAddDepartment(!showAddDepartment);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  // Filter departments based on selected option
  const filteredDepartments = departments.filter(dept => {
    if (filterOption === 'all') return true;
    if (filterOption === 'high-capacity' && dept.capacity >= 70) return true;
    if (filterOption === 'low-capacity' && dept.capacity < 70) return true;
    if (filterOption === 'maintenance' && dept.status === 'Maintenance') return true;
    return false;
  });

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
              <Search size={18} />
              <input type="text" placeholder="Search departments..." />
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
        
        {/* Departments Content */}
        <div className="departments-content">
          <div className="departments-header">
            <div className="departments-header-left">
              <h2 className="page-title">Hospital Departments</h2>
              <div className="departments-filter">
                <Filter size={16} />
                <select value={filterOption} onChange={handleFilterChange}>
                  <option value="all">All Departments</option>
                  <option value="high-capacity">High Capacity (≥70%)</option>
                  <option value="low-capacity">Low Capacity (≤70%)</option>
                  <option value="maintenance">Under Maintenance</option>
                </select>
              </div>
            </div>
            <button className="add-department-btn" onClick={toggleAddDepartment}>
              <PlusCircle size={18} />
              <span>Add Department</span>
            </button>
          </div>
          
          {showAddDepartment && (
            <div className="add-department-form">
              <h3>Add New Department</h3>
              <form>
                <div className="form-group">
                  <label>Department Name</label>
                  <input type="text" placeholder="Enter department name" />
                </div>
                <div className="form-group">
                  <label>Department Head</label>
                  <input type="text" placeholder="Enter department head name" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Staff Count</label>
                    <input type="number" placeholder="Enter staff count" min="0" />
                  </div>
                  <div className="form-group">
                    <label>Room Count</label>
                    <input type="number" placeholder="Enter room count" min="0" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea placeholder="Enter department description"></textarea>
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={toggleAddDepartment}>Cancel</button>
                  <button type="submit" className="submit-btn">Save Department</button>
                </div>
              </form>
            </div>
          )}
          
          {loading ? (
            <div className="departments-grid">
              {Array(6).fill().map((_, idx) => (
                <div key={idx} className="department-card skeleton-loader">
                  <div className="skeleton-text-lg"></div>
                  <div className="skeleton-text-sm"></div>
                  <div className="skeleton-progress"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="departments-grid">
              {filteredDepartments.map(dept => (
                <div key={dept.id} className={`department-card ${dept.status === 'Maintenance' ? 'maintenance' : ''}`}>
                  <div className="department-header">
                    <h3>{dept.name}</h3>
                    <div className="department-actions">
                      <button className="edit-btn">
                        <Edit size={16} />
                      </button>
                      <button className="delete-btn">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="department-info">
                    <p><strong>Head:</strong> {dept.head}</p>
                    <p><strong>Staff:</strong> {dept.staffCount}</p>
                    <p><strong>Rooms:</strong> {dept.rooms}</p>
                    <div className="capacity-container">
                      <div className="capacity-label">
                        <span>Capacity:</span>
                        <span>{dept.capacity}%</span>
                      </div>
                      <div className="capacity-bar">
                        <div 
                          className={`capacity-fill ${dept.capacity > 85 ? 'high' : dept.capacity > 60 ? 'medium' : 'low'}`} 
                          style={{width: `${dept.capacity}%`}}
                        ></div>
                      </div>
                    </div>
                    <p className="department-description">{dept.description}</p>
                  </div>
                  
                  <div className="department-footer">
                    <span className={`department-status ${dept.status.toLowerCase()}`}>
                      {dept.status}
                    </span>
                    <button className="view-details-btn">
                      <span>View Details</span>
                      <ChevronDown size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="departments-summary">
            <div className="summary-card">
              <h3>Total Departments</h3>
              <p className="summary-value">{departments.length}</p>
            </div>
            <div className="summary-card">
              <h3>Total Staff</h3>
              <p className="summary-value">
                {departments.reduce((total, dept) => total + dept.staffCount, 0)}
              </p>
            </div>
            <div className="summary-card">
              <h3>Total Rooms</h3>
              <p className="summary-value">
                {departments.reduce((total, dept) => total + dept.rooms, 0)}
              </p>
            </div>
            <div className="summary-card">
              <h3>Avg Capacity</h3>
              <p className="summary-value">
                {departments.length > 0 
                  ? Math.round(departments.reduce((total, dept) => total + dept.capacity, 0) / departments.length) 
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Departments;