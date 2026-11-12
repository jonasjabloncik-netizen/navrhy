/* Caki·Cak – úvodní stránka (MALUS/01) */
(function () {
  const CC = window.CC, X = window.CCX;
  const { $, $$, RM, fmt, esc, Baby, Cart, card, bindCards, HEART, ICON, on, ss } = X;
  X.init();

  /* =========================================================
     SIGNATURE: Caki · Cak – dva světy, jeden šev
     Vše se hýbe jen přes transform a opacity.
     ========================================================= */
  function hero() {
    const root = $('#hero'); if (!root) return;
    const scenes = CC.HERO.scenes;
    const q = (s) => $(s, root);
    const el = {
      wP: q('[data-world=caki]'), wB: q('[data-world=cak]'), iP: q('[data-world=caki] .world__in'), iB: q('[data-world=cak] .world__in'),
      aP: q('[data-arch=caki]'), aB: q('[data-arch=cak]'), tP: q('[data-text=caki]'), tB: q('[data-text=cak]'), tM: q('[data-text=mid]'),
      por: q('[data-por]'), porZoom: q('.por__zoom'), porImgs: $$('.por__img', root), tL: q('[data-text=pl]'), tR: q('[data-text=pr]'),
      tLb: q('[data-text=pl] .wtext__body'), tRb: q('[data-text=pr] .wtext__body'),
      seam: q('.seam'), label: q('.label'), tabs: q('.htabs'), pause: q('.hpause'), curtain: q('.curtain')
    };
    el.tabs.innerHTML = scenes.map((s, i) => '<button class="htab" type="button" role="tab" aria-selected="false" data-i="' + i + '"><span class="htab__l">' + esc(s.tab) + '</span><span class="htab__p"><b></b></span></button>').join('');
    const tabs = $$('.htab', el.tabs);
    const imgs = { caki: $$('.arch__img', el.aP), cak: $$('.arch__img', el.aB) };
    const shown = { caki: null, cak: null };
    const swing = { caki: { a: 0, v: 0 }, cak: { a: 0, v: 0 } };
    const DUR = 6500;
    const isPor = (i) => !!scenes[i].portrait;
    const prodIdx = scenes.map((sc, i) => i).filter((i) => !isPor(i));
    const stackMQ = window.matchMedia('(max-width: 999px)');
    let W = 0, H = 0, mobile = false, stack = false, tH = { P: 300, B: 300, M: 160, L: 200, R: 200 }, tW = { L: 300, R: 300 }, lH = 120;
    // por = jak moc je vidět scéna „Monika s Ruminkou“ (0–1), animuje se zvlášť od švu
    let s = 0.5, por = 0, cur = 0, playing = !RM, elapsed = 0, last = 0, raf = 0, visible = true, anim = null, pAnim = null, drag = null, dragEnd = -1e4, introOn = false;
    const sm = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
    const ease = (t) => 1 - Math.pow(1 - t, 4);
    const splitOf = (i) => (mobile ? scenes[i].mobile : scenes[i].split);
    const durOf = (i) => scenes[i].dur || DUR;

    function setProduct(world, id, kick) {
      if (shown[world] === id) return;
      shown[world] = id;
      const p = CC.byId(id); const [a, b] = imgs[world];
      const vis = a.classList.contains('is-off') ? b : a; const hid = vis === a ? b : a;
      const arch = world === 'caki' ? el.aP : el.aB;
      hid.onload = () => { arch.querySelector('.arch__in').style.setProperty('--plate', p.bg); hid.classList.remove('is-off'); vis.classList.add('is-off'); };
      hid.alt = p.name; hid.src = CC.img(p.img);
      if (hid.complete && hid.naturalWidth) hid.onload();
      const tag = q('[data-tag=' + world + ']');
      tag.href = 'produkt.html?p=' + p.id;
      tag.innerHTML = '<span>' + esc(p.short || p.name) + '</span><b>' + fmt(p.price) + '</b>';
      if (kick && !RM) swing[world].v += world === 'caki' ? -1.1 : 1.1;
    }

    function measure() {
      W = root.clientWidth; H = root.clientHeight; mobile = W < 760; stack = mobile || stackMQ.matches;
      if (!mobile) { el.tP.style.height = el.tB.style.height = ''; }
      tH = { P: el.tP.offsetHeight, B: el.tB.offsetHeight, M: el.tM.offsetHeight, L: el.tL.offsetHeight, R: el.tR.offsetHeight };
      tW = { L: el.tL.offsetWidth, R: el.tR.offsetWidth };
      lH = el.label.offsetHeight;
      if (!anim && !drag) s = splitOf(cur);
      if (!pAnim && !drag) por = isPor(cur) ? 1 : 0;
    }

    /* Scéna „Monika s Ruminkou“: fotka v oblouku přímo na švu.
       Široká obrazovka: text vlevo, citát vpravo, cedulka přišitá ke spodku fotky.
       Užší obrazovka: cedulka nahoře, pod ní fotka a přes její spodek bílá kartička. */
    function porLayout(x, pe) {
      const qe = 1 - pe, k = 0.94 + 0.06 * pe;
      let aw, ah, aTop, ly = null, base = mobile ? 300 : 420;
      if (!stack) {
        const top = 34, Ha = H - top - 98;
        const gT = Math.max(40, Math.min(64, W * 0.042)), pad = Math.max(24, W * 0.035);
        const maxW = 2 * Math.min(x - gT - pad - tW.L, W - x - gT - pad - tW.R);
        ah = Math.max(300, Math.min(560 * 1.12, Ha - lH * 0.55 - 4, maxW / 0.75));
        aw = ah * 0.75; aTop = top + (Ha - ah - lH * 0.55) / 2;
        const cy = aTop + ah / 2;
        el.tL.style.transform = 'translate3d(' + (x - aw / 2 - gT - tW.L - 18 * qe) + 'px,' + (cy - tH.L / 2) + 'px,0)';
        el.tR.style.transform = 'translate3d(' + (x + aw / 2 + gT + 18 * qe) + 'px,' + (cy - tH.R / 2) + 'px,0)';
        ly = aTop + ah - lH * 0.42;
      } else {
        const lTop = mobile ? 14 : 34, ov = 26, barH = mobile ? 64 : 98;
        const a0 = lTop + lH + 12;
        const avail = H - barH - 10 - tH.L + ov - a0;
        ah = Math.max(220, Math.min(avail, (W - 40) / 0.75, 560 * 1.12));
        aw = ah * 0.75; aTop = a0 + Math.max(0, (avail - ah) / 2);
        el.tL.style.transform = 'translate3d(' + (x - tW.L / 2) + 'px,' + (aTop + ah - ov + 14 * qe) + 'px,0)';
        if (!mobile) ly = lTop;
      }
      el.por.style.transform = 'translate3d(' + (x - aw * k / 2) + 'px,' + (aTop + ah * (1 - k) + 24 * qe) + 'px,0) scale(' + (aw / base) * k + ')';
      el.porZoom.style.transform = 'scale(' + (1 + 0.05 * qe) + ')';
      return ly;
    }

    /* Scény s Monikou a Ruminkou: jejich fotky a vlastní slogany, při přepnutí se fotka prolne a texty vymění */
    function porL(sc) {
      const p = sc.portrait;
      return '<p class="wtext__over">' + esc(p.over) + '</p>' +
        '<h2 class="wtext__title">' + p.title.map((t, k) => '<span class="rv-line"><span' + (k ? ' style="--dl:' + 80 * k + 'ms"' : '') + '>' + esc(t) + '</span></span>').join(' ') + '</h2>' +
        '<p class="wtext__lead">' + esc(p.lead) + '</p>' +
        '<div class="wtext__acts"><a class="btn" href="' + p.cta[1] + '">' + esc(p.cta[0]) + '</a><a class="btn btn--ghost wtext__more" href="#pribeh">Můj příběh</a></div>';
    }
    function porR(sc) {
      const p = sc.portrait;
      return '<blockquote class="wtext__q">„' + esc(p.quote) + '“</blockquote><p class="wtext__cite">' + esc(p.cite) + '</p><a class="link wtext__link" href="#pribeh">Přečíst můj příběh</a>';
    }
    function setPorImg(im, d) {
      im.alt = d.alt; im.classList.toggle('is-crop', !!d.crop);
      if (d.crop) { im.style.setProperty('--w', d.crop.w); im.style.setProperty('--tx', d.crop.tx); im.style.objectPosition = ''; }
      else { im.style.removeProperty('--w'); im.style.removeProperty('--tx'); im.style.objectPosition = d.pos || ''; }
      const url = CC.img(d.src); if (im.getAttribute('src') !== url) im.src = url;
    }
    function measureTexts() { tH.L = el.tL.offsetHeight; tH.R = el.tR.offsetHeight; tW = { L: el.tL.offsetWidth, R: el.tR.offsetWidth }; }
    let porOn = scenes[0].portrait ? 0 : -1; // která scéna s fotkou je teď v oblouku (HTML startuje s první)
    function showPortrait(i, instant) {
      const sc = scenes[i]; if (!sc.portrait || porOn === i) return;
      porOn = i;
      const [a, b] = el.porImgs; const vis = a.classList.contains('is-off') ? b : a; const hid = vis === a ? b : a;
      setPorImg(hid, sc.portrait.img);
      const swap = () => { hid.classList.remove('is-off'); vis.classList.add('is-off'); hid.removeAttribute('aria-hidden'); vis.setAttribute('aria-hidden', 'true'); };
      if (hid.complete && hid.naturalWidth) swap(); else hid.onload = () => { hid.onload = null; if (porOn === i) swap(); };
      const fill = () => {
        el.tLb.innerHTML = porL(sc); el.tRb.innerHTML = porR(sc);
        measureTexts(); lastKey = ''; apply();
        const ls = $$('.rv-line', el.tLb);
        if (instant || RM) ls.forEach((l) => l.classList.add('in'));
        else requestAnimationFrame(() => requestAnimationFrame(() => ls.forEach((l) => l.classList.add('in'))));
      };
      if (instant || RM) { fill(); return; }
      el.tLb.classList.add('is-out'); el.tRb.classList.add('is-out');
      setTimeout(() => { fill(); el.tLb.classList.remove('is-out'); el.tRb.classList.remove('is-out'); }, 260);
    }
    // fotky dalších scén se načtou až po hlavní fotce
    const preloadPor = () => scenes.forEach((sc) => { if (sc.portrait) { const im = new Image(); im.src = CC.img(sc.portrait.img.src); } });
    if (document.readyState === 'complete') setTimeout(preloadPor, 400); else window.addEventListener('load', () => setTimeout(preloadPor, 400));

    let lastKey = '';
    function apply() {
      const key = s.toFixed(4) + '|' + por.toFixed(4) + '|' + W + '|' + H + '|' + swing.caki.a.toFixed(2) + '|' + swing.cak.a.toFixed(2);
      if (key === lastKey) return; lastKey = key;
      const x = s * W, pe = por, qe = 1 - por;
      el.wP.style.transform = 'translate3d(' + (x - W) + 'px,0,0)';
      el.iP.style.transform = 'translate3d(' + (W - x) + 'px,0,0)';
      el.wB.style.transform = 'translate3d(' + x + 'px,0,0)';
      el.iB.style.transform = 'translate3d(' + (-x) + 'px,0,0)';
      el.seam.style.transform = 'translate3d(' + x + 'px,0,0)';
      const lyPor = porLayout(x, pe);
      const drop = 40 * pe; // kousky na ramínkách se za fotkou schovají o kus níž
      let opP, opB, opM;
      if (!mobile) {
        const dP = sm(0.5, 0.585, s), dB = sm(0.5, 0.415, s);
        const top = 34, barH = 98, Ha = H - top - barH;
        const sH = Math.min(1.08, Ha / 560);
        const gap = 66 + 96 * (1 - Math.max(dP, dB));
        const tw = 280, tg = 52, pad = Math.max(24, W * 0.035);
        // dominantní svět zmenší oblouk tak, aby se vedle vešel text
        const domP = Math.min(sH, Math.max(0.6, (x - gap - pad - 24 - tw - tg) / 420));
        const domB = Math.min(sH, Math.max(0.6, (W - x - gap - pad - 24 - tw - tg) / 420));
        let scP = sH * 0.78 + (domP - sH * 0.78) * dP, scB = sH * 0.78 + (domB - sH * 0.78) * dB;
        scP = Math.min(scP, Math.max(0.25, (x - gap - 20) / 420));
        scB = Math.min(scB, Math.max(0.25, (W - x - gap - 20) / 420));
        const yP = top + (Ha - 560 * scP) / 2 + drop, yB = top + (Ha - 560 * scB) / 2 + drop;
        const xP = x - gap - 420 * scP, xB = x + gap;
        el.aP.style.transform = 'translate3d(' + xP + 'px,' + yP + 'px,0) scale(' + scP + ')';
        el.aB.style.transform = 'translate3d(' + xB + 'px,' + yB + 'px,0) scale(' + scB + ')';
        const txP = xP - tg - tw, txB = xB + 420 * scB + tg;
        opP = sm(pad - 30, pad + 20, txP) * dP;
        opB = sm(W - pad + 30, W - pad - 20, txB + tw) * dB;
        opM = 1 - sm(0, 0.4, Math.max(dP, dB));
        el.tP.style.transform = 'translate3d(' + txP + 'px,' + (top + Ha / 2 - tH.P / 2) + 'px,0)';
        el.tB.style.transform = 'translate3d(' + txB + 'px,' + (top + Ha / 2 - tH.B / 2) + 'px,0)';
        const groupH = lH + (22 + tH.M) * opM;
        let ly = top + Ha / 2 - groupH / 2;
        if (lyPor !== null) ly = ly * qe + lyPor * pe;
        el.label.style.transform = 'translate3d(' + x + 'px,' + ly + 'px,0)';
        el.tM.style.transform = 'translate3d(' + (x - 140) + 'px,' + (ly + lH + 22 + (1 - opM) * 14) + 'px,0)';
      } else {
        const dP = sm(0.5, 0.74, s), dB = sm(0.5, 0.26, s);
        const lTop = 14, titleTop = lTop + lH + 14, barH = 64;
        const colH = H - barH - titleTop - 6;
        const titleH = 46, bottomBlock = 112;
        const half = el.label.offsetWidth / 2 + 6;
        const lx = Math.min(Math.max(x, half), W - half);
        el.label.style.transform = 'translate3d(' + lx + 'px,' + lTop + 'px,0)';
        const regionP = x, regionB = W - x;
        const dom = Math.max(dP, dB);
        const archTop = titleTop + titleH * dom + 8;
        const archMaxH = Math.max(150, titleTop + colH - bottomBlock * Math.max(dom, 1 - dom) - 10 - archTop);
        let scP = Math.min(archMaxH / 400, (regionP - 28) / 300), scB = Math.min(archMaxH / 400, (regionB - 28) / 300);
        scP = Math.max(0.2, Math.min(scP, 1.1)); scB = Math.max(0.2, Math.min(scB, 1.1));
        const cxP = Math.max(regionP / 2, x - 0.5 * W), cxB = Math.min(x + regionB / 2, x + 0.5 * W);
        const yP = archTop + (archMaxH - 400 * scP) / 2 + drop, yB = archTop + (archMaxH - 400 * scB) / 2 + drop;
        el.aP.style.transform = 'translate3d(' + (cxP - 150 * scP) + 'px,' + yP + 'px,0) scale(' + scP + ')';
        el.aB.style.transform = 'translate3d(' + (cxB - 150 * scB) + 'px,' + yB + 'px,0) scale(' + scB + ')';
        opP = dP; opB = dB; opM = 1 - Math.max(dP, dB);
        const tw = Math.min(320, W * 0.84);
        el.tP.style.height = el.tB.style.height = colH + 'px';
        el.tP.style.transform = 'translate3d(' + (cxP - tw / 2) + 'px,' + titleTop + 'px,0)';
        el.tB.style.transform = 'translate3d(' + (cxB - tw / 2) + 'px,' + titleTop + 'px,0)';
        el.tM.style.transform = 'translate3d(' + (x - 140) + 'px,' + (titleTop + colH - tH.M) + 'px,0)';
      }
      // předávka bez dvojexpozice: fotka zmizí dřív, než se objeví kousky (a naopak)
      const opA = sm(0.45, 0.95, qe), opF = sm(0.55, 0.9, pe), opT = sm(0.62, 1, pe);
      opP *= opA; opB *= opA; opM *= sm(0.5, 1, qe);
      const vis = [[el.tP, opP], [el.tB, opB], [el.tM, opM], [el.tL, opT], [el.tR, opT], [el.por, opF], [el.aP, opA], [el.aB, opA]];
      vis.forEach(([n, o]) => { n.style.opacity = o; });
      [[el.tP, opP], [el.tB, opB], [el.tM, opM], [el.tL, opT], [el.tR, opT]].forEach(([n, o]) => {
        n.style.pointerEvents = o > 0.5 ? '' : 'none';
        const off = o < 0.5; if (n.inert !== off) n.inert = off; // skryté texty nejdou ani tabulátorem
      });
      el.por.setAttribute('aria-hidden', String(opF < 0.5));
      ['caki', 'cak'].forEach((w) => { const r = 'rotate(' + swing[w].a.toFixed(2) + 'deg)'; imgs[w].forEach((im) => (im.style.transform = r)); });
      el.label.setAttribute('aria-valuenow', Math.round(s * 100));
      el.label.setAttribute('aria-valuetext', pe > 0.5 ? 'Monika s Ruminkou · Caki·Cak pro oba' : s > 0.55 ? 'Caki, pro holčičky' : s < 0.45 ? 'Cak, pro chlapečky' : 'Caki·Cak, pro oba');
    }

    function setPauseUI() {
      el.pause.innerHTML = (playing ? ICON.pause : ICON.play) + '<span>' + (playing ? 'Pozastavit' : 'Přehrát') + '</span>';
      el.pause.setAttribute('aria-pressed', String(!playing));
      el.pause.setAttribute('aria-label', playing ? 'Pozastavit střídání světů' : 'Přehrát střídání světů');
    }

    function goTo(i, opts) {
      opts = opts || {};
      cur = (i + scenes.length) % scenes.length; elapsed = 0;
      tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === cur)); t.classList.toggle('done', false); t.querySelector('b').style.transform = 'scaleX(0)'; });
      const sc = scenes[cur];
      if (sc.portrait) showPortrait(cur, !!opts.instant || por < 0.5);
      setProduct('caki', sc.caki, true); setProduct('cak', sc.cak, true);
      const to = splitOf(cur), pTo = sc.portrait ? 1 : 0;
      if (RM || opts.instant) { s = to; anim = null; por = pTo; pAnim = null; }
      else {
        const now = performance.now();
        anim = { from: s, to, t0: now, dur: 1150 };
        pAnim = por !== pTo ? { from: por, to: pTo, t0: now, dur: 1150 } : null;
        if (!pTo && por > 0.5) { swing.caki.v -= 1.2; swing.cak.v += 1.2; } // kousky se po fotce zhoupnou
      }
      el.label.classList.remove('beat'); void el.label.offsetWidth; if (!RM) el.label.classList.add('beat');
      kick();
    }

    // nejbližší scéna s kousky (scéna s fotkou se tažením nevybírá)
    function nearest() { let b = prodIdx[0], d = 9; prodIdx.forEach((i) => { const dd = Math.abs(splitOf(i) - s); if (dd < d) { d = dd; b = i; } }); return b; }
    const prodOrder = () => prodIdx.slice().sort((a, b) => splitOf(a) - splitOf(b));

    function physics(dx) {
      ['caki', 'cak'].forEach((w) => {
        const g = swing[w];
        g.v += -0.034 * g.a - 0.11 * g.v - dx * 0.05;
        g.a = Math.max(-9, Math.min(9, g.a + g.v));
      });
    }
    function settled() { return ['caki', 'cak'].every((w) => Math.abs(swing[w].a) < 0.02 && Math.abs(swing[w].v) < 0.02); }

    function frame(now) {
      raf = 0;
      const dt = Math.min(64, now - (last || now)); last = now;
      const prevX = s * W;
      if (anim) {
        const t = Math.min(1, (now - anim.t0) / anim.dur);
        s = anim.from + (anim.to - anim.from) * ease(t);
        if (t >= 1) anim = null;
      }
      if (pAnim) {
        const t = Math.min(1, (now - pAnim.t0) / pAnim.dur);
        por = pAnim.from + (pAnim.to - pAnim.from) * ease(t);
        if (t >= 1) pAnim = null;
      }
      if (playing && !drag && visible && !introOn) {
        elapsed += dt;
        const b = tabs[cur].querySelector('b'); b.style.transform = 'scaleX(' + Math.min(1, elapsed / durOf(cur)) + ')';
        if (elapsed >= durOf(cur)) goTo(cur + 1);
      }
      physics(RM ? 0 : (s * W - prevX) / Math.max(1, dt / 16.7));
      apply();
      if (visible && (anim || pAnim || drag || (playing && !introOn) || !settled())) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }

    /* tažení cedulky / švu */
    function startDrag(e, fromSwipe) {
      drag = { id: e.pointerId, x0: e.clientX, s0: s, moved: false, swipe: fromSwipe, t: performance.now(), lastX: e.clientX, v: 0 };
      try { e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId); } catch (err) { /* nic */ }
      kick();
    }
    function moveDrag(e) {
      if (!drag || e.pointerId !== drag.id) return;
      const now = performance.now();
      drag.v = (e.clientX - drag.lastX) / Math.max(1, now - drag.t); drag.t = now; drag.lastX = e.clientX;
      if (!drag.moved) {
        if (Math.abs(e.clientX - drag.x0) < 3) return;
        drag.moved = true; anim = null; drag.s0 = s; drag.x0 = e.clientX;
        if (playing) { playing = false; setPauseUI(); }
        // tažením se fotka Moniky s Ruminkou uklidí a ukážou se oba světy
        if (por > 0.001) { pAnim = { from: por, to: 0, t0: now, dur: 650 }; swing.caki.v -= 0.9; swing.cak.v += 0.9; }
      }
      const lo = mobile ? 0.12 : 0.2, hi = mobile ? 0.88 : 0.8;
      s = Math.max(lo, Math.min(hi, drag.s0 + (e.clientX - drag.x0) / W));
      kick();
    }
    function endDrag(e) {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      const v = drag.v, moved = drag.moved; drag = null;
      if (!moved) { kick(); return; } // jen klik na cedulku: scéna zůstává
      dragEnd = performance.now();
      let i = nearest();
      if (mobile) {
        if (Math.abs(v) > 0.35) { const order = prodOrder(); const pos = order.indexOf(i); i = order[Math.max(0, Math.min(order.length - 1, pos + (v > 0 ? 1 : -1)))]; }
        goTo(i);
      } else {
        cur = i; elapsed = 0;
        tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === cur)); t.querySelector('b').style.transform = 'scaleX(0)'; });
        setProduct('caki', scenes[cur].caki, true); setProduct('cak', scenes[cur].cak, true);
        kick();
      }
    }
    [el.label, el.seam].forEach((h) => h.addEventListener('pointerdown', (e) => { if (e.button !== 0) return; e.preventDefault(); finishIntro(); startDrag(e, false); }));
    window.addEventListener('pointermove', moveDrag, { passive: true });
    window.addEventListener('pointerup', endDrag); window.addEventListener('pointercancel', endDrag);
    // mobil: vodorovné přejetí kdekoli v hero
    let sw = null;
    root.addEventListener('pointerdown', (e) => { if (!mobile || e.pointerType === 'mouse' || drag) return; sw = { id: e.pointerId, x: e.clientX, y: e.clientY }; }, { passive: true });
    root.addEventListener('pointermove', (e) => {
      if (!sw || drag || e.pointerId !== sw.id) return;
      const dx = e.clientX - sw.x, dy = e.clientY - sw.y;
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.3) { finishIntro(); startDrag({ pointerId: e.pointerId, clientX: sw.x, target: root }, true); moveDrag(e); sw = null; }
      else if (Math.abs(dy) > 12) sw = null;
    }, { passive: true });
    // po přetažení nesmí „proklouznout“ klik na tlačítko pod prstem
    root.addEventListener('click', (e) => { if ((drag && drag.moved) || performance.now() - dragEnd < 350) { e.preventDefault(); e.stopPropagation(); } }, true);

    el.label.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault(); finishIntro();
      if (playing) { playing = false; setPauseUI(); }
      const order = prodOrder();
      const pos = order.indexOf(nearest());
      const next = e.key === 'Home' ? 0 : e.key === 'End' ? order.length - 1 : Math.max(0, Math.min(order.length - 1, pos + (e.key === 'ArrowRight' ? 1 : -1)));
      goTo(order[next]);
    });
    tabs.forEach((t) => t.addEventListener('click', () => { finishIntro(); goTo(+t.dataset.i); }));
    // když se do úvodu dostane fokus z klávesnice, střídání scén se zastaví (ať text neuteče)
    root.addEventListener('focusin', (e) => { if (playing && !e.target.closest('.hpause, .htab')) { playing = false; setPauseUI(); } });
    el.pause.addEventListener('click', () => { playing = !playing; setPauseUI(); if (playing) { last = performance.now(); } kick(); });

    if ('IntersectionObserver' in window) new IntersectionObserver((en) => { visible = en[0].isIntersecting; if (visible) kick(); }, { threshold: 0.05 }).observe(root);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) { last = performance.now(); kick(); } });
    let rT; window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { measure(); lastKey = ''; apply(); }, 80); });
    // po načtení písma se texty přeměří, ať kartička a citát sedí přesně
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); lastKey = ''; apply(); });

    /* úvod: steh, cedulka, srdíčko, opona – jednou za návštěvu, jde přeskočit */
    const lines = $$('.wtext .rv-line', root);
    function finishIntro() {
      if (!introOn) return; introOn = false;
      root.classList.remove('no-seam', 'no-label', 'no-arch', 'no-text', 'is-intro'); root.classList.add('open');
      lines.forEach((l) => l.classList.add('in'));
      setTimeout(() => el.curtain && el.curtain.remove(), 1100);
      kick();
    }
    setPauseUI();
    measure();
    goTo(0, { instant: true });
    s = splitOf(0);
    apply();
    if (!RM && !ss.get('cc-intro')) {
      // skryté stavy (no-*) jsou v HTML od začátku, takže nic neproblikne
      ss.set('cc-intro', '1'); introOn = true;
      root.classList.remove('is-intro');
      const T = (ms, f) => setTimeout(() => introOn && f(), ms);
      T(80, () => root.classList.remove('no-seam'));
      T(320, () => root.classList.remove('no-label'));
      T(700, () => { el.label.classList.remove('beat'); void el.label.offsetWidth; el.label.classList.add('beat'); });
      T(860, () => root.classList.add('open'));
      T(1060, () => { root.classList.remove('no-arch'); swing.caki.v -= 1.3; swing.cak.v += 1.3; kick(); });
      T(1320, () => { root.classList.remove('no-text'); lines.forEach((l) => l.classList.add('in')); });
      T(2200, () => finishIntro());
      ['keydown', 'wheel'].forEach((ev) => window.addEventListener(ev, finishIntro, { once: true, passive: true }));
    } else {
      // opakovaná návštěva: všechno hned na místě, bez přechodů
      root.classList.add('no-tr');
      root.classList.remove('is-intro', 'no-seam', 'no-label', 'no-arch', 'no-text'); root.classList.add('open');
      lines.forEach((l) => l.classList.add('in'));
      if (el.curtain) el.curtain.remove();
      void root.offsetWidth; root.classList.remove('no-tr');
    }
    kick();
  }

  /* ---------- Příběhy ---------- */
  X.storyStrip($('.st-row'));

  /* ---------- Moje miminko ---------- */
  const mmRoot = $('.mm-home');
  if (mmRoot) {
    X.MM.mount(mmRoot, { compact: window.innerWidth < 760 });
    on('baby', (src) => { if (src === mmRoot || mmRoot.contains(document.activeElement)) return; X.MM.mount(mmRoot, { compact: window.innerWidth < 760 }); });
  }

  /* ---------- Krátký výběr: dvě řady, zbytek kategorie na klik ---------- */
  const LOGO = 'https://storage.googleapis.com/cakicak258424/Caki_Cak_-_logo_kruh.jpg', MONIKA = 'assets/img/brand/monika-avatar.webp';
  const colsOf = (g) => getComputedStyle(g).gridTemplateColumns.split(' ').length; // 4 / 3 / 2 podle šířky
  // ať vedle sebe nestojí dva kousky ze stejné kolekce
  function mix(list) {
    const out = []; let rest = list;
    while (rest.length) {
      const seen = new Set(), next = [];
      rest.forEach((p) => { const k = p.col || p.line; if (seen.has(k)) next.push(p); else { seen.add(k); out.push(p); } });
      rest = next;
    }
    return out;
  }
  // „Zobrazit ještě 1 set“, „další 3 kousky“, „dalších 6 kousků“
  function moreLabel(n, f) { return n === 1 ? 'Zobrazit ještě 1 ' + f[0] : n < 5 ? 'Zobrazit další ' + n + ' ' + f[1] : 'Zobrazit dalších ' + n + ' ' + f[2]; }
  // vykreslí mřížku s limitem; zbytek schová za tlačítko (jeden schovaný kousek rovnou ukáže)
  function shortGrid(grid, moreEl, list, lim, open, forms, attr) {
    const k = grid.querySelectorAll('.pcard').length;
    const show = open || list.length - lim <= 1 ? list : list.slice(0, lim);
    grid.innerHTML = show.map((p) => card(p)).join('');
    const rest = list.length - show.length;
    moreEl.innerHTML = rest > 0 ? '<button class="btn btn--ghost" type="button" ' + attr + '>' + moreLabel(rest, forms) + '</button>' : '';
    return k;
  }
  // záložky na mobilu jedou do strany: vybraná musí být vidět a konec se ztrácí, dokud jsou vpravo další
  function showTab(t) {
    const b = t.querySelector('[aria-selected="true"]'); if (!b || t.scrollWidth <= t.clientWidth) return;
    const tr = t.getBoundingClientRect(), br = b.getBoundingClientRect();
    if (br.left < tr.left) t.scrollLeft += br.left - tr.left - 8; else if (br.right > tr.right - 56) t.scrollLeft += br.right - tr.right + 56;
  }
  $$('#vyber .tabs, #darky .tabs').forEach((t) => {
    const upd = () => t.classList.toggle('is-more', t.scrollWidth - t.clientWidth - t.scrollLeft > 2);
    t.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); requestAnimationFrame(upd);
  });
  // po rozbalení přejde fokus na první nový kousek, ať se klávesnice neztratí
  function focusNew(grid, k) { const c = grid.querySelectorAll('.pcard')[k]; const a = c && c.querySelector('.pcard__name a'); if (a) a.focus({ preventScroll: true }); }

  /* ---------- Vybráno s láskou ---------- */
  function picks() {
    const sec = $('#vyber'); if (!sec) return;
    const grid = $('[data-picks]', sec), tool = $('[data-pick-tool]', sec), moreEl = $('[data-pick-more]', sec), note = $('[data-pick-note]', sec);
    let cur = 'holcicky', onlyMine = false, open = false, noteKey = 'def';
    const pool = CC.PRODUCTS.filter((p) => p.cat !== 'Sety');
    const ACC = /Ponožky|Deky/;
    const TAB = {
      holcicky: (p) => (p.for === 'holcicky' || p.for === 'oba') && !ACC.test(p.cat),
      chlapecky: (p) => (p.for === 'chlapecky' || p.for === 'oba') && !ACC.test(p.cat),
      cosy: (p) => p.col === 'COSY',
      premium: (p) => p.line === 'premium',
      doplnky: (p) => ACC.test(p.cat)
    };
    // Moničina slova k záložce: COSY a prémiová řada mají vlastní
    const NOTE = {
      def: [MONIKA, '„Vím, že ne každá maminka má stejný vkus. Proto jsem myslela i na ty, které mají radši barevnější svět.“', 'Monika'],
      cosy: [LOGO, '„Kdybych měla vybrat jedny z nejoblíbenějších kousků, tyhle teplákovky by tam rozhodně nesměly chybět.“', '@cakicak.cz na Instagramu'],
      premium: [MONIKA, '„Řadu jsem si dovolila přidat navíc pro ty, které si chtějí dopřát o něco víc.“', 'Monika']
    };
    let noteT;
    function setNote() {
      const key = NOTE[cur] ? cur : 'def'; if (key === noteKey) return; noteKey = key;
      const n = NOTE[key];
      clearTimeout(noteT); note.classList.add('is-swap');
      noteT = setTimeout(() => {
        const img = $('img', note); img.src = n[0]; img.classList.toggle('mnote__av--logo', n[0] === LOGO);
        $('blockquote', note).textContent = n[1]; $('figcaption', note).textContent = n[2];
        note.classList.remove('is-swap');
      }, RM ? 0 : 180);
    }
    function render(more) {
      $$('[data-pick]', sec).forEach((b) => b.setAttribute('aria-selected', String(b.dataset.pick === cur)));
      showTab($('.tabs', sec)); setNote();
      const me = Baby.size();
      tool.innerHTML = me ? '<label class="toggle"><input type="checkbox"' + (onlyMine ? ' checked' : '') + ' data-only> Jen skladem ve velikosti ' + me.cm + ' (' + me.label + ')</label>' : '<button class="btn btn--ghost btn--sm" type="button" data-setbaby>' + HEART + ' Zadat velikost miminka</button>';
      let list = mix(pool.filter(TAB[cur]));
      if (me) list = list.map((p) => ({ p, m: X.mineFor(p, me) })).sort((a, b) => ((a.m && a.m.st === 'ok') ? 0 : 1) - ((b.m && b.m.st === 'ok') ? 0 : 1)).map((x) => x.p);
      if (me && onlyMine) list = list.filter((p) => { const m = X.mineFor(p, me); return m && m.st === 'ok'; });
      if (!list.length) {
        grid.innerHTML = '<p class="empty">Ve velikosti ' + me.cm + ' teď v této kategorii nic skladem nemáme. Zkuste o číslo větší, nebo vypněte filtr.</p>';
        moreEl.innerHTML = ''; return;
      }
      const k = shortGrid(grid, moreEl, list, colsOf(grid) * 2, open, ['kousek', 'kousky', 'kousků'], 'data-more-picks');
      if (more) focusNew(grid, k);
    }
    sec.addEventListener('click', (e) => {
      const b = e.target.closest('[data-pick]'); if (b) { cur = b.dataset.pick; open = false; render(); }
      if (e.target.closest('[data-more-picks]')) { open = true; render(true); }
      if (e.target.closest('[data-setbaby]')) X.MM.openModal();
    });
    sec.addEventListener('change', (e) => { if (e.target.matches('[data-only]')) { onlyMine = e.target.checked; render(); } });
    on('baby', () => render());
    bindCards(grid); render();
    let cols = colsOf(grid);
    window.addEventListener('resize', () => { const c = colsOf(grid); if (c !== cols) { cols = c; render(); } });
    function fromHash() {
      const h = location.hash; if (!h.startsWith('#vyber')) return;
      const m = h.match(/pro=(\w+)/); if (m && TAB[m[1]]) { cur = m[1]; open = false; }
      if (/skladem=1/.test(h) && Baby.size()) onlyMine = true;
      render();
      sec.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
    }
    window.addEventListener('hashchange', fromHash); fromHash();
    // stejný odkaz podruhé (např. „Vybrat barvu“ v úvodu) hashchange nevyvolá
    document.addEventListener('click', (e) => { const a = e.target.closest('a[href*="#vyber"]'); if (a && a.pathname === location.pathname && a.hash === location.hash) { e.preventDefault(); fromHash(); } });
  }

  /* ---------- Dárek k narození ---------- */
  function gifts() {
    const sec = $('#darky'); if (!sec) return;
    const grid = $('[data-gifts]', sec), moreEl = $('[data-gift-more]', sec); let cur = 'holcicky', open = false;
    const sets = CC.PRODUCTS.filter((p) => p.cat === 'Sety' && p.sizes.length === 1);
    const lim = () => { const c = colsOf(grid); return c >= 3 ? c : c * 2; }; // jedna řada, na mobilu dvě
    function render(more) {
      $$('[data-gift]', sec).forEach((b) => b.setAttribute('aria-selected', String(b.dataset.gift === cur)));
      showTab($('.tabs', sec));
      const list = mix(sets.filter((p) => (cur === 'oba' ? p.for === 'oba' : p.for === cur || p.for === 'oba')).sort((a, b) => (a.for === 'oba') - (b.for === 'oba')));
      const k = shortGrid(grid, moreEl, list, lim(), open, ['set', 'sety', 'setů'], 'data-more-gifts');
      if (more) focusNew(grid, k);
    }
    sec.addEventListener('click', (e) => {
      const b = e.target.closest('[data-gift]'); if (b) { cur = b.dataset.gift; open = false; render(); }
      if (e.target.closest('[data-more-gifts]')) { open = true; render(true); }
    });
    bindCards(grid); render();
    let cols = colsOf(grid);
    window.addEventListener('resize', () => { const c = colsOf(grid); if (c !== cols) { cols = c; render(); } });
  }

  /* ---------- Můj příběh: steh se prošije a oblouky vyrostou s Ruminkou ---------- */
  function storyLine() {
    const tl = $('.tl'); if (!tl) return;
    if (RM || !('IntersectionObserver' in window)) { tl.classList.add('in'); return; }
    const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { tl.classList.add('in'); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(tl);
  }

  hero(); picks(); gifts(); storyLine();
  X.reveal();
})();
