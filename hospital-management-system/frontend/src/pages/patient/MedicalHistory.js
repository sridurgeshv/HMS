import React, { useState, useEffect, useContext, useCallback } from "react";
import { Calendar, FileText, User, Pill, Activity, Bell, LogOut, CreditCard, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PatientContext } from "../../PatientContext";
import { UserContext } from "../../UserContext";
import axios from 'axios';
import './Dashboard.css';

const MedicalHistory = () => {
  const userContext = useContext(UserContext);
  const { username } = userContext || {};
  const context = useContext(PatientContext);
  const patientId = context?.patientId || null;
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [newEntry, setNewEntry] = useState({
    visit_date: "",
    doctor_name: "",
    notes: "",
    medications: "",
  });
  const [bill, setBill] = useState(""); // State for generated bill
  const [generatingBill, setGeneratingBill] = useState(false); // Loading state for bill generation
  const [showBillPopup, setShowBillPopup] = useState(false); // State to control bill popup visibility
  const [paymentStatus, setPaymentStatus] = useState("unpaid"); // State for payment status
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch medical history function
  const fetchMedicalHistory = useCallback(async () => {
    if (!patientId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/medical-history/${patientId}`);
      if (!response.ok) throw new Error("Medical History Unavailable");

      const data = await response.json();
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
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

  // Generate bill function
  const generateBill = async () => {
    if (!patientId) {
      setError("Patient ID not found. Please select a patient.");
      return;
    }

    setGeneratingBill(true);
    setError(null);

    try {
      const response = await axios.post(`http://localhost:8000/generate-bill/${patientId}`);
      setBill(response.data.bill);
      setShowBillPopup(true); // Show the bill popup
    } catch (error) {
      console.error("Error generating bill:", error);
      setError("Failed to generate bill. Please try again.");
    } finally {
      setGeneratingBill(false);
    }
  };

  // Handle payment status change
  const handlePaymentStatusChange = (status) => {
    setPaymentStatus(status);
  };

  // Close bill popup
  const closeBillPopup = () => {
    setShowBillPopup(false);
    setBill(""); // Clear the bill content
  };

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

  const handleLogout = () => {
    // Clear all local storage items
    localStorage.removeItem('username');
    localStorage.removeItem('patient_id');
    
    // Redirect to welcome page
    navigate('/');
  };

  if (isLoading && !history.length) {
    return (
      <div className="patient-loading">
        <div className="patient-loading-spinner"></div>
        <p>Loading your medical records...</p>
      </div>
    );
  }

  return (
    <div className="patient-layout">
      <div className="patient-sidebar">
        <div className="patient-sidebar-brand">
          <h2 className="patient-logo">CuraSphere</h2>
        </div>
        <div className="patient-sidebar-body">
          <div className="patient-user-card">
            <div className="patient-user-avatar">{profile ? profile.full_name[0] : username ? username[0] : "JD"}</div>
            <div className="patient-user-details">
              <h3>{profile ? profile.full_name : "John Doe"}</h3>
              <p>Patient ID: {profile ? profile.patient_id : patientId || "12345678"}</p>
            </div>
          </div>
          <nav className="patient-nav">
            <Link 
              to="/patient/dashboard" 
              className={`patient-nav-item ${activeTab === 'dashboard' ? 'patient-nav-active' : ''}`}
            >
              <Activity size={20} />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/patient/appointments" 
              className={`patient-nav-item ${activeTab === 'appointments' ? 'patient-nav-active' : ''}`}
            >
              <Calendar size={20} />
              <span>Appointments</span>
            </Link>
            <Link 
              to="/patient/medical-history" 
              className={`patient-nav-item ${activeTab === 'medical-history' ? 'patient-nav-active' : ''}`}
            >
              <FileText size={20} />
              <span>Medical History</span>
            </Link>
            <Link 
              to="/patient/medications" 
              className={`patient-nav-item ${activeTab === 'medications' ? 'patient-nav-active' : ''}`}
            >
              <Pill size={20} />
              <span>Medications</span>
            </Link>
            <Link 
              to="/patient/profile" 
              className={`patient-nav-item ${activeTab === 'profile' ? 'patient-nav-active' : ''}`}
            >
               <User size={20} />
              <span>Profile</span>
            </Link>
            <Link 
              onClick={handleLogout} 
              className="patient-nav-item"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </Link>
          </nav>
        </div>
      </div>

      <main className="patient-content">
        <header className="patient-header">
          <h1>Medical History</h1>
          <div className="patient-header-controls">
            <div className="patient-notification">
              <span className="patient-notification-indicator"></span>
              <Bell size={24} />
            </div>
          </div>
        </header> 

        <div className="patient-page-content">
          <div className="patient-medical-history-view patient-fade-in">
            <div className="patient-section-header">
              <h2><FileText size={20} /> Medical Records</h2>
              <button
                className="patient-billing-button"
                onClick={generateBill}
                disabled={generatingBill}
              >
                <CreditCard size={20} />
                {generatingBill ? "Generating Bill..." : "Generate Bill"}
              </button>
            </div>

            {error && <div className="patient-error-message">{error}</div>}
            
            {!isLoading && !error && history.length === 0 && (
              <div className="patient-empty-state">
                <FileText size={48} />
                <p>No medical history records found.</p>
              </div>
            )}

            {!isLoading && !error && history.length > 0 && (
              <div className="patient-medical-records-list">
                {history.map((record) => (
                  <div key={record.id} className="patient-medical-record-card">
                    <div className="patient-record-header">
                      <div className="patient-record-indicator"></div>
                      <p className="patient-record-date">{record.visit_date}</p>
                    </div>
                    <h3 className="patient-record-doctor">{record.doctor_name}</h3>
                    <p className="patient-record-notes">{record.notes}</p>
                    <div className="patient-record-medications">
                      <strong>Medications:</strong> {record.medications}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="patient-add-record-section">
              <div className="patient-section-header">
                <h3><FileText size={18} /> Add Medical Record</h3>
              </div>
              <form onSubmit={handleSubmit} className="patient-medical-form">
                <div className="patient-form-field">
                  <label>Visit Date</label>
                  <input
                    type="date"
                    value={newEntry.visit_date}
                    onChange={(e) => setNewEntry({ ...newEntry, visit_date: e.target.value })}
                    required
                    className="patient-form-input"
                  />
                </div>
                <div className="patient-form-field">
                  <label>Doctor's Name</label>
                  <input
                    type="text"
                    placeholder="Enter doctor's name"
                    value={newEntry.doctor_name}
                    onChange={(e) => setNewEntry({ ...newEntry, doctor_name: e.target.value })}
                    required
                    className="patient-form-input"
                  />
                </div>
                <div className="patient-form-field">
                  <label>Clinical Notes</label>
                  <textarea
                    placeholder="Enter clinical notes"
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                    required
                    className="patient-form-textarea"
                  />
                </div>
                <div className="patient-form-field">
                  <label>Medications</label>
                  <input
                    type="text"
                    placeholder="Enter prescribed medications"
                    value={newEntry.medications}
                    onChange={(e) => setNewEntry({ ...newEntry, medications: e.target.value })}
                    required
                    className="patient-form-input"
                  />
                </div>
                <button
                  type="submit"
                  className="patient-primary-button"
                >
                  Add Entry
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Bill Popup */}
      {showBillPopup && (
        <div className="patient-bill-popup-overlay">
          <div className="patient-bill-popup">
            <div className="patient-bill-popup-header">
              <h2>Generated Bill</h2>
              <button onClick={closeBillPopup} className="patient-bill-popup-close">
                <X size={20} />
              </button>
            </div>
            <div className="patient-bill-content">
              <pre>{bill}</pre>
              <div className="patient-bill-payment-status">
                <strong>Payment Status:</strong>
                <button
                  className={`patient-payment-button ${paymentStatus === 'paid' ? 'paid' : 'unpaid'}`}
                  onClick={() => handlePaymentStatusChange(paymentStatus === 'paid' ? 'unpaid' : 'paid')}
                >
                  {paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;
