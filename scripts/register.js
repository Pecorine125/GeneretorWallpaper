import { auth, db } from '../firebase.js';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const birthDate = document.getElementById('birthdate').value;

  const age = getAge(birthDate);

  if (age < 13) {
    alert('Você deve ter no mínimo 13 anos para se registrar.');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await sendEmailVerification(user);

    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      birthDate,
      age,
      type: email === 'harahellima@gmail.com' ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
    });

    alert('Conta criada com sucesso! Verifique seu e-mail antes de fazer login.');
    window.location.href = 'login.html';
  } catch (error) {
    alert('Erro ao registrar: ' + error.message);
  }
});

function getAge(birthDateString) {
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
