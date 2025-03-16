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
    gender: str  # Add gender field

class NurseCreate(UserCreate):
    department: str
    role: str = "nurse"  # Fixed role for nurses
    license_number: str
    hospital: str
    experience: int

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