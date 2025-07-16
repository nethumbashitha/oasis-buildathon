import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';

const AdminDashboard = () => {
  const [challenges, setChallenges] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [buildathonUnlocked, setBuildathonUnlocked] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const snapshot = await firestore.collection('challenges').get();
        const challengesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChallenges(challengesData);
      } catch (err) {
        setError('Failed to load challenges: ' + err.message);
      }
    };
    fetchChallenges();
  }, []);

  const handleCreateChallenge = async () => {
    try {
      const newChallenge = {
        title,
        description,
        buildathonUnlocked,
      };
      await firestore.collection('challenges').add(newChallenge);
      setTitle('');
      setDescription('');
      setBuildathonUnlocked(false);
      // Refetch challenges after adding the new one
      const snapshot = await firestore.collection('challenges').get();
      const challengesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChallenges(challengesData);
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
      <label>
        Unlock Buildathon Task:
        <input
          type="checkbox"
          checked={buildathonUnlocked}
          onChange={() => setBuildathonUnlocked(!buildathonUnlocked)}
        />
      </label>
      <button onClick={handleCreateChallenge}>Create Challenge</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Challenges</h3>
      <ul>
        {challenges.map((challenge) => (
          <li key={challenge.id}>
            <h4>{challenge.title}</h4>
            <p>{challenge.description}</p>
            <button>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
