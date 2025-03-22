import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { User, Mail, Lock, Eye, EyeOff, Phone, Building, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Register.css';

const AdminRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    department: '',
    adminCode: '',
    role: 'admin'
  });

  const navigate = useNavigate(); // Initialize useNavigate

  // Function to generate a random Admin Code
  const generateAdminCode = () => {
    return `ADMIN-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  };

  // Generate an admin code when the component mounts
  useEffect(() => {
    const newAdminCode = generateAdminCode();
    setFormData((prev) => ({ ...prev, adminCode: newAdminCode }));
  }, []);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
  
    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      full_name: formData.fullName, 
      phone: formData.phone,
      department: formData.department,
      role: "admin", 
      admin_code: formData.adminCode, 
    };
  
    console.log("Payload being sent:", payload);
  
    try {
      const response = await axios.post(`http://localhost:8000/adminsignup/`, payload);
  
      // Generate a new admin code for the next admin
      setFormData((prev) => ({ ...prev, adminCode: generateAdminCode() }));

      localStorage.setItem('admin_id', response.data.admin_id);
      
      // Add success message
      alert(`Registration successful! Your Admin ID: ${response.data.admin_id}`);
      
      // Redirect to login page after successful registration
      navigate('/login');

    } catch (error) {
      alert(error.response?.data?.detail || "Error signing up");
    }
  };

  return (
    <div className="curasphere-register-page">
      <div className="curasphere-register-container">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="curasphere-register-card"
        >
          <h2 className="curasphere-register-title">Admin Registration</h2>
          <p className="curasphere-register-subtitle">Create administrative account</p>
          
          <form onSubmit={handleSubmit} className="curasphere-register-form">
            <div className="curasphere-input-group">
              <User className="curasphere-input-icon" />
              <input 
                type="text" 
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required 
                className="curasphere-input"
              />
            </div>

            <div className="curasphere-input-group">
              <User className="curasphere-input-icon" />
              <input 
                type="text" 
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required 
                className="curasphere-input"
              />
            </div>

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
              <Phone className="curasphere-input-icon" />
              <input 
                type="tel" 
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required 
                className="curasphere-input"
              />
            </div>

            <div className="curasphere-input-group">
              <Building className="curasphere-input-icon" />
              <input 
                type="text" 
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                required 
                className="curasphere-input"
              />
            </div>

            <div className="curasphere-input-group">
              <Shield className="curasphere-input-icon" />
              <input 
                type="text" 
                name="adminCode"
                placeholder="Admin Authorization Code"
                value={formData.adminCode}
                readOnly
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
              <Lock className="curasphere-input-icon" />
              <input 
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
                className="curasphere-input"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="curasphere-password-toggle"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="curasphere-register-button"
            >
              Register as Admin
            </motion.button>
          </form>

          <div className="curasphere-register-footer">
            <p>Already have an account? <Link to="/login" className="curasphere-login-link">Login</Link></p>
            <p>Want a different role? <Link to="/join" className="curasphere-login-link">Go Back</Link></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminRegister;