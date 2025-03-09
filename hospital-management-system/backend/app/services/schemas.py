from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str
    date_of_birth: str
    phone: str
    address: str
    role: str = "patient"  # Default role

class DoctorCreate(UserCreate):
    specialization: str
    license_number: str
    hospital: str
    experience: int
    role: str = "doctor"  # Fixed role for doctors

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
    