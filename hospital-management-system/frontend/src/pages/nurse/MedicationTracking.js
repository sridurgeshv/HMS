import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, User, Clipboard, FileText, Bell, Package, Settings } from 'lucide-react';
import './Dashboard.css';

const MedicationTracking = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);
  const [medications, setMedications] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({}); // Track selected status for each medication
  const location = useLocation();
  const [nurseInfo, setNurseInfo] = useState({ name: "", department: "" , title:"" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch all medications from the backend
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await fetch('http://localhost:8000/medications');
        if (!response.ok) {
          throw new Error('Failed to fetch medications');
        }
        const data = await response.json();
        setMedications(data);
      } catch (error) {
        console.error('Error fetching medications:', error);
      }
    };

    fetchMedications();
  }, []);

  useEffect(() => {
      const fetchNurseDetails = async () => {
        const nurseId = localStorage.getItem('nurse_id');
        if (!nurseId) {
          console.error("Nurse ID not found in local storage");
          setLoading(false);
          return;
        }
  
        try {
          const response = await fetch(`http://localhost:8000/nurse/${nurseId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch nurse details");
          }
          const data = await response.json();
          setNurseInfo(data);
        } catch (error) {
          console.error("Error fetching nurse details:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchNurseDetails();
    }, []);
  

  // Update medication status
  const handleStatusChange = async (medicationId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/medications/${medicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),  // Send the status in the correct format
      });
  
      if (!response.ok) {
        throw new Error('Failed to update medication status');
      }
  
      const updatedMedication = await response.json();
      setMedications((prevMedications) =>
        prevMedications.map((med) =>
          med.id === updatedMedication.medication.id ? updatedMedication.medication : med
        )
      );
    } catch (error) {
      console.error('Error updating medication status:', error);
    }
  };

  // Calculate summary data
  const totalMedications = medications.length;
  const completedMedications = medications.filter((med) => med.status === 'Completed').length;
  const uniquePatients = new Set(medications.map((med) => med.patient_id)).size;

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="avatar">JS</div>
          <div className="user-info">
          <h2>{nurseInfo.name}, {nurseInfo.title}</h2>
          <p>{nurseInfo.department} | {nurseInfo.floor}</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <Link to="/nurse/dashboard" className={location.pathname === "/nurse/dashboard" ? "active" : ""}>
            <Clipboard size={18} /> Dashboard
          </Link>
          <Link to="/nurse/patient-notes" className={location.pathname === "/nurse/patient-notes" ? "active" : ""}>
            <FileText size={18} /> Patient Notes
          </Link>
          <Link to="/nurse/doctor-assignments" className={location.pathname === "/nurse/doctor-assignments" ? "active" : ""}>
            <User size={18} /> Doctor Assignments
          </Link>
          <Link to="/nurse/medication-tracking" className={location.pathname === "/nurse/medication-tracking" ? "active" : ""}>
            <Package size={18} /> Medication Tracking
          </Link>
          <Link to="/nurse/profile" className={location.pathname === "/nurse/profile" ? "active" : ""}>
            <Settings size={18} /> Profile
          </Link>
        </nav>
      </div>

      <div className="main-content">
        <header className="main-header">
          <div className="header-left">
            <h1>Medication Tracking</h1>
            <div className="date-time">
              <span className="date"><Calendar size={16} /> {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="time"><Clock size={16} /> {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <div className="header-right">
            <div className="notification-bell">
              <Bell size={20} />
              {notifications > 0 && <span className="notification-badge">{notifications}</span>}
            </div>
          </div>
        </header>

        <div className="content-area">
          <div className="medications-container">
            <div className="section-header">
              <h2><Package size={20} /> Medication Schedule</h2>
            </div>
            <table className="medications-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Medication</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {medications.map((med) => (
                  <tr key={med.id} className={`med-row ${med.status.toLowerCase()}`}>
                    <td>{med.patient_id}</td>
                    <td>{med.name}</td>
                    <td>{med.dosage}</td>
                    <td>{med.frequency}</td>
                    <td>
                      <select
                        value={selectedStatus[med.id] || med.status}
                        onChange={(e) => {
                          setSelectedStatus({ ...selectedStatus, [med.id]: e.target.value });
                          handleStatusChange(med.id, e.target.value);
                        }}
                        className="status-dropdown"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="view-details-btn"
                        onClick={() => {
                          // Add functionality to view details if needed
                        }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="dashboard-summary">
            <div className="summary-card">
              <div className="summary-icon medication-icon">
                <Package size={20} />
              </div>
              <div className="summary-content">
                <h3>Medications</h3>
                <p className="summary-number">{totalMedications}</p>
                <p className="summary-text">{completedMedications} completed</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon patient-icon">
                <User size={20} />
              </div>
              <div className="summary-content">
                <h3>Patients</h3>
                <p className="summary-number">{uniquePatients}</p>
                <p className="summary-text">With medications</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationTracking;