import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import './App.css';

// Import pages
import Welcome from './pages/Welcome';
import Register from './pages/Register';
import Login from './pages/Login';
import PatientDashboard from './pages/patient/Dashboard';
/*

// Patient pages
import PatientAppointments from './pages/patient/Appointments';
import PatientMedications from './pages/patient/Medications';
import PatientProfile from './pages/patient/Profile';

// Doctor pages
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorAppointments from './pages/doctor/Appointments';
import DoctorPatients from './pages/doctor/Patients';

// Nurse pages
import NurseDashboard from './pages/nurse/Dashboard';
import NurseAppointments from './pages/nurse/Appointments';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminDepartments from './pages/admin/Departments';
*/
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
{/*}          
          {/* Patient routes 
          <Route path="/patient/appointments" element={<PatientAppointments />} />
          <Route path="/patient/medications" element={<PatientMedications />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
          
          {/* Doctor routes 
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/patients" element={<DoctorPatients />} />
          
          {/* Nurse routes 
          <Route path="/nurse/dashboard" element={<NurseDashboard />} />
          <Route path="/nurse/appointments" element={<NurseAppointments />} />
          
          {/* Admin routes 
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/departments" element={<AdminDepartments />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;