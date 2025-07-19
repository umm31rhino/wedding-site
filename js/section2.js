document.getElementById('section2').innerHTML = `
  <h2>Countdown</h2>
  <p id="countdown"></p>
`;

const countdownEl = document.getElementById("countdown");
const weddingDate = new Date("2025-10-10T12:30:00+09:00");
function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;
  if (diff <= 0) {
    countdownEl.innerText = "It's our wedding day!";
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  countdownEl.innerText = `${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`;
}
setInterval(updateCountdown, 1000);
updateCountdown();