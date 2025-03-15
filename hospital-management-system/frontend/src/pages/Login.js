import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/Login.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient', // Default role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login/', formData);
      const { role, status, patient_id, username } = response.data;
  
      // Only block login if the user is a doctor or nurse with pending status
      if ((role === "doctor" || role === "nurse") && status !== "approved") {
        alert("Your account is still pending approval.");
        return;
      }
  
      // Store patient_id in local storage if the user is a patient
      if (role === "patient" && patient_id) {
        localStorage.setItem('patient_id', patient_id);
        console.log("Stored patient_id:", patient_id);
      }

      localStorage.setItem('username', username);
      console.log("Stored username:", username);
  
      // Store username in local storage for all users
      if (username) {
        localStorage.setItem('username', username);
        console.log("Stored username:", username);
      }
  
      alert("Login successful!");
      
      // Redirect based on role
      switch (role) {
        case 'patient':
          navigate('/patient/dashboard');
          break;
        case 'doctor':
          navigate('/dashboard/doctor');
          break;
        case 'nurse':
          navigate('/dashboard/nurse');
          break;
        case 'admin':
          navigate('/dashboard/admin');
          break;
        default:
          navigate('/'); // Default fallback
      }
    } catch (error) {
      alert(error.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="curasphere-login-page">
      <div className="curasphere-login-container">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="curasphere-login-card"
        >
          <h2 className="curasphere-login-title">Login</h2>
          <p className="curasphere-login-subtitle">Access your CuraSphere account</p>

          <form onSubmit={handleSubmit} className="curasphere-login-form">
            <div className="curasphere-input-group">
              <Mail className="curasphere-input-icon" />
              <input 
                type="email" 
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required 
                className="curasphere-input"
              />
            </div>

            <div className="curasphere-input-group">
              <Lock className="curasphere-input-icon" />
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required 
                className="curasphere-input"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="curasphere-password-toggle"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="curasphere-input-group">
              <select 
                name="role"
                value={formData.role}
                onChange={handleChange}
                required 
                className="curasphere-input"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="curasphere-login-button"
            >
              Login
            </motion.button>
          </form>

          <div className="curasphere-login-footer">
            <p>Don't have an account? <a href="/join" className="curasphere-register-link">Sign Up</a></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
