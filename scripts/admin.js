import { auth, db } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'index.html';
  } else {
    const adminDoc = await getDoc(doc(db, 'users', user.uid));
    const adminData = adminDoc.data();
    if (adminData.type !== 'admin') {
      window.location.href = 'dashboard.html';
    } else {
      loadWallpapers();
    }
  }
});

async function loadWallpapers() {
  const querySnapshot = await getDocs(collection(db, 'wallpapers'));
  const wrapper = document.getElementById('wallpapersList');
  wrapper.innerHTML = '';

  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();
    const userDoc = await getDoc(doc(db, 'users', data.userId));
    const userData = userDoc.exists() ? userDoc.data() : { name: 'Desconhecido', birthDate: '2000-01-01' };

    const age = calculateAge(userData.birthDate);

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <p><strong>Usuário:</strong> ${userData.name} (${age} anos)</p>
      <p><strong>Prompt:</strong> ${data.prompt}</p>
      <p><strong>+18:</strong> ${data.isAdult ? 'Sim' : 'Não'}</p>
      <img src="${data.generatedImageUrl}" class="preview" />
      <hr />
    `;
    wrapper.appendChild(card);
  }
}

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
