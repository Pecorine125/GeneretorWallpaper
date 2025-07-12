import { db } from '../firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function salvarLog(userId, prompt, isAdult) {
  try {
    await addDoc(collection(db, 'logs'), {
      userId,
      prompt,
      isAdult,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Erro ao salvar log:', error);
  }
}
