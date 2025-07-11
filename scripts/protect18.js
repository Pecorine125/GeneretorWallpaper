import { auth, db } from '../firebase.js';
import { doc, getDoc } from 'firebase/firestore';

const toggleBlurBtn = document.getElementById('toggleBlurBtn');

auth.onAuthStateChanged(async (user) => {
  if (!user) return;

  const docRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    const userData = snapshot.data();

    if (userData.age < 18) {
      document.querySelectorAll('.adult-only').forEach(el => {
        el.classList.add('blur');
        el.setAttribute('disabled', 'true');
        el.title = 'Conteúdo restrito para menores de 18 anos';
      });
      toggleBlurBtn.style.display = 'none';
    } else {
      toggleBlurBtn.style.display = 'inline-block';
      toggleBlurBtn.addEventListener('click', () => {
        document.querySelectorAll('.generated-image').forEach(img => {
          img.classList.toggle('blur');
        });
      });
    }
  }
});
