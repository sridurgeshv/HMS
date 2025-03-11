import React, { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, PlusCircle, User, CreditCard, Pill, Activity, Menu, X, Bell } from 'lucide-react';
import './Dashboard.css';
import axios from 'axios';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [departments] = useState(["Cardiology", "Dermatology", "Neurology", "Orthopedics"]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    department: '',
    doctor: '',
    date: '',
    time: '',
    reason: ''
  });
  const [patientId, setPatientId] = useState(1);

  // Default appointments for UI consistency
  const defaultAppointments = [
    { id: 1, doctor_name: "Dr. Sarah Wilson", department: "Cardiology", date: "2025-03-10", time: "10:00 AM" },
    { id: 2, doctor_name: "Dr. Michael Chen", department: "Dermatology", date: "2025-03-15", time: "14:30" }
  ];

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/appointments/${patientId}`);
      
      // Ensure appointments is always an array with at least the default appointments
      if (Array.isArray(response.data) && response.data.length > 0) {
        setAppointments(response.data);
      } else {
        // If no appointments from API, use the default ones
        setAppointments(defaultAppointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // On error, use default appointments
      setAppointments(defaultAppointments);
    }
  };

  const fetchDoctors = async (department) => {
    try {
      const response = await axios.get(`http://localhost:8000/doctors/${department}`);
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
      fetchAppointments();
      setActiveTab('appointments'); // Return to appointments tab after booking
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert("Failed to book appointment. Please try again.");
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:8000/cancel-appointment/${appointmentId}`);
      alert("Appointment cancelled successfully");
      fetchAppointments(); // Refresh list after cancellation
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Failed to cancel appointment. Please try again.");
    }
  };
  
  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="pulse-loader"></div>
        <p>Loading your health information...</p>
      </div>
    );
  }

  // Mock data for other sections
  const medications = [
    { id: 1, name: "Lisinopril", dosage: "10mg", frequency: "Once daily", refill: "3 refills left" },
    { id: 2, name: "Atorvastatin", dosage: "20mg", frequency: "Once daily", refill: "2 refills left" },
    { id: 3, name: "Metformin", dosage: "500mg", frequency: "Twice daily", refill: "1 refill left" }
  ];

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
            <button 
              className={`menu-item ${activeTab === 'appointments' ? 'active' : ''}`} 
              onClick={() => setActiveTab('appointments')}
            >
              <Calendar size={20} />
              <span>Appointments</span>
            </button>
            <button 
              className={`menu-item ${activeTab === 'medical-history' ? 'active' : ''}`} 
              onClick={() => setActiveTab('medical-history')}
            >
              <FileText size={20} />
              <span>Medical History</span>
            </button>
            <button 
              className={`menu-item ${activeTab === 'medications' ? 'active' : ''}`} 
              onClick={() => setActiveTab('medications')}
            >
              <Pill size={20} />
              <span>Medications</span>
            </button>
            <button 
              className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`} 
              onClick={() => setActiveTab('profile')}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
            <button 
              className={`menu-item ${activeTab === 'billing' ? 'active' : ''}`} 
              onClick={() => setActiveTab('billing')}
            >
              <CreditCard size={20} />
              <span>Billing</span>
            </button>
          </nav>
        </div>
      </div>

      <div className={`dashboard-container ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
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
            {activeTab === 'appointments' && (
              <div className="tab-content appointments fade-in">
                <div className="content-header">
                  <h2><Calendar size={20} /> Upcoming Appointments</h2>
                  <button className="action-button" onClick={() => setActiveTab('book-appointment')}>
                    <PlusCircle size={16} /> Book Appointment
                  </button>
                </div>
                
                <div className="appointment-cards">
                  {appointments.map(appointment => (
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
                        <button className="btn-reschedule">Reschedule</button>
                        <button className="btn-cancel" onClick={() => handleCancelAppointment(appointment.id)}>Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'book-appointment' && (
              <div className="tab-content book-appointment fade-in">
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
                    <textarea name="reason" value={formData.reason} onChange={handleInputChange} placeholder="Briefly describe your symptoms or reason for visit" required></textarea>
                  </div>
                  <button type="submit" className="submit-booking">Book Appointment</button>
                </form>
              </div>
            )}

            {activeTab === 'medications' && (
              <div className="tab-content medications fade-in">
                <div className="content-header">
                  <h2><Pill size={20} /> Current Medications</h2>
                </div>
                
                <div className="medications-list">
                  {medications.map(med => (
                    <div className="medication-card" key={med.id}>
                      <div className="medication-icon">
                        <Pill size={24} />
                      </div>
                      <div className="medication-details">
                        <h3>{med.name}</h3>
                        <p className="dosage">{med.dosage} - {med.frequency}</p>
                        <p className="refill">{med.refill}</p>
                      </div>
                      <button className="btn-refill">Request Refill</button>
                    </div>
                  ))}
                </div>

                <div className="health-vitals">
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

            {activeTab === 'medical-history' && (
              <div className="tab-content medical-history fade-in">
                <div className="content-header">
                  <h2><FileText size={20} /> Medical History</h2>
                </div>
                
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-date">Feb 15, 2025</div>
                    <div className="timeline-content">
                      <h3>Annual Physical Examination</h3>
                      <p>General checkup with Dr. Wilson. All vitals normal, recommended increased physical activity.</p>
                      <button className="btn-view-details">View Details</button>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-date">Dec 10, 2024</div>
                    <div className="timeline-content">
                      <h3>Flu Vaccination</h3>
                      <p>Received seasonal flu vaccine. No adverse reactions.</p>
                      <button className="btn-view-details">View Details</button>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-date">Oct 5, 2024</div>
                    <div className="timeline-content">
                      <h3>Blood Work Results</h3>
                      <p>Cholesterol levels slightly elevated. New medication prescribed.</p>
                      <button className="btn-view-details">View Details</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="tab-content profile fade-in">
                <div className="content-header">
                  <h2><User size={20} /> Personal Profile</h2>
                  <button className="action-button">Edit Profile</button>
                </div>
                
                <div className="profile-card">
                  <div className="profile-header">
                    <div className="profile-avatar">JD</div>
                    <div className="profile-name">
                      <h3>John Doe</h3>
                      <p>Patient since: January 2020</p>
                    </div>
                  </div>
                  
                  <div className="profile-details">
                    <div className="detail-group">
                      <h4>Personal Information</h4>
                      <div className="detail-row">
                        <span className="detail-label">Date of Birth</span>
                        <span className="detail-value">05/12/1985</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Gender</span>
                        <span className="detail-value">Male</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Blood Type</span>
                        <span className="detail-value">O+</span>
                      </div>
                    </div>
                    
                    <div className="detail-group">
                      <h4>Contact Information</h4>
                      <div className="detail-row">
                        <span className="detail-label">Email</span>
                        <span className="detail-value">john.doe@example.com</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Phone</span>
                        <span className="detail-value">(555) 123-4567</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Address</span>
                        <span className="detail-value">123 Main St, Anytown, CA 91234</span>
                      </div>
                    </div>
                    
                    <div className="detail-group">
                      <h4>Emergency Contact</h4>
                      <div className="detail-row">
                        <span className="detail-label">Name</span>
                        <span className="detail-value">Jane Doe</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Relationship</span>
                        <span className="detail-value">Spouse</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Phone</span>
                        <span className="detail-value">(555) 987-6543</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="tab-content billing fade-in">
                <div className="content-header">
                  <h2><CreditCard size={20} /> Billing Information</h2>
                </div>
                
                <div className="billing-cards">
                  <div className="billing-card summary">
                    <h3>Payment Summary</h3>
                    <div className="billing-stats">
                      <div className="stat-item">
                        <span className="stat-value">$250</span>
                        <span className="stat-label">Next Payment Due</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">Mar 15</span>
                        <span className="stat-label">Due Date</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">$1,750</span>
                        <span className="stat-label">YTD Medical Expenses</span>
                      </div>
                    </div>
                    <button className="action-button">Make Payment</button>
                  </div>
                  
                  <div className="billing-card payment-methods">
                    <h3>Payment Methods</h3>
                    <div className="payment-method">
                      <div className="card-icon visa"></div>
                      <div className="card-details">
                        <p className="card-number">VISA ending in 4567</p>
                        <p className="expiry">Expires: 09/26</p>
                      </div>
                      <div className="default-badge">Default</div>
                    </div>
                    <div className="payment-method">
                      <div className="card-icon mastercard"></div>
                      <div className="card-details">
                        <p className="card-number">MASTERCARD ending in 8901</p>
                        <p className="expiry">Expires: 12/25</p>
                      </div>
                    </div>
                    <button className="add-payment-method">+ Add Payment Method</button>
                  </div>
                </div>
                
                <div className="transaction-history">
                  <h3>Payment History</h3>
                  <table className="transactions-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Feb 15, 2025</td>
                        <td>Annual Physical Examination</td>
                        <td>$150.00</td>
                        <td><span className="status paid">Paid</span></td>
                      </tr>
                      <tr>
                        <td>Jan 10, 2025</td>
                        <td>Prescription Refill - Lisinopril</td>
                        <td>$45.00</td>
                        <td><span className="status paid">Paid</span></td>
                      </tr>
                      <tr>
                        <td>Dec 28, 2024</td>
                        <td>Specialist Consultation - Cardiology</td>
                        <td>$250.00</td>
                        <td><span className="status paid">Paid</span></td>
                      </tr>
                      <tr>
                        <td>Dec 05, 2024</td>
                        <td>Blood Work Panel</td>
                        <td>$120.00</td>
                        <td><span className="status paid">Paid</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;