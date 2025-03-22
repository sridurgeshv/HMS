import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [activeSidebar, setActiveSidebar] = useState(true);
  const [statsData, setStatsData] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0); // Initialize to 0
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [patients, setPatients] = useState([]);
  const [adminData, setAdminData] = useState({ fullName: '', role: '' });

  // Track IDs of users that have already triggered a notification
  const [notifiedUsers, setNotifiedUsers] = useState(new Set());

  // Fetch pending registrations
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

  // Fetch users, doctors, nurses, and patients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, doctorsResponse, nursesResponse, patientsResponse] = await Promise.all([
          axios.get('http://localhost:8000/users/'),
          axios.get('http://localhost:8000/doctors/'),
          axios.get('http://localhost:8000/nurses/'),
          axios.get('http://localhost:8000/patients/')
        ]);

        setUsers(usersResponse.data);
        setDoctors(doctorsResponse.data);
        setNurses(nursesResponse.data);
        setPatients(patientsResponse.data);

        // Update stats data
        setStatsData([
          { id: 1, title: 'Total Users', count: usersResponse.data.length, growth: '+12%', icon: <Users className="stats-card-icon" /> },
          { id: 2, title: 'Patients', count: patientsResponse.data.length, growth: '+8%', icon: <User className="stats-card-icon" /> },
          { id: 3, title: 'Doctors', count: doctorsResponse.data.length, growth: '+5%', icon: <Activity className="stats-card-icon" /> },
          { id: 4, title: 'Nurses', count: nursesResponse.data.length, growth: '+18%', icon: <Grid className="stats-card-icon" /> }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch admin profile data
  useEffect(() => {
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
  }, []);

  // Detect new users and update notification count
  useEffect(() => {
    if (users.length > 0) {
      users.forEach(user => {
        if (!notifiedUsers.has(user.id)) {
          setNotificationCount(prevCount => prevCount + 1);
          setNotifiedUsers(prev => new Set(prev).add(user.id));
        }
      });
    }
  }, [users, notifiedUsers]);

  // Handle approve/reject registration
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

  // Handle logout - Implemented from PatientDashboard
  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('admin_id');
    navigate('/');
  };

  // Set current time and date
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter recent users (e.g., users who joined in the last 7 days)
  const getRecentUsers = () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7)).toISOString();

    return users
      .filter(user => new Date(user.created_at) >= new Date(sevenDaysAgo))
      .map(user => ({
        id: user.id,
        user: user.full_name,
        action: `Joined as ${user.role}`,
        time: `Joined on ${new Date(user.created_at).toLocaleDateString()}`
      }));
  };

  // Recent activity data (recently joined users)
  const recentActivity = getRecentUsers();

  // Analytics data for the chart 
  const analyticsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Patients',
        data: [100, 120, 150, 180, 200, 220]
      },
      {
        label: 'Doctors',
        data: [30, 40, 45, 50, 55, 60]
      },
      {
        label: 'Nurses',
        data: [20, 25, 30, 35, 40, 45]
      }
    ]
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
                <p className="admin-name">{adminData.fullName}</p>
                <p className="admin-role">{adminData.role}</p>
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
                            className="chart-bar chart-bar-doctors" 
                            style={{height: `${analyticsData.datasets[1].data[idx]}px`}}
                            title={`Doctors: ${analyticsData.datasets[1].data[idx]}`}
                          ></div>
                          <div 
                            className="chart-bar chart-bar-nurses" 
                            style={{height: `${analyticsData.datasets[2].data[idx]}px`}}
                            title={`Nurses: ${analyticsData.datasets[2].data[idx]}`}
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
                        <span className="legend-color legend-doctors"></span>
                        <span>Doctors</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color legend-nurses"></span>
                        <span>Nurses</span>
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
                ) : recentActivity.length > 0 ? (
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
                ) : (
                  <div className="no-recent-activity">
                    No recent activity found.
                  </div>
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