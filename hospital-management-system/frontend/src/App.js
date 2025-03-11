import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import './App.css';

// Import pages
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import RoleSelection from './pages/RoleSelection';
import PatientRegister from './pages/patient/PatientRegister';
import DoctorRegister from './pages/doctor/DoctorRegister';
import NurseRegister from './pages/nurse/NurseRegister';
import AdminRegister from './pages/admin/AdminRegister';
import PendingApproval from './pages/PendingApproval';
import PatientDashboard from './pages/patient/Dashboard';
import Appointments from './pages/patient/Appointments';
import MedicalHistory from './pages/patient/MedicalHistory';
import Medications from './pages/patient/Medications';
import Profile from './pages/patient/Profile';
import DoctorDashboard from './pages/doctor/Dashboard';
import NurseDashboard from './pages/nurse/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

/*
// Doctor pages

import DoctorAppointments from './pages/doctor/Appointments';
import DoctorPatients from './pages/doctor/Patients';

// Nurse pages

import NurseAppointments from './pages/nurse/Appointments';

// Admin page
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
          <Route path="/join" element={<RoleSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/patient" element={<PatientRegister />} />
          <Route path="/register/doctor" element={<DoctorRegister />} />
          <Route path="/register/nurse" element={<NurseRegister />} />
          <Route path="/register/admin" element={<AdminRegister />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/appointments" element={<Appointments />} />
          <Route path="/patient/medical-history" element={<MedicalHistory />} />
          <Route path="/patient/medications" element={<Medications />} />
          <Route path="/patient/profile" element={<Profile />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/nurse/dashboard" element={<NurseDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
{/*}                 
          {/* Doctor routes 
          
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/patients" element={<DoctorPatients />} />
          
          {/* Nurse routes 
          
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