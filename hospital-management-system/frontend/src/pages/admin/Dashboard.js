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
  ChevronUp,
  Activity,
  User,
  Calendar,
  Clock
} from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const location = useLocation();
  const [activeSidebar, setActiveSidebar] = useState(true);
  const [statsData, setStatsData] = useState([]);
  const [notificationCount, setNotificationCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [pendingRegistrations, setPendingRegistrations] = useState([]);

  useEffect(() => {
    const fetchPendingRegistrations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/pending-registrations/');
        setPendingRegistrations(response.data);
      } catch (error) {
        console.error('Error fetching pending registrations:', error);
      }
    };

    fetchPendingRegistrations();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://localhost:8000/approve-registration/${id}/`);
      setPendingRegistrations(pendingRegistrations.filter(reg => reg.id !== id));
      alert('Registration approved');
    } catch (error) {
      console.error('Error approving registration:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`http://localhost:8000/reject-registration/${id}/`);
      setPendingRegistrations(pendingRegistrations.filter(reg => reg.id !== id));
      alert('Registration rejected');
    } catch (error) {
      console.error('Error rejecting registration:', error);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setActiveSidebar(!activeSidebar);
  };

  // Fetch mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStatsData([
        { id: 1, title: 'Total Users', count: 1250, growth: '+12%', icon: <Users className="stats-card-icon" /> },
        { id: 2, title: 'Departments', count: 8, growth: '+2', icon: <Briefcase className="stats-card-icon" /> },
        { id: 3, title: 'Active Sessions', count: 42, growth: '+5%', icon: <Activity className="stats-card-icon" /> },
        { id: 4, title: 'Resources', count: 320, growth: '+18', icon: <Grid className="stats-card-icon" /> }
      ]);
      setLoading(false);
    }, 1200);

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

  // Recent user activity mock data
  const recentActivity = [
    { id: 1, user: 'Dr. Smith', action: 'Updated profile information', time: '10 min ago' },
    { id: 2, user: 'Admin Jane', action: 'Created new department', time: '1 hour ago' },
    { id: 3, user: 'Nurse Johnson', action: 'Requested resource allocation', time: '3 hours ago' },
    { id: 4, user: 'Dr. Williams', action: 'Changed department', time: '5 hours ago' }
  ];

  // Analytics data for the chart 
  const analyticsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Patients',
        data: [120, 150, 180, 220, 250, 280]
      },
      {
        label: 'Staff',
        data: [30, 40, 45, 50, 55, 60]
      }
    ]
  };

  return (
    <div className={`dashboard-container ${activeSidebar ? 'sidebar-active' : 'sidebar-inactive'}`}>
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-logo">MedAdmin</h2>
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
          <Link to="/admin/analytics" className={location.pathname === '/admin/analytics' ? 'active' : ''}>
            <BarChart2 size={20} />
            <span>Analytics</span>
          </Link>
          <Link to="/admin/settings" className={location.pathname === '/admin/settings' ? 'active' : ''}>
            <Settings size={20} />
            <span>Configuration</span>
          </Link>
          <Link to="/admin/resources" className={location.pathname === '/admin/resources' ? 'active' : ''}>
            <Grid size={20} />
            <span>Resources</span>
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
            <h1>Admin Dashboard</h1>
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
                <p className="admin-name">Admin User</p>
                <p className="admin-role">Super Admin</p>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Statistics Cards */}
          <section className="stats-section">
            <h2 className="section-title">Overview</h2>
            <div className="stats-grid">
              {loading ? (
                // Skeleton loaders when loading
                Array(4).fill().map((_, idx) => (
                  <div key={idx} className="stats-card skeleton-loader">
                    <div className="skeleton-icon"></div>
                    <div className="skeleton-text-lg"></div>
                    <div className="skeleton-text-sm"></div>
                  </div>
                ))
              ) : (
                // Actual data when loaded
                statsData.map(stat => (
                  <div key={stat.id} className="stats-card fade-in">
                    <div className="stats-card-header">
                      <h3>{stat.title}</h3>
                      {stat.icon}
                    </div>
                    <div className="stats-card-body">
                      <p className="stats-count">{stat.count}</p>
                      <span className="stats-growth">{stat.growth}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
          
          {/* Charts and Activity Section */}
          <div className="dashboard-grid">
            {/* Analytics Chart */}
            <section className="chart-section">
              <div className="section-header">
                <h2 className="section-title">User Analytics</h2>
                <div className="section-actions">
                  <button className="btn-outline">
                    <ChevronUp size={16} />
                    Export
                  </button>
                </div>
              </div>
              
              <div className="chart-container">
                {loading ? (
                  <div className="chart-skeleton"></div>
                ) : (
                  <div className="analytics-chart">
                    {/* Placeholder for actual chart - in real app you'd use Chart.js or similar */}
                    <div className="chart-bars">
                      {analyticsData.labels.map((month, idx) => (
                        <div key={idx} className="chart-bar-group">
                          <div className="chart-label">{month}</div>
                          <div 
                            className="chart-bar chart-bar-patients" 
                            style={{height: `${analyticsData.datasets[0].data[idx]/3}px`}}
                            title={`Patients: ${analyticsData.datasets[0].data[idx]}`}
                          ></div>
                          <div 
                            className="chart-bar chart-bar-staff" 
                            style={{height: `${analyticsData.datasets[1].data[idx]}px`}}
                            title={`Staff: ${analyticsData.datasets[1].data[idx]}`}
                          ></div>
                        </div>
                      ))}
                    </div>
                    <div className="chart-legend">
                      <div className="legend-item">
                        <span className="legend-color legend-patients"></span>
                        <span>Patients</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color legend-staff"></span>
                        <span>Staff</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
            
            {/* Recent Activity */}
            <section className="activity-section">
              <div className="section-header">
                <h2 className="section-title">Recent Activity</h2>
                <Link to="/admin/activity" className="view-all">View All</Link>
              </div>
              
              <div className="activity-list">
                {loading ? (
                  Array(4).fill().map((_, idx) => (
                    <div key={idx} className="activity-item skeleton-loader">
                      <div className="skeleton-circle"></div>
                      <div className="skeleton-lines">
                        <div className="skeleton-text-lg"></div>
                        <div className="skeleton-text-sm"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  recentActivity.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-avatar">
                        <User size={18} />
                      </div>
                      <div className="activity-details">
                        <p className="activity-user">{activity.user}</p>
                        <p className="activity-action">{activity.action}</p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
          
          {/* Department Status */}
          <section className="departments-section">
            <div className="section-header">
              <h2 className="section-title">Department Status</h2>
              <Link to="/admin/departments" className="btn-primary">Manage Departments</Link>
            </div>

          <section className="pending-registrations-section">
          <h2 className="section-title">Pending Registrations</h2>
          <div className="pending-registrations-list">
            {pendingRegistrations.map(reg => (
              <div key={reg.id} className="pending-registration-item">
                <div className="registration-details">
                  <p><strong>Name:</strong> {reg.full_name}</p>
                  <p><strong>Email:</strong> {reg.email}</p>
                  <p><strong>Role:</strong> {reg.role}</p>
                  <p><strong>Department:</strong> {reg.department}</p>
                  <p><strong>Specialization:</strong> {reg.specialization}</p>
                  <p><strong>License Number:</strong> {reg.license_number}</p>
                  
                </div>
                <div className="registration-actions">
                  <button onClick={() => handleApprove(reg.id)} className="btn-approve">Approve</button>
                  <button onClick={() => handleReject(reg.id)} className="btn-reject">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </section>
            
            <div className="departments-grid">
              {loading ? (
                Array(3).fill().map((_, idx) => (
                  <div key={idx} className="department-card skeleton-loader">
                    <div className="skeleton-text-lg"></div>
                    <div className="skeleton-text-sm"></div>
                    <div className="skeleton-progress"></div>
                  </div>
                ))
              ) : (
                <>
                  <div className="department-card">
                    <h3>Emergency</h3>
                    <div className="department-stats">
                      <div>Staff: 24</div>
                      <div>Capacity: 92%</div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: "92%"}}></div>
                    </div>
                  </div>
                  
                  <div className="department-card">
                    <h3>Cardiology</h3>
                    <div className="department-stats">
                      <div>Staff: 18</div>
                      <div>Capacity: 74%</div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: "74%"}}></div>
                    </div>
                  </div>
                  
                  <div className="department-card">
                    <h3>Pediatrics</h3>
                    <div className="department-stats">
                      <div>Staff: 15</div>
                      <div>Capacity: 63%</div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: "63%"}}></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;