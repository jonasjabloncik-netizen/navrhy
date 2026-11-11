/* GREY · návrh v4 · MALUS/01 · home.js – úvodní stránka */
(function () {
  'use strict';
  const GX = window.GX;
  const { $, $$, esc, money, store, reduce, fine, mob, NB, ty, plural } = GX.u;
  const main = $('#main');
  const firstVisit = !store.sget('gx3-intro');
  const HM = GX.home;
  GX.shell({ over: true, mast: true });

  /* ================= ÚVOD ================= */
  const H = HM.hero;
  const cell = ([pid, vid, i], si) => { const p = GX.p(pid), v = GX.v(p, vid); return `<div class="hero__cell"><div class="kb">${GX.pic(p, v, i, { alt: '', eager: si < 2 })}</div></div>`; };
  const slideHTML = (s, i) => `
    <div class="hero__slide${i === 0 ? ' is-on' : ''}${s.video ? '' : ' hero__slide--img'}" data-i="${i}" role="group" aria-roledescription="snímek" aria-label="${i + 1} ze ${H.length}: ${esc(s.label)}"${i === 0 ? '' : ' aria-hidden="true"'}>
      ${s.video ? `<div class="hero__media hero__media--video"><div class="hero__cell"><video muted playsinline preload="${i === 0 ? 'auto' : 'none'}" poster="${s.video.poster}" aria-hidden="true"><source src="${s.video.src}" type="video/mp4"><source src="${s.video.local}" type="video/mp4"></video></div></div>`
    : `<div class="hero__media${s.img.length > 1 ? ' hero__media--multi' : ''}">${s.img.map((x) => cell(x, i)).join('')}</div>`}
      <div class="hero__scrim"></div>
      <div class="hero__body">
        <h2 class="hero__title">${GX.lines(s.title)}</h2>
        <p class="hero__sub hero__fade">${esc(ty(s.sub))}</p>
        <div class="hero__cta hero__fade"><a class="btn btn--light" href="${s.href}"${i === 0 ? '' : ' tabindex="-1"'}>${esc(s.cta)}</a></div>
      </div>
    </div>`;
  main.insertAdjacentHTML('beforeend', `
    <h1 class="sr">GREY · fashion concept store</h1>
    <section class="hero${firstVisit && !reduce ? ' is-intro' : ''}" id="hero" aria-roledescription="carousel" aria-label="Úvod">
      ${H.map(slideHTML).join('')}
      <div class="hero__ui"><div class="bars">${H.map((s, i) => `<button class="bar" type="button" data-go="${i}" aria-label="Snímek ${i + 1}: ${esc(s.label)}"><i></i><em>0${i + 1}</em>${esc(s.label)}</button>`).join('')}</div>
        <span class="dropchip" data-drop></span>
        <button class="pausebtn" type="button" data-pause aria-pressed="false">${GX.ICON.pause}<span>Pozastavit</span></button></div>
    </section>`);
  const hero = $('#hero');
  const slides = $$('.hero__slide', hero);
  const st = { i: 0, userPaused: false, sysPaused: false, anim: null };
  const IMG_MS = 7000;
  const setDrop = () => { $$('[data-drop]').forEach((el) => { el.innerHTML = GX.drop.live() ? '<b>Nová kolekce je venku</b> · od 19:00' : `Další kolekce v pátek v 19:00 · <b>${GX.drop.left()}</b>`; }); };
  setDrop(); setInterval(setDrop, 30000);
  const paused = () => st.userPaused || st.sysPaused;
  const paintBars = () => $$('.bar', hero).forEach((b) => {
    const k = +b.dataset.go; b.classList.toggle('is-on', k === st.i); b.classList.toggle('is-done', k < st.i);
    const ii = $('i', b); if (k !== st.i) { ii.getAnimations().forEach((a) => a.cancel()); ii.style.transform = k < st.i ? 'scaleX(1)' : 'scaleX(0)'; }
  });
  const runBar = (ms) => {
    if (st.anim) st.anim.cancel();
    const el = $(`.bar[data-go="${st.i}"] i`, hero); el.style.transform = '';
    st.anim = el.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: ms, easing: 'linear', fill: 'forwards' });
    st.anim.onfinish = () => { if (!paused()) go(st.i + 1); };
    if (paused()) st.anim.pause();
  };
  const revealTitle = (k) => {
    const l = $('.lm', slides[k]); l.classList.add('no-tr'); l.classList.remove('is-in'); void l.offsetWidth; l.classList.remove('no-tr');
    requestAnimationFrame(() => requestAnimationFrame(() => l.classList.add('is-in')));
  };
  const vidOf = (i) => $('video', slides[i]);
  const startSlide = () => {
    const v = vidOf(st.i);
    if (v) {
      try { v.currentTime = 0; } catch (e) { /* ignore */ }
      let started = false;
      const begin = () => { if (started) return; started = true; const d = (v.duration && isFinite(v.duration) ? v.duration : 15) * 1000; runBar(d); if (!paused()) v.play().catch(() => {}); };
      if (v.readyState >= 1) begin(); else { v.preload = 'auto'; v.addEventListener('loadedmetadata', begin, { once: true }); v.load(); setTimeout(begin, 2600); }
    } else runBar(IMG_MS);
  };
  function go(n) {
    const prev = st.i; st.i = (n + H.length) % H.length;
    const pv = vidOf(prev); if (pv && prev !== st.i) pv.pause();
    slides.forEach((s, k) => {
      const on = k === st.i; s.classList.toggle('is-on', on); s.setAttribute('aria-hidden', on ? 'false' : 'true');
      $$('a', s).forEach((a) => { a.tabIndex = on ? 0 : -1; });
      if (on) revealTitle(k);
    });
    paintBars(); startSlide();
  }
  const setPauseUI = () => $$('[data-pause]', hero).forEach((b) => { b.setAttribute('aria-pressed', st.userPaused); b.innerHTML = (st.userPaused ? GX.ICON.play : GX.ICON.pause) + `<span>${st.userPaused ? 'Přehrát' : 'Pozastavit'}</span>`; });
  const applyPause = () => {
    const v = vidOf(st.i);
    if (paused()) { st.anim && st.anim.pause(); v && v.pause(); $$('.kb', slides[st.i]).forEach((k) => { k.style.animationPlayState = 'paused'; }); }
    else { st.anim && st.anim.play(); v && v.play().catch(() => {}); $$('.kb', slides[st.i]).forEach((k) => { k.style.animationPlayState = ''; }); }
  };
  hero.addEventListener('click', (e) => {
    const b = e.target.closest('[data-go]'); if (b) { go(+b.dataset.go); return; }
    if (e.target.closest('[data-pause]')) { st.userPaused = !st.userPaused; setPauseUI(); applyPause(); }
  });
  let x0 = null, y0 = null;
  hero.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') return; x0 = e.clientX; y0 = e.clientY; }, { passive: true });
  hero.addEventListener('pointerup', (e) => { if (x0 === null) return; const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(st.i + (dx < 0 ? 1 : -1)); }, { passive: true });
  if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => { st.sysPaused = !en.isIntersecting; applyPause(); }, { threshold: 0.1 }).observe(hero);
  document.addEventListener('visibilitychange', () => { st.sysPaused = document.hidden; applyPause(); });
  if (reduce) { st.userPaused = true; setPauseUI(); }
  $$('.lm', hero).forEach((l) => l.classList.add('hero-lm'));
  if (!(firstVisit && !reduce)) revealTitle(0);
  paintBars(); startSlide();

  /* ---------- signature: logo se napíše jednou linkou a zmenší se do hlavičky (ostré v každé velikosti) ---------- */
  const mast = $('#mast'); const mSvg = $('svg', mast); const hLogo = $('.hdr__logo');
  let MS = 1, Y0 = 0, DY = 0, DX = 0, base = 0;
  const fadeEls = [...$$('.hero__body', hero), $('.hero__ui', hero)];
  const layout = () => {
    const W = innerWidth, Hh = innerHeight, m = W < 900;
    const r = hLogo.getBoundingClientRect(); const hdr = $('#hdr').getBoundingClientRect();
    DY = r.top - hdr.top;
    // logo v hlavičce je na středu; DX dorovná i zlomky pixelu, aby velké logo dosedlo přesně na něj
    DX = (r.left + r.width / 2) - document.documentElement.clientWidth / 2;
    base = Math.round(m ? Math.min(W * 0.78, 420, Hh * 0.42) : Math.min(W * 0.4, 680, Hh * 0.55));
    Y0 = m ? Math.max(Hh * 0.15, 92) : Math.max(Hh * 0.12, 88);
    // logo se nikdy nesmí dotknout nadpisu: změř nejvyšší text úvodu a logo případně zmenši
    const gap = m ? 28 : 40; const ratio = 59 / 185;
    const ht = hero.getBoundingClientRect().top;
    const top = Math.min(...$$('.hero__body', hero).map((b) => b.getBoundingClientRect().top - ht));
    if (Y0 + base * ratio > top - gap) base = Math.max(m ? 170 : 240, Math.floor((top - gap - Y0) / ratio));
    if (Y0 + base * ratio > top - gap) Y0 = Math.max(r.bottom + 8, top - gap - base * ratio);
    mast.style.width = base + 'px'; mast.style.marginLeft = (-base / 2) + 'px';
    MS = r.width / base;
    upd(true);
  };
  // v8: logo do hlavičky nedojíždí podle scrollu (to na mobilu sekalo), ale po prvním posunutí stránky
  // proběhne jako plynulý přechod v prohlížeči; zpět nahoře se zase zvětší
  let docked = null, dockT = 0;
  const setDock = (on, instant) => {
    if (on === docked && !instant) return;
    docked = on; clearTimeout(dockT);
    mast.style.transition = instant || reduce ? 'none' : '';
    mast.classList.remove('is-docked'); hLogo.classList.add('is-hidden');
    mast.style.transform = on
      ? `translate3d(${DX.toFixed(2)}px,${DY.toFixed(2)}px,0) scale(${MS.toFixed(5)})`
      : `translate3d(0px,${Y0.toFixed(2)}px,0) scale(1)`;
    const done = () => { if (docked) { mast.classList.add('is-docked'); hLogo.classList.remove('is-hidden'); } };
    if (on) { if (instant || reduce) done(); else dockT = setTimeout(done, 780); }
    if (instant) void mast.offsetWidth;
  };
  const upd = (instant) => {
    const y = window.scrollY, T = Math.min(64, innerHeight * 0.06);
    setDock(docked ? y > T * 0.5 : y > T, instant === true);
    // text úvodu se při scrollu rozplyne, aby se nepletl s hlavičkou
    const p = Math.min(1, Math.max(0, y / (innerHeight * 0.5)));
    const f = Math.max(0, 1 - p * 1.35).toFixed(3);
    if (fadeEls[0] && !hero.classList.contains('is-intro')) fadeEls.forEach((el) => { el.style.opacity = f; el.style.visibility = +f === 0 ? 'hidden' : ''; });
  };
  let q = 0; window.addEventListener('scroll', () => { if (!q) q = requestAnimationFrame(() => { q = 0; upd(); }); }, { passive: true });
  // na mobilu se při scrollu mění výška okna (lišta prohlížeče); rozvržení loga se přepočítá jen při změně šířky
  let lw = innerWidth, lh = innerHeight;
  window.addEventListener('resize', () => { if (innerWidth !== lw || Math.abs(innerHeight - lh) > 160) { lw = innerWidth; lh = innerHeight; layout(); } });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  layout();
  const endIntro = () => { if (!hero.classList.contains('is-intro')) return; hero.classList.remove('is-intro'); revealTitle(st.i); ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((t) => window.removeEventListener(t, endIntro)); };
  if (firstVisit && !reduce) {
    store.sset('gx3-intro', '1');
    GX.drawLogo(mSvg, 120);
    setTimeout(endIntro, 1250);
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((t) => window.addEventListener(t, endIntro, { passive: true }));
  } else hero.classList.remove('is-intro');

  /* ================= NOVINKY · páteční kolekce ================= */
  const nov = GX.inCat('novinky');
  const seen = store.get('gx2-seen', []);
  const SETS = HM.stories;
  main.insertAdjacentHTML('beforeend', `
    <section class="sec drop" id="novinky">
      <div class="wrap">
        <div class="drop__top">
          <h2 class="d1">${GX.lines(['novinky'])}</h2>
          <div class="drop__info rv">
            <p class="lead">${esc(ty(GX.site.drop.text))}. ${esc(ty(GX.site.drop.stories))}</p>
            <div class="drop__count num" data-count></div>
            <div style="display:flex;gap:10px 28px;flex-wrap:wrap"><button class="lnk" type="button" data-ics>Uložit pátek do kalendáře</button><a class="lnk" href="${GX.catUrl('novinky')}">Všech ${nov.length} novinek</a></div>
          </div>
        </div>
        <div class="strow" role="list" aria-label="Stories s nákupem">${SETS.map((s, i) => { const [pid, vid, ii] = s.items[0]; const p = GX.p(pid); return `<button class="stb${seen.includes(s.id) ? ' is-seen' : ''}" type="button" role="listitem" data-st="${i}"><span class="stb__ring">${GX.pic(p, GX.v(p, vid), ii || 0, { alt: '' })}</span>${esc(s.label)}</button>`; }).join('')}</div>
      </div>
      ${GX.railHTML(nov.slice(0, 12).map((p) => GX.card(p, null, { noNew: true })).join(''))}
    </section>`);
  const setCount = () => {
    const el = $('[data-count]'); if (!el) return;
    if (GX.drop.live()) { el.innerHTML = '<span class="is-live">nová kolekce je venku</span>'; return; }
    const { d, h, m } = GX.drop.parts();
    el.innerHTML = `<span>${d}</span><small>${d === 1 ? 'den' : (d >= 2 && d <= 4 ? 'dny' : 'dní')}</small><span>${String(h).padStart(2, '0')}</span><small>hod</small><span>${String(m).padStart(2, '0')}</span><small>min do další kolekce</small>`;
  };
  setCount(); setInterval(setCount, 30000);
  $('[data-ics]').addEventListener('click', GX.drop.ics);
  $('#novinky .strow').addEventListener('click', (e) => { const b = e.target.closest('[data-st]'); if (b) GX.stories.open(+b.dataset.st); });

  /* ================= SCÉNA: kabelka v černé rukavici ================= */
  const C = HM.croco; const cp = GX.p(C.p);
  const cv = C.v.map((id) => GX.v(cp, id));
  const dims = (() => { const m = cp.meas; const w = (m.match(/šířka kabelky\s*(\d+)/) || [])[1]; const h = (m.match(/výška\s*(\d+)/) || [])[1]; const b = (m.match(/šířka dna\s*(\d+)/) || [])[1]; return w && h ? `${w} × ${h}${b ? ' × ' + b : ''}${NB}cm` : ''; })();
  const facts = [/pravá kůže/i.test(cp.material) ? 'Pravá kůže' : '', cp.origin === 'Itálie' ? 'Vyrobeno v Itálii' : '', dims].filter(Boolean);
  main.insertAdjacentHTML('beforeend', `
    <section class="croco on-dark" id="kabelky" aria-label="${esc(cp.name)}">
      <div class="croco__stick">
        <div class="croco__stage"><div class="croco__plate">${cv.map((v, i) => `<div class="pic${i === 0 ? ' is-on' : ''}"><img src="assets/img/croco/${v.id}.webp" alt="${esc(`${cp.name}, ${v.label}`)}" decoding="async"${i ? ' loading="lazy"' : ''}></div>`).join('')}</div></div>
        <div class="croco__txt">
          <p class="croco__name">${esc(ty(cp.name))}</p>
          <h2 class="croco__clr"><span class="sr" data-croco-sr>${esc(cv[0].label)}</span><span class="croco__roll" aria-hidden="true">${cv.map((v) => `<span>${esc(v.label)}</span>`).join('')}</span></h2>
          <p class="croco__facts">${facts.map((f) => `<span>${esc(f)}</span>`).join('')}</p>
          <div class="sws croco__sw" role="group" aria-label="Barva">${cv.map((v, i) => `<button class="sw" type="button" data-cv="${i}" aria-pressed="${i === 0}"><i style="background:${v.sw}"></i>${esc(v.label)}</button>`).join('')}</div>
          <div class="croco__buy"><b class="num">${money(cp.price)}</b><button class="btn btn--light" type="button" data-croco-add><span class="bt"></span></button></div>
          <a class="lnk" data-croco-link href="${GX.href(cp, cv[0])}">Detail kabelky</a>
        </div>
        <div class="croco__prog" aria-hidden="true">${cv.map((_, i) => `<i class="${i === 0 ? 'is-on' : ''}"></i>`).join('')}</div>
        <span class="croco__hint" aria-hidden="true">Scrollujte · ${cv.length} barvy</span>
      </div>
    </section>
    <section class="croco__more on-dark" aria-label="Pravá kůže z Itálie">
      <div class="wrap"><div class="shead"><h2 class="d2">${GX.lines(['pravá kůže', 'z Itálie'])}</h2><a class="lnk" href="${GX.catUrl('kabelky')}">Kabelky, pásky · ${GX.cats.kabelky.n}</a></div></div>
      ${GX.railHTML(C.more.map((id) => GX.card(GX.p(id), null, { noNew: true })).join(''))}
    </section>`);
  const cro = $('#kabelky'); const croMore = $('.croco__more'); let ph = -1;
  // celá scéna i pás „pravá kůže z Itálie“ pod ní mají barvu právě zobrazené kabelky
  const CROCO_BG = { black: '#0E0C0C', bordo: '#5E1C27', choco: '#3B2721' };
  const crocoBtn = () => {
    const v = cv[Math.max(0, ph)]; const b = $('[data-croco-add]', cro); const inC = GX.cart.has(cp.id, v.id, 'one size');
    b.classList.toggle('is-done', inC); $('.bt', b).textContent = inC ? `✓ V košíku · ${v.label}` : `Přidat do košíku · ${v.label}`;
  };
  const setPhase = (k) => {
    if (k === ph) return; ph = k;
    $$('.croco__plate .pic', cro).forEach((p, i) => p.classList.toggle('is-on', i === k));
    const bg = CROCO_BG[cv[k].id] || cv[k].sw; [cro, croMore].forEach((el) => el && el.style.setProperty('--cb', bg));
    $('.croco__roll', cro).style.transform = `translateY(${(-k * 100) / cv.length}%)`;
    $$('[data-cv]', cro).forEach((b, i) => b.setAttribute('aria-pressed', i === k));
    $$('.croco__prog i', cro).forEach((b, i) => b.classList.toggle('is-on', i <= k));
    $('[data-croco-sr]', cro).textContent = cv[k].label;
    $('[data-croco-link]', cro).href = GX.href(cp, cv[k]);
    const b = $('[data-croco-add] .bt', cro); b.parentElement.classList.remove('is-flash'); void b.offsetWidth; b.parentElement.classList.add('is-flash');
    crocoBtn();
  };
  const crocoScroll = () => {
    const r = cro.getBoundingClientRect(); const total = r.height - innerHeight; if (total <= 0) return;
    const p = Math.min(0.9999, Math.max(0, -r.top / total)); setPhase(Math.floor(p * cv.length));
  };
  let cq = 0; window.addEventListener('scroll', () => { if (!cq) cq = requestAnimationFrame(() => { cq = 0; crocoScroll(); }); }, { passive: true });
  setPhase(0); crocoScroll();
  cro.addEventListener('click', (e) => {
    const s = e.target.closest('[data-cv]');
    if (s) { const k = +s.dataset.cv; const r = cro.getBoundingClientRect(); const total = r.height - innerHeight; const top = window.scrollY + r.top + ((k + 0.5) / cv.length) * total; window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' }); setPhase(k); return; }
    if (e.target.closest('[data-croco-add]')) { const v = cv[Math.max(0, ph)]; GX.cart.add(cp.id, v.id, 'one size'); crocoBtn(); GX.added(cp.id, v.id, 'one size'); }
  });

  /* ================= KOLEKCE · runway: postavy vedle sebe, uprostřed ostrá, klepnutím look s čísly ================= */
  // původní fotky GREY oříznuté na 2:3; čísla ukazují jen kousky, u kterých víme, že to jsou produkty z fotky
  const RW = 'assets/img/runway/';
  const LOOKS = [
    { k: 'saty', pins: [['denim-oversized-saty', 'khaki', 39.3, 42.6]] },
    { k: 'kalhoty', pins: [['zebrovane-dziny', 'beige', 37.7, 71.2]] },
    { k: 'kabaty', pins: [['3-4-oversized-trench-coat', 'red', 53.3, 41.2]] },
    { k: 'saka', pins: [['boxy-oversized-sako', 'dark-grey', 52.2, 31.7], ['siroke-oblekove-kalhoty', 'dark-grey', 42.5, 73.8]] },
    { k: 'svetry', pins: [['upletovy-svetrik-s-podilem-vlny', 'brown', 45.7, 29.4]] },
    { k: 'topy', pins: [['heavy-cotton-triko-s-vycpavkami', 'grey', 50.2, 29.9]] },
    { k: 'sety', pins: [['oblekovy-komplet-sako-a-kalhoty', 'light-grey', 58.3, 34.2]] }
  ].filter((l) => GX.cats[l.k] && GX.cats[l.k].n && l.pins.every(([pid]) => GX.p(pid)));
  const MORE = ['kabelky', 'rukavice', 'saly', 'silonky', 'boty', 'sperky', 'leginy', 'heavy-cotton', 'christmas', 'vouchery'].filter((k) => GX.cats[k] && GX.cats[k].n);
  const RN = LOOKS.length;
  const rw = { a: Math.min(3, RN - 1), look: false };
  const cname = (l) => GX.cats[l.k].l.toLowerCase();
  main.insertAdjacentHTML('beforeend', `
    <section class="rw" id="kolekce" aria-label="Kolekce">
      <div class="wrap rw__head"><h2 class="d2">${GX.lines(['vyberte kolekci'])}</h2><p class="lead rv">${RN} looků z fotek GREY. Klepněte na fotku uprostřed a uvidíte, co má na sobě.</p></div>
      <div class="rw__stage" data-rw tabindex="0" aria-label="Kolekce jako přehlídka. Šipkami vybíráte, Enter otevře look.">
        ${LOOKS.map((l, i) => `<button type="button" class="rw__f" data-rwf="${i}" aria-label="${esc(GX.cats[l.k].l)}"><span class="rw__fig"><img class="rw__s" data-src="${RW}${l.k}.webp" alt="" draggable="false" decoding="async">${l.pins.map((p, j) => `<span class="rw__pin" style="left:${p[2]}%;top:${p[3]}%;--j:${j}" data-pin="${j}" aria-hidden="true">${j + 1}</span>`).join('')}</span></button>`).join('')}
        <button type="button" class="rw__nav rw__nav--p" data-rwp aria-label="Předchozí kolekce">${GX.ICON.prev}</button>
        <button type="button" class="rw__nav rw__nav--n" data-rwn aria-label="Další kolekce">${GX.ICON.next}</button>
        <div class="rw__look" data-rwl></div>
      </div>
      <div class="wrap rw__foot">
        <div class="rw__now" data-rwnow aria-live="polite"></div>
        <nav class="rw__idx" aria-label="Kolekce">${LOOKS.map((l, i) => `<button type="button" data-rwi="${i}">${esc(cname(l))}</button>`).join('')}</nav>
        <div class="rw__lookm" data-rwlm></div>
      </div>
      <div class="wrap"><nav class="cmore rv" aria-label="Další kategorie">${MORE.map((k) => `<a href="${GX.catUrl(k)}">${esc(GX.cats[k].l.toLowerCase())}<sup class="num">${GX.cats[k].n}</sup></a>`).join('')}</nav></div>
    </section>`);
  const rsec = $('#kolekce'); const stage = $('[data-rw]'); const figs = $$('.rw__f', stage);
  const rOff = (i) => { let d = i - rw.a; if (d > RN / 2) d -= RN; if (d < -RN / 2) d += RN; return d; };
  const prevD = figs.map((_, i) => rOff(i));
  const place = (instant) => {
    const W = stage.clientWidth, m = W < 900;
    const cw = figs[0] ? figs[0].offsetWidth : 0;
    const S = [1, 0.8, 0.66, 0.55], gap = m ? 12 : Math.min(W * 0.02, 28);
    const pos = [0]; for (let k = 1; k < S.length; k++) pos[k] = pos[k - 1] + (cw * S[k - 1]) / 2 + gap + (cw * S[k]) / 2;
    figs.forEach((f, i) => {
      const d = rOff(i), ad = Math.abs(d), k = Math.min(ad, S.length - 1);
      let x = Math.sign(d) * pos[k], s = S[k];
      let op = ad <= (m ? 1 : 2) ? 1 : 0;
      // v looku: fotka vlevo od středu, panel začíná hned za středem (dvojice drží pohromadě i na širokém monitoru)
      if (rw.look) { if (ad === 0) { s = 1; x = m ? 0 : -(cw / 2) - (W < 1200 ? W * 0.05 : 56); } else op = 0; }
      const wrap = Math.abs(d - prevD[i]) > RN / 2; prevD[i] = d;
      f.style.transition = instant || wrap || reduce ? 'none' : '';
      f.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px),0,0) scale(${s})`;
      f.style.opacity = op; f.style.zIndex = 10 - ad;
      f.classList.toggle('is-on', ad === 0);
      f.tabIndex = op > 0 ? 0 : -1; f.setAttribute('aria-hidden', op === 0 ? 'true' : 'false');
      if (instant || wrap) void f.offsetWidth;
    });
  };
  const renderNow = () => {
    const l = LOOKS[rw.a]; const c = GX.cats[l.k];
    $('[data-rwnow]').innerHTML = `<span class="rw__n">${esc(cname(l))}</span><span class="rw__c num">${plural(c.n, 'model', 'modely', 'modelů')}</span>
      <span class="rw__acts"><button type="button" class="btn btn--line" data-rwo>Prohlédnout look</button><a class="lnk" href="${GX.catUrl(l.k)}">Zobrazit kolekci</a></span>`;
    $$('[data-rwi]').forEach((b) => b.setAttribute('aria-current', +b.dataset.rwi === rw.a ? 'true' : 'false'));
  };
  const lookHTML = () => {
    const l = LOOKS[rw.a]; const c = GX.cats[l.k];
    const used = new Set(l.pins.map((x) => x[0]));
    const others = GX.inCat(l.k).filter((p) => !used.has(p.id)).slice(0, 3);
    return `<div class="rwl">
      <div class="rwl__hd"><p class="cap">V tomto looku · ${esc(cname(l))}</p><span class="rwl__ctl"><button type="button" data-rwp aria-label="Předchozí look">${GX.ICON.prev}</button><button type="button" data-rwn aria-label="Další look">${GX.ICON.next}</button><button type="button" data-rwx aria-label="Zavřít look">${GX.ICON.close}</button></span></div>
      <ol class="rwl__list">${l.pins.map(([pid, vid], j) => { const p = GX.p(pid), v = GX.v(p, vid); return `<li class="rwl__it" data-pi="${j}"><span class="rwl__no">${j + 1}</span><a class="rwl__pic" href="${GX.href(p, v)}">${GX.pic(p, v, 0, { alt: '', lo: true })}</a><span class="rwl__tx"><a href="${GX.href(p, v)}">${esc(ty(p.name))}</a><span>${esc(v.label)} · ${money(GX.price(p, v))}</span></span><button type="button" class="rwl__add" data-rwadd="${j}" aria-label="Přidat do košíku: ${esc(p.name)}">${GX.ICON.plus}</button></li>`; }).join('')}</ol>
      <a class="btn btn--block rwl__go" href="${GX.catUrl(l.k)}">Celá kolekce · ${plural(c.n, 'model', 'modely', 'modelů')}</a>
      ${others.length ? `<p class="cap rwl__more">Další z kolekce</p><div class="rwl__grid">${others.map((p) => `<a href="${GX.href(p)}">${GX.pic(p, p.v[0], 0, { alt: '', lo: true })}<span>${esc(ty(p.name))}</span><b class="num">${money(GX.minPrice(p))}</b></a>`).join('')}</div>` : ''}
    </div>`;
  };
  const renderLook = () => {
    const box = mob() ? $('[data-rwlm]') : $('[data-rwl]'); const other = mob() ? $('[data-rwl]') : $('[data-rwlm]');
    other.innerHTML = ''; box.innerHTML = rw.look ? lookHTML() : '';
    if (rw.look) { GX.pics(box); GX.typo(box); }
    rsec.classList.toggle('is-look', rw.look);
  };
  const setActive = (i, keepLook) => {
    rw.a = ((i % RN) + RN) % RN; if (!keepLook) rw.look = false;
    place(); renderNow(); renderLook(); GX.typo($('[data-rwnow]'));
  };
  const openLook = (on) => { rw.look = on; renderLook(); place(); if (on && mob()) setTimeout(() => window.scrollTo({ top: window.scrollY + stage.getBoundingClientRect().top - 70, behavior: reduce ? 'auto' : 'smooth' }), 60); };
  place(true); renderNow(); GX.typo($('[data-rwnow]'));
  // fotky looků se načtou, až se sekce blíží
  const loadSharp = () => $$('.rw__s[data-src]', stage).forEach((im) => { im.src = im.dataset.src; im.removeAttribute('data-src'); });
  if ('IntersectionObserver' in window) { const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { loadSharp(); io.disconnect(); } }, { rootMargin: '900px 0px' }); io.observe(stage); } else loadSharp();
  let rwRT = 0; window.addEventListener('resize', () => { clearTimeout(rwRT); rwRT = setTimeout(() => { if (rw.look) { rw.look = false; renderLook(); } place(true); }, 120); });
  rsec.addEventListener('click', (e) => {
    if (e.target.closest('[data-rwp]')) { setActive(rw.a - 1, rw.look); return; }
    if (e.target.closest('[data-rwn]')) { setActive(rw.a + 1, rw.look); return; }
    if (e.target.closest('[data-rwx]')) { openLook(false); return; }
    if (e.target.closest('[data-rwo]')) { openLook(true); return; }
    const ix = e.target.closest('[data-rwi]'); if (ix) { setActive(+ix.dataset.rwi); return; }
    const add = e.target.closest('[data-rwadd]');
    if (add) {
      const [pid, vid] = LOOKS[rw.a].pins[+add.dataset.rwadd]; const p = GX.p(pid), v = GX.v(p, vid);
      if (fine && !mob()) GX.quickView(p, v.id, null);
      else { const card = document.createElement('div'); card.dataset.p = p.id; card.dataset.v = v.id; GX.quickSheet(card); }
      return;
    }
    const pin = e.target.closest('.rw__pin'); if (pin && rw.look) { const it = $(`.rwl__it[data-pi="${pin.dataset.pin}"]`, rsec); if (it) { it.classList.add('is-hot'); it.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' }); setTimeout(() => it.classList.remove('is-hot'), 1200); } return; }
    const f = e.target.closest('.rw__f');
    if (f) { if (rwDrag.moved) return; const i = +f.dataset.rwf; if (i === rw.a) openLook(!rw.look); else setActive(i, rw.look); return; }
    if (rw.look && e.target === stage) openLook(false);
  });
  // propojení čísel na postavě a řádků v seznamu
  rsec.addEventListener('pointerover', (e) => {
    const it = e.target.closest('.rwl__it'); const pin = e.target.closest('.rw__pin');
    const j = it ? it.dataset.pi : (pin ? pin.dataset.pin : null);
    $$('.rw__f.is-on .rw__pin', stage).forEach((x) => x.classList.toggle('is-hot', x.dataset.pin === j));
    $$('.rwl__it', rsec).forEach((x) => x.classList.toggle('is-hot', x.dataset.pi === j));
  });
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); setActive(rw.a + 1, rw.look); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); setActive(rw.a - 1, rw.look); }
    else if (e.key === 'Escape' && rw.look) openLook(false);
    else if ((e.key === 'Enter' || e.key === ' ') && e.target === stage) { e.preventDefault(); openLook(!rw.look); }
  });
  // tažení do stran (myš i prst); svislé posouvání stránky zůstává
  const rwDrag = { x: 0, on: false, moved: false };
  stage.addEventListener('pointerdown', (e) => { if (e.button) return; rwDrag.on = true; rwDrag.moved = false; rwDrag.x = e.clientX; });
  stage.addEventListener('pointermove', (e) => { if (rwDrag.on && Math.abs(e.clientX - rwDrag.x) > 10) rwDrag.moved = true; });
  const dragEnd = (e) => {
    if (!rwDrag.on) return; rwDrag.on = false;
    const dx = e.clientX - rwDrag.x;
    if (Math.abs(dx) > 40) { const steps = Math.abs(dx) > stage.clientWidth * 0.45 ? 2 : 1; setActive(rw.a + (dx < 0 ? steps : -steps), rw.look); }
    setTimeout(() => { rwDrag.moved = false; }, 0);
  };
  stage.addEventListener('pointerup', dragEnd); stage.addEventListener('pointercancel', () => { rwDrag.on = false; });

  /* ================= CELÝ OBLEK ================= */
  const SU = HM.suit; const sako = GX.p(SU.top), kal = GX.p(SU.bottom);
  const suit = { clr: SU.colors[0], sel: {} };
  const suitPic = (clr, cls = '') => { const [pid, vid, i] = SU.img[clr]; const p = GX.p(pid); return GX.pic(p, GX.v(p, vid), i, { cls, alt: `${sako.name} a ${kal.name.toLowerCase()}, ${GX.v(sako, clr).label}` }); };
  const piece = (p) => `<div class="piece" data-piece="${p.id}"><a href="${GX.href(p, GX.v(p, suit.clr))}" data-piece-link>${GX.pic(p, GX.v(p, suit.clr), 0, { alt: '' })}</a>
      <div><div class="piece__top"><a href="${GX.href(p, GX.v(p, suit.clr))}" data-piece-link>${esc(ty(p.name))}</a><b class="num" data-piece-price></b></div>
        <div class="szs" role="group" aria-label="Velikost: ${esc(p.name)}" data-sizes></div><div class="restock" data-restock aria-live="polite"></div></div></div>`;
  main.insertAdjacentHTML('beforeend', `
    <section class="sec" id="oblek" style="background:var(--paper-3)">
      <div class="wrap suit">
        <div class="suit__media cur" data-suit-media>${suitPic(suit.clr)}<span class="suit__tag">Sako i kalhoty ze stejné kolekce</span></div>
        <div class="suit__col">
          <h2 class="d2">${GX.lines(['celý oblek'])}</h2>
          <p class="lead">Boxy oversized sako a široké oblekové kalhoty. Lze je kombinovat – a každý kus koupíte i zvlášť.</p>
          <div class="suit__clr"><span class="lbl">Barva: <b data-suit-clr></b></span><div class="sws sws--lg" role="group" aria-label="Barva obleku">${SU.colors.map((c) => { const v = GX.v(sako, c); return `<button class="sw" type="button" data-suit-sw="${c}" aria-pressed="${c === suit.clr}" aria-label="Barva ${esc(v.label)}" title="${esc(v.label)}"><i style="background:${v.sw}"></i></button>`; }).join('')}</div></div>
          <div>${piece(sako)}${piece(kal)}</div>
          <div class="suit__total"><span>Celý oblek</span><b class="num" data-suit-total></b></div>
          <button class="btn btn--block" type="button" data-suit-add><span class="bt"></span></button>
          <p class="suit__note" data-suit-note></p>
        </div>
      </div>
    </section>`);
  const suitEl = $('#oblek');
  const renderPiece = (p) => {
    const v = GX.v(p, suit.clr); const box = $(`[data-piece="${p.id}"]`, suitEl);
    const sizes = GX.sizes(p, v);
    if (!suit.sel[p.id] || !sizes.find((s) => s.s === suit.sel[p.id] && s.ok)) suit.sel[p.id] = (sizes.find((s) => s.ok) || sizes[0] || {}).s;
    $('[data-sizes]', box).innerHTML = sizes.map(({ s, ok, eu }) => `<button class="sz ${ok ? '' : 'is-out'}" type="button" data-sz="${esc(s)}" ${ok ? '' : 'aria-disabled="true"'} aria-pressed="${s === suit.sel[p.id]}"><span>${esc(s)}</span><small>${ok ? (eu ? 'EU ' + eu : 'skladem') : 'vyprodáno'}</small></button>`).join('');
    const a = $('a', box); a.innerHTML = GX.pic(p, v, 0, { alt: '' }); $$('[data-piece-link]', box).forEach((x) => { x.href = GX.href(p, v); });
    $('[data-piece-price]', box).textContent = money(GX.price(p, v));
    const sel = sizes.find((s) => s.s === suit.sel[p.id]); const r = $('[data-restock]', box);
    r.innerHTML = sel && !sel.ok ? `${esc(sel.s)} v barvě ${esc(v.label)} teď není skladem. <button class="lnk" type="button" data-vote="${p.id}|${v.id}|${esc(sel.s)}" style="font-size:10.5px">Chci doskladnit</button>` : '';
  };
  const renderSuit = (fromClick) => {
    const vS = GX.v(sako, suit.clr), vK = GX.v(kal, suit.clr);
    $('[data-suit-clr]', suitEl).textContent = vS.label;
    if (fromClick) {
      const media = $('[data-suit-media]', suitEl); const old = $('.pic', media);
      old.insertAdjacentHTML('beforebegin', suitPic(suit.clr)); GX.pics(media);
      old.classList.add('is-out'); setTimeout(() => old.remove(), 750);
    }
    renderPiece(sako); renderPiece(kal);
    const total = GX.price(sako, vS) + GX.price(kal, vK);
    $('[data-suit-total]', suitEl).textContent = money(total);
    const okAll = [[sako, vS], [kal, vK]].every(([p, v]) => GX.sizes(p, v).find((s) => s.s === suit.sel[p.id] && s.ok));
    const b = $('[data-suit-add]', suitEl);
    const inCart = GX.cart.has(sako.id, vS.id, suit.sel[sako.id]) && GX.cart.has(kal.id, vK.id, suit.sel[kal.id]);
    b.disabled = !okAll; b.classList.toggle('is-done', inCart && okAll);
    $('.bt', b).textContent = !okAll ? 'Vyberte velikosti, které jsou skladem' : (inCart ? `✓ Oblek v košíku · ${suit.sel[sako.id]} + ${suit.sel[kal.id]}` : `Přidat celý oblek · ${suit.sel[sako.id]} + ${suit.sel[kal.id]}`);
    $('[data-suit-note]', suitEl).textContent = `Sako ${GX.u.money(GX.price(sako, vS))} + kalhoty ${GX.u.money(GX.price(kal, vK))}. Kalhoty mají vzadu v pase gumu.`;
  };
  suitEl.addEventListener('click', (e) => {
    const sw = e.target.closest('[data-suit-sw]'); if (sw) { if (suit.clr === sw.dataset.suitSw) return; suit.clr = sw.dataset.suitSw; $$('[data-suit-sw]', suitEl).forEach((b) => b.setAttribute('aria-pressed', b === sw)); renderSuit(true); return; }
    const sz = e.target.closest('[data-sz]'); if (sz) { const pid = sz.closest('[data-piece]').dataset.piece; suit.sel[pid] = sz.dataset.sz; renderSuit(); return; }
    const vote = e.target.closest('[data-vote]');
    if (vote) { const votes = store.get('gx2-votes', []); votes.push(vote.dataset.vote); store.set('gx2-votes', votes); vote.parentElement.textContent = `✓ Hlas pro doskladnění ${vote.dataset.vote.split('|')[2]} jsme započítali.`; return; }
    if (e.target.closest('[data-suit-add]')) {
      [sako, kal].forEach((p) => GX.cart.add(p.id, GX.v(p, suit.clr).id, suit.sel[p.id]));
      renderSuit(); GX.added(sako.id, suit.clr, suit.sel[sako.id]);
    }
  });
  renderSuit();

  /* ================= SEDNE MI TO? · dvě klepnutí místo měření ================= */
  const inStock = (x) => Object.values(x.stock || {}).filter((a) => a === 'in').length;
  const fitItems = HM.fit.map(GX.p).filter((p) => p && GX.fitOf(p, p.v[0])).slice(0, 4).map((p) => ({ p, v: p.v.slice().sort((a, b) => inStock(b) - inStock(a))[0] }));
  main.insertAdjacentHTML('beforeend', `
    <section class="sec fitx" id="sedne">
      <div class="wrap">
        <div class="fitx__top">
          <h2 class="d2">${GX.lines(['sedne mi to?'])}</h2>
          <div class="fitx__pick"><p class="lead">Dvě klepnutí a u každého kousku uvidíte, jakou velikost vzít a jak vám sedne. Počítáme to z jeho skutečných rozměrů.</p><div data-fitx-pick></div></div>
        </div>
        <div class="fitx__grid" data-fitx-grid></div>
      </div>
    </section>`);
  const fitEl = $('#sedne');
  const renderFit = () => {
    const prof = GX.size.get(); const demo = !prof || !prof.s; const use = demo ? { s: 'M', p: 'akorat' } : prof;
    const pl = (GX.size.PREFS.find((x) => x[0] === use.p) || ['', 'Akorát'])[1].toLowerCase();
    $('[data-fitx-pick]', fitEl).innerHTML = GX.size.picker(prof) + `<p class="fitx__note${demo ? ' is-demo' : ''}" aria-live="polite">${demo ? 'Zatím ukázka pro M. Klepněte na svou velikost a doporučení se přepočítají.' : `✓ Uloženo: nosíte ${esc(use.s)}, ${esc(pl)}. Doporučenou velikost uvidíte i u produktů a v rychlém přidání.`}</p>`;
    $('[data-fitx-grid]', fitEl).innerHTML = fitItems.map(({ p, v }) => {
      const a = GX.size.assess(p, v, use); if (!a) return '';
      const eu = p.eu && p.eu[a.rec.s];
      return `<a class="fitx__it${demo ? ' is-demo' : ''}" href="${GX.href(p, v)}"><span class="fitx__ph">${GX.pic(p, v, 0, { alt: p.name })}</span>
        <span class="fitx__bd"><span class="fitx__n">${esc(ty(p.name))}</span>
        <span class="fitx__r"><span class="fitx__k">${demo ? 'Pro M' : 'Vaše velikost'}</span><b>${esc(GX.size.short(a.rec.s))}</b>${eu ? `<small>EU${NB}${esc(eu)}</small>` : (/^one size/i.test(a.rec.s) ? '<small>one size</small>' : '')}</span></span>
        ${GX.size.meter(a)}
        <span class="fitx__t">${esc(ty(a.text))} <span>${esc(a.detail.replace(/^./, (c) => c.toUpperCase()))}.</span></span></a>`;
    }).join('');
    GX.pics(fitEl); GX.typo($('[data-fitx-grid]', fitEl));
  };
  fitEl.addEventListener('click', (e) => {
    const me = e.target.closest('[data-me]'); if (me) { GX.size.set({ s: me.dataset.me }); return; }
    const pr = e.target.closest('[data-pref]'); if (pr) { GX.size.set({ p: pr.dataset.pref }); }
  });
  document.addEventListener('gx:size', renderFit);
  renderFit();

  /* ================= DÁRKY ================= */
  const xm = GX.inCat('christmas');
  const TIERS = [['500', 'do 500 Kč', (p) => !p.voucher && GX.minPrice(p) <= 500], ['1000', '500–1 000 Kč', (p) => !p.voucher && GX.minPrice(p) > 500 && GX.minPrice(p) <= 1000], ['plus', 'nad 1 000 Kč', (p) => !p.voucher && GX.minPrice(p) > 1000], ['voucher', 'dárkový voucher', (p) => !!p.voucher]];
  const giftGrid = (k) => { const f = TIERS.find((t) => t[0] === k)[2]; return xm.filter(f).slice(0, 6).map((p) => GX.card(p, null, { noNew: true })).join(''); };
  main.insertAdjacentHTML('beforeend', `
    <section class="sec" id="darky" style="background:var(--paper-3)">
      <div class="wrap gift">
        <div class="gift__media"><div class="cur">${GX.catPic('christmas', { alt: 'Croco kožená peněženka v červených kožených rukavicích' })}</div></div>
        <div>
          <div class="gift__head"><div><h2 class="d2">${GX.lines(['dárky'])}</h2><p class="lead" style="margin-top:16px">Kožené pouzdra, peněženky a kosmetické kufříky z Itálie, šály a rukavice. Vybrané z kategorie Christmas podle ceny.</p></div>
            <div class="chips" role="group" aria-label="Dárky podle ceny">${TIERS.map(([k, l, f], i) => `<button class="chip" type="button" data-tier="${k}" aria-pressed="${i === 0}">${esc(l)}<span class="n">${xm.filter(f).length}</span></button>`).join('')}</div></div>
          <div class="pg" data-gift-grid>${giftGrid('500')}</div>
          <div style="margin-top:40px"><a class="lnk" href="${GX.catUrl('christmas')}">Celá kategorie Christmas · ${xm.length}</a></div>
        </div>
      </div>
    </section>`);
  const giftEl = $('#darky');
  $('.chips', giftEl).addEventListener('click', (e) => {
    const c = e.target.closest('[data-tier]'); if (!c) return;
    $$('.chip', giftEl).forEach((b) => b.setAttribute('aria-pressed', b === c));
    const g = $('[data-gift-grid]', giftEl); g.innerHTML = giftGrid(c.dataset.tier); GX.pics(g); GX.typo(g);
  });

  /* ================= HEAVY COTTON ================= */
  const hc = GX.p(HM.hc); const hcSt = { v: hc.v[0].id };
  const hcFit = GX.fitOf(hc, hc.v[0]); const hcS = hc.sizes[0];
  main.insertAdjacentHTML('beforeend', `
    <section class="sec" id="heavy-cotton">
      <div class="wrap hc">
        <div class="hc__media cur">${GX.catPic('heavy-cotton', { alt: 'Heavy cotton triko s vycpávkami, beige' })}</div>
        <div>
          <h2 class="d2">${GX.lines(['heavy cotton'])}</h2>
          <div class="hc__prod">
            <a href="${GX.href(hc, hc.v[0])}" data-hc-link data-hc-pic>${GX.pic(hc, hc.v[0], 0)}</a>
            <div class="hc__info">
              <h3 class="d3 hc__h">${esc(ty(hc.name))}</h3>
              <p class="mut hc__d">${esc(ty(hc.desc.split('. ').slice(0, 2).join('. ')))}.</p>
              <dl class="hc__facts"><div><dt>Šířka</dt><dd>${hcFit && hcFit.w ? hcFit.w[hcS] + NB + 'cm' : ''}</dd></div><div><dt>Délka</dt><dd>${hcFit && hcFit.l ? hcFit.l[hcS] + NB + 'cm' : ''}</dd></div><div><dt>Materiál</dt><dd>${esc(hc.material)}</dd></div><div><dt>Velikost</dt><dd>${esc(hcS)}</dd></div></dl>
              <p class="hc__c">Barva: <b data-hc-clr>${esc(hc.v[0].label)}</b></p>
              ${GX.swatches(hc, hc.v[0], 'sws--lg')}
              <div class="hc__buy"><button class="btn" type="button" data-hc-add><span class="bt"></span></button><b class="num" style="font-weight:300;font-size:20px">${money(hc.price)}</b></div>
            </div>
          </div>
          <div style="margin-top:34px"><a class="lnk" href="${GX.catUrl('heavy-cotton')}">Celá kolekce Heavy cotton · ${GX.cats['heavy-cotton'].n}</a></div>
        </div>
      </div>
    </section>`);
  const hcEl = $('#heavy-cotton');
  const renderHc = (swap) => {
    const v = GX.v(hc, hcSt.v);
    if (swap) { const a = $('[data-hc-pic]', hcEl); a.innerHTML = GX.pic(hc, v, 0); GX.pics(a); }
    $('[data-hc-clr]', hcEl).textContent = v.label; $('[data-hc-link]', hcEl).href = GX.href(hc, v);
    const inC = GX.cart.has(hc.id, v.id, hcS); const b = $('[data-hc-add]', hcEl);
    b.classList.toggle('is-done', inC); $('.bt', b).textContent = inC ? `✓ V košíku · ${hcS}` : `Přidat do košíku · ${hcS}`;
  };
  hcEl.addEventListener('click', (e) => {
    const sw = e.target.closest('[data-sw]'); if (sw) { e.preventDefault(); hcSt.v = sw.dataset.sw; $$('[data-sw]', hcEl).forEach((b) => b.setAttribute('aria-pressed', b === sw)); renderHc(true); return; }
    if (e.target.closest('[data-hc-add]')) { GX.cart.add(hc.id, hcSt.v, hcS); renderHc(); GX.added(hc.id, hcSt.v, hcS); }
  });
  renderHc();

  /* ================= BESTSELLERY ================= */
  const best = GX.inCat('bestsellery');
  main.insertAdjacentHTML('beforeend', `
    <section class="sec" id="bestsellery" style="padding-top:0">
      <div class="wrap"><div class="shead"><h2 class="d2">${GX.lines(['naše bestsellery'])}</h2><a class="lnk" href="${GX.catUrl('bestsellery')}">Všechny bestsellery · ${best.length}</a></div></div>
      ${GX.railHTML(best.map((p) => GX.card(p, null, { noNew: true })).join(''))}
    </section>`);

  /* ================= GREY · Instagram ================= */
  const S = GX.site; const igs = HM.ig.map((i) => GX.ig[i]).filter(Boolean);
  main.insertAdjacentHTML('beforeend', `
    <section class="sec" id="grey" style="background:var(--paper-3)">
      <div class="wrap about">
        <div>
          <p class="about__q">${GX.lines(['stylově', 'a nadčasově.'])}</p>
          <div class="about__txt rv"><p>GREY · fashion concept store od roku ${S.since}. ${esc(ty(S.drop.text))} a páteční odpoledne patří prezentaci novinek ve stories.</p>
            <p>${esc(ty(S.igDiscount))} <a href="${S.shop}${S.pages.ig}" style="text-decoration:underline;text-underline-offset:3px;color:var(--ink)">Pravidla</a></p></div>
          <div class="about__facts rv"><div><b class="num">${S.since}</b><span>od roku</span></div><div><b class="num">${esc(S.igFollowers)}</b><span>sledujících na Instagramu</span></div><div><b class="num">${GX.products.length}</b><span>modelů skladem</span></div></div>
        </div>
        <div>
          <div class="igg">${igs.map((g) => `<a href="${g.href}" target="_blank" rel="noopener" class="rv"><img src="${g.img}" alt="${esc(g.alt)}" loading="lazy"><figcaption>${esc(g.alt)}</figcaption></a>`).join('')}</div>
          <div class="igmeta"><span><b>${S.igHandle}</b> · ${esc(S.igFollowers)}${NB}sledujících</span><a class="lnk" href="${S.ig}" target="_blank" rel="noopener">Sledovat na Instagramu</a></div>
        </div>
      </div>
    </section>`);

  $$('.rail', main).forEach(GX.rail);
  GX.bindCards(main);
  document.addEventListener('gx:cart', () => { renderSuit(); renderHc(); crocoBtn(); });
  GX.pics(main); GX.typo(main); GX.reveal(main);
  GX.setHdr && GX.setHdr();
})();
