import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './firebase';
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
        <Route path="/" element={user ? <TeamDashboard /> : <Login />} />
        <Route path="/team-dashboard" element={<TeamDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
