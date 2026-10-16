/* ==========================================================
   TASAWWAR HUSSAIN — PORTFOLIO SCRIPT
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- PRELOADER ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 300);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => preloader.classList.add('hidden'), 2000);

  /* ---------- MOBILE NAV ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });

  /* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinkEls.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  /* ---------- TYPING ANIMATION ---------- */
  // EDIT: change these words to update the rotating hero text
  const words = ['AI Ads Video Editing', 'Co-Founder of 5ByteSolution', 'Meta Ads Expert'];
  const typedEl = document.getElementById('typedText');
  let wordIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const current = words[wordIndex];

    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(typeLoop, deleting ? 45 : 90);
  }
  typeLoop();

  /* ---------- FADE-IN ON SCROLL ---------- */
  const fadeEls = document.querySelectorAll('.fade-in');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  fadeEls.forEach(el => io.observe(el));

  /* ---------- SKILL BARS + ANIMATED COUNTER ---------- */
  const skillCards = document.querySelectorAll('.skill-card');
  const skillIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const bar = card.querySelector('.skill-fill');
        const percentEl = card.querySelector('.skill-percent');
        const target = parseInt(bar.dataset.percent, 10);

        bar.style.width = target + '%';

        let current = 0;
        const step = Math.max(1, Math.round(target / 40));
        const counter = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(counter);
          }
          percentEl.textContent = current + '%';
        }, 25);

        skillIo.unobserve(card);
      }
    });
  }, { threshold: 0.4 });
  skillCards.forEach(card => skillIo.observe(card));

  /* ---------- SCROLL TO TOP ---------- */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('show', window.scrollY > 400);
  });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- IMAGE FALLBACK ----------
     If a local image file hasn't been uploaded yet (e.g. images/profile.jpg
     is missing), hide the broken-image icon and let the element's background
     gradient show through instead of an ugly broken icon. */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => img.classList.add('img-error'));
  });

  /* ---------- FOOTER YEAR ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- CONTACT FORM ----------
     NOTE: This form currently has no backend attached, so submissions
     are not sent or stored anywhere. To actually receive messages,
     connect it to a service like Formspree (https://formspree.io) or
     EmailJS (https://www.emailjs.com), or wire it to your own API. */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = 'Thanks! (Connect this form to a backend to actually receive messages.)';
    contactForm.reset();
  });

  /* ---------- PROJECT VIDEO MODAL ----------
     Plays the Google Drive video right inside the site using Drive's
     embeddable preview URL: https://drive.google.com/file/d/FILE_ID/preview
     IMPORTANT: each Drive file must be shared as "Anyone with the link
     can view" or the embedded player will show an access-denied screen. */
  const videoModal = document.getElementById('videoModal');
  const videoModalBox = document.querySelector('.video-modal-box');
  const videoModalIframe = document.getElementById('videoModalIframe');
  const videoModalVideo = document.getElementById('videoModalVideo');
  const videoModalClose = document.getElementById('videoModalClose');
  const videoModalBackdrop = document.getElementById('videoModalBackdrop');

  function openVideoModal({ driveId, localSrc }) {
    if (localSrc) {
      videoModalBox.classList.add('is-local');
      videoModalVideo.src = localSrc;
      videoModalVideo.play().catch(() => {});
    } else {
      videoModalBox.classList.remove('is-local');
      videoModalIframe.src = `https://drive.google.com/file/d/${driveId}/preview`;
    }
    videoModal.classList.add('open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    videoModal.classList.remove('open');
    videoModal.setAttribute('aria-hidden', 'true');
    videoModalIframe.src = '';
    videoModalVideo.pause();
    videoModalVideo.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.videoType === 'local') {
        openVideoModal({ localSrc: btn.dataset.videoSrc });
      } else if (btn.dataset.videoId) {
        openVideoModal({ driveId: btn.dataset.videoId });
      }
    });
  });

  // Clicking the thumbnail also opens the matching card's video
  document.querySelectorAll('.project-card').forEach(card => {
    const thumb = card.querySelector('.project-thumb');
    const btn = card.querySelector('.btn-view');
    if (thumb && btn) {
      thumb.addEventListener('click', () => btn.click());
    }
  });

  videoModalClose.addEventListener('click', closeVideoModal);
  videoModalBackdrop.addEventListener('click', closeVideoModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideoModal();
  });

  /* ---------- NETWORK / DOTS CANVAS BACKGROUND (hero) ---------- */
  const canvas = document.getElementById('networkCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, points;

  function resizeCanvas() {
    const hero = document.querySelector('.hero');
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
    const count = Math.floor((w * h) / 22000);
    points = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3
    }));
  }

  function drawNetwork() {
    ctx.clearRect(0, 0, w, h);
    points.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    });

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.strokeStyle = `rgba(22, 36, 77, ${1 - dist / 140})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }
    points.forEach(p => {
      ctx.fillStyle = 'rgba(245, 130, 12, 0.55)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(drawNetwork);
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  resizeCanvas();
  if (!reducedMotion) drawNetwork();
  window.addEventListener('resize', resizeCanvas);

});
