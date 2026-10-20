/* Phantom Ghost — motion layer.
   - 3D wireframe ring hero (canvas, no libraries)
   - scroll reveals
   - 3D card tilt
   - parallax
   Respects prefers-reduced-motion. */
(function () {
  "use strict";

  const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ───────────────────────────── 1. 3D HERO RING ─────────────────────── */
  (function hero3D() {
    const host = document.getElementById("hero3d");
    if (!host) return;

    const cv = document.createElement("canvas");
    cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none";
    host.appendChild(cv);

    const ctx = cv.getContext("2d");
    let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const r = host.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      cv.width = W * DPR;
      cv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    // ring of points + a second counter-rotating ring = depth
    const N = 132, M = 84;
    const ringA = [], ringB = [], dust = [];
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      ringA.push({ a, r: 1.0, size: 3.0, alpha: 1.0 });
    }
    for (let i = 0; i < M; i++) {
      const a = (i / M) * Math.PI * 2;
      ringB.push({ a, r: 0.68, size: 2.0, alpha: 0.62 });
    }
    for (let i = 0; i < 70; i++) {
      dust.push({
        x: Math.random(), y: Math.random(),
        z: Math.random(), s: 0.4 + Math.random() * 1.1,
        v: 0.00012 + Math.random() * 0.00035,
      });
    }

    let t = 0;

    function project(x, y, z, cx, cy, focal) {
      const s = focal / (focal + z);
      return { x: cx + x * s, y: cy + y * s, s };
    }

    function frame() {
      t += REDUCE ? 0 : 1;
      const wide = W > 880;
      const cx = wide ? W * 0.755 : W / 2;
      const cy = wide ? H * 0.50 : H * 0.46;
      const R = Math.min(W, H) * (wide ? 0.285 : 0.335);
      const focal = R * 2.6;

      ctx.clearRect(0, 0, W, H);

      // soft halo behind the ring
      const hg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.9);
      hg.addColorStop(0, "rgba(176,208,224,0.055)");
      hg.addColorStop(0.55, "rgba(176,208,224,0.020)");
      hg.addColorStop(1, "rgba(176,208,224,0)");
      ctx.fillStyle = hg;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.9, 0, 6.2832);
      ctx.fill();

      // ── dust field ──
      for (const d of dust) {
        const z = ((d.z + t * d.v) % 1);
        const px = (d.x - 0.5) * W * 1.6;
        const py = (d.y - 0.5) * H * 1.6;
        const p = project(px, py, (z - 0.5) * R * 5, cx, cy, focal);
        if (p.s <= 0.02) continue;
        ctx.globalAlpha = 0.10 + (1 - z) * 0.28;
        ctx.fillStyle = "#B0D0E0";
        ctx.beginPath();
        ctx.arc(p.x, p.y, d.s * p.s, 0, 6.2832);
        ctx.fill();
      }

      // ── two rings, rotating opposite ──
      const rings = [
        { pts: ringA, ax: 0.34, ay: t * 0.0042, speed: 1.0 },
        { pts: ringB, ax: -0.22, ay: -t * 0.0061, speed: 1.0 },
      ];
      ctx.globalAlpha = 1;

      for (const ring of rings) {
        const cosX = Math.cos(ring.ax), sinX = Math.sin(ring.ax);
        const cosY = Math.cos(ring.ay), sinY = Math.sin(ring.ay);

        for (const pt of ring.pts) {
          const a = pt.a;
          let x = Math.cos(a) * R * pt.r;
          let y = 0;
          let z = Math.sin(a) * R * pt.r;

          // rotate Y
          let x1 = x * cosY - z * sinY;
          let z1 = x * sinY + z * cosY;
          // rotate X
          let y2 = y * cosX - z1 * sinX;
          let z2 = y * sinX + z1 * cosX;

          const p = project(x1, y2, z2, cx, cy, focal);
          const depth = (z2 / R + 1) / 2;         // 0 far .. 1 near
          const alpha = pt.alpha * (0.30 + depth * 0.70);
          const rad = pt.size * p.s * (0.55 + depth * 1.05);

          if (depth > 0.70 && rad > 1.6) {
            ctx.shadowColor = "rgba(200,225,238,0.55)";
            ctx.shadowBlur = rad * 3.2;
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.globalAlpha = alpha;
          ctx.fillStyle = depth > 0.55 ? "#F2F0EA" : "#8FB6C8";
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.4, rad), 0, 6.2832);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // ── centre sliver ──
      const pulse = 0.55 + 0.45 * Math.sin(t * 0.021);
      const sh = R * (0.56 + 0.07 * pulse);
      const sw = Math.max(2.4, R * 0.042);

      const g = ctx.createLinearGradient(cx, cy - sh, cx, cy + sh);
      g.addColorStop(0, "rgba(238,236,231,0)");
      g.addColorStop(0.42, `rgba(238,236,231,${0.75 + 0.25 * pulse})`);
      g.addColorStop(0.5, `rgba(255,255,255,${0.9 + 0.1 * pulse})`);
      g.addColorStop(0.58, `rgba(238,236,231,${0.75 + 0.25 * pulse})`);
      g.addColorStop(1, "rgba(238,236,231,0)");

      ctx.globalAlpha = 1;
      ctx.shadowColor = "rgba(176,208,224,0.85)";
      ctx.shadowBlur = 40 * pulse;
      ctx.fillStyle = g;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(cx - sw / 2, cy - sh, sw, sh * 2, sw / 2);
      else ctx.rect(cx - sw / 2, cy - sh, sw, sh * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (!REDUCE) requestAnimationFrame(frame);
    }
    frame();
  })();

  /* ───────────────────────── 2. SCROLL REVEALS ───────────────────────── */
  (function reveals() {
    if (REDUCE) return;
    const targets = document.querySelectorAll(
      "section h2, section .sub, section .eyebrow, .card, .tier, .work figure, .work .note, .contact h2, .contact p, .contact .mail"
    );
    targets.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(26px)";
      el.style.transition = "opacity .75s cubic-bezier(.22,.68,.36,1), transform .75s cubic-bezier(.22,.68,.36,1)";
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const delay = parseFloat(el.dataset.delay || 0);
        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, delay * 1000 + (i * 55));
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    targets.forEach(el => io.observe(el));
  })();

  /* ───────────────────────── 3. 3D CARD TILT ─────────────────────────── */
  (function tilt() {
    if (REDUCE) return;
    document.querySelectorAll(".card, .tier").forEach(card => {
      card.style.transformStyle = "preserve-3d";
      card.style.willChange = "transform";

      card.addEventListener("mousemove", (ev) => {
        const r = card.getBoundingClientRect();
        const px = (ev.clientX - r.left) / r.width - 0.5;
        const py = (ev.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          `perspective(760px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateZ(6px)`;
        card.style.transition = "transform .08s linear";
        card.style.borderColor = "rgba(176,208,224,.42)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transition = "transform .5s cubic-bezier(.22,.68,.36,1), border-color .4s";
        card.style.transform = "perspective(760px) rotateY(0) rotateX(0) translateZ(0)";
        card.style.borderColor = "";
      });
    });
  })();

  /* ───────────────────────── 4. HERO PARALLAX ────────────────────────── */
  (function parallax() {
    if (REDUCE) return;
    const h1 = document.querySelector("header h1");
    const lede = document.querySelector("header .lede");
    const cta = document.querySelector("header .cta-row");
    let raf = null;

    window.addEventListener("scroll", () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < 760) {
          if (h1) h1.style.transform = `translateY(${y * 0.16}px)`;
          if (lede) lede.style.transform = `translateY(${y * 0.10}px)`;
          if (cta) cta.style.transform = `translateY(${y * 0.06}px)`;
          if (h1) h1.style.opacity = String(Math.max(0, 1 - y / 620));
        }
        raf = null;
      });
    }, { passive: true });
  })();

  /* ──────────────── 5. NAV shrink + active section ───────────────────── */
  (function nav() {
    const navEl = document.querySelector("nav");
    if (!navEl) return;
    window.addEventListener("scroll", () => {
      navEl.style.borderBottomColor = window.scrollY > 40
        ? "rgba(238,236,231,.22)" : "rgba(238,236,231,.14)";
    }, { passive: true });
  })();
})();
