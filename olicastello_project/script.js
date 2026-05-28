/* ═══════════════════════════════════════════════════════════
   OliCastelló — script.js
   Features: Theme toggle, slider, filter, reveal, form
═══════════════════════════════════════════════════════════ */

/* ── THEME ──────────────────────────────────────────────── */
const LOGO_LIGHT_SRC = 'images/logo-dark.png';   // colored logo → light backgrounds
const LOGO_WHITE_SRC = 'images/logo-light.png';  // white logo   → dark backgrounds

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const isDark = theme === 'dark';

  // Swap nav logo
  const navLogo = document.getElementById('navLogo');
  if (navLogo) navLogo.src = isDark ? LOGO_WHITE_SRC : LOGO_LIGHT_SRC;

  // Footer always uses white logo (dark footer bg)
  const footLogo = document.getElementById('footLogo');
  if (footLogo) footLogo.src = LOGO_WHITE_SRC;

  // Swap theme icon (sun ↔ moon)
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.innerHTML = isDark
      ? '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
      : '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('olic-theme', next); } catch(e) {}
}

// Init theme from localStorage on page load
(function initTheme() {
  let saved = 'light';
  try { saved = localStorage.getItem('olic-theme') || 'light'; } catch(e) {}
  applyTheme(saved);
})();


/* ── NAVIGATION SCROLL ──────────────────────────────────── */
const nav = document.getElementById('mainNav');
const fcta = document.getElementById('fcta');

window.addEventListener('scroll', () => {
  if (nav)  nav.classList.toggle('scrolled',  window.scrollY > 60);
  if (fcta) fcta.classList.toggle('show',     window.scrollY > 500);
}, { passive: true });


/* ── MOBILE MENU ────────────────────────────────────────── */
function toggleMenu() {
  const menu = document.getElementById('mobMenu');
  if (menu) menu.classList.toggle('open');
}

// Close mobile menu when clicking any link inside it
document.querySelectorAll('.mob a').forEach(link => {
  link.addEventListener('click', () => {
    const menu = document.getElementById('mobMenu');
    if (menu) menu.classList.remove('open');
  });
});


/* ── PRODUCT SLIDER ─────────────────────────────────────── */
const slides  = document.querySelectorAll('.slide');
const track   = document.getElementById('sliderTrack');
const dotsEl  = document.getElementById('sliderDots');
const cntEl   = document.getElementById('sliderCnt');
let current = 0;
let autoTimer;

// Build dots
if (slides.length && dotsEl) {
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'sdot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });
}

function goTo(n) {
  current = (n + slides.length) % slides.length;
  if (track) track.style.transform = `translateX(-${current * 100}%)`;
  if (dotsEl) dotsEl.querySelectorAll('.sdot').forEach((d, i) => d.classList.toggle('active', i === current));
  if (cntEl)  cntEl.textContent = `${current + 1} / ${slides.length}`;
  resetAuto();
}

function slideNext() { goTo(current + 1); }
function slidePrev() { goTo(current - 1); }

function resetAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(slideNext, 5500);
}
resetAuto();

// Touch/swipe support
let touchStartX = 0;
if (track) {
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? slideNext() : slidePrev();
  });
}


/* ── PRODUCT FILTER ─────────────────────────────────────── */
function filterProducts(tag, btn) {
  // Update active button
  document.querySelectorAll('.fb').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Show/hide product cards
  document.querySelectorAll('#catalogGrid .pcard').forEach(card => {
    const tags = card.getAttribute('data-tags') || '';
    card.style.display = (tag === 'all' || tags.includes(tag)) ? '' : 'none';
  });
}


/* ── SCROLL REVEAL ANIMATION ────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ── SMOOTH SCROLL ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    // Close mobile menu if open
    const menu = document.getElementById('mobMenu');
    if (menu) menu.classList.remove('open');
  });
});


/* ── CONTACT FORM ───────────────────────────────────────── */
function handleForm(e) {

  e.preventDefault();

  const form = e.target;

  const inputs = form.querySelectorAll('input');

  const name = inputs[0]?.value || '';

  const phone = inputs[1]?.value || '';

  const textarea =
    form.querySelector('textarea');

  const message = textarea?.value || '';

  const text = `
🫒 Новая заявка OliCastelló

👤 Имя: ${name}

📞 Телефон: ${phone}

💬 Сообщение:
${message}
`;

  fetch('https://api.telegram.org/bot8943204180:AAGwjn1fm4toAnky_yYiZzvO0Y826-7T29U/sendMessage', {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({

      chat_id: '1220871393',

      text: text

    })

  })

  .then(() => {

    const ok =
      document.getElementById('formOk');

    if (ok) {
      ok.style.display = 'block';
    }

    form.reset();

    setTimeout(() => {

      if (ok) {
        ok.style.display = 'none';
      }

    }, 5000);

  })

  .catch(err => {

    console.log(err);

    alert('Ошибка отправки');

  });

}
