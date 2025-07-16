// src/components/TeamDashboard.js
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';  // Firestore modular imports

const TeamDashboard = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const db = getFirestore();  // Get Firestore instance
        const challengesCollection = collection(db, 'challenges');  // Reference the challenges collection
        const snapshot = await getDocs(challengesCollection);  // Fetch challenges
        const challengesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChallenges(challengesData);  // Update state with the challenges data
      } catch (error) {
        console.error('Error fetching challenges: ', error);
      }
    };

    fetchChallenges();  // Fetch challenges when component mounts
  }, []);  // Empty dependency array to run once

  return (
    <div>
      <h2>Your Challenges</h2>
      <ul>
        {challenges.map((challenge) => (
          <li key={challenge.id}>
            <h4>{challenge.title}</h4>
            <p>{challenge.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamDashboard;
