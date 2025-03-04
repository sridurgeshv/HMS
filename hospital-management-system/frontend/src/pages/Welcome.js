import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Clock, Shield, Stethoscope } from 'lucide-react';
import dc1 from '../assets/dc1.JPG';
import '../styles/Welcome.css';

const Welcome = () => {
  return (
    <div className="curasphere-landing-page">
      <header className="curasphere-header">
        <div className="curasphere-header-container">
          <div className="curasphere-logo">
            <HeartPulse className="curasphere-logo-icon" size={32} />
            <h1 className="curasphere-logo-text">CuraSphere</h1>
          </div>
          <nav className="curasphere-navigation">
            <a href="#home" className="curasphere-nav-link">Home</a>
            <a href="#services" className="curasphere-nav-link">Services</a>
            <a href="#about" className="curasphere-nav-link">About</a>
            <a 
              href="#login" 
              className="curasphere-login-button"
            >
              Login
            </a>
          </nav>
        </div>
      </header>

      <main className="curasphere-main-content">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="curasphere-main-text"
        >
          <h2 className="curasphere-main-headline">
            Transforming Healthcare, <br />Empowering Patients
          </h2>
          <p className="curasphere-main-description">
          Welcome to CuraSphere
At CuraSphere, we are dedicated to revolutionizing your healthcare experience. Our innovative Hospital Management System is designed with one purpose: to prioritize your care and well-being.

We understand that navigating the healthcare landscape can be challenging, which is why we offer a seamless, user-friendly platform that connects patients with healthcare providers, ensuring you receive the attention and support you deserve.
          </p>
          
          <div className="curasphere-feature-grid">
            <div className="curasphere-feature-item curasphere-feature-support">
              <Clock className="curasphere-feature-icon" />
              <span className="curasphere-feature-text">24/7 Support</span>
            </div>
            <div className="curasphere-feature-item curasphere-feature-security">
              <Shield className="curasphere-feature-icon" />
              <span className="curasphere-feature-text">Secure Platform</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="curasphere-cta-button"
          >
            Get Started
          </motion.button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="curasphere-image-container"
        >
          <motion.img 
            src={dc1} 
            alt="Healthcare Professional" 
            className="curasphere-hero-image"
            initial={{ scale: 0.9 }}
            animate={{ 
              scale: [0.9, 1.02, 0.98, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.div>
      </main>

      <footer className="curasphere-footer">
        <div className="curasphere-footer-container">
          <div className="curasphere-footer-brand">
            <Stethoscope className="curasphere-footer-icon" size={24} />
            <span className="curasphere-footer-text">CuraSphere Healthcare Solutions</span>
          </div>
          <div className="curasphere-footer-copyright">
            © 2024 CuraSphere. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;