/* PURE HOME v7 · úvod s logem a „jak to probíhá"
   Úvod: logo od Ivany se napíše tahy pera, čárou přes písmena proletí světelný paprsek a za ním
   zůstane zelená linka, pak naskočí PURE HOME a OSTRAVA. Animace jsou uvnitř SVG (SMIL),
   takže běží stejně v Safari i v Chromu a po skončení zůstane obyčejné logo.
   Příběh: světlo putuje po stěně se scrollem (plynule dotahované), ale úvod a kroky se
   přepínají časovanými přechody, takže nezáleží na tom, jak rychle se scrolluje. */
(function (W, D) {
  'use strict';
  var C = W.PHC, P = W.PH, LG = W.PH_LOGO, css = C.css;
  var sec = C.$('.day'); if (!sec || !P) return;
  var H = D.documentElement;
  var pin = C.$('.day__pin', sec), hero = C.$('.hero', sec), mark = C.$('.hero__mark', sec), cue = C.$('.hero__cue', sec);
  var light = C.$('.wall__light', sec), gold = C.$('.wall__gold', sec), warm = C.$('.wall__warm', sec);
  var storyHost = C.$('[data-render="story"]');

  /* ---------- úvod: texty ---------- */
  C.$('.hero__tag', hero).textContent = P.hero.tag;
  C.$('.hero__title', hero).textContent = P.hero.title;
  C.$('.hero__lead', hero).textContent = P.hero.lead;
  C.$('.hero__cta', hero).innerHTML = '<a class="btn" href="#poptavka">' + C.esc(P.hero.cta) + '</a><a class="link" href="#den">' + C.esc(P.hero.more) + '</a>';

  /* ---------- logo ---------- */
  var animate = !C.RM && !H.classList.contains('seen');
  var SPL = 'calcMode="spline" keyTimes="0;1" ';
  function at(t) { return 'lgGo.begin+' + t.toFixed(2) + 's'; }
  function anim(attr, values, t, dur, spline, extra) {
    return '<animate attributeName="' + attr + '" values="' + values + '" begin="' + at(t) + '" dur="' + dur + 's" fill="freeze"' + (spline ? ' ' + SPL + 'keySplines="' + spline + '"' : '') + (extra || '') + '/>';
  }
  var B0 = 0.95, BD = 0.9, BEZ = '.45 0 .25 1';          /* paprsek: začátek, délka, průběh */
  function logoSVG() {
    var vb = LG.vb, A = animate, c = LG.colors;
    var g = '<linearGradient id="lgM" gradientUnits="userSpaceOnUse" x1="540" y1="110" x2="980" y2="560"><stop offset="0" stop-color="#B5A089"/><stop offset=".3" stop-color="#CDB9A3"/><stop offset=".55" stop-color="#C3AF99"/><stop offset=".8" stop-color="#CAB6A1"/><stop offset="1" stop-color="#AF9A83"/></linearGradient>' +
      '<linearGradient id="lgS" gradientUnits="userSpaceOnUse" x1="400" y1="0" x2="1085" y2="0"><stop offset="0" stop-color="#9FA088"/><stop offset=".3" stop-color="#B2B09A"/><stop offset=".55" stop-color="#A2A28A"/><stop offset=".8" stop-color="#ACAC95"/><stop offset="1" stop-color="#8E8F77"/></linearGradient>' +
      '<radialGradient id="lgOrb"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".3" stop-color="#FFF9EC"/><stop offset=".62" stop-color="#F3D9A4" stop-opacity=".6"/><stop offset="1" stop-color="#F0D49C" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="lgBloom"><stop offset="0" stop-color="#FBE6BC" stop-opacity=".8"/><stop offset=".45" stop-color="#F6DCA8" stop-opacity=".32"/><stop offset="1" stop-color="#F6DCA8" stop-opacity="0"/></radialGradient>';
    var pens = '', masks = '';
    if (A) {
      LG.pens.forEach(function (p) {
        pens += '<path class="lg__pen" data-w="' + p.w + '" d="' + p.d + '" fill="none" stroke="#fff" stroke-width="' + p.w + '" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0 9999">' +
          anim('stroke-dashoffset', '0;0', p.t, p.dur, '.5 0 .2 1') + '</path>';
      });
      masks = '<mask id="lgMk" maskUnits="userSpaceOnUse" x="' + vb[0] + '" y="' + vb[1] + '" width="' + vb[2] + '" height="' + vb[3] + '">' + pens + '</mask>' +
        '<mask id="lgMs" maskUnits="userSpaceOnUse" x="' + vb[0] + '" y="' + vb[1] + '" width="' + vb[2] + '" height="' + vb[3] + '"><path class="lg__pen" data-w="' + LG.swoW + '" d="' + LG.spine + '" fill="none" stroke="#fff" stroke-width="' + LG.swoW + '" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0 9999">' +
        anim('stroke-dashoffset', '0;0', B0 + .04, BD, BEZ) + '</path></mask>';
    }
    var mono = '<g class="lg__mono" fill="url(#lgM)"' + (A ? ' mask="url(#lgMk)"' : '') + '>' + LG.mono.map(function (d) { return '<path d="' + d + '"/>'; }).join('') + '</g>';
    var swoosh = '<g class="lg__swoosh"' + (A ? ' mask="url(#lgMs)"' : '') + '><path d="' + LG.swoosh + '" fill="url(#lgS)"/></g>';
    function letters(list, color, t0, step, dy) {
      return '<g fill="' + color + '">' + list.map(function (d, i) {
        if (!A) return '<path d="' + d + '" fill-rule="evenodd"/>';
        var t = t0 + i * step;
        return '<path d="' + d + '" fill-rule="evenodd" opacity="0" transform="translate(0 ' + dy + ')">' + anim('opacity', '0;1', t, .5) +
          '<animateTransform attributeName="transform" type="translate" values="0 ' + dy + ';0 0" begin="' + at(t) + '" dur=".8s" fill="freeze" ' + SPL + 'keySplines=".16 1 .3 1"/></path>';
      }).join('') + '</g>';
    }
    var l = LG.lines, lw = LG.lineW;
    var lines = A ?
      '<line x1="' + l[0][2] + '" y1="' + l[0][1] + '" x2="' + l[0][2] + '" y2="' + l[0][1] + '" stroke="' + c.city + '" stroke-width="' + lw + '">' + anim('x1', l[0][2] + ';' + l[0][0], 1.55, .8, '.16 1 .3 1') + '</line>' +
      '<line x1="' + l[1][0] + '" y1="' + l[1][1] + '" x2="' + l[1][0] + '" y2="' + l[1][1] + '" stroke="' + c.city + '" stroke-width="' + lw + '">' + anim('x2', l[1][0] + ';' + l[1][2], 1.55, .8, '.16 1 .3 1') + '</line>' :
      l.map(function (q) { return '<line x1="' + q[0] + '" y1="' + q[1] + '" x2="' + q[2] + '" y2="' + q[1] + '" stroke="' + c.city + '" stroke-width="' + lw + '"/>'; }).join('');
    /* paprsek: zářící hlava s ohonem letí po středu čáry, za ním zůstává linka a jiskry */
    function beam(id, t, dur, strength, begin) {
      var bg = begin || at(t), o = strength;
      var tails = [[.24, 24, .34 * o, '#EFD39C'], [.13, 10, .6 * o, '#FFF3DC'], [.07, 3.6, .95 * o, '#FFFFFF']].map(function (q) {
        return '<path class="lg__tail" data-q="' + q[0] + '" d="' + LG.spine + '" fill="none" stroke="' + q[3] + '" stroke-width="' + q[1] + '" stroke-linecap="round" stroke-dasharray="0 9999" opacity="0">' +
          '<animate attributeName="stroke-dashoffset" values="0;0" begin="' + bg + '" dur="' + dur + 's" fill="freeze" ' + SPL + 'keySplines="' + BEZ + '"/>' +
          '<animate attributeName="opacity" values="0;' + q[2].toFixed(2) + ';' + q[2].toFixed(2) + ';0" keyTimes="0;.12;.82;1" begin="' + bg + '" dur="' + dur + 's" fill="freeze"/></path>';
      }).join('');
      var orb = function (r, fill, op) {
        return '<circle r="' + r + '" fill="' + fill + '" opacity="0">' +
          '<animateMotion path="' + LG.spine + '" keyPoints="0;1" begin="' + bg + '" dur="' + dur + 's" fill="freeze" ' + SPL + 'keySplines="' + BEZ + '"' + (id && r > 30 ? ' id="' + id + '"' : '') + '/>' +
          '<animate attributeName="opacity" values="0;' + op + ';' + op + ';0" keyTimes="0;.08;.86;1" begin="' + bg + '" dur="' + dur + 's" fill="freeze"/></circle>';
      };
      return '<g class="lg__beam">' + tails + orb(78, 'url(#lgBloom)', o) + orb(24, 'url(#lgOrb)', 1) + '</g>';
    }
    var beams = (A ? beam('', B0, BD, 1) : '') + beam('lgLoop', 0, 1.25, .62, at(A ? 3.4 : 1.2) + ';lgLoop.end+5.2s');
    return '<svg class="lg" viewBox="' + vb.join(' ') + '" role="img" aria-label="PURE HOME Ostrava" overflow="visible">' +
      '<defs>' + g + masks + '</defs><g><animate id="lgGo" attributeName="opacity" values="1;1" dur="indefinite" begin="indefinite"/></g>' +
      mono + swoosh + letters(LG.word, c.word, 1.12, .055, 16) + letters(LG.city, c.city, 1.5, .05, 10) + lines + beams + '<g class="lg__sparks"></g></svg>';
  }
  mark.innerHTML = logoSVG();
  var svg = C.$('svg', mark), go = svg && svg.querySelector('#lgGo');
  var smil = !!(go && go.beginElement && svg.pauseAnimations);

  /* jiskry tam, kudy proletí paprsek (pozice ze skutečné čáry, čas podle průběhu letu) */
  function bez(x1, y1, x2, y2) {                       /* cubic-bezier: čas pro daný postup (0..1) */
    return function (yv) {
      var lo = 0, hi = 1;
      for (var i = 0; i < 24; i++) { var t = (lo + hi) / 2, y = 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t; if (y < yv) lo = t; else hi = t; }
      var tt = (lo + hi) / 2; return 3 * (1 - tt) * (1 - tt) * tt * x1 + 3 * (1 - tt) * tt * tt * x2 + tt * tt * tt;
    };
  }
  var tOf = bez(.45, 0, .25, 1);
  function sparks() {
    if (!smil) return;
    var host = svg.querySelector('.lg__sparks'), sp = D.createElementNS('http://www.w3.org/2000/svg', 'path');
    sp.setAttribute('d', LG.spine); var len = sp.getTotalLength ? (function () { host.appendChild(sp); var v = sp.getTotalLength(); host.removeChild(sp); return v; })() : 0;
    if (!len) return;
    var STAR = 'M0 -10C1.1 -2.6 2.6 -1.1 10 0C2.6 1.1 1.1 2.6 0 10C-1.1 2.6 -2.6 1.1 -10 0C-2.6 -1.1 -1.1 -2.6 0 -10Z';
    function one(f, side, size, begin, dur) {
      var a = sp.getPointAtLength(f * len), b = sp.getPointAtLength(Math.min(len, f * len + 4));
      var nx = -(b.y - a.y), ny = b.x - a.x, nl = Math.hypot(nx, ny) || 1, off = side * (16 + size * .9);
      var x = a.x + nx / nl * off, y = a.y + ny / nl * off;
      return '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"><g transform="scale(0)">' +
        '<circle r="' + (size * 2.2).toFixed(1) + '" fill="url(#lgBloom)"/><path d="' + STAR + '" fill="#FFFFFF" transform="scale(' + (size / 10).toFixed(2) + ')"/>' +
        '<animateTransform attributeName="transform" type="scale" values="0;1;0" keyTimes="0;.35;1" begin="' + begin + '" dur="' + dur + 's" fill="freeze" calcMode="spline" keySplines=".2 .8 .3 1;.6 0 .8 .4"/></g></g>';
    }
    host.appendChild(sp);
    var out = '';
    if (animate) [[.12, 1, 13], [.27, -1, 17], [.41, 1, 12], [.55, -1, 18], [.68, 1, 13], [.8, -1, 16], [.92, 1, 20], [.99, -1, 14]].forEach(function (q) {
      out += one(q[0], q[1], q[2], at(B0 + tOf(q[0]) * BD + .05), .75);
    });
    [[.3, -1, 12], [.62, 1, 14], [.95, -1, 13]].forEach(function (q) {
      out += one(q[0], q[1], q[2], 'lgLoop.begin+' + (tOf(q[0]) * 1.25 + .05).toFixed(2) + 's', .8);
    });
    host.removeChild(sp);
    host.innerHTML = out;   /* SVG obsah přes innerHTML: v moderních prohlížečích v pořádku */
  }
  /* čárkování ve skutečných délkách (pathLength Safari u čárkování neumí spolehlivě) a jen s kladným posunem:
     pero začíná celé mimo cestu i s kulatým koncem, ohon paprsku jede s hlavou */
  function fitDash() {
    C.$$('.lg__pen', svg).forEach(function (p) {
      var L = p.getTotalLength ? p.getTotalLength() : 0; if (!L) return;
      var w = Number(p.getAttribute('data-w')), o0 = (L + w / 2 + 2).toFixed(1);
      p.setAttribute('stroke-dasharray', L.toFixed(1) + ' ' + (L + w + 20).toFixed(1));
      p.setAttribute('stroke-dashoffset', o0);
      var an = p.querySelector('animate'); if (an) an.setAttribute('values', o0 + ';0');
    });
    C.$$('.lg__tail', svg).forEach(function (p) {
      var L = p.getTotalLength ? p.getTotalLength() : 0; if (!L) return;
      var d = Number(p.getAttribute('data-q')) * L;
      p.setAttribute('stroke-dasharray', '0 ' + L.toFixed(1) + ' ' + d.toFixed(1) + ' ' + (2 * L + 100).toFixed(1));
      p.setAttribute('stroke-dashoffset', (L + d).toFixed(1));
      var an = p.querySelector('animate[attributeName="stroke-dashoffset"]'); if (an) an.setAttribute('values', (L + d).toFixed(1) + ';' + d.toFixed(1));
    });
  }
  function settleLogo() {        /* po úvodu: bez masek (stejný vzhled, méně práce pro prohlížeč) */
    C.$$('[mask]', svg).forEach(function (el) { el.removeAttribute('mask'); });
    C.$$('mask', svg).forEach(function (el) { el.parentNode.removeChild(el); });
  }

  /* ---------- příběh ---------- */
  var DY = P.day, phases = DY.phases;
  var CK = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 10.5l4 4L16.5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  storyHost.innerHTML = '<h2 class="sr">' + C.esc(DY.label) + '</h2><ol class="tl" aria-hidden="true"><span class="tl__fill"></span>' +
    phases.map(function (ph, i) { return '<li><span class="tl__n">' + (i + 1) + '</span>' + C.esc(ph.when) + '<i class="tl__bar"><i></i></i></li>'; }).join('') + '</ol>' +
    phases.map(function (ph, i) {
      return '<div class="st is-after" data-i="' + i + '"><div class="st__in">' +
        '<p class="st__when"><span>' + (i + 1) + ' / ' + phases.length + '</span><i></i>' + C.esc(ph.when) + '</p><h3 class="st__title">' + C.esc(ph.title) + '</h3><p class="st__text">' + C.esc(ph.text) + '</p>' +
        (ph.chips ? '<div class="st__chips">' + ph.chips.map(function (c) { return '<span>' + C.esc(c) + '</span>'; }).join('') + '</div>' : '') +
        (ph.photos ? '<div class="st__cta"><a class="btn btn--ghost" href="#poptavka">Sestavit poptávku s fotkami</a></div>' : '') +
        (ph.tasks ? '<ul class="st__tasks">' + ph.tasks.map(function (t, k) { return '<li style="--k:' + k + '">' + CK + '<span>' + C.esc(t) + '</span></li>'; }).join('') + '</ul>' : '') +
        (ph.cta ? '<div class="st__cta"><a class="btn" href="#poptavka">Poptat úklid</a><a class="link" href="#iva">Poznat Ivanu <i></i></a></div>' : '') + '</div></div>';
    }).join('');
  var stEls = C.$$('.st', storyHost), tl = C.$('.tl', storyHost), tlFill = C.$('.tl__fill', storyHost), tlItems = C.$$('.tl li', storyHost), tlBars = C.$$('.tl__bar i', storyHost);

  /* ---------- časová osa ---------- */
  var CEN = [.19, .36, .53, .70, .87], HALF = .075, EDGE = .03, HERO_OUT = .006;
  function startOf(i) { return CEN[i] - HALF - EDGE; }

  /* odkazy „Jak to probíhá" dojedou na první krok příběhu */
  D.addEventListener('click', function (e) {
    var a = e.target.closest('a[href="#den"]'); if (!a) return;
    e.preventDefault();
    var top = sec.getBoundingClientRect().top + W.pageYOffset, span = sec.offsetHeight - pin.offsetHeight;
    W.scrollTo({ top: C.RM ? top + pin.offsetHeight : top + span * (startOf(0) + .045), behavior: C.RM ? 'auto' : 'smooth' });
  });

  /* přepínání: úvod a kroky přes třídy (časované přechody v CSS) */
  var heroOut = null, act = -2;
  function setHero(out) {
    if (out === heroOut) return; heroOut = out;
    hero.classList.toggle('is-out', out); if (cue) cue.classList.toggle('is-out', out);
    if (smil) { if (out) svg.pauseAnimations(); else svg.unpauseAnimations(); }
  }
  function setAct(a) {
    if (a === act) return; act = a;
    for (var i = 0; i < stEls.length; i++) {
      var el = stEls[i];
      el.classList.toggle('is-on', i === a); el.classList.toggle('is-before', a >= 0 && i < a); el.classList.toggle('is-after', a < 0 || i > a);
    }
    tl.classList.toggle('is-on', a >= 0);
    for (var k = 0; k < tlItems.length; k++) tlItems[k].classList.toggle('on', a >= 0 && k <= a);
  }

  /* plynule dotahované hodnoty: světlo, zlatý večer, proužky (nezávisí na trhaném scrollu) */
  var mob = C.mobile(), tgt = { tx: 6, ty: -3, sc: 1, g: 0, fill: 0, bars: [0, 0, 0, 0, 0] }, cur = null, sraf = 0, last = 0;
  function copy(o) { return { tx: o.tx, ty: o.ty, sc: o.sc, g: o.g, fill: o.fill, bars: o.bars.slice() }; }
  function write() {
    css(light, 'transform', 'translate3d(' + cur.tx.toFixed(2) + '%,' + cur.ty.toFixed(2) + '%,0)' + (mob ? '' : ' scale(' + cur.sc.toFixed(4) + ')'));
    css(gold, 'opacity', (cur.g * .55).toFixed(3)); css(gold, 'visibility', cur.g > .002 ? 'visible' : 'hidden');
    if (warm) { css(warm, 'opacity', (cur.g * .7).toFixed(3)); css(warm, 'visibility', cur.g > .002 ? 'visible' : 'hidden'); }
    if (mob) for (var j = 0; j < tlBars.length; j++) css(tlBars[j], 'transform', 'scaleX(' + cur.bars[j].toFixed(3) + ')');
    else css(tlFill, 'transform', 'scaleY(' + cur.fill.toFixed(3) + ')');
  }
  function step(now) {
    sraf = 0;
    var dt = Math.min(64, now - (last || now - 16.7)); last = now;
    var k = 1 - Math.pow(1 - .14, dt / 16.7), moving = false;
    function ease(a, b) { var d = b - a; if (Math.abs(d) > .0006) moving = true; return Math.abs(d) < .0006 ? b : a + d * k; }
    cur.tx = ease(cur.tx, tgt.tx); cur.ty = ease(cur.ty, tgt.ty); cur.sc = ease(cur.sc, tgt.sc); cur.g = ease(cur.g, tgt.g); cur.fill = ease(cur.fill, tgt.fill);
    for (var j = 0; j < 5; j++) cur.bars[j] = ease(cur.bars[j], tgt.bars[j]);
    write();
    if (moving) sraf = W.requestAnimationFrame(step); else last = 0;
  }
  function kick() { if (!cur) { cur = copy(tgt); write(); return; } if (!sraf) sraf = W.requestAnimationFrame(step); }

  function render(p) {
    if (p > .002 && !H.classList.contains('intro-settled')) H.classList.add('intro-settled');
    setHero(p > HERO_OUT);
    var a = -1; for (var i = 0; i < CEN.length; i++) if (p >= startOf(i)) a = i;
    setAct(a);
    var t = C.eio(C.sub(p, .04, 1));
    tgt.tx = C.lerp(6, -36, t); tgt.ty = C.lerp(-3, 7, t); tgt.sc = C.lerp(1, 1.08, t);
    tgt.g = C.sub(p, .62, .92);
    tgt.fill = C.sub(p, CEN[0], CEN[CEN.length - 1]);
    for (var j = 0; j < 5; j++) tgt.bars[j] = C.sub(p, startOf(j), j < 4 ? startOf(j + 1) : CEN[4] + HALF);
    kick();
  }

  /* ---------- intro ---------- */
  function intro() {
    if (smil) { fitDash(); sparks(); }
    if (!animate) { H.classList.add('intro-done', 'intro-settled'); if (smil) go.beginElement(); mark.classList.add('is-ready'); return; }
    if (smil) go.beginElement();
    requestAnimationFrame(function () { mark.classList.add('is-ready'); requestAnimationFrame(function () { H.classList.add('intro-done'); }); });
    var t0 = smil ? svg.getCurrentTime() : 0;
    (function trySettle() {   /* masky pryč, až logo opravdu doběhne (pozastavené logo čeká) */
      if (smil && svg.getCurrentTime() - t0 < 2.7) { setTimeout(trySettle, 400); return; }
      if (smil) settleLogo(); H.classList.add('intro-settled');
    })();
    try { sessionStorage.setItem('ph3-intro', '1'); } catch (e) {}
  }
  if (!smil) { /* bez SMIL (velmi staré prohlížeče): statické logo */ animate = false; mark.innerHTML = logoSVG(); svg = C.$('svg', mark); }
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(intro); else intro();

  /* obrázky světla se dekódují předem, aby večerní světlo naskočilo bez zaškobrtnutí */
  W.addEventListener('load', function () {
    setTimeout(function () {
      [light.firstElementChild, gold].forEach(function (el) {
        (getComputedStyle(el).backgroundImage.match(/url\(["']?[^"')]+/g) || []).forEach(function (u) {
          var im = new Image(); im.src = u.replace(/^url\(["']?/, ''); if (im.decode) im.decode().catch(function () {});
        });
      });
    }, 700);
  });

  if (C.RM) {
    stEls.forEach(function (el) { el.classList.add('is-on'); el.classList.remove('is-after'); });
    if (smil) svg.pauseAnimations();
    return;
  }
  C.Scroll.add(sec, function (p) { render(p); }, { pin: pin, onVis: function (v) { sec.classList.toggle('is-vis', v); } });
  C.onResize(function () { mob = C.mobile(); cur = null; C.Scroll.tick(); });
})(window, document);
