/* MOONSUIT · concept by MALUS/01 · shared: bag, cards, drawers, fit finder */
(function () {
  'use strict';
  var M = window.MS;
  var doc = document, root = doc.documentElement;
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (RM) root.classList.add('motion-reduced');

  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(n) { return n.toLocaleString('en-US') + ' ' + M.currency; }
  function P(h) { for (var i = 0; i < M.products.length; i++) if (M.products[i].handle === h) return M.products[i]; return null; }
  function C(p, name) {
    var f = p.colors.filter(function (c) { return c.name === name; })[0];
    return f || p.colors.filter(function (c) { return c.name === p.defaultColor; })[0] || p.colors[0];
  }
  function hasColor(p, name) { return p.colors.some(function (c) { return c.name === name; }); }
  function img(n) { return 'assets/img/' + n + '.jpg'; }
  function sizesFor(p) { return p.oneSize ? ['One size'] : ['XS/S', 'M/L']; }
  function sizeState(p, cname, s) { return C(p, cname).sizes[s] || 'none'; }
  function media(p, cname) {
    var c = C(p, cname);
    if (c.img.length) return { imgs: c.img, shown: null };
    var d = C(p, p.defaultColor);
    return { imgs: d.img, shown: d.name };
  }
  function hex(n) { return M.colors[n] || '#999'; }
  function pdpUrl(p, cname) { return 'produkt.html?p=' + encodeURIComponent(p.handle) + (cname ? '&c=' + encodeURIComponent(cname) : ''); }
  function availSizes(p, cname) { return sizesFor(p).filter(function (s) { return sizeState(p, cname, s) !== 'none'; }); }
  function priceHTML(p, extra) {
    if (p.compare) {
      return '<p class="price is-sale ' + (extra || '') + '"><span class="now">' + fmt(p.price) + '</span><s>' + fmt(p.compare) + '</s></p>';
    }
    return '<p class="price ' + (extra || '') + '"><span class="now">' + fmt(p.price) + '</span></p>';
  }
  function pct(p) { return p.compare ? Math.round((1 - p.price / p.compare) * 100) : 0; }

  /* ---------- storage ---------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }
  };
  function emit(name, detail) { doc.dispatchEvent(new CustomEvent(name, { detail: detail })); }

  /* ---------- bag ---------- */
  var Bag = {
    lines: (store.get('ms-bag', []) || []).filter(function (l) { var p = P(l.h); return p && hasColor(p, l.c) && sizeState(p, l.c, l.s) === 'in' && l.q > 0; }),
    save: function () { store.set('ms-bag', this.lines); emit('bag:change'); },
    add: function (h, c, s, q) {
      q = q || 1;
      var l = this.lines.filter(function (x) { return x.h === h && x.c === c && x.s === s; })[0];
      if (l) l.q += q; else this.lines.push({ h: h, c: c, s: s, q: q, t: Date.now() });
      this.last = h + '|' + c + '|' + s;
      this.save();
    },
    setQty: function (i, q) { if (q <= 0) this.lines.splice(i, 1); else this.lines[i].q = Math.min(q, 9); this.save(); },
    count: function () { return this.lines.reduce(function (a, l) { return a + l.q; }, 0); },
    total: function () { return this.lines.reduce(function (a, l) { return a + P(l.h).price * l.q; }, 0); },
    was: function () { return this.lines.reduce(function (a, l) { var p = P(l.h); return a + (p.compare || p.price) * l.q; }, 0); },
    has: function (h, c, s) { return this.lines.some(function (l) { return l.h === h && (!c || l.c === c) && (!s || l.s === s); }); }
  };

  /* ---------- panels: bag drawer, search, menu, fit drawer, sheets ---------- */
  var veil, openPanel = null, lastFocus = null;
  function openP(id, opener) {
    var el = doc.getElementById(id);
    if (!el) return;
    if (openPanel && openPanel !== el) closeP(true);
    lastFocus = opener || doc.activeElement;
    el.hidden = false;
    el.offsetWidth; // apply start state before transition
    el.classList.add('is-on');
    el.setAttribute('aria-hidden', 'false');
    veil.classList.add('is-on');
    openPanel = el;
    root.style.overflow = 'hidden';
    var f = el.hasAttribute('data-autofocus') ? el : (el.querySelector('[data-autofocus]') || el.querySelector('button, a, input'));
    if (f) setTimeout(function () { try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); } }, 60);
    emit('panel:open', id);
  }
  function closeP(silent) {
    if (!openPanel) return;
    openPanel.classList.remove('is-on');
    openPanel.setAttribute('aria-hidden', 'true');
    veil.classList.remove('is-on');
    root.style.overflow = '';
    var was = openPanel; openPanel = null;
    emit('panel:close', was.id);
    if (!silent && lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) { /* noop */ } }
  }

  /* ---------- toast ---------- */
  var toastTimer;
  function toast(o) {
    var t = $('#toast');
    if (!t) return;
    t.innerHTML = (o.img ? '<img src="' + img(o.img) + '" alt="">' : '<span></span>') +
      '<div><p class="toast__t">' + o.html + '</p>' +
      '<div class="toast__a"><button type="button" data-open="bag">View bag (' + Bag.count() + ')</button><button type="button" data-toast-x>Keep shopping</button></div></div>';
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-on'); }, 5200);
  }
  function hideToast() { var t = $('#toast'); if (t) t.classList.remove('is-on'); }

  /* ---------- add to bag ---------- */
  function addToBag(h, c, s, o) {
    o = o || {};
    var p = P(h);
    if (!p || sizeState(p, c, s) !== 'in') return false;
    Bag.add(h, c, s, 1);
    if (!o.silent) {
      toast({ img: media(p, c).imgs[0], html: '<b>Added to your bag</b><br>' + esc(p.name) + ' · ' + esc(c) + ' · ' + esc(s) });
    }
    return true;
  }
  function addMany(items, label) {
    var ok = 0, first = null;
    items.forEach(function (it) { if (addToBag(it.h, it.c, it.s, { silent: true })) { ok++; if (!first) first = it; } });
    if (ok) {
      var p = P(first.h);
      toast({ img: media(p, first.c).imgs[0], html: '<b>' + esc(label) + ' added</b><br>' + items.map(function (it) { return esc(P(it.h).name); }).join(' + ') + ' · ' + esc(items[0].s) });
    }
    return ok;
  }

  /* ---------- header bag count ---------- */
  function syncCount() {
    var n = Bag.count();
    $$('[data-bag-count]').forEach(function (el) {
      if (el.textContent !== String(n)) {
        el.textContent = n;
        var b = el.closest('.hdr__bag');
        if (b && !RM) { b.classList.remove('is-bump'); b.offsetWidth; b.classList.add('is-bump'); }
      }
    });
  }

  /* ---------- bag drawer render ---------- */
  function moonPhase(el, p) { if (el) el.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3)); }
  function freeLine(total) {
    var left = M.freeShipping - total;
    if (total <= 0) return 'Free delivery across Morocco from <b>' + fmt(M.freeShipping) + '</b>';
    if (left > 0) return 'Add <b>' + fmt(left) + '</b> for free delivery';
    return '<b>Free delivery unlocked.</b> We deliver across Morocco.';
  }
  function renderBag(newKey) {
    var body = $('#bag-body');
    if (!body) return;
    var n = Bag.count(), total = Bag.total(), was = Bag.was();
    $$('[data-bag-n]').forEach(function (el) { el.textContent = n ? '(' + n + ')' : ''; });
    var mb = $('#bag-moon');
    if (mb) {
      moonPhase($('.mphase', mb), total / M.freeShipping);
      $('p', mb).innerHTML = freeLine(total);
    }
    if (!n) {
      body.innerHTML = '<div class="bag__empty"><p>Your bag is empty.</p><p class="muted">Two sizes, fourteen colours and free delivery over ' + fmt(M.freeShipping) + '.</p><a class="btn btn--line" href="index.html#shop" data-close>Shop all pieces</a></div>';
    } else {
      var html = '<ul>';
      Bag.lines.forEach(function (l, i) {
        var p = P(l.h), m = media(p, l.c), key = l.h + '|' + l.c + '|' + l.s;
        html += '<li class="bline' + (key === newKey ? ' is-new' : '') + '"><a href="' + pdpUrl(p, l.c) + '"><img src="' + img(m.imgs[0]) + '" alt="' + esc(p.name) + '"></a><div>' +
          '<div class="bline__top"><a class="bline__name" href="' + pdpUrl(p, l.c) + '">' + esc(p.name) + '</a>' +
          (p.compare ? '<p class="price is-sale"><span class="now">' + fmt(p.price * l.q) + '</span><s>' + fmt(p.compare * l.q) + '</s></p>' : '<p class="price">' + fmt(p.price * l.q) + '</p>') + '</div>' +
          '<p class="bline__meta">' + esc(l.c) + ' · ' + esc(l.s) + (l.q > 1 ? ' · ' + fmt(p.price) + ' each' : '') + '</p>' +
          '<div class="bline__ctl"><div class="qty" role="group" aria-label="Quantity"><button type="button" data-q="' + i + '" data-d="-1" aria-label="One less">−</button><span>' + l.q + '</span><button type="button" data-q="' + i + '" data-d="1" aria-label="One more">+</button></div>' +
          '<button type="button" class="rm" data-q="' + i + '" data-d="rm">Remove</button></div></div></li>';
      });
      html += '</ul>';
      // pairs well with
      var lastLine = Bag.lines[Bag.lines.length - 1];
      var lp = P(lastLine.h), pair = null;
      (lp.suggest || []).some(function (h) { var sp = P(h); if (sp && !Bag.has(h)) { pair = sp; return true; } return false; });
      if (pair) {
        var pc = hasColor(pair, lastLine.c) ? lastLine.c : pair.defaultColor;
        var pm = media(pair, pc);
        html += '<div class="bag__pair"><h3 class="label">Pairs well with your ' + esc(lp.name) + '</h3><div class="pair"><a href="' + pdpUrl(pair, pc) + '"><img src="' + img(pm.imgs[0]) + '" alt="' + esc(pair.name) + '"></a>' +
          '<div><p class="pair__name">' + esc(pair.name) + '</p><p class="pair__meta">' + esc(pc) + ' · ' + fmt(pair.price) + '</p></div><div class="qa" style="margin:0">' +
          availSizes(pair, pc).map(function (s) {
            var st = sizeState(pair, pc, s);
            return '<button type="button" class="qa__b" data-add="' + pair.handle + '" data-c="' + esc(pc) + '" data-s="' + esc(s) + '"' + (st !== 'in' ? ' disabled' : '') + '>' + (st === 'in' ? '+ ' + esc(s) : esc(s) + ' sold out') + '</button>';
          }).join('') + '</div></div></div>';
      }
      body.innerHTML = html;
    }
    var foot = $('#bag-foot');
    if (foot) {
      foot.innerHTML = n ? (
        '<div class="bag__row"><span>Subtotal</span><span class="num">' + fmt(was) + '</span></div>' +
        (was > total ? '<div class="bag__row is-save"><span>You save</span><span class="num">−' + fmt(was - total) + '</span></div>' : '') +
        '<div class="bag__row"><span>Delivery</span><span>' + (total >= M.freeShipping ? 'Free' : 'Free from ' + fmt(M.freeShipping)) + '</span></div>' +
        '<div class="bag__row is-total"><span>Total</span><span class="num">' + fmt(total) + '</span></div>' +
        '<p class="bag__pay">' + esc(M.shipping.payment) + ' · ' + esc(M.shipping.casablanca) + '</p>' +
        '<button type="button" class="btn btn--wide" data-checkout>Checkout · ' + fmt(total) + '</button><p class="bag__note" aria-live="polite"></p>'
      ) : '';
    }
  }

  /* ---------- product card ---------- */
  function swatchesHTML(p, cur) {
    return p.colors.map(function (c) {
      return '<button type="button" data-sw="' + esc(c.name) + '" class="' + (c.name === cur ? 'is-on' : '') + '" aria-label="' + esc(c.name) + '" aria-pressed="' + (c.name === cur) + '" title="' + esc(c.name) + '"><span class="sw" style="--c:' + hex(c.name) + '"></span></button>';
    }).join('');
  }
  function quickAddHTML(p, cname) {
    var sizes = availSizes(p, cname);
    return sizes.map(function (s) {
      var st = sizeState(p, cname, s), added = Bag.has(p.handle, cname, s);
      if (st === 'out') return '<button type="button" class="qa__b" disabled>' + esc(s) + ' sold out</button>';
      return '<button type="button" class="qa__b' + (added ? ' is-added' : '') + '" data-add="' + p.handle + '" data-c="' + esc(cname) + '" data-s="' + esc(s) + '">' +
        (added ? '✓ ' + esc(s) + ' in bag' : (sizes.length === 1 && !p.oneSize ? 'Add ' + esc(s) : (p.oneSize ? 'Add to bag' : '<span class="plus">+</span> ' + esc(s)))) + '</button>';
    }).join('');
  }
  function metaText(p, cname) {
    var sizes = availSizes(p, cname);
    var parts = [cname];
    if (p.colors.length > 1) parts.push(p.colors.length + ' colours');
    if (!p.oneSize && sizes.length === 1) parts.push(sizes[0] + ' only');
    return parts.join(' · ');
  }
  function cardInner(p, cname) {
    var m = media(p, cname), a = m.imgs[0], b = m.imgs[1];
    var flag = p.compare ? '<span class="card__flag is-sale">' + pct(p) + '% off</span>' : (p.isNew ? '<span class="card__flag">New</span>' : '');
    return '<a class="card__media" href="' + pdpUrl(p, cname) + '" aria-label="' + esc(p.name + ', ' + cname) + '">' +
      '<img class="a' + (b ? ' has-b' : '') + '" src="' + img(a) + '" alt="' + esc(p.name + ' in ' + (m.shown || cname)) + '" loading="lazy" decoding="async">' +
      (b ? '<img class="b" src="' + img(b) + '" alt="" loading="lazy" decoding="async">' : '') + flag +
      (m.shown ? '<span class="card__shown">Shown in ' + esc(m.shown) + '</span>' : '') + '</a>' +
      '<div class="card__body"><div class="card__row"><h3 class="card__name"><a href="' + pdpUrl(p, cname) + '">' + esc(p.name) + '</a></h3>' + priceHTML(p) + '</div>' +
      '<p class="card__meta">' + esc(metaText(p, cname)) + '</p>' +
      (p.colors.length > 1 ? '<div class="card__sws" role="group" aria-label="Colours">' + swatchesHTML(p, cname) + '</div>' : '') +
      '<div class="qa" role="group" aria-label="Quick add">' + quickAddHTML(p, cname) + '</div></div>';
  }
  function cardEl(p, cname, k) {
    var el = doc.createElement('article');
    el.className = 'card';
    el.dataset.handle = p.handle;
    el.dataset.color = cname;
    if (k != null) { el.style.setProperty('--k', k); if (!RM) el.classList.add('is-enter'); }
    el.innerHTML = cardInner(p, cname);
    return el;
  }
  function refreshCard(card) {
    var p = P(card.dataset.handle);
    if (!p) return;
    var c = card.dataset.color;
    $('.qa', card).innerHTML = quickAddHTML(p, c);
  }

  /* ---------- fit finder ---------- */
  var Fit = {
    get: function () { return store.get('ms-fit', null); },
    set: function (v) { store.set('ms-fit', v); emit('fit:change', v); },
    zoneH: function (h) { return h < 163 ? 'XS/S' : h > 165 ? 'M/L' : 'both'; },
    zoneE: function (eu) { return eu <= 36 ? 'XS/S' : 'M/L'; },
    recommend: function (h, eu, pref) {
      var hz = this.zoneH(h), ez = this.zoneE(eu), size, why;
      var feel = pref === 'relax' ? 'a relaxed fit' : 'the sculpting effect';
      if (hz === 'both') {
        size = ez;
        why = 'At ' + h + ' cm you sit where our two sizes overlap (163–165 cm), so your EU ' + eu + ' decides it: ' + size + '.';
      } else if (hz === ez) {
        size = ez;
        why = 'EU ' + eu + ' and ' + h + ' cm both sit inside ' + size + (size === 'XS/S' ? ' (EU 34–36, 155–165 cm).' : ' (EU 38–40, 163–173 cm).');
      } else {
        size = pref === 'relax' ? 'M/L' : 'XS/S';
        why = 'EU ' + eu + ' points to ' + ez + ' and ' + h + ' cm points to ' + hz + ', so you are between sizes. You want ' + feel + ', so go for ' + size + '.';
      }
      if (eu <= 32) why += ' EU 32 is below our chart, so XS/S is the closest fit we make.';
      if (eu >= 42) why += ' EU 42 is above our chart. M/L is our largest size and will fit snug, so message us on WhatsApp if you are unsure.';
      return { size: size, why: why, h: h, eu: eu, pref: pref };
    }
  };

  /* fit form shared by homepage section and PDP drawer */
  function fitFormHTML(id, v) {
    var h = v ? v.h : 165, eu = v ? v.eu : 36, pref = v ? v.pref : 'sculpt';
    var eus = [32, 34, 36, 38, 40, 42];
    return '<div class="fit__form" data-fitform="' + id + '">' +
      '<fieldset class="fit__q"><legend class="label">Your height</legend><div class="fit__range">' +
      '<input type="range" min="150" max="182" step="1" value="' + h + '" aria-label="Height in centimetres" data-f="h"><output class="num">' + h + ' cm</output></div></fieldset>' +
      '<fieldset class="fit__q"><legend class="label">Your usual size</legend><div class="pills" role="group">' +
      eus.map(function (e) { return '<button type="button" data-f="eu" data-v="' + e + '" class="' + (e === eu ? 'is-on' : '') + '" aria-pressed="' + (e === eu) + '">EU ' + e + '</button>'; }).join('') + '</div></fieldset>' +
      '<fieldset class="fit__q"><legend class="label">How do you like it</legend><div class="pills pills--tall" role="group">' +
      '<button type="button" data-f="pref" data-v="sculpt" class="' + (pref === 'sculpt' ? 'is-on' : '') + '" aria-pressed="' + (pref === 'sculpt') + '">Sculpting<small>snug, second skin</small></button>' +
      '<button type="button" data-f="pref" data-v="relax" class="' + (pref === 'relax' ? 'is-on' : '') + '" aria-pressed="' + (pref === 'relax') + '">Relaxed<small>easy, a little room</small></button>' +
      '</div></fieldset></div>';
  }
  function readFitForm(form) {
    var r = $('input[type=range]', form);
    var eu = $('[data-f=eu].is-on', form), pref = $('[data-f=pref].is-on', form);
    return { h: +r.value, eu: eu ? +eu.dataset.v : 36, pref: pref ? pref.dataset.v : 'sculpt' };
  }
  function bindFitForm(form, onChange) {
    var r = $('input[type=range]', form), out = $('output', form);
    function paint() { var p = (r.value - r.min) / (r.max - r.min) * 100; r.style.setProperty('--p', p + '%'); out.textContent = r.value + ' cm'; }
    paint();
    r.addEventListener('input', function () { paint(); onChange(readFitForm(form)); });
    form.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-f]');
      if (!b) return;
      $$('[data-f=' + b.dataset.f + ']', form).forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); });
      onChange(readFitForm(form));
    });
  }
  function chartHTML(size) {
    var g = M.sizeGuide;
    return '<table class="chart"><thead><tr><th></th><th class="' + (size === 'XS/S' ? 'is-you col-you' : '') + '">XS/S</th><th class="' + (size === 'M/L' ? 'is-you col-you' : '') + '">M/L</th></tr></thead><tbody>' +
      g.rows.map(function (r) { return '<tr><th scope="row">' + esc(r.label) + '</th><td class="' + (size === 'XS/S' ? 'is-you col-you' : '') + '">' + r.xs + '</td><td class="' + (size === 'M/L' ? 'is-you col-you' : '') + '">' + r.ml + '</td></tr>'; }).join('') +
      '</tbody></table>';
  }

  /* ---------- search ---------- */
  function renderSearch(q) {
    var box = $('#search-res');
    if (!box) return;
    q = (q || '').trim().toLowerCase();
    var list = M.products.filter(function (p) {
      if (!q) return true;
      var hay = (p.name + ' ' + p.type + ' ' + p.colors.map(function (c) { return c.name; }).join(' ') + ' ' + (p.summer ? 'summer sale' : '') + ' ' + p.tagline).toLowerCase();
      return q.split(/\s+/).every(function (w) { return hay.indexOf(w) > -1; });
    });
    var colorHit = M.colorOrder.filter(function (c) { return q && c.toLowerCase().indexOf(q) === 0; })[0];
    $('#search-hint').textContent = q ? (list.length ? list.length + (list.length === 1 ? ' piece' : ' pieces') + ' for “' + q + '”' : 'Nothing for “' + q + '”. Try a colour like wine or matcha.') : 'All 13 pieces. Type a name or a colour.';
    $('.grid', box).innerHTML = list.map(function (p) {
      var c = colorHit && hasColor(p, colorHit) ? colorHit : p.defaultColor, m = media(p, c);
      return '<a class="mini" href="' + pdpUrl(p, c) + '"><img src="' + img(m.imgs[0]) + '" alt="" loading="lazy"><span><b>' + esc(p.name) + '</b><br>' + (p.compare ? '<span style="color:var(--wine)">' + fmt(p.price) + '</span> <s class="muted">' + fmt(p.compare) + '</s>' : fmt(p.price)) + '</span></a>';
    }).join('');
  }

  /* ---------- reveal on scroll ---------- */
  var io = (!RM && 'IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }) : null;
  function reveal(scope) { $$('.rv, .rl, .curtain', scope).forEach(function (el) { if (io) io.observe(el); else el.classList.add('is-in'); }); }

  /* ---------- global events ---------- */
  function init() {
    veil = $('#veil');
    syncCount();
    renderBag();
    reveal(doc);

    // header state
    var hdr = $('.hdr'), ticking = false;
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(function () { hdr.classList.toggle('is-scrolled', window.scrollY > 6); ticking = false; }); } }
    if (hdr) { window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); }

    doc.addEventListener('click', function (e) {
      var t = e.target;
      var op = t.closest('[data-open]');
      if (op) {
        e.preventDefault();
        hideToast();
        if (op.dataset.open === 'search') renderSearch($('#search-in') ? $('#search-in').value : '');
        openP(op.dataset.open, op);
        return;
      }
      var cl = t.closest('[data-close]');
      if (cl || t === veil) {
        if (cl && cl.tagName === 'A' && cl.getAttribute('href')) { closeP(true); return; } // let the link navigate
        e.preventDefault(); closeP(); return;
      }
      if (t.closest('[data-toast-x]')) { hideToast(); return; }
      var add = t.closest('[data-add]');
      if (add && !add.disabled) {
        e.preventDefault();
        if (addToBag(add.dataset.add, add.dataset.c, add.dataset.s)) {
          add.classList.add('is-added');
          add.innerHTML = '✓ ' + esc(add.dataset.s) + ' in bag';
        }
        return;
      }
      var sw = t.closest('.card__sws [data-sw]');
      if (sw) {
        var card = sw.closest('.card'), p = P(card.dataset.handle);
        card.dataset.color = sw.dataset.sw;
        card.innerHTML = cardInner(p, sw.dataset.sw);
        var nb = $('[data-sw="' + sw.dataset.sw + '"]', card);
        if (nb) nb.focus({ preventScroll: true });
        return;
      }
      var q = t.closest('[data-q]');
      if (q) {
        var i = +q.dataset.q;
        if (q.dataset.d === 'rm') Bag.setQty(i, 0);
        else Bag.setQty(i, Bag.lines[i].q + (+q.dataset.d));
        return;
      }
      if (t.closest('[data-checkout]')) {
        var note = $('.bag__note');
        if (note) note.textContent = 'Concept preview: checkout stays on Shopify (cash on delivery or bank transfer).';
      }
    });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (openPanel) closeP(); hideToast(); } });
    doc.addEventListener('bag:change', function () {
      syncCount();
      renderBag(Bag.last);
      $$('.card').forEach(refreshCard);
    });
    var si = $('#search-in');
    if (si) si.addEventListener('input', function () { renderSearch(si.value); });
    var sf = $('#search-form');
    if (sf) sf.addEventListener('submit', function (e) { e.preventDefault(); var a = $('#search-res a'); if (a) location.href = a.getAttribute('href'); });
    // keep bag in sync across tabs
    window.addEventListener('storage', function (e) { if (e.key === 'ms-bag') { Bag.lines = store.get('ms-bag', []); syncCount(); renderBag(); } });
  }

  window.MSK = {
    $: $, $$: $$, esc: esc, fmt: fmt, P: P, C: C, hasColor: hasColor, img: img, sizesFor: sizesFor, sizeState: sizeState, media: media, hex: hex,
    pdpUrl: pdpUrl, availSizes: availSizes, priceHTML: priceHTML, pct: pct, store: store, Bag: Bag, addToBag: addToBag, addMany: addMany,
    openP: openP, closeP: closeP, toast: toast, cardEl: cardEl, cardInner: cardInner, Fit: Fit, fitFormHTML: fitFormHTML, bindFitForm: bindFitForm,
    chartHTML: chartHTML, reveal: reveal, moonPhase: moonPhase, freeLine: freeLine, RM: RM, emit: emit
  };
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
