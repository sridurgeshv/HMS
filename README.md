# 🏥 Hospital Management System (MERN Stack)

## 📋 Project Overview
A comprehensive **Hospital Management System** built on the MERN stack (MongoDB, Express.js, React, Node.js) designed to modernize healthcare operations through integrated dashboards, AI-powered processes, and secure role-based access.
This system streamlines the entire hospital workflow from patient registration to billing and inventory management, supporting both staff and patients with intuitive interfaces and intelligent automation.

## ✨ Key Features
### 🧑‍⚕️ User Management & Authentication

- **Multi-role access system**: Separate secure portals for patients, doctors, nurses, and administrators
- **JWT-based authentication**: Secure login and registration with email verification
- **Role-specific dashboards**: Tailored interfaces showing relevant information based on user role

### 👨‍⚕️ Doctor Portal

- **Appointment Management**:

View daily, weekly, and monthly schedules.

Manage appointments with options to add follow-up notes.

- **Patient Records Access**:

Quick access to patient medical history and test results.

View and respond to patient medications.

- **Prescription Management**:

 Manage digital prescriptions.

Track medication history for patients.

- **AI-Assisted Diagnosis**:

AI-powered recommendation system based on patient symptoms and history.

X-Ray Analyzer for image-based diagnosis.

- **Chatbot Integration**:

Query patient summaries using a chatbot interface.

### 🏥 Patient Portal

- **Self-registration**: Simple onboarding process for new patients
- **Appointment booking**: Schedule, reschedule, or cancel appointments
- **Medical history**: Access to personal health records and test results
- **Billing & payments**: View and pay medical bills online

### 👩‍⚕️ Staff Management

- **Nurse task assignment**: Digital task allocation and completion tracking
- **Staff scheduling**: Manage doctor and nurse availability and shifts
- **Performance analytics**: Track key performance indicators for healthcare providers

### 💼 Administrative Features

- **Billing system**: Generate invoices and manage payment processing
- **Inventory management**: Track medical supplies with AI-powered alerts for low stock
- **Reports generation**: Analytics dashboard with custom report options
- **Department management**: Organize hospital resources by department

### 🛠️ Technical Stack
#### Frontend

- **React.js**: Component-based UI development
- **Redux**: State management
- **Material UI**: Modern, responsive design components
- **Chart.js**: Data visualization for analytics

#### Backend

- **FastAPI**: High-performance Python framework for APIs
- **MongoDB**: NoSQL database for flexible data storage
- **JWT**: Secure authentication implementation
- **Spacy**: NLP for text processing capabilities

#### AI & Machine Learning

- **NLP models**: For voice appointment booking and text analysis
- **Predictive analytics**: For inventory management and resource allocation
- **Recommendation systems**: For treatment suggestions based on patient history

### 📦 Installation & Setup

**Prerequisites**

- Node.js (v14.x or higher) 
- Python (v3.8 or higher)

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

Ritika Srivastava \
Sri Durgesh

#### Video Demo

For a comprehensive overview of the application's features and functionality, please watch our [video demonstration](https://youtu.be/0yQ9vURTq6Y). This walkthrough provides detailed guidance on effectively using and navigating Curasphere.

#### Contributing

Feel free to submit issues and pull requests to improve the project!
