// Synthesized ship sounds via WebAudio — foghorn on unroll, waves while sailing, bell on arrive.
const JAudio = (() => {
  let ctx = null;
  const ac = () => (ctx = ctx || new (window.AudioContext || window.webkitAudioContext)());
  const envGain = (c, t0, peak, atk, dec) => { const g = c.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + atk); g.gain.exponentialRampToValueAtTime(0.0001, t0 + atk + dec); return g; };
  return {
    foghorn() {
      try { const c = ac(); const t = c.currentTime;
        const notes = [392, 329.6, 261.6];
        notes.forEach((f, i) => {
          const t0 = t + i * 0.28;
          [1, 2, 3].forEach((h, k) => {
            const o = c.createOscillator(); o.type = k === 0 ? 'sawtooth' : 'square';
            o.frequency.setValueAtTime(f * h, t0);
            const g = envGain(c, t0, 0.18 / (h * 1.5), 0.04, 0.42); o.connect(g).connect(c.destination); o.start(t0); o.stop(t0 + 0.5);
          });
        });
        const sub = c.createOscillator(); sub.type = 'sawtooth'; sub.frequency.setValueAtTime(55, t); sub.frequency.linearRampToValueAtTime(44, t + 1.4);
        const sg = envGain(c, t, 0.3, 0.12, 1.3); sub.connect(sg).connect(c.destination); sub.start(t); sub.stop(t + 1.5);
      } catch (e) {}
    },
    seagull() {
      try { const c = ac(); const t = c.currentTime;
        [0, 0.35].forEach(off => {
          const o = c.createOscillator(); o.type = 'triangle';
          const t0 = t + off;
          o.frequency.setValueAtTime(1800, t0);
          o.frequency.exponentialRampToValueAtTime(900, t0 + 0.14);
          o.frequency.exponentialRampToValueAtTime(1400, t0 + 0.22);
          const g = c.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.14, t0 + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.28);
          o.connect(g).connect(c.destination); o.start(t0); o.stop(t0 + 0.3);
        });
      } catch (e) {}
    },
    creak() {
      try { const c = ac(); const t = c.currentTime; const dur = 0.55;
        const bufSize = Math.floor(c.sampleRate * dur); const buf = c.createBuffer(1, bufSize, c.sampleRate); const d = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * 0.6;
        const src = c.createBufferSource(); src.buffer = buf;
        const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 10;
        bp.frequency.setValueAtTime(220, t); bp.frequency.exponentialRampToValueAtTime(480, t + dur);
        const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.08, t + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        src.connect(bp).connect(g).connect(c.destination); src.start(t); src.stop(t + dur + 0.05);
      } catch (e) {}
    },
    waves(duration) {
      try { const self = this; const c = ac(); const t = c.currentTime; const dur = Math.max(0.5, duration);
        const bufSize = Math.floor(c.sampleRate * dur); const buf = c.createBuffer(1, bufSize, c.sampleRate); const d = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) {
          const sec = i / c.sampleRate;
          const swell = 0.5 + 0.5 * Math.sin(sec * 2 * Math.PI * 0.5);
          const crash = Math.max(0, Math.sin(sec * 2 * Math.PI * 0.9)) ** 3;
          d[i] = (Math.random() * 2 - 1) * (0.4 * swell + 0.9 * crash);
        }
        const src = c.createBufferSource(); src.buffer = buf;
        const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700;
        const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.25); g.gain.setValueAtTime(0.18, t + dur - 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        src.connect(lp).connect(g).connect(c.destination); src.start(t); src.stop(t + dur + 0.05);
        for (let k = 1; k < dur; k += 1.4 + Math.random() * 0.6) { setTimeout(() => self.seagull(), k * 1000); }
        setTimeout(() => self.creak(), dur * 400);
      } catch (e) {}
    },
    bell() {
      try { const c = ac(); const t = c.currentTime;
        [880, 1320, 1760].forEach((f, i) => { const o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(f, t); const g = envGain(c, t, 0.18 / (i + 1), 0.005, 1.6); o.connect(g).connect(c.destination); o.start(t); o.stop(t + 1.7); });
      } catch (e) {}
    },
    splash() {
      try { const c = ac(); const t = c.currentTime; const dur = 1.1;
        const bufSize = Math.floor(c.sampleRate * dur); const buf = c.createBuffer(1, bufSize, c.sampleRate); const d = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) { d[i] = (Math.random() * 2 - 1); }
        const src = c.createBufferSource(); src.buffer = buf;
        const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.setValueAtTime(1800, t); bp.frequency.exponentialRampToValueAtTime(300, t + dur); bp.Q.value = 0.9;
        const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.45, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        src.connect(bp).connect(g).connect(c.destination); src.start(t); src.stop(t + dur + 0.05);
        const o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(55, t + 0.3);
        const og = c.createGain(); og.gain.setValueAtTime(0.0001, t); og.gain.exponentialRampToValueAtTime(0.3, t + 0.01); og.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        o.connect(og).connect(c.destination); o.start(t); o.stop(t + 0.4);
      } catch (e) {}
    },
    pop() {
      try { const c = ac(); const t = c.currentTime;
        const o = c.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(880, t + 0.08);
        const g = envGain(c, t, 0.3, 0.005, 0.12); o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.15);
      } catch (e) {}
    }
  };
})();

// Shared journey mechanics: scroll-driven route, reveals, compass cursor.
export function attachRoute(c, refs) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let len = 0, rootTop = 0, raf = 0, rt = 0;
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { const el = en.target; el.style.opacity = '1'; el.style.transform = el.dataset.rot || ''; io.unobserve(el); } }), { threshold: .15 });
  const setupReveals = () => {
    const root = refs.root.current; if (!root) return;
    root.querySelectorAll('[data-reveal]:not([data-rv])').forEach(el => {
      el.dataset.rv = '1'; if (reduced) return;
      const base = el.style.transform || ''; el.dataset.rot = base;
      el.style.transition = 'opacity .6s ease, transform .6s cubic-bezier(.2,.8,.2,1)'; el.style.opacity = '0'; el.style.transform = base + ' translateY(28px)';
      io.observe(el);
    });
  };
  const build = () => {
    const root = refs.root.current, svg = refs.svg.current; if (!root || !svg) return;
    const rb = root.getBoundingClientRect(); const W = root.offsetWidth, H = root.offsetHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const stops = [...root.querySelectorAll('[data-stop]')].map(el => { const b = el.getBoundingClientRect(); return { x: b.left + b.width / 2 - rb.left, y: b.top + b.height / 2 - rb.top }; }).sort((a, b) => a.y - b.y);
    if (stops.length < 2) return;
    const cl = x => Math.max(40, Math.min(W - 40, x)), sw = Math.min(W * .2, 200);
    let d = `M ${stops[0].x} ${stops[0].y}`;
    for (let i = 1; i < stops.length; i++) {
      const a = stops[i - 1], b = stops[i], dy = (b.y - a.y) * .5, sa = a.x < W / 2 ? 1 : -1, sb = b.x < W / 2 ? 1 : -1;
      d += ` C ${cl(a.x + sa * sw)} ${a.y + dy}, ${cl(b.x + sb * sw)} ${b.y - dy}, ${b.x} ${b.y}`;
    }
    refs.base.current.setAttribute('d', d); const done = refs.done.current; done.setAttribute('d', d);
    len = done.getTotalLength(); done.style.strokeDasharray = `${len} ${len}`; rootTop = rb.top + scrollY;
  };
  const update = () => {
    if (!len) return; const done = refs.done.current, bar = refs.bar.current, mk = refs.marker.current, root = refs.root.current;
    const prog = Math.max(0, Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)));
    if (bar) bar.style.width = (prog * 100).toFixed(2) + '%';
    const k = 0.45 + prog * 0.5; const targetY = scrollY + innerHeight * k - rootTop; let lo = 0, hi = len, L = 0;
    for (let i = 0; i < 22; i++) { const mid = (lo + hi) / 2; if (done.getPointAtLength(mid).y < targetY) lo = mid; else hi = mid; L = mid; }
    const p0 = done.getPointAtLength(0), pN = done.getPointAtLength(len);
    if (targetY <= p0.y) L = 0; if (targetY >= pN.y) L = len;
    L = Math.max(L, prog * len); if (prog > 0.985) L = len;
    done.style.strokeDashoffset = len - L; const pt = done.getPointAtLength(L);
    const mx = Math.max(70, Math.min(root.offsetWidth - 70, pt.x));
    mk.style.transform = `translate(${mx}px, ${pt.y}px)`; mk.style.opacity = L > 60 ? '1' : '0';
  };
  const onScroll = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; update(); }); };
  const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { build(); update(); }, 120); };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onResize);
  const ro = new ResizeObserver(onResize); refs.root.current && ro.observe(refs.root.current);
  setupReveals(); setTimeout(() => { build(); update(); }, 50);
  return { setupReveals, rebuild: onResize, destroy() { removeEventListener('scroll', onScroll); removeEventListener('resize', onResize); io.disconnect(); ro.disconnect(); } };
}

// Travel transitions: links with data-travel="<place>" unroll a full-screen treasure map, walk the marker along the dotted trail from here to there, then navigate.
const PLACES = [
  { id: 'map', label: 'HOME MAP', x: 60, y: 185 },
  { id: 'notch', label: 'NOTCHISLAND', x: 165, y: 70 },
  { id: 'apiforge', label: 'APIFORGE', x: 255, y: 205 },
  { id: 'veloce', label: 'VELOCE UI', x: 365, y: 85 },
  { id: 'build', label: "LET'S BUILD", x: 445, y: 225 }
];
export function attachTravel({ here, onUnroll, beforeGo }) {
  if (window.__jTravel) { window.__jTravel.destroy(); }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const F = "'Space Mono',monospace", A = "'Archivo Black',sans-serif", INK = '#3B2A1A', RED = '#9B2222';
  const find = id => PLACES.find(p => p.id === id) || PLACES[0];
  const curve = pts => { if (pts.length < 2) return ''; let d = `M ${pts[0].x} ${pts[0].y}`; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2; const bend = (i % 2 ? -1 : 1) * 28; d += ` C ${p1.x + (p2.x - p0.x) / 5} ${p1.y + (p2.y - p0.y) / 5 + bend}, ${p2.x - (p3.x - p1.x) / 5} ${p2.y - (p3.y - p1.y) / 5 - bend}, ${p2.x} ${p2.y}`; } return d; };
  const TRAIL = curve(PLACES);
  const arcAt = (path, idx) => { const len = path.getTotalLength(); let best = 0, bd = 1e9; for (let L = 0; L <= len; L += 2) { const q = path.getPointAtLength(L), p = PLACES[idx], d = (q.x - p.x) ** 2 + (q.y - p.y) ** 2; if (d < bd) { bd = d; best = L; } } return best; };
  const X = (p, color, w) => `<path d="M ${p.x - 9} ${p.y - 9} L ${p.x + 9} ${p.y + 9} M ${p.x + 9} ${p.y - 9} L ${p.x - 9} ${p.y + 9}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" fill="none"></path>`;
  const overlay = (from, to, arrived) => {
    const o = document.createElement('div'); o.setAttribute('data-jmap', '');
    o.setAttribute('aria-live', 'polite');
    o.style.cssText = 'position:fixed;inset:0;z-index:200;background:#F7E9C6;display:grid;place-items:center;opacity:1;overflow:hidden';
    const trail = curve(PLACES);
    o.innerHTML = `<div data-sheet style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,#F7E9C6 0%,#EBD49F 55%,#C8A65E 100%);box-shadow:inset 0 0 90px 36px rgba(70,35,8,.6);clip-path:inset(100% 0 0 0);transition:clip-path .9s cubic-bezier(.3,.9,.3,1)">
      <div data-roll style="position:absolute;left:-2%;right:-2%;height:34px;top:100%;transform:translateY(-50%);background:linear-gradient(#6B4523,#C8A65E 30%,#F7E9C6 50%,#C8A65E 70%,#6B4523);border:3px solid #3B2A1A;border-radius:17px;box-shadow:0 10px 24px rgba(0,0,0,.5);transition:top .9s cubic-bezier(.3,.9,.3,1)"></div>
      <svg viewBox="0 0 500 300" preserveAspectRatio="xMidYMid meet" style="position:absolute;inset:0;width:100%;height:100%">
        <rect x="14" y="14" width="472" height="272" fill="none" stroke="${INK}" stroke-width="1.5" opacity=".7"></rect>
        <rect x="19" y="19" width="462" height="262" fill="none" stroke="${INK}" stroke-width=".8" stroke-dasharray="3 4" opacity=".6"></rect>
        <text x="250" y="42" text-anchor="middle" style="font:400 15px ${A};fill:${INK};letter-spacing:.14em">THE JOURNEY MAP</text>
        <g transform="translate(450 60)" stroke="${INK}" fill="none" stroke-width="1.5"><circle r="16"></circle><circle r="3" fill="${INK}"></circle><path d="M0 -16 L0 16 M-16 0 L16 0" opacity=".7"></path><path d="M0 -22 L4 -12 L-4 -12 Z" fill="${RED}" stroke="none"></path><text y="-27" text-anchor="middle" style="font:700 8px ${F};fill:${INK}" stroke="none">N</text></g>
        <path d="${trail}" fill="none" stroke="${INK}" stroke-width="2.5" stroke-dasharray="1 7" stroke-linecap="round" opacity=".55"></path>
        <defs><mask id="jm"><path data-route d="${TRAIL}" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="butt" style="stroke-dasharray:0 99999"></path></mask></defs>
        <path d="${TRAIL}" fill="none" stroke="${INK}" stroke-width="3.5" stroke-dasharray="1 7" stroke-linecap="round" mask="url(#jm)"></path>
        ${PLACES.map(p => `<g>${p.id === from.id ? `<circle cx="${p.x}" cy="${p.y}" r="14" fill="#FFE566" stroke="${INK}" stroke-width="2"></circle>` : ''}${X(p, p.id === to.id ? RED : INK, p.id === to.id ? 6 : 4)}<text x="${p.x}" y="${p.y - 20}" text-anchor="middle" stroke="#EBD49F" stroke-width="5" paint-order="stroke" style="font:700 10px ${F};fill:${INK};letter-spacing:.06em">${p.label}</text></g>`).join('')}
        <g data-marker transform="translate(${from.x} ${from.y})"><g data-ship><path d="M-14 4 L14 4 L9 12 L-9 12 Z" fill="#111"></path><path d="M0 4 L0 -16" stroke="#111" stroke-width="2"></path><path d="M1 -15 L13 -2 L1 -2 Z" fill="#FFF6E8" stroke="#111" stroke-width="1.5"></path><path d="M-1 -13 L-10 -3 L-1 -3 Z" fill="${RED}" stroke="#111" stroke-width="1.5"></path></g></g>
      </svg>
      <div data-caption style="position:absolute;left:50%;bottom:clamp(16px,4vh,40px);transform:translateX(-50%) rotate(-2deg);background:#111;color:#FFF6E8;border:3px solid #FFF6E8;box-shadow:5px 5px 0 ${RED};padding:10px 16px;font:400 clamp(14px,2.2vw,22px) ${A};white-space:nowrap">${arrived ? 'X MARKS THE SPOT — ' + to.label : from.label + ' → ' + to.label}</div>
    </div>`;
    document.body.appendChild(o);
    requestAnimationFrame(() => { const sh = o.querySelector('[data-sheet]'); sh.style.clipPath = 'inset(0 0 0 0)'; sh.querySelector('[data-roll]').style.top = '-40px'; });
    return o;
  };
  const go = (href, toId) => {
    const from = find(here), to = find(toId);
    if (reduced || from.id === to.id) { location.href = href; return; }
    if (document.querySelector('[data-jmap]') || window.__jGoing) return; window.__jGoing = true;
    (beforeGo ? beforeGo(toId) : Promise.resolve()).then(() => {
    onUnroll && onUnroll();
    const o = overlay(from, to, false), path = o.querySelector('[data-route]'), mk = o.querySelector('[data-marker]');
    JAudio.foghorn();
    const total = path.getTotalLength(), a = arcAt(path, PLACES.indexOf(from)), b = arcAt(path, PLACES.indexOf(to)), lo = Math.min(a, b), hi = Math.max(a, b), len = hi - lo, fwd = b >= a;
    const setReveal = k => { const seg = len * k; path.style.strokeDasharray = fwd ? `0 ${lo} ${seg} ${total}` : `0 ${hi - seg} ${seg} ${total}`; };
    setReveal(0);
    const dur = Math.min(2200, 900 + len * 4), ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; let t0 = 0;
    JAudio.waves(dur / 1000 + 0.4);
    const step = now => {
      if (!t0) t0 = now; const t = Math.min(1, (now - t0) / dur), k = ease(t), L = fwd ? lo + len * k : hi - len * k, pt = path.getPointAtLength(L);
      setReveal(k); const ahead = path.getPointAtLength(Math.max(0, Math.min(total, L + (fwd ? 2 : -2)))); const flip = ahead.x < pt.x ? -1 : 1; const bob = Math.sin(now / 120) * 1.5;
      mk.setAttribute('transform', `translate(${pt.x} ${pt.y + bob})`); mk.querySelector('[data-ship]').setAttribute('transform', `scale(${flip} 1) rotate(${Math.atan2(ahead.y - pt.y, Math.abs(ahead.x - pt.x)) * 180 / Math.PI * .35})`);
      if (t < 1) requestAnimationFrame(step); else { sessionStorage.setItem('journey-arrive', JSON.stringify({ from: from.id, to: to.id })); sessionStorage.setItem('journey-skip-intro', '1'); setTimeout(() => { if (href.startsWith('#')) { window.__jGoing = false; sessionStorage.removeItem('journey-arrive'); o.style.opacity = '0'; setTimeout(() => o.remove(), 300); const t = document.querySelector(href); t && window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 20, behavior: 'smooth' }); } else location.href = href; }, 120); }
    };
    setTimeout(() => requestAnimationFrame(step), 900);
    });
  };
  const onClick = e => {
    const a = e.target.closest && e.target.closest('a[data-travel]'); if (!a || e.metaKey || e.ctrlKey || e.button) return;
    e.preventDefault(); go(a.getAttribute('href'), a.getAttribute('data-travel'));
  };
  addEventListener('click', onClick);
  try {
    const raw = sessionStorage.getItem('journey-arrive');
    if (!raw) { document.body.classList.add('jready'); }
    if (raw) { sessionStorage.removeItem('journey-arrive'); const { from, to } = JSON.parse(raw);
      if (to === here && !reduced) { const o = overlay(find(from), find(to), true); JAudio.bell(); const mk = o.querySelector('[data-marker]'), tgt = find(to), p = o.querySelector('[data-route]'); const a = arcAt(p, PLACES.indexOf(find(from))), b = arcAt(p, PLACES.indexOf(tgt)); p.style.strokeDasharray = `0 ${Math.min(a, b)} ${Math.abs(b - a)} ${p.getTotalLength()}`; mk.setAttribute('transform', `translate(${tgt.x} ${tgt.y})`); o.style.background = 'transparent'; requestAnimationFrame(() => document.body.classList.add('jready'));
        setTimeout(() => { o.style.transition = 'opacity .5s ease'; o.style.opacity = '0'; setTimeout(() => o.remove(), 520); }, 450); } else if (to === here) { document.body.classList.add('jready'); } }
  } catch (err) { document.body.classList.add('jready'); }
  return (window.__jTravel = { go, destroy() { removeEventListener('click', onClick); window.__jTravel = null; } });
}

// Message in a bottle: a[data-bottle] links write a letter, roll it, pop the cork, slide the scroll in, cork it, drop it into the sea with a splash, then fire the mailto.
export function attachBottle({ onSplash } = {}) {
  if (window.__jBottle) { window.__jBottle.destroy(); }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const F = "'Space Mono',monospace", A = "'Archivo Black',sans-serif";
  const run = (href, note) => {
    if (document.querySelector('[data-jbottle]')) return;
    const o = document.createElement('div'); o.setAttribute('data-jbottle', '');
    o.style.cssText = 'position:fixed;inset:0;z-index:300;background:rgba(17,17,17,.84);display:grid;place-items:center;opacity:0;transition:opacity .3s;overflow:hidden;perspective:900px'; o.querySelectorAll && 0;
    o.innerHTML = `<div data-sea style="position:absolute;left:-10%;right:-10%;bottom:-12vh;height:34vh;background:linear-gradient(#3F7FC7,#1F4F8F);border-top:5px solid #111;transform:translateY(110%);transition:transform .9s cubic-bezier(.2,.8,.2,1)">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style="position:absolute;left:0;right:0;top:-32px;width:100%;height:36px"><path data-wave d="M0 40 Q 50 10 100 40 T 200 40 T 300 40 T 400 40 T 500 40 T 600 40 T 700 40 T 800 40 T 900 40 T 1000 40 T 1100 40 T 1200 40 L1200 60 L0 60 Z" fill="#3F7FC7" stroke="#111" stroke-width="5"></path></svg>
      </div>
      <div data-stage style="position:relative;width:min(88vw,520px);height:min(72vh,560px);display:grid;place-items:center;transform-style:preserve-3d;overflow:visible">
      <div data-letter style="position:absolute;width:min(78vw,380px);background:#FFF6E8;border:4px solid #111;box-shadow:10px 10px 0 #FF8A7A;padding:26px 28px;transform:translateY(40px) rotate(-2deg);opacity:0;transition:opacity .4s,transform .5s cubic-bezier(.2,.8,.2,1);transform-origin:50% 100%;overflow:hidden">
        <div style="font:700 11px ${F};letter-spacing:.12em;margin-bottom:14px;display:flex;justify-content:space-between"><span>TO: YASH</span><span>FROM: YOU</span></div>
        <div data-text style="font:500 17px/1.55 'Space Grotesk',sans-serif;min-height:120px;white-space:pre-wrap"></div>
        <div style="margin-top:18px;font:400 18px ${A};transform:rotate(-3deg);display:inline-block;background:#FFE566;border:3px solid #111;padding:2px 10px">${note}</div>
      </div>
      <div data-tube style="position:absolute;width:min(78vw,380px);height:44px;opacity:0;visibility:hidden;transform:translateY(0) rotate(-2deg);transition:opacity .2s,transform .7s cubic-bezier(.2,.8,.2,1)">
        <div style="position:absolute;inset:0;border-radius:22px;background:linear-gradient(#FFF6E8,#E8DCC3 55%,#C9B994);border:4px solid #111;box-shadow:4px 6px 0 rgba(0,0,0,.35)"></div>
        <div style="position:absolute;left:12px;right:12px;top:14px;height:3px;background:#111;opacity:.4;border-radius:2px"></div>
        <div style="position:absolute;right:-6px;top:6px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#FFF6E8 0 25%,#C9B994 26% 45%,#FFF6E8 46% 65%,#C9B994 66%);border:4px solid #111"></div>
        <div style="position:absolute;left:38%;top:-8px;width:22%;height:60px;background:#FF8A7A;border:3px solid #111;border-radius:6px;opacity:.95"></div>
      </div>
      <svg data-bottle viewBox="0 0 200 420" style="position:absolute;width:min(44vw,170px);height:auto;opacity:0;transform:translateY(80px);transition:opacity .4s,transform .6s cubic-bezier(.2,.8,.2,1);overflow:visible">
        <defs>
          <linearGradient id="bglass" x1="0" x2="1"><stop offset="0" stop-color="#6FB5E8" stop-opacity=".85"></stop><stop offset=".22" stop-color="#E6F4FF" stop-opacity=".55"></stop><stop offset=".45" stop-color="#8CC6F0" stop-opacity=".35"></stop><stop offset=".75" stop-color="#4E95CF" stop-opacity=".55"></stop><stop offset="1" stop-color="#2F6EA8" stop-opacity=".9"></stop></linearGradient>
          <linearGradient id="bcork" x1="0" x2="1"><stop offset="0" stop-color="#8A5A2B"></stop><stop offset=".4" stop-color="#C9915A"></stop><stop offset="1" stop-color="#7A4C22"></stop></linearGradient>
          <clipPath id="binside"><path d="M72 60 L72 110 Q 28 140 28 200 L 28 370 Q 28 400 60 400 L 140 400 Q 172 400 172 370 L 172 200 Q 172 140 128 110 L 128 60 Z"></path></clipPath>
        </defs>
        <ellipse cx="100" cy="404" rx="70" ry="10" fill="#000" opacity=".35"></ellipse>
        <path d="M72 60 L72 110 Q 28 140 28 200 L 28 370 Q 28 400 60 400 L 140 400 Q 172 400 172 370 L 172 200 Q 172 140 128 110 L 128 60 Z" fill="#2F6EA8" opacity=".35"></path>
        <g data-scroll clip-path="url(#binside)" style="transform:translateY(-360px);transition:transform .9s cubic-bezier(.3,.7,.2,1.1)">
          <g transform="translate(100 285) rotate(-12)"><rect x="-26" y="-70" width="52" height="140" rx="10" fill="#FFF6E8" stroke="#111" stroke-width="3"></rect><rect x="-26" y="-70" width="52" height="140" rx="10" fill="url(#bcork)" opacity=".12"></rect><path d="M-14 -40 L14 -40 M-14 -20 L14 -20 M-14 0 L8 0 M-14 20 L14 20 M-14 40 L10 40" stroke="#111" stroke-width="3" stroke-linecap="round" opacity=".55"></path><rect x="-30" y="-10" width="60" height="22" fill="#FF8A7A" stroke="#111" stroke-width="3" rx="3"></rect></g>
        </g>
        <path d="M72 60 L72 110 Q 28 140 28 200 L 28 370 Q 28 400 60 400 L 140 400 Q 172 400 172 370 L 172 200 Q 172 140 128 110 L 128 60 Z" fill="url(#bglass)" stroke="#111" stroke-width="5" stroke-linejoin="round"></path>
        <path d="M48 190 Q 44 280 48 360" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" opacity=".75"></path>
        <path d="M62 150 Q 56 165 54 180" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity=".6"></path>
        <path d="M150 220 Q 156 300 150 370" stroke="#0E3A66" stroke-width="5" stroke-linecap="round" opacity=".35"></path>
        <path d="M66 60 L134 60 L134 72 L66 72 Z" fill="#2F6EA8" stroke="#111" stroke-width="5" stroke-linejoin="round"></path>
        <g data-cork style="transform-origin:100px 40px;transition:transform .55s cubic-bezier(.3,.8,.3,1)"><rect x="70" y="14" width="60" height="52" rx="8" fill="url(#bcork)" stroke="#111" stroke-width="5"></rect><path d="M82 22 L82 58 M100 20 L100 60 M118 22 L118 58" stroke="#5E3A17" stroke-width="2.5" opacity=".6"></path><ellipse cx="100" cy="14" rx="30" ry="7" fill="#C9915A" stroke="#111" stroke-width="4"></ellipse></g>
      </svg>
      <div data-splash style="position:absolute;left:50%;bottom:16vh;width:0;height:0;opacity:0;z-index:3"></div>
      <div data-caption style="position:absolute;bottom:0;left:50%;transform:translateX(-50%) rotate(-2deg);background:#111;color:#FFF6E8;border:3px solid #FFF6E8;box-shadow:5px 5px 0 #FF8A7A;padding:10px 16px;font:400 clamp(14px,2.2vw,22px) ${A};white-space:nowrap;z-index:2">WRITING…</div>
    </div>`;
    document.body.appendChild(o); requestAnimationFrame(() => o.style.opacity = '1');
    const q = s => o.querySelector(s), letter = q('[data-letter]'), text = q('[data-text]'), tube = q('[data-tube]'), bottle = q('[data-bottle]'), scroll = q('[data-scroll]'), cork = q('[data-cork]'), cap = q('[data-caption]'), sea = q('[data-sea]'), splash = q('[data-splash]');
    const msg = "Hi Yash,\n\nI have an idea. Let's build it.\n\n— sent from the far edge of your map";
    const finish = () => { setTimeout(() => { location.href = href; }, 150); setTimeout(() => { o.style.opacity = '0'; setTimeout(() => o.remove(), 350); }, 1100); };
    if (reduced) { letter.style.opacity = '1'; letter.style.transform = 'none'; text.textContent = msg; finish(); return; }
    const wait = (ms, fn) => setTimeout(fn, ms);
    // 1 write
    wait(60, () => { letter.style.opacity = '1'; letter.style.transform = 'translateY(0) rotate(-2deg)'; });
    let i = 0; const type = () => { text.textContent = msg.slice(0, ++i); if (i < msg.length) setTimeout(type, msg[i - 1] === '\n' ? 90 : 20); else roll(); };
    wait(450, type);
    // 2 roll: letter curls from the bottom (rotateX), then swaps for a tube
    const roll = () => {
      cap.textContent = 'ROLLING…';
      letter.style.transition = 'transform .8s cubic-bezier(.6,0,.3,1), opacity .2s .65s, border-radius .8s';
      letter.style.transform = 'translateY(0) rotate(-2deg) rotateX(82deg) scaleY(.12)'; letter.style.borderRadius = '60px 60px 20px 20px';
      wait(820, () => { letter.style.visibility = 'hidden'; letter.style.opacity = '0'; tube.style.visibility = 'visible'; tube.style.opacity = '1'; });
      wait(1150, bottleIn);
    };
    // 3 bottle rises with cork on; cork pops; tube shrinks + slides into the neck; cork returns
    const bottleIn = () => {
      cap.textContent = 'UNCORKING…';
      scroll.style.display = 'none';
      bottle.style.opacity = '1'; bottle.style.transform = 'translateY(0)';
      tube.style.transform = 'translateY(-150px) rotate(-2deg)';
      wait(650, () => { cork.style.transform = 'translateY(-70px) rotate(-28deg)'; JAudio.pop(); onSplash && onSplash('cork'); });
      wait(1150, () => { cap.textContent = 'BOTTLING…'; tube.style.transition = 'transform .7s cubic-bezier(.6,0,.4,1), opacity .2s .5s'; tube.style.transform = 'translateY(80px) rotate(90deg) scale(.26)'; });
      wait(1750, () => { tube.style.opacity = '0'; });
      wait(2500, () => { cork.style.transform = 'translateY(0) rotate(0deg)'; });
      wait(2900, () => { bottle.style.transition = 'transform .1s'; bottle.style.transform = 'translateY(0) scale(1.04,.96)'; JAudio.pop(); onSplash && onSplash('cork'); });
      wait(3020, () => { bottle.style.transform = 'translateY(0) scale(1)'; });
      wait(3300, drop);
    };
    // 4 sea rises, bottle drops, splash, bobs away
    const drop = () => {
      cap.textContent = 'INTO THE SEA…';
      sea.style.transform = 'translateY(0)';
      let fall = 0;
      wait(600, () => {
        const br = bottle.getBoundingClientRect(), sr = sea.getBoundingClientRect(), stage = q('[data-stage]').getBoundingClientRect();
        // sea has finished rising; sink until the bottle's bottom third is below the water line
        fall = Math.max(60, sr.top - br.bottom + br.height * .55);
        splash.style.bottom = 'auto'; splash.style.top = (sr.top - stage.top) + 'px';
        bottle.style.transition = 'transform .85s cubic-bezier(.6,0,1,.6)'; bottle.style.transform = `translateY(${fall}px) rotate(18deg)`;
        const onEnd = ev => { if (ev.propertyName !== 'transform') return; bottle.removeEventListener('transitionend', onEnd); splashNow(); };
        bottle.addEventListener('transitionend', onEnd); wait(1000, () => { if (!splashed) { bottle.removeEventListener('transitionend', onEnd); splashNow(); } });
      });
      let splashed = false;
      const splashNow = () => { if (splashed) return; splashed = true;
        JAudio.splash();
        onSplash && onSplash('whoosh');
        splash.style.opacity = '1';
        const drops = Array.from({ length: 26 }, (_, k) => { const a = -168 + k * 6.4 + (Math.random() - .5) * 8, r = 120 + Math.random() * 220, sz = 10 + Math.random() * 22, col = ['#A9D8FF', '#FFF6E8', '#6FB5E8', '#E6F4FF'][k % 4], d = (Math.random() * .12).toFixed(2); return `<span style="position:absolute;left:0;top:0;width:${sz}px;height:${sz * (1.1 + Math.random() * .5)}px;border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;background:${col};border:3px solid #111;transform:translate(-50%,-50%);animation:jsplash ${(.85 + Math.random() * .35).toFixed(2)}s cubic-bezier(.15,.75,.35,1) ${d}s both;--dx:${(Math.cos(a * Math.PI / 180) * r).toFixed(0)}px;--dy:${(Math.sin(a * Math.PI / 180) * r).toFixed(0)}px"></span>`; }).join('');
        const spout = `<div style="position:absolute;left:0;top:0;width:54px;height:170px;transform:translate(-50%,-100%) scaleY(.1);transform-origin:50% 100%;background:linear-gradient(#E6F4FF,#6FB5E8);border:4px solid #111;border-radius:40% 40% 10% 10%;animation:jspout .7s cubic-bezier(.2,.9,.3,1) forwards"></div>`;
        const rings = `<div style="position:absolute;left:0;top:0;width:200px;height:52px;transform:translate(-50%,-50%);border:5px solid #FFF6E8;border-radius:50%;animation:jring .9s ease-out forwards"></div><div style="position:absolute;left:0;top:0;width:200px;height:52px;transform:translate(-50%,-50%);border:4px solid #111;border-radius:50%;opacity:.7;animation:jring 1.1s ease-out .15s both"></div>`;
        splash.innerHTML = spout + rings + drops;
        sea.style.animation = 'jsea .6s cubic-bezier(.3,.8,.3,1)';
        if (!document.getElementById('jsplash-kf')) { const st = document.createElement('style'); st.id = 'jsplash-kf'; st.textContent = '@keyframes jsplash{0%{opacity:1}60%{opacity:1}100%{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy) + 140px)) scale(.4);opacity:0}}@keyframes jring{to{transform:translate(-50%,-50%) scale(3.4);opacity:0}}@keyframes jspout{0%{transform:translate(-50%,-100%) scaleY(.1)}45%{transform:translate(-50%,-100%) scaleY(1)}100%{transform:translate(-50%,-100%) scaleY(0);opacity:0}}@keyframes jsea{0%{transform:translateY(0)}30%{transform:translateY(-14px)}60%{transform:translateY(6px)}100%{transform:translateY(0)}}'; document.head.appendChild(st); }
        bottle.style.transition = 'transform .5s ease-out, opacity .4s'; bottle.style.transform = `translateY(${fall + 14}px) rotate(26deg)`;
        cap.textContent = 'MESSAGE SENT ⛵';
        wait(650, () => { bottle.style.transition = 'transform 1.4s ease-in-out, opacity .5s .9s'; bottle.style.transform = `translate(70vw, ${fall + 30}px) rotate(40deg)`; bottle.style.opacity = '0'; });
        wait(1150, finish);
      };
    };
  };
  const onClick = e => {
    const a = e.target.closest && e.target.closest('a[data-bottle]'); if (!a || e.metaKey || e.ctrlKey || e.button) return;
    e.preventDefault(); run(a.getAttribute('href'), a.getAttribute('data-bottle') || "LET'S BUILD IT.");
  };
  addEventListener('click', onClick);
  return (window.__jBottle = { destroy() { removeEventListener('click', onClick); window.__jBottle = null; } });
}

// Cursor: a solid dot that becomes a labelled tag over anything clickable.
export function attachCursor(refs) {
  if (!matchMedia('(pointer: fine)').matches) return { destroy() {} };
  const cur = refs.cursor.current, dot = refs.dot.current, label = refs.label.current; if (!cur || !dot) return { destroy() {} };
  document.documentElement.style.cursor = 'none';
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf = 0, shown = false, pressed = false, hot = false;
  const paint = () => { dot.style.transform = `translate(-50%,-50%) scale(${pressed ? .7 : hot ? 2.2 : 1})`; dot.style.background = hot ? '#FF8A7A' : '#111'; };
  const tick = () => {
    raf = 0; const dx = tx - x, dy = ty - y; x += dx * .45; y += dy * .45;
    cur.style.transform = `translate(${x}px, ${y}px)`;
    if (Math.abs(dx) + Math.abs(dy) > .5) raf = requestAnimationFrame(tick);
  };
  const onMove = e => { tx = e.clientX; ty = e.clientY; if (!shown) { shown = true; cur.style.opacity = '1'; } if (!raf) raf = requestAnimationFrame(tick); };
  const onOver = e => {
    const t = e.target.closest && e.target.closest('a,button,[role=button],input,select,textarea,iframe');
    hot = !!t;
    if (t) { t.style.cursor = 'none'; label.textContent = t.tagName === 'A' ? (t.target === '_blank' ? 'OPEN ↗' : 'GO →') : t.tagName === 'IFRAME' ? 'LIVE' : /input|select|textarea/i.test(t.tagName) ? 'TYPE' : 'PRESS'; label.style.opacity = '1'; label.style.transform = 'translate(22px,-50%)'; }
    else { label.style.opacity = '0'; label.style.transform = 'translate(16px,-50%)'; }
    paint();
  };
  const onDown = () => { pressed = true; paint(); }, onUp = () => { pressed = false; paint(); };
  const onLeave = () => { cur.style.opacity = '0'; shown = false; };
  addEventListener('mousemove', onMove, { passive: true }); addEventListener('mouseover', onOver); addEventListener('mousedown', onDown); addEventListener('mouseup', onUp); document.documentElement.addEventListener('mouseleave', onLeave);
  return { destroy() { removeEventListener('mousemove', onMove); removeEventListener('mouseover', onOver); removeEventListener('mousedown', onDown); removeEventListener('mouseup', onUp); document.documentElement.style.cursor = ''; } };
}

// Intro: once per session, a full-screen aged chart — islands, sea, sea-monster, compass rose, ship — then a quill writes the greeting on a pinned letter.
export function attachIntro({ onDone } = {}) {
  // plays on every fresh page load; skipped only when arriving via an in-site travel transition
  if (window.__jIntro && window.__jIntro.live) { onDone && window.__jIntro.onDone.push(onDone); return window.__jIntro; }
  if (sessionStorage.getItem('journey-skip-intro')) { sessionStorage.removeItem('journey-skip-intro'); onDone && onDone(); return { destroy() {} }; }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const F = "'Space Mono',monospace", A = "'Archivo Black',sans-serif", INK = '#3B2A1A', RED = '#9B2222', LAND = '#D9BE86', LAND2 = '#B8984F', SEA = '#C9B98E';
  const o = document.createElement('div'); o.setAttribute('data-jintro', ''); o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', 'Welcome');
  o.style.cssText = 'position:fixed;inset:0;z-index:400;background:#1a1410;overflow:hidden';
  const burn = 'polygon(0 2%, 3% 0, 8% 1.5%, 14% 0, 21% 2%, 29% .5%, 37% 2%, 46% 0, 54% 1.5%, 62% 0, 69% 2%, 77% .5%, 85% 2%, 93% 0, 100% 2.5%, 99% 10%, 100% 20%, 98.5% 30%, 100% 40%, 99% 51%, 100% 61%, 98.5% 71%, 100% 82%, 99% 92%, 100% 100%, 92% 99%, 84% 100%, 75% 98.5%, 66% 100%, 57% 99%, 48% 100%, 40% 98.5%, 31% 100%, 22% 99%, 13% 100%, 5% 98.5%, 0 100%, 1% 91%, 0 81%, 1.5% 71%, 0 61%, 1% 50%, 0 39%, 1.5% 28%, 0 17%)';
  const wave = (x, y, n = 6) => `<path d="M ${x} ${y} ${Array.from({ length: n }, () => 'q 14 -7 28 0 t 28 0').join(' ')}" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round" opacity=".5"></path>`;
  const tree = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" stroke="${INK}" stroke-width="3" stroke-linecap="round" fill="none"><path d="M0 0 L0 -34"></path><path d="M0 -34 q 20 -8 34 6"></path><path d="M0 -34 q -20 -8 -34 6"></path><path d="M0 -34 q 6 -20 26 -24"></path><path d="M0 -34 q -6 -20 -26 -24"></path><path d="M0 -34 q 0 -22 8 -34"></path></g>`;
  const mountain = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" stroke="${INK}" stroke-width="3" stroke-linejoin="round"><path d="M-60 0 L-20 -70 L0 -40 L30 -90 L80 0 Z" fill="${LAND2}"></path><path d="M30 -90 L18 -66 L30 -58 L44 -68 Z" fill="#FBF3DF"></path><path d="M-20 -70 L-28 -54 L-14 -56 Z" fill="#FBF3DF"></path></g>`;
  const hut = (x, y) => `<g transform="translate(${x} ${y})" stroke="${INK}" stroke-width="3" stroke-linejoin="round"><rect x="-16" y="-18" width="32" height="18" fill="#FBF3DF"></rect><path d="M-22 -18 L0 -38 L22 -18 Z" fill="${RED}"></path><rect x="-5" y="-10" width="10" height="10" fill="${INK}"></rect></g>`;
  const ship = (x, y, s = 1, flip = 1) => `<g transform="translate(${x} ${y}) scale(${s * flip} ${s})" stroke="${INK}" stroke-width="3" stroke-linejoin="round"><path d="M-44 10 L44 10 L30 26 L-30 26 Z" fill="${INK}"></path><path d="M0 10 L0 -48" stroke-width="4"></path><path d="M4 -44 L40 -4 L4 -4 Z" fill="#FBF3DF"></path><path d="M-4 -36 L-30 -8 L-4 -8 Z" fill="${RED}"></path><path d="M0 -48 L18 -42 L0 -36 Z" fill="#FFE566" stroke-width="2"></path></g>`;
  const monster = (x, y) => `<g transform="translate(${x} ${y})" stroke="${INK}" stroke-width="3" stroke-linecap="round" fill="#8FA86B"><path d="M-90 0 q 20 -40 45 0" fill="none" stroke-width="7"></path><path d="M-30 0 q 20 -46 48 0" fill="none" stroke-width="7"></path><path d="M30 0 q 10 -30 24 -44 q 18 -10 30 6 q 4 14 -8 18 q -12 2 -18 -6 q -8 10 -4 26 Z"></path><circle cx="68" cy="-32" r="3" fill="${INK}" stroke="none"></circle><path d="M78 -26 l 10 6 l -12 2" fill="${RED}" stroke-width="2"></path></g>`;
  const compass = (x, y) => `<g transform="translate(${x} ${y})" stroke="${INK}" fill="none" stroke-width="2.5"><circle r="64" fill="#FBF3DF" fill-opacity=".55"></circle><circle r="52" stroke-dasharray="3 6"></circle><circle r="8" fill="${INK}"></circle><path d="M0 -62 L10 0 L0 62 L-10 0 Z" fill="${RED}" stroke-width="2"></path><path d="M-62 0 L0 10 L62 0 L0 -10 Z" fill="${INK}" stroke-width="2"></path><path d="M-42 -42 L0 -8 L42 42 M42 -42 L0 -8 L-42 42" stroke-width="2" opacity=".6"></path><text y="-72" text-anchor="middle" style="font:700 16px ${F};fill:${INK}" stroke="none">N</text><text y="86" text-anchor="middle" style="font:700 13px ${F};fill:${INK}" stroke="none">S</text><text x="78" y="5" style="font:700 13px ${F};fill:${INK}" stroke="none">E</text><text x="-90" y="5" style="font:700 13px ${F};fill:${INK}" stroke="none">W</text></g>`;
  o.innerHTML = `<div data-sheet style="position:absolute;inset:0;clip-path:${burn};background:radial-gradient(ellipse at 50% 45%,#EFDDB3 0%,#E2C98F 55%,#B98F4C 100%);box-shadow:inset 0 0 90px 40px rgba(70,35,8,.8);transform:translateY(110vh);transition:transform .9s cubic-bezier(.2,.8,.2,1)">
      <div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 23px,rgba(59,42,26,.08) 23px 24px),repeating-linear-gradient(90deg,transparent 0 23px,rgba(59,42,26,.08) 23px 24px);mix-blend-mode:multiply"></div>
      <div style="position:absolute;inset:0;background:radial-gradient(circle at 18% 22%,rgba(90,50,10,.22) 0 6%,transparent 10%),radial-gradient(circle at 82% 78%,rgba(90,50,10,.18) 0 8%,transparent 12%),radial-gradient(circle at 70% 15%,rgba(90,50,10,.12) 0 4%,transparent 7%)"></div>
      <svg viewBox="0 0 1400 800" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%">
        <rect x="26" y="26" width="1348" height="748" fill="none" stroke="${INK}" stroke-width="2.5" opacity=".7"></rect>
        <rect x="36" y="36" width="1328" height="728" fill="none" stroke="${INK}" stroke-width="1.2" stroke-dasharray="4 6" opacity=".6"></rect>
        <g opacity=".9">${[[60, 120], [120, 260], [60, 420], [160, 560], [100, 700], [520, 120], [700, 700], [880, 150], [1000, 640], [1200, 420], [1260, 720], [1240, 140], [420, 760], [760, 80], [1100, 80], [360, 640], [1180, 560]].map(([x, y]) => wave(x, y)).join('')}</g>
        <path d="M 180 470 C 190 360 330 300 440 330 C 560 360 600 450 540 530 C 470 620 300 640 220 580 C 170 545 170 520 180 470 Z" fill="${LAND}" stroke="${INK}" stroke-width="3.5"></path>
        <path d="M 230 470 C 240 400 340 360 420 380 C 510 405 530 470 490 520 C 440 580 320 590 260 550 C 225 525 225 505 230 470 Z" fill="${LAND2}" opacity=".45"></path>
        ${mountain(380, 470, .8)}${tree(270, 520, .9)}${tree(320, 560, .7)}${tree(470, 540, .8)}${hut(240, 460)}
        <path d="M 455 575 l 14 14 m 0 -14 l -14 14" stroke="${RED}" stroke-width="7" stroke-linecap="round"></path>
        <text x="330" y="650" text-anchor="middle" style="font:400 18px ${A};fill:${INK};letter-spacing:.16em">ISLE OF SHIPPED THINGS</text>
        <path d="M 980 240 C 1010 170 1120 160 1190 210 C 1260 265 1240 350 1160 380 C 1080 410 980 380 960 320 C 950 290 960 265 980 240 Z" fill="${LAND}" stroke="${INK}" stroke-width="3.5"></path>
        ${mountain(1120, 330, .6)}${tree(1020, 350, .7)}${tree(1190, 350, .6)}
        <text x="1090" y="440" text-anchor="middle" style="font:400 16px ${A};fill:${INK};letter-spacing:.16em">CAPE OF CLIENTS</text>
        <path d="M 640 160 C 660 120 740 110 770 150 C 800 190 760 230 710 225 C 660 220 620 200 640 160 Z" fill="${LAND}" stroke="${INK}" stroke-width="3"></path>${tree(700, 200, .55)}
        <path d="M 462 582 C 560 650 700 600 800 540 S 980 420 1060 360" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="2 11" stroke-linecap="round" opacity=".8"></path>
        ${ship(620, 610, .9)}${monster(900, 640)}
        <text x="905" y="690" text-anchor="middle" style="font:700 12px ${F};fill:${INK};letter-spacing:.14em">HERE BE BUGS</text>
        ${compass(1230, 150)}
        <text x="700" y="80" text-anchor="middle" style="font:400 26px ${A};fill:${INK};letter-spacing:.24em">· CHART OF THE JOURNEY ·</text>
        <g transform="translate(60 740)" style="font:700 11px ${F};fill:${INK};letter-spacing:.12em"><text>SCALE</text><path d="M60 -4 L260 -4" stroke="${INK}" stroke-width="3"></path><path d="M60 -10 L60 2 M110 -10 L110 2 M160 -10 L160 2 M210 -10 L210 2 M260 -10 L260 2" stroke="${INK}" stroke-width="2"></path><text x="270">1 SCROLL = 1 LEAGUE</text></g>
      </svg>
      <div data-letter style="position:absolute;left:50%;top:50%;transform:translate(-50%,-52%) rotate(1.5deg);width:min(84vw,600px);background:#FBF3DF;border:3px solid ${INK};box-shadow:10px 10px 0 rgba(59,42,26,.4);padding:clamp(22px,4vw,44px);clip-path:polygon(0 2%, 6% 0, 50% 1%, 94% 0, 100% 3%, 99% 50%, 100% 97%, 94% 100%, 50% 99%, 6% 100%, 0 98%, 1% 50%);opacity:0;transition:opacity .5s .4s">
        <div style="position:absolute;left:50%;top:-14px;transform:translateX(-50%) rotate(-4deg);width:22px;height:22px;border-radius:50%;background:${RED};border:3px solid ${INK};box-shadow:2px 3px 0 rgba(0,0,0,.35)"></div>
        <div style="font:700 11px ${F};letter-spacing:.14em;color:${INK};opacity:.75;margin-bottom:14px">A LETTER TO THE TRAVELLER</div>
        <div data-text aria-live="polite" style="font:400 clamp(26px,4.4vw,48px)/1.15 ${A};color:${INK};min-height:3.4em;white-space:pre-wrap"></div>
        <div style="margin-top:16px;font:700 12px ${F};color:${INK};opacity:.75">— the captain</div>
        <div data-quill style="position:absolute;width:90px;height:90px;pointer-events:none;left:0;top:0;transform:translate(0,0);transition:transform .06s linear;opacity:0">
          <svg viewBox="0 0 90 90" style="overflow:visible;display:block"><path d="M4 86 L22 62" stroke="${INK}" stroke-width="4" stroke-linecap="round"></path><path d="M22 62 C 30 40 50 20 84 6 C 70 36 60 56 34 70 Z" fill="#FFF6E8" stroke="${INK}" stroke-width="3" stroke-linejoin="round"></path><path d="M22 62 C 40 45 56 30 84 6" stroke="${INK}" stroke-width="2" fill="none"></path></svg>
        </div>
      </div>
      <button type="button" data-skip style="position:absolute;right:4%;bottom:5%;background:#111;color:#FFF6E8;border:3px solid #FFF6E8;box-shadow:4px 4px 0 ${RED};padding:10px 16px;font:700 12px ${F};letter-spacing:.1em;cursor:pointer;min-height:44px">SKIP →</button>
    </div>`;
  document.body.appendChild(o);
  const q = s => o.querySelector(s), sheet = q('[data-sheet]'), letter = q('[data-letter]'), text = q('[data-text]'), quill = q('[data-quill]');
  const msg = "Hi, I'm Yash.\nBe ready for\nthis journey.";
  let done = false, timers = []; const inst = { live: true, onDone: onDone ? [onDone] : [], destroy() {} };
  window.__jIntro = inst;
  const wait = (ms, fn) => timers.push(setTimeout(fn, ms));
  const end = () => { if (done) return; done = true; inst.live = false; timers.forEach(clearTimeout);
    sheet.style.transition = 'transform .8s cubic-bezier(.6,0,.4,1)'; sheet.style.transform = 'translateY(-120vh)'; o.style.transition = 'opacity .4s .5s'; o.style.opacity = '0';
    setTimeout(() => { o.remove(); inst.onDone.forEach(f => f()); }, 950); };
  q('[data-skip]').addEventListener('click', end);
  if (reduced) { sheet.style.transition = 'none'; sheet.style.transform = 'none'; letter.style.opacity = '1'; text.textContent = msg; wait(1400, end); return inst; }
  requestAnimationFrame(() => { sheet.style.transform = 'translateY(0)'; });
  wait(700, () => { letter.style.opacity = '1'; });
  const placeQuill = () => { const r = document.createRange(); const n = text.firstChild; if (!n || !n.length) return; r.setStart(n, n.length - 1); r.setEnd(n, n.length); const b = r.getBoundingClientRect(), lb = letter.getBoundingClientRect(); quill.style.transform = `translate(${b.right - lb.left - 6}px, ${b.bottom - lb.top - 84}px)`; };
  let i = 0; const type = () => { text.textContent = msg.slice(0, ++i); quill.style.opacity = '1'; placeQuill(); if (i < msg.length) wait(msg[i - 1] === '\n' ? 220 : 70 + Math.random() * 50, type); else { wait(300, () => { quill.style.opacity = '0'; }); wait(1500, end); } };
  wait(1300, type);
  return inst;
}

// Easy scroll: wheel input is eased toward its target so the camera glides. Touch, keyboard and scrollbar behave natively.
export function attachSmoothScroll() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(pointer: coarse)').matches || window.__jSmooth) return window.__jSmooth || { destroy() {} };
  let target = scrollY, cur = scrollY, raf = 0, active = false;
  const max = () => document.documentElement.scrollHeight - innerHeight;
  const tick = () => { raf = 0; cur += (target - cur) * .12; if (Math.abs(target - cur) < .5) { cur = target; active = false; } window.scrollTo({ top: cur, behavior: 'instant' }); if (active) raf = requestAnimationFrame(tick); };
  const onWheel = e => {
    if (document.documentElement.style.overflow === 'hidden' || e.ctrlKey) return;
    e.preventDefault();
    if (!active) { cur = scrollY; target = scrollY; }
    const d = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
    target = Math.max(0, Math.min(max(), target + d)); active = true; if (!raf) raf = requestAnimationFrame(tick);
  };
  const onNative = () => { if (!active) { cur = scrollY; target = scrollY; } };
  const jump = top => { if (!active) { cur = scrollY; } target = Math.max(0, Math.min(max(), top)); active = true; if (!raf) raf = requestAnimationFrame(tick); };
  const prevSB = document.documentElement.style.scrollBehavior; document.documentElement.style.scrollBehavior = 'auto';
  addEventListener('wheel', onWheel, { passive: false }); addEventListener('scroll', onNative, { passive: true });
  return (window.__jSmooth = { jump, destroy() { removeEventListener('wheel', onWheel); removeEventListener('scroll', onNative); document.documentElement.style.scrollBehavior = prevSB; window.__jSmooth = null; } });
}

// ---------- Island art (side view, neo-brutalist flat) ----------
const INK = '#111';
const rnd = (seed, k) => { const v = Math.sin(seed * 999.1 + k * 37.7) * 43758.5; return v - Math.floor(v); };
const T = (x, y, s = 1) => `translate(${(+x).toFixed(0)} ${(+y).toFixed(0)}) scale(${s})`;
const tree = (x, y, s = 1) => `<g transform="${T(x, y, s)}" stroke="${INK}" stroke-width="4" stroke-linecap="round" fill="none"><path d="M0 0 L0 -52"></path><path d="M0 -52 q 28 -10 48 10"></path><path d="M0 -52 q -28 -10 -48 10"></path><path d="M0 -52 q 10 -28 38 -32"></path><path d="M0 -52 q -10 -28 -38 -32"></path><path d="M0 -52 q 0 -30 12 -46"></path></g>`;
const mountain = (x, y, s = 1, fill = '#C9B8FF') => `<g transform="${T(x, y, s)}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"><path d="M-90 0 L-30 -100 L0 -56 L44 -130 L116 0 Z" fill="${fill}"></path><path d="M44 -130 L26 -94 L44 -84 L64 -98 Z" fill="#FFF6E8"></path><path d="M-30 -100 L-42 -78 L-20 -80 Z" fill="#FFF6E8"></path></g>`;
const hut = (x, y, roof = '#FF8A7A', s = 1) => `<g transform="${T(x, y, s)}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"><rect x="-26" y="-30" width="52" height="30" fill="#FFF6E8"></rect><path d="M-36 -30 L0 -64 L36 -30 Z" fill="${roof}"></path><rect x="-8" y="-18" width="16" height="18" fill="${INK}"></rect></g>`;
const cabin = (x, y, roof = '#C9B8FF') => `<g transform="${T(x, y, 1)}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"><rect x="-44" y="-44" width="88" height="44" fill="#FFF6E8"></rect><path d="M-54 -44 L0 -86 L54 -44 Z" fill="${roof}"></path><rect x="18" y="-104" width="14" height="30" fill="${INK}"></rect><rect x="-30" y="-34" width="18" height="18" fill="#A9D8FF"></rect><rect x="8" y="-30" width="18" height="30" fill="${INK}"></rect></g>`;
const lighthouse = (x, y, s = 1) => `<g transform="${T(x, y, s)}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"><path d="M-24 0 L-15 -104 L15 -104 L24 0 Z" fill="#FFF6E8"></path><path d="M-21 -34 L21 -34 L23 -10 L-23 -10 Z" fill="#FF8A7A"></path><path d="M-17 -80 L17 -80 L18 -60 L-18 -60 Z" fill="#FF8A7A"></path><rect x="-18" y="-128" width="36" height="24" fill="#FFE566"></rect><path d="M-22 -128 L0 -146 L22 -128 Z" fill="${INK}"></path></g>`;
const banner = (x, y, label, c = '#FFE566', w = 84) => `<g transform="${T(x, y, 1)}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"><path d="M0 0 L0 -96"></path><rect x="0" y="-96" width="${w}" height="32" fill="${c}"></rect><text x="${w / 2}" y="-73" text-anchor="middle" stroke="none" style="font:700 15px 'Space Mono',monospace;fill:${INK}">${label}</text></g>`;
const numberPost = (x, y, n, c) => `<g transform="${T(x, y, 1)}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"><path d="M0 0 L0 -58"></path><rect x="-24" y="-98" width="48" height="40" fill="${c}"></rect><text y="-69" text-anchor="middle" stroke="none" style="font:400 20px 'Archivo Black',sans-serif;fill:${INK}">${n}</text></g>`;
const signpost = (x, y) => `<g transform="${T(x, y, 1)}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"><path d="M0 0 L0 -96"></path><path d="M-4 -92 L46 -92 L58 -80 L46 -68 L-4 -68 Z" fill="#FFE566"></path><path d="M4 -62 L-46 -62 L-58 -50 L-46 -38 L4 -38 Z" fill="#A9D8FF"></path></g>`;
const xflag = (x, y) => `<g transform="${T(x, y, 1)}" stroke="${INK}" stroke-width="4"><path d="M0 0 L0 -70"></path><rect x="0" y="-70" width="46" height="32" fill="#FFF6E8"></rect><path d="M10 -62 L36 -46 M36 -62 L10 -46" stroke="#9B2222" stroke-width="5" stroke-linecap="round"></path></g>`;
const rose = (x, y) => `<g transform="${T(x, y - 44, 1)}" stroke="${INK}" fill="none" stroke-width="4"><circle r="40" fill="#FFF6E8"></circle><path d="M0 -38 L8 0 L0 38 L-8 0 Z" fill="#9B2222"></path><path d="M-38 0 L0 8 L38 0 L0 -8 Z" fill="${INK}"></path></g>`;
const anchor = (x, y) => `<g transform="${T(x, y, 1)}" stroke="${INK}" stroke-width="5" stroke-linecap="round" fill="none"><path d="M0 -8 L0 -72"></path><circle cx="0" cy="-82" r="9"></circle><path d="M-24 -56 L24 -56"></path><path d="M-36 -26 q 36 40 72 0"></path><path d="M-36 -26 l -8 10 M36 -26 l 8 10"></path></g>`;
const telescope = (x, y) => `<g transform="${T(x, y, 1)}" stroke="${INK}" stroke-width="4" stroke-linecap="round"><path d="M0 -44 L-24 0 M0 -44 L24 0 M0 -44 L0 0"></path><g transform="rotate(-28 0 -48)"><rect x="-14" y="-56" width="76" height="16" fill="${INK}"></rect><rect x="56" y="-60" width="24" height="24" fill="#FFE566"></rect></g></g>`;
const monitor = (x, y) => `<g transform="${T(x, y, 1)}" stroke="${INK}" stroke-width="4"><path d="M-8 0 L-8 -46 M8 0 L8 -46"></path><rect x="-66" y="-112" width="132" height="66" fill="${INK}"></rect><text x="-52" y="-70" stroke="none" style="font:700 18px 'Space Mono',monospace;fill:#B8F2D0">>_ hello</text></g>`;
const notchMonument = (x, y) => `<g transform="${T(x, y, 1)}" stroke="${INK}" stroke-width="4"><rect x="-90" y="-14" width="180" height="14" fill="#E9D9A6"></rect><path d="M-70 -14 L-56 -44 L56 -44 L70 -14 Z" fill="#FFF6E8"></path><rect x="-74" y="-86" width="148" height="38" rx="19" fill="${INK}"></rect><circle cx="40" cy="-67" r="7" fill="#B8F2D0" stroke="none"></circle><rect x="-56" y="-72" width="60" height="10" rx="5" fill="#FFF6E8" stroke="none" opacity=".35"></rect></g>`;
const forge = (x, y) => `<g transform="${T(x, y, 1)}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"><rect x="-70" y="-70" width="140" height="70" fill="#FFF6E8"></rect><path d="M-80 -70 L0 -110 L80 -70 Z" fill="#FFB7D9"></path><rect x="30" y="-140" width="20" height="40" fill="${INK}"></rect><circle cx="48" cy="-156" r="10" fill="#FFF6E8"></circle><circle cx="66" cy="-176" r="14" fill="#FFF6E8"></circle><rect x="-50" y="-44" width="44" height="44" fill="${INK}"></rect><circle cx="-28" cy="-24" r="9" fill="#FF8A7A" stroke="none"></circle><path d="M6 -22 L52 -22 L46 -34 L58 -34 L58 -46 L0 -46 L0 -34 L12 -34 Z" fill="${INK}"></path></g>`;
const windmill = (x, y, s = 1) => `<g transform="${T(x, y, s)}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"><path d="M-20 0 L-11 -96 L11 -96 L20 0 Z" fill="#FFF6E8"></path><rect x="-10" y="-36" width="20" height="36" fill="${INK}"></rect><g transform="translate(0 -100)"><g style="transform-box:fill-box;transform-origin:center;animation:spin 11s linear infinite"><path d="M0 0 L0 -62 L16 -62 Z M0 0 L62 0 L62 16 Z M0 0 L0 62 L-16 62 Z M0 0 L-62 0 L-62 -16 Z" fill="#FFE566" stroke-width="3"></path></g><circle r="7" fill="${INK}"></circle></g></g>`;
const easel = (x, y) => `<g transform="${T(x, y, 1)}" stroke="${INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M-26 0 L-6 -96 M26 0 L6 -96 M0 0 L0 -34"></path><rect x="-50" y="-136" width="100" height="70" fill="#FFF6E8"></rect><path d="M-38 -88 q 22 -34 46 -12 t 26 10" fill="none" stroke-dasharray="3 6" stroke-width="3"></path><path d="M14 -82 l 10 10 m 0 -10 l -10 10" stroke="#9B2222"></path></g>`;
const mailbox = (x, y) => `<g transform="${T(x, y, 1)}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"><path d="M0 0 L0 -52"></path><rect x="-30" y="-96" width="60" height="44" rx="10" fill="#FF8A7A"></rect><rect x="-18" y="-82" width="36" height="6" fill="${INK}" stroke="none"></rect><path d="M30 -90 L44 -90 L44 -70" fill="none"></path><path d="M44 -90 L58 -84 L44 -78 Z" fill="#FFE566"></path></g>`;
const bottle = (x, y) => `<g transform="${T(x, y, 1)} rotate(-72)" stroke="${INK}" stroke-width="3" stroke-linejoin="round"><rect x="-9" y="-44" width="18" height="44" rx="7" fill="#A9D8FF"></rect><rect x="-5" y="-56" width="10" height="14" fill="#B07A3E"></rect><rect x="-5" y="-34" width="10" height="20" rx="3" fill="#FFF6E8" stroke="none"></rect></g>`;
const peakFlag = (x, hyx, s, label, c) => banner(x + 44 * s - 4, hyx - 130 * s + 4, label, c, 72);
const FEATURES = {
  harbor: (I, hy) => anchor(-210, hy(-210)) + hut(-110, hy(-110), '#FFE566') + hut(-20, hy(-20), '#FF8A7A') + banner(60, hy(60), 'START', '#B8F2D0') + tree(160, hy(160)) + tree(240, hy(240), .8),
  quay: (I, hy) => cabin(-130, hy(-130)) + telescope(-10, hy(-10)) + monitor(120, hy(120)) + tree(230, hy(230), .8),
  atoll: (I, hy) => [-250, -150, -50, 50, 150, 250].map((x, k) => numberPost(x, hy(x), '0' + (k + 1), ['#FFB7D9', '#A9D8FF', '#B8F2D0', '#C9B8FF', '#FFC9A3', '#FF8A7A'][k])).join('') + tree(-320, hy(-320), .7) + tree(320, hy(320), .7),
  shipped: (I, hy) => notchMonument(-200, hy(-200)) + forge(-20, hy(-20)) + windmill(160, hy(160)) + xflag(270, hy(270)) + tree(-300, hy(-300), .8),
  cay: (I, hy) => rose(-180, hy(-180)) + easel(-50, hy(-50)) + signpost(80, hy(80)) + banner(180, hy(180), 'DAY 0', '#FFE566', 74) + tree(-270, hy(-270), .8),
  ridge: (I, hy) => [[-200, .62, '2022', '#FFE566'], [-70, .82, '2023', '#A9D8FF'], [70, 1.02, '2024', '#FFB7D9'], [215, 1.2, 'NOW', '#B8F2D0']].map(([x, s, l, c]) => mountain(x, hy(x), s, c) + peakFlag(x, hy(x), s, l, c)).join(''),
  haven: (I, hy) => lighthouse(-40, hy(-40), 1.15) + mailbox(90, hy(90)) + hut(-190, hy(-190), '#FFE566') + tree(-270, hy(-270)) + bottle(210, 8) + tree(260, hy(260), .8),
  notch: (I, hy) => notchMonument(-30, hy(-30)) + hut(-200, hy(-200), '#A9D8FF') + hut(150, hy(150), '#FFE566', .9) + tree(-290, hy(-290), .8) + tree(250, hy(250), .8),
  forge: (I, hy) => forge(0, hy(0)) + hut(-190, hy(-190), '#FFB7D9') + banner(160, hy(160), '24 MB', '#FFE566', 74) + tree(240, hy(240), .8) + tree(-280, hy(-280), .7),
  wind: (I, hy) => windmill(-130, hy(-130)) + windmill(80, hy(80), .8) + banner(190, hy(190), '0 kB', '#B8F2D0', 70) + tree(-270, hy(-270), .8) + hut(-20, hy(-20), '#C9B8FF', .8)
};
export const CASE_ISLANDS = {
  notch: { name: 'NOTCH ISLAND', sub: 'CAMP 01 · NOTCHISLAND', x: 700, rx: 320, ry: 170, grass: '#A9D8FF', kind: 'notch', seed: 21 },
  apiforge: { name: 'THE FORGE', sub: 'CAMP 02 · APIFORGE', x: 700, rx: 310, ry: 190, grass: '#FFB7D9', kind: 'forge', seed: 23 },
  veloce: { name: 'THE WINDS', sub: 'CAMP 03 · VELOCE UI', x: 700, rx: 320, ry: 160, grass: '#C9B8FF', kind: 'wind', seed: 27 }
};
const LIFT = { forge: 140, shipped: 140, wind: 130, ridge: 40, quay: 40, haven: 50, cay: 60, atoll: 10, notch: 20, harbor: 20 };
export function islandMarkup(I, base) {
  const lift = LIFT[I.kind] || 30;
  const n = 10, prof = []; for (let k = 0; k <= n; k++) { const u = k / n; prof.push(k === 0 || k === n ? 0 : I.ry * Math.sin(u * Math.PI) * (.55 + .45 * rnd(I.seed, k))); }
  const px = k => -I.rx + 2 * I.rx * k / n;
  const hy = x => { const u = (x + I.rx) / (2 * I.rx) * n, k = Math.max(0, Math.min(n - 1, Math.floor(u))), f = u - k; return -(prof[k] + (prof[k + 1] - prof[k]) * f) + 6; };
  let hill = `M ${px(0)} 0`; for (let k = 1; k < n; k++) { const mx = (px(k) + px(k + 1)) / 2, my = -(prof[k] + prof[k + 1]) / 2; hill += ` Q ${px(k)} ${-prof[k]} ${mx.toFixed(1)} ${my.toFixed(1)}`; } hill += ` L ${px(n)} 0 Z`;
  const sand = `M ${-I.rx - 50} 0 Q ${-I.rx - 50} 36 ${-I.rx} 36 L ${I.rx} 36 Q ${I.rx + 50} 36 ${I.rx + 50} 0 Z`;
  return `<g transform="translate(${I.x} ${base})"><ellipse cx="0" cy="44" rx="${I.rx * 1.35}" ry="30" fill="#CFE9FF" opacity=".9"></ellipse><path d="${hill}" transform="translate(0 44) scale(1 -0.3)" fill="${I.grass}" opacity=".28"></path><path d="${sand}" fill="#E9D9A6" stroke="${INK}" stroke-width="5" stroke-linejoin="round"></path><path d="${hill}" fill="${I.grass}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"></path>${(FEATURES[I.kind] || FEATURES.harbor)(I, hy)}<g transform="translate(${I.rx + 10} 14)" stroke="${INK}" stroke-width="4"><rect x="36" y="10" width="10" height="44" fill="${INK}" stroke="none"></rect><rect x="104" y="10" width="10" height="44" fill="${INK}" stroke="none"></rect><rect x="0" y="-8" width="150" height="16" fill="#B07A3E"></rect></g><text y="${-I.ry - 58 - lift}" text-anchor="middle" paint-order="stroke" stroke="#FFF6E8" stroke-width="10" style="font:400 36px 'Archivo Black',sans-serif;fill:${INK};letter-spacing:.14em">${I.name}</text><text y="${-I.ry - 26 - lift}" text-anchor="middle" paint-order="stroke" stroke="#FFF6E8" stroke-width="8" style="font:700 15px 'Space Mono',monospace;fill:${INK};letter-spacing:.14em">${I.sub}</text></g>`;
}
const SHIP_G = `<g stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"><path d="M-48 10 L48 10 L32 28 L-32 28 Z" fill="${INK}"></path><path d="M0 10 L0 -54" stroke-width="4.5"></path><path d="M4 -50 L44 -4 L4 -4 Z" fill="#FFF6E8"></path><path d="M-4 -40 L-32 -8 L-4 -8 Z" fill="#FF8A7A"></path><path d="M0 -54 L20 -48 L0 -40 Z" fill="#FFE566" stroke-width="2.5"></path></g>`;
export function shipMarkup() { return `<svg viewBox="-60 -70 120 100" width="120" height="100" style="position:absolute;left:-60px;top:-70px;overflow:visible">${SHIP_G}</svg>`; }
// Case-page banner: the camp's island, sky, sea — and the ship sailing in to the pier on load.
export function mountScene(el, key) {
  const I = CASE_ISLANDS[key]; if (!el || !I) return;
  const W = 1400, H = 560, base = 390, water = 462, reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const far = [[120, 220, 60], [460, 160, 40], [1080, 260, 70], [1320, 180, 50]].map(([x, rw, rh]) => `<path d="M ${x - rw} ${base} q ${rw * .5} ${-rh} ${rw} ${-rh * .4} q ${rw * .4} ${-rh * .6} ${rw} ${rh} Z" fill="#B9D6EE" stroke="${INK}" stroke-width="3" opacity=".8"></path>`).join('');
  const waves = Array.from({ length: 34 }, (_, k) => { const x = rnd(3, k) * W, y = base + 40 + rnd(4, k) * (H - base - 40), sc = .7 + (y - base) / (H - base); return `<path d="M ${x.toFixed(0)} ${y.toFixed(0)} q ${14 * sc} ${-8 * sc} ${28 * sc} 0 t ${28 * sc} 0" fill="none" stroke="#FFF6E8" stroke-width="3" stroke-linecap="round" opacity=".8"></path>`; }).join('');
  const clouds = [[180, 90, 1], [620, 60, .7], [1150, 110, .9]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})" style="${reduced ? '' : 'animation:cloudDrift 50s ease-in-out infinite alternate'}"><path d="M-90 20 Q -110 -10 -70 -20 Q -60 -56 -10 -40 Q 20 -70 60 -36 Q 110 -40 100 0 Q 120 30 80 30 L -70 30 Q -110 30 -90 20 Z" fill="#FFF6E8" stroke="${INK}" stroke-width="4"></path></g>`).join('');
  const pierX = I.x + I.rx + 110, routeD = `M -200 ${water} C 200 ${water + 26}, 500 ${water - 22}, ${pierX} ${water}`;
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" style="display:block;width:100%;height:auto;overflow:hidden">
    <defs><linearGradient id="csky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FC7EE"></stop><stop offset="1" stop-color="#EAF6FF"></stop></linearGradient><linearGradient id="csea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CC6F0"></stop><stop offset="1" stop-color="#3F7FC7"></stop></linearGradient></defs>
    <rect width="${W}" height="${base}" fill="url(#csky)"></rect><circle cx="1180" cy="120" r="70" fill="#FFE566" stroke="${INK}" stroke-width="5"></circle>${clouds}${far}
    <rect y="${base}" width="${W}" height="${H - base}" fill="url(#csea)"></rect><path d="M0 ${base} L${W} ${base}" stroke="${INK}" stroke-width="5"></path>
    <g style="${reduced ? '' : 'animation:waveDrift 7s ease-in-out infinite alternate'}">${waves}</g>
    ${islandMarkup(I, base)}
    <path d="${routeD}" fill="none" stroke="${INK}" stroke-width="4" stroke-dasharray="3 18" stroke-linecap="round" opacity=".35"></path>
    <path data-cwake d="${routeD}" fill="none" stroke="#FFF6E8" stroke-width="9" stroke-linecap="round" opacity=".85" style="stroke-dasharray:0 99999"></path>
    <path data-croute d="${routeD}" fill="none" stroke="none"></path>
    <g data-cship><g style="${reduced ? '' : 'animation:shipBob 2.8s ease-in-out infinite'}"><g transform="scale(1.25)">${SHIP_G}</g></g></g>
  </svg>`;
  const route = el.querySelector('[data-croute]'), ship = el.querySelector('[data-cship]'), wake = el.querySelector('[data-cwake]'), len = route.getTotalLength();
  const place = k => { const p = route.getPointAtLength(len * k); ship.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`); wake.style.strokeDasharray = `${(len * k).toFixed(0)} ${len}`; };
  if (reduced) { place(1); return; }
  const t0 = performance.now(), dur = 2600; const step = now => { const t = Math.min(1, (now - t0) / dur); place(1 - Math.pow(1 - t, 3)); if (t < 1) requestAnimationFrame(step); }; requestAnimationFrame(step);
}

