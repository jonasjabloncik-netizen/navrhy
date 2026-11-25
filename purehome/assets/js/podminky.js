/* PURE HOME v8 · právní stránky vykreslené z legal.js
   podminky.html: obchodní podmínky, poučení o odstoupení a vzorový formulář (na jedné stránce)
   osobni-udaje.html: informace o zpracování osobních údajů (samostatně) */
(function (W, D) {
  'use strict';
  var P = W.PH, L = W.PH_LEGAL, C = W.PHC, $ = C.$, esc = C.esc, kc = C.kc;
  var CT = P.contact, PR = P.pricing;
  C.header({ base: 'index.html' });
  C.footer('index.html');
  $('[data-render="badge"]').textContent = P.concept.badge;

  /* [text](adresa) → odkaz, vnější adresy do nového okna */
  function md(t) {
    return esc(t).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, txt, href) {
      return '<a href="' + href + '"' + (/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : '') + '>' + txt + '</a>';
    });
  }
  /* základní sazby v podmínkách se berou z ceníku, aby se nikdy nerozešly */
  function prices() {
    var l = PR.levels[0], f = PR.frequencies;
    return ['Pravidelný úklid ' + f[0].label + ': ' + kc(l.regular.weekly) + '/h', 'Pravidelný úklid ' + f[1].label + ': ' + kc(l.regular.biweekly) + '/h',
      'Jednorázový úklid: ' + kc(l.regular.once) + '/h', 'Generální úklid: ' + kc(l.general) + '/h'];
  }
  function item(it) {
    if (it === '@prices') return '<ul class="vop-list">' + prices().map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    if (typeof it === 'object' && it.list) return '<ul class="vop-list">' + it.list.map(function (x) { return '<li>' + md(x) + '</li>'; }).join('') + '</ul>';
    if (typeof it === 'object' && it.h) return '<h4 class="vop-h">' + esc(it.h) + '</h4>';
    if (typeof it === 'object' && it.draft) return '<p class="vop-draft">' + (it.label ? '<b>' + esc(it.label) + '</b> ' : '') + md(it.draft) + ' <span class="todo">' + esc(it.tag) + '</span></p>';
    return '<p>' + md(it) + '</p>';
  }
  /* hlavička dokumentu s údaji poskytovatelky, jako v Ivaniných podkladech */
  function who(label, opts) {
    opts = opts || {};
    var rows = [[label, esc(CT.owner) + ', IČO ' + esc(CT.ico)], ['Sídlo', esc(CT.seat)], ['E-mail', '<a href="mailto:' + CT.email + '">' + C.mail(CT.email) + '</a>'], ['Telefon', '<a href="' + C.tel(CT.phone) + '">' + esc(CT.phone) + '</a>']];
    return '<dl class="doc__who">' + rows.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + r[1] + '</dd></div>'; }).join('') + '</dl>' +
      (opts.vat ? '<p class="doc__vat">Nejsem plátcem DPH.</p>' : '');
  }
  function sec(s, i, numbered) {
    return '<section class="vop-sec" id="' + s.id + '"><h3 class="vop-sec__t">' + (numbered ? '<span>' + (i + 1) + '.</span>' : '') + esc(s.title) + '</h3>' + s.items.map(item).join('') + '</section>';
  }
  function toc(list, numbered) {
    return '<ol>' + list.map(function (s, i) { return '<li><a href="#' + s.id + '">' + (numbered ? '<span>' + (i + 1) + '.</span>' : '') + esc(s.title) + '</a></li>'; }).join('') + '</ol>';
  }
  function head(title, lead) {
    return '<header class="terms__head"><p class="label">PURE HOME Ostrava</p><h1 class="h2" data-split>' + esc(title) + '</h1><p class="lead">' + lead + '</p></header>';
  }
  var BACK = '<p class="terms__back"><a class="btn btn--ghost" href="index.html">Zpět na hlavní stránku</a></p>';

  /* ---------- obchodní podmínky + poučení + formulář ---------- */
  var termsHost = $('[data-render="terms"]');
  if (termsHost) {
    var T = L.terms, Wd = L.withdrawal, F = L.form;
    var formText = F.title + '\n\nAdresát: ' + CT.owner + '\n' + CT.seat + '\nE-mail: ' + CT.email + '\n\n' + F.statement + '\n\n' + F.fields.map(function (f) { return f + ': '; }).join('\n') + '\n';
    termsHost.innerHTML = head('Obchodní podmínky', 'Obchodní podmínky úklidových služeb, poučení o právu na odstoupení od smlouvy a vzorový formulář. Jak zpracovávám osobní údaje, najdete na <a href="osobni-udaje.html">samostatné stránce</a>.') +
      '<div class="terms__grid"><nav class="toc" aria-label="Obsah"><p class="toc__h">Obchodní podmínky</p>' + toc(T.sections, true) +
      '<p class="toc__h">Odstoupení od smlouvy</p><ol><li><a href="#odstoupeni">Poučení o právu na odstoupení</a></li><li><a href="#formular">Vzorový formulář</a></li></ol>' +
      '<p class="toc__h">Další</p><ol><li><a href="osobni-udaje.html">Zpracování osobních údajů</a></li></ol></nav>' +
      '<div class="terms__body">' +
      '<section class="doc" id="podminky"><h2 class="doc__t">' + esc(T.title) + '</h2>' + who('Poskytovatelka', { vat: true }) +
      T.sections.map(function (s, i) { return sec(s, i, true); }).join('') +
      '<p class="doc__valid"><b>Účinnost od:</b> ' + (T.validFrom ? esc(T.validFrom) : '<span class="todo">doplní se před spuštěním</span>') + '</p></section>' +
      '<section class="doc" id="odstoupeni"><h2 class="doc__t">' + esc(Wd.title) + '</h2>' + who('Poskytovatelka') + '<div class="doc__text">' + Wd.blocks.map(item).join('') + '</div></section>' +
      '<section class="doc" id="formular"><h2 class="doc__t">' + esc(F.title) + '</h2>' +
      '<div class="wform"><p class="wform__to"><b>Adresát:</b> ' + esc(CT.owner) + '<br>' + esc(CT.seat) + '<br>E-mail: ' + C.mail(CT.email) + '</p>' +
      '<p class="wform__st">' + esc(F.statement) + '</p>' +
      '<dl class="wform__fields">' + F.fields.map(function (f) { return '<div><dt>' + esc(f) + ':</dt><dd></dd></div>'; }).join('') + '</dl></div>' +
      '<div class="wform__act"><button type="button" class="btn" data-print>Vytisknout formulář</button><button type="button" class="btn btn--ghost" data-copyform>Zkopírovat text</button></div>' +
      '<p class="wform__hint">Formulář můžete vytisknout a poslat na adresu sídla, nebo zkopírovat jeho text do e-mailu na ' + C.mail(CT.email) + '. Použít ho není povinné.</p></section>' +
      BACK + '</div></div>';
    termsHost.addEventListener('click', function (e) {
      if (e.target.closest('[data-print]')) {
        D.documentElement.classList.add('print-form');
        W.addEventListener('afterprint', function off() { D.documentElement.classList.remove('print-form'); W.removeEventListener('afterprint', off); });
        W.print();
        return;
      }
      var cb = e.target.closest('[data-copyform]');
      if (cb) {
        var ok = function () { cb.textContent = '✓ Zkopírováno'; setTimeout(function () { cb.textContent = 'Zkopírovat text'; }, 2200); };
        var fallback = function () { var ta = D.createElement('textarea'); ta.value = formText; ta.style.position = 'fixed'; ta.style.opacity = '0'; D.body.appendChild(ta); ta.select(); try { D.execCommand('copy'); } catch (er) {} ta.remove(); ok(); };
        if (navigator.clipboard && W.isSecureContext) navigator.clipboard.writeText(formText).then(ok, fallback); else fallback();
      }
    });
  }

  /* ---------- osobní údaje ---------- */
  var privHost = $('[data-render="privacy"]');
  if (privHost) {
    var V = L.privacy;
    privHost.innerHTML = head(V.title, 'Jak zacházím s údaji, které mi pošlete v poptávce nebo při objednávce úklidu. Obchodní podmínky najdete na <a href="podminky.html">samostatné stránce</a>.') +
      '<div class="terms__grid"><nav class="toc" aria-label="Obsah"><p class="toc__h">Obsah</p>' + toc(V.sections, false) +
      '<p class="toc__h">Další</p><ol><li><a href="podminky.html">Obchodní podmínky</a></li><li><a href="podminky.html#odstoupeni">Odstoupení od smlouvy</a></li></ol></nav>' +
      '<div class="terms__body"><section class="doc">' + who('Správce osobních údajů') +
      V.sections.map(function (s, i) { return sec(s, i, false); }).join('') + '</section>' + BACK + '</div></div>';
  }

  C.reveal(D);
  /* aktivní položka v obsahu */
  if ('IntersectionObserver' in W) {
    var links = C.$$('.toc a[href^="#"]');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id); }); });
    }, { rootMargin: '-30% 0px -60% 0px' });
    C.$$('.vop-sec, .doc[id]').forEach(function (s) { if (s.id !== 'podminky') io.observe(s); });
  }
})(window, document);
