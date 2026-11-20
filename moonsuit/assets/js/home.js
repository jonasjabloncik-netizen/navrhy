/* MOONSUIT · concept by MALUS/01 · v3 · homepage */
(function () {
  'use strict';
  var M = window.MS, K = window.MSK;
  var $ = K.$, $$ = K.$$, esc = K.esc, fmt = K.fmt, P = K.P;
  var doc = document;
  var MARK = '<svg class="logo-svg logo-mark" viewBox="0 -6 254 170" aria-hidden="true" focusable="false"><use class="letters" href="#p-letters"/><use class="crescent" href="#p-cres"/></svg>';
  var PLAY = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1l7 4-7 4z"/></svg>';
  var PAUSE = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1h2v8H2zM6 1h2v8H6z"/></svg>';

  /* =================== HERO: editions, the next one rises like the moon over the last =================== */
  function hero() {
    var E = M.editions, el = $('#hero');
    if (!el) return;
    var panes = $('#hero-panes'), tints = $('#hero-tints'), tabs = $('#htabs'), pauseBtn = $('#hpause');
    var photo = $('#hero-photo'), baseImg = $('.hero__base img', photo), shade = $('.hero__shade', photo);
    var wipe = $('.hero__wipe', photo), wimg = $('.hero__wimg img', photo);
    var cur = 0, busy = false, started = false, userPaused = false, autoPaused = false, pendingNext = false;
    var DUR = 7000, WIPE = 1500;
    el.style.setProperty('--dur', DUR + 'ms');

    function setOf(e) { return e.pieces.map(function (pc) { return { p: P(pc[0]), c: pc[1] }; }); }
    function paneHTML(e, i) {
      var set = setOf(e);
      var total = set.reduce(function (a, x) { return a + x.p.price; }, 0);
      var was = set.reduce(function (a, x) { return a + (x.p.compare || x.p.price); }, 0);
      var colour = e.pieces[0][1];
      return '<div class="hero__pane" id="hp-' + e.id + '" data-i="' + i + '" style="--ink-p:' + e.ink + ';--soft-p:' + e.soft + ';--line-p:rgba(255,255,255,.2);--tint-p:' + e.tint + '" role="tabpanel" aria-labelledby="ht-' + e.id + '"' + (i ? ' aria-hidden="true"' : '') + '>' +
        '<p class="hero__eyebrow cap hero__fade" style="--i:0">' + MARK + '<span>' + esc(M.brand.tagline) + '</span><span class="dot"></span><span>' + esc(e.note) + '</span></p>' +
        '<h2 class="d1 hero__title"><span class="ln"><span style="--i:0">' + esc(e.title[0]) + '</span></span><span class="ln"><span style="--i:1">' + esc(e.title[1]) + '</span></span></h2>' +
        '<p class="hero__caption hero__fade" style="--i:1">' + esc(e.caption) + '</p>' +
        '<ul class="hero__pieces hero__fade" style="--i:2">' + set.map(function (x) {
          return '<li><a href="' + K.pdpUrl(x.p, x.c) + '"><span class="sw" style="--c:' + K.hex(x.c) + '"></span>' + esc(x.p.name) + '</a>' + K.priceHTML(x.p) + '</li>';
        }).join('') + '</ul>' +
        '<div class="hero__set hero__fade" style="--i:3"><span class="cap">The set</span>' +
        (was > total ? '<p class="price is-sale"><span class="now">' + fmt(total) + '</span><s>' + fmt(was) + '</s></p>' : '<p class="price"><span class="now">' + fmt(total) + '</span></p>') +
        (total >= M.freeShipping ? '<span class="free">· free delivery</span>' : '') + '</div>' +
        '<div class="hero__cta hero__fade" style="--i:4"><button type="button" class="btn" data-set="' + i + '" aria-expanded="false">Add the set</button>' +
        '<a class="btn btn--line" href="#shop" data-shop-color="' + esc(colour) + '">Shop all ' + esc(colour) + '</a>' +
        '<div class="setpick" role="group" aria-label="Choose your size for the set"></div></div></div>';
    }
    panes.innerHTML = E.map(paneHTML).join('');
    tints.innerHTML = E.map(function (e, i) { return '<div class="hero__tint' + (i === 0 ? ' is-on' : '') + '" style="background:' + e.tint + '"></div>'; }).join('');
    tabs.innerHTML = E.map(function (e, i) {
      return '<button type="button" class="htab" role="tab" id="ht-' + e.id + '" aria-controls="hp-' + e.id + '" aria-selected="' + (i === 0) + '" data-go="' + i + '">' +
        '<span class="htab__l cap"><span class="sw" style="--c:' + e.swatch + '"></span>' + esc(e.tab || e.label) + '</span><span class="htab__bar"><i></i></span></button>';
    }).join('');
    pauseBtn.innerHTML = '<span class="hmoon" aria-hidden="true"><i></i></span><span class="cap" data-pl>Pause</span>';
    var paneEls = $$('.hero__pane', panes), tintEls = $$('.hero__tint', tints), tabEls = $$('.htab', tabs);
    el.style.setProperty('--h-ink', E[0].ink);
    E.slice(1).forEach(function (e) { var i = new Image(); i.src = K.img(e.img); });

    /* geometry: a circle bigger than the photo panel slides across it, so its edge draws a moon's terminator */
    function measure() {
      var r = photo.getBoundingClientRect();
      var W = Math.round(r.width), H = Math.round(r.height), D = Math.ceil(Math.sqrt(W * W + H * H) * 1.12);
      photo.style.setProperty('--W', W + 'px');
      photo.style.setProperty('--H', H + 'px');
      photo.style.setProperty('--D', D + 'px');
      photo.style.setProperty('--from', Math.ceil(W / 2 + D / 2 + 4) + 'px');
    }
    window.addEventListener('resize', function () { if (!busy) measure(); });

    function wipeTo(e, dir, done) {
      measure();
      photo.style.setProperty('--dir', dir);
      wipe.className = 'hero__wipe is-prep';
      if (wimg.getAttribute('src') !== K.img(e.img)) wimg.src = K.img(e.img);
      wimg.style.objectPosition = e.pos;
      var run = function () {
        void wipe.offsetWidth;
        wipe.className = 'hero__wipe is-run';
        if (baseImg.getAttribute('src')) shade.classList.add('is-on');
        setTimeout(function () {
          var fin = function () {
            shade.classList.add('no-tr');
            shade.classList.remove('is-on');
            wipe.className = 'hero__wipe is-prep';
            void shade.offsetWidth;
            shade.classList.remove('no-tr');
            if (done) done();
          };
          baseImg.style.objectPosition = e.pos;
          if (baseImg.getAttribute('src') === wimg.getAttribute('src')) { fin(); return; }
          baseImg.src = wimg.getAttribute('src');
          if (baseImg.decode) baseImg.decode().then(fin, fin); else setTimeout(fin, 60);
        }, K.RM ? 30 : WIPE + 40);
      };
      if (wimg.decode) wimg.decode().then(run, run); else run();
    }

    function syncPause() {
      el.classList.toggle('is-paused', userPaused || autoPaused);
      if (!userPaused && !autoPaused && pendingNext) { pendingNext = false; next(); }
    }
    function restartProgress() {
      var mi = $('.hmoon i', pauseBtn);
      tabEls.forEach(function (t, i) {
        $('.htab__bar i', t).classList.remove('is-run');
        t.classList.toggle('is-on', i === cur);
        t.classList.toggle('is-done', i < cur);
        t.setAttribute('aria-selected', i === cur);
        t.classList.toggle('is-static', K.RM);
      });
      mi.classList.remove('is-run');
      if (K.RM || !started) return;
      void el.offsetWidth;
      $('.htab__bar i', tabEls[cur]).classList.add('is-run');
      mi.classList.add('is-run');
    }

    function go(i, dir) {
      if (busy || !started || i === cur) return;
      busy = true; pendingNext = false;
      var e = E[i], prev = cur;
      cur = i;
      closePickers();
      var outP = paneEls[prev], inP = paneEls[i];
      outP.classList.remove('is-on'); outP.classList.add('is-out'); outP.setAttribute('aria-hidden', 'true');
      inP.classList.add('is-late'); inP.removeAttribute('aria-hidden');
      void inP.offsetWidth;
      inP.classList.add('is-on');
      setTimeout(function () { outP.classList.remove('is-out'); inP.classList.remove('is-late'); }, 1200);
      tintEls.forEach(function (t, k) { t.classList.toggle('is-on', k === i); });
      el.style.setProperty('--h-ink', e.ink);
      K.orbit($('.logo-svg', inP));
      wipeTo(e, dir, function () { busy = false; });
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
    tabs.addEventListener('animationend', function (ev) {
      if (!ev.target.classList.contains('is-run')) return;
      if (userPaused || autoPaused) { pendingNext = true; return; }
      next();
    });
    // pause / play is the only way to stop the autoplay
    function paintPause() { $('[data-pl]', pauseBtn).textContent = userPaused ? 'Play' : 'Pause'; }
    if (K.RM) pauseBtn.hidden = true;
    pauseBtn.addEventListener('click', function () { userPaused = !userPaused; paintPause(); syncPause(); });
    paintPause();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { autoPaused = !es[0].isIntersecting || doc.hidden; syncPause(); }, { threshold: 0.25 }).observe(el);
    }
    doc.addEventListener('visibilitychange', function () { autoPaused = doc.hidden; syncPause(); });

    // swipe on touch, drag with a mouse
    var sx = null, sy = 0, zone = $('.hero__grid', el);
    zone.addEventListener('pointerdown', function (ev) { if (ev.target.closest('a, button, .setpick')) return; sx = ev.clientX; sy = ev.clientY; });
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
      if (sc) { ev.preventDefault(); shopApi.set(sc.dataset.shopColor); jump('#shop'); }
    });
    doc.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') closePickers();
      if ((ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') && doc.activeElement && doc.activeElement.closest('#htabs')) {
        var i = ev.key === 'ArrowRight' ? (cur + 1) % E.length : (cur - 1 + E.length) % E.length;
        go(i, ev.key === 'ArrowRight' ? 1 : -1); tabEls[i].focus();
      }
    });

    // first visit moment: the first edition rises into the panel while its title comes up
    void panes.offsetWidth;
    paneEls[0].classList.add('is-on');
    restartProgress();
    if (K.RM) {
      measure();
      baseImg.src = K.img(E[0].img); baseImg.style.objectPosition = E[0].pos;
      started = true;
      return;
    }
    busy = true;
    K.orbit($('.logo-svg', paneEls[0]));
    wipeTo(E[0], 1, function () { busy = false; started = true; restartProgress(); });
  }

  function jump(sel) {
    var t = $(sel);
    if (!t) return;
    var y = t.getBoundingClientRect().top + window.scrollY - parseInt(getComputedStyle(doc.documentElement).getPropertyValue('--hdr-h'), 10) + 1;
    window.scrollTo({ top: y, behavior: K.RM ? 'auto' : 'smooth' });
  }

  /* =================== SHOP BY COLOUR: colour moons + a rail =================== */
  var shopApi = { set: function () {} };
  function moonsHTML(list, on, counts) {
    return '<button type="button" class="mc' + (on === 'all' ? ' is-on' : '') + '" data-color="all" aria-pressed="' + (on === 'all') + '"><span class="mc__d mc__d--all"></span><span class="mc__l">All</span>' + (counts ? '<span class="mc__n">' + M.products.length + '</span>' : '') + '</button>' +
      list.map(function (c) {
        var n = M.products.filter(function (p) { return K.hasColor(p, c); }).length;
        return '<button type="button" class="mc' + (on === c ? ' is-on' : '') + '" data-color="' + esc(c) + '" aria-pressed="' + (on === c) + '"><span class="mc__d" style="--c:' + K.hex(c) + '"></span><span class="mc__l">' + esc(c) + '</span>' + (counts ? '<span class="mc__n">' + n + '</span>' : '') + '</button>';
      }).join('');
  }
  function shop() {
    var moons = $('#moons'), track = $('#shop-rail');
    if (!track) return;
    var railEl = track.closest('[data-rail]');
    var colours = M.colorOrder.filter(function (c) { return M.products.some(function (p) { return K.hasColor(p, c); }); });
    var state = 'all';
    moons.innerHTML = moonsHTML(colours, state, true);
    function render(animate) {
      var list = M.products.filter(function (p) { return state === 'all' || K.hasColor(p, state); });
      track.innerHTML = '';
      list.forEach(function (p, k) {
        var el = K.cardEl(p, state === 'all' ? p.defaultColor : state, animate ? Math.min(k, 4) : null);
        el.setAttribute('role', 'listitem');
        track.appendChild(el);
      });
      track.scrollLeft = 0;
      K.rail(railEl);
    }
    function set(c) {
      if (c != null) state = c;
      $$('.mc', moons).forEach(function (b) { var on = b.dataset.color === state; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
      render(true);
    }
    shopApi.set = set;
    moons.addEventListener('click', function (e) { var b = e.target.closest('[data-color]'); if (b) set(b.dataset.color); });
    render(false);
  }

  /* =================== SPOTLIGHT: the Sculpting Legging =================== */
  function spotlight() {
    var box = $('#sculpting');
    if (!box) return;
    var p = P('sculpting-legging'), color = 'Blue Petrol', size = null, added = false, photo = 0;
    var imgEl = $('#spot-img');
    function pickSize() {
      var f = K.Fit.get(), av = K.availSizes(p, color).filter(function (s) { return K.sizeState(p, color, s) === 'in'; });
      size = f && av.indexOf(f.size) > -1 ? f.size : (av.length === 1 ? av[0] : null);
    }
    function showPhoto(i) {
      var list = K.media(p, color).imgs;
      photo = Math.max(0, Math.min(i, list.length - 1));
      var src = K.img(list[photo]);
      if (K.localSrc(imgEl) === src && imgEl.getAttribute('src')) return;
      if (K.RM || !imgEl.getAttribute('src')) { imgEl.src = src; K.hd($('#spot-media')); }
      else {
        imgEl.classList.add('is-off');
        var n = new Image();
        n.onload = n.onerror = function () { setTimeout(function () { imgEl.src = src; imgEl.classList.remove('is-off'); K.hd($('#spot-media')); }, 200); };
        n.src = src;
      }
      imgEl.alt = p.name + ' in ' + color;
      $$('#spot-thumbs button').forEach(function (b, k) { b.classList.toggle('is-on', k === photo); b.setAttribute('aria-pressed', k === photo); });
    }
    function draw() {
      var list = K.media(p, color).imgs;
      $('#spot-cname').textContent = color;
      $('#spot-colours').innerHTML = p.colors.map(function (c) {
        return '<button type="button" class="mc' + (c.name === color ? ' is-on' : '') + '" data-c="' + esc(c.name) + '" aria-pressed="' + (c.name === color) + '"><span class="mc__d" style="--c:' + K.hex(c.name) + '"></span><span class="mc__l">' + esc(c.name) + '</span></button>';
      }).join('');
      $('#spot-thumbs').innerHTML = list.length > 1 ? list.map(function (n, k) { return '<button type="button" data-ph="' + k + '" aria-label="Photo ' + (k + 1) + '"><img src="' + K.img(n) + '" alt=""></button>'; }).join('') : '';
      $('#spot-sizes').innerHTML = K.sizesFor(p).map(function (s) {
        var st = K.sizeState(p, color, s), f = K.Fit.get();
        var sub = st === 'out' ? 'Sold out' : (st === 'none' ? 'Not in ' + color : (f && f.size === s ? 'Your size' : (s === 'XS/S' ? 'EU 34–36' : 'EU 38–40')));
        return '<button type="button" class="sz' + (size === s ? ' is-on' : '') + '" data-s="' + esc(s) + '"' + (st !== 'in' ? ' disabled' : '') + ' aria-pressed="' + (size === s) + '"><b>' + esc(s) + '</b><small>' + esc(sub) + '</small></button>';
      }).join('');
      $('#spot-price').innerHTML = fmt(p.price);
      var btn = $('#spot-add');
      btn.classList.toggle('is-added', added);
      btn.textContent = added ? '✓ In your bag · ' + size : (size ? 'Add to bag · ' + size : 'Choose your size');
      showPhoto(Math.min(photo, list.length - 1));
    }
    pickSize(); draw();
    box.addEventListener('click', function (e) {
      var c = e.target.closest('[data-c]');
      if (c) { color = c.dataset.c; added = false; photo = 0; pickSize(); draw(); return; }
      var s = e.target.closest('[data-s]');
      if (s && !s.disabled) { size = s.dataset.s; added = false; draw(); return; }
      var ph = e.target.closest('[data-ph]');
      if (ph) { showPhoto(+ph.dataset.ph); return; }
      if (e.target.closest('#spot-add')) {
        var btn = $('#spot-add');
        if (added) { K.openP('bag', btn); return; }
        if (!size) { var f = $('#spot-sizes .sz:not(:disabled)'); if (f) f.focus(); btn.textContent = 'Pick a size first'; return; }
        if (K.addToBag(p.handle, color, size)) { added = true; draw(); }
      }
    });
    doc.addEventListener('fit:change', function () { if (!added) { pickSize(); draw(); } });
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
      return '<button type="button" class="spot-h" style="left:' + it.spot.x + '%;top:' + it.spot.y + '%" data-spot="' + i + '" aria-label="' + esc(it.p.name) + '"><span class="spot-h__dot"><span class="spot-h__ring"></span></span><span class="spot-h__lbl">' + esc(it.p.name) + ' · ' + fmt(it.p.price) + '</span></button>';
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
      $('#look-total').innerHTML = '<span class="cap">The full look</span><p class="price">' + fmt(total) + '</p>';
      $('#look-free').textContent = total >= M.freeShipping ? 'Over ' + fmt(M.freeShipping) + ', so delivery is free.' : '';
      var btn = $('#look-add');
      if (!btn.classList.contains('is-added')) btn.textContent = 'Add the full look · ' + fmt(total);
    }
    draw();
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-lsize]');
      if (b && !b.disabled) { sel[b.dataset.h] = b.dataset.lsize; $('#look-add').classList.remove('is-added'); draw(); return; }
      if (e.target.closest('#look-add')) {
        var btn = $('#look-add');
        if (btn.classList.contains('is-added')) { K.openP('bag', btn); return; }
        var n = K.addMany(items.map(function (it) { return { h: it.p.handle, c: it.c, s: sel[it.p.handle] }; }), 'The full look');
        if (n) { btn.classList.add('is-added'); btn.textContent = '✓ Look in bag · ' + items.map(function (it) { return sel[it.p.handle]; }).join(' + '); }
      }
    });
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

  /* =================== WILL IT FIT? size + what is in stock in it =================== */
  var FIT_PICKS = ['sculpting-legging', 'square-neck-bra', 'essential-legging', 'seamless-short', 'strap-bra', 'cross-back-bra', 'front-zip-crop', 'long-sleeve-top', 'seamless-crop-tee'];
  function fit() {
    var box = $('#fit');
    if (!box) return;
    var saved = K.Fit.get();
    $('#fit-form').innerHTML = K.fitFormHTML('home', saved);
    var form = $('[data-fitform]', box), sizeEl = $('#fit-size'), why = $('#fit-why'), savedEl = $('#fit-saved');
    var track = $('#fit-rail'), railEl = track.closest('[data-rail]');
    var last = null, cur = null;
    function cardHTML(p, size) {
      var c = K.sizeState(p, p.defaultColor, size) === 'in' ? p.defaultColor : (p.colors.filter(function (x) { return x.sizes[size] === 'in'; })[0] || {}).name;
      var shown = c || p.defaultColor, m = K.media(p, shown), at = size === 'XS/S' ? 0 : 100;
      var st = c ? (c === p.defaultColor ? '<b>In stock</b> in your size' : '<b>In stock in ' + esc(c) + '</b>, ' + esc(p.defaultColor) + ' is sold out in ' + esc(size)) : '<b>Sold out</b> in your size right now';
      var inBag = c && K.Bag.has(p.handle, c, size);
      return '<article class="fcard" role="listitem"><a class="fcard__media" href="' + K.pdpUrl(p, shown) + '"><img src="' + K.img(m.imgs[0]) + '" alt="' + esc(p.name + ' in ' + (m.shown || shown)) + '" loading="lazy"></a>' +
        '<div class="fcard__top"><a href="' + K.pdpUrl(p, shown) + '">' + esc(p.name) + '</a>' + K.priceHTML(p) + '</div>' +
        '<div class="fcard__scale" aria-hidden="true"><i style="--at:' + at + '%"></i><span class="' + (size === 'XS/S' ? 'is-you' : '') + '">XS/S</span><span class="' + (size === 'M/L' ? 'is-you' : '') + '">M/L</span></div>' +
        '<p class="fcard__st' + (c ? '' : ' is-out') + '">' + st + '</p>' +
        (c ? '<button type="button" class="btn btn--line' + (inBag ? ' is-added' : '') + '" data-add="' + p.handle + '" data-c="' + esc(c) + '" data-s="' + esc(size) + '">' + (inBag ? '✓ ' + esc(size) + ' in bag' : 'Add ' + esc(size) + (c === p.defaultColor ? '' : ' · ' + esc(c))) + '</button>' : '') +
        '</article>';
    }
    function drawCards(size) {
      cur = size;
      var keep = track.scrollLeft;
      track.innerHTML = FIT_PICKS.map(function (h) { return cardHTML(P(h), size); }).join('');
      track.scrollLeft = keep;
      K.hd(track);
      K.rail(railEl);
    }
    function show(v, persist) {
      var r = K.Fit.recommend(v.h, v.eu, v.pref);
      if (r.size !== last) {
        sizeEl.classList.add('is-swap');
        $('span', sizeEl).textContent = r.size;
        void sizeEl.offsetWidth;
        sizeEl.classList.remove('is-swap');
        last = r.size;
        drawCards(r.size);
      }
      why.textContent = r.why;
      if (persist) { K.Fit.set(r); savedEl.hidden = false; }
    }
    K.bindFitForm(form, function (v) { show(v, true); });
    show(saved || { h: 165, eu: 36, pref: 'sculpt' }, false);
    savedEl.hidden = !saved;
    doc.addEventListener('bag:change', function () { if (cur) drawCards(cur); });
  }

  /* =================== REVIEWS: one voice at a time =================== */
  function reviews() {
    var stage = $('#rev-stage');
    if (!stage) return;
    var R = M.reviews, i = 0;
    stage.innerHTML = R.map(function (r, k) {
      var p = P(r.handle);
      return '<figure class="rev__slide' + (k === 0 ? ' is-on' : '') + '"' + (k ? ' aria-hidden="true"' : '') + '><blockquote class="rev__q">' + esc(r.text) + '</blockquote>' +
        '<figcaption class="rev__by"><b>' + esc(r.name) + '</b><span class="ver">✓ Verified buyer</span><span>' + esc(r.item) + ' · ' + esc(r.date) + '</span>' +
        (p ? '<a class="textbtn" href="' + K.pdpUrl(p) + '">Shop the ' + esc(p.name) + '</a>' : '') + '</figcaption></figure>';
    }).join('');
    var slides = $$('.rev__slide', stage);
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function go(k) {
      i = (k + R.length) % R.length;
      slides.forEach(function (s, n) { s.classList.toggle('is-on', n === i); if (n === i) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true'); });
      $('#rev-count').textContent = pad(i + 1) + ' / ' + pad(R.length);
    }
    $('#rev-prev').addEventListener('click', function () { go(i - 1); });
    $('#rev-next').addEventListener('click', function () { go(i + 1); });
    var sx = null;
    stage.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    stage.addEventListener('pointerup', function (e) { if (sx == null) return; var d = e.clientX - sx; sx = null; if (Math.abs(d) > 48) go(i + (d < 0 ? 1 : -1)); });
    go(0);
  }

  /* =================== FILM (their own homepage video) =================== */
  function film() {
    var box = $('#film');
    if (!box || !M.film) return;
    var v = $('video', box), btn = $('#film-ctl'), loaded = false, userPaused = K.RM, inView = false;
    function paint() {
      var on = !v.paused;
      btn.innerHTML = (on ? PAUSE : PLAY) + '<span>' + (on ? 'Pause film' : 'Play film') + '</span>';
    }
    function play() {
      if (!loaded) { loaded = true; v.src = M.film.src; }
      var pr = v.play();
      if (pr && pr.catch) pr.catch(paint);
    }
    v.addEventListener('playing', paint);
    v.addEventListener('pause', paint);
    v.addEventListener('error', function () { btn.hidden = true; });
    btn.addEventListener('click', function () { if (v.paused) { userPaused = false; play(); } else { userPaused = true; v.pause(); } });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        inView = es[0].isIntersecting;
        if (inView && !userPaused && !doc.hidden) play();
        else if (!inView && !v.paused) v.pause();
      }, { threshold: 0.35 }).observe(box);
    }
    doc.addEventListener('visibilitychange', function () { if (doc.hidden) { if (!v.paused) v.pause(); } else if (inView && !userPaused) play(); });
    paint();
  }

  function init() {
    hero(); shop(); spotlight(); edit(); look(); fit(); reviews(); film();
    K.reveal(document);
    function route(hash) {
      var m = (hash || '').match(/^#([\w-]+)$/);
      if (!m || !document.getElementById(m[1])) return false;
      jump('#' + m[1]);
      return true;
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href*="#"]');
      if (!a || a.hasAttribute('data-shop-color')) return;
      var m = a.getAttribute('href').match(/^(?:index\.html)?(#[\w-]+)$/);
      if (m && route(m[1])) { e.preventDefault(); history.replaceState(null, '', m[1]); }
    });
    if (location.hash) setTimeout(function () { route(location.hash); }, 80);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
