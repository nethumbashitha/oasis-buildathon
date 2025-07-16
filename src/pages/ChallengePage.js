import React, { useState } from 'react';
import { firestore } from '../firebase';

const ChallengePage = ({ challengeId, user }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Placeholder: Implement logic for code validation (use services like Judge0)
      const flag = "12345"; // Example flag for algorithmic solution
      const challengeRef = firestore.collection('challenges').doc(challengeId);

      // Submit the flag to Firestore
      await challengeRef.collection('submissions').add({
        userId: user.uid,
        solution: code,
        timestamp: new Date(),
      });

      if (code === flag) {
        // Unlock the buildathon task if the flag is correct
        await challengeRef.update({
          buildathonUnlocked: true,
        });
        setOutput('Challenge solved! Buildathon task unlocked.');
      } else {
        setError('Incorrect flag. Please try again.');
      }
    } catch (err) {
      setError('Error submitting challenge: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Algorithmic Challenge</h2>
      <textarea
        value={code}
        onChange={handleCodeChange}
        placeholder="Write your solution here"
        rows="10"
        cols="50"
      />
      <button onClick={handleSubmit}>Submit Solution</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {output && <p>{output}</p>}
    </div>
  );
};

export default ChallengePage;
