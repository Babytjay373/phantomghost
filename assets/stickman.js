/* Phantom Ghost — 3D stickman (canvas, no libraries).
   A real 3D skeleton: 3D joint coordinates -> perspective projection -> glowing bones.
   Procedural walk cycle, slow orbit. */
(function () {
  "use strict";

  const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function makeStickman(hostId, opts) {
    const host = document.getElementById(hostId);
    if (!host) return;

    opts = opts || {};
    const ACCENT = opts.accent || "#B0D0E0";
    const CORE   = opts.core   || "#F2F0EA";
    const SPEED  = opts.speed  || 1.0;

    const cv = document.createElement("canvas");
    cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.appendChild(cv);
    host.style.position = "relative";
    const ctx = cv.getContext("2d");

    let W = 0, H = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

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

    /* ── 3D helpers ─────────────────────────────────────────────────── */
    function rotY(p, a) {
      const c = Math.cos(a), s = Math.sin(a);
      return { x: p.x * c - p.z * s, y: p.y, z: p.x * s + p.z * c };
    }
    function rotX(p, a) {
      const c = Math.cos(a), s = Math.sin(a);
      return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
    }
    function project(p, cx, cy, scale, focal) {
      const d = focal + p.z;
      const k = focal / Math.max(0.001, d);
      return { x: cx + p.x * scale * k, y: cy + p.y * scale * k, k, z: p.z };
    }

    /* ── the skeleton, in local units (origin at the pelvis, +y is DOWN) ── */
    // proportions: pelvis 0 · neck -0.30 · head centre -0.40 · feet +0.40
    const THIGH = 0.205, SHIN = 0.195;
    const UPPER_ARM = 0.145, FORE_ARM = 0.135;

    function skeleton(t) {
      const ph = t * 2.6;
      const swing  = Math.sin(ph);
      const swing2 = Math.sin(ph + Math.PI);
      const bob = Math.abs(Math.cos(ph)) * 0.016;

      const pelvis = { x: 0, y: 0 - bob, z: 0 };
      const neck   = { x: 0, y: -0.300 - bob, z: 0.004 * Math.sin(ph) };
      const head   = { x: 0, y: -0.368 - bob, z: 0.006 * Math.sin(ph) };

      const shL = { x: -0.105, y: -0.275 - bob, z: 0 };
      const shR = { x:  0.105, y: -0.275 - bob, z: 0 };

      const ARM_AMP = 0.46, LEG_AMP = 0.42;

      // arm: shoulder -> elbow -> hand, swinging about x
      function arm(root, phase) {
        const a = Math.sin(phase) * ARM_AMP;
        const elbow = { x: root.x, y: root.y + Math.cos(a) * UPPER_ARM, z: Math.sin(a) * UPPER_ARM };
        const b = a + Math.max(0, Math.sin(phase + 0.8)) * 0.30;
        const hand = { x: elbow.x, y: elbow.y + Math.cos(b) * FORE_ARM, z: elbow.z + Math.sin(b) * FORE_ARM };
        return { elbow, hand };
      }

      // leg: hip -> knee -> foot. Clamp so the foot never goes below the floor.
      function leg(root, phase) {
        const a = Math.sin(phase) * LEG_AMP;
        const bend = Math.max(0, Math.sin(phase - 0.9)) * 0.55;
        let knee = { x: root.x, y: root.y + Math.cos(a) * THIGH, z: Math.sin(a) * THIGH };
        let foot = { x: knee.x, y: knee.y + Math.cos(a - bend) * SHIN, z: knee.z + Math.sin(a - bend) * SHIN };
        // keep the sole on the ground plane
        const FLOOR = 0.400;
        if (foot.y > FLOOR) {
          const over = foot.y - FLOOR;
          foot = { x: foot.x, y: FLOOR, z: foot.z - over * 0.35 };
          knee = { x: knee.x, y: knee.y - over * 0.55, z: knee.z };
        }
        return { knee, foot };
      }

      const armL = arm(shL, swing2);
      const armR = arm(shR, swing);
      const hipL = { x: -0.055, y: pelvis.y, z: 0 };
      const hipR = { x:  0.055, y: pelvis.y, z: 0 };
      const legL = leg(hipL, swing2);
      const legR = leg(hipR, swing);

      return { pelvis, neck, head, shL, shR, armL, armR, hipL, hipR, legL, legR };
    }

    /* ── draw ───────────────────────────────────────────────────────── */
    let t = 0;
    let last = performance.now();

    function frame(now) {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      if (!REDUCE) t += dt * SPEED;

      ctx.clearRect(0, 0, W, H);

      // soft floor glow
      const cx = W / 2, cy = H * 0.52;
      const scale = Math.min(W, H) * 0.80;
      const focal = 3.2;
      const floorY = 0.400;

      const fg = ctx.createRadialGradient(cx, cy + scale * floorY, 0, cx, cy + scale * floorY, scale * 1.15);
      fg.addColorStop(0, "rgba(176,208,224,0.075)");
      fg.addColorStop(1, "rgba(176,208,224,0)");
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.ellipse(cx, cy + scale * (floorY + 0.02), scale * 1.15, scale * 0.22, 0, 0, 6.2832);
      ctx.fill();

      // project everything
      const sk = skeleton(t);
      const spin = 1.22 + Math.sin(t * 0.38) * 0.34;
      const tilt = -0.10 + Math.sin(t * 0.29) * 0.05;

      function P(p) {
        let q = { x: p.x, y: p.y - 0.06, z: p.z };
        q = rotY(q, spin);
        q = rotX(q, tilt);
        return project(q, cx, cy, scale, focal);
      }

      const J = {
        pelvis: P(sk.pelvis),
        neck:   P(sk.neck),
        head:   P(sk.head),
        shL:    P(sk.shL), shR: P(sk.shR),
        elbL:   P(sk.armL.elbow), elbR: P(sk.armR.elbow),
        handL:  P(sk.armL.hand),  handR: P(sk.armR.hand),
        hipL:   P(sk.hipL), hipR: P(sk.hipR),
        kneeL:  P(sk.legL.knee), kneeR: P(sk.legR.knee),
        footL:  P(sk.legL.foot), footR: P(sk.legR.foot),
      };

      const bones = [
        ["pelvis","neck"], ["neck","head"],
        ["neck","shL"], ["neck","shR"],
        ["shL","elbL"], ["elbL","handL"],
        ["shR","elbR"], ["elbR","handR"],
        ["pelvis","hipL"], ["pelvis","hipR"],
        ["hipL","kneeL"], ["kneeL","footL"],
        ["hipR","kneeR"], ["kneeR","footR"],
        ["shL","shR"], ["hipL","hipR"],
      ];

      // depth-sort bones so the far side draws first
      const drawn = bones.map(([a, b]) => {
        const A = J[a], B = J[b];
        return { A, B, z: (A.z + B.z) / 2 };
      }).sort((p, q) => q.z - p.z);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (const { A, B, z } of drawn) {
        const near = Math.max(0, Math.min(1, (z + 0.5) / 1.0));
        const w = 1.4 + near * 3.6;

        // glow pass
        ctx.strokeStyle = ACCENT;
        ctx.globalAlpha = 0.13 + near * 0.22;
        ctx.lineWidth = w * 3.4;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();

        // core pass
        ctx.strokeStyle = near > 0.55 ? CORE : ACCENT;
        ctx.globalAlpha = 0.35 + near * 0.65;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
      }

      // joints
      for (const k in J) {
        const p = J[k];
        const near = Math.max(0, Math.min(1, (p.z + 0.5) / 1.0));
        const r = (k === "head" ? 6.0 : 2.2) + near * 1.7;
        ctx.globalAlpha = 0.30 + near * 0.70;
        ctx.fillStyle = near > 0.5 ? CORE : ACCENT;
        ctx.shadowColor = ACCENT;
        ctx.shadowBlur = 10 * (0.3 + near);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, 6.2832);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // head ring
      const hd = J.head;
      const nearH = Math.max(0, Math.min(1, (hd.z + 0.5) / 1.0));
      ctx.globalAlpha = 0.5 + nearH * 0.5;
      ctx.strokeStyle = nearH > 0.5 ? CORE : ACCENT;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(hd.x, hd.y, 12 * hd.k, 0, 6.2832);
      ctx.stroke();

      // ground contact — sits under the actual feet
      const feet = [J.footL, J.footR];
      const fx = (feet[0].x + feet[1].x) / 2;
      const fyy = (feet[0].y + feet[1].y) / 2;
      ctx.globalAlpha = 0.30;
      ctx.fillStyle = ACCENT;
      ctx.beginPath();
      ctx.ellipse(fx, fyy + 6, 26 * feet[0].k, 7 * feet[0].k, 0, 0, 6.2832);
      ctx.fill();
      ctx.globalAlpha = 0.14;
      ctx.beginPath();
      ctx.ellipse(fx, fyy + 6, 54 * feet[0].k, 14 * feet[0].k, 0, 0, 6.2832);
      ctx.fill();

      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  window.PGStickman = makeStickman;

  // auto-init any element with data-stickman
  document.querySelectorAll("[data-stickman]").forEach(el => {
    makeStickman(el.id, {
      accent: el.dataset.accent || "#B0D0E0",
      core: el.dataset.core || "#F2F0EA",
      speed: parseFloat(el.dataset.speed || "1"),
    });
  });
})();
