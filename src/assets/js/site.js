(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const noHover = matchMedia('(hover: none)').matches;
  const io = 'IntersectionObserver' in window;

  const top = document.getElementById('top');
  // header: hides while scrolling down, comes back as soon as you scroll up
  let lastY = scrollY;
  const onTop = () => {
    const y = scrollY, dy = y - lastY;
    const menuOpen = document.getElementById('sheet')?.classList.contains('open') || top.querySelector('.has-mega.open, .has-mega:hover, :focus-visible');
    if (y < 120 || dy < -4 || menuOpen) top.classList.remove('away');
    else if (dy > 4) top.classList.add('away');
    top.classList.toggle('floating', y > 120);
    if (Math.abs(dy) > 4) lastY = y;
  };
  addEventListener('scroll', onTop, {passive:true}); onTop();

  if (!reduce && io) {
    document.documentElement.classList.add('js-anim');
    const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), {rootMargin:'0px 0px -8% 0px', threshold:.12});
    document.querySelectorAll('.rv').forEach(el => rio.observe(el));
  }

  // ── home page only: the brick wall and the hero slideshow ──
  if (document.getElementById('portal')) {
  // sandstone wall: rows part along their joints and slide behind the stones that stay
  const portal = document.getElementById('portal'), wall = document.getElementById('wall');
  const SAND = ['#B0705A','#BC7D64','#A8654F','#C38C70','#B57760','#9F5E4A','#C99C7F','#B98468','#AD6B55','#D1A88A'];
  function rnd(n){ const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  let opened = false;
  function buildWall(){
    const W = portal.clientWidth, H = portal.clientHeight, m = W < 760;
    const R = m ? 9 : Math.max(6, Math.round(H / 128)), rh = H / R;
    const bw = rh * (m ? 1.8 : 2.15);
    const steps = m ? 3 : 4, dTop = m ? W * .022 : Math.max(64, W * .045), dBot = m ? W * .05 : Math.max(140, W * .11);
    portal.style.setProperty('--rem', dBot + 'px');
    wall.innerHTML = '';
    const g = m ? 2.5 : 4; wall.style.setProperty('--bk', (m ? 2.5 : 3.5) + 'px'); wall.style.setProperty('--br', (m ? 4 : 6) + 'px');
    let id = 0;
    const blk = (cls, x, y, w, h, parent) => { const d = document.createElement('div'); d.className = cls;
      const gl = x <= .5 ? 0 : g, gr = x + w >= W - .5 ? 0 : g; // flush with the page edges, gaps only between bricks
      d.style.cssText = `left:${(x + gl).toFixed(1)}px;top:${(y + g).toFixed(1)}px;width:${(w - gl - gr).toFixed(1)}px;height:${(h - 2*g).toFixed(1)}px;--c:${SAND[Math.floor(rnd(++id) * SAND.length)]};--sx:${Math.round(rnd(id+.3)*100)}%;--sy:${Math.round(rnd(id+.6)*100)}%;--sa:${176 + Math.round(rnd(id+.9)*6)}deg;background-position:0 0,0 0,${Math.round(rnd(id+.1)*180)}px ${Math.round(rnd(id+.2)*180)}px,0 ${Math.round(rnd(id+.4)*30)}px`; if (!gl) { d.style.borderTopLeftRadius = d.style.borderBottomLeftRadius = '0'; } if (!gr) { d.style.borderTopRightRadius = d.style.borderBottomRightRadius = '0'; } parent.appendChild(d); };
    for (let r = 0; r < R; r++) {
      const y = r * rh, k = Math.min(steps - 1, Math.floor(r / R * steps)), dep = dTop + (dBot - dTop) * k / (steps - 1);
      // the stones that stay: one course, or two once the step is deep enough
      for (const side of ['l', 'r']) {
        const parts = dep > bw * .8 ? [dep * (r % 2 ? .42 : .58), dep * (r % 2 ? .58 : .42)] : [dep];
        let x = side === 'l' ? 0 : W - dep;
        parts.forEach(w => { blk('rm ' + side, x, y, w, rh, wall); x += w; });
      }
      // the moving courses, in running bond, split at the joint nearest the centre
      const xs = [dep]; let x = dep + (r % 2 ? bw * .5 : bw * (.75 + rnd(r) * .25));
      while (x < W - dep - bw * .35) { xs.push(x); x += bw; }
      xs.push(W - dep);
      let split = 1; for (let i = 1; i < xs.length - 1; i++) if (Math.abs(xs[i] - W/2) < Math.abs(xs[split] - W/2)) split = i;
      if (xs.length < 3) { xs.splice(1, 0, W/2); split = 1; }
      const delay = Math.abs(r - (R - 1) / 2) * (m ? 55 : 75);
      for (const side of ['l', 'r']) {
        const hr = document.createElement('div'); hr.className = 'hr';
        const a = side === 'l' ? 0 : split, b = side === 'l' ? split : xs.length - 1;
        for (let i = a; i < b; i++) blk('st', xs[i], y, xs[i + 1] - xs[i], rh, hr);
        const dist = side === 'l' ? xs[split] - dep + 6 : (W - dep) - xs[split] + 6;
        hr.dataset.dx = side === 'l' ? -dist : dist;
        hr.style.transitionDelay = delay + 'ms';
        if (opened) { hr.style.transform = `translateX(${hr.dataset.dx}px)`; hr.style.visibility = 'hidden'; }
        wall.appendChild(hr);
      }
    }
  }
  function openWall(){ // resolves once every row has finished sliding away
    opened = true;
    const rows = [...wall.querySelectorAll('.hr')];
    // resolves as the bricks part: half a second before the last row is 60% through its glide
    const lastStart = Math.max(0, ...rows.map(hr => parseFloat(hr.style.transitionDelay) || 0));
    rows.forEach(hr => { hr.addEventListener('transitionend', () => { hr.style.visibility = 'hidden'; }, {once:true}); hr.style.transform = `translateX(${hr.dataset.dx}px)`; });
    return new Promise(done => setTimeout(done, Math.max(0, lastStart + 1700 * .6 - 500)));
  }
  buildWall();
  let gt; addEventListener('resize', () => { clearTimeout(gt); gt = setTimeout(buildWall, 120); });
  if (reduce) { opened = true; portal.classList.add('open'); portal.classList.remove('closed'); buildWall(); }
  else {
    portal.classList.add('closed');
    const fontsIn = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    // the words only come up once the bricks have actually parted
    setTimeout(() => { portal.classList.add('open'); Promise.all([fontsIn, openWall()]).then(() => portal.classList.remove('closed')); }, 700);
    setTimeout(() => portal.classList.add('settled'), 2600);
  }

  // carousel
  const slides = [...portal.querySelectorAll('.slide')], dots = [...portal.querySelectorAll('.dot')];
  let cur = 0, timer = null, paused = reduce, hovering = false;
  function show(i){
    cur = (i + slides.length) % slides.length;
    slides.forEach((sl, k) => { const on = k === cur; sl.classList.toggle('on', on); sl.setAttribute('aria-hidden', !on); sl.querySelectorAll('a').forEach(a => a.tabIndex = on ? 0 : -1); });
    dots.forEach((d, k) => d.setAttribute('aria-current', k === cur));
  }
  function arm(){ clearInterval(timer); if (!paused && !hovering) timer = setInterval(() => show(cur + 1), 7000); }
  dots.forEach((d, k) => d.addEventListener('click', () => { show(k); arm(); }));
  document.getElementById('prevBtn').addEventListener('click', () => { show(cur - 1); arm(); });
  document.getElementById('nextBtn').addEventListener('click', () => { show(cur + 1); arm(); });
  const pb = document.getElementById('pauseBtn');
  const icoPause = pb.innerHTML, icoPlay = '<svg viewBox="0 0 12 12" width="11" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor"/></svg>';
  function setPaused(p){ paused = p; pb.innerHTML = p ? icoPlay : icoPause; pb.setAttribute('aria-label', p ? 'Play slideshow' : 'Pause slideshow'); arm(); }
  pb.addEventListener('click', () => setPaused(!paused));
  if (reduce) setPaused(true);
  ['mouseenter','focusin'].forEach(ev => portal.addEventListener(ev, () => { hovering = true; arm(); }));
  ['mouseleave','focusout'].forEach(ev => portal.addEventListener(ev, () => { hovering = false; arm(); }));
  arm();
  }

  // mission: "Our mission is to serve:" word by word, a pause, then the rest one line at a time
  if (!reduce && io) { const mp = document.querySelector('.mission p.big');
    if (mp) { let t = 0, rest = false; const words = [];
      const walk = n => [...n.childNodes].forEach(c => { if (c.nodeType === 3) { const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(w => { if (!w) return; if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
          const sp = document.createElement('span'); sp.className = 'mw'; sp.textContent = w; frag.appendChild(sp);
          if (rest) { words.push(sp); return; }
          sp.style.setProperty('--t', t.toFixed(2) + 's'); t += t < 0.5 ? 0.06 : 0.08;
          if (/:$/.test(w)) rest = true; });
        c.replaceWith(frag); } else walk(c); });
      walk(mp);
      // group the remaining words by the line they sit on, and give each line its own moment
      const lines = () => { if (mp.classList.contains('in')) return; let top = null, k = -1;
        const ln = words.map(sp => { const y = sp.offsetTop; if (top === null || Math.abs(y - top) > 4) { top = y; k++; } return k; });
        const step = k > 3 ? 0.55 : 0.7; // narrow screens have more lines, so each comes a little sooner
        words.forEach((sp, i) => sp.style.setProperty('--t', (t + 0.6 + ln[i] * step).toFixed(2) + 's')); };
      lines(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(lines);
      let lt; addEventListener('resize', () => { clearTimeout(lt); lt = setTimeout(lines, 150); }); } }

  // commitments: on touch screens the pillar takes its colour as it reaches the middle of the screen
  if (noHover && io) { const cio = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('lit', e.isIntersecting)), {rootMargin:'-35% 0px -35% 0px'}); document.querySelectorAll('.cm').forEach(c => cio.observe(c)); }

  // mega menu + mobile sheet
  const item = document.getElementById('workItem'), wbtn = document.getElementById('workBtn');
  wbtn.addEventListener('click', () => { const o = item.classList.toggle('open'); wbtn.setAttribute('aria-expanded', o); });
  document.addEventListener('click', e => { if (!item.contains(e.target)) { item.classList.remove('open'); wbtn.setAttribute('aria-expanded', false); } });
  const sheet = document.getElementById('sheet'), mb = document.getElementById('menuBtn');
  mb.addEventListener('click', () => { sheet.classList.add('open'); mb.setAttribute('aria-expanded', true); });
  document.getElementById('closeBtn').addEventListener('click', () => { sheet.classList.remove('open'); mb.setAttribute('aria-expanded', false); });

  // number cards: tap to reveal, slow count-up once
  // tap a number or its icon to see where it comes from; tap again to go back
  document.querySelectorAll('.ncol').forEach(col => { const b = col.querySelector('.num'), ic = col.querySelector('.nicon');
    const flip = () => { const o = b.classList.toggle('open'); col.classList.toggle('open', o); b.setAttribute('aria-expanded', o); };
    b.addEventListener('click', flip); if (ic) ic.addEventListener('click', flip); });
  function fmt(el, v){ const dec = +(el.dataset.dec || 0), loc = el.dataset.loc, suf = el.dataset.suf || ''; el.textContent = (loc ? Math.round(v).toLocaleString(loc) : v.toFixed(dec)) + suf; }
  if (!reduce && io) {
    const cio = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; cio.unobserve(e.target);
      const el = e.target, to = +el.dataset.to, t0 = performance.now() + 400, d = 2800;
      fmt(el, 0);
      (function step(t){ const p = Math.max(0, Math.min(1,(t-t0)/d)), k = 1 - Math.pow(1-p,4); fmt(el, to*k); if (p<1) requestAnimationFrame(step); else fmt(el, to); })(performance.now());
    }), {threshold:.6});
    document.querySelectorAll('.fig[data-to]').forEach(el => cio.observe(el));
  }

  // touch screens: tiles and cards bloom as they cross the middle of the screen
  if (noHover && io) {
    const lio = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('lit', e.isIntersecting)), {rootMargin:'-35% 0px -35% 0px'});
    document.querySelectorAll('.tile,.scard').forEach(t => lio.observe(t));
  }

  // quote parallax
  const vfig = document.querySelector('.voice figure');
  function parallax(){
    if (reduce || !vfig) return;
    const r = vfig.getBoundingClientRect(), p = (r.top + r.height/2) / innerHeight;
    vfig.style.setProperty('--px', (-12 - (p - .5) * 22).toFixed(2) + '%');
  }

  // ── home page only: the journey ribbon ──
  if (document.getElementById('journey')) {
  // Dell-style journey ribbon
  const journey = document.getElementById('journey'), svg = journey.querySelector('svg.ribbon');
  const gGhost = svg.querySelector('.ghost'), gLive = svg.querySelector('.live'), NS = 'http://www.w3.org/2000/svg';
  const blocks = [...journey.querySelectorAll('.jblock')], texts = [...journey.querySelectorAll('.jtext')];
  const toneVar = b => getComputedStyle(b).getPropertyValue('--tone').trim();
  let live = [], samplesY = [], cum = [], total = 1, photoTops = [];
  function catmull(P, seg){ // centripetal-ish Catmull-Rom through points
    const out = [];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0,i-1)], p1 = P[i], p2 = P[i+1], p3 = P[Math.min(P.length-1,i+2)];
      const n = Math.max(10, Math.ceil(Math.hypot(p2[0]-p1[0], p2[1]-p1[1]) / seg));
      for (let k = (i ? 1 : 0); k <= n; k++) { const t = k/n, t2 = t*t, t3 = t2*t;
        out.push([0, 1].map(j => .5*((2*p1[j]) + (-p0[j]+p2[j])*t + (2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2 + (-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3))); }
    }
    return out;
  }
  const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x-a)/(b-a))); return t*t*(3-2*t); };
  function build(){
    const r = journey.getBoundingClientRect(), W = r.width, H = journey.offsetHeight, mobile = W < 760;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); gGhost.innerHTML = ''; gLive.innerHTML = '';
    const head = journey.querySelector('.head').getBoundingClientRect();
    const figs = blocks.map(b => { const f = b.querySelector('figure').getBoundingClientRect(); return {l: f.left - r.left, rt: f.right - r.left, top: f.top - r.top, bot: f.bottom - r.top, left: !b.classList.contains('flip')}; });
    photoTops = figs.map(f => f.top);
    // waypoints: down from the heading, out to each photo's outer side, then sweeping across the gap
    const y0 = head.bottom - r.top + 4;
    const bz = (p0,p1,p2,p3,t) => { const u = 1-t; return [u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0], u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]]; };
    const xm = f => (f.l + f.rt) / 2;
    const segs = [];
    let prev = [W/2, y0];
    if (mobile) { // phones: a full S-sweep across the screen in each open gap, alternating sides, hidden behind each photo and its text
      figs.forEach((f, i) => {
        const gs = prev[1], ge = f.top + 12, x1 = W * (i % 2 ? .24 : .76), h = ge - gs;
        segs.push([prev, [prev[0], gs + h * .55], [x1, ge - h * .55], [x1, ge]]);
        const tb = blocks[i].getBoundingClientRect().bottom - r.top - 6;
        segs.push([[x1, ge], [x1, ge + (tb - ge) / 3], [x1, tb - (tb - ge) / 3], [x1, tb]]);
        prev = [x1, tb];
      });
      const eY = H - 2, h = eY - prev[1];
      segs.push([prev, [prev[0], prev[1] + h * .55], [W/2, eY - h * .55], [W/2, eY]]);
    } else {
    figs.forEach(f => {
      const x = xm(f), mid = (prev[1] + f.top) / 2;
      segs.push([prev, [prev[0], mid], [x, mid], [x, f.top + 40]]);
      segs.push([[x, f.top + 40], [x, f.top + 80], [x, f.bot - 80], [x, f.bot - 40]]);
      prev = [x, f.bot - 40];
    });
    const endX = W/2, endY = H - 2, mid = (prev[1] + endY) / 2;
    segs.push([prev, [prev[0], mid], [endX, mid - 40], [endX, endY - 70]]);
    segs.push([[endX, endY - 70], [endX, endY - 50], [endX, endY - 20], [endX, endY]]);
    }
    let pts = [];
    segs.forEach(sg => { const n = Math.max(12, Math.ceil(Math.hypot(sg[3][0]-sg[0][0], sg[3][1]-sg[0][1]) / 5)); for (let k = (pts.length ? 1 : 0); k <= n; k++) pts.push(bz(sg[0],sg[1],sg[2],sg[3],k/n)); });
    cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i-1] + Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]));
    total = cum[cum.length-1];
    let my = -1e9; samplesY = pts.map(p => (my = Math.max(my, p[1])));
    const tan = pts.map((p, i) => { const a = pts[Math.max(0,i-8)], b = pts[Math.min(pts.length-1,i+8)]; const l = Math.hypot(b[0]-a[0], b[1]-a[1]) || 1; return [(b[0]-a[0])/l, (b[1]-a[1])/l]; });
    // ribbon width: thin at the start, swelling, tapering to a point at the end; a slow turn-over along its length
    const N = mobile ? 18 : 24, Wmax = mobile ? Math.min(W * .32, 130) : Math.min(W * .16, 230);
    const width = u => Wmax * sstep(0, .07, u) * (1 - sstep(.9, 1, u));
    const mids = figs.map(f => mobile ? f.top - 70 : (f.top + f.bot) / 2); // on phones the turn happens in the open gap above each photo
    let kn = [y0, ...mids, H], kv = [-.5, ...mids.map((_, i) => i), mids.length - .5];
    if (mobile) { // on phones each half turn happens entirely in the open gap before a photo
      kn = []; kv = []; let gs = y0;
      figs.forEach((f, i) => { kn.push(gs, f.top - 6); kv.push(i, i + 1); gs = blocks[i].getBoundingClientRect().bottom - r.top + 6; });
      kn.push(gs, H); kv.push(figs.length, figs.length + .5);
    }
    const twistAt = y => { for (let j = 0; j < kn.length - 1; j++) if (y <= kn[j+1]) { const t = (y - kn[j]) / ((kn[j+1] - kn[j]) || 1); return kv[j] + (kv[j+1] - kv[j]) * sstep(0, 1, t); } return kv[kv.length-1]; };
    live = [];
    for (let k = 0; k < N; k++) {
      const f = k/(N-1) - .5;
      const xy = [];
      for (let i = 0; i < pts.length; i++) {
        const u = cum[i] / total, w = width(u) * f, th = Math.PI * twistAt(samplesY[i]), c = Math.cos(th), s2 = Math.sin(th) * .18;
        const nx = -tan[i][1], ny = tan[i][0];
        xy.push((pts[i][0] + w * (c * nx + s2 * tan[i][0])).toFixed(1) + ',' + (pts[i][1] + w * (c * ny + s2 * tan[i][1])).toFixed(1));
      }
      const g = document.createElementNS(NS,'path'); g.setAttribute('d', 'M' + xy.join('L')); gGhost.appendChild(g);
      // phones draw each strand in short pieces that fill one after another (Safari stops redrawing very long dashed lines); larger screens keep one piece
      const CH = mobile ? 60 : xy.length;
      for (let a = 0; a < xy.length - 1; a += CH) {
        const b = Math.min(a + CH, xy.length - 1);
        const p = document.createElementNS(NS,'path'); p.setAttribute('d', 'M' + xy.slice(a, b + 1).join('L'));
        p.setAttribute('stroke-opacity', (.55 + .45 * (1 - Math.abs(f) * 2)).toFixed(2));
        gLive.appendChild(p); const L = p.getTotalLength(); p._L = L; p._a = cum[a]; p._b = cum[b];
        p.style.strokeDasharray = L + ' ' + L; p.style.strokeDashoffset = reduce ? 0 : L; live.push(p);
      }
    }
    tick();
  }
  let lastTone = '';
  function tick(){
    parallax();
    const r = journey.getBoundingClientRect();
    const front = innerHeight * (innerWidth < 760 ? 0.55 : 0.68) - r.top;
    if (!reduce && samplesY.length) {
      let lo = 0, hi = samplesY.length - 1;
      if (front <= samplesY[0]) hi = 0; else if (front >= samplesY[hi]) lo = hi; else { while (hi - lo > 1) { const m = (lo+hi) >> 1; if (samplesY[m] < front) lo = m; else hi = m; } }
      const at = cum[lo];
      live.forEach(p => { const k = Math.min(1, Math.max(0, (at - p._a) / ((p._b - p._a) || 1))); p.style.strokeDashoffset = (p._L * (1 - k)).toFixed(1); });
    }
    let k = 0; photoTops.forEach((t, i) => { if (front >= t) k = i; });
    const tone = toneVar(blocks[k]);
    if (tone !== lastTone) { journey.style.setProperty('--cur', tone); lastTone = tone; }
    if (!reduce && innerWidth >= 760) texts.forEach(t => { const b = t.parentElement.getBoundingClientRect(); const p = Math.max(-.6, Math.min(.6, (b.top + b.height/2) / innerHeight - .5)); t.style.setProperty('--py', (p * 110).toFixed(1) + 'px'); });
  }
  let raf = 0;
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; tick(); }); }, {passive:true});
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 150); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build); else build();
  addEventListener('load', build);
  }

  // contact form: "/contact/?interest=project" picks that topic for you
  const sel = document.getElementById('interest');
  if (sel) { const v = new URLSearchParams(location.search).get('interest'); if (v && [...sel.options].some(o => o.value === v)) sel.value = v; }
})();
