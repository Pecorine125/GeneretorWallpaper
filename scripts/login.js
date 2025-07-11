import { auth, db } from '../firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      alert('Por favor, verifique seu e-mail antes de entrar.');
      return;
    }

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    localStorage.setItem('userType', userData.type);

    alert('Login bem-sucedido!');
    if (userData.type === 'admin') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'index.html';
    }
  } catch (error) {
    alert('Erro no login: ' + error.message);
  }
});
