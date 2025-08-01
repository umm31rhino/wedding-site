
// ========= 背景画像スライドショー =========
const images = Array.from({ length: 7 }, (_, i) => `assets/hyoshi${i + 1}.jpg`);
const background = document.getElementById("background");
let currentIndex = 1; // 2枚目（index=1）からループ開始
const displayTime = 5000;
const fadeDuration = 1000;

function changeBackground() {
  background.style.opacity = 0;
  setTimeout(() => {
    background.style.backgroundImage = `url(${images[currentIndex]})`;
    background.style.opacity = 1;
    currentIndex++;
    if (currentIndex >= images.length) currentIndex = 1; // 2～7でループ（1枚目は初回のみ）
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
  return ` ${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`;
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

animateLettersSequential(['.cover-text h1', '.cover-text h2', '.cover-text h3'], letterDelay, lineDelay, () => {
  // 背景画像：最初だけ特にゆっくりフェードイン
  background.style.transition = `opacity ${fadeDuration * 2}ms ease-in-out`;
  background.style.opacity = 0;

  setTimeout(() => {
    background.style.backgroundColor = '';
    background.style.backgroundImage = `url(${images[0]})`;
    background.style.opacity = 1;
  }, 100);

  setTimeout(() => {
    background.style.transition = `opacity ${fadeDuration}ms ease-in-out`;
    setInterval(changeBackground, displayTime);
  }, fadeDuration * 2 + 200);

  // 初回のみアニメ表示 → 以降は静的に更新
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
