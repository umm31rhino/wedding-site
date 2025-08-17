// ========= 背景画像スライドショー =========
// assets/hyoshi1.jpg ~ hyoshi7.jpg を用意してください。
// ▶ 表示時間やフェード時間は下の変数で調整可能
const images = Array.from({ length: 7 }, (_, i) => `assets/hyoshi${i + 1}.jpg`);
const background = document.getElementById("background");

const displayTime = 5000;   // 写真の表示時間（ms）← 変更したい場合ここ
const fadeDuration = 2000;  // フェードイン/アウトの時間（ms）← 変更したい場合ここ

let currentIndex = 0;

// 画像切替（フェードアウト → 画像差替え → フェードイン）
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
// ▶ 日付時刻を変更する場合はここ（JST+09:00）
const weddingDate = new Date("2025-10-10T12:30:00+09:00");

// カウントダウンの文字列を作成
function updateCountdownText() {
  const now = new Date();
  const diff = weddingDate - now;
  if (diff <= 0) return "いよいよスタート！";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return `挙式まであと ${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`;
}

// カウントダウンを“全文字まとめてフェードイン”で表示（最初だけ）
function showCountdown() {
  countdown.textContent = updateCountdownText();
  countdown.style.opacity = 0;
  // フェードインを確実に発火させる
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      countdown.style.opacity = 1;
    });
  });
  // 以降は数字だけ更新（再フェードはしない）
  setInterval(() => {
    countdown.textContent = updateCountdownText();
  }, 1000);
}

// ========= プロフィール（スクロールでフワッと） =========
const profileItems = document.querySelectorAll('.profile-item');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.2 });
profileItems.forEach(item => observer.observe(item));

// ========= 表紙タイトルを1文字ずつ・行順に表示 =========
// ▶ 表示速度を変えたいときは以下の2つを調整してください
const letterDelay = 80;  // 1文字ごとの表示間隔（ms）
const lineDelay = 600;   // 各行のあとに待つ時間（ms）

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

// ========= 初期処理：タイトル → カウントダウン → 背景フェード → ループ =========
background.style.backgroundColor = '#f3e5e1'; // タイトル・カウントダウンの間は他ページと同色
background.style.opacity = 1;

animateLettersSequential(
  ['.cover-text h1', '.cover-text h2', '.cover-text h3'],
  letterDelay,
  lineDelay,
  () => {
    // カウントダウンを表示（全文字同時フェードイン）
    showCountdown();

    // 少し待ってから背景スライドショーを開始
    setTimeout(() => {
      background.style.transition = `opacity ${fadeDuration}ms ease-in-out`;
      // 最初の画像（hyoshi1）をフェードインで表示
      background.style.opacity = 0;
      setTimeout(() => {
        background.style.backgroundColor = '';
        background.style.backgroundImage = `url(${images[0]})`;
        background.style.opacity = 1;

        // 通常ループ開始
        setInterval(changeBackground, displayTime);
      }, fadeDuration);
    }, 1200); // カウントダウンが目に入る時間を少し確保
  }
);

// ========= 以前の「Schedule を message-box で囲む」自動処理は削除しています =========
