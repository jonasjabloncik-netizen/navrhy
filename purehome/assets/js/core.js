/* PURE HOME v2 · společné nástroje: výběr prvků, formátování, scroll motor, hlavička, odhalování, kontakty. */
(function (W, D) {
  'use strict';
  var H = D.documentElement;

  var C = {
    $: function (s, r) { return (r || D).querySelector(s); },
    $$: function (s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); },
    esc: function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); },
    fmt: function (n) { return Math.round(n).toLocaleString('cs-CZ').replace(/\s/g, ' '); },
    kc: function (n) { return C.fmt(n) + ' Kč'; },
    clamp: function (v, a, b) { return v < a ? a : v > b ? b : v; },
    lerp: function (a, b, t) { return a + (b - a) * t; },
    sub: function (p, a, b) { return C.clamp((p - a) / (b - a), 0, 1); },
    eo: function (t) { return 1 - Math.pow(1 - t, 3); },                     /* ease out */
    eio: function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    expo: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); },
    RM: H.classList.contains('rm'),
    fine: W.matchMedia && W.matchMedia('(hover: hover) and (pointer: fine)').matches,
    mobile: function () { return W.innerWidth <= 820; },
    rand: function (seed) { var s = seed >>> 0 || 1; return function () { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; }
  };

  /* ---------- toast ---------- */
  var toastT;
  C.toast = function (msg) {
    var t = C.$('.toast'); if (!t) return;
    t.textContent = msg; t.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('is-on'); }, 3200);
  };

  /* ---------- scroll motor: průběh přišpendlených scén 0..1 ---------- */
  C.Scroll = (function () {
    var items = [], vh = W.innerHeight, raf = 0;
    function measure() {
      vh = W.innerHeight;
      var y = W.pageYOffset;
      items.forEach(function (it) { var r = it.el.getBoundingClientRect(); it.top = r.top + y; it.h = it.el.offsetHeight; });
      frame();
    }
    function frame() {
      raf = 0;
      var y = W.pageYOffset;
      for (var i = 0; i < items.length; i++) {
        var it = items[i], span = Math.max(1, it.h - vh);
        var raw = (y - it.top) / span;
        var vis = y + vh > it.top - 1 && y < it.top + it.h + 1;
        if (vis || it.vis) it.fn(C.clamp(raw, 0, 1), vis, raw);
        it.vis = vis;
      }
    }
    function tick() { if (!raf) raf = W.requestAnimationFrame(frame); }
    W.addEventListener('scroll', tick, { passive: true });
    var rt; W.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(measure, 120); });
    W.addEventListener('load', measure);
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(measure);
    return {
      add: function (el, fn) { var it = { el: el, fn: fn, top: 0, h: 1, vis: false }; items.push(it); return it; },
      measure: measure, tick: tick,
      vh: function () { return vh; }
    };
  })();

  /* ---------- hlavička ---------- */
  C.header = function (opt) {
    var base = (opt && opt.base) || '';
    var hdr = C.$('.hdr'), menu = C.$('#menu'), btn = C.$('.hdr__menu');
    var navHost = C.$('[data-render="nav"]'), menuHost = C.$('[data-render="menu"]'), foot = C.$('[data-render="menu-foot"]');
    var links = PH.nav.map(function (n) { return '<a href="' + base + '#' + n.id + '" data-nav="' + n.id + '">' + C.esc(n.label) + '</a>'; }).join('');
    navHost.innerHTML = links; menuHost.innerHTML = links;
    foot.innerHTML = '<a class="btn" href="' + base + '#poptavka">Poptat úklid</a><a class="btn btn--ghost" href="tel:' + PH.contact.phone.replace(/\s/g, '') + '" data-c="phone-link">Zavolat</a>';

    function setMenu(open) {
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Zavřít' : 'Menu';
      if (open) { menu.hidden = false; requestAnimationFrame(function () { menu.classList.add('is-open'); }); H.style.overflow = 'hidden'; hdr.dataset.prev = hdr.dataset.theme; hdr.dataset.theme = 'light'; }
      else { menu.classList.remove('is-open'); menu.hidden = true; H.style.overflow = ''; if (hdr.dataset.prev) hdr.dataset.theme = hdr.dataset.prev; }
    }
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    D.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });

    /* téma a podklad hlavičky: tmavá scéna filmu → bílé písmo; po filmu pevný světlý pruh */
    C.theme = function (t) { if (menu.hidden) hdr.dataset.theme = t; else hdr.dataset.prev = t; };
    var film = C.$('.day');
    function solid() {
      var y = W.pageYOffset, end = film ? film.offsetTop + film.offsetHeight - 80 : 80;
      hdr.classList.toggle('is-solid', y > end);
    }
    W.addEventListener('scroll', solid, { passive: true }); solid();

    /* aktivní položka menu */
    if ('IntersectionObserver' in W) {
      var map = {};
      C.$$('[data-nav]').forEach(function (a) { (map[a.dataset.nav] = map[a.dataset.nav] || []).push(a); });
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (e) {
          if (!map[e.target.id]) return;
          map[e.target.id].forEach(function (a) { a.setAttribute('aria-current', String(e.isIntersecting)); });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      PH.nav.forEach(function (n) { var s = D.getElementById(n.id); if (s) io.observe(s); });
    }
  };

  /* ---------- nadpisy po řádcích ---------- */
  C.split = function (el) {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    var words = el.dataset.text.split(/\s+/);
    el.innerHTML = words.map(function (w) { return '<span class="w">' + C.esc(w) + '</span>'; }).join(' ');
    var lines = [], last = null;
    C.$$('.w', el).forEach(function (s) {
      var t = s.offsetTop;
      if (last === null || Math.abs(t - last) > 4) { lines.push([]); last = t; }
      lines[lines.length - 1].push(s.textContent);
    });
    el.innerHTML = lines.map(function (l, i) { return '<span class="ln" style="--i:' + i + '"><span>' + C.esc(l.join(' ')) + '</span></span>'; }).join('');
  };
  C.reveal = function (root) {
    var els = C.$$('[data-rv], [data-split]', root);
    var splits = C.$$('[data-split]', root);
    function doSplit() { splits.forEach(function (el) { C.split(el); }); }
    if (C.RM || !('IntersectionObserver' in W)) { els.forEach(function (e) { e.classList.add('is-in'); }); H.classList.add('no-split'); return; }
    var go = function () { doSplit(); };
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(go); else go();
    var rt; W.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(doSplit, 200); });
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    els.forEach(function (e) { io.observe(e); });
  };

  /* ---------- kontakty (ukázkové hodnoty se jen ohlásí) ---------- */
  C.contacts = function () {
    D.addEventListener('click', function (e) {
      var a = e.target.closest('[data-c], [data-sample]');
      if (!a) return;
      var k = a.dataset.c || a.dataset.sample;
      var key = k.indexOf('phone') === 0 ? 'phone' : k.indexOf('email') === 0 ? 'email' : k;
      if (a.hasAttribute('data-sample') || (PH.contact.sample && PH.contact.sample[key])) { e.preventDefault(); C.toast(PH.concept.sampleToast); }
    });
  };

  W.PHC = C;
})(window, document);
