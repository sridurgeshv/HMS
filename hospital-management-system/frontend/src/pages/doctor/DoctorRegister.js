import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { User, Mail, Lock, Eye, EyeOff, Calendar, Phone, MapPin, Award, Building , Plus, Trash } from 'lucide-react';
import { Link , useNavigate  } from 'react-router-dom';
import '../../styles/Register.css';

const DoctorRegister = () => {
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
    specialization: '',
    licenseNumber: '',
    hospital: '',
    experience: '',
    gender: '',  // Add gender field
    age:'',
    role: 'doctor',
    status: 'pending' , // Default status
    degrees: [{ degree: '', university: '', year: '' }] // Initialize with one degree
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleDegreeChange = (index, e) => {
    const newDegrees = [...formData.degrees];
    newDegrees[index][e.target.name] = e.target.value;
    setFormData({ ...formData, degrees: newDegrees });
  };

  const addDegree = () => {
    setFormData({ ...formData, degrees: [...formData.degrees, { degree: '', university: '', year: '' }] });
  };

  const removeDegree = (index) => {
    const newDegrees = [...formData.degrees];
    newDegrees.splice(index, 1);
    setFormData({ ...formData, degrees: newDegrees });
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
      specialization: formData.specialization,
      license_number: formData.licenseNumber,
      hospital: formData.hospital,
      experience: formData.experience,
      gender: formData.gender, 
      age:formData.age, 
      role: "doctor" ,
      status: "pending" , // Include status in payload
      degrees: formData.degrees
    };
  
    try {
      const response = await axios.post(`http://localhost:8000/doctorsignup/`, payload);

      localStorage.setItem('doctor_id', response.data.doctor_id);

      alert(response.data.message);
      navigate('/pending-approval'); // Redirect to pending approval page
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
          <h2 className="curasphere-register-title">Doctor Registration</h2>
          <p className="curasphere-register-subtitle">Create your doctor account</p>
          
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
              <User className="curasphere-input-icon" />
              <input
                type="text"
                name="gender"
                placeholder="Gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="curasphere-input"
              />
            </div>

             <div className="curasphere-input-group">
                          <User className="curasphere-input-icon" />
                          <input 
                            type="text" 
                            name="age"
                            placeholder="Age"
                            value={formData.age}
                            onChange={handleChange}
                            required 
                            className="curasphere-input"
                          />
                        </div>

            <div className="curasphere-input-group">
              <Award className="curasphere-input-icon" />
              <input 
                type="text" 
                name="specialization"
                placeholder="Specialization"
                value={formData.specialization}
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
                placeholder="Medical License Number"
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

            {formData.degrees.map((degree, index) => (
              <div key={index} className="curasphere-degree-group">
                <div className="curasphere-input-group">
                  <Award className="curasphere-input-icon" />
                  <input 
                    type="text" 
                    name="degree"
                    placeholder="Degree"
                    value={degree.degree}
                    onChange={(e) => handleDegreeChange(index, e)}
                    required 
                    className="curasphere-input"
                  />
                </div>

                <div className="curasphere-input-group">
                  <Building className="curasphere-input-icon" />
                  <input 
                    type="text" 
                    name="university"
                    placeholder="University"
                    value={degree.university}
                    onChange={(e) => handleDegreeChange(index, e)}
                    required 
                    className="curasphere-input"
                  />
                </div>

                <div className="curasphere-input-group">
                  <Calendar className="curasphere-input-icon" />
                  <input 
                    type="number" 
                    name="year"
                    placeholder="Year"
                    value={degree.year}
                    onChange={(e) => handleDegreeChange(index, e)}
                    required 
                    className="curasphere-input"
                  />
                </div>

                {index > 0 && (
                  <button 
                    type="button"
                    onClick={() => removeDegree(index)}
                    className="curasphere-remove-degree"
                  >
                    <Trash size={20} />
                  </button>
                )}
              </div>
            ))}

            <button 
              type="button"
              onClick={addDegree}
              className="curasphere-add-degree"
            >
              <Plus size={20} /> Add Degree
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="curasphere-register-button"
            >
              Register as Doctor
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

export default DoctorRegister;