/* GREY · návrh v4 · MALUS/01 · kategorie.js – kolekce, hledání a oblíbené: velká fotka, podkategorie jako fotky, filtry, řazení, hustota mřížky */
(function () {
  'use strict';
  const GX = window.GX;
  const { $, $$, esc, money, store, reduce, mob, NB, ty, plural } = GX.u;
  const qs = new URLSearchParams(location.search);
  const q = (qs.get('q') || '').trim();
  let k = qs.get('k') || (q ? '' : 'novinky');
  if (k && k !== 'oblibene' && !GX.cats[k]) k = 'novinky';
  const C = GX.cats[k];
  const parentKey = C && C.parent ? C.parent : (C && C.sub && C.sub.length ? k : null);
  GX.shell({ active: parentKey || k });
  const main = $('#main');

  let base; let title; let lead = '';
  let empty = '';
  if (q) { base = GX.search(q); title = `„${q}“`; lead = base.length ? 'Výsledky hledání' : ''; empty = 'Nic jsme nenašli. Zkuste jiné slovo, třeba „kabelka“ nebo „sako“.'; }
  else if (k === 'oblibene') { base = GX.fav.list().map(GX.p).filter(Boolean); title = 'oblíbené'; lead = base.length ? 'Uložené v tomto prohlížeči.' : ''; empty = 'Zatím tu nic není. Srdíčkem u produktu si ho uložíte.'; }
  else { base = GX.inCat(k); title = C.l.toLowerCase(); lead = k === 'novinky' ? `${GX.site.drop.text}.` : ''; }
  document.title = `${q ? 'Hledání ' + title : (k === 'oblibene' ? 'Oblíbené' : C.l)} · GREY — návrh nového e-shopu (MALUS/01)`;
  const listOrder = new Map(base.map((p, i) => [p.id, i]));

  /* ---------- fasety ---------- */
  const SIZE_ORDER = ['XXS', 'XS', 'S', 'S/M', 'M', 'M/L', 'L', 'L/XL', 'XL', 'XXL', 'XXXL', 'one size S/M', 'one size'];
  const sizeKey = (s) => { const i = SIZE_ORDER.indexOf(s); if (i > -1) return i; const m = /(\d+)/.exec(s); return m ? 100 + +m[1] : 999; };
  const FAM = { 'černá': '#1b1a19', 'bílá a krémová': '#f2efe8', 'béžová a camel': '#c9a985', 'hnědá': '#5b3b2c', 'šedá': '#a9a8a6', 'khaki a zelená': '#6b6a45', 'modrá': '#3b5a8a', 'červená a bordó': '#8e1f2c', 'růžová': '#e8b9c1', 'žlutá': '#c49a2c', 'zlatá': '#c8a65a', 'vzor': 'url(assets/img/sw-leopard.webp)' };
  const famOrder = Object.keys(FAM);
  const MAT = [
    ['kuze', 'Pravá kůže', (p) => /pravá kůže|(^|[\s,])kůže/.test(p.material.toLowerCase()) && !/koženk/.test(p.name.toLowerCase())],
    ['semis', 'Semiš', (p) => /semiš/.test(p.name.toLowerCase())],
    ['kozenka', 'Koženka', (p) => /koženk/.test(p.name.toLowerCase())],
    ['bavlna', 'Bavlna', (p) => /bavln|cotton/.test(p.material.toLowerCase())],
    ['denim', 'Denim', (p) => /denim|džín/.test(p.name.toLowerCase())],
    ['vlna', 'Vlna a kašmír', (p) => /vln|kašmír|cashmere/.test(p.material.toLowerCase())],
    ['saten', 'Satén', (p) => /satén/.test(p.name.toLowerCase())],
    ['len', 'Len', (p) => /(^|[\s,])len\b/.test(p.material.toLowerCase())]
  ];
  const typeOf = (p) => { const sub = p.cat.filter((c) => GX.cats[c] && GX.cats[c].parent); return sub.length ? sub : (p.voucher ? ['vouchery'] : []); };
  const famsOf = (p) => new Set(p.v.flatMap((v) => v.fam || []));
  const sizesOf = (p) => new Set(p.v.flatMap((v) => Object.keys(v.stock || {}).filter((s) => v.stock[s] === 'in')));
  const matsOf = (p) => new Set(MAT.filter((m) => m[2](p)).map((m) => m[0]));
  const meta = new Map(base.map((p) => [p.id, { type: typeOf(p), fam: famsOf(p), size: sizesOf(p), mat: matsOf(p), price: GX.minPrice(p), isNew: GX.isNew(p), sale: p.v.some((v) => v.std) }]));
  const pMin = base.length ? Math.floor(Math.min(...base.map((p) => meta.get(p.id).price)) / 10) * 10 : 0;
  const pMax = base.length ? Math.ceil(Math.max(...base.map((p) => meta.get(p.id).price)) / 10) * 10 : 0;
  const showType = !C || !parentKey; // novinky, christmas, bestsellery, hledání, oblíbené

  const csv = (x) => (x ? x.split(',').filter(Boolean) : []);
  const F = { t: csv(qs.get('t')), s: csv(qs.get('s')), c: csv(qs.get('c')), m: csv(qs.get('m')), p: qs.get('p') ? qs.get('p').split('-').map(Number) : null, n: qs.get('n') === '1', d: qs.get('d') === '1', o: qs.get('o') || 'rec' };
  let shown = 0; const PAGE = 24;
  let dens = store.get('gx2-dens', null);

  const match = (p, skip) => {
    const m = meta.get(p.id);
    if (skip !== 't' && F.t.length && !F.t.some((t) => m.type.includes(t))) return false;
    if (skip !== 's' && F.s.length && !F.s.some((s) => m.size.has(s))) return false;
    if (skip !== 'c' && F.c.length && !F.c.some((c) => m.fam.has(c))) return false;
    if (skip !== 'm' && F.m.length && !F.m.some((x) => m.mat.has(x))) return false;
    if (skip !== 'p' && F.p && (m.price < F.p[0] || m.price > F.p[1])) return false;
    if (skip !== 'n' && F.n && !m.isNew) return false;
    if (skip !== 'd' && F.d && !m.sale) return false;
    return true;
  };
  const sorted = (arr) => {
    const a = arr.slice();
    if (F.o === 'pa') a.sort((x, y) => meta.get(x.id).price - meta.get(y.id).price || listOrder.get(x.id) - listOrder.get(y.id));
    else if (F.o === 'pd') a.sort((x, y) => meta.get(y.id).price - meta.get(x.id).price || listOrder.get(x.id) - listOrder.get(y.id));
    else if (F.o === 'new') a.sort((x, y) => (meta.get(y.id).isNew - meta.get(x.id).isNew) || listOrder.get(x.id) - listOrder.get(y.id));
    return a;
  };
  const results = () => sorted(base.filter((p) => match(p)));
  const count = (key, val, test) => base.filter((p) => match(p, key) && test(meta.get(p.id), val)).length;
  const activeN = () => F.t.length + F.s.length + F.c.length + F.m.length + (F.p ? 1 : 0) + (F.n ? 1 : 0) + (F.d ? 1 : 0);
  const syncURL = () => {
    const u = new URLSearchParams();
    if (q) u.set('q', q); if (k) u.set('k', k);
    if (F.t.length) u.set('t', F.t.join(',')); if (F.s.length) u.set('s', F.s.join(',')); if (F.c.length) u.set('c', F.c.join(',')); if (F.m.length) u.set('m', F.m.join(','));
    if (F.p) u.set('p', F.p.join('-')); if (F.n) u.set('n', '1'); if (F.d) u.set('d', '1'); if (F.o !== 'rec') u.set('o', F.o);
    try { history.replaceState(null, '', `kategorie.html?${u.toString()}`); } catch (e) { /* file:// v některých prohlížečích */ }
  };
  // u karty ukaž barvu, která odpovídá filtru
  const prefVariant = (p) => {
    if (!F.c.length && !F.s.length) return null;
    const v = p.v.find((x) => (!F.c.length || (x.fam || []).some((f) => F.c.includes(f))) && (!F.s.length || F.s.some((s) => x.stock && x.stock[s] === 'in')));
    return v ? v.id : null;
  };

  /* ---------- hlavička kolekce ---------- */
  const crumbs = [`<a href="index.html">GREY</a>`];
  if (C && C.parent) crumbs.push(`<a href="${GX.catUrl(C.parent)}">${esc(GX.cats[C.parent].l)}</a>`);
  crumbs.push(`<span aria-current="page">${esc(q ? 'Hledání' : (k === 'oblibene' ? 'Oblíbené' : C.l))}</span>`);
  // titulní fotka kolekce: vybraná fotka z produktů GREY ve vysokém rozlišení (žádné staré bannery s textem)
  const cover = (() => {
    if (q || k === 'oblibene' || !C) return '';
    return `<div class="ch__media cur">${GX.catPic(k, { eager: true, alt: '' })}</div>`;
  })();
  // podkategorie jako fotky: u Oblečení a Doplňků odkazy, u Novinek, Christmas, hledání a oblíbených filtr podle typu
  const typePic = (t) => { const p = base.find((x) => meta.get(x.id).type.includes(t)); return p ? GX.pic(p, p.v[0], 0, { alt: '' }) : GX.catPic(t, { alt: '' }); };
  const tiles = (() => {
    if (parentKey && GX.cats[parentKey].sub && GX.cats[parentKey].sub.length) {
      const pk = parentKey; const subs = GX.cats[pk].sub.filter((x) => GX.cats[x].n);
      const one = (key, label, n, cur) => `<a class="ctl__i" href="${GX.catUrl(key)}"${cur ? ' aria-current="page"' : ''}><span class="ctl__m">${GX.catPic(key, { alt: '' })}</span><span class="ctl__l"><span>${esc(label)}</span><small class="num">${n}</small></span></a>`;
      return `<nav class="ctl" aria-label="Podkategorie">${one(pk, 'Vše', GX.cats[pk].n, k === pk)}${subs.map((x) => one(x, GX.cats[x].l, GX.cats[x].n, k === x)).join('')}</nav>`;
    }
    return '<nav class="ctl" aria-label="Typ" data-types></nav>';
  })();
  main.innerHTML = `
    <header class="ch${cover ? '' : ' ch--plain'}"><div class="wrap ch__in">
      <div class="ch__txt"><nav class="crumbs" aria-label="Drobečková navigace">${crumbs.join('<span aria-hidden="true">/</span>')}</nav>
        <h1 class="ch__title">${GX.lines([title])}</h1>
        <div class="ch__meta"><span data-total>${plural(base.length, 'model', 'modely', 'modelů')}</span>${lead ? `<span>${esc(ty(lead))}</span>` : ''}</div></div>
      ${cover}
    </div></header>
    ${q || k === 'oblibene' ? tiles.replace('class="ctl"', 'class="ctl ctl--sm"') : tiles}
    <div class="tb" id="tb"><div class="tb__in">
      <button class="tb__f" type="button" data-open-f>${GX.ICON.filter}<span>Filtrovat</span><b data-fn hidden></b></button>
      <div class="tb__quick" data-quick></div>
      <span class="tb__count num" data-count></span>
      <label class="tb__sort"><span class="sr">Řadit</span><select data-sort aria-label="Řadit"><option value="rec">Doporučené</option><option value="new">Nejnovější</option><option value="pa">Od nejlevnějšího</option><option value="pd">Od nejdražšího</option></select></label>
      <div class="tb__dens" role="group" aria-label="Velikost náhledů">
        <button class="d1" type="button" data-dens="1" aria-label="Jeden sloupec">${GX.ICON.g1}</button><button class="d2" type="button" data-dens="2" aria-label="Dva sloupce">${GX.ICON.g2}</button><button class="d3" type="button" data-dens="3" aria-label="Tři sloupce">${GX.ICON.g3}</button><button class="d4" type="button" data-dens="4" aria-label="Čtyři sloupce">${GX.ICON.g4}</button>
      </div>
    </div></div>
    <div class="act" data-act></div>
    <section class="cg"><div class="wrap"><div class="pg" id="grid" aria-live="polite"></div>
      <div class="more" data-more></div></div></section>`;
  $('[data-sort]').value = F.o;

  /* ---------- filtrační panel ---------- */
  document.body.insertAdjacentHTML('beforeend', `<aside class="panel fdr" id="fdr" role="dialog" aria-modal="true" aria-labelledby="fdr-t" aria-hidden="true">
      <div class="panel__hd"><h2 class="cap" id="fdr-t">Filtrovat</h2><button class="x" type="button" data-close aria-label="Zavřít filtry">${GX.ICON.close}</button></div>
      <div class="fdr__bd" id="fdr-bd"></div>
      <div class="fdr__ft"><button class="lnk" type="button" data-clear>Zrušit vše</button><button class="btn" type="button" data-close data-apply></button></div></aside>`);
  const fdr = $('#fdr');
  const allSizes = [...new Set(base.flatMap((p) => [...meta.get(p.id).size]))].sort((a, b) => sizeKey(a) - sizeKey(b));
  const allFams = famOrder.filter((f) => base.some((p) => meta.get(p.id).fam.has(f)));
  const allMats = MAT.filter((m) => base.some((p) => meta.get(p.id).mat.has(m[0])));
  const allTypes = showType ? Object.keys(GX.cats).filter((c) => GX.cats[c].parent || c === 'vouchery').filter((c) => base.some((p) => meta.get(p.id).type.includes(c))) : [];
  const hasNew = k !== 'novinky' && base.some((p) => meta.get(p.id).isNew);
  const hasSale = base.some((p) => meta.get(p.id).sale);
  const BINS = 14;
  const hist = (() => { const h = new Array(BINS).fill(0); const span = Math.max(1, pMax - pMin); base.forEach((p) => { const i = Math.min(BINS - 1, Math.floor(((meta.get(p.id).price - pMin) / span) * BINS)); h[i]++; }); return h; })();
  const renderPanel = () => {
    const pr = F.p || [pMin, pMax]; const hmax = Math.max(1, ...hist); const span = Math.max(1, pMax - pMin);
    $('#fdr-bd').innerHTML = `
      ${allTypes.length > 1 ? `<div class="fgrp"><h3 class="cap">Kategorie</h3><div class="chips">${allTypes.map((t) => { const n = count('t', t, (m, v) => m.type.includes(v)); return `<button class="chip" type="button" data-f="t" data-v="${t}" aria-pressed="${F.t.includes(t)}" ${n || F.t.includes(t) ? '' : 'disabled'}>${esc(GX.catName(t))}<span class="n">${n}</span></button>`; }).join('')}</div></div>` : ''}
      ${allSizes.length > 1 ? `<div class="fgrp"><h3 class="cap">Velikost <small>skladem</small></h3><div class="fsz">${allSizes.map((s) => { const n = count('s', s, (m, v) => m.size.has(v)); return `<button class="chip" type="button" data-f="s" data-v="${esc(s)}" aria-pressed="${F.s.includes(s)}" ${n || F.s.includes(s) ? '' : 'disabled'} title="${n} ks">${esc(s)}</button>`; }).join('')}</div></div>` : ''}
      ${allFams.length > 1 ? `<div class="fgrp"><h3 class="cap">Barva</h3><div class="fclr">${allFams.map((f) => { const n = count('c', f, (m, v) => m.fam.has(v)); return `<button type="button" data-f="c" data-v="${esc(f)}" aria-pressed="${F.c.includes(f)}" ${n || F.c.includes(f) ? '' : 'disabled'}><i style="background:${FAM[f]}"></i>${esc(f)}<small>${n}</small></button>`; }).join('')}</div></div>` : ''}
      ${pMax > pMin ? `<div class="fgrp price"><h3 class="cap">Cena <small class="num">${money(pr[0])} – ${money(pr[1])}</small></h3>
        <div class="price__hist" aria-hidden="true">${hist.map((n, i) => { const lo = pMin + (span * i) / BINS, hi = pMin + (span * (i + 1)) / BINS; return `<i class="${hi >= pr[0] && lo <= pr[1] ? 'is-in' : ''}" style="height:${Math.max(4, (n / hmax) * 100)}%"></i>`; }).join('')}</div>
        <div class="price__rng"><input type="range" min="${pMin}" max="${pMax}" step="10" value="${pr[0]}" data-pmin aria-label="Cena od"><input type="range" min="${pMin}" max="${pMax}" step="10" value="${pr[1]}" data-pmax aria-label="Cena do"></div>
        <div class="price__val num"><span>${money(pMin)}</span><span>${money(pMax)}</span></div></div>` : ''}
      ${allMats.length > 1 ? `<div class="fgrp"><h3 class="cap">Materiál</h3><div class="chips">${allMats.map(([id, l]) => { const n = count('m', id, (m, v) => m.mat.has(v)); return `<button class="chip" type="button" data-f="m" data-v="${id}" aria-pressed="${F.m.includes(id)}" ${n || F.m.includes(id) ? '' : 'disabled'}>${esc(l)}<span class="n">${n}</span></button>`; }).join('')}</div></div>` : ''}
      ${hasNew || hasSale ? `<div class="fgrp">${hasNew ? `<button class="tgl" type="button" data-tg="n" aria-pressed="${F.n}"><span>Jen novinky<small>${count('n', 1, (m) => m.isNew)}</small></span><i></i></button>` : ''}${hasSale ? `<button class="tgl" type="button" data-tg="d" aria-pressed="${F.d}"><span>Ve slevě<small>${count('d', 1, (m) => m.sale)}</small></span><i></i></button>` : ''}</div>` : ''}`;
    const n = results().length;
    $('[data-apply]', fdr).textContent = n ? `Zobrazit ${plural(n, 'model', 'modely', 'modelů')}` : 'Nic neodpovídá';
    $('[data-apply]', fdr).disabled = !n;
  };

  /* ---------- mřížka ---------- */
  const grid = $('#grid');
  const setDens = (d) => {
    const m = mob(); const val = d || (m ? 2 : 4);
    const v = m ? Math.min(2, val) : Math.max(2, val);
    grid.style.setProperty('--cols', v); grid.dataset.cols = v;
    $$('[data-dens]').forEach((b) => b.setAttribute('aria-pressed', +b.dataset.dens === v));
  };
  // redakční dlaždice: atmosférická fotka z kolekce (ne stejná jako v hlavičce)
  const EDT = { kabelky: ['velka-kozena-croco-kabelka-do-ruky', 'bordo', 0], doplnky: ['kozena-semisova-shoulder-bag-se-zamkem', 'camel', 0], obleceni: ['bunda-s-koziskovym-limcem-a-na-stazeni-v-pase', 'black', 3], kabaty: ['bunda-s-koziskovym-limcem-a-na-stazeni-v-pase', 'black', 5], novinky: ['bunda-s-koziskovym-limcem-a-na-stazeni-v-pase', 'black', 1], kalhoty: ['zebrovane-dziny', 'beige', 0], saka: ['boxy-oversized-sako', 'dark-grey', 0], topy: ['heavy-cotton-triko-s-vycpavkami', 'red', 0], 'heavy-cotton': ['heavy-cotton-triko-s-vycpavkami', 'red', 0], christmas: ['semisovy-kozeny-kosmeticky-kufrik', 'bordo', 0], bestsellery: ['boxy-oversized-sako', 'black', 1] };
  const edtFor = (list, n) => {
    if (n < 10 || mob()) return null;
    const e = EDT[k];
    if (e && list.some((x) => x.id === e[0])) { const p = GX.p(e[0]); return { p, v: GX.v(p, e[1]), i: e[2] }; }
    const p = list.find((x) => x.v[0].img[1] && !/kabel|pásek|peněž|pouzdr|taš|psaní/i.test(x.name)); if (!p) return null;
    return { p, v: p.v[0], i: 1 };
  };
  const edtHTML = (e) => {
    if (!e) return '';
    return `<a class="edt cur" href="${GX.href(e.p, e.v)}">${GX.pic(e.p, e.v, e.i, { alt: e.p.name, lo: true })}<div class="edt__txt"><span class="cap">${esc(e.v.label)}</span><p>${esc(ty(e.p.name))}</p><span class="lnk">${money(GX.price(e.p, e.v))} · Zobrazit</span></div></a>`;
  };
  let res = []; let edt = null;
  const renderGrid = (append) => {
    if (!append) { res = results(); shown = 0; grid.innerHTML = ''; edt = edtFor(res, res.length); }
    const next = res.slice(shown, shown + PAGE);
    let html = next.map((p) => GX.card(p, prefVariant(p), { noNew: k === 'novinky' })).join('');
    if (!append && edt && next.length > 6) { const at = 4; const parts = next.map((p) => GX.card(p, prefVariant(p), { noNew: k === 'novinky' })); parts.splice(at, 0, edtHTML(edt)); html = parts.join(''); }
    if (!res.length) html = `<div class="empty"><p>${!base.length && empty ? esc(empty) : 'Tomu teď nic neodpovídá.'}</p>${activeN() ? '<button class="btn btn--line" type="button" data-clear>Zrušit filtry</button>' : `<a class="btn btn--line" href="${GX.catUrl('novinky')}">Prohlédnout novinky</a>`}</div>`;
    grid.insertAdjacentHTML('beforeend', html);
    const cards = $$('.pc', grid).slice(shown);
    cards.forEach((c, i) => { c.style.animationDelay = `${Math.min(i, 11) * 45}ms`; });
    shown += next.length;
    $('[data-count]').textContent = res.length === base.length ? plural(res.length, 'model', 'modely', 'modelů') : `${res.length} z ${base.length}`;
    $('[data-more]').innerHTML = res.length > shown ? `<p class="num">Zobrazeno ${shown} z ${res.length}</p><span class="more__bar"><i style="transform:scaleX(${(shown / res.length).toFixed(3)})"></i></span><button class="btn btn--line" type="button" data-load>Načíst ${Math.min(PAGE, res.length - shown)} dalších</button>` : (res.length > PAGE ? `<p class="num">Zobrazeno všech ${res.length}</p>` : '');
    GX.pics(grid); GX.typo(grid); GX.reveal(grid);
  };
  const renderAct = () => {
    const chip = (key, v, label) => `<button class="chip" type="button" data-rm="${key}" data-v="${esc(v)}" aria-pressed="true">${esc(label)} ${GX.ICON.close.replace('<svg', '<svg width="12" height="12"')}</button>`;
    const parts = [...F.t.map((t) => chip('t', t, GX.catName(t))), ...F.s.map((s) => chip('s', s, 'Velikost ' + s)), ...F.c.map((c) => chip('c', c, c)), ...F.m.map((m) => chip('m', m, (MAT.find((x) => x[0] === m) || [0, m])[1]))];
    if (F.p) parts.push(chip('p', '', `${money(F.p[0])} – ${money(F.p[1])}`));
    if (F.n) parts.push(chip('n', '', 'Jen novinky')); if (F.d) parts.push(chip('d', '', 'Ve slevě'));
    $('[data-act]').innerHTML = parts.length ? parts.join('') + '<button class="act__clr" type="button" data-clear>Zrušit vše</button>' : '';
    const n = activeN(); const b = $('[data-fn]'); b.hidden = !n; b.textContent = n;
    // rychlé volby v liště: nejčastější velikosti
    const quick = allSizes.map((s) => [s, base.filter((p) => meta.get(p.id).size.has(s)).length]).sort((a, b2) => b2[1] - a[1]).slice(0, 5).map((x) => x[0]).sort((a, b2) => sizeKey(a) - sizeKey(b2));
    $('[data-quick]').innerHTML = allSizes.length > 1 ? quick.map((s) => `<button class="chip" type="button" data-f="s" data-v="${esc(s)}" aria-pressed="${F.s.includes(s)}">${esc(s)}</button>`).join('') : '';
    const tEl = $('[data-types]');
    if (tEl && allTypes.length > 1) {
      if (!tEl.children.length) tEl.innerHTML = `<button class="ctl__i" type="button" data-alltypes><span class="ctl__m">${C ? GX.catPic(k, { alt: '' }) : typePic(allTypes[0])}</span><span class="ctl__l"><span>Vše</span><small class="num">${base.length}</small></span></button>${allTypes.map((t) => `<button class="ctl__i" type="button" data-f="t" data-v="${t}"><span class="ctl__m">${typePic(t)}</span><span class="ctl__l"><span>${esc(GX.catName(t))}</span><small class="num"></small></span></button>`).join('')}`;
      $('[data-alltypes]', tEl).setAttribute('aria-pressed', !F.t.length);
      $$('[data-f="t"]', tEl).forEach((b) => { const t = b.dataset.v; const n2 = count('t', t, (m, v) => m.type.includes(v)); b.setAttribute('aria-pressed', F.t.includes(t)); b.disabled = !n2 && !F.t.includes(t); $('small', b).textContent = n2; });
      GX.pics(tEl);
    } else if (tEl) tEl.hidden = true;
  };
  let rt = 0;
  const update = (o = {}) => {
    syncURL(); renderAct();
    if (fdr.classList.contains('is-on') && !o.keepPanel) renderPanel();
    clearTimeout(rt); rt = setTimeout(() => {
      renderGrid(false);
      if (o.scroll && !fdr.classList.contains('is-on')) { const t = $('#tb').getBoundingClientRect().top + window.scrollY - 10; if (window.scrollY > t) window.scrollTo({ top: t, behavior: reduce ? 'auto' : 'smooth' }); }
    }, o.now ? 0 : 60);
  };
  const toggleArr = (arr, v) => { const i = arr.indexOf(v); if (i > -1) arr.splice(i, 1); else arr.push(v); };
  const clearAll = () => { F.t = []; F.s = []; F.c = []; F.m = []; F.p = null; F.n = false; F.d = false; update({ scroll: true }); };
  document.addEventListener('click', (e) => {
    const f = e.target.closest('[data-f]');
    if (f && !f.disabled && (f.closest('#fdr') || f.closest('.tb') || f.closest('[data-types]'))) { toggleArr(F[f.dataset.f], f.dataset.v); update({ scroll: !f.closest('#fdr') }); return; }
    if (e.target.closest('[data-alltypes]')) { F.t = []; update({ scroll: true }); return; }
    const tg = e.target.closest('[data-tg]'); if (tg) { F[tg.dataset.tg] = !F[tg.dataset.tg]; update(); return; }
    const rm = e.target.closest('[data-rm]');
    if (rm && rm.closest('[data-act]')) { const key = rm.dataset.rm; if (Array.isArray(F[key])) toggleArr(F[key], rm.dataset.v); else F[key] = key === 'p' ? null : false; update({ scroll: true }); return; }
    if (e.target.closest('[data-clear]')) { clearAll(); return; }
    if (e.target.closest('[data-open-f]')) { renderPanel(); GX.open('#fdr'); return; }
    if (e.target.closest('[data-load]')) { const at = shown; renderGrid(true); const first = $$('.pc', grid)[at]; if (first) first.querySelector('a').focus({ preventScroll: true }); return; }
    const d = e.target.closest('[data-dens]'); if (d) { dens = +d.dataset.dens; store.set('gx2-dens', dens); setDens(dens); return; }
  });
  fdr.addEventListener('input', (e) => {
    if (!e.target.matches('[data-pmin],[data-pmax]')) return;
    const a = $('[data-pmin]', fdr), b = $('[data-pmax]', fdr);
    let lo = +a.value, hi = +b.value; if (lo > hi - 10) { if (e.target === a) lo = hi - 10; else hi = lo + 10; a.value = lo; b.value = hi; }
    F.p = (lo <= pMin && hi >= pMax) ? null : [lo, hi];
    const span = Math.max(1, pMax - pMin); const pr = F.p || [pMin, pMax];
    $$('.price__hist i', fdr).forEach((el, i) => { const l = pMin + (span * i) / BINS, h = pMin + (span * (i + 1)) / BINS; el.classList.toggle('is-in', h >= pr[0] && l <= pr[1]); });
    $('.price h3 small', fdr).textContent = `${money(pr[0])} – ${money(pr[1])}`;
    syncURL(); renderAct(); clearTimeout(rt); rt = setTimeout(() => { renderGrid(false); const n = res.length; const ap = $('[data-apply]', fdr); ap.textContent = n ? `Zobrazit ${plural(n, 'model', 'modely', 'modelů')}` : 'Nic neodpovídá'; ap.disabled = !n; }, 140);
  });
  $('[data-sort]').addEventListener('change', (e) => { F.o = e.target.value; update({ scroll: true }); });
  window.addEventListener('resize', () => setDens(dens));

  if (!base.length) { $('#tb').hidden = true; $('[data-act]').hidden = true; }
  setDens(dens);
  renderAct(); renderGrid(false);
  GX.bindCards(grid);
  GX.pics(main); GX.typo(main); GX.reveal(main);
})();
