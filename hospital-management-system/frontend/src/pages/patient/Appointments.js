import React from 'react';
import { Calendar, Clock, PlusCircle } from 'lucide-react';
import Dashboard from './Dashboard.css';

const Appointments = () => {
  // Mock data
  const upcomingAppointments = [
    { id: 1, doctor: "Dr. Sarah Wilson", specialty: "Cardiology", date: "2025-03-10", time: "10:00 AM" },
    { id: 2, doctor: "Dr. Michael Chen", specialty: "Dermatology", date: "2025-03-15", time: "2:30 PM" }
  ];

  return (
    <Dashboard>
      <div className="tab-content appointments fade-in">
        <div className="content-header">
          <h2><Calendar size={20} /> Upcoming Appointments</h2>
          <button className="action-button"><PlusCircle size={16} /> Book Appointment</button>
        </div>
        
        <div className="appointment-cards">
          {upcomingAppointments.map(appointment => (
            <div className="appointment-card" key={appointment.id}>
              <div className="appointment-date">
                <div className="month">{new Date(appointment.date).toLocaleString('default', { month: 'short' })}</div>
                <div className="day">{new Date(appointment.date).getDate()}</div>
              </div>
              <div className="appointment-details">
                <h3>{appointment.doctor}</h3>
                <p className="specialty">{appointment.specialty}</p>
                <p className="time"><Clock size={14} /> {appointment.time}</p>
              </div>
              <div className="appointment-actions">
                <button className="btn-reschedule">Reschedule</button>
                <button className="btn-cancel">Cancel</button>
              </div>
            </div>
          ))}
        </div>

        <div className="booking-section">
          <h3>Book New Appointment</h3>
          <form className="booking-form">
            <div className="form-row">
              <div className="form-group">
                <label>Department</label>
                <select>
                  <option>Select Department</option>
                  <option>Cardiology</option>
                  <option>Dermatology</option>
                  <option>Neurology</option>
                  <option>Orthopedics</option>
                </select>
              </div>
              <div className="form-group">
                <label>Doctor</label>
                <select>
                  <option>Select Doctor</option>
                  <option>Dr. Sarah Wilson</option>
                  <option>Dr. Michael Chen</option>
                  <option>Dr. Emily Johnson</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input type="date" />
              </div>
              <div className="form-group">
                <label>Time</label>
                <select>
                  <option>Select Time</option>
                  <option>9:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>2:00 PM</option>
                  <option>3:00 PM</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Reason for Visit</label>
              <textarea placeholder="Briefly describe your symptoms or reason for visit"></textarea>
            </div>
            <button type="button" className="submit-booking">Book Appointment</button>
          </form>
        </div>
      </div>
    </Dashboard>
  );
};

export default Appointments;