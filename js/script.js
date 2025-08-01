
// ========= 背景画像スライドショー =========
const images = Array.from({ length: 7 }, (_, i) => `assets/hyoshi${i + 1}.jpg`);
const background = document.getElementById("background");

const displayTime = 5000;
const fadeDuration = 2000;        // 通常フェード
const firstFadeDuration = 3000;   // 最初のフェード（ここを変えれば最初の写真フェードイン時間が変えられる）

let currentIndex = 0;

function changeBackground() {
  background.style.opacity = 0;
  setTimeout(() => {
    background.style.backgroundImage = `url(${images[currentIndex]})`;
    background.offsetHeight; // ← 強制リフロー（再描画）
    background.style.opacity = 1;
    currentIndex = (currentIndex + 1) % images.length;
  }, fadeDuration);
}

// ========= カウントダウン =========
const countdown = document.getElementById("countdown");
const weddingDate = new Date("2025-10-10T12:30:00+09:00");

function formatCountdownText() {
  const now = new Date();
  const diff = weddingDate - now;
  if (diff <= 0) return "いよいよスタート！";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return `挙式まであと ${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`;
}

function revealCountdownText(text) {
  countdown.innerHTML = '';
  [...text].forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.opacity = 0;
    span.style.display = 'inline-block';
    span.style.animation = `letterFadeUp 0.6s forwards`;
    span.style.animationDelay = `${i * 40}ms`;
    countdown.appendChild(span);
  });
}

// ========= プロフィール アニメーション =========
const profileItems = document.querySelectorAll('.profile-item');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.2 });
profileItems.forEach(item => observer.observe(item));

// ========= 表紙タイトル アニメーション =========
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
  if (onComplete) setTimeout(onComplete, totalDelay);
}

// ========= 初期処理 =========
background.style.backgroundColor = '#f3e5e1';
background.style.opacity = 0;

animateLettersSequential(['.cover-text h1', '.cover-text h2', '.cover-text h3'], letterDelay, lineDelay, () => {
  // 最初の画像設定
  background.style.transition = `opacity ${firstFadeDuration}ms ease-in-out`;
  background.style.backgroundColor = '';
  background.style.backgroundImage = 'url(assets/hyoshi7.jpg)';

  // 強制リフロー + 遅延で transition 発火を確実にする
  background.offsetHeight; // ← 強制再描画
  background.style.opacity = 1;

  // その後のループ（1〜7）開始
  setTimeout(() => {
    background.style.transition = `opacity ${fadeDuration}ms ease-in-out`;
    currentIndex = 0;
    setInterval(changeBackground, displayTime);
  }, firstFadeDuration + 500);

  revealCountdownText(formatCountdownText());
  setInterval(() => {
    countdown.textContent = formatCountdownText();
  }, 1000);
});

// ========= スケジュール装飾 =========
const scheduleSection = document.querySelector('.page.schedule');
if (scheduleSection) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('message-box');
  wrapper.innerHTML = scheduleSection.innerHTML;
  scheduleSection.innerHTML = '<h2>Schedule</h2>';
  scheduleSection.appendChild(wrapper);
}
