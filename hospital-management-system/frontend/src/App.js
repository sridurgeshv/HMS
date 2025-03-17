import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
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

import { PatientContext, PatientProvider } from "./PatientContext";
import { UserContext, UserProvider } from "./UserContext";

import UserManagement from './pages/admin/Users';
import AdminDepartments from './pages/admin/Departments';
import AdminProfile from './pages/admin/AdminProfile';

// Protected Route Components
const ProtectedPatientRoute = ({ children }) => {
  const { patientId } = useContext(PatientContext);
  
  if (!patientId) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const ProtectedDoctorRoute = ({ children }) => {
  const { username } = useContext(UserContext);
  const doctorId = localStorage.getItem('doctor_id');
  
  if (!username || !doctorId) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const ProtectedNurseRoute = ({ children }) => {
  const { username } = useContext(UserContext);
  const role = localStorage.getItem('role') === 'nurse';
  
  if (!username || !role) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const ProtectedAdminRoute = ({ children }) => {
  const { username } = useContext(UserContext);
  const role = localStorage.getItem('role') === 'admin';
  
  if (!username || !role) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <UserProvider>
      <PatientProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Welcome />} />
              <Route path="/join" element={<RoleSelection />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register/patient" element={<PatientRegister />} />
              <Route path="/register/doctor" element={<DoctorRegister />} />
              <Route path="/register/nurse" element={<NurseRegister />} />
              <Route path="/register/admin" element={<AdminRegister />} />
              <Route path="/pending-approval" element={<PendingApproval />} />
              
              {/* Protected Patient Routes */}
              <Route path="/patient/dashboard" element={
                <ProtectedPatientRoute>
                  <PatientDashboard />
                </ProtectedPatientRoute>
              } />
              <Route path="/patient/appointments" element={
                <ProtectedPatientRoute>
                  <Appointments />
                </ProtectedPatientRoute>
              } />
              <Route path="/patient/medical-history" element={
                <ProtectedPatientRoute>
                  <MedicalHistory />
                </ProtectedPatientRoute>
              } />
              <Route path="/patient/medications" element={
                <ProtectedPatientRoute>
                  <Medications />
                </ProtectedPatientRoute>
              } />
              <Route path="/patient/profile" element={
                <ProtectedPatientRoute>
                  <Profile />
                </ProtectedPatientRoute>
              } />
              
              {/* Protected Doctor Routes */}
              <Route path="/doctor/dashboard" element={
                <ProtectedDoctorRoute>
                  <DoctorDashboard />
                </ProtectedDoctorRoute>
              } />
              <Route path="/doctor/appointments" element={
                <ProtectedDoctorRoute>
                  <DoctorAppointments />
                </ProtectedDoctorRoute>
              } />
              <Route path="/doctor/medical-records" element={
                <ProtectedDoctorRoute>
                  <MedicalRecords />
                </ProtectedDoctorRoute>
              } />
              <Route path="/doctor/Patients" element={
                <ProtectedDoctorRoute>
                  <DoctorPatients />
                </ProtectedDoctorRoute>
              } />
              <Route path="/doctor/profile" element={
                <ProtectedDoctorRoute>
                  <DoctorProfile />
                </ProtectedDoctorRoute>
              } />
              
              {/* Protected Nurse Routes */}
              <Route path="/nurse/dashboard" element={
                <ProtectedNurseRoute>
                  <NurseDashboard />
                </ProtectedNurseRoute>
              } />
              <Route path="/nurse/patient-notes" element={
                <ProtectedNurseRoute>
                  <PatientNotes />
                </ProtectedNurseRoute>
              } />
              <Route path="/nurse/doctor-assignments" element={
                <ProtectedNurseRoute>
                  <DoctorAssignments />
                </ProtectedNurseRoute>
              } />
              <Route path="/nurse/medication-tracking" element={
                <ProtectedNurseRoute>
                  <MedicationTracking />
                </ProtectedNurseRoute>
              } />
              <Route path="/nurse/profile" element={
                <ProtectedNurseRoute>
                  <NurseProfile />
                </ProtectedNurseRoute>
              } />

 {/* Admin Routes */}          
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/departments" element={<AdminDepartments />} />
          <Route path="/admin/profile" element={<AdminProfile />} /> 
        </Routes>
       </div>
      </Router>
    </PatientProvider>
   </UserProvider>
  );
}

export default App;