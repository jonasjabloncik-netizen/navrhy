/* KZW koncept v2 – detail produktu: editoriální scéna, celý look, story, průvodce velikostí, galerie. */
(function () {
  'use strict';
  function init() {
    const K = window.KZW, D = K.D, $ = K.$, $$ = K.$$, G = K.G, esc = K.esc, fmt = K.fmt, I = K.I;
    const reduce = K.reduce;
    const root = $('#pdp'); if (!root) return;
    const qs = new URLSearchParams(location.search);
    const p = D.byId[qs.get('id')] || D.byId['volno-heavy-box-hoody'];
    document.body.dataset.pid = p.id;
    document.title = p.name + ' – Knedlo Zelo Wear (koncept)';
    const sizesOf = K.sizesOf, stockOf = K.stockOf, one = K.isOne(p);
    let ci = 0, size = one ? sizesOf(p)[0][0] : null;
    const st = K.stageOf(p);
    const fi = Math.min(p.images.length - 1, Math.max(0, parseInt(qs.get('fig') || '0', 10) || 0));
    const figUrl = p.images[fi];
    const masked = !!K.maskOf(figUrl);
    const meta = document.querySelector('meta[name=theme-color]'); if (meta) meta.content = st.bg;

    $('#crumbs').innerHTML = '<li><a href="index.html">Domů</a></li><li><a href="index.html#' + (p.vitrine ? 'vitrina' : 'drop') + '">' + (p.vitrine ? 'Vitrína' : 'Nový drop') + '</a></li><li><a href="#" data-soon>' + esc(D.cats[p.cat] || '') + '</a></li><li aria-current="page">' + esc(p.name) + '</li>';

    /* ---------- galerie: editoriální scéna + fotky ---------- */
    let story = null;
    D.stories.forEach(s => s.slides.forEach((sl, k) => { if (!story && sl.pid === p.id) story = { id: s.id, k, cover: sl.img, title: s.title }; }));
    const cap = (p.captions && p.captions[fi]) || '';
    const stageCls = 'gal-stage' + (masked ? '' : ' is-plain') + (p.vitrine ? ' is-niche' : '');
    const stageHTML = '<figure class="' + stageCls + '" style="--bg:' + (p.vitrine ? '#0b0b0b' : st.bg) + ';--fg:' + (p.vitrine ? '#f4f1ea' : st.fg) + ';--on:' + K.inkOn(p.vitrine ? '#000000' : st.bg) + '" data-lb="' + fi + '" data-cursor="Zvětšit">' +
      '<span class="gs-sl" aria-hidden="true">' + (p.vitrine ? [p.short] : st.lines).map(l => '<span>' + esc(l) + '</span>').join('') + '</span>' +
      '<span class="gs-fig" id="gs-fig">' + K.figHTML(figUrl) + '</span>' +
      (cap ? '<figcaption class="gs-cap">' + esc(cap) + '</figcaption>' : '') + '</figure>';
    const gal = $('#gal');
    gal.innerHTML = p.images.map((src, i) => '<figure class="gal-item" data-lb="' + i + '" data-cursor="Zvětšit"><img src="' + src + '" alt="' + esc(p.name) + ', fotka ' + (i + 1) + '" ' + (i > 1 ? 'loading="lazy"' : '') + ' decoding="async">' + (p.captions && p.captions[i] ? '<figcaption class="gal-cap">' + p.captions[i] + '</figcaption>' : '') + '</figure>').join('');
    if (story) gal.parentElement.insertAdjacentHTML('afterbegin', '<button class="gs-story" type="button" data-story="' + story.id + '" data-slide="' + story.k + '" data-cursor="Přehrát"><span class="sto-ring"><img src="' + D.u(story.cover) + '" alt=""></span><span>Story: ' + esc(story.title) + '</span></button>');

    const count = $('#gal-count'), items = $$('.gal-item', gal);
    const syncCount = () => { if (!count) return; const i = Math.round(gal.scrollLeft / gal.clientWidth); count.textContent = (Math.min(items.length - 1, i) + 1) + ' / ' + items.length; };
    gal.addEventListener('scroll', () => requestAnimationFrame(syncCount), { passive: true });
    syncCount();

    /* ---------- nákupní box ---------- */
    const favs = K.favs;
    const colorsHTML = p.colors
      ? '<div class="buy-block"><div class="buy-label"><span id="color-label">Barva: ' + esc(p.colors[0].name) + '</span></div><div class="colors" role="radiogroup" aria-labelledby="color-label">' + p.colors.map((c, i) => '<button class="sw" type="button" role="radio" data-ci="' + i + '" aria-checked="' + (i === 0) + '" aria-pressed="' + (i === 0) + '" aria-label="' + esc(c.name) + '" title="' + esc(c.name) + '" style="background:' + c.swatch + '"></button>').join('') + '</div></div>'
      : (p.family ? '<div class="buy-block"><div class="buy-label"><span>Barva: ' + esc(p.color) + '</span></div><div class="colors">' + D.products.filter(x => x.family === p.family).map(x => '<button class="sw" type="button" data-swap="' + x.id + '" aria-pressed="' + (x.id === p.id) + '" aria-label="' + esc(x.color) + '" title="' + esc(x.color) + '" style="background:' + x.swatch + '"></button>').join('') + '</div></div>'
        : (p.color ? '<div class="buy-block"><div class="buy-label"><span>Barva: ' + esc(p.color) + '</span></div></div>' : ''));
    const hasGuide = !!(p.measure || p.chart);
    const fitHTML = p.fit ? '<div class="fitnote">' + I.ruler + '<div><b>Jak to sedí:</b> ' + p.fit.map(f => esc(f)).join('. ') + '.</div></div>' : '';
    const look = D.looks[p.id];
    const lookSize = (p.captions && p.captions[fi] && (p.captions[fi].match(/·\s*(\w+)$/) || [])[1]) || '';
    const lookHTML = look ? '<div class="lookbox"><div class="lookbox-head"><b>Celý look</b><span>Jak to nosíme na focení</span></div><div class="lookbox-items">' +
      [p.id].concat(look).map((id, k) => (k ? '<i aria-hidden="true">+</i>' : '') + '<a href="produkt.html?id=' + id + '" title="' + esc(D.byId[id].name) + '"><img src="' + D.byId[id].images[0] + '" alt="' + esc(D.byId[id].name) + '"></a>').join('') +
      '</div><div class="lookbox-foot"><span>Dohromady ' + fmt([p.id].concat(look).reduce((a, id) => a + D.byId[id].price, 0)) + '</span><button class="btn btn-sm" type="button" data-look="' + p.id + '" data-look-size="' + esc(lookSize) + '" data-look-img="' + esc(figUrl) + '" data-look-who="' + esc(cap) + '">' + I.hanger + 'Sestavit look</button></div></div>' : '';
    const descHTML = '<p>' + esc(p.desc || p.tag + '.') + '</p><ul>' + p.bullets.map(b => '<li>' + esc(b) + '</li>').join('') + '</ul>';
    const sizeAcc = (p.fit ? '<ul>' + p.fit.map(f => '<li>' + esc(f) + '</li>').join('') + '</ul>' : '') + (hasGuide ? '<p><button type="button" class="textlink" data-sg>Otevřít průvodce velikostí</button></p>' : '<p>' + esc(sizesOf(p).map(s => s[0]).join(', ')) + '</p>');
    const tagLine = p.vitrine ? p.kind + ', ' + p.collab + '.' : p.tag + (/[.!?]$/.test(p.tag) ? '' : '.');
    $('#buy').innerHTML =
      (p.drop ? '<span class="buy-flag">Nový drop</span>' : (p.vitrine ? '<span class="buy-flag is-dark">' + esc(p.collab) + '</span>' : '')) +
      '<h1>' + esc(p.name) + '</h1><p class="buy-tag">' + esc(tagLine) + '</p><p class="buy-price">' + K.priceOf(p) + '</p>' +
      colorsHTML +
      '<div class="buy-block" id="size-block"><div class="buy-label"><span id="size-legend">' + (p.sizeLabel || 'Velikost') + '</span>' + (hasGuide ? '<button type="button" data-sg>' + I.ruler + 'Průvodce velikostí</button>' : '') + '</div>' +
      '<div class="sizes" id="sizes" role="radiogroup" aria-labelledby="size-legend"></div>' +
      '<p class="stock" id="stock" aria-live="polite"></p>' +
      '<div class="legend" id="legend"></div>' +
      '<div class="fitline" id="fitline"></div>' +
      '<form class="notify" id="notify"><input type="email" required placeholder="Tvůj e-mail" aria-label="E-mail pro hlídání velikosti"><button class="btn" type="submit">Hlídat</button></form></div>' +
      fitHTML +
      '<div class="buy-actions"><button class="btn btn-buy" type="button" id="add"><span class="btn-fill" aria-hidden="true"></span><span class="btn-txt"></span></button><button class="fav" type="button" data-fav="' + p.id + '" aria-pressed="' + favs.has(p.id) + '" aria-label="Uložit do oblíbených">' + I.heart + '</button></div>' +
      lookHTML +
      '<ul class="usps"><li>' + I.print + '<span>' + (p.lead ? 'Navrhujeme a tiskneme sami. ' + esc(p.lead) : 'Všechny designy si sami vymýšlíme a zpracováváme.') + '</span></li><li>' + I.swap + '<span>Výměnu nebo vrácení vyřídíš online přes formulář. Na vrácení máš 14 dní.</span></li><li>' + I.coin + '<span>Ceny v CZK i EUR.</span></li></ul>' +
      '<div class="acc"><details open><summary>Popis<i></i></summary><div class="acc-body">' + descHTML + '</div></details>' +
      (p.vitrine ? '' : '<details><summary>Velikost a střih<i></i></summary><div class="acc-body">' + sizeAcc + '</div></details>') +
      '<details><summary>Výroba a dodání<i></i></summary><div class="acc-body"><p>Všechny designy si sami vymýšlíme, zpracováváme i tiskneme.</p>' + (p.lead ? '<p>' + esc(p.lead) + '</p>' : '') + '</div></details>' +
      '<details><summary>Výměna a vrácení<i></i></summary><div class="acc-body"><p>Nesedí velikost? Výměnu nebo vrácení zadáš online přes formulář a my se postaráme o zbytek.</p></div></details></div>';

    const addBtn = $('#add'), addTxt = $('.btn-txt', addBtn), stock = $('#stock'), sizesEl = $('#sizes'), notify = $('#notify');
    if (p.vitrine) $('#size-block').classList.add('is-hidden');
    const drawSizes = () => {
      const list = sizesOf(p, ci);
      sizesEl.classList.toggle('is-few', list.length <= 3);
      sizesEl.innerHTML = list.map(([s, v]) => { const x = stockOf(v, p); return '<button class="size is-' + x.k + '" type="button" role="radio" aria-checked="' + (s === size) + '" data-s="' + esc(s) + '" title="' + esc(x.t) + '"><span>' + esc(s) + '</span></button>'; }).join('');
      const kinds = new Set(list.map(([, v]) => stockOf(v, p).k));
      $('#legend').innerHTML = (kinds.has('low') ? '<span class="l-low"><i></i>Poslední kusy</span>' : '') + (kinds.has('obj') ? '<span class="l-obj"><i></i>Tiskneme na objednávku</span>' : '') + (kinds.has('out') ? '<span><i style="background:repeating-linear-gradient(135deg,#fff 0 3px,#ddd 3px 6px)"></i>Momentálně není</span>' : '');
      sync();
    };
    const sync = () => {
      const list = sizesOf(p, ci);
      const v = size ? (list.find(s => s[0] === size) || [])[1] : undefined;
      $('#size-legend').textContent = (p.sizeLabel || 'Velikost') + (size && !one ? ': ' + size : '');
      if (size === null || v === undefined) {
        stock.className = 'stock'; stock.innerHTML = 'Vyber velikost.';
        addTxt.textContent = 'Přidat do košíku · ' + K.priceOf(p); notify.classList.remove('is-on'); return;
      }
      const x = stockOf(v, p);
      stock.className = 'stock is-' + x.k; stock.innerHTML = x.t ? '<i></i>' + esc(x.t) : '';
      notify.classList.toggle('is-on', x.k === 'out');
      addTxt.textContent = x.k === 'out' ? 'Hlídat dostupnost' : 'Přidat do košíku · ' + K.priceOf(p);
    };
    drawSizes();
    sizesEl.addEventListener('click', e => {
      const b = e.target.closest('.size'); if (!b) return;
      size = b.dataset.s;
      $$('.size', sizesEl).forEach(x => x.setAttribute('aria-checked', String(x === b)));
      if (G && !reduce) G.fromTo(b, { scale: 0.9 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1,.5)' });
      sync();
    });
    sizesEl.addEventListener('keydown', e => {
      if (!/Arrow(Left|Right)/.test(e.key)) return;
      const bs = $$('.size', sizesEl); const i = bs.indexOf(document.activeElement); if (i < 0) return;
      const n = bs[(i + (e.key === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length]; n.focus(); n.click(); e.preventDefault();
    });
    const colorWrap = $('.colors[role="radiogroup"]');
    colorWrap && colorWrap.addEventListener('click', e => {
      const b = e.target.closest('[data-ci]'); if (!b) return;
      ci = Number(b.dataset.ci); size = null;
      $$('[data-ci]', colorWrap).forEach(x => { x.setAttribute('aria-checked', String(x === b)); x.setAttribute('aria-pressed', String(x === b)); });
      $('#color-label').textContent = 'Barva: ' + p.colors[ci].name;
      drawSizes();
    });
    notify.addEventListener('submit', e => {
      e.preventDefault(); const i = $('input', notify);
      if (!i.checkValidity()) { i.focus(); return; }
      i.value = ''; K.toast('Hlídáme velikost ' + size + '. (V konceptu se nic neodesílá.)');
    });
    const tryAdd = fromImg => {
      const list = sizesOf(p, ci);
      const v = size ? (list.find(s => s[0] === size) || [])[1] : undefined;
      if (v === undefined) {
        K.scrollToEl($('#size-block'));
        sizesEl.classList.remove('shake'); void sizesEl.offsetWidth; sizesEl.classList.add('shake');
        stock.className = 'stock is-low'; stock.innerHTML = '<i></i>Nejdřív vyber velikost.';
        return;
      }
      if (v === 0) { $('input', notify).focus(); return; }
      if (v === 'obj') K.toast('Velikost ' + size + ' vytiskneme na objednávku (' + K.leadTime(p) + ')');
      if (G && !reduce) G.fromTo($('.btn-fill', addBtn), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut', onComplete: () => G.to($('.btn-fill', addBtn), { opacity: 0, duration: 0.3, onComplete: () => G.set($('.btn-fill', addBtn), { scaleX: 0, opacity: 1 }) }) });
      K.addToCart(p.id, size, p.colors ? p.colors[ci].name : '', fromImg);
    };
    addBtn.addEventListener('click', () => tryAdd($('.gal-item img', gal)));

    /* lepicí lišta */
    const sb = $('#sticky-buy');
    if (sb) {
      sb.innerHTML = '<img src="' + p.images[0] + '" alt=""><div><b>' + esc(p.name) + '</b><span>' + K.priceOf(p) + (size && !one ? ' · ' + esc(size) : '') + '</span></div><button class="btn" type="button">Do košíku</button>';
      $('button', sb).addEventListener('click', () => tryAdd($('img', sb)));
      document.body.classList.add('has-sticky');
      if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => sb.classList.toggle('is-on', !en.isIntersecting && en.boundingClientRect.top < 0), { threshold: 0 }).observe(addBtn);
    }

    /* materiál */
    const g = (p.bullets.join(' ').match(/(\d{3})\s*g\/m/) || [])[1];
    const spec = $('#spec');
    if (spec && g) {
      const mat = p.bullets.find(b => /bavln|polyester/i.test(b)) || '';
      const cut = p.bullets.find(b => /střih/i.test(b)) || '';
      spec.innerHTML = '<div class="spec-media"><img src="' + p.images[p.images.length - 1] + '" alt="Detail: ' + esc(p.name) + '" loading="lazy" data-par="6"></div><div class="spec-body"><p class="spec-big"><span id="spec-n">' + g + '</span><small>gramů na metr čtvereční</small></p><dl class="spec-list">' +
        (mat ? '<div><dt>Materiál</dt><dd>' + esc(mat.replace(/^Tiskneme na /i, '').replace(/^\w/, c => c.toUpperCase())) + '</dd></div>' : '') +
        (cut ? '<div><dt>Střih</dt><dd>' + esc(cut.split(',')[0]) + '</dd></div>' : '') +
        '<div><dt>Výroba</dt><dd>Navrhujeme a tiskneme sami</dd></div></dl></div>';
      if (G && window.ScrollTrigger && !reduce) {
        const o = { n: 0 };
        window.ScrollTrigger.create({ trigger: spec, start: 'top 75%', once: true, onEnter: () => G.to(o, { n: Number(g), duration: 1.4, ease: 'power3.out', onUpdate: () => { $('#spec-n').textContent = Math.round(o.n); } }) });
      }
    } else if (spec) spec.remove();

    /* doporučené */
    const recs = (p.vitrine ? D.vitrina.filter(x => x.id !== p.id) : D.products.filter(x => x.id !== p.id && x.cat === p.cat && !x.vitrine).concat(D.products.filter(x => x.id !== p.id && x.cat !== p.cat && x.drop))).slice(0, 4);
    $('#recs').innerHTML = recs.map(K.cardHTML).join('');

    sizeGuide(K, p, s => { size = s; drawSizes(); K.scrollToEl($('#size-block')); });
    lightbox(K, p);

    /* příjezd z karty nebo z runwaye */
    const arrived = K.zoomArrive($('.gal-item img', gal));
    if (G && !reduce) G.fromTo($('#buy').children, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.035, ease: 'power3.out', delay: arrived ? 0.55 : 0.05 });
  }

  /* ---------- velikost podle výšky: odhad z toho, co nosí modelové KZW ---------- */
  const ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  function anchorsOf(p) {
    return (p.fit || []).map(f => { const m = f.match(/(Modelka|Model)\D*?(\d{3})\s*cm.*?velikost\s+([A-Z0-9]+)/i); return m ? { who: m[1], h: Number(m[2]), s: m[3].toUpperCase() } : null; })
      .filter(a => a && ORDER.indexOf(a.s) >= 0);
  }
  function predict(K, p, h, build, loose) {
    const A = anchorsOf(p); if (!A.length) return null;
    const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
    const xs = A.map(a => a.h), ys = A.map(a => ORDER.indexOf(a.s)), mx = avg(xs), my = avg(ys);
    let slope = 0.125;
    if (A.length > 1) { const vx = xs.reduce((t, x) => t + (x - mx) * (x - mx), 0); if (vx > 0) { const sl = xs.reduce((t, x, i) => t + (x - mx) * (ys[i] - my), 0) / vx; if (sl > 0.05 && sl < 0.3) slope = sl; } }
    let v = my + slope * (h - mx);
    v += build === 'slim' ? -0.45 : build === 'strong' ? 0.9 : 0;
    if (loose) v += 1;
    const avail = K.sizesOf(p).map(s => s[0]).filter(s => ORDER.indexOf(s) >= 0);
    if (!avail.length) return null;
    let best = avail[0], bd = 1e9;
    avail.forEach(s => { const d = Math.abs(ORDER.indexOf(s) - v); if (d < bd - 1e-9) { bd = d; best = s; } });
    const fl = Math.floor(v), frac = v - fl, lo = ORDER[fl], hi = ORDER[fl + 1];
    const between = frac > 0.36 && frac < 0.64 && avail.indexOf(lo) >= 0 && avail.indexOf(hi) >= 0 ? [lo, hi] : null;
    if (between) best = hi;
    const ref = A.slice().sort((a, b) => Math.abs(a.h - h) - Math.abs(b.h - h))[0];
    const maxI = ORDER.indexOf(avail[avail.length - 1]), minI = ORDER.indexOf(avail[0]);
    return { size: best, v, between, ref, over: v > maxI + 0.6, under: v < minI - 0.6 };
  }
  const RULER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h18v8H3z M7 8v3 M11 8v4 M15 8v3 M19 8v4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
  function person(x, h, cls, label, sub) {
    // jednoduchá postava, výška v cm = jednotky viewBoxu
    const s = h / 100;
    return '<g class="' + cls + '" transform="translate(' + x + ' 226) scale(' + s + ') translate(-20 -100)">' +
      '<circle cx="20" cy="6.6" r="6.2"/><path d="M11 16.5 Q20 13 29 16.5 L32.5 45 Q32.6 48 30 48 L28.6 48 L27.6 97 Q27.4 100 24.8 100 L22.4 100 L21 58 L19 58 L17.6 100 L15.2 100 Q12.6 100 12.4 97 L11.4 48 L10 48 Q7.4 48 7.5 45 Z"/></g>' +
      '<text class="ff-t" x="' + x + '" y="' + (226 - h - 16) + '" text-anchor="middle">' + label + '</text><text class="ff-s" x="' + x + '" y="' + (226 - h - 4) + '" text-anchor="middle">' + sub + '</text>';
  }
  function sizeGuide(K, p, pick) {
    const $ = K.$, $$ = K.$$, esc = K.esc;
    const dlg = $('#sg'); if (!dlg) return;
    const body = $('#sg-body');
    const A = anchorsOf(p);
    const canFit = A.length && K.sizesOf(p).length > 1;
    const saved = K.store.get('fit', null) || {};
    const st = { h: saved.h || 175, b: saved.b || 'mid', f: saved.f || 'photo' };
    const oversize = (p.bullets || []).some(b => /oversize/i.test(b));
    let measureHTML = '';
    if (p.measure) {
      const m = p.measure;
      const avail = K.sizesOf(p).map(s => s[0]);
      const missing = avail.filter(s => m.sizes.indexOf(s) < 0);
      measureHTML =
        '<p class="sg-intro">' + esc(p.name) + ': rozměry v centimetrech podle tabulky KZW. Najeď na řádek a uvidíš, kde se měří.</p>' +
        '<div class="sg-fig"><svg viewBox="0 0 200 232" role="img" aria-label="Nákres mikiny s místy měření A, B a C">' +
        '<g fill="none" stroke="#000" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round">' +
        '<path d="M77 46c1-30 45-30 46 0"/>' +
        '<path d="M77 46c-12 2-24 6-31 13L24 168c-2 11 0 19 6 23l14 2c6 0 8-5 8-11l10-78v92c0 6 4 10 10 10h56c6 0 10-4 10-10v-92l10 78c0 6 2 11 8 11l14-2c6-4 8-12 6-23L154 59c-7-7-19-11-31-13-8 11-38 11-46 0z"/>' +
        '<path d="M72 150h56l6 32H66z"/><path d="M62 194h76"/><path d="M30 182l21 3M149 185l21-3"/></g>' +
        '<line class="m" data-m="A" x1="62" y1="104" x2="138" y2="104"/><text data-m="A" x="144" y="110">A</text>' +
        '<line class="m" data-m="B" x1="86" y1="52" x2="86" y2="204"/><text data-m="B" x="80" y="226">B</text>' +
        '<line class="m" data-m="C" x1="52" y1="62" x2="33" y2="186"/><text data-m="C" x="22" y="120">C</text>' +
        '</svg><ul class="sg-keys"><li data-m="A"><b>A</b><span>Šířka hrudníku, z podpaží do podpaží</span></li><li data-m="B"><b>B</b><span>Délka od ramene k dolnímu lemu</span></li><li data-m="C"><b>C</b><span>Délka rukávu od ramene k manžetě</span></li></ul></div>' +
        '<table class="sgt"><thead><tr><th scope="col">cm</th>' + m.sizes.map((s, i) => '<th scope="col" data-col="' + i + '">' + s + '</th>').join('') + '</tr></thead><tbody>' +
        ['A', 'B', 'C'].map(k => '<tr data-m="' + k + '"><th scope="row">' + k + '</th>' + m[k].map((v, i) => '<td data-col="' + i + '">' + String(v).replace('.', ',') + '</td>').join('') + '</tr>').join('') +
        '</tbody></table>' + (missing.length ? '<p class="sg-note">Rozměry pro ' + missing.join(', ') + ' doplníme.</p>' : '') +
        '<div class="calc"><h3>Znáš rozměr svojí mikiny?</h3><p>Polož ji naplocho a změř ji v podpaží (bod A). Porovnáme ji s VOLNO.</p>' +
        '<div class="calc-row"><label><input id="calc-in" type="number" inputmode="decimal" min="40" max="100" step="0.5" placeholder="např. 68" aria-label="Šířka tvé mikiny v podpaží v centimetrech"><span>cm</span></label></div><div class="calc-out" id="calc-out" aria-live="polite"></div></div>';
    } else if (p.chart) {
      measureHTML = '<p class="sg-intro">' + esc(p.name) + ': tabulka velikostí od KZW.</p><img class="sg-img" src="' + p.chart + '" alt="Tabulka velikostí" loading="lazy">';
    }
    const fitHTML = canFit ? '<section class="fitf" aria-labelledby="ff-head">' +
      '<div class="fitf-head"><h3 id="ff-head">Podle výšky</h3><p>Rozměry oblečení zná málokdo, výšku skoro každý. Velikost odhadneme podle toho, co nosí modelové na fotkách KZW.</p></div>' +
      '<div class="fitf-grid"><div class="fitf-form">' +
      '<div class="fitf-h"><label for="ff-h">Tvoje výška</label><div class="fitf-num"><input id="ff-h" type="number" inputmode="numeric" min="145" max="210" step="1" value="' + st.h + '"><span>cm</span></div></div>' +
      '<input class="fitf-range" id="ff-r" type="range" min="145" max="210" step="1" value="' + st.h + '" aria-label="Výška v centimetrech">' +
      '<p class="fitf-l" id="ff-bl">Postava</p><div class="seg" role="radiogroup" aria-labelledby="ff-bl">' + [['slim', 'Štíhlá'], ['mid', 'Průměrná'], ['strong', 'Silnější']].map(([k, t]) => '<button type="button" role="radio" data-b="' + k + '" aria-checked="' + (st.b === k) + '">' + t + '</button>').join('') + '</div>' +
      '<p class="fitf-l" id="ff-fl">Jak to chceš nosit</p><div class="seg" role="radiogroup" aria-labelledby="ff-fl">' + [['photo', 'Jako na fotkách'], ['loose', 'Volněji']].map(([k, t]) => '<button type="button" role="radio" data-f="' + k + '" aria-checked="' + (st.f === k) + '">' + t + '</button>').join('') + '</div>' +
      '</div><div class="fitf-out" aria-live="polite"><svg class="fitf-fig" viewBox="0 0 118 236" aria-hidden="true"></svg><div class="fitf-res" id="ff-res"></div></div></div>' +
      '<p class="fitf-note">Je to odhad. Přesná čísla najdeš v rozměrech níže' + (oversize ? '. Triko má oversize střih a odhad už s tím počítá.' : '.') + '</p></section>' : '';
    body.innerHTML = fitHTML + (measureHTML ? (canFit ? '<details class="fitf-more"><summary>Podle rozměrů oblečení</summary>' + measureHTML + '</details>' : measureHTML) : '') +
      (p.fit ? '<p class="sg-note">' + p.fit.map(esc).join('. ') + '.</p>' : '');

    const fitline = $('#fitline');
    const stockNote = s => { const v = (K.sizesOf(p).find(x => x[0] === s) || [])[1]; const k = K.stockOf(v, p); return k.k === 'out' ? 'Velikost ' + s + ' je teď vyprodaná, můžeš si zapnout hlídání.' : (k.k === 'obj' ? s + ' tiskneme na objednávku (' + K.leadTime(p) + ').' : (k.k === 'low' ? k.t + '.' : '')); };
    const drawLine = () => {
      if (!fitline || !canFit) return;
      const sv = K.store.get('fit', null);
      if (!sv) { fitline.innerHTML = RULER + '<span>Nevíš velikost?</span><button type="button" data-sg>Spočítat podle výšky</button>'; return; }
      const r = predict(K, p, sv.h, sv.b, sv.f === 'loose');
      fitline.innerHTML = RULER + '<span>Pro tvých ' + sv.h + ' cm doporučujeme <b>' + r.size + '</b></span><button type="button" class="fl-pick" data-fl="' + r.size + '">Vybrat ' + r.size + '</button><button type="button" data-sg>Upravit</button>';
    };
    const draw = () => {
      if (!canFit) return;
      const r = predict(K, p, st.h, st.b, st.f === 'loose');
      const fig = $('.fitf-fig', body), res = $('#ff-res');
      const refTxt = (r.ref.who === 'Modelka' ? 'Modelka' : 'Model') + ' ' + r.ref.h + ' cm nosí ' + r.ref.s + '.';
      const base = predict(K, p, st.h, 'mid', false);
      const d = st.h - r.ref.h;
      let why = refTxt + ' ';
      if (Math.abs(d) <= 2) why += 'Máš skoro stejnou výšku, podle ní ti vychází ' + base.size + '.';
      else why += 'Jsi o ' + Math.abs(d) + ' cm ' + (d < 0 ? 'menší' : 'vyšší') + ', podle výšky ti vychází ' + base.size + '.';
      const extra = [];
      if (base.between) extra.push('Jsi na hraně mezi ' + base.between[0] + ' a ' + base.between[1] + '. Doporučujeme ' + base.between[1] + ', ' + base.between[0] + ' bude víc na tělo.');
      const dat = [], loc = [];
      if (st.b === 'strong') { dat.push('silnější postavě'); loc.push('silnější postavě'); }
      if (st.b === 'slim') { dat.push('štíhlé postavě'); loc.push('štíhlé postavě'); }
      if (st.f === 'loose') { dat.push('volnějšímu nošení'); loc.push('volnějším nošení'); }
      if (r.size !== base.size && dat.length) extra.push('Kvůli ' + dat.join(' a ') + ' doporučujeme ' + r.size + '.');
      else if (loc.length) extra.push('I při ' + loc.join(' a ') + ' zůstává ' + r.size + '.');
      if (r.over) extra.push('Větší velikost teď v nabídce není.');
      if (r.under) extra.push('Menší velikost teď v nabídce není.');
      const sn = stockNote(r.size); if (sn) extra.push(sn);
      if (p.measure) { const i = p.measure.sizes.indexOf(r.size); if (i >= 0) extra.push(esc(p.name.split(' ')[0]) + ' v ' + r.size + ': šířka ' + String(p.measure.A[i]).replace('.', ',') + ' cm, délka ' + String(p.measure.B[i]).replace('.', ',') + ' cm.'); }
      res.innerHTML = '<span>Doporučujeme</span><b>' + r.size + '</b><p>' + esc(why) + '</p>' + extra.map(t => '<p>' + t + '</p>').join('') + '<button class="btn" type="button" data-pick="' + r.size + '">Vybrat ' + r.size + '</button>';
      const tall = Math.max(st.h, r.ref.h);
      fig.setAttribute('viewBox', '0 ' + (226 - tall - 34) + ' 118 ' + (tall + 44));
      fig.innerHTML = '<line x1="0" y1="226" x2="118" y2="226" stroke="#000" stroke-width="1.5"/>' + person(36, st.h, 'ff-you', 'Ty', st.h + ' cm') + person(88, r.ref.h, 'ff-ref', r.ref.who, r.ref.h + ' · ' + r.ref.s);
      K.store.set('fit', { h: st.h, b: st.b, f: st.f });
      drawLine();
    };
    if (canFit) {
      const hIn = $('#ff-h'), hR = $('#ff-r');
      const setH = v => { v = Math.round(Number(v)); if (!v || v < 145 || v > 210) return; st.h = v; hIn.value = v; hR.value = v; draw(); };
      hR.addEventListener('input', () => setH(hR.value));
      hIn.addEventListener('change', () => setH(hIn.value));
      hIn.addEventListener('input', () => { if (String(hIn.value).length === 3) setH(hIn.value); });
      body.addEventListener('click', e => {
        const b = e.target.closest('[data-b]'); if (b) { st.b = b.dataset.b; $$('[data-b]', body).forEach(x => x.setAttribute('aria-checked', String(x === b))); draw(); return; }
        const f = e.target.closest('[data-f]'); if (f) { st.f = f.dataset.f; $$('[data-f]', body).forEach(x => x.setAttribute('aria-checked', String(x === f))); draw(); }
      });
      if (saved.h) draw(); else { const r0 = predict(K, p, st.h, st.b, false); if (r0) { /* bez uložení: jen náhled */ draw(); K.store.set('fit', null); drawLine(); } }
    }
    drawLine();
    if (fitline) fitline.addEventListener('click', e => { const b = e.target.closest('[data-fl]'); if (b) { pick(b.dataset.fl); K.toast('Vybraná velikost ' + b.dataset.fl); } });
    if (p.measure) {
      const m = p.measure, avail = K.sizesOf(p).map(s => s[0]);
      const svg = $('.sg-fig svg', body);
      const hi = k => {
        $$('[data-m]', svg).forEach(el => el.classList.toggle('is-on', !k || el.dataset.m === k));
        $$('tbody tr', body).forEach(tr => tr.classList.toggle('is-on', tr.dataset.m === k));
      };
      $$('tbody tr, .sg-keys li', body).forEach(el => { el.addEventListener('mouseenter', () => hi(el.dataset.m)); el.addEventListener('mouseleave', () => hi(null)); });
      hi(null);
      const out = $('#calc-out'), inp = $('#calc-in');
      inp.addEventListener('input', () => {
        const x = parseFloat(String(inp.value).replace(',', '.'));
        $$('[data-col]', body).forEach(el => el.classList.remove('col-on'));
        if (!x || x < 40 || x > 100) { out.innerHTML = ''; return; }
        let bi = 0; m.A.forEach((v, i) => { if (Math.abs(v - x) < Math.abs(m.A[bi] - x)) bi = i; });
        const s = m.sizes[bi], diff = Math.round((m.A[bi] - x) * 10) / 10;
        $$('[data-col="' + bi + '"]', body).forEach(el => el.classList.add('col-on'));
        const rel = diff === 0 ? 'stejně široká jako tvoje mikina' : (diff > 0 ? 'o ' + String(diff).replace('.', ',') + ' cm širší než tvoje mikina' : 'o ' + String(-diff).replace('.', ',') + ' cm užší než tvoje mikina');
        out.innerHTML = 'Nejblíž je <b>' + s + '</b>. VOLNO v ' + s + ' bude ' + rel + '.' + (avail.indexOf(s) >= 0 ? '<br><button class="btn" type="button" data-pick="' + s + '">Vybrat ' + s + '</button>' : '');
      });
    }
    body.addEventListener('click', e => { const b = e.target.closest('[data-pick]'); if (b) { pick(b.dataset.pick); dlg.close(); K.toast('Vybraná velikost ' + b.dataset.pick); } });
    document.addEventListener('click', e => { if (e.target.closest('[data-sg]')) { if (!dlg.open) dlg.showModal(); const i = $('#ff-h'); if (i) setTimeout(() => i.focus({ preventScroll: true }), 60); } });
  }

  function lightbox(K, p) {
    const $ = K.$, $$ = K.$$;
    const dlg = $('#lb'); if (!dlg) return;
    const stage = $('.lb-stage', dlg), img = $('img', stage), cnt = $('#lb-count'), thumbs = $('.lb-thumbs', dlg);
    let i = 0, zoom = false;
    thumbs.innerHTML = p.images.map((s, k) => '<button type="button" data-k="' + k + '" aria-label="Fotka ' + (k + 1) + '"><img src="' + s + '" alt=""></button>').join('');
    const show = k => {
      i = (k + p.images.length) % p.images.length; zoom = false; stage.classList.remove('is-zoom'); img.style.transform = '';
      img.src = p.images[i]; img.alt = p.name + ', fotka ' + (i + 1);
      cnt.textContent = (i + 1) + ' / ' + p.images.length;
      $$('button', thumbs).forEach((b, k2) => b.setAttribute('aria-current', String(k2 === i)));
    };
    document.addEventListener('click', e => { const f = e.target.closest('[data-lb]'); if (f && !e.target.closest('.gs-story')) { show(Number(f.dataset.lb)); dlg.showModal(); } });
    $('.lb-prev', dlg).addEventListener('click', () => show(i - 1));
    $('.lb-next', dlg).addEventListener('click', () => show(i + 1));
    thumbs.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) show(Number(b.dataset.k)); });
    dlg.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); });
    stage.addEventListener('click', e => {
      if (e.target !== img) return;
      zoom = !zoom; stage.classList.toggle('is-zoom', zoom);
      const r = img.getBoundingClientRect();
      img.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%';
      img.style.transform = zoom ? 'scale(2.2)' : '';
    });
    stage.addEventListener('mousemove', e => {
      if (!zoom) return; const r = stage.getBoundingClientRect();
      img.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%';
    });
  }

  if (window.KZW && window.KZW.ready) init(); else document.addEventListener('kzw:ready', init, { once: true });
})();
