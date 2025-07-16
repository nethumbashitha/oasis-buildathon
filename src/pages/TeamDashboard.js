import React from 'react';
import { auth, firestore, googleProvider, signInWithPopup } from '../firebase';
import { useHistory } from 'react-router-dom'; // Optional, for navigation

const Login = () => {
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Optionally, save user data to Firestore
      await firestore.collection('teams').doc(user.uid).set({
        teamName: user.displayName,
        email: user.email,
      });

      // Redirect to the team dashboard after login
      history.push('/team-dashboard'); // Adjust routing based on your app's setup
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

export default Login;
