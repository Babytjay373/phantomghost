/* Phantom Ghost — live motion lab.
   [data-flow]    generative flow field you can stir with the pointer
   [data-kinetic] kinetic typography that cycles words in time with a beat */
(function () {
  "use strict";
  const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setup(host) {
    const cv = document.createElement("canvas");
    cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.appendChild(cv);
    const ctx = cv.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const st = { cv, ctx, W: 1, H: 1, DPR, visible: true };
    function resize() {
      const r = host.getBoundingClientRect();
      st.W = Math.max(1, r.width); st.H = Math.max(1, r.height);
      cv.width = st.W * DPR; cv.height = st.H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      if (st.onresize) st.onresize();
    }
    st.resize = resize;
    new IntersectionObserver((es) => { st.visible = es[0].isIntersecting; }).observe(host);
    window.addEventListener("resize", resize);
    return st;
  }

  /* ── flow field ─────────────────────────────────────────────────────── */
  document.querySelectorAll("[data-flow]").forEach((host) => {
    const st = setup(host);
    const { ctx } = st;
    const COLS = ["#B0D0E0", "#D2425F", "#F2B441", "#7A5AE6"];
    let parts = [];
    const px = { x: -999, y: -999, on: false };
    st.onresize = () => {
      ctx.fillStyle = "#07080C"; ctx.fillRect(0, 0, st.W, st.H);
      const n = Math.round(Math.min(1600, st.W * st.H / 110));
      parts = Array.from({ length: n }, () => spawn());
    };
    function spawn() {
      const x = Math.random() * st.W;
      return { x, y: Math.random() * st.H, life: 60 + Math.random() * 160, c: COLS[Math.min(3, Math.floor(x / st.W * 4))] };
    }
    st.resize();
    host.addEventListener("pointermove", (e) => {
      const r = host.getBoundingClientRect();
      px.x = e.clientX - r.left; px.y = e.clientY - r.top; px.on = true;
    });
    host.addEventListener("pointerleave", () => { px.on = false; });
    let t = 0;
    function frame() {
      if (st.visible) {
        t += 0.004;
        if (!REDUCE) { ctx.fillStyle = "rgba(7,8,12,0.035)"; ctx.fillRect(0, 0, st.W, st.H); } // trails fade only when animating
        ctx.lineWidth = 1.2;
        for (const p of parts) {
          let a = (Math.sin(p.x * 0.012 + Math.cos(p.y * 0.008 + t) * 2.2) + Math.cos(p.y * 0.014 - p.x * 0.004 + t)) * Math.PI;
          if (px.on) {
            const dx = p.x - px.x, dy = p.y - px.y, d2 = dx * dx + dy * dy;
            if (d2 < 9000) a += Math.atan2(dy, dx) + Math.PI / 2; // swirl around the pointer
          }
          const nx = p.x + Math.cos(a) * 1.4, ny = p.y + Math.sin(a) * 1.4;
          ctx.strokeStyle = p.c; ctx.globalAlpha = REDUCE ? 0.3 : 0.8;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
          p.x = nx; p.y = ny;
          if (--p.life < 0 || nx < 0 || ny < 0 || nx > st.W || ny > st.H) Object.assign(p, spawn());
        }
        ctx.globalAlpha = 1;
      }
      if (!REDUCE) requestAnimationFrame(frame);
    }
    if (REDUCE) { for (let i = 0; i < 160; i++) frame(); } else requestAnimationFrame(frame);
  });

  /* ── kinetic type ───────────────────────────────────────────────────── */
  document.querySelectorAll("[data-kinetic]").forEach((host) => {
    const st = setup(host);
    st.resize();
    const { ctx } = st;
    const WORDS = (host.dataset.kinetic || "AI|3D|2D|MOTION|STUDIO").split("|");
    const BPM = 112, beat = 60000 / BPM;
    const PAL = ["#F2B441", "#B0D0E0", "#D2425F", "#EEECE7"];
    const t0 = performance.now();
    function frame(now) {
      if (st.visible) {
        const { W, H } = st;
        const b = (now - t0) / beat;
        const i = Math.floor(b / 2) % WORDS.length;
        const ph = (b % 2) / 2;                 // 0..1 within a word
        const hit = Math.pow(1 - (b % 1), 6);   // kick on every beat
        ctx.fillStyle = "#07080C"; ctx.fillRect(0, 0, W, H);
        // beat bars
        const n = 24, bw = W / n;
        for (let k = 0; k < n; k++) {
          const h = (0.12 + 0.5 * Math.abs(Math.sin(k * 1.7 + b * 1.3)) * (0.4 + hit)) * H * 0.5;
          ctx.fillStyle = "rgba(176,208,224," + (0.05 + 0.1 * hit) + ")";
          ctx.fillRect(k * bw + 2, H - h, bw - 4, h);
        }
        const word = WORDS[i], col = PAL[i % PAL.length];
        const size = Math.min(W / (word.length * 0.62), H * 0.42) * (1 + hit * 0.08);
        const enter = Math.min(1, ph * 6), exit = Math.max(0, (ph - 0.85) / 0.15);
        ctx.save();
        ctx.translate(W / 2, H / 2 + (1 - enter) * 30 - exit * 30);
        ctx.font = "700 " + size + "px 'DIN Condensed','Arial Narrow','Helvetica Neue',sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.globalAlpha = enter * (1 - exit);
        // chromatic offset on the hit
        ctx.fillStyle = "rgba(210,66,95,.7)"; ctx.fillText(word, -6 * hit, 0);
        ctx.fillStyle = "rgba(122,90,230,.7)"; ctx.fillText(word, 6 * hit, 0);
        ctx.fillStyle = col; ctx.fillText(word, 0, 0);
        ctx.restore();
        ctx.globalAlpha = 1;
        ctx.fillStyle = "rgba(238,236,231,.5)";
        ctx.font = "600 10px -apple-system,sans-serif";
        ctx.fillText(BPM + " BPM", 14, 22);
      }
      if (!REDUCE) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
})();
