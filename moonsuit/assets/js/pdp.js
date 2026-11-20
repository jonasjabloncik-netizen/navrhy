/* MOONSUIT · concept by MALUS/01 · v3 · product page */
(function () {
  'use strict';
  var M = window.MS, K = window.MSK;
  var $ = K.$, $$ = K.$$, esc = K.esc, fmt = K.fmt, P = K.P;
  var doc = document;

  var q = new URLSearchParams(location.search);
  var p = P(q.get('p')) || P('sculpting-legging');
  var color = K.hasColor(p, q.get('c')) ? q.get('c') : p.defaultColor;
  var size = null, setSizes = {}, gi = 0;
  var TYPE = { leggings: 'Leggings', bras: 'Sports bras', tops: 'Tops', shorts: 'Shorts', accessories: 'Accessories' };

  function instock(s) { return K.sizeState(p, color, s) === 'in'; }
  function defaultSize() {
    var av = K.availSizes(p, color).filter(instock);
    if (p.oneSize) return av[0] || null;
    var f = K.Fit.get();
    if (f && av.indexOf(f.size) > -1) return null; // offered, user confirms with one click
    return av.length === 1 ? av[0] : null;
  }

  /* ---------- gallery ---------- */
  function imgs() { return K.media(p, color); }
  function drawGallery() {
    var m = imgs(), list = m.imgs;
    gi = Math.min(gi, list.length - 1);
    $('#thumbs').innerHTML = list.map(function (n, i) {
      return '<button type="button" class="' + (i === gi ? 'is-on' : '') + '" data-gi="' + i + '" aria-label="Photo ' + (i + 1) + ' of ' + list.length + '"><img src="' + K.img(n, 200) + '" alt="" loading="lazy"></button>';
    }).join('');
    var main = $('#gimg');
    main.alt = p.name + ' in ' + (m.shown || color);
    swapMain(K.img(list[gi], 1600));
    $('#gcount').textContent = (m.shown ? 'Shown in ' + m.shown + ' · ' : '') + (gi + 1) + ' / ' + list.length;
    $('#gstrip').innerHTML = list.map(function (n, i) {
      return '<button type="button" data-lb="' + i + '" aria-label="Open photo ' + (i + 1) + '"><img src="' + K.img(n, 1200) + '" alt="' + esc(p.name) + '" loading="' + (i ? 'lazy' : 'eager') + '">' + (i === 0 && m.shown ? '<span class="card__shown">Shown in ' + esc(m.shown) + '</span>' : '') + '</button>';
    }).join('');
    K.hd($('#gstrip'));
  }
  function swapMain(src) {
    var a = $('#gimg');
    if (a.getAttribute('src') && K.localSrc(a) === src) return;
    if (K.RM || !a.getAttribute('src')) { a.src = src; K.hd($('#gmain')); return; }
    a.classList.add('is-off');
    var n = new Image();
    n.onload = n.onerror = function () { setTimeout(function () { a.src = src; a.classList.remove('is-off'); K.hd($('#gmain')); }, 120); };
    n.src = src;
  }

  /* ---------- info ---------- */
  function sizeBtn(s) {
    var st = K.sizeState(p, color, s), f = K.Fit.get();
    var rec = f && f.size === s && st === 'in';
    var sub = st === 'out' ? 'Sold out' : st === 'none' ? 'Not in ' + color : rec ? 'Your size' : (p.oneSize ? 'Fits all' : (s === 'XS/S' ? 'EU 34–36' : 'EU 38–40'));
    return '<button type="button" class="sz' + (size === s ? ' is-on' : '') + (rec ? ' is-rec' : '') + '" data-size="' + esc(s) + '"' + (st !== 'in' ? ' disabled' : '') + ' aria-pressed="' + (size === s) + '"><b>' + esc(s) + '</b><small>' + esc(sub) + '</small></button>';
  }
  function fitLine() {
    if (p.oneSize) return '';
    var f = K.Fit.get();
    if (!f) return '<div class="fitline"><span>Two sizes. Not sure which is yours?</span><button type="button" data-open="fitd">Find my size in 10 seconds</button></div>';
    var st = K.sizeState(p, color, f.size);
    if (st === 'in') return '<div class="fitline"><span>For your ' + f.h + ' cm and EU ' + f.eu + ' we recommend <b>' + f.size + '</b></span>' + (size === f.size ? '<span>Selected</span>' : '<button type="button" data-pick="' + f.size + '">Select ' + f.size + '</button>') + '</div>';
    return '<div class="fitline"><span>Your size is <b>' + f.size + '</b>, ' + (st === 'out' ? 'sold out in ' + esc(color) + ' right now.' : 'which is not made in ' + esc(color) + '.') + '</span><button type="button" data-open="fitd">Check again</button></div>';
  }
  function addLabel() {
    var av = K.availSizes(p, color).filter(instock);
    if (!av.length) return 'Sold out in ' + color;
    if (!size) return p.oneSize ? 'Add to bag · ' + fmt(p.price) : 'Choose your size';
    if (K.Bag.has(p.handle, color, size) && justAdded) return '✓ In your bag · ' + size;
    return 'Add to bag · ' + size + ' · ' + fmt(p.price);
  }
  var justAdded = false;
  function delivText() {
    var bag = K.Bag.total();
    if (bag >= M.freeShipping) return { p: 1, t: '<b>Free delivery unlocked</b> for your bag.' };
    if (bag + p.price >= M.freeShipping) return { p: (bag + p.price) / M.freeShipping, t: 'This piece <b>unlocks free delivery</b> (over ' + fmt(M.freeShipping) + ').' };
    return { p: (bag + p.price) / M.freeShipping, t: 'Free delivery over ' + fmt(M.freeShipping) + '. With this piece you are <b>' + fmt(M.freeShipping - bag - p.price) + '</b> away.' };
  }
  function suggestions() {
    return (p.suggest || []).map(function (h) { var sp = P(h); return sp ? { p: sp, c: K.hasColor(sp, color) ? color : sp.defaultColor } : null; }).filter(Boolean);
  }
  function setHTML() {
    var sg = suggestions();
    if (!sg.length) return '';
    var total = p.price + sg.reduce(function (a, x) { return a + x.p.price; }, 0);
    return '<div class="pset"><div class="opt__head"><span>Complete the set</span><span class="val num">' + fmt(total) + ' together</span></div><div class="pset__list">' +
      sg.map(function (x) {
        var av = K.availSizes(x.p, x.c);
        if (!setSizes[x.p.handle]) {
          var want = size || (K.Fit.get() || {}).size;
          var ok = av.filter(function (s) { return K.sizeState(x.p, x.c, s) === 'in'; });
          setSizes[x.p.handle] = ok.indexOf(want) > -1 ? want : ok[0];
        }
        var m = K.media(x.p, x.c);
        return '<div class="pset__item"><a href="' + K.pdpUrl(x.p, x.c) + '"><img src="' + K.img(m.imgs[0], 360) + '" alt="' + esc(x.p.name) + '" loading="lazy"></a><div>' +
          '<div class="pset__top"><p class="pset__name"><a href="' + K.pdpUrl(x.p, x.c) + '">' + esc(x.p.name) + '</a></p>' + K.priceHTML(x.p) + '</div>' +
          '<p class="pset__meta">' + esc(x.c) + (m.shown ? ' (photo shows ' + esc(m.shown) + ')' : '') + '</p>' +
          '<div class="seg" role="group" aria-label="Size for ' + esc(x.p.name) + '">' + av.map(function (s) {
            var st = K.sizeState(x.p, x.c, s);
            return '<button type="button" data-ssize="' + esc(s) + '" data-h="' + x.p.handle + '" class="' + (setSizes[x.p.handle] === s ? 'is-on' : '') + '"' + (st !== 'in' ? ' disabled aria-label="' + esc(s) + ' sold out"' : '') + '>' + esc(s) + '</button>';
          }).join('') + '</div></div></div>';
      }).join('') + '</div><div class="pset__foot"><button type="button" class="btn btn--line btn--wide" id="setbtn">Add the set · ' + (sg.length + 1) + ' pieces · ' + fmt(total) + '</button><p class="look__hint" id="sethint" aria-live="polite"></p></div></div>';
  }
  function accHTML() {
    var g = M.sizeGuide;
    return '<div class="acc">' +
      '<details open><summary class="cap">Details</summary><div class="acc__body"><p>' + esc(p.tagline) + '</p><ul>' + p.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul></div></details>' +
      '<details><summary class="cap">Fabric &amp; care</summary><div class="acc__body"><p>' + esc(M.fabric) + '</p><p>' + esc(M.care) + '</p></div></details>' +
      (p.oneSize ? '' : '<details><summary class="cap">Size &amp; fit</summary><div class="acc__body"><p>' + esc(g.note) + '</p>' + K.chartHTML((K.Fit.get() || {}).size) + '</div></details>') +
      '<details><summary class="cap">Delivery &amp; payment</summary><div class="acc__body"><p>' + esc(M.shipping.free) + '.</p><p>' + esc(M.shipping.casablanca) + '. ' + esc(M.shipping.nationwide) + '.</p><p>' + esc(M.shipping.payment) + '.</p></div></details>' +
      '<details><summary class="cap">Returns</summary><div class="acc__body"><p>' + esc(M.shipping.returns) + '</p><p>Questions? WhatsApp ' + esc(M.brand.whatsapp) + ' or ' + esc(M.brand.email) + '.</p></div></details>' +
      '</div>';
  }
  function availHTML() {
    var d = delivText(), st = size ? K.sizeState(p, color, size) : null;
    var stock = p.oneSize ? '<b>In stock</b>' : (size && st === 'in' ? '<b>In stock</b> in ' + esc(size) : (K.availSizes(p, color).some(function (s2) { return K.sizeState(p, color, s2) === 'in'; }) ? 'Pick a size to see stock' : '<b>Sold out</b> in ' + esc(color)));
    return '<ul class="avail">' +
      '<li class="is-in"><span>' + stock + ' · Casablanca 1–3 days, rest of Morocco 3–7 business days</span></li>' +
      '<li><span>' + d.t + '</span></li>' +
      '<li><span>Cash on delivery or bank transfer</span></li>' +
      '<li><span>Returns within 24 h of delivery, as store credit</span></li></ul>';
  }
  function swatchHTML(c) {
    var any = Object.keys(c.sizes).some(function (s2) { return c.sizes[s2] === 'in'; });
    return '<button type="button" data-color="' + esc(c.name) + '" class="mc' + (c.name === color ? ' is-on' : '') + (any ? '' : ' is-out') + '" aria-pressed="' + (c.name === color) + '" aria-label="' + esc(c.name) + (any ? '' : ', sold out') + '">' +
      '<span class="mc__d" style="--c:' + K.hex(c.name) + '"></span><span class="mc__l">' + esc(c.name) + '</span></button>';
  }
  /* the colour as it was shot: open the shoppable story at this piece */
  function storyAt() {
    var S = M.stories || [];
    for (var k = 0; k < S.length; k++) for (var j = 0; j < S[k].items.length; j++) { var it = S[k].items[j]; if (it[0] === p.handle && it[1] === color) return [k, j]; }
    return null;
  }
  function storyHTML() {
    var at = storyAt(); if (!at) return '';
    var st = M.stories[at[0]];
    return '<button type="button" class="pstory" data-story="' + at[0] + '" data-frame="' + at[1] + '" style="--mc:' + st.mc + '"><span class="stb__ring"><img src="' + K.img(st.items[at[1]][2], 200) + '" alt=""></span><span><b>See it in the ' + esc(st.label) + ' story</b><small>' + st.items.length + ' photos from the shoot, shop straight from them</small></span></button>';
  }
  function drawInfo() {
    var revs = M.productReviews[p.handle] || [];
    var flags = (p.compare ? '<span class="is-sale">' + K.pct(p) + '% off</span>' : '') + (p.summer ? '<span>Summer Edition</span>' : '') + (p.isNew ? '<span>New</span>' : '');
    var shown = K.media(p, color).shown;
    $('#info').innerHTML =
      '<p class="cap info__type">' + esc(TYPE[p.type]) + '</p>' +
      (flags ? '<div class="info__flags">' + flags + '</div>' : '') +
      '<h1>' + esc(p.name) + '</h1>' +
      '<div class="info__sub">' + K.priceHTML(p) + (p.compare ? '<span class="price"><span class="save">You save ' + fmt(p.compare - p.price) + '</span></span>' : '') +
      (revs.length ? '<span class="info__rating">' + (p.rating && p.rating.value ? '<span class="stars" aria-hidden="true">★★★★★</span><span>' + p.rating.value + '</span>' : '') + '<a href="#reviews">' + revs.length + (revs.length === 1 ? ' review' : ' reviews') + '</a></span>' : '') + '</div>' +
      '<p class="info__tag">' + esc(p.tagline) + '</p>' +
      '<div class="opt"><div class="opt__head"><span>Colour <b>' + esc(color) + '</b>' + (shown ? ' <span class="mut">· photo shows ' + esc(shown) + '</span>' : '') + '</span><span class="mut">' + p.colors.length + (p.colors.length === 1 ? ' colour' : ' colours') + '</span></div>' +
      '<div class="swi" role="group" aria-label="Colour">' + p.colors.map(swatchHTML).join('') + '</div>' + storyHTML() + '</div>' +
      '<div class="opt" id="sizes-opt"><div class="opt__head"><span>Size' + (size ? ' <b>' + esc(size) + '</b>' : '') + '</span>' + (p.oneSize ? '' : '<button type="button" class="textbtn" data-open="fitd">Find my size</button>') + '</div>' +
      '<div class="sizes' + (p.oneSize ? ' sizes--one' : '') + '" role="group" aria-label="Size">' + K.sizesFor(p).map(sizeBtn).join('') + '</div>' + fitLine() + '</div>' +
      '<div class="buy"><button type="button" class="btn btn--block' + (justAdded ? ' is-added' : '') + '" id="addbtn">' + esc(addLabel()) + '</button><p class="look__hint" id="addhint" aria-live="polite"></p>' +
      '<div class="buy__after' + (justAdded ? ' is-on' : '') + '" id="after"><span>' + K.Bag.count() + (K.Bag.count() === 1 ? ' piece' : ' pieces') + ' in your bag</span><button type="button" data-open="bag">View bag (' + K.Bag.count() + ')</button></div></div>' +
      availHTML() + setHTML() + accHTML();
    drawSbar();
  }

  /* ---------- sticky bar ---------- */
  function drawSbar() {
    var m = K.media(p, color);
    $('#sbar-in').innerHTML = '<img src="' + K.img(m.imgs[0], 160) + '" alt="">' +
      '<p class="sbar__t"><b>' + esc(p.name) + '</b><span>' + esc(color) + ' · ' + (size ? esc(size) : (p.oneSize ? 'One size' : 'choose a size')) + ' · ' + fmt(p.price) + '</span></p>' +
      (p.oneSize ? '<span></span>' : '<div class="seg">' + K.availSizes(p, color).map(function (s) { var st = K.sizeState(p, color, s); return '<button type="button" data-size="' + esc(s) + '" class="' + (size === s ? 'is-on' : '') + '"' + (st !== 'in' ? ' disabled' : '') + '>' + esc(s) + '</button>'; }).join('') + '</div>') +
      '<button type="button" class="btn' + (justAdded ? ' is-added' : '') + '" data-buy>' + esc(justAdded ? '✓ In your bag' : (size || p.oneSize ? 'Add to bag' : 'Choose size')) + '</button>';
  }

  /* ---------- reviews + more ---------- */
  function drawReviews() {
    var revs = M.productReviews[p.handle] || [], sec = $('#reviews');
    if (!revs.length) { sec.hidden = true; return; }
    $('#rev-head').innerHTML = '<h2 class="d2">reviews</h2><div class="rev__score" style="margin-top:22px">' + (p.rating && p.rating.value ? '<b>' + p.rating.value + '</b><span><span class="stars" aria-hidden="true">★★★★★</span> ' : '<span>') + revs.length + ' verified ' + (revs.length === 1 ? 'review' : 'reviews') + ' from moonsuitactive.com</span></div>';
    $('#rev-list').innerHTML = revs.map(function (r) {
      return '<div class="prev__item"><div class="prev__who"><b>' + esc(r.name) + '</b><span class="ver">✓ Verified buyer</span><span class="muted">' + esc(r.date) + (r.item ? ' · ' + esc(r.item) : '') + '</span></div><blockquote>' + esc(r.text) + '</blockquote></div>';
    }).join('');
  }
  function drawMore() {
    var same = M.products.filter(function (x) { return x !== p && x.type === p.type; });
    var rest = M.products.filter(function (x) { return x !== p && x.type !== p.type && (p.suggest || []).indexOf(x.handle) === -1; });
    var list = same.concat(rest).slice(0, 8), g = $('#more-grid');
    list.forEach(function (x) { var el = K.cardEl(x, K.hasColor(x, color) ? color : x.defaultColor); el.setAttribute('role', 'listitem'); g.appendChild(el); });
    K.rail(g.closest('[data-rail]'));
  }

  /* ---------- lightbox ---------- */
  var lbi = 0;
  function lbOpen(i) {
    lbi = i;
    var lb = $('#lb');
    lbDraw();
    lb.hidden = false; void lb.offsetWidth; lb.classList.add('is-on');
    K.hd(lb);
    doc.documentElement.style.overflow = 'hidden';
    $('.x', lb).focus();
  }
  function lbDraw() {
    var list = imgs().imgs;
    lbi = (lbi + list.length) % list.length;
    $('#lb-img').src = K.img(list[lbi], 2400);
    $('#lb-img').alt = p.name + ', photo ' + (lbi + 1);
    $('#lb-n').textContent = (lbi + 1) + ' / ' + list.length;
    if (!$('#lb').hidden) K.hd($('#lb'));
  }
  function lbClose() { var lb = $('#lb'); lb.classList.remove('is-on'); doc.documentElement.style.overflow = ''; setTimeout(function () { lb.hidden = true; }, 350); }

  /* ---------- fit drawer ---------- */
  function drawFitDrawer() {
    var saved = K.Fit.get();
    $('#fitd-form').innerHTML = K.fitFormHTML('pdp', saved);
    var form = $('[data-fitform]', $('#fitd'));
    function show(v, persist) {
      var r = K.Fit.recommend(v.h, v.eu, v.pref);
      var st = K.sizeState(p, color, r.size);
      $('#fitd-res').innerHTML = '<p class="cap">Your Moonsuit size</p><p class="fit__size"><span>' + r.size + '</span></p><p class="fit__why">' + esc(r.why) + '</p>' +
        '<div style="margin-top:18px">' + (st === 'in' ? '<button type="button" class="btn btn--wide" data-pick="' + r.size + '" data-close-after>Select ' + r.size + ' in ' + esc(color) + '</button>' : '<p class="fit__why"><b>' + r.size + ' is ' + (st === 'out' ? 'sold out' : 'not made') + ' in ' + esc(color) + '.</b> Try another colour.</p>') + '</div>' +
        '<div style="margin-top:22px">' + K.chartHTML(r.size) + '</div>';
      if (persist) K.Fit.set(r);
    }
    K.bindFitForm(form, function (v) { show(v, true); });
    show(saved || { h: 165, eu: 36, pref: 'sculpt' }, false);
  }

  /* ---------- actions ---------- */
  function selectSize(s) {
    if (K.sizeState(p, color, s) !== 'in') return;
    size = s; justAdded = false;
    drawInfo();
    var b = $('[data-size="' + s + '"]', $('#info'));
    if (b) b.focus({ preventScroll: true });
  }
  function selectColor(c) {
    if (c === color) return;
    color = c; gi = 0; setSizes = {}; justAdded = false;
    if (size && K.sizeState(p, color, size) !== 'in') size = null;
    if (!size) size = defaultSize();
    history.replaceState(null, '', K.pdpUrl(p, color));
    document.title = p.name + ' · ' + color + ' · MOONSUIT (concept)';
    drawGallery(); drawInfo();
    var b = $('[data-color="' + c + '"]', $('#info'));
    if (b) b.focus({ preventScroll: true });
  }
  function buy() {
    if (!size && !p.oneSize) {
      var h = $('#addhint');
      h.textContent = 'Pick XS/S or M/L first. Not sure? Use Find my size.';
      var so = $('#sizes-opt');
      if (so && window.innerWidth <= 900) so.scrollIntoView({ behavior: K.RM ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    var s = size || K.availSizes(p, color).filter(instock)[0];
    if (K.addToBag(p.handle, color, s)) { size = s; justAdded = true; drawInfo(); }
  }

  function init() {
    if (!size) size = defaultSize();
    document.title = p.name + ' · ' + color + ' · MOONSUIT (concept)';
    $('#crumbs').innerHTML = '<a href="index.html">MOONSUIT</a><span aria-hidden="true">/</span><a href="' + K.catUrl(p.type) + '">' + TYPE[p.type] + '</a><span aria-hidden="true">/</span><span aria-current="page">' + esc(p.name) + '</span>';
    drawGallery(); drawInfo(); drawReviews(); drawMore(); drawFitDrawer();
    K.reveal(doc);

    doc.addEventListener('click', function (e) {
      var sb = e.target.closest('[data-story]');
      if (sb) { K.stories.open(+sb.dataset.story, +sb.dataset.frame); return; }
      var t = e.target;
      var th = t.closest('[data-gi]');
      if (th) { gi = +th.dataset.gi; drawGallery(); return; }
      if (t.closest('#gmain')) { lbOpen(gi); return; }
      var st = t.closest('[data-lb]');
      if (st) { lbOpen(+st.dataset.lb); return; }
      var c = t.closest('#info [data-color]');
      if (c) { selectColor(c.dataset.color); return; }
      var sz = t.closest('#info [data-size], #sbar [data-size]');
      if (sz && !sz.disabled) { selectSize(sz.dataset.size); return; }
      var pk = t.closest('[data-pick]');
      if (pk) { selectSize(pk.dataset.pick); if (pk.hasAttribute('data-close-after')) K.closeP(true); return; }
      if (t.closest('#addbtn') || t.closest('#sbar [data-buy]')) { buy(); return; }
      var ss = t.closest('[data-ssize]');
      if (ss && !ss.disabled) { setSizes[ss.dataset.h] = ss.dataset.ssize; drawInfo(); return; }
      if (t.closest('#setbtn')) {
        if (!size && !p.oneSize) { $('#sethint').textContent = 'Choose your size for the ' + p.name + ' first.'; return; }
        var items = [{ h: p.handle, c: color, s: size || K.availSizes(p, color)[0] }].concat(suggestions().map(function (x) { return { h: x.p.handle, c: x.c, s: setSizes[x.p.handle] }; }));
        if (K.addMany(items, 'The set')) { justAdded = true; drawInfo(); var sb = $('#setbtn'); sb.classList.add('is-added'); sb.textContent = '✓ Set in bag'; }
        return;
      }
      if (t.closest('[data-lb-x]')) { lbClose(); return; }
      if (t.closest('[data-lb-d]')) { lbi += +t.closest('[data-lb-d]').dataset.lbD; lbDraw(); return; }
    });
    doc.addEventListener('keydown', function (e) {
      if (!$('#lb').classList.contains('is-on')) return;
      if (e.key === 'Escape') lbClose();
      if (e.key === 'ArrowRight') { lbi++; lbDraw(); }
      if (e.key === 'ArrowLeft') { lbi--; lbDraw(); }
    });
    doc.addEventListener('bag:change', function () { drawInfo(); });
    doc.addEventListener('fit:change', function () { drawInfo(); });
    doc.addEventListener('panel:open', function (e) { if (e.detail === 'fitd') drawFitDrawer(); });

    // sticky bar once the main button leaves the screen
    var sbar = $('#sbar'), ticking = false;
    function checkBar() {
      ticking = false;
      var b = $('#addbtn');
      if (!b) return;
      var r = b.getBoundingClientRect();
      var on = r.bottom < 60;
      sbar.classList.toggle('is-on', on);
      document.body.classList.toggle('has-sbar', on);
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(checkBar); } }, { passive: true });
    checkBar();
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
