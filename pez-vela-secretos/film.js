// THE FILM — "Secretos del Azul #1: el pez vela". Flat vector look, every frame a pure function of t.
(function () {
  const U = globalThis.U, G = globalThis.G, S = globalThis.SCORE, Studio = globalThis.Studio, Subs = globalThis.Subs;
  const { T, ev, SC, BEAT } = S;
  const { clamp, lerp, ease, pulse } = U;
  const W = G.W, H = G.H, SAFE = G.SAFE;
  const K = W / 1080;
  const CX = SAFE.x + SAFE.w / 2; // horizontal centre of the safe area
  const ACCENT = '#5FE1FF';
  const h = (...a) => U.hash(...a);
  const inSc = (t, k) => t >= SC[k][0] && t < SC[k][1];
  const local = (t, k) => t - SC[k][0];

  // ---------------------------------------------------------------- backgrounds
  function ocean(ctx, t, { top = '#1667A8', mid = '#0B3D6E', bot = '#04172F', rays = 1, motes = 1, surface = 0 } = {}) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, top); g.addColorStop(0.45, mid); g.addColorStop(1, bot);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (surface > 0) { // the bright underside of the surface
      const sy = H * 0.27;
      const sg = ctx.createLinearGradient(0, sy - 160 * K, 0, sy + 120 * K);
      sg.addColorStop(0, `rgba(190,240,255,${0.55 * surface})`); sg.addColorStop(1, 'rgba(190,240,255,0)');
      ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(0, 0);
      for (let x = 0; x <= W; x += 20) ctx.lineTo(x, sy + Math.sin(x * 0.012 + t * 1.6) * 14 * K + Math.sin(x * 0.031 - t * 2.1) * 6 * K);
      ctx.lineTo(W, 0); ctx.fill();
    }
    if (rays > 0) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 6; i++) {
        const x0 = W * (h(i, 1) * 1.2 - 0.1) + Math.sin(t * 0.25 + i) * 60 * K, w0 = (40 + h(i, 2) * 90) * K;
        const a = (0.05 + 0.05 * Math.sin(t * 0.7 + i * 1.7)) * rays;
        const rg = ctx.createLinearGradient(0, 0, 0, H * 0.85);
        rg.addColorStop(0, `rgba(170,230,255,${a})`); rg.addColorStop(1, 'rgba(170,230,255,0)');
        ctx.fillStyle = rg; ctx.beginPath();
        ctx.moveTo(x0, 0); ctx.lineTo(x0 + w0, 0); ctx.lineTo(x0 + w0 * 2.6 - 260 * K, H * 0.85); ctx.lineTo(x0 - 260 * K, H * 0.85); ctx.fill();
      }
      ctx.restore();
    }
    if (motes > 0) {
      for (let i = 0; i < 70; i++) {
        const x = (h(i, 3) * W + Math.sin(t * 0.4 + i) * 20 * K) % W;
        const y = ((h(i, 4) * H - t * (10 + h(i, 5) * 25) * K) % H + H) % H;
        const r = (1.5 + h(i, 6) * 3.5) * K;
        ctx.fillStyle = `rgba(200,240,255,${(0.12 + h(i, 7) * 0.3) * motes})`;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
  function sepia(ctx, t) {
    const g = ctx.createRadialGradient(W / 2, H * 0.5, 50, W / 2, H * 0.5, H * 0.75);
    g.addColorStop(0, '#F1DFB8'); g.addColorStop(1, '#B98E55');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 260; i++) { // old-print speckle
      ctx.fillStyle = `rgba(90,60,25,${0.05 + h(i, 9, Math.floor(t * 8)) * 0.12})`;
      ctx.fillRect(h(i, 10, Math.floor(t * 8)) * W, h(i, 11, Math.floor(t * 8)) * H, 3 * K, 3 * K);
    }
  }

  // ---------------------------------------------------------------- the sailfish (head points +x)
  function sailfish(ctx, { x, y, s = 1, rot = 0, flip = false, sail = 0.4, glow = 0, t = 0, speed = 1, alpha = 1 }) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(rot); ctx.scale(flip ? -s : s, s);
    ctx.globalAlpha *= alpha;
    const sw = Math.sin(t * 7 * speed);
    const backTop = lerpColor('#16264F', '#1D4FD0', glow), backMid = lerpColor('#2C4876', '#2F7FE0', glow);
    // tail
    ctx.save(); ctx.translate(-250, 0); ctx.rotate(sw * 0.16);
    ctx.fillStyle = backTop; ctx.beginPath();
    ctx.moveTo(4, -8); ctx.quadraticCurveTo(-45, -50, -98, -125); ctx.quadraticCurveTo(-70, -35, -58, 0);
    ctx.quadraticCurveTo(-70, 35, -98, 125); ctx.quadraticCurveTo(-45, 50, 4, 8); ctx.closePath(); ctx.fill();
    ctx.restore();
    // sail (dorsal fin): folded flat ↔ raised high
    const k = clamp(sail, 0, 1), ph = 30 + 270 * k;
    const sg = ctx.createLinearGradient(0, -40, 0, -40 - ph);
    sg.addColorStop(0, lerpColor('#1E2E66', '#2349B8', glow)); sg.addColorStop(1, lerpColor('#3B5AB8', '#56B6FF', glow));
    ctx.fillStyle = sg; ctx.beginPath();
    ctx.moveTo(215, -46);
    ctx.bezierCurveTo(190, -46 - ph * 1.05, 120, -50 - ph * 1.1, 60, -48 - ph);
    ctx.bezierCurveTo(-20, -45 - ph * 0.9, -110, -42 - ph * 0.55, -175, -34);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(10,20,50,0.35)'; ctx.lineWidth = 3;
    for (let i = 0; i < 11; i++) { const u = i / 10; const bx = lerp(205, -165, u); const top = -48 - ph * (0.95 - 0.55 * u * u) * (u < 0.15 ? 0.7 + 2 * u : 1); ctx.beginPath(); ctx.moveTo(bx, -44); ctx.lineTo(bx - 8, top + 8); ctx.stroke(); }
    ctx.fillStyle = `rgba(20,30,70,${0.35 - 0.2 * glow})`;
    for (let i = 0; i < 14; i++) { const u = h(i, 21); const bx = lerp(190, -140, u); ctx.beginPath(); ctx.arc(bx, -60 - ph * (0.2 + 0.6 * h(i, 22)) * (1 - 0.5 * u), 6 * (0.5 + k), 0, Math.PI * 2); ctx.fill(); }
    // bill
    ctx.fillStyle = backTop; ctx.beginPath(); ctx.moveTo(300, -10); ctx.lineTo(490, 1); ctx.lineTo(300, 10); ctx.closePath(); ctx.fill();
    // body
    const bg = ctx.createLinearGradient(0, -70, 0, 60);
    bg.addColorStop(0, backTop); bg.addColorStop(0.35, backMid); bg.addColorStop(0.6, '#AFC3D6'); bg.addColorStop(1, '#EEF4F8');
    ctx.fillStyle = bg;
    bodyPath(ctx); ctx.fill();
    // stripes: light up when hunting
    if (glow > 0.01) {
      ctx.save(); bodyPath(ctx); ctx.clip();
      ctx.shadowColor = ACCENT; ctx.shadowBlur = 25 * glow;
      ctx.fillStyle = `rgba(95,225,255,${0.9 * glow})`;
      for (let i = 0; i < 11; i++) { const bx = lerp(200, -210, i / 10); ctx.beginPath(); ctx.ellipse(bx, -5, 7, 62, 0.08, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    }
    // belly shine + lateral line
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(270, 6); ctx.bezierCurveTo(120, 16, -60, 10, -240, 0); ctx.stroke();
    // pectoral + pelvic fins
    ctx.fillStyle = lerpColor('#22355F', '#2A62D6', glow);
    ctx.beginPath(); ctx.moveTo(185, 18); ctx.quadraticCurveTo(120, 60 + sw * 6, 70, 75 + sw * 8); ctx.quadraticCurveTo(130, 40, 165, 28); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-150, 30); ctx.lineTo(-215, 62); ctx.lineTo(-200, 22); ctx.closePath(); ctx.fill();
    // gill + eye
    ctx.strokeStyle = 'rgba(10,20,40,0.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(250, 4, 42, Math.PI * 0.6, Math.PI * 1.35); ctx.stroke();
    ctx.fillStyle = '#0A1226'; ctx.beginPath(); ctx.arc(266, -14, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(269, -17, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function bodyPath(ctx) {
    ctx.beginPath(); ctx.moveTo(305, 0);
    ctx.bezierCurveTo(270, -50, 150, -62, -40, -50);
    ctx.bezierCurveTo(-150, -40, -220, -18, -255, -7);
    ctx.lineTo(-255, 7);
    ctx.bezierCurveTo(-200, 22, -120, 52, 20, 58);
    ctx.bezierCurveTo(170, 60, 270, 45, 305, 0);
    ctx.closePath();
  }
  function lerpColor(a, b, k) {
    const p = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
    const A = p(a), B = p(b); k = clamp(k, 0, 1);
    return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], k))).join(',')})`;
  }

  // ---------------------------------------------------------------- sardines + bait ball
  function sardine(ctx, x, y, ang, s, a = 1) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s); ctx.globalAlpha *= a;
    ctx.fillStyle = '#9FB6CC'; ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(-26, -7); ctx.lineTo(-26, 7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#DCE8F2'; ctx.beginPath(); ctx.ellipse(0, 0, 19, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#4C6C8E'; ctx.beginPath(); ctx.ellipse(0, -2.5, 17, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function baitBall(ctx, t, cx, cy, R, { strikes = [], n = 150 } = {}) {
    for (let i = 0; i < n; i++) {
      const rr = R * Math.sqrt(h(i, 31)) * (0.9 + 0.1 * Math.sin(t * 2 + i));
      const dir = 1;
      const a = h(i, 32) * Math.PI * 2 + t * dir * (0.5 + h(i, 33) * 0.5) * (R / Math.max(rr, R * 0.3)) * 0.5;
      let x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * 0.8;
      let ang = a + Math.PI / 2;
      for (const st of strikes) { // scatter away from the strike point, then regroup
        const d = t - st.t; if (d < 0 || d > 2.5) continue;
        const dx = x - st.x, dy = y - st.y, dist = Math.hypot(dx, dy) || 1;
        const push = 260 * K * Math.exp(-dist / (180 * K)) * (1 - Math.exp(-d * 10)) * Math.exp(-d * 1.2);
        x += (dx / dist) * push; y += (dy / dist) * push;
        if (push > 20 * K) ang = Math.atan2(dy, dx);
      }
      sardine(ctx, x, y, ang, 0.9 * K * (0.8 + h(i, 34) * 0.4));
    }
  }

  // ---------------------------------------------------------------- props
  function gauge(ctx, t, cx, cy, r, val, { readout = null } = {}) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 34 * K;
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, Math.PI * 2); ctx.stroke();
    const f = clamp(val / 140);
    const gg = ctx.createLinearGradient(cx - r, 0, cx + r, 0); gg.addColorStop(0, '#5FE1FF'); gg.addColorStop(1, '#FF5A6E');
    ctx.strokeStyle = gg; ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, Math.PI + Math.PI * f); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    for (let v = 0; v <= 140; v += 20) {
      const a = Math.PI + (v / 140) * Math.PI;
      G.text(ctx, String(v), cx + Math.cos(a) * (r - 70 * K), cy + Math.sin(a) * (r - 70 * K) + 10 * K, { size: Math.round(28 * K), fam: 'Inter', weight: 700, color: 'rgba(255,255,255,0.75)', align: 'center', boil: 0 });
    }
    const a = Math.PI + f * Math.PI;
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 10 * K;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * (r - 30 * K), cy + Math.sin(a) * (r - 30 * K)); ctx.stroke();
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(cx, cy, 18 * K, 0, Math.PI * 2); ctx.fill();
    G.text(ctx, readout ?? `${Math.round(val)} km/h`, cx, cy + 110 * K, { size: Math.round(84 * K), fam: 'Inter', weight: 800, color: '#FFFFFF', align: 'center', boil: 0 });
    ctx.restore();
  }
  function reel(ctx, t, cx, cy, r) { // a vintage fishing reel, spinning
    ctx.save(); ctx.translate(cx, cy);
    ctx.fillStyle = '#6B4A24'; ctx.fillRect(-r * 0.25, r * 0.85, r * 0.5, r * 0.5); // foot
    ctx.fillStyle = '#8A6232'; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#C9A266'; ctx.beginPath(); ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#8A6232'; ctx.beginPath(); ctx.arc(0, 0, r * 0.62, 0, Math.PI * 2); ctx.fill();
    ctx.rotate(t * 9);
    ctx.strokeStyle = '#5A3C1A'; ctx.lineWidth = 14 * K; ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) { ctx.rotate(Math.PI / 2); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(r * 0.58, 0); ctx.stroke(); }
    ctx.fillStyle = '#5A3C1A'; ctx.beginPath(); ctx.arc(r * 0.58, 0, 26 * K, 0, Math.PI * 2); ctx.fill(); // handle knob
    ctx.restore();
    ctx.fillStyle = '#5A3C1A'; ctx.beginPath(); ctx.arc(cx, cy, 22 * K, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(60,40,15,0.8)'; ctx.lineWidth = 3 * K; // the line, pulled out to sea
    ctx.beginPath(); ctx.moveTo(cx + r * 0.7, cy - r * 0.7); ctx.quadraticCurveTo(cx + r * 1.4, cy - r * 1.6 + Math.sin(t * 20) * 6, W + 20, cy - r * 2.2); ctx.stroke();
  }
  function pill(ctx, text, x, y, size, a = 1, { bg = 'rgba(8,20,40,0.75)', color = '#FFFFFF', fam = 'Inter', weight = 700 } = {}) {
    const w = G.measure(ctx, text, size, fam, weight) + size * 0.9;
    ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(x - w / 2, y - size * 0.95, w, size * 1.4, size * 0.3); ctx.fill();
    G.text(ctx, text, x, y, { size, fam, weight, color, align: 'center', boil: 0 });
    ctx.restore();
  }
  function speedLines(ctx, t, y0, y1, a) {
    ctx.save(); ctx.strokeStyle = `rgba(220,245,255,${0.5 * a})`; ctx.lineCap = 'round';
    for (let i = 0; i < 26; i++) {
      const y = lerp(y0, y1, h(i, 41)); const len = (120 + h(i, 42) * 260) * K;
      const x = W + 300 * K - ((t * (1800 + h(i, 43) * 1200) * K + h(i, 44) * W * 2) % (W * 2));
      ctx.lineWidth = (2 + h(i, 45) * 4) * K; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len, y); ctx.stroke();
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- scenes
  function sceneHook(ctx, t) {
    const u = local(t, 'hook'); ocean(ctx, t);
    const glow = t < ev.hookFlash ? 0 : clamp((t - ev.hookFlash) / 0.1);
    const z = 1 + u * 0.03;
    ctx.save(); ctx.translate(W / 2, H * 0.6); ctx.scale(z, z); ctx.translate(-W / 2, -H * 0.6);
    sailfish(ctx, { x: W * 0.36, y: H * 0.6, s: 1.75 * K, sail: 0.55, glow, t, rot: -0.04 + Math.sin(t * 1.3) * 0.02 });
    ctx.restore();
    if (glow > 0) { // a ring of light pops off the fish
      const d = t - ev.hookFlash;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = `rgba(95,225,255,${0.6 * Math.exp(-d * 2.5)})`; ctx.lineWidth = 16 * K;
      ctx.beginPath(); ctx.arc(W * 0.5, H * 0.6, (200 + d * 900) * K, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    }
  }
  function sceneIntro(ctx, t) {
    const u = local(t, 'intro'); ocean(ctx, t);
    const p = ease.outCubic(clamp(u / 2.2));
    const x = lerp(-500 * K, W * 0.48, p), y = H * 0.6 + Math.sin(t * 1.5) * 12 * K;
    sailfish(ctx, { x, y, s: 1.05 * K, sail: 0.75, t, speed: 1.4 - p * 0.6 });
    const ta = clamp((u - 1.0) / 0.3);
    if (ta > 0) {
      pill(ctx, 'Pez vela', x - 40 * K, y + 160 * K, Math.round(46 * K), ta, { bg: '#5FE1FF', color: '#06223F', weight: 800 });
      G.text(ctx, 'Istiophorus platypterus', x - 40 * K, y + 225 * K, { size: Math.round(32 * K), fam: 'Inter', weight: 400, color: 'rgba(255,255,255,0.8)', align: 'center', alpha: ta, boil: 0 });
    }
  }
  function sceneSpeed(ctx, t) {
    const u = local(t, 'speed'); ocean(ctx, t, { rays: 0.5 });
    speedLines(ctx, t, H * 0.3, H * 0.55, 1);
    const fx = W * 0.45 + Math.sin(t * 9) * 6 * K;
    sailfish(ctx, { x: fx, y: H * 0.44, s: 0.85 * K, sail: 0.15, t, speed: 3 });
    const v = 110 * ease.outCubic(clamp(u / (T(5, 2) - SC.speed[0])));
    gauge(ctx, t, W / 2, H * 0.74, 300 * K, v);
  }
  function sceneLie(ctx, t) {
    if (t < ev.drop) {
      sepia(ctx, t);
      reel(ctx, t, W * 0.45, H * 0.6, 230 * K);
      const d = t - ev.lie;
      const sc = d < 0.12 ? lerp(1.9, 1, ease.outQuad(d / 0.12)) : 1 + 0.03 * Math.exp(-(d - 0.12) * 10);
      ctx.save(); ctx.translate(W / 2, H * 0.43); ctx.rotate(-0.13); ctx.scale(sc, sc);
      const sw = G.measure(ctx, '¡MENTIRA!', Math.round(120 * K), 'Inter', 800) + 70 * K;
      ctx.strokeStyle = '#D42A3A'; ctx.lineWidth = 14 * K; ctx.beginPath(); ctx.roundRect(-sw / 2, -105 * K, sw, 150 * K, 18 * K); ctx.stroke();
      G.text(ctx, '¡MENTIRA!', 0, 10 * K, { size: Math.round(120 * K), fam: 'Inter', weight: 800, color: '#D42A3A', align: 'center', boil: 0 });
      ctx.restore();
    } else {
      ocean(ctx, t, { rays: 0.6 });
      const d = t - ev.drop;
      const v = lerp(110, 38, ease.outBounce(clamp(d / 1.1)));
      gauge(ctx, t, W / 2, H * 0.68, 300 * K, v, { readout: '¿?' });
      sailfish(ctx, { x: W * 0.5, y: H * 0.43, s: 0.6 * K, sail: 0.5, t, speed: 0.8 });
    }
  }
  function sceneTeam(ctx, t) {
    const u = local(t, 'team'); ocean(ctx, t);
    const slots = [[0.62, 0.42, 0.62], [0.34, 0.5, 0.55], [0.7, 0.6, 0.7], [0.4, 0.68, 0.6]];
    slots.forEach(([sx, sy, s], i) => {
      const p = ease.outCubic(clamp((u - i * 0.55) / 2.0));
      const x = lerp(-600 * K, W * sx, p), y = H * sy + Math.sin(t * 1.4 + i) * 14 * K;
      sailfish(ctx, { x, y, s: s * K, sail: 0.6, t: t + i, speed: 1.6 - p * 0.6 });
    });
  }
  function ballPos(t) { // the bait ball rises toward the surface over the hunt
    const u = clamp((t - SC.ball[0]) / (SC.calm[0] - SC.ball[0]));
    return [W / 2, lerp(H * 0.64, H * 0.5, ease.inOutQuad(u))];
  }
  function sceneBall(ctx, t) {
    const u = local(t, 'ball'); ocean(ctx, t, { surface: 1 });
    const [bx, by] = ballPos(t);
    const orbit = (i) => { const a = t * 0.9 + i * (Math.PI * 2 / 3); return [bx + Math.cos(a) * 360 * K, by + Math.sin(a) * 260 * K, a]; };
    const fish = [0, 1, 2].map(orbit).sort((p, q) => p[1] - q[1]);
    const ins = ease.outCubic(clamp(u / 1.2));
    for (const [x, y, a] of fish.filter((f) => f[1] < by)) sailfish(ctx, { x: lerp(x < bx ? -400 * K : W + 400 * K, x, ins), y, s: 0.5 * K, flip: Math.sin(a) < 0, sail: 0.5, t, speed: 1.2 });
    baitBall(ctx, t, bx, by, 190 * K);
    for (const [x, y, a] of fish.filter((f) => f[1] >= by)) sailfish(ctx, { x: lerp(x < bx ? -400 * K : W + 400 * K, x, ins), y, s: 0.55 * K, flip: Math.sin(a) < 0, sail: 0.5, t, speed: 1.2 });
  }
  function sceneGlow(ctx, t) {
    const d = local(t, 'glow');
    ocean(ctx, t, { top: '#1B7BC4', mid: '#0E4A86', surface: 0.6 });
    // a burst of light behind the fish at the moment it lights up
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const rg = ctx.createRadialGradient(W / 2, H * 0.6, 0, W / 2, H * 0.6, 700 * K);
    rg.addColorStop(0, `rgba(95,225,255,${0.55 * Math.exp(-d * 1.5) + 0.12})`); rg.addColorStop(1, 'rgba(95,225,255,0)');
    ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H); ctx.restore();
    const sail = 0.3 + 0.7 * ease.outBack(clamp(d / 0.6), 2);
    const z = 1 + d * 0.025;
    sailfish(ctx, { x: W * 0.47, y: H * 0.62, s: 1.15 * K * z, sail, glow: 1, t, speed: 0.9, rot: -0.03 });
    if (d < 0.25) { ctx.fillStyle = `rgba(220,250,255,${0.7 * (1 - d / 0.25)})`; ctx.fillRect(0, 0, W, H); }
  }
  function sceneStrike(ctx, t) {
    ocean(ctx, t, { surface: 1 });
    const [bx, by] = ballPos(t);
    const A = { t: ev.strike1, from: -1 }, B = { t: ev.strike2, from: 1 };
    const pos = (st) => { // swoop in, slash, swim off
      const d = t - st.t;
      const x = st.from < 0 ? lerp(-500 * K, bx - 360 * K, ease.outCubic(clamp((d + 0.9) / 0.9))) + (d > 0 ? -d * 400 * K * clamp(d - 0.4) : 0)
        : lerp(W + 500 * K, bx + 360 * K, ease.outCubic(clamp((d + 0.9) / 0.9))) - (d > 0 ? -d * 400 * K * clamp(d - 0.4) : 0);
      const slash = d >= 0 && d < 0.5 ? Math.sin(d * 40) * 0.35 * (1 - d / 0.5) : 0;
      return { x, y: by + st.from * 30 * K, rot: slash * -st.from, flip: st.from > 0 };
    };
    const strikes = [{ t: ev.strike1, x: bx - 150 * K, y: by }, { t: ev.strike2, x: bx + 150 * K, y: by }];
    baitBall(ctx, t, bx, by, 190 * K, { strikes });
    for (const st of [A, B]) { const p = pos(st); sailfish(ctx, { x: p.x, y: p.y, s: 0.55 * K, rot: p.rot, flip: p.flip, sail: 1, glow: 1, t, speed: 2 }); }
    for (const st of strikes) { // sparkles at the slash
      const d = t - st.t; if (d < 0 || d > 0.6) continue;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 14; i++) { const a = h(i, 51) * Math.PI * 2, r = d * (300 + h(i, 52) * 400) * K; ctx.fillStyle = `rgba(200,250,255,${1 - d / 0.6})`; ctx.beginPath(); ctx.arc(st.x + Math.cos(a) * r, st.y + Math.sin(a) * r, 5 * K, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    }
  }
  function sceneCalm(ctx, t) {
    const u = local(t, 'calm'); ocean(ctx, t, { top: '#0F4E86', mid: '#082D55', bot: '#020B1A', rays: 0.6 });
    const p = clamp(u / (SC.calm[1] - SC.calm[0]));
    const glow = 1 - ease.inOutQuad(clamp((u - 0.6) / 3.2));
    sailfish(ctx, { x: lerp(W * 0.45, W * 0.72, p), y: lerp(H * 0.55, H * 0.66, p), s: lerp(1.0, 0.6, p) * K, sail: lerp(1, 0.25, ease.inOutQuad(clamp(u / 3))), glow, t, speed: 0.7, rot: 0.08 });
  }
  function sceneEnd(ctx, t) {
    const u = local(t, 'end'); ocean(ctx, t, { top: '#0E3F70', mid: '#071F3E', bot: '#020914', rays: 0.5 });
    const a = ease.outCubic(clamp(u / 0.8));
    const y = H * 0.5;
    ctx.save(); ctx.globalAlpha = a;
    G.text(ctx, 'REYES', CX, y - 60 * K + (1 - a) * 40 * K, { size: Math.round(150 * K), fam: 'Inter', weight: 800, color: '#FFFFFF', align: 'center', boil: 0 });
    G.text(ctx, 'DEL AZUL', CX, y + 90 * K + (1 - a) * 40 * K, { size: Math.round(120 * K), fam: 'Inter', weight: 800, color: ACCENT, align: 'center', boil: 0 });
    ctx.strokeStyle = 'rgba(95,225,255,0.6)'; ctx.lineWidth = 5 * K; ctx.beginPath();
    for (let x = CX - 330 * K; x <= CX + 330 * K; x += 8) ctx.lineTo(x, y + 150 * K + Math.sin(x * 0.03 + t * 3) * 10 * K);
    ctx.stroke();
    G.text(ctx, '@ReyesDelAzul', CX, y + 250 * K, { size: Math.round(52 * K), fam: 'Inter', weight: 700, color: '#FFFFFF', align: 'center', boil: 0 });
    ctx.restore();
    const fp = clamp((u - 0.4) / 4);
    sailfish(ctx, { x: lerp(-300 * K, W + 400 * K, fp), y: H * 0.33 + 40 * K, s: 0.32 * K, sail: 0.8, glow: 0.6, t, speed: 1.4, alpha: 0.85 });
  }

  // ---------------------------------------------------------------- captions (word by word)
  const FONT = 'Inter';
  function captions(ctx, t) {
    const line = S.subtitles.find((l) => t >= l.t && t < l.end);
    if (!line) return;
    const size = Math.round(66 * K);
    const ws = Subs.words(line);
    const maxW = Math.min(SAFE.w - 40 * K, 900 * K);
    const space = G.measure(ctx, ' ', size, FONT, 800);
    const rows = [[]]; let rw = 0;
    for (const w of ws) {
      const ww = G.measure(ctx, w.w, size, FONT, 800);
      if (rw > 0 && rw + space + ww > maxW) { rows.push([]); rw = 0; }
      rows[rows.length - 1].push({ ...w, ww }); rw += (rw > 0 ? space : 0) + ww;
    }
    const lh = size * 1.22;
    const y0 = SAFE.y + 110 * K;
    const fade = Math.min(clamp((t - line.t) / 0.15), clamp((line.end - t) / 0.15));
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.shadowColor = 'rgba(0,10,30,0.75)'; ctx.shadowBlur = 18 * K; ctx.shadowOffsetY = 3 * K;
    rows.forEach((row, ri) => {
      const total = row.reduce((a, w) => a + w.ww, 0) + space * (row.length - 1);
      let x = CX - total / 2;
      const y = y0 + ri * lh;
      for (const w of row) {
        const said = t >= w.t, cur = said && t < w.end;
        const key = S.KEY.includes(w.w);
        const pop = cur ? 1 + 0.08 * Math.exp(-(t - w.t) * 10) : 1;
        ctx.save(); ctx.translate(x + w.ww / 2, y); ctx.scale(pop, pop);
        G.text(ctx, w.w, 0, 0, { size, fam: FONT, weight: 800, color: said ? (key ? ACCENT : '#FFFFFF') : 'rgba(255,255,255,0.38)', align: 'center', boil: 0 });
        ctx.restore();
        x += w.ww + space;
      }
    });
    ctx.restore();
  }
  function badge(ctx, t) {
    if (t >= SC.end[0]) return;
    const a = clamp((t - 0.3) / 0.4);
    pill(ctx, 'SECRETOS DEL AZUL · #1', CX, SAFE.y + 10 * K, Math.round(28 * K), a * 0.9, { bg: 'rgba(95,225,255,0.18)', color: '#BFF3FF', weight: 800 });
  }

  const SCENES = [['hook', sceneHook], ['intro', sceneIntro], ['speed', sceneSpeed], ['lie', sceneLie], ['team', sceneTeam], ['ball', sceneBall], ['glow', sceneGlow], ['strike', sceneStrike], ['calm', sceneCalm], ['end', sceneEnd]];

  Studio.film({
    draw(ctx, t) {
      const s = SCENES.find(([k]) => inSc(t, k)) || SCENES[SCENES.length - 1];
      const shake = t >= ev.lie && t < ev.lie + 0.5 ? 16 * K * Math.exp(-(t - ev.lie) * 8) : 0;
      ctx.save(); ctx.translate(U.noise1(t * 30, 1) * shake, U.noise1(t * 30, 2) * shake);
      s[1](ctx, t);
      ctx.restore();
      if (t >= ev.hookFlash && t < ev.hookFlash + 0.3) { ctx.fillStyle = `rgba(220,250,255,${0.6 * (1 - (t - ev.hookFlash) / 0.3)})`; ctx.fillRect(0, 0, W, H); }
      if (t >= ev.lie && t < ev.lie + 0.15) { ctx.fillStyle = `rgba(255,255,255,${0.6 * (1 - (t - ev.lie) / 0.15)})`; ctx.fillRect(0, 0, W, H); }
      badge(ctx, t);
      captions(ctx, t);
    },
    post: { paper: 0, vignette: 0.3, grain: 0.02 },
    fadeOut: 1.2,
  });
})();
