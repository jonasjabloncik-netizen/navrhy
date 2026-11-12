/* Caki·Cak – detail produktu (MALUS/01) */
(function () {
  const CC = window.CC, X = window.CCX;
  const { $, $$, fmt, esc, Baby, Cart, card, bindCards, HEART, on } = X;
  X.init();

  const qs = new URLSearchParams(location.search);
  const p = CC.byId(qs.get('p')) || CC.byId('souprava-mikina-a-kalhoty-cosy---nebesky-modra-2');
  document.title = p.name + ' · Caki·Cak · návrh MALUS/01';

  /* drobečky */
  const forL = p.cat === 'Sety' ? ['Novorozenci', 'index.html#darky'] : p.for === 'holcicky' ? ['Pro holčičky', 'index.html#vyber?pro=holcicky'] : p.for === 'chlapecky' ? ['Pro chlapečky', 'index.html#vyber?pro=chlapecky'] : ['Pro holčičky i chlapečky', 'index.html#vyber'];
  $('.crumbs').innerHTML = '<a href="index.html">Domů</a><span aria-hidden="true">/</span><a href="' + forL[1] + '">' + forL[0] + '</a><span aria-hidden="true">/</span><span>' + esc(p.cat) + '</span><span aria-hidden="true">/</span><span aria-current="page" style="color:var(--ink)">' + esc(p.short || p.name) + '</span>';

  /* galerie */
  const gal = $('.pdp__gal');
  const G = p.gallery;
  const coverCls = (w, h) => (Math.abs(w / h - 0.75) < 0.02 ? ' is-cover' : '');
  gal.classList.toggle('single', G.length < 2);
  gal.innerHTML = (G.length > 1 ? '<div class="thumbs" role="tablist" aria-label="Fotky produktu">' + G.map((f, i) => '<button type="button" role="tab" aria-current="' + (i === 0) + '" aria-label="Fotka ' + (i + 1) + '" data-g="' + i + '" style="--bg:' + p.bg + '"><img src="' + CC.img(f) + '" alt="" loading="lazy"></button>').join('') + '</div>' : '') +
    '<div class="stage" style="--bg:' + p.bg + '"><img class="' + coverCls(p.w, p.h).trim() + '" src="' + CC.img(G[0]) + '" alt="' + esc(p.name) + '" decoding="async"><img class="is-off" alt="" decoding="async">' + (p.gots ? '<span class="stage__badge">GOTS · bio bavlna</span>' : '') + '</div>' +
    '<div class="slider' + (G.length < 2 ? ' one' : '') + '">' + G.map((f, i) => '<div class="slide" style="--bg:' + p.bg + '"><img src="' + CC.img(f) + '" alt="' + (i ? '' : esc(p.name)) + '" loading="' + (i ? 'lazy' : 'eager') + '"></div>').join('') + '</div>' +
    (G.length > 1 ? '<div class="dots slider-dots" aria-hidden="true">' + G.map((f, i) => '<i class="' + (i ? '' : 'on') + '"></i>').join('') + '</div>' : '');
  $$('img', gal).forEach((im) => { const fix = () => { if (im.naturalWidth && Math.abs(im.naturalWidth / im.naturalHeight - 0.75) < 0.02 && !im.closest('.thumbs')) im.classList.add('is-cover'); }; if (im.complete) fix(); else im.addEventListener('load', fix); });
  gal.addEventListener('click', (e) => {
    const b = e.target.closest('[data-g]'); if (!b) return;
    const i = +b.dataset.g; $$('.thumbs button', gal).forEach((t) => t.setAttribute('aria-current', String(t === b)));
    const [a, c] = $$('.stage img', gal); const vis = a.classList.contains('is-off') ? c : a; const hid = vis === a ? c : a;
    hid.onload = () => { hid.classList.toggle('is-cover', Math.abs(hid.naturalWidth / hid.naturalHeight - 0.75) < 0.02); hid.classList.remove('is-off'); vis.classList.add('is-off'); };
    hid.alt = p.name; hid.src = CC.img(G[i]); if (hid.complete && hid.naturalWidth) hid.onload();
  });
  const slider = $('.slider', gal);
  if (slider && G.length > 1) slider.addEventListener('scroll', () => { const i = Math.round(slider.scrollLeft / (slider.firstElementChild.offsetWidth + 8)); $$('.slider-dots i', gal).forEach((d, k) => d.classList.toggle('on', k === i)); }, { passive: true });

  /* informace a nákup */
  const info = $('.pdp__info');
  let sel = null; const watched = {};
  const sizeCm = (s) => (s.covers.length > 1 ? s.covers[0] + '–' + s.covers[s.covers.length - 1] + ' cm' : s.cm + ' cm');
  const big = (s) => (s.covers.length > 1 || !/M$/.test(s.l) ? s.l : String(s.cm));
  const small = (s) => (s.covers.length > 1 || !/M$/.test(s.l) ? sizeCm(s) : s.l);
  function preselect() {
    const me = Baby.size();
    if (p.sizes.length === 1 && p.sizes[0].ok) sel = p.sizes[0].l;
    else if (me) { const h = p.sizes.find((x) => x.ok && x.covers.includes(me.id)); if (h) sel = h.l; }
  }
  const DAYS = ['neděle', 'pondělí', 'úterý', 'středy', 'čtvrtka', 'pátku', 'soboty']; // 2. pád: „do středy“
  // 3 pracovní dny; přeskočí víkendy a české státní svátky (včetně Velkého pátku a Velikonočního pondělí)
  function holidays(y) {
    const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    const em = Math.floor((h + l - 7 * m + 114) / 31), ed = ((h + l - 7 * m + 114) % 31) + 1; // Velikonoční neděle
    const easter = new Date(y, em - 1, ed);
    const add = (dt, n) => { const x = new Date(dt); x.setDate(x.getDate() + n); return (x.getMonth() + 1) + '-' + x.getDate(); };
    return ['1-1', '5-1', '5-8', '7-5', '7-6', '9-28', '10-28', '11-17', '12-24', '12-25', '12-26', add(easter, -2), add(easter, 1)];
  }
  function deliveryDate() {
    const d = new Date(); let n = 0;
    while (n < 3) { d.setDate(d.getDate() + 1); const w = d.getDay(); if (w && w !== 6 && !holidays(d.getFullYear()).includes((d.getMonth() + 1) + '-' + d.getDate())) n++; }
    return DAYS[d.getDay()] + ' ' + d.getDate() + '. ' + (d.getMonth() + 1) + '.';
  }

  function stockLine() {
    if (!p.sizes.length) return 'Skladem';
    const n = p.sizes.filter((x) => x.ok).length;
    if (p.sizes.length === 1) return n ? 'Skladem · velikost ' + p.sizes[0].cm + ' (' + p.sizes[0].l + ')' : 'Vyprodáno';
    if (n === p.sizes.length) return 'Skladem ve všech velikostech';
    if (!n) return 'Momentálně vyprodáno';
    return 'Skladem ' + n + ' z ' + p.sizes.length + ' velikostí';
  }
  function recLine() {
    const me = Baby.size(); const prof = Baby.get();
    if (!p.sizes.length) return '';
    if (!me && p.sizes.length === 1) return '';
    if (!me) return '<p class="rec"><span>Nevíte, jakou velikost? Zadejte, kolik miminko měří, a&nbsp;doporučíme ji.</span><button class="btn btn--ghost" type="button" data-mm>' + HEART + ' Kolik měří miminko?</button></p>';
    const h = p.sizes.find((x) => x.covers.includes(me.id));
    const who = prof && prof.mode === 'cm' ? 'Pro vaše miminko (' + prof.value + ' cm)' : 'Pro vaše miminko';
    if (h && h.ok) return '<p class="rec">' + HEART + '<span>' + who + ' doporučujeme <b>' + big(h) + ' (' + small(h) + ')</b>.</span>' + (sel === h.l ? '' : '<button class="btn btn--ghost" type="button" data-pick="' + esc(h.l) + '">Vybrat ' + big(h) + '</button>') + '<button class="link" type="button" data-mm style="font-size:13.5px">Změnit</button></p>';
    if (h && !h.ok) {
      const alt = p.sizes.find((x) => x.ok && x.cm > h.cm);
      return '<p class="rec">' + HEART + '<span>Vaše velikost ' + big(h) + ' je vyprodaná.' + (alt ? ' Skladem je o číslo větší <b>' + big(alt) + ' (' + small(alt) + ')</b>.' : '') + '</span>' + (alt && sel !== alt.l ? '<button class="btn btn--ghost" type="button" data-pick="' + esc(alt.l) + '">Vybrat ' + big(alt) + '</button>' : '') + '</p>';
    }
    return '<p class="rec">' + HEART + '<span>Ve velikosti ' + me.cm + ' (' + me.label + ') se tento kousek nevyrábí.' + (p.cat === 'Sety' ? ' Kojenecké sety jsou ve velikosti 56 (0–3M).' : '') + '</span><button class="link" type="button" data-mm style="font-size:13.5px">Změnit velikost</button></p>';
  }
  function buyLabel() {
    if (!p.sizes.length) return Cart.has(p.id, '') ? ['✓ V košíku', 1] : ['Přidat do košíku', 0];
    const s = p.sizes.find((x) => x.l === sel);
    if (!s) return ['Vyberte velikost', 0];
    if (!s.ok) return ['Velikost ' + big(s) + ' je vyprodaná', 0];
    return Cart.has(p.id, s.l) ? ['✓ V košíku · ' + big(s), 1] : ['Přidat do košíku · ' + big(s), 0];
  }
  function render() {
    const me = Baby.size();
    const s = p.sizes.find((x) => x.l === sel);
    const [lab, done] = buyLabel();
    const desc = p.desc && p.desc.length;
    info.innerHTML =
      '<p class="pi__brand">' + esc(p.brand) + (p.col ? ' · kolekce ' + esc(p.col) : '') + (p.line === 'premium' ? ' · prémiová řada' : '') + '</p>' +
      '<h1 class="pi__name">' + esc(p.name) + '</h1>' +
      '<div class="pi__price"><b>' + fmt(p.price) + '</b><span class="pi__stock">' + stockLine() + '</span>' + (p.rating ? '<span class="pi__rating">★ ' + p.rating.v + ' · ' + p.rating.n + ' hodnocení</span>' : '') + '</div>' +
      (p.gots ? '<p class="pi__gots"><span><b>Bio bavlna s&nbsp;certifikací GOTS.</b> Pěstovaná bez běžných pesticidů a&nbsp;chemického hnojení, s&nbsp;kontrolou celého řetězce výroby včetně barviv.</span></p>' : '') +
      (p.sizes.length ? '<div class="pi__sec"><div class="pi__row"><h2>Velikost' + (s ? ': ' + big(s) + ' · ' + small(s) : '') + '</h2><button type="button" data-mm>Tabulka velikostí</button></div>' +
        '<div class="szg" role="radiogroup" aria-label="Velikost">' + p.sizes.map((x) => {
          const isMe = me && x.covers.includes(me.id);
          return '<button type="button" class="sz' + (x.ok ? '' : ' so') + (isMe ? ' me' : '') + '" role="radio" aria-checked="' + (sel === x.l) + '" aria-pressed="' + (sel === x.l) + '" data-sz="' + esc(x.l) + '" aria-label="' + esc(big(x) + ', ' + small(x) + ', ' + (x.ok ? 'skladem' : 'vyprodáno') + (isMe ? ', vaše velikost' : '')) + '">' + (isMe ? HEART : '') + '<b>' + esc(big(x)) + '</b><small>' + esc(small(x)) + '</small><em>' + (x.ok ? 'skladem' : 'vyprodáno') + '</em></button>';
        }).join('') + '</div>' + recLine() +
        (s && !s.ok ? '<div class="watch"><span>' + (watched[s.l] ? '✓ Hlídáme velikost ' + big(s) + '. V hotovém e-shopu sem zákaznice zadá e-mail (Hlídací pes v Shoptetu).' : 'Velikost ' + big(s) + ' je vyprodaná. Dáme vědět, až bude zpátky.') + '</span>' + (watched[s.l] ? '' : '<button class="btn btn--ghost btn--sm" type="button" data-watch>Hlídat dostupnost</button>') + '</div>' : '') +
        '</div>' : '<p class="pi__stock" style="margin-top:18px">Jedna velikost</p>') +
      '<div class="buy"><button class="btn btn--block' + (done ? ' is-done' : '') + '" type="button" data-buy' + (s && !s.ok ? ' disabled' : '') + '>' + lab + '</button>' +
      '<p class="buy__after" data-after>' + (done ? '<button class="link" type="button" data-opencart>Zobrazit košík (' + Cart.count() + ')</button><span>Další kus přidáte v košíku.</span>' : '') + '</p></div>' +
      '<div class="deliv"><p><b>Můžeme doručit do ' + deliveryDate() + '</b></p><p>Doprava od 79&nbsp;Kč: PPL Smart Box, Balíkovna nebo GLS. Po Česku i&nbsp;na Slovensku.</p><p>Vrácení do 14 dnů, třeba zpětnou zásilkou přes Zásilkovnu.</p></div>' +
      '<div class="acc">' +
      (desc ? '<details open><summary>Popis</summary><div class="acc__body">' + p.desc.map((t) => '<p>' + esc(t) + '</p>').join('') + '</div></details>' : '') +
      (p.inSet ? '<details' + (desc ? '' : ' open') + '><summary>Co je v&nbsp;setu</summary><div class="acc__body"><div class="inset">' + p.inSet.items.map((t) => '<span>' + esc(t) + '</span>').join('') + '</div></div></details>' : '') +
      '<details' + (desc || p.inSet ? '' : ' open') + '><summary>Materiál a&nbsp;péče</summary><div class="acc__body"><table><tr><td>Materiál</td><td>' + esc(p.mat) + '</td></tr><tr><td>Barva</td><td>' + esc(p.color) + '</td></tr>' + (p.pieces ? '<tr><td>Balení</td><td>' + p.pieces + ' dílů</td></tr>' : '') + (p.sizes.length ? '<tr><td>Velikosti</td><td>' + p.sizes.map((x) => esc(x.l)).join(', ') + '</td></tr>' : '') + '</table><p style="margin-top:12px">' + esc(CC.CARE) + '</p></div></details>' +
      '<details><summary>Odkud to je</summary><div class="acc__body"><p>Značka ' + esc(p.brand) + '. Vyrábí ' + esc(p.maker.maker) + ', ' + esc(p.maker.place) + '. Do EU dováží MB&amp;TZ production s.r.o., Školská 660/3, Praha 1.</p>' + (p.gots ? '<p>' + esc(CC.GOTS_TEXT) + '</p>' : '') + '</div></details>' +
      '<details><summary>Doprava a&nbsp;vrácení</summary><div class="acc__body"><table>' + CC.SHIPPING.map((x) => '<tr><td>' + esc(x.name) + '</td><td>' + fmt(x.price) + '</td></tr>').join('') + '</table><p style="margin-top:12px">Platba kartou online, převodem nebo na dobírku. Zboží můžete do 14 dnů od převzetí vrátit, nejsnáz zpětnou zásilkou přes Zásilkovnu (62&nbsp;Kč).</p></div></details>' +
      '</div>';
    sbar();
  }

  /* lepicí lišta */
  const bar = $('.sbar');
  function sbar() {
    const [lab, done] = buyLabel();
    const s = p.sizes.find((x) => x.l === sel);
    bar.innerHTML = '<div class="sbar__in"><img class="sbar__img" src="' + CC.img(p.img) + '" alt="" style="--bg:' + p.bg + '"><div style="min-width:0"><p class="sbar__n">' + esc(p.short || p.name) + '</p><p class="sbar__p">' + fmt(p.price) + (s ? ' · ' + big(s) + ' (' + small(s) + ')' : '') + '</p></div>' +
      '<div class="sbar__sz">' + (p.sizes.length > 1 ? p.sizes.map((x) => '<button type="button" class="chip chip--sm' + (x.ok ? '' : ' is-so') + (sel === x.l ? ' is-sel' : '') + '" data-sz="' + esc(x.l) + '" aria-pressed="' + (sel === x.l) + '" aria-label="' + esc(big(x) + ', ' + (x.ok ? 'skladem' : 'vyprodáno')) + '">' + esc(big(x)) + '</button>').join('') : '') + '</div>' +
      '<button class="btn' + (done ? ' is-done' : '') + '" type="button" data-buy' + (s && !s.ok ? ' disabled' : '') + '>' + (p.sizes.length && !s && window.innerWidth < 760 ? 'Vybrat velikost' : lab) + '</button></div>';
  }
  const mq = window.matchMedia('(max-width:760px)');
  let barOn = null, tick = 0;
  function barVis(show) { if (show === barOn) return; barOn = show; bar.classList.toggle('on', show); bar.setAttribute('aria-hidden', String(!show)); document.body.classList.toggle('has-bar', show && mq.matches); document.body.classList.toggle('bar-on', show); }
  function checkBar() {
    tick = 0;
    const b = $('[data-buy]', info); if (!b) return;
    const r = b.getBoundingClientRect();
    const visible = r.top < window.innerHeight - 20 && r.bottom > 0;
    barVis(mq.matches ? !visible : r.bottom < 0);
  }
  window.addEventListener('scroll', () => { if (!tick) tick = requestAnimationFrame(checkBar); }, { passive: true });
  window.addEventListener('resize', () => { if (!tick) tick = requestAnimationFrame(checkBar); });
  setTimeout(checkBar, 60);

  function buy(from) {
    const s = p.sizes.find((x) => x.l === sel);
    if (p.sizes.length && !s) {
      const g = $('.szg', info); g.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const first = $('.sz:not(.so)', g); if (first) setTimeout(() => first.focus({ preventScroll: true }), 350);
      X.toast('<span>Vyberte prosím velikost.</span>');
      return;
    }
    if (s && !s.ok) return;
    const key = s ? s.l : '';
    if (Cart.has(p.id, key)) { X.Drawer.open(); return; }
    Cart.add(p.id, key);
    X.added(p, s ? big(s) + ' · ' + small(s) : '');
    void from;
  }
  function onClick(e) {
    const z = e.target.closest('[data-sz]'); if (z) { sel = z.dataset.sz; render(); const t = $('.sz[data-sz="' + CSS.escape(sel) + '"]', info); if (t && e.currentTarget === info) t.focus({ preventScroll: true }); return; }
    const pk = e.target.closest('[data-pick]'); if (pk) { sel = pk.dataset.pick; render(); return; }
    if (e.target.closest('[data-buy]')) { buy(e.currentTarget); render(); return; }
    if (e.target.closest('[data-mm]')) { X.MM.openModal(); return; }
    if (e.target.closest('[data-watch]')) { watched[sel] = 1; render(); return; }
    if (e.target.closest('[data-opencart]')) X.Drawer.open();
  }
  info.addEventListener('click', onClick); bar.addEventListener('click', onClick);
  info.addEventListener('keydown', (e) => {
    if (!e.target.classList.contains('sz') || !['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const all = $$('.sz', info); const i = all.indexOf(e.target); const n = all[(i + (e.key === 'ArrowRight' ? 1 : -1) + all.length) % all.length]; n.focus(); e.preventDefault();
  });

  on('cart', render);
  on('baby', () => { const me = Baby.size(); if (me) { const h = p.sizes.find((x) => x.ok && x.covers.includes(me.id)); if (h) sel = h.l; } render(); });
  preselect(); render();

  /* K tomu se hodí */
  const more = CC.PRODUCTS.filter((q) => q.id !== p.id && ((p.col && q.col === p.col) || (!p.col && q.line === p.line && q.for === p.for)));
  const fill = CC.PRODUCTS.filter((q) => q.id !== p.id && !more.includes(q) && (q.for === p.for || q.for === 'oba') && q.cat !== p.cat);
  const list = more.concat(fill).slice(0, 4);
  const mg = $('[data-more]'); mg.innerHTML = list.map((q) => card(q)).join(''); bindCards(mg);
  X.reveal();
})();
