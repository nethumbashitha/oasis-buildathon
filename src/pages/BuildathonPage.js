import React, { useState } from 'react';
import { firestore } from '../firebase';

const BuildathonPage = ({ challengeId, user }) => {
  const [githubLink, setGithubLink] = useState('');
  const [error, setError] = useState('');

  const handleGithubLinkChange = (e) => {
    setGithubLink(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!githubLink) {
        setError('Please provide a GitHub link.');
        return;
      }

      // Store the GitHub link in Firestore for the buildathon task submission
      await firestore.collection('submissions').add({
        userId: user.uid,
        challengeId,
        githubLink,
        timestamp: new Date(),
      });

      // Mark challenge as completed
      await firestore.collection('challenges').doc(challengeId).update({
        buildathonCompleted: true,
      });

      setError('');
      alert('Buildathon task submitted successfully!');
    } catch (err) {
      setError('Error submitting Buildathon task: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Buildathon Task</h2>
      <input
        type="text"
        value={githubLink}
        onChange={handleGithubLinkChange}
        placeholder="GitHub Repository Link"
      />
      <button onClick={handleSubmit}>Submit Solution</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default BuildathonPage;
