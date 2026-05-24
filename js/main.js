/* ═══════════════════════════════════════════════════════════
   NIRBHAR AI — Enterprise Intelligence
   Main JavaScript
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ─── Theme Toggle ───────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('nirbhar-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle?.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('nirbhar-theme', next);
});

// ─── Navbar Scroll ─────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
}, { passive: true });

// ─── Mobile Menu ───────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger?.addEventListener('click', () => {
  const open = mobileMenu?.classList.toggle('open');
  if (hamburger) {
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }
});

// Close mobile menu on link click
mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const spans = hamburger?.querySelectorAll('span');
    spans?.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ─── Particle Canvas ────────────────────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx = canvas?.getContext('2d');

if (canvas && ctx) {
  let particles = [];
  let animationId;
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles(count = 60) {
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulsePhase: Math.random() * Math.PI * 2,
    }));
  }

  function drawParticles(time) {
    ctx.clearRect(0, 0, W, H);

    const isDark = html.getAttribute('data-theme') === 'dark';
    const baseColor = isDark ? '0, 229, 255' : '0, 102, 255';

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${baseColor}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      const pulse = Math.sin(time * p.pulseSpeed + p.pulsePhase) * 0.3 + 0.7;
      const opacity = p.opacity * pulse;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${baseColor}, ${opacity})`;
      ctx.fill();
    });
  }

  function animate(time) {
    drawParticles(time);
    animationId = requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate(0);

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  }, { passive: true });

  // Pause when tab not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate(0);
    }
  });
}

// ─── Counter Animation ──────────────────────────────────────
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const suffix = el.nextElementSibling?.textContent || '';

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

// Intersection Observer for counters
const counterEls = document.querySelectorAll('.stat-number[data-target]');
if (counterEls.length > 0) {
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        animateCounter(el, target);
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObs.observe(el));
}

// ─── Scroll Reveal (data-aos) ───────────────────────────────
const aosEls = document.querySelectorAll('[data-aos]');
if (aosEls.length > 0) {
  // Initial styles
  aosEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(32px)';
    el.style.transition = `opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)`;
    const delay = el.dataset.aosDelay || '0';
    el.style.transitionDelay = delay + 'ms';
  });

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  aosEls.forEach(el => revealObs.observe(el));
}

// ─── Platform Steps Interaction ────────────────────────────
const platformSteps = document.querySelectorAll('.platform-step');
platformSteps.forEach(step => {
  step.addEventListener('click', () => {
    platformSteps.forEach(s => s.classList.remove('active'));
    step.classList.add('active');
  });
});

// Auto-cycle platform steps
let stepIndex = 0;
function cycleSteps() {
  platformSteps.forEach(s => s.classList.remove('active'));
  platformSteps[stepIndex]?.classList.add('active');
  stepIndex = (stepIndex + 1) % platformSteps.length;
}
if (platformSteps.length > 0) {
  setInterval(cycleSteps, 3000);
}

// ─── Smooth Scroll for nav links ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── Chart bars animation ───────────────────────────────────
const chartBars = document.querySelectorAll('.chart-bar');
if (chartBars.length > 0) {
  // Animate bars on load
  chartBars.forEach((bar, i) => {
    bar.style.height = '0';
    setTimeout(() => {
      bar.style.transition = `height 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 50}ms`;
      bar.style.height = bar.style.getPropertyValue('--h') || '60%';
    }, 800);
  });

  // Periodically update active bar
  const activeBars = document.querySelectorAll('.chart-bar');
  let activeIndex = 4;
  setInterval(() => {
    activeBars[activeIndex]?.classList.remove('active');
    activeIndex = (activeIndex + 1) % activeBars.length;
    activeBars[activeIndex]?.classList.add('active');
  }, 1200);
}

// ─── Typewriter for AI chat ─────────────────────────────────
const chatMessages = [
  "Q3 revenue is up 23%. Top driver: APAC region (+41%). Recommend expanding sales team.",
  "Analyzed 847 invoices. 12 anomalies detected. Total risk exposure: ₹2.4L.",
  "Employee satisfaction dropped 8% in Operations. Key issue: workload distribution.",
  "Sales pipeline health: 78% on-track. 3 deals at risk — want a detailed breakdown?",
];

const chatText = document.querySelector('.chat-text');
let msgIndex = 0;
let charIndex = 0;
let typing = false;

function typeMessage() {
  if (!chatText) return;
  const msg = chatMessages[msgIndex];
  if (charIndex < msg.length) {
    chatText.textContent = msg.substring(0, charIndex + 1);
    charIndex++;
    setTimeout(typeMessage, 28);
  } else {
    setTimeout(() => {
      // Clear and go to next message
      msgIndex = (msgIndex + 1) % chatMessages.length;
      charIndex = 0;
      chatText.style.opacity = '0';
      setTimeout(() => {
        chatText.style.opacity = '1';
        typeMessage();
      }, 400);
    }, 3000);
  }
}

// Start typewriter after page load
window.addEventListener('load', () => {
  setTimeout(typeMessage, 1500);
});

// ─── Logo text gradient animation ──────────────────────────
// Periodically animate logo AI text
const logoAI = document.querySelectorAll('.logo-ai');
logoAI.forEach(el => {
  el.style.backgroundSize = '200% auto';
  let pos = 0;
  setInterval(() => {
    pos = (pos + 1) % 200;
    el.style.backgroundPosition = `${pos}% center`;
  }, 30);
});
