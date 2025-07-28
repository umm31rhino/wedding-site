// ========= 背景画像スライドショー =========
const images = Array.from({ length: 7 }, (_, i) => `assets/hyoshi${i + 1}.jpg`); // 枚数変更はここ
const background = document.getElementById("background");
let currentIndex = 0;
const displayTime = 5000; // 写真の表示時間（ms）
const fadeDuration = 1000; // フェードイン/アウトの時間（ms）

function changeBackground() {
  background.style.opacity = 0;
  setTimeout(() => {
    background.style.backgroundImage = `url(${images[currentIndex]})`;
    background.style.opacity = 1;
    currentIndex = (currentIndex + 1) % images.length;
  }, fadeDuration);
}

background.style.backgroundImage = `url(${images[0]})`;
setInterval(changeBackground, displayTime);

// ========= カウントダウン =========
const countdown = document.getElementById("countdown");
const weddingDate = new Date("2025-10-10T12:30:00+09:00"); // 日時を変更する場合はここ

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

// ========= プロフィール スクロール時表示 =========
const profileItems = document.querySelectorAll('.profile-item');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.2 });

profileItems.forEach(item => {
  observer.observe(item);
});

// ========= 表紙タイトルを1文字ずつ・行順に表示 =========
// ▼ 表示速度を変えたいときは以下の2つの変数を変更してください
const letterDelay = 80;  // 1文字ごとの表示間隔（ms）
const lineDelay = 600;   // 各行のあとに待つ時間（ms）

function animateLettersSequential(selectors, delayBase = letterDelay, afterLineDelay = lineDelay) {
  let totalDelay = 0;

  selectors.forEach(selector => {
    const el = document.querySelector(selector);
    const text = el.textContent.trim();
    el.textContent = '';
    el.style.visibility = 'visible';

    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.classList.add('letter');
      span.style.animationDelay = `${totalDelay + delayBase * i}ms`;
      span.textContent = char;
      el.appendChild(span);
    });

    totalDelay += delayBase * text.length + afterLineDelay; // 次の行にずらすための合計待機時間
  });
}

animateLettersSequential(['.cover-text h1', '.cover-text h2', '.cover-text h3']);
