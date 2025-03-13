import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Clock, PlusCircle, Activity, FileText, User, Pill, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { PatientContext } from "../../PatientContext";
import './Dashboard.css';

const Appointments = () => {
  const { patientId } = useContext(PatientContext);
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
  
  // Assuming username is stored in local storage after signup
  const username = localStorage.getItem("username");

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
    console.log("Fetching doctors for department:", department); // Debugging
    try {
      const response = await axios.get(`http://localhost:8000/doctors/${department}`);
      console.log("Doctors fetched:", response.data); // Debugging
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
      patient_id: patientId, // Use the logged-in patient's ID
      department: formData.department,
      doctor_name: formData.doctor && formData.doctor !== "no-doctor" ? formData.doctor : null,  // Ensure null is sent
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
            <div className="avatar">{profile ? profile.full_name[0] : username ? username[0] : "JD"}</div>
            <div className="user-info">
              <h3>{profile ? profile.full_name : "John Doe"}</h3>
              <p>Patient ID: {profile ? profile.patient_id : patientId || "12345678"}</p>
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
          <h1>Appointments</h1>
          <div className="header-actions">
            <div className="notification-bell">
              <span className="notification-dot"></span>
              <Bell size={24} />
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="tab-content appointments fade-in">
            <div className="content-header">
              <h2><Calendar size={20} /> Upcoming Appointments</h2>
              <button className="action-button"><PlusCircle size={16} /> Book Appointment</button>
            </div>
            
            <div className="appointment-cards">
              {Array.isArray(appointments) && appointments.length > 0 ? (
                appointments.map(appointment => (
                  <div className="appointment-card" key={appointment.id}>
                    <div className="appointment-date">
                      <div className="month">{new Date(appointment.date).toLocaleString('default', { month: 'short' })}</div>
                      <div className="day">{new Date(appointment.date).getDate()}</div>
                    </div>
                    <div className="appointment-details">
                      <h3>{appointment.doctor_name || "Doctor will be assigned"}</h3>
                      <p className="specialty">{appointment.department}</p>
                      <p className="time"><Clock size={14} /> {appointment.time}</p>
                    </div>
                    <div className="appointment-actions">
                      <button className="btn-cancel" onClick={() => handleCancelAppointment(appointment.id)}>
                        Cancel Appointment
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No appointments found.</p>
              )}
            </div>

            <div className="booking-section">
              <h3>Book New Appointment</h3>
              <form className="booking-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Department</label>
                    <select name="department" value={formData.department} onChange={handleDepartmentChange} required>
                      <option value="">Select Department</option>
                      {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
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
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Time</label>
                    <input type="time" name="time" value={formData.time} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Reason for Visit</label>
                  <textarea name="reason" value={formData.reason} onChange={handleInputChange} required></textarea>
                </div>
                <button type="submit" className="submit-booking">Book Appointment</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Appointments;