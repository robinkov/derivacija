import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFunctions } from 'firebase/functions'
import { getFirestore } from 'firebase/firestore'
import { connectAuthEmulator } from 'firebase/auth'
import { connectFunctionsEmulator } from 'firebase/functions'
import { connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAfkZkpe1XKyq1p9Z_mCBWVQX6uWu5Pr2g',
  authDomain: 'derivacija.com',
  projectId: 'derivacija-74cc6',
  storageBucket: 'derivacija-74cc6.firebasestorage.app',
  messagingSenderId: '195110696919',
  appId: '1:195110696919:web:deff27245ec316f1aebd92',
  measurementId: 'G-V18STL6LFW'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const db = getFirestore(app);

// emulators
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFunctionsEmulator(functions, 'localhost', 5001);
  connectFirestoreEmulator(db, 'localhost', 8080);
}
