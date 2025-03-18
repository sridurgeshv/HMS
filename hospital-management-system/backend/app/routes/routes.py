from fastapi import APIRouter, Depends, HTTPException, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.utils.database import get_db
from app.models.models import User, Degree
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
from app.models.models import Medication , FollowUpNote
from app.services.schemas import MedicationCreate , FollowUpNoteCreate , FollowUpNoteResponse
from typing import List
import json
from app.services.schemas import MedicationStatusUpdate

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



# Initialize FastAPI App
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(router)

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
        age=user.age,  # Ensure this is correctly assigned
        gender=user.gender,  # Ensure this is correctly assigned
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

    # Normalize specialization
    doctor.specialization = doctor.specialization.strip().lower()
    
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
        role="doctor",
        status="pending",
        doctor_id=str(uuid.uuid4())[:8],
        age=doctor.age,  # Ensure this is correctly assigned
        gender=doctor.gender,  # Ensure this is correctly assigned
    )

    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)

    # Debug: Log the specialization before updating appointments
    print(f"Doctor Specialization (normalized): {doctor.specialization}")

    # Fixing the query by ensuring case-insensitive comparison and proper NULL check
    appointments_to_update = db.query(Appointment).filter(
        Appointment.department.ilike(doctor.specialization),  # Case-insensitive match
        Appointment.doctor_name.is_(None)  # Correct NULL check
    ).all()

    # Debug: Check appointments found for updating
    print(f"Appointments found for updating: {len(appointments_to_update)}")

    if appointments_to_update:
        updated_appointments = db.query(Appointment).filter(
            Appointment.department.ilike(doctor.specialization),
            Appointment.doctor_name.is_(None),
            Appointment.doctor_id.is_(None)
        ).update(
            {
                Appointment.doctor_name: new_doctor.full_name,  # Update doctor_name
                Appointment.doctor_id: new_doctor.doctor_id,  # Update doctor_id
            },
            synchronize_session=False
        )

        db.commit()

        # Debug: Log the number of updated appointments
        print(f"Updated {updated_appointments} appointments with doctor_name and doctor_id.")
    else:
        print("No appointments found to update.")

    for degree in doctor.degrees:
        new_degree = Degree(
            degree=degree.degree,
            university=degree.university,
            year=degree.year,
            user_id=new_doctor.id
        )
        db.add(new_degree)

    db.commit()

    return {
        "message": "Doctor registered successfully, pending admin approval",
        "doctor_id": new_doctor.doctor_id
    }

@router.get("/doctor/{doctor_id}")
def get_doctor_profile(doctor_id: str, db: Session = Depends(get_db)):
    # Fetch the doctor's details from the database
    doctor = db.query(User).filter(User.doctor_id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    # Fetch the doctor's degrees
    degrees = db.query(Degree).filter(Degree.user_id == doctor.id).all()

    # Prepare the response
    doctor_profile = {
        "name": doctor.full_name,
        "specialty": doctor.specialization,
        "email": doctor.email,
        "phone": doctor.phone,
        "address": doctor.address,
        "dob": doctor.date_of_birth,
        "gender": doctor.gender, 
        "licenseNumber": doctor.license_number,
        "education": [
            {
                "degree": degree.degree,
                "university": degree.university,
                "year": degree.year
            }
            for degree in degrees
        ]
    }

    return doctor_profile    

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
        status="pending",
        age=nurse.age,
        gender=nurse.gender,
        license_expiry=nurse.license_expiry,
        certification=nurse.certification,
        start_date=nurse.start_date,
        employee_id=nurse.employee_id,
        title=nurse.title,
        skills=json.dumps(nurse.skills) if nurse.skills else None,  # Convert list to JSON string
        languages=json.dumps(nurse.languages) if nurse.languages else None,  # Convert list to JSON string
        education=json.dumps(nurse.education) if nurse.education else None ,  # Convert list to JSON string 
        nurse_id=str(uuid.uuid4())[:8] 
    )

    db.add(new_nurse)
    db.commit()
    db.refresh(new_nurse)

    return {"message": "Nurse registered successfully, pending admin approval" , "nurse_id": new_nurse.nurse_id}


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
        status="approved" ,  # Admins are approved by default
        admin_id=str(uuid.uuid4())[:8] 
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return {"message": "Admin created successfully", "username": new_admin.username , "admin_id": new_admin.admin_id}

@router.post("/login/")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Only block login if the user is a doctor or nurse with pending status
    if db_user.role in ["doctor", "nurse"] and db_user.status != "approved":
        raise HTTPException(status_code=403, detail="Your account is pending approval")
    
    return {"message": "Login successful", "role": db_user.role, "status": db_user.status , "patient_id": db_user.patient_id if db_user.role == "patient" else None, "username": db_user.username if db_user.role == "patient" else None , "doctor_id": db_user.doctor_id if db_user.role == "doctor" else None , "nurse_id": db_user.nurse_id  if db_user.role == "nurse" else None , "admin_id": db_user.admin_id  if db_user.role == "admin" else None }

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

    appointment.department = appointment.department.strip().lower()

    if appointment.doctor_name and appointment.doctor_name != "no-doctor":  
        assigned_doctor = appointment.doctor_name
    else:
        # Query for an available doctor
        doctor = db.query(User).filter(
            User.role == "doctor",
            User.specialization.ilike(appointment.department),  # Case-insensitive match
            User.status == "approved"
        ).first()

        assigned_doctor = doctor.full_name if doctor else None  # Ensure `None` is stored properly

    # Create a new appointment record
    new_appointment = Appointment(
        patient_id=appointment.patient_id,
        doctor_name=assigned_doctor ,
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
        status="pending",
        
    )

    db.add(new_med)
    db.commit()
    db.refresh(new_med)
    return {"message": "Medication added successfully", "medication": new_med}

# Fetch Medications for a Patient
@router.get("/medications/{patient_id}")
def get_medications(patient_id: str, db: Session = Depends(get_db)):  # Changed function name from get_medical_history
    patient = db.query(User).filter(User.patient_id == patient_id, User.role == "patient").first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    medical_records = db.query(Medication).filter(Medication.patient_id == patient_id).all()
    
    return medical_records if medical_records else []

@router.get("/doctor-patients/{doctor_id}")
def get_doctor_patients(doctor_id: str, db: Session = Depends(get_db)):
    # Fetch the doctor's specialization
    doctor = db.query(User).filter(User.doctor_id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    specialization = doctor.specialization

    # Fetch patients with appointments in the same department/specialization
    patients = db.query(User).join(Appointment, User.patient_id == Appointment.patient_id).filter(
        Appointment.department.ilike(specialization)
    ).distinct().all()

    if not patients:
        raise HTTPException(status_code=404, detail="No patients found for this specialization")

    # Fetch medical history for each patient
    patient_details = []
    for patient in patients:
        medical_history = db.query(MedicalHistory).filter(
            MedicalHistory.patient_id == patient.patient_id
        ).all()

        # Format medical history data
        history_data = [{
            "visit_date": history.visit_date,
            "medications": history.medications
        } for history in medical_history]

        patient_details.append({
            "id": patient.id,
            "full_name": patient.full_name,
            "age": patient.age,
            "gender": patient.gender,
            "phone": patient.phone,
            "email": patient.email,
            "medical_history": history_data
        })

    return patient_details

@router.get("/doctor-appointments/{doctor_id}")
def get_doctor_appointments(doctor_id: str, db: Session = Depends(get_db)):
    # Fetch the doctor's details
    doctor = db.query(User).filter(User.doctor_id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    # Normalize specialization for consistent matching
    specialization = doctor.specialization.strip().lower()

    # Debug: Log the doctor's specialization
    print(f"Doctor Specialization (normalized): {specialization}")

    # Fetch appointments for the doctor's department using case-insensitive matching
    appointments = db.query(Appointment).filter(
        Appointment.department.ilike(specialization),
        Appointment.doctor_name == doctor.full_name  # Ensures doctor is assigned
    ).order_by(Appointment.date.desc()).all()

    # Debug: Log the number of appointments found
    print(f"Found {len(appointments)} appointments")

    # Return an empty list if no appointments are found
    if not appointments:
        return []

    # Format the appointments data
    formatted_appointments = [
        {
            "id": appointment.id,
            "patient": appointment.patient_id,  # Replace with patient name if needed
            "time": appointment.time,
            "date": appointment.date,
             "status": "Confirmed",
            "type": appointment.reason  # Use reason as the appointment type
        }
        for appointment in appointments
    ]

    return formatted_appointments

@router.get("/doctor-medications/{doctor_id}")
def get_doctor_patient_medications(
    doctor_id: str,
    db: Session = Depends(get_db)
):
    # Fetch the doctor's specialization
    doctor = db.query(User).filter(User.doctor_id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    specialization = doctor.specialization

    # Fetch patients in the same department
    patients = db.query(User).join(Appointment, User.patient_id == Appointment.patient_id).filter(
        Appointment.department.ilike(specialization)
    ).distinct().all()

    if not patients:
        raise HTTPException(status_code=404, detail="No patients found for this specialization")

    # Fetch medications for each patient
    patient_medications = []
    for patient in patients:
        medications = db.query(Medication).filter(
            Medication.patient_id == patient.patient_id
        ).all()

        patient_medications.append({
            "patient_id": patient.patient_id,
            "full_name": patient.full_name,
            "medications": [
                {
                    "name": med.name,
                    "dosage": med.dosage,
                    "frequency": med.frequency
                }
                for med in medications
            ]
        })

    return patient_medications

@router.get("/nurse/{nurse_id}")
def get_nurse_by_id(nurse_id: str, db: Session = Depends(get_db)):
    nurse = db.query(User).filter(User.nurse_id == nurse_id).first()
    if not nurse:
        raise HTTPException(status_code=404, detail="Nurse not found")
    
    return {
        "name": nurse.full_name,
        "title": nurse.title,
        "department": nurse.department,
        "employeeId": nurse.employee_id,
        "email": nurse.email,
        "phone": nurse.phone,
        "startDate": nurse.start_date,
        "certification": nurse.certification,
        "licenseNumber": nurse.license_number,
        "licenseExpiry": nurse.license_expiry,
        "education": json.loads(nurse.education) if nurse.education else [],
        "skills": json.loads(nurse.skills) if nurse.skills else [],
        "languages": json.loads(nurse.languages) if nurse.languages else [],
    }

@router.get("/medications")
def get_all_medications(db: Session = Depends(get_db)):
    medications = db.query(Medication).all()
    return medications if medications else []

@router.put("/medications/{medication_id}")
def update_medication_status(
    medication_id: str,
    status_update: MedicationStatusUpdate,  # Use the Pydantic model for validation
    db: Session = Depends(get_db)
):
    medication = db.query(Medication).filter(Medication.id == medication_id).first()
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")
    
    # Update the status
    medication.status = status_update.status
    db.commit()
    db.refresh(medication)
    
    return {"message": "Medication status updated successfully", "medication": medication}

@router.get("/doctors-with-patient-counts")
def get_doctors_with_patient_counts(db: Session = Depends(get_db)):
    # Fetch all doctors
    doctors = db.query(User).filter(User.role == "doctor").all()
    if not doctors:
        raise HTTPException(status_code=404, detail="No doctors found")

    # Fetch patient counts for each doctor
    doctor_details = []
    for doctor in doctors:
        patient_count = db.query(Appointment).filter(
            Appointment.doctor_id == doctor.doctor_id
        ).distinct(Appointment.patient_id).count()

        doctor_details.append({
            "doctor_name": doctor.full_name,  # Fetch from User table
            "department": doctor.specialization,  # Fetch from User table
            "patient_count": patient_count
        })

    return doctor_details

@router.get("/admin/{admin_id}")
def get_admin_by_id(admin_id: str, db: Session = Depends(get_db)):
    admin = db.query(User).filter(User.admin_id == admin_id, User.role == "admin").first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    return {
        "full_name": admin.full_name,
        "email": admin.email,
        "phone": admin.phone,
        "role": admin.role,
        "department": admin.department,
        "admin_code": admin.admin_code
    }   

@router.get("/doctors/")
def get_doctors(db: Session = Depends(get_db)):
    doctors = db.query(User).filter(User.role == "doctor").all()
    return doctors

@router.get("/nurses/")
def get_nurses(db: Session = Depends(get_db)):
    nurses = db.query(User).filter(User.role == "nurse").all()
    return nurses    

@router.get("/users/")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).filter(User.role != "admin").all()
    return users

@router.post("/follow-up-notes", response_model=FollowUpNoteResponse)
def create_follow_up_note(note: FollowUpNoteCreate, db: Session = Depends(get_db)):
    db_note = FollowUpNote(
        appointment_id=note.appointment_id,
        note=note.note,
        doctor_id=note.doctor_id
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@router.get("/follow-up-notes", response_model=list[FollowUpNoteResponse])
def get_follow_up_notes(db: Session = Depends(get_db)):
    notes = db.query(FollowUpNote).all()
    return notes   


@router.get("/appointments", response_model=list[dict])
def get_all_appointments(db: Session = Depends(get_db)):
    appointments = db.query(Appointment).all()
    
    if not appointments:
        return []
    
    formatted_appointments = [
        {
            "id": appointment.id,
            "patient": appointment.patient_id,  # Replace with patient name if needed
            "time": appointment.time,
            "date": appointment.date,
            "status": "Confirmed",  # Default status
            "type": appointment.reason , # Use reason as the appointment type
            "doctor": appointment.doctor_name
        }
        for appointment in appointments
    ]
    
    return formatted_appointments