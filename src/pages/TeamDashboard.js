import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';

const TeamDashboard = ({ user }) => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      const snapshot = await firestore.collection('challenges').get();
      const challengesData = snapshot.docs.map(doc => doc.data());
      setChallenges(challengesData);
    };

    fetchChallenges();
  }, []);

  return (
    <div>
      <h2>Welcome, {user.displayName}</h2>
      <h3>Your Challenges</h3>
      <ul>
        {challenges.map((challenge, index) => (
          <li key={index}>
            <h4>{challenge.title}</h4>
            <p>{challenge.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamDashboard;
