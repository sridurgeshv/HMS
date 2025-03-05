from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware
from app.routes.routes import router
from app.utils.database import Base, engine

app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any frontend (public API)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include routes
app.include_router(router)