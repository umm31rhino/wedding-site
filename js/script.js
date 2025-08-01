
// ========= 背景画像スライドショー =========
// 表紙の背景画像：assets/hyoshi1.jpg ~ hyoshi7.jpg を使用
const images = Array.from({ length: 7 }, (_, i) => `assets/hyoshi${i + 1}.jpg`);
const background = document.getElementById("background");

// === フェード時間設定（ミリ秒） ===
const displayTime = 5000;        // 写真の表示時間（ループ間隔）
const fadeDuration = 2000;       // 通常のフェードイン・フェードアウトの時間（変更する場合はここ）
const firstFadeDuration = 3000;  // 最初の写真だけゆっくり表示する時間（変更する場合はここ）

let currentIndex = 0;  // 1～7ループ用の現在のインデックス（初回は使わない）

function changeBackground() {
  background.style.opacity = 0;
  setTimeout(() => {
    background.style.backgroundImage = `url(${images[currentIndex]})`;
    background.style.opacity = 1;
    currentIndex = (currentIndex + 1) % images.length;
  }, fadeDuration);
}

// ========= カウントダウン（初回のみアニメ付き） =========
const countdown = document.getElementById("countdown");
const weddingDate = new Date("2025-10-10T12:30:00+09:00");

function formatCountdownText() {
  const now = new Date();
  const diff = weddingDate - now;
  if (diff <= 0) {
    return "いよいよスタート！";
  }
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

// ========= 初期状態設定 =========
background.style.backgroundColor = '#f3e5e1';
background.style.opacity = 1;

// 表紙タイトルアニメ → その後に背景とカウントダウン
animateLettersSequential(['.cover-text h1', '.cover-text h2', '.cover-text h3'], letterDelay, lineDelay, () => {
  // === 最初の背景画像（hyoshi7.jpg）をゆっくり表示 ===
  background.style.transition = `opacity ${firstFadeDuration}ms ease-in-out`;
  background.style.opacity = 0;

  setTimeout(() => {
    background.style.backgroundColor = '';
    background.style.backgroundImage = `url(${images[6]})`; // 最初は hyoshi7.jpg を明示的に
    background.style.opacity = 1;
  }, 100);

  // その後は hyoshi1.jpg から順にループ（1～7）
  setTimeout(() => {
    background.style.transition = `opacity ${fadeDuration}ms ease-in-out`;
    currentIndex = 0; // hyoshi1.jpg からループ
    setInterval(changeBackground, displayTime);
  }, firstFadeDuration + 200);

  // カウントダウン表示（初回だけアニメ表示）
  revealCountdownText(formatCountdownText());
  setInterval(() => {
    countdown.textContent = formatCountdownText();
  }, 1000);
});

// ========= スケジュールセクションのスタイル適用 =========
const scheduleSection = document.querySelector('.page.schedule');
if (scheduleSection) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('message-box');
  wrapper.innerHTML = scheduleSection.innerHTML;
  scheduleSection.innerHTML = '<h2>Schedule</h2>';
  scheduleSection.appendChild(wrapper);
}
