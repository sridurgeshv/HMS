
        <div className="content-area">
          <div className="profile-container">
            <div className="profile-header">
              <div className="profile-avatar">JS</div>
              <div className="profile-title">
                <h2>{nurseInfo.name}, {nurseInfo.title}</h2>
                <p>{nurseInfo.department} | {nurseInfo.floor}</p>
              </div>
            </div>

            <div className="profile-content">
              <div className="profile-section">
                <h3>Personal Information</h3>
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <label>Employee ID</label>
                    <p>{nurseInfo.employeeId}</p>
                  </div>
                  <div className="profile-info-item">
                    <label>Email</label>
                    <p>{nurseInfo.email}</p>
                  </div>
                  <div className="profile-info-item">
                    <label>Phone</label>
                    <p>{nurseInfo.phone}</p>
                  </div>
                  <div className="profile-info-item">
                    <label>Start Date</label>
                    <p>{nurseInfo.startDate}</p>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>Credentials</h3>
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <label>Certification</label>
                    <p>{nurseInfo.certification}</p>
                  </div>
                  <div className="profile-info-item">
                    <label>License Number</label>
                    <p>{nurseInfo.licenseNumber}</p>
                  </div>
                  <div className="profile-info-item">
                    <label>License Expiry</label>
                    <p>{nurseInfo.licenseExpiry}</p>
                  </div>
                  <div className="profile-info-item">
                    <label>Education</label>
                    <p>{nurseInfo.education}</p>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>Skills & Languages</h3>
                <div className="profile-skills">
                  {nurseInfo.skills.map((skill, index) => (
                    <span key={index} className="skill-badge">{skill}</span>
                  ))}
                </div>
                <h4>Languages</h4>
                <ul className="languages-list">
                  {nurseInfo.languages.map((language, index) => (
                    <li key={index}>{language}</li>
                  ))}
                </ul>
              </div>

              <div className="profile-section">
                <h3>Schedule Preferences</h3>
                <div className="schedule-preferences">
                  <div className="schedule-day">
                    <span>Monday</span>
                    <span className="time-pref">07:00 - 19:00</span>
                  </div>
                  <div className="schedule-day">
                    <span>Tuesday</span>
                    <span className="time-pref">07:00 - 19:00</span>
                  </div>
                  <div className="schedule-day">
                    <span>Wednesday</span>
                    <span className="time-pref">Off</span>
                  </div>
                  <div className="schedule-day">
                    <span>Thursday</span>
                    <span className="time-pref">Off</span>
                  </div>
                  <div className="schedule-day">
                    <span>Friday</span>
                    <span className="time-pref">07:00 - 19:00</span>
                  </div>
                  <div className="schedule-day">
                    <span>Saturday</span>
                    <span className="time-pref">07:00 - 19:00</span>
                  </div>
                  <div className="schedule-day">
                    <span>Sunday</span>
                    <span className="time-pref">Off</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
