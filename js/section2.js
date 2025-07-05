const section2 = document.getElementById('section2');
section2.style.backgroundImage = "url('assets/2-1.jpg')";
section2.innerHTML = `
  <h2 class="animated-text">Countdown</h2>
  <p id="countdown" class="animated-text"></p>
  <div class="weather-popup animated-text">
    <p>予想気温：28℃</p>
    <p>降水確率：20%</p>
    <p>天気：晴れ</p>
  </div>
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