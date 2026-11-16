/* GOLD Institute · společné chování stránky (hlavička, kapitoly, menu, odhalování) */
(function () {
  'use strict';
  var doc = document;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.GOLDUI = { reduce: reduce };

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
    var ctaOn = y > vh * 0.9 && !(ir.top < vh && ir.bottom > 0);

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
  measure();
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();

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
  function stagger(el) {
    var tops = [], spans = el.querySelectorAll('.w');
    spans.forEach(function (s) { var t = s.offsetTop; if (tops.indexOf(t) < 0) tops.push(t); });
    tops.sort(function (a, b) { return a - b; });
    spans.forEach(function (s) { s.firstChild.style.setProperty('--d', (tops.indexOf(s.offsetTop) * 90) + 'ms'); });
  }
  var heads = Array.prototype.slice.call(doc.querySelectorAll('.split'));
  heads.forEach(split);
  function staggerAll() { heads.forEach(stagger); }
  staggerAll();
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(staggerAll);

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

  /* Úvodní nadpis */
  requestAnimationFrame(function () { doc.body.classList.add('is-ready'); });
})();
