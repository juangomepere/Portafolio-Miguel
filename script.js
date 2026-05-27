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

/* ── 3D Renders Carousel ───────────────────────────────────────────────── */
const rendersTrack = document.getElementById('renders-track');
const prevBtn      = document.getElementById('prev-btn');
const nextBtn      = document.getElementById('next-btn');

if (rendersTrack) {
  const slides = rendersTrack.querySelectorAll('.carousel-slide');
  let cur = 0;
  let autoTimer;

  function goTo(n) {
    cur = ((n % slides.length) + slides.length) % slides.length;
    rendersTrack.style.transform = `translateX(-${cur * 100}%)`;
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(cur + 1), 4500);
  }

  prevBtn?.addEventListener('click', () => { goTo(cur - 1); resetAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(cur + 1); resetAuto(); });

  /* touch/swipe */
  let touchStartX = 0;
  rendersTrack.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  rendersTrack.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { goTo(dx < 0 ? cur + 1 : cur - 1); resetAuto(); }
  });

  resetAuto();
}

/* ── Packaging Carousel ────────────────────────────────────────────────── */
const pkgTrack = document.getElementById('pkg-track');
const pkgDots  = document.getElementById('pkg-dots');

if (pkgTrack && pkgDots) {
  const dots = pkgDots.querySelectorAll('.pkg-dot');
  let pkgCur = 0;
  let pkgTimer;

  function goToPkg(n) {
    pkgCur = ((n % dots.length) + dots.length) % dots.length;
    pkgTrack.style.transform = `translateX(-${pkgCur * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === pkgCur));
  }

  function resetPkgAuto() {
    clearInterval(pkgTimer);
    pkgTimer = setInterval(() => goToPkg(pkgCur + 1), 3500);
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goToPkg(+dot.dataset.index);
      resetPkgAuto();
    });
  });

  /* touch/swipe */
  let pkgTouchX = 0;
  pkgTrack.addEventListener('touchstart', (e) => { pkgTouchX = e.touches[0].clientX; }, { passive: true });
  pkgTrack.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - pkgTouchX;
    if (Math.abs(dx) > 50) { goToPkg(dx < 0 ? pkgCur + 1 : pkgCur - 1); resetPkgAuto(); }
  });

  resetPkgAuto();
}
