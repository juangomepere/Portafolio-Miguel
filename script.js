'use strict';

/* ── Scroll Reveal ─────────────────────────────────────────────────────── */
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

/* ── Ojito grid entry animation ─────────────────────────────────────────── */
const ojitoWrap = document.querySelector('.ojito-wrap');
if (ojitoWrap) {
  const ojObs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        ojitoWrap.classList.add('ojito-visible');
        ojObs.disconnect();
      }
    },
    { threshold: 0.15 }
  );
  ojObs.observe(ojitoWrap);
}

/* ── Illustrations Fan ─────────────────────────────────────────────────── */
const illusFan = document.querySelector('.illus-fan');
if (illusFan) {
  const fanObs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        illusFan.classList.add('spread');
        fanObs.disconnect();
      }
    },
    { threshold: 0.25 }
  );
  fanObs.observe(illusFan);
}

/* ── 3D Renders Carousel — hold to scroll ──────────────────────────────── */
const rendersTrack = document.getElementById('renders-track');
const prevBtn      = document.getElementById('prev-btn');
const nextBtn      = document.getElementById('next-btn');

if (rendersTrack) {
  const screen = rendersTrack.parentElement;
  let scrollX = 0;
  let rafId   = null;
  const SPEED = 5;

  function getMax() {
    return rendersTrack.scrollWidth - screen.offsetWidth;
  }

  function scroll(dir) {
    scrollX = Math.max(0, Math.min(scrollX + dir * SPEED, getMax()));
    rendersTrack.style.transform = `translateX(-${scrollX}px)`;
    rafId = requestAnimationFrame(() => scroll(dir));
  }

  function stop() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  [[prevBtn, -1], [nextBtn, 1]].forEach(([btn, dir]) => {
    if (!btn) return;
    btn.addEventListener('mousedown',  () => scroll(dir));
    btn.addEventListener('touchstart', () => scroll(dir), { passive: true });
    btn.addEventListener('mouseup',    stop);
    btn.addEventListener('mouseleave', stop);
    btn.addEventListener('touchend',   stop);
  });

  document.addEventListener('mouseup', stop);
}

/* ── Lego Deadpool Carousel (slide + fade) ──────────────────────────────── */
const legoTrack = document.getElementById('lego-track');
if (legoTrack) {
  const legoSlides = legoTrack.querySelectorAll('.lego-slide');
  let legoCur = 0;

  setInterval(() => {
    const prev = legoCur;
    legoCur = (legoCur + 1) % legoSlides.length;
    legoSlides[prev].classList.add('exiting');
    legoSlides[prev].classList.remove('active');
    legoSlides[legoCur].classList.add('active');
    setTimeout(() => legoSlides[prev].classList.remove('exiting'), 700);
  }, 3000);
}

/* ── Proyectos 3D — Fade (Principito / Tren) ──────────────────────────── */
const projSlides = document.querySelectorAll('.project-slide');
if (projSlides.length) {
  let projCur = 0;
  setInterval(() => {
    projSlides[projCur].classList.remove('active');
    projCur = (projCur + 1) % projSlides.length;
    projSlides[projCur].classList.add('active');
  }, 5000);
}

/* ── Festival carousel — ping-pong ────────────────────────────────────── */
const festTrack = document.getElementById('fest-carousel-track');
if (festTrack) {
  /* duplicate images for seamless fill */
  Array.from(festTrack.children).forEach(img => {
    const clone = img.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    festTrack.appendChild(clone);
  });

  let pos = 0;
  let dir = -1;
  const SPEED = 0.9;

  (function tick() {
    const maxScroll = festTrack.scrollWidth - festTrack.parentElement.offsetWidth;
    pos += dir * SPEED;
    if (pos <= -maxScroll) { pos = -maxScroll; dir = 1; }
    if (pos >= 0)           { pos = 0;          dir = -1; }
    festTrack.style.transform = `translateX(${pos}px)`;
    requestAnimationFrame(tick);
  })();
}

/* ── Packaging Fan + Grid ──────────────────────────────────────────────── */
const pkgStage = document.getElementById('pkg-stage');
if (pkgStage) {
  const pkgCards = Array.from(pkgStage.querySelectorAll('.pkg-card'));
  let pkgExpanded = false;

  function pkgApplyCenter() {
    pkgCards.forEach((c, i) => {
      c.style.width     = '';
      c.style.height    = '';
      c.style.top       = '';
      c.style.transform = 'translateX(-50%)';
      c.style.opacity   = i === 1 ? '1' : '0';
    });
    pkgCards[0].style.zIndex = '1';
    pkgCards[1].style.zIndex = '3';
    pkgCards[2].style.zIndex = '2';
    /* read offsetWidth after clearing inline styles to get CSS-computed value */
    const cw  = pkgCards[1].offsetWidth;
    const pad = Math.max(12, Math.round(pkgStage.offsetWidth * 0.015));
    pkgStage.style.height = (pad + Math.round(cw * 1.25) + pad) + 'px';
  }

  function pkgApplyFan() {
    const cw     = pkgCards[1].offsetWidth;
    const sw     = pkgStage.offsetWidth;
    const offset = Math.round(Math.min(cw * 0.72, (sw / 2) * 0.78));
    pkgCards.forEach(c => { c.style.opacity = '1'; });
    pkgCards[0].style.transform = `translateX(calc(-50% - ${offset}px)) rotate(-18deg)`;
    pkgCards[1].style.transform = 'translateX(-50%)';
    pkgCards[2].style.transform = `translateX(calc(-50% + ${offset}px)) rotate(18deg)`;
  }

  function pkgApplyGrid() {
    const sw  = pkgStage.offsetWidth;
    const pad = Math.max(16, Math.round(sw * 0.018));
    const gap = Math.max(8,  Math.round(sw * 0.012));
    const cw  = Math.floor((sw - pad * 2 - gap * 2) / 3);
    const ch  = Math.floor(cw * 1.25);
    const top = pad;

    pkgStage.style.height = (top + ch + top) + 'px';

    const lefts = [pad, pad + cw + gap, pad + cw * 2 + gap * 2];
    const half  = sw / 2;

    pkgCards.forEach((c, i) => {
      const extra = lefts[i] + cw / 2 - half;
      c.style.width     = cw + 'px';
      c.style.height    = ch + 'px';
      c.style.top       = top + 'px';
      c.style.opacity   = '1';
      c.style.zIndex    = '1';
      c.style.transform = `translateX(calc(-50% + ${extra}px))`;
    });
  }

  /* Init without animation then enable transitions */
  pkgCards.forEach(c => { c.style.transition = 'none'; });
  requestAnimationFrame(() => {
    pkgApplyCenter();
    requestAnimationFrame(() => {
      const trans =
        'transform 0.55s cubic-bezier(0.34,1.1,0.64,1), ' +
        'opacity 0.45s ease, ' +
        'width 0.55s cubic-bezier(0.34,1.1,0.64,1), ' +
        'height 0.55s cubic-bezier(0.34,1.1,0.64,1)';
      pkgCards.forEach(c => { c.style.transition = trans; });
    });
  });

  pkgStage.addEventListener('mouseenter', () => {
    if (!pkgExpanded) pkgApplyFan();
  });
  pkgStage.addEventListener('mouseleave', () => {
    if (!pkgExpanded) pkgApplyCenter();
  });
  pkgStage.addEventListener('click', () => {
    pkgExpanded = !pkgExpanded;
    if (pkgExpanded) pkgApplyGrid();
    else             pkgApplyCenter();
  });

  let pkgResizeId;
  window.addEventListener('resize', () => {
    clearTimeout(pkgResizeId);
    pkgResizeId = setTimeout(() => {
      if (pkgExpanded) pkgApplyGrid(); else pkgApplyCenter();
    }, 100);
  });
}
