import React from 'react';
import './Welcome.css';

const Welcome = () => {
    return (
        <div className="welcome-container">
            <header className="header">
                <h1>
                    Welcome to ZeeCare Medical Institute | Your Trusted Healthcare Provider
                </h1>
                <nav className="navbar">
                    <a href="#home">Home</a>
                    <a href="#appointment">Appointment</a>
                    <a href="#about">About Us</a>
                    <a href="#login" className="login-button">Login</a>
                </nav>
            </header>
            <div className="content">
                <div className="text">
                    <p>
                        ZeeCare Medical Institute is a state-of-the-art facility
                        dedicated to providing comprehensive healthcare services
                        with compassion and expertise. Our team of skilled
                        professionals is committed to delivering personalized
                        care tailored to each patient's needs. At ZeeCare, we
                        prioritize your well-being, ensuring a harmonious journey
                        towards optimal health and wellness.
                    </p>
                </div>
                <div className="image">
                    <img src="path-to-your-image.png" alt="Healthcare Professional" />
                </div>
            </div>
        </div>
    );
};

export default Welcome;