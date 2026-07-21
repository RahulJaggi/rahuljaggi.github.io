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
    const updateActiveLink = () => {
      let currentSection = '';
      sections.forEach(sec => {
        const sectionTop = sec.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
          currentSection = sec.id;
        }
      });

      navLinkEls.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href') || '';
        if (currentSection && href.includes('#' + currentSection)) {
          link.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink(); // run on load
  }

})();


  // ============================================================
  // INTERACTIVE PROJECT BROWSER MODAL
  // ============================================================
  const modal = document.getElementById("project-modal");
  const modalBackdrop = document.getElementById("project-modal-backdrop");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalCloseDot = document.getElementById("modal-close-dot");
  const modalUrl = document.getElementById("modal-browser-url");
  const modalBody = document.getElementById("modal-body");

  // Project Previews Database
  const PROJECT_PREVIEWS = {
    "nextjs-enterprise-admin": {
      title: "Next.js Enterprise Admin Panel",
      icon: "⚙️",
      url: "https://nextjs-enterprise-admin-demo.vercel.app",
      highlight: "Production-Ready Next.js 15 & React 19 Architecture",
      github: "https://github.com/RahulJaggi/nextjs-enterprise-admin",
      live: "https://nextjs-enterprise-admin-demo.vercel.app",
      tech: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Shadcn UI", "Zustand"],
      renderInterface: function() {
        return `
          <div class="mock-app">
            <div class="mock-app__topbar">
              <div style="display:flex;align-items:center;gap:12px;">
                <span style="font-weight:800;color:#7c5cfc;font-size:1.1rem;">NEXUS ADMIN</span>
                <span style="font-size:0.75rem;background:rgba(6,214,160,0.15);color:#06d6a0;padding:2px 8px;border-radius:12px;">v15.2.0</span>
              </div>
              <div style="display:flex;align-items:center;gap:12px;">
                <input type="text" class="mock-app__search" placeholder="🔍 Search users, logs, APIs..." id="admin-search">
                <span style="cursor:pointer;font-size:1.1rem;">🔔</span>
                <div style="width:32px;height:32px;border-radius:50%;background:#7c5cfc;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:0.8rem;">RJ</div>
              </div>
            </div>
            <div class="mock-app__layout">
              <div class="mock-app__sidebar">
                <div class="mock-app__nav-item active">📊 Dashboard</div>
                <div class="mock-app__nav-item">👥 User Management</div>
                <div class="mock-app__nav-item">📈 Analytics & Logs</div>
                <div class="mock-app__nav-item">🔑 RBAC & Security</div>
                <div class="mock-app__nav-item">⚙️ System Settings</div>
              </div>
              <div class="mock-app__main">
                <div class="mock-app__metrics">
                  <div class="mock-app__metric-card">
                    <div class="mock-app__metric-lbl">TOTAL REVENUE</div>
                    <div class="mock-app__metric-val">$148,250</div>
                    <div class="mock-app__metric-change">↑ 18.4% this month</div>
                  </div>
                  <div class="mock-app__metric-card">
                    <div class="mock-app__metric-lbl">ACTIVE USERS</div>
                    <div class="mock-app__metric-val">24,890</div>
                    <div class="mock-app__metric-change">↑ 12.1% active now</div>
                  </div>
                  <div class="mock-app__metric-card">
                    <div class="mock-app__metric-lbl">API LATENCY</div>
                    <div class="mock-app__metric-val">38ms</div>
                    <div class="mock-app__metric-change" style="color:#06d6a0;">⚡ Optimal Performance</div>
                  </div>
                </div>
                <div>
                  <h4 style="color:#fff;margin-bottom:10px;font-size:0.95rem;">Recent User Sessions & Role Permissions</h4>
                  <table class="mock-app__table">
                    <thead>
                      <tr><th>User</th><th>Role</th><th>Status</th><th>Last Active</th></tr>
                    </thead>
                    <tbody id="admin-table-body">
                      <tr><td>Rahul Jaggi (Lead)</td><td><span style="color:#7c5cfc;">Super Admin</span></td><td><span style="color:#06d6a0;">● Online</span></td><td>Just now</td></tr>
                      <tr><td>Alex Vance</td><td>Admin</td><td><span style="color:#06d6a0;">● Online</span></td><td>2m ago</td></tr>
                      <tr><td>Elena Rostova</td><td>Developer</td><td><span style="color:#888;">Offline</span></td><td>1h ago</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        `;
      }
    },
    "vertex-ui": {
      title: "Vertex UI Component Library",
      icon: "🎨",
      url: "https://vertex-ui-storybook.vercel.app",
      highlight: "Enterprise React Component System with Storybook & Tailwind",
      github: "https://github.com/RahulJaggi/vertex-ui",
      live: "https://vertex-ui-storybook.vercel.app",
      tech: ["React", "TypeScript", "Tailwind CSS", "Storybook", "Framer Motion"],
      renderInterface: function() {
        return `
          <div class="mock-app" style="padding:24px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
              <div>
                <h3 style="color:#fff;margin-bottom:4px;">Vertex UI Component Showcase</h3>
                <p style="color:#9090a8;font-size:0.85rem;">Interactive component previews with dark mode support</p>
              </div>
              <span style="background:rgba(124,92,252,0.2);color:#9b7ffe;padding:4px 12px;border-radius:20px;font-size:0.8rem;font-family:var(--font-mono);">Storybook v8.0</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:20px;">
              <div style="background:#151627;padding:18px;border-radius:10px;border:1px solid rgba(255,255,255,0.08);">
                <h4 style="color:#9b7ffe;font-size:0.85rem;margin-bottom:12px;">BUTTON VARIANTS</h4>
                <div style="display:flex;flex-wrap:wrap;gap:10px;">
                  <button style="background:#7c5cfc;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-weight:600;cursor:pointer;">Primary</button>
                  <button style="background:transparent;color:#06d6a0;border:1px solid #06d6a0;padding:8px 16px;border-radius:6px;font-weight:600;cursor:pointer;">Outline</button>
                  <button style="background:rgba(255,255,255,0.08);color:#fff;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;">Ghost</button>
                </div>
              </div>
              <div style="background:#151627;padding:18px;border-radius:10px;border:1px solid rgba(255,255,255,0.08);">
                <h4 style="color:#9b7ffe;font-size:0.85rem;margin-bottom:12px;">STATUS BADGES</h4>
                <div style="display:flex;flex-wrap:wrap;gap:8px;">
                  <span style="background:rgba(6,214,160,0.15);color:#06d6a0;padding:4px 10px;border-radius:12px;font-size:0.75rem;">Active</span>
                  <span style="background:rgba(255,189,46,0.15);color:#ffbd2e;padding:4px 10px;border-radius:12px;font-size:0.75rem;">Pending</span>
                  <span style="background:rgba(255,95,86,0.15);color:#ff5f56;padding:4px 10px;border-radius:12px;font-size:0.75rem;">Failed</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }
    },
    "enterprise-saas-dashboard": {
      title: "Enterprise SaaS Dashboard",
      icon: "📊",
      url: "https://enterprise-saas-dashboard-demo.vercel.app",
      highlight: "Scalable Full-Stack SaaS Analytics & Management Platform",
      github: "https://github.com/RahulJaggi/enterprise-saas-dashboard",
      live: "https://enterprise-saas-dashboard-demo.vercel.app",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "React", "Recharts"],
      renderInterface: function() {
        return `
          <div class="mock-app" style="padding:24px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
              <h3 style="color:#fff;">Analytics Overview</h3>
              <div style="display:flex;gap:6px;">
                <button style="background:#7c5cfc;color:#fff;border:none;padding:4px 12px;border-radius:6px;font-size:0.8rem;cursor:pointer;">Daily</button>
                <button style="background:rgba(255,255,255,0.08);color:#aaa;border:none;padding:4px 12px;border-radius:6px;font-size:0.8rem;cursor:pointer;">Weekly</button>
                <button style="background:rgba(255,255,255,0.08);color:#aaa;border:none;padding:4px 12px;border-radius:6px;font-size:0.8rem;cursor:pointer;">Monthly</button>
              </div>
            </div>
            <div style="background:#151627;padding:20px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
              <div style="display:flex;align-items:flex-end;gap:16px;height:180px;padding-top:20px;">
                <div style="flex:1;background:linear-gradient(to top, #7c5cfc, #06d6a0);height:60%;border-radius:4px;"></div>
                <div style="flex:1;background:linear-gradient(to top, #7c5cfc, #06d6a0);height:85%;border-radius:4px;"></div>
                <div style="flex:1;background:linear-gradient(to top, #7c5cfc, #06d6a0);height:45%;border-radius:4px;"></div>
                <div style="flex:1;background:linear-gradient(to top, #7c5cfc, #06d6a0);height:100%;border-radius:4px;"></div>
                <div style="flex:1;background:linear-gradient(to top, #7c5cfc, #06d6a0);height:75%;border-radius:4px;"></div>
              </div>
              <div style="display:flex;justify-content:space-between;margin-top:12px;color:#666;font-size:0.75rem;">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
              </div>
            </div>
          </div>
        `;
      }
    },
    "kashio": {
      title: "Kashio Payment & Ledger Platform",
      icon: "💳",
      url: "https://github.com/RahulJaggi/kashio",
      highlight: "Financial Management & Payment Gateway Integration",
      github: "https://github.com/RahulJaggi/kashio",
      live: "",
      tech: ["JavaScript", "Node.js", "REST APIs", "Express"],
      renderInterface: function() {
        return `
          <div class="mock-app" style="padding:24px;">
            <h3 style="color:#fff;margin-bottom:16px;">Kashio Payment Ledger</h3>
            <div class="mock-app__metrics" style="margin-bottom:20px;">
              <div class="mock-app__metric-card">
                <div class="mock-app__metric-lbl">TOTAL TRANSACTIONS</div>
                <div class="mock-app__metric-val">$892,400</div>
              </div>
              <div class="mock-app__metric-card">
                <div class="mock-app__metric-lbl">SUCCESS RATE</div>
                <div class="mock-app__metric-val">99.94%</div>
              </div>
            </div>
          </div>
        `;
      }
    },
    "connect-app": {
      title: "Connect App Mobile Interface",
      icon: "📱",
      url: "https://github.com/rahuljaggi",
      highlight: "Cross-Platform Mobile Application built with React Native",
      github: "",
      live: "",
      tech: ["React Native", "JavaScript", "TypeScript", "REST APIs"],
      renderInterface: function() {
        return `
          <div class="mock-phone">
            <div class="mock-phone__screen">
              <div class="mock-phone__notch"></div>
              <div style="padding:20px;color:#fff;">
                <h4 style="font-size:1.2rem;margin-bottom:6px;">Connect Mobile</h4>
                <p style="font-size:0.8rem;color:#888;">Real-time team collaboration feed</p>
                <div style="background:#1b1c2e;padding:12px;border-radius:10px;margin-top:16px;">
                  <span style="font-size:0.75rem;color:#06d6a0;">● Active Sprint Update</span>
                  <p style="font-size:0.85rem;margin-top:4px;">Mobile architecture build complete.</p>
                </div>
              </div>
            </div>
          </div>
        `;
      }
    },
    "ai-call-intelligence": {
      title: "AI Call Intelligence & Transcription",
      icon: "🎙️",
      url: "https://github.com/rahuljaggi",
      highlight: "AI-Powered Conversation Summarization & Sentiment Analysis",
      github: "",
      live: "",
      tech: ["OpenAI API", "LLMs", "RAG", "Node.js", "NestJS"],
      renderInterface: function() {
        return `
          <div class="mock-app" style="padding:24px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
              <h3 style="color:#fff;">Call Transcript #9482</h3>
              <span style="background:rgba(6,214,160,0.15);color:#06d6a0;padding:4px 12px;border-radius:12px;font-size:0.8rem;">Positive Sentiment (94%)</span>
            </div>
            <div style="background:#151627;padding:16px;border-radius:10px;color:#ddd;font-size:0.9rem;line-height:1.6;border:1px solid rgba(255,255,255,0.08);">
              <strong style="color:#7c5cfc;">AI Summary:</strong> Client expressed high satisfaction with the Nova V3 platform release. Action item: Follow up on enterprise SSO setup.
            </div>
          </div>
        `;
      }
    }
  };

  function openModal(slug) {
    if (!modal) return;
    const project = PROJECT_PREVIEWS[slug] || {
      title: "Project Interface Preview",
      icon: "💻",
      url: "https://github.com/RahulJaggi",
      highlight: "Full-Stack Software Deliverable",
      github: "https://github.com/RahulJaggi",
      live: "",
      tech: ["React", "Node.js", "TypeScript"],
      renderInterface: function() {
        return `<div class="mock-app" style="padding:40px;text-align:center;"><h3 style="color:#fff;">Interface Preview Ready</h3></div>`;
      }
    };

    modalUrl.textContent = project.url;
    modalBody.innerHTML = `
      <div class="project-modal__header">
        <div class="project-modal__title-group">
          <span class="project-modal__icon">${project.icon}</span>
          <div>
            <h2 class="project-modal__title">${project.title}</h2>
            <span class="project-modal__highlight-tag">⚡ ${project.highlight}</span>
          </div>
        </div>
        <div class="project-modal__actions">
          ${project.github ? `<a href="${project.github}" target="_blank" class="btn btn--ghost btn--sm">View GitHub ↗</a>` : ""}
          ${project.live ? `<a href="${project.live}" target="_blank" class="btn btn--primary btn--sm">Launch Live App 🚀</a>` : ""}
        </div>
      </div>
      <div class="project-modal__preview-container">
        ${project.renderInterface()}
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join("")}
      </div>
    `;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Attach Event Listeners to Card buttons and cards
  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", (e) => {
      // Ignore direct clicks on repository links
      if (e.target.closest(".project-link")) return;
      const slug = card.getAttribute("data-slug");
      if (slug) openModal(slug);
    });
  });

  document.querySelectorAll("[data-open-project]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const slug = btn.getAttribute("data-open-project");
      if (slug) openModal(slug);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
  if (modalCloseDot) modalCloseDot.addEventListener("click", closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) {
      closeModal();
    }
  });

