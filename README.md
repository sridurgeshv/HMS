# 🏥 Hospital Management System (MERN Stack)

## 📌 Overview
The **Hospital Management System** is a **MERN stack** application designed to streamline hospital operations. It includes **role-based dashboards** for patients, doctors, and nurses, allowing efficient management of **appointments, patient records, billing, and staff management**. AI-powered features assist in **automated appointment scheduling and inventory tracking**.

## 🚀 Features
- **Patient Management**: Registration, appointment scheduling, and medical records.
- **Doctor Dashboard**: View appointments, manage patient records, and prescribe medications.
- **Nurse Dashboard**: Track daily tasks and assist doctors.
- **Billing System**: Manage hospital charges and patient payments.
- **AI Integration**: Automated appointment scheduling and inventory alerts.
- **Role-Based Access**: Secure authentication for patients, doctors, nurses, and admins.

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/hospital-management-system.git
cd hospital-management-system
```

### Backend Setup 
```bash
cd backend
pip install -r requirements.txt
uvicorn app.run:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Code
- To get the database
```py
python -c "from app.utils.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

## ⚙️ Technologies Used
Frontend: React.js, Redux
Backend: FastAPI, Python
Authentication: JWT
AI Integration: Machine Learning for patient record analysis and inventory tracking

📜 License
This project is licensed under the MIT License.

🙌 Contributors
Your Name - GitHub
Teammate Name - GitHub

🚀 Built with Passion for Smarter Healthcare!
```vbnet
This README is now **clean, structured, and professional**. Let me know if you need any modifications! 🚀
```

------------------------------------------------------------------------------------------------------------------------------------------------------


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


## Some Extra Data - [Hospital Management System](https://monica.im/share/chat?shareId=ZSO50tpgkKpDpffK)


```
# Claude AI - [Link](https://claude.ai/share/b3e63877-68ef-4b38-9a05-d40653da5a58)

## Important Links for project
1. [Customize account management emails and SMS messages](https://support.google.com/firebase/answer/7000714)
2. [Add users](https://support.google.com/firebase/answer/6400802?hl=en&ref_topic=6386702)
3. [Add Firebase to your JavaScript project](https://firebase.google.com/docs/web/setup)
4. [Authenticate with Firebase using Password-Based Accounts using Javascript](https://firebase.google.com/docs/auth/web/password-auth)
5. [snippets->auth-next->email->auth_signup_password.js](https://github.com/firebase/snippets-web/blob/467eaa165dcbd9b3ab15711e76fa52237ba37f8b/snippets/auth-next/email/auth_signup_password.js#L8-L21)



----------------------------------------------------------------------

## Appointments Voice 
Book a voice appointment in the cardiology department for Thursday at 4 PM to discuss test results.