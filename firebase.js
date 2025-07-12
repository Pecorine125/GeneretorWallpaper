import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "SEU_FIREBASE_API_KEY",
  authDomain: "SEU_FIREBASE_AUTH_DOMAIN",
  projectId: "SEU_FIREBASE_PROJECT_ID",
  storageBucket: "SEU_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "SEU_FIREBASE_MESSAGING_SENDER_ID",
  appId: "SEU_FIREBASE_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
