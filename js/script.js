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
const weddingDate = new Date("2025-10-10T12:30:00+09:00"); // JST（UTC+9）

function updateCountdownText() {
  const now = new Date();
  const diff = weddingDate - now;
  if (diff <= 0) return "いよいよスタート！";

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  // 数字＋単位のみ
  return `${d}日 ${h}時間 ${m}分 ${s}秒`;
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

// ========= （旧）プロフィール画像フェードは未使用 =========

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

// ========= PDF を Canvas へ安定描画（pdf.js v2） =========
// ・IntersectionObserver：可視化された“最初の一回だけ”描画（data-renderedで抑止）
// ・ResizeObserver：コンテナ幅が実際に変わったときだけ再描画（±2px以上、デバウンス）
// ・renderToken：非同期競合を排除（最新トークン以外の結果は破棄）
function initPdfRenderingStable() {
  if (typeof window.pdfjsLib === 'undefined') {
    console.error('[PDF] pdfjsLib が見つかりません。index.html で pdf.min.js の読み込みを確認してください。');
    return;
  }

  try {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
  } catch (e) {
    console.warn('[PDF] GlobalWorkerOptions の設定に失敗:', e);
  }

  const containers = Array.from(document.querySelectorAll('.pdf-canvas-wrap'));

  // 各コンテナの状態
  const stateMap = new WeakMap();
  function getState(container) {
    let s = stateMap.get(container);
    if (!s) {
      s = { lastWidth: 0, renderToken: 0, debounceTimer: null };
      stateMap.set(container, s);
    }
    return s;
  }

  async function renderPdf(container, force = false) {
    const url = container.getAttribute('data-pdf');
    const pageNum = parseInt(container.getAttribute('data-page') || '1', 10);
    if (!url) return;

    const state = getState(container);
    const width = Math.round(container.clientWidth);

    // 幅変化が小さいときはスキップ（揺れ対策）
    if (!force && Math.abs(width - state.lastWidth) < 2 && container.dataset.rendered === '1') {
      return;
    }

    state.lastWidth = width;
    const myToken = ++state.renderToken;

    try {
      const loadDoc = (opts = {}) => window.pdfjsLib.getDocument(Object.assign({ url }, opts)).promise;

      let pdf;
      try {
        pdf = await loadDoc({ withCredentials: false });
      } catch (err) {
        // Worker問題がある環境向けフォールバック
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = null;
        pdf = await loadDoc({ disableWorker: true });
      }

      const page = await pdf.getPage(pageNum);

      const baseViewport = page.getViewport({ scale: 1 });
      const dpr = window.devicePixelRatio || 1;
      const scale = (width * dpr) / baseViewport.width;
      const viewport = page.getViewport({ scale });

      if (state.renderToken !== myToken) return;

      const canvas = document.createElement('canvas');
      canvas.className = 'pdf-canvas';
      const ctx = canvas.getContext('2d', { alpha: false });

      canvas.width  = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width  = Math.floor(viewport.width / dpr) + 'px';
      canvas.style.height = Math.floor(viewport.height / dpr) + 'px';

      await page.render({ canvasContext: ctx, viewport, intent: 'display' }).promise;

      if (state.renderToken !== myToken) return;

      container.innerHTML = '';
      container.appendChild(canvas);
      container.dataset.rendered = '1';
    } catch (e) {
      console.error('[PDF] 描画に失敗:', url, e);
      container.innerHTML = '<p style="text-align:center; padding:16px;">PDFを読み込めませんでした。HTTPSやパスをご確認ください。</p>';
    }
  }

  // 初回：可視化で描画＆スライドイン発火
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;
      if (entry.isIntersecting) {
        // スライドイン（groom=右から, bride=左から）
        el.classList.add('show');
        // PDF描画（未描画なら一回だけ）
        if (el.dataset.rendered !== '1') {
          renderPdf(el, true);
        }
      }
    });
  }, { threshold: 0.15 });

  containers.forEach((c) => io.observe(c));

  // コンテナ幅が本当に変わった時だけ再描画
  const ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;
      const state = getState(el);
      clearTimeout(state.debounceTimer);
      state.debounceTimer = setTimeout(() => {
        renderPdf(el, false);
      }, 200);
    });
  });
  containers.forEach((c) => ro.observe(c));
}

// ========= 初期：タイトル → カウントダウン → 背景フェード開始 & PDF安定描画初期化 =========
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

    // PDF描画の安定化初期化（この一度だけ呼ぶ）
    initPdfRenderingStable();
  }
);
