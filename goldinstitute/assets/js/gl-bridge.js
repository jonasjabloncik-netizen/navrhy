/*
  GOLD Institute · 3D maketa Žďákovského mostu se stavbou lešení
  Most podle veřejných údajů (délka 543 m, ocelový oblouk, mostovka cca 50 m nad hladinou).
  Terén i rozmístění lešení jsou ilustrační.
  Skupina A = věže kolem pilířů (staví se při načtení),
  skupina B = zavěšené lešení pod mostovkou (dostaví se při scrollu).
*/
(function () {
  'use strict';
  var T = window.THREE, GL = window.GoldGL;
  var D2R = Math.PI / 180, G2 = 1000;

  /* ---------- Geometrie (metry) ---------- */
  var HALF = 271.5, DECK_TOP = 50, GIRDER = 47.5;
  var ARCH_HALF = 165, SPRING = 2.5, RISE = 43, RIB_H = 2.0, RIB_Z = 4.6, DECK_Z = 6.75;
  var PIERS = [189.8, 215.8, 239.2], COLS = [50, 75, 100, 125, 150];
  var EXT_X = 360, EXT_Z = 230;
  function archC(x) { return SPRING + RISE * (1 - (x / ARCH_HALF) * (x / ARCH_HALF)); }
  function archTop(x) { return archC(x) + RIB_H; }
  function archBot(x) { return archC(x) - RIB_H; }
  function smooth(t) { return t * t * (3 - 2 * t); }
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function num(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0'); } // české oddělení tisíců (2 055) bez načítání Intl
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOutBack(t) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }

  /* profil údolí: výška h → vzdálenost od osy řeky */
  function axAt(h) {
    if (h <= 0) return 150;
    if (h >= 50) return 285 + (h - 50) / 0.16;
    var lo = 0, hi = 1;
    for (var i = 0; i < 30; i++) { var mid = (lo + hi) / 2; if (50 * smooth(mid) < h) lo = mid; else hi = mid; }
    return 150 + 135 * (lo + hi) / 2;
  }
  /* meandr řeky a zvlnění vrstevnic */
  function riverC(z) { return 22 * Math.sin(z / 110); }
  function wig(s, z, hm) {
    return 6 * Math.sin(z / 61 + hm * 0.12 + s * 1.7) * clamp01(hm / 20) + 2.5 * Math.sin(z / 23 + hm * 0.15 + s);
  }
  /* zátoka před mostem: údolí se směrem k divákovi rozšiřuje */
  function bay(z) { return 75 * smooth(clamp01((-z - 50) / 140)); }
  /* hrana vrstvy H na straně s (±1) v místě z */
  function edgeX(s, H, z) { var hm = H - 2.5; return riverC(z) + s * (axAt(hm) + wig(s, z, hm) + bay(z)); }
  /* výška terasy (horní plocha nejvyšší vrstvy) v bodě x, z */
  function terrace(x, z) {
    var s = x - riverC(z) >= 0 ? 1 : -1, top = 0;
    for (var H = 5; H <= 70; H += 5) { if (s * x >= s * edgeX(s, H, z)) top = H; else break; }
    return top;
  }
  function minTerrace(x0, x1, z0, z1) {
    var m = 1e9;
    for (var i = 0; i <= 4; i++) for (var j = 0; j <= 4; j++) m = Math.min(m, terrace(x0 + (x1 - x0) * i / 4, z0 + (z1 - z0) * j / 4));
    return m;
  }

  /* ---------- Oblouk: obdélníkový profil tažený po křivce ---------- */
  function archPts(zc, halfW, N) {
    var P = [];
    for (var i = 0; i <= N; i++) {
      var x = -ARCH_HALF + 2 * ARCH_HALF * i / N, y = archC(x);
      var dy = -2 * RISE * x / (ARCH_HALF * ARCH_HALF);
      var l = Math.hypot(1, dy), nx = -dy / l, ny = 1 / l;
      [[1, 1], [1, -1], [-1, -1], [-1, 1]].forEach(function (c) {
        P.push(x + nx * RIB_H * c[0], y + ny * RIB_H * c[0], zc + halfW * c[1]);
      });
    }
    return P;
  }
  function archRib(zc, halfW, N) {
    var pos = archPts(zc, halfW, N), idx = [];
    for (var j = 0; j < N; j++) {
      for (var k = 0; k < 4; k++) {
        var a = j * 4 + k, b = j * 4 + (k + 1) % 4, c2 = (j + 1) * 4 + k, d = (j + 1) * 4 + (k + 1) % 4;
        idx.push(a, c2, b, b, c2, d);
      }
    }
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g = g.toNonIndexed();
    g.computeVertexNormals();
    return g;
  }
  /* obrys oblouku: čtyři podélné hrany a oba konce (totéž, co by našel EdgesGeometry) */
  function archEdges(zc, halfW, N) {
    var P = archPts(zc, halfW, N), out = [], j, k;
    function seg(i1, i2) { out.push(P[i1 * 3], P[i1 * 3 + 1], P[i1 * 3 + 2], P[i2 * 3], P[i2 * 3 + 1], P[i2 * 3 + 2]); }
    for (k = 0; k < 4; k++) for (j = 0; j < N; j++) seg(j * 4 + k, (j + 1) * 4 + k);
    for (k = 0; k < 4; k++) { seg(k, (k + 1) % 4); seg(N * 4 + k, N * 4 + (k + 1) % 4); }
    return out;
  }
  /* obrys vrstevnicové desky: horní a dolní hrana + svislé hrany v ostrých rozích (nad 40°) */
  function slabEdges(poly, H, depth) {
    var out = [], n = poly.length, cosT = Math.cos(40 * D2R);
    for (var i = 0; i < n; i++) {
      var a = poly[i], b = poly[(i + 1) % n];
      if (a[0] === b[0] && a[1] === b[1]) continue;
      out.push(a[0], H, a[1], b[0], H, b[1], a[0], H - depth, a[1], b[0], H - depth, b[1]);
      var p = poly[(i - 1 + n) % n];
      var d1x = a[0] - p[0], d1z = a[1] - p[1], d2x = b[0] - a[0], d2z = b[1] - a[1];
      var l1 = Math.hypot(d1x, d1z), l2 = Math.hypot(d2x, d2z);
      if (l1 > 0 && l2 > 0 && (d1x * d2x + d1z * d2z) / (l1 * l2) <= cosT) out.push(a[0], H, a[1], a[0], H - depth, a[1]);
    }
    var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(out, 3));
    return g;
  }

  /* Vrstevnicová deska přímo do bufferů (rychlejší než ExtrudeGeometry, stejný tvar):
     horní a dolní plocha z triangulace obrysu, svislé stěny po hranách. Skupina 0 = plochy, 1 = stěny. */
  function slabGeometry(poly, H, depth) {
    var n = poly.length, i, area = 0;
    for (i = 0; i < n; i++) { var p = poly[i], q = poly[(i + 1) % n]; area += p[0] * q[1] - q[0] * p[1]; }
    var tris = T.ShapeUtils.triangulateShape(poly.map(function (p) { return new T.Vector2(p[0], p[1]); }), []);
    var pos = [], nor = [], lo = H - depth;
    function v(x, y, z, nx, ny, nz) { pos.push(x, y, z); nor.push(nx, ny, nz); }
    /* horní plocha má mířit nahoru: pořadí vrcholů podle znaménka normály prvního trojúhelníku */
    var flip = false;
    if (tris.length) {
      var a = poly[tris[0][0]], b = poly[tris[0][1]], c = poly[tris[0][2]];
      var ny = (b[1] - a[1]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[1] - a[1]);
      flip = ny < 0;
    }
    tris.forEach(function (t) {
      var o = flip ? [t[0], t[2], t[1]] : t;
      for (var k = 0; k < 3; k++) v(poly[o[k]][0], H, poly[o[k]][1], 0, 1, 0);
    });
    tris.forEach(function (t) {
      var o = flip ? t : [t[0], t[2], t[1]];
      for (var k = 0; k < 3; k++) v(poly[o[k]][0], lo, poly[o[k]][1], 0, -1, 0);
    });
    var lids = pos.length / 3;
    for (i = 0; i < n; i++) {
      var A = poly[i], Bp = poly[(i + 1) % n], dx = Bp[0] - A[0], dz = Bp[1] - A[1], len = Math.hypot(dx, dz);
      if (len < 1e-6) continue;
      var nx = area > 0 ? dz / len : -dz / len, nz = area > 0 ? -dx / len : dx / len;   // vnější normála (obrys proti směru hodin → vpravo od hrany)
      /* trojúhelník (A nahoře, A dole, B dole): když jeho normála nemíří ven, otočí se pořadí */
      var cx = -(dz * depth), cz = dx * depth;   // vektorový součin (A_dole − A_nahoře) × (B_dole − A_nahoře) v rovině xz
      var out = cx * nx + cz * nz > 0;
      if (out) {
        v(A[0], H, A[1], nx, 0, nz); v(A[0], lo, A[1], nx, 0, nz); v(Bp[0], lo, Bp[1], nx, 0, nz);
        v(A[0], H, A[1], nx, 0, nz); v(Bp[0], lo, Bp[1], nx, 0, nz); v(Bp[0], H, Bp[1], nx, 0, nz);
      } else {
        v(A[0], H, A[1], nx, 0, nz); v(Bp[0], lo, Bp[1], nx, 0, nz); v(A[0], lo, A[1], nx, 0, nz);
        v(A[0], H, A[1], nx, 0, nz); v(Bp[0], H, Bp[1], nx, 0, nz); v(Bp[0], lo, Bp[1], nx, 0, nz);
      }
    }
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new T.Float32BufferAttribute(nor, 3));
    g.addGroup(0, lids, 0);
    g.addGroup(lids, pos.length / 3 - lids, 1);
    return g;
  }

  /* ---------- Scéna: staví se po částech, aby stránka během přípravy nezamrzla ---------- */
  function sceneBase(opts) {
    var scene = new T.Scene();
    var bg = new T.Color(opts.bg || '#ECEBE6');
    scene.background = bg;
    scene.fog = new T.Fog(bg, 700, 1700);

    scene.add(new T.HemisphereLight('#ffffff', '#bdb6a6', 1.25));
    var sun = new T.DirectionalLight('#fff4e2', 3.1);
    sun.position.set(280, 400, -170);
    sun.castShadow = true;
    var ss = opts.shadowSize || 2048;
    sun.shadow.mapSize.set(ss, ss);
    var sc = sun.shadow.camera; sc.left = -430; sc.right = 430; sc.top = 330; sc.bottom = -330; sc.near = 50; sc.far = 1400;
    sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.7;
    scene.add(sun); scene.add(sun.target);

    var M = {
      white: new T.MeshStandardMaterial({ color: '#F6F5F1', roughness: 0.8, metalness: 0 }),
      conc: new T.MeshStandardMaterial({ color: '#D9D7CF', roughness: 0.92, metalness: 0 }),
      top: new T.MeshStandardMaterial({ color: '#EAE8E1', roughness: 1, metalness: 0 }),
      side: new T.MeshStandardMaterial({ color: '#C9C5B9', roughness: 1, metalness: 0 }),
      base: new T.MeshStandardMaterial({ color: '#B9B4A6', roughness: 1, metalness: 0 }),
      water: new T.MeshStandardMaterial({ color: '#9FB3BD', roughness: 0.18, metalness: 0.1, transparent: true }),
      edge: new T.LineBasicMaterial({ color: '#6F767B', transparent: true, opacity: 0.32 }),
      edgeT: new T.LineBasicMaterial({ color: '#8C8A80', transparent: true, opacity: 0.45 })
    };

    /* podstavec makety */
    var base = new T.Mesh(new T.BoxGeometry(EXT_X * 2 + 0.2, 12, EXT_Z * 2 + 0.2), M.base);
    base.position.y = -6.05; base.receiveShadow = true;
    scene.add(base);
    return { scene: scene, M: M, layers: [], water: null, bridge: null };
  }

  /* vrstevnicový terén po 5 m + hladina */
  function addTerrain(B) {
    var M = B.M;
    for (var H = 5; H <= 70; H += 5) {
      [-1, 1].forEach(function (s) {
        var pts = [], any = false;
        for (var z = -EXT_Z; z <= EXT_Z + 0.01; z += 7.5) {
          var ex = edgeX(s, H, z), ax = s * ex;
          if (ax < EXT_X - 1.5) any = true;
          pts.push([s * Math.min(ax, EXT_X - 0.6), z]);
        }
        if (!any) return;
        var poly = pts.concat([[s * EXT_X, EXT_Z], [s * EXT_X, -EXT_Z]]);
        var mesh = new T.Mesh(slabGeometry(poly, H, 5), [M.top, M.side]);
        mesh.castShadow = true; mesh.receiveShadow = true;
        var grp = new T.Group(); grp.add(mesh);
        grp.add(new T.LineSegments(slabEdges(poly, H, 5), M.edgeT));
        grp.userData.H = H;
        B.scene.add(grp);
        B.layers.push(grp);
      });
    }
    var water = new T.Mesh(new T.PlaneGeometry(EXT_X * 2, EXT_Z * 2), M.water);
    water.rotation.x = -Math.PI / 2; water.position.y = 0.6; water.receiveShadow = true;
    B.scene.add(water); B.water = water;
  }

  /* most */
  function addBridge(B) {
    var M = B.M, W = new GL.BoxSet(), C = new GL.BoxSet(), ribs = [], ribE = [];
    [-RIB_Z, RIB_Z].forEach(function (zc) { ribs.push(archRib(zc, 0.85, 120)); ribE.push(archEdges(zc, 0.85, 120)); });
    for (var b = 0; b <= 22; b++) {
      var x1 = -ARCH_HALF + 2 * ARCH_HALF * b / 22;
      W.between([x1, archBot(x1) + 0.4, -RIB_Z], [x1, archBot(x1) + 0.4, RIB_Z], 0.5, 0.5);
      if (b < 22) {
        var x2 = -ARCH_HALF + 2 * ARCH_HALF * (b + 1) / 22;
        W.between([x1, archBot(x1) + 0.4, -RIB_Z], [x2, archBot(x2) + 0.4, RIB_Z], 0.3, 0.3);
        W.between([x1, archBot(x1) + 0.4, RIB_Z], [x2, archBot(x2) + 0.4, -RIB_Z], 0.3, 0.3);
      }
    }
    COLS.forEach(function (cx) {
      [-1, 1].forEach(function (s) {
        var x = s * cx, y0 = archTop(cx) - 0.4;
        [-RIB_Z, RIB_Z].forEach(function (zz) { W.at(x, (y0 + GIRDER) / 2, zz, 0.9, GIRDER - y0, 0.9); });
        W.at(x, GIRDER - 0.5, 0, 0.6, 0.8, RIB_Z * 2);
        if (GIRDER - y0 > 12) {
          W.between([x, y0 + 1, -RIB_Z], [x, GIRDER - 1, RIB_Z], 0.3, 0.3);
          W.between([x, y0 + 1, RIB_Z], [x, GIRDER - 1, -RIB_Z], 0.3, 0.3);
        }
      });
    });
    W.at(0, DECK_TOP - 0.3, 0, HALF * 2, 0.6, DECK_Z * 2);
    [-RIB_Z, RIB_Z].forEach(function (zz) { W.at(0, (GIRDER + DECK_TOP - 0.6) / 2, zz, HALF * 2, DECK_TOP - 0.6 - GIRDER, 0.7); });
    for (var cxm = -HALF + 6; cxm <= HALF - 6; cxm += 12.5) W.at(cxm, GIRDER + 1.2, 0, 0.35, 1.6, RIB_Z * 2);
    [-DECK_Z + 0.2, DECK_Z - 0.2].forEach(function (zz) {
      W.at(0, DECK_TOP + 1.05, zz, HALF * 2, 0.12, 0.12);
      for (var px = -HALF + 2; px <= HALF - 2; px += 6) W.at(px, DECK_TOP + 0.5, zz, 0.12, 1.0, 0.12);
    });
    PIERS.forEach(function (px) {
      [-1, 1].forEach(function (s) {
        var x0 = s * px, gy = minTerrace(x0 - 2, x0 + 2, -5, 5) - 2;
        C.at(x0, (gy + GIRDER) / 2, 0, 3.2, GIRDER - gy, 9);
        C.at(x0, GIRDER - 0.6, 0, 4.2, 1.2, 10.4);
      });
    });
    [-1, 1].forEach(function (s) {
      C.at(s * (ARCH_HALF + 4), 2.5, 0, 12, 7, RIB_Z * 2 + 4);
      C.at(s * (HALF + 4), DECK_TOP - 5, 0, 10, 10, DECK_Z * 2 + 2);
    });
    var bridge = new T.Group();
    var wMesh = new T.Mesh(W.geometry(ribs), M.white); wMesh.castShadow = true; wMesh.receiveShadow = true;
    var cMesh = new T.Mesh(C.geometry(), M.conc); cMesh.castShadow = true; cMesh.receiveShadow = true;
    bridge.add(wMesh); bridge.add(cMesh);
    bridge.add(new T.LineSegments(W.edgeGeometry(ribE), M.edge));
    bridge.add(new T.LineSegments(C.edgeGeometry(), M.edge));
    bridge.visible = false;
    B.scene.add(bridge);
    B.bridge = bridge;
  }

  /* ---------- LEŠENÍ: jen data dílů a časy stavby (na GPU až později) ---------- */
  function scaffold() {
    var S = new GL.Set();
    var marks = {};
    var T0 = 0.8;

    /* A: věže kolem pilířů nejblíž oblouku (nejdřív levá, blíž ke kameře) */
    [-1, 1].forEach(function (s, si) {
      var x0 = s * PIERS[0];
      var outX = [x0 - 3.0, x0 + 3.0], outZ = [-6, -3, 0, 3, 6];
      var inX = [x0 - 2.0, x0 + 2.0], inZ = [-5.2, 0, 5.2];
      var gy = minTerrace(x0 - 3.2, x0 + 3.2, -6.2, 6.2);
      var levels = Math.floor((GIRDER - 1.2 - gy) / 2);
      var tStart = T0 + si * 0.2, step = 1.55 / levels;
      for (var k = 1; k <= levels; k++) {
        var ya = gy + 2 * (k - 1), yb = gy + 2 * k, t = tStart + (k - 1) * step;
        var std = [];
        outX.forEach(function (xx) { outZ.forEach(function (zz) { std.push([xx, zz]); }); });
        inX.forEach(function (xx) { inZ.forEach(function (zz) { std.push([xx, zz]); }); });
        std.forEach(function (p) { S.tube([p[0], ya, p[1]], [p[0], yb, p[1]], t, 0.16, 'stojky'); S.node([p[0], yb - 0.5, p[1]], t + 0.14); });
        outX.forEach(function (xx) { for (var i = 0; i < 4; i++) S.tube([xx, yb - 0.05, outZ[i]], [xx, yb - 0.05, outZ[i + 1]], t + 0.08, 0.14, 'podelniky'); });
        [-6, 6].forEach(function (zz) { S.tube([outX[0], yb - 0.05, zz], [outX[1], yb - 0.05, zz], t + 0.08, 0.14, 'podelniky'); });
        inX.forEach(function (xx) { S.tube([xx, yb - 0.05, inZ[0]], [xx, yb - 0.05, inZ[2]], t + 0.1, 0.14, 'podelniky'); });
        [-5.2, 5.2].forEach(function (zz) { S.tube([inX[0], yb - 0.05, zz], [inX[1], yb - 0.05, zz], t + 0.1, 0.14, 'podelniky'); });
        outX.forEach(function (xx) {
          ((k % 2) ? [0, 2] : [1, 3]).forEach(function (bi) { S.tube([xx, ya, outZ[bi]], [xx, yb, outZ[bi + 1]], t + 0.12, 0.16, 'diagonaly'); });
        });
        if (k % 2) [-6, 6].forEach(function (zz) { S.tube([outX[0], ya, zz], [outX[1], yb, zz], t + 0.12, 0.16, 'diagonaly'); });
        if (k % 2 === 0) {
          S.plank([x0, yb + 0.03, -5.6], [6.0, 0.1, 1.0], t + 0.16, 0.3, 2.2);
          S.plank([x0, yb + 0.03, 5.6], [6.0, 0.1, 1.0], t + 0.16, 0.3, 2.2);
          S.plank([x0 - 2.5, yb + 0.03, 0], [1.0, 0.1, 10.2], t + 0.18, 0.3, 2.2);
          S.plank([x0 + 2.5, yb + 0.03, 0], [1.0, 0.1, 10.2], t + 0.18, 0.3, 2.2);
        }
      }
      if (s < 0) { marks.tower = [x0 - 3.0, gy + (GIRDER - gy) * 0.55, -6]; marks.towerBase = [x0 - 3, gy, -6]; marks.towerTop = [x0 - 3, GIRDER - 1.2, -6]; marks.towerH = Math.round(GIRDER - 1.2 - gy); }
    });

    /* B: zavěšené lešení pod mostovkou, od opěr ke středu */
    var PY = 45.1, RY = 46.15, PZ = 7.8, STEP = 3.5;
    var bTimes = [];
    [-1, 1].forEach(function (s, si) {
      var st = [];
      for (var ax = 262; ax >= 54; ax -= STEP) st.push(ax);
      var n = st.length, tS = T0 + 0.1 + si * 0.22, span = 2.0;
      st.forEach(function (ax, i) {
        var x = s * ax, t = tS + i * (span / n), tb = t + G2;
        if (s < 0) bTimes.push([ax, t]);
        S.beam([x, GIRDER - 0.3, 0], [0.34, 0.42, 16.4], tb, 0.36, -16);
        [-7.2, -2.6, 2.6, 7.2].forEach(function (zz) {
          S.tube([x, GIRDER - 0.5, zz], [x, PY, zz], tb + 0.16, 0.18, 'zavesy', 0.07);
          S.node([x, PY + 0.05, zz], tb + 0.3);
        });
        S.tube([x, PY, -PZ], [x, PY, PZ], tb + 0.24, 0.16, 'podelniky');
        S.tube([x, PY, -PZ], [x, RY, -PZ], tb + 0.34, 0.12);
        S.tube([x, PY, PZ], [x, RY, PZ], tb + 0.34, 0.12);
        if (i < n - 1) {
          var xn = s * st[i + 1];
          [-PZ, PZ].forEach(function (zz) {
            S.tube([x, PY + 0.02, zz], [xn, PY + 0.02, zz], tb + 0.26, 0.14, 'podelniky');
            S.tube([x, RY, zz], [xn, RY, zz], tb + 0.38, 0.14);
            S.tube([x, (PY + RY) / 2, zz], [xn, (PY + RY) / 2, zz], tb + 0.4, 0.14);
          });
          [-5.85, -1.95, 1.95, 5.85].forEach(function (zz, j) {
            S.plank([(x + xn) / 2, PY + 0.09, zz], [STEP - 0.05, 0.08, 3.8], tb + 0.3 + j * 0.03, 0.34, 2.6);
          });
        }
      });
    });
    marks.platform = [-118, PY - 0.2, -PZ];
    marks.beam = [-101, GIRDER - 0.3, -8.2];
    marks.hanger = [-96, (GIRDER + PY) / 2, -7.2];
    marks.len = [0, DECK_TOP + 6, -DECK_Z];
    marks.hB = [118, 0.6, -14]; marks.hT = [118, DECK_TOP, -14];
    marks.lenL = [-HALF, DECK_TOP + 2, -DECK_Z];
    marks.lenR = [HALF, DECK_TOP + 2, -DECK_Z];
    marks.height = [ARCH_HALF + 2, DECK_TOP * 0.5, -DECK_Z - 2];
    marks.arch = [60, archTop(60) + 1, -RIB_Z];

    /* čas, kdy zavěšené lešení dosáhne vzdálenosti ax od středu */
    function bTimeAt(axv) {
      for (var i = 0; i < bTimes.length; i++) if (bTimes[i][0] <= axv) return bTimes[i][1];
      return bTimes[bTimes.length - 1][1];
    }
    return { set: S, marks: marks, endA: S.endA, endB: S.endB, bCap: bTimeAt(150) + 0.4 };
  }

  /* ---------- Kamery: eye, target, hfov, posun obrazu (sx, sy jako podíl šířky/výšky) ---------- */
  function view(eye, target, hfov, sx, sy) { return { eye: eye, target: target, hfov: hfov, sx: sx || 0, sy: sy || 0 }; }
  var VIEWS = {
    hero: function (a, stack) {
      if (stack) return a < 0.8 ? view([-214, 30, -104], [-150, 42, 6], 62, 0, -0.1) : view([-250, 40, -250], [-80, 40, 0], 66, 0.05, 0);
      return a >= 1.7 ? view([-238, 32, -190], [-92, 43, 0], 64, 0.22, -0.12) : view([-244, 33, -200], [-92, 43, 0], 68, 0.2, -0.13);
    },
    intro: function (a, stack) {
      if (stack) return a < 0.8 ? view([-198, 26, -78], [-160, 40, 6], 68, 0, -0.1) : view([-214, 30, -104], [-150, 42, 6], 72, 0.05, 0);
      return view([-212, 27, -98], [-150, 42, 6], 66, 0.16, -0.08);
    },
    mosty: function (a, stack) {
      if (stack) return a < 0.8 ? view([-330, 140, -420], [20, 30, 0], 52, 0, 0.24) : view([-60, 60, -520], [0, 32, 0], 70, 0, 0.16);
      return view([0, 40, -440], [0, 30, 0], 74, 0, 0.15);
    },
    zaves: function (a, stack) {
      if (stack) return a < 0.8 ? view([-166, 37, -46], [-110, 46, 2], 50, 0, 0.16) : view([-178, 37.5, -40], [-86, 46.5, 2], 72, 0, 0.16);
      return view([-172, 38.5, -36], [-82, 46.6, 2], 66, 0.13, 0);
    },
    vez: function (a, stack) {
      if (stack) return a < 0.8 ? view([-136, 24, -74], [-190, 30, 0], 50, 0, 0.16) : view([-122, 26, -76], [-190, 28, 0], 68, 0, 0.16);
      return view([-126, 22, -62], [-191, 27, 0], 64, 0.14, 0);
    },
    nadhled: function (a, stack) {
      if (stack) return a < 0.8 ? view([-300, 640, -560], [0, 10, 10], 44, 0, 0.16) : view([-260, 560, -720], [10, 10, 10], 60, 0, 0.16);
      return view([-200, 330, -470], [10, 10, 10], 56, 0.15, 0);
    }
  };
  function lerpView(a, b, t) {
    function l(x, y) { return [x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]; }
    return { eye: l(a.eye, b.eye), target: l(a.target, b.target), hfov: a.hfov + (b.hfov - a.hfov) * t, sx: a.sx + (b.sx - a.sx) * t, sy: a.sy + (b.sy - a.sy) * t };
  }

  /* ---------- Ovladač ---------- */
  function mount(wrap, opts) {
    opts = opts || {};
    var canvas = wrap.querySelector('canvas');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var small = !fine || Math.min(window.innerWidth, window.innerHeight) < 600;
    var renderer;
    if (GL.noGL) { wrap.classList.add('no-gl'); return null; }
    try {
      renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true });
    } catch (e) { GL.noGL = true; wrap.classList.add('no-gl'); return null; }
    renderer.debug.checkShaderErrors = false;
    var dprMax = small ? 1.6 : 2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.autoUpdate = false;   // stín se přepočítá jen když se lešení mění
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.toneMapping = T.NeutralToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = T.SRGBColorSpace;

    var B = sceneBase({ shadowSize: small ? 1024 : 2048, bg: opts.bg });
    var S = scaffold();
    var camera = new T.PerspectiveCamera(50, 1, 1, 5000);
    var W = 1, H = 1, stack = !!opts.stack;
    var shared = GL.shared;
    var END = Math.max(S.endA, S.endB) + 0.5;

    var views = {};
    Object.keys(VIEWS).forEach(function (k) { views[k] = VIEWS[k]; });
    Object.keys(opts.views || {}).forEach(function (k) {
      var v = opts.views[k]; views[k] = typeof v === 'function' ? v : function () { return v; };
    });

    var clockStart = 0, buildT = reduce ? END : 0, running = false, visible = true, fixedT = null, lastNow = 0, ready = false, heroSignal = false;
    var progress = 0, scrub = reduce ? 1 : 0, lastB = -1, shA = -1, shB = -1;
    var keys = opts.keys || [['hero', 0]];
    var cur = null, yaw = 0, yawT = 0, pitch = 0, pitchT = 0;
    var labels = Array.prototype.slice.call(wrap.querySelectorAll('[data-mark]'));
    var dims = Array.prototype.slice.call(wrap.querySelectorAll('[data-dim]'));
    var showDims = function () { return true; };
    var tallyEls = Array.prototype.slice.call(document.querySelectorAll('[data-tally]'));
    var tags = { stojky: 1, podelniky: 1, diagonaly: 1, zavesy: 1, podlahy: 1, nosniky: 1 };
    var v3 = new T.Vector3();

    function aspect() { return W / H; }
    function targetView() {
      var A = aspect();
      var introK = reduce ? 1 : easeInOut(clamp01(buildT / 3.0));
      var hero = lerpView(views.intro(A, stack), views.hero(A, stack), introK);
      if (progress <= 0 || keys.length < 2) return hero;
      var list = keys.map(function (k) { return { v: k[0] === 'hero' ? hero : views[k[0]](A, stack), p: k[1] }; });
      for (var i = 0; i < list.length - 1; i++) {
        if (progress <= list[i + 1].p) {
          var t = clamp01((progress - list[i].p) / ((list[i + 1].p - list[i].p) || 1));
          return lerpView(list[i].v, list[i + 1].v, easeInOut(t));
        }
      }
      return list[list.length - 1].v;
    }
    function applyView(v) {
      var dx = v.eye[0] - v.target[0], dz = v.eye[2] - v.target[2];
      var c = Math.cos(yaw * D2R), s = Math.sin(yaw * D2R);
      camera.position.set(v.target[0] + dx * c - dz * s, v.eye[1] + pitch * 4, v.target[2] + dx * s + dz * c);
      camera.lookAt(v.target[0], v.target[1], v.target[2]);
      camera.aspect = aspect();
      camera.fov = 2 * Math.atan(Math.tan(v.hfov * D2R / 2) / aspect()) / D2R;
      if (Math.abs(v.sx) > 0.001 || Math.abs(v.sy) > 0.001) camera.setViewOffset(W, H, -v.sx * W, v.sy * H, W, H);
      else camera.clearViewOffset();
      camera.updateProjectionMatrix();
      var dist = Math.hypot(dx, v.eye[1] - v.target[1], dz);
      shared.uThick.value = Math.max(0.6, Math.min(2.8, dist / 150));
    }

    function placeLabels() {
      labels.forEach(function (el) {
        var m = S.marks[el.getAttribute('data-mark')];
        if (!m) return;
        v3.set(m[0], m[1], m[2]).project(camera);
        var x = (v3.x * 0.5 + 0.5) * W, y = (-v3.y * 0.5 + 0.5) * H;
        el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
        var off = v3.z > 1 || x < -60 || x > W + 60 || y < -60 || y > H + 60;
        if (el._off !== off) { el._off = off; el.classList.toggle('is-off', off); }
      });
      if (!dims.length || !showDims()) return;
      dims.forEach(function (g) {
        var ab = g.getAttribute('data-dim').split(' ');
        var mA = S.marks[ab[0]], mB = S.marks[ab[1]];
        if (!mA || !mB) return;
        v3.set(mA[0], mA[1], mA[2]).project(camera); var ax = (v3.x * 0.5 + 0.5) * W, ay = (-v3.y * 0.5 + 0.5) * H;
        v3.set(mB[0], mB[1], mB[2]).project(camera); var bx = (v3.x * 0.5 + 0.5) * W, by = (-v3.y * 0.5 + 0.5) * H;
        var len = Math.hypot(bx - ax, by - ay) || 1, nx = -(by - ay) / len, ny = (bx - ax) / len;
        var side = +(g.getAttribute('data-side') || 1), o = 12 * side;
        var l = g.querySelector('.dim__l'), t = g.querySelectorAll('.dim__t'), tx = g.querySelector('text');
        l.setAttribute('x1', (ax + nx * o).toFixed(1)); l.setAttribute('y1', (ay + ny * o).toFixed(1));
        l.setAttribute('x2', (bx + nx * o).toFixed(1)); l.setAttribute('y2', (by + ny * o).toFixed(1));
        [[ax, ay], [bx, by]].forEach(function (P, i) {
          t[i].setAttribute('x1', (P[0] + nx * (o - 7 * side)).toFixed(1)); t[i].setAttribute('y1', (P[1] + ny * (o - 7 * side)).toFixed(1));
          t[i].setAttribute('x2', (P[0] + nx * (o + 7 * side)).toFixed(1)); t[i].setAttribute('y2', (P[1] + ny * (o + 7 * side)).toFixed(1));
        });
        var mx = (ax + bx) / 2 + nx * (o + 16 * side), my = (ay + by) / 2 + ny * (o + 16 * side);
        tx.setAttribute('x', mx.toFixed(1)); tx.setAttribute('y', my.toFixed(1));
      });
    }

    function timeB() {
      // zavěšené lešení: při načtení jen po hranici bCap, dál podle scrollu
      var lim = S.bCap + (S.endB + 0.45 - S.bCap) * scrub;
      return Math.min(buildT, lim);
    }
    function updateTally(tA, tB) {
      tallyEls.forEach(function (el) {
        var key = el.getAttribute('data-tally');
        var v = 0;
        if (key === 'celkem') { for (var k in tags) v += S.set.countAt(k, tA, tB); }
        else v = S.set.countAt(key, tA, tB);
        if (el._v !== v) { el._v = v; el.textContent = num(v); }
      });
    }

    function introAnim(t) {
      B.layers.forEach(function (g) {
        var d = 0.035 * (g.userData.H / 5);
        var p = reduce ? 1 : clamp01((t - d) / 0.45);
        g.position.y = (1 - easeOutBack(p)) * 16;
        g.visible = p > 0;
      });
      var pw = reduce ? 1 : clamp01((t - 0.25) / 0.5);
      B.M.water.opacity = pw; B.water.visible = pw > 0;
      var pb = reduce ? 1 : clamp01((t - 0.35) / 0.6);
      B.bridge.position.y = (1 - easeOutBack(pb)) * 30;
      B.bridge.visible = pb > 0;
    }

    function frame(now) {
      if (!clockStart) clockStart = now;
      var dt = lastNow ? Math.min(0.1, (now - lastNow) / 1000) : 0.016; lastNow = now;
      if (fixedT != null) buildT = fixedT;
      else if (!reduce) buildT = Math.min(END, (now - clockStart) / 1000);
      var tB = timeB();
      if (buildT !== shA || tB !== shB) { renderer.shadowMap.needsUpdate = true; shA = buildT; shB = tB; }
      shared.uTime.value = buildT;
      shared.uTime2.value = tB;
      introAnim(buildT);
      var tv = targetView();
      if (!cur) cur = tv;
      cur = lerpView(cur, tv, reduce || fixedT != null ? 1 : 1 - Math.exp(-dt / 0.14));
      var kp = 1 - Math.exp(-dt / 0.3);
      yaw += (yawT - yaw) * kp; pitch += (pitchT - pitch) * kp;
      applyView(cur);
      renderer.render(B.scene, camera);
      placeLabels();
      updateTally(buildT, tB);
      var built = buildT >= END - 0.3;
      wrap.classList.toggle('is-built', built);
      if (built && !heroSignal) { heroSignal = true; try { window.dispatchEvent(new Event('gold:hero')); } catch (e) { /* starý prohlížeč */ } }
      var d = Math.abs(cur.eye[0] - tv.eye[0]) + Math.abs(cur.eye[1] - tv.eye[1]) + Math.abs(cur.eye[2] - tv.eye[2]) +
        Math.abs(cur.target[0] - tv.target[0]) + Math.abs(cur.target[1] - tv.target[1]) + Math.abs(cur.hfov - tv.hfov) + Math.abs(cur.sx - tv.sx) * 50 + Math.abs(cur.sy - tv.sy) * 50;
      var settled = d < 0.02 && Math.abs(yawT - yaw) < 0.002 && Math.abs(pitchT - pitch) < 0.002;
      var animating = fixedT == null && buildT < END;
      var scrubbing = Math.abs(tB - lastB) > 0.0001; lastB = tB;
      if (visible && (!settled || animating || scrubbing)) requestAnimationFrame(frame);
      else { running = false; lastNow = 0; }
    }
    function kick() { if (ready && !running && visible) { running = true; requestAnimationFrame(frame); } }

    var lastSize = '';
    function resize() {
      var r = wrap.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      W = r.width; H = r.height;
      /* rozpočet pixelů: nejvýš cca 3,2 Mpx, aby animace držela 60 fps i na běžném notebooku */
      var pr = Math.max(1, Math.min(window.devicePixelRatio || 1, dprMax, Math.sqrt(3.2e6 / (W * H))));
      var key = W + 'x' + H + '@' + pr;
      if (key === lastSize) return;
      lastSize = key;
      renderer.setPixelRatio(pr);
      renderer.setSize(W, H, false);
      renderer.shadowMap.needsUpdate = true;
      cur = null;
      kick();
    }

    if (fine && !reduce) {
      window.addEventListener('pointermove', function (e) {
        if (!visible) return;
        yawT = (e.clientX / window.innerWidth - 0.5) * 2.4;
        pitchT = (e.clientY / window.innerHeight - 0.5) * -1.2;
        kick();
      }, { passive: true });
    }
    if (window.ResizeObserver) new ResizeObserver(resize).observe(wrap); else window.addEventListener('resize', resize);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) kick(); }, { threshold: 0 }).observe(wrap);
    }
    resize();

    /* Příprava po krocích (terén → most → lešení → shadery). Mezi kroky stránka dýchá,
       shadery se překládají mimo hlavní vlákno (kde to prohlížeč umí) a první snímek
       se ukáže až hotový, plynulým roztmívnutím. */
    function go() {
      if (ready) return;
      ready = true; running = true; lastNow = 0;
      try { frame(performance.now()); } catch (e) { running = false; }
      wrap.classList.add('is-gl');
    }
    var steps = [
      function () { addTerrain(B); addBridge(B); },
      function () {
        S.set.build(B.scene, GL.materials(), true); introAnim(buildT);
        applyView(cur = targetView());
        GL.prepare(renderer, B.scene, camera, go);
        /* zatímco se překládají shadery, může stránka stavět obsah dalších kapitol */
        try { window.dispatchEvent(new Event('gold:hero-prep')); } catch (e) { /* starý prohlížeč */ }
      }
    ];
    (function next(i) {
      if (i >= steps.length) return;
      setTimeout(function () {
        try { steps[i](); } catch (e) { wrap.classList.add('no-gl'); return; }
        next(i + 1);
      }, 0);
    })(0);

    return {
      /* p = postup kapitoly (0–1), sc = dostavění zavěšeného lešení (0–1) */
      setProgress: function (p, sc) {
        var ch = Math.abs(p - progress) > 0.0002;
        progress = p;
        if (sc != null && !reduce) { sc = clamp01(sc); if (Math.abs(sc - scrub) > 0.0002) { scrub = sc; ch = true; } }
        if (ch) kick();
      },
      setStack: function (s) { if (s !== stack) { stack = s; cur = null; kick(); } },
      setDims: function (fn) { showDims = fn; },
      refresh: function () { kick(); },
      towerH: S.marks.towerH,
      replay: function () { if (reduce) return; clockStart = 0; buildT = 0; fixedT = null; kick(); },
      counts: S.set.count,
      _seek: function (t, p, sc) { fixedT = t; if (p != null) progress = p; if (sc != null) scrub = sc; cur = null; kick(); }
    };
  }

  window.GoldBridge = { mount: mount };
})();
