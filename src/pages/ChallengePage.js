// src/components/ChallengePage.js
import React, { useState } from 'react';
import { getFirestore, doc, collection, addDoc, updateDoc } from 'firebase/firestore';  // Firestore modular imports

const ChallengePage = ({ challengeId, user }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const db = getFirestore();  // Get Firestore instance
      const challengeRef = doc(db, 'challenges', challengeId);  // Reference to the challenge document

      // Placeholder for the logic to validate the code (Judge0 or other API)
      const flag = "12345";  // Example flag for algorithmic solution

      // Submit the solution to Firestore
      const submissionsRef = collection(challengeRef, 'submissions');
      await addDoc(submissionsRef, {
        userId: user.uid,
        solution: code,
        timestamp: new Date(),
      });

      // Validate the flag
      if (code === flag) {
        await updateDoc(challengeRef, {
          buildathonUnlocked: true,  // Unlock the Buildathon task
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
