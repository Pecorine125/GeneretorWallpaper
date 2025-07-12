import { auth, db } from '../firebase.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const welcomeMsg = document.getElementById('welcomeMsg');
const btnGenerate = document.getElementById('btnGenerate');
const btnAdmin = document.getElementById('btnAdmin');
const btnLogout = document.getElementById('btnLogout');

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    alert('Usuário não encontrado no banco.');
    await signOut(auth);
    window.location.href = 'index.html';
    return;
  }

  const userData = userDoc.data();

  welcomeMsg.textContent = `Olá, ${userData.name}!`;

  if (userData.type === 'admin') {
    btnAdmin.style.display = 'inline-block';
  }

  btnGenerate.addEventListener('click', () => {
    window.location.href = 'generate.html';
  });

  btnAdmin.addEventListener('click', () => {
    window.location.href = 'admin.html';
  });

  btnLogout.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = 'index.html';
  });
});
