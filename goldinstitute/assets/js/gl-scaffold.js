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
  function beamBetween(A, B, w, h) {
    var a = new T.Vector3(A[0], A[1], A[2]), b = new T.Vector3(B[0], B[1], B[2]);
    var len = a.distanceTo(b);
    var g = new T.BoxGeometry(w, len, h);
    var q = new T.Quaternion().setFromUnitVectors(UP, b.clone().sub(a).normalize());
    var m = new T.Matrix4().compose(a.clone().add(b).multiplyScalar(0.5), q, new T.Vector3(1, 1, 1));
    g.applyMatrix4(m);
    return g;
  }
  function boxAt(cx, cy, cz, sx, sy, sz) {
    var g = new T.BoxGeometry(sx, sy, sz); g.translate(cx, cy, cz); return g;
  }
  function strip(g) { // jednotné atributy pro mergeGeometries
    var n = g.index ? g.toNonIndexed() : g;
    Object.keys(n.attributes).forEach(function (k) { if (k !== 'position' && k !== 'normal') n.deleteAttribute(k); });
    return n;
  }
  function merge(list) { return T.mergeGeometries(list.map(strip), false); }

  window.GoldGL = {
    shared: shared, materials: materials, Set: Set,
    beamBetween: beamBetween, boxAt: boxAt, merge: merge, strip: strip
  };
})();
