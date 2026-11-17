/*
  GOLD Institute · 3D vizualizace poptávky
  Lešení se staví podle zvoleného typu a rozměrů. Díly, které už stály, zůstanou,
  nové se postaví s animací. Model jde otáčet tažením, v klidu se sám pomalu natáčí.
*/
(function () {
  'use strict';
  var T = window.THREE, GL = window.GoldGL, KIT = window.GoldKit;
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }

  function mount(wrap, opts) {
    opts = opts || {};
    var canvas = wrap.querySelector('canvas'), svg = wrap.querySelector('.cfg__dims');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var renderer;
    if (GL.noGL) return null;
    try { renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true }); } catch (e) { GL.noGL = true; return null; }
    renderer.debug.checkShaderErrors = false;
    var small = !window.matchMedia('(hover: hover) and (pointer: fine)').matches || Math.min(window.innerWidth, window.innerHeight) < 600;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.toneMapping = T.NeutralToneMapping;
    renderer.outputColorSpace = T.SRGBColorSpace;

    var scene = new T.Scene(), bg = new T.Color(opts.bg || '#E3E2DB');
    scene.background = bg;
    scene.add(new T.HemisphereLight('#ffffff', '#bab3a3', 1.35));
    var sun = new T.DirectionalLight('#fff4e2', 2.9);
    sun.castShadow = true; sun.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.35;
    scene.add(sun); scene.add(sun.target);

    var mWhite = new T.MeshStandardMaterial({ color: '#F6F5F1', roughness: 0.82 });
    var mDark = new T.MeshStandardMaterial({ color: '#A3A9AD', roughness: 0.45, metalness: 0.1 });
    var mEdge = new T.LineBasicMaterial({ color: '#6F767B', transparent: true, opacity: 0.3 });
    var mBase = new T.MeshStandardMaterial({ color: '#EEEDE8', roughness: 1 });
    var mGrid = new T.LineBasicMaterial({ color: '#B7B3A7', transparent: true, opacity: 0.55 });
    var mWater = new T.MeshStandardMaterial({ color: '#A6B9C2', roughness: 0.22, metalness: 0.1 });
    var base = new T.Mesh(new T.BoxGeometry(1, 1, 1), mBase); base.receiveShadow = true; scene.add(base);
    var water = new T.Mesh(new T.PlaneGeometry(1, 1), mWater); water.rotation.x = -Math.PI / 2; water.receiveShadow = true; scene.add(water);
    var ctx = new T.Group(); scene.add(ctx);
    var gridLines = null;
    var mats = GL.materials();

    var camera = new T.PerspectiveCamera(34, 1, 0.3, 5000);
    var W = 1, H = 1, t0clock = performance.now();
    var set = null, known = {}, lastTyp = '', meta = null, endT = 0, pending = null;
    var yaw = -0.62, yawT = -0.62, pitch = 0.36, pitchT = 0.36, dist = 80, distT = 80;
    var tgt = new T.Vector3(0, 6, 0), tgtT = new T.Vector3(0, 6, 0), first = true;
    var drag = null, vel = 0, lastInteract = -1e9, visible = true, running = false, lastNow = 0, ready = false, compiling = false;

    function now() { return (performance.now() - t0clock) / 1000; }
    function disposeGroup(g) { while (g.children.length) { var c = g.children.pop(); if (c.geometry) c.geometry.dispose(); } }

    function build(typ, L, Hh) {
      var K = new KIT.Kit();
      meta = (KIT.gen[typ] || KIT.gen.jine)(K, L, Hh);
      var t = now(), fresh = typ !== lastTyp, prev = known, next = {};
      var span = clamp(0.7 + K.p.length / 2600, 0.8, 1.7);
      if (set) set.dispose();
      set = K.toSet(function (q) {
        next[q.k] = 1;
        if (reduce || (!fresh && prev[q.k])) return -100;
        return t + 0.05 + q.o * span;
      });
      known = next; lastTyp = typ;
      set.build(scene, mats, true);
      endT = t + span + 0.9;
      disposeGroup(ctx);
      if (K.ctx.length) {
        var g = GL.merge(K.ctx), m = new T.Mesh(g, mWhite);
        m.castShadow = true; m.receiveShadow = true; ctx.add(m);
        ctx.add(new T.LineSegments(GL.edges(K.ctx), mEdge));
      }
      if (K.dark.length) { var md = new T.Mesh(GL.merge(K.dark), mDark); md.receiveShadow = true; ctx.add(md); }
      /* podstavec, mřížka po 5 m, voda */
      var b = meta.bbox, cx = (b[0] + b[3]) / 2, cz = (b[2] + b[5]) / 2;
      var sx = (b[3] - b[0]) + 14, sz = (b[5] - b[2]) + 14;
      base.scale.set(sx, 1.2, sz); base.position.set(cx, -0.61, cz);
      if (gridLines) { scene.remove(gridLines); gridLines.geometry.dispose(); }
      var pts = [], step = sx > 120 ? 10 : 5, gx0 = cx - sx / 2, gz0 = cz - sz / 2;
      for (var x = Math.ceil(gx0 / step) * step; x <= gx0 + sx; x += step) pts.push(x, 0.01, gz0, x, 0.01, gz0 + sz);
      for (var z = Math.ceil(gz0 / step) * step; z <= gz0 + sz; z += step) pts.push(gx0, 0.01, z, gx0 + sx, 0.01, z);
      var gg = new T.BufferGeometry(); gg.setAttribute('position', new T.Float32BufferAttribute(pts, 3));
      gridLines = new T.LineSegments(gg, mGrid); scene.add(gridLines);
      water.visible = !!meta.water; water.scale.set(sx - 0.4, sz - 0.4, 1); water.position.set(cx, 0.03, cz);
      gridLines.visible = !meta.water;
      /* kamera: celý model v záběru */
      var r = 0.5 * Math.hypot(b[3] - b[0], b[4] - b[1], b[5] - b[2]);
      tgtT.set(cx, (b[1] + b[4]) * 0.4, cz);
      var vf = camera.fov * Math.PI / 180, hf = 2 * Math.atan(Math.tan(vf / 2) * (W / H));
      distT = r / Math.sin(Math.min(vf, hf) / 2) * 0.8;
      if (first) { dist = distT; tgt.copy(tgtT); first = false; }
      var R = r * 1.25;
      sun.position.set(cx + R * 0.9, R * 1.6 + 10, cz - R * 1.2); sun.target.position.set(cx, 0, cz);
      var sc = sun.shadow.camera; sc.left = -R; sc.right = R; sc.top = R; sc.bottom = -R; sc.near = 1; sc.far = R * 5 + 60; sc.updateProjectionMatrix();
      renderer.shadowMap.needsUpdate = true;
    }

    /* kóty */
    var v3 = new T.Vector3();
    function proj(p) { v3.set(p[0], p[1], p[2]).project(camera); return [(v3.x * 0.5 + 0.5) * W, (-v3.y * 0.5 + 0.5) * H]; }
    function dim(g, A, B, side) {
      var a = proj(A), b = proj(B), len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      var nx = -(b[1] - a[1]) / len * side, ny = (b[0] - a[0]) / len * side, o = 14;
      var l = g.querySelector('.dim__l'), t = g.querySelectorAll('.dim__t'), tx = g.querySelector('text');
      l.setAttribute('x1', a[0] + nx * o); l.setAttribute('y1', a[1] + ny * o); l.setAttribute('x2', b[0] + nx * o); l.setAttribute('y2', b[1] + ny * o);
      [a, b].forEach(function (P, i) {
        t[i].setAttribute('x1', P[0] + nx * (o - 7)); t[i].setAttribute('y1', P[1] + ny * (o - 7));
        t[i].setAttribute('x2', P[0] + nx * (o + 7)); t[i].setAttribute('y2', P[1] + ny * (o + 7));
      });
      tx.setAttribute('x', (a[0] + b[0]) / 2 + nx * (o + 17)); tx.setAttribute('y', (a[1] + b[1]) / 2 + ny * (o + 17));
    }
    var gL = svg && svg.querySelector('[data-d="L"]'), gH = svg && svg.querySelector('[data-d="H"]');

    function frame(nowMs) {
      var dt = lastNow ? Math.min(0.1, (nowMs - lastNow) / 1000) : 0.016; lastNow = nowMs;
      if (pending) { build(pending[0], pending[1], pending[2]); pending = null; }
      var t = now();
      /* v klidu se model pomalu natáčí sem a tam */
      var idle = !drag && t - lastInteract > 3.5 && !reduce;
      if (idle) yawT = -0.62 + 0.32 * Math.sin(t * 0.28);
      if (!drag && Math.abs(vel) > 0.0001) { yawT += vel; vel *= Math.pow(0.9, dt * 60); }
      var k = reduce ? 1 : 1 - Math.exp(-dt / 0.16), kd = reduce ? 1 : 1 - Math.exp(-dt / 0.35);
      yaw += (yawT - yaw) * k; pitch += (pitchT - pitch) * k;
      dist += (distT - dist) * kd; tgt.lerp(tgtT, kd);
      camera.position.set(tgt.x + Math.sin(yaw) * Math.cos(pitch) * dist, tgt.y + Math.sin(pitch) * dist, tgt.z - Math.cos(yaw) * Math.cos(pitch) * dist);
      camera.lookAt(tgt);
      GL.shared.uTime.value = t; GL.shared.uTime2.value = t;
      GL.shared.uThick.value = clamp(dist / 60, 0.8, 4.5);
      if (t < endT) renderer.shadowMap.needsUpdate = true;
      renderer.render(scene, camera);
      if (meta && gL) { dim(gL, meta.dimL[0], meta.dimL[1], -1); dim(gH, meta.dimH[0], meta.dimH[1], -1); }
      var moving = Math.abs(yawT - yaw) > 0.0005 || Math.abs(distT - dist) > 0.01 || Math.abs(vel) > 0.0001;
      if (visible && (idle || moving || drag || t < endT || pending)) requestAnimationFrame(frame);
      else { running = false; lastNow = 0; }
    }
    function kick() { if (ready && !running && visible) { running = true; requestAnimationFrame(frame); } }

    var lastSize = '';
    function resize() {
      var r = wrap.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      W = r.width; H = r.height;
      var pr = Math.max(1, Math.min(window.devicePixelRatio || 1, small ? 1.6 : 2, Math.sqrt(2.2e6 / (W * H))));
      if (W + 'x' + H + '@' + pr === lastSize) return;
      lastSize = W + 'x' + H + '@' + pr;
      renderer.setPixelRatio(pr);
      renderer.setSize(W, H, false);
      camera.aspect = W / H; camera.updateProjectionMatrix();
      if (meta) { var b = meta.bbox, r2 = 0.5 * Math.hypot(b[3] - b[0], b[4] - b[1], b[5] - b[2]); var vf = camera.fov * Math.PI / 180, hf = 2 * Math.atan(Math.tan(vf / 2) * (W / H)); distT = r2 / Math.sin(Math.min(vf, hf) / 2) * 0.8; }
      renderer.shadowMap.needsUpdate = true;
      kick();
    }

    /* otáčení tažením (vodorovně), svislé tažení nechá stránku scrollovat */
    canvas.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: false }; vel = 0; lastInteract = now(); kick(); });
    window.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.x = e.clientX; drag.y = e.clientY;
      vel = dx * 0.006; yawT += vel; pitchT = clamp(pitchT + dy * 0.003, 0.08, 0.95);
      lastInteract = now();
    }, { passive: true });
    function up(e) { if (drag && (!e || e.pointerId === drag.id)) { drag = null; lastInteract = now(); kick(); } }
    window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);

    if (window.ResizeObserver) new ResizeObserver(resize).observe(wrap); else window.addEventListener('resize', resize);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) kick(); }, { threshold: 0 }).observe(wrap);
    resize();

    /* první model se postaví hned, shadery se přeloží předem, pak zahřívací snímek a roztmívnutí */
    function go() {
      if (ready) return;
      ready = true; running = true; lastNow = 0;
      try { frame(performance.now()); } catch (e) { running = false; }
      wrap.classList.add('is-gl');
    }

    return {
      set: function (typ, L, Hh) {
        if (ready || compiling) { pending = [typ, L, Hh]; kick(); return; }
        compiling = true;
        build(typ, L, Hh);
        GL.prepare(renderer, scene, camera, go);
      },
      counts: function () { return set ? set.count : null; }
    };
  }

  window.GoldConfig = { mount: mount };
})();
