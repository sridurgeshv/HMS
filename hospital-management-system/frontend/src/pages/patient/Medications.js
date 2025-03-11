import React from 'react';
import { Pill, Activity } from 'lucide-react';
import Dashboard from './Dashboard';

const Medications = () => {
  // Mock data
  const medications = [
    { id: 1, name: "Lisinopril", dosage: "10mg", frequency: "Once daily", refill: "3 refills left" },
    { id: 2, name: "Atorvastatin", dosage: "20mg", frequency: "Once daily", refill: "2 refills left" },
    { id: 3, name: "Metformin", dosage: "500mg", frequency: "Twice daily", refill: "1 refill left" }
  ];

  return (
    <Dashboard>
      <div className="tab-content medications fade-in">
        <div className="content-header">
          <h2><Pill size={20} /> Current Medications</h2>
        </div>
        
        <div className="medications-list">
          {medications.map(med => (
            <div className="medication-card" key={med.id}>
              <div className="medication-icon">
                <Pill size={24} />
              </div>
              <div className="medication-details">
                <h3>{med.name}</h3>
                <p className="dosage">{med.dosage} - {med.frequency}</p>
                <p className="refill">{med.refill}</p>
              </div>
              <button className="btn-refill">Request Refill</button>
            </div>
          ))}
        </div>

        <div className="health-vitals">
          <h3>Health Vitals</h3>
          <div className="vitals-cards">
            <div className="vital-card">
              <Activity size={20} />
              <h4>Heart Rate</h4>
              <div className="vital-reading">72 <span>bpm</span></div>
              <div className="vital-chart"></div>
            </div>
            <div className="vital-card">
              <Activity size={20} />
              <h4>Blood Pressure</h4>
              <div className="vital-reading">120/80 <span>mmHg</span></div>
              <div className="vital-chart"></div>
            </div>
            <div className="vital-card">
              <Activity size={20} />
              <h4>Blood Sugar</h4>
              <div className="vital-reading">110 <span>mg/dL</span></div>
              <div className="vital-chart"></div>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Medications;