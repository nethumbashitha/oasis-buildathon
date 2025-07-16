// src/utils/firebaseUtils.js
import { firestore } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

export const createChallenge = async (title, description) => {
  try {
    const challengeRef = collection(firestore, 'challenges');
    await addDoc(challengeRef, {
      title,
      description,
      buildathonUnlocked: false,
    });
  } catch (error) {
    throw new Error('Error creating challenge: ' + error.message);
  }
};
