import React from 'react';
import { User } from 'lucide-react';
import Dashboard from './Dashboard';

const Profile = () => {
  return (
    <Dashboard>
      <div className="tab-content profile fade-in">
        <div className="content-header">
          <h2><User size={20} /> Personal Profile</h2>
          <button className="action-button">Edit Profile</button>
        </div>
        
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">JD</div>
            <div className="profile-name">
              <h3>John Doe</h3>
              <p>Patient since: January 2020</p>
            </div>
          </div>
          
          <div className="profile-details">
            <div className="detail-group">
              <h4>Personal Information</h4>
              <div className="detail-row">
                <span className="detail-label">Date of Birth</span>
                <span className="detail-value">05/12/1985</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Gender</span>
                <span className="detail-value">Male</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Blood Type</span>
                <span className="detail-value">O+</span>
              </div>
            </div>
            
            <div className="detail-group">
              <h4>Contact Information</h4>
              <div className="detail-row">
                <span className="detail-label">Email</span>
                <span className="detail-value">john.doe@example.com</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone</span>
                <span className="detail-value">(555) 123-4567</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Address</span>
                <span className="detail-value">123 Main St, Anytown, CA 91234</span>
              </div>
            </div>
            
            <div className="detail-group">
              <h4>Emergency Contact</h4>
              <div className="detail-row">
                <span className="detail-label">Name</span>
                <span className="detail-value">Jane Doe</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Relationship</span>
                <span className="detail-value">Spouse</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone</span>
                <span className="detail-value">(555) 987-6543</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Profile;