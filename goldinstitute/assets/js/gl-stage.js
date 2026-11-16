/*
  GOLD Institute · festivalová stage na lešení (3D, noc)
  Stavba je řízená scrollem: podlaha pódia, věže, zadní stěna, střecha, PA křídla.
  Na konci se rozsvítí světla a LED stěna. Rozměry a skladba jsou ilustrační.
*/
(function () {
  'use strict';
  var T = window.THREE, GL = window.GoldGL, KIT = window.GoldKit;
  var D2R = Math.PI / 180, SPAN = 6;
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function ledTexture() {
    var c = document.createElement('canvas'); c.width = 1024; c.height = 512;
    var g = c.getContext('2d');
    var gr = g.createLinearGradient(0, 0, 1024, 512);
    gr.addColorStop(0, '#1a1206'); gr.addColorStop(0.5, '#3a2608'); gr.addColorStop(1, '#120c04');
    g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
    g.strokeStyle = 'rgba(226,166,42,.22)'; g.lineWidth = 2;
    for (var x = 0; x <= 1024; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 512); g.stroke(); }
    for (var y = 0; y <= 512; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(1024, y); g.stroke(); }
    g.strokeStyle = '#E2A62A'; g.lineWidth = 10;
    g.beginPath(); g.moveTo(130, 140); g.lineTo(130, 372); g.moveTo(250, 140); g.lineTo(250, 372); g.moveTo(130, 150); g.lineTo(250, 150); g.moveTo(130, 362); g.lineTo(250, 362); g.moveTo(130, 362); g.lineTo(250, 150); g.stroke();
    g.fillStyle = '#F5EEDC'; g.textBaseline = 'middle';
    g.font = '800 116px Archivo, Arial, sans-serif'; g.fillText('GOLD', 300, 220);
    g.font = '500 92px Archivo, Arial, sans-serif'; g.fillText('Institute', 300, 320);
    var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t;
  }

  function mount(wrap, opts) {
    opts = opts || {};
    var canvas = wrap.querySelector('canvas');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var renderer;
    try { renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' }); } catch (e) { wrap.classList.add('no-gl'); return null; }
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap; renderer.shadowMap.autoUpdate = false;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = T.SRGBColorSpace;

    var scene = new T.Scene(), bg = new T.Color('#121416');
    scene.background = bg; scene.fog = new T.Fog(bg, 55, 150);
    var hemi = new T.HemisphereLight('#9fb1c9', '#0c0d0e', 0.55); scene.add(hemi);
    var moon = new T.DirectionalLight('#b9c8de', 1.1);
    moon.position.set(-30, 40, -24); moon.castShadow = true; moon.shadow.mapSize.set(2048, 2048);
    var sc = moon.shadow.camera; sc.left = -30; sc.right = 30; sc.top = 30; sc.bottom = -30; sc.near = 1; sc.far = 120;
    moon.shadow.bias = -0.0005; moon.shadow.normalBias = 0.05;
    scene.add(moon); scene.add(moon.target);
    var warmA = new T.PointLight('#ffb54a', 0, 40, 1.6), warmB = new T.PointLight('#ffd27a', 0, 40, 1.6);
    warmA.position.set(-6, 9, -6); warmB.position.set(6, 9, -6); scene.add(warmA); scene.add(warmB);

    var ground = new T.Mesh(new T.PlaneGeometry(300, 300), new T.MeshStandardMaterial({ color: '#1B1E21', roughness: 0.95 }));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
    var gp = [];
    for (var gx = -60; gx <= 60; gx += 4) gp.push(gx, 0.01, -50, gx, 0.01, 40);
    for (var gz = -50; gz <= 40; gz += 4) gp.push(-60, 0.01, gz, 60, 0.01, gz);
    var gg = new T.BufferGeometry(); gg.setAttribute('position', new T.Float32BufferAttribute(gp, 3));
    scene.add(new T.LineSegments(gg, new T.LineBasicMaterial({ color: '#2A2E32', transparent: true, opacity: 0.8 })));

    /* stage z generátoru */
    var L = 18, Hs = 14, K = new KIT.Kit();
    var meta = KIT.gen.event(K, L, Hs, { depth: 12, wings: true });
    var S = K.toSet(function (q) { return q.o * SPAN; }, 1.6);
    S.build(scene, GL.materials(), true);
    var DH = meta.deckH, Dd = meta.depth;

    /* zadní plachta, LED stěny, světelný most */
    var led = ledTexture();
    var mBack = new T.MeshStandardMaterial({ color: '#0D0F11', roughness: 0.9, transparent: true, opacity: 0 });
    var back = new T.Mesh(new T.BoxGeometry(L - 0.4, Hs - DH - 0.6, 0.2), mBack);
    back.position.set(0, DH + (Hs - DH) / 2, Dd / 2 + 0.35); scene.add(back);
    var mLed = new T.MeshStandardMaterial({ color: '#000000', emissive: '#ffffff', emissiveMap: led, emissiveIntensity: 0, roughness: 0.6 });
    var screen = new T.Mesh(new T.PlaneGeometry(9.6, 4.8), mLed);
    screen.position.set(0, DH + 6.2, Dd / 2 + 0.2); screen.rotation.y = Math.PI; scene.add(screen);
    var mWing = new T.MeshStandardMaterial({ color: '#000000', emissive: '#E2A62A', emissiveIntensity: 0, roughness: 0.6 });
    var wings = [];
    [-1, 1].forEach(function (s) {
      var w = new T.Mesh(new T.PlaneGeometry(2.6, 3.6), mWing);
      w.position.set(s * (L / 2 + 2.8), Hs * 0.72 - 2.6, -Dd / 2 + 0.38); w.rotation.y = Math.PI; scene.add(w); wings.push(w);
    });
    /* kužely světel (aditivní) */
    var beams = [], mBeam = new T.MeshBasicMaterial({ color: '#FFDFA0', transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide });
    var coneG = new T.ConeGeometry(2.4, 13, 24, 1, true); coneG.translate(0, -6.5, 0);
    for (var i = 0; i < 6; i++) {
      var piv = new T.Group(); piv.position.set(-7.5 + i * 3, Hs + 0.2, -Dd / 2 - 0.6);
      var cone = new T.Mesh(coneG, mBeam); piv.add(cone);
      piv.userData.base = (i - 2.5) * 0.09; piv.rotation.z = piv.userData.base; piv.rotation.x = -0.35;
      scene.add(piv); beams.push(piv);
    }
    var lamps = new T.Mesh(new T.BoxGeometry(L, 0.35, 0.35), new T.MeshStandardMaterial({ color: '#111', emissive: '#FFE3A8', emissiveIntensity: 0 }));
    lamps.position.set(0, Hs - 0.05, -Dd / 2 - 0.6); scene.add(lamps);

    var camera = new T.PerspectiveCamera(50, 1, 0.3, 600);
    /* kamera podle postupu: [p, eye, target, hfov] */
    var KEYS = [
      [0.0, [15, 3.2, -22], [0, 2.2, 0], 74],
      [0.4, [-22, 9, -27], [0, 6, 0], 66],
      [0.75, [10, 6.5, -33], [0, 7, 0], 62],
      [1.0, [0, 4.2, -31], [0, 7.6, 0], 64]
    ];
    function camAt(p, stack) {
      for (var i = 0; i < KEYS.length - 1; i++) {
        if (p <= KEYS[i + 1][0]) {
          var t = ease(clamp((p - KEYS[i][0]) / (KEYS[i + 1][0] - KEYS[i][0])));
          var a = KEYS[i], b = KEYS[i + 1];
          return { eye: lerp3(a[1], b[1], t), tgt: lerp3(a[2], b[2], t), hfov: (a[3] + (b[3] - a[3]) * t) * (stack ? 0.78 : 1) };
        }
      }
      var e = KEYS[KEYS.length - 1]; return { eye: e[1].slice(), tgt: e[2].slice(), hfov: e[3] * (stack ? 0.78 : 1) };
    }
    function lerp3(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }

    var W = 1, Hh = 1, prog = reduce ? 1 : 0, cur = null, tB = reduce ? SPAN : 0, visible = false, running = false, lastNow = 0;
    var mx = 0, my = 0, mxT = 0, myT = 0, lastShadow = -1, stack = !!opts.stack;

    function frame(nowMs) {
      var dt = lastNow ? Math.min(0.1, (nowMs - lastNow) / 1000) : 0.016; lastNow = nowMs;
      var k = reduce ? 1 : 1 - Math.exp(-dt / 0.18);
      var build = clamp(prog / 0.82), target = build * (SPAN + 0.6);
      tB += (target - tB) * k;
      var light = clamp((prog - 0.8) / 0.18);
      var tv = camAt(prog, stack);
      if (!cur) cur = tv;
      cur = { eye: lerp3(cur.eye, tv.eye, k), tgt: lerp3(cur.tgt, tv.tgt, k), hfov: cur.hfov + (tv.hfov - cur.hfov) * k };
      mx += (mxT - mx) * k; my += (myT - my) * k;
      camera.position.set(cur.eye[0] + mx * 1.6, cur.eye[1] + my * 0.8, cur.eye[2]);
      camera.lookAt(cur.tgt[0], cur.tgt[1], cur.tgt[2]);
      camera.aspect = W / Hh;
      camera.fov = 2 * Math.atan(Math.tan(cur.hfov * D2R / 2) / camera.aspect) / D2R;
      if (stack) camera.setViewOffset(W, Hh, 0, Hh * 0.14, W, Hh); else camera.clearViewOffset();
      camera.updateProjectionMatrix();
      /* světla */
      var tt = nowMs / 1000;
      var late = clamp((build - 0.72) / 0.22);
      mBeam.opacity = 0.075 * light; lamps.material.emissiveIntensity = 2.2 * light; lamps.visible = late > 0.02;
      mLed.emissiveIntensity = 0.04 + 1.0 * light; mWing.emissiveIntensity = 0.03 + 0.45 * light;
      screen.visible = late > 0.02; screen.scale.y = Math.max(0.001, late); wings.forEach(function (w) { w.visible = late > 0.02; w.scale.y = Math.max(0.001, late); });
      mBack.opacity = clamp((build - 0.62) / 0.3) * 0.96; back.visible = mBack.opacity > 0.01;
      warmA.intensity = 70 * light; warmB.intensity = 70 * light;
      beams.forEach(function (b, i) { b.rotation.z = b.userData.base + (reduce ? 0 : Math.sin(tt * 0.7 + i * 0.9) * 0.12 * light); });
      GL.shared.uTime.value = tB; GL.shared.uTime2.value = tB;
      GL.shared.uThick.value = 1.15;
      if (Math.abs(tB - lastShadow) > 0.002) { renderer.shadowMap.needsUpdate = true; lastShadow = tB; }
      renderer.render(scene, camera);
      var settled = Math.abs(target - tB) < 0.002 && Math.abs(tv.eye[0] - cur.eye[0]) + Math.abs(tv.eye[1] - cur.eye[1]) + Math.abs(tv.eye[2] - cur.eye[2]) < 0.01 && Math.abs(mxT - mx) + Math.abs(myT - my) < 0.002;
      if (visible && (!settled || (light > 0 && !reduce))) requestAnimationFrame(frame);
      else { running = false; lastNow = 0; }
    }
    function kick() { if (!running && visible) { running = true; requestAnimationFrame(frame); } }
    function resize() {
      var r = wrap.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      W = r.width; Hh = r.height;
      renderer.setPixelRatio(Math.max(1, Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(3.0e6 / (W * Hh)))));
      renderer.setSize(W, Hh, false);
      renderer.shadowMap.needsUpdate = true;
      kick();
    }
    if (fine && !reduce) window.addEventListener('pointermove', function (e) { if (!visible) return; mxT = (e.clientX / window.innerWidth - 0.5); myT = (e.clientY / window.innerHeight - 0.5) * -1; kick(); }, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(resize).observe(wrap); else window.addEventListener('resize', resize);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) kick(); }, { rootMargin: '100px 0px' }).observe(wrap);
    else visible = true;
    resize();

    return {
      setProgress: function (p) { if (!reduce && Math.abs(p - prog) > 0.0005) { prog = p; kick(); } },
      setStack: function (s) { stack = s; kick(); },
      counts: S.count
    };
  }
  window.GoldStage = { mount: mount };
})();
