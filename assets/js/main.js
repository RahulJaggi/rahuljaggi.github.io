/**
 * main.js — Rahul Jaggi Portfolio
 * Handles: nav scroll effect, mobile menu, scroll reveal,
 *          particle canvas, smooth scroll, form feedback
 */

(function () {
  'use strict';

  // ============================================================
  // NAV — scroll effect & mobile toggle
  // ============================================================
  const nav = document.getElementById('main-nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen.toString());
    });

    // Close on link click
    navLinks.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ============================================================
  // SCROLL REVEAL — Intersection Observer
  // ============================================================
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // Stagger sibling cards
            const siblings = entry.target.parentElement.querySelectorAll('.reveal');
            let delay = 0;
            siblings.forEach((sib, idx) => {
              if (sib === entry.target) delay = idx * 80;
            });
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ============================================================
  // PARTICLE CANVAS
  // ============================================================
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrameId;

    const COLORS = ['rgba(124, 92, 252, 0.6)', 'rgba(6, 214, 160, 0.5)', 'rgba(255, 107, 107, 0.4)'];

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: Math.random(),
        lifeSpeed: Math.random() * 0.005 + 0.002,
      };
    }

    function initParticles() {
      const count = Math.floor((canvas.width * canvas.height) / 12000);
      particles = Array.from({ length: Math.min(count, 80) }, createParticle);
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += p.lifeSpeed;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const opacity = Math.sin(p.life) * 0.7 + 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${opacity.toFixed(2)})`);
        ctx.fill();

        // Draw connections
        particles.slice(i + 1, i + 6).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(124, 92, 252, ${(1 - dist / 120) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animFrameId = requestAnimationFrame(drawParticles);
    }

    resize();
    initParticles();
    drawParticles();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      initParticles();
    });
    resizeObserver.observe(canvas.parentElement);

    // Pause when tab not visible (performance)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrameId);
      } else {
        drawParticles();
      }
    });
  }

  // ============================================================
  // SMOOTH SCROLL for anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================================
  // CONTACT FORM — basic UX feedback
  // ============================================================
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (form && submitBtn) {
    form.addEventListener('submit', async (e) => {
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;

      // Re-enable after 3s if no redirect
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 3000);
    });
  }

  // ============================================================
  // ACTIVE NAV LINK based on scroll position
  // ============================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav__link');

  if (sections.length && navLinkEls.length) {
    window.addEventListener('scroll', () => {
      let currentSection = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 100) {
          currentSection = sec.id;
        }
      });

      navLinkEls.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(currentSection)) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }

})();
