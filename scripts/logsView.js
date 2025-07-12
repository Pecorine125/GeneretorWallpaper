import { db } from '../firebase.js';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const tbody = document.querySelector('#logsTable tbody');
const exportBtn = document.getElementById('exportCSV');
let csvContent = 'Usuário,Prompt,+18,Data/Hora\n';

async function carregarLogs() {
  const logsSnapshot = await getDocs(collection(db, 'logs'));

  for (const logDoc of logsSnapshot.docs) {
    const log = logDoc.data();

    const userDoc = await getDoc(doc(db, 'users', log.userId));
    const userData = userDoc.exists() ? userDoc.data() : { name: 'Desconhecido' };

    const tr = document.createElement('tr');
    const dataHora = log.createdAt?.toDate().toLocaleString('pt-BR') || '-';

    tr.innerHTML = `
      <td>${userData.name}</td>
      <td>${log.prompt}</td>
      <td>${log.isAdult ? 'Sim' : 'Não'}</td>
      <td>${dataHora}</td>
    `;

    tbody.appendChild(tr);

    // Prepara linha CSV
    csvContent += `"${userData.name}","${log.prompt}","${log.isAdult ? 'Sim' : 'Não'}","${dataHora}"\n`;
  }
}

exportBtn.addEventListener('click', () => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'logs_wallpapers.csv';
  link.click();
});

carregarLogs();
