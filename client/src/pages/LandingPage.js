import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleRegisterUser = () => {
        navigate('/register');
    };

    const handleRegisterDoctor = () => {
        navigate('/register-doctor');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to Our Service</h1>
            <button onClick={handleRegisterUser}>Register as User</button>
            <button onClick={handleRegisterDoctor}>Register as Doctor</button>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LandingPage;
