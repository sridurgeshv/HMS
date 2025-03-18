from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional,List

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str
    date_of_birth: str
    phone: str
    address: str
    role: str = "patient"  # Default role
    status: str = "pending"  # Default status
    age: int  # Ensure this is an integer
    gender: str
    

class DegreeCreate(BaseModel):
    degree: str
    university: str
    year: int    

class DoctorCreate(UserCreate):
    specialization: str
    license_number: str
    hospital: str
    experience: int
    role: str = "doctor"  # Fixed role for doctors
    degrees: List[DegreeCreate]

    

class NurseCreate(UserCreate):
    department: str
    role: str = "nurse"  # Fixed role for nurses
    license_number: str
    hospital: str
    experience: int
    license_expiry: Optional[date] = None
    certification: Optional[str] = None
    start_date: Optional[date] = None
    employee_id: Optional[str] = None
    title: Optional[str] = None
    skills: Optional[List[str]] = None  # List of strings
    languages: Optional[List[str]] = None  # List of strings
    education: Optional[List[str]] = None  # List of strings

class AdminCreate(BaseModel):
    role: str = "admin"
    department: str
    admin_code: str  # Ensure this field is required 
    username: str
    email: EmailStr
    password: str
    full_name: str
    phone: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class AppointmentCreate(BaseModel):
    patient_id: str
    doctor_name: Optional[str] = None  # ✅ Now allows None
    department: str
    date: datetime
    time: str
    reason: str


class MedicalHistoryCreate(BaseModel):
    visit_date: date
    doctor_name: str
    notes: Optional[str]
    medications: Optional[str]


class AIRequest(BaseModel):
    prompt: str


class MedicationCreate(BaseModel):
    name: str
    dosage: str
    frequency: str
    status: str = "Pending"  # Default status

# Define a Pydantic model for the request body
class MedicationStatusUpdate(BaseModel):
    status: str   

class FollowUpNoteCreate(BaseModel):
    appointment_id: int
    note: str
    doctor_id: str

class FollowUpNoteResponse(BaseModel):
    id: int
    appointment_id: int
    note: str
    doctor_id: str
    created_at: datetime

    class Config:
        from_attributes = True    