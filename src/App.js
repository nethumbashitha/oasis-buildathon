import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth } from './firebase'; // Import authentication
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import TeamDashboard from './pages/TeamDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);  // Listen for auth state change
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? (user.email === "admin@example.com" ? <AdminDashboard /> : <TeamDashboard user={user} />) : <Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/team-dashboard" element={user ? <TeamDashboard user={user} /> : <Login />} />
        <Route path="/admin-dashboard" element={user && user.email === "admin@example.com" ? <AdminDashboard /> : <AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
