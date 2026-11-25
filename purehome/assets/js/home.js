/* PURE HOME v8 · obsahové sekce: Ivana, služby, rozsah s přepínačem, vybavení, pravidla, kontakt, patička.
   v8: Ivanina fotka a skutečný podpis, skutečné kontakty a pracovní doba, nové storno podle obchodních podmínek. */
(function (W, D) {
  'use strict';
  var C = W.PHC, P = W.PH, $ = C.$, esc = C.esc, kc = C.kc;
  var PR = P.pricing, CT = P.contact;
  var byId = {}; P.products.forEach(function (p) { byId[p.id] = p; });
  function r(name) { return $('[data-render="' + name + '"]'); }
  function h2(id, text, cls) { return '<h2 class="h2 ' + (cls || '') + '" id="' + id + '" data-split>' + esc(text) + '</h2>'; }
  function num(v, unit) { return '<span class="num">' + esc(v) + (unit ? '<sub>' + esc(unit) + '</sub>' : '') + '</span>'; }
  var CK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  var tel = C.tel, EXT = ' target="_blank" rel="noopener"';

  C.header();

  /* ================= IVANA ================= */
  (function () {
    var I = P.iva, ph = I.photo, sg = I.sig;
    r('iva').innerHTML = '<div class="wrap"><div class="iva__grid">' +
      '<div class="iva__head"><p class="label" data-rv>Kdo k vám přijde</p><h2 class="iva__name" id="iva-t" data-rv>' + esc(I.name) + '</h2><p class="iva__role" data-rv>' + esc(I.role) + '</p></div>' +
      '<figure class="iva__photo" data-rv><img src="' + ph.src + '" srcset="' + ph.srcset + '" sizes="(max-width: 820px) 92vw, 40vw" width="' + ph.w + '" height="' + ph.h + '" alt="' + esc(ph.alt) + '" loading="lazy" decoding="async"></figure>' +
      '<div class="iva__body"><div class="iva__letter" data-rv>' + I.letter.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>' +
      '<div class="sig" data-rv><img src="' + sg.src + '" width="' + sg.w + '" height="' + sg.h + '" alt="' + esc(sg.alt) + '" loading="lazy" decoding="async"></div>' +
      '<dl class="iva__facts" data-rv>' + I.facts.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl>' +
      '<p class="iva__team" data-rv>' + esc(I.team) + '</p></div></div></div>';
    /* fotka se stáhne a dekóduje s předstihem, aby se opona neotevřela nad prázdným místem */
    var im = $('.iva__photo img');
    if ('IntersectionObserver' in W) {
      var pre = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { pre.disconnect(); im.loading = 'eager'; if (im.decode) im.decode().catch(function () {}); } }, { rootMargin: '200% 0px 200% 0px' });
      pre.observe(im);
    }
  })();


  /* ================= VYBAVENÍ ================= */
  (function () {
    var G = P.gear, host = r('gear'); if (!host) return;
    /* kotva popisku [x, y, strana] v souřadnicích fotky: popisek roste od kotvy doleva (l) nebo doprava (r) */
    var LBL = { eta: [[200, 1060, 'r'], [720, 1330, 'r'], [800, 333, 'l'], [840, 70, 'l']], karcher: [[60, 380, 'r'], [60, 230, 'r'], [905, 330, 'r']] };
    function card(g, i) {
      var pr = byId[g.id], W0 = pr.w, H0 = pr.h, lab = LBL[g.id] || [];
      var lines = g.points.map(function (pt, k) {
        var L = lab[k] || [pt[0], pt[1], 'r'];
        return '<line x1="' + pt[0] + '" y1="' + pt[1] + '" x2="' + L[0] + '" y2="' + L[1] + '" pathLength="1" style="--k:' + k + '"/>';
      }).join('');
      var pts = g.points.map(function (pt, k) {
        var L = lab[k] || [pt[0], pt[1], 'r'];
        return '<span class="gc__dot" style="left:' + (pt[0] / W0 * 100).toFixed(2) + '%;top:' + (pt[1] / H0 * 100).toFixed(2) + '%;--k:' + k + '"><b>' + (k + 1) + '</b></span>' +
          '<span class="gc__lab gc__lab--' + L[2] + '" style="left:' + (L[0] / W0 * 100).toFixed(2) + '%;top:' + (L[1] / H0 * 100).toFixed(2) + '%;--k:' + k + '">' + esc(pt[2]) + '</span>';
      }).join('');
      var stats = g.stats.map(function (st) {
        var isNum = /^[0-9]+(,[0-9]+)?$/.test(st[0]);
        return '<div><dt><span class="num"' + (isNum ? ' data-count="' + st[0] + '"' : '') + '>' + esc(st[0]) + (st[1] ? '<sub>' + esc(st[1]) + '</sub>' : '') + '</span></dt><dd>' + esc(st[2]) + '</dd></div>';
      }).join('');
      return '<article class="gc gc--' + g.id + '">' +
        '<div class="gc__stage"><div class="gc__frame" style="aspect-ratio:' + W0 + ' / ' + H0 + '">' +
        '<img class="gc__img" src="' + pr.img + '" width="' + W0 + '" height="' + H0 + '" alt="' + esc(g.name) + '" loading="lazy" decoding="async">' +
        '<span class="gc__sheen" aria-hidden="true"' + '><i></i></span>' +
        '<svg class="gc__lines" viewBox="0 0 ' + W0 + ' ' + H0 + '" preserveAspectRatio="none" aria-hidden="true">' + lines + '</svg>' + pts + '</div></div>' +
        '<div class="gc__body"><p class="label">' + esc(g.kind) + '</p><h3 class="gc__name">' + esc(g.name) + '</h3><p class="gc__text">' + esc(g.text) + '</p>' +
        '<ol class="gc__legend">' + g.points.map(function (pt, k) { return '<li><b>' + (k + 1) + '</b>' + esc(pt[2]) + '</li>'; }).join('') + '</ol>' +
        '<dl class="gc__stats">' + stats + '</dl></div></article>';
    }
    host.innerHTML = '<div class="wrap"><div class="gear__head"><p class="label" data-rv>' + esc(G.label) + '</p>' + h2('vybaveni-t', G.title) + '<p class="lead" data-rv>' + esc(G.lead) + '</p></div>' +
      '<div class="gear__list">' + G.items.map(card).join('') + '</div>' +
      '<a class="link gear__more" href="#prostredky" data-rv>' + esc(G.more) + ' <i></i></a></div>';
    /* animace při příjezdu do záběru: fotka, odlesk, linky, popisky, počítadla */
    var cards = C.$$('.gc', host);
    function count(el) {
      var to = el.dataset.count, dec = to.indexOf(',') >= 0, v = parseFloat(to.replace(',', '.')), sub = el.querySelector('sub'), subH = sub ? sub.outerHTML : '';
      if (C.RM) return;
      var t0 = performance.now(), dur = 1400;
      (function step(now) {
        var k = C.eo(C.clamp((now - t0) / dur, 0, 1)), x = v * k;
        el.innerHTML = (dec ? x.toFixed(1).replace('.', ',') : Math.round(x)) + subH;
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    }
    if (C.RM || !('IntersectionObserver' in W)) { cards.forEach(function (c) { c.classList.add('is-in'); }); return; }
    /* fotky se stáhnou a dekódují dřív, než karta přijede; pulzování bodů běží jen v obraze */
    var pre = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (!e.isIntersecting) return; pre.unobserve(e.target); var im = C.$('.gc__img', e.target); im.loading = 'eager'; if (im.decode) im.decode().catch(function () {}); });
    }, { rootMargin: '150% 0px 150% 0px' });
    var seen = new IntersectionObserver(function (en) { en.forEach(function (e) { e.target.classList.toggle('is-vis', e.isIntersecting); }); });
    cards.forEach(function (c) { pre.observe(c); seen.observe(c); });
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in'); io.unobserve(e.target);
        C.$$('[data-count]', e.target).forEach(function (n) { setTimeout(function () { count(n); }, 500); });
      });
    }, { rootMargin: '0px 0px -22% 0px' });
    cards.forEach(function (c) { io.observe(c); });
  })();

  /* ================= SLUŽBY ================= */
  (function () {
    var S = P.services;
    function item(x) {
      return '<article class="svc__item" data-rv><h3 class="svc__name">' + esc(x.name) + '</h3>' +
        '<p class="svc__from"><small>od</small>' + num(C.fmt(x.from)) + '<small>Kč<br>za hodinu</small></p>' +
        '<p class="svc__text">' + esc(x.text) + '</p>' +
        '<dl class="svc__rates">' + x.rates.map(function (rt) { return '<div><dt>' + esc(rt[0]) + '</dt><dd>' + kc(rt[1]) + '/h</dd></div>'; }).join('') + '</dl>' +
        (x.note ? '<p class="svc__small">' + esc(x.note) + '</p>' : '') + '</article>';
    }
    r('services').innerHTML = '<div class="wrap">' + h2('sluzby-t', S.title) +
      '<div class="svc">' + item(S.regular) + item(S.general) + '</div>' +
      '<p class="svc__note" data-rv>' + esc(S.note) + '</p>' +
      '<div class="services__more" data-rv><a class="link" href="#rozsah">Co přesně uděláme <i></i></a><a class="link" href="#cenik">Celý ceník <i></i></a><a class="link" href="#poptavka">Poptat úklid <i></i></a></div></div>';
  })();

  /* ================= ROZSAH: přepínač běžný / generální (řádky se nikam nepřesouvají) ================= */
  (function () {
    var S = P.scope;
    function addonPrice(a) {
      if (a.unit === 'fixed') return kc(a.price);
      if (a.unit === 'from') return 'od ' + kc(a.price);
      if (a.unit === 'hour') return kc(a.price) + '/h';
      return 'cena individuálně';
    }
    var DASH = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="ck-no" d="M7 12h10" fill="none" stroke="currentColor" stroke-width="1.4"/><path class="ck-yes" d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
    r('scope').innerHTML = '<div class="wrap"><div class="scope__head">' + h2('rozsah-t', S.title) + '<p class="lead" data-rv>' + esc(S.lead) + '</p></div>' +
      '<div class="scope__bar" data-rv><div class="seg" role="group" aria-label="Druh úklidu" data-v="regular"><span class="seg__pill" aria-hidden="true"></span><button type="button" data-v="regular" aria-pressed="true">Běžný úklid</button><button type="button" data-v="general" aria-pressed="false">Generální úklid</button></div>' +
      '<p class="scope__now" aria-live="polite"><span class="num" data-n>' + S.base.length + '</span><span data-t>' + esc(S.regularNote) + '</span></p></div>' +
      '<div class="scope__cols" data-v="regular">' +
      '<div class="scope__col"><h3 class="scope__h">Základ každého úklidu</h3><ul class="tasks">' + S.base.map(function (t) { return '<li>' + CK + '<span>' + esc(t) + '</span></li>'; }).join('') + '</ul></div>' +
      '<div class="scope__col scope__col--x"><h3 class="scope__h">Navíc u generálního úklidu</h3><ul class="tasks tasks--x">' + S.general.map(function (t, i) { return '<li style="--k:' + i + '">' + DASH + '<span>' + esc(t) + '</span></li>'; }).join('') + '</ul>' +
      '<p class="scope__hint">Tyto úkony běžný úklid neobsahuje. <button type="button" data-show-general>Zobrazit generální úklid</button></p></div></div>' +
      '<div class="scope__more"><div data-rv><h3 class="h3">Na přání, k hlavnímu úklidu</h3><dl class="plist">' +
      PR.addons.map(function (a) { return '<div><dt>' + esc(a.label) + (a.note ? '<small>' + esc(a.note) + '</small>' : '') + '</dt><dd>' + addonPrice(a) + '</dd></div>'; }).join('') +
      '<div class="is-no"><dt>' + esc(PR.addonsNo) + '</dt><dd>neděláme</dd></div></dl></div>' +
      '<div data-rv style="--d:120ms"><h3 class="h3">Do úklidu nepatří</h3><ul class="xlist">' + S.excluded.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      '<p class="refuse"><strong>Tohle nebereme.</strong> ' + esc(S.refuse) + '</p></div></div></div>';
    var root = r('scope'), seg = $('.seg', root), cols = $('.scope__cols', root), n = $('[data-n]', root), t = $('[data-t]', root);
    var cur = S.base.length;
    function set(v) {
      seg.dataset.v = v; cols.dataset.v = v;
      C.$$('button', seg).forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.v === v)); });
      t.textContent = v === 'general' ? S.generalNote : S.regularNote;
      var to = v === 'general' ? S.base.length + S.general.length : S.base.length;
      countTo(n, cur, to); cur = to;
    }
    seg.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) set(b.dataset.v); });
    root.addEventListener('click', function (e) { if (e.target.closest('[data-show-general]')) set('general'); });
    function countTo(el, from, to) {
      if (C.RM) { el.textContent = to; return; }
      var t0 = performance.now(), dur = 600;
      (function step(now) { var k = C.eo(C.clamp((now - t0) / dur, 0, 1)); el.textContent = Math.round(C.lerp(from, to, k)); if (k < 1) requestAnimationFrame(step); })(t0);
    }
  })();

  /* ================= PRAVIDLA ================= */
  (function () {
    var R = P.rules, X = R.cancel;
    r('rules').innerHTML = '<div class="wrap">' + h2('pravidla-t', R.title) +
      '<div class="rules__grid"><div data-rv><h3 class="h3">' + esc(X.title) + '</h3>' +
      '<div class="storno__bar" role="img" aria-label="Zrušení termínu: ' + esc(X.free[1]) + ' zdarma, ' + esc(X.late[1]) + ' se domluví náhradní termín">' +
      '<div><b>' + esc(X.free[0]) + '</b><span>' + esc(X.free[1]) + '</span></div><div><b>' + esc(X.late[0]) + '</b><span>' + esc(X.late[1]) + '</span></div></div>' +
      '<div class="storno__axis" aria-hidden="true">' + X.axis.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' +
      '<p class="storno__more">' + esc(X.more) + '</p></div>' +
      '<div class="rules__list" data-rv style="--d:120ms">' + R.items.map(function (it) { return '<div><h3>' + esc(it.title) + '</h3><p>' + esc(it.text) + '</p></div>'; }).join('') +
      '<p class="rules__links"><a class="link" href="podminky.html">Obchodní podmínky <i></i></a><a class="link" href="podminky.html#odstoupeni">Odstoupení od smlouvy <i></i></a><a class="link" href="osobni-udaje.html">Osobní údaje <i></i></a></p></div></div></div>';
  })();

  /* ================= KONTAKT ================= */
  (function () {
    function row(dt, dd) { return '<div><dt>' + esc(dt) + '</dt><dd>' + dd + '</dd></div>'; }
    r('contact').innerHTML = '<div class="wrap"><div class="contact__grid"><div>' + h2('kontakt-t', 'Napište Ivaně. Ozve se s cenou.') +
      '<p class="lead contact__lead" data-rv>Stačí 5 až 8 fotek nebo krátké video kuchyně, koupelny, toalety a podlahy. Podle nich se domluvíte na rozsahu, termínu a ceně.</p>' +
      '<div class="contact__cta" data-rv><a class="btn" href="#poptavka">Sestavit poptávku</a><a class="btn btn--ghost" href="' + tel(CT.phone) + '">Zavolat</a><a class="btn btn--ghost" href="' + C.wa() + '"' + EXT + '>WhatsApp</a><a class="btn btn--ghost" href="mailto:' + CT.email + '">Napsat e-mail</a></div></div>' +
      '<dl class="clist" data-rv style="--d:120ms">' +
      row('Telefon', '<a href="' + tel(CT.phone) + '">' + esc(CT.phone) + '</a><small>volejte, nebo pište na WhatsApp</small>') +
      row('E-mail', '<a href="mailto:' + CT.email + '">' + C.mail(CT.email) + '</a>') +
      row('Instagram', '<a href="' + C.ig() + '"' + EXT + '>@' + esc(CT.instagram) + '</a>') +
      row('Facebook', C.fb()) +
      row('Pracovní doba', '<ul class="hours">' + CT.hours.map(function (h) { return '<li><span>' + esc(h[0]) + '</span><span>' + esc(h[1]) + '</span></li>'; }).join('') + '</ul>') +
      row('Kde uklízí', esc(CT.area)) + '</dl></div></div>';
  })();

  /* ================= PATIČKA, LIŠTA, ŠTÍTEK ================= */
  C.footer();
  r('badge').textContent = P.concept.badge;

  var bar = r('mbar');
  bar.innerHTML = '<a class="btn" href="#poptavka">Poptat úklid</a><a class="btn btn--ghost" href="' + tel(CT.phone) + '">Zavolat</a>';
  bar.hidden = false;
  (function () {
    var day = $('.day'), order = r('order'), dayEnd = 0, oTop = 0, oBot = 0, on = null;
    C.Scroll.watch({
      measure: function (y) {
        dayEnd = day ? day.getBoundingClientRect().top + y + day.offsetHeight : 0;
        var o = order.getBoundingClientRect(); oTop = o.top + y; oBot = o.bottom + y;
      },
      fn: function (y, vh) {
        var after = day ? y > dayEnd - vh * .9 : y > vh, inOrder = oTop - y < vh * .7 && oBot - y > vh * .3, v = after && !inOrder;
        if (v !== on) { on = v; bar.classList.toggle('is-on', v); }
      }
    });
  })();

  C.reveal(D);
  C.Scroll.measure();
})(window, document);
