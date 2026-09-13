(function () {
  const root = document.getElementById('carousel');
  if (!root) return;
  const slides = Array.from(root.querySelectorAll('.slide'));
  const label = document.getElementById('carousel-label');
  const dotsEl = document.getElementById('dots');
  const hint = document.getElementById('carousel-hint');
  const n = slides.length;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INTERVAL = 3500;
  let i = 0, timer = null, paused = false;

  const dots = slides.map((s, k) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', s.dataset.label);
    b.addEventListener('click', () => { go(k); restart(); });
    dotsEl.appendChild(b);
    return b;
  });

  function spread() {
    return Math.max(70, Math.min(150, root.clientWidth * 0.17));
  }

  function render() {
    const sp = spread();
    slides.forEach((s, k) => {
      let d = ((k - i) % n + n) % n; if (d > n / 2) d -= n;
      const a = Math.abs(d), vis = a <= 2;
      s.style.transform = `translate(-50%,-50%) translateX(${d * sp}px) translateZ(${-a * 160}px) rotateY(${-d * 18}deg) scale(${1 - a * 0.08})`;
      s.style.opacity = vis ? String(1 - a * 0.28) : '0';
      s.style.visibility = vis ? 'visible' : 'hidden';
      s.style.zIndex = String(10 - a);
      s.style.filter = a ? `brightness(${1 - a * 0.25})` : 'none';
      s.classList.toggle('is-active', a === 0);
      s.setAttribute('aria-hidden', a === 0 ? 'false' : 'true');
      dots[k].setAttribute('aria-selected', a === 0 ? 'true' : 'false');
      dots[k].tabIndex = a === 0 ? 0 : -1;
    });
    label.textContent = slides[i].dataset.label;
  }

  function go(k) { i = ((k % n) + n) % n; render(); }
  function next() { go(i + 1); }
  function prev() { go(i - 1); }

  function start() {
    if (reduceMotion || timer) return;
    timer = setInterval(() => { if (!paused && !document.hidden) next(); }, INTERVAL);
  }
  function restart() {
    if (!timer) return;
    clearInterval(timer); timer = null; start();
  }

  slides.forEach((s, k) => s.addEventListener('click', () => {
    if (dragged) return;
    if (k !== i) { go(k); restart(); }
  }));

  // Hover / focus pause
  root.addEventListener('mouseenter', () => { paused = true; });
  root.addEventListener('mouseleave', () => { paused = false; });
  root.addEventListener('focusin', () => { paused = true; });
  root.addEventListener('focusout', () => { paused = false; });

  // Keyboard
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); restart(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); restart(); }
  });

  // Pointer swipe
  let startX = 0, startY = 0, tracking = false, dragged = false;
  root.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    startX = e.clientX; startY = e.clientY; tracking = true; dragged = false;
    paused = true;
  });
  root.addEventListener('pointermove', (e) => {
    if (!tracking) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (!dragged && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      dragged = true; root.classList.add('dragging');
    }
  });
  function endDrag(e) {
    if (!tracking) return;
    tracking = false;
    root.classList.remove('dragging');
    const dx = e.clientX - startX;
    if (dragged && Math.abs(dx) > 40) { dx < 0 ? next() : prev(); restart(); }
    if (e.pointerType !== 'mouse') paused = false;
    setTimeout(() => { dragged = false; }, 0);
  }
  root.addEventListener('pointerup', endDrag);
  root.addEventListener('pointercancel', endDrag);
  root.addEventListener('pointerleave', (e) => { if (tracking) endDrag(e); });

  window.addEventListener('resize', render);

  if (hint) {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    hint.textContent = coarse ? 'Tap a screen or swipe to browse' : 'Click a screen or use the arrow keys to browse';
  }

  render();
  start();
})();
