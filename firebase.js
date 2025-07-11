import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC0sWmc2-VlUKQODhFYgoHm5X5Vgu-VAlw",
  authDomain: "generetorwallpaper.firebaseapp.com",
  projectId: "generetorwallpaper",
  storageBucket: "generetorwallpaper.firebasestorage.app",
  messagingSenderId: "365929986387",
  appId: "1:365929986387:web:07f4f9b9365602a20949a6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
