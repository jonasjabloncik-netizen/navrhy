/* GOLD Institute · společné chování stránky (hlavička, kapitoly, menu, odhalování) */
(function () {
  'use strict';
  var doc = document;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.GOLDUI = { reduce: reduce };

  /* Česká typografie: jednopísmenné předložky a spojky (v, z, k, s, o, u, a, i) nezůstanou na konci řádku */
  var VLNA = /(^|[\s(„])([vzksouaiVZKSOUAI]) +/g;
  function vlna(root) {
    if (!root) return;
    var w = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n, list = [];
    while ((n = w.nextNode())) {
      var p = n.parentNode.nodeName;
      if (p !== 'SCRIPT' && p !== 'STYLE' && p !== 'TEXTAREA' && /(^|[\s(„])[vzksouaiVZKSOUAI] /.test(n.nodeValue)) list.push(n);
    }
    // dvakrát kvůli dvojicím jako „a v“
    list.forEach(function (t) { t.nodeValue = t.nodeValue.replace(VLNA, '$1$2 ').replace(VLNA, '$1$2 '); });
  }
  window.GOLDUI.vlna = vlna;
  vlna(doc.body);

  /* Hlavička: pozadí po odscrollování, noční režim nad festivaly, průběh prezentace, aktivní kapitola */
  var hdr = doc.getElementById('hdr'), bar = doc.getElementById('hdr-bar');
  var night = Array.prototype.slice.call(doc.querySelectorAll('.fest, .ftr'));
  var chapters = Array.prototype.slice.call(doc.querySelectorAll('[data-chapter]'));
  var links = Array.prototype.slice.call(doc.querySelectorAll('.chap a'));
  var mcta = doc.getElementById('mcta'), inq = doc.getElementById('poptavka');
  var ticking = false, lastChap = '', probe = 32;
  function measure() { probe = hdr.offsetHeight / 2 || 32; }
  function update() {
    ticking = false;
    /* nejdřív čtení, potom zápis */
    var y = window.scrollY, vh = window.innerHeight, max = doc.documentElement.scrollHeight - vh;
    var isNight = night.some(function (s) { var r = s.getBoundingClientRect(); return r.top <= probe && r.bottom > probe; });
    var cur = '';
    chapters.forEach(function (s) { if (s.getBoundingClientRect().top <= vh * 0.45) cur = s.getAttribute('data-chapter'); });
    var ir = inq.getBoundingClientRect();
    /* tlačítko dole na telefonu: od poptávky až do konce stránky už není potřeba (a nepřekryje patičku) */
    var ctaOn = y > vh * 0.9 && ir.top >= vh;

    hdr.classList.toggle('is-scrolled', y > 8);
    hdr.classList.toggle('is-night', isNight);
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0).toFixed(4) + ')';
    if (cur !== lastChap) {
      lastChap = cur;
      links.forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('data-chap') === cur); });
    }
    if (mcta) mcta.classList.toggle('is-on', ctaOn);
  }
  window.addEventListener('resize', measure);
  var restag = 0;
  window.addEventListener('resize', function () { clearTimeout(restag); restag = setTimeout(staggerAll, 150); });
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  /* první měření až v prvním snímku: skript tak nevynucuje rozvržení stránky a úvod se vykreslí dřív */
  requestAnimationFrame(function () { measure(); update(); });

  /* Mobilní menu */
  var btn = doc.querySelector('.hdr__menu'), menu = doc.getElementById('mnav');
  function setMenu(open) {
    btn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    btn.querySelector('.hdr__menu-t').textContent = open ? 'Zavřít' : 'Menu';
    hdr.classList.toggle('is-menu', open);
  }
  btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setMenu(false); btn.focus(); } });

  /* Nadpisy: rozdělit na slova a odhalit po řádcích */
  function split(el) {
    var html = el.innerHTML.replace(/&nbsp;/g, ' ');
    var tmp = doc.createElement('div'); tmp.innerHTML = html;
    var text = tmp.textContent.trim();
    el.setAttribute('aria-label', text.replace(/ /g, ' '));
    el.textContent = '';
    text.split(/ +/).forEach(function (w, i, arr) {
      var o = doc.createElement('span'); o.className = 'w'; o.setAttribute('aria-hidden', 'true');
      var inner = doc.createElement('span'); inner.className = 'wi'; inner.textContent = w;
      o.appendChild(inner); el.appendChild(o);
      if (i < arr.length - 1) el.appendChild(doc.createTextNode(' '));
    });
  }
  /* Velké písmeno s háčkem nebo čárkou (Č, Ž, Ř, Ú…) na druhém a dalším řádku by se dotklo řádku nad sebou:
     takový nadpis dostane větší řádkování (.lh-caps). Zalomení se tím nemění, jen svislé rozestupy. */
  var CAPDIA = /[ÁČĎÉĚÍŇÓŘŠŤÚŮÝŽÄÔĽĹŔ]/;
  function lines(spans) {
    var tops = [];
    spans.forEach(function (s) { var t = s.offsetTop; if (tops.indexOf(t) < 0) tops.push(t); });
    return tops.sort(function (a, b) { return a - b; });
  }
  function stagger(el) {
    var spans = el.querySelectorAll('.w'), tops = lines(spans);
    var caps = false;
    spans.forEach(function (s) { if (tops.indexOf(s.offsetTop) > 0 && CAPDIA.test(s.textContent)) caps = true; });
    if (caps !== el.classList.contains('lh-caps')) { el.classList.toggle('lh-caps', caps); tops = lines(spans); }
    spans.forEach(function (s) { s.firstChild.style.setProperty('--d', (tops.indexOf(s.offsetTop) * 90) + 'ms'); });
  }
  var heads = Array.prototype.slice.call(doc.querySelectorAll('.split'));
  heads.forEach(split);
  function staggerAll() { heads.forEach(stagger); }
  /* až v prvním snímku: čtení pozic slov i document.fonts.ready by jinak vynutily rozvržení celé stránky */
  requestAnimationFrame(function () {
    staggerAll();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { requestAnimationFrame(staggerAll); });
  });

  /* Odhalování: jednou, při vstupu do obrazu */
  var targets = doc.querySelectorAll('.split, .curtain, .rv');
  if (reduce || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(targets, function (t) { t.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });
    Array.prototype.forEach.call(targets, function (t) { io.observe(t); });
    window.GOLDUI.observe = function (el, cb, margin) {
      var o = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { cb(e.target); o.unobserve(e.target); } }); }, { rootMargin: margin || '0px 0px -15% 0px', threshold: 0.01 });
      o.observe(el);
    };
  }
  if (!window.GOLDUI.observe) window.GOLDUI.observe = function (el, cb) { cb(el); };

  /* Úvodní nadpis: vyjede, jakmile je načtené jeho písmo (nejdéle po 0,7 s), aby nepřeskakoval z náhradního písma */
  requestAnimationFrame(function () {
    var done = false;
    function go() { if (!done) { done = true; requestAnimationFrame(function () { doc.body.classList.add('is-ready'); }); } }
    try { if (doc.fonts && doc.fonts.load) { doc.fonts.load('800 1em Archivo').then(go, go); setTimeout(go, 700); } else go(); } catch (e) { go(); }
  });

  /* Obsah dalších kapitol (app.js, fx.js) se staví, zatímco se úvodní 3D model připravuje
     a prohlížeč překládá shadery; nejpozději ale 1 s po prvním vykreslení. Úvod má přednost. */
  var laterQ = [], laterGo = false;
  function laterRun() {
    var fn = laterQ.shift();
    if (!fn) return;
    try { fn(); } catch (e) { /* zbytek stránky běží dál */ }
    if (laterQ.length) setTimeout(laterRun, 0);
  }
  function laterFlush() { if (!laterGo) { laterGo = true; setTimeout(laterRun, 0); } }
  window.GOLDUI.later = function (fn) { laterQ.push(fn); if (laterGo && laterQ.length === 1) setTimeout(laterRun, 0); };
  window.addEventListener('gold:hero-prep', laterFlush);
  requestAnimationFrame(function () { setTimeout(laterFlush, 1000); });

  /* Fronta na chvíle klidu: 3D scény níž na stránce se připraví předem a postupně, až doběhne
     úvodní stavba mostu, aby se při scrollu nemusely zakládat a nic nesekalo. */
  var idleQ = [], idleBusy = false, idleGo = false;
  function idlePump() {
    if (!idleGo || idleBusy || !idleQ.length) return;
    idleBusy = true;
    var run = function () {
      var fn = idleQ.shift();
      try { if (fn) fn(); } catch (e) { /* scéna se připojí až při scrollu */ }
      setTimeout(function () { idleBusy = false; idlePump(); }, 500);
    };
    if (window.requestIdleCallback) requestIdleCallback(run, { timeout: 2000 }); else setTimeout(run, 150);
  }
  function idleStart() { if (!idleGo) { idleGo = true; idlePump(); } }
  window.GOLDUI.idle = function (fn) { idleQ.push(fn); idlePump(); };
  window.addEventListener('gold:hero', function () { setTimeout(idleStart, 300); });
  window.addEventListener('load', function () { setTimeout(idleStart, 6000); });
})();
