import { auth, db, storage } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const generateForm = document.getElementById('generateForm');
const previewImg = document.getElementById('previewImg');
const toggleBlurBtn = document.getElementById('toggleBlurBtn');
const resultDiv = document.getElementById('result');
let userId = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'index.html';
  } else {
    userId = user.uid;
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
  const isAdult = generateForm.isAdult.checked;

  if (!prompt || !size) {
    alert('Por favor, preencha a descrição e escolha o tamanho.');
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

    // Aqui você chama a API para gerar o wallpaper e recebe a URL gerada.
    // No exemplo abaixo, está usando um placeholder.

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
    toggleBlurBtn.style.display = isAdult ? 'inline-block' : 'none';
  } catch (error) {
    alert('Erro ao gerar wallpaper: ' + error.message);
  }
});

toggleBlurBtn.addEventListener('click', () => {
  const imgs = resultDiv.querySelectorAll('img');
  imgs.forEach(img => {
    if (img.style.filter === 'blur(8px)') {
      img.style.filter = 'none';
    } else {
      img.style.filter = 'blur(8px)';
    }
  });
});
