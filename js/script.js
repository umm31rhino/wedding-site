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
// JST（UTC+9）
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

// ========= PDF を“画像のように”Canvasへ描画（pdf.js使用） =========
// .pdf-canvas-wrap に data-pdf="パス" data-page="ページ番号" を指定。
// 横幅はCSSの .pdf-canvas-wrap（90vw相当）にフィット。縦はPDF比率で自動計算。
function initPdfRendering() {
  if (typeof pdfjsLib === 'undefined') {
    console.error('[PDF] pdfjsLib が見つかりません。index.html で pdf.min.js が読み込まれているか確認してください。');
    return;
  }

  // ワーカーの場所を明示（CDN使用時）
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.js';
  } catch (e) {
    console.warn('[PDF] GlobalWorkerOptions の設定に失敗:', e);
  }

  const containers = Array.from(document.querySelectorAll('.pdf-canvas-wrap'));

  async function renderPdfIntoCanvas(container) {
    const url = container.getAttribute('data-pdf');
    const pageNum = parseInt(container.getAttribute('data-page') || '1', 10);

    if (!url) {
      console.error('[PDF] data-pdf が未指定です:', container);
      return;
    }

    try {
      const pdf = await pdfjsLib.getDocument({ url }).promise;
      const page = await pdf.getPage(pageNum);

      // コンテナの現在幅にフィットするスケールを計算
      const baseViewport = page.getViewport({ scale: 1 });
      const containerWidth = container.clientWidth || container.getBoundingClientRect().width;

      // デバイス解像度を考慮（Retinaでも綺麗に）
      const dpr = window.devicePixelRatio || 1;
      const scale = (containerWidth * dpr) / baseViewport.width;
      const viewport = page.getViewport({ scale });

      // canvas生成＆サイズ設定
      const canvas = document.createElement('canvas');
      canvas.className = 'pdf-canvas';
      const ctx = canvas.getContext('2d', { alpha: false });

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = Math.floor(viewport.width / dpr) + 'px';
      canvas.style.height = Math.floor(viewport.height / dpr) + 'px';

      // 描画
      await page.render({ canvasContext: ctx, viewport, intent: 'display' }).promise;

      // 古い子要素を置換
      container.innerHTML = '';
      container.appendChild(canvas);
    } catch (err) {
      console.error(`[PDF] 描画に失敗: ${url}`, err);
      // 必要に応じて、ここで簡易フォールバック（テキスト表示など）を入れられます
      container.innerHTML = '<p style="text-align:center; padding:16px;">PDFを読み込めませんでした。HTTPSで配信されているか、パスが正しいか確認してください。</p>';
    }
  }

  // 初期描画
  containers.forEach(renderPdfIntoCanvas);

  // 端末回転やリサイズで再フィット
  let pdfResizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(pdfResizeTimer);
    pdfResizeTimer = setTimeout(() => {
      containers.forEach(renderPdfIntoCanvas);
    }, 150);
  });
}

// pdf.js のCDNロード・画像・DOMが全て揃ってから初期化
window.addEventListener('load', () => {
  try {
    initPdfRendering();
  } catch (e) {
    console.error('[PDF] 初期化エラー:', e);
  }
});
