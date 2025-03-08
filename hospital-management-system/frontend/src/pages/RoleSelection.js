import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/RoleSelection.css';

// Import images
import patientImg from '../assets/patient.JPG';
import doctorImg from '../assets/doctor.JPG';
import nurseImg from '../assets/nurse.JPG';
import adminImg from '../assets/admin.png';

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    { id: 'patient', title: 'Patient', image: patientImg, path: '/register/patient' },
    { id: 'doctor', title: 'Doctor', image: doctorImg, path: '/register/doctor' },
    { id: 'nurse', title: 'Nurse', image: nurseImg, path: '/register/nurse' },
    { id: 'admin', title: 'Admin', image: adminImg, path: '/register/admin' }
  ];

  const handleRoleSelect = (path) => {
    navigate(path);
  };

  return (
    <div className="role-selection-container">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="role-selection-header"
      >
        <h1>Join CuraSphere</h1>
        <p>Select your role to get started</p>
      </motion.div>

      <div className="role-cards-container">
        {roles.map((role) => (
          <motion.div
            key={role.id}
            className="role-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: roles.indexOf(role) * 0.1 }}
            onClick={() => handleRoleSelect(role.path)}
          >
            <div className="role-image-container">
              <img src={role.image} alt={role.title} className="role-image" />
            </div>
            <h2>{role.title}</h2>
            <button className="select-role-btn">Select</button>
          </motion.div>
        ))}
      </div>

      <div className="role-selection-footer">
        <p>Already have an account? <a href="/login">Log In</a></p>
      </div>
    </div>
  );
};

export default RoleSelection;