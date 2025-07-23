// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "resumeright-7jbpf",
  "appId": "1:467408534090:web:30aaebc0f489ba0c2fc4b3",
  "storageBucket": "resumeright-7jbpf.firebasestorage.app",
  "apiKey": "AIzaSyCGaAZD-znGAR6r2Nt6rOwN-v4Vj5X_4C4",
  "authDomain": "resumeright-7jbpf.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "467408534090"
};

// Initialize Firebase
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(firebaseApp);

export { firebaseApp, auth };
