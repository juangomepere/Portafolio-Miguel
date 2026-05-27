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
