import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  Timestamp,
  doc,
  getDoc 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { db, auth } from './firebase';

// Survey operations
export const submitSurvey = async (surveyData) => {
  try {
    const docRef = await addDoc(collection(db, 'surveys'), {
      ...surveyData,
      timestamp: Timestamp.now(),
      ip_address: await getUserIP(),
      user_agent: navigator.userAgent
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error submitting survey:', error);
    return { success: false, error: error.message };
  }
};

export const getSurveys = async (startDate = null, endDate = null) => {
  try {
    let q = query(collection(db, 'surveys'), orderBy('timestamp', 'desc'));
    
    if (startDate && endDate) {
      q = query(
        collection(db, 'surveys'),
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate)),
        orderBy('timestamp', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    const surveys = [];
    
    querySnapshot.forEach((doc) => {
      surveys.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      });
    });
    
    return { success: true, data: surveys };
  } catch (error) {
    console.error('Error getting surveys:', error);
    return { success: false, error: error.message };
  }
};

// Authentication operations
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if user is admin
    const userDoc = await getDoc(doc(db, 'admin_users', userCredential.user.uid));
    if (!userDoc.exists()) {
      await firebaseSignOut(auth);
      throw new Error('Usuário não autorizado');
    }
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error: error.message };
  }
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Utility functions
const getUserIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP:', error);
    return 'unknown';
  }
};

// Statistics calculations
export const calculateStatistics = (surveys) => {
  if (!surveys || surveys.length === 0) {
    return {
      total: 0,
      averageRatings: {},
      ratingDistribution: {},
      dailyResponses: []
    };
  }

  const ratingFields = [
    'atendimento_recepcao',
    'atendimento_triagem', 
    'atendimento_medico',
    'capacidade_medico',
    'higienizacao',
    'atendimento_tecnicos'
  ];

  const ratingValues = {
    'muito_satisfeito': 4,
    'satisfeito': 3,
    'regular': 2,
    'ruim': 1
  };

  // Calculate average ratings
  const averageRatings = {};
  const ratingDistribution = {};

  ratingFields.forEach(field => {
    const ratings = surveys
      .map(survey => survey.responses?.[field])
      .filter(rating => rating && ratingValues[rating]);
    
    if (ratings.length > 0) {
      const sum = ratings.reduce((acc, rating) => acc + ratingValues[rating], 0);
      averageRatings[field] = (sum / ratings.length).toFixed(2);
      
      // Distribution
      ratingDistribution[field] = {
        muito_satisfeito: ratings.filter(r => r === 'muito_satisfeito').length,
        satisfeito: ratings.filter(r => r === 'satisfeito').length,
        regular: ratings.filter(r => r === 'regular').length,
        ruim: ratings.filter(r => r === 'ruim').length
      };
    }
  });

  // Daily responses for chart
  const dailyResponses = surveys.reduce((acc, survey) => {
    const date = survey.timestamp.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const dailyResponsesArray = Object.entries(dailyResponses)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return {
    total: surveys.length,
    averageRatings,
    ratingDistribution,
    dailyResponses: dailyResponsesArray
  };
};

