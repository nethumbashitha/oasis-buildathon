// src/components/LeaderboardPage.js
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const db = getFirestore();
        const leaderboardCollection = collection(db, 'leaderboard');
        const snapshot = await getDocs(leaderboardCollection);
        const leaderboardData = snapshot.docs.map(doc => doc.data());
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map((team, index) => (
          <li key={index}>
            {team.name} - {team.points} points
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderboardPage;
