from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    # Register blueprints
    from app.routes.auth import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    from app.routes.patients import bp as patients_bp
    app.register_blueprint(patients_bp, url_prefix='/api/patients')

    from app.routes.doctors import bp as doctors_bp
    app.register_blueprint(doctors_bp, url_prefix='/api/doctors')

    from app.routes.nurses import bp as nurses_bp
    app.register_blueprint(nurses_bp, url_prefix='/api/nurses')

    from app.routes.appointments import bp as appointments_bp
    app.register_blueprint(appointments_bp, url_prefix='/api/appointments')

    from app.routes.admin import bp as admin_bp
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    @app.route('/api/health')
    def health_check():
        return {"status": "healthy"}

    return app