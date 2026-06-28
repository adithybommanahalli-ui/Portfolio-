/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO — MAIN JAVASCRIPT
   Minimal. Intentional. No dependencies.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── SCROLL REVEAL ───
  // Uses IntersectionObserver to add .revealed class
  function initScrollReveal() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
  }


  // ─── NAVIGATION ───
  function initNav() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('nav-toggle');
    const mobile = document.getElementById('nav-mobile');
    const mobileLinks = mobile.querySelectorAll('.nav-mobile__link');
    const navLinks = document.querySelectorAll('.nav__link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      nav.classList.toggle('scrolled', y > 50);
      lastScroll = y;
    }, { passive: true });

    // Mobile toggle
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      mobile.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      mobile.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile on link click
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobile.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        mobile.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });

    // Active link based on scroll
    const sections = document.querySelectorAll('section[id]');
    const observerNav = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-80px 0px -50% 0px',
      }
    );

    sections.forEach((section) => observerNav.observe(section));
  }


  // ─── COMP PANEL: TYPING EFFECT ───
  function initCompTyping() {
    const nameEl = document.getElementById('comp-name');
    const cursorEl = document.getElementById('comp-cursor');
    if (!nameEl) return;

    const text = 'COMP_01 — Portfolio_2025.aep';
    let index = 0;

    function type() {
      if (index < text.length) {
        nameEl.textContent += text[index];
        index++;
        setTimeout(type, 55 + Math.random() * 40);
      }
    }

    // Start after a short delay
    setTimeout(type, 800);
  }


  // ─── COMP PANEL: FRAME COUNTER ───
  function initFrameCounter() {
    const counter = document.getElementById('frame-counter');
    if (!counter) return;

    let frame = 0;
    const maxFrames = 14400; // 10 min at 24fps

    setInterval(() => {
      frame = (frame + 1) % maxFrames;
      counter.textContent = String(frame).padStart(5, '0');
    }, 42); // ~24fps
  }


  // ─── COMP PANEL: RENDER PROGRESS ───
  function initRenderProgress() {
    const bar = document.getElementById('render-progress');
    const pct = document.getElementById('render-pct');
    if (!bar || !pct) return;

    let progress = 0;
    const target = 87;

    function step() {
      if (progress < target) {
        // Slow down as it approaches target
        const increment = Math.max(0.1, (target - progress) * 0.008);
        progress = Math.min(progress + increment, target);
        bar.style.width = progress.toFixed(1) + '%';
        pct.textContent = Math.round(progress) + '%';
        requestAnimationFrame(step);
      }
    }

    // Start after panel is visible
    setTimeout(step, 1500);
  }


  // ─── COMP PANEL: WAVEFORM ───
  function initWaveform() {
    const container = document.getElementById('waveform');
    if (!container) return;

    const barCount = 40;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      bar.className = 'waveform-bar';

      // Create a natural-looking waveform pattern
      const position = i / barCount;
      const wave1 = Math.sin(position * Math.PI * 4) * 0.3;
      const wave2 = Math.sin(position * Math.PI * 7 + 1) * 0.2;
      const wave3 = Math.sin(position * Math.PI * 11 + 2) * 0.15;
      const base = 0.15;
      const height = Math.abs(base + wave1 + wave2 + wave3);
      const pxHeight = Math.max(2, Math.min(28, height * 50));

      bar.style.height = pxHeight + 'px';
      fragment.appendChild(bar);
    }

    container.appendChild(fragment);

    // Subtle animation: randomly vary bar heights
    setInterval(() => {
      const bars = container.children;
      const randomIndex = Math.floor(Math.random() * bars.length);
      const bar = bars[randomIndex];
      const currentHeight = parseFloat(bar.style.height);
      const variation = (Math.random() - 0.5) * 4;
      const newHeight = Math.max(2, Math.min(28, currentHeight + variation));
      bar.style.height = newHeight + 'px';
    }, 150);
  }


  // ─── SKILL BARS ───
  function initSkillBars() {
    const fills = document.querySelectorAll('.skill-bar__fill');
    if (!fills.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate all skill bars with stagger
            fills.forEach((fill, i) => {
              setTimeout(() => {
                fill.style.width = fill.dataset.skill + '%';
              }, i * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe the skills grid container
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) observer.observe(skillsGrid);
  }


  // ─── SMOOTH SCROLL FOR NAV LINKS ───
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }


  // ─── INIT ───
  function init() {
    initScrollReveal();
    initNav();
    initCompTyping();
    initFrameCounter();
    initRenderProgress();
    initWaveform();
    initSkillBars();
    initSmoothScroll();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
