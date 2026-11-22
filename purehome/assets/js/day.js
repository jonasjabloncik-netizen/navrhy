/* PURE HOME v3 · úvod a „jeden den s PURE HOME"
   Ranní světlo z okna na stěně. Při scrollu slunce putuje po stěně od rána do večera
   a vedle se odvíjí, jak služba probíhá: fotky, klíče, úklid, platba, návrat domů.
   Vše je funkcí průběhu scrollu (tam i zpět), animuje se jen transform a opacity. */
(function (W, D) {
  'use strict';
  var C = W.PHC, P = W.PH, L = W.PH_LOGO;
  var sec = C.$('.day'); if (!sec || !P) return;
  var H = D.documentElement;
  var hero = C.$('.hero', sec), mark = C.$('.hero__mark', sec), cue = C.$('.hero__cue', sec);
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
    phases.map(function (ph, i) { return '<li><span class="tl__n">' + (i + 1) + '</span>' + C.esc(ph.when) + '</li>'; }).join('') + '</ol>' +
    phases.map(function (ph, i) {
      return '<div class="st" data-i="' + i + '"><p class="st__when"><span>' + (i + 1) + ' / ' + phases.length + '</span><i></i>' + C.esc(ph.when) + '</p><h3 class="st__title">' + C.esc(ph.title) + '</h3><p class="st__text">' + C.esc(ph.text) + '</p>' +
        (ph.chips ? '<div class="st__chips">' + ph.chips.map(function (c) { return '<span>' + C.esc(c) + '</span>'; }).join('') + '</div>' : '') +
        (ph.photos ? '<div class="st__cta"><a class="btn btn--ghost" href="#poptavka">Sestavit poptávku s fotkami</a></div>' : '') +
        (ph.tasks ? '<ul class="st__tasks">' + ph.tasks.map(function (t) { return '<li>' + CK + '<span>' + C.esc(t) + '</span></li>'; }).join('') + '</ul>' : '') +
        (ph.cta ? '<div class="st__cta"><a class="btn" href="#poptavka">Poptat úklid</a><a class="link" href="#iva">Poznat Ivu <i></i></a></div>' : '') + '</div>';
    }).join('');
  var stEls = C.$$('.st', storyHost), tl = C.$('.tl', storyHost), tlFill = C.$('.tl__fill', storyHost), tlItems = C.$$('.tl li', storyHost);
  var tasks = C.$$('.st__tasks li', storyHost);

  /* odkazy „Jak to probíhá" dojedou na první krok příběhu */
  D.addEventListener('click', function (e) {
    var a = e.target.closest('a[href="#den"]'); if (!a) return;
    e.preventDefault();
    var span = sec.offsetHeight - W.innerHeight;
    W.scrollTo({ top: C.RM ? sec.offsetTop + W.innerHeight : sec.offsetTop + span * CEN[0], behavior: C.RM ? 'auto' : 'smooth' });
  });

  /* ---------- časová osa ---------- */
  var CEN = [.19, .36, .53, .70, .87], HALF = .075, EDGE = .03;
  function vis(p, i) {
    var a = CEN[i] - HALF, b = CEN[i] + HALF;
    var inA = C.sub(p, a - EDGE, a + EDGE * .4);
    var outA = i === phases.length - 1 ? 1 : 1 - C.sub(p, b - EDGE * .4, b + EDGE);
    return Math.min(inA, outA);
  }
  var lastP = -1;
  function render(p) {
    if (Math.abs(p - lastP) < .0002) return; lastP = p;
    /* úvod mizí */
    var ha = 1 - C.sub(p, .012, .05);
    if (p > .002) H.classList.add('intro-settled');
    hero.style.opacity = ha.toFixed(3);
    hero.style.transform = 'translateY(' + (-(1 - ha) * 40).toFixed(1) + 'px)';
    hero.style.visibility = ha <= 0 ? 'hidden' : '';
    if (cue) cue.style.opacity = ha.toFixed(3);
    /* slunce putuje po stěně: ráno vpravo a chladné, večer vlevo a zlaté */
    var t = C.eio(C.sub(p, .04, 1));
    var tx = C.lerp(6, -36, t), ty = C.lerp(-3, 7, t), sc = C.lerp(1, 1.08, t);
    light.style.transform = 'translate3d(' + tx.toFixed(2) + '%,' + ty.toFixed(2) + '%,0) scale(' + sc.toFixed(3) + ')';
    var g = C.sub(p, .62, .92);
    gold.style.opacity = (g * .55).toFixed(3); gold.style.visibility = g > 0 ? '' : 'hidden';
    warm.style.opacity = (g * .7).toFixed(3); warm.style.visibility = g > 0 ? '' : 'hidden';
    /* fáze */
    var cur = 0;
    for (var i = 0; i < stEls.length; i++) {
      var a = vis(p, i), el = stEls[i];
      if (p >= CEN[i] - HALF) cur = i;
      if (a <= .001) { if (el._a !== 0) { el.style.opacity = 0; el.classList.remove('is-on'); el._a = 0; } continue; }
      el._a = a; el.classList.add('is-on'); el.style.opacity = a.toFixed(3);
      var dy = (1 - a) * 22;
      el.style.transform = (C.mobile() ? '' : 'translateY(-50%) ') + 'translateY(' + dy.toFixed(1) + 'px)';
    }
    var tla = C.sub(p, .07, .12);
    tl.style.opacity = tla.toFixed(3);
    tlFill.style.transform = 'scaleY(' + C.sub(p, CEN[0], CEN[CEN.length - 1]).toFixed(3) + ')';
    tlItems.forEach(function (li, j) { li.classList.toggle('on', j <= cur && p >= CEN[0] - HALF); });
    /* úkoly se odškrtávají jeden po druhém */
    var k = C.sub(p, CEN[2] - .06, CEN[2] + .06) * tasks.length;
    tasks.forEach(function (li, j) {
      var q = C.clamp(k - j, 0, 1);
      li.style.setProperty('--dash', (24 * (1 - q)).toFixed(1));
      li.style.setProperty('--o', (.45 + .55 * q).toFixed(2));
    });
  }

  /* ---------- intro ---------- */
  function intro() {
    if (C.RM || H.classList.contains('seen')) { H.classList.add('intro-done', 'intro-settled'); return; }
    requestAnimationFrame(function () { requestAnimationFrame(function () { H.classList.add('intro-done'); }); });
    setTimeout(function () { H.classList.add('intro-settled'); }, 3200);
    try { sessionStorage.setItem('ph3-intro', '1'); } catch (e) {}
  }
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(intro); else intro();

  if (C.RM) { render(0); stEls.forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; el.classList.add('is-on'); }); tasks.forEach(function (li) { li.style.setProperty('--dash', 0); li.style.setProperty('--o', 1); }); return; }
  C.Scroll.add(sec, function (p) { render(p); });
  var rt; W.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { buildLogo(); lastP = -1; C.Scroll.tick(); }, 150); });
})(window, document);
