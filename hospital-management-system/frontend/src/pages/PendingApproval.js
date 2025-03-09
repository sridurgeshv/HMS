import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/PendingApproval.css';

const PendingApproval = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newValue = prev + 1;
        return newValue <= 100 ? newValue : 0;
      });
    }, 600);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pending-approval-page">
      <div className={`pending-approval-container ${isVisible ? 'fade-in' : ''}`}>
        <div className="approval-icon">
          <div className="pulse-ring"></div>
          <div className="clock-icon">
            <div className="clock-face"></div>
            <div className="clock-hand hour-hand"></div>
            <div className="clock-hand minute-hand"></div>
          </div>
        </div>
        
        <h2 className="approval-title">Your account is under review</h2>
        
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
        
        <p className="approval-message">
          Please wait for the admin to approve your registration. 
          You will be notified once your account is activated.
        </p>
        
        <div className="status-indicators">
          <div className="status-item">
            <span className="status-dot received"></span>
            <span className="status-text">Request Received</span>
          </div>
          <div className="status-item">
            <span className="status-dot processing pulse"></span>
            <span className="status-text">Processing</span>
          </div>
          <div className="status-item">
            <span className="status-dot pending"></span>
            <span className="status-text">Approval Pending</span>
          </div>
        </div>
        
        <Link to="/" className="home-link">
          <span className="link-text">Go to Home</span>
          <span className="link-icon">→</span>
        </Link>
      </div>
    </div>
  );
};

export default PendingApproval;