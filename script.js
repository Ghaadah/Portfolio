/* ═══════════════════════════════════════════
   script.js — Raghad Al Musawi portfolio
═══════════════════════════════════════════ */


/* ── Theme toggle ──────────────────────── */

function initTheme() {
  const saved = localStorage.getItem('ra-theme') || 'dark';
  if (saved === 'light') document.documentElement.classList.add('light');
  syncToggleIcons();
}

function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('light');
  localStorage.setItem('ra-theme', isLight ? 'light' : 'dark');
  syncToggleIcons();
}

function syncToggleIcons() {
  const isLight = document.documentElement.classList.contains('light');
  document.querySelectorAll('.t-icon').forEach(el => {
    el.textContent = isLight ? '☽' : '☀';
  });
  document.querySelectorAll('.t-label').forEach(el => {
    el.textContent = isLight ? 'Dark' : 'Light';
  });
}


/* ── Tech-network hero animation (home) ── */

function startTechNetwork(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const skills = [
    { label: 'Power Apps',   baseAngle:  0,   orbit: 125, speed: 0.00042 },
    { label: 'Power BI',     baseAngle:  52,  orbit: 155, speed: 0.00028 },
    { label: 'SharePoint',   baseAngle: 110,  orbit: 112, speed: 0.00055 },
    { label: 'SQL Server',   baseAngle: 162,  orbit: 145, speed: 0.00033 },
    { label: 'Power Auto.',  baseAngle: 215,  orbit: 105, speed: 0.00068 },
    { label: 'Apricot360',   baseAngle: 268,  orbit: 148, speed: 0.00038 },
    { label: 'GCP',          baseAngle: 320,  orbit: 122, speed: 0.00050 },
    { label: 'AI / LLM',     baseAngle:  30,  orbit: 170, speed: 0.00022 },
    { label: 'IS Admin',     baseAngle: 185,  orbit: 80,  speed: 0.00075 },
  ];

  function resize() {
    canvas.width  = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  function getPos(s, t) {
    const angle = (s.baseAngle * Math.PI / 180) + t * s.speed;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    return { x: cx + Math.cos(angle) * s.orbit, y: cy + Math.sin(angle) * s.orbit };
  }

  function getGold() {
    const isLight = document.documentElement.classList.contains('light');
    return isLight ? '154,108,8' : '212,168,67';
  }

  function frame(ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const g  = getGold();
    const t  = ts * 0.001;

    /* Orbit rings */
    [80, 112, 130, 155, 170].forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${g},0.12)`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });

    /* Center node */
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${g},0.08)`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${g},0.22)`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${g},0.35)`;
    ctx.fill();

    ctx.font            = "500 14px 'Fraunces', serif";
    ctx.fillStyle       = `rgba(${g},1)`;
    ctx.textAlign       = 'center';
    ctx.textBaseline    = 'middle';
    ctx.fillText('RA', cx, cy);

    const positions = skills.map(s => getPos(s, t));

    /* Spoke lines center → node */
    positions.forEach(p => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${g},0.18)`;
      ctx.lineWidth   = 0.8;
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    });

    /* Cross-connections between close neighbors */
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[i].x - positions[j].x;
        const dy = positions[i].y - positions[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 95) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${g},${0.18 * (1 - d / 95)})`;
          ctx.lineWidth   = 0.8;
          ctx.moveTo(positions[i].x, positions[i].y);
          ctx.lineTo(positions[j].x, positions[j].y);
          ctx.stroke();
        }
      }
    }

    /* Skill nodes + labels */
    skills.forEach((s, i) => {
      const p = positions[i];

      /* Outer halo */
      ctx.beginPath();
      ctx.arc(p.x, p.y, 16, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${g},0.07)`;
      ctx.fill();

      /* Inner halo */
      ctx.beginPath();
      ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${g},0.14)`;
      ctx.fill();

      /* Dot */
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${g},0.9)`;
      ctx.fill();

      /* Label */
      const onRight = p.x > cx;
      ctx.font          = "400 12px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle     = `rgba(${g},0.85)`;
      ctx.textAlign     = onRight ? 'left' : 'right';
      ctx.textBaseline  = 'middle';
      ctx.fillText(s.label, p.x + (onRight ? 20 : -20), p.y);
    });

    requestAnimationFrame(frame);
  }

  resize();
  requestAnimationFrame(frame);
  window.addEventListener('resize', () => { resize(); });
}


/* ── Constellation background (portfolio) ─ */

function startConstellation(canvasId, opts) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  const o       = Object.assign({ count: 40, maxDist: 115, speed: 0.2 }, opts);
  let   dots    = [];
  let   raf;

  function getGold() {
    return document.documentElement.classList.contains('light') ? '154,108,8' : '212,168,67';
  }

  function resize() {
    canvas.width  = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  function init() {
    resize();
    dots = Array.from({ length: o.count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * o.speed,
      vy: (Math.random() - 0.5) * o.speed,
      r:  Math.random() * 1.5 + 0.6
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const g = getGold();

    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > canvas.width)  d.vx *= -1;
      if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
    });

    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < o.maxDist) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${g},${0.13 * (1 - d / o.maxDist)})`;
          ctx.lineWidth   = 0.5;
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }

    dots.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${g},0.38)`;
      ctx.fill();
    });

    raf = requestAnimationFrame(frame);
  }

  init(); frame();
  window.addEventListener('resize', () => { cancelAnimationFrame(raf); init(); frame(); });
}


/* ── Scroll reveal ──────────────────────── */

function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
    { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
  );
  els.forEach(el => obs.observe(el));
}


/* ── Smooth anchor scrolling ────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const t = document.querySelector(link.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
});
