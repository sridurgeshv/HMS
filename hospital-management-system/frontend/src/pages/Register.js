import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import '../styles/Register.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Add registration logic here
    console.log("Registration Data:", formData);
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
          <h2 className="curasphere-register-title">Patient Signup</h2>
          <p className="curasphere-register-subtitle">Create your CuraSphere account</p>
          
          <form onSubmit={handleSubmit} className="curasphere-register-form">
            <div className="curasphere-input-group">
              <User className="curasphere-input-icon" />
              <input 
                type="text" 
                name="name"
                placeholder="Full Name"
                value={formData.name}
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
              Sign Up
            </motion.button>
          </form>

          <div className="curasphere-register-footer">
            <p>Already have an account? <a href="#login" className="curasphere-login-link">Login</a></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;