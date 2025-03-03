# Hospital Management System - MERN Stack Project

### Project Reference Link - [YT](https://www.youtube.com/watch?v=9OGhwqWQ8fI)

## Project Tasks :
1. Creating complete frontend setup as in video
2. In this portal, we basically have 2 systems
   - Patients Login / Registeration
   - Doctors Login / Registeration
3. Two Separate Dashboards
4. Having databases for Patients records, Staff Management, Billing system, Appointments handling, Inventory (Optional Task).
5. Main Task is adding AI in two systems like Patient records and appointments handling part. if possible in inventory system as well to notify the head doctor to get the inventory updated with stocks.


## Some Extra Data - [Project Feasibility for Hospital Management System](https://monica.im/share/chat?shareId=ZSO50tpgkKpDpffK)

# Frontend Plan

- First a welcome page mostly the same design as in the youtube video.
- then a login page which has two different sections like patient login system and then the staff management login portals where first they sign up and login into the web application.
- Again in the staff mgmt portal, we'll be having doctors login part and the nurse / attendees login portal where doctors and nurse can sign up and sign in.
- In **Patient Dashboard**, we'll show different tabs like appointments he have as well as the previous appointments, then the medicines which he was prescibed in the first appointment or his current medication history.
- In **Doctor Dashboard**, we'll show his day-to-day appointments to attend, his particular patients data.
- In **Nurse Dashboard**, we'll show the day-to-day appointments they need to attend as well the doctors information as well to consult for any information.
- If possible, we need a **Admin Dashboard** as well, to control all these details being controlled around the different pages.

## Frontend (React.js)
Your plan for different dashboards and user roles is well thought out. Let's expand on it:

### 1. Welcome/Landing Page

- Hospital introduction
- Key features
- Navigation to login

### 2. Authentication System

- Patient portal login/signup
- Staff portal with role-based access:
  - Doctor login
  - Nurse/attendee login
  - Admin login

### 3. Patient Dashboard
- Upcoming appointments
- Appointment booking interface
- Medical history
- Prescription history and current medications
- Personal profile management
- Billing information and payment history

### 4. Doctor Dashboard
- Daily/weekly appointment schedule
- Patient records access
- Prescription management
- Medical notes and history
- Communication system with patients/nurses

### 5. Nurse Dashboard
- Daily tasks and appointments
- Patient care notes
- Doctor assignment information
- Medication administration tracking

### 6. Admin Dashboard
- User management (staff and patients)
- Department management
- Analytics and reporting
- System configuration
- Resource allocation

## Project Structure
Both the frontend and backend 
```bash
hospital-management-system/
├── backend/                # Python backend
│   ├── app/                # Application package
│   │   ├── __init__.py     # Makes app a package
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   └── ai/             # AI functionality
│   ├── config.py           # Configuration settings
│   ├── requirements.txt    # Python dependencies
│   └── run.py              # Application entry point
│
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── assets/         # Images, icons, etc.
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   │   ├── Admin/      # Admin dashboard pages
│   │   │   ├── Doctor/     # Doctor dashboard pages
│   │   │   ├── Nurse/      # Nurse dashboard pages
│   │   │   └── Patient/    # Patient dashboard pages
│   │   ├── services/       # API integration
│   │   ├── utils/          # Helper functions
│   │   ├── context/        # React context
│   │   ├── App.js          # Main component
│   │   └── index.js        # Entry point
│   ├── package.json        # npm dependencies
│   └── README.md           # Frontend documentation
│
├── .gitignore              # Git ignore file
└── README.md               # Project documentation
```
# Claude AI - [Link](https://claude.ai/share/b3e63877-68ef-4b38-9a05-d40653da5a58)

## Important Links 
1. [Customize account management emails and SMS messages](https://support.google.com/firebase/answer/7000714)
2. [Add users](https://support.google.com/firebase/answer/6400802?hl=en&ref_topic=6386702)
3. [Add Firebase to your JavaScript project](https://firebase.google.com/docs/web/setup)
4. [Authenticate with Firebase using Password-Based Accounts using Javascript](https://firebase.google.com/docs/auth/web/password-auth)
5. [snippets->auth-next->email->auth_signup_password.js](https://github.com/firebase/snippets-web/blob/467eaa165dcbd9b3ab15711e76fa52237ba37f8b/snippets/auth-next/email/auth_signup_password.js#L8-L21)
