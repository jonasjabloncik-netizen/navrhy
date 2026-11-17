/*
  GOLD Institute · sdílené 3D lešení (three.js)
  Díly lešení jsou instance; jejich stavba (růst stojek, dopad podlah, nasunutí nosníků)
  běží celá na GPU přes uniform uTime, takže animace je plynulá i s tisíci díly.
*/
(function () {
  'use strict';
  var T = window.THREE;

  /* ---------- Materiály s animací stavby ---------- */
  var VERT_HEAD = [
    'attribute vec4 aAnim;',
    'uniform float uTime;',
    'uniform float uTime2;',
    'uniform float uThick;',
    'varying float vFlash;',
    'float gEaseOut(float x){ return 1.0 - pow(1.0 - x, 3.0); }',
    'float gEaseBack(float x){ float c1 = 1.70158; float c3 = c1 + 1.0; float u = x - 1.0; return 1.0 + c3 * u * u * u + c1 * u * u; }'
  ].join('\n');

  var BEGIN = [
    'vec3 transformed = vec3( position );',
    'float gT = aAnim.x >= 500.0 ? uTime2 + 1000.0 : uTime;',
    'float gP = clamp((gT - aAnim.x) / max(aAnim.y, 0.0001), 0.0, 1.0);',
    'float gMode = aAnim.z;',
    'vec3 gOffset = vec3(0.0);',
    'if (gMode < 0.5) {',                       // 0: trubka roste od báze
    '  transformed.xz *= uThick * step(0.0001, gP);',
    '  transformed.y *= gEaseOut(gP);',
    '} else if (gMode < 1.5) {',                // 1: podlaha dopadne shora
    '  float e = gEaseBack(gP);',
    '  gOffset.y = (1.0 - e) * aAnim.w;',
    '  transformed *= step(0.0001, gP);',
    '} else if (gMode < 2.5) {',                // 2: uzel (rozeta) naskočí
    '  transformed *= gEaseBack(gP) * mix(1.0, uThick, 0.6);',
    '} else {',                                 // 3: nosník se nasune bokem
    '  float e = gEaseOut(gP);',
    '  gOffset.z = (1.0 - e) * aAnim.w;',
    '  transformed *= step(0.0001, gP);',
    '}',
    'float gDone = gT - (aAnim.x + aAnim.y);',
    'vFlash = gP < 1.0 ? gP * 0.8 : exp(-max(gDone, 0.0) * 2.6);'
  ].join('\n');

  var PROJECT = [
    'vec4 mvPosition = vec4( transformed, 1.0 );',
    '#ifdef USE_INSTANCING',
    '  mvPosition = instanceMatrix * mvPosition;',
    '#endif',
    'mvPosition.xyz += gOffset;',
    'mvPosition = modelViewMatrix * mvPosition;',
    'gl_Position = projectionMatrix * mvPosition;'
  ].join('\n');

  /* uTime řídí skupinu A, uTime2 skupinu B (díly s t0 posunutým o +1000) */
  var shared = { uTime: { value: 0 }, uTime2: { value: 0 }, uThick: { value: 1 } };

  function patch(mat, flashColor) {
    mat.onBeforeCompile = function (sh) {
      sh.uniforms.uTime = shared.uTime;
      sh.uniforms.uTime2 = shared.uTime2;
      sh.uniforms.uThick = shared.uThick;
      sh.uniforms.uFlash = { value: new T.Color(flashColor || '#ffd979') };
      sh.vertexShader = VERT_HEAD + '\n' + sh.vertexShader
        .replace('#include <begin_vertex>', BEGIN)
        .replace('#include <project_vertex>', PROJECT);
      if (sh.fragmentShader.indexOf('#include <emissivemap_fragment>') >= 0) {
        sh.fragmentShader = 'uniform vec3 uFlash;\nvarying float vFlash;\n' + sh.fragmentShader
          .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += uFlash * vFlash * 0.9;');
      } else {
        sh.fragmentShader = 'varying float vFlash;\n' + sh.fragmentShader;
      }
    };
    mat.customProgramCacheKey = function () { return 'gold-anim-' + (flashColor || ''); };
    return mat;
  }
  function depthMat() {
    var m = new T.MeshDepthMaterial({ depthPacking: T.RGBADepthPacking });
    return patch(m);
  }

  function materials() {
    return {
      tube: patch(new T.MeshStandardMaterial({ color: '#C9962C', metalness: 0.62, roughness: 0.36 })),
      node: patch(new T.MeshStandardMaterial({ color: '#E7B54B', metalness: 0.7, roughness: 0.3 })),
      plank: patch(new T.MeshStandardMaterial({ color: '#B98A2A', metalness: 0.25, roughness: 0.62 })),
      beam: patch(new T.MeshStandardMaterial({ color: '#2A2F35', metalness: 0.45, roughness: 0.48 }), '#E2A62A')
    };
  }

  /* ---------- Sada dílů ---------- */
  var UP = new T.Vector3(0, 1, 0);
  var _m = new T.Matrix4(), _q = new T.Quaternion(), _p = new T.Vector3(), _s = new T.Vector3(), _d = new T.Vector3();

  function Set() {
    this.lists = { tube: [], node: [], plank: [], beam: [] };
    this.count = { stojky: 0, podelniky: 0, diagonaly: 0, zavesy: 0, podlahy: 0, nosniky: 0 };
    this.meshes = [];
    this.end = 0; this.endA = 0; this.endB = 0;
    this.done = {};
  }
  function upper(arr, t) { var lo = 0, hi = arr.length; while (lo < hi) { var m = (lo + hi) >> 1; if (arr[m] <= t) lo = m + 1; else hi = m; } return lo; }
  /* počet dílů daného typu hotových v čase tA (skupina A) a tB (skupina B) */
  Set.prototype.countAt = function (tag, tA, tB) {
    var d = this.done[tag]; if (!d) return 0;
    if (!d.sorted) { d.a.sort(function (x, y) { return x - y; }); d.b.sort(function (x, y) { return x - y; }); d.sorted = true; }
    return upper(d.a, tA) + upper(d.b, tB);
  };
  Set.prototype._push = function (kind, matrix, t0, dur, mode, amount, tag) {
    this.lists[kind].push({ m: matrix, a: [t0, dur, mode, amount || 0] });
    var B = t0 >= 500, te = (B ? t0 - 1000 : t0) + dur;
    if (tag) {
      this.count[tag] = (this.count[tag] || 0) + 1;
      var d = this.done[tag] || (this.done[tag] = { a: [], b: [] });
      (B ? d.b : d.a).push(te); d.sorted = false;
    }
    this.end = Math.max(this.end, te);
    if (B) this.endB = Math.max(this.endB, te); else this.endA = Math.max(this.endA, te);
  };
  /* trubka z A do B (roste od A), poloměr r v metrech */
  Set.prototype.tube = function (A, B, t0, dur, tag, r) {
    _d.set(B[0] - A[0], B[1] - A[1], B[2] - A[2]);
    var len = _d.length();
    _q.setFromUnitVectors(UP, _d.normalize());
    _p.set(A[0], A[1], A[2]);
    r = r || 0.085;
    _s.set(r, len, r);
    this._push('tube', new T.Matrix4().compose(_p, _q, _s), t0, dur, 0, 0, tag);
  };
  Set.prototype.node = function (P, t0) {
    _p.set(P[0], P[1], P[2]); _q.identity(); _s.set(0.22, 0.09, 0.22);
    this._push('node', new T.Matrix4().compose(_p, _q, _s), t0, 0.28, 2, 0);
  };
  /* deska: střed C, rozměr S; dopadne z výšky drop */
  Set.prototype.plank = function (C, S, t0, dur, drop, tag) {
    _p.set(C[0], C[1], C[2]); _q.identity(); _s.set(S[0], S[1], S[2]);
    this._push('plank', new T.Matrix4().compose(_p, _q, _s), t0, dur, 1, drop == null ? 2.5 : drop, tag || 'podlahy');
  };
  /* nosník vlastní konstrukce: nasune se po ose z o slide metrů */
  Set.prototype.beam = function (C, S, t0, dur, slide) {
    _p.set(C[0], C[1], C[2]); _q.identity(); _s.set(S[0], S[1], S[2]);
    this._push('beam', new T.Matrix4().compose(_p, _q, _s), t0, dur, 3, slide == null ? -14 : slide, 'nosniky');
  };

  var GEOM = null;
  function geoms() {
    if (GEOM) return GEOM;
    var tube = new T.CylinderGeometry(1, 1, 1, 8, 1, false); tube.translate(0, 0.5, 0);
    var node = new T.CylinderGeometry(1, 1, 1, 10, 1, false);
    var box = new T.BoxGeometry(1, 1, 1);
    GEOM = { tube: tube, node: node, plank: box, beam: box.clone() };
    return GEOM;
  }

  Set.prototype.build = function (parent, mats, shadows) {
    var G = geoms(), self = this;
    ['tube', 'node', 'plank', 'beam'].forEach(function (kind) {
      var list = self.lists[kind];
      if (!list.length) return;
      var g = G[kind].clone();
      var anim = new Float32Array(list.length * 4);
      var mesh = new T.InstancedMesh(g, mats[kind], list.length);
      for (var i = 0; i < list.length; i++) {
        mesh.setMatrixAt(i, list[i].m);
        anim.set(list[i].a, i * 4);
      }
      g.setAttribute('aAnim', new T.InstancedBufferAttribute(anim, 4));
      mesh.instanceMatrix.needsUpdate = true;
      mesh.frustumCulled = false;
      if (shadows) { mesh.castShadow = true; mesh.receiveShadow = kind === 'plank' || kind === 'beam'; mesh.customDepthMaterial = depthMat(); }
      parent.add(mesh);
      self.meshes.push(mesh);
    });
    return this;
  };
  Set.prototype.dispose = function () {
    this.meshes.forEach(function (m) { if (m.parent) m.parent.remove(m); m.geometry.dispose(); if (m.customDepthMaterial) m.customDepthMaterial.dispose(); });
    this.meshes = [];
  };

  /* ---------- Statická geometrie: kvádr mezi body ---------- */
  /* Každý kvádr si rovnou nese svých 12 hran (userData.edges), takže obrysy modelu
     není potřeba dopočítávat drahým EdgesGeometry nad sloučenou geometrií. */
  var CORN = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
  var EDG = [0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7];
  var _v = new T.Vector3();
  function boxEdges(m, hx, hy, hz) {
    var P = new Array(24), out = new Array(72), i;
    for (i = 0; i < 8; i++) { _v.set(CORN[i][0] * hx, CORN[i][1] * hy, CORN[i][2] * hz).applyMatrix4(m); P[i * 3] = _v.x; P[i * 3 + 1] = _v.y; P[i * 3 + 2] = _v.z; }
    for (i = 0; i < 24; i++) { var c = EDG[i] * 3; out[i * 3] = P[c]; out[i * 3 + 1] = P[c + 1]; out[i * 3 + 2] = P[c + 2]; }
    return out;
  }
  var _one = new T.Vector3(1, 1, 1);
  function beamBetween(A, B, w, h) {
    var a = new T.Vector3(A[0], A[1], A[2]), b = new T.Vector3(B[0], B[1], B[2]);
    var len = a.distanceTo(b);
    var g = new T.BoxGeometry(w, len, h);
    var q = new T.Quaternion().setFromUnitVectors(UP, b.clone().sub(a).normalize());
    var m = new T.Matrix4().compose(a.clone().add(b).multiplyScalar(0.5), q, _one);
    g.applyMatrix4(m);
    g.userData.edges = boxEdges(m, w / 2, len / 2, h / 2);
    return g;
  }
  function boxAt(cx, cy, cz, sx, sy, sz) {
    var g = new T.BoxGeometry(sx, sy, sz); g.translate(cx, cy, cz);
    g.userData.edges = boxEdges(new T.Matrix4().makeTranslation(cx, cy, cz), sx / 2, sy / 2, sz / 2);
    return g;
  }
  /* Rychlá sada kvádrů pro statické modely (most): vrcholy, normály i hrany se píšou rovnou do polí,
     bez stovek BoxGeometry a jejich slučování. Plochy jsou proti směru hodin při pohledu zvenku. */
  var FACES = [[[1, 0, 0], [1, 2, 6, 5]], [[-1, 0, 0], [0, 4, 7, 3]], [[0, 1, 0], [3, 7, 6, 2]],
               [[0, -1, 0], [0, 1, 5, 4]], [[0, 0, 1], [4, 5, 6, 7]], [[0, 0, -1], [0, 3, 2, 1]]];
  var _bm = new T.Matrix4(), _bq = new T.Quaternion(), _bp = new T.Vector3(), _bd = new T.Vector3();
  function BoxSet() { this.p = []; this.n = []; this.e = []; }
  BoxSet.prototype.add = function (m, hx, hy, hz, q) {   // q = natočení (kvůli normálám), bez měřítka
    var C = [], i, f, k;
    for (i = 0; i < 8; i++) { _v.set(CORN[i][0] * hx, CORN[i][1] * hy, CORN[i][2] * hz).applyMatrix4(m); C.push(_v.x, _v.y, _v.z); }
    for (f = 0; f < 6; f++) {
      var fc = FACES[f][1]; _bd.fromArray(FACES[f][0]); if (q) _bd.applyQuaternion(q);
      [fc[0], fc[1], fc[2], fc[0], fc[2], fc[3]].forEach(function (c) { this.p.push(C[c * 3], C[c * 3 + 1], C[c * 3 + 2]); this.n.push(_bd.x, _bd.y, _bd.z); }, this);
    }
    for (k = 0; k < 24; k++) { var c3 = EDG[k] * 3; this.e.push(C[c3], C[c3 + 1], C[c3 + 2]); }
  };
  BoxSet.prototype.at = function (cx, cy, cz, sx, sy, sz) { this.add(_bm.makeTranslation(cx, cy, cz), sx / 2, sy / 2, sz / 2); };
  BoxSet.prototype.between = function (A, B, w, h) {
    _bd.set(B[0] - A[0], B[1] - A[1], B[2] - A[2]);
    var len = _bd.length();
    _bq.setFromUnitVectors(UP, _bd.normalize());
    _bp.set((A[0] + B[0]) / 2, (A[1] + B[1]) / 2, (A[2] + B[2]) / 2);
    this.add(_bm.compose(_bp, _bq, _one), w / 2, len / 2, h / 2, _bq);
  };
  /* geometrie kvádrů + případné další neindexované geometrie (pozice a normály) */
  BoxSet.prototype.geometry = function (extra) {
    var P = this.p, N = this.n, n = P.length;
    (extra || []).forEach(function (g) { n += g.attributes.position.array.length; });
    var pos = new Float32Array(n), nor = new Float32Array(n), o = 0, i;
    for (i = 0; i < P.length; i++) { pos[i] = P[i]; nor[i] = N[i]; }
    o = P.length;
    (extra || []).forEach(function (g) { pos.set(g.attributes.position.array, o); nor.set(g.attributes.normal.array, o); o += g.attributes.position.array.length; });
    var geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.BufferAttribute(pos, 3));
    geo.setAttribute('normal', new T.BufferAttribute(nor, 3));
    return geo;
  };
  BoxSet.prototype.edgeGeometry = function (extra) {
    var n = this.e.length, o = this.e.length;
    (extra || []).forEach(function (a) { n += a.length; });
    var arr = new Float32Array(n); arr.set(this.e);
    (extra || []).forEach(function (a) { arr.set(a, o); o += a.length; });
    var geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(arr, 3));
    return geo;
  };

  /* obrysové čáry: hrany všech kvádrů v seznamu + případné další úsečky (pole x,y,z,x,y,z…) */
  function edges(list, extra) {
    var n = 0, i, k;
    list.forEach(function (g) { if (g.userData.edges) n += g.userData.edges.length; });
    (extra || []).forEach(function (a) { n += a.length; });
    var arr = new Float32Array(n), o = 0;
    list.forEach(function (g) { var e = g.userData.edges; if (e) { for (k = 0; k < e.length; k++) arr[o++] = e[k]; } });
    (extra || []).forEach(function (a) { for (i = 0; i < a.length; i++) arr[o++] = a[i]; });
    var geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(arr, 3));
    return geo;
  }
  function strip(g) { // jednotné atributy pro mergeGeometries
    var n = g.index ? g.toNonIndexed() : g;
    Object.keys(n.attributes).forEach(function (k) { if (k !== 'position' && k !== 'normal') n.deleteAttribute(k); });
    return n;
  }
  function merge(list) { return T.mergeGeometries(list.map(strip), false); }

  /* Shadery předem: kde prohlížeč umí paralelní překlad, běží mimo hlavní vlákno;
     jinak aspoň v samostatném kroku před prvním snímkem. Pak teprve done(). */
  function prepare(renderer, scene, camera, done) {
    var fired = false;
    function fin() { if (!fired) { fired = true; done(); } }
    try {
      if (renderer.compileAsync && renderer.extensions.has('KHR_parallel_shader_compile')) { renderer.compileAsync(scene, camera).then(fin, fin); return; }
      renderer.compile(scene, camera);
    } catch (e) { /* první snímek si shadery přeloží sám */ }
    setTimeout(fin, 0);
  }

  /* GoldGL.noGL = true, když se WebGL nepodařilo založit (další scény to už nezkoušejí) */
  window.GoldGL = {
    shared: shared, materials: materials, Set: Set,
    beamBetween: beamBetween, boxAt: boxAt, merge: merge, strip: strip, edges: edges, prepare: prepare, BoxSet: BoxSet
  };
})();
