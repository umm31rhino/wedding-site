// ========= 背景画像スライドショー =========
const images = Array.from({ length: 7 }, (_, i) => `assets/hyoshi${i + 1}.jpg`);
const background = document.getElementById("background");

const displayTime = 5000;   // 画像の表示時間(ms) ← 変更可
const fadeDuration = 2000;  // フェードイン/アウト時間(ms) ← 変更可

let currentIndex = 0;

function changeBackground() {
  background.style.opacity = 0;
  setTimeout(() => {
    currentIndex = (currentIndex + 1) % images.length;
    background.style.backgroundImage = `url(${images[currentIndex]})`;
    background.style.opacity = 1;
  }, fadeDuration);
}

// ========= カウントダウン（全文字同時フェードイン：最初だけ） =========
const countdown = document.getElementById("countdown");
// JST（UTC+9）で式の開始時刻
const weddingDate = new Date("2025-10-10T12:30:00+09:00");

function updateCountdownText() {
  const now = new Date();
  const diff = weddingDate - now;
  if (diff <= 0) return "いよいよスタート！";
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return `挙式まであと ${d}日 ${h}時間 ${m}分 ${s}秒`;
}

function showCountdown() {
  countdown.textContent = updateCountdownText();
  countdown.style.opacity = 0;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      countdown.style.opacity = 1; // フェードイン
    });
  });
  setInterval(() => {
    countdown.textContent = updateCountdownText(); // 以降は数値のみ更新
  }, 1000);
}

// ========= プロフィール（スクロールで表示） =========
const profileItems = document.querySelectorAll('.profile-item');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.2 });
profileItems.forEach(item => observer.observe(item));

// ========= 表紙タイトル：1文字ずつ・行順に表示 =========
const letterDelay = 80;  // 1文字間隔(ms)
const lineDelay = 600;   // 各行の待機(ms)

function animateLettersSequential(selectors, delayBase = letterDelay, afterLineDelay = lineDelay, onComplete) {
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
    totalDelay += delayBase * text.length + afterLineDelay;
  });
  if (onComplete) setTimeout(onComplete, totalDelay);
}

// ========= 初期：タイトル → カウントダウン → 背景フェード開始 =========
background.style.backgroundColor = '#f3e5e1'; // 表紙待機色（2ページ目以降と同じ）
background.style.opacity = 1;

animateLettersSequential(
  ['.cover-text h1', '.cover-text h2', '.cover-text h3'],
  letterDelay,
  lineDelay,
  () => {
    showCountdown();
    setTimeout(() => {
      background.style.transition = `opacity ${fadeDuration}ms ease-in-out`;
      background.style.opacity = 0;
      setTimeout(() => {
        background.style.backgroundColor = '';
        background.style.backgroundImage = `url(${images[0]})`;
        background.style.opacity = 1;
        setInterval(changeBackground, displayTime); // ループ開始
      }, fadeDuration);
    }, 1200);
  }
);

// （注）以前の「Schedule を message-box で囲む」処理は削除済み
