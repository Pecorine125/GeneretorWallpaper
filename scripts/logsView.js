import { db } from '../firebase.js';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const tbody = document.querySelector('#logsTable tbody');
const exportBtn = document.getElementById('exportCSV');
const clearFiltersBtn = document.getElementById('clearFilters');
const filterDate = document.getElementById('filterDate');
const filterUser = document.getElementById('filterUser');
const filterPrompt = document.getElementById('filterPrompt');
const sortDateBtn = document.getElementById('sortDate');

let logs = [];
let csvContent = 'Usuário,Prompt,+18,Data/Hora\n';
let sortDirection = 'desc';

function formatDate(date) {
  return date.toLocaleString('pt-BR');
}

function calculateAge(birthDateStr) {
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

async function carregarLogs() {
  logs = [];
  const logsSnapshot = await getDocs(collection(db, 'logs'));

  for (const logDoc of logsSnapshot.docs) {
    const log = logDoc.data();
    const userDoc = await getDoc(doc(db, 'users', log.userId));
    const userData = userDoc.exists() ? userDoc.data() : { name: 'Desconhecido' };

    logs.push({
      name: userData.name,
      prompt: log.prompt,
      isAdult: log.isAdult,
      createdAt: log.createdAt?.toDate() || new Date(0)
    });
  }

  renderizarLogs();
}

function renderizarLogs() {
  const userText = filterUser.value.toLowerCase();
  const promptText = filterPrompt.value.toLowerCase();
  const dateFilter = filterDate.value ? new Date(filterDate.value) : null;

  let filteredLogs = logs.filter(log => {
    const sameDay = !dateFilter || (
      log.createdAt.getFullYear() === dateFilter.getFullYear() &&
      log.createdAt.getMonth() === dateFilter.getMonth() &&
      log.createdAt.getDate() === dateFilter.getDate()
    );

    return (
      log.name.toLowerCase().includes(userText) &&
      log.prompt.toLowerCase().includes(promptText) &&
      sameDay
    );
  });

  // Ordenar por data
  filteredLogs.sort((a, b) => {
    return sortDirection === 'asc'
      ? a.createdAt - b.createdAt
      : b.createdAt - a.createdAt;
  });

  tbody.innerHTML = '';
  csvContent = 'Usuário,Prompt,+18,Data/Hora\n';

  for (const log of filteredLogs) {
    const tr = document.createElement('tr');
    const formattedDate = formatDate(log.createdAt);
    tr.innerHTML = `
      <td>${log.name}</td>
      <td>${log.prompt}</td>
      <td>${log.isAdult ? 'Sim' : 'Não'}</td>
      <td>${formattedDate}</td>
    `;
    tbody.appendChild(tr);
    csvContent += `"${log.name}","${log.prompt}","${log.isAdult ? 'Sim' : 'Não'}","${formattedDate}"\n`;
  }
}

// 🔁 Filtros
filterDate.addEventListener('change', renderizarLogs);
filterUser.addEventListener('input', renderizarLogs);
filterPrompt.addEventListener('input', renderizarLogs);
clearFiltersBtn.addEventListener('click', () => {
  filterDate.value = '';
  filterUser.value = '';
  filterPrompt.value = '';
  renderizarLogs();
});

// 🔁 Ordenação
sortDateBtn.addEventListener('click', () => {
  sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  sortDateBtn.innerText = `Data/Hora ${sortDirection === 'asc' ? '🔼' : '🔽'}`;
  renderizarLogs();
});

// 📤 CSV
exportBtn.addEventListener('click', () => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'logs_wallpapers.csv';
  link.click();
});

carregarLogs();
