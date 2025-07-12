import { auth, db } from '../firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

document.getElementById('btnRegister').addEventListener('click', () => {
  window.location.href = 'register.html';
});

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

    if (!userData) {
      alert('Usuário não encontrado no banco de dados.');
      return;
    }

    window.location.href = 'dashboard.html';

  } catch (error) {
    alert('Erro no login: ' + error.message);
  }
});
