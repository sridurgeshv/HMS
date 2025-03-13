import React, { useState, useEffect } from "react";
import { User } from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Assuming username is stored in local storage after signup
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user-profile/${username}`);
        if (!response.ok) throw new Error("Failed to fetch profile data");

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchProfile();
  }, [username]);

  return (
      <div className="tab-content profile fade-in">
        <div className="content-header">
          <h2>
            <User size={20} /> Personal Profile
          </h2>
        </div>

        {loading && <p>Loading profile...</p>}
        {error && <p className="error">{error}</p>}
        {profile && (
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">{profile.full_name[0]}</div>
              <div className="profile-name">
                <h3>{profile.full_name}</h3>
                <p>Patient ID: {profile.patient_id}</p>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-group">
                <h4>Personal Information</h4>
                <div className="detail-row">
                  <span className="detail-label">Date of Birth</span>
                  <span className="detail-value">{profile.date_of_birth}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Username</span>
                  <span className="detail-value">{profile.username}</span>
                </div>
              </div>

              <div className="detail-group">
                <h4>Contact Information</h4>
                <div className="detail-row">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{profile.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{profile.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address</span>
                  <span className="detail-value">{profile.address}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default Profile;