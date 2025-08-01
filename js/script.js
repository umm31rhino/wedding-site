
// ========= 背景画像スライドショー =========
const images = Array.from({ length: 7 }, (_, i) => `assets/hyoshi${i + 1}.jpg`);
const background = document.getElementById("background");

const displayTime = 5000;          // 写真の表示時間（ms）
const fadeDuration = 2000;         // フェードイン/アウトの時間（変更可）

let currentIndex = 0;

function changeBackground() {
  background.style.opacity = 0;
  setTimeout(() => {
    currentIndex = (currentIndex + 1) % images.length;
    background.style.backgroundImage = `url(${images[currentIndex]})`;
    background.style.opacity = 1;
  }, fadeDuration);
}

// ========= カウントダウン =========
const countdown = document.getElementById("countdown");
const weddingDate = new Date("2025-10-10T12:30:00+09:00");

function updateCountdownText() {
  const now = new Date();
  const diff = weddingDate - now;
  if (diff <= 0) {
    return "いよいよスタート！";
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return ` ${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`;
}

function showCountdown() {
  countdown.textContent = updateCountdownText();

  // ✅ ここで display をいじらず、opacity だけ変える
  countdown.style.opacity = 0;  // 念のため初期化
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      countdown.style.opacity = 1;  // ✅ フェードインをトリガー
    });
  });

  // ✅ カウントダウンの数値は更新され続ける
  setInterval(() => {
    countdown.textContent = updateCountdownText();
  }, 1000);
}

// ========= プロフィール スクロール時表示 =========
const profileItems = document.querySelectorAll('.profile-item');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.2 });
profileItems.forEach(item => observer.observe(item));

// ========= 表紙タイトルアニメーション =========
const letterDelay = 80;
const lineDelay = 600;

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
  if (onComplete) {
    setTimeout(onComplete, totalDelay);
  }
}

// ========= 初期処理 =========
background.style.backgroundColor = '#f3e5e1';
background.style.opacity = 1; // ピンクベージュで最初待機

animateLettersSequential(['.cover-text h1', '.cover-text h2', '.cover-text h3'], letterDelay, lineDelay, () => {
  showCountdown();

  // 背景フェードイン処理開始（最初に hyoshi1）
  setTimeout(() => {
    background.style.transition = `opacity ${fadeDuration}ms ease-in-out`;
    background.style.opacity = 0;
    setTimeout(() => {
      background.style.backgroundColor = '';
      background.style.backgroundImage = `url(${images[0]})`;
      background.style.opacity = 1;

      // 通常ループ開始
      setInterval(changeBackground, displayTime);
    }, fadeDuration);
  }, 2000); // カウントダウン後に背景切り替えを少し遅らせる
});

// ========= スケジュールセクション装飾 =========
const scheduleSection = document.querySelector('.page.schedule');
if (scheduleSection) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('message-box');
  wrapper.innerHTML = scheduleSection.innerHTML;
  scheduleSection.innerHTML = '<h2>Schedule</h2>';
  scheduleSection.appendChild(wrapper);
}
