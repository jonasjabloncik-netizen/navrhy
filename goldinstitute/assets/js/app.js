/* GOLD Institute · kapitoly 02–06: kampus, festivaly, zakázky, mapa, poptávka, vizitka */
(function () {
  'use strict';
  var doc = document, D = window.GOLD, UI = window.GOLDUI || {};
  var reduce = !!UI.reduce;
  function el(tag, cls, html) { var e = doc.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $(id) { return doc.getElementById(id); }
  var observe = UI.observe || function (n, cb) { cb(n); };
  var SVGNS = 'http://www.w3.org/2000/svg';
  function sv(tag, attrs, cls) { var e = doc.createElementNS(SVGNS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (cls) e.setAttribute('class', cls); return e; }

  /* ---------- Další mosty ---------- */
  var bl = $('blist');
  D.mosty.forEach(function (m) { bl.appendChild(el('li', 'rv', '<b>' + esc(m.nazev) + '</b><span class="mono">' + esc(m.misto) + '</span><span>' + esc(m.pozn) + '</span>')); });

  /* ---------- Fotky a videa ---------- */
  var videos = [], vidPaused = reduce;
  function loadV(v) { if (!v.getAttribute('src')) v.src = v.getAttribute('data-src'); }
  function mediaFig(m, cap) {
    var f = el('figure', 'mfig rv'), box = el('div', 'mfig__box');
    if (m.typ === 'video') {
      var v = doc.createElement('video');
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'none';
      v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('loop', '');
      v.poster = m.src + '-poster.webp'; v.setAttribute('data-src', m.src + '.mp4');
      v.setAttribute('aria-label', 'Video: ' + cap.replace(/<[^>]+>/g, ''));
      box.appendChild(v);
      box.appendChild(el('span', 'mfig__tag mfig__tag--live', 'Video'));
      var pb = el('button', 'mfig__btn', 'Pozastavit'); pb.type = 'button';
      pb.addEventListener('click', function () {
        if (v.paused) { v._manual = false; loadV(v); v.play().catch(function () {}); }
        else { v._manual = true; v.pause(); }
      });
      v.addEventListener('play', function () { pb.textContent = 'Pozastavit'; pb.setAttribute('aria-label', 'Pozastavit video'); });
      v.addEventListener('pause', function () { pb.textContent = 'Přehrát'; pb.setAttribute('aria-label', 'Přehrát video'); });
      pb.textContent = 'Přehrát'; pb.setAttribute('aria-label', 'Přehrát video');
      box.appendChild(pb);
      videos.push(v);
    } else {
      box.innerHTML = '<img src="' + m.src + '-1200.webp" srcset="' + m.src + '-640.webp 640w, ' + m.src + '-1200.webp 1200w" sizes="(min-width: 1000px) 28vw, 72vw" width="1200" height="1500" loading="lazy" decoding="async" alt="' + esc(m.alt || '') + '">';
    }
    f.appendChild(box);
    f.appendChild(el('figcaption', 'mono', cap));
    return f;
  }

  /* ---------- 02 · Kampus ---------- */
  var kf = $('kampus-fakta');
  D.kampus.fakta.forEach(function (x) {
    var d = el('div', 'rv');
    d.innerHTML = '<dt><span data-count="' + x.cislo.replace(/\s/g, '') + '">' + esc(x.cislo) + '</span>' + (x.jednotka ? '<small>' + esc(x.jednotka) + '</small>' : '') + '</dt><dd>' + esc(x.popis) + '</dd>';
    kf.appendChild(d);
  });
  function countUp(span) {
    var to = +span.getAttribute('data-count'); if (!to || reduce || to < 10 || to === 2027) return;
    var t0 = 0, dur = 1300;
    function fmt(n) { return Math.round(n).toLocaleString('cs-CZ'); }
    function tick(now) { if (!t0) t0 = now; var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 4); span.textContent = fmt(to * e); if (k < 1) requestAnimationFrame(tick); }
    span.textContent = '0'; requestAnimationFrame(tick);
  }
  observe(kf, function () { Array.prototype.forEach.call(kf.querySelectorAll('[data-count]'), countUp); });
  var km = $('kampus-media');
  D.kampus.media.forEach(function (m) { km.appendChild(mediaFig(m, '<b>' + esc(m.co) + '</b> · ' + esc(m.kdy))); });

  /* ---------- Rám z lešení (trubky + uzly), animuje se, když předek dostane .is-in ---------- */
  var FRAME = '<span class="sfr" aria-hidden="true"><i class="fv fv--l"></i><i class="fv fv--r"></i><i class="fh fh--t"></i><i class="fh fh--b"></i><i class="fn fn--tl"></i><i class="fn fn--tr"></i><i class="fn fn--bl"></i><i class="fn fn--br"></i></span>';
  window.GOLDUI.FRAME = FRAME;
  function plate(name, logo, meta) {
    return (logo ? '<img class="lg" src="' + esc(logo) + '" alt="' + esc(name) + '" loading="lazy" decoding="async">' : '<b class="pl__name">' + esc(name) + '</b>') +
      (meta ? '<span class="pl__meta mono">' + esc(meta) + '</span>' : '');
  }

  /* ---------- 03 · Festivaly: stěna referencí (oficiální loga se doplní do data.js) ---------- */
  var wall = $('wall');
  D.festivaly.forEach(function (f, i) {
    var li = el('li', 'wp' + (f.logo ? ' has-logo' : ''));
    li.style.setProperty('--i', i);
    li.innerHTML = FRAME + '<span class="wp__plate">' + plate(f.nazev, f.logo, f.misto) + '</span>';
    wall.appendChild(li);
  });
  observe(wall, function (n) { n.classList.add('is-in'); }, '0px 0px -20% 0px');

  /* Systémy lešení (PERI, HAKI): štítky s místem pro oficiální logo */
  var br = $('brands');
  if (br && D.znacky) {
    D.znacky.forEach(function (z, i) {
      var li = el('li', 'bp' + (z.logo ? ' has-logo' : ''));
      li.style.setProperty('--i', i);
      li.innerHTML = FRAME + '<span class="bp__plate">' + plate(z.nazev, z.logo, z.popis) + '</span>';
      br.appendChild(li);
    });
    observe(br, function (n) { n.classList.add('is-in'); });
  }
  var fm = $('fest-media');
  D.festMedia.forEach(function (m) { fm.appendChild(mediaFig(m, '<b>' + esc(m.kde) + '</b> · ' + esc(m.co))); });

  /* Videa: hrají jen v obraze, jde je pozastavit, při omezeném pohybu nehrají samy */
  var vt = $('video-toggle');
  function setPaused(p) {
    vidPaused = p;
    vt.setAttribute('aria-pressed', String(p));
    vt.textContent = p ? 'Přehrát videa' : 'Pozastavit videa';
    videos.forEach(function (v) { v._manual = false; if (p) v.pause(); else if (v._in) { loadV(v); v.play().catch(function () {}); } });
  }
  vt.addEventListener('click', function () { setPaused(!vidPaused); });
  setPaused(vidPaused);
  if ('IntersectionObserver' in window) {
    var vo = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        var v = e.target; v._in = e.isIntersecting;
        if (e.isIntersecting) { if (!vidPaused && !v._manual) { loadV(v); v.play().catch(function () {}); } } else v.pause();
      });
    }, { rootMargin: '120px 0px', threshold: 0.15 });
    videos.forEach(function (v) { vo.observe(v); });
  }
  doc.addEventListener('visibilitychange', function () { videos.forEach(function (v) { if (doc.hidden) v.pause(); else if (v._in && !vidPaused && !v._manual) v.play().catch(function () {}); }); });

  /* ---------- 04 · Zakázky: výkresy na míru ---------- */
  function L(x1, y1, x2, y2, cls, d) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + cls + '" style="--d:' + (d || 0) + 'ms"/>'; }
  function N(x, y, d) { return '<rect x="' + (x - 3) + '" y="' + (y - 3) + '" width="6" height="6" class="sc-n" style="--d:' + d + 'ms"/>'; }
  function grid(xs, ys, dBase, diag) {
    var s = '', i, j, y0 = ys[0];
    xs.forEach(function (x, i2) { s += L(x, y0, x, ys[ys.length - 1], 'sc', dBase + i2 * 60); });
    for (j = 1; j < ys.length; j++) s += L(xs[0], ys[j], xs[xs.length - 1], ys[j], 'sc hz', dBase + 200 + j * 90);
    if (diag) for (i = 0; i < xs.length - 1; i += 2) for (j = 0; j < ys.length - 1; j++) s += L(xs[i], ys[j], xs[i + 1], ys[j + 1], 'sc dg', dBase + 380 + j * 90);
    for (i = 0; i < xs.length; i++) for (j = 1; j < ys.length; j++) s += N(xs[i], ys[j], dBase + 520 + (i + j) * 40);
    return s;
  }
  var DRAW = {
    film: function () {
      return L(8, 128, 232, 128, 'ctx') +
        '<rect x="62" y="16" width="30" height="18" class="ctx-f"/><rect x="92" y="20" width="12" height="10" class="ctx-f"/><circle cx="72" cy="14" r="5" class="ctx-f"/><circle cx="84" cy="14" r="5" class="ctx-f"/>' +
        L(176, 128, 176, 62, 'ctx') + L(166, 128, 176, 112, 'ctx') + L(186, 128, 176, 112, 'ctx') + '<rect x="164" y="48" width="24" height="15" class="ctx-f"/>' +
        '<polygon points="164,52 118,40 118,96 164,60" class="gl" style="--d:900ms"/>' +
        grid([56, 98], [128, 106, 84, 62, 40], 0, true) + L(48, 40, 106, 40, 'sc hz', 640);
    },
    hala: function () {
      return '<polyline points="8,34 120,12 232,34" class="ctx"/>' + L(8, 34, 8, 128, 'ctx') + L(232, 34, 232, 128, 'ctx') + L(8, 128, 232, 128, 'ctx') +
        L(8, 34, 232, 34, 'ctx') + L(44, 34, 64, 26, 'ctx') + L(196, 34, 176, 26, 'ctx') +
        '<rect x="22" y="86" width="62" height="42" class="ctx-f"/><rect x="30" y="94" width="20" height="12" class="ctx"/><rect x="152" y="78" width="66" height="50" class="ctx-f"/><circle cx="185" cy="100" r="11" class="ctx"/>' +
        grid([98, 138], [128, 104, 80, 56], 0, true) + L(70, 56, 166, 56, 'sc hz', 620) + L(70, 56, 98, 74, 'sc dg', 700) + L(166, 56, 138, 74, 'sc dg', 700);
    },
    pamatka: function () {
      return '<path d="M26 128V62H62Q62 46 82 42Q120 8 158 42Q178 46 178 62H214V128Z" class="ctx-f"/>' +
        '<path d="M48 120V96a8 8 0 0 1 16 0V120M112 120V92a8 8 0 0 1 16 0V120M176 120V96a8 8 0 0 1 16 0V120M112 64V50a8 8 0 0 1 16 0V64" class="ctx"/>' + L(8, 128, 232, 128, 'ctx') +
        grid([36, 78, 120, 162, 204], [128, 108, 88, 68, 48], 0, true);
    }
  };
  var spl = $('sp-list');
  D.specialni.forEach(function (s) {
    var li = el('li');
    li.innerHTML = '<svg class="sp__draw" viewBox="0 0 240 140" aria-hidden="true">' + (DRAW[s.vykres] ? DRAW[s.vykres]() : '') + '</svg>' +
      '<div><h3 class="sp__name">' + esc(s.nazev) + '</h3><p class="sp__place mono">' + esc(s.misto) + '</p></div><p class="sp__desc">' + esc(s.popis) + '</p>';
    spl.appendChild(li);
    observe(li, function (n) { n.classList.add('is-in'); });
  });
  var svl = $('svc-list');
  D.sluzby.forEach(function (s, i) { var li = el('li', 'rv', '<b>' + esc(s.nazev) + '</b><span>' + esc(s.popis) + '</span>'); li.style.setProperty('--d', (i % 3) * 80 + 'ms'); svl.appendChild(li); });

  /* ---------- 05 · Mapa ---------- */
  (function () {
    var M = D.mapa, pins = {}, k;
    for (k in M.pins) pins[k] = M.pins[k];
    pins.praha = M.pins.smichov;
    var used = {}, order = [];
    D.reference.forEach(function (r) { if (r.pin) { if (!used[r.pin]) { used[r.pin] = []; order.push(r.pin); } used[r.pin].push(r); } });
    var wrap = $('refs-map');
    var svg = sv('svg', { viewBox: M.viewBox, role: 'group', 'aria-label': 'Mapa realizací v Česku a na Slovensku' });
    svg.appendChild(sv('path', { d: M.cz }, 'land'));
    svg.appendChild(sv('path', { d: M.sk }, 'land land--sk'));
    var gR = sv('g', {}), gP = sv('g', {});
    svg.appendChild(gR); svg.appendChild(gP);
    wrap.appendChild(svg);
    var P0 = pins.praha;
    var LPOS = { praha: 'b', most: 't', kv: 'b', liberec: 'r', hk: 'r', ostrava: 'l', trencin: 'l', zdakov: 'r' };
    function dist(p) { return Math.hypot(p[0] - P0[0], p[1] - P0[1]); }
    function draw() {
      var compact = window.innerWidth < 700;
      svg.setAttribute('viewBox', compact ? '0 0 640 370' : M.viewBox);
      while (gR.firstChild) gR.removeChild(gR.firstChild);
      while (gP.firstChild) gP.removeChild(gP.firstChild);
      var sc = compact ? 2 : 1.45;
      order.forEach(function (key) {
        var p = pins[key], items = used[key], d = Math.round(dist(p) * 1.4);
        if (key !== 'praha') {
          var mx = (P0[0] + p[0]) / 2, my = (P0[1] + p[1]) / 2, dx = p[0] - P0[0], dy = p[1] - P0[1];
          var cx = mx - dy * 0.18, cy = my + dx * 0.18;
          var path = sv('path', { d: 'M' + P0[0] + ' ' + P0[1] + 'Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + p[0] + ' ' + p[1], 'data-pin': key }, 'route');
          path.style.setProperty('--d', (200 + d) + 'ms');
          gR.appendChild(path);
        }
        var name = D.pinNazvy[key] || key;
        var g = sv('g', { tabindex: '0', role: 'button', 'data-pin': key, 'aria-label': name + ': ' + items.map(function (r) { return r.nazev; }).join(', ') }, 'pin');
        var gg = sv('g', {}, 'pin__g'); gg.style.setProperty('--d', (key === 'praha' ? 0 : 300 + d) + 'ms');
        gg.appendChild(sv('circle', { cx: p[0], cy: p[1], r: 17 * sc }, 'pin__ring'));
        gg.appendChild(sv('circle', { cx: p[0], cy: p[1], r: 10.5 * sc }, 'pin__c'));
        var n = sv('text', { x: p[0], y: p[1] + 0.5 }, 'pin__n'); n.textContent = items.length; n.style.fontSize = (10 * sc) + 'px';
        gg.appendChild(n);
        var pos = LPOS[key] || (p[0] > (compact ? 440 : 760) ? 'l' : 'r');
        var t = sv('text', {}, 'pin__t');
        if (pos === 'l' || pos === 'r') { t.setAttribute('x', p[0] + (pos === 'l' ? -16 : 16) * sc); t.setAttribute('y', p[1] + 4.5 * sc); t.setAttribute('text-anchor', pos === 'l' ? 'end' : 'start'); }
        else { t.setAttribute('x', p[0]); t.setAttribute('y', p[1] + (pos === 't' ? -16 : 25) * sc); t.setAttribute('text-anchor', 'middle'); }
        t.textContent = name; t.style.fontSize = (13 * sc) + 'px';
        gg.appendChild(t);
        g.appendChild(gg);
        gP.appendChild(g);
      });
      applyFilter();
    }
    var rl = $('refs-list');
    D.reference.forEach(function (r) {
      var li = el('li', 'ref', '<b>' + esc(r.nazev) + '</b><span>' + esc(r.misto) + '</span>' + (r.pin ? '<span class="mono">' + esc(D.pinNazvy[r.pin]) + '</span>' : ''));
      li.setAttribute('data-pin', r.pin || ''); li.setAttribute('data-kat', r.kat);
      rl.appendChild(li);
    });
    function highlight(pin) {
      Array.prototype.forEach.call(svg.querySelectorAll('.pin'), function (p) { p.classList.toggle('is-on', !!pin && p.getAttribute('data-pin') === pin); });
      Array.prototype.forEach.call(rl.querySelectorAll('.ref'), function (r) { r.classList.toggle('is-on', !!pin && r.getAttribute('data-pin') === pin); });
    }
    rl.addEventListener('mouseover', function (e) { var r = e.target.closest('.ref'); highlight(r ? r.getAttribute('data-pin') : null); });
    rl.addEventListener('mouseleave', function () { highlight(null); });
    svg.addEventListener('mouseover', function (e) { var p = e.target.closest('.pin'); if (p) highlight(p.getAttribute('data-pin')); });
    svg.addEventListener('mouseleave', function () { highlight(null); });
    svg.addEventListener('focusin', function (e) { var p = e.target.closest('.pin'); if (p) highlight(p.getAttribute('data-pin')); });
    svg.addEventListener('focusout', function () { highlight(null); });
    svg.addEventListener('click', function (e) { var p = e.target.closest('.pin'); if (p) highlight(p.getAttribute('data-pin')); });
    svg.addEventListener('keydown', function (e) { var p = e.target.closest('.pin'); if (p && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); highlight(p.getAttribute('data-pin')); } });
    var filt = $('refs-filter'), kat = 'vse';
    D.kategorie.forEach(function (c) {
      var n = c.id === 'vse' ? D.reference.length : D.reference.filter(function (r) { return r.kat === c.id; }).length;
      var b = el('button', 'chip', esc(c.nazev) + '<span>' + n + '</span>');
      b.type = 'button'; b.setAttribute('aria-pressed', String(c.id === 'vse')); b.setAttribute('data-kat', c.id);
      filt.appendChild(b);
    });
    function applyFilter() {
      var vis = {};
      Array.prototype.forEach.call(rl.querySelectorAll('.ref'), function (r) {
        var on = kat === 'vse' || r.getAttribute('data-kat') === kat;
        r.classList.toggle('is-hidden', !on);
        if (on && r.getAttribute('data-pin')) vis[r.getAttribute('data-pin')] = 1;
      });
      Array.prototype.forEach.call(svg.querySelectorAll('.pin'), function (p) { p.classList.toggle('is-dim', kat !== 'vse' && !vis[p.getAttribute('data-pin')]); });
      Array.prototype.forEach.call(svg.querySelectorAll('.route'), function (p) { p.classList.toggle('is-dim', kat !== 'vse' && !vis[p.getAttribute('data-pin')]); });
    }
    filt.addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      kat = b.getAttribute('data-kat');
      Array.prototype.forEach.call(filt.querySelectorAll('.chip'), function (c) { c.setAttribute('aria-pressed', String(c === b)); });
      applyFilter();
    });
    draw();
    var lastCompact = window.innerWidth < 700;
    window.addEventListener('resize', function () { var c = window.innerWidth < 700; if (c !== lastCompact) { lastCompact = c; draw(); } });
    observe(wrap, function () { wrap.classList.add('is-in'); });
  })();

  /* ---------- Poptávka: výkres a štítek se skládají podle zadání ---------- */
  (function () {
    var P = D.poptavka;
    var st = { typ: P.typy[0], L: 24, H: 12, misto: '', kdy: P.terminy[1] };
    var types = $('inq-types'), when = $('inq-when');
    var inL = $('inq-len'), inH = $('inq-hgt'), outL = $('inq-len-v'), outH = $('inq-hgt-v');
    var place = $('inq-place'), svg = $('inq-draw');
    var cfg = null, sheet = $('inq-sheet');
    function mountCfg() {
      if (window.THREE && window.GoldConfig) { try { cfg = window.GoldConfig.mount($('inq-3d')); } catch (e) { cfg = null; } }
      sheet.classList.add(cfg ? 'has-3d' : 'no-3d');
      setTimeout(function () { render(true); }, 0);
    }
    if (!(window.THREE && window.GoldConfig)) sheet.classList.add('no-3d');
    else if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { cio.disconnect(); mountCfg(); } }, { rootMargin: '700px 0px' });
      cio.observe(sheet);
    } else mountCfg();
    P.typy.forEach(function (t, i) {
      var b = el('button', 'opt', esc(t.nazev)); b.type = 'button'; b.setAttribute('aria-pressed', String(i === 0)); b.setAttribute('data-id', t.id);
      types.appendChild(b);
    });
    P.terminy.forEach(function (t) {
      var b = el('button', 'opt', esc(t)); b.type = 'button'; b.setAttribute('aria-pressed', String(t === st.kdy)); b.setAttribute('data-t', t);
      when.appendChild(b);
    });
    types.addEventListener('click', function (e) {
      var b = e.target.closest('.opt'); if (!b) return;
      Array.prototype.forEach.call(types.children, function (c) { c.setAttribute('aria-pressed', String(c === b)); });
      st.typ = P.typy.filter(function (t) { return t.id === b.getAttribute('data-id'); })[0];
      render(true);
    });
    when.addEventListener('click', function (e) {
      var b = e.target.closest('.opt'); if (!b) return;
      Array.prototype.forEach.call(when.children, function (c) { c.setAttribute('aria-pressed', String(c === b)); });
      st.kdy = b.getAttribute('data-t'); render(false);
    });
    function fill(inp) { inp.style.setProperty('--fill', ((inp.value - inp.min) / (inp.max - inp.min) * 100).toFixed(1) + '%'); }
    inL.addEventListener('input', function () { st.L = +inL.value; fill(inL); render(false); });
    inH.addEventListener('input', function () { st.H = +inH.value; fill(inH); render(false); });
    place.addEventListener('input', function () { st.misto = place.value.trim(); render(false); });
    fill(inL); fill(inH);

    /* výkres: díly mají klíče, nově přidané se postaví s animací */
    var live = {}, ctxG = sv('g', {}), scG = sv('g', {}), dimG = sv('g', {});
    svg.appendChild(ctxG); svg.appendChild(scG); svg.appendChild(dimG);
    var GY = 336, GX = 64, GW = 512;
    function put(list) {
      var seen = {};
      list.forEach(function (d, idx) {
        seen[d.k] = 1;
        var n = live[d.k];
        if (!n) {
          n = sv('line', {}, d.c + (reduce ? '' : ' is-new'));
          n.style.animationDelay = Math.min(idx * 6, 420) + 'ms';
          scG.appendChild(n); live[d.k] = n;
        } else if (n.getAttribute('class').split(' ')[0] !== d.c) n.setAttribute('class', d.c);
        n.setAttribute('x1', d.x1.toFixed(1)); n.setAttribute('y1', d.y1.toFixed(1)); n.setAttribute('x2', d.x2.toFixed(1)); n.setAttribute('y2', d.y2.toFixed(1));
      });
      Object.keys(live).forEach(function (k) { if (!seen[k]) { scG.removeChild(live[k]); delete live[k]; } });
    }
    function draw(reset) {
      if (reset) { Object.keys(live).forEach(function (k) { scG.removeChild(live[k]); }); live = {}; }
      var t = st.typ.id, Lm = st.L, Hm = st.H;
      var above = (t === 'most' || t === 'zavesene') ? 4 : t === 'podpery' ? 1.2 : t === 'fasada' ? 2.5 : t === 'event' ? 2.4 : 0;
      var s = Math.min(GW / Lm, 270 / (Hm + above));
      var w = Lm * s, h = Hm * s, x0 = (640 - w) / 2, yT = GY - h;
      $('inq-scale').textContent = '1 m ≈ ' + (s >= 10 ? s.toFixed(0) : s.toFixed(1)) + ' px';
      /* kontext */
      var c = '';
      c += '<line x1="20" y1="' + GY + '" x2="620" y2="' + GY + '" class="gnd"/>';
      if (t === 'zavesene' || t === 'most') {
        for (var wx = 30; wx < 610; wx += 26) c += '<path d="M' + wx + ' ' + (GY + 14) + 'q6.5 -5 13 0t13 0" class="water"/>';
      } else {
        for (var hx = 24; hx < 620; hx += 12) c += '<line x1="' + hx + '" y1="' + (GY + 1) + '" x2="' + (hx - 8) + '" y2="' + (GY + 9) + '" class="hatch"/>';
      }
      if (t === 'fasada') {
        var bh = h + 2.5 * s, bx = x0 + Math.min(6, w * 0.02), bw = w - 2 * Math.min(6, w * 0.02);
        c += '<rect x="' + bx.toFixed(1) + '" y="' + (GY - bh).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + bh.toFixed(1) + '" class="ctx-f"/>';
        var fl = Math.max(1, Math.round(Hm / 3)), ws = Math.max(1, Math.round(Lm / 3.2));
        if (fl * ws < 500) for (var fi = 0; fi < fl; fi++) for (var wi = 0; wi < ws; wi++) {
          var wxx = bx + (wi + 0.3) * bw / ws, wyy = GY - (fi + 0.75) * bh / (fl + 0.4);
          c += '<rect x="' + wxx.toFixed(1) + '" y="' + wyy.toFixed(1) + '" width="' + (bw / ws * 0.4).toFixed(1) + '" height="' + Math.min(1.4 * s, bh / fl * 0.45).toFixed(1) + '" class="win"/>';
        }
      }
      if (t === 'most' || t === 'zavesene') {
        var dy = (t === 'zavesene' ? yT - 2.6 * s : yT - 0.3 * s), dh = Math.max(8, 1.8 * s);
        c += '<rect x="10" y="' + (dy - dh).toFixed(1) + '" width="620" height="' + dh.toFixed(1) + '" class="ctx-f"/>';
        c += '<line x1="10" y1="' + (dy - dh - 6).toFixed(1) + '" x2="630" y2="' + (dy - dh - 6).toFixed(1) + '" class="ctx"/>';
      }
      if (t === 'podpery') c += '<rect x="' + (x0 - 18) + '" y="' + (yT - Math.max(7, 0.5 * s)).toFixed(1) + '" width="' + (w + 36) + '" height="' + Math.max(7, 0.5 * s).toFixed(1) + '" class="ctx-f"/>';
      if (t === 'event') {
        var ry = yT - 1.6 * s, rz = '';
        for (var ti = 0; ti <= 10; ti++) rz += (ti ? 'L' : 'M') + (x0 + w * ti / 10).toFixed(1) + ' ' + (ti % 2 ? ry : yT - 0.2 * s).toFixed(1);
        c += '<path d="' + rz + '" class="ctx"/><line x1="' + x0 + '" y1="' + ry.toFixed(1) + '" x2="' + (x0 + w) + '" y2="' + ry.toFixed(1) + '" class="ctx"/>';
      }
      ctxG.innerHTML = c;
      /* lešení */
      var list = [];
      if (t === 'zavesene') {
        var py = yT, dTop = yT - 2.6 * s, nh = Math.max(2, Math.round(Lm / 3)), stp = Math.max(1, Math.ceil(nh / 24));
        for (var i = 0; i <= nh; i += stp) { var xx = x0 + w * i / nh; list.push({ k: 'h' + i, c: 'hg', x1: xx, y1: dTop, x2: xx, y2: py }); list.push({ k: 'r' + i, c: 's', x1: xx, y1: py, x2: xx, y2: py - 1.1 * s }); }
        list.push({ k: 'pl', c: 'pl', x1: x0, y1: py, x2: x0 + w, y2: py });
        list.push({ k: 'rl', c: 'lg', x1: x0, y1: py - 1.1 * s, x2: x0 + w, y2: py - 1.1 * s });
      } else {
        var bay = t === 'podpery' ? 1.5 : 2.57, nb = Math.max(1, Math.round(Lm / bay)), sb = Math.max(1, Math.ceil(nb / 40));
        var lv = Math.max(1, Math.round(Hm / 2)), sl = Math.max(1, Math.ceil(lv / 30));
        for (var bi = 0; bi <= nb; bi += sb) { var bx2 = x0 + w * bi / nb; list.push({ k: 's' + bi, c: 's', x1: bx2, y1: GY, x2: bx2, y2: yT }); }
        if ((nb % sb) !== 0) list.push({ k: 's' + nb, c: 's', x1: x0 + w, y1: GY, x2: x0 + w, y2: yT });
        for (var li2 = sl; li2 <= lv; li2 += sl) {
          var ly = GY - h * li2 / lv;
          list.push({ k: 'l' + li2, c: 'lg', x1: x0, y1: ly, x2: x0 + w, y2: ly });
          if (t !== 'podpery') list.push({ k: 'p' + li2, c: 'pl', x1: x0, y1: ly + 1.5, x2: x0 + w, y2: ly + 1.5 });
        }
        for (var di = 2; di < nb; di += Math.max(5, sb * 5)) {
          for (var dj = 0; dj < lv; dj += sl) {
            var ya = GY - h * dj / lv, yb = GY - h * Math.min(lv, dj + sl) / lv;
            var xa = x0 + w * di / nb, xb = x0 + w * Math.min(nb, di + sb) / nb;
            list.push({ k: 'd' + di + '-' + dj, c: 'dg', x1: (dj / sl) % 2 ? xb : xa, y1: ya, x2: (dj / sl) % 2 ? xa : xb, y2: yb });
          }
        }
      }
      put(list);
      /* kóty */
      var dyL = GY + 34, dxH = x0 + w + 22;
      dimG.innerHTML =
        '<line x1="' + x0.toFixed(1) + '" y1="' + dyL + '" x2="' + (x0 + w).toFixed(1) + '" y2="' + dyL + '" class="dimx"/>' +
        '<line x1="' + x0.toFixed(1) + '" y1="' + (dyL - 6) + '" x2="' + x0.toFixed(1) + '" y2="' + (dyL + 6) + '" class="dimx"/>' +
        '<line x1="' + (x0 + w).toFixed(1) + '" y1="' + (dyL - 6) + '" x2="' + (x0 + w).toFixed(1) + '" y2="' + (dyL + 6) + '" class="dimx"/>' +
        '<text x="' + (x0 + w / 2).toFixed(1) + '" y="' + (dyL + 22) + '" text-anchor="middle" class="dimt">' + Lm + ' m</text>' +
        '<line x1="' + dxH.toFixed(1) + '" y1="' + GY + '" x2="' + dxH.toFixed(1) + '" y2="' + yT.toFixed(1) + '" class="dimx"/>' +
        '<line x1="' + (dxH - 6).toFixed(1) + '" y1="' + GY + '" x2="' + (dxH + 6).toFixed(1) + '" y2="' + GY + '" class="dimx"/>' +
        '<line x1="' + (dxH - 6).toFixed(1) + '" y1="' + yT.toFixed(1) + '" x2="' + (dxH + 6).toFixed(1) + '" y2="' + yT.toFixed(1) + '" class="dimx"/>' +
        '<text x="' + (dxH + 10).toFixed(1) + '" y="' + ((GY + yT) / 2 + 4).toFixed(1) + '" class="dimt">' + Hm + ' m</text>';
    }
    function lower(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
    function render(typeChanged) {
      var t = st.typ;
      $('inq-len-l').textContent = t.delka; $('inq-hgt-l').textContent = t.vyska;
      outL.textContent = st.L + ' m'; outH.textContent = st.H + ' m';
      var A = Math.round(st.L * st.H), showA = t.id !== 'zavesene' && t.id !== 'podpery';
      $('inq-rows').innerHTML =
        '<div><dt>Objekt</dt><dd>' + esc(t.nazev) + '</dd></div>' +
        '<div><dt>' + esc(t.delka) + '</dt><dd>' + st.L + ' m</dd></div>' +
        '<div><dt>' + esc(t.vyska) + '</dt><dd>' + st.H + ' m</dd></div>' +
        '<div><dt>Plocha přibližně</dt><dd class="is-big">' + (showA ? A.toLocaleString('cs-CZ') + ' m²' : 'upřesníme') + '</dd></div>' +
        '<div><dt>Místo</dt><dd>' + (st.misto ? esc(st.misto) : '—') + '</dd></div>' +
        '<div><dt>Termín</dt><dd>' + esc(st.kdy) + '</dd></div>';
      $('inq-text').textContent = 'Dobrý den, poptáváme ' + t.veta + ': ' + lower(t.delka) + ' ' + st.L + ' m, ' + lower(t.vyska) + ' ' + st.H + ' m' + (showA ? ' (plocha zhruba ' + A.toLocaleString('cs-CZ') + ' m²)' : '') +
        (st.misto ? ', místo stavby ' + st.misto : '') + ', termín ' + st.kdy + '. Fotky stavby posíláme v příloze.';
      if (cfg) { cfg.set(t.id, st.L, st.H); $('cfg-l').textContent = st.L + ' m'; $('cfg-h').textContent = st.H + ' m'; }
      else draw(typeChanged);
    }
    render(true);
    var status = $('inq-status'), stTimer = 0;
    $('inq-copy').addEventListener('click', function () {
      var txt = $('inq-text').textContent;
      function done(ok) { status.textContent = ok ? '✓ Zkopírováno, vložte ho do e-mailu' : 'Text označte a zkopírujte ručně'; clearTimeout(stTimer); stTimer = setTimeout(function () { status.textContent = ''; }, 4000); }
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(function () { done(true); }, function () { done(fallback(txt)); });
      else done(fallback(txt));
    });
    function fallback(txt) {
      var ta = el('textarea'); ta.value = txt; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      doc.body.appendChild(ta); ta.select(); var ok = false; try { ok = doc.execCommand('copy'); } catch (e) { ok = false; }
      doc.body.removeChild(ta); return ok;
    }
  })();

  /* ---------- 06 · Vizitka ---------- */
  var F = D.firma, rows = [
    ['Firma', esc(F.nazev)], ['Sídlo', esc(F.sidlo)], ['IČO', esc(F.ico)], ['DIČ', esc(F.dic)],
    ['Telefon', F.telefon ? '<a href="tel:' + esc(F.telefon.replace(/\s/g, '')) + '">' + esc(F.telefon) + '</a>' : '<span class="is-todo">doplní GOLD Institute</span>'],
    ['E-mail', F.email ? '<a href="mailto:' + esc(F.email) + '">' + esc(F.email) + '</a>' : '<span class="is-todo">doplní GOLD Institute</span>']
  ];
  $('vcard-rows').innerHTML = rows.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>'; }).join('');

  /* Odhalení prvků vytvořených tady */
  Array.prototype.forEach.call(doc.querySelectorAll('.rv:not(.is-in)'), function (n) { observe(n, function (x) { x.classList.add('is-in'); }); });
})();
