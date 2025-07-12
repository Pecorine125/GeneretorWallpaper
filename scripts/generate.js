import { auth, db, storage } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

let userId = null;
let userAge = 0;
let userData = null;

const generateForm = document.getElementById('generateForm');
const previewImg = document.getElementById('previewImg');
const toggleBlurBtn = document.getElementById('toggleBlurBtn');
const resultDiv = document.getElementById('result');

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'index.html';
  } else {
    userId = user.uid;
    const userDoc = await getDoc(doc(db, 'users', userId));
    userData = userDoc.data();

    userAge = calculateAge(userData.birthDate);

    if (userAge < 18) {
      document.getElementById('isAdult').disabled = true;
      document.getElementById('isAdult').checked = false;
      toggleBlurBtn.style.display = 'none';
    }
  }
});

generateForm.imgReference.addEventListener('change', () => {
  const file = generateForm.imgReference.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      previewImg.src = reader.result;
      previewImg.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    previewImg.style.display = 'none';
  }
});

generateForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const prompt = generateForm.prompt.value.trim();
  const size = generateForm.size.value;
  const isAdult = userAge >= 18 && generateForm.isAdult.checked;

  if (!prompt || !size) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  try {
    let imageUrl = null;

    if (generateForm.imgReference.files.length > 0) {
      const file = generateForm.imgReference.files[0];
      const storageRef = ref(storage, `references/${userId}/${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    const generatedImageUrl = 'https://via.placeholder.com/512x512.png?text=Wallpaper+Gerado';

    await addDoc(collection(db, 'wallpapers'), {
      userId,
      prompt,
      size,
      imageUrl,
      generatedImageUrl,
      isAdult,
      createdAt: serverTimestamp(),
    });

    resultDiv.innerHTML = `<p>Wallpaper gerado:</p><img src="${generatedImageUrl}" alt="Wallpaper" />`;

    if (isAdult) toggleBlurBtn.style.display = 'inline-block';
  } catch (error) {
    alert('Erro ao gerar: ' + error.message);
  }
});

toggleBlurBtn.addEventListener('click', () => {
  const imgs = resultDiv.querySelectorAll('img');
  imgs.forEach(img => {
    img.style.filter = img.style.filter === 'blur(8px)' ? 'none' : 'blur(8px)';
  });
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
