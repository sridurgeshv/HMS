import React, { useState, useEffect, useContext } from "react";
import { PatientContext } from "../../PatientContext";
import { Pill, Activity, Calendar, FileText, User, Bell, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

const Medications = () => {
  const { username } = useContext(UserContext) || {};
  const context = useContext(PatientContext);
  const patientId = context?.patientId || null;
  const [medications, setMedications] = useState([]);
  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [doctorResponse, setDoctorResponse] = useState("");
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMedication, setSelectedMedication] = useState(null); // Track selected medication
  const location = useLocation();
  const navigate = useNavigate();
  
  // Fetch medications when component loads
  const fetchMedications = async () => {
    if (!patientId) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/medications/${patientId}`);
      const data = await res.json();
  
      setMedications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching medications:", error);
      setMedications([]);
    }
  };

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8000/user-profile/${username}`);
      if (!response.ok) throw new Error("Failed to fetch profile data");
      
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch doctor's response for a medication
  const fetchDoctorResponse = async (medicationId) => {
    try {
      const res = await fetch(`http://localhost:8000/medication-responses/${medicationId}`);
      const data = await res.json();

      if (data.length > 0) {
        // If there are responses, display the latest one
        setDoctorResponse(data[data.length - 1].response);
      } else {
        // If no responses, display a message
        setDoctorResponse("No response from doctor yet.");
      }
    } catch (error) {
      console.error("Error fetching doctor's response:", error);
      setDoctorResponse("Failed to fetch doctor's response.");
    }
  };

  // Fetch medications and profile when component mounts
  useEffect(() => {
    fetchMedications();
    if (username) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [patientId, username]);

  // Clear doctor's response when no medication is selected
  useEffect(() => {
    if (!selectedMedication) {
      setDoctorResponse(""); // Clear the response when no medication is selected
    }
  }, [selectedMedication]);

  // Function to add a new medication
  const addMedication = async () => {
    if (medName && dosage && frequency) {
      const newMed = { name: medName, dosage, frequency };

      try {
        const res = await fetch(`http://localhost:8000/medications/${patientId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMed),
        });

        if (res.ok) {
          const savedMed = await res.json();
          setMedications([...medications, savedMed]); // Update state with saved medication
          setMedName("");
          setDosage("");
          setFrequency("");
        }
      } catch (error) {
        console.error("Error saving medication:", error);
      }
    }
  };

  // Function to fetch AI advice
  const fetchAIResponse = async () => {
    if (!patientId) return;

    const medList = medications
      .map((med) => `${med.name} (${med.dosage}, ${med.frequency})`)
      .join(", ");
    const fullPrompt = `I am taking these medications: ${medList}. ${prompt}`;

    try {
      const res = await fetch("http://127.0.0.1:8000/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt, patient_id: patientId }),
      });

      const data = await res.json();
      setAiResponse(data.response);
    } catch (error) {
      console.error("Error fetching AI response:", error);
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

  if (isLoading) {
    return (
      <div className="patient-loading">
        <div className="patient-loading-spinner"></div>
        <p>Loading your health information...</p>
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
          <h1>Medications</h1>
          <div className="patient-header-controls">
            <div className="patient-notification">
              <span className="patient-notification-indicator"></span>
              <Bell size={24} />
            </div>
          </div>
        </header>

        <div className="patient-page-content">
          <div className="patient-medications-view patient-fade-in">
            <div className="patient-section-header">
              <h2><Pill size={20} /> Current Medications</h2>
            </div>

            {/* Medication Input Form */}
            <div className="patient-medications-form">
              <h3 className="patient-medications-subheader">Add Medication</h3>
              <div className="patient-medications-inputs">
                <input 
                  type="text" 
                  value={medName} 
                  onChange={(e) => setMedName(e.target.value)} 
                  placeholder="Medication Name" 
                  className="patient-input" 
                />
                <input 
                  type="text" 
                  value={dosage} 
                  onChange={(e) => setDosage(e.target.value)} 
                  placeholder="Dosage (e.g., 10mg)" 
                  className="patient-input" 
                />
                <input 
                  type="text" 
                  value={frequency} 
                  onChange={(e) => setFrequency(e.target.value)} 
                  placeholder="Frequency (e.g., Once daily)" 
                  className="patient-input" 
                />
                <button 
                  onClick={addMedication} 
                  className="patient-button patient-button-primary"
                >
                  Add Medication
                </button>
              </div>
            </div>

            {/* Medications List */}
            <div className="patient-medications-list">
              {medications.length > 0 ? medications.map(med => (
                <div 
                  key={med.id} 
                  className="patient-medication-item"
                  onClick={() => {
                    setSelectedMedication(med); // Set the selected medication
                    fetchDoctorResponse(med.id); // Fetch the doctor's response
                  }}
                >
                  <div className="patient-medication-icon">
                    <Pill size={24} />
                  </div>
                  <div className="patient-medication-details">
                    <h3 className="patient-medication-name">{med.name}</h3>
                    <p className="patient-medication-instructions">{med.dosage} - {med.frequency}</p>
                  </div>
                </div>
              )) : <p className="patient-empty-message">No medications added yet.</p>}
            </div>

            {/* AI Chat Feature */}
            <div className="patient-ai-section">
              <h3 className="patient-medications-subheader">Ask AI for Advice</h3>
              <div className="patient-ai-input-group">
                <input 
                  type="text" 
                  value={prompt} 
                  onChange={(e) => setPrompt(e.target.value)} 
                  placeholder="Ask about interactions, side effects..." 
                  className="patient-input patient-ai-input"
                />
                <button 
                  onClick={fetchAIResponse} 
                  className="patient-button patient-button-secondary"
                >
                  Ask AI
                </button>
              </div>
              {aiResponse && (
                <div className="patient-ai-response">
                  <strong>AI Response:</strong> 
                  <p>{aiResponse}</p>
                </div>
              )}
            </div>

            {/* Doctor Response Section */}
            <div className="patient-doctor-section">
              <h3 className="patient-medications-subheader">Doctor's Response</h3>
              <textarea
                value={doctorResponse}
                onChange={(e) => setDoctorResponse(e.target.value)}
                placeholder="Doctor will respond here..."
                className="patient-textarea"
                readOnly
              ></textarea>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Medications;