// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';  // Modular Firestore imports

const AdminDashboard = () => {
  const [challenges, setChallenges] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const db = getFirestore();  // Get Firestore instance
        const challengesCollection = collection(db, 'challenges');  // Get collection reference
        const snapshot = await getDocs(challengesCollection);  // Fetch documents from the collection
        const challengesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChallenges(challengesData);  // Update state with fetched challenges
      } catch (err) {
        setError('Failed to load challenges: ' + err.message);
      }
    };

    fetchChallenges();  // Fetch challenges when the component mounts
  }, []);

  const handleCreateChallenge = async () => {
    try {
      const newChallenge = {
        title,
        description,
        buildathonUnlocked: false,
      };

      const db = getFirestore();  // Get Firestore instance
      await addDoc(collection(db, 'challenges'), newChallenge);  // Add new challenge to Firestore
      setChallenges([...challenges, newChallenge]);  // Update the challenges list in the state
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Failed to create challenge: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Create New Challenge</h3>
      <input
        type="text"
        placeholder="Challenge Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Challenge Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleCreateChallenge}>Create Challenge</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Challenges</h3>
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

export default AdminDashboard;
