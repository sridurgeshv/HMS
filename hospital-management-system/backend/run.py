from app import create_app, db
from app.models import User, Patient, Doctor, Nurse, Appointment

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {
        'db': db, 
        'User': User, 
        'Patient': Patient, 
        'Doctor': Doctor, 
        'Nurse': Nurse, 
        'Appointment': Appointment
    }

if __name__ == '__main__':
    app.run(debug=True)