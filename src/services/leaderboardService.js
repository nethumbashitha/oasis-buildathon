import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  doc, 
  updateDoc, 
  serverTimestamp,
  where,
  getDoc,
  arrayUnion
} from 'firebase/firestore';
import { db } from '../firebase';

// Point values for different achievements
const POINTS = {
  ALGORITHMIC_CHALLENGE: 100,  // Points for solving algorithmic challenge
  BUILDATHON_CHALLENGE: 150,   // Points for completing buildathon challenge
  SPEED_BONUS: 50,            // Bonus points for quick submissions
  FIRST_SOLVER_BONUS: 75      // Bonus for being first to solve
};

/**
 * Fetches the leaderboard data with teams sorted by points in descending order
 * @param {number} limitCount - Number of top teams to fetch
 * @returns {Promise<Array>} Array of team objects with their data
 */
export const getLeaderboard = async (limitCount = 10) => {
  try {
    const teamsRef = collection(db, 'teams');
    const q = query(
      teamsRef, 
      where('role', '==', 'team'),
      orderBy('points', 'desc'),
      orderBy('lastSubmissionTime', 'asc'), // Break ties by submission time
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(docSnapshot => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        teamName: data.teamName,
        points: data.points || 0,
        algorithmicChallengesCompleted: (data.completedChallenges?.filter(c => c.type === 'algorithmic')?.length || 0),
        buildathonChallengesCompleted: (data.completedChallenges?.filter(c => c.type === 'buildathon')?.length || 0),
        lastSubmissionTime: data.lastSubmissionTime,
        rank: null // Will be filled in by the caller
      };
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

/**
 * Updates a team's points in the database
 * @param {string} teamId - The ID of the team to update
 * @param {number} points - The new points value
 * @returns {Promise<boolean>} True if update was successful
 */
export const recordChallengeCompletion = async (teamId, challengeId, challengeType, isFirstSolver = false) => {
  try {
    const teamRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      throw new Error('Team not found');
    }

    const currentTime = new Date();
    const teamData = teamDoc.data();
    
    // Calculate points based on challenge type
    let pointsToAdd = challengeType === 'algorithmic' ? 
      POINTS.ALGORITHMIC_CHALLENGE : 
      POINTS.BUILDATHON_CHALLENGE;

    // Add first solver bonus if applicable
    if (isFirstSolver) {
      pointsToAdd += POINTS.FIRST_SOLVER_BONUS;
    }

    // Add speed bonus if completed within first hour of attempt
    const attemptStartTime = teamData.challengeAttempts?.[challengeId]?.startTime;
    if (attemptStartTime) {
      const timeTaken = currentTime - new Date(attemptStartTime);
      if (timeTaken <= 3600000) { // 1 hour in milliseconds
        pointsToAdd += POINTS.SPEED_BONUS;
      }
    }

    const completion = {
      challengeId,
      type: challengeType,
      completedAt: currentTime.toISOString(),
      pointsEarned: pointsToAdd,
      isFirstSolver
    };

    await updateDoc(teamRef, {
      points: (teamData.points || 0) + pointsToAdd,
      lastSubmissionTime: currentTime.toISOString(),
      completedChallenges: arrayUnion(completion),
      updatedAt: serverTimestamp()
    });

    return {
      success: true,
      pointsEarned: pointsToAdd,
      newTotal: (teamData.points || 0) + pointsToAdd
    };
  } catch (error) {
    console.error('Error recording challenge completion:', error);
    throw error;
  }
};

/**
 * Increments a team's points by a specified amount
 * @param {string} teamId - The ID of the team
 * @param {number} pointsToAdd - Points to add to the current total
 * @returns {Promise<boolean>} True if increment was successful
 */
export const incrementTeamPoints = async (teamId, pointsToAdd) => {
  try {
    const teamRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      throw new Error('Team not found');
    }

    const currentPoints = teamDoc.data().points || 0;
    await updateDoc(teamRef, {
      points: currentPoints + pointsToAdd,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error incrementing team points:', error);
    throw error;
  }
};

/**
 * Get a team's current rank on the leaderboard
 * @param {string} teamId - The ID of the team
 * @returns {Promise<number>} The team's current rank (1-based)
 */
export const getTeamRank = async (teamId) => {
  try {
    // Get all teams ordered by points
    const teamsRef = collection(db, 'teams');
    const q = query(
      teamsRef,
      where('role', '==', 'team'),
      orderBy('points', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    // Find the index of the team
    const index = querySnapshot.docs.findIndex(doc => doc.id === teamId);
    return index === -1 ? null : index + 1; // Return 1-based rank
  } catch (error) {
    console.error('Error getting team rank:', error);
    throw error;
  }
};

/**
 * Get detailed stats for a team
 * @param {string} teamId - The ID of the team
 * @returns {Promise<Object>} Team stats including rank, points, and completed challenges
 */
export const getTeamStats = async (teamId) => {
  try {
    const teamRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      throw new Error('Team not found');
    }

    const teamData = teamDoc.data();
    const rank = await getTeamRank(teamId);
    const completedChallenges = teamData.completedChallenges || [];

    // Calculate challenge statistics
    const stats = {
      algorithmic: {
        completed: completedChallenges.filter(c => c.type === 'algorithmic').length,
        firstSolves: completedChallenges.filter(c => c.type === 'algorithmic' && c.isFirstSolver).length,
        points: completedChallenges
          .filter(c => c.type === 'algorithmic')
          .reduce((sum, c) => sum + c.pointsEarned, 0)
      },
      buildathon: {
        completed: completedChallenges.filter(c => c.type === 'buildathon').length,
        firstSolves: completedChallenges.filter(c => c.type === 'buildathon' && c.isFirstSolver).length,
        points: completedChallenges
          .filter(c => c.type === 'buildathon')
          .reduce((sum, c) => sum + c.pointsEarned, 0)
      }
    };

    return {
      rank,
      teamName: teamData.teamName,
      email: teamData.email,
      totalPoints: teamData.points || 0,
      stats,
      completedChallenges: completedChallenges.map(c => ({
        ...c,
        completedAt: new Date(c.completedAt).toLocaleString()
      })),
      lastSubmission: teamData.lastSubmissionTime ? 
        new Date(teamData.lastSubmissionTime).toLocaleString() : null,
      lastUpdated: teamData.updatedAt
    };
  } catch (error) {
    console.error('Error getting team stats:', error);
    throw error;
  }
};
