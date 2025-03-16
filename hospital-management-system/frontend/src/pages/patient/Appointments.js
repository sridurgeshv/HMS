import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Clock, PlusCircle, Activity, FileText, User, Pill, Bell, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PatientContext } from "../../PatientContext";
import { UserContext } from "../../UserContext";
import './Dashboard.css';

const Appointments = () => {
  const context = useContext(PatientContext);
  const userContext = useContext(UserContext);
  const { username } = userContext || {};
  const patientId = context?.patientId || null;
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [departments] = useState(["Cardiology", "Dermatology", "Neurology", "Orthopedics"]);
  const [doctors, setDoctors] = useState([]);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    department: '',
    doctor: '',
    date: '',
    time: '',
    reason: ''
  });
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadData = async () => {
      if (patientId) {
        await fetchAppointments();
      }
      
      if (username) {
        await fetchProfile();
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, [patientId, username]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8000/user-profile/${username}`);
      if (!response.ok) throw new Error("Failed to fetch profile data");
      
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/appointments/${patientId}`);
  
      // Ensure appointments is always an array
      if (Array.isArray(response.data)) {
        setAppointments(response.data);
      } else {
        setAppointments([]); // Set empty array if response is invalid
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]); // Set empty array on error
    }
  };

  const fetchDoctors = async (department) => {
    console.log("Fetching doctors for department:", department);
    try {
      const response = await axios.get(`http://localhost:8000/doctors/${department}`);
      console.log("Doctors fetched:", response.data);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleDepartmentChange = async (event) => {
    const selectedDept = event.target.value;
    setFormData(prevState => ({
      ...prevState,
      department: selectedDept,
      doctor: '' // Reset doctor selection when department changes
    }));

    await fetchDoctors(selectedDept);
  };

  const handleDoctorChange = (event) => {
    const selectedDoctor = event.target.value;
    setFormData({ ...formData, doctor: selectedDoctor });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const requestData = {
      patient_id: patientId,
      department: formData.department,
      doctor_name: formData.doctor && formData.doctor !== "no-doctor" ? formData.doctor : null,
      date: formData.date,
      time: formData.time,
      reason: formData.reason
    };
  
    try {
      const response = await axios.post('http://localhost:8000/book-appointment/', requestData);
      alert(response.data.message);
      // Redirect to dashboard to see the newly booked appointment
      window.location.href = '/patient/dashboard';
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };
  
  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:8000/cancel-appointment/${appointmentId}`);
      alert("Appointment cancelled successfully");
      fetchAppointments(); // Refresh the appointments list
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/appointments')) return 'appointments';
    if (path.includes('/medical-history')) return 'medical-history';
    if (path.includes('/medications')) return 'medications';
    if (path.includes('/profile')) return 'profile';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  const handleLogout = () => {
    // Clear all local storage items
    localStorage.removeItem('username');
    localStorage.removeItem('patient_id');
    
    // Redirect to welcome page
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="patient-loading">
        <div className="patient-loading-spinner"></div>
        <p>Loading your health information...</p>
      </div>
    );
  }

  return (
    <div className="patient-layout">
      <div className="patient-sidebar">
        <div className="patient-sidebar-brand">
          <h2 className="patient-logo">CuraSphere</h2>
        </div>
        <div className="patient-sidebar-body">
          <div className="patient-user-card">
            <div className="patient-user-avatar">{profile ? profile.full_name[0] : username ? username[0] : "JD"}</div>
            <div className="patient-user-details">
              <h3>{profile ? profile.full_name : "John Doe"}</h3>
              <p>Patient ID: {profile ? profile.patient_id : patientId || "12345678"}</p>
            </div>
          </div>
          <nav className="patient-nav">
            <Link 
              to="/patient/dashboard" 
              className={`patient-nav-item ${activeTab === 'dashboard' ? 'patient-nav-active' : ''}`}
            >
              <Activity size={20} />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/patient/appointments" 
              className={`patient-nav-item ${activeTab === 'appointments' ? 'patient-nav-active' : ''}`}
            >
              <Calendar size={20} />
              <span>Appointments</span>
            </Link>
            <Link 
              to="/patient/medical-history" 
              className={`patient-nav-item ${activeTab === 'medical-history' ? 'patient-nav-active' : ''}`}
            >
              <FileText size={20} />
              <span>Medical History</span>
            </Link>
            <Link 
              to="/patient/medications" 
              className={`patient-nav-item ${activeTab === 'medications' ? 'patient-nav-active' : ''}`}
            >
              <Pill size={20} />
              <span>Medications</span>
            </Link>
            <Link 
              to="/patient/profile" 
              className={`patient-nav-item ${activeTab === 'profile' ? 'patient-nav-active' : ''}`}
            >
              <User size={20} />
              <span>Profile</span>
            </Link>
            <Link 
              onClick={handleLogout} 
              className="patient-nav-item"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </Link>
          </nav>
        </div>
      </div>

      <main className="patient-content">
        <header className="patient-header">
          <h1>Appointments</h1>
          <div className="patient-header-controls">
            <div className="patient-notification">
              <span className="patient-notification-indicator"></span>
              <Bell size={24} />
            </div>
          </div>
        </header>

        <div className="patient-page-content">
          <div className="patient-appointments-view patient-fade-in">
            <div className="patient-section-header">
              <h2><Calendar size={20} /> Upcoming Appointments</h2>
              <button className="patient-action-button"><PlusCircle size={16} /> Book Appointment</button>
            </div>
            
            <div className="patient-appointments-list">
              {Array.isArray(appointments) && appointments.length > 0 ? (
                appointments.map(appointment => (
                  <div className="patient-appointment-card" key={appointment.id}>
                    <div className="patient-appointment-date">
                      <div className="patient-appointment-month">{new Date(appointment.date).toLocaleString('default', { month: 'short' })}</div>
                      <div className="patient-appointment-day">{new Date(appointment.date).getDate()}</div>
                    </div>
                    <div className="patient-appointment-details">
                      <h3>{appointment.doctor_name || "Doctor will be assigned"}</h3>
                      <p className="patient-appointment-dept">{appointment.department}</p>
                      <p className="patient-appointment-time"><Clock size={14} /> {appointment.time}</p>
                    </div>
                    <div className="patient-appointment-actions">
                      <button className="patient-cancel-btn" onClick={() => handleCancelAppointment(appointment.id)}>
                        Cancel Appointment
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="patient-no-data">No appointments found.</p>
              )}
            </div>

            <div className="patient-booking-section">
              <h3>Book New Appointment</h3>
              <form className="patient-booking-form" onSubmit={handleSubmit}>
                <div className="patient-form-row">
                  <div className="patient-form-group">
                    <label>Department</label>
                    <select name="department" value={formData.department} onChange={handleDepartmentChange} required>
                      <option value="">Select Department</option>
                      {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                  </div>
                  <div className="patient-form-group">
                    <label>Doctor</label>
                    <select name="doctor" value={formData.doctor} onChange={handleDoctorChange} required>
                      <option value="">Select Doctor</option>
                      {doctors.length > 0 ? (
                        doctors.map(doc => (
                          <option key={doc.username} value={doc.full_name}>{doc.full_name}</option>
                        ))
                      ) : (
                        <option value="no-doctor">No doctor available. One will be assigned.</option>
                      )}
                    </select>
                  </div>
                </div>
                <div className="patient-form-row">
                  <div className="patient-form-group">
                    <label>Date</label>
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                  </div>
                  <div className="patient-form-group">
                    <label>Time</label>
                    <input type="time" name="time" value={formData.time} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="patient-form-group">
                  <label>Reason for Visit</label>
                  <textarea name="reason" value={formData.reason} onChange={handleInputChange} required></textarea>
                </div>
                <button type="submit" className="patient-submit-booking">Book Appointment</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Appointments;