// script.js
import { gerarImagem } from "./replicate.js";
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getDoc, doc, collection, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

document.getElementById("wallpaperForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const prompt = document.getElementById("prompt").value;
  const width = parseInt(document.getElementById("width").value);
  const height = parseInt(document.getElementById("height").value);
  const isAdult = document.getElementById("isAdult").value === "sim";
  const fileInput = document.getElementById("refImage");

  let imageBase64 = null;
  if (fileInput.files[0]) {
    const reader = new FileReader();
    imageBase64 = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(fileInput.files[0]);
    });
  }

  onAuthStateChanged(auth, async (user) => {
    if (!user || !user.emailVerified) {
      alert("Você precisa estar logado e com e-mail verificado para gerar imagens.");
      return;
    }

    const userDocRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userDocRef);
    if (!userSnap.exists()) {
      alert("Dados de nascimento não encontrados.");
      return;
    }

    const nascimento = new Date(userSnap.data().dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) idade--;

    if (isAdult && idade < 18) {
      alert("Essa imagem é para maiores de 18 anos e você não tem permissão para visualizá-la.");
      return;
    }

    const resultado = await gerarImagem(prompt, width, height, imageBase64);
    const divOutput = document.getElementById("output");
    divOutput.innerHTML = "Gerando imagem, aguarde...";

    const polling = setInterval(async () => {
      const statusResponse = await fetch(resultado.urls.get, {
        headers: { Authorization: `Token ${import.meta.env.VITE_REPLICATE_API_KEY}` }
      });
      const status = await statusResponse.json();

      if (status.status === "succeeded") {
        clearInterval(polling);
        const img = document.createElement("img");
        img.src = status.output[0];
        img.alt = "Wallpaper";
        if (isAdult) img.classList.add("blurred");
        divOutput.innerHTML = "";
        divOutput.appendChild(img);

        if (isAdult && idade >= 18) {
          const btn = document.createElement("button");
          btn.textContent = "Desbloquear Imagem";
          btn.onclick = () => img.classList.remove("blurred");
          divOutput.appendChild(btn);
        }

        // Salvar no Firestore
        const userFolder = (user.email === "admin@seuprojeto.com") ? "ADM" : user.uid;
        const userDocRef = doc(db, "wallpapers", userFolder);
        const imagensColRef = collection(userDocRef, "imagens");

        await setDoc(doc(imagensColRef, crypto.randomUUID()), {
          user: user.email,
          prompt,
          url: status.output[0],
          timestamp: serverTimestamp(),
        });
      }
    }, 3000);
  });
});

// Preview da imagem de referência
const fileInput = document.getElementById("refImage");
fileInput.addEventListener("change", () => {
  const preview = document.getElementById("preview");
  if (fileInput.files[0]) {
    preview.src = URL.createObjectURL(fileInput.files[0]);
    preview.style.display = "block";
  } else {
    preview.style.display = "none";
  }
});
