/* MOONSUIT · concept by MALUS/01 · v4 · homepage */
(function () {
  'use strict';
  var M = window.MS, K = window.MSK;
  var $ = K.$, $$ = K.$$, esc = K.esc, fmt = K.fmt, P = K.P;
  var doc = document;
  var MARK = '<svg class="logo-svg logo-mark" viewBox="0 -6 254 170" aria-hidden="true" focusable="false"><use class="letters" href="#p-letters"/><use class="crescent" href="#p-cres"/></svg>';
  var PLAY = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1l7 4-7 4z"/></svg>';
  var ICON = {
    prev: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5"/></svg>',
    next: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>',
    close: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg>'
  };
  var PAUSE = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1h2v8H2zM6 1h2v8H6z"/></svg>';

  /* =================== HERO: editions, the next one rises like the moon over the last =================== */
  var HW = window.innerWidth < 720 ? 1100 : 2000;
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
        '<a class="btn btn--line" href="kategorie.html?c=' + encodeURIComponent(colour) + '">Shop all ' + esc(colour) + '</a>' +
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
    E.slice(1).forEach(function (e) { var i = new Image(); i.src = K.img(e.img, HW); });

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
      if (wimg.getAttribute('src') !== K.img(e.img, HW)) wimg.src = K.img(e.img, HW);
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
      baseImg.src = K.img(E[0].img, HW); baseImg.style.objectPosition = E[0].pos;
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

  function moonsHTML(list, on, counts) {
    return '<button type="button" class="mc' + (on === 'all' ? ' is-on' : '') + '" data-color="all" aria-pressed="' + (on === 'all') + '"><span class="mc__d mc__d--all"></span><span class="mc__l">All</span>' + (counts ? '<span class="mc__n">' + M.products.length + '</span>' : '') + '</button>' +
      list.map(function (c) {
        var n = M.products.filter(function (p) { return K.hasColor(p, c); }).length;
        return '<button type="button" class="mc' + (on === c ? ' is-on' : '') + '" data-color="' + esc(c) + '" aria-pressed="' + (on === c) + '"><span class="mc__d" style="--c:' + K.hex(c) + '"></span><span class="mc__l">' + esc(c) + '</span>' + (counts ? '<span class="mc__n">' + n + '</span>' : '') + '</button>';
      }).join('');
  }
  /* =================== NEW IN: shoppable stories (moons) + the newest pieces =================== */
  function newIn() {
    var row = $('#strow'), track = $('#new-rail');
    if (!row || !M.stories) return;
    var seen = K.store.get('ms-seen', []);
    row.innerHTML = M.stories.map(function (s, i) {
      return '<button type="button" class="stb' + (seen.indexOf(s.id) > -1 ? ' is-seen' : '') + '" role="listitem" data-st="' + s.id + '" data-i="' + i + '" style="--mc:' + s.mc + '" aria-label="' + esc(s.label + (s.isNew ? ', new' : '') + ': story with ' + s.items.length + ' photos you can shop') + '">' +
        '<span class="stb__ring"><img src="' + K.img(s.items[0][2], 240) + '" alt="" loading="lazy" decoding="async"></span>' +
        '<span class="stb__l">' + esc(s.label) + (s.isNew ? '<sup>new</sup>' : '') + '</span></button>';
    }).join('');
    row.addEventListener('click', function (e) { var b = e.target.closest('[data-i]'); if (b) K.stories.open(+b.dataset.i); });
    if (!track) return;
    // the Wine edition first, then every other piece in its main colour
    var list = [['cross-back-bra', 'Wine'], ['seamless-short', 'Wine'], ['long-sleeve-top', 'Wine']], used = {};
    list.forEach(function (x) { used[x[0]] = 1; });
    M.products.forEach(function (p) { if (!used[p.handle]) list.push([p.handle, p.defaultColor]); });
    list.forEach(function (x) { var el = K.cardEl(P(x[0]), x[1]); el.setAttribute('role', 'listitem'); track.appendChild(el); });
    K.rail(track.closest('[data-rail]'));
  }

  /* =================== THE LINE-UP: five looks in a row, the middle one in focus; tap it for every piece =================== */
  function lineup() {
    var sec = $('#lineup');
    if (!sec || !M.lineup) return;
    var L = M.lineup, N = L.length, RW = 'assets/img/rw/', reduce = K.RM;
    var st = { a: Math.min(2, N - 1), look: false };
    var stage = $('[data-rw]', sec), moon = $('.rw__moon', stage);
    var mob = function () { return window.innerWidth < 900; };
    var colourOf = function (l) { return l.pins[0][1]; };
    stage.insertAdjacentHTML('afterbegin', L.map(function (l, i) {
      return '<button type="button" class="rw__f" data-rwf="' + i + '" style="--r:' + l.r + ';--h:' + l.h + '" aria-label="' + esc(l.name) + ' look">' +
        '<span class="rw__fig"><img class="rw__b" src="' + RW + l.k + '-b.webp" alt="" draggable="false"><img class="rw__s" data-src="' + RW + l.k + '.webp" alt="" draggable="false">' +
        l.pins.map(function (pn, j) { return '<span class="rw__pin" style="left:' + pn[2] + '%;top:' + pn[3] + '%;--j:' + j + '" data-pin="' + j + '" aria-hidden="true">' + (j + 1) + '</span>'; }).join('') +
        '</span></button>';
    }).join(''));
    $('[data-rwidx]', sec).innerHTML = L.map(function (l, i) { return '<button type="button" data-rwi="' + i + '">' + esc(l.name) + '</button>'; }).join('');
    // categories as words, with real counts
    var cm = $('#cmore');
    if (cm) cm.innerHTML = M.types.filter(function (t) { return t.id !== 'all'; }).map(function (t) {
      var n = M.products.filter(function (p) { return p.type === t.id; }).length;
      return n ? '<a href="' + K.catUrl(t.id) + '">' + esc(t.label.toLowerCase()) + '<sup>' + n + '</sup></a>' : '';
    }).join('') + '<a href="kategorie.html">shop all<sup>' + M.products.length + '</sup></a>';
    var figs = $$('.rw__f', stage);
    var off = function (i) { var d = i - st.a; if (d > N / 2) d -= N; if (d < -N / 2) d += N; return d; };
    var prevD = figs.map(function (_, i) { return off(i); });
    function place(instant) {
      var W = stage.clientWidth, H = stage.clientHeight, m = mob();
      var sp = m ? W * 0.42 : Math.min(W * 0.17, 320);
      var mx = 0;
      figs.forEach(function (f, i) {
        var d = off(i), ad = Math.abs(d);
        var x = d * sp * (ad > 1 ? 0.94 : 1), s = [1, 0.8, 0.66][Math.min(ad, 2)], y = -ad * H * 0.016;
        var op = ad === 0 ? 1 : (ad === 1 ? 0.96 : (ad === 2 && !m ? 0.62 : 0));
        if (st.look) { if (ad === 0) { s = m ? 0.95 : 1.02; x = m ? 0 : -(f.offsetWidth * s) / 2 - (W < 1200 ? W * 0.05 : 56); y = 0; mx = x; } else op = 0; }
        var wrap = Math.abs(d - prevD[i]) > N / 2; prevD[i] = d;
        f.style.transition = instant || wrap || reduce ? 'none' : '';
        f.style.transform = 'translate3d(calc(-50% + ' + x.toFixed(1) + 'px),' + y.toFixed(1) + 'px,0) scale(' + s + ')';
        f.style.opacity = op; f.style.zIndex = 10 - ad;
        f.classList.toggle('is-on', ad === 0);
        f.tabIndex = op > 0 ? 0 : -1; f.setAttribute('aria-hidden', op === 0 ? 'true' : 'false');
        if (instant || wrap) void f.offsetWidth;
      });
      // the moon behind the figure in focus takes the colour of the look
      moon.style.transition = instant || reduce ? 'none' : '';
      moon.style.transform = 'translate3d(calc(-50% + ' + mx.toFixed(1) + 'px),0,0)';
      moon.style.setProperty('--mc', L[st.a].tint);
    }
    function renderNow() {
      var l = L[st.a], c = colourOf(l);
      $('[data-rwnow]', sec).innerHTML = '<span class="rw__n">' + esc(l.name) + '</span><span class="rw__c">' + l.pins.length + ' pieces in this look</span>' +
        '<span class="rw__acts"><button type="button" class="btn btn--line" data-rwo>See the look</button><a class="lnk" href="kategorie.html?c=' + encodeURIComponent(c) + '">Shop ' + esc(c) + '</a></span>';
      $$('[data-rwi]', sec).forEach(function (b) { b.setAttribute('aria-current', +b.dataset.rwi === st.a ? 'true' : 'false'); });
    }
    function lookHTML() {
      var l = L[st.a], inLook = {};
      l.pins.forEach(function (pn) { inLook[pn[0]] = 1; });
      var rows = l.pins.map(function (pn, j) {
        var p = P(pn[0]), c = pn[1], m = K.media(p, c);
        return '<li class="rwl__it" data-pi="' + j + '"><span class="rwl__no">' + (j + 1) + '</span>' +
          '<a class="rwl__pic" href="' + K.pdpUrl(p, c) + '"><img src="' + K.img(m.imgs[0], 240) + '" alt="" loading="lazy"></a>' +
          '<span class="rwl__tx"><a href="' + K.pdpUrl(p, c) + '">' + esc(p.name) + '</a><span>' + esc(c) + ' · ' + (p.compare ? '<s>' + fmt(p.compare) + '</s> ' : '') + fmt(p.price) + '</span>' +
          '<span class="rwl__sz">' + K.availSizes(p, c).map(function (s) {
            var ok = K.sizeState(p, c, s) === 'in', inBag = K.Bag.has(p.handle, c, s);
            return '<button type="button" data-rwadd="' + j + '" data-s="' + esc(s) + '"' + (ok ? '' : ' disabled') + (inBag ? ' class="is-in"' : '') + ' aria-label="' + esc((inBag ? 'In your bag: ' : 'Add to bag: ') + p.name + ', ' + c + ', ' + s) + '">' + (inBag ? '✓ ' : '+ ') + esc(s) + (ok ? '' : ' · sold out') + '</button>';
          }).join('') + '</span></span></li>';
      }).join('');
      var full = ['XS/S', 'M/L'].map(function (s, k) {
        var ok = l.pins.every(function (pn) { var p = P(pn[0]); return p.oneSize || K.sizeState(p, pn[1], s) === 'in'; });
        return '<button type="button" class="btn' + (k ? ' btn--line' : '') + '" data-rwfull="' + s + '"' + (ok ? '' : ' disabled title="Not every piece is in stock in ' + s + '"') + '>Full look · ' + s + '</button>';
      }).join('');
      var c0 = colourOf(l);
      var more = M.products.filter(function (p) { return !inLook[p.handle] && K.hasColor(p, c0) && K.C(p, c0).img.length; }).slice(0, 3);
      return '<div class="rwl"><div class="rwl__hd"><p class="cap">In this look · ' + esc(l.name) + '</p><span class="rwl__ctl">' +
        '<button type="button" data-rwp aria-label="Previous look">' + ICON.prev + '</button><button type="button" data-rwn aria-label="Next look">' + ICON.next + '</button><button type="button" data-rwx aria-label="Close the look">' + ICON.close + '</button></span></div>' +
        '<ol class="rwl__list">' + rows + '</ol><div class="rwl__full">' + full + '</div>' +
        (more.length ? '<p class="cap rwl__more">Also in ' + esc(c0) + '</p><div class="rwl__grid">' + more.map(function (p) {
          return '<a href="' + K.pdpUrl(p, c0) + '"><img src="' + K.img(K.media(p, c0).imgs[0], 360) + '" alt="" loading="lazy"><span>' + esc(p.name) + '</span><b>' + fmt(p.price) + '</b></a>';
        }).join('') + '</div>' : '') + '</div>';
    }
    function renderLook() {
      var box = mob() ? $('[data-rwlm]', sec) : $('[data-rwl]', sec), other = mob() ? $('[data-rwl]', sec) : $('[data-rwlm]', sec);
      other.innerHTML = ''; box.innerHTML = st.look ? lookHTML() : '';
      sec.classList.toggle('is-look', st.look);
    }
    function setActive(i, keep) { st.a = ((i % N) + N) % N; if (!keep) st.look = false; place(); renderNow(); renderLook(); }
    function openLook(on) {
      st.look = on; renderLook(); place();
      if (on && mob()) setTimeout(function () { window.scrollTo({ top: window.scrollY + stage.getBoundingClientRect().top - 70, behavior: reduce ? 'auto' : 'smooth' }); }, 60);
    }
    place(true); renderNow();
    // the sharp figures load only when the section comes close
    var loadSharp = function () { $$('.rw__s[data-src]', stage).forEach(function (im) { im.src = im.dataset.src; im.removeAttribute('data-src'); }); };
    if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { loadSharp(); io.disconnect(); } }, { rootMargin: '900px 0px' }); io.observe(stage); } else loadSharp();
    var rt = 0, lastW = window.innerWidth;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (window.innerWidth === lastW) return; lastW = window.innerWidth; if (st.look) { st.look = false; renderLook(); } place(true); }, 120); });
    doc.addEventListener('bag:change', function () { if (st.look) renderLook(); });
    sec.addEventListener('click', function (e) {
      if (e.target.closest('[data-rwp]')) { setActive(st.a - 1, st.look); return; }
      if (e.target.closest('[data-rwn]')) { setActive(st.a + 1, st.look); return; }
      if (e.target.closest('[data-rwx]')) { openLook(false); return; }
      if (e.target.closest('[data-rwo]')) { openLook(true); return; }
      var ix = e.target.closest('[data-rwi]'); if (ix) { setActive(+ix.dataset.rwi); return; }
      var add = e.target.closest('[data-rwadd]');
      if (add) { var pn = L[st.a].pins[+add.dataset.rwadd]; if (!add.classList.contains('is-in')) K.addToBag(pn[0], pn[1], add.dataset.s); else K.openP('bag', add); return; }
      var full = e.target.closest('[data-rwfull]');
      if (full) { var sz = full.dataset.rwfull; K.addMany(L[st.a].pins.map(function (pn) { return { h: pn[0], c: pn[1], s: P(pn[0]).oneSize ? 'One size' : sz }; }), 'The ' + L[st.a].name + ' look'); return; }
      var pin = e.target.closest('.rw__pin');
      if (pin && st.look) { var it = $('.rwl__it[data-pi="' + pin.dataset.pin + '"]', sec); if (it) { it.classList.add('is-hot'); it.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' }); setTimeout(function () { it.classList.remove('is-hot'); }, 1200); } return; }
      var f = e.target.closest('.rw__f');
      if (f) { if (drag.moved) return; var i = +f.dataset.rwf; if (i === st.a) openLook(!st.look); else setActive(i, st.look); return; }
      if (st.look && e.target === stage) openLook(false);
    });
    // numbers on the figure and rows in the list light up together
    sec.addEventListener('pointerover', function (e) {
      var it = e.target.closest('.rwl__it'), pin = e.target.closest('.rw__pin');
      var j = it ? it.dataset.pi : (pin ? pin.dataset.pin : null);
      $$('.rw__f.is-on .rw__pin', stage).forEach(function (x) { x.classList.toggle('is-hot', x.dataset.pin === j); });
      $$('.rwl__it', sec).forEach(function (x) { x.classList.toggle('is-hot', x.dataset.pi === j); });
    });
    stage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); setActive(st.a + 1, st.look); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); setActive(st.a - 1, st.look); }
      else if (e.key === 'Escape' && st.look) openLook(false);
      else if ((e.key === 'Enter' || e.key === ' ') && e.target === stage) { e.preventDefault(); openLook(!st.look); }
    });
    // drag sideways with mouse or finger; vertical page scroll stays
    var drag = { x: 0, on: false, moved: false };
    stage.addEventListener('pointerdown', function (e) { if (e.button || e.target.closest('.rw__look, .rw__nav')) return; drag.on = true; drag.moved = false; drag.x = e.clientX; });
    stage.addEventListener('pointermove', function (e) { if (drag.on && Math.abs(e.clientX - drag.x) > 10) drag.moved = true; });
    stage.addEventListener('pointerup', function (e) {
      if (!drag.on) return; drag.on = false;
      var dx = e.clientX - drag.x;
      if (Math.abs(dx) > 40) setActive(st.a + (dx < 0 ? 1 : -1), st.look);
      setTimeout(function () { drag.moved = false; }, 0);
    });
    stage.addEventListener('pointercancel', function () { drag.on = false; });
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
      var src = K.img(list[photo], 1600);
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
      box.style.setProperty('--spot', (M.spotTint || {})[color] || '#ECEAE6');
      $('#spot-colours').innerHTML = p.colors.map(function (c) {
        return '<button type="button" class="mc' + (c.name === color ? ' is-on' : '') + '" data-c="' + esc(c.name) + '" aria-pressed="' + (c.name === color) + '"><span class="mc__d" style="--c:' + K.hex(c.name) + '"></span><span class="mc__l">' + esc(c.name) + '</span></button>';
      }).join('');
      $('#spot-thumbs').innerHTML = list.length > 1 ? list.map(function (n, k) { return '<button type="button" data-ph="' + k + '" aria-label="Photo ' + (k + 1) + '"><img src="' + K.img(n, 200) + '" alt=""></button>'; }).join('') : '';
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
    [['square-neck-bra-summer', 'Orange'], ['sculpting-short-summer', 'Orange'], ['square-neck-bra-summer', 'Kaki'], ['sculpting-legging-summer', 'Kaki']].forEach(function (x) {
      g.appendChild(K.cardEl(P(x[0]), x[1]));
    });
  }

  /* =================== WILL IT FIT? =================== */
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
      return '<article class="fcard" role="listitem"><a class="fcard__media" href="' + K.pdpUrl(p, shown) + '"><img src="' + K.img(m.imgs[0], 600) + '" alt="' + esc(p.name + ' in ' + (m.shown || shown)) + '" loading="lazy"></a>' +
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
    hero(); newIn(); lineup(); spotlight(); edit(); fit(); reviews(); film();
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
