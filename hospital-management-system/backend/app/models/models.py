from sqlalchemy import Column, Integer, String
from app.utils.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    date_of_birth = Column(String, nullable=True)  # Allow NULL values
    phone = Column(String, nullable=False)
    address = Column(String, nullable=True)  # Allow NULL values
    role = Column(String, nullable=False, default="patient")  # Default role to "patient"
    status = Column(String, nullable=False, default="pending")  # Add status field


     # Doctor-specific fields
    specialization = Column(String, nullable=True)
    license_number = Column(String, unique=True, index=True, nullable=True)
    hospital = Column(String, nullable=True)
    experience = Column(Integer, nullable=True)

       # Nurse-specific fields
    department = Column(String, nullable=True)


    admin_code = Column(String, unique=True, nullable=True)  # Admin code field
    