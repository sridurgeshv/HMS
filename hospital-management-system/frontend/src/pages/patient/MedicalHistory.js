import React, { useState, useEffect, useContext, useCallback } from "react";
import { Calendar, FileText, User, Pill, Activity, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { PatientContext } from "../../PatientContext";
import { UserContext } from "../../UserContext";

import './Dashboard.css';

const MedicalHistory = () => {
   const { username } = useContext(UserContext) || {};
  const { patientId } = useContext(PatientContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [newEntry, setNewEntry] = useState({
    visit_date: "",
    doctor_name: "",
    notes: "",
    medications: "",
  });
  const location = useLocation();

  // Fetch medical history function
  const fetchMedicalHistory = useCallback(async () => {
    if (!patientId) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/medical-history/${patientId}`);
      if (!response.ok) throw new Error("Medical History Unavailable");

      const data = await response.json();
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user-profile/${username}`);
        if (!response.ok) throw new Error("Failed to fetch profile data");
        
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    if (username) fetchProfile();
  }, [username]);

  // Fetch data on mount and when patientId changes
  useEffect(() => {
    fetchMedicalHistory();
  }, [fetchMedicalHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId) return;

    try {
      const response = await fetch(`http://localhost:8000/medical-history/${patientId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      if (!response.ok) throw new Error("Failed to add medical history");

      setNewEntry({ visit_date: "", doctor_name: "", notes: "", medications: "" });

      // Fetch updated history after adding a new entry
      await fetchMedicalHistory();
    } catch (err) {
      setError(err.message);
    }
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/appointments')) return 'appointments';
    if (path.includes('/medical-history')) return 'medical-history';
    if (path.includes('/medications')) return 'medications';
    if (path.includes('/profile')) return 'profile';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="logo">CuraSphere</h2>
        </div>
        <div className="sidebar-content">
          <div className="user-profile">
            <div className="avatar">{profile ? profile.full_name[0] : username ? username[0] : "U"}</div>
            <div className="user-info">
              <h3>{profile ? profile.full_name : "Loading..."}</h3>
              <p>Patient ID: {profile ? profile.patient_id : patientId || "..."}</p>
            </div>
          </div>
          <nav className="sidebar-menu">
            <Link 
              to="/patient/dashboard" 
              className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            >
              <Activity size={20} />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/patient/appointments" 
              className={`menu-item ${activeTab === 'appointments' ? 'active' : ''}`}
            >
              <Calendar size={20} />
              <span>Appointments</span>
            </Link>
            <Link 
              to="/patient/medical-history" 
              className={`menu-item ${activeTab === 'medical-history' ? 'active' : ''}`}
            >
              <FileText size={20} />
              <span>Medical History</span>
            </Link>
            <Link 
              to="/patient/medications" 
              className={`menu-item ${activeTab === 'medications' ? 'active' : ''}`}
            >
              <Pill size={20} />
              <span>Medications</span>
            </Link>
            <Link 
              to="/patient/profile" 
              className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
            >
              <User size={20} />
              <span>Profile</span>
            </Link>
          </nav>
        </div>
      </div>

      <main className="dashboard-main">
        <header className="main-header">
          <h1>Medical History</h1>
          <div className="header-actions">
            <div className="notification-bell">
              <span className="notification-dot"></span>
              <Bell size={24} />
            </div>
          </div>
        </header> 

        <div className="dashboard-content">
          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <div className="mb-4 flex items-center space-x-2 text-blue-600">
              <FileText size={24} />
              <h2 className="text-xl font-semibold">Medical Records</h2>
            </div>

            {loading && <p className="text-gray-600">Loading medical history...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && history.length === 0 && <p className="text-gray-600">No medical history found.</p>}

            {!loading && !error && history.length > 0 && (
              <div className="space-y-4">
                {history.map((record) => (
                  <div key={record.id} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <p className="font-medium">{record.visit_date}</p>
                    </div>
                    <h3 className="text-lg font-semibold mt-2">{record.doctor_name}</h3>
                    <p className="text-gray-700">{record.notes}</p>
                    <p className="mt-2 text-sm text-gray-600">
                      <strong>Medications:</strong> {record.medications}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-blue-600">Add Medical History</h3>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <input
                  type="date"
                  value={newEntry.visit_date}
                  onChange={(e) => setNewEntry({ ...newEntry, visit_date: e.target.value })}
                  required
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Doctor's Name"
                  value={newEntry.doctor_name}
                  onChange={(e) => setNewEntry({ ...newEntry, doctor_name: e.target.value })}
                  required
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Clinical Notes"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  required
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Medications"
                  value={newEntry.medications}
                  onChange={(e) => setNewEntry({ ...newEntry, medications: e.target.value })}
                  required
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Add Entry
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MedicalHistory;