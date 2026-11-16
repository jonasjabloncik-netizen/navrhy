/* GOLD Institute · animace průchodu v tématu lešení:
   lešení s průběhem po straně, čísla kapitol z trubek, odkrývání fotek prkny, rámy z lešení */
(function () {
  'use strict';
  var doc = document, UI = window.GOLDUI || {}, reduce = !!UI.reduce;
  var observe = UI.observe || function (n, cb) { cb(n); };
  var SVGNS = 'http://www.w3.org/2000/svg';

  /* ---------- Čísla kapitol složená z trubek a uzlů ---------- */
  var SEG = { a: [8, 8, 56, 8], b: [56, 8, 56, 52], c: [56, 52, 56, 96], d: [8, 96, 56, 96], e: [8, 52, 8, 96], f: [8, 8, 8, 52], g: [8, 52, 56, 52] };
  var DIG = ['abcdef', 'bc', 'abged', 'abgcd', 'fgbc', 'afgcd', 'afgedc', 'abc', 'abcdefg', 'abfgcd'];
  function digit(ch, base) {
    var segs = DIG[+ch] || '', s = '', joints = {}, order = 'fecbagd';
    order.split('').forEach(function (k, i) {
      if (segs.indexOf(k) < 0) return;
      var q = SEG[k], v = q[0] === q[2];
      var d = base + i * 70;
      s += '<line class="sg ' + (v ? 'sg--v' : 'sg--h') + '" x1="' + q[0] + '" y1="' + q[1] + '" x2="' + q[2] + '" y2="' + q[3] + '" style="--d:' + d + 'ms"/>';
      joints[q[0] + ',' + q[1]] = Math.max(joints[q[0] + ',' + q[1]] || 0, d); joints[q[2] + ',' + q[3]] = Math.max(joints[q[2] + ',' + q[3]] || 0, d);
    });
    function has(x) { return x.split('').every(function (k) { return segs.indexOf(k) >= 0; }); }
    if (has('abfg')) s += '<line class="sd" x1="8" y1="52" x2="56" y2="8" style="--d:' + (base + 520) + 'ms"/>';
    if (has('cdeg')) s += '<line class="sd" x1="8" y1="96" x2="56" y2="52" style="--d:' + (base + 560) + 'ms"/>';
    Object.keys(joints).forEach(function (k) { var p = k.split(','); s += '<rect class="sn" x="' + (p[0] - 7) + '" y="' + (p[1] - 7) + '" width="14" height="14" style="--d:' + (joints[k] + 200) + 'ms"/>'; });
    return '<svg viewBox="0 0 64 104" aria-hidden="true">' + s + '</svg>';
  }
  Array.prototype.forEach.call(doc.querySelectorAll('.chead__no'), function (el) {
    var m = el.textContent.match(/^(\d+)\s*·\s*(.+)$/);
    if (!m) return;
    el.innerHTML = '<span class="sdig" aria-hidden="true">' + m[1].split('').map(function (c, i) { return digit(c, i * 260); }).join('') + '</span>' +
      '<span class="chead__lbl"><span class="sr-only">Kapitola ' + m[1] + ': </span>' + m[2] + '</span>';
    el.classList.add('has-dig');
    observe(el, function (n) { n.classList.add('is-in'); }, '0px 0px -8% 0px');
  });
  /* linka pod nadpisem kapitoly: podélník s uzly */
  Array.prototype.forEach.call(doc.querySelectorAll('.chead'), function (h) {
    var t = h.querySelector('.h1, .h2');
    if (t) { var r = doc.createElement('span'); r.className = 'rule'; r.setAttribute('aria-hidden', 'true'); r.innerHTML = '<i class="rule__l"></i><i class="rule__n"></i><i class="rule__n rule__n--r"></i>'; t.insertAdjacentElement('afterend', r); }
    observe(h, function (n) { n.classList.add('is-in'); }, '0px 0px -10% 0px');
  });

  /* ---------- Fotky a videa se odkryjí jako odebíraná prkna ---------- */
  Array.prototype.forEach.call(doc.querySelectorAll('.more__fig > img'), function (img) {
    var w = doc.createElement('span'); w.className = 'mbox'; img.parentNode.insertBefore(w, img); w.appendChild(img);
  });
  Array.prototype.forEach.call(doc.querySelectorAll('.mfig__box, .mbox'), function (box) {
    var sl = doc.createElement('span'); sl.className = 'slats'; sl.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < 5; i++) { var b = doc.createElement('i'); b.style.setProperty('--k', i); sl.appendChild(b); }
    box.appendChild(sl);
  });

  /* ---------- Vizitka v rámu z lešení ---------- */
  var vc = doc.querySelector('.vcard');
  if (vc && UI.FRAME) { vc.insertAdjacentHTML('beforeend', UI.FRAME); observe(vc, function (n) { n.classList.add('is-in'); }); }

  /* ---------- Lešení s průběhem prezentace (desktop) ---------- */
  var CH = [['mosty', 'Mosty'], ['kampus', 'Kampus'], ['festivaly', 'Festivaly'], ['zakazky', 'Zakázky'], ['mapa', 'Mapa'], ['poptavka', 'Poptávka'], ['kontakt', 'Kontakt']];
  var rail = doc.createElement('nav'); rail.className = 'rail'; rail.setAttribute('aria-label', 'Průchod prezentací');
  rail.innerHTML = '<span class="rail__tube" aria-hidden="true"><i class="rail__fill"></i></span><span class="rail__lift" aria-hidden="true"><i></i></span>' +
    CH.map(function (c, i) { return '<a class="rail__n" href="#' + c[0] + '" data-i="' + i + '"><i aria-hidden="true"></i><b>' + c[1] + '</b></a>'; }).join('');
  doc.body.appendChild(rail);
  var fill = rail.querySelector('.rail__fill'), lift = rail.querySelector('.rail__lift'), nodes = Array.prototype.slice.call(rail.querySelectorAll('.rail__n'));
  var pos = [], railH = 0, ticking = false;
  function measure() {
    var max = doc.documentElement.scrollHeight - window.innerHeight;
    pos = CH.map(function (c) { var e = doc.getElementById(c[0]); return e && max > 0 ? Math.min(1, Math.max(0, (e.getBoundingClientRect().top + window.scrollY) / max)) : 0; });
    railH = rail.querySelector('.rail__tube').offsetHeight;
    nodes.forEach(function (n, i) { n.style.transform = 'translateY(' + (pos[i] * railH).toFixed(1) + 'px)'; });
    update();
  }
  function update() {
    ticking = false;
    var max = doc.documentElement.scrollHeight - window.innerHeight, p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    fill.style.transform = 'scaleY(' + p.toFixed(4) + ')';
    lift.style.transform = 'translateY(' + (p * railH).toFixed(1) + 'px)';
    nodes.forEach(function (n, i) { var on = p >= pos[i] - 0.003; if (n._on !== on) { n._on = on; n.classList.toggle('is-past', on); } });
    rail.classList.toggle('is-on', window.scrollY > window.innerHeight * 0.4);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  setTimeout(measure, 600);
  measure();
})();
