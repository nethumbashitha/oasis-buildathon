import React, { useState } from 'react';
import { auth, googleProvider, signInWithPopup } from '../firebase';  // Importing from firebase.js
import { useNavigate } from 'react-router-dom';  // For redirection after login

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Redirect user based on role (Admin or Team)
      if (user.email === "admin@example.com") {
        navigate('/admin-dashboard');
      } else {
        navigate('/team-dashboard');
      }
    } catch (err) {
      setError('Login failed: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Login with Google</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
