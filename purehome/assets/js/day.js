/* PURE HOME v6 · úvod a „jak to probíhá"
   Ranní světlo z okna na stěně. Při scrollu slunce putuje po stěně od rána do večera
   a vedle se odvíjí, jak služba probíhá: fotky, klíče, úklid, platba, návrat domů.
   Vše je funkcí průběhu scrollu (tam i zpět), animuje se jen transform a opacity.
   v6: animují se jen malé vrstvy s obsahem (ne celé obrazovky), styly se zapisují jen při změně,
   na telefonu světlo jen posouvá (bez zvětšování) a krok je uprostřed obrazovky. */
(function (W, D) {
  'use strict';
  var C = W.PHC, P = W.PH, L = W.PH_LOGO, css = C.css;
  var sec = C.$('.day'); if (!sec || !P) return;
  var H = D.documentElement;
  var pin = C.$('.day__pin', sec), hero = C.$('.hero', sec), heroIn = C.$('.hero__in', sec), mark = C.$('.hero__mark', sec), cue = C.$('.hero__cue', sec);
  var light = C.$('.wall__light', sec), gold = C.$('.wall__gold', sec), warm = C.$('.wall__warm', sec);
  var storyHost = C.$('[data-render="story"]');

  /* ---------- úvod: texty a logo složené z jednotlivých písmen ---------- */
  C.$('.hero__line', hero).textContent = P.hero.line;
  C.$('.hero__title', hero).textContent = P.hero.title;
  C.$('.hero__lead', hero).textContent = P.hero.lead;
  C.$('.hero__cta', hero).innerHTML = '<a class="btn" href="#poptavka">' + C.esc(P.hero.cta) + '</a><a class="link" href="#den">' + C.esc(P.hero.more) + '</a>';
  var curLogo = '';
  function buildLogo() {
    var kind = C.mobile() ? 'stacked' : 'inline'; if (kind === curLogo) return; curLogo = kind;
    var d = L[kind], vb = d.vb;
    var glyphs = d.glyphs.map(function (p, i) { return '<g class="g" style="--i:' + i + '"><path d="' + p + '"/></g>'; }).join('');
    var clip = d.glyphs.map(function (p) { return '<path d="' + p + '"/>'; }).join('');
    mark.innerHTML = '<svg viewBox="' + vb.join(' ') + '" fill="#121214" role="presentation">' +
      '<defs><clipPath id="lgClip">' + clip + '</clipPath><linearGradient id="lgShine" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>' +
      glyphs + '<g class="g sub" style="--i:' + d.glyphs.length + '"><path d="' + d.sub + '"/></g>' +
      '<g clip-path="url(#lgClip)"><rect class="hero__shine" style="transform-box:fill-box" x="' + vb[0] + '" y="' + vb[1] + '" width="' + (vb[2] * .22) + '" height="' + vb[3] + '" fill="url(#lgShine)"/></g></svg>';
  }
  buildLogo();

  /* ---------- příběh ---------- */
  var DY = P.day, phases = DY.phases;
  var CK = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 10.5l4 4L16.5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  storyHost.innerHTML = '<h2 class="sr">' + C.esc(DY.label) + '</h2><ol class="tl" aria-hidden="true"><span class="tl__fill"></span>' +
    phases.map(function (ph, i) { return '<li><span class="tl__n">' + (i + 1) + '</span>' + C.esc(ph.when) + '<i class="tl__bar"><i></i></i></li>'; }).join('') + '</ol>' +
    phases.map(function (ph, i) {
      return '<div class="st" data-i="' + i + '"><div class="st__in">' +
        '<p class="st__when"><span>' + (i + 1) + ' / ' + phases.length + '</span><i></i>' + C.esc(ph.when) + '</p><h3 class="st__title">' + C.esc(ph.title) + '</h3><p class="st__text">' + C.esc(ph.text) + '</p>' +
        (ph.chips ? '<div class="st__chips">' + ph.chips.map(function (c) { return '<span>' + C.esc(c) + '</span>'; }).join('') + '</div>' : '') +
        (ph.photos ? '<div class="st__cta"><a class="btn btn--ghost" href="#poptavka">Sestavit poptávku s fotkami</a></div>' : '') +
        (ph.tasks ? '<ul class="st__tasks">' + ph.tasks.map(function (t) { return '<li>' + CK + '<span>' + C.esc(t) + '</span></li>'; }).join('') + '</ul>' : '') +
        (ph.cta ? '<div class="st__cta"><a class="btn" href="#poptavka">Poptat úklid</a><a class="link" href="#iva">Poznat Ivu <i></i></a></div>' : '') + '</div></div>';
    }).join('');
  var stEls = C.$$('.st', storyHost), stIn = C.$$('.st__in', storyHost), tl = C.$('.tl', storyHost), tlFill = C.$('.tl__fill', storyHost), tlItems = C.$$('.tl li', storyHost);
  var tlBars = C.$$('.tl__bar i', storyHost), tasks = C.$$('.st__tasks li', storyHost);

  /* ---------- časová osa ---------- */
  var CEN = [.19, .36, .53, .70, .87], HALF = .075, EDGE = .03;

  /* odkazy „Jak to probíhá" dojedou na první krok příběhu */
  D.addEventListener('click', function (e) {
    var a = e.target.closest('a[href="#den"]'); if (!a) return;
    e.preventDefault();
    var top = sec.getBoundingClientRect().top + W.pageYOffset, span = sec.offsetHeight - pin.offsetHeight;
    W.scrollTo({ top: C.RM ? top + pin.offsetHeight : top + span * CEN[0], behavior: C.RM ? 'auto' : 'smooth' });
  });

  function vis(p, i) {
    var a = CEN[i] - HALF, b = CEN[i] + HALF;
    var inA = C.sub(p, a - EDGE, a + EDGE * .4);
    var outA = i === phases.length - 1 ? 1 : 1 - C.sub(p, b - EDGE * .4, b + EDGE);
    return Math.min(inA, outA);
  }
  var lastP = -1, mob = C.mobile();
  function render(p) {
    if (Math.abs(p - lastP) < .0002) return; lastP = p;
    /* úvod mizí */
    var ha = 1 - C.sub(p, .012, .05);
    if (p > .002 && !H.classList.contains('intro-settled')) H.classList.add('intro-settled');
    css(heroIn, 'opacity', ha.toFixed(3));
    css(heroIn, 'transform', 'translate3d(0,' + (-(1 - ha) * 40).toFixed(1) + 'px,0)');
    css(hero, 'visibility', ha <= 0 ? 'hidden' : '');
    if (cue) css(cue, 'opacity', ha.toFixed(3));
    /* slunce putuje po stěně: ráno vpravo a chladné, večer vlevo a zlaté (na telefonu bez zvětšování) */
    var t = C.eio(C.sub(p, .04, 1));
    var tx = C.lerp(6, -36, t), ty = C.lerp(-3, 7, t);
    css(light, 'transform', 'translate3d(' + tx.toFixed(2) + '%,' + ty.toFixed(2) + '%,0)' + (mob ? '' : ' scale(' + C.lerp(1, 1.08, t).toFixed(3) + ')'));
    var g = C.sub(p, .62, .92);
    css(gold, 'opacity', (g * .55).toFixed(3)); css(gold, 'visibility', g > 0 ? 'visible' : 'hidden');
    if (warm) { css(warm, 'opacity', (g * .7).toFixed(3)); css(warm, 'visibility', g > 0 ? 'visible' : 'hidden'); }
    /* kroky */
    var cur = 0;
    for (var i = 0; i < stEls.length; i++) {
      var a = vis(p, i);
      if (p >= CEN[i] - HALF) cur = i;
      if (a <= .001) { if (stEls[i]._on) { stEls[i]._on = false; stEls[i].classList.remove('is-on'); css(stIn[i], 'opacity', '0'); } continue; }
      if (!stEls[i]._on) { stEls[i]._on = true; stEls[i].classList.add('is-on'); }
      css(stIn[i], 'opacity', a.toFixed(3));
      css(stIn[i], 'transform', 'translate3d(0,' + ((1 - a) * 22).toFixed(1) + 'px,0)');
    }
    css(tl, 'opacity', C.sub(p, .07, .12).toFixed(3));
    if (mob) {
      /* telefon: pět proužků nahoře se plní, jak se scrolluje krokem */
      for (var j = 0; j < tlBars.length; j++) css(tlBars[j], 'transform', 'scaleX(' + C.sub(p, CEN[j] - HALF - EDGE, CEN[j] + HALF).toFixed(3) + ')');
    } else {
      css(tlFill, 'transform', 'scaleY(' + C.sub(p, CEN[0], CEN[CEN.length - 1]).toFixed(3) + ')');
      for (var k = 0; k < tlItems.length; k++) {
        var on = k <= cur && p >= CEN[0] - HALF;
        if (tlItems[k]._on !== on) { tlItems[k]._on = on; tlItems[k].classList.toggle('on', on); }
      }
    }
    /* úkoly se odškrtávají jeden po druhém */
    var q = C.sub(p, CEN[2] - .06, CEN[2] + .06) * tasks.length;
    for (var m = 0; m < tasks.length; m++) {
      var z = C.clamp(q - m, 0, 1);
      C.cssVar(tasks[m], '--dash', (24 * (1 - z)).toFixed(1));
      C.cssVar(tasks[m], '--o', (.45 + .55 * z).toFixed(2));
    }
  }

  /* ---------- intro ---------- */
  function intro() {
    if (C.RM || H.classList.contains('seen')) { H.classList.add('intro-done', 'intro-settled'); return; }
    requestAnimationFrame(function () { requestAnimationFrame(function () { H.classList.add('intro-done'); }); });
    setTimeout(function () { H.classList.add('intro-settled'); }, 3200);
    try { sessionStorage.setItem('ph3-intro', '1'); } catch (e) {}
  }
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
    render(0);
    stEls.forEach(function (el) { el.classList.add('is-on'); }); stIn.forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
    tasks.forEach(function (li) { li.style.setProperty('--dash', 0); li.style.setProperty('--o', 1); });
    return;
  }
  C.Scroll.add(sec, function (p) { render(p); }, { pin: pin, onVis: function (v) { sec.classList.toggle('is-vis', v); } });
  C.onResize(function () { mob = C.mobile(); buildLogo(); lastP = -1; for (var i = 0; i < tlItems.length; i++) tlItems[i]._on = undefined; C.Scroll.tick(); });
})(window, document);
