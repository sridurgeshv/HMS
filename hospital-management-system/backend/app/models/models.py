from sqlalchemy import Column, Integer, String , ForeignKey, DateTime , Date, Text, JSON 
from app.utils.database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    patient_id = Column(String, unique=True, index=True, nullable=True)  # Unique patient ID
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    date_of_birth = Column(String, nullable=True)  # Allow NULL values
    phone = Column(String, nullable=False)
    address = Column(String, nullable=True)  # Allow NULL values
    role = Column(String, nullable=False, default="patient")  # Default role to "patient"
    status = Column(String, nullable=False, default="pending")  # Add status field
    gender = Column(String, nullable=True)  # Add gender field
    age = Column(Integer, nullable=True)  # Add age field
    license_expiry = Column(Date, nullable=True)
    certification = Column(String, nullable=True)
    start_date = Column(Date, nullable=True)
    employee_id = Column(String, unique=True, index=True, nullable=True)
    title = Column(String, nullable=True)
    skills = Column(JSON, nullable=True)  # Store as JSON
    languages = Column(JSON, nullable=True)  # Store as JSON
    education = Column(JSON, nullable=True)  # Store as JSON
    
     # Doctor-specific fields
    specialization = Column(String, nullable=True)
    license_number = Column(String, unique=True, index=True, nullable=True)
    hospital = Column(String, nullable=True)
    experience = Column(Integer, nullable=True)
    doctor_id = Column(String, unique=True, index=True, nullable=True)  # Unique doctor ID

       # Nurse-specific fields
    department = Column(String, nullable=True)
    nurse_id = Column(String, unique=True, index=True, nullable=True)  # Unique doctor ID



    admin_code = Column(String, unique=True, nullable=True)  # Admin code field

    degrees = relationship("Degree", back_populates="user")

    admin_id = Column(String, unique=True, index=True, nullable=True)  # Unique patient ID
    


class Degree(Base):
    __tablename__ = "degrees"

    id = Column(Integer, primary_key=True, index=True)
    degree = Column(String, nullable=False)
    university = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="degrees")


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.patient_id"), nullable=False)
    doctor_id = Column(String, ForeignKey("users.doctor_id"), nullable=True)  # Add doctor_id
    doctor_name = Column(String, nullable=True)
    department = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    time = Column(String, nullable=False)
    reason = Column(String, nullable=False)
    
    
class MedicalHistory(Base):
    __tablename__ = "medical_history"

    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("users.patient_id"), nullable=False)
    visit_date = Column(Date, nullable=False)
    doctor_name = Column(String, nullable=False)
    notes = Column(Text, nullable=True)
    medications = Column(Text, nullable=True)

class Medication(Base):
    __tablename__ = "medications"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    dosage = Column(String, nullable=False)
    frequency= Column(String, nullable=False)
    patient_id = Column(String, ForeignKey("users.patient_id"), nullable=False)
    status = Column(String, nullable=False, default="Pending")  # Add status field


class FollowUpNote(Base):
    __tablename__ = "follow_up_notes"

    id = Column(Integer, primary_key=True, index=True)
    appointment_id = Column(String, ForeignKey("appointments.id"), nullable=False)  # Link to the appointment
    note = Column(Text, nullable=False)  # The follow-up note content
    doctor_id = Column(String, ForeignKey("users.doctor_id"), nullable=False)  # Link to the doctor
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # Timestamp for when the note was created    

class MedicationResponse(Base):
    __tablename__ = "medication_responses"

    id = Column(Integer, primary_key=True, index=True)
    medication_id = Column(String, ForeignKey("medications.id"), nullable=False)  # Link to the medication
    doctor_id = Column(String, ForeignKey("users.doctor_id"), nullable=False)  # Link to the doctor
    response = Column(Text, nullable=False)  # Doctor's response (e.g., notes, approval, etc.)
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # Timestamp for when the response was created    