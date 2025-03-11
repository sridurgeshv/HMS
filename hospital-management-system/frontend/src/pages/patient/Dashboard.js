import React, { useState, useEffect } from 'react';
import { Calendar, FileText, User, Pill, Activity, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/appointments')) return 'appointments';
    if (path.includes('/medical-history')) return 'medical-history';
    if (path.includes('/medications')) return 'medications';
    if (path.includes('/profile')) return 'profile';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  // Mock data
  const stats = [
    { title: "Upcoming Appointments", value: "2", icon: <Calendar size={24} /> },
    { title: "Medications", value: "3", icon: <Pill size={24} /> },
    { title: "Recent Reports", value: "1", icon: <FileText size={24} /> }
  ];

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="pulse-loader"></div>
        <p>Loading your health information...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="logo">CuraSphere</h2>
        </div>
        <div className="sidebar-content">
          <div className="user-profile">
            <div className="avatar">JD</div>
            <div className="user-info">
              <h3>John Doe</h3>
              <p>Patient ID: 12345678</p>
            </div>
          </div>
          <nav className="sidebar-menu">
            <Link 
              to="/patient/dashboard" 
              className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            >
              <Activity size={20} />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/patient/appointments" 
              className={`menu-item ${activeTab === 'appointments' ? 'active' : ''}`}
            >
              <Calendar size={20} />
              <span>Appointments</span>
            </Link>
            <Link 
              to="/patient/medical-history" 
              className={`menu-item ${activeTab === 'medical-history' ? 'active' : ''}`}
            >
              <FileText size={20} />
              <span>Medical History</span>
            </Link>
            <Link 
              to="/patient/medications" 
              className={`menu-item ${activeTab === 'medications' ? 'active' : ''}`}
            >
              <Pill size={20} />
              <span>Medications</span>
            </Link>
            <Link 
              to="/patient/profile" 
              className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
            >
              <User size={20} />
              <span>Profile</span>
            </Link>
          </nav>
        </div>
      </div>

      <main className="dashboard-main">
        <header className="main-header">
          <h1>Patient Dashboard</h1>
          <div className="header-actions">
            <div className="notification-bell">
              <span className="notification-dot"></span>
              <Bell size={24} />
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {activeTab === 'dashboard' && (
            <div className="tab-content dashboard-home fade-in">
              <div className="content-header">
                <h2><Activity size={20} /> Health Overview</h2>
              </div>
              
              <div className="stats-cards">
                {stats.map((stat, index) => (
                  <div className="stat-card" key={index}>
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-details">
                      <h3>{stat.title}</h3>
                      <p className="stat-value">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="health-vitals mt-30">
                <h3>Health Vitals</h3>
                <div className="vitals-cards">
                  <div className="vital-card">
                    <Activity size={20} />
                    <h4>Heart Rate</h4>
                    <div className="vital-reading">72 <span>bpm</span></div>
                    <div className="vital-chart"></div>
                  </div>
                  <div className="vital-card">
                    <Activity size={20} />
                    <h4>Blood Pressure</h4>
                    <div className="vital-reading">120/80 <span>mmHg</span></div>
                    <div className="vital-chart"></div>
                  </div>
                  <div className="vital-card">
                    <Activity size={20} />
                    <h4>Blood Sugar</h4>
                    <div className="vital-reading">110 <span>mg/dL</span></div>
                    <div className="vital-chart"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;