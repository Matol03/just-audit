/* ============ NAVIGATION ============ */
const nav       = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('is-open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('is-open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ============ SCROLL REVEAL ============ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ============ COUNTER ANIMATION ============ */
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseInt(el.dataset.target, 10);
    const dur    = 1600;
    const step   = target / (dur / 16);
    let cur = 0;
    const tick = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(tick); }
      el.textContent = Math.floor(cur);
    }, 16);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObs.observe(el));

/* ============ GALLERY CAROUSEL ============ */
const PHOTO_IDS = [
  '1dXXIpvGChKUyOwBnDDq-fdQbv50jreZn',
  '18lwa9ofukCIEZoCTSb9MnnhQ411UPFdz',
  '1if6V7amZDP3koWq_uNPK_ScH8JjsV3Dk',
  '1VBMXidgulwcaxIU2wPLCIR7TXmCwEZwq',
  '1pRraJIkUZQ7Fj8cBnf44EXPqKOPmshbK',
  '1k_5hLuBPsUg0uKU1qkYx6Oy8DfMr8MJl',
  '1EhpeR1oOCG9lVtPTIhlTg_b_i8CKbEfL',
  '1FZ2hbDPouspNaiArA6YsaBU8v5_NNmeG',
  '1kz09nV4wp0i61cL9EsqxkdqARXjCBpdT',
  '1lTNVpFsZsDwDNr-kRMFjA7Jl5EROZRfN',
  '1VVKltmzabWRaxr6nO8Cw6w_uXjIpisUz',
  '1lDB5zKv5bmGoAMYVf2iVTiht8t6j8-rD',
];

const track   = document.getElementById('carTrack');
const dotsEl  = document.getElementById('carDots');
let current   = 0;
let autoTimer = null;

function gdUrl(id) {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;
}

/* Build slides */
PHOTO_IDS.forEach((id, i) => {
  const slide = document.createElement('div');
  slide.className = 'car-slide';
  const img = document.createElement('img');
  img.src     = gdUrl(id);
  img.alt     = `Just Audit · Photo ${i + 1}`;
  img.loading = i < 3 ? 'eager' : 'lazy';
  slide.appendChild(img);
  slide.appendChild(Object.assign(document.createElement('div'), { className: 'car-slide-caption' }));
  track.appendChild(slide);

  const dot = document.createElement('button');
  dot.className = 'car-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
  dot.addEventListener('click', () => { goto(i); resetAuto(); });
  dotsEl.appendChild(dot);
});

function goto(idx) {
  current = (idx + PHOTO_IDS.length) % PHOTO_IDS.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  dotsEl.querySelectorAll('.car-dot').forEach((d, i) => d.classList.toggle('active', i === current));
}

function resetAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goto(current + 1), 4500);
}

document.getElementById('carPrev').addEventListener('click', () => { goto(current - 1); resetAuto(); });
document.getElementById('carNext').addEventListener('click', () => { goto(current + 1); resetAuto(); });

/* Touch/swipe support */
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) { goto(current + (dx < 0 ? 1 : -1)); resetAuto(); }
});

/* Pause on hover */
track.addEventListener('mouseenter', () => clearInterval(autoTimer));
track.addEventListener('mouseleave', resetAuto);

resetAuto();

/* ============ CONTACT FORM ============ */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = '✓ Message Sent — We\'ll be in touch!';
    btn.style.background = 'var(--sage)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 4000);
  });
}

/* ============ SMOOTH ANCHOR SCROLL ============ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
