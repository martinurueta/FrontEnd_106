import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import './includes/main.css';



const Login: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSignup, setIsSignup] = useState(false);

    const handleLogin = async (username: string, password: string) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.status === 200) {
                setIsLoggedIn(true);
                window.location.href = '/';

                
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSignup = async (username: string, password: string) => {
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.status === 201) {
                alert('Account created successfully');
                setIsSignup(false);
            } else {
                const data = await response.json();
                const errorMessage = data.message;
                if (errorMessage.includes('Username must be')) {
                    alert(errorMessage);
                } else if (errorMessage.includes('Password must be')) {
                    alert(errorMessage);
                } else {
                    alert('Error creating account');
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <div className="content">
                {isLoggedIn ? (
                    <h1 className="text-content">You logged in congrats!</h1>

                ) : isSignup ? (
                    <SignupForm onSignup={handleSignup} onCancel={() => setIsSignup(false)} />
                ) : (
                    <>
                        <LoginForm onLogin={handleLogin} />
                        <br />
                        <h4 style={{ marginBottom: '3px', justifyContent: 'center', display: 'flex' }}>Don't have an account? </h4>
                        <button style={{ marginTop: '0px' }} className="custom-btn btn-1" onClick={() => setIsSignup(true)}>Create an account</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;