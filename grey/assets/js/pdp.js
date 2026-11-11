/* GREY · návrh v4 · MALUS/01 · pdp.js – detail produktu: velká fotka, jasný nákupní panel, Sedne mi to? na dvě klepnutí */
(function () {
  'use strict';
  const GX = window.GX;
  const { $, $$, esc, money, store, reduce, fine, mob, NB, ty, plural } = GX.u;
  const qs = new URLSearchParams(location.search);
  const p = GX.p(qs.get('p')) || GX.p('kozena-velka-croco-kabelka-s-dlouhym-uchem') || GX.products[0];
  let v = GX.v(p, qs.get('c'));
  const sub = p.cat.find((c) => GX.cats[c] && GX.cats[c].parent) || null;
  const parent = sub ? GX.cats[sub].parent : (p.cat.find((c) => GX.cats[c] && GX.cats[c].sub && GX.cats[c].sub.length) || null);
  const catKey = sub || p.cat.find((c) => GX.cats[c]) || 'novinky';
  document.title = `${p.name} · GREY — návrh nového e-shopu (MALUS/01)`;
  document.body.classList.add('pdp-page');
  GX.shell({ active: parent || catKey });
  GX.recent.push(p.id, v.id);
  const S = GX.site;
  const main = $('#main');
  const st = { size: null, img: 0, fitOpen: false };
  const N = () => Math.min(v.img.length, 10);
  const model = () => v.model || p.model;
  const sizesNow = () => GX.sizes(p, v);
  const autoSize = () => {
    const s = sizesNow(); const a = GX.size.assess(p, v);
    if (s.length === 1 && s[0].ok) st.size = s[0].s;
    else if (!s.find((x) => x.s === st.size && x.ok)) st.size = a && a.rec.ok && s.length > 1 ? a.rec.s : null;
  };
  autoSize();

  /* ---------- doplnění looku ---------- */
  const PAIR = { kalhoty: ['topy', 'saka', 'kabelky'], topy: ['kalhoty', 'saka', 'kabelky'], saka: ['kalhoty', 'topy', 'kabelky'], kabaty: ['kalhoty', 'svetry', 'kabelky'], saty: ['kabaty', 'kabelky', 'silonky'], sety: ['kabelky', 'kabaty', 'silonky'], svetry: ['kalhoty', 'kabaty', 'kabelky'], leginy: ['topy', 'kabaty', 'kabelky'], kabelky: ['rukavice', 'saly', 'kabelky'], rukavice: ['kabelky', 'saly', 'kabaty'], saly: ['rukavice', 'kabaty', 'kabelky'], silonky: ['saty', 'kabelky', 'kabaty'], boty: ['kalhoty', 'kabelky', 'silonky'], sperky: ['kabelky', 'topy', 'saty'] };
  const SUIT = GX.home && GX.home.suit;
  const suitMate = SUIT && (p.id === SUIT.top ? GX.p(SUIT.bottom) : (p.id === SUIT.bottom ? GX.p(SUIT.top) : null));
  const lookItems = (() => { const used = new Set([p.id]); const out = []; (PAIR[sub] || ['kabelky', 'topy', 'kalhoty']).forEach((c) => { const x = GX.inCat(c).find((q) => !used.has(q.id)); if (x) { used.add(x.id); out.push(x); } }); return out; })();
  const similar = (sub ? GX.inCat(sub) : GX.inCat(catKey)).filter((x) => x.id !== p.id).slice(0, 10);
  const catLabel = sub ? GX.cats[sub].l : (GX.cats[catKey] ? GX.cats[catKey].l : '');

  /* ---------- kostra ---------- */
  main.innerHTML = `
    <div class="pdp">
      <div class="stage">
        <div class="stage__thumbs" data-thumbs aria-label="Fotky produktu"></div>
        <div class="stage__main" data-main>
          <div class="stage__track" data-track></div>
          <button class="stage__nav stage__nav--p" type="button" data-sp aria-label="Předchozí fotka">${GX.ICON.prev}</button>
          <button class="stage__nav stage__nav--n" type="button" data-sn aria-label="Další fotka">${GX.ICON.next}</button>
          <span class="stage__n num" data-sc aria-hidden="true"></span>
          <button class="stage__full" type="button" data-full>Celá fotka</button>
          <div class="stage__dots" data-dots aria-hidden="true"></div>
        </div>
        <div class="stage__info" data-info>
          <a class="info__cat cap" href="${GX.catUrl(catKey)}">${esc(catLabel)}</a>
          <h1 class="info__name">${esc(ty(p.name))}</h1>
          <div class="info__price" data-price></div>
          <div data-colors></div>
          <div data-sizeblk></div>
          <div class="buy"><button class="btn" type="button" data-padd><span class="bt"></span></button><button class="favbtn" type="button" data-fav-p="${p.id}" aria-pressed="${GX.fav.has(p.id)}" aria-label="Uložit do oblíbených">${GX.ICON.heart}</button></div>
          <p class="buy__done" data-done aria-live="polite"><span data-done-t></span><button type="button" data-open-cart></button></p>
          <ul class="svc"><li><span data-svc></span></li><li><span>Zásilkovna od ${S.shipping[0].cz}${NB}Kč · vrácení do 14 dnů</span></li></ul>
          <a class="lnk" href="#detaily" data-to-det>Popis, rozměry a materiál</a>
        </div>
      </div>
      <section class="det" id="detaily"><div class="wrap det__in" data-det></div></section>
      ${suitMate ? `<section class="look"><div class="wrap"><div class="look__box"><a class="look__media" href="${GX.href(suitMate, GX.v(suitMate, v.id))}" data-suit-pic></a><div><h2 class="d2">${GX.lines(['celý oblek'])}</h2><p class="lead" style="margin:18px 0 28px">${esc(ty(p.name))} a ${esc(ty(suitMate.name.toLowerCase()))} ze stejné kolekce, ve stejné barvě.</p><div data-suit-box></div></div></div></div></section>` : ''}
      ${lookItems.length && !suitMate ? `<section class="look"><div class="wrap"><div class="look__box look__box--rev"><div class="look__media" data-look-pic></div><div><h2 class="d2">${GX.lines(['doplňte look'])}</h2><p class="lead" style="margin:16px 0 30px">Co se k tomu hodí, vybrané z dalších kategorií.</p><div class="look__list">${lookItems.map((x) => GX.card(x, null, { noNew: true })).join('')}</div></div></div></div></section>` : ''}
      ${similar.length ? `<section class="look" style="padding-bottom:0"><div class="wrap"><div class="shead"><h2 class="d2">${GX.lines([sub ? GX.cats[sub].l.toLowerCase() : 'podobné kousky'])}</h2><a class="lnk" href="${GX.catUrl(sub || catKey)}">Zobrazit vše · ${(GX.cats[sub || catKey] || {}).n || similar.length}</a></div></div>${GX.railHTML(similar.map((x) => GX.card(x, null, { noNew: true })).join(''))}</section>` : ''}
      <section class="recent" data-recent></section>
    </div>
    <div class="stk" data-stk aria-hidden="true"><div class="stk__in"><div class="stk__img" data-stk-img></div><div class="stk__t"><b>${esc(ty(p.name))}</b><span data-stk-sub></span></div><button class="btn" type="button" data-padd data-stk-btn tabindex="-1"><span class="bt"></span></button></div></div>
    <div class="zoom" data-zoom role="dialog" aria-modal="true" aria-label="Fotky ve velkém" aria-hidden="true"><div class="zoom__ui"><span class="num" data-zn></span><button class="x" type="button" data-zx aria-label="Zavřít">${GX.ICON.close}</button></div><div class="zoom__img" data-zimg></div><div class="zoom__thumbs" data-zthumbs></div><div class="zoom__nav"><button type="button" data-zp aria-label="Předchozí fotka">${GX.ICON.prev}</button><button type="button" data-zn2 aria-label="Další fotka">${GX.ICON.next}</button></div></div>`;

  /* ---------- fotky: velká fotka + náhledy (na mobilu tažení) ---------- */
  const track = $('[data-track]');
  const renderGal = () => {
    const n = N();
    track.innerHTML = v.img.slice(0, n).map((_, i) => `<div class="stage__i${i === st.img ? ' is-on' : ''}" data-i="${i}">${GX.pic(p, v, i, { eager: i < 2, lo: i === 0, alt: i === 0 ? `${p.name}, ${v.label}` : `${p.name}, ${v.label} – fotka ${i + 1}` })}</div>`).join('');
    $('[data-thumbs]').innerHTML = v.img.slice(0, n).map((_, i) => `<button type="button" class="stage__t${i === st.img ? ' is-on' : ''}" data-ti="${i}" aria-label="Fotka ${i + 1} z ${n}">${GX.pic(p, v, i, { alt: '', lo: i === 0 })}</button>`).join('');
    $('[data-dots]').innerHTML = v.img.slice(0, n).map((_, i) => `<i class="${i === st.img ? 'is-on' : ''}"></i>`).join('');
    paintIdx(); GX.pics(main);
  };
  const paintIdx = () => {
    const n = $$('.stage__i', track).filter((x) => !x.classList.contains('is-gone')).length;
    $('[data-sc]').textContent = `${st.img + 1} / ${n || 1}`;
    $$('.stage__t').forEach((t) => t.classList.toggle('is-on', +t.dataset.ti === st.img));
    $$('[data-dots] i').forEach((d, k) => d.classList.toggle('is-on', k === st.img));
  };
  const show = (i) => {
    const items = $$('.stage__i', track).filter((x) => !x.classList.contains('is-gone')); if (!items.length) return;
    const n = items.length; const k = ((i % n) + n) % n; st.img = +items[k].dataset.i;
    if (mob()) { track.scrollTo({ left: items[k].offsetLeft, behavior: reduce ? 'auto' : 'smooth' }); }
    else items.forEach((x) => x.classList.toggle('is-on', x === items[k]));
    paintIdx();
  };
  const stepImg = (d) => { const items = $$('.stage__i', track).filter((x) => !x.classList.contains('is-gone')); const cur = items.findIndex((x) => +x.dataset.i === st.img); show(cur + d); };
  document.addEventListener('gx:imgerr', (e) => { const pic = e.detail; if (!pic || !pic.classList.contains('is-none')) return; const it = pic.closest('.stage__i, .stage__t'); if (it) { const i = it.dataset.i || it.dataset.ti; $$(`.stage__i[data-i="${i}"], .stage__t[data-ti="${i}"]`).forEach((x) => x.classList.add('is-gone')); paintIdx(); } });
  track.addEventListener('scroll', () => {
    if (!mob()) return; const items = $$('.stage__i', track).filter((x) => !x.classList.contains('is-gone'));
    const k = Math.round(track.scrollLeft / Math.max(1, track.clientWidth)); if (items[k]) { st.img = +items[k].dataset.i; paintIdx(); }
  }, { passive: true });

  /* ---------- nákupní panel ---------- */
  const renderPrice = () => {
    $('[data-price]').innerHTML = `<span class="num">${money(GX.price(p, v))}</span>${v.std ? `<s class="num">${money(v.std)}</s><span class="sale">${esc(v.sale || 'Sleva')}</span>` : ''}`;
  };
  const renderColors = () => {
    const box = $('[data-colors]');
    if (p.voucher || p.v.length < 2) { box.innerHTML = p.voucher ? '' : `<p class="info__lbl"><span>Barva <b>${esc(v.label)}</b></span></p>`; return; }
    box.innerHTML = `<p class="info__lbl"><span>Barva <b>${esc(v.label)}</b></span><span class="mut">${p.v.length} ${p.v.length < 5 ? 'barvy' : 'barev'}</span></p><div class="psw" role="group" aria-label="Barvy">${p.v.map((x) => `<a href="${GX.href(p, x)}" data-c="${esc(x.id)}" aria-current="${x.id === v.id}" aria-label="Barva ${esc(x.label)}" title="${esc(x.label)}">${GX.pic(p, x, 0, { alt: '' })}</a>`).join('')}</div>`;
  };
  // Sedne mi to? v detailu: jedna věta o vybrané velikosti; výběr „co nosím“ je schovaný za tlačítkem
  const fitHTML = () => {
    const f = GX.fitOf(p, v); if (!f || p.voucher) return '';
    const prof = GX.size.get(); const a = prof && prof.s ? GX.size.assess(p, v) : null;
    const panel = `<div class="fitp" data-fitp${st.fitOpen ? '' : ' hidden'}>${GX.size.picker(prof, { cls: 'szp--sm' })}<p class="fitp__n">Doporučení počítáme ze skutečných rozměrů kousku.</p></div>`;
    if (!a) return `<div class="fitl" data-fitl><button type="button" class="fitl__cta" data-fit-open aria-expanded="${!!st.fitOpen}">${GX.size.icon('akorat')}<span><b>Sedne mi to?</b> Najděte svou velikost na dvě klepnutí</span></button>${panel}</div>`;
    const sel = a.rows.find((r) => r.s === st.size) || a.rec;
    const multi = sizesNow().length > 1;
    const pref = prof.p === 'volne' ? ', raději volně' : (prof.p === 'prilehave' ? ', raději přiléhavě' : '');
    return `<div class="fitl" data-fitl aria-live="polite">
      <p class="fitl__t"><b>${esc(sel.s)}:</b> ${esc(GX.size.say(a, sel))}. <span>${esc(sel.detail.replace(/^./, (c) => c.toUpperCase()))}${model() ? `, modelka měří ${model()}${NB}cm` : ''}.</span></p>
      ${GX.size.meter(a, sel, { cls: 'fm--sm' })}
      ${!a.exact ? `<p class="fitl__t">Vaši ${esc(prof.s)} v této barvě nemáme.</p>` : ''}
      ${multi && sel !== a.rec ? `<p class="fitl__t">Pro vaši ${esc(prof.s)} doporučujeme ${esc(a.rec.s)}. <button type="button" class="fitl__pick" data-pick="${esc(a.rec.s)}">Vybrat ${esc(a.rec.s)}</button></p>` : ''}
      <button type="button" class="fitl__ch" data-fit-open aria-expanded="${!!st.fitOpen}">Nosím ${esc(prof.s)}${pref} · změnit</button>
      ${panel}
    </div>`;
  };
  const renderSizes = () => {
    const box = $('[data-sizeblk]');
    if (p.voucher) {
      box.innerHTML = `<p class="info__lbl"><span>Hodnota <b>${esc(v.label)}</b></span></p><div class="szs szs--pdp">${p.v.map((x) => `<button class="sz" type="button" data-vv="${esc(x.id)}" aria-pressed="${x.id === v.id}"><span>${money(GX.price(p, x))}</span></button>`).join('')}</div>`;
      return;
    }
    const sizes = sizesNow(); const one = sizes.length === 1;
    box.innerHTML = `<p class="info__lbl"><span>Velikost${st.size ? ' <b>' + esc(st.size) + '</b>' : ''}</span>${GX.fitOf(p, v) ? '<a href="#detaily" data-to-det>Tabulka rozměrů</a>' : ''}</p>
      ${sizes.length && !one ? `<div class="szs szs--pdp" role="group" aria-label="Velikost" data-szs>${sizes.map(({ s, ok }) => `<button class="sz" type="button" data-s="${esc(s)}" aria-pressed="${s === st.size}"${ok ? '' : ' disabled'}><span>${esc(s)}</span></button>`).join('')}</div>` : ''}
      ${p.note ? `<p class="note">${esc(ty(p.note))}</p>` : ''}
      ${fitHTML()}`;
  };
  const renderBtn = () => {
    const sizes = sizesNow(); const soldOut = !p.voucher && sizes.length > 0 && !sizes.some((x) => x.ok); const need = !p.voucher && sizes.length > 0 && !st.size;
    const inC = (p.voucher || st.size) && GX.cart.has(p.id, v.id, p.voucher ? null : st.size);
    const tail = st.size ? ' · ' + st.size : (p.voucher ? ' · ' + v.label : '');
    const label = soldOut ? 'V této barvě vyprodáno' : (need ? 'Vyberte velikost' : (inC ? `✓ V košíku${tail}` : `Přidat do košíku${tail}`));
    $$('[data-padd]').forEach((b) => { b.classList.toggle('is-done', !!inC); b.classList.toggle('is-off', soldOut); $('.bt', b).textContent = label; });
    const sv = $('[data-svc]'); if (sv) sv.innerHTML = soldOut ? '<b>V této barvě vyprodáno</b> · klepnutím na velikost dáte hlas pro doskladnění' : `<b>Skladem</b> · ${esc(S.dispatch.replace('Zboží expedujeme', 'odesíláme'))}`;
    const done = $('[data-done]'); done.classList.toggle('is-on', !!inC);
    if (inC) { $('[data-done-t]').textContent = `${plural(GX.cart.count(), 'kus', 'kusy', 'kusů')} v košíku`; $('[data-open-cart]').textContent = `Zobrazit košík (${GX.cart.count()})`; }
    $('[data-stk-sub]').textContent = `${p.voucher ? 'Dárkový voucher' : v.label}${st.size ? ' · ' + st.size : ''} · ${money(GX.price(p, v))}`;
    $('[data-stk-img]').innerHTML = GX.pic(p, v, 0, { alt: '' });
  };
  /* ---------- detaily pod fotkou ---------- */
  const sizeTable = () => {
    const f = GX.fitOf(p, v); if (!f) return '';
    const rows = sizesNow().map((x) => x.s).filter((s) => (f.type === 'top' ? f.w && f.w[s] != null : f.waist && f.waist[s] != null)); if (!rows.length) return '';
    const head = f.type === 'top' ? '<th>Šířka naplocho</th>' : '<th>Pas naplocho</th>';
    return `<table><thead><tr><th>Velikost</th>${head}<th>Délka</th></tr></thead><tbody>${rows.map((s) => { const w = f.type === 'top' ? f.w[s] : f.waist[s]; return `<tr><td>${esc(s)}</td><td class="num">${Array.isArray(w) ? w.join('–') + NB + 'cm (guma)' : w + NB + 'cm'}</td><td class="num">${f.l && f.l[s] ? f.l[s] + NB + 'cm' : '–'}</td></tr>`; }).join('')}</tbody></table>`;
  };
  const renderDet = () => {
    const meas = GX.measOf(p, v); const tbl = sizeTable();
    const cols = [
      ['Popis', `<p>${esc(ty(p.desc || ''))}</p>${model() ? `<p>Modelka na fotkách měří ${model()}${NB}cm.</p>` : ''}`],
      ['Velikost a rozměry', `${tbl}${meas && !tbl ? `<p>${esc(ty(meas))}</p>` : ''}${p.note ? `<p>${esc(ty(p.note))}</p>` : ''}${tbl ? '<p class="mut" style="font-size:12.5px">Měřeno naplocho.</p>' : ''}`],
      ['Materiál a doprava', `${p.material ? `<p><b>Materiál</b><br>${esc(p.material)}</p>` : ''}${p.origin ? `<p><b>Země původu</b><br>${esc(p.origin)}</p>` : ''}<p><b>Doprava</b><br>Zásilkovna – výdejní místo ${S.shipping[0].cz}${NB}Kč, na adresu ${S.shipping[1].cz}${NB}Kč. ${esc(S.dispatch)}</p><p><b>Vrácení</b><br>${esc(S.returns)}</p>`]
    ].filter((c) => c[1].replace(/<[^>]+>/g, '').trim().length > 2);
    $('[data-det]').innerHTML = cols.map(([t, b], i) => `<details class="det__c" ${mob() && i > 0 ? '' : 'open'}><summary class="cap">${t}<i aria-hidden="true"></i></summary><div class="det__b">${b}</div></details>`).join('');
  };
  const renderLook = () => {
    const lp = $('[data-look-pic]'); if (lp) lp.innerHTML = GX.pic(p, v, v.img.length > 2 ? 2 : (v.img.length > 1 ? 1 : 0), { alt: `${p.name}, ${v.label}`, lo: true });
    if (!suitMate) return;
    const mv = GX.v(suitMate, v.id); const same = mv.id === v.id;
    $('[data-suit-pic]').innerHTML = GX.pic(suitMate, mv, 0); $('[data-suit-pic]').href = GX.href(suitMate, mv);
    const ms = GX.sizes(suitMate, mv); const box = $('[data-suit-box]');
    const msel = box.dataset.msel && ms.find((x) => x.s === box.dataset.msel && x.ok) ? box.dataset.msel : (ms.find((x) => x.s === st.size && x.ok) || ms.find((x) => x.ok) || {}).s;
    box.innerHTML = `<div class="piece" style="border-bottom:1px solid var(--line)"><a href="${GX.href(suitMate, mv)}">${GX.pic(suitMate, mv, 0, { alt: '' })}</a><div><div class="piece__top"><a href="${GX.href(suitMate, mv)}">${esc(ty(suitMate.name))} · ${esc(mv.label)}</a><b class="num">${money(GX.price(suitMate, mv))}</b></div>
      <div class="szs szs--pdp">${ms.map(({ s, ok }) => `<button class="sz" type="button" data-msz="${esc(s)}" aria-pressed="${s === msel}"${ok ? '' : ' disabled'}><span>${esc(s)}</span></button>`).join('')}</div></div></div>
      ${same ? '' : `<p class="note">Ve stejné barvě teď není, ukazujeme ${esc(mv.label)}.</p>`}
      <div class="suit__total" style="margin:22px 0 14px"><span>Celý oblek</span><b class="num">${money(GX.price(p, v) + GX.price(suitMate, mv))}</b></div>
      <button class="btn btn--block" type="button" data-suit-add ${msel && st.size ? '' : 'disabled'}>${!st.size ? 'Nahoře vyberte velikost saka' : (msel ? (GX.cart.has(p.id, v.id, st.size) && GX.cart.has(suitMate.id, mv.id, msel) ? `✓ Oblek v košíku · ${st.size} + ${msel}` : `Přidat celý oblek · ${st.size} + ${msel}`) : 'Druhý kus teď není skladem')}</button>`;
    box.dataset.msel = msel || '';
  };
  const renderRecent = () => {
    const r = GX.recent.list().filter((x) => x.p.id !== p.id).slice(0, 10);
    $('[data-recent]').innerHTML = r.length ? `<div class="wrap"><div class="shead"><h2 class="d2">${GX.lines(['naposledy prohlížené'])}</h2></div></div>${GX.railHTML(r.map((x) => GX.card(x.p, x.v, { noNew: true })).join(''))}` : '';
    $$('[data-recent] .rail').forEach(GX.rail);
  };
  const renderPanel = () => { renderPrice(); renderColors(); renderSizes(); renderBtn(); GX.pics($('[data-info]')); GX.typo($('[data-info]')); };
  const renderAll = (galToo) => { if (galToo) renderGal(); renderPanel(); renderDet(); renderLook(); GX.pics(main); GX.typo(main); };
  renderAll(true); renderRecent();

  /* ---------- události ---------- */
  const setVariant = (vid) => {
    const nv = GX.v(p, vid); if (nv.id === v.id) return;
    const m = $('[data-main]');
    const swap = () => {
      v = nv; st.img = 0; autoSize();
      try { history.replaceState(null, '', GX.href(p, v)); } catch (e) { /* file:// */ }
      GX.recent.push(p.id, v.id);
      if (reduce || mob()) { m.classList.add('is-swap'); setTimeout(() => { renderAll(true); m.classList.remove('is-swap'); }, reduce ? 0 : 240); return; }
      // stará fotka zůstane nahoře a rozplyne se nad novou, takže mezi barvami nikdy neprobleskne prázdné místo
      const cur = $('.stage__i.is-on', track); const ghost = cur ? cur.cloneNode(true) : null;
      if (ghost) { ghost.className = 'stage__ghost'; m.appendChild(ghost); }
      m.classList.add('is-xf'); renderAll(true);
      requestAnimationFrame(() => requestAnimationFrame(() => { if (ghost) ghost.style.opacity = '0'; }));
      setTimeout(() => { if (ghost) ghost.remove(); m.classList.remove('is-xf'); }, 760);
    };
    // novou fotku nejdřív načíst, pak teprve přepnout
    let done = false; const once = () => { if (!done) { done = true; swap(); } };
    const im = new Image(); im.src = GX.src(p, nv, 0);
    (im.decode ? im.decode() : Promise.reject()).then(once, once); setTimeout(once, 700);
  };
  const toDet = () => { const d = $('#detaily'); $$('.det__c', d).forEach((x) => { x.open = true; }); d.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); };
  main.addEventListener('click', (e) => {
    if (e.target.closest('.pc')) return;
    if (e.target.closest('.det__c summary') && !mob()) { e.preventDefault(); return; }
    if (e.target.closest('[data-to-det]')) { e.preventDefault(); toDet(); return; }
    const c = e.target.closest('[data-c]'); if (c) { e.preventDefault(); setVariant(c.dataset.c); return; }
    const vv = e.target.closest('[data-vv]'); if (vv) { setVariant(vv.dataset.vv); return; }
    const t = e.target.closest('[data-ti]'); if (t) { show($$('.stage__i', track).filter((x) => !x.classList.contains('is-gone')).findIndex((x) => x.dataset.i === t.dataset.ti)); return; }
    if (e.target.closest('[data-sp]')) { stepImg(-1); return; }
    if (e.target.closest('[data-sn]')) { stepImg(1); return; }
    if (e.target.closest('[data-full]') || (e.target.closest('.stage__i') && !mob())) { openZoom(st.img); return; }
    const s = e.target.closest('[data-s]');
    if (s) {
      if (!s.disabled) { st.size = s.dataset.s; renderSizes(); renderBtn(); renderLook(); GX.typo($('[data-info]')); }
      return;
    }
    const vote = e.target.closest('[data-vote]');
    if (vote) { const votes = store.get('gx2-votes', []); votes.push(`${p.id}|${v.id}|${vote.dataset.vote}`); store.set('gx2-votes', votes); vote.parentElement.textContent = `✓ Hlas pro doskladnění ${vote.dataset.vote} jsme započítali.`; return; }
    const pick = e.target.closest('[data-pick]'); if (pick) { st.size = pick.dataset.pick; renderSizes(); renderBtn(); renderLook(); return; }
    if (e.target.closest('[data-fit-open]')) { st.fitOpen = !st.fitOpen; renderSizes(); GX.typo($('[data-info]')); return; }
    const me = e.target.closest('[data-me]'); if (me) { st.fitOpen = false; GX.size.set({ s: me.dataset.me }); return; }
    const pr = e.target.closest('[data-pref]'); if (pr) { GX.size.set({ p: pr.dataset.pref }); return; }
    if (e.target.closest('[data-open-cart]')) { GX.openCart(); return; }
    if (e.target.closest('[data-fav-p]') && !e.target.closest('.pc')) { GX.fav.toggle(p.id); return; }
    const msz = e.target.closest('[data-msz]'); if (msz && !msz.disabled) { $('[data-suit-box]').dataset.msel = msz.dataset.msz; renderLook(); return; }
    if (e.target.closest('[data-suit-add]')) { const mv = GX.v(suitMate, v.id); const ms = $('[data-suit-box]').dataset.msel; GX.cart.add(p.id, v.id, st.size); GX.cart.add(suitMate.id, mv.id, ms); renderBtn(); renderLook(); GX.added(p.id, v.id, st.size); }
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-padd]'); if (!b) return;
    if (!p.voucher && sizesNow().length && !sizesNow().some((x) => x.ok)) { GX.toast(`${v.label}: teď vyprodáno. U velikosti můžete dát hlas pro doskladnění.`); return; }
    if (!p.voucher && sizesNow().length && !st.size) {
      GX.toast('Vyberte velikost.');
      const g = $('[data-szs]'); if (g) { g.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); if (!reduce && g.animate) g.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 360, easing: 'cubic-bezier(.34,1.56,.64,1)' }); }
      return;
    }
    GX.cart.add(p.id, v.id, p.voucher ? null : st.size); renderBtn();
    $$('[data-padd]').forEach((x) => { x.classList.remove('is-flash'); void x.offsetWidth; x.classList.add('is-flash'); });
    GX.added(p.id, v.id, st.size);
  });
  document.addEventListener('gx:cart', () => { renderBtn(); renderLook(); });
  // nová velikost v „Sedne mi to?“: rovnou vybrat doporučenou
  document.addEventListener('gx:size', () => { const a = GX.size.assess(p, v); if (a && a.rec.ok && sizesNow().length > 1) st.size = a.rec.s; else autoSize(); renderSizes(); renderBtn(); renderLook(); GX.typo($('[data-info]')); });
  document.addEventListener('keydown', (e) => { if (zoom.classList.contains('is-on') || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return; if (e.key === 'ArrowRight') stepImg(1); if (e.key === 'ArrowLeft') stepImg(-1); });

  /* lepicí lišta: na mobilu pořád po ruce, na počítači když hlavní tlačítko zmizí */
  const stk = $('[data-stk]'); const mainBtn = $('.buy [data-padd]');
  const setStk = (on) => { stk.classList.toggle('is-on', on); stk.setAttribute('aria-hidden', !on); $('[data-stk-btn]').tabIndex = on ? 0 : -1; document.body.classList.toggle('stk-on', on); };
  if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => { setStk(mob() ? !en.isIntersecting : (!en.isIntersecting && en.boundingClientRect.top < 0)); }, { threshold: 0 }).observe(mainBtn);

  /* ---------- fotky přes celou obrazovku ---------- */
  const zoom = $('[data-zoom]'); let zi = 0;
  const zPaint = () => {
    const n = N();
    $('[data-zimg]').innerHTML = `<img src="${GX.src(p, v, zi)}" alt="${esc(p.name)}, fotka ${zi + 1}">`;
    $('[data-zn]').textContent = `${zi + 1} / ${n}`;
    $('[data-zthumbs]').innerHTML = v.img.slice(0, n).map((_, i) => `<button type="button" data-zt="${i}" class="${i === zi ? 'is-on' : ''}" aria-label="Fotka ${i + 1}">${GX.pic(p, v, i, { alt: '', lo: i === 0 })}</button>`).join('');
    GX.pics(zoom);
  };
  const openZoom = (i) => { zi = i; zPaint(); zoom.classList.add('is-on'); zoom.setAttribute('aria-hidden', 'false'); document.documentElement.style.overflow = 'hidden'; setTimeout(() => $('[data-zx]').focus(), 50); };
  const closeZoom = () => { zoom.classList.remove('is-on'); zoom.setAttribute('aria-hidden', 'true'); document.documentElement.style.overflow = ''; show($$('.stage__i', track).findIndex((x) => +x.dataset.i === zi)); };
  const zStep = (d) => { const n = N(); zi = (zi + d + n) % n; zPaint(); };
  zoom.addEventListener('click', (e) => {
    if (e.target.closest('[data-zx]')) { closeZoom(); return; }
    if (e.target.closest('[data-zp]')) { zStep(-1); return; }
    if (e.target.closest('[data-zn2]')) { zStep(1); return; }
    const t = e.target.closest('[data-zt]'); if (t) { zi = +t.dataset.zt; zPaint(); return; }
    if (!e.target.closest('[data-zimg]')) closeZoom();
  });
  let zx = null;
  zoom.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') zx = e.clientX; }, { passive: true });
  zoom.addEventListener('pointerup', (e) => { if (zx === null) return; const dx = e.clientX - zx; zx = null; if (Math.abs(dx) > 50) zStep(dx < 0 ? 1 : -1); }, { passive: true });
  document.addEventListener('keydown', (e) => { if (!zoom.classList.contains('is-on')) return; if (e.key === 'Escape') closeZoom(); if (e.key === 'ArrowRight') zStep(1); if (e.key === 'ArrowLeft') zStep(-1); });

  /* ---------- příchod z karty: fotka doletí na své místo ---------- */
  const flip = store.sget('gx2-flip'); store.sset('gx2-flip', null);
  if (flip && GX.arrival === 'flip' && !reduce) {
    try {
      const d = JSON.parse(flip);
      const target = $('.stage__i.is-on .pic') || $('.stage__i .pic');
      if (d.p === p.id && target) {
        const r = target.getBoundingClientRect();
        const c = document.createElement('div');
        c.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;z-index:101;overflow:hidden;pointer-events:none;transform-origin:0 0;background:var(--paper-2)`;
        c.innerHTML = `<img src="${d.src}" alt="" style="width:100%;height:100%;object-fit:cover">`;
        document.body.appendChild(c);
        const rest = [$('[data-info]'), $('[data-thumbs]')].filter(Boolean);
        rest.forEach((el) => { el.style.opacity = '0'; });
        c.animate([{ transform: `translate(${d.x - r.left}px,${d.y - r.top}px) scale(${d.w / r.width},${d.h / r.height})` }, { transform: 'none' }], { duration: 760, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }).finished.then(() => {
          c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: 'forwards' }).finished.then(() => c.remove());
        });
        rest.forEach((el, i) => { el.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 800, delay: 260 + i * 80, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }).finished.then(() => { el.style.opacity = ''; }); });
      }
    } catch (e) { /* ignore */ }
  }

  $$('.rail', main).forEach(GX.rail);
  GX.bindCards(main);
  GX.typo(main); GX.reveal(main);
})();
