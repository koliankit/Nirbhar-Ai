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
// NIRBHAR AI: CAREER & OPPORTUNITY INTELLIGENCE ENGINE
// Reactive State Store, Real-time Filters & Automation
// ═════════════════════════════════════════════════════════════

// ─── 1. Candidate Intelligence State ────────────────────────
const DEMO_USER_PROFILE = {
  name: "Rahul Sharma",
  role: "Aspiring AI / Full-Stack Engineer",
  education: "B.Tech Computer Science (Final Year, 2026)",
  college: "Pune Institute of Computer Technology",
  cgpa: 8.4,
  location: "Pune / Mumbai, India (Open to Remote)",
  completionScore: 85,
  verifiedSkills: ["Python", "React", "Data Structures", "FastAPI", "PostgreSQL"],
  inProgressSkills: ["Docker & Microservices", "PyTorch LLM Fine-Tuning", "System Design"],
  missingSkills: ["Kubernetes", "AWS CI/CD Pipeline"],
  verifiedCredentials: [
    { name: "Autonomous Systems Specialization", issuer: "NPTEL / IIT Madras", id: "NPT-2025-9182" },
    { name: "Full Stack Cloud Native Dev", issuer: "AWS Academy", id: "AWS-CN-44109" }
  ]
};

// ─── 2. Opportunities Knowledge Base ─────────────────────────
const OPPORTUNITIES_DATABASE = [
  {
    id: "opp-google-ai",
    title: "AI Research Summer Fellow 2026",
    organization: "Google Research India",
    category: "internships",
    mode: "hybrid",
    location: "Bangalore, India",
    stipend: "₹1,10,000 / month",
    deadline: "April 15, 2026",
    matchScore: 94,
    verified: true,
    tags: ["Deep Learning", "PyTorch", "NLP", "LLM Fine-Tuning"],
    criteria: [
      { label: "Degree & Specialization", required: "B.Tech / M.Tech in CS/IT/AI", userVal: "B.Tech CSE (2026)", status: "pass" },
      { label: "Minimum CGPA", required: "8.0 / 10.0 or higher", userVal: "8.4 CGPA", status: "pass" },
      { label: "Core Technical Skills", required: "Python, PyTorch, Linear Algebra", userVal: "Python (Verified), PyTorch (In Progress)", status: "pass" },
      { label: "Research / Project Provenance", required: "1+ public GitHub ML repo or preprint", userVal: "2 verified project repos attached", status: "pass" }
    ]
  },
  {
    id: "opp-msft-swe",
    title: "Software Engineering Associate",
    organization: "Microsoft India",
    category: "jobs",
    mode: "hybrid",
    location: "Hyderabad / Noida",
    stipend: "18.5 – 24.0 LPA",
    deadline: "April 30, 2026",
    matchScore: 91,
    verified: true,
    tags: ["Data Structures", "Distributed Systems", "C# / Python", "Cloud"],
    criteria: [
      { label: "Degree & Year of Graduation", required: "B.Tech / B.E (Graduating 2026)", userVal: "B.Tech CSE (2026)", status: "pass" },
      { label: "Minimum Academic Score", required: "7.5 CGPA or 70%", userVal: "8.4 CGPA", status: "pass" },
      { label: "Algorithms & System Design", required: "Advanced DSA, System Design fundamentals", userVal: "DSA (Verified), System Design (In Progress)", status: "partial" },
      { label: "Cloud Services Knowledge", required: "Familiarity with Azure / AWS", userVal: "AWS Cloud Native Certified", status: "pass" }
    ]
  },
  {
    id: "opp-tata-ai",
    title: "Tata AI & Autonomous Systems Fellow",
    organization: "Tata Digital Labs",
    category: "fellowships",
    mode: "remote",
    location: "Remote / Mumbai",
    stipend: "₹75,000 / month + Grant",
    deadline: "May 10, 2026",
    matchScore: 89,
    verified: true,
    tags: ["Autonomous Agents", "FastAPI", "GenAI", "Graph DB"],
    criteria: [
      { label: "Degree Eligibility", required: "Pre-final / Final Year Engineering", userVal: "Final Year B.Tech CSE", status: "pass" },
      { label: "Minimum CGPA", required: "7.0 CGPA", userVal: "8.4 CGPA", status: "pass" },
      { label: "FastAPI & Agent Architectures", required: "FastAPI, LangChain / LlamaIndex", userVal: "FastAPI (Verified), Agent flows", status: "pass" },
      { label: "Independent Prototype Submission", required: "Working demo with API endpoints", userVal: "Nirbhar AI full-stack deployment", status: "pass" }
    ]
  },
  {
    id: "opp-central-scholarship",
    title: "National Central Sector Scholarship 2026",
    organization: "Ministry of Education (Govt of India)",
    category: "scholarships",
    mode: "on-site",
    location: "PAN-India Verified Institutes",
    stipend: "₹50,000 / year (Direct DBT)",
    deadline: "May 25, 2026",
    matchScore: 88,
    verified: true,
    tags: ["Govt DBT", "Merit-Based", "Aadhaar e-KYC", "National Portal"],
    criteria: [
      { label: "Institute Accreditation", required: "AICTE / UGC approved college", userVal: "PICT Pune (AICTE Approved)", status: "pass" },
      { label: "Percentile in 12th Board", required: "Above 80th percentile in state board", userVal: "91.2% (Top 5th percentile)", status: "pass" },
      { label: "Family Annual Income", required: "Below ₹8,00,000 / annum", userVal: "Income Certificate Verified", status: "pass" },
      { label: "Aadhaar DBT Linking", required: "Aadhaar seeded bank account", userVal: "Aadhaar NPCI active", status: "pass" }
    ]
  },
  {
    id: "opp-drdo-intern",
    title: "Defense Cyber & AI Research Intern",
    organization: "DRDO (Defense Research & Dev Org)",
    category: "govt-schemes",
    mode: "on-site",
    location: "New Delhi / Pune Labs",
    stipend: "₹37,000 / month + Security Clearance",
    deadline: "May 15, 2026",
    matchScore: 85,
    verified: true,
    tags: ["National Security", "Embedded AI", "Zero Trust", "C++ / Python"],
    criteria: [
      { label: "Citizenship & Background", required: "Indian Citizen with police verification", userVal: "Indian Citizen, Verified", status: "pass" },
      { label: "Degree & Year", required: "3rd or 4th year B.Tech in CSE/IT/ECE", userVal: "4th year B.Tech CSE", status: "pass" },
      { label: "Academic Threshold", required: "First class with distinction (> 7.5 CGPA)", userVal: "8.4 CGPA", status: "pass" },
      { label: "Security & Systems Knowledge", required: "C/C++, Network Security fundamentals", userVal: "Python/FastAPI verified, C++ basic", status: "partial" }
    ]
  },
  {
    id: "opp-infosys-springboard",
    title: "Infosys Springboard AI Specialist",
    organization: "Infosys Technologies",
    category: "jobs",
    mode: "hybrid",
    location: "Bangalore / Pune / Mysore",
    stipend: "9.5 – 12.0 LPA",
    deadline: "June 05, 2026",
    matchScore: 92,
    verified: true,
    tags: ["Enterprise AI", "Full Stack", "React", "Python"],
    criteria: [
      { label: "Education Criteria", required: "B.E / B.Tech / MCA (2026 Batch)", userVal: "B.Tech CSE (2026)", status: "pass" },
      { label: "Minimum Marks", required: "60% or 6.5 CGPA throughout 10th/12th/Grad", userVal: "84% aggregate", status: "pass" },
      { label: "Full Stack Competency", required: "React, Node.js or Python backend", userVal: "React & FastAPI verified", status: "pass" },
      { label: "Springboard Certifications", required: "Recommended: 1+ certified pathway", userVal: "Cloud Native pathway completed", status: "pass" }
    ]
  },
  {
    id: "opp-pmkvy-fellowship",
    title: "PMKVY 4.0 Advanced Cyber-Physical Fellowship",
    organization: "National Skill Development Corporation (NSDC)",
    category: "govt-schemes",
    mode: "hybrid",
    location: "All Major Technical Hubs",
    stipend: "Fully Funded + ₹25,000 Stipend",
    deadline: "June 20, 2026",
    matchScore: 87,
    verified: true,
    tags: ["Skill India", "Cyber-Physical", "Robotics", "Govt Certification"],
    criteria: [
      { label: "Age & Eligibility", required: "18 to 28 years, Technical Graduate", userVal: "21 years, B.Tech CSE candidate", status: "pass" },
      { label: "Skill Assessment Exam", required: "Qualify online NSDC aptitude test", userVal: "Ready to schedule via Nirbhar", status: "pass" },
      { label: "Identity Verification", required: "DigiLocker APAAR / ABC ID integration", userVal: "APAAR ID verified on profile", status: "pass" },
      { label: "Commitment", required: "Full-time 4-month specialized residency", userVal: "Final semester project eligible", status: "pass" }
    ]
  },
  {
    id: "opp-adobe-intern",
    title: "Product Engineering & Creativity AI Intern",
    organization: "Adobe Systems India",
    category: "internships",
    mode: "remote",
    location: "Noida / Bangalore / Remote",
    stipend: "₹85,000 / month",
    deadline: "May 18, 2026",
    matchScore: 84,
    verified: true,
    tags: ["WebGL", "Computer Vision", "React", "TypeScript"],
    criteria: [
      { label: "Degree & Batch", required: "B.Tech / B.E / M.Tech in CS (2026)", userVal: "B.Tech CSE (2026)", status: "pass" },
      { label: "Frontend & Graphics Skills", required: "JavaScript/TypeScript, Canvas/WebGL", userVal: "React, JavaScript (WebGL in progress)", status: "partial" },
      { label: "Minimum CGPA", required: "7.5 CGPA", userVal: "8.4 CGPA", status: "pass" },
      { label: "Problem Solving Round", required: "LeetCode medium/hard DSA proficiency", userVal: "200+ problems solved", status: "pass" }
    ]
  }
];

// ─── 3. Opportunity Filtering & Rendering ───────────────────
const categoryFilterTabs = document.getElementById('categoryFilterTabs');
const filterMode = document.getElementById('filterMode');
const filterSort = document.getElementById('filterSort');
const heroSearchInput = document.getElementById('heroSearchInput');
const heroTypeSelect = document.getElementById('heroTypeSelect');
const btnHeroSearch = document.getElementById('btnHeroSearch');
const opportunityCardsGrid = document.getElementById('opportunityCardsGrid');

let activeCategory = 'all';

function renderOpportunityCards() {
  if (!opportunityCardsGrid) return;

  const searchQuery = (heroSearchInput?.value || '').trim().toLowerCase();
  const selectedMode = filterMode?.value || 'all';
  const selectedSort = filterSort?.value || 'match';

  let filtered = OPPORTUNITIES_DATABASE.filter(item => {
    // Category filter
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }
    // Mode filter
    if (selectedMode !== 'all' && item.mode !== selectedMode) {
      return false;
    }
    // Text search query
    if (searchQuery) {
      const haystack = `${item.title} ${item.organization} ${item.tags.join(' ')} ${item.location}`.toLowerCase();
      if (!haystack.includes(searchQuery)) return false;
    }
    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (selectedSort === 'match') return b.matchScore - a.matchScore;
    if (selectedSort === 'deadline') return a.deadline.localeCompare(b.deadline);
    return 0;
  });

  if (filtered.length === 0) {
    opportunityCardsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: var(--bg-card); border: 1px dashed var(--border); border-radius: 16px;">
        <div style="font-size: 32px; margin-bottom: 12px;">🔍</div>
        <h4 style="font-size: 18px; margin-bottom: 6px;">No matching opportunities found</h4>
        <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 18px;">Try clearing filters or search for another keyword like "Python", "Scholarship", or "Internship".</p>
        <button id="btnResetFilters" style="background: var(--cyan); color: #030810; font-weight: 600; padding: 8px 18px; border-radius: 8px; border: none; cursor: pointer;">Reset All Filters</button>
      </div>
    `;
    document.getElementById('btnResetFilters')?.addEventListener('click', () => {
      activeCategory = 'all';
      if (heroSearchInput) heroSearchInput.value = '';
      if (filterMode) filterMode.value = 'all';
      if (filterSort) filterSort.value = 'match';
      categoryFilterTabs?.querySelectorAll('.cat-tab').forEach(t => t.classList.toggle('active', t.dataset.category === 'all'));
      renderOpportunityCards();
    });
    return;
  }

  opportunityCardsGrid.innerHTML = filtered.map(item => `
    <article class="opp-card" data-id="${item.id}">
      <div class="opp-header">
        <span class="opp-type-badge">${item.category.replace('-', ' ')}</span>
        <span class="opp-match-pill ${item.matchScore >= 90 ? 'high' : 'mid'}">${item.matchScore}% Match</span>
      </div>
      <h3 class="opp-title">${item.title}</h3>
      <div class="opp-org">${item.organization}</div>
      <div class="opp-meta-list">
        <span>📍 ${item.location} · <strong>${item.mode.toUpperCase()}</strong></span>
        <span>💰 ${item.stipend}</span>
        <span>⏳ Deadline: <strong>${item.deadline}</strong></span>
      </div>
      <div class="opp-tags-flex">
        ${item.tags.map(t => `<span class="opp-tag-item">${t}</span>`).join('')}
      </div>
      <div class="opp-footer">
        <div class="opp-verified-badge">
          <span>✓</span> Source Verified
        </div>
        <div class="opp-actions-group">
          <button class="btn-opp-check" onclick="window.checkOpportunityEligibility('${item.id}')">Check Eligibility</button>
          <button class="btn-opp-apply" onclick="window.quickApplyOpportunity('${item.id}')">Apply</button>
        </div>
      </div>
    </article>
  `).join('');
}

// Category tabs click handler
categoryFilterTabs?.querySelectorAll('.cat-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    categoryFilterTabs.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeCategory = tab.dataset.category || 'all';
    renderOpportunityCards();
  });
});

filterMode?.addEventListener('change', renderOpportunityCards);
filterSort?.addEventListener('change', renderOpportunityCards);

btnHeroSearch?.addEventListener('click', () => {
  if (heroTypeSelect && heroTypeSelect.value !== 'all') {
    activeCategory = heroTypeSelect.value;
    categoryFilterTabs?.querySelectorAll('.cat-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.category === activeCategory);
    });
  }
  renderOpportunityCards();
  document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
});

heroSearchInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    btnHeroSearch?.click();
  }
});

// Trending tags click handlers
document.querySelectorAll('.hero-trending-tags .tag-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    if (heroSearchInput) {
      heroSearchInput.value = pill.textContent.replace('#', '').trim();
      btnHeroSearch?.click();
    }
  });
});

// ─── 4. Eligibility Check Interactive Modal ─────────────────
const eligibilityModalBackdrop = document.getElementById('eligibilityModalBackdrop');
const eligibilityModalTitle = document.getElementById('eligibilityModalTitle');
const eligibilityModalSubtitle = document.getElementById('eligibilityModalSubtitle');
const eligibilityCriteriaList = document.getElementById('eligibilityCriteriaList');
const eligibilityScoreDisplay = document.getElementById('eligibilityScoreDisplay');
const btnCloseEligibilityModal = document.getElementById('btnCloseEligibilityModal');
const btnConfirmApplyModal = document.getElementById('btnConfirmApplyModal');

let currentInspectedOpportunity = null;

window.checkOpportunityEligibility = function(oppId) {
  const opp = OPPORTUNITIES_DATABASE.find(o => o.id === oppId);
  if (!opp) return;

  currentInspectedOpportunity = opp;

  if (eligibilityModalTitle) eligibilityModalTitle.textContent = opp.title;
  if (eligibilityModalSubtitle) eligibilityModalSubtitle.textContent = `${opp.organization} · ${opp.location} · Match: ${opp.matchScore}%`;
  
  if (eligibilityCriteriaList) {
    eligibilityCriteriaList.innerHTML = opp.criteria.map(c => `
      <div class="criterion-row">
        <div>
          <div style="font-weight: 600; font-size: 13.5px; color: var(--text-primary);">${c.label}</div>
          <div style="font-size: 12px; color: var(--text-secondary);">Requirement: <em>${c.required}</em></div>
          <div style="font-size: 12px; color: var(--cyan); margin-top: 2px;">Your Profile: <strong>${c.userVal}</strong></div>
        </div>
        <span class="criterion-status ${c.status}">${c.status.toUpperCase()}</span>
      </div>
    `).join('');
  }

  if (eligibilityScoreDisplay) {
    eligibilityScoreDisplay.textContent = `${opp.matchScore}% ELIGIBILITY CONFIRMED`;
  }

  if (eligibilityModalBackdrop) {
    eligibilityModalBackdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
};

function closeEligibilityModal() {
  if (eligibilityModalBackdrop) {
    eligibilityModalBackdrop.classList.remove('show');
    document.body.style.overflow = '';
  }
}

btnCloseEligibilityModal?.addEventListener('click', closeEligibilityModal);
eligibilityModalBackdrop?.addEventListener('click', (e) => {
  if (e.target === eligibilityModalBackdrop) closeEligibilityModal();
});

btnConfirmApplyModal?.addEventListener('click', () => {
  if (currentInspectedOpportunity) {
    window.quickApplyOpportunity(currentInspectedOpportunity.id);
    closeEligibilityModal();
  }
});

// Toast notification helper
function showToast(message, type = 'success') {
  const existingToast = document.querySelector('.nirbhar-toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = 'nirbhar-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--bg-card);
    border: 1px solid var(--cyan);
    color: var(--text-primary);
    padding: 14px 20px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 229, 255, 0.25);
    z-index: 100000;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 500;
    animation: fade-up 0.25s ease;
  `;
  toast.innerHTML = `
    <span style="font-size: 18px; color: #00FF88;">✓</span>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ─── 5. Application Radar & Kanban Interaction ───────────────
const colDiscovered = document.getElementById('colDiscovered');
const colPreparing = document.getElementById('colPreparing');
const colApplied = document.getElementById('colApplied');
const colInterviewing = document.getElementById('colInterviewing');
const btnQuickAddApp = document.getElementById('btnQuickAddApp');

window.quickApplyOpportunity = function(oppId) {
  const opp = OPPORTUNITIES_DATABASE.find(o => o.id === oppId);
  if (!opp) return;

  const cardHtml = `
    <div class="kanban-card" data-opp="${opp.id}">
      <div class="kc-company">${opp.organization}</div>
      <div class="kc-title">${opp.title}</div>
      <div class="kc-deadline">⏳ ${opp.deadline}</div>
      <div class="kc-actions">
        <button class="btn-kc-advance" onclick="window.advanceKanbanCard(this)">Advance Stage ➔</button>
      </div>
    </div>
  `;

  if (colApplied) {
    colApplied.insertAdjacentHTML('afterbegin', cardHtml);
    updateKanbanCounts();
    showToast(`Application submitted for ${opp.title}! Moved to "Applied" tracker.`);
    document.getElementById('applications')?.scrollIntoView({ behavior: 'smooth' });
  }
};

window.advanceKanbanCard = function(btnElement) {
  const card = btnElement.closest('.kanban-card');
  if (!card) return;

  const currentStack = card.parentElement;
  if (currentStack === colDiscovered && colPreparing) {
    colPreparing.appendChild(card);
    showToast("Moved to 'Preparing Portfolio & Resume'!");
  } else if (currentStack === colPreparing && colApplied) {
    colApplied.appendChild(card);
    showToast("Application submitted! Moved to 'Applied'.");
  } else if (currentStack === colApplied && colInterviewing) {
    colInterviewing.appendChild(card);
    btnElement.textContent = "Schedule Mock ➔";
    btnElement.onclick = () => {
      document.getElementById('interview')?.scrollIntoView({ behavior: 'smooth' });
    };
    showToast("Interview Shortlisted! Get ready in AI Mock Studio.");
  }
  updateKanbanCounts();
};

function updateKanbanCounts() {
  const cols = [
    { el: colDiscovered, badge: document.querySelector('#kanbanColDiscovered .kanban-count-badge') },
    { el: colPreparing, badge: document.querySelector('#kanbanColPreparing .kanban-count-badge') },
    { el: colApplied, badge: document.querySelector('#kanbanColApplied .kanban-count-badge') },
    { el: colInterviewing, badge: document.querySelector('#kanbanColInterviewing .kanban-count-badge') }
  ];
  cols.forEach(col => {
    if (col.el && col.badge) {
      col.badge.textContent = col.el.querySelectorAll('.kanban-card').length;
    }
  });
}

btnQuickAddApp?.addEventListener('click', () => {
  const title = prompt("Enter target role / opportunity title:", "AI Specialist Apprenticeship");
  if (!title) return;
  const org = prompt("Enter company / institution name:", "National Center for AI");
  if (!org) return;

  const newCard = document.createElement('div');
  newCard.className = 'kanban-card';
  newCard.innerHTML = `
    <div class="kc-company">${org}</div>
    <div class="kc-title">${title}</div>
    <div class="kc-deadline">⏳ In Progress · Tracked by AI</div>
    <div class="kc-actions">
      <button class="btn-kc-advance" onclick="window.advanceKanbanCard(this)">Advance Stage ➔</button>
    </div>
  `;
  colDiscovered?.prepend(newCard);
  updateKanbanCounts();
  showToast(`Added "${title}" to your radar!`);
});

// ─── 6. Multilingual AI Career Assistant ─────────────────────
const assistantChatStream = document.getElementById('assistantChatStream');
const chatSuggestionsBar = document.getElementById('chatSuggestionsBar');
const chatInput = document.getElementById('chatInput');
const btnSendChat = document.getElementById('btnSendChat');
const assistantLangPill = document.getElementById('assistantLangPill');
const langDropdownBtn = document.getElementById('langDropdownBtn');
const langDropdownMenu = document.getElementById('langDropdownMenu');

let currentLanguage = 'EN';

const AI_RESPONSES = {
  EN: {
    welcome: "Hello Rahul! I am your NIRBHAR AI Career Intelligence Guide. Ask me about matching jobs, government scholarships, ATS resume tailoring, or mock interviews.",
    eligibility: "Based on your 8.4 CGPA and B.Tech CSE profile, you qualify with a 94% match for Google Research India and 91% for Microsoft SWE! Your highest gap is Docker microservices and System Design.",
    ats: "Your current resume ATS score is 88/100. To reach 95+, include quantifiable metrics (e.g. 'Reduced latency by 35%') and add Docker/Redis to your technical skill matrix.",
    roadmap: "For an AI Engineer target role, finish Module 3: Dockerized Microservices deployment, followed by Graph RAG with LangChain. This will boost your employability match from 85% to 96%.",
    default: "I've analyzed your query against our active opportunities database and your verified profile. You can check eligibility directly from the cards above, or simulate a live interview in our AI Studio below!"
  },
  HI: {
    welcome: "नमस्ते राहुल! मैं आपका निर्भर AI करियर गाइड हूँ। आप मुझसे नौकरी, स्कॉलरशिप, रेज़्युमे सुधार या मॉक इंटरव्यू के बारे में पूछ सकते हैं।",
    eligibility: "आपके 8.4 CGPA और B.Tech प्रोफाइल के आधार पर आप Google Research (94% मैच) और Microsoft SWE (91% मैच) के लिए पूरी तरह योग्य हैं!",
    ats: "आपका वर्तमान रेज़्युमे ATS स्कोर 88/100 है। इसे 95+ करने के लिए अपने प्रोजेक्ट्स में '35% लेटेंसी कम की' जैसे मेट्रिक्स जोड़ें।",
    roadmap: "AI इंजीनियर बनने के लिए अगला कदम है डॉकर माइक्रोसर्विसेज और LangChain RAG सीखना। इससे आपका प्लेसमेंट स्कोर 96% तक बढ़ जाएगा।",
    default: "मैंने आपके प्रश्न का विश्लेषण किया है। आप ऊपर दिए गए अवसरों पर पात्रता जांच सकते हैं या नीचे AI मॉक इंटरव्यू शुरू कर सकते हैं।"
  },
  MR: {
    welcome: "नमस्कार राहुल! मी तुमचा निर्भर AI करिअर मार्गदर्शक आहे. नोकरी, शिष्यवृत्ती, रेझ्युमे आणि मॉक इंटरव्ह्यूसाठी मला विचारा.",
    eligibility: "तुमच्या 8.4 CGPA आधारे तुम्ही Google Research (94% मॅच) आणि Microsoft SWE साठी पात्र आहात!",
    ats: "तुमचा रेझ्युमे ATS स्कोअर 88/100 आहे. तो 95+ करण्यासाठी प्रोजेक्ट्समध्ये अचूक आकडेवारी आणि डॉकर कीवर्ड्स समाविष्ट करा.",
    roadmap: "AI इंजिनिअर पदासाठी Docker आणि System Design पूर्ण करा. यामुळे तुमचा प्लेसमेंट मॅच 96% होईल.",
    default: "मी तुमच्या प्रश्नाचे विश्लेषण केले आहे. तुम्ही वरील कार्ड्सवर पात्रता तपासू शकता किंवा खाली AI मॉक इंटरव्ह्यू सुरू करू शकता."
  }
};

function appendChatMessage(sender, text) {
  if (!assistantChatStream) return;
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.innerHTML = `
    <div class="bubble-avatar">${sender === 'bot' ? '🤖' : '👤'}</div>
    <div class="bubble-content">${text}</div>
  `;
  assistantChatStream.appendChild(bubble);
  assistantChatStream.scrollTop = assistantChatStream.scrollHeight;
}

function handleChatSubmit() {
  const query = (chatInput?.value || '').trim();
  if (!query) return;

  appendChatMessage('user', query);
  if (chatInput) chatInput.value = '';

  const lower = query.toLowerCase();
  let botReply = AI_RESPONSES[currentLanguage].default;

  if (lower.includes('eligibility') || lower.includes('google') || lower.includes('qualify') || lower.includes('पात्र')) {
    botReply = AI_RESPONSES[currentLanguage].eligibility;
  } else if (lower.includes('ats') || lower.includes('resume') || lower.includes('cv') || lower.includes('स्कोर')) {
    botReply = AI_RESPONSES[currentLanguage].ats;
  } else if (lower.includes('roadmap') || lower.includes('skill') || lower.includes('learn') || lower.includes('रोडमॅप')) {
    botReply = AI_RESPONSES[currentLanguage].roadmap;
  }

  setTimeout(() => {
    appendChatMessage('bot', botReply);
  }, 400);
}

btnSendChat?.addEventListener('click', handleChatSubmit);
chatInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleChatSubmit();
});

// Suggestion chips click
chatSuggestionsBar?.querySelectorAll('.chip-suggestion').forEach(chip => {
  chip.addEventListener('click', () => {
    if (chatInput) {
      chatInput.value = chip.textContent.trim();
      handleChatSubmit();
    }
  });
});

// Language switcher dropdown
langDropdownBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  langDropdownMenu?.classList.toggle('show');
});

document.addEventListener('click', () => {
  langDropdownMenu?.classList.remove('show');
});

langDropdownMenu?.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang || 'EN';
    currentLanguage = lang;
    if (langDropdownBtn) {
      langDropdownBtn.innerHTML = `🌐 ${btn.textContent.split(' ')[0]} ▾`;
    }
    if (assistantLangPill) {
      assistantLangPill.textContent = `AGENT: ${lang} ACTIVE`;
    }
    showToast(`Language switched to ${btn.textContent.trim()}`);
    appendChatMessage('bot', AI_RESPONSES[lang].welcome);
  });
});

// ─── 7. Skills & Learning Roadmap Alignment Recalculator ────
const targetRoleSelect = document.getElementById('targetRoleSelect');
const alignmentScoreDisplay = document.getElementById('alignmentScoreDisplay');
const milestoneCheckboxes = document.querySelectorAll('.milestone-checkbox');

function recalculateRoadmapAlignment() {
  const total = milestoneCheckboxes.length || 4;
  let checked = 0;
  milestoneCheckboxes.forEach(box => {
    if (box.checked) checked++;
  });

  // Base score is 82%, each checked milestone adds 4.5% up to 100%
  const newScore = Math.min(100, Math.round(82 + (checked * 4.5)));
  if (alignmentScoreDisplay) {
    alignmentScoreDisplay.textContent = `${newScore}%`;
  }
}

milestoneCheckboxes.forEach(box => {
  box.addEventListener('change', () => {
    recalculateRoadmapAlignment();
    showToast("Role alignment updated based on verified milestones!");
  });
});

targetRoleSelect?.addEventListener('change', () => {
  showToast(`Roadmap benchmark recalibrated for ${targetRoleSelect.value}!`);
  recalculateRoadmapAlignment();
});

// ─── 8. Resume ATS Score Dynamic Recalculator ────────────────
const atsScoreDisplayValue = document.getElementById('atsScoreDisplayValue');
const tailorChecks = document.querySelectorAll('.tailor-check');
const atsGaugeCircle = document.querySelector('.ats-gauge-circle');

function recalculateAtsScore() {
  let baseScore = 84;
  tailorChecks.forEach(box => {
    if (box.checked) baseScore += 4;
  });
  baseScore = Math.min(99, baseScore);

  if (atsScoreDisplayValue) {
    atsScoreDisplayValue.textContent = baseScore;
  }
  if (atsGaugeCircle) {
    atsGaugeCircle.style.background = `conic-gradient(#00FF88 ${baseScore}%, rgba(0, 255, 136, 0.1) 0)`;
  }
}

tailorChecks.forEach(box => {
  box.addEventListener('change', () => {
    recalculateAtsScore();
    showToast("Resume ATS optimization updated!");
  });
});

// ─── 9. AI Mock Interview Studio Simulator ──────────────────
const roundPills = document.querySelectorAll('.round-pill');
const interviewQuestionText = document.getElementById('interviewQuestionText');
const interviewAnswerInput = document.getElementById('interviewAnswerInput');
const btnSubmitAnswer = document.getElementById('btnSubmitAnswer');
const btnNextQuestion = document.getElementById('btnNextQuestion');
const aiRealtimeFeedback = document.getElementById('aiRealtimeFeedback');

const relevanceMeter = document.getElementById('relevanceMeter');
const depthMeter = document.getElementById('depthMeter');
const clarityMeter = document.getElementById('clarityMeter');

const INTERVIEW_QUESTIONS = {
  tech1: [
    {
      q: "Explain how you would design a high-throughput microservices architecture with FastAPI, Redis, and WebSockets for real-time candidate scoring.",
      relevance: 95, depth: 92, clarity: 90,
      feedback: "Strong architectural explanation. Mentioning Redis Pub/Sub decoupling and async event loops scored high on technical depth."
    },
    {
      q: "What data structure would you choose for implementing an LRU cache in an opportunity matching engine, and what is its time complexity?",
      relevance: 96, depth: 94, clarity: 92,
      feedback: "Double Linked List combined with Hash Map achieves O(1) get and put operations. Solid grasp of algorithmic fundamentals."
    }
  ],
  sysdesign: [
    {
      q: "How would you architect NIRBHAR AI's database layer to handle 10 million real-time student applications with zero-trust audit logging?",
      relevance: 94, depth: 96, clarity: 91,
      feedback: "Excellent coverage of read/write sharding in PostgreSQL, MongoDB for document telemetry, and cryptographic hash chains for tamper-evident logs."
    }
  ],
  hr: [
    {
      q: "Tell us about a challenging technical roadblock you encountered in a team project and how you resolved it under tight deadlines.",
      relevance: 92, depth: 88, clarity: 94,
      feedback: "Great demonstration of STAR format (Situation, Task, Action, Result) with clear accountability and cross-functional communication."
    }
  ]
};

let currentRoundKey = 'tech1';
let currentQuestionIndex = 0;

function updateMockQuestion() {
  const questions = INTERVIEW_QUESTIONS[currentRoundKey] || INTERVIEW_QUESTIONS.tech1;
  const currentQ = questions[currentQuestionIndex % questions.length];

  if (interviewQuestionText) {
    interviewQuestionText.textContent = `"${currentQ.q}"`;
  }
  if (interviewAnswerInput) {
    interviewAnswerInput.value = '';
    interviewAnswerInput.placeholder = 'Type your structured response (STAR method: Situation, Task, Action, Result)...';
  }
}

roundPills.forEach(pill => {
  pill.addEventListener('click', () => {
    roundPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    currentRoundKey = pill.dataset.round || 'tech1';
    currentQuestionIndex = 0;
    updateMockQuestion();
  });
});

btnNextQuestion?.addEventListener('click', () => {
  currentQuestionIndex++;
  updateMockQuestion();
});

btnSubmitAnswer?.addEventListener('click', () => {
  const answer = (interviewAnswerInput?.value || '').trim();
  const questions = INTERVIEW_QUESTIONS[currentRoundKey] || INTERVIEW_QUESTIONS.tech1;
  const currentQ = questions[currentQuestionIndex % questions.length];

  if (btnSubmitAnswer) {
    btnSubmitAnswer.textContent = 'Evaluating with AI Rubrics...';
    btnSubmitAnswer.disabled = true;
  }

  setTimeout(() => {
    if (relevanceMeter) relevanceMeter.style.width = `${currentQ.relevance}%`;
    if (depthMeter) depthMeter.style.width = `${currentQ.depth}%`;
    if (clarityMeter) clarityMeter.style.width = `${currentQ.clarity}%`;

    if (aiRealtimeFeedback) {
      aiRealtimeFeedback.innerHTML = `
        <strong style="color: var(--cyan);">AI Evaluation:</strong> ${currentQ.feedback}
        <div style="margin-top: 6px; font-size: 11.5px; color: #00FF88;">✓ Overall Score: <strong>${Math.round((currentQ.relevance + currentQ.depth + currentQ.clarity) / 3)}/100</strong> · Response meets industry benchmarks.</div>
      `;
    }

    if (btnSubmitAnswer) {
      btnSubmitAnswer.textContent = 'Submit & Evaluate Answer';
      btnSubmitAnswer.disabled = false;
    }
    showToast("Interview answer evaluated by AI Rubric Engine!");
  }, 700);
});

// ─── 10. Blueprint Image Viewer & Fullscreen Lightbox ────────
const blueprintImg = document.getElementById('blueprintImg');
const btnBpZoomIn = document.getElementById('btnBpZoomIn');
const btnBpZoomOut = document.getElementById('btnBpZoomOut');
const btnBpReset = document.getElementById('btnBpReset');
const btnBpFullscreen = document.getElementById('btnBpFullscreen');
const blueprintLightbox = document.getElementById('blueprintLightbox');
const btnCloseLightboxModal = document.getElementById('btnCloseLightboxModal');

let bpScale = 1.0;

function applyBpScale() {
  if (blueprintImg) {
    blueprintImg.style.transform = `scale(${bpScale})`;
  }
}

btnBpZoomIn?.addEventListener('click', () => {
  if (bpScale < 2.5) {
    bpScale += 0.25;
    applyBpScale();
  }
});

btnBpZoomOut?.addEventListener('click', () => {
  if (bpScale > 0.75) {
    bpScale -= 0.25;
    applyBpScale();
  }
});

btnBpReset?.addEventListener('click', () => {
  bpScale = 1.0;
  applyBpScale();
});

function openBlueprintLightbox() {
  if (blueprintLightbox) {
    blueprintLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeBlueprintLightbox() {
  if (blueprintLightbox) {
    blueprintLightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

btnBpFullscreen?.addEventListener('click', openBlueprintLightbox);
blueprintImg?.addEventListener('click', () => {
  if (bpScale === 1.0) openBlueprintLightbox();
});
btnCloseLightboxModal?.addEventListener('click', closeBlueprintLightbox);
blueprintLightbox?.addEventListener('click', (e) => {
  if (e.target === blueprintLightbox) closeBlueprintLightbox();
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeBlueprintLightbox();
    closeEligibilityModal();
  }
});

// Initial boot
document.addEventListener('DOMContentLoaded', () => {
  renderOpportunityCards();
  updateKanbanCounts();
  updateMockQuestion();
});


