/* MOONSUIT · concept by MALUS/01 · v3 · category page */
(function () {
  'use strict';
  var M = window.MS, K = window.MSK;
  var $ = K.$, $$ = K.$$, esc = K.esc, doc = document;
  var CAT = M.categories;
  var q = new URLSearchParams(location.search);
  var state = {
    type: CAT[q.get('t')] ? q.get('t') : 'all',
    color: M.colors[q.get('c')] ? q.get('c') : 'all',
    size: 'all',
    sort: 'featured'
  };

  function ofType(t) { return M.products.filter(function (p) { return t === 'all' || p.type === t; }); }
  function inSize(p, cname) {
    if (state.size === 'all') return true;
    var cols = cname === 'all' ? p.colors : [K.C(p, cname)];
    return cols.some(function (c) { return c.sizes[state.size] === 'in' || c.sizes['One size'] === 'in'; });
  }
  function colourFor(p) {
    if (state.color !== 'all') return state.color;
    if (state.size === 'all' || p.oneSize) return p.defaultColor;
    var d = K.C(p, p.defaultColor);
    if (d.sizes[state.size] === 'in') return p.defaultColor;
    var o = p.colors.filter(function (c) { return c.sizes[state.size] === 'in'; })[0];
    return o ? o.name : p.defaultColor;
  }
  function list() {
    var l = ofType(state.type).filter(function (p) {
      return (state.color === 'all' || K.hasColor(p, state.color)) && inSize(p, state.color);
    });
    var order = M.products.slice();
    if (state.sort === 'low') l.sort(function (a, b) { return a.price - b.price || order.indexOf(a) - order.indexOf(b); });
    else if (state.sort === 'high') l.sort(function (a, b) { return b.price - a.price || order.indexOf(a) - order.indexOf(b); });
    else if (state.sort === 'new') l.sort(function (a, b) { return ((b.isNew || b.summer) ? 1 : 0) - ((a.isNew || a.summer) ? 1 : 0) || order.indexOf(a) - order.indexOf(b); });
    return l;
  }
  function sync() {
    var u = new URLSearchParams();
    if (state.type !== 'all') u.set('t', state.type);
    if (state.color !== 'all') u.set('c', state.color);
    history.replaceState(null, '', 'kategorie.html' + (u.toString() ? '?' + u.toString() : ''));
  }

  function drawHead() {
    var c = CAT[state.type], n = ofType(state.type).length;
    $('#cat-title').textContent = c.title;
    $('#crumb-here').textContent = c.label;
    doc.title = c.label + ' · MOONSUIT (concept)';
    $('#cat-n').innerHTML = '<b>' + n + '</b> ' + (n === 1 ? 'piece' : 'pieces');
    var im = $('#cat-img'), src = K.img(c.img, 1600);
    if (K.localSrc(im) !== src) {
      if (!im.getAttribute('src') || K.RM) { im.src = src; K.hd($('.cat-hero__media')); }
      else {
        im.style.opacity = 0;
        var n2 = new Image();
        n2.onload = n2.onerror = function () { setTimeout(function () { im.src = src; im.style.objectPosition = c.pos; im.style.opacity = ''; K.hd($('.cat-hero__media')); }, 250); };
        n2.src = src;
      }
    }
    im.style.objectPosition = c.pos;
    $$('.tile-c').forEach(function (t) {
      var on = t.dataset.t === state.type;
      t.classList.toggle('is-on', on);
      if (on) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
    $$('.hdr__nav a').forEach(function (a) { a.classList.toggle('is-here', a.getAttribute('href') === K.catUrl(state.type)); });
  }
  function drawTiles() {
    $('#tiles').innerHTML = Object.keys(CAT).map(function (t) {
      var c = CAT[t], n = ofType(t).length;
      return '<a class="tile-c" href="' + K.catUrl(t) + '" data-t="' + t + '"><span class="tile-c__img"><img src="' + K.img(c.tile || c.img, 600) + '" alt="" loading="lazy"></span><span class="tile-c__l"><span>' + esc(c.label) + '</span><span class="num">' + n + '</span></span></a>';
    }).join('');
  }
  function drawMoons() {
    var cols = M.colorOrder.filter(function (c) { return ofType(state.type).some(function (p) { return K.hasColor(p, c); }); });
    if (state.color !== 'all' && cols.indexOf(state.color) < 0) state.color = 'all';
    $('#cat-moons').innerHTML = '<button type="button" class="mc' + (state.color === 'all' ? ' is-on' : '') + '" data-color="all" aria-pressed="' + (state.color === 'all') + '"><span class="mc__d mc__d--all"></span><span class="mc__l">All colours</span></button>' +
      cols.map(function (c) { return '<button type="button" class="mc' + (state.color === c ? ' is-on' : '') + '" data-color="' + esc(c) + '" title="' + esc(c) + '" aria-pressed="' + (state.color === c) + '"><span class="mc__d" style="--c:' + K.hex(c) + '"></span><span class="mc__l">' + esc(c) + '</span></button>'; }).join('');
  }
  function noteEl() {
    var a = doc.createElement('a');
    a.className = 'cat-note'; a.href = 'index.html#sculpting';
    a.innerHTML = '<span class="cat-note__img"><img src="' + K.img('tech-back', 1000) + '" alt="Sculpting Legging in Blue Petrol from the back" loading="lazy"></span>' +
      '<span class="cat-note__txt"><span class="cap">Seamless Technology®</span><span class="d3">knitted in one single piece</span><p>No side seams, no stitching. Shapes where it counts. Holds where it matters.</p><span class="lnk">Meet the Sculpting Legging</span></span>';
    return a;
  }
  function drawGrid(animate) {
    var l = list(), g = $('#cat-grid');
    g.innerHTML = '';
    if (!l.length) {
      g.innerHTML = '<p class="cat-grid__empty">Nothing in ' + esc(state.color === 'all' ? '' : state.color + ' ') + (state.size === 'all' ? '' : state.size + ' ') + 'in ' + esc(CAT[state.type].label.toLowerCase()) + ' right now. <button type="button" class="textbtn" data-reset>Clear the filters</button></p>';
    }
    var note = state.color === 'all' && state.size === 'all' && l.length > 6;
    l.forEach(function (p, k) {
      if (note && k === 6) g.appendChild(noteEl());
      g.appendChild(K.cardEl(p, colourFor(p), animate ? (k % 8) : null));
    });
    if (note) K.hd(g);
    $('#cat-count').textContent = l.length + (l.length === 1 ? ' piece' : ' pieces') + (state.color === 'all' ? '' : ' in ' + state.color) + (state.size === 'all' ? '' : ', ' + state.size + ' in stock');
  }
  function drawSize() {
    var f = K.Fit.get();
    $$('#cat-size button').forEach(function (b) {
      var on = b.dataset.s === state.size;
      b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on);
      if (b.dataset.s !== 'all') b.textContent = b.dataset.s + (f && f.size === b.dataset.s ? ' · yours' : '');
    });
  }
  function all(animate) { drawHead(); drawMoons(); drawSize(); drawGrid(animate); sync(); }

  function more() {
    var track = $('#cat-rail');
    if (!track) return;
    M.products.filter(function (p) { return p.summer; }).concat(M.products.filter(function (p) { return p.isNew; })).forEach(function (p) {
      var el = K.cardEl(p, p.defaultColor); el.setAttribute('role', 'listitem'); track.appendChild(el);
    });
    K.rail(track.closest('[data-rail]'));
  }

  function init() {
    drawTiles();
    all(false);
    more();
    $('#tiles').addEventListener('click', function (e) {
      var t = e.target.closest('[data-t]');
      if (!t || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      if (state.type === t.dataset.t) return;
      state.type = t.dataset.t;
      all(true);
    });
    $('#cat-moons').addEventListener('click', function (e) { var b = e.target.closest('[data-color]'); if (b) { state.color = b.dataset.color; all(true); } });
    $('#cat-size').addEventListener('click', function (e) { var b = e.target.closest('[data-s]'); if (b) { state.size = b.dataset.s; all(true); } });
    $('#cat-sort').addEventListener('change', function (e) { state.sort = e.target.value; all(true); });
    $('#cat-grid').addEventListener('click', function (e) { if (e.target.closest('[data-reset]')) { state.color = 'all'; state.size = 'all'; all(true); } });
    doc.addEventListener('fit:change', drawSize);
    K.reveal(doc);
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
