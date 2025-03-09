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
from app.services.services import verify_password

router = APIRouter()

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
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {"message": "User created successfully", "username": db_user.username}


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
        role="doctor"  # Ensure role is fixed
    )

    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)

    return {"message": "Doctor registered successfully"}

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
        role="nurse"  # Ensure role is fixed
    )

    db.add(new_nurse)
    db.commit()
    db.refresh(new_nurse)

    return {"message": "Nurse registered successfully"}


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
        admin_code=admin.admin_code  # Ensure this field is required

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
    
    return {"message": "Login successful", "role": db_user.role}