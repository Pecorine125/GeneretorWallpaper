import { auth, db } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'index.html';
  } else {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    const age = calculateAge(userData.birthDate);

    document.getElementById('userName').innerText = `Olá, ${userData.name}!`;

    if (age < 18) {
      document.getElementById('warning').innerText = '⚠️ Algumas funcionalidades estão restritas para menores de 18 anos.';
    } else {
      document.getElementById('warning').innerText = '';
    }
  }
});

function calculateAge(birthDateStr) {
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
