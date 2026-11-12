/* Caki·Cak – návrh MALUS/01 · společné: stav, hlavička, karty, rychlé přidání, košík, Moje miminko, příběhy */
(function () {
  const CC = window.CC;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NB = ' ';
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* bez úložiště */ } }
  };
  const ss = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* nic */ } }
  };
  const fmt = (n) => n.toLocaleString('cs-CZ').replace(/\s/g, NB) + NB + 'Kč';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const subs = {};
  const on = (ev, fn) => (subs[ev] = subs[ev] || []).push(fn);
  const emit = (ev, d) => (subs[ev] || []).forEach((fn) => fn(d));

  const ICON = {
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    prev: '<svg viewBox="0 0 24 24"><path d="m14.5 6-6 6 6 6"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="m9.5 6 6 6-6 6"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M9 6v12M15 6v12"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M8 6.5v11l9-5.5z"/></svg>'
  };
  const HEART = '<i class="hrt" aria-hidden="true"></i>';

  /* ---------- Moje miminko (podle tabulky velikostí Čakičak) ---------- */
  const S = CC.SIZES;
  const sizeName = (s) => s.cm + ' (' + s.label + ')';
  const monthsWord = (n) => (n === 1 ? 'měsíc' : n >= 2 && n <= 4 ? 'měsíce' : 'měsíců');
  const Baby = {
    get() { return store.get('cc-miminko', null); },
    set(p, src) { store.set('cc-miminko', p); emit('baby', src || null); },
    clear(src) { try { localStorage.removeItem('cc-miminko'); } catch (e) { /* nic */ } emit('baby', src || null); },
    size() { const p = Baby.get(); return p ? S.find((s) => s.id === p.size) : null; },
    byCm(cm) {
      if (cm > 110) return { size: S[9], next: null, over: true, text: 'Miminko měří ' + cm + ' cm. Největší velikost v e-shopu je ' + sizeName(S[9]) + '.' };
      const i = S.findIndex((s) => s.cm >= cm);
      const size = S[i];
      const prev = S[i - 1];
      const next = S[i + 1] || null;
      let text;
      if (i === 0) text = 'Pro miminko do 56 cm je nejmenší velikost ' + sizeName(size) + '.';
      else if (size.cm === cm) text = 'Velikost ' + sizeName(size) + ' sedne přesně. Miminka ale rostou rychle, takže se do zásoby hodí i ' + (next ? sizeName(next) : 'větší velikost') + '.';
      else text = 'Miminko měří ' + cm + ' cm, tedy mezi velikostmi ' + prev.cm + ' a ' + size.cm + '. Podle tabulky velikostí Čakičak doporučujeme větší, ' + sizeName(size) + '.';
      return { size, next, text };
    },
    byAge(i) {
      const size = S[i];
      const next = S[i + 1] || null;
      return { size, next, text: 'Věk je jen orientační, každé dítě roste jinak. Pokud znáte délku miminka, vyberte raději podle ní.' + (next ? ' Na dárek se hodí spíš o číslo větší, ' + sizeName(next) + '.' : '') };
    }
  };
  const AGE_TXT = ['0–3 měsíce', '3–6 měsíců', '6–9 měsíců', '9–12 měsíců', '12–18 měsíců', '18–24 měsíců', '2 roky', '3 roky', '4 roky', '5 let'];

  // stav velikosti produktu vůči profilu
  function mineFor(p, sz) {
    if (!sz || !p.sizes.length) return null;
    const hit = p.sizes.find((x) => x.covers.includes(sz.id));
    if (!hit) return { st: 'none', s: null };
    return { st: hit.ok ? 'ok' : 'so', s: hit };
  }
  function mineText(m, sz) {
    if (!m) return '';
    if (m.st === 'ok') return 'Ve vaší velikosti ' + sz.cm + ' skladem';
    if (m.st === 'so') return 'Vaše velikost ' + sz.cm + ' je vyprodaná';
    return 'Ve velikosti ' + sz.cm + ' se nevyrábí';
  }

  /* ---------- Košík ---------- */
  const Cart = {
    items: store.get('cc-kosik', []),
    save() { store.set('cc-kosik', Cart.items); emit('cart'); },
    add(id, size, qty) {
      const it = Cart.items.find((x) => x.id === id && x.size === size);
      if (it) it.qty += qty || 1; else Cart.items.push({ id, size: size || '', qty: qty || 1 });
      Cart.save();
    },
    has(id, size) { return Cart.items.some((x) => x.id === id && x.size === (size || '')); },
    count() { return Cart.items.reduce((a, x) => a + x.qty, 0); },
    total() { return Cart.items.reduce((a, x) => { const p = CC.byId(x.id); return a + (p ? p.price * x.qty : 0); }, 0); }
  };

  /* ---------- Toast ---------- */
  let toastT;
  function hideToast() { clearTimeout(toastT); const t = $('.toast'); if (t) t.classList.remove('on'); }
  function toast(html) {
    let t = $('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.innerHTML = html;
    requestAnimationFrame(() => t.classList.add('on'));
    clearTimeout(toastT);
    toastT = setTimeout(hideToast, 3500);
    const b = t.querySelector('[data-open-cart]');
    if (b) b.addEventListener('click', () => Drawer.open());
  }
  function added(p, sizeLabel) {
    toast('<span>✓ V košíku: ' + esc(p.short || p.name) + (sizeLabel ? ' · ' + esc(sizeLabel) : '') + '</span><button type="button" data-open-cart>Zobrazit košík (' + Cart.count() + ')</button>');
  }

  /* ---------- Karta produktu ---------- */
  function sizeLabelOf(s) { return s.covers.length === 1 && /M$/.test(s.l) ? String(s.cm) : s.l; }
  function sizesLine(p, sz) {
    if (!p.sizes.length) return '<p class="sizes"><span>Jedna velikost</span></p>';
    return '<p class="sizes" aria-label="Velikosti">' + p.sizes.map((s) => {
      const me = sz && s.covers.includes(sz.id);
      const t = sizeLabelOf(s);
      return '<span class="' + (s.ok ? '' : 'so') + (me ? ' me' : '') + '"' + (s.ok ? '' : ' title="vyprodáno"') + '>' + esc(t) + (s.ok ? '' : '<span class="sr-only"> vyprodáno</span>') + '</span>';
    }).join('') + '</p>';
  }
  function card(p, o) {
    o = o || {};
    const sz = Baby.size();
    const m = mineFor(p, sz);
    const cover = Math.abs(p.w / p.h - 0.75) < 0.02 ? ' is-cover' : '';
    const href = 'produkt.html?p=' + encodeURIComponent(p.id);
    return '<article class="pcard" data-id="' + p.id + '">' +
      '<div class="pcard__plate-wrap"><a class="pcard__plate' + cover + '" href="' + href + '" style="--bg:' + p.bg + '" aria-label="' + esc(p.name) + '">' +
      '<img src="' + CC.img(p.img) + '" alt="' + esc(p.name) + '" loading="' + (o.eager ? 'eager' : 'lazy') + '" decoding="async" width="' + p.w + '" height="' + p.h + '">' +
      (p.gots ? '<span class="pcard__badge">GOTS</span>' : '') + '</a>' +
      '<button class="quick" type="button" aria-label="Rychle přidat ' + esc(p.short || p.name) + '">' + ICON.plus + '</button>' +
      '<div class="qbar" role="group" aria-label="Rychle přidat do košíku">' + qbarInner(p) + '</div></div>' +
      '<div class="pcard__meta"><h3 class="pcard__name"><a href="' + href + '">' + esc(p.name) + '</a></h3>' +
      '<div class="pcard__row"><span class="pcard__brand">' + esc(p.brand) + (p.gots ? ' · bio bavlna' : '') + '</span><span class="pcard__price">' + fmt(p.price) + '</span></div>' +
      sizesLine(p, sz) +
      (m ? '<p class="mine' + (m.st === 'ok' ? '' : ' no') + '">' + HEART + mineText(m, sz) + '</p>' : '') +
      '</div></article>';
  }
  function qbarInner(p) {
    const sz = Baby.size();
    if (!p.sizes.length) {
      const inC = Cart.has(p.id, '');
      return '<div class="qbar__t"><span>' + (inC ? '✓ V košíku' : 'Jedna velikost') + '</span></div><div class="qbar__sizes"><button type="button" class="chip' + (inC ? ' is-added' : '') + '" data-add="">' + (inC ? '✓ Přidáno' : 'Přidat do košíku') + '</button></div>';
    }
    const added = p.sizes.filter((s) => Cart.has(p.id, s.l));
    return '<div class="qbar__t"><span>' + (added.length ? '✓ V košíku · ' + added.map((s) => sizeLabelOf(s)).join(', ') : 'Vyberte velikost') + '</span>' + (sz ? '<span>' + HEART + ' = vaše</span>' : '') + '</div>' +
      '<div class="qbar__sizes">' + p.sizes.map((s) => {
        const me = sz && s.covers.includes(sz.id);
        const inC = Cart.has(p.id, s.l);
        return '<button type="button" class="chip chip--sm' + (s.ok ? '' : ' is-so') + (me ? ' is-me' : '') + (inC ? ' is-added' : '') + '" data-add="' + esc(s.l) + '"' + (s.ok ? '' : ' disabled aria-disabled="true"') + ' aria-label="' + esc(s.l + ' · ' + s.cm + ' cm' + (s.ok ? '' : ' · vyprodáno')) + '">' + (me ? HEART : '') + (inC ? '✓ ' : '') + esc(sizeLabelOf(s)) + '</button>';
      }).join('') + '</div>';
  }
  function bindCards(root) {
    root.addEventListener('click', (e) => {
      const q = e.target.closest('.quick');
      if (q) { const c = q.closest('.pcard'); $$('.pcard.is-open', root).forEach((x) => x !== c && x.classList.remove('is-open')); c.classList.toggle('is-open'); return; }
      const a = e.target.closest('[data-add]');
      if (a && !a.disabled) {
        const c = a.closest('.pcard'); const p = CC.byId(c.dataset.id); const s = a.dataset.add;
        Cart.add(p.id, s);
        c.querySelector('.qbar').innerHTML = qbarInner(p);
        const sz = p.sizes.find((x) => x.l === s);
        added(p, sz ? sz.l + ' · ' + sz.cm + ' cm' : '');
      }
    });
  }
  function rerenderCards() {
    $$('.pcard').forEach((c) => {
      const p = CC.byId(c.dataset.id); if (!p) return;
      const sz = Baby.size(); const m = mineFor(p, sz);
      const meta = c.querySelector('.pcard__meta');
      meta.querySelector('.sizes').outerHTML = sizesLine(p, sz);
      const old = meta.querySelector('.mine'); if (old) old.remove();
      if (m) meta.insertAdjacentHTML('beforeend', '<p class="mine' + (m.st === 'ok' ? '' : ' no') + '">' + HEART + mineText(m, sz) + '</p>');
      c.querySelector('.qbar').innerHTML = qbarInner(p);
    });
  }

  /* ---------- Hlavička, patička ---------- */
  // 4. hodnota = priorita: když se menu nevejde vedle loga, schová se nejdřív položka s vyšším číslem (logo zůstává na středu)
  const NAV = [
    ['Novorozenci', 'index.html#darky', 0, 1], ['Pro holčičky', 'index.html#vyber?pro=holcicky', 0, 1], ['Pro chlapečky', 'index.html#vyber?pro=chlapecky', 0, 1],
    ['Sety', 'index.html#darky', 0, 3], ['Doplňky', 'index.html#vyber?pro=doplnky', 0, 2], ['GEOX', CC.SHOP + 'geox-3/', 1, 5], ['Novinky', 'index.html#vyber', 0, 4]
  ];
  function header() {
    const h = $('#hdr'); if (!h) return;
    h.innerHTML = '<div class="topbar"><span class="tb-concept">Koncept od MALUS/01</span><span>Doručujeme po Česku i na Slovensko</span><span>Doprava od 79' + NB + 'Kč</span><span>Vrácení do 14 dnů</span></div>' +
      '<header class="hdr"><div class="hdr__in">' +
      '<div class="hdr__l"><button class="icon-btn burger" type="button" aria-label="Menu" aria-expanded="false">' + ICON.menu + '</button>' +
      '<button class="icon-btn hdr__search-m" type="button" data-search aria-label="Hledat">' + ICON.search + '</button>' +
      '<nav class="hdr__nav" aria-label="Hlavní menu">' + NAV.map((n) => '<a href="' + n[1] + '" data-pri="' + n[3] + '"' + (n[2] ? ' class="is-ext" target="_blank" rel="noopener"' : '') + '>' + n[0] + '</a>').join('') + '</nav></div>' +
      '<a class="hdr__logo' + (document.getElementById('hero') ? ' is-away' : '') + '" href="index.html" aria-label="Caki·Cak – úvod"><img src="assets/img/brand/logo-cakicak.svg" alt="Caki·Cak Kids Boutique" width="150" height="53"></a>' +
      '<div class="hdr__tools"><button class="baby-pill" type="button" data-baby>' + '<i class="hrt" aria-hidden="true"></i><span class="lbl">Moje miminko</span></button>' +
      '<button class="icon-btn" type="button" data-search aria-label="Hledat">' + ICON.search + '</button>' +
      '<button class="icon-btn" type="button" data-cart aria-label="Košík">' + ICON.bag + '<span class="lbl">Košík</span><span class="cart-count">0</span></button></div>' +
      '</div><div class="mnav" hidden></div></header>';
    $('[data-cart]', h).addEventListener('click', () => Drawer.open());
    $$('[data-search]', h).forEach((b) => b.addEventListener('click', () => Search.open()));
    $('[data-baby]', h).addEventListener('click', () => MM.openModal());
    const bur = $('.burger', h); const mnav = $('.mnav', h);
    mnav.innerHTML = NAV.map((n) => '<a href="' + n[1] + '"' + (n[2] ? ' target="_blank" rel="noopener"' : '') + '>' + n[0] + '</a>').join('') + '<a href="index.html#pribeh">Můj příběh</a>';
    bur.addEventListener('click', () => { const o = mnav.hidden; mnav.hidden = !o; bur.setAttribute('aria-expanded', String(o)); });
    mnav.addEventListener('click', (e) => { if (e.target.closest('a')) { mnav.hidden = true; bur.setAttribute('aria-expanded', 'false'); } });
    updHeader();
    // menu se musí vejít do levé poloviny, aby logo zůstalo přesně uprostřed; co se nevejde, schová se podle priority
    const hdr = $('.hdr', h), nav = $('.hdr__nav', h), col = $('.hdr__l', h);
    const fitNav = () => {
      const items = [...nav.children];
      items.forEach((a) => a.classList.remove('is-cut')); hdr.classList.remove('hdr--tight');
      if (getComputedStyle(nav).display === 'none') return;
      const room = col.clientWidth - 40; // aspoň 40 px vzduchu před logem
      const used = () => nav.scrollWidth;
      for (const a of items.slice().sort((x, y) => y.dataset.pri - x.dataset.pri)) { if (used() <= room) break; if (+a.dataset.pri > 1) a.classList.add('is-cut'); }
      if (used() > room) hdr.classList.add('hdr--tight');
    };
    let fq = 0; window.addEventListener('resize', () => { if (!fq) fq = requestAnimationFrame(() => { fq = 0; fitNav(); }); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNav);
    fitNav();
  }
  function updHeader() {
    const c = $('.cart-count'); if (c) { c.textContent = Cart.count(); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); setTimeout(() => c.classList.remove('bump'), 350); }
    const pill = $('[data-baby]'); const sz = Baby.size();
    if (pill) {
      pill.classList.toggle('is-set', !!sz);
      $('.lbl', pill).textContent = sz ? 'Vaše velikost ' + sz.cm : 'Moje miminko';
      pill.setAttribute('aria-label', sz ? 'Moje miminko: velikost ' + sz.cm + ' (' + sz.label + '), změnit' : 'Moje miminko: zadat velikost');
    }
  }
  function footer() {
    const f = $('#ftr'); if (!f) return;
    const C = CC.CONTACT;
    f.innerHTML = '<footer class="ftr"><div class="wrap"><div class="ftr__top">' +
      '<div class="ftr__brand"><img class="ftr__logo" src="https://storage.googleapis.com/cakicak258424/Caki_Cak_-_logo_kruh.jpg" alt="Caki·Cak – medvídek a zajíček" loading="lazy" width="150" height="150"><p class="muted" style="margin-top:16px;max-width:30ch">Dětské oblečení pro malé poklady. Ze srdce od <a href="' + CC.MONIKA + '" target="_blank" rel="noopener" style="text-decoration:underline;text-underline-offset:3px">@bagarovamonika</a>.</p></div>' +
      '<div><h4>Nakupování</h4><ul><li><a href="index.html#darky">Novorozenci a sety</a></li><li><a href="index.html#vyber?pro=holcicky">Pro holčičky</a></li><li><a href="index.html#vyber?pro=chlapecky">Pro chlapečky</a></li><li><a href="index.html#vyber?pro=cosy">Teplákovky COSY</a></li><li><a href="index.html#vyber?pro=premium">Prémiová řada</a></li><li><a href="' + CC.SHOP + 'geox-3/" target="_blank" rel="noopener">GEOX</a></li></ul></div>' +
      '<div><h4>Informace pro vás</h4><ul><li><a href="' + CC.SHOP + 'tabulka-velikosti/" target="_blank" rel="noopener">Tabulka velikostí</a></li><li><a href="' + CC.SHOP + 'obchodni-podminky/" target="_blank" rel="noopener">Obchodní podmínky</a></li><li><a href="' + CC.SHOP + 'podminky-ochrany-osobnich-udaju/" target="_blank" rel="noopener">Ochrana osobních údajů</a></li><li><a href="' + CC.SHOP + 'moje-objednavka/" target="_blank" rel="noopener">Snadné odstoupení od smlouvy</a></li><li><a href="' + CC.SHOP + 'kontakty/" target="_blank" rel="noopener">Kontakty</a></li></ul></div>' +
      '<div><h4>Kontakt</h4><ul><li><a href="mailto:' + C.mail + '">' + C.mail + '</a></li><li><a href="' + C.ig + '" target="_blank" rel="noopener">Instagram @cakicak.cz</a></li><li><a href="' + C.fb + '" target="_blank" rel="noopener">Facebook</a></li><li class="muted">' + C.company + '<br>' + C.address + '<br>IČO ' + C.ico + '</li></ul>' +
      '<div class="pay"><span>Kartou online</span><span>Převodem</span><span>Dobírka</span></div></div>' +
      '</div><div class="ftr__bottom"><span>© 2026 cakicak.cz · Doprava 79–149' + NB + 'Kč, po Česku a na Slovensko</span><span>Neoficiální návrh studia MALUS/01. Fotky, produkty a texty patří Caki·Cak (cakicak.cz).</span></div></div></footer>';
  }

  /* ---------- Vysouvací košík ---------- */
  const Drawer = {
    el: null, scrim: null,
    init() {
      const d = document.createElement('aside');
      d.className = 'drawer'; d.setAttribute('aria-label', 'Košík'); d.setAttribute('aria-hidden', 'true');
      d.innerHTML = '<div class="drawer__hd"><h2>Košík</h2><button class="x-btn" type="button" data-x aria-label="Zavřít košík">' + ICON.close + '</button></div><div class="drawer__body"></div><div class="drawer__ft"></div>';
      const s = document.createElement('div'); s.className = 'scrim';
      document.body.append(s, d);
      Drawer.el = d; Drawer.scrim = s;
      s.addEventListener('click', Drawer.close);
      $('[data-x]', d).addEventListener('click', Drawer.close);
      d.addEventListener('click', (e) => {
        const b = e.target.closest('[data-q]'); if (b) { const i = +b.dataset.i; const it = Cart.items[i]; it.qty = Math.max(0, it.qty + (+b.dataset.q)); if (!it.qty) Cart.items.splice(i, 1); Cart.save(); }
        const r = e.target.closest('[data-rm]'); if (r) { Cart.items.splice(+r.dataset.rm, 1); Cart.save(); }
        if (e.target.closest('[data-checkout]')) { const n = $('.drawer__demo', d); n.hidden = false; }
        if (e.target.closest('[data-go]')) Drawer.close();
      });
      on('cart', Drawer.render);
      Drawer.render();
    },
    render() {
      const d = Drawer.el; if (!d) return;
      const body = $('.drawer__body', d); const ft = $('.drawer__ft', d);
      if (!Cart.items.length) {
        body.innerHTML = '<div class="cart-empty"><img src="https://storage.googleapis.com/cakicak258424/Caki_Cak_-_logo_kruh.jpg" alt="" loading="lazy"><p>Košík je zatím prázdný.</p><p style="margin-top:14px"><a class="link" href="index.html#vyber?pro=cosy" data-go>Teplákovky COSY</a></p></div>';
        ft.innerHTML = '<p class="note">Doprava od 79' + NB + 'Kč · Česko i Slovensko · vrácení do 14 dnů</p>';
        return;
      }
      body.innerHTML = Cart.items.map((it, i) => {
        const p = CC.byId(it.id); if (!p) return '';
        const sz = p.sizes.find((x) => x.l === it.size);
        return '<div class="ci"><a class="ci__img" href="produkt.html?p=' + p.id + '" style="--bg:' + p.bg + '"><img src="' + CC.img(p.img) + '" alt="" loading="lazy"></a>' +
          '<div><a class="ci__name" href="produkt.html?p=' + p.id + '">' + esc(p.name) + '</a><p class="ci__meta">' + (sz ? 'Velikost ' + esc(sz.l) + ' · ' + sz.cm + ' cm' : 'Jedna velikost') + '</p>' +
          '<div class="qty"><button type="button" data-q="-1" data-i="' + i + '" aria-label="Ubrat kus">−</button><span>' + it.qty + '</span><button type="button" data-q="1" data-i="' + i + '" aria-label="Přidat kus">+</button></div></div>' +
          '<div class="ci__right"><span class="ci__price">' + fmt(p.price * it.qty) + '</span><button class="ci__rm" type="button" data-rm="' + i + '">Odebrat</button></div></div>';
      }).join('');
      ft.innerHTML = '<div class="sum"><span>Mezisoučet (' + Cart.count() + ' ks)</span><b>' + fmt(Cart.total()) + '</b></div>' +
        '<p class="note">Doprava od 79' + NB + 'Kč (PPL Smart Box), na adresu od 109' + NB + 'Kč. Platba kartou, převodem nebo na dobírku.</p>' +
        '<button class="btn btn--block" type="button" data-checkout>Pokračovat k objednávce</button>' +
        '<p class="note drawer__demo" hidden>Tohle je návrh, objednávka se tu neodesílá. V hotovém e-shopu sem naváže pokladna Shoptetu.</p>';
    },
    open() { hideToast(); Drawer.el.classList.add('on'); Drawer.scrim.classList.add('on'); Drawer.el.setAttribute('aria-hidden', 'false'); setTimeout(() => $('[data-x]', Drawer.el).focus(), 50); },
    close() { Drawer.el.classList.remove('on'); Drawer.scrim.classList.remove('on'); Drawer.el.setAttribute('aria-hidden', 'true'); }
  };

  /* ---------- Hledání ---------- */
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const Search = {
    el: null,
    init() {
      const m = document.createElement('div'); m.className = 'modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-label', 'Hledat'); m.setAttribute('aria-modal', 'true');
      m.innerHTML = '<div class="modal__hd"><h2 class="t-s">Hledat</h2><button class="x-btn" type="button" data-x aria-label="Zavřít">' + ICON.close + '</button></div><div class="search"><input type="search" placeholder="Např. COSY, Ovečka, set do porodnice" aria-label="Hledaný výraz"><div class="search__res"></div></div>';
      document.body.appendChild(m); Search.el = m;
      $('[data-x]', m).addEventListener('click', Search.close);
      const inp = $('input', m); const res = $('.search__res', m);
      const run = () => {
        const q = norm(inp.value.trim());
        const words = q.split(/\s+/).filter(Boolean);
        const list = (words.length ? CC.PRODUCTS.filter((p) => { const n = norm(p.name + ' ' + (p.col || '') + ' ' + p.cat); return words.every((w) => n.includes(w)); }) : CC.PRODUCTS.slice(11, 17)).slice(0, 8);
        res.innerHTML = list.length ? list.map((p) => '<a href="produkt.html?p=' + p.id + '"><img src="' + CC.img(p.img) + '" alt="" style="--bg:' + p.bg + '" loading="lazy"><span>' + esc(p.name) + '</span><b>' + fmt(p.price) + '</b></a>').join('') : '<p class="muted" style="padding:10px 4px">Nic jsme nenašly. Zkuste třeba „set“ nebo „body“.</p>';
      };
      inp.addEventListener('input', run); run();
    },
    open() { Overlay.show(Search.el, Search.close); setTimeout(() => $('input', Search.el).focus(), 60); },
    close() { Overlay.hide(Search.el); }
  };

  /* společné překrytí pro modální okna */
  const Overlay = {
    scrim: null, cur: null, onClose: null,
    init() { const s = document.createElement('div'); s.className = 'scrim'; s.style.zIndex = 92; document.body.appendChild(s); Overlay.scrim = s; s.addEventListener('click', () => Overlay.onClose && Overlay.onClose()); },
    show(el, onClose) { Overlay.cur = el; Overlay.onClose = onClose; el.classList.add('on'); Overlay.scrim.classList.add('on'); },
    hide(el) { el.classList.remove('on'); Overlay.scrim.classList.remove('on'); Overlay.cur = null; }
  };

  /* ---------- Moje miminko – komponenta (sekce i modální okno) ---------- */
  const MIN = 45, MAX = 112;
  const MM = {
    modal: null,
    mount(root, opts) {
      opts = opts || {};
      const prof = Baby.get();
      let mode = prof ? prof.mode : 'cm';
      let cm = prof && prof.mode === 'cm' ? prof.value : 64;
      let age = prof && prof.mode === 'age' ? prof.value : 1;
      root.innerHTML =
        '<div class="tabs mm__modes" role="tablist" aria-label="Jak vybrat velikost">' +
        '<button type="button" role="tab" data-mode="cm">Podle délky</button><button type="button" role="tab" data-mode="age">Podle věku</button><button type="button" role="tab" data-mode="unborn">Před porodem</button></div>' +
        '<div class="mm__body"></div>';
      const body = $('.mm__body', root);
      const segs = S.map((s, i) => { const a = i ? S[i - 1].cm : MIN; return { s, a, b: s.cm }; });
      const pct = (v) => ((v - MIN) / (MAX - MIN)) * 100;
      // metr se vykreslí jednou; při tažení se mění jen čísla a ukazatel, input zůstává stejný
      let saveT = 0;
      function updateCm() {
        const r = Baby.byCm(cm);
        $('.mm__num', body).textContent = cm;
        $('.mm__res', body).innerHTML = 'Doporučujeme <b>' + sizeName(r.size) + '</b>' + (r.next ? '<span class="muted"> · do zásoby ' + sizeName(r.next) + '</span>' : '');
        $('.mm__why', body).textContent = r.text;
        $('.tape__track', body).style.transform = 'translateX(' + pct(cm) + '%)';
        $$('.tape__seg', body).forEach((el) => el.classList.toggle('on', el.dataset.id === r.size.id));
        $$('.tape__lbl', body).forEach((el, i) => { const on = el.dataset.id === r.size.id; el.classList.toggle('on', on); el.classList.toggle('off', !!opts.compact && i % 2 === 1 && !on); });
        const inp = $('input', body); inp.setAttribute('aria-valuetext', cm + ' cm, doporučená velikost ' + sizeName(r.size));
        $('.mm__act', body).innerHTML = actions(r.size);
        bindActs();
      }
      function bindActs() {
        const c = $('[data-clear]', body); if (c) c.addEventListener('click', () => { Baby.clear(root); draw(); });
        const go = $('[data-close]', body); if (go && opts.onDone) go.addEventListener('click', opts.onDone);
      }
      function draw() {
        $$('[data-mode]', root).forEach((b) => b.setAttribute('aria-selected', String(b.dataset.mode === mode)));
        if (mode === 'cm') {
          const vis = segs.filter((g) => g.b <= MAX);
          body.innerHTML = '<div class="mm__val" style="margin-top:22px"><span class="mm__num" aria-live="polite"></span><span class="mm__unit">cm</span></div>' +
            '<p class="mm__res"></p><p class="mm__why"></p>' +
            '<div class="tape"><div class="tape__band"><div class="tape__ticks"></div>' +
            vis.map((g) => '<div class="tape__seg" data-id="' + g.s.id + '" style="left:' + pct(g.a) + '%;width:' + (pct(g.b) - pct(g.a)) + '%"></div>').join('') + '</div>' +
            vis.map((g) => '<span class="tape__lbl" data-id="' + g.s.id + '" style="left:' + pct((g.a + g.b) / 2) + '%">' + g.s.label + '</span>').join('') +
            [50, 60, 70, 80, 90, 100, 110].map((v) => '<span class="tape__cm" style="left:' + pct(v) + '%">' + v + '</span>').join('') +
            '<div class="tape__clip"><div class="tape__track"><div class="tape__mark"><i></i><span class="hrt"></span></div></div></div>' +
            '<input type="range" min="' + MIN + '" max="110" step="1" value="' + cm + '" aria-label="Délka miminka v centimetrech"></div>' +
            '<div class="mm__act"></div>';
          const inp = $('input', body);
          inp.addEventListener('input', () => { cm = +inp.value; updateCm(); clearTimeout(saveT); saveT = setTimeout(save, 260); });
          inp.addEventListener('change', () => { clearTimeout(saveT); save(); updateCm(); });
          updateCm();
          return;
        } else if (mode === 'age') {
          const r = Baby.byAge(age);
          body.innerHTML = '<div class="mm__age" role="radiogroup" aria-label="Věk miminka">' + AGE_TXT.map((t, i) => '<button type="button" role="radio" aria-checked="' + (i === age) + '" class="chip' + (i === age ? ' is-sel' : '') + '" data-age="' + i + '">' + t + '</button>').join('') + '</div>' +
            '<p class="mm__res" style="margin-top:22px">Doporučujeme <b>' + sizeName(r.size) + '</b></p><p class="mm__why">' + r.text + '</p>' + actions(r.size);
          $$('[data-age]', body).forEach((b) => b.addEventListener('click', () => { age = +b.dataset.age; save(); draw(); }));
        } else {
          body.innerHTML = '<p class="mm__res" style="margin-top:22px">Do porodnice a na první týdny: <b>' + sizeName(S[0]) + '</b></p><p class="mm__res" style="margin-top:6px">Na další měsíce: <b>' + sizeName(S[1]) + '</b></p>' +
            '<p class="mm__why">Všechny kojenecké sety máme ve velikosti 56 (0–3M). Hodí se do porodnice i jako dárek k narození.</p>' +
            '<div class="mm__actions"><a class="btn" href="index.html#darky" data-close>Ukázat sety do porodnice</a>' + (Baby.get() ? '<button class="btn btn--ghost" type="button" data-clear>Zapomenout velikost</button>' : '') + '</div>';
        }
        bindActs();
      }
      function actions(sz) {
        const saved = Baby.get();
        return '<div class="mm__actions">' +
          (opts.pdp ? '' : '<a class="btn" href="index.html#vyber?skladem=1" data-close>Ukázat, co je skladem v ' + sz.cm + '</a>') +
          (saved ? '<button class="btn btn--ghost" type="button" data-clear>Zapomenout velikost</button>' : '') + '</div>' +
          (saved ? '<p class="note" style="margin-top:12px">' + HEART + ' Uloženo. Na všech kartách teď vidíte, jestli je velikost ' + sz.cm + ' skladem.</p>' : '');
      }
      function save() {
        if (mode === 'cm') Baby.set({ mode, value: cm, size: Baby.byCm(cm).size.id }, root);
        else if (mode === 'age') Baby.set({ mode, value: age, size: Baby.byAge(age).size.id }, root);
      }
      $$('[data-mode]', root).forEach((b) => b.addEventListener('click', () => {
        mode = b.dataset.mode;
        if (mode === 'unborn') Baby.set({ mode, value: 0, size: '56' }, root); else save();
        draw();
      }));
      draw();
    },
    openModal() {
      if (!MM.modal) {
        const m = document.createElement('div'); m.className = 'modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', 'Moje miminko');
        m.innerHTML = '<div class="modal__hd"><h2 class="t-m">Kolik měří vaše miminko?</h2><button class="x-btn" type="button" data-x aria-label="Zavřít">' + ICON.close + '</button></div><div style="padding:0 22px 26px"><p class="muted" style="margin-top:6px;font-size:15px">Velikost vybíráme podle tabulky Čakičak: podle výšky dítěte. Web si ji zapamatuje a u každého kousku ukáže, jestli je skladem.</p><div class="mm-root"></div></div>';
        document.body.appendChild(m); MM.modal = m;
        $('[data-x]', m).addEventListener('click', MM.closeModal);
      }
      MM.mount($('.mm-root', MM.modal), { compact: window.innerWidth < 760, pdp: /produkt/.test(location.pathname), onDone: MM.closeModal });
      Overlay.show(MM.modal, MM.closeModal);
    },
    closeModal() { Overlay.hide(MM.modal); }
  };

  /* ---------- Příběhy s nákupem ---------- */
  const Stories = {
    el: null, i: 0, t0: 0, el0: 0, paused: false, raf: 0, dur: 7000, sel: {},
    init() {
      const v = document.createElement('div'); v.className = 'sv'; v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true'); v.setAttribute('aria-label', 'Příběhy');
      v.innerHTML = '<button class="sv__nav sv__nav--prev" type="button" aria-label="Předchozí příběh">' + ICON.prev + '</button><div class="sv__frame"></div><button class="sv__nav sv__nav--next" type="button" aria-label="Další příběh">' + ICON.next + '</button><button class="sv__close" type="button" aria-label="Zavřít příběhy">' + ICON.close + '</button>';
      document.body.appendChild(v); Stories.el = v;
      $('.sv__nav--prev', v).addEventListener('click', () => Stories.go(-1));
      $('.sv__nav--next', v).addEventListener('click', () => Stories.go(1));
      $('.sv__close', v).addEventListener('click', Stories.close);
      v.addEventListener('click', (e) => { if (e.target === v) Stories.close(); });
      document.addEventListener('keydown', (e) => {
        if (!v.classList.contains('on')) return;
        if (e.key === 'Escape') Stories.close();
        if (e.key === 'ArrowRight') Stories.go(1);
        if (e.key === 'ArrowLeft') Stories.go(-1);
      });
      document.addEventListener('visibilitychange', () => { if (document.hidden && v.classList.contains('on')) Stories.setPause(true); });
    },
    open(i) { Stories.i = i; Stories.paused = false; Stories.el.classList.add('on'); document.documentElement.style.overflow = 'hidden'; Stories.show(); },
    close() { Stories.el.classList.remove('on'); cancelAnimationFrame(Stories.raf); document.documentElement.style.overflow = ''; },
    go(d) { const n = Stories.i + d; if (n < 0) return; if (n >= CC.STORIES.length) return Stories.close(); Stories.i = n; Stories.show(); },
    setPause(p) {
      Stories.paused = p;
      const b = $('[data-pause]', Stories.el);
      if (b) { b.innerHTML = (p ? ICON.play : ICON.pause) + '<span>' + (p ? 'Přehrát' : 'Pozastavit') + '</span>'; b.setAttribute('aria-pressed', String(p)); }
      if (!p) { Stories.t0 = performance.now() - Stories.el0; Stories.tick(); }
    },
    show() {
      const st = CC.STORIES[Stories.i]; const f = $('.sv__frame', Stories.el);
      const pid = Stories.sel[st.id] || st.products[0];
      f.innerHTML = '<img class="sv__img' + (st.contain ? ' is-contain' : '') + '" src="' + CC.img(st.img) + '" alt="" style="object-position:' + (st.contain ? '50% 50%' : (st.pos || '50% 50%')) + '"><div class="sv__shade"></div>' +
        '<div class="sv__bars">' + CC.STORIES.map((x, k) => '<i class="' + (k < Stories.i ? 'done' : '') + '"><b></b></i>').join('') + '</div>' +
        '<div class="sv__top"><span class="sv__av" style="background-image:url(https://storage.googleapis.com/cakicak258424/Caki_Cak_-_logo_kruh.jpg)"></span><span class="sv__who">' + esc(st.by) + '</span>' +
        '<div class="sv__ctrl"><button type="button" data-pause aria-pressed="false">' + ICON.pause + '<span>Pozastavit</span></button><button type="button" data-xs aria-label="Zavřít">' + ICON.close + '</button></div></div>' +
        '<p class="sv__text">' + esc(st.text) + '</p>' +
        '<button class="sv__tap sv__tap--prev" type="button" aria-label="Předchozí"></button><button class="sv__tap sv__tap--next" type="button" aria-label="Další"></button>' +
        (pid ? '<div class="sv__shop">' + Stories.shop(st, pid) + '</div>' : (st.link ? '<div class="sv__shop"><a class="btn btn--block" href="' + st.link.href + '" data-xs>' + st.link.label + '</a></div>' : ''));
      $('[data-pause]', f).addEventListener('click', () => Stories.setPause(!Stories.paused));
      $$('[data-xs]', f).forEach((b) => b.addEventListener('click', Stories.close));
      $('.sv__tap--prev', f).addEventListener('click', () => Stories.go(-1));
      $('.sv__tap--next', f).addEventListener('click', () => Stories.go(1));
      const shop = $('.sv__shop', f);
      if (shop && pid) shop.addEventListener('click', (e) => Stories.onShop(e, st));
      Stories.el0 = 0; Stories.t0 = performance.now();
      cancelAnimationFrame(Stories.raf);
      if (Stories.paused) Stories.setPause(true); else Stories.tick();
    },
    shop(st, pid) {
      const p = CC.byId(pid); const sz = Baby.size();
      const pick = Stories.pickSize[p.id];
      let opts = '';
      if (st.pick === 'color') opts = '<div class="sv__opts" role="radiogroup" aria-label="Barva">' + st.products.map((id) => { const q = CC.byId(id); return '<button type="button" class="sv__swatch' + (id === p.id ? ' is-sel' : '') + '" style="background:' + q.swatch + '" data-pid="' + id + '" role="radio" aria-checked="' + (id === p.id) + '" aria-label="' + esc(q.color) + '" title="' + esc(q.color) + '"></button>'; }).join('') + '</div>';
      if (st.pick === 'list') opts = '<div class="sv__opts">' + st.products.map((id) => { const q = CC.byId(id); return '<button type="button" class="sv__alt' + (id === p.id ? ' is-sel' : '') + '" data-pid="' + id + '">' + esc(q.short || q.name.split(' – ')[0]) + '</button>'; }).join('') + '</div>';
      const sizes = p.sizes.length ? '<div class="sv__sizes">' + p.sizes.map((s) => {
        const me = sz && s.covers.includes(sz.id);
        return '<button type="button" class="chip chip--sm' + (s.ok ? '' : ' is-so') + (me ? ' is-me' : '') + (pick === s.l ? ' is-sel' : '') + '" data-sz="' + esc(s.l) + '"' + (s.ok ? '' : ' disabled') + ' aria-label="' + esc(s.l + ' · ' + s.cm + ' cm' + (s.ok ? '' : ' · vyprodáno')) + '">' + (me ? HEART : '') + esc(sizeLabelOf(s)) + '</button>';
      }).join('') + '</div>' : '';
      const chosen = p.sizes.find((s) => s.l === pick);
      const inC = chosen ? Cart.has(p.id, chosen.l) : (!p.sizes.length && Cart.has(p.id, ''));
      const lab = inC ? '✓ V košíku' + (chosen ? ' · ' + sizeLabelOf(chosen) : '') : (p.sizes.length ? (chosen ? 'Přidat do košíku · ' + sizeLabelOf(chosen) : 'Vyberte velikost') : 'Přidat do košíku');
      return '<div class="sv__prod"><img src="' + CC.img(p.img) + '" alt="" style="--bg:' + p.bg + '"><div><p class="sv__pname">' + esc(p.name) + '</p>' + (st.pick === 'color' ? '<p class="note">Barva: ' + esc(p.color) + '</p>' : '') + '</div><span class="sv__pprice">' + fmt(p.price) + '</span></div>' +
        opts + sizes +
        '<div class="sv__add"><button type="button" class="btn' + (inC ? ' is-done' : '') + '" data-svadd' + (p.sizes.length && !chosen && !inC ? ' disabled' : '') + '>' + lab + '</button><a class="btn btn--ghost" href="produkt.html?p=' + p.id + '">Detail</a></div>' +
        (inC ? '<p class="note" style="margin-top:8px"><button type="button" class="link" data-svcart>Zobrazit košík (' + Cart.count() + ')</button></p>' : '');
    },
    pickSize: {},
    onShop(e, st) {
      const b = e.target.closest('button'); if (!b) return;
      const shop = e.currentTarget;
      if (!Stories.paused) Stories.setPause(true);
      let pid = Stories.sel[st.id] || st.products[0];
      if (b.dataset.pid) { Stories.sel[st.id] = b.dataset.pid; pid = b.dataset.pid; }
      if (b.dataset.sz) Stories.pickSize[pid] = b.dataset.sz;
      if (b.hasAttribute('data-svadd') && !b.disabled) {
        const p = CC.byId(pid); const s = Stories.pickSize[pid] || '';
        if (!Cart.has(pid, s)) { Cart.add(pid, s); }
      }
      if (b.hasAttribute('data-svcart')) { Stories.close(); Drawer.open(); return; }
      // předvybrat vaši velikost, pokud je skladem
      const p = CC.byId(pid); const sz = Baby.size();
      if (!Stories.pickSize[pid] && sz) { const h = p.sizes.find((x) => x.ok && x.covers.includes(sz.id)); if (h) Stories.pickSize[pid] = h.l; }
      shop.innerHTML = Stories.shop(st, pid);
    },
    tick() {
      const v = Stories.el; if (!v.classList.contains('on') || Stories.paused) return;
      const now = performance.now(); Stories.el0 = now - Stories.t0;
      const k = Math.min(1, Stories.el0 / Stories.dur);
      const bar = $$('.sv__bars i', v)[Stories.i]; if (bar) bar.firstChild.style.transform = 'scaleX(' + k + ')';
      if (k >= 1) return Stories.go(1);
      Stories.raf = requestAnimationFrame(Stories.tick);
    }
  };
  function storyStrip(root) {
    root.innerHTML = CC.STORIES.map((s, i) => '<button type="button" class="st" data-st="' + i + '"><span class="st__ring"><img src="' + CC.img(s.img) + '" alt="" loading="lazy" style="object-position:' + (s.pos || '50% 50%') + '"></span><span class="st__t">' + esc(s.title) + '</span></button>').join('');
    root.addEventListener('click', (e) => { const b = e.target.closest('[data-st]'); if (b) { const i = +b.dataset.st; const st = CC.STORIES[i]; const sz = Baby.size(); st.products.forEach((id) => { const p = CC.byId(id); if (sz && !Stories.pickSize[id]) { const h = p.sizes.find((x) => x.ok && x.covers.includes(sz.id)); if (h) Stories.pickSize[id] = h.l; } }); Stories.open(i); } });
  }

  /* ---------- Odhalení při scrollu (jen jednou) ---------- */
  function reveal() {
    const els = $$('.rv, .rv-img, .rv-line').filter((e) => !e.closest('.hero')); // hero má vlastní úvod
    if (RM || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { const d = +x.target.dataset.d || 0; setTimeout(() => x.target.classList.add('in'), d); io.unobserve(x.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((e) => io.observe(e));
  }

  function concept() {
    const c = document.createElement('a'); c.className = 'concept'; c.href = 'https://malus01.com'; c.target = '_blank'; c.rel = 'noopener';
    c.innerHTML = 'Koncept od <b>MALUS/01</b>'; document.body.appendChild(c);
  }

  function init() {
    header(); footer(); Drawer.init(); Overlay.init(); Search.init(); Stories.init(); concept();
    on('cart', updHeader);
    on('baby', () => { updHeader(); rerenderCards(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (Overlay.cur) Overlay.onClose(); Drawer.close(); } });
  }

  window.CCX = { $, $$, RM, fmt, esc, store, ss, on, emit, Baby, Cart, card, bindCards, rerenderCards, qbarInner, sizeLabelOf, mineFor, mineText, HEART, ICON, toast, added, Drawer, MM, Stories, storyStrip, reveal, init, sizeName };
})();
