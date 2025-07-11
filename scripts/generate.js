import { auth, db } from '../firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Função para salvar imagem gerada
export async function salvarImagemGerada(url, prompt, userId, tipo) {
  try {
    await addDoc(collection(db, 'wallpapers'), {
      uid: userId,
      url,
      prompt,
      tipo,
      criadoEm: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erro ao salvar imagem:', error);
  }
}

// Exemplo para usar após gerar a imagem
// salvarImagemGerada('url_da_imagem', 'prompt do usuário', user.uid, 'normal ou +18');
