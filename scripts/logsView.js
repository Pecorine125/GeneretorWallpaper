import { db } from '../firebase.js';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const tbody = document.querySelector('#logsTable tbody');
const exportBtn = document.getElementById('exportCSV');
const clearFiltersBtn = document.getElementById('clearFilters');
const filterDate = document.getElementById('filterDate');
const filterUser = document.getElementById('filterUser');
const filterPrompt = document.getElementById('filterPrompt');
const filterAdult = document.getElementById('filterAdult');
const sortDateBtn = document.getElementById('sortDate');

let logs = [];
let csvContent = 'Usuário,Prompt,+18,Data/Hora\n';
let sortDirection = 'desc';

function formatDate(date) {
  return date.toLocaleString('pt-BR');
}

function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = [
    { label: 'ano', seconds: 31536000 },
    { label: 'mês', seconds: 2592000 },
    { label: 'dia', seconds: 86400 },
    { label: 'hora', seconds: 3600 },
    { label: 'minuto', seconds: 60 },
    { label: 'segundo', seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `há ${count} ${interval.label}${count > 1 ? 's' : ''}`;
    }
  }
  return 'agora';
}

async function carregarLogs() {
  logs = [];
  const logsSnapshot = await getDocs(collection(db, 'logs'));

  for (const logDoc of logsSnapshot.docs) {
    const log = logDoc.data();
    const userDoc = await getDoc(doc(db, 'users', log.userId));
    const userData = userDoc.exists() ? userDoc.data() : { name: 'Desconhecido' };

    logs.push({
      id: logDoc.id,
      name: userData.name,
      prompt: log.prompt,
      isAdult: log.isAdult,
      createdAt: log.createdAt?.toDate() || new Date(0),
      generatedImageUrl: log.generatedImageUrl || null
    });
  }

  renderizarLogs();
}

function renderizarLogs() {
  const userText = filterUser.value.toLowerCase();
  const promptText = filterPrompt.value.toLowerCase();
  const dateFilter = filterDate.value ? new Date(filterDate.value) : null;
  const adultFilter = filterAdult.value;

  let filteredLogs = logs.filter(log => {
    const sameDay = !dateFilter || (
      log.createdAt.getFullYear() === dateFilter.getFullYear() &&
      log.createdAt.getMonth() === dateFilter.getMonth() &&
      log.createdAt.getDate() === dateFilter.getDate()
    );

    const adultMatch =
      adultFilter === 'any' ||
      (adultFilter === 'yes' && log.isAdult) ||
      (adultFilter === 'no' && !log.isAdult);

    return (
      log.name.toLowerCase().includes(userText) &&
      log.prompt.toLowerCase().includes(promptText) &&
      sameDay &&
      adultMatch
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
    const formattedDate = formatDate(log.createdAt);
    const timeAgo = timeSince(log.createdAt);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${log.name}</td>
      <td>${log.prompt}</td>
      <td>${log.isAdult ? 'Sim' : 'Não'}</td>
      <td title="${formattedDate}">${timeAgo}</td>
      <td>
        ${log.generatedImageUrl ? `<button class="btnView" data-url="${log.generatedImageUrl}">Ver Imagem</button>` : '-'}
      </td>
    `;

    tbody.appendChild(tr);
    csvContent += `"${log.name}","${log.prompt}","${log.isAdult ? 'Sim' : 'Não'}","${formattedDate}"\n`;
  }

  // Botões Ver Imagem
  document.querySelectorAll('.btnView').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-url');
      window.open(url, '_blank');
    });
  });
}

// Eventos filtros
filterDate.addEventListener('change', renderizarLogs);
filterUser.addEventListener('input', renderizarLogs);
filterPrompt.addEventListener('input', renderizarLogs);
filterAdult.addEventListener('change', renderizarLogs);
clearFiltersBtn.addEventListener('click', () => {
  filterDate.value = '';
  filterUser.value = '';
  filterPrompt.value = '';
  filterAdult.value = 'any';
  renderizarLogs();
});

// Ordenação
sortDateBtn.addEventListener('click', () => {
  sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  sortDateBtn.innerText = `Data/Hora ${sortDirection === 'asc' ? '🔼' : '🔽'}`;
  renderizarLogs();
});

// Export CSV
exportBtn.addEventListener('click', () => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'logs_wallpapers.csv';
  link.click();
});

carregarLogs();
