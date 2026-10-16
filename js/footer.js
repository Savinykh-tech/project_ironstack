// Живые часы для Южно-Сахалинска (UTC+11)
function updateSakhalinTime() {
  const now = new Date();
  const sakhalinOffset = 11 * 60; // UTC+11 в минутах
  const localOffset = now.getTimezoneOffset();
  const sakhalinTime = new Date(now.getTime() + (sakhalinOffset + localOffset) * 60000);
  
  const hours = String(sakhalinTime.getHours()).padStart(2, '0');
  const minutes = String(sakhalinTime.getMinutes()).padStart(2, '0');
  const seconds = String(sakhalinTime.getSeconds()).padStart(2, '0');
  
  const timeElement = document.getElementById('sakhalin-time');
  if (timeElement) {
    timeElement.textContent = `${hours}:${minutes}:${seconds}`;
  }
}

// Обновляем каждую секунду
updateSakhalinTime();
setInterval(updateSakhalinTime, 1000);