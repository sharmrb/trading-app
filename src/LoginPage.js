import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const navigate = useNavigate();
  const handleLogin = () => {
    try {
      loginUser();
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login');
    }
  };

  const loginUser = async () => {
    const response = await fetch('http://localhost:3050/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, mfaCode }),
    });

    if (response.ok) {
      alert('Login successful');
      // Redirect to the stock input page or perform other actions
    } else {
      const data = await response.json();
      alert(`Login failed: ${data.error}`);
    }
  };

  const handleSkip = () => {
    navigate('/', { replace: true });
  };

  return (
    <body className="login-page">
        <div></div>
      <div className="login-container">
        
        <div className="login-box">
            <h2>Day Trading App</h2>
            <h5>Enter your Robinhood credentials</h5>
          <form>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />

            <label htmlFor="password">Password:</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <label htmlFor="mfaCode">MFA Code:</label>
            <input type="text" id="mfaCode" value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} />

            <button type="button" onClick={handleLogin}>
              Login
            </button>
            <button type="button" onClick={handleSkip}>
              Skip
            </button>
          </form>
        </div>
      </div>
    </body>
  );
};

export default LoginPage;