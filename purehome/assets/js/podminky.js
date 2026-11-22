/* PURE HOME v2 · obchodní podmínky vykreslené z data.js */
(function (W, D) {
  'use strict';
  var P = W.PH, C = W.PHC, $ = C.$, esc = C.esc, kc = C.kc;
  var v = P.vop, PR = P.pricing, c = P.contact;
  C.header({ base: 'index.html' });
  C.contacts();
  function prices() {
    var f = PR.frequencies, gen = PR.levels[0].general;
    return [
      'Pravidelný úklid: ' + kc(f[0].rate) + '/h při úklidu 1× týdně, ' + kc(f[1].rate) + '/h při úklidu 1× za 14 dní.',
      'Jednorázový úklid: ' + kc(f[2].rate) + '/h.',
      'Generální úklid: od ' + kc(gen) + '/h podle míry znečištění.',
      'Při zvýšeném a silném znečištění platí sazby podle aktuálního ceníku.'
    ];
  }
  function item(it) {
    if (typeof it === 'object' && it.list) return '<ul class="vop-list">' + it.list.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    if (it === '@prices') return '<ul class="vop-list">' + prices().map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    return '<p>' + esc(it) + '</p>';
  }
  function sample(k) { return c.sample && c.sample[k] ? '<span class="sample">ukázka</span>' : ''; }
  var rows = [['Poskytovatel', esc(v.provider.name + (v.provider.owner ? ', ' + v.provider.owner : ''))], ['IČO', esc(c.ico) + sample('ico')],
    ['Telefon', '<a href="tel:' + c.phone.replace(/\s/g, '') + '" data-c="phone">' + esc(c.phone) + '</a>' + sample('phone')],
    ['E-mail', '<a href="mailto:' + c.email + '" data-c="email">' + esc(c.email) + '</a>' + sample('email')]];
  if (v.provider.seat) rows.splice(2, 0, ['Sídlo', esc(v.provider.seat)]);
  $('[data-render="terms"]').innerHTML =
    '<header class="terms__head"><p class="label">PURE HOME Ostrava</p><h1 class="h2" data-split>' + esc(v.title) + '</h1>' +
    '<p class="lead">Platí pro objednávky úklidových služeb. To nejdůležitější najdete ve zkratce na <a href="index.html#pravidla">hlavní stránce</a>.</p></header>' +
    '<div class="terms__grid"><nav class="toc" aria-label="Obsah"><ol>' + v.sections.map(function (s, i) { return '<li><a href="#cl-' + (i + 1) + '"><span>' + (i + 1) + '.</span>' + esc(s.title) + '</a></li>'; }).join('') + '</ol></nav>' +
    '<div class="terms__body"><dl class="clist provider">' + rows.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + r[1] + '</dd></div>'; }).join('') + '</dl>' +
    v.sections.map(function (s, i) { return '<section class="vop-sec" id="cl-' + (i + 1) + '"><h2><span>' + (i + 1) + '.</span>' + esc(s.title) + '</h2>' + s.items.map(item).join('') + '</section>'; }).join('') +
    (v.validFrom ? '<p class="lead">Platnost od ' + esc(v.validFrom) + '.</p>' : '') +
    '<p class="terms__back"><a class="btn btn--ghost" href="index.html">Zpět na hlavní stránku</a></p></div></div>';
  $('[data-render="footer"]').innerHTML = '<div class="wrap"><img class="ftr__logo" src="assets/img/logo-inline.svg" alt="PURE HOME Ostrava" width="880" height="117" loading="lazy">' +
    '<div class="ftr__grid"><div><h3>PURE HOME Ostrava</h3><p class="muted">' + esc(P.brand.claim) + '. ' + esc(c.area) + '.</p></div>' +
    '<div><h3>Stránky</h3>' + P.nav.map(function (n) { return '<a href="index.html#' + n.id + '">' + esc(n.label) + '</a>'; }).join('<br>') + '</div>' +
    '<div><h3>Kontakt</h3><a href="tel:' + c.phone.replace(/\s/g, '') + '" data-c="phone">' + esc(c.phone) + '</a><br><a href="mailto:' + c.email + '" data-c="email">' + esc(c.email) + '</a><p class="muted">IČO ' + esc(c.ico) + '</p></div></div>' +
    '<p class="ftr__note">' + esc(P.concept.footer) + '</p></div>';
  $('[data-render="badge"]').textContent = P.concept.badge;
  C.reveal(D);
  if ('IntersectionObserver' in W) {
    var links = C.$$('.toc a');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id); }); });
    }, { rootMargin: '-30% 0px -60% 0px' });
    C.$$('.vop-sec').forEach(function (s) { io.observe(s); });
  }
})(window, document);
