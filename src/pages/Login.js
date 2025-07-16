import React from 'react';
import { auth, firestore, googleProvider, signInWithPopup } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await firestore.collection('teams').doc(user.uid).set({
        teamName: user.displayName,
        email: user.email,
      });

      navigate('/team-dashboard');
    } catch (error) {
      console.error('Login failed: ', error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
