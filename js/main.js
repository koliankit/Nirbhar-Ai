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
  "Candidate #894: Multi-round WebRTC AI interview completed. Technical match: 96%.",
  "Hyperledger Fabric: Block #18492019 minted with immutable credential verification.",
  "FastAPI Orchestrator: 1,482 concurrent interview streams synced with MongoDB in 12ms.",
  "Enterprise ERP Feed: Placement funnel optimization increased hire velocity by 4.2x.",
  "Solidity Smart Contract: Candidate skills verified. Zero tampering detected across pipeline.",
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
    setTimeout(typeMessage, 24);
  } else {
    setTimeout(() => {
      msgIndex = (msgIndex + 1) % chatMessages.length;
      charIndex = 0;
      chatText.style.opacity = '0';
      setTimeout(() => {
        chatText.style.opacity = '1';
        typeMessage();
      }, 400);
    }, 3200);
  }
}

// Start typewriter after page load
window.addEventListener('load', () => {
  setTimeout(typeMessage, 1500);
});

// ─── Logo text gradient animation ──────────────────────────
const logoAI = document.querySelectorAll('.logo-ai');
logoAI.forEach(el => {
  el.style.backgroundSize = '200% auto';
  let pos = 0;
  setInterval(() => {
    pos = (pos + 1) % 200;
    el.style.backgroundPosition = `${pos}% center`;
  }, 30);
});

// ═════════════════════════════════════════════════════════════
// NIRBHAR AI: DEVELOPMENT & TECHNICAL STACK INTEGRATION LOGIC
// ═════════════════════════════════════════════════════════════

// ─── 1. Mind Map Tabs Interaction ───────────────────────────
const mindmapTabs = document.querySelectorAll('.mindmap-tab');
const mindmapCards = document.querySelectorAll('.mindmap-pillar-card');

mindmapTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const branch = tab.dataset.branch;
    
    // Update active tab
    mindmapTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Highlight matching card
    mindmapCards.forEach(card => {
      if (card.dataset.pillar === branch) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        card.classList.remove('active');
      }
    });
  });
});

// ─── 2. Placement Lifecycle Stepper Interaction ─────────────
const lifecycleData = {
  "1": {
    badge: "ACTIVE STAGE INSPECTION: STAGE 01",
    title: "Systematic Candidate Onboarding & Profiling",
    desc: "Upon registration, candidates enter an automated ingestion pipeline. Nirbhar AI extracts historical work, verified credentials, and educational milestones, creating a structured graph inside MongoDB while initializing ERP workforce planning.",
    metric1: "1.8 Seconds",
    metric2: "MongoDB BSON + FastAPI",
    metric3: "AES-256 Encrypted"
  },
  "2": {
    badge: "ACTIVE STAGE INSPECTION: STAGE 02",
    title: "Multi-Round AI Interviews & Evaluation",
    desc: "Candidates participate in structured real-time video/audio interviews powered by WebRTC & Twilio. The LangChain LLM engine asks dynamic contextual questions and measures speech sentiment, code syntax, and problem-solving agility.",
    metric1: "4K Concurrent Streams",
    metric2: "WebRTC + Twilio",
    metric3: "PyTorch Benchmark Engine"
  },
  "3": {
    badge: "ACTIVE STAGE INSPECTION: STAGE 03",
    title: "AI Evaluation, Scoring & Matching",
    desc: "Evaluation models compute multi-dimensional competency vectors. The decision support system matches candidates directly with verified enterprise job openings, scoring cultural fit, technical aptitude, and growth readiness.",
    metric1: "99.4% Match Accuracy",
    metric2: "FastAPI + LangChain",
    metric3: "Multi-Round Scoring Matrix"
  },
  "4": {
    badge: "ACTIVE STAGE INSPECTION: STAGE 04",
    title: "Enterprise Placement & Blockchain Verification",
    desc: "Matched candidates receive enterprise offers with immutable blockchain credential verification. Solidity smart contracts mint tamper-proof verification tokens and Hyperledger Fabric records the hiring audit trail.",
    metric1: "100% Tamper Proof",
    metric2: "Solidity + Hyperledger Fabric",
    metric3: "PostgreSQL ERP Integration"
  }
};

const stepCards = document.querySelectorAll('.step-card');
const detailBadge = document.getElementById('detailBadge');
const detailTitle = document.getElementById('detailTitle');
const detailDesc = document.getElementById('detailDesc');
const chipMetric1 = document.getElementById('chipMetric1');
const chipMetric2 = document.getElementById('chipMetric2');
const chipMetric3 = document.getElementById('chipMetric3');

stepCards.forEach(card => {
  card.addEventListener('click', () => {
    const step = card.dataset.step;
    stepCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');

    const data = lifecycleData[step];
    if (data && detailBadge && detailTitle && detailDesc) {
      detailBadge.textContent = data.badge;
      detailTitle.textContent = data.title;
      detailDesc.textContent = data.desc;
      if (chipMetric1) chipMetric1.textContent = data.metric1;
      if (chipMetric2) chipMetric2.textContent = data.metric2;
      if (chipMetric3) chipMetric3.textContent = data.metric3;
    }
  });
});

// ─── 3. AI Interview Simulator ──────────────────────────────
const roleSelector = document.getElementById('roleSelector');
const simQuestionText = document.getElementById('simQuestionText');
const simAnswerText = document.getElementById('simAnswerText');
const scoreTech = document.getElementById('scoreTech');
const scoreProblem = document.getElementById('scoreProblem');
const scoreComm = document.getElementById('scoreComm');
const barTech = document.getElementById('barTech');
const barProblem = document.getElementById('barProblem');
const barComm = document.getElementById('barComm');
const btnSimulateEvaluation = document.getElementById('btnSimulateEvaluation');

const roleQuestions = {
  "ai-eng": [
    {
      q: '"Explain how you would design a high-throughput microservices architecture with FastAPI, WebSockets, and Redis for real-time candidate scoring."',
      a: '"I would decouple the ingestion layer using FastAPI async handlers, stream events through Redis Pub/Sub, and persist evaluation embeddings using PyTorch in a background worker."',
      scores: [96, 94, 91]
    },
    {
      q: '"How would you mitigate bias and hallucination in an LLM-based candidate interview evaluation pipeline?"',
      a: '"I would utilize LangChain with structured schema validation, few-shot ground truth rubrics, and consensus verification across dual-model scoring checkpoints."',
      scores: [98, 96, 93]
    }
  ],
  "fullstack": [
    {
      q: '"How do you optimize state hydration and real-time dashboard telemetry between Next.js SSR and Node.js Express microservices?"',
      a: '"By employing server-side pre-fetching with React Server Components, client-side WebSocket subscriptions, and Redis caching for sub-100ms dashboard refreshes."',
      scores: [95, 92, 89]
    },
    {
      q: '"Describe your strategy for securing candidate data under zero-trust using OAuth 2.0 and AES-256."',
      a: '"I implement short-lived asymmetric JWTs with refresh token rotation, encrypt data at rest via AES-GCM-256, and enforce TLS 1.3 across all service boundaries."',
      scores: [97, 95, 94]
    }
  ],
  "data-analyst": [
    {
      q: '"How would you analyze and optimize recruitment funnel conversion rates across candidate onboarding and placement stages?"',
      a: '"I extract funnel event logs from PostgreSQL and MongoDB into our analytical warehouse, run cohort retention models, and surface drop-off bottlenecks in real-time dashboards."',
      scores: [94, 96, 92]
    }
  ]
};

let currentQuestionIdx = 0;

function updateRoleContent() {
  const role = roleSelector?.value || 'ai-eng';
  const list = roleQuestions[role] || roleQuestions['ai-eng'];
  currentQuestionIdx = currentQuestionIdx % list.length;
  const item = list[currentQuestionIdx];

  if (simQuestionText && simAnswerText) {
    simQuestionText.textContent = item.q;
    simAnswerText.textContent = item.a;
    if (scoreTech && barTech) {
      scoreTech.textContent = item.scores[0] + '%';
      barTech.style.width = item.scores[0] + '%';
    }
    if (scoreProblem && barProblem) {
      scoreProblem.textContent = item.scores[1] + '%';
      barProblem.style.width = item.scores[1] + '%';
    }
    if (scoreComm && barComm) {
      scoreComm.textContent = item.scores[2] + '%';
      barComm.style.width = item.scores[2] + '%';
    }
  }
}

roleSelector?.addEventListener('change', () => {
  currentQuestionIdx = 0;
  updateRoleContent();
});

btnSimulateEvaluation?.addEventListener('click', () => {
  const role = roleSelector?.value || 'ai-eng';
  const list = roleQuestions[role] || roleQuestions['ai-eng'];
  currentQuestionIdx = (currentQuestionIdx + 1) % list.length;
  
  if (btnSimulateEvaluation) {
    btnSimulateEvaluation.textContent = 'Analyzing Response via PyTorch & LangChain...';
    btnSimulateEvaluation.disabled = true;
  }

  setTimeout(() => {
    updateRoleContent();
    if (btnSimulateEvaluation) {
      btnSimulateEvaluation.textContent = 'Run Next AI Evaluation Round';
      btnSimulateEvaluation.disabled = false;
    }
  }, 600);
});

// ─── 4. Blockchain Smart Contract Verifier ──────────────────
const btnVerifyOnChain = document.getElementById('btnVerifyOnChain');
const credentialHashInput = document.getElementById('credentialHashInput');
const resStatus = document.getElementById('resStatus');
const resBlock = document.getElementById('resBlock');
const resContract = document.getElementById('resContract');
const resConsensus = document.getElementById('resConsensus');

btnVerifyOnChain?.addEventListener('click', () => {
  const hash = credentialHashInput?.value.trim() || '0x7f4a9b8e210cd63e4129bb8401ee8291a0c4';
  
  if (btnVerifyOnChain) {
    btnVerifyOnChain.textContent = 'Verifying with Hyperledger Fabric...';
    btnVerifyOnChain.disabled = true;
  }
  
  if (resStatus) {
    resStatus.textContent = 'QUERYING DECENTRALIZED NODES...';
    resStatus.style.color = '#00E5FF';
  }

  setTimeout(() => {
    const randomBlock = Math.floor(18492000 + Math.random() * 5000);
    if (resStatus) {
      resStatus.textContent = 'VALIDATED (0x00 SUCCESS - ZERO TAMPER)';
      resStatus.style.color = '#00FF88';
    }
    if (resBlock) resBlock.textContent = `#${randomBlock.toLocaleString()}`;
    if (resContract) resContract.textContent = `NirbharCredentialVerify.sol (${hash.substring(0, 8)}...${hash.substring(hash.length - 4)})`;
    if (resConsensus) resConsensus.textContent = 'Hyperledger Raft Consensus · 100% Peer Match';

    if (btnVerifyOnChain) {
      btnVerifyOnChain.textContent = 'Verify On-Chain';
      btnVerifyOnChain.disabled = false;
    }
  }, 750);
});

// ─── 5. Architecture Image Blueprint Zoom & Lightbox ────────
const archMindmapImg = document.getElementById('archMindmapImg');
const archImgViewport = document.getElementById('archImgViewport');
const btnZoomIn = document.getElementById('btnZoomIn');
const btnZoomOut = document.getElementById('btnZoomOut');
const btnZoomReset = document.getElementById('btnZoomReset');
const btnOpenLightbox = document.getElementById('btnOpenLightbox');
const imgLightboxModal = document.getElementById('imgLightboxModal');
const btnCloseLightbox = document.getElementById('btnCloseLightbox');
const lightboxBackdrop = document.getElementById('lightboxBackdrop');

let currentImgScale = 1.0;

function applyImgScale() {
  if (archMindmapImg) {
    archMindmapImg.style.transform = `scale(${currentImgScale})`;
    archMindmapImg.style.cursor = currentImgScale > 1 ? 'grab' : 'zoom-in';
  }
}

btnZoomIn?.addEventListener('click', (e) => {
  e.stopPropagation();
  if (currentImgScale < 2.5) {
    currentImgScale += 0.25;
    applyImgScale();
  }
});

btnZoomOut?.addEventListener('click', (e) => {
  e.stopPropagation();
  if (currentImgScale > 0.8) {
    currentImgScale -= 0.25;
    applyImgScale();
  }
});

btnZoomReset?.addEventListener('click', (e) => {
  e.stopPropagation();
  currentImgScale = 1.0;
  applyImgScale();
});

// Lightbox Open/Close
function openLightbox() {
  if (imgLightboxModal) {
    imgLightboxModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  if (imgLightboxModal) {
    imgLightboxModal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

btnOpenLightbox?.addEventListener('click', openLightbox);
archMindmapImg?.addEventListener('click', () => {
  if (currentImgScale === 1.0) {
    openLightbox();
  }
});
btnCloseLightbox?.addEventListener('click', closeLightbox);
lightboxBackdrop?.addEventListener('click', closeLightbox);

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && imgLightboxModal?.classList.contains('open')) {
    closeLightbox();
  }
});


