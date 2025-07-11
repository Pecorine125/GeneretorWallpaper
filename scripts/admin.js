import { auth, db } from '../firebase.js';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const container = document.getElementById('wallpapersContainer');

auth.onAuthStateChanged(async (user) => {
  if (!user) return;

  const userType = localStorage.getItem('userType');
  if (userType !== 'admin') {
    alert('Acesso negado. Você não é administrador.');
    return;
  }

  const wallpapersRef = collection(db, 'wallpapers');
  const q = query(wallpapersRef, orderBy('criadoEm', 'desc'));
  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement('div');
    div.innerHTML = `
      <p><strong>Usuário:</strong> ${data.uid}</p>
      <p><strong>Prompt:</strong> ${data.prompt}</p>
      <img src="${data.url}" alt="Wallpaper" width="300" class="generated-image" />
      <hr>
    `;
    container.appendChild(div);
  });
});
