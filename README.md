# 🏥 Curasphere: AI Powered Hospital Management System

## 📋 Project Overview
A comprehensive **AI Powered Hospital Management System**  designed to modernize healthcare operations through integrated dashboards, AI-powered processes, and secure role-based access.
This system streamlines the entire hospital workflow from patient registration to AI integration to staff scheduling , supporting both staff and patients with intuitive interfaces and intelligent automation.

## ✨ Key Features
### 🧑‍⚕️ User Management & Authentication

- **Multi-role access system**: Separate secure portals for patients, doctors, nurses, and administrators
- **Role-specific dashboards**: Tailored interfaces showing relevant information based on user role

### Note

As we are using local storage to fetch details so it is possible that you have to login twice to be redirected to patient dashboard.

# 👨‍⚕️ Doctor Portal

### Appointment Management:

- View daily, weekly, and monthly schedules.

- Manage appointments with options to add follow-up notes.

## Patient Records Access:

- Quick access to patient medical history and test results.

- View and respond to patient medications.

## Prescription Management:

 - Manage digital prescriptions.

- Track medication history for patients.

## AI-Assisted Diagnosis:

- AI-powered recommendation system based on patient symptoms and history.

- X-Ray Analyzer for image-based diagnosis.

  ## Chatbot Integration:

- Query patient summaries using a chatbot interface.

# 🏥 Patient Portal

### Self-Registration:

- Simple onboarding process for new patients.

- Easy account creation with minimal steps.

### Appointment Booking:

- Schedule or cancel appointments.

- AI powered Voice-based appointment booking for convenience.

- View upcoming and past appointments.

### Note : To use AI powered voice based appointment you should follow this format to book appointment
  
  - Book a appointment in the (department name) department for (from monday to sunday any day) at (time in am or pm) to discuss (reason for visit).

   - Example
    
    Book a voice appointment in the cardiology department for Thursday at 4 PM to discuss test results.

### Medical History:

- Access personal health records and test results.

- Add new medical records and view historical data.

- Generate and view medical bills.

### Medications Management:

- Add and track current medications.

- Get AI-powered advice on medication interactions and side effects.

- View doctor's responses to medication queries.

### Health Monitoring:

- Input and analyze vitals (heart rate, blood pressure, blood sugar).

- Receive health assessments based on vitals.

# 👩‍⚕️ Staff Management

### Nurse Task Assignment:

- Digital task allocation and completion tracking.

- Manage follow-up notes and patient care tasks.

### Staff Scheduling:

- View and manage doctor and nurse availability and shifts.

- Track doctor assignments and patient counts.

### Performance Analytics:

-Track key performance indicators (KPIs) for healthcare providers.

- Monitor medication tracking, patient notes, and appointment counts.

### Patient Care Management:

- Access and manage patient notes and follow-up tasks.

- Track medication schedules and patient progress.

### Medication Tracking:

- Monitor and update medication status for patients.

- View medication schedules and patient-specific details.

# 💼 Administrative Features

### User Management:

- Manage all users (patients, doctors, nurses).

- View and manage departments.

  ### Pending Registrations:

- Approve or reject new user registrations.

- View details of pending registrations.

### 📦 Installation & Setup

**Prerequisites**

- Node.js (v14.x or higher) 
- Python (v3.8 or higher)

### Note: You should have ffmpeg installed on your system to use the voice appointment feature.

#### Clone the Repository
```bash
git clone https://github.com/your-username/hospital-management-system.git
cd hospital-management-system
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run start
```
frontend API will be available at `http://localhost:3000`.

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app.run:app --reload
```

Backend API will be available at `http://localhost:8000`.

#### Initialize Database
```bash
python -c "from app.utils.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

#### 👥 Contributors

Ritika Srivastava 
Sri Durgesh

#### Video Demo

For a comprehensive overview of the application's features and functionality, please watch our [video demonstration](https://youtu.be/0yQ9vURTq6Y). This walkthrough provides detailed guidance on effectively using and navigating Curasphere.

#### Contributing

Feel free to submit issues and pull requests to improve the project!
