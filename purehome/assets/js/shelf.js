/* PURE HOME v6 · Šetrné prostředky. Voní malinou.
   Plynulý pás: prostředky jedou přesně se scrollem (bez zastávek a bez zpožděných přechodů),
   ten uprostřed je největší a má barevný podklad podle etikety. Malinové prostředky
   „voní": za lahví stoupá jemný růžový opar. Fotky se nikdy nezvětšují nad své rozlišení.
   v6: styly se zapisují jen při změně, fotky se připraví (dekódují) dřív, než pás přijede do obrazu,
   a opar se mimo obraz zastaví. */
(function (W, D) {
  'use strict';
  var C = W.PHC, P = W.PH, css = C.css;
  var sec = C.$('.shelf'); if (!sec || !P) return;
  var pin = C.$('.shelf__pin', sec), stage = C.$('.shelf__stage', sec), track = C.$('[data-render="shelf"]'), info = C.$('[data-render="shelf-info"]'), barI = C.$('.shelf__bar i', sec);
  var items = P.products.filter(function (p) { return p.kind === 'bottle'; }), n = items.length;
  C.$('[data-render="shelf-head"]').innerHTML = '<h2 class="h2" id="prostredky-t" data-split>' + C.esc(P.shelf.title) + '</h2><p class="lead" data-rv>' + C.esc(P.shelf.text) + '</p>';
  track.innerHTML = items.map(function (p, i) {
    return '<li class="pr" style="--tint:' + p.tint + ';--ar:' + p.w + ' / ' + p.h + '">' +
      '<span class="pr__disc" aria-hidden="true"></span>' +
      (p.malina ? '<span class="pr__aroma" aria-hidden="true"><i></i><i></i><i></i></span>' : '') +
      '<span class="pr__img"><img src="' + p.img + '" width="' + p.w + '" height="' + p.h + '" alt="' + C.esc(p.brand + ' ' + p.name + ', ' + p.vol) + '" loading="lazy" decoding="async"></span></li>';
  }).join('');
  var els = C.$$('.pr', track), imgs = els.map(function (e) { return C.$('.pr__img', e); }), discs = els.map(function (e) { return C.$('.pr__disc', e); });

  info.innerHTML = '<div class="si si--a"></div><div class="si si__text"></div><p class="si__count"><b>1</b> / ' + n + '</p>';
  var siA = C.$('.si--a', info), siT = C.$('.si__text', info), siN = C.$('.si__count b', info);

  var cw = 300, stageH = 400;
  function measure() {
    var r = stage.getBoundingClientRect(); stageH = r.height;
    var m = C.mobile();
    var ih = Math.min(stageH * (m ? .62 : .72), 560);               // výška lahve, max. kolem nativního rozlišení
    cw = m ? Math.min(W.innerWidth * .62, 300) : Math.min(W.innerWidth * .26, 380);
    var dw = Math.min(cw * (m ? 1.05 : .92), stageH * .78);
    els.forEach(function (el, i) {
      el.style.setProperty('--cw', cw.toFixed(1) + 'px');
      el.style.setProperty('--dw', dw.toFixed(1) + 'px');
      el.style.setProperty('--ih', (ih * (items[i].rel || 1)).toFixed(1) + 'px');
    });
    last = -1; update(p);
  }

  var p = 0, last = -1, active = -1, swapT;
  function update(pp) {
    var u = C.sub(pp, .05, .95) * (n - 1);
    if (Math.abs(u - last) < .0005) return; last = u;
    css(track, 'transform', 'translate3d(' + (-(u + .5) * cw).toFixed(1) + 'px,0,0)');
    for (var i = 0; i < n; i++) {
      var d = i - u, ad = Math.min(Math.abs(d), 2);
      var s = 1 - Math.min(ad, 1.4) * .24, o = 1 - ad * .32, dx = -d * cw * .07;
      css(imgs[i], 'transform', 'translate3d(' + dx.toFixed(1) + 'px,' + (ad * 10).toFixed(1) + 'px,0) scale(' + s.toFixed(3) + ')');
      css(imgs[i], 'opacity', o.toFixed(3));
      css(discs[i], 'transform', 'scale(' + (1 - Math.min(ad, 1) * .42).toFixed(3) + ')');
      css(discs[i], 'opacity', (1 - Math.min(ad, 1) * .55).toFixed(3));
    }
    css(barI, 'transform', 'scaleX(' + C.clamp(pp, 0, 1).toFixed(3) + ')');
    var a = Math.round(u);
    if (a !== active) setActive(a);
  }
  function fill(a) {
    var it = items[a];
    siA.innerHTML = '<p class="si__brand">' + C.esc(it.brand) + ' · ' + C.esc(it.vol) + '</p><h3 class="si__name">' + C.esc(it.name) + '</h3>';
    siT.innerHTML = '<p>' + C.esc(it.text) + '</p><p class="si__where">Kde ho Iva použije: ' + C.esc(it.where) + '</p>';
    siN.textContent = a + 1;
  }
  function setActive(a) {
    var first = active < 0; active = a;
    els.forEach(function (el, j) { el.classList.toggle('is-on', j === a); });
    if (first || C.RM) { fill(a); return; }
    siA.classList.add('is-out'); siT.classList.add('is-out');
    clearTimeout(swapT);
    swapT = setTimeout(function () { fill(active); siA.classList.remove('is-out'); siT.classList.remove('is-out'); }, 200);
  }

  /* fotky lahví se stáhnou a dekódují s předstihem, aby pás při příjezdu nezaškobrtl */
  if ('IntersectionObserver' in W) {
    var pre = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return; pre.disconnect();
      C.$$('img', track).forEach(function (im) { im.loading = 'eager'; if (im.decode) im.decode().catch(function () {}); });
    }, { rootMargin: '150% 0px 150% 0px' });
    pre.observe(sec);
  }
  if (C.RM) { measure(); update(0); return; }
  C.Scroll.add(sec, function (pp) { p = pp; update(pp); }, { pin: pin, onVis: function (v) { sec.classList.toggle('is-vis', v); } });
  C.onResize(measure);
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(measure); else measure();
  W.addEventListener('load', measure);
})(window, document);
