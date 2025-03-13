import React, { useState, useEffect , useContext } from 'react';
import { Calendar, Clock, PlusCircle } from 'lucide-react';
import axios from 'axios';
import { PatientContext } from "../../PatientContext";

const Appointments = () => {
  const { patientId } = useContext(PatientContext);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    if (patientId) {
      fetchAppointments();
    }
  }, [patientId]);

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
    } finally {
      setIsLoading(false);
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
      fetchAppointments(); // Refresh the appointments list
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

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="pulse-loader"></div>
        <p>Loading your health information...</p>
      </div>
    );
  }

  return (
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
  );
};

export default Appointments;