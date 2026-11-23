/* Knedlo Zelo Wear – koncept e-shopu v2 od MALUS/01.
   Jádro: košík, hlavička, hledání, dialogy, plynulý scroll, přechody stránek, kurzor, rychlý náhled, celý look, stories. */
(function () {
  'use strict';
  const D = window.KZW_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const G = window.gsap || null;
  if (G) G.registerPlugin(window.ScrollTrigger, window.Flip, window.Observer);
  const root = document.documentElement;
  root.classList.add('js');
  if (fine) root.classList.add('is-fine');

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = n => n.toLocaleString('cs-CZ').replace(/\s/g, ' ');
  const fmt = n => num(n) + ' Kč';
  const priceOf = p => (p.from ? 'od ' : '') + fmt(p.price);
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const store = {
    get(k, d) { try { const v = localStorage.getItem('kzw-concept-' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('kzw-concept-' + k, JSON.stringify(v)); } catch (e) { /* jen v paměti */ } }
  };
  const sess = {
    get(k) { try { const v = sessionStorage.getItem('kzw-' + k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem('kzw-' + k, JSON.stringify(v)); } catch (e) { /* nic */ } },
    del(k) { try { sessionStorage.removeItem('kzw-' + k); } catch (e) { /* nic */ } }
  };

  const I = {
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.3s-7.6-4.5-7.6-10.1a4.2 4.2 0 0 1 7.6-2.5 4.2 4.2 0 0 1 7.6 2.5c0 5.6-7.6 10.1-7.6 10.1Z"/></svg>',
    plus: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="1.8" fill="none"/></svg>',
    left: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10.5 2.5 5 8l5.5 5.5" stroke="currentColor" stroke-width="1.8" fill="none"/></svg>',
    right: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 2.5 11 8l-5.5 5.5" stroke="currentColor" stroke-width="1.8" fill="none"/></svg>',
    x: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.8" fill="none"/></svg>',
    ruler: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h18v8H3z M7 8v3 M11 8v4 M15 8v3 M19 8v4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    swap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    print: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v4H4zM6 10v8h12v-8M9 14h6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    coin: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9.5 9.5h4a1.8 1.8 0 0 1 0 3.5h-3a1.8 1.8 0 0 0 0 3.5h4M12 8v1.5M12 16.5V18" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
    pause: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 2h2v8H3zM7 2h2v8H7z"/></svg>',
    play: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5v9l7-4.5z"/></svg>',
    eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    hanger: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.5a2.2 2.2 0 1 1 2.2-2.2c0 1.3-2.2 1.6-2.2 3.2l8.6 6.1c.9.6.5 2-.6 2H4c-1.1 0-1.5-1.4-.6-2L12 9.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>'
  };

  /* ---------- masky výřezů ---------- */
  const maskCls = {};
  (function injectMasks() {
    const M = window.KZW_MASKS || {};
    let css = '', i = 0;
    Object.keys(M).forEach(f => { const c = 'mk' + (i++); maskCls[f] = c; css += '.' + c + '{-webkit-mask-image:url(' + M[f].m + ');mask-image:url(' + M[f].m + ')}\n'; });
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  })();
  const maskOf = url => { const f = D.fileOf(url); return maskCls[f] ? { cls: maskCls[f], b: window.KZW_MASKS[f].b } : null; };
  /* výřez člověka/předmětu: box 3:4 s fotkou a maskou */
  const figHTML = (url, extra) => {
    const m = maskOf(url);
    return '<span class="mfig ' + (m ? m.cls : 'is-plain') + (extra ? ' ' + extra : '') + '" style="background-image:url(\'' + url + '\')"></span>';
  };

  /* ---------- barvy scény ---------- */
  const lum = hex => {
    const h = hex.replace('#', ''); const n = parseInt(h.length === 3 ? h.replace(/./g, c => c + c) : h, 16);
    const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  const inkOn = bg => (lum(bg) > 0.24 ? '#000000' : '#ffffff');
  const stageOf = p => p.stage || { bg: '#f1f1f1', fg: '#000000', lines: [p.tag || p.name] };

  /* ---------- skladovost ---------- */
  const kusy = n => (n === 1 ? 'kus' : (n < 5 ? 'kusy' : 'kusů'));
  function leadTime(p) {
    const m = (p.lead || '').match(/(\d+\s*[–-]\s*\d+\s*týdn\w*|do\s+\d+\s*dn\w*|\d+\s*týdn\w*)/i);
    return m ? m[1].replace('-', '–') : '2–3 týdny';
  }
  function stockOf(v, p) {
    if (v === 'na') return { k: 'ok', t: '' };
    if (v === 'ok') return { k: 'ok', t: 'Skladem' };
    if (v === 'obj') return { k: 'obj', t: 'Tiskneme na objednávku, dodání ' + leadTime(p) };
    if (v === 0) return { k: 'out', t: 'Momentálně nedostupné' };
    if (v === 1) return { k: 'low', t: 'Poslední kus skladem' };
    if (v === 2) return { k: 'low', t: 'Poslední 2 kusy skladem' };
    return { k: 'ok', t: 'Skladem ' + v + ' ' + kusy(v) };
  }
  const sizesOf = (p, ci) => (p.colors ? p.colors[ci || 0].sizes : p.sizes);
  const isOne = p => sizesOf(p).length === 1;
  const firstAvail = (p, want) => {
    const list = sizesOf(p);
    const w = list.find(s => s[0] === want && s[1] !== 0);
    if (w) return w[0];
    const a = list.find(s => s[1] !== 0 && s[1] !== 'obj') || list.find(s => s[1] !== 0);
    return a ? a[0] : null;
  };
  function sizeLabelFor(p, size) {
    if (!size) return '';
    if (size === 'Univerzální') return 'Univerzální velikost';
    if (p.sizeLabel) return p.sizeLabel + ' ' + size;
    if (isOne(p)) return size;
    return 'Velikost ' + size;
  }

  /* ---------- toast ---------- */
  function toast(msg) {
    let w = $('.toasts');
    if (!w) { w = document.createElement('div'); w.className = 'toasts'; w.setAttribute('role', 'status'); document.body.appendChild(w); }
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; w.appendChild(t);
    setTimeout(() => t.remove(), 3300);
  }

  /* ---------- karta produktu ---------- */
  function swatchesHTML(p) {
    if (!p.family) return '';
    const fam = D.products.filter(x => x.family === p.family);
    return '<div class="swatches" role="group" aria-label="Barvy">' + fam.map(x =>
      '<button class="sw" type="button" data-swap="' + x.id + '" aria-pressed="' + (x.id === p.id) + '" aria-label="' + esc(x.color) + '" title="' + esc(x.color) + '" style="background:' + x.swatch + '"></button>').join('') + '</div>';
  }
  function cardHTML(p) {
    const sizes = sizesOf(p);
    const one = sizes.length === 1;
    const color = p.colors ? p.colors[0].name : '';
    const soldOut = one && sizes[0][1] === 0;
    const quick = one
      ? (soldOut ? '<button class="qs is-wide is-out" type="button" aria-disabled="true" data-add="' + p.id + '" data-size="' + esc(sizes[0][0]) + '">Vyprodáno</button>'
        : '<button class="qs is-wide" type="button" data-add="' + p.id + '" data-size="' + esc(sizes[0][0]) + '">Přidat do košíku</button>')
      : sizes.map(([s, v]) => { const st = stockOf(v, p); return '<button class="qs is-' + st.k + '" type="button" data-add="' + p.id + '" data-size="' + esc(s) + '"' + (color ? ' data-color="' + esc(color) + '"' : '') + (st.k === 'out' ? ' aria-disabled="true"' : '') + ' title="' + esc(s + ': ' + st.t) + '">' + esc(s) + '</button>'; }).join('');
    const label = one ? (sizes[0][0] === 'Univerzální' ? 'Univerzální velikost' : sizes[0][0]) : (p.sizeLabel || 'Vyber velikost');
    const m = maskOf(p.images[0]);
    const st = stageOf(p);
    const stage = (m && p.stage) ? '<span class="card-stage" aria-hidden="true" style="--bg:' + st.bg + ';--fg:' + st.fg + '"><span class="card-sl">' + st.lines.map(esc).join('<br>') + '</span>' + figHTML(p.images[0]) + '</span>' : '';
    return '<article class="card' + (stage ? ' has-stage' : '') + '" data-id="' + p.id + '" data-cat="' + p.cat + '"><div class="card-visual">' +
      '<a class="card-media" href="produkt.html?id=' + p.id + '" data-zoom aria-label="' + esc(p.name) + '" data-cursor="Detail">' +
      '<img src="' + p.images[0] + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async">' +
      (!stage && p.images[1] ? '<img class="alt" src="' + p.images[1] + '" alt="" loading="lazy" decoding="async">' : '') + stage +
      (soldOut ? '<span class="card-badge">Vyprodáno</span>' : '') +
      '</a>' +
      '<button class="card-qv" type="button" data-qv="' + p.id + '">' + I.eye + '<span>Náhled</span></button>' +
      '<button class="fav" type="button" data-fav="' + p.id + '" aria-pressed="' + favs.has(p.id) + '" aria-label="Uložit do oblíbených: ' + esc(p.name) + '">' + I.heart + '</button>' +
      '<button class="quick-open" type="button" data-quick aria-label="Rychle přidat: ' + esc(p.name) + '">' + I.plus + '</button>' +
      '<div class="quick"><div class="quick-label"><span>' + (one ? 'Rychlý nákup' : 'Rychle přidat') + '</span><span>' + (!one && sizes.some(s => stockOf(s[1], p).k === 'low') ? '<em class="ql-low">poslední kusy</em>' : esc(label)) + '</span></div><div class="quick-sizes">' + quick + '</div></div></div>' +
      '<div class="card-info"><h3 class="card-name"><a href="produkt.html?id=' + p.id + '">' + esc(p.name) + '</a></h3>' +
      '<span class="card-price">' + priceOf(p) + '</span>' +
      '<p class="card-tag">' + esc(p.tag) + '</p>' + swatchesHTML(p) + '</div></article>';
  }

  /* ---------- košík ---------- */
  let cart = store.get('cart', []).filter(l => D.byId[l.id]);
  const favs = new Set(store.get('fav', []).filter(id => D.byId[id]));
  const cartCount = () => cart.reduce((a, l) => a + l.qty, 0);
  function setCount(name, n) { $$('[data-count="' + name + '"]').forEach(el => { el.textContent = n; el.dataset.n = n; }); }
  function bump(name) { $$('[data-tool="' + name + '"]').forEach(el => { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }); }
  function saveCart() { store.set('cart', cart); setCount('cart', cartCount()); renderCart(); }
  function pushLine(id, size, color) {
    const key = [id, size || '', color || ''].join('|');
    const ex = cart.find(l => l.key === key);
    if (ex) ex.qty += 1; else cart.push({ key, id, size: size || '', color: color || '', qty: 1 });
  }
  function addToCart(id, size, color, fromImg, opts) {
    if (!D.byId[id]) return;
    pushLine(id, size, color); saveCart(); showHeader();
    const silent = opts && opts.silent;
    fly(fromImg, () => { bump('cart'); if (!silent) openCart(); });
  }
  function addMany(items, fromImg) {
    items.forEach(it => pushLine(it.id, it.size, it.color));
    saveCart(); showHeader();
    fly(fromImg, () => { bump('cart'); openCart(); });
  }
  function pairSuggestion() {
    const inCart = new Set(cart.map(l => l.id));
    for (const l of cart) {
      const p = D.byId[l.id];
      const pairs = [p.pair].concat(D.looks[p.id] || []).filter(Boolean);
      const hit = pairs.find(x => !inCart.has(x) && D.byId[x] && sizesOf(D.byId[x])[0][1] !== 0 && isOne(D.byId[x]));
      if (hit) return D.byId[hit];
    }
    return D.products.find(p => p.drop && !inCart.has(p.id) && isOne(p) && sizesOf(p)[0][1] !== 0);
  }
  function renderCart() {
    const body = $('#cart-body'); if (!body) return;
    const n = cartCount();
    $('#cart-title').textContent = n ? 'Košík (' + n + ')' : 'Košík';
    const foot = $('#cart-foot');
    if (!cart.length) {
      body.innerHTML = '<div class="empty"><p>Košík je zatím prázdný.</p><a class="btn" href="index.html#drop" data-close>Prohlédnout nový drop</a></div>';
      foot.hidden = true; return;
    }
    foot.hidden = false;
    const total = cart.reduce((a, l) => a + D.byId[l.id].price * l.qty, 0);
    body.innerHTML = cart.map(l => {
      const p = D.byId[l.id];
      const meta = [l.color, sizeLabelFor(p, l.size)].filter(Boolean).join(' · ');
      return '<div class="line" data-key="' + esc(l.key) + '"><a href="produkt.html?id=' + p.id + '"><img src="' + p.images[0] + '" alt=""></a><div><p class="line-name">' + esc(p.name) + '</p><p class="line-meta">' + esc(meta) + '</p>' +
        '<div class="qty"><button type="button" data-qty="-1" aria-label="Ubrat kus">−</button><span>' + l.qty + '</span><button type="button" data-qty="1" aria-label="Přidat kus">+</button></div>' +
        '<button type="button" class="line-remove" data-remove>Odebrat</button></div><p class="line-price">' + fmt(p.price * l.qty) + '</p></div>';
    }).join('');
    const s = pairSuggestion();
    if (s) body.insertAdjacentHTML('beforeend', '<div class="pairup"><img src="' + s.images[0] + '" alt=""><div><small>K tomu se hodí</small><b>' + esc(s.name) + '</b>' + priceOf(s) + '</div><button type="button" data-add="' + s.id + '" data-size="' + esc(sizesOf(s)[0][0]) + '">Přidat</button></div>');
    const free = 2000 - total;
    $('#cart-sum').textContent = fmt(total);
    const fn = $('#cart-free');
    if (fn) {
      fn.innerHTML = '<span class="free-bar"><i style="width:' + Math.min(100, total / 20) + '%"></i></span>' + (free > 0 ? 'Do 2 000 Kč ti chybí ' + fmt(free) + '. Pak posíláme zdarma.' : 'Máš dopravu zdarma.');
    }
  }
  function openCart() { const d = $('#cart'); if (d && !d.open) { renderCart(); d.showModal(); } }

  function fly(fromImg, done) {
    const target = $('[data-tool="cart"]');
    if (!fromImg || !target || reduce || !fromImg.getBoundingClientRect().width) { done(); return; }
    const r = fromImg.getBoundingClientRect(), t = target.getBoundingClientRect();
    const f = document.createElement('div'); f.className = 'fly';
    const src = fromImg.currentSrc || fromImg.src || (fromImg.style.backgroundImage || '').slice(5, -2);
    f.innerHTML = '<img src="' + src + '" alt="">';
    Object.assign(f.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
    document.body.appendChild(f);
    const dx = t.left + t.width / 2 - (r.left + r.width / 2), dy = t.top + t.height / 2 - (r.top + r.height / 2);
    const a = f.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: 'translate(' + dx * 0.55 + 'px,' + (dy * 0.55 - 40) + 'px) scale(.42)', opacity: 1, offset: 0.55 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.06)', opacity: 0.3 }
    ], { duration: 760, easing: 'cubic-bezier(.55,0,.25,1)' });
    a.onfinish = () => { f.remove(); done(); };
  }

  /* ---------- oblíbené ---------- */
  function toggleFav(id) {
    const on = !favs.has(id);
    if (on) favs.add(id); else favs.delete(id);
    store.set('fav', Array.from(favs));
    $$('[data-fav="' + id + '"]').forEach(b => { b.setAttribute('aria-pressed', on); b.classList.remove('pop'); void b.offsetWidth; if (on) b.classList.add('pop'); });
    setCount('fav', favs.size);
    if (on) bump('fav');
    toast(on ? 'Uloženo do oblíbených' : 'Odebráno z oblíbených');
  }

  /* ---------- plynulý scroll ---------- */
  let lenis = null;
  if (false) {
    lenis = new window.Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 1, prevent: n => n.nodeName === 'DIALOG' });
    if (G) { lenis.on('scroll', window.ScrollTrigger.update); G.ticker.add(t => lenis.raf(t * 1000)); G.ticker.lagSmoothing(0); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
    root.classList.add('has-lenis');
  }
  const hdrH = () => ($('.hdr-main') ? $('.hdr-main').offsetHeight : 72);
  function scrollToEl(el) {
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -hdrH() + 1, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }

  /* ---------- hlavička ---------- */
  let megaOpen = null, megaTimer = null;
  function showHeader() { const h = $('.hdr'); if (h) h.classList.remove('is-hidden'); }
  function header() {
    const hdr = $('.hdr'); if (!hdr) return;
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (!megaOpen) {
        if (y > lastY + 6 && y > 420) hdr.classList.add('is-hidden');
        else if (y < lastY - 6) hdr.classList.remove('is-hidden');
      }
      hdr.classList.toggle('is-scrolled', y > 8);
      lastY = y;
    }, { passive: true });
    const scrim = $('.scrim');
    const close = () => {
      if (!megaOpen) return;
      $$('[data-mega]').forEach(b => b.setAttribute('aria-expanded', 'false'));
      $$('.mega').forEach(m => m.classList.remove('is-open'));
      scrim && scrim.classList.remove('is-on');
      hdr.classList.remove('is-mega');
      megaOpen = null;
    };
    const open = name => {
      clearTimeout(megaTimer);
      if (megaOpen === name) return;
      $$('[data-mega]').forEach(b => b.setAttribute('aria-expanded', String(b.dataset.mega === name)));
      $$('.mega').forEach(m => m.classList.toggle('is-open', m.dataset.panel === name));
      scrim && scrim.classList.add('is-on');
      hdr.classList.add('is-mega');
      megaOpen = name;
    };
    $$('[data-mega]').forEach(b => {
      b.addEventListener('mouseenter', () => { clearTimeout(megaTimer); megaTimer = setTimeout(() => open(b.dataset.mega), 90); });
      b.addEventListener('click', () => (megaOpen === b.dataset.mega ? close() : open(b.dataset.mega)));
    });
    const main = $('.hdr-main');
    main && main.addEventListener('mouseleave', () => { clearTimeout(megaTimer); megaTimer = setTimeout(close, 180); });
    $$('.mega').forEach(m => m.addEventListener('mouseenter', () => clearTimeout(megaTimer)));
    $$('[data-mega-plain]').forEach(a => a.addEventListener('mouseenter', () => { clearTimeout(megaTimer); megaTimer = setTimeout(close, 120); }));
    scrim && scrim.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    setCount('cart', cartCount());
    setCount('fav', favs.size);
  }

  /* ---------- hledání ---------- */
  function search() {
    const dlg = $('#search'); if (!dlg) return;
    const input = $('#search-input'), res = $('#search-res');
    const draw = () => {
      const q = norm(input.value.trim());
      let list;
      if (q) {
        const words = q.split(/\s+/);
        list = D.products.filter(p => { const hay = norm(p.name + ' ' + p.tag + ' ' + (D.cats[p.cat] || '') + ' ' + (p.color || '') + ' ' + (p.collab || '')); return words.every(w => hay.includes(w)); });
      } else list = D.products.filter(p => p.drop).slice(0, 6);
      $('#search-label').textContent = q ? (list.length ? 'Výsledky (' + list.length + ')' : '') : 'Nový drop';
      res.innerHTML = list.slice(0, 12).map(p => '<a class="sres" href="produkt.html?id=' + p.id + '"><img src="' + p.images[0] + '" alt="" loading="lazy"><b>' + esc(p.name) + '</b><span>' + priceOf(p) + '</span></a>').join('');
      $('#search-empty').hidden = !(q && !list.length);
    };
    input.addEventListener('input', draw);
    input.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); dlg.close(); } });
    $$('[data-q]').forEach(b => b.addEventListener('click', () => { input.value = b.dataset.q; draw(); input.focus(); }));
    const openIt = () => { draw(); dlg.showModal(); setTimeout(() => input.focus(), 30); };
    $$('[data-open="search"]').forEach(b => b.addEventListener('click', openIt));
    document.addEventListener('keydown', e => {
      if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName) && !$('dialog[open]')) { e.preventDefault(); openIt(); }
    });
  }

  /* ---------- dialogy ---------- */
  function dialogs() {
    const sync = () => {
      const any = !!$('dialog[open]');
      root.classList.toggle('has-modal', any);
      if (lenis) { if (any) lenis.stop(); else lenis.start(); }
    };
    $$('dialog').forEach(d => {
      d.setAttribute('data-lenis-prevent', '');
      d.addEventListener('click', e => { if (e.target === d) d.close(); });
      new MutationObserver(sync).observe(d, { attributes: true, attributeFilter: ['open'] });
    });
    $$('[data-open="cart"]').forEach(b => b.addEventListener('click', openCart));
    $$('[data-open="menu"]').forEach(b => b.addEventListener('click', () => $('#mnav').showModal()));
    $$('[data-open="favs"]').forEach(b => b.addEventListener('click', () => {
      if (!favs.size) { toast('Zatím nic uloženého. Klikni na srdíčko u produktu.'); return; }
      const names = Array.from(favs).map(id => D.byId[id].name);
      toast('V oblíbených: ' + names.slice(0, 2).join(', ') + (names.length > 2 ? ' a další' : ''));
    }));
  }

  /* ---------- přechody stránek: stažení barvy jako při tisku ---------- */
  const ink = () => $('.ink');
  const poly = (a, b) => 'polygon(' + a + '% 0%, ' + (b + 8) + '% 0%, ' + b + '% 100%, ' + (a - 8) + '% 100%)';
  function leave(url, color) {
    const el = ink();
    if (!el || reduce || !G) { location.href = url; return; }
    el.style.setProperty('--ink-c', color || '#000');
    el.classList.add('is-on');
    sess.set('ink', color || '#000');
    const o = { b: -10 };
    G.to(o, { b: 104, duration: 0.62, ease: 'power3.inOut', onUpdate: () => { el.style.clipPath = poly(-10, o.b); }, onComplete: () => { location.href = url; } });
  }
  function arrive() {
    const el = ink(); if (!el) return;
    const c = sess.get('ink'); sess.del('ink');
    if (!root.classList.contains('ink-in') || !c) { root.classList.remove('ink-in'); return; }
    el.style.setProperty('--ink-c', c);
    el.classList.add('is-on');
    el.style.clipPath = poly(-10, 104);
    root.classList.remove('ink-in');
    if (!G || reduce) { el.classList.remove('is-on'); el.style.clipPath = ''; return; }
    const o = { a: -10 };
    G.to(o, { a: 116, duration: 0.8, delay: 0.08, ease: 'power3.inOut', onUpdate: () => { el.style.clipPath = poly(o.a, 104); }, onComplete: () => { el.classList.remove('is-on'); el.style.clipPath = ''; } });
  }
  window.addEventListener('pageshow', e => { if (e.persisted) { const el = ink(); if (el) { el.classList.remove('is-on'); el.style.clipPath = ''; } $$('.veil.is-live, .zoom-clone').forEach(x => x.remove()); const v = $('.veil'); if (v) v.style.opacity = 0; } });

  /* zoom fotky z karty do detailu (pokračuje na detailu produktu) */
  function zoomLeave(url, el, bg) {
    const img = el.tagName === 'IMG' ? el : ($('img', el) || el);
    const r = img.getBoundingClientRect();
    if (reduce || !G || !r.width) { leave(url); return; }
    const fig = el.closest('[data-fig-src]');
    const src = fig ? fig.dataset.figSrc : (img.currentSrc || img.src);
    const masked = !!(fig && fig.dataset.figMasked);
    sess.set('zoom', { src, masked, bg: bg || '', r: { x: r.left, y: r.top, w: r.width, h: r.height } });
    const veil = document.createElement('div'); veil.className = 'veil is-live'; veil.style.background = bg || '#fff'; document.body.appendChild(veil);
    const c = document.createElement('div'); c.className = 'zoom-clone';
    c.innerHTML = masked ? figHTML(src) : '<img src="' + src + '" alt="">';
    Object.assign(c.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
    document.body.appendChild(c);
    G.fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 0.42, ease: 'power2.out' });
    G.to(c, { scale: 1.04, duration: 0.5, ease: 'power2.out', onComplete: () => { location.href = url; } });
  }
  /* příjezd: klon letí z místa kliknutí na cílový výřez a závoj zmizí */
  function zoomArrive(target) {
    const z = sess.get('zoom'); sess.del('zoom');
    const veil = $('.veil');
    root.classList.remove('zoom-in');
    if (!z || !veil) return false;
    veil.style.opacity = 1;
    const done = () => G ? G.to(veil, { opacity: 0, duration: 0.6, ease: 'power2.out', onComplete: () => { veil.style.opacity = 0; } }) : (veil.style.opacity = 0);
    if (!target || !G || reduce) { done(); return true; }
    const c = document.createElement('div'); c.className = 'zoom-clone is-arrive';
    c.innerHTML = z.masked ? figHTML(z.src) : '<img src="' + z.src + '" alt="">';
    Object.assign(c.style, { left: z.r.x + 'px', top: z.r.y + 'px', width: z.r.w + 'px', height: z.r.h + 'px' });
    document.body.appendChild(c);
    if (lenis) lenis.scrollTo(0, { immediate: true }); else window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      const t = target.getBoundingClientRect();
      G.timeline()
        .to(c, { left: t.left, top: t.top, width: t.width, height: t.height, duration: 0.95, ease: 'expo.inOut' })
        .add(done, '-=0.12')
        .to(c, { opacity: 0, duration: 0.45, ease: 'power1.out', onComplete: () => c.remove() }, '-=0.35');
    });
    return true;
  }
  /* ---------- kurzor s popiskem ---------- */
  function cursor() {
    if (!fine || reduce || !G) return;
    const c = document.createElement('div'); c.className = 'cur'; c.setAttribute('aria-hidden', 'true');
    c.innerHTML = '<span class="cur-dot"></span><span class="cur-label"></span>';
    document.body.appendChild(c);
    const lbl = $('.cur-label', c);
    const qx = G.quickTo(c, 'x', { duration: 0.35, ease: 'power3' }), qy = G.quickTo(c, 'y', { duration: 0.35, ease: 'power3' });
    let shown = false;
    window.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      if (!shown) { G.set(c, { x: e.clientX, y: e.clientY }); shown = true; c.classList.add('is-on'); }
      qx(e.clientX); qy(e.clientY);
    }, { passive: true });
    document.addEventListener('pointerover', e => {
      const t = e.target.closest && e.target.closest('[data-cursor]');
      if (t && !t.closest('dialog:not([open])')) { lbl.textContent = t.dataset.cursor; c.classList.add('is-label'); c.style.setProperty('--cur-bg', t.dataset.cursorBg || '#000'); c.style.setProperty('--cur-fg', t.dataset.cursorFg || '#fff'); }
      else c.classList.remove('is-label');
    });
    document.addEventListener('pointerleave', () => c.classList.remove('is-on'));
    document.addEventListener('pointerenter', () => { if (shown) c.classList.add('is-on'); });
    window.addEventListener('pointerdown', () => c.classList.add('is-down'));
    window.addEventListener('pointerup', () => c.classList.remove('is-down'));
  }

  /* ---------- rychlý náhled (FLIP z karty) ---------- */
  function quickView(id, fromImg) {
    const dlg = $('#qv'); if (!dlg) return;
    const p = D.byId[id]; if (!p) return;
    const one = isOne(p);
    let size = one ? sizesOf(p)[0][0] : null;
    const st = stageOf(p);
    $('#qv-body').innerHTML =
      '<div class="qv-media" style="--bg:' + st.bg + '"><img id="qv-img" src="' + p.images[0] + '" alt="' + esc(p.name) + '">' +
      (p.images.length > 1 ? '<div class="qv-thumbs">' + p.images.slice(0, 5).map((s, k) => '<button type="button" data-qvk="' + k + '" aria-label="Fotka ' + (k + 1) + '" aria-current="' + (k === 0) + '"><img src="' + s + '" alt=""></button>').join('') + '</div>' : '') + '</div>' +
      '<div class="qv-info"><p class="qv-tag">' + esc(p.collab || D.cats[p.cat] || '') + '</p><h2 id="qv-h">' + esc(p.name) + '</h2><p class="qv-price">' + priceOf(p) + '</p><p class="qv-desc">' + esc(p.desc || p.tag) + '</p>' +
      '<div class="qv-sizes" role="radiogroup" aria-label="Velikost">' + (one ? '' : sizesOf(p).map(([s, v]) => { const k = stockOf(v, p).k; return '<button class="size is-' + k + '" type="button" role="radio" aria-checked="false" data-s="' + esc(s) + '">' + esc(s) + '</button>'; }).join('')) + '</div>' +
      '<p class="stock" id="qv-stock" aria-live="polite">' + (one ? esc(stockOf(sizesOf(p)[0][1], p).t) : 'Vyber velikost.') + '</p>' +
      '<div class="qv-actions"><button class="btn" type="button" id="qv-add">Přidat do košíku</button><button class="fav" type="button" data-fav="' + p.id + '" aria-pressed="' + favs.has(p.id) + '" aria-label="Uložit do oblíbených">' + I.heart + '</button></div>' +
      '<div class="qv-links"><a class="textlink" href="produkt.html?id=' + p.id + '" data-zoom-from="#qv-img">Celý detail produktu</a>' + (D.looks[p.id] ? '<button class="textlink" type="button" data-look="' + p.id + '">Celý look</button>' : '') + '</div></div>';
    const stock = $('#qv-stock');
    $('.qv-sizes', dlg).addEventListener('click', e => {
      const b = e.target.closest('.size'); if (!b) return;
      size = b.dataset.s; $$('.qv-sizes .size', dlg).forEach(x => x.setAttribute('aria-checked', String(x === b)));
      const v = (sizesOf(p).find(s => s[0] === size) || [])[1]; const s2 = stockOf(v, p);
      stock.className = 'stock is-' + s2.k; stock.innerHTML = '<i></i>' + esc(s2.t);
    });
    $('.qv-thumbs', dlg) && $('.qv-thumbs', dlg).addEventListener('click', e => {
      const b = e.target.closest('[data-qvk]'); if (!b) return;
      $('#qv-img').src = p.images[Number(b.dataset.qvk)];
      $$('[data-qvk]', dlg).forEach(x => x.setAttribute('aria-current', String(x === b)));
    });
    $('#qv-add').addEventListener('click', () => {
      const v = size ? (sizesOf(p).find(s => s[0] === size) || [])[1] : undefined;
      if (v === undefined) { stock.className = 'stock is-low'; stock.innerHTML = '<i></i>Nejdřív vyber velikost.'; const z = $('.qv-sizes', dlg); z.classList.remove('shake'); void z.offsetWidth; z.classList.add('shake'); return; }
      if (v === 0) { toast('Tahle velikost teď není. Na detailu si můžeš zapnout hlídání.'); return; }
      if (v === 'obj') toast('Velikost ' + size + ' vytiskneme na objednávku (' + leadTime(p) + ')');
      const im = $('#qv-img'); dlg.close();
      addToCart(p.id, size, p.colors ? p.colors[0].name : '', im);
    });
    dlg.showModal();
    const img = $('#qv-img');
    if (G && !reduce && fromImg) {
      const a = fromImg.getBoundingClientRect(), b = img.getBoundingClientRect();
      if (a.width && b.width) {
        G.fromTo(img, { x: a.left - b.left, y: a.top - b.top, scaleX: a.width / b.width, scaleY: a.height / b.height, transformOrigin: '0 0' },
          { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.75, ease: 'expo.out', clearProps: 'transform' });
        G.fromTo($('.qv-info', dlg).children, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, delay: 0.18, ease: 'power3.out' });
      }
    }
  }

  /* ---------- celý look ---------- */
  function openLook(pid, opts) {
    const dlg = $('#look'); if (!dlg) return;
    opts = opts || {};
    const main = D.byId[pid]; if (!main) return;
    const ids = [pid].concat(D.looks[pid] || []).filter(id => D.byId[id]);
    const st = stageOf(main);
    const pick = {};
    ids.forEach(id => { const p = D.byId[id]; pick[id] = { on: !!firstAvail(p, id === pid ? opts.size : null), size: firstAvail(p, id === pid ? opts.size : null), color: p.colors ? p.colors[0].name : '' }; });
    const figSrc = opts.img || main.images[0];
    const head = '<div class="look-head"><span class="look-pic"><img src="' + figSrc + '" alt=""></span><div class="look-meta"><span class="look-sl" style="--c:' + st.bg + ';--a:' + st.fg + '">' + st.lines.map(esc).join(' ') + '</span>' + (opts.who ? '<p class="look-who">Na fotce: ' + esc(opts.who) + '</p>' : '') + '<p class="look-n">' + ids.length + ' kousky dohromady za ' + fmt(ids.reduce((a, id) => a + D.byId[id].price, 0)) + '</p></div></div>';
    const rows = ids.map(id => {
      const p = D.byId[id]; const list = sizesOf(p); const one = list.length === 1;
      return '<div class="lrow" data-lid="' + id + '"><label class="lchk"><input type="checkbox" ' + (pick[id].on ? 'checked' : '') + (pick[id].size ? '' : ' disabled') + ' aria-label="Přidat ' + esc(p.name) + '"><span>' + I.check + '</span></label>' +
        '<a class="lrow-img" href="produkt.html?id=' + id + '"><img src="' + p.images[0] + '" alt=""></a>' +
        '<div class="lrow-info"><b>' + esc(p.name) + '</b><span>' + priceOf(p) + (id === pid && opts.size ? ' · na fotce velikost ' + esc(opts.size) : '') + '</span>' +
        (one ? '<small>' + esc(sizeLabelFor(p, list[0][0]) + (stockOf(list[0][1], p).t ? ' · ' + stockOf(list[0][1], p).t : '')) + '</small>' :
          '<div class="lsizes">' + list.map(([s, v]) => { const k = stockOf(v, p).k; return '<button type="button" class="size is-' + k + '" data-ls="' + esc(s) + '" aria-pressed="' + (s === pick[id].size) + '"' + (k === 'out' ? ' disabled' : '') + '>' + esc(s) + '</button>'; }).join('') + '</div>') +
        (!pick[id].size ? '<small class="is-out">Momentálně nedostupné</small>' : '') + '</div></div>';
    }).join('');
    $('#look-body').innerHTML = head + '<p class="look-note">Kousky z focení a doplňky, které k nim nosíme. Velikost si uprav, co nechceš, odškrtni.</p><div class="lrows">' + rows + '</div>';
    const sum = () => {
      let t = 0, n = 0;
      ids.forEach(id => { if (pick[id].on && pick[id].size) { t += D.byId[id].price; n++; } });
      $('#look-sum').textContent = fmt(t);
      const b = $('#look-add'); b.textContent = n ? 'Přidat do košíku (' + n + ' ' + (n === 1 ? 'kus' : n < 5 ? 'kusy' : 'kusů') + ')' : 'Vyber aspoň jeden kus'; b.disabled = !n;
    };
    $('#look-body').onclick = e => {
      const b = e.target.closest('[data-ls]');
      if (b) { const id = b.closest('[data-lid]').dataset.lid; pick[id].size = b.dataset.ls; $$('[data-ls]', b.parentElement).forEach(x => x.setAttribute('aria-pressed', String(x === b))); const v = (sizesOf(D.byId[id]).find(s => s[0] === b.dataset.ls) || [])[1]; if (v === 'obj') toast('Velikost ' + b.dataset.ls + ' vytiskneme na objednávku'); sum(); }
    };
    $('#look-body').onchange = e => { const c = e.target.closest('input[type=checkbox]'); if (c) { pick[c.closest('[data-lid]').dataset.lid].on = c.checked; sum(); } };
    $('#look-add').onclick = () => {
      const items = ids.filter(id => pick[id].on && pick[id].size).map(id => ({ id, size: pick[id].size, color: pick[id].color }));
      if (!items.length) return;
      const im = $('.look-pic img', dlg); dlg.close();
      addMany(items, im);
    };
    sum();
    if (!dlg.open) dlg.showModal();
    if (G && !reduce) G.fromTo($$('.lrow', dlg), { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, stagger: 0.07, delay: 0.15, ease: 'power3.out' });
  }

  /* ---------- stories ---------- */
  const seen = new Set(store.get('seen', []));
  function markSeen(id) { seen.add(id); store.set('seen', Array.from(seen)); $$('[data-story="' + id + '"]').forEach(b => b.classList.add('is-seen')); }
  /* ---------- stories: karusel jako na Instagramu ---------- */
  const STY = {
    drop: { bg: '#000000', fg: '#e8c25a' }, volno: { bg: '#4e5c78', fg: '#e8c25a' }, nazdar: { bg: '#244648', fg: '#a2dea2' },
    lide: { bg: '#eebdbe', fg: '#000000' }, nalejto: { bg: '#e8c25a', fg: '#000000' }, dilna: { bg: '#c8352b', fg: '#ffffff' }
  };
  const styOf = s => STY[s.id] || { bg: '#000', fg: '#fff' };
  function storyCover(s) {
    const c = styOf(s);
    return '<span class="cov" style="--c:' + c.bg + ';--a:' + c.fg + '"><span class="cov-bars">' + s.slides.map(() => '<i></i>').join('') + '</span>' +
      '<span class="cov-t">' + esc(s.title) + '</span><span class="cov-pic"><img src="' + D.u(s.cover) + '" alt="" loading="lazy" style="object-position:' + (s.coverPos || '50% 22%') + '"></span></span>';
  }
  function stories() {
    const dlg = $('#story'); if (!dlg) return null;
    const track = $('#sv-track', dlg);
    const DUR = 5600;
    let si = 0, ki = 0, t0 = 0, elapsed = 0, paused = false, hold = false, raf = 0, holdT = 0, cards = [];
    const mob = () => window.innerWidth < 700;
    function build() {
      track.innerHTML = D.stories.map((s, i) => '<div class="svc" data-si="' + i + '"><button class="svc-cov" type="button" tabindex="-1" aria-label="Příběh ' + esc(s.title) + '">' + storyCover(s) + '</button></div>').join('');
      cards = $$('.svc', track);
    }
    function place(instant) {
      const h = mob() ? window.innerHeight : Math.min(window.innerHeight * 0.88, 880), w = mob() ? window.innerWidth : h * 9 / 16;
      const sw = w * 0.42, gap = 28;
      dlg.style.setProperty('--sw', w + 'px'); dlg.style.setProperty('--sh', h + 'px');
      cards.forEach((c, i) => {
        const d = i - si, ad = Math.abs(d);
        let x = 0, s = 1, o = 1;
        if (mob()) { x = d * w; o = ad ? 0 : 1; }
        else if (d) { x = Math.sign(d) * (w / 2 + gap + sw / 2 + (ad - 1) * (sw + gap)); s = 0.42; o = ad > 2 ? 0 : 0.55; }
        c.style.transition = instant ? 'none' : '';
        c.style.transform = 'translate3d(' + x + 'px,0,0) scale(' + s + ')';
        c.style.opacity = o;
        c.classList.toggle('is-active', !d);
        c.style.pointerEvents = ad > 2 ? 'none' : '';
      });
    }
    function live() {
      const s = D.stories[si], sl = s.slides[ki], c = styOf(s);
      const card = cards[si];
      let L = $('.svl', card);
      if (!L) {
        $$('.svl', track).forEach(x => x.remove());
        card.insertAdjacentHTML('beforeend', '<div class="svl" style="--c:' + c.bg + ';--a:' + c.fg + '"><div class="svl-media"></div><div class="svl-top"><div class="svl-bars"></div><div class="svl-head"><span class="svl-ava"><img src="' + D.logo + '" alt=""></span><b>knedlozelowear</b><span class="svl-t"></span><button class="svl-pause" type="button" aria-label="Pozastavit"></button><button class="svl-x" type="button" aria-label="Zavřít příběhy">' + I.x + '</button></div></div><div class="svl-tap" aria-hidden="true"></div><p class="svl-text"></p><div class="svl-tag"></div></div>');
        L = $('.svl', card); bindLive(L);
      }
      $('.svl-t', L).textContent = s.title;
      $('.svl-bars', L).innerHTML = s.slides.map((_, k) => '<span><i style="transform:scaleX(' + (k < ki ? 1 : 0) + ')"></i></span>').join('');
      const src = D.u(sl.img);
      const m = $('.svl-media', L);
      m.innerHTML = '<img src="' + src + '" alt="" style="object-position:' + (sl.pos || '50% 30%') + '">';
      $('.svl-text', L).innerHTML = sl.text ? '<span>' + esc(sl.text) + '</span>' : '';
      const tag = $('.svl-tag', L);
      tag.innerHTML = sl.pid && D.byId[sl.pid] ? sticker(D.byId[sl.pid]) : (sl.link ? '<a class="btn btn-light svl-link" href="' + sl.link + '" data-story-close>' + esc(sl.linkText || 'Zobrazit') + '</a>' : '');
      tag.dataset.pid = sl.pid || '';
      L.style.setProperty('--tagh', (tag.offsetHeight || 0) + 'px');
      syncPause();
      elapsed = 0; t0 = performance.now();
      const nx = s.slides[ki + 1] || (D.stories[si + 1] && D.stories[si + 1].slides[0]);
      if (nx) { const pre = new Image(); pre.src = D.u(nx.img); }
    }
    function sticker(p) {
      const list = sizesOf(p), one = list.length === 1;
      const inCart = cart.some(l => l.id === p.id);
      return '<div class="stk"><a class="stk-img" href="produkt.html?id=' + p.id + '" data-story-close><img src="' + p.images[0] + '" alt=""></a><div class="stk-txt"><b>' + esc(p.name) + '</b><span>' + priceOf(p) + '</span></div>' +
        (one ? '' : '<div class="stk-sizes" role="radiogroup" aria-label="Velikost">' + list.map(([sz, v]) => { const k = stockOf(v, p).k; return '<button type="button" role="radio" aria-checked="false" class="size is-' + k + '" data-s="' + esc(sz) + '"' + (k === 'out' ? ' disabled' : '') + ' title="' + esc(stockOf(v, p).t) + '">' + esc(sz) + '</button>'; }).join('') + '</div>') +
        '<button class="stk-add" type="button"' + (one && list[0][1] === 0 ? ' disabled' : (one ? '' : ' disabled')) + '>' + (one ? (list[0][1] === 0 ? 'Vyprodáno' : 'Přidat do košíku') : 'Nejdřív vyber velikost') + '</button>' +
        '<p class="stk-note">' + (inCart ? 'Už máš v košíku. <button type="button" data-story-cart>Zobrazit košík</button>' : '<a href="produkt.html?id=' + p.id + '" data-story-close>Detail produktu</a>') + '</p></div>';
    }
    function bindLive(L) {
      const tag = $('.svl-tag', L), zone = $('.svl-tap', L);
      $('.svl-x', L).addEventListener('click', () => dlg.close());
      $('.svl-pause', L).addEventListener('click', () => { paused = !paused; syncPause(); });
      tag.addEventListener('pointerenter', () => { hold = true; });
      tag.addEventListener('pointerleave', () => { hold = false; });
      tag.addEventListener('focusin', () => { hold = true; });
      tag.addEventListener('focusout', () => { hold = false; });
      tag.addEventListener('click', e => {
        if (e.target.closest('[data-story-close]')) { dlg.close(); return; }
        if (e.target.closest('[data-story-cart]')) { dlg.close(); openCart(); return; }
        const p = D.byId[tag.dataset.pid]; if (!p) return;
        const sz = e.target.closest('.stk-sizes [data-s]');
        const add = $('.stk-add', tag);
        if (sz && !sz.disabled) {
          $$('.stk-sizes [data-s]', tag).forEach(b => b.setAttribute('aria-checked', String(b === sz)));
          add.disabled = false; add.classList.remove('is-done');
          const v = (sizesOf(p).find(s => s[0] === sz.dataset.s) || [])[1];
          add.textContent = 'Přidat do košíku · ' + sz.dataset.s;
          $('.stk-note', tag).textContent = stockOf(v, p).t;
          return;
        }
        if (e.target.closest('.stk-add') && !add.disabled && !add.classList.contains('is-done')) {
          const one = isOne(p);
          const s = one ? sizesOf(p)[0][0] : ($('.stk-sizes [aria-checked="true"]', tag) || {}).dataset.s;
          if (!s) return;
          addToCart(p.id, s, p.colors ? p.colors[0].name : '', $('.stk-img img', tag), { silent: true });
          add.classList.add('is-done'); add.innerHTML = I.check + 'V košíku' + (one ? '' : ' · ' + esc(s));
          $('.stk-note', tag).innerHTML = 'Přidáno. <button type="button" data-story-cart>Zobrazit košík (' + cartCount() + ')</button>';
          toast('Přidáno do košíku: ' + p.name + (one ? '' : ', ' + s));
        }
      });
      let sx = 0, sy = 0, held = false;
      zone.addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; held = false; clearTimeout(holdT); holdT = setTimeout(() => { held = true; hold = true; L.classList.add('is-held'); }, 220); });
      zone.addEventListener('pointerup', e => {
        clearTimeout(holdT);
        if (held) { held = false; hold = false; L.classList.remove('is-held'); return; }
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (dy > 90 && Math.abs(dy) > Math.abs(dx)) { dlg.close(); return; }
        if (Math.abs(dx) > 60) { go(si + (dx < 0 ? 1 : -1), 0); return; }
        const r = zone.getBoundingClientRect();
        if (e.clientX - r.left < r.width * 0.3) prev(); else next();
      });
      zone.addEventListener('pointercancel', () => { clearTimeout(holdT); hold = false; L.classList.remove('is-held'); });
    }
    function syncPause() { const b = $('.svl-pause', track); if (b) { b.innerHTML = paused ? I.play : I.pause; b.setAttribute('aria-label', paused ? 'Pokračovat' : 'Pozastavit'); } }
    function tick(now) {
      if (!dlg.open) return;
      if (paused || hold) t0 = now - elapsed; else elapsed = now - t0;
      const bar = $('.svl-bars span:nth-child(' + (ki + 1) + ') i', track);
      if (bar) bar.style.transform = 'scaleX(' + Math.min(1, elapsed / DUR) + ')';
      if (elapsed >= DUR) next();
      raf = requestAnimationFrame(tick);
    }
    function go(i, k) {
      if (i < 0) { ki = 0; live(); return; }
      if (i >= D.stories.length) { dlg.close(); return; }
      const changed = i !== si;
      si = i; ki = k || 0; markSeen(D.stories[si].id);
      if (changed) { $$('.svl', track).forEach(x => x.remove()); place(); }
      live();
    }
    function next() { if (ki < D.stories[si].slides.length - 1) { ki++; live(); } else go(si + 1, 0); }
    function prev() { if (ki > 0) { ki--; live(); } else if (si > 0) go(si - 1, 0); else live(); }
    function open(id, k) {
      if (!cards.length) build();
      si = Math.max(0, D.stories.findIndex(s => s.id === id)); ki = k || 0; paused = false; hold = false;
      markSeen(D.stories[si].id);
      $$('.svl', track).forEach(x => x.remove());
      dlg.showModal();
      place(true);
      live();
      cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
      if (!reduce) cards[si].animate([{ transform: cards[si].style.transform + ' scale(.92)', opacity: 0 }, { transform: cards[si].style.transform, opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' });
    }
    track.addEventListener('click', e => { const c = e.target.closest('.svc'); if (c && !c.classList.contains('is-active')) go(Number(c.dataset.si), 0); });
    $('.sv-nav.is-prev', dlg).addEventListener('click', () => go(si - 1, 0));
    $('.sv-nav.is-next', dlg).addEventListener('click', () => go(si + 1, 0));
    dlg.addEventListener('keydown', e => {
      if (e.target.closest && e.target.closest('.svl-tag')) return;
      if (e.key === 'ArrowRight') { next(); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { prev(); e.preventDefault(); }
      if (e.key === ' ') { paused = !paused; syncPause(); e.preventDefault(); }
    });
    dlg.addEventListener('close', () => { cancelAnimationFrame(raf); $$('.svl', track).forEach(x => x.remove()); });
    window.addEventListener('resize', () => { if (dlg.open) place(true); });
    document.addEventListener('click', e => { const b = e.target.closest('[data-story]'); if (b) { e.preventDefault(); open(b.dataset.story, Number(b.dataset.slide || 0)); } });
    return { open };
  }

  /* ---------- delegované kliky ---------- */
  function sameDoc(a) {
    const u = new URL(a.href, location.href);
    return u.pathname === location.pathname && u.search === location.search && u.hash;
  }
  function delegate() {
    document.addEventListener('click', e => {
      const t = e.target;
      const close = t.closest('[data-close]');
      if (close) { const d = close.closest('dialog'); if (d) d.close(); if (close.tagName !== 'A') return; }

      const add = t.closest('[data-add]');
      if (add) {
        e.preventDefault();
        const p = D.byId[add.dataset.add];
        const size = add.dataset.size, color = add.dataset.color;
        const v = (sizesOf(p).find(s => s[0] === size) || [])[1];
        if (add.getAttribute('aria-disabled') === 'true' || v === 0) {
          toast(isOne(p) ? 'Teď je vyprodáno. Na detailu si můžeš zapnout hlídání.' : 'Velikost ' + size + ' teď není. Na detailu si můžeš zapnout hlídání.');
          return;
        }
        const card = add.closest('.card');
        const img = card ? $('.card-media img', card) : (add.closest('.pairup, .pair') ? $('img', add.closest('.pairup, .pair')) : null);
        if (card) card.classList.remove('is-quick');
        if (v === 'obj') toast('Velikost ' + size + ' vytiskneme na objednávku (' + leadTime(p) + ')');
        addToCart(p.id, size, color, img);
        return;
      }
      const fav = t.closest('[data-fav]');
      if (fav) { e.preventDefault(); toggleFav(fav.dataset.fav); return; }
      const qv = t.closest('[data-qv]');
      if (qv) { e.preventDefault(); const card = qv.closest('.card'); quickView(qv.dataset.qv, card ? $('.card-media img', card) : null); return; }
      const lk = t.closest('[data-look]');
      if (lk) { e.preventDefault(); const d = lk.closest('dialog'); if (d && d.id !== 'look') d.close(); openLook(lk.dataset.look, { size: lk.dataset.lookSize, img: lk.dataset.lookImg, who: lk.dataset.lookWho }); return; }
      const quick = t.closest('[data-quick]');
      if (quick) { const c = quick.closest('.card'); $$('.card.is-quick').forEach(x => x !== c && x.classList.remove('is-quick')); c.classList.toggle('is-quick'); return; }

      const swap = t.closest('[data-swap]');
      if (swap) {
        const card = swap.closest('.card');
        if (card && card.dataset.id !== swap.dataset.swap) {
          const tmp = document.createElement('div'); tmp.innerHTML = cardHTML(D.byId[swap.dataset.swap]);
          const nc = tmp.firstChild; card.replaceWith(nc);
          if (G && !reduce) G.fromTo($('.card-media', nc), { opacity: 0.4 }, { opacity: 1, duration: 0.35 });
        } else if (!card && swap.dataset.swap !== document.body.dataset.pid) {
          leave('produkt.html?id=' + swap.dataset.swap);
        }
        return;
      }
      const qty = t.closest('[data-qty]');
      if (qty) {
        const key = qty.closest('.line').dataset.key; const l = cart.find(x => x.key === key);
        if (l) { l.qty += Number(qty.dataset.qty); if (l.qty < 1) cart = cart.filter(x => x !== l); saveCart(); }
        return;
      }
      const rm = t.closest('[data-remove]');
      if (rm) { const key = rm.closest('.line').dataset.key; cart = cart.filter(x => x.key !== key); saveCart(); return; }
      if (t.closest('[data-checkout]')) { toast('Pokladna není součástí konceptu. Navázal by checkout Shoptetu.'); return; }
      const soon = t.closest('[data-soon]');
      if (soon) { e.preventDefault(); toast('V konceptu je hotová homepage a detail produktu.'); return; }

      const cb = t.closest('.concept-btn');
      if (cb) { cb.parentElement.classList.toggle('is-open'); cb.setAttribute('aria-expanded', cb.parentElement.classList.contains('is-open')); return; }
      if (!t.closest('.concept')) { const c = $('.concept.is-open'); if (c) c.classList.remove('is-open'); }
      if (!t.closest('.card')) $$('.card.is-quick').forEach(x => x.classList.remove('is-quick'));

      /* odkazy: kotvy plynule, stránky přes přechod */
      const a = t.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
      const href = a.getAttribute('href');
      if (!href || /^(mailto|tel|https?):/i.test(href)) return;
      if (href.charAt(0) === '#' || sameDoc(a)) {
        const id = decodeURIComponent((href.split('#')[1] || ''));
        const el = id && document.getElementById(id);
        if (el) { e.preventDefault(); const d = a.closest('dialog'); if (d) d.close(); scrollToEl(el); history.replaceState(null, '', '#' + id); }
        return;
      }
      if (!/\.html/.test(href)) return;
      e.preventDefault();
      const d = a.closest('dialog');
      const zf = a.dataset.zoomFrom ? $(a.dataset.zoomFrom) : null;
      if (a.hasAttribute('data-zoom') || zf) { if (zf) { zoomLeave(a.href, zf); if (d) d.close(); } else zoomLeave(a.href, a); return; }
      if (d) d.close();
      leave(a.href, a.dataset.ink);
    });
    $$('form[data-news]').forEach(f => f.addEventListener('submit', e => {
      e.preventDefault();
      const i = $('input', f);
      if (!i.value || !i.checkValidity()) { i.focus(); toast('Zkontroluj prosím e-mail.'); return; }
      i.value = ''; toast('Díky. V konceptu se e-mail nikam neodesílá.');
    }));
  }

  /* ---------- text: rozdělení na znaky a přizpůsobení šířce ---------- */
  function splitChars(el) {
    const words = el.textContent.split(' ');
    el.innerHTML = words.map(w => '<span class="w">' + Array.from(w).map(c => '<span class="c">' + esc(c) + '</span>').join('') + '</span>').join(' ');
    return $$('.c', el);
  }
  function fitLines(lines, maxW, maxH, family) {
    const ctx = fitLines.c || (fitLines.c = document.createElement('canvas').getContext('2d'));
    ctx.font = '800 100px ' + (family || '"League Spartan"');
    const w = Math.max.apply(null, lines.map(l => ctx.measureText(l).width));
    return Math.min(maxH, 100 * maxW / Math.max(1, w * 1.02));
  }

  /* ---------- start ---------- */
  const api = {
    D, $, $$, G, esc, fmt, num, priceOf, norm, store, sess, I, reduce, fine, lenis: null,
    maskOf, figHTML, lum, inkOn, stageOf, stockOf, sizesOf, isOne, firstAvail, leadTime, sizeLabelFor,
    toast, cardHTML, addToCart, addMany, openCart, quickView, openLook, story: null, leave, zoomLeave, zoomArrive, scrollToEl,
    splitChars, fitLines, favs, showHeader, storyCover, cartCount: () => cartCount()
  };
  window.KZW = api;
  function start() {
    api.lenis = lenis;
    header(); search(); dialogs(); delegate(); cursor();
    api.story = stories();
    renderCart();
    arrive();
    if (root.classList.contains('zoom-in') && !document.body.classList.contains('page-product')) zoomArrive(null);
    const ready = () => root.classList.add('is-ready');
    if (document.fonts && document.fonts.ready) Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 900))]).then(() => requestAnimationFrame(ready));
    else ready();
    api.ready = true;
    document.dispatchEvent(new CustomEvent('kzw:ready'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
