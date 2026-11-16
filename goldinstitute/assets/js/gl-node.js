/*
  GOLD Institute · rozetový uzel modulového lešení (3D detail, ilustrace)
  Při scrollu do rozety zajedou čtyři podélníky a do otvorů dopadnou klíny.
  Jednotky: 1 = 10 cm. Tvar je obecný rozetový uzel, ne výkres konkrétního výrobce.
*/
(function () {
  'use strict';
  var T = window.THREE;
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function eOut(t) { return 1 - Math.pow(1 - t, 3); }
  function eBack(t) { var c1 = 1.70158, c3 = c1 + 1, u = t - 1; return 1 + c3 * u * u * u + c1 * u * u; }

  function slot(path, ang, r, len, wid) {
    var c = Math.cos(ang), s = Math.sin(ang), px = -s, py = c, pts = [];
    [[-len / 2, -wid / 2], [len / 2, -wid / 2], [len / 2, wid / 2], [-len / 2, wid / 2]].forEach(function (q) {
      pts.push([(r + q[0]) * c + q[1] * px, (r + q[0]) * s + q[1] * py]);
    });
    path.moveTo(pts[0][0], pts[0][1]);
    for (var i = 3; i >= 1; i--) path.lineTo(pts[i][0], pts[i][1]);
    path.closePath();
  }

  function mount(wrap, opts) {
    opts = opts || {};
    var canvas = wrap.querySelector('canvas');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var renderer;
    try { renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false }); } catch (e) { wrap.classList.add('no-gl'); return null; }
    renderer.toneMapping = T.NeutralToneMapping; renderer.outputColorSpace = T.SRGBColorSpace;
    var scene = new T.Scene(); scene.background = new T.Color(opts.bg || '#E3E2DB');
    try { var pm = new T.PMREMGenerator(renderer); scene.environment = pm.fromScene(new T.RoomEnvironment(), 0.04).texture; } catch (e) { /* bez odlesků */ }
    scene.add(new T.HemisphereLight('#ffffff', '#b8b0a0', 0.7));
    var key = new T.DirectionalLight('#fff3df', 2.2); key.position.set(6, 9, -7); scene.add(key);
    var rim = new T.DirectionalLight('#ffe2a8', 1.2); rim.position.set(-8, 3, 9); scene.add(rim);

    var mTube = new T.MeshStandardMaterial({ color: '#C9962C', metalness: 0.85, roughness: 0.3, envMapIntensity: 0.9 });
    var mRos = new T.MeshStandardMaterial({ color: '#DDAE45', metalness: 0.88, roughness: 0.26, envMapIntensity: 1 });
    var mHead = new T.MeshStandardMaterial({ color: '#B98A2A', metalness: 0.85, roughness: 0.34, emissive: '#E2A62A', emissiveIntensity: 0 });
    var mWedge = new T.MeshStandardMaterial({ color: '#8F6A1C', metalness: 0.8, roughness: 0.36, emissive: '#FFD27A', emissiveIntensity: 0 });

    var node = new T.Group(); scene.add(node);
    /* stojka */
    var std = new T.Mesh(new T.CylinderGeometry(0.242, 0.242, 12, 48, 1, true), mTube); node.add(std);
    /* rozeta s osmi otvory */
    var sh = new T.Shape(); sh.absarc(0, 0, 0.62, 0, Math.PI * 2, false);
    for (var i = 0; i < 8; i++) { var h = new T.Path(); if (i % 2) slot(h, i * Math.PI / 4, 0.44, 0.17, 0.17); else slot(h, i * Math.PI / 4, 0.44, 0.17, 0.085); sh.holes.push(h); }
    var hc = new T.Path(); hc.absarc(0, 0, 0.243, 0, Math.PI * 2, true); sh.holes.push(hc);
    var rg = new T.ExtrudeGeometry(sh, { depth: 0.085, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2, curveSegments: 48 });
    rg.rotateX(-Math.PI / 2); rg.translate(0, -0.0425, 0);
    node.add(new T.Mesh(rg, mRos));
    /* druhá rozeta o patro výš (jen kontext) */
    var r2 = new T.Mesh(rg, mRos); r2.position.y = 5; node.add(r2);
    var r3 = new T.Mesh(rg, mRos); r3.position.y = -5; node.add(r3);

    /* podélníky s hlavou a klínem */
    var tubeG = new T.CylinderGeometry(0.242, 0.242, 5, 40, 1, true); tubeG.rotateZ(Math.PI / 2); tubeG.translate(0.98 + 2.5, 0, 0);
    var jawG = new T.BoxGeometry(0.64, 0.14, 0.36), backG = new T.BoxGeometry(0.14, 0.4, 0.36), wedgeG = new T.BoxGeometry(0.075, 0.82, 0.24);
    var ledgers = [];
    for (var k = 0; k < 4; k++) {
      var arm = new T.Group(); arm.rotation.y = -k * Math.PI / 2; node.add(arm);
      var mover = new T.Group(); arm.add(mover);
      mover.add(new T.Mesh(tubeG, mTube));
      var j1 = new T.Mesh(jawG, mHead); j1.position.set(0.58, 0.1175, 0); mover.add(j1);
      var j2 = new T.Mesh(jawG, mHead); j2.position.set(0.58, -0.1175, 0); mover.add(j2);
      var bk = new T.Mesh(backG, mHead); bk.position.set(0.92, 0, 0); mover.add(bk);
      var wd = new T.Mesh(wedgeG, mWedge); wd.position.set(0.44, 0, 0); wd.rotation.z = 0.05; mover.add(wd);
      ledgers.push({ mover: mover, wedge: wd, a: 0.06 + k * 0.15 });
    }

    var camera = new T.PerspectiveCamera(32, 1, 0.1, 200);
    var labels = Array.prototype.slice.call(wrap.querySelectorAll('[data-nm]'));
    var anchors = { stojka: [0, 2.4, 0], rozeta: [0.44, 0.05, -0.44], podelnik: [3.8, 0.25, 0], klin: [0.44, 0.45, 0] };
    var W = 1, H = 1, prog = reduce ? 1 : 0, p = prog, visible = false, running = false, lastNow = 0, yaw = 0.5, drag = null, yawUser = 0, yawUserT = 0;
    var v3 = new T.Vector3(), flash = [0, 0, 0, 0];

    function apply(pp, dt) {
      ledgers.forEach(function (L, i) {
        var s = clamp((pp - L.a) / 0.2), w = clamp((pp - L.a - 0.17) / 0.12);
        L.mover.position.x = (1 - eOut(s)) * 5.2;
        L.mover.visible = s > 0;
        L.wedge.position.y = (1 - eBack(w)) * 2.4;
        if (w >= 1 && flash[i] === 0) flash[i] = 1;
        if (w < 1) flash[i] = 0;
      });
      var fl = 0;
      flash.forEach(function (f, i) { if (f > 0.001) { flash[i] = f * Math.pow(0.04, dt); fl = Math.max(fl, flash[i]); } });
      mWedge.emissiveIntensity = fl * 1.4; mHead.emissiveIntensity = fl * 0.35;
      return fl > 0.002;
    }
    function frame(nowMs) {
      var dt = lastNow ? Math.min(0.1, (nowMs - lastNow) / 1000) : 0.016; lastNow = nowMs;
      var k = reduce ? 1 : 1 - Math.exp(-dt / 0.15);
      p += (prog - p) * k;
      var t = nowMs / 1000;
      yawUser += (yawUserT - yawUser) * k;
      yaw = 0.42 + p * 0.75 + (reduce ? 0 : Math.sin(t * 0.3) * 0.1) + yawUser;
      var dist = 13 - p * 2.8, pitch = 0.64 - p * 0.14;
      camera.position.set(Math.sin(yaw) * Math.cos(pitch) * dist, Math.sin(pitch) * dist, -Math.cos(yaw) * Math.cos(pitch) * dist);
      camera.lookAt(0, -0.35, 0);
      var flashing = apply(p, dt);
      renderer.render(scene, camera);
      labels.forEach(function (el) {
        var a = anchors[el.getAttribute('data-nm')], on = p > +(el.getAttribute('data-at') || 0);
        node.localToWorld(v3.set(a[0], a[1], a[2])); v3.project(camera);
        el.style.transform = 'translate3d(' + ((v3.x * 0.5 + 0.5) * W).toFixed(1) + 'px,' + ((-v3.y * 0.5 + 0.5) * H).toFixed(1) + 'px,0)';
        if (el._on !== on) { el._on = on; el.classList.toggle('is-on', on); }
      });
      var settled = Math.abs(prog - p) < 0.0005 && Math.abs(yawUserT - yawUser) < 0.0005 && !flashing;
      if (visible && (!settled || !reduce)) requestAnimationFrame(frame);
      else { running = false; lastNow = 0; }
    }
    function kick() { if (!running && visible) { running = true; requestAnimationFrame(frame); } }
    function resize() {
      var r = wrap.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      W = r.width; H = r.height;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(W, H, false);
      camera.aspect = W / H; camera.updateProjectionMatrix();
      kick();
    }
    canvas.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, id: e.pointerId }; });
    window.addEventListener('pointermove', function (e) { if (!drag || e.pointerId !== drag.id) return; yawUserT += (e.clientX - drag.x) * 0.008; drag.x = e.clientX; kick(); }, { passive: true });
    window.addEventListener('pointerup', function () { drag = null; });
    if (window.ResizeObserver) new ResizeObserver(resize).observe(wrap); else window.addEventListener('resize', resize);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) kick(); }, { rootMargin: '80px 0px' }).observe(wrap);
    else visible = true;
    resize();
    return { setProgress: function (v) { if (reduce) return; prog = clamp(v); kick(); } };
  }
  window.GoldNode = { mount: mount };
})();
