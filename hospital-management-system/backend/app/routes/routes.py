from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.utils.database import get_db
from app.models.models import User
from app.services.schemas import UserCreate
from app.services.services import get_password_hash
from app.services.schemas import DoctorCreate
from app.services.schemas import NurseCreate
from app.services.schemas import AdminCreate
from app.services.schemas import UserLogin
from app.models.models import Appointment
from app.services.schemas import AppointmentCreate
from app.services.services import verify_password
from app.models.models import MedicalHistory
from app.services.schemas import MedicalHistoryCreate
import uuid
from transformers import AutoModelForCausalLM, AutoTokenizer
from app.services.schemas import AIRequest
from app.models.models import Medication
from app.services.schemas import MedicationCreate

router = APIRouter()

# Load the Microsoft Phi-4-mini-instruct model
model_name = "microsoft/Phi-4-mini-instruct"
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype="auto",
    device_map="auto",
    trust_remote_code=True
)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Signup route
@router.post("/signup/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_password = get_password_hash(user.password)
    
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        date_of_birth=user.date_of_birth,
        phone=user.phone,
        address=user.address,
        role="patient",  # Fixed role
        status="approved"  ,# Patients are approved by default
        patient_id=str(uuid.uuid4())[:8]  # Generate unique patient ID
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {"message": "User created successfully", "username": db_user.username, "patient_id": db_user.patient_id}

@router.get("/user-profile/{username}")
def get_user_profile(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "username": user.username,
        "full_name": user.full_name,
        "date_of_birth": user.date_of_birth,
        "email": user.email,
        "phone": user.phone,
        "address": user.address,
        "patient_id": user.patient_id
    }


@router.post("/doctorsignup/")
def create_doctor(doctor: DoctorCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == doctor.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    existing_license = db.query(User).filter(User.license_number == doctor.license_number).first()
    if existing_license:
        raise HTTPException(status_code=400, detail="License number already registered")

    hashed_password = get_password_hash(doctor.password)
    
    new_doctor = User(
        username=doctor.username,
        email=doctor.email,
        hashed_password=hashed_password,
        full_name=doctor.full_name,
        date_of_birth=doctor.date_of_birth,
        phone=doctor.phone,
        address=doctor.address,
        specialization=doctor.specialization,
        license_number=doctor.license_number,
        hospital=doctor.hospital,
        experience=doctor.experience,
        role="doctor" , # Ensure role is fixed
        status="pending"  # Doctors need admin approval
    )

    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)

    return {"message": "Doctor registered successfully, pending admin approval"}

@router.post("/nursesignup/")
def create_nurse(nurse: NurseCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == nurse.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    existing_license = db.query(User).filter(User.license_number == nurse.license_number).first()
    if existing_license:
        raise HTTPException(status_code=400, detail="License number already registered")

    hashed_password = get_password_hash(nurse.password)
    
    new_nurse = User(
        username=nurse.username,
        email=nurse.email,
        hashed_password=hashed_password,
        full_name=nurse.full_name,
        date_of_birth=nurse.date_of_birth,
        phone=nurse.phone,
        address=nurse.address,
        department=nurse.department,
        license_number=nurse.license_number,
        hospital=nurse.hospital,
        experience=nurse.experience,
        role="nurse" , # Ensure role is fixed
        status="pending"  # Nurses need admin approval
    )

    db.add(new_nurse)
    db.commit()
    db.refresh(new_nurse)

    return {"message": "Nurse registered successfully, pending admin approval"}


@router.post("/adminsignup/")
def create_admin(admin: AdminCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == admin.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_password = get_password_hash(admin.password)
    
    new_admin = User(
        username=admin.username,
        email=admin.email,
        hashed_password=hashed_password,
        full_name=admin.full_name,
        phone=admin.phone,
        role="admin",  # Fixed role
        department=admin.department,
        admin_code=admin.admin_code , # Ensure this field is required
        status="approved"  # Admins are approved by default
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return {"message": "Admin created successfully", "username": new_admin.username}

@router.post("/login/")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Only block login if the user is a doctor or nurse with pending status
    if db_user.role in ["doctor", "nurse"] and db_user.status != "approved":
        raise HTTPException(status_code=403, detail="Your account is pending approval")
    
    return {"message": "Login successful", "role": db_user.role, "status": db_user.status , "patient_id": db_user.patient_id if db_user.role == "patient" else None}

@router.get("/pending-registrations/")
def get_pending_registrations(db: Session = Depends(get_db)):
    pending_users = db.query(User).filter(User.status == "pending").all()
    return pending_users

@router.post("/approve-registration/{user_id}")
def approve_registration(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update the status to "approved"
    print(f"Before approval: {db_user.status}")  # Should be "pending"
    db_user.status = "approved"
    db.commit()
    db.refresh(db_user)
    print(f"After approval: {db_user.status}")  # Should be "approved"

    return {"message": "User approved successfully"}

@router.post("/reject-registration/{user_id}")
def reject_registration(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.status = "rejected"
    db.commit()
    db.refresh(db_user)

    return {"message": "User rejected successfully"}


 # Route to fetch doctors based on department
@router.get("/doctors/{department}")
def get_doctors_by_department(department: str, db: Session = Depends(get_db)):
    doctors = db.query(User).filter(
        User.role == "doctor",
        User.specialization.ilike(f"%{department}%"), # Case insensitive match
        User.status == "approved"
    ).all()
    return doctors

@router.post("/book-appointment/")
def book_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    if appointment.doctor_name and appointment.doctor_name != "no-doctor":  
        assigned_doctor = appointment.doctor_name
    else:
        # Query for an available doctor
        doctor = db.query(User).filter(
            User.role == "doctor",
            User.specialization == appointment.department,
            User.status == "approved"
        ).first()

        assigned_doctor = doctor.full_name if doctor else None  # Ensure `None` is stored properly

    # Create a new appointment record
    new_appointment = Appointment(
        patient_id=appointment.patient_id,
        doctor_name=assigned_doctor if assigned_doctor else None,  # Store as `NULL` in DB
        department=appointment.department,
        date=appointment.date,
        time=appointment.time,
        reason=appointment.reason
    )

    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)

    return {
        "message": "Appointment booked successfully",
        "doctor": new_appointment.doctor_name if new_appointment.doctor_name else "Doctor will be assigned when available"
    }

@router.get("/appointments/{patient_id}")
def get_all_appointments(patient_id: str, db: Session = Depends(get_db)):
    appointments = db.query(Appointment).filter(
        Appointment.patient_id == patient_id
    ).order_by(Appointment.date.desc()).all()

    return appointments if appointments else []  # Ensure empty list if no data

@router.delete("/cancel-appointment/{appointment_id}")
def cancel_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    db.delete(appointment)
    db.commit()

    return {"message": "Appointment cancelled successfully"}

# Get medical history for a patient
@router.get("/medical-history/{patient_id}")
def get_medical_history(patient_id: str, db: Session = Depends(get_db)):
    patient = db.query(User).filter(User.patient_id == patient_id, User.role == "patient").first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    medical_records = db.query(MedicalHistory).filter(MedicalHistory.patient_id == patient_id).all()
    
    if not medical_records:
        raise HTTPException(status_code=404, detail="No medical history found for this patient")
    
    return medical_records

# Add new medical history entry for a patient
@router.post("/medical-history/{patient_id}")
def add_medical_history(patient_id: str, history: MedicalHistoryCreate, db: Session = Depends(get_db)):
    patient = db.query(User).filter(User.patient_id == patient_id, User.role == "patient").first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    new_record = MedicalHistory(
        id=str(uuid.uuid4()),  # Unique ID for each history entry
        patient_id=patient_id,
        visit_date=history.visit_date,
        doctor_name=history.doctor_name,
        notes=history.notes,
        medications=history.medications
    )

    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return {"message": "Medical history added successfully"}

@router.post("/ai")
async def ask_ai(request: AIRequest):
    messages = [{"role": "user", "content": request.prompt}]
    text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    model_inputs = tokenizer([text], return_tensors="pt").to(model.device)

    generated_ids = model.generate(
        **model_inputs,
        max_new_tokens=100,
        temperature=0.7,
        do_sample=True
    )

    generated_ids = [output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)]
    response = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]

    return {"response": response}

# Add Medication Route
@router.post("/medications/{patient_id}")
def add_medication(patient_id: str, medication: MedicationCreate, db: Session = Depends(get_db)):
    patient = db.query(User).filter(User.patient_id == patient_id, User.role == "patient").first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    # Check if the patient already has a medication record

    new_med = Medication(
        id=str(uuid.uuid4())[:8],
        patient_id=patient_id,  # Generate unique ID
        name=medication.name,
        dosage=medication.dosage,
        frequency=medication.frequency,
        
    )

    db.add(new_med)
    db.commit()
    db.refresh(new_med)
    return {"message": "Medication added successfully", "medication": new_med}

# Fetch Medications for a Patient
@router.get("/medications/{patient_id}")
def get_medical_history(patient_id: str, db: Session = Depends(get_db)):
    patient = db.query(User).filter(User.patient_id == patient_id, User.role == "patient").first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    medical_records = db.query(Medication).filter(Medication.patient_id == patient_id).all()
    
    return medical_records if medical_records else []  # Return an empty list instead of 404