import React from 'react';
import { FileText } from 'lucide-react';
import Dashboard from './Dashboard';

const MedicalHistory = () => {
  return (
    <Dashboard>
      <div className="tab-content medical-history fade-in">
        <div className="content-header">
          <h2><FileText size={20} /> Medical History</h2>
        </div>
        
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-date">Feb 15, 2025</div>
            <div className="timeline-content">
              <h3>Annual Physical Examination</h3>
              <p>General checkup with Dr. Wilson. All vitals normal, recommended increased physical activity.</p>
              <button className="btn-view-details">View Details</button>
            </div>
          </div>
          
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-date">Dec 10, 2024</div>
            <div className="timeline-content">
              <h3>Flu Vaccination</h3>
              <p>Received seasonal flu vaccine. No adverse reactions.</p>
              <button className="btn-view-details">View Details</button>
            </div>
          </div>
          
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-date">Oct 5, 2024</div>
            <div className="timeline-content">
              <h3>Blood Work Results</h3>
              <p>Cholesterol levels slightly elevated. New medication prescribed.</p>
              <button className="btn-view-details">View Details</button>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default MedicalHistory;