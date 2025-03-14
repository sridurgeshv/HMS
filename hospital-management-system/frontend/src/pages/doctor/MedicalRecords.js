import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Bell, 
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  Filter,
  Download,
  Upload,
  PlusCircle,
  Eye,
  FileText as FileIcon,
  FilePlus,
  Calendar as CalendarIcon
} from 'lucide-react';
import './Dashboard.css';

const MedicalRecords = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('all');
  const [selectedRecordType, setSelectedRecordType] = useState('all');
  const [isPatientFilterOpen, setIsPatientFilterOpen] = useState(false);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  
  // Sample data - in a real app, this would be fetched from an API
  const patients = [
    { id: 101, name: 'Sarah Johnson' },
    { id: 102, name: 'Michael Brown' },
    { id: 103, name: 'Emily Davis' },
    { id: 104, name: 'James Wilson' },
    { id: 105, name: 'Lisa Anderson' },
    { id: 106, name: 'Robert Taylor' }
  ];
  
  const recordTypes = [
    'Lab Results',
    'Imaging',
    'Consultation Notes',
    'Surgery Reports',
    'Prescriptions',
    'Vital Signs'
  ];
  
  const allRecords = [
    { 
      id: 1, 
      patientId: 101, 
      patientName: 'Sarah Johnson',
      type: 'Lab Results',
      title: 'Blood Work Analysis',
      date: '2025-03-01',
      createdBy: 'Dr. Jane Smith',
      size: '1.2 MB',
      status: 'Reviewed'
    },
    { 
      id: 2, 
      patientId: 101, 
      patientName: 'Sarah Johnson',
      type: 'Consultation Notes',
      title: 'Initial Consultation',
      date: '2025-02-15',
      createdBy: 'Dr. Jane Smith',
      size: '0.5 MB',
      status: 'Reviewed'
    },
    { 
      id: 3, 
      patientId: 102, 
      patientName: 'Michael Brown',
      type: 'Imaging',
      title: 'Chest X-Ray',
      date: '2025-03-03',
      createdBy: 'Dr. Robert Lee',
      size: '5.7 MB',
      status: 'Reviewed'
    },
    { 
      id: 4, 
      patientId: 102, 
      patientName: 'Michael Brown',
      type: 'Prescriptions',
      title: 'Metformin Prescription',
      date: '2025-03-03',
      createdBy: 'Dr. Jane Smith',
      size: '0.3 MB',
      status: 'Current'
    },
    { 
      id: 5, 
      patientId: 103, 
      patientName: 'Emily Davis',
      type: 'Vital Signs',
      title: 'Routine Check-up',
      date: '2025-02-28',
      createdBy: 'Nurse Emma Wilson',
      size: '0.8 MB',
      status: 'Reviewed'
    },
    { 
      id: 6, 
      patientId: 103, 
      patientName: 'Emily Davis',
      type: 'Prescriptions',
      title: 'Albuterol Prescription',
      date: '2025-02-28',
      createdBy: 'Dr. Jane Smith',
      size: '0.3 MB',
      status: 'Current'
    },
    { 
      id: 7, 
      patientId: 104, 
      patientName: 'James Wilson',
      type: 'Lab Results',
      title: 'Uric Acid Test',
      date: '2025-03-10',
      createdBy: 'Dr. Jane Smith',
      size: '1.5 MB',
      status: 'Pending Review'
    },
    { 
      id: 8, 
      patientId: 105, 
      patientName: 'Lisa Anderson',
      type: 'Consultation Notes',
      title: 'Migraine Evaluation',
      date: '2025-03-05',
      createdBy: 'Dr. Jane Smith',
      size: '0.7 MB',
      status: 'Reviewed'
    },
    { 
      id: 9, 
      patientId: 106, 
      patientName: 'Robert Taylor',
      type: 'Vital Signs',
      title: 'Blood Pressure Monitoring',
      date: '2025-02-20',
      createdBy: 'Nurse John Davis',
      size: '0.4 MB',
      status: 'Reviewed'
    }
  ];
  
  const [records, setRecords] = useState(allRecords);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Filter records by patient and type
  useEffect(() => {
    let filtered = allRecords;
    
    if (selectedPatient !== 'all') {
      const patientId = parseInt(selectedPatient);
      filtered = filtered.filter(record => record.patientId === patientId);
    }
    
    if (selectedRecordType !== 'all') {
      filtered = filtered.filter(record => record.type === selectedRecordType);
    }
    
    setRecords(filtered);
  }, [selectedPatient, selectedRecordType]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const togglePatientFilter = () => {
    setIsPatientFilterOpen(!isPatientFilterOpen);
    if (isTypeFilterOpen) setIsTypeFilterOpen(false);
  };
  
  const toggleTypeFilter = () => {
    setIsTypeFilterOpen(!isTypeFilterOpen);
    if (isPatientFilterOpen) setIsPatientFilterOpen(false);
  };
  
  const handlePatientChange = (patientId) => {
    setSelectedPatient(patientId);
    setIsPatientFilterOpen(false);
  };
  
  const handleTypeChange = (type) => {
    setSelectedRecordType(type);
    setIsTypeFilterOpen(false);
  };
  
  const getIconForRecordType = (type) => {
    switch(type) {
      case 'Lab Results':
        return <FileIcon size={16} />;
      case 'Imaging':
        return <Eye size={16} />;
      case 'Consultation Notes':
        return <FileText size={16} />;
      case 'Surgery Reports':
        return <FilePlus size={16} />;
      case 'Prescriptions':
        return <FileText size={16} />;
      case 'Vital Signs':
        return <CalendarIcon size={16} />;
      default:
        return <FileIcon size={16} />;
    }
  };
  
  const getStatusClass = (status) => {
    switch(status) {
      case 'Reviewed':
        return 'status-reviewed';
      case 'Pending Review':
        return 'status-pending';
      case 'Current':
        return 'status-current';
      default:
        return '';
    }
  };
  
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
            <h3>Dr. Jane Smith</h3>
            <p>Cardiologist</p>
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
          <Link to="/doctor/patients" className="nav-item">
            <Users size={20} />
            <span>Patients</span>
          </Link>
          <Link to="/doctor/medical-records" className="nav-item active">
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
            <input type="text" placeholder="Search records..." />
          </div>
          
          <div className="topbar-right">
            <div className="current-time">
              <Clock size={18} />
              <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            
            <div className="notification-bell">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </div>
          </div>
        </header>
        
        {/* Medical Records Content */}
        <div className="dashboard-content">
          <div className="records-header">
            <h1>Medical Records</h1>
            
            <div className="records-actions">
              <div className="filter-dropdown">
                <button className="filter-button" onClick={togglePatientFilter}>
                  <Users size={16} />
                  <span>Patient: {selectedPatient === 'all' ? 'All Patients' : patients.find(p => p.id === parseInt(selectedPatient))?.name}</span>
                  <ChevronDown size={16} />
                </button>
                
                {isPatientFilterOpen && (
                  <div className="filter-options">
                    <button 
                      className={selectedPatient === 'all' ? 'active' : ''} 
                      onClick={() => handlePatientChange('all')}
                    >
                      All Patients
                    </button>
                    {patients.map(patient => (
                      <button 
                        key={patient.id}
                        className={selectedPatient === patient.id.toString() ? 'active' : ''} 
                        onClick={() => handlePatientChange(patient.id.toString())}
                      >
                        {patient.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="filter-dropdown">
                <button className="filter-button" onClick={toggleTypeFilter}>
                  <Filter size={16} />
                  <span>Type: {selectedRecordType === 'all' ? 'All Types' : selectedRecordType}</span>
                  <ChevronDown size={16} />
                </button>
                
                {isTypeFilterOpen && (
                  <div className="filter-options">
                    <button 
                      className={selectedRecordType === 'all' ? 'active' : ''} 
                      onClick={() => handleTypeChange('all')}
                    >
                      All Types
                    </button>
                    {recordTypes.map(type => (
                      <button 
                        key={type}
                        className={selectedRecordType === type ? 'active' : ''} 
                        onClick={() => handleTypeChange(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button className="upload-record-btn">
                <Upload size={16} />
                <span>Upload</span>
              </button>
              
              <button className="add-record-btn">
                <PlusCircle size={16} />
                <span>New Record</span>
              </button>
            </div>
          </div>
          
          {records.length > 0 ? (
            <div className="records-table-container">
              <table className="records-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Created By</th>
                    <th>Size</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(record => (
                    <tr key={record.id}>
                      <td className="record-type">
                        <div className="type-icon">
                          {getIconForRecordType(record.type)}
                        </div>
                        <span>{record.type}</span>
                      </td>
                      <td>{record.title}</td>
                      <td>{record.patientName}</td>
                      <td>{formatDate(record.date)}</td>
                      <td>{record.createdBy}</td>
                      <td>{record.size}</td>
                      <td>
                        <span className={`record-status ${getStatusClass(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="record-actions">
                        <button className="action-btn view-record">
                          <Eye size={16} />
                        </button>
                        <button className="action-btn download-record">
                          <Download size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-records">
              <p>No medical records found with the selected filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MedicalRecords;