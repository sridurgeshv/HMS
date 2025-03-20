import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Bell, 
  Search,
  Menu,
  X,
  User,
  Filter,
  Pill
} from 'lucide-react';
import axios from 'axios';

const MedicalRecords = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [patientMedications, setPatientMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctor, setDoctor] = useState({ full_name: "", specialization: "" });
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [response, setResponse] = useState("");

  // Fetch patient medications when the component mounts
  useEffect(() => {
    const fetchPatientMedications = async () => {
      const doctorId = localStorage.getItem('doctor_id'); // Retrieve doctor_id from local storage
      if (!doctorId) {
        setError("Doctor ID not found. Please log in again.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/doctor-medications/${doctorId}`);
        if (!response.ok) throw new Error("Failed to fetch patient medications");

        const data = await response.json();
        setPatientMedications(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientMedications();
  }, []);

  // Fetch doctor profile data
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      const doctorId = localStorage.getItem('doctor_id');
      if (!doctorId) return;

      try {
        const response = await axios.get(`http://localhost:8000/doctor/${doctorId}`);
        setDoctor({
          full_name: response.data.name,
          specialization: response.data.specialty
        });
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      }
    };

    fetchDoctorProfile();
  }, []);

  // Handle opening the medication modal
  const handleOpenMedicationModal = (medication) => {
    console.log("Selected medication:", medication); // Log the medication
    if (!medication || !medication.id) {
      alert("Invalid medication selected.");
      return;
    }
    setSelectedMedication(medication);
    setShowMedicationModal(true);
  };

  // Handle saving the doctor's response
  const handleSaveResponse = async (e) => {
    e.preventDefault();
  
    // Validate selectedMedication
    if (!selectedMedication || !selectedMedication.id) {
      alert("No medication selected. Please select a medication first.");
      return;
    }
  
    // Validate response
    if (!response) {
      alert("Please enter a response.");
      return;
    }
  
    try {
      const doctorId = localStorage.getItem('doctor_id');
      if (!doctorId) {
        alert("Doctor ID not found. Please log in again.");
        return;
      }
  
      const payload = {
        medication_id: selectedMedication.id, // Ensure it's a string
        doctor_id: doctorId, // Ensure it's a string
        response: response, // Ensure it's a string
      };
  
      console.log("Sending payload:", payload); // Log the payload
  
      const apiResponse = await axios.post('http://localhost:8000/medication-responses', payload);
      
      if (apiResponse.status === 200) {
        alert('Response saved successfully!');
        setShowMedicationModal(false);
        setResponse("");
      }
    } catch (error) {
      console.error("Error saving response:", error);
      alert('Failed to save response. Please try again.');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading patient medications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isMenuOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="logo">Curasphere</h2>
          <button className="close-menu" onClick={toggleMenu}>
            <X size={24} />
          </button>
        </div>
        
        <div className="doctor-profile">
          <div className="profile-image">
            <img src="/api/placeholder/100/100" alt="Doctor profile" />
          </div>
          <div className="profile-info">
            <h3>{doctor.full_name || "Loading..."}</h3>
            <p>{doctor.specialization || "Loading..."}</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/doctor/dashboard" className="nav-item">
            <Calendar size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/doctor/appointments" className="nav-item">
            <Clock size={20} />
            <span>Appointments</span>
          </Link>
          <Link to="/doctor/patients" className="nav-item">
            <Users size={20} />
            <span>Patients</span>
          </Link>
          <Link to="/doctor/medical-records" className="nav-item active">
            <FileText size={20} />
            <span>Medical Records</span>
          </Link>
          <Link to="/doctor/profile" className="nav-item">
            <User size={20} />
            <span>Profile</span>
          </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <button className="menu-toggle" onClick={toggleMenu}>
            <Menu size={24} />
          </button>
          
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Search records..." />
          </div>
          
          <div className="topbar-right">
            <div className="notification-bell">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </div>
          </div>
        </header>
        
        {/* Medical Records Content */}
        <div className="dashboard-content">
          <div className="content-header">
            <h1>Patient Previous Medical Records</h1>
            <div className="header-actions">
              <button className="secondary-button">
                <Filter size={18} />
                <span>Filter</span>
              </button>
            </div>
          </div>
          
          {/* Patient Medications Section */}
          <section className="patient-medications-section">
            <h2><Pill size={20} /> Patient Medications</h2>
            <div className="patient-medications-list">
              {patientMedications.length > 0 ? (
                patientMedications.map(patient => (
                  <div key={patient.patient_id} className="patient-medication-card">
                    <h3>{patient.full_name}</h3>
                    <div className="medication-details">
                      {patient.medications.length > 0 ? (
                        patient.medications.map((med, index) => (
                          <div key={index} className="medication-item">
                            <p><strong>{med.name}</strong> - {med.dosage} ({med.frequency})</p>
                            <button 
                              className="respond-button"
                              onClick={() => handleOpenMedicationModal(med)}
                            >
                              Respond
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="no-medications">No medications found for this patient.</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-patients">No patients found in your department.</p>
              )}
            </div>
          </section>

          {/* Records Table (Optional) */}
          <div className="records-table-container">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Medication</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                </tr>
              </thead>
              <tbody>
                {patientMedications.map(patient => (
                  patient.medications.map((med, index) => (
                    <tr key={`${patient.patient_id}-${index}`}>
                      <td>{patient.full_name}</td>
                      <td>{med.name}</td>
                      <td>{med.dosage}</td>
                      <td>{med.frequency}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Medication Modal */}
      {showMedicationModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Respond to Medication</h3>
              <button className="close-modal" onClick={() => setShowMedicationModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Response</label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Enter your response..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowMedicationModal(false)}>
                Cancel
              </button>
              <button className="save-button" onClick={handleSaveResponse}>
                Save Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;