// ========== 背景画像のフェード切り替え（表紙） ==========

// 画像ファイル名一覧（★画像を追加・削除する場合はこの配列を変更）
// hyoshi1.jpg ~ hyoshi10.jpg を assets フォルダに入れてください
const images = Array.from({ length: 10 }, (_, i) => `assets/hyoshi${i + 1}.jpg`);

// 画像の切り替え設定（5秒）
let currentIndex = 0;
const background = document.getElementById("background");

function changeBackground() {
  background.style.opacity = 0;

  setTimeout(() => {
    background.style.backgroundImage = `url(${images[currentIndex]})`;
    background.style.opacity = 1;
    currentIndex = (currentIndex + 1) % images.length;
  }, 1000); // フェードアウトの1秒
}

// 初期表示
background.style.backgroundImage = `url(${images[0]})`;
setInterval(changeBackground, 5000); // 5秒毎に切り替え

// ★画像の枚数を変更したいとき：images配列の数を変えるだけ！


// ========== カウントダウン機能 ==========

const countdown = document.getElementById("countdown");
const weddingDate = new Date("2025-10-10T12:30:00+09:00"); // ★開始時間を変更する場合はここ

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    countdown.textContent = "いよいよスタート！";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdown.textContent = `挙式まであと ${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`;
}

updateCountdown();
setInterval(updateCountdown, 1000);


// ========== プロフィール・スクロール時アニメーション（今後拡張予定） ==========

const profileItems = document.querySelectorAll('.profile-item');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.transform = 'translateX(0)';
      entry.target.style.opacity = '1';
    }
  });
}, { threshold: 0.2 });

profileItems.forEach(item => {
  item.style.opacity = '0';
  item.style.transform = item.classList.contains('bride') ? 'translateX(100px)' : 'translateX(-100px)';
  item.style.transition = 'all 1s ease-out';
  observer.observe(item);
});
