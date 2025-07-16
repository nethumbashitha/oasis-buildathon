import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import TeamDashboard from './pages/TeamDashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <TeamDashboard user={user} /> : <Login />} />
        <Route path="/team-dashboard" element={user ? <TeamDashboard user={user} /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;
