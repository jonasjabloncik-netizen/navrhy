/*
  GOLD Institute · generátory lešení pro 3D scény (poptávka, festivalová stage)
  Každý díl má klíč a pořadí stavby (o = 0–1). Scéna z pořadí udělá časy animace,
  poptávka podle klíčů pozná, které díly přibyly, a postaví jen ty.
*/
(function () {
  'use strict';
  var GL = window.GoldGL;

  function Kit() { this.p = []; this.ctx = []; this.dark = []; }
  Kit.prototype.tube = function (k, A, B, o, tag, r) { this.p.push({ k: k, t: 0, A: A, B: B, o: o, tag: tag, r: r }); };
  Kit.prototype.node = function (k, P, o) { this.p.push({ k: k, t: 1, P: P, o: o }); };
  Kit.prototype.plank = function (k, C, S, o, drop, tag) { this.p.push({ k: k, t: 2, C: C, S: S, o: o, drop: drop, tag: tag }); };
  Kit.prototype.beam = function (k, C, S, o, slide) { this.p.push({ k: k, t: 3, C: C, S: S, o: o, slide: slide }); };
  Kit.prototype.box = function (cx, cy, cz, sx, sy, sz, dark) { (dark ? this.dark : this.ctx).push(GL.boxAt(cx, cy, cz, sx, sy, sz)); };
  /* tf(díl) → čas začátku; d = násobek délky animace dílu */
  Kit.prototype.toSet = function (tf, d) {
    var S = new GL.Set(); d = d || 1;
    this.p.forEach(function (q) {
      var t0 = tf(q);
      if (q.t === 0) S.tube(q.A, q.B, t0, 0.24 * d, q.tag, q.r);
      else if (q.t === 1) S.node(q.P, t0);
      else if (q.t === 2) S.plank(q.C, q.S, t0, 0.32 * d, q.drop, q.tag || 'podlahy');
      else S.beam(q.C, q.S, t0, 0.42 * d, q.slide);
    });
    return S;
  };

  function n(len, maxN, pref) { var c = Math.max(1, Math.round(len / pref)); return c > maxN ? maxN : c; }
  function lin(a, b, c) { var r = []; for (var i = 0; i <= c; i++) r.push(a + (b - a) * i / c); return r; }

  /* Obecná mřížka lešení: stojky v bodech xs × zs, nl pater mezi y0 a y1 */
  function grid(K, pre, xs, zs, y0, y1, nl, o0, o1, opt) {
    opt = opt || {};
    var nx = xs.length - 1, nz = zs.length - 1, hy = (y1 - y0) / nl;
    for (var j = 1; j <= nl; j++) {
      var ya = y0 + (j - 1) * hy, yb = y0 + j * hy;
      for (var i = 0; i <= nx; i++) {
        var oi = o0 + (o1 - o0) * (((j - 1) / nl) * 0.86 + (nx ? i / nx : 0) * 0.14);
        for (var k = 0; k <= nz; k++) {
          var x = xs[i], z = zs[k], key = pre + i + '_' + k + '_' + j;
          var per = i === 0 || i === nx || k === 0 || k === nz;
          K.tube('s' + key, [x, ya, z], [x, yb, z], oi + k * 0.002, 'stojky');
          if (j === 1 && opt.base) K.plank('b' + key, [x, y0 + 0.04, z], [0.3, 0.08, 0.3], oi, 0.4, '-');
          if (opt.nodes !== false && (per || opt.nodesAll)) K.node('n' + key, [x, yb - 0.42, z], oi + 0.03);
          if (i < nx && opt.lx !== false) K.tube('lx' + key, [x, yb - 0.05, z], [xs[i + 1], yb - 0.05, z], oi + 0.012, 'podelniky', 0.07);
          if (k < nz && opt.lz !== false) K.tube('lz' + key, [x, yb - 0.05, z], [x, yb - 0.05, zs[k + 1]], oi + 0.016, 'podelniky', 0.07);
          if (i < nx && k < nz && (opt.deck === 'all' || (opt.deck === 'top' && j === nl))) {
            K.plank('p' + key, [(x + xs[i + 1]) / 2, yb + 0.03, (z + zs[k + 1]) / 2], [xs[i + 1] - x - 0.06, 0.06, zs[k + 1] - z - 0.06], oi + 0.03, 1.4);
          }
          if (opt.diag && i < nx && (k === 0 || k === nz) && (i % opt.diag === Math.floor(opt.diag / 2))) {
            var up = (j + i) % 2;
            K.tube('d' + key, [up ? x : xs[i + 1], ya, z], [up ? xs[i + 1] : x, yb, z], oi + 0.02, 'diagonaly', 0.06);
          }
          if (opt.diagZ && k < nz && (i === 0 || i === nx) && (k % opt.diagZ === 0)) {
            var up2 = (j + k) % 2;
            K.tube('dz' + key, [x, ya, up2 ? z : zs[k + 1]], [x, yb, up2 ? zs[k + 1] : z], oi + 0.02, 'diagonaly', 0.06);
          }
          if (opt.rails && k === 0 && i < nx) {
            K.tube('ra' + key, [x, yb + 0.55, z], [xs[i + 1], yb + 0.55, z], oi + 0.03, null, 0.05);
            K.tube('rb' + key, [x, yb + 1.0, z], [xs[i + 1], yb + 1.0, z], oi + 0.035, null, 0.05);
          }
        }
      }
    }
    if (opt.rails) for (var e = 0; e <= nx; e++) K.tube('se' + pre + e, [xs[e], y1, zs[0]], [xs[e], y1 + 1.05, zs[0]], o1, 'stojky');
  }

  function deck(K, L, H, ext) { // mostovka a pilíře (kontext)
    K.box(0, H + 0.8, 0, L + ext * 2, 1.6, 12);
    K.box(0, H + 1.75, -5.9, L + ext * 2, 0.3, 0.2); K.box(0, H + 1.75, 5.9, L + ext * 2, 0.3, 0.2);
    [-1, 1].forEach(function (s) { K.box(s * (L / 2 + ext - 2), H / 2, 0, 2.6, H, 7); });
  }

  var gen = {
    /* fasáda: budova a lešení před ní, zábradlí a podlahy v každém patře */
    fasada: function (K, L, H) {
      var nb = n(L, 30, 2.57), nl = n(H, 20, 2), BH = H + 3, BW = L + 3, BD = 12;
      K.box(0, BH / 2, BD / 2, BW, BH, BD);
      var fw = Math.max(1, Math.round(BW / 3.4)), fh = Math.max(1, Math.round(BH / 3.1));
      if (fw * fh <= 420) for (var a = 0; a < fw; a++) for (var b = 0; b < fh; b++) {
        K.box(-BW / 2 + (a + 0.5) * BW / fw, (b + 0.55) * BH / fh, -0.02, BW / fw * 0.46, BH / fh * 0.42, 0.06, true);
      }
      grid(K, 'f', lin(-L / 2, L / 2, nb), [-1.1, -0.35], 0, H, nl, 0, 1, { deck: 'all', diag: 5, rails: true, base: true });
      return { bbox: [-BW / 2, 0, -2.4, BW / 2, BH, BD], dimL: [[-L / 2, 0, -2.6], [L / 2, 0, -2.6]], dimH: [[L / 2 + 1.6, 0, -1.1], [L / 2 + 1.6, H, -1.1]] };
    },
    /* most: podpěrná konstrukce pod mostovkou, nahoře nosníky */
    most: function (K, L, H) {
      var nb = n(L, 26, 2.57), nl = n(H - 0.9, 18, 2), xs = lin(-L / 2, L / 2, nb);
      deck(K, L, H, 8);
      grid(K, 'm', xs, [-4.5, -1.5, 1.5, 4.5], 0, H - 0.9, nl, 0, 0.85, { diag: 4, diagZ: 2, base: true });
      xs.forEach(function (x, i) { K.beam('bm' + i, [x, H - 0.25, 0], [0.3, 0.42, 11], 0.86 + 0.12 * i / nb, -14); });
      return { bbox: [-L / 2 - 8, 0, -6, L / 2 + 8, H + 1.6, 6], dimL: [[-L / 2, 0, -6.6], [L / 2, 0, -6.6]], dimH: [[L / 2 + 3.2, 0, -6.2], [L / 2 + 3.2, H, -6.2]] };
    },
    /* zavěšené lešení: nosníky na míru pod mostovkou, závěsy a pracovní podlaha */
    zavesene: function (K, L, H) {
      var c = Math.min(60, Math.max(2, Math.round(L / 3.5))), st = L / c, x0 = -L / 2;
      var PY = H - 2.6, RY = PY + 1.05, PZ = 6.2;
      deck(K, L, H, 8);
      for (var i = 0; i <= c; i++) {
        var x = x0 + i * st, o = (i / c) * 0.88;
        K.beam('bm' + i, [x, H - 0.25, 0], [0.32, 0.45, 15.2], o, -15);
        [-5.6, -1.9, 1.9, 5.6].forEach(function (z, q) {
          K.tube('h' + i + '_' + q, [x, H - 0.45, z], [x, PY, z], o + 0.03, 'zavesy', 0.06);
          K.node('hn' + i + '_' + q, [x, PY + 0.05, z], o + 0.05);
        });
        K.tube('tr' + i, [x, PY, -PZ], [x, PY, PZ], o + 0.05, 'podelniky');
        K.tube('pa' + i, [x, PY, -PZ], [x, RY, -PZ], o + 0.06);
        K.tube('pb' + i, [x, PY, PZ], [x, RY, PZ], o + 0.06);
        if (i < c) {
          var xn = x + st;
          [-PZ, PZ].forEach(function (z, q) {
            K.tube('lo' + i + '_' + q, [x, PY + 0.02, z], [xn, PY + 0.02, z], o + 0.055, 'podelniky');
            K.tube('ro' + i + '_' + q, [x, RY, z], [xn, RY, z], o + 0.07, null, 0.05);
            K.tube('rm' + i + '_' + q, [x, (PY + RY) / 2, z], [xn, (PY + RY) / 2, z], o + 0.075, null, 0.05);
          });
          [-4.65, -1.55, 1.55, 4.65].forEach(function (z, q) { K.plank('p' + i + '_' + q, [x + st / 2, PY + 0.09, z], [st - 0.05, 0.08, 3.0], o + 0.065, 1.6); });
        }
      }
      return { water: true, bbox: [x0 - 8, 0, -6.5, -x0 + 8, H + 1.6, 6.5], dimL: [[x0, PY - 0.7, -PZ - 0.8], [-x0, PY - 0.7, -PZ - 0.8]], dimH: [[-x0 + 3.2, 0, -6.6], [-x0 + 3.2, H, -6.6]] };
    },
    /* podpěry pod strop: hustá síť stojek, nahoře hlavice */
    podpery: function (K, L, H) {
      var Wd = Math.min(Math.max(L * 0.5, 6), 30), nx = n(L, 18, 1.5), nz = n(Wd, 9, 1.5), nl = n(H - 0.4, 12, 2);
      var xs = lin(-L / 2, L / 2, nx), zs = lin(-Wd / 2, Wd / 2, nz);
      K.box(0, H + 0.18, 0, L + 2, 0.36, Wd + 2);
      grid(K, 'p', xs, zs, 0, H - 0.4, nl, 0, 0.88, { diag: 3, diagZ: 3, base: true });
      xs.forEach(function (x, i) { zs.forEach(function (z, k) { K.plank('hd' + i + '_' + k, [x, H - 0.2, z], [0.34, 0.14, 0.34], 0.9 + 0.08 * i / nx, 0.6, '-'); K.tube('hs' + i + '_' + k, [x, H - 0.4, z], [x, H - 0.24, z], 0.9 + 0.08 * i / nx, null, 0.06); }); });
      return { bbox: [-L / 2 - 1, 0, -Wd / 2 - 1, L / 2 + 1, H + 0.36, Wd / 2 + 1], dimL: [[-L / 2, 0, -Wd / 2 - 1.6], [L / 2, 0, -Wd / 2 - 1.6]], dimH: [[L / 2 + 1.6, 0, -Wd / 2], [L / 2 + 1.6, H, -Wd / 2]] };
    },
    /* stage: podlaha pódia, věže, zadní stěna, střecha a PA křídla */
    event: function (K, L, H, opt) {
      opt = opt || {};
      var D = opt.depth || Math.min(Math.max(L * 0.6, 8), 18), DH = Math.min(1.6, H * 0.3);
      var nx = n(L, 16, 2), nz = n(D, 9, 2), x0 = -L / 2, z0 = -D / 2, xs = lin(x0, -x0, nx), zs = lin(z0, -z0, nz);
      var nlT = Math.max(1, n(H - DH, 12, 2));
      grid(K, 'dk', xs, zs, 0, DH, 1, 0, 0.26, { deck: 'all', base: true, nodes: false });
      var tx = L > 14 ? [x0 + 1, 0, -x0 - 1] : [x0 + 1, -x0 - 1], tz = [z0 + 1, -z0 - 1], ti = 0;
      tz.forEach(function (zc) { tx.forEach(function (xc) {
        grid(K, 'tw' + ti, [xc - 1, xc + 1], [zc - 1, zc + 1], DH, H, nlT, 0.26 + ti * 0.02, 0.6 + ti * 0.02, { diag: 1, diagZ: 1, nodesAll: true });
        ti++;
      }); });
      grid(K, 'bw', xs, [-z0], DH, H, nlT, 0.4, 0.66, { lz: false, diag: 3 });
      xs.forEach(function (x, i) { K.beam('rf' + i, [x, H + 0.3, 0], [0.42, 0.6, D + 2.4], 0.66 + 0.12 * i / nx, -(D + 10)); });
      [z0 - 1.2, 0, -z0 + 1.2].forEach(function (z, q) { K.tube('rl' + q, [x0 - 1, H + 0.68, z], [-x0 + 1, H + 0.68, z], 0.8 + q * 0.03, 'podelniky', 0.1); });
      if (opt.wings !== false) {
        [-1, 1].forEach(function (s, q) {
          var cx = s * (L / 2 + 2.8), wh = Math.max(DH + 2, H * 0.72), nlw = Math.max(1, n(wh, 10, 2));
          grid(K, 'pa' + q, [cx - 1.5, cx + 1.5], [z0 + 0.5, z0 + 3.5], 0, wh, nlw, 0.56 + q * 0.04, 0.84 + q * 0.04, { diag: 1, diagZ: 1, deck: 'top', nodesAll: true, base: true });
        });
      }
      var wx = opt.wings !== false ? L / 2 + 4.4 : 0;
      return { deckH: DH, depth: D, bbox: [x0 - wx, 0, z0 - 1.2, -x0 + wx, H + 1, -z0 + 1.2], dimL: [[x0, 0, z0 - 1.6], [-x0, 0, z0 - 1.6]], dimH: [[-x0 + (wx ? 6 : 1.6), 0, z0], [-x0 + (wx ? 6 : 1.6), H, z0]] };
    },
    /* volně stojící lešení */
    jine: function (K, L, H) {
      var nb = n(L, 28, 2.57), nl = n(H, 20, 2);
      grid(K, 'j', lin(-L / 2, L / 2, nb), [-1.5, 0, 1.5], 0, H, nl, 0, 1, { deck: 'all', diag: 4, diagZ: 1, rails: true, base: true });
      return { bbox: [-L / 2 - 1, 0, -3, L / 2 + 1, H + 1, 3], dimL: [[-L / 2, 0, -2.6], [L / 2, 0, -2.6]], dimH: [[L / 2 + 1.6, 0, -1.5], [L / 2 + 1.6, H, -1.5]] };
    }
  };

  window.GoldKit = { Kit: Kit, gen: gen, grid: grid, lin: lin };
})();
