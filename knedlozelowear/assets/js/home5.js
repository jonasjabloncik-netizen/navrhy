/* KZW koncept v4 – homepage. Pohyb jen přes transform a opacity, žádné knihovny na scroll. */
(function () {
  'use strict';
  function init() {
    const K = window.KZW, D = K.D, $ = K.$, $$ = K.$$, esc = K.esc, G = K.G, reduce = K.reduce, fine = K.fine;
    const root = document.documentElement;
    const onReady = (imgs, cb, max) => { let n = 0, done = false; const fire = () => { if (!done) { done = true; cb(); } }; imgs.forEach(im => { if (im.complete) n++; else { im.addEventListener('load', () => { if (++n >= imgs.length) fire(); }, { once: true }); im.addEventListener('error', () => { if (++n >= imgs.length) fire(); }, { once: true }); } }); if (n >= imgs.length) fire(); setTimeout(fire, max || 1400); };

    /* =========================================================
       HERO: kampaň po dropech
       ========================================================= */
    /* ilustrace: knedlo, zelo, wear na talíři (každý kus je vlastní vrstva, animuje se jen transform a opacity) */
    const KN = '<svg viewBox="0 0 140 112"><rect x="6" y="6" width="128" height="100" rx="42" fill="#f6f1e3" stroke="#111" stroke-width="5"/><path d="M26 28 q44 -16 88 0" fill="none" stroke="#e5dcc5" stroke-width="5" stroke-linecap="round"/><g fill="#d6cbae"><circle cx="40" cy="52" r="4"/><circle cx="63" cy="68" r="3.5"/><circle cx="90" cy="50" r="4"/><circle cx="104" cy="74" r="3"/><circle cx="52" cy="84" r="3"/><circle cx="78" cy="36" r="3"/><circle cx="82" cy="86" r="2.5"/></g></svg>';
    const ZELO = '<svg viewBox="0 0 180 130"><path d="M10 104 C 8 60 52 24 96 26 C 140 28 172 62 170 100 C 168 118 140 124 92 124 C 44 124 12 120 10 104 Z" fill="#e1de97" stroke="#111" stroke-width="5" stroke-linejoin="round"/><g fill="none" stroke="#8c993b" stroke-width="3.5" stroke-linecap="round"><path d="M34 96 q14 -26 30 -6 t30 -10"/><path d="M48 70 q16 -22 34 -4 t32 -8"/><path d="M70 48 q14 -14 28 0 t26 4"/><path d="M98 102 q16 -22 30 -4 t26 -6"/><path d="M122 76 q12 -16 24 0"/><path d="M28 113 q22 -8 44 0 t44 -2 t40 -4"/></g></svg>';
    const WEAR = '<svg viewBox="0 0 200 180"><path d="M72 30 C 74 2 126 2 128 30 Z" fill="#46547a" stroke="#111" stroke-width="5" stroke-linejoin="round"/><path d="M72 26 L 42 36 C 32 40 27 46 23 56 L 7 118 C 6 124 9 128 15 130 L 30 134 C 36 135 39 132 40 126 L 52 84 L 52 162 C 52 168 56 172 62 172 L 138 172 C 144 172 148 168 148 162 L 148 84 L 160 126 C 161 132 164 135 170 134 L 185 130 C 191 128 194 124 193 118 L 177 56 C 173 46 168 40 158 36 L 128 26 C 120 40 80 40 72 26 Z" fill="#4e5c78" stroke="#111" stroke-width="5" stroke-linejoin="round"/><path d="M80 30 C 88 46 112 46 120 30" fill="none" stroke="#111" stroke-width="3.5" stroke-linecap="round"/><path d="M93 44 v20 M107 44 v20" stroke="#e8c25a" stroke-width="3" stroke-linecap="round"/><text x="100" y="106" text-anchor="middle" font-family="League Spartan, sans-serif" font-weight="800" font-size="17" letter-spacing="4" fill="#e8c25a">VOLNO</text><path d="M70 126 H130 L140 156 H60 Z" fill="#46547a" stroke="#111" stroke-width="3.5" stroke-linejoin="round"/><path d="M11 117 L 37 124 M163 124 L 189 117 M52 161 H148" stroke="#111" stroke-width="3"/></svg>';
    const STEAM = '<svg viewBox="0 0 30 80"><path d="M15 78 c-10 -12 10 -22 0 -34 s10 -22 0 -34" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/></svg>';
    const DISH = '<div class="dish" aria-hidden="true"><div class="dish-px"><span class="d-sh"></span>' +
      '<svg class="d d-plate" viewBox="0 0 440 440"><circle cx="220" cy="220" r="214" fill="#fff" stroke="#111" stroke-width="6"/><circle cx="220" cy="220" r="160" fill="none" stroke="#111" stroke-width="2.5" opacity=".22"/></svg>' +
      '<span class="d d-k d-k1">' + KN + '</span><span class="d d-k d-k2">' + KN + '</span><span class="d d-k d-k3">' + KN + '</span>' +
      '<span class="d d-zelo">' + ZELO + '</span><span class="d d-wear">' + WEAR + '</span>' +
      '<span class="d d-steam d-s1">' + STEAM + '</span><span class="d d-steam d-s2">' + STEAM + '</span><span class="d d-steam d-s3">' + STEAM + '</span>' +
      '<svg class="d d-notes" viewBox="0 0 640 560"><g fill="none" stroke="#111" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<path class="a-note n1" pathLength="1" d="M112 222 C 144 232 164 262 170 300 M158 288 L170 302 L181 286"/>' +
      '<path class="a-note n2" pathLength="1" d="M520 142 C 500 162 472 182 448 200 M454 186 L446 202 L464 205"/>' +
      '<path class="a-note n3" pathLength="1" d="M548 500 C 540 480 520 466 500 458 M508 447 L496 458 L510 468"/></g>' +
      '<text class="a-label l1" x="16" y="214">knedlo</text><text class="a-label l2" x="500" y="128">wear</text><text class="a-label l3" x="512" y="538">zelo</text></svg>' +
      '</div></div>';
    const HX = [
      { id: 'kzw', brand: true, tab: 'Knedlo Zelo Wear', bg: '#eebdbe', fg: '#000000', on: '#000000', lines: ['Knedlo,', 'zelo,', 'wear.'], dur: 9,
        copy: 'Česká klasika z Tábora, jen místo vepřa podáváme vlastní potisky. Všechno si kreslíme a tiskneme sami.' },
      { id: 'volno', pid: 'volno-heavy-box-hoody', tab: 'Volno', bg: '#4e5c78', fg: '#e8c25a', on: '#ffffff', lines: ['Konečně', 'volno.'],
        copy: 'Ultra heavy mikina 460 g/m², 100% bavlna.', cta: 'Koupit mikinu',
        main: ['2660-1_volno-hoodie-opr-4.jpg|6ac2b23f', 'Modelka 163 cm, XS'], side: ['2660-4_volno-hoodie-opr-8.jpg|6ac2b243', 'Model 187 cm, L'] },
      { id: 'nazdar', pid: 'nazdar-spinach-green-dads-cap', tab: 'Nazdar', bg: '#244648', fg: '#a2dea2', on: '#ffffff', lines: ['No', 'nazdar!'],
        copy: 'Dad’s cap s výšivkami vpředu i na obou stranách. Spinach Green a Camo.', cta: 'Vybrat kšiltovku',
        main: ['2669-4_produktovky-23.jpg|6ac2b523', 'Spinach Green'], side: ['2666-1_produktovky-27.jpg|6ac2b4b3', 'Camo'], sidePid: 'nazdar-camo-dads-cap' },
      { id: 'sedativa', pid: 'sedativa-heavy-oversize-tee', tab: 'Sedativa', bg: '#efd48f', fg: '#b83a45', on: '#000000', lines: ['Sedativa pro', 'Váš hezčí den'],
        copy: 'Fairtrade organická bavlna, oversize střih.', cta: 'Koupit triko',
        main: ['2654-2_produktovky-33.jpg|6ac2ae8f', 'Model 187 cm, M'], side: ['2654-3_produktovky-34.jpg|6ac2ae90', 'Detail potisku'] }
    ];
    const hero = $('#hero');
    if (hero) {
      const wrap = $('#hx-slides', hero), tabs = $('#hx-tabs', hero);
      wrap.innerHTML = HX.map((s, i) => {
        const ln = t => '<span class="ln"><span>' + t + '</span></span>';
        if (s.brand) return '<article class="hs hs-brand" data-i="' + i + '" style="--bg:' + s.bg + ';--fg:' + s.fg + ';--on:' + s.on + '" aria-roledescription="snímek" aria-label="' + esc(s.tab) + '">' +
          '<div class="hs-bg"></div><div class="hs-in"><div class="hs-txt">' +
          '<p class="hs-k">' + ln('<b>Od roku 2011</b>Tábor a Praha 2') + '</p>' +
          '<h1 class="hs-h">' + s.lines.map(l => ln(esc(l))).join('') + '</h1>' +
          '<p class="hs-p">' + ln(esc(s.copy)) + '</p>' +
          '<div class="hs-cta">' + ln('<a class="btn hs-btn" href="#drop">Ochutnat nový drop</a><a class="hs-link" href="#kolaborace">Prostřeno, kámo.</a>') + '</div></div>' +
          '<div class="hs-pics">' + DISH + '</div></div></article>';
        const p = D.byId[s.pid], H = 'h2';
        return '<article class="hs" data-i="' + i + '" style="--bg:' + s.bg + ';--fg:' + s.fg + ';--on:' + s.on + '" aria-roledescription="snímek" aria-label="' + esc(s.tab) + '"' + (i ? ' aria-hidden="true"' : '') + '>' +
          '<div class="hs-bg"></div><div class="hs-in"><div class="hs-txt">' +
          '<p class="hs-k">' + ln('<b>Nový drop</b>' + esc(p.name)) + '</p>' +
          '<' + H + ' class="hs-h">' + s.lines.map(l => ln(esc(l))).join('') + '</' + H + '>' +
          '<p class="hs-p">' + ln(esc(s.copy)) + '</p>' +
          '<div class="hs-cta">' + ln('<a class="btn hs-btn" href="produkt.html?id=' + p.id + '" data-zoom-from=".hs.is-active .hs-main img"' + (i ? ' tabindex="-1"' : '') + '>' + esc(s.cta) + ' · ' + K.priceOf(p) + '</a><a class="hs-link" href="#drop"' + (i ? ' tabindex="-1"' : '') + '>Celý drop</a>') + '</div></div>' +
          '<div class="hs-pics"><a class="hs-main" href="produkt.html?id=' + p.id + '" data-zoom tabindex="-1" aria-hidden="true"><span class="px"><img src="' + D.u(s.main[0]) + '" alt="" ' + (i ? 'loading="lazy"' : 'fetchpriority="high"') + '><span class="hs-cap">' + esc(s.main[1]) + '</span></span></a>' +
          '<a class="hs-side" href="produkt.html?id=' + (s.sidePid || p.id) + '" data-zoom tabindex="-1" aria-hidden="true"><span class="px"><img src="' + D.u(s.side[0]) + '" alt="" loading="lazy"><span class="hs-cap">' + esc(s.side[1]) + '</span></span></a></div>' +
          '</div></article>';
      }).join('');
      tabs.innerHTML = HX.map((s, i) => '<button class="hx-tab" type="button" role="tab" aria-selected="' + (i === 0) + '" data-hx="' + i + '" style="--dur:' + (s.dur || 6.5) + 's"><span>' + esc(s.tab) + '</span><i><b></b></i></button>').join('');
      const slides = $$('.hs', wrap), tbs = $$('.hx-tab', tabs);
      let cur = -1, leaveT = 0;
      const show = i => {
        i = (i + HX.length) % HX.length;
        if (i === cur) return;
        const prev = slides[cur];
        slides.forEach((s, k) => { if (k !== i && k !== cur) s.classList.remove('is-leaving', 'is-active'); });
        if (prev) { prev.classList.remove('is-active'); prev.classList.add('is-leaving'); prev.setAttribute('aria-hidden', 'true'); $$('a', prev).forEach(a => a.tabIndex = -1); }
        const nx = slides[i];
        nx.classList.remove('is-leaving');
        void nx.offsetWidth;
        nx.classList.add('is-active'); nx.removeAttribute('aria-hidden'); $$('.hs-txt a', nx).forEach(a => a.tabIndex = 0);
        clearTimeout(leaveT); leaveT = setTimeout(() => { if (prev) prev.classList.remove('is-leaving'); }, 1300);
        cur = i;
        hero.style.setProperty('--on', HX[i].on);
        tbs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.classList.toggle('is-on', k === i); const b = $('b', t); b.style.animation = 'none'; void b.offsetWidth; b.style.animation = ''; });
        const nimg = $$('img', slides[(i + 1) % HX.length]); nimg.forEach(im => { im.loading = 'eager'; });
      };
      tbs.forEach((t, k) => {
        t.addEventListener('click', () => show(k));
        $('b', t).addEventListener('animationend', () => { if (k === cur) show(cur + 1); });
      });
      const pauseBtn = $('#hx-pause');
      let userPaused = false;
      const setPaused = v => { hero.classList.toggle('is-paused', v); if (pauseBtn) { pauseBtn.innerHTML = (v ? K.I.play : K.I.pause) + '<span>' + (v ? 'Přehrát' : 'Pozastavit') + '</span>'; pauseBtn.setAttribute('aria-pressed', String(v)); pauseBtn.setAttribute('aria-label', v ? 'Spustit střídání dropů' : 'Pozastavit střídání dropů'); } };
      pauseBtn && pauseBtn.addEventListener('click', () => { userPaused = !userPaused; setPaused(userPaused); });
      if (reduce) { userPaused = true; setPaused(true); } else setPaused(false);
      document.addEventListener('visibilitychange', () => hero.classList.toggle('is-hidden-tab', document.hidden));
      // jemný parallax fotek podle myši (jen transform, max 2 prvky)
      if (fine && !reduce) {
        let tx = 0, ty = 0, x = 0, y = 0, run = false;
        const loop = () => {
          x += (tx - x) * 0.08; y += (ty - y) * 0.08;
          const a = slides[cur]; if (a) { const m = $('.hs-main .px', a) || $('.dish-px', a), s = $('.hs-side .px', a); if (m) m.style.transform = 'translate3d(' + (x * 14) + 'px,' + (y * 10) + 'px,0)'; if (s) s.style.transform = 'translate3d(' + (x * -26) + 'px,' + (y * -18) + 'px,0)'; }
          if (Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001) requestAnimationFrame(loop); else run = false;
        };
        hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5; if (!run) { run = true; requestAnimationFrame(loop); } });
        hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!run) { run = true; requestAnimationFrame(loop); } });
      }
      // mobil: přejetí prstem
      let sx = 0, sy = 0;
      hero.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
      hero.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) show(cur + (dx < 0 ? 1 : -1)); }, { passive: true });
      const fitH = () => slides.forEach((sEl, k) => { const tx = $('.hs-txt', sEl); const w = Math.min(tx.clientWidth || 600, 640); const cap = HX[k].lines.length > 2 ? (window.innerWidth < 900 ? 58 : Math.min(132, window.innerHeight * 0.13)) : (window.innerWidth < 900 ? 76 : Math.min(150, window.innerHeight * 0.17)); const size = K.fitLines(HX[k].lines, w, cap); $('.hs-h', sEl).style.fontSize = size + 'px'; });
      fitH(); window.addEventListener('resize', () => { clearTimeout(fitH.t); fitH.t = setTimeout(fitH, 120); });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitH);
      onReady($$('img', slides[0]), () => requestAnimationFrame(() => { root.classList.add('hx-ready'); show(0); }), 1500);
    }

    /* ticker */
    const tk = $('.ticker-track');
    if (tk) { const one = D.slogans.map(s => '<span class="ticker-item">' + esc(s) + '<i aria-hidden="true"></i></span>').join(''); tk.innerHTML = one + one; tk.setAttribute('aria-hidden', 'true'); }

    /* =========================================================
       STORIES: designové obálky
       ========================================================= */
    const srow = $('#stories');
    if (srow) {
      const seen = new Set(K.store.get('seen', []));
      srow.innerHTML = D.stories.map(s => '<li><button class="sto4' + (seen.has(s.id) ? ' is-seen' : '') + '" type="button" data-story="' + s.id + '">' + K.storyCover(s) +
        '<span class="sto4-m"><b>' + esc(s.title) + '</b><span>' + s.slides.length + ' ' + (s.slides.length < 5 ? 'snímky' : 'snímků') + '</span></span></button></li>').join('');
    }

    /* =========================================================
       NOVÝ DROP
       ========================================================= */
    const grid = $('#drop-grid');
    if (grid) {
      const list = D.products.filter(p => p.drop);
      grid.innerHTML = list.map(K.cardHTML).join('');
      const chips = $('#drop-chips');
      const cats = ['all'].concat(Array.from(new Set(list.map(p => p.cat))));
      chips.innerHTML = cats.map(c => { const n = c === 'all' ? list.length : list.filter(p => p.cat === c).length; return '<button class="chip" type="button" data-filter="' + c + '" aria-pressed="' + (c === 'all') + '">' + (c === 'all' ? 'Vše' : D.cats[c]) + '<small>' + n + '</small></button>'; }).join('');
      chips.addEventListener('click', e => {
        const ch = e.target.closest('[data-filter]'); if (!ch) return;
        const f = ch.dataset.filter;
        $$('[data-filter]', chips).forEach(c => c.setAttribute('aria-pressed', String(c === ch)));
        const cards = $$('.card', grid);
        const state = (window.Flip && !reduce) ? window.Flip.getState(cards) : null;
        cards.forEach(c => c.classList.toggle('is-hidden', f !== 'all' && c.dataset.cat !== f));
        if (state) window.Flip.from(state, { duration: 0.6, ease: 'power3.inOut', absolute: true, onEnter: els => G.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.45 }), onLeave: els => G.to(els, { opacity: 0, duration: 0.3 }) });
      });
    }

    /* =========================================================
       JAK TO SEDÍ: nakup celý look
       ========================================================= */
    const LOOKS = [
      ['p163', 0], ['p187', 0], ['p170', 0], ['p187', 1], ['p170', 1], ['p187', 2], ['p183', 0], ['p183', 1]
    ].map(([pid, j]) => { const pp = D.people.find(x => x.id === pid); return { pp, lk: pp.looks[j] }; });
    const sl = $('#sl');
    if (sl) {
      const pic = $('#sl-pic', sl), panel = $('#sl-panel', sl), thumbs = $('#sl-thumbs', sl);
      let li = -1, pick = {};
      thumbs.innerHTML = LOOKS.map(({ pp, lk }, i) => '<button class="slt" type="button" role="tab" aria-selected="false" data-li="' + i + '" aria-label="Look ' + (i + 1) + ': ' + esc(D.byId[lk.pid].name) + '"><img src="' + D.u(lk.img) + '" alt="" loading="lazy"><span>' + pp.h + ' cm</span></button>').join('');
      const tbtn = $$('.slt', thumbs);
      pic.innerHTML = '<div class="slp"><img alt=""></div><div class="slp"><img alt=""></div><span class="sl-badge"><b></b><span></span></span>';
      const layers = $$('.slp', pic); let lay = 0;
      const rowHTML = (id, main) => {
        const p = D.byId[id], list = K.sizesOf(p), one = list.length === 1, pk = pick[id];
        return '<div class="slr' + (main ? ' is-main' : '') + '" data-lid="' + id + '">' +
          (main ? '<span class="slr-chk is-fixed" aria-hidden="true">' + K.I.check + '</span>' : '<label class="slr-chk"><input type="checkbox"' + (pk.on ? ' checked' : '') + (pk.size ? '' : ' disabled') + ' aria-label="Přidat ' + esc(p.name) + '"><span>' + K.I.check + '</span></label>') +
          '<a class="slr-img" href="produkt.html?id=' + id + '"><img src="' + p.images[0] + '" alt=""></a>' +
          '<div class="slr-info"><b>' + esc(p.name) + '</b><span>' + K.priceOf(p) + '</span>' +
          (one ? '<small>' + esc(K.sizeLabelFor(p, list[0][0])) + '</small>'
            : '<div class="slr-sizes" role="radiogroup" aria-label="Velikost ' + esc(p.name) + '">' + list.map(([s, v]) => { const k = K.stockOf(v, p).k; return '<button type="button" role="radio" class="size is-' + k + '" data-ls="' + esc(s) + '" aria-checked="' + (s === pk.size) + '"' + (k === 'out' ? ' disabled' : '') + ' title="' + esc(K.stockOf(v, p).t) + '">' + esc(s) + '</button>'; }).join('') + '</div>') +
          (!pk.size ? '<small class="is-out">Momentálně nedostupné</small>' : '') + '</div></div>';
      };
      const sum = () => {
        const ids = Object.keys(pick); let t = 0, n = 0;
        ids.forEach(id => { if (pick[id].on && pick[id].size) { t += D.byId[id].price; n++; } });
        $('#sl-sum').textContent = K.fmt(t);
        const b = $('#sl-add'); b.disabled = !n; b.textContent = n ? 'Přidat look do košíku · ' + n + ' ' + (n === 1 ? 'kus' : n < 5 ? 'kusy' : 'kusů') : 'Vyber aspoň jeden kus';
      };
      const show = (i, instant) => {
        i = (i + LOOKS.length) % LOOKS.length; if (i === li) return; li = i;
        const { pp, lk } = LOOKS[i], p = D.byId[lk.pid];
        const ids = [p.id].concat(D.looks[p.id] || []).filter(id => D.byId[id]);
        pick = {}; ids.forEach(id => { const q = D.byId[id]; const s = K.firstAvail(q, id === p.id ? lk.size : null); pick[id] = { on: !!s, size: s, color: q.colors ? q.colors[0].name : '' }; });
        // fotka: prolnutí dvou vrstev
        const nl = layers[lay = 1 - lay], ol = layers[1 - lay];
        const im = $('img', nl); im.src = D.u(lk.img); im.alt = p.name + ', ' + pp.who.toLowerCase() + ' ' + pp.h + ' cm';
        const swap = () => { nl.classList.add('is-on'); ol.classList.remove('is-on'); };
        if (instant || im.complete) swap(); else { im.onload = swap; setTimeout(swap, 600); }
        const badge = $('.sl-badge', pic);
        $('b', badge).textContent = pp.h + ' cm'; $('span', badge).textContent = pp.who + ' nosí ' + lk.size;
        const fit = (p.fit || []).find(f => f.indexOf(String(pp.h)) >= 0);
        panel.innerHTML = '<div class="slpn-top"><span class="slpn-n">Look ' + String(i + 1).padStart(2, '0') + ' / ' + String(LOOKS.length).padStart(2, '0') + '</span><div class="slpn-nav"><button type="button" data-sl-go="-1" aria-label="Předchozí look">' + K.I.left + '</button><button type="button" data-sl-go="1" aria-label="Další look">' + K.I.right + '</button></div></div>' +
          '<h3 class="slpn-h">' + esc(p.name) + '</h3><p class="slpn-fit">' + esc(fit ? fit + '.' : pp.who + ' měří ' + pp.h + ' cm a na fotce má velikost ' + lk.size + '.') + (lk.back ? ' Na fotce zezadu.' : '') + '</p>' +
          '<p class="slpn-l">Na fotce</p>' + rowHTML(p.id, true) +
          (ids.length > 1 ? '<p class="slpn-l">Doplň look</p>' + ids.slice(1).map(id => rowHTML(id, false)).join('') : '') +
          '<div class="slpn-foot"><div><span>Celkem</span><b id="sl-sum"></b></div><button class="btn" type="button" id="sl-add"></button></div>';
        sum();
        tbtn.forEach((b, k) => { b.setAttribute('aria-selected', String(k === i)); b.classList.toggle('is-on', k === i); });
        const ab = tbtn[i]; if (ab && thumbs.scrollWidth > thumbs.clientWidth) thumbs.scrollTo({ left: ab.offsetLeft - thumbs.clientWidth / 2 + ab.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
        if (!instant && !reduce) panel.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' });
      };
      thumbs.addEventListener('click', e => { const b = e.target.closest('[data-li]'); if (b) show(Number(b.dataset.li)); });
      thumbs.addEventListener('keydown', e => { if (!/Arrow(Left|Right)/.test(e.key)) return; e.preventDefault(); show(li + (e.key === 'ArrowRight' ? 1 : -1)); tbtn[li].focus(); });
      panel.addEventListener('click', e => {
        const g = e.target.closest('[data-sl-go]'); if (g) { show(li + Number(g.dataset.slGo)); return; }
        const b = e.target.closest('[data-ls]');
        if (b) { const id = b.closest('[data-lid]').dataset.lid; pick[id].size = b.dataset.ls; $$('[data-ls]', b.parentElement).forEach(x => x.setAttribute('aria-checked', String(x === b))); const v = (K.sizesOf(D.byId[id]).find(s => s[0] === b.dataset.ls) || [])[1]; if (v === 'obj') K.toast('Velikost ' + b.dataset.ls + ' vytiskneme na objednávku (' + K.leadTime(D.byId[id]) + ')'); sum(); return; }
        if (e.target.closest('#sl-add')) {
          const items = Object.keys(pick).filter(id => pick[id].on && pick[id].size).map(id => ({ id, size: pick[id].size, color: pick[id].color }));
          if (items.length) K.addMany(items, $('.slp.is-on img', pic));
        }
      });
      panel.addEventListener('change', e => { const c = e.target.closest('input[type=checkbox]'); if (c) { pick[c.closest('[data-lid]').dataset.lid].on = c.checked; sum(); } });
      show(0, true);
    }

    /* =========================================================
       PROSTŘENO: porcelán a peněženky na ubruse
       ========================================================= */
    // [id, [x %, y %, viditelná šířka % (desktop)], [x, y, šířka (mobil)], natočení]
    const TB = [
      ['nalejto-hodne-nikde', [49, 28, 15.5], [28, 11, 40], 10],
      ['nalejto-dim-sum', [46, 72, 14.5], [73, 19, 38], -8],
      ['nalejto-konzum', [70, 52, 14.5], [28, 39, 38], 5],
      ['nalejto-greek-mycology', [88, 24, 13.5], [73, 47, 38], -12],
      ['nalejto-hell-low-kitty', [66, 18, 8], [15, 64, 21], -5],
      ['nalejto-plat-mat', [88, 70, 8.5], [43, 67, 22], 7],
      ['nalejto-potraviny', [61, 85, 7.5], [74, 72, 20], 6],
      ['nalejto-delay', [77, 87, 7.5], [17, 88, 20], -7],
      ['eggo-mikes', [93, 47, 8.5], [50, 89, 21], -16],
      ['eggo-skrtecek', [37, 49, 8.5], [84, 91, 20], 12]
    ];
    const cloth = $('#tb-cloth'), table = $('#tb-table'), itemsEl = $('#tb-items'), lines = $('#tb-lines');
    if (cloth && table && itemsEl) {
      itemsEl.innerHTML = TB.map(([id, , , r], i) => { const p = D.byId[id]; return '<li class="tbo" data-tid="' + id + '" style="--r:' + r + 'deg;--d:' + (i * 70 + 150) + 'ms"><button type="button" class="tbo-b" data-qv="' + id + '" aria-label="' + esc(p.short + ', ' + p.kind + ', ' + K.priceOf(p) + ', ' + p.collab) + '"><span class="tbo-sh" aria-hidden="true"></span><span class="tbo-lift">' + K.figHTML(p.images[0]) + '</span></button><span class="tbo-tag" aria-hidden="true"><b>' + esc(p.short) + '</b>' + esc(p.kind) + ' · ' + K.priceOf(p) + '</span></li>'; }).join('');
      if (lines) {
        const grp = (title, list) => '<p class="tb-sec">' + title + '</p><ul>' + list.map(p => '<li class="tbm" data-tid="' + p.id + '"><button type="button" data-qv="' + p.id + '"><b>' + esc(p.short) + '</b><em>' + esc(p.kind.toLowerCase()) + '</em><i></i><span>' + K.priceOf(p) + '</span></button></li>').join('') + '</ul>';
        lines.innerHTML = grp('Porcelán', D.vitrina.filter(p => p.cat === 'porcelan')) + grp('Peněženky', D.vitrina.filter(p => p.cat !== 'porcelan'));
        const hot = (id, on) => $$('[data-tid="' + id + '"]', cloth).forEach(x => x.classList.toggle('is-hot', on));
        $$('[data-tid]', cloth).forEach(el => { el.addEventListener('pointerenter', () => hot(el.dataset.tid, true)); el.addEventListener('pointerleave', () => hot(el.dataset.tid, false)); el.addEventListener('focusin', () => hot(el.dataset.tid, true)); el.addEventListener('focusout', () => hot(el.dataset.tid, false)); });
      }
      const objs = $$('.tbo', itemsEl);
      const lay = () => {
        const W = table.clientWidth, H = table.clientHeight, mob = cloth.clientWidth < 900;
        objs.forEach((o, i) => {
          const [id, dp, mp] = TB[i]; const pos = mob ? mp : dp; const p = D.byId[id];
          const m = K.maskOf(p.images[0]); const b = m ? m.b : [0.2, 0.2, 0.8, 0.8];
          const vis = pos[2] / 100 * W; const w = vis / (b[2] - b[0]), h = w * 4 / 3;
          const vh = (b[3] - b[1]) * h;
          const cx = pos[0] / 100 * W, cy = Math.min(H - vh / 2 - 8, Math.max(vh / 2 + 8, pos[1] / 100 * H));
          Object.assign(o.style, { left: (cx - vis / 2) + 'px', top: (cy - vh / 2) + 'px', width: vis + 'px', height: vh + 'px' });
          Object.assign($('.mfig', o).style, { width: w + 'px', height: h + 'px', left: (-b[0] * w) + 'px', top: (-b[1] * h) + 'px' });
        });
      };
      lay();
      window.addEventListener('resize', () => { clearTimeout(lay.t); lay.t = setTimeout(lay, 120); });
      if ('IntersectionObserver' in window && !reduce) {
        const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { cloth.classList.add('is-set'); io.disconnect(); } }, { threshold: 0.2 });
        io.observe(cloth);
      } else cloth.classList.add('is-set');
    }

    /* =========================================================
       DÍLNA: vytiskni si to sám
       ========================================================= */
    /* odhalování při scrollu */
    if ('IntersectionObserver' in window && !reduce) {
      const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -10% 0px' });
      $$('[data-rv]').forEach(el => io.observe(el));
    } else $$('[data-rv]').forEach(el => el.classList.add('is-in'));
  }
  if (window.KZW && window.KZW.ready) init(); else document.addEventListener('kzw:ready', init, { once: true });
})();
