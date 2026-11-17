/* GOLD Institute · scroll řízení 3D scén: festivalová stage a rozetový uzel */
(function () {
  'use strict';
  var doc = document;
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  var stackMQ = window.matchMedia('(max-width: 899px), (max-aspect-ratio: 1/1)');
  /* 3D scény nezatěžují úvod: připraví se v klidu po doběhnutí úvodní stavby (GOLDUI.idle),
     nebo nejpozději kus před vstupem do obrazu, když návštěvník scrolluje rychle. */
  var idle = (window.GOLDUI && window.GOLDUI.idle) || function () {};
  function lazy(el, fn) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); fn(); } }, { rootMargin: '1400px 0px' });
    io.observe(el);
    idle(fn);
  }
  function once(fn) { var done = false; return function () { if (!done) { done = true; fn(); } }; }

  /* festivalová stage: připnutá scéna, stavba podle průchodu sekcí */
  var sx = doc.getElementById('stagex'), stEl = doc.getElementById('stage-3d'), stage = null;
  var steps = sx ? Array.prototype.slice.call(sx.querySelectorAll('.sstep')) : [];
  if (sx) lazy(sx, once(function () {
    if (window.THREE && window.GoldStage) { try { stage = window.GoldStage.mount(stEl, { stack: stackMQ.matches }); } catch (e) { stage = null; } }
    if (!stage) { sx.classList.add('no-gl'); return; }
    var mq = function () { stage.setStack(stackMQ.matches); };
    if (stackMQ.addEventListener) stackMQ.addEventListener('change', mq); else stackMQ.addListener(mq);
    update();
  }));

  /* rozetový uzel: díly zapadnou podle polohy sekce */
  var nd = doc.getElementById('node-3d'), node = null;
  if (nd) lazy(nd, once(function () {
    if (window.THREE && window.GoldNode) { try { node = window.GoldNode.mount(nd); } catch (e) { node = null; } }
    if (!node) { nd.classList.add('no-gl'); return; }
    update();
  }));

  var cur = -2, ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight;
    if (sx) {
      var r = sx.getBoundingClientRect();
      var pin = r.height - vh > 0 ? clamp(-r.top / (r.height - vh)) : 0;
      var build = clamp((vh - r.top) / r.height);
      if (stage) stage.setProgress(build);
      var k = (r.top > vh * 0.35 || r.bottom < vh * 0.65) ? -1 : Math.min(steps.length - 1, Math.floor(pin * steps.length * 0.999));
      if (k !== cur) { cur = k; steps.forEach(function (s, i) { s.classList.toggle('is-on', i === k); }); }
    }
    if (nd && node) {
      var rn = nd.getBoundingClientRect();
      node.setProgress(clamp((vh * 0.9 - rn.top) / (rn.height * 0.8 + vh * 0.3)));
    }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  requestAnimationFrame(update);
})();
