/* MOONSUIT · concept by MALUS/01 · homepage */
(function () {
  'use strict';
  var M = window.MS, K = window.MSK;
  var $ = K.$, $$ = K.$$, esc = K.esc, fmt = K.fmt, P = K.P;
  var doc = document;
  var MARK = '<svg viewBox="0 0 252 158" aria-hidden="true"><use href="#mark"/></svg>';

  function isDark(hex) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) < 110;
  }

  /* =================== HERO: moon phases =================== */
  function hero() {
    var E = M.editions, el = $('#hero');
    if (!el) return;
    var panes = $('#hero-panes'), tints = $('#hero-tints'), tabs = $('#htabs'), pauseBtn = $('#hpause');
    var layers = $$('.moon__layer', el), sat = $('.moon__sat', el);
    var cur = 0, front = 0, busy = false, userPaused = false, autoPaused = false;
    var DUR = 7000;
    el.style.setProperty('--dur', DUR + 'ms');

    function setOf(e) {
      return e.pieces.map(function (pc) { return { p: P(pc[0]), c: pc[1] }; });
    }
    function paneHTML(e, i) {
      var dark = isDark(e.tint), set = setOf(e);
      var total = set.reduce(function (a, x) { return a + x.p.price; }, 0);
      var was = set.reduce(function (a, x) { return a + (x.p.compare || x.p.price); }, 0);
      var colour = e.pieces[0][1];
      var line = dark ? 'rgba(245,236,238,.24)' : 'rgba(11,11,10,.16)';
      return '<div class="hero__pane" id="hp-' + e.id + '" data-i="' + i + '"' + (dark ? ' data-dark' : '') + ' style="--ink-p:' + e.ink + ';--line-p:' + line + '" role="tabpanel" aria-labelledby="ht-' + e.id + '">' +
        '<p class="hero__eyebrow label hero__fade" style="--i:0">' + MARK + '<span>' + esc(M.brand.tagline) + '</span><span class="dot"></span><span class="note">' + esc(e.note) + '</span></p>' +
        '<h2 class="d-xl hero__title"><span class="ln"><span style="--i:0">' + esc(e.title[0]) + '</span></span><span class="ln"><span style="--i:1">' + esc(e.title[1]) + '</span></span></h2>' +
        '<p class="hero__caption hero__fade" style="--i:1">' + esc(e.caption) + '</p>' +
        '<ul class="hero__pieces hero__fade" style="--i:2">' + set.map(function (x) {
          return '<li><a href="' + K.pdpUrl(x.p, x.c) + '"><span class="sw" style="--c:' + K.hex(x.c) + '"></span>' + esc(x.p.name) + '</a>' + K.priceHTML(x.p) + '</li>';
        }).join('') + '</ul>' +
        '<div class="hero__set hero__fade" style="--i:3"><span class="label">The set</span>' +
        (was > total ? '<p class="price is-sale"><span class="now">' + fmt(total) + '</span><s>' + fmt(was) + '</s></p>' : '<p class="price"><span class="now">' + fmt(total) + '</span></p>') +
        (total >= M.freeShipping ? '<span class="free">· free delivery</span>' : '') + '</div>' +
        '<div class="hero__cta hero__fade" style="--i:4"><button type="button" class="btn" data-set="' + i + '" aria-expanded="false">Add the set to bag</button>' +
        '<a class="btn btn--line" href="#shop" data-shop-color="' + esc(colour) + '">Shop all ' + esc(colour) + '</a>' +
        '<div class="setpick" role="group" aria-label="Choose your size for the set"></div></div></div>';
    }
    panes.innerHTML = E.map(paneHTML).join('');
    tints.innerHTML = E.map(function (e, i) { return '<div class="hero__tint' + (i === 0 ? ' is-on' : '') + '" style="background:' + e.tint + '"></div>'; }).join('');
    tabs.innerHTML = E.map(function (e, i) {
      return '<button type="button" class="htab" role="tab" id="ht-' + e.id + '" aria-controls="hp-' + e.id + '" aria-selected="' + (i === 0) + '" data-go="' + i + '">' +
        '<span class="htab__l label"><span class="sw" style="--c:' + e.swatch + '"></span>' + esc(e.label) + '</span><span class="htab__bar"><i></i></span></button>';
    }).join('');

    var paneEls = $$('.hero__pane', panes), tintEls = $$('.hero__tint', tints), tabEls = $$('.htab', tabs);
    // initial
    layers.forEach(function (l, i) {
      var im = $('img', l);
      if (i === 0) { im.src = K.img(E[0].img); im.style.objectPosition = E[0].pos; l.style.zIndex = 2; }
      else { l.className = 'moon__layer is-prep'; l.style.zIndex = 1; }
    });
    el.style.setProperty('--h-ink', E[0].ink);
    paneEls[0].classList.add('is-on');
    // warm the other images
    E.slice(1).forEach(function (e) { var i = new Image(); i.src = K.img(e.img); });

    function syncPause() {
      el.classList.toggle('is-paused', userPaused || autoPaused);
      if (!userPaused && !autoPaused && pendingNext) { pendingNext = false; next(); }
    }
    function restartProgress() {
      tabEls.forEach(function (t, i) {
        var bar = $('.htab__bar i', t);
        bar.classList.remove('is-run');
        t.classList.toggle('is-on', i === cur);
        t.classList.toggle('is-done', i < cur);
        t.setAttribute('aria-selected', i === cur);
        t.classList.toggle('is-static', K.RM);
      });
      sat.classList.remove('is-run');
      if (K.RM) return;
      void el.offsetWidth;
      $('.htab__bar i', tabEls[cur]).classList.add('is-run');
      sat.classList.add('is-run');
    }

    function go(i, dir) {
      if (busy || i === cur) return;
      busy = true; pendingNext = false;
      var e = E[i], prev = cur, back = dir === -1;
      cur = i;
      closePickers();
      // text
      var outP = paneEls[prev], inP = paneEls[i];
      outP.classList.remove('is-on'); outP.classList.add('is-out'); outP.setAttribute('aria-hidden', 'true');
      inP.classList.add('is-late'); inP.removeAttribute('aria-hidden');
      void inP.offsetWidth;
      inP.classList.add('is-on');
      setTimeout(function () { outP.classList.remove('is-out'); inP.classList.remove('is-late'); }, 900);
      // colour
      tintEls.forEach(function (t, k) { t.classList.toggle('is-on', k === i); });
      el.style.setProperty('--h-ink', e.ink);
      // moon eclipse
      var inc = layers[1 - front], out = layers[front], im = $('img', inc);
      im.src = K.img(e.img); im.style.objectPosition = e.pos;
      inc.className = 'moon__layer ' + (back ? 'is-prep-l' : 'is-prep');
      inc.style.zIndex = 2; out.style.zIndex = 1;
      var start = function () {
        void inc.offsetWidth;
        inc.className = 'moon__layer is-run';
        out.className = 'moon__layer is-run ' + (back ? 'is-leave-r' : 'is-leave');
        setTimeout(function () { out.className = 'moon__layer is-prep'; busy = false; }, K.RM ? 20 : 1300);
      };
      front = 1 - front;
      if (im.decode) im.decode().then(start, start); else start();
      restartProgress();
    }
    function next() { go((cur + 1) % E.length, 1); }
    function prev() { go((cur - 1 + E.length) % E.length, -1); }

    tabs.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-go]');
      if (!b) return;
      var i = +b.dataset.go;
      if (i === cur) { restartProgress(); return; }
      go(i, i < cur ? -1 : 1);
    });
    var pendingNext = false;
    tabs.addEventListener('animationend', function (ev) {
      if (!ev.target.classList.contains('is-run')) return;
      if (userPaused || autoPaused) { pendingNext = true; return; }
      next();
    });
    // pause / play: the only way to stop autoplay
    function paintPause() {
      pauseBtn.setAttribute('aria-pressed', userPaused);
      pauseBtn.innerHTML = '<span class="hpause__ico">' + (userPaused ? '<svg viewBox="0 0 10 10"><path d="M2 1l7 4-7 4z"/></svg>' : '<svg viewBox="0 0 10 10"><path d="M2 1h2v8H2zM6 1h2v8H6z"/></svg>') + '</span><span class="label">' + (userPaused ? 'Play' : 'Pause') + '</span>';
    }
    if (K.RM) { pauseBtn.hidden = true; }
    pauseBtn.addEventListener('click', function () { userPaused = !userPaused; paintPause(); syncPause(); });
    paintPause();
    // stop when off screen or tab hidden
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { autoPaused = !es[0].isIntersecting || doc.hidden; syncPause(); }, { threshold: 0.25 }).observe(el);
    }
    doc.addEventListener('visibilitychange', function () { autoPaused = doc.hidden; syncPause(); });

    // swipe (touch + mouse drag on the moon)
    var sx = null, sy = 0;
    var zone = $('.hero__in', el);
    zone.addEventListener('pointerdown', function (ev) {
      if (ev.target.closest('a, button, .setpick')) return;
      sx = ev.clientX; sy = ev.clientY;
    });
    zone.addEventListener('pointerup', function (ev) {
      if (sx == null) return;
      var dx = ev.clientX - sx, dy = ev.clientY - sy;
      sx = null;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) { if (dx < 0) next(); else prev(); }
    });
    zone.addEventListener('pointercancel', function () { sx = null; });

    // set picker: the CTA row turns into a size choice
    function closePickers() { $$('.hero__cta.is-picking', el).forEach(function (c) { c.classList.remove('is-picking'); }); $$('[data-set]', el).forEach(function (b) { b.setAttribute('aria-expanded', 'false'); }); }
    function pickerHTML(e) {
      var set = setOf(e), sizes = ['XS/S', 'M/L'];
      return '<p>One size for both pieces. You can change each one in the bag.</p><div class="setpick__row">' + sizes.map(function (s) {
        var st = set.map(function (x) { return K.sizeState(x.p, x.c, s); });
        var ok = st.every(function (v) { return v === 'in'; });
        var why = st.indexOf('none') > -1 ? s + ' not in ' + e.label : (st.indexOf('out') > -1 ? s + ' sold out' : s);
        return '<button type="button" class="btn" data-setsize="' + s + '"' + (ok ? '' : ' disabled') + '>' + esc(ok ? 'Add set · ' + s : why) + '</button>';
      }).join('') + '<button type="button" class="btn setpick__x" data-setx>Cancel</button></div>';
    }
    el.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-set]');
      if (b) {
        var i = +b.dataset.set, cta = b.parentNode, pick = $('.setpick', cta);
        if (b.classList.contains('is-added')) { K.openP('bag', b); return; }
        closePickers();
        pick.innerHTML = pickerHTML(E[i]);
        cta.classList.add('is-picking'); b.setAttribute('aria-expanded', 'true');
        userPaused = true; paintPause(); syncPause();
        var f = $('button:not(:disabled)', pick); if (f) f.focus({ preventScroll: true });
        return;
      }
      if (ev.target.closest('[data-setx]')) { var c0 = ev.target.closest('.hero__cta'); closePickers(); $('[data-set]', c0).focus({ preventScroll: true }); return; }
      var s = ev.target.closest('[data-setsize]');
      if (s && !s.disabled) {
        var pane = s.closest('.hero__pane'), e = E[+pane.dataset.i];
        K.addMany(setOf(e).map(function (x) { return { h: x.p.handle, c: x.c, s: s.dataset.setsize }; }), e.label + ' set');
        closePickers();
        var btn = $('[data-set]', pane);
        btn.classList.add('is-added');
        btn.textContent = '✓ Set in bag · ' + s.dataset.setsize;
        btn.focus({ preventScroll: true });
        return;
      }
      var sc = ev.target.closest('[data-shop-color]');
      if (sc) { ev.preventDefault(); shopApi.set(sc.dataset.shopColor, 'all'); jump('#shop'); }
    });
    doc.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') closePickers();
      if ((ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') && doc.activeElement && doc.activeElement.closest('#htabs')) {
        var i = ev.key === 'ArrowRight' ? (cur + 1) % E.length : (cur - 1 + E.length) % E.length;
        go(i, ev.key === 'ArrowRight' ? 1 : -1); tabEls[i].focus();
      }
    });
    restartProgress();
  }

  function jump(sel) {
    var t = $(sel);
    if (!t) return;
    var y = t.getBoundingClientRect().top + window.scrollY - parseInt(getComputedStyle(doc.documentElement).getPropertyValue('--hdr-h'), 10) + 1;
    window.scrollTo({ top: y, behavior: K.RM ? 'auto' : 'smooth' });
  }

  /* =================== SHOP BY COLOUR =================== */
  var shopApi = { set: function () {} };
  function shop() {
    var chips = $('#chips'), types = $('#types'), grid = $('#grid'), more = $('#shop-more'), count = $('#shop-count');
    if (!grid) return;
    var state = { color: 'all', type: 'all', expanded: false };
    var colours = M.colorOrder.filter(function (c) { return M.products.some(function (p) { return K.hasColor(p, c); }); });

    chips.innerHTML = '<button type="button" class="chip is-on" data-color="all" aria-pressed="true"><span class="sw all"></span>All colours</button>' +
      colours.map(function (c) {
        var n = M.products.filter(function (p) { return K.hasColor(p, c); }).length;
        return '<button type="button" class="chip" data-color="' + esc(c) + '" aria-pressed="false"><span class="sw" style="--c:' + K.hex(c) + '"></span>' + esc(c) + '<span class="chip__n">' + n + '</span></button>';
      }).join('');
    types.innerHTML = M.types.map(function (t, i) { return '<button type="button" data-type="' + t.id + '" class="' + (i === 0 ? 'is-on' : '') + '" aria-pressed="' + (i === 0) + '">' + esc(t.label) + '</button>'; }).join('');

    function list() {
      return M.products.filter(function (p) {
        return (state.color === 'all' || K.hasColor(p, state.color)) && (state.type === 'all' || p.type === state.type);
      });
    }
    function render(animate) {
      var all = list(), show = all, collapsed = state.color === 'all' && state.type === 'all' && !state.expanded;
      if (collapsed) show = all.slice(0, 8);
      grid.innerHTML = '';
      if (!show.length) {
        var tl = M.types.filter(function (t) { return t.id === state.type; })[0].label.toLowerCase();
        grid.innerHTML = '<p class="grid__empty">No ' + esc(tl) + ' in ' + esc(state.color) + ' right now. <button type="button" class="textbtn" data-type-reset>Show everything in ' + esc(state.color) + '</button></p>';
      }
      show.forEach(function (p, k) { grid.appendChild(K.cardEl(p, state.color === 'all' ? p.defaultColor : state.color, animate ? k : null)); });
      if (!collapsed && state.color === 'all' && state.type === 'all' && show.length % 4 === 1) {
        var t = doc.createElement('a');
        t.className = 'tile'; t.href = '#tech';
        t.innerHTML = '<img src="assets/img/story-red.jpg" alt="Sculpting Legging and Long Sleeve Top in Red" loading="lazy"><div class="tile__txt"><p class="label">Seamless Technology®</p><p class="d-m">Knitted in one single piece.</p><span class="link">How it holds you</span></div>';
        grid.appendChild(t);
      }
      more.hidden = !collapsed;
      $('button', more).textContent = 'Show all ' + all.length + ' pieces';
      var what = state.type === 'all' ? 'pieces' : M.types.filter(function (t) { return t.id === state.type; })[0].label.toLowerCase();
      count.textContent = all.length + ' ' + (all.length === 1 && what === 'pieces' ? 'piece' : what) + (state.color === 'all' ? '' : ' in ' + state.color) + (collapsed ? ', showing 8' : '');
    }
    function set(color, type) {
      if (color != null) state.color = color;
      if (type != null) state.type = type;
      $$('.chip', chips).forEach(function (b) { var on = b.dataset.color === state.color; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
      $$('button', types).forEach(function (b) { var on = b.dataset.type === state.type; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
      render(true);
    }
    shopApi.set = set;
    chips.addEventListener('click', function (e) { var b = e.target.closest('[data-color]'); if (b) set(b.dataset.color, null); });
    types.addEventListener('click', function (e) { var b = e.target.closest('[data-type]'); if (b) set(null, b.dataset.type); });
    grid.addEventListener('click', function (e) { if (e.target.closest('[data-type-reset]')) set(null, 'all'); });
    $('button', more).addEventListener('click', function () { state.expanded = true; render(true); });
    render(false);
  }

  /* =================== SUMMER EDIT =================== */
  function edit() {
    var g = $('#edit-grid');
    if (!g) return;
    [['square-neck-bra-summer', 'Orange'], ['sculpting-short-summer', 'Pink'], ['sculpting-legging-summer', 'Kaki']].forEach(function (x) {
      g.appendChild(K.cardEl(P(x[0]), x[1]));
    });
  }

  /* =================== THE LOOK =================== */
  function look() {
    var L = M.look, box = $('#look');
    if (!box) return;
    var sel = {};
    var fit = K.Fit.get();
    var items = L.pieces.map(function (x) { return { p: P(x.handle), c: x.color, spot: x.spot }; });
    items.forEach(function (it) {
      var av = K.availSizes(it.p, it.c).filter(function (s) { return K.sizeState(it.p, it.c, s) === 'in'; });
      sel[it.p.handle] = fit && av.indexOf(fit.size) > -1 ? fit.size : av[0];
    });
    $('#look-spots').innerHTML = items.map(function (it, i) {
      return '<button type="button" class="spot" style="left:' + it.spot.x + '%;top:' + it.spot.y + '%" data-spot="' + i + '" aria-label="' + esc(it.p.name) + '"><span class="spot__dot"><span class="spot__ring"></span></span><span class="spot__lbl">' + esc(it.p.name) + ' · ' + fmt(it.p.price) + '</span></button>';
    }).join('');
    function draw() {
      $('#look-items').innerHTML = items.map(function (it, i) {
        var m = K.media(it.p, it.c);
        return '<li class="litem" data-li="' + i + '"><a href="' + K.pdpUrl(it.p, it.c) + '"><img class="litem__img" src="' + K.img(m.imgs[0]) + '" alt="' + esc(it.p.name) + '" loading="lazy"></a><div>' +
          '<div class="litem__top"><p class="litem__name"><a href="' + K.pdpUrl(it.p, it.c) + '">' + esc(it.p.name) + '</a></p>' + K.priceHTML(it.p) + '</div>' +
          '<p class="litem__meta">' + esc(it.c) + ' · ' + esc(it.p.tagline) + '</p>' +
          '<div class="seg" role="group" aria-label="Size for ' + esc(it.p.name) + '">' + K.availSizes(it.p, it.c).map(function (s) {
            var st = K.sizeState(it.p, it.c, s);
            return '<button type="button" data-lsize="' + esc(s) + '" data-h="' + it.p.handle + '" class="' + (sel[it.p.handle] === s ? 'is-on' : '') + '"' + (st !== 'in' ? ' disabled aria-label="' + esc(s) + ' sold out"' : '') + '>' + esc(s) + '</button>';
          }).join('') + '</div></div></li>';
      }).join('');
      var total = items.reduce(function (a, it) { return a + it.p.price; }, 0);
      $('#look-total').innerHTML = '<span class="label">The full look</span><p class="price">' + fmt(total) + '</p>';
      $('#look-free').textContent = total >= M.freeShipping ? 'Over ' + fmt(M.freeShipping) + ', so delivery is free.' : '';
      $('#look-add').textContent = 'Add the full look · ' + fmt(total);
    }
    draw();
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-lsize]');
      if (b && !b.disabled) { sel[b.dataset.h] = b.dataset.lsize; draw(); resetBtn(); return; }
      if (e.target.closest('#look-add')) {
        var n = K.addMany(items.map(function (it) { return { h: it.p.handle, c: it.c, s: sel[it.p.handle] }; }), 'The full look');
        if (n) { var btn = $('#look-add'); btn.classList.add('is-added'); btn.textContent = '✓ Look in bag · ' + items.map(function (it) { return sel[it.p.handle]; }).join(' + '); }
      }
    });
    function resetBtn() { var btn = $('#look-add'); btn.classList.remove('is-added'); }
    function hi(i, on) {
      var li = $('[data-li="' + i + '"]', box), sp = $('[data-spot="' + i + '"]', box);
      if (li) li.classList.toggle('is-hi', on);
      if (sp) sp.classList.toggle('is-on', on);
    }
    box.addEventListener('mouseover', function (e) { var s = e.target.closest('[data-spot],[data-li]'); if (s) hi(s.dataset.spot || s.dataset.li, true); });
    box.addEventListener('mouseout', function (e) { var s = e.target.closest('[data-spot],[data-li]'); if (s) hi(s.dataset.spot || s.dataset.li, false); });
    box.addEventListener('focusin', function (e) { var s = e.target.closest('[data-spot]'); if (s) hi(s.dataset.spot, true); });
    box.addEventListener('focusout', function (e) { var s = e.target.closest('[data-spot]'); if (s) hi(s.dataset.spot, false); });
    $('#look-spots').addEventListener('click', function (e) {
      var s = e.target.closest('[data-spot]');
      if (!s) return;
      var li = $('[data-li="' + s.dataset.spot + '"]', box);
      if (li) { hi(s.dataset.spot, true); var b = $('.seg button:not(:disabled)', li); if (b) b.focus({ preventScroll: window.innerWidth > 900 }); if (window.innerWidth <= 900) li.scrollIntoView({ behavior: K.RM ? 'auto' : 'smooth', block: 'center' }); }
    });
  }

  /* =================== FIT FINDER =================== */
  function fit() {
    var box = $('#fit');
    if (!box) return;
    var saved = K.Fit.get();
    $('#fit-form').innerHTML = K.fitFormHTML('home', saved);
    var form = $('[data-fitform]', box), sizeEl = $('#fit-size'), why = $('#fit-why'), chart = $('#fit-chart'), savedEl = $('#fit-saved');
    var last = null;
    function show(v, persist) {
      var r = K.Fit.recommend(v.h, v.eu, v.pref);
      if (r.size !== last) {
        sizeEl.classList.add('is-swap');
        $('span', sizeEl).textContent = r.size;
        void sizeEl.offsetWidth;
        sizeEl.classList.remove('is-swap');
        last = r.size;
      }
      why.textContent = r.why;
      chart.innerHTML = K.chartHTML(r.size);
      if (persist) { K.Fit.set(r); savedEl.hidden = false; }
    }
    K.bindFitForm(form, function (v) { show(v, true); });
    show(saved || { h: 165, eu: 36, pref: 'sculpt' }, false);
    savedEl.hidden = !saved;
  }

  /* =================== REVIEWS =================== */
  function voices() {
    var row = $('#voices');
    if (!row) return;
    row.innerHTML = M.reviews.map(function (r, i) {
      var p = P(r.handle);
      return '<figure class="voice rv" style="--i:' + (i % 3) + '"><blockquote>' + esc(r.text) + '</blockquote><figcaption class="voice__by"><b>' + esc(r.name) + ' <span class="ver">✓ Verified buyer</span></b><span class="muted">' + esc(r.item) + ' · ' + esc(r.date) + '</span>' +
        (p ? '<a class="textbtn" href="' + K.pdpUrl(p) + '">Shop the ' + esc(p.name) + '</a>' : '') + '</figcaption></figure>';
    }).join('');
  }

  /* =================== JOIN =================== */
  function join() {
    var b = $('#join-btn');
    if (!b) return;
    b.addEventListener('click', function () { $('#join-msg').textContent = 'Concept preview: in the live store this opens your Shopify email signup with the 10% welcome code.'; });
  }

  function init() {
    hero(); shop(); edit(); look(); fit(); voices(); join();
    K.reveal(document);
    // in-page anchors with header offset, incl. #shop-<type> deep links
    function route(hash, a) {
      var m = (hash || '').match(/^#([\w-]+)$/);
      if (!m) return false;
      var id = m[1], type = null, tm = id.match(/^shop-(\w+)$/);
      if (tm) { type = tm[1]; id = 'shop'; }
      if (!document.getElementById(id)) return false;
      if (type) shopApi.set('all', type);
      else if (id === 'shop' && a && a.closest('.hdr, .menu, .ftr')) shopApi.set('all', 'all');
      jump('#' + id);
      return true;
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href*="#"]');
      if (!a || a.hasAttribute('data-shop-color')) return;
      var href = a.getAttribute('href'), m = href.match(/^(?:index\.html)?(#[\w-]+)$/);
      if (!m) return;
      if (route(m[1], a)) { e.preventDefault(); history.replaceState(null, '', m[1]); }
    });
    if (location.hash) setTimeout(function () { route(location.hash); }, 80);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
