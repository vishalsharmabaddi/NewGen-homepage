/* ══════════════════════════════════════════════
   NewGen Solar & Heat Pumps — Scripts
   ══════════════════════════════════════════════ */

// Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.1 });
document.querySelectorAll('.newgen-rev').forEach(el => obs.observe(el));

// Navbar shadow on scroll
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
});

// Mobile nav toggle
function toggleMob() {
  document.getElementById('mobNav').classList.toggle('open');
}
function closeMob(e) {
  if (e.target === document.getElementById('mobNav')) {
    document.getElementById('mobNav').classList.remove('open');
  }
}

// FAQ accordion
function toggleFaq(btn) {
  const item = btn.closest('.newgen-faq-item');
  const ans = item.querySelector('.newgen-faq-a');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.newgen-faq-item').forEach(i => {
    i.classList.remove('open');
    i.querySelector('.newgen-faq-a').classList.remove('open');
  });
  if (!wasOpen) {
    item.classList.add('open');
    ans.classList.add('open');
  }
}

// Testimonial slider
let idx = 0;
const track = document.getElementById('tTrack');

function getVisible() {
  if (window.innerWidth <= 480) return 1;
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 4;
}

// Reset slider on resize to prevent misalignment
window.addEventListener('resize', () => {
  const vis = getVisible();
  const cards = track.querySelectorAll('.newgen-t-card');
  const max = cards.length - vis;
  if (idx > max) idx = Math.max(0, max);
  slide(0);
});

function slide(dir) {
  const cards = track.querySelectorAll('.newgen-t-card');
  const vis = getVisible();
  const max = cards.length - vis;
  idx = Math.max(0, Math.min(idx + dir, max));
  const w = cards[0].offsetWidth + 22;
  track.style.transform = `translateX(-${idx * w}px)`;
}

// Auto-advance testimonials (pauses on hover)
let autoSlideInterval;
function startAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(() => {
    const cards = track.querySelectorAll('.newgen-t-card');
    const vis = getVisible();
    if (idx >= cards.length - vis) idx = -1;
    slide(1);
  }, 5500);
}
startAutoSlide();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = a.getAttribute('href');
    if (t === '#') return;
    e.preventDefault();
    const el = document.querySelector(t);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById('mobNav').classList.remove('open');
    }
  });
});

// ── WHY SWITCH: 3D tilt effect on reason cards ──
document.querySelectorAll('.newgen-rcard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -6;
    const rotateY = ((x - cx) / cx) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-7px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── WHY SWITCH: Animated number counter for .newgen-rnum ──
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.counted) {
      e.target.dataset.counted = 'true';
      const target = parseInt(e.target.textContent);
      let current = 0;
      const step = Math.max(1, Math.floor(target / 30));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        e.target.textContent = String(current).padStart(2, '0');
      }, 35);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.newgen-rnum').forEach(el => {
  el.dataset.counted = '';
  counterObs.observe(el);
});

// ── WHY SWITCH: Staggered card entrance on scroll ──
const staggerObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.staggered) {
      e.target.dataset.staggered = 'true';
      const cards = e.target.querySelectorAll('.newgen-rcard');
      cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px) scale(0.95)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, i * 120);
      });
    }
  });
}, { threshold: 0.15 });
const reasonsGrid = document.querySelector('.newgen-reasons');
if (reasonsGrid) staggerObs.observe(reasonsGrid);

// ── TESTIMONIALS: Drag/swipe to slide ──
let isDragging = false, startX = 0, dragOffset = 0, baseTranslate = 0;

track.addEventListener('mousedown', e => {
  isDragging = true;
  startX = e.clientX;
  const style = getComputedStyle(track);
  const matrix = new DOMMatrixReadOnly(style.transform);
  baseTranslate = matrix.m41;
  track.style.transition = 'none';
  track.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', e => {
  if (!isDragging) return;
  dragOffset = e.clientX - startX;
  track.style.transform = `translateX(${baseTranslate + dragOffset}px)`;
});

document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  track.style.cursor = '';
  track.style.transition = 'transform .55s cubic-bezier(.4,0,.2,1)';
  if (Math.abs(dragOffset) > 60) {
    slide(dragOffset < 0 ? 1 : -1);
  } else {
    slide(0);
  }
  dragOffset = 0;
});

// Touch swipe support for testimonials
let touchStartX = 0;
track.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  track.style.transition = 'none';
}, { passive: true });

track.addEventListener('touchmove', e => {
  const diff = e.touches[0].clientX - touchStartX;
  const style = getComputedStyle(track);
  const matrix = new DOMMatrixReadOnly(style.transform);
  track.style.transform = `translateX(${matrix.m41 + diff * 0.3}px)`;
}, { passive: true });

track.addEventListener('touchend', e => {
  const diff = e.changedTouches[0].clientX - touchStartX;
  track.style.transition = 'transform .55s cubic-bezier(.4,0,.2,1)';
  if (Math.abs(diff) > 50) {
    slide(diff < 0 ? 1 : -1);
  } else {
    slide(0);
  }
});

// ── TESTIMONIALS: 3D tilt effect on review cards ──
document.querySelectorAll('.newgen-t-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -4;
    const rotateY = ((x - cx) / cx) * 4;
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── TESTIMONIALS: Pause auto-slide on hover ──
track.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
track.addEventListener('mouseleave', () => startAutoSlide());
