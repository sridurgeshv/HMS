import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { User, Mail, Lock, Eye, EyeOff, Calendar, Phone, MapPin, Award, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../../styles/Register.css';

const NurseRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    licenseNumber: '',
    department: '',
    hospital: '',
    experience: '',
    role: 'nurse'
  });

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
      date_of_birth: formData.dateOfBirth,
      phone: formData.phone,
      address: formData.address,
      license_number: formData.licenseNumber,
      department: formData.department,
      hospital: formData.hospital,
      experience: formData.experience,
      role: "nurse"
    };
  
    try {
      const response = await axios.post(`http://localhost:8000/nursesignup/`, payload);
      alert(response.data.message);
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
          <h2 className="curasphere-register-title">Nurse Registration</h2>
          <p className="curasphere-register-subtitle">Create your nurse account</p>
          
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
              <Award className="curasphere-input-icon" />
              <input 
                type="text" 
                name="licenseNumber"
                placeholder="Nursing License Number"
                value={formData.licenseNumber}
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
              <Building className="curasphere-input-icon" />
              <input 
                type="text" 
                name="hospital"
                placeholder="Hospital/Clinic"
                value={formData.hospital}
                onChange={handleChange}
                required 
                className="curasphere-input"
              />
            </div>

            <div className="curasphere-input-group">
              <Calendar className="curasphere-input-icon" />
              <input 
                type="number" 
                name="experience"
                placeholder="Years of Experience"
                value={formData.experience}
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
              <MapPin className="curasphere-input-icon" />
              <input 
                type="text" 
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required 
                className="curasphere-input"
              />
            </div>

            <div className="curasphere-input-group">
              <Calendar className="curasphere-input-icon" />
              <input 
                type="date" 
                name="dateOfBirth"
                placeholder="Date of Birth"
                value={formData.dateOfBirth}
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
              Register as Nurse
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

export default NurseRegister;