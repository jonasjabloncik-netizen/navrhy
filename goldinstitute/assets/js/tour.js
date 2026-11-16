/* GOLD Institute · kapitola 01: průchod 3D modelem mostu řízený scrollem */
(function () {
  'use strict';
  var doc = document;
  var tour = doc.querySelector('.tour'), stage = doc.getElementById('tour-stage');
  if (!tour || !stage) return;
  var steps = Array.prototype.slice.call(tour.querySelectorAll('.step'));
  var N = steps.length;
  var stackMQ = window.matchMedia('(max-width: 899px), (max-aspect-ratio: 1/1)');
  var buildBar = doc.getElementById('build-bar');
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

  /* Kamera: na každém kroku chvíli stojí, mezi kroky přelétá */
  var KEYS = [
    ['hero', 0], ['hero', 0.05],
    ['mosty', 0.2], ['mosty', 0.3],
    ['zaves', 0.45], ['zaves', 0.56],
    ['vez', 0.7], ['vez', 0.8],
    ['nadhled', 0.95], ['nadhled', 1]
  ];
  /* zavěšené lešení se dostaví mezi p = 0,34 a 0,55 */
  var SC_FROM = 0.34, SC_TO = 0.55;

  var api = null;
  if (window.THREE && window.GoldBridge) {
    try { api = window.GoldBridge.mount(stage, { stack: stackMQ.matches, keys: KEYS }); } catch (e) { api = null; }
  }
  var curStep = -1;
  if (!api) {
    stage.classList.add('no-gl');
  } else {
    Object.keys(api.counts).forEach(function (k) {
      Array.prototype.forEach.call(doc.querySelectorAll('[data-total="' + k + '"]'), function (el) { el.textContent = api.counts[k].toLocaleString('cs-CZ'); });
    });
    var th = doc.getElementById('tower-h');
    if (th && api.towerH) th.textContent = '≈ ' + api.towerH + ' m';
    api.setDims(function () { return curStep === 1 || curStep === 3; });
    var mq = function () { api.setStack(stackMQ.matches); };
    if (stackMQ.addEventListener) stackMQ.addEventListener('change', mq); else stackMQ.addListener(mq);
    doc.getElementById('rebuild').addEventListener('click', function () { api.replay(); });
  }
  if (!api) { var rb = doc.getElementById('rebuild'); if (rb) rb.hidden = true; }

  var ticking = false;
  function update() {
    ticking = false;
    var r = tour.getBoundingClientRect(), vh = window.innerHeight;
    var total = r.height - vh;
    var p = total > 0 ? clamp(-r.top / total) : 0;
    var sc = clamp((p - SC_FROM) / (SC_TO - SC_FROM));
    var step = Math.min(N - 1, Math.round(p * (N - 1) + 0.08));
    if (step !== curStep) {
      curStep = step;
      tour.setAttribute('data-step', String(step));
      steps.forEach(function (s, i) { s.classList.toggle('is-on', i === step); });
    }
    if (buildBar) buildBar.style.transform = 'scaleX(' + (api ? sc : 1).toFixed(4) + ')';
    if (api) api.setProgress(p, sc);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
