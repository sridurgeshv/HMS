import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { User, Mail, Lock, Eye, EyeOff, Calendar, Phone, MapPin, Award, Building, BookOpen, Briefcase, Tag, Globe, GraduationCap, Shield, Clock, Hash, Smile} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Register.css';

const NurseRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [education, setEducation] = useState([]);
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
    role: 'nurse',
    status: 'pending',
    age: '',
    gender: '',
    licenseExpiry: '',
    certification: '',
    startDate: '',
    employeeId: '',
    title: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (e) => {
    setSkills(e.target.value.split(','));
  };

  const handleLanguageChange = (e) => {
    setLanguages(e.target.value.split(','));
  };

  const handleEducationChange = (e) => {
    setEducation(e.target.value.split(','));
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
      role: "nurse",
      status: "pending",
      age: formData.age,
      gender: formData.gender,
      license_expiry: formData.licenseExpiry,
      certification: formData.certification,
      start_date: formData.startDate,
      employee_id: formData.employeeId,
      title: formData.title,
      skills: skills,
      languages: languages,
      education: education
    };

    try {
      const response = await axios.post('http://localhost:8000/nursesignup/', payload);

      localStorage.setItem('nurse_id', response.data.nurse_id);

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
  <Smile className="curasphere-input-icon" />
  <select 
    name="gender"
    value={formData.gender}
    onChange={handleChange}
    required 
    className="curasphere-input"
  >
    <option value="">Select Gender</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
    <option value="other">Other</option>
  </select>
</div>

            <div className="curasphere-input-group">
              <Hash className="curasphere-input-icon" />
              <input 
                type="number" 
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required 
                className="curasphere-input"
              />
            </div>

            <div className="curasphere-input-group">
              <Shield className="curasphere-input-icon" />
              <input 
                type="date" 
                name="licenseExpiry"
                placeholder="License Expiry Date"
                value={formData.licenseExpiry}
                onChange={handleChange}
                required 
                className="curasphere-input"
              />
            </div>

            <div className="curasphere-input-group">
              <Award className="curasphere-input-icon" />
              <input 
                type="text" 
                name="certification"
                placeholder="Certification"
                value={formData.certification}
                onChange={handleChange}
                required 
                className="curasphere-input"
              />
            </div>

            <div className="curasphere-input-group">
              <Clock className="curasphere-input-icon" />
              <input 
                type="date" 
                name="startDate"
                placeholder="Start Date"
                value={formData.startDate}
                onChange={handleChange}
                required 
                className="curasphere-input"
              />
            </div>

            <div className="curasphere-input-group">
              <Tag className="curasphere-input-icon" />
              <input 
                type="text" 
                name="employeeId"
                placeholder="Employee ID"
                value={formData.employeeId}
                onChange={handleChange}
                required 
                className="curasphere-input"
              />
            </div>

            <div className="curasphere-input-group">
              <Briefcase className="curasphere-input-icon" />
              <input 
                type="text" 
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required 
                className="curasphere-input"
              />
            </div>

            <div className="curasphere-input-group">
              <BookOpen className="curasphere-input-icon" />
              <input 
                type="text" 
                name="skills"
                placeholder="Skills (comma separated)"
                onChange={handleSkillChange}
                required 
                className="curasphere-input"
              />
            </div>

            <div className="curasphere-input-group">
              <Globe className="curasphere-input-icon" />
              <input 
                type="text" 
                name="languages"
                placeholder="Languages (comma separated)"
                onChange={handleLanguageChange}
                required 
                className="curasphere-input"
              />
            </div>

            <div className="curasphere-input-group">
              <GraduationCap className="curasphere-input-icon" />
              <input 
                type="text" 
                name="education"
                placeholder="Education (comma separated)"
                onChange={handleEducationChange}
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