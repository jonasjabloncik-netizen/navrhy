/* PURE HOME v8 · společné nástroje: výběr prvků, formátování, scroll motor, hlavička, patička, odhalování.
   v6: jeden scroll motor pro všechno (žádné čtení rozvržení při scrollu), zápisy stylů jen při změně,
   výška scén podle přišpendleného panelu (100svh), na telefonu se nic nepřepočítává, když se jen
   schová nebo ukáže lišta prohlížeče. */
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
    touch: !!(W.matchMedia && W.matchMedia('(hover: none), (pointer: coarse)').matches),
    mobile: function () { return W.innerWidth <= 820; },
    rand: function (seed) { var s = seed >>> 0 || 1; return function () { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; }
  };

  /* zápis stylu jen když se hodnota opravdu změnila (bez zbytečného přepočtu stylů) */
  C.css = function (el, prop, val) { var c = el._c || (el._c = {}); if (c[prop] !== val) { c[prop] = val; el.style[prop] = val; } };
  C.cssVar = function (el, name, val) { var c = el._c || (el._c = {}); if (c[name] !== val) { c[name] = val; el.style.setProperty(name, val); } };

  /* změna velikosti okna: na dotykových zařízeních jen při změně šířky (otočení), ne při schování lišty prohlížeče */
  var rq = [], lastW = W.innerWidth, lastH = W.innerHeight, rzt;
  C.onResize = function (fn) { rq.push(fn); };
  W.addEventListener('resize', function () {
    clearTimeout(rzt);
    rzt = setTimeout(function () {
      var w = W.innerWidth, h = W.innerHeight, go = w !== lastW || (!C.touch && h !== lastH);
      lastW = w; lastH = h;
      if (go) for (var i = 0; i < rq.length; i++) rq[i]();
    }, 140);
  });

  /* ---------- toast ---------- */
  var toastT;
  C.toast = function (msg) {
    var t = C.$('.toast'); if (!t) return;
    t.textContent = msg; t.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('is-on'); }, 3200);
  };

  /* ---------- scroll motor: průběh přišpendlených scén 0..1 + hlídače (hlavička, lišta) ----------
     Pozice sekcí se měří jen při načtení, změně šířky a změně výšky stránky. Při scrollu se už nic
     neměří, jen se počítá z uložených čísel. */
  C.Scroll = (function () {
    var items = [], watchers = [], raf = 0, mq = 0;
    function measure() {
      mq = 0;
      var y = W.pageYOffset, vh = W.innerHeight;
      items.forEach(function (it) {
        var r = it.el.getBoundingClientRect(); it.top = r.top + y; it.h = it.el.offsetHeight;
        it.ph = it.pin ? it.pin.offsetHeight : vh;            /* přišpendlený panel má stálou výšku 100svh */
      });
      watchers.forEach(function (w) { if (w.measure) w.measure(y); });
      frame();
    }
    function frame() {
      raf = 0;
      var y = W.pageYOffset, vh = W.innerHeight;
      for (var i = 0; i < items.length; i++) {
        var it = items[i], span = Math.max(1, it.h - it.ph);
        var raw = (y - it.top) / span;
        var vis = y + vh > it.top - 1 && y < it.top + it.h + 1;
        if (vis || it.vis) it.fn(C.clamp(raw, 0, 1), vis, raw);
        if (vis !== it.vis && it.onVis) it.onVis(vis);
        it.vis = vis;
      }
      for (var j = 0; j < watchers.length; j++) watchers[j].fn(y, vh);
    }
    function tick() { if (!raf) raf = W.requestAnimationFrame(frame); }
    function later() { if (!mq) mq = W.requestAnimationFrame(measure); }
    W.addEventListener('scroll', tick, { passive: true });
    C.onResize(later);
    W.addEventListener('load', later);
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(later);
    /* když se změní výška stránky (krok poptávky, načtená fotka), přeměří se pozice */
    if ('ResizeObserver' in W) { var bodyH = 0; new ResizeObserver(function (en) { var h = en[0].contentRect.height; if (Math.abs(h - bodyH) > 1) { bodyH = h; later(); } }).observe(D.body); }
    return {
      add: function (el, fn, opt) { var it = { el: el, fn: fn, top: 0, h: 1, ph: W.innerHeight, vis: false, pin: opt && opt.pin, onVis: opt && opt.onVis }; items.push(it); return it; },
      watch: function (w) { watchers.push(w); return w; },
      measure: measure, tick: tick, later: later,
      vh: function () { return W.innerHeight; }
    };
  })();

  /* ---------- hlavička ---------- */
  C.header = function (opt) {
    var base = (opt && opt.base) || '';
    var hdr = C.$('.hdr'), menu = C.$('#menu'), btn = C.$('.hdr__menu');
    var navHost = C.$('[data-render="nav"]'), menuHost = C.$('[data-render="menu"]'), foot = C.$('[data-render="menu-foot"]');
    var links = PH.nav.map(function (n) { return '<a href="' + base + '#' + n.id + '" data-nav="' + n.id + '">' + C.esc(n.label) + '</a>'; }).join('');
    navHost.innerHTML = links; menuHost.innerHTML = links;
    foot.innerHTML = '<a class="btn" href="' + base + '#poptavka">Poptat úklid</a><a class="btn btn--ghost" href="' + C.tel(PH.contact.phone) + '">Zavolat</a>' +
      '<p class="menu__legal"><a href="podminky.html">Obchodní podmínky</a><a href="osobni-udaje.html">Osobní údaje</a></p>';

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
    var film = C.$('.day'), filmEnd = 80, isSolid = null;
    C.Scroll.watch({
      measure: function (y) { filmEnd = film ? film.getBoundingClientRect().top + y + film.offsetHeight - 80 : 80; },
      fn: function (y) { var s = y > filmEnd; if (s !== isSolid) { isSolid = s; hdr.classList.toggle('is-solid', s); } }
    });

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
    if (C.RM || !('IntersectionObserver' in W)) { els.forEach(function (e) { e.classList.add('is-in'); }); H.classList.add('no-split'); return; }
    /* nadpis se rozdělí na řádky až kousek před tím, než přijede do obrazu (ne během úvodní animace) */
    var ioS = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { C.split(e.target); e.target._split = true; ioS.unobserve(e.target); } });
    }, { rootMargin: '0px 0px 120% 0px' });
    function arm() { splits.forEach(function (el) { ioS.observe(el); }); }
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(arm); else arm();
    C.onResize(function () { splits.forEach(function (el) { if (el._split) C.split(el); }); });
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    els.forEach(function (e) { io.observe(e); });
  };

  /* ---------- kontakty a odkazy ---------- */
  C.tel = function (n) { return 'tel:' + n.replace(/\s/g, ''); };
  C.wa = function () { return 'https://wa.me/' + PH.contact.whatsapp; };
  C.ig = function () { return 'https://www.instagram.com/' + PH.contact.instagram + '/'; };
  C.mail = function (e) { return C.esc(e).replace('@', '@<wbr>'); };
  C.fb = function (label) {
    var CT = PH.contact;
    return CT.facebookUrl ? '<a href="' + C.esc(CT.facebookUrl) + '" target="_blank" rel="noopener">' + C.esc(label || CT.facebook) + '</a>' : '<span>' + C.esc(label ? label + ': ' + CT.facebook : CT.facebook) + '</span>';
  };

  /* ---------- patička (stejná na všech stránkách) ---------- */
  C.footer = function (base) {
    base = base || '';
    var CT = PH.contact, esc = C.esc, host = C.$('[data-render="footer"]'); if (!host) return;
    var ext = ' target="_blank" rel="noopener"';
    host.innerHTML = '<div class="wrap"><img class="ftr__logo" src="assets/img/logo-full.svg" alt="PURE HOME Ostrava, profesionální úklidové služby" width="1086" height="766" loading="lazy">' +
      '<div class="ftr__grid">' +
      '<div class="ftr__about"><h3>PURE HOME Ostrava</h3><p class="muted">' + esc(PH.brand.claim) + ' a okolí. Uklízí Ivana osobně.</p>' +
      '<p class="ftr__id">' + esc(CT.owner) + '<br>IČO ' + esc(CT.ico) + '<br>' + esc(CT.seat) + '<br>' + esc(CT.vat) + '</p></div>' +
      '<div><h3>Stránky</h3>' + PH.nav.reduce(function (a, n) { a.push(n); if (n.id === 'poptavka') a.push({ id: 'cenik', label: 'Ceník' }); return a; }, [])
        .map(function (n) { return '<a href="' + base + '#' + n.id + '">' + esc(n.label) + '</a>'; }).join('<br>') + '</div>' +
      '<div><h3>Kontakt</h3><a href="' + C.tel(CT.phone) + '">' + esc(CT.phone) + '</a><br><a href="' + C.wa() + '"' + ext + '>WhatsApp</a><br><a href="mailto:' + CT.email + '">' + C.mail(CT.email) + '</a><br>' +
      '<a href="' + C.ig() + '"' + ext + '>Instagram</a><br>' + C.fb('Facebook') + '</div>' +
      '<div><h3>Dokumenty</h3><a href="podminky.html">Obchodní podmínky</a><br><a href="podminky.html#odstoupeni">Odstoupení od smlouvy</a><br><a href="podminky.html#formular">Formulář pro odstoupení</a><br><a href="osobni-udaje.html">Osobní údaje</a></div>' +
      '</div><p class="ftr__note">' + esc(PH.concept.footer) + '</p></div>';
  };

  W.PHC = C;
})(window, document);
