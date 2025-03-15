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
import DoctorAppointments from './pages/doctor/Appointments';
import DoctorPatients from './pages/doctor/Patients';
import MedicalRecords from './pages/doctor/MedicalRecords';
import DoctorProfile from './pages/doctor/Profile';
import NurseDashboard from './pages/nurse/Dashboard';
import PatientNotes from './pages/nurse/PatientNotes';
import DoctorAssignments from './pages/nurse/DoctorAssignments';
import MedicationTracking from './pages/nurse/MedicationTracking';
import NurseProfile from './pages/nurse/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import { PatientProvider } from "./PatientContext";
import {UserProvider} from "./UserContext";

/*
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
          <Route path="/patient/dashboard" element={<PatientProvider><PatientDashboard /></PatientProvider>} />
          <Route path="/patient/appointments" element={<PatientProvider><Appointments /></PatientProvider>} />
          <Route path="/patient/medical-history" element={<PatientProvider><MedicalHistory /></PatientProvider>} />
          <Route path="/patient/medications" element={<PatientProvider><Medications /></PatientProvider>} />
          <Route path="/patient/profile" element={<PatientProvider><UserProvider><Profile /></UserProvider></PatientProvider>} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/medical-records" element={<MedicalRecords />} />
          <Route path="/doctor/Patients" element={<DoctorPatients />} />
          <Route path="/doctor/profile" element={<DoctorProfile />} />
          <Route path="/nurse/dashboard" element={<NurseDashboard />} />
          <Route path="/nurse/patient-notes" element={<PatientNotes />} />
          <Route path="/nurse/doctor-assignments" element={<DoctorAssignments />} />
          <Route path="/nurse/medication-tracking" element={<MedicationTracking />} />
          <Route path="/nurse/profile" element={<NurseProfile />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
{/*}                           
          
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