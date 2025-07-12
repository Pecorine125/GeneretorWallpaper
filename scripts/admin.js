import { auth, db } from '../firebase.js';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const wallpapersList = document.getElementById('wallpapersList');
const btnLogout = document.getElementById('btnLogout');

async function loadWallpapers() {
  wallpapersList.innerHTML = 'Carregando wallpapers...';

  const q = query(collection(db, 'wallpapers'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    wallpapersList.innerHTML = '<p>Nenhum wallpaper gerado ainda.</p>';
    return;
  }

  wallpapersList.innerHTML = '';
  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement('div');
    div.style.marginBottom = '20px';

    div.innerHTML = `
      <p><strong>Usuário ID:</strong> ${data.userId}</p>
      <p><strong>Descrição:</strong> ${data.prompt}</p>
      <p><strong>Tamanho:</strong> ${data.size}</p>
      ${data.imageUrl ? `<img src="${data.imageUrl}" alt="Referência" style="max-width:150px; display:block; margin-bottom:8px;" />` : ''}
      <img src="${data.generatedImageUrl}" alt="Wallpaper Gerado" style="max-width:300px; border-radius:6px;" />
      <hr />
    `;
    wallpapersList.appendChild(div);
  });
}

btnLogout.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'index.html';
});

loadWallpapers();
