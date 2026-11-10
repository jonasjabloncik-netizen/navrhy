/* GREY · návrh v2 · MALUS/01 · core.js – data, obrázky, karta produktu, košík, hlavička, hledání, přechody stránek, stories */
(function () {
  'use strict';
  const GX = window.GX;
  /* Logo GREY: Poppins Light, obtaženo a ověřeno překrytím s originálem logo_grey_web.png (shoda tvaru 84 % při 185 px). */
GX.LOGO = {"strokes": ["M47.95 15.09 L47.92 14.19 L47.83 13.30 L47.68 12.41 L47.48 11.53 L47.21 10.67 L46.89 9.83 L46.51 9.01 L46.08 8.22 L45.60 7.46 L45.07 6.73 L44.49 6.04 L43.87 5.39 L43.21 4.78 L42.50 4.21 L41.76 3.69 L40.99 3.23 L40.19 2.81 L39.36 2.45 L38.52 2.14 L37.65 1.89 L36.77 1.70 L35.87 1.57 L34.97 1.49 L34.07 1.48 L33.17 1.52 L32.27 1.63 L31.38 1.79 L30.51 2.01 L29.65 2.29 L28.81 2.62 L28.00 3.01 L27.21 3.45 L26.45 3.95 L25.73 4.49 L25.05 5.08 L24.40 5.71 L23.80 6.38 L23.25 7.09 L22.74 7.83 L22.29 8.61 L21.88 9.42 L21.53 10.25 L21.24 11.10 L21.01 11.97 L20.83 12.85 L20.71 13.75 L20.65 14.64 L20.65 15.54 L20.71 16.44 L20.83 17.33 L21.01 18.22 L21.24 19.09 L21.53 19.94 L21.88 20.77 L22.29 21.57 L22.74 22.35 L23.25 23.10 L23.80 23.81 L24.40 24.48 L25.05 25.11 L25.73 25.70 L26.45 26.24 L27.21 26.73 L28.00 27.17 L28.81 27.56 L29.65 27.90 L30.51 28.18 L31.38 28.40 L32.27 28.56 L33.17 28.66 L34.07 28.71 L34.97 28.69 L35.87 28.62 L36.77 28.49 L37.65 28.29 L38.52 28.04 L39.36 27.74 L40.19 27.38 L40.99 26.96 L41.76 26.49 L42.50 25.98 L43.21 25.41 L43.87 24.80 L44.49 24.15 L45.07 23.46 L45.60 22.73 L46.08 21.97 L46.51 21.17 L46.89 20.36 L47.21 19.51 L47.48 18.65 L47.68 17.78 L47.83 16.89 L47.92 15.99 L47.95 15.09", "M47.95 0.25 L47.95 30.70 Q47.95 34.36 46.33 37.14 Q44.71 39.91 41.85 41.38 Q38.98 42.84 35.34 42.84 Q30.24 42.84 26.80 40.56 Q23.36 38.28 22.36 34.39", "M67.80 0.95 L67.80 30.63", "M67.80 16.50 C67.80 4.99 74.80 2.39 80.54 2.39", "M95.96 15.01 L123.25 15.01 L123.25 15.11 L123.22 14.21 L123.13 13.31 L122.99 12.42 L122.78 11.54 L122.52 10.68 L122.20 9.84 L121.82 9.02 L121.39 8.22 L120.91 7.46 L120.38 6.73 L119.81 6.04 L119.19 5.39 L118.53 4.77 L117.83 4.21 L117.09 3.69 L116.32 3.22 L115.52 2.80 L114.70 2.44 L113.85 2.13 L112.99 1.88 L112.11 1.68 L111.22 1.54 L110.32 1.47 L109.42 1.45 L108.52 1.49 L107.63 1.59 L106.74 1.75 L105.87 1.97 L105.01 2.25 L104.17 2.58 L103.36 2.96 L102.57 3.40 L101.81 3.89 L101.09 4.43 L100.41 5.02 L99.76 5.65 L99.16 6.32 L98.60 7.03 L98.09 7.77 L97.64 8.54 L97.23 9.35 L96.88 10.18 L96.58 11.03 L96.34 11.90 L96.16 12.78 L96.03 13.67 L95.97 14.57 L95.96 15.47 L96.02 16.37 L96.13 17.27 L96.30 18.15 L96.53 19.02 L96.82 19.88 L97.16 20.71 L97.55 21.52 L98.00 22.30 L98.50 23.05 L99.05 23.77 L99.64 24.45 L100.28 25.08 L100.96 25.68 L101.68 26.22 L102.43 26.72 L103.21 27.17 L104.02 27.57 L104.85 27.91 L105.70 28.20 L106.57 28.42 L107.46 28.59 L108.35 28.71 L109.25 28.76 L110.15 28.75 L111.05 28.69 L111.94 28.56 L112.83 28.38 L113.69 28.14 L114.54 27.84 L115.37 27.49 L116.18 27.08 L116.95 26.62 L117.69 26.11 L118.40 25.55 L119.07 24.95 L119.70 24.30 L120.28 23.61 L120.82 22.89 L121.31 22.13 L121.74 21.35 L122.13 20.53", "M136.50 0.05 L149.47 27.99", "M163.90 0.05 L143.72 43.70"], "tag": "M2.700 54.007L2.700 54.421L0.500 54.421L0.500 56.286L2.357 56.286L2.357 56.700L0.500 56.700L0.500 59.000L0.000 59.000L0.000 54.007ZM11.236 57.814L8.964 57.814L8.529 59.000L8.000 59.000L9.821 54.071L10.386 54.071L12.200 59.000L11.671 59.000ZM11.086 57.400M10.100 54.700M9.114 57.400ZM18.000 57.714L18.529 57.714Q18.564 58.079 18.850 58.354Q19.136 58.629 19.686 58.629Q20.193 58.629 20.489 58.368Q20.786 58.107 20.786 57.707Q20.786 57.386 20.621 57.189Q20.457 56.993 20.214 56.896Q19.971 56.800 19.543 56.686Q19.043 56.550 18.750 56.421Q18.457 56.293 18.250 56.021Q18.043 55.750 18.043 55.286Q18.043 54.900 18.243 54.596Q18.443 54.293 18.807 54.121Q19.171 53.950 19.643 53.950Q20.336 53.950 20.761 54.289Q21.186 54.629 21.250 55.164L20.707 55.164Q20.657 54.857 20.371 54.618Q20.086 54.379 19.600 54.379Q19.150 54.379 18.850 54.618Q18.550 54.857 18.550 55.271Q18.550 55.586 18.714 55.779Q18.879 55.971 19.125 56.071Q19.371 56.171 19.793 56.286Q20.279 56.421 20.579 56.554Q20.879 56.686 21.086 56.957Q21.293 57.229 21.293 57.686Q21.293 58.036 21.107 58.350Q20.921 58.664 20.557 58.857Q20.193 59.050 19.686 59.050Q19.193 59.050 18.818 58.879Q18.443 58.707 18.229 58.400Q18.014 58.093 18.000 57.714ZM30.707 54.007L30.707 59.000L30.207 59.000L30.207 56.664L27.500 56.664L27.500 59.000L27.000 59.000L27.000 54.007L27.500 54.007L27.500 56.250L30.207 56.250L30.207 54.007ZM37.500 54.007L37.500 59.000L37.000 59.000L37.000 54.007ZM43.000 56.500Q43.000 55.764 43.325 55.182Q43.650 54.600 44.214 54.275Q44.779 53.950 45.471 53.950Q46.171 53.950 46.736 54.275Q47.300 54.600 47.621 55.182Q47.943 55.764 47.943 56.500Q47.943 57.236 47.621 57.818Q47.300 58.400 46.736 58.725Q46.171 59.050 45.471 59.050Q44.779 59.050 44.214 58.725Q43.650 58.400 43.325 57.818Q43.000 57.236 43.000 56.500ZM47.429 56.500Q47.429 55.864 47.171 55.386Q46.914 54.907 46.471 54.650Q46.029 54.393 45.471 54.393Q44.914 54.393 44.471 54.650Q44.029 54.907 43.771 55.386Q43.514 55.864 43.514 56.500Q43.514 57.136 43.771 57.618Q44.029 58.100 44.471 58.357Q44.914 58.614 45.471 58.614Q46.029 58.614 46.471 58.357Q46.914 58.100 47.171 57.618Q47.429 57.136 47.429 56.500ZM57.764 59.000L57.264 59.000L54.500 54.800L54.500 59.000L54.000 59.000L54.000 54.007L54.500 54.007L57.264 58.200L57.264 54.007L57.764 54.007ZM73.443 53.950Q74.279 53.950 74.875 54.346Q75.471 54.743 75.743 55.464L75.157 55.464Q74.943 54.957 74.504 54.671Q74.064 54.386 73.443 54.386Q72.893 54.386 72.454 54.643Q72.014 54.900 71.764 55.382Q71.514 55.864 71.514 56.500Q71.514 57.136 71.764 57.614Q72.014 58.093 72.454 58.350Q72.893 58.607 73.443 58.607Q74.064 58.607 74.504 58.325Q74.943 58.043 75.157 57.543L75.743 57.543Q75.471 58.257 74.871 58.650Q74.271 59.043 73.443 59.043Q72.757 59.043 72.200 58.718Q71.643 58.393 71.321 57.814Q71.000 57.236 71.000 56.500Q71.000 55.764 71.321 55.182Q71.643 54.600 72.200 54.275Q72.757 53.950 73.443 53.950ZM81.000 56.500Q81.000 55.764 81.325 55.182Q81.650 54.600 82.214 54.275Q82.779 53.950 83.471 53.950Q84.171 53.950 84.736 54.275Q85.300 54.600 85.621 55.182Q85.943 55.764 85.943 56.500Q85.943 57.236 85.621 57.818Q85.300 58.400 84.736 58.725Q84.171 59.050 83.471 59.050Q82.779 59.050 82.214 58.725Q81.650 58.400 81.325 57.818Q81.000 57.236 81.000 56.500ZM85.429 56.500Q85.429 55.864 85.171 55.386Q84.914 54.907 84.471 54.650Q84.029 54.393 83.471 54.393Q82.914 54.393 82.471 54.650Q82.029 54.907 81.771 55.386Q81.514 55.864 81.514 56.500Q81.514 57.136 81.771 57.618Q82.029 58.100 82.471 58.357Q82.914 58.614 83.471 58.614Q84.029 58.614 84.471 58.357Q84.914 58.100 85.171 57.618Q85.429 57.136 85.429 56.500ZM95.764 59.000L95.264 59.000L92.500 54.800L92.500 59.000L92.000 59.000L92.000 54.007L92.500 54.007L95.264 58.200L95.264 54.007L95.764 54.007ZM104.443 53.950Q105.279 53.950 105.875 54.346Q106.471 54.743 106.743 55.464L106.157 55.464Q105.943 54.957 105.504 54.671Q105.064 54.386 104.443 54.386Q103.893 54.386 103.454 54.643Q103.014 54.900 102.764 55.382Q102.514 55.864 102.514 56.500Q102.514 57.136 102.764 57.614Q103.014 58.093 103.454 58.350Q103.893 58.607 104.443 58.607Q105.064 58.607 105.504 58.325Q105.943 58.043 106.157 57.543L106.743 57.543Q106.471 58.257 105.871 58.650Q105.271 59.043 104.443 59.043Q103.757 59.043 103.200 58.718Q102.643 58.393 102.321 57.814Q102.000 57.236 102.000 56.500Q102.000 55.764 102.321 55.182Q102.643 54.600 103.200 54.275Q103.757 53.950 104.443 53.950ZM112.500 54.414L112.500 56.279L114.393 56.279L114.393 56.693L112.500 56.693L112.500 58.586L114.607 58.586L114.607 59.000L112.000 59.000L112.000 54.000L114.607 54.000L114.607 54.414ZM122.507 56.871L121.500 56.871L121.500 59.000L121.000 59.000L121.000 54.007L122.507 54.007Q123.343 54.007 123.768 54.400Q124.193 54.793 124.193 55.443Q124.193 56.086 123.771 56.479Q123.350 56.871 122.507 56.871ZM123.679 55.443Q123.679 54.943 123.400 54.686Q123.121 54.429 122.507 54.429L121.500 54.429L121.500 56.443L122.507 56.443Q123.679 56.443 123.679 55.443ZM132.279 54.007L132.279 54.421L130.893 54.421L130.893 59.000L130.393 59.000L130.393 54.421L129.000 54.421L129.000 54.007ZM145.000 57.714L145.529 57.714Q145.564 58.079 145.850 58.354Q146.136 58.629 146.686 58.629Q147.193 58.629 147.489 58.368Q147.786 58.107 147.786 57.707Q147.786 57.386 147.621 57.189Q147.457 56.993 147.214 56.896Q146.971 56.800 146.543 56.686Q146.043 56.550 145.750 56.421Q145.457 56.293 145.250 56.021Q145.043 55.750 145.043 55.286Q145.043 54.900 145.243 54.596Q145.443 54.293 145.807 54.121Q146.171 53.950 146.643 53.950Q147.336 53.950 147.761 54.289Q148.186 54.629 148.250 55.164L147.707 55.164Q147.657 54.857 147.371 54.618Q147.086 54.379 146.600 54.379Q146.150 54.379 145.850 54.618Q145.550 54.857 145.550 55.271Q145.550 55.586 145.714 55.779Q145.879 55.971 146.125 56.071Q146.371 56.171 146.793 56.286Q147.279 56.421 147.579 56.554Q147.879 56.686 148.086 56.957Q148.293 57.229 148.293 57.686Q148.293 58.036 148.107 58.350Q147.921 58.664 147.557 58.857Q147.193 59.050 146.686 59.050Q146.193 59.050 145.818 58.879Q145.443 58.707 145.229 58.400Q145.014 58.093 145.000 57.714ZM156.279 54.007L156.279 54.421L154.893 54.421L154.893 59.000L154.393 59.000L154.393 54.421L153.000 54.421L153.000 54.007ZM162.000 56.500Q162.000 55.764 162.325 55.182Q162.650 54.600 163.214 54.275Q163.779 53.950 164.471 53.950Q165.171 53.950 165.736 54.275Q166.300 54.600 166.621 55.182Q166.943 55.764 166.943 56.500Q166.943 57.236 166.621 57.818Q166.300 58.400 165.736 58.725Q165.171 59.050 164.471 59.050Q163.779 59.050 163.214 58.725Q162.650 58.400 162.325 57.818Q162.000 57.236 162.000 56.500ZM166.429 56.500Q166.429 55.864 166.171 55.386Q165.914 54.907 165.471 54.650Q165.029 54.393 164.471 54.393Q163.914 54.393 163.471 54.650Q163.029 54.907 162.771 55.386Q162.514 55.864 162.514 56.500Q162.514 57.136 162.771 57.618Q163.029 58.100 163.471 58.357Q163.914 58.614 164.471 58.614Q165.029 58.614 165.471 58.357Q165.914 58.100 166.171 57.618Q166.429 57.136 166.429 56.500ZM175.657 59.000M174.421 56.914L173.500 56.914L173.500 59.000L173.000 59.000L173.000 54.007L174.500 54.007Q175.336 54.007 175.768 54.407Q176.200 54.807 176.200 55.457Q176.200 56.000 175.889 56.382Q175.579 56.764 174.971 56.879L176.257 59.000ZM173.500 56.507L174.507 56.507Q175.093 56.507 175.389 56.221Q175.686 55.936 175.686 55.457Q175.686 54.964 175.400 54.696Q175.114 54.429 174.500 54.429L173.500 54.429ZM182.500 54.414L182.500 56.279L184.393 56.279L184.393 56.693L182.500 56.693L182.500 58.586L184.607 58.586L184.607 59.000L182.000 59.000L182.000 54.000L184.607 54.000L184.607 54.414Z", "w": 3.1};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const NB = ' ';
  const ty = (t) => String(t).replace(/(^|[\s(„])([vszkouaiVSZKOUAI]) /g, '$1$2' + NB).replace(/(\d) (Kč|cm|%|ks|dny|dnů|dní|h|min)/g, '$1' + NB + '$2');
  const money = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, NB) + NB + 'Kč';
  const plural = (n, one, few, many) => `${n}${NB}${n === 1 ? one : (n >= 2 && n <= 4 ? few : many)}`;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const mob = () => window.innerWidth < 900;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
    sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset(k, v) { try { if (v == null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };
  GX.u = { $, $$, esc, money, store, reduce, fine, mob, NB, ty, plural };
  GX.typo = (root = document.body) => {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement && /^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(n.parentElement.tagName)) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const list = []; while (w.nextNode()) list.push(w.currentNode);
    list.forEach((n) => { const t = ty(n.nodeValue); if (t !== n.nodeValue) n.nodeValue = t; });
  };

  /* ---------- data ---------- */
  const byId = {};
  GX.products.forEach((p) => {
    byId[p.id] = p;
    p.v.forEach((v) => { if (v.ib) { const [n, sl] = v.ib.split('|'); v.img = v.img.map((x) => (x[0] === '~' ? `${n}-${x.slice(1)}_${sl}.jpg` : x)); } });
  });
  GX.hqset = new Set(GX.hq);
  GX.fresh = new Set((GX.order.novinky || []).slice(0, 12)); // štítek Novinka jen u posledního pátečního dropu
  GX.p = (id) => byId[id];
  GX.v = (p, vid) => p.v.find((x) => x.id === vid) || p.v[0];
  GX.price = (p, v) => (v && v.price) || p.price;
  GX.minPrice = (p) => Math.min(...p.v.map((v) => GX.price(p, v)));
  // jen velikosti, které v dané barvě opravdu existují (obchod jiné neukazuje)
  GX.sizes = (p, v) => (p.voucher ? [] : p.sizes.filter((s) => v.stock && s in v.stock).map((s) => ({ s, ok: v.stock[s] === 'in', eu: p.eu && p.eu[s] })));
  GX.fitOf = (p, v) => (v && v.fit) || p.fit || null;
  GX.measOf = (p, v) => (v && v.meas) || p.meas || '';
  GX.inCat = (k) => (GX.order[k] || []).map(GX.p).filter(Boolean);
  GX.catName = (k) => (GX.cats[k] || {}).l || k;
  GX.isNew = (p) => p.v.some((v) => v.new);
  GX.href = (p, v) => `produkt.html?p=${p.id}${v && p.v.length > 1 ? '&c=' + encodeURIComponent(v.id) : ''}`;
  GX.src = (p, v, i = 0) => {
    const n = v.img[i]; if (!n) return '';
    const key = `${p.id}--${v.id}--${i}`;
    return GX.hqset.has(key) ? `assets/img/hq/${key}.webp` : GX.cdn + n;
  };
  GX.lo = (p, v) => `assets/img/t/${p.id}--${v.id}.webp`;
  GX.pic = (p, v, i = 0, o = {}) => {
    const hi = GX.src(p, v, i); const lo = (i === 0 || o.lo) ? GX.lo(p, v) : '';
    const alt = o.alt != null ? o.alt : `${p.name}, ${v.label}`;
    const lz = o.eager ? ' fetchpriority="high"' : ' loading="lazy"';
    return `<span class="pic${o.cls ? ' ' + o.cls : ''}"${o.style ? ` style="${o.style}"` : ''}>${lo ? `<img class="pic__lo" src="${lo}" alt="" aria-hidden="true"${o.eager ? '' : ' loading="lazy"'} decoding="async">` : ''}<img class="pic__hi" src="${hi}" alt="${esc(alt)}"${lz} decoding="async"${o.pos ? ` style="object-position:${o.pos}"` : ''}></span>`;
  };
  GX.catPic = (k, o = {}) => {
    const c = GX.cats[k]; const ref = c && c.pic; let p, v, i = 0;
    if (ref) { p = GX.p(ref[0]); v = p && GX.v(p, ref[1]); i = ref[2] || 0; }
    if (!p) { p = GX.inCat(k)[0]; v = p && p.v[0]; i = 0; }
    if (!p) return '';
    return GX.pic(p, v, i, Object.assign({ alt: c ? c.l : '', lo: true }, o));
  };
  GX.picSrc = (src, alt = '', o = {}) => `<span class="pic${o.cls ? ' ' + o.cls : ''}"><img class="pic__hi" src="${src}" alt="${esc(alt)}"${o.eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"${o.pos ? ` style="object-position:${o.pos}"` : ''}></span>`;
  document.addEventListener('load', (e) => {
    const t = e.target; if (!t || t.tagName !== 'IMG') return;
    if (t.classList.contains('pic__hi') && t.parentElement) t.parentElement.classList.add('is-ld');
    if (t.classList.contains('pc__alt')) t.classList.add('is-ld');
  }, true);
  document.addEventListener('error', (e) => {
    const t = e.target; if (!t || t.tagName !== 'IMG') return;
    if (t.classList.contains('pic__hi') && t.parentElement) {
      const pic = t.parentElement; pic.classList.add('is-err');
      if (!pic.querySelector('.pic__lo')) pic.classList.add('is-none');
      document.dispatchEvent(new CustomEvent('gx:imgerr', { detail: pic }));
    }
    if (t.classList.contains('pc__alt')) t.remove();
  }, true);
  GX.pics = (root = document) => $$('.pic__hi', root).forEach((img) => { if (img.complete && img.naturalWidth) img.parentElement.classList.add('is-ld'); });

  const ICON = {
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 5.5l13 13M18.5 5.5l-13 13"/></svg>',
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 5.5 6.5 6.5-6.5 6.5"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.2-4.5-7.2-10.1A4.1 4.1 0 0 1 12 7.3a4.1 4.1 0 0 1 7.2 2.6C19.2 15.5 12 20 12 20Z"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3"/><path d="m15.5 15.5 4.5 4.5"/></svg>',
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 8.5h13l-.9 12h-11.2l-.9-12Z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 9h17M3.5 15h17"/></svg>',
    filter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>',
    pause: '<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="1.5" y="1" width="3" height="10"/><rect x="7.5" y="1" width="3" height="10"/></svg>',
    play: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 1v10l8.5-5z"/></svg>',
    g1: '<svg viewBox="0 0 18 18" aria-hidden="true"><rect x="3" y="2" width="12" height="14"/></svg>',
    g2: '<svg viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="2" width="6" height="14"/><rect x="10" y="2" width="6" height="14"/></svg>',
    g3: '<svg viewBox="0 0 18 18" aria-hidden="true"><rect x="1" y="2" width="4" height="14"/><rect x="7" y="2" width="4" height="14"/><rect x="13" y="2" width="4" height="14"/></svg>',
    g4: '<svg viewBox="0 0 18 18" aria-hidden="true"><rect x="0.5" y="3" width="3.5" height="12"/><rect x="5" y="3" width="3.5" height="12"/><rect x="9.5" y="3" width="3.5" height="12"/><rect x="14" y="3" width="3.5" height="12"/></svg>'
  };
  GX.ICON = ICON;

  /* ---------- logo ---------- */
  GX.logoSVG = (cls = '') => `<svg class="mark ${cls}" viewBox="0 0 185 59" role="img" aria-label="GREY · fashion concept store"><g>${GX.LOGO.strokes.map((d, i) => `<path class="st" data-i="${i}" d="${d}"/>`).join('')}</g><path class="tag" d="${GX.LOGO.tag}"/></svg>`;
  GX.drawLogo = (svg, delay = 0) => {
    if (!svg || reduce || !svg.animate) return Promise.resolve();
    const paths = $$('.st', svg);
    const plan = [[0, 0, 520], [1, 340, 460], [2, 640, 250], [3, 780, 290], [4, 900, 500], [5, 1220, 230], [6, 1300, 290]];
    svg.classList.add('is-drawing');
    const lens = paths.map((p) => { const L = p.getTotalLength() + 0.5; p.style.strokeDasharray = `${L} ${L}`; p.style.strokeDashoffset = L; return L; });
    const anims = plan.map(([i, d, dur]) => paths[i].animate([{ strokeDashoffset: lens[i] }, { strokeDashoffset: 0 }], { duration: dur, delay: delay + d, easing: 'cubic-bezier(.55,.05,.35,1)', fill: 'both' }));
    setTimeout(() => svg.classList.remove('is-drawing'), delay + 1500);
    return Promise.all(anims.map((a) => a.finished)).then(() => {
      anims.forEach((a) => { try { a.cancel(); } catch (e) { /* ignore */ } });
      paths.forEach((p) => { p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; });
    }).catch(() => {});
  };

  /* ---------- páteční kolekce ---------- */
  GX.drop = {
    next(now = new Date()) {
      const d = new Date(now); d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7)); d.setHours(19, 0, 0, 0);
      if (d <= now) d.setDate(d.getDate() + 7);
      return d;
    },
    live(now = new Date()) { return now.getDay() === 5 && now.getHours() >= 19; },
    parts(now = new Date()) { const m = Math.max(0, Math.floor((GX.drop.next(now) - now) / 60000)); return { d: Math.floor(m / 1440), h: Math.floor((m % 1440) / 60), m: m % 60 }; },
    left(now = new Date()) { const { d, h, m } = GX.drop.parts(now); return d > 0 ? `za ${d}${NB}d ${h}${NB}h` : (h > 0 ? `za ${h}${NB}h ${m}${NB}min` : `za ${m}${NB}min`); },
    label() { return GX.drop.live() ? 'Nová kolekce je venku · od 19:00' : `Další kolekce v pátek v 19:00 · ${GX.drop.left()}`; },
    ics() {
      const n = GX.drop.next(); const p = (x) => String(x).padStart(2, '0');
      const dt = `${n.getFullYear()}${p(n.getMonth() + 1)}${p(n.getDate())}T190000`;
      const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//GREY navrh//CS', 'BEGIN:VEVENT', 'UID:grey-patek-' + dt + '@navrh', 'DTSTAMP:' + dt, 'DTSTART;TZID=Europe/Prague:' + dt, 'DURATION:PT30M', 'RRULE:FREQ=WEEKLY;BYDAY=FR', 'SUMMARY:GREY · nová kolekce v 19:00', 'DESCRIPTION:Nové kousky na greystore.cz.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' })); a.download = 'grey-patek-19h.ics';
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 600);
      GX.toast('Pátek v 19:00 je v kalendáři.');
    }
  };

  /* ---------- Sedne mi to? · běžná velikost + jak to máte rádi ---------- */
  // orientační tělesné míry podle běžné evropské tabulky dámských velikostí (obvod hrudníku c, pasu w v cm)
  const BODY = { XXS: { c: 78, w: 60 }, XS: { c: 82, w: 64 }, S: { c: 86, w: 68 }, M: { c: 90, w: 72 }, L: { c: 96, w: 78 }, XL: { c: 102, w: 84 }, XXL: { c: 108, w: 90 } };
  const ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const ZT = [['tesne', 'těsně'], ['prilehave', 'přiléhavě'], ['akorat', 'akorát'], ['volne', 'volně'], ['oversized', 'oversized']];
  const ZP = [['tesne', 'těsně'], ['akorat', 'akorát'], ['volne', 'volněji'], ['velke', 'velké']];
  GX.size = {
    LIST: ['XS', 'S', 'M', 'L', 'XL'],
    PREFS: [['prilehave', 'Přiléhavě'], ['akorat', 'Akorát'], ['volne', 'Volně']],
    get() { return store.get('gx3-size', null); },
    set(o) { const cur = GX.size.get() || { p: 'akorat' }; store.set('gx3-size', Object.assign(cur, o)); GX.size._c = {}; document.dispatchEvent(new CustomEvent('gx:size')); },
    clear() { store.set('gx3-size', null); GX.size._c = {}; document.dispatchEvent(new CustomEvent('gx:size')); },
    _c: {},
    short(label) { return String(label).replace(/^one size\s*/i, '') || label; },
    // pokrývá štítek velikosti produktu běžnou velikost zákaznice? („S/M“ pokrývá S i M, „one size“ všechno)
    covers(label, me) {
      const L = label.toUpperCase().replace('ONE SIZE', '').trim();
      if (!L) return true;
      return L.split('/').map((x) => x.trim()).includes(me);
    },
    assess(p, v, prof) {
      prof = prof || GX.size.get(); if (!prof || !prof.s) return null;
      const key = `${p.id}|${v.id}|${prof.s}|${prof.p}`; if (key in GX.size._c) return GX.size._c[key];
      const f = GX.fitOf(p, v); let res = null;
      if (f && BODY[prof.s]) {
        const body = BODY[prof.s]; const stretch = /elastan|lycra|lykra|spandex/i.test(p.material || '');
        const isTop = f.type === 'top';
        const rows = GX.sizes(p, v).map(({ s, ok }) => {
          const m = isTop ? (f.w && f.w[s]) : (f.waist && f.waist[s]); if (m == null) return null;
          let e, z;
          if (isTop) {
            e = 2 * m - body.c; const sh = stretch ? -6 : 0;
            z = e < -2 + sh ? 'tesne' : (e < 4 + sh ? 'prilehave' : (e < 12 ? 'akorat' : (e < 24 ? 'volne' : 'oversized')));
          } else {
            if (Array.isArray(m)) { const lo = 2 * m[0], hi = 2 * m[1]; e = body.w < lo ? lo - body.w : (body.w > hi ? hi - body.w : 0); }
            else e = 2 * m - body.w;
            z = e < -2 ? 'tesne' : (e <= 4 ? 'akorat' : (e <= 10 ? 'volne' : 'velke'));
          }
          // poloha na stupnici 0–1
          const x = isTop ? Math.max(0, Math.min(1, (e + 8) / 60)) : Math.max(0, Math.min(1, (e + 8) / 26));
          return { s, ok, e, z, x };
        }).filter(Boolean);
        if (rows.length) {
          const idx = (r) => rows.indexOf(r);
          let base = rows.find((r) => r.s.toUpperCase() === prof.s) || rows.find((r) => GX.size.covers(r.s, prof.s));
          if (!base) {
            const target = isTop ? 10 : 1;
            base = rows.slice().sort((a, b) => Math.abs(a.e - target) - Math.abs(b.e - target))[0];
          }
          let rec = base;
          const up = rows[idx(base) + 1], dn = rows[idx(base) - 1];
          if (rec.z === 'tesne' && up) rec = up;
          else if (isTop && prof.p === 'volne' && (rec.z === 'prilehave' || rec.z === 'akorat') && up && up.z !== 'oversized') rec = up;
          else if (isTop && prof.p === 'prilehave' && (rec.z === 'volne' || rec.z === 'oversized') && dn && dn.z !== 'tesne') rec = dn;
          else if (!isTop && rec.z === 'velke' && dn && dn.z !== 'tesne') rec = dn;
          if (!rec.ok) { const alt = [rec === base ? null : base, up, dn].find((r) => r && r.ok && r.z !== 'tesne'); if (alt) rec = alt; }
          const lab = (z) => (isTop ? ZT : ZP).find((x) => x[0] === z) || ['', z];
          const ovs = /oversized|boxy|volný|volnější/i.test(p.desc || '');
          let text;
          if (isTop) text = rec.z === 'oversized' ? (ovs ? 'Sedne oversized, tak je střih myšlený.' : 'Sedne hodně volně, oversized.') : (rec.z === 'volne' ? 'Sedne volně.' : (rec.z === 'akorat' ? 'Sedne akorát.' : (rec.z === 'prilehave' ? (stretch ? 'Sedne přiléhavě, materiál je pružný.' : 'Sedne přiléhavě.') : 'Bude těsné.')));
          else text = rec.z === 'akorat' ? 'V pase sedne akorát.' : (rec.z === 'volne' ? 'V pase bude volnější.' : (rec.z === 'velke' ? 'V pase bude velké.' : 'V pase bude těsné.'));
          const det = (r) => { const m = isTop ? f.w[r.s] : f.waist[r.s]; return isTop ? `šířka naplocho ${m}${NB}cm` : `pas naplocho ${Array.isArray(m) ? m.join('–') + NB + 'cm s gumou' : m + NB + 'cm'}`; };
          rows.forEach((r) => { r.detail = det(r); });
          const exact = GX.sizes(p, v).some((x) => x.s.toUpperCase() === prof.s || GX.size.covers(x.s, prof.s));
          const detail = det(rec).replace(/^./, (c) => c.toUpperCase());
          res = { type: isTop ? 'top' : 'pants', rows, rec, base, text, detail, zones: (isTop ? ZT : ZP).map((x) => x[1]), zone: lab(rec.z)[1], stretch, ovs, exact };
        }
      }
      GX.size._c[key] = res; return res;
    },
    // krátké „jak sedne“ pro libovolnou velikost řádku (bez shody rodu: „S: sedne volně“)
    say(a, r) {
      if (!a || !r) return '';
      if (a.type === 'top') return r.z === 'oversized' ? (a.ovs ? 'oversized, tak je střih myšlený' : 'hodně volné, oversized') : (r.z === 'volne' ? 'sedne volně' : (r.z === 'akorat' ? 'sedne akorát' : (r.z === 'prilehave' ? (a.stretch ? 'sedne přiléhavě, materiál je pružný' : 'sedne přiléhavě') : 'bude těsné')));
      return r.z === 'akorat' ? 'v pase akorát' : (r.z === 'volne' ? 'v pase volnější' : (r.z === 'velke' ? 'v pase velké' : 'v pase těsné'));
    },
    // výběr velikosti na dvě klepnutí (sdílené na úvodu i v detailu)
    picker(prof, o = {}) {
      prof = prof || {};
      return `<div class="szp${o.cls ? ' ' + o.cls : ''}"><div class="szp__row" role="group" aria-label="Jakou velikost běžně nosíte?"><span class="szp__q">${o.q || 'Běžně nosím'}</span><div class="szp__opts">${GX.size.LIST.map((x) => `<button type="button" class="szp__b" data-me="${x}" aria-pressed="${prof.s === x}">${x}</button>`).join('')}</div></div>
        <div class="szp__row" role="group" aria-label="Jak to nosíte raději?"><span class="szp__q">${o.q2 || 'Nosím raději'}</span><div class="szp__opts">${GX.size.PREFS.map(([k, l]) => `<button type="button" class="szp__b szp__b--w" data-pref="${k}" aria-pressed="${(prof.p || 'akorat') === k}">${l}</button>`).join('')}</div></div></div>`;
    },
    // stupnice od „těsněji“ po „volněji“: kde na ní leží jednotlivé velikosti produktu
    scale(a) {
      if (!a) return '';
      const xs = a.rows.map((r) => 5 + r.x * 90);
      for (let i = 1; i < xs.length; i++) xs[i] = Math.max(xs[i], xs[i - 1] + 9);
      const over = xs.length ? xs[xs.length - 1] - 95 : 0;
      if (over > 0) for (let i = xs.length - 1; i >= 0; i--) xs[i] = i === xs.length - 1 ? 95 : Math.min(xs[i], xs[i + 1] - 9);
      return `<div class="fsc" aria-hidden="true"><div class="fsc__bar">${a.rows.map((r, i) => `<span class="fsc__m${r === a.rec ? ' is-rec' : ''}${r.ok ? '' : ' is-out'}" style="--x:${Math.max(3, xs[i]).toFixed(1)}%"><i></i><em>${esc(r.s.replace(/^one size\s*/i, ''))}</em></span>`).join('')}</div><div class="fsc__z"><span>těsněji</span><span>volněji</span></div></div>`;
    }
  };

  /* ---------- oblíbené ---------- */
  GX.fav = {
    list() { return store.get('gx2-fav', []); },
    has(pid) { return GX.fav.list().includes(pid); },
    toggle(pid) {
      const f = GX.fav.list(); const i = f.indexOf(pid); if (i > -1) f.splice(i, 1); else f.push(pid); store.set('gx2-fav', f);
      $$(`[data-fav-p="${pid}"]`).forEach((b) => b.setAttribute('aria-pressed', i < 0));
      $$('[data-fav-n]').forEach((el) => { el.textContent = `(${f.length})`; });
      GX.toast(i < 0 ? '✓ Uloženo do oblíbených' : 'Odebráno z oblíbených', i < 0 ? { label: `Oblíbené (${f.length})`, fn: () => GX.go('kategorie.html?k=oblibene') } : null);
      return i < 0;
    }
  };

  /* ---------- naposledy prohlížené ---------- */
  GX.recent = {
    list() { return store.get('gx2-recent', []).map((x) => ({ p: GX.p(x[0]), v: x[1] })).filter((x) => x.p); },
    push(pid, vid) { const r = store.get('gx2-recent', []).filter((x) => x[0] !== pid); r.unshift([pid, vid]); store.set('gx2-recent', r.slice(0, 12)); }
  };

  /* ---------- košík (ukázkový) ---------- */
  const cart = {
    items: store.get('gx2-cart', []).filter((i) => GX.p(i.pid)),
    last: null,
    save() { store.set('gx2-cart', cart.items); cart.render(); document.dispatchEvent(new CustomEvent('gx:cart')); },
    count() { return cart.items.reduce((a, i) => a + i.q, 0); },
    total() { return cart.items.reduce((a, i) => a + i.q * i.price, 0); },
    has(pid, vid, size) { return cart.items.some((i) => i.pid === pid && i.vid === vid && (size == null || i.size === size)); },
    add(pid, vid, size, q = 1) {
      const p = GX.p(pid), v = GX.v(p, vid);
      const ex = cart.items.find((i) => i.pid === pid && i.vid === v.id && i.size === size);
      if (ex) ex.q += q; else cart.items.push({ pid, vid: v.id, size, q, price: GX.price(p, v) });
      cart.last = `${pid}|${v.id}|${size}`;
      cart.save();
      $$('[data-cart-n]').forEach((el) => { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); });
    },
    render() {
      const n = cart.count();
      $$('[data-cart-n]').forEach((el) => { el.dataset.n = n; el.textContent = el.dataset.style === 'paren' ? `(${n})` : n; });
      const bd = $('#drw-bd'); if (!bd) return;
      $('#drw-ttl').textContent = `Košík (${n})`;
      if (!cart.items.length) {
        bd.innerHTML = `<div class="drw__empty"><p>Košík je zatím prázdný.</p><a class="lnk" href="kategorie.html?k=novinky">Prohlédnout novinky</a></div>${xsell()}`;
        $('#drw-ft').hidden = true; return;
      }
      $('#drw-ft').hidden = false;
      bd.innerHTML = (cart.flash ? `<p class="added">${ICON.check}<span>Přidáno do košíku</span></p>` : '') + cart.items.map((i, k) => {
        const p = GX.p(i.pid), v = GX.v(p, i.vid); const isNew = cart.flash && cart.last === `${i.pid}|${i.vid}|${i.size}`;
        return `<div class="ci${isNew ? ' is-new' : ''}">
          <a class="ci__img" href="${GX.href(p, v)}">${GX.pic(p, v, 0, { cls: 'r23', alt: '' })}</a>
          <div><div class="ci__top"><a href="${GX.href(p, v)}">${esc(ty(p.name))}</a><b class="num">${money(i.price * i.q)}</b></div>
            <div class="ci__meta">${p.voucher ? 'Hodnota ' + esc(v.label) : `${esc(v.label)}${i.size ? ' · ' + esc(i.size) : ''}`}${i.q > 1 ? ` · ${i.q}${NB}×${NB}${money(i.price)}` : ''}</div>
            <div class="ci__row"><div class="qty"><button type="button" data-q="-1" data-k="${k}" aria-label="Ubrat kus">−</button><span class="num">${i.q}</span><button type="button" data-q="1" data-k="${k}" aria-label="Přidat kus">+</button></div><button class="ci__rm" type="button" data-rm="${k}">Odebrat</button></div></div></div>`;
      }).join('') + xsell();
      $('#drw-sum').textContent = money(cart.total());
      cart.flash = false;
    }
  };
  const xsell = () => {
    const inCart = new Set(cart.items.map((i) => i.pid));
    const ids = ['silonky-70-den', 'kozeny-pasek-se-zlatou-sponou', 'kozene-vyteplene-rukavice', 'sal-s-podilem-vlny', 'kozeny-semisovy-croco-pasek'].filter((id) => GX.p(id) && !inCart.has(id)).slice(0, 3);
    if (!ids.length) return '';
    return `<div class="xsell"><h3 class="cap">Hodí se ke všemu</h3><div class="xsell__row">${ids.map((id) => { const p = GX.p(id), v = p.v[0]; return `<a href="${GX.href(p, v)}">${GX.pic(p, v, 0, { alt: '' })}${esc(ty(p.name))}<b class="num">${money(GX.price(p, v))}</b></a>`; }).join('')}</div></div>`;
  };
  GX.cart = cart;

  GX.toast = (msg, action) => {
    const t = $('#toast'); if (!t) return;
    $('#toast-msg').textContent = msg;
    const b = $('#toast-btn');
    if (action) { b.hidden = false; b.textContent = action.label; b.onclick = () => { hide(); action.fn(); }; } else b.hidden = true;
    t.classList.add('is-on'); clearTimeout(GX._tt); GX._tt = setTimeout(hide, 4200);
    function hide() { t.classList.remove('is-on'); }
  };
  // po přidání: tlačítko se změní slovy a otevře se košík s novou položkou
  GX.added = (pid, vid, size, o = {}) => {
    if (o.open === false) { const p = GX.p(pid); GX.toast(`✓ V košíku · ${p.name}${size ? ' · ' + size : ''}`, { label: `Zobrazit košík (${cart.count()})`, fn: () => GX.openCart() }); return; }
    cart.flash = true; cart.render(); GX.openCart(true);
  };

  /* ---------- overlays ---------- */
  let lastFocus = null;
  const lock = (on) => { document.documentElement.style.overflow = on ? 'hidden' : ''; };
  GX.open = (sel, o = {}) => {
    GX.closeAll(true);
    lastFocus = document.activeElement;
    const el = $(sel); el.classList.add('is-on'); el.setAttribute('aria-hidden', 'false');
    if (o.scrim !== false) $('#scrim').classList.add('is-on');
    lock(true);
    setTimeout(() => { const f = el.querySelector(o.focus || '[data-close]'); f && f.focus({ preventScroll: true }); }, 60);
  };
  GX.openCart = (keep) => { if (keep !== true) cart.render(); GX.open('#drw', { focus: '#drw-close' }); };
  GX.closeAll = (silent) => {
    $$('.panel.is-on').forEach((p) => { p.classList.remove('is-on'); p.setAttribute('aria-hidden', 'true'); });
    $('#scrim') && $('#scrim').classList.remove('is-on');
    lock(false);
    if (!silent && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  };

  /* ---------- karta produktu ---------- */
  const swatches = (p, cur, cls = '', max = 6) => {
    if (p.v.length < 2 || p.voucher) return '';
    const vs = p.v.slice(0, max);
    return `<div class="sws ${cls}" role="group" aria-label="Barvy">${vs.map((v) => `<button class="sw" type="button" data-sw="${esc(v.id)}" aria-pressed="${v.id === cur.id}" aria-label="Barva ${esc(v.label)}" title="${esc(v.label)}"><i style="background:${v.sw}"></i></button>`).join('')}</div>`;
  };
  GX.swatches = swatches;
  GX.priceHTML = (p, v) => {
    const pr = GX.price(p, v);
    if (v.std) return `<span class="num is-sale"><s>${money(v.std)}</s>${money(pr)}</span>`;
    return `<span class="num">${p.voucher && p.v.length > 1 ? 'od ' : ''}${money(pr)}</span>`;
  };
  const qaSizes = (p, v) => {
    if (p.voucher) return p.v.map((x) => `<button type="button" data-add="" data-vv="${esc(x.id)}">${money(GX.price(p, x))}</button>`).join('');
    const a = GX.size.assess(p, v); const rec = a && a.rec.ok && GX.sizes(p, v).length > 1 ? a.rec.s : null;
    return GX.sizes(p, v).map(({ s, ok }) => `<button type="button" data-add="${esc(s)}" ${ok ? '' : 'disabled'} class="${s === rec ? 'is-rec' : ''}" aria-label="${esc(s)}${ok ? '' : ', vyprodáno'}${s === rec ? ', doporučujeme pro vás' : ''}">${esc(s)}</button>`).join('');
  };
  GX.card = (p, vid, o = {}) => {
    const v = GX.v(p, vid);
    const href = GX.href(p, v);
    const flag = v.std ? `<span class="pc__flag pc__flag--sale">${esc(v.sale || 'Sleva')}</span>` : (o.noNew || !GX.fresh.has(p.id) ? '' : '<span class="pc__flag">Novinka</span>');
    const nClr = p.v.length;
    const clrTxt = p.voucher ? `${nClr} hodnoty` : (nClr > 1 ? (nClr > 6 ? `+${nClr - 6}` : '') : esc(v.label));
    const one = GX.sizes(p, v).length === 1;
    return `<article class="pc${o.rv ? ' rv' : ''}" data-p="${p.id}" data-v="${esc(v.id)}">
      <div class="pc__mw"><a class="pc__m" href="${href}" data-flip aria-label="${esc(p.name)}, ${esc(v.label)}">${GX.pic(p, v, 0, { eager: o.eager })}${v.img[1] ? `<img class="pc__alt" data-src="${GX.src(p, v, 1)}" alt="" aria-hidden="true" decoding="async">` : ''}</a>
        ${flag}<button class="pc__fav" type="button" data-fav data-fav-p="${p.id}" aria-pressed="${GX.fav.has(p.id)}" aria-label="Uložit do oblíbených: ${esc(p.name)}">${ICON.heart}</button>
        <div class="pc__qa"><div class="pc__qa-t"><span>${p.voucher ? 'Vyberte hodnotu' : (one ? 'Rychlé přidání' : (GX.size.assess(p, v) ? 'Podtržená sedne vám' : 'Vyberte velikost'))}</span><button type="button" data-qv>Rychlý náhled</button></div><div class="pc__qa-s">${qaSizes(p, v)}</div>
          <div class="pc__qa-d"><span data-done></span><button type="button" data-open-cart></button></div></div>
        <button class="pc__plus" type="button" data-plus aria-label="Přidat do košíku: ${esc(p.name)}">${ICON.plus}</button></div>
      <div class="pc__i"><h3 class="pc__n"><a href="${href}" data-flip>${esc(ty(p.name))}</a></h3><span class="pc__p" data-price>${GX.priceHTML(p, v)}</span>
        <div class="pc__meta">${swatches(p, v)}<span class="pc__clr" data-clr>${clrTxt}</span></div></div>
    </article>`;
  };
  const setCardVariant = (card, vid) => {
    const p = GX.p(card.dataset.p), v = GX.v(p, vid);
    if (card.dataset.v === v.id) return;
    card.dataset.v = v.id;
    const m = $('.pc__m', card);
    const old = $('.pic', m); old.insertAdjacentHTML('afterend', GX.pic(p, v, 0)); old.remove();
    const alt = $('.pc__alt', m); if (alt) alt.remove();
    if (v.img[1]) m.insertAdjacentHTML('beforeend', `<img class="pc__alt" data-src="${GX.src(p, v, 1)}" alt="" aria-hidden="true" decoding="async">`);
    GX.pics(m);
    const href = GX.href(p, v); $$('a[data-flip]', card).forEach((a) => { a.href = href; });
    $('[data-price]', card).innerHTML = GX.priceHTML(p, v);
    $$('.sw', card).forEach((b) => b.setAttribute('aria-pressed', b.dataset.sw === v.id));
    const qa = $('.pc__qa', card); qa.classList.remove('is-done'); $('.pc__qa-s', card).innerHTML = qaSizes(p, v);
    const plus = $('[data-plus]', card); plus.classList.remove('is-done'); plus.innerHTML = ICON.plus;
  };
  const markDone = (card, label) => {
    const qa = card && $('.pc__qa', card); if (!qa) return;
    qa.classList.add('is-done');
    $('[data-done]', card).textContent = `✓ V košíku${label ? ' · ' + label : ''}`;
    $('[data-open-cart]', card).textContent = `Zobrazit košík (${cart.count()})`;
    const plus = $('[data-plus]', card); plus.classList.add('is-done'); plus.innerHTML = ICON.check; plus.setAttribute('aria-label', `V košíku${label ? ' · ' + label : ''}`);
  };
  GX.markCard = markDone;
  // obrázek z karty doletí na místo v detailu (FLIP přes dvě stránky)
  GX.flipFrom = (card) => {
    const pic = $('.pc__m .pic', card); if (!pic) return;
    const hi = $('.pic__hi', pic); const lo = $('.pic__lo', pic);
    const src = pic.classList.contains('is-ld') ? hi.getAttribute('src') : (lo ? lo.getAttribute('src') : hi.getAttribute('src'));
    const r = pic.getBoundingClientRect();
    store.sset('gx2-flip', JSON.stringify({ src, x: r.left, y: r.top, w: r.width, h: r.height, p: card.dataset.p, v: card.dataset.v }));
    if (reduce) return;
    const c = document.createElement('div'); c.className = 'flipc';
    c.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;z-index:101;overflow:hidden;background:var(--paper-2);pointer-events:none`;
    c.innerHTML = `<img src="${src}" alt="" style="width:100%;height:100%;object-fit:cover">`;
    document.body.appendChild(c);
  };
  GX.bindCards = (root = document) => {
    if (root.__gxCards) return; root.__gxCards = true;
    root.addEventListener('click', (e) => {
      const card = e.target.closest('.pc'); if (!card || !root.contains(card)) return;
      const p = GX.p(card.dataset.p);
      const sw = e.target.closest('[data-sw]');
      if (sw) { e.preventDefault(); setCardVariant(card, sw.dataset.sw); return; }
      const add = e.target.closest('[data-add]');
      if (add && !add.disabled) {
        e.preventDefault(); const size = add.dataset.add || null; const vid = add.dataset.vv || card.dataset.v;
        cart.add(p.id, vid, size); markDone(card, size || (add.dataset.vv ? GX.v(p, vid).label : null)); GX.added(p.id, vid, size, { open: false }); return;
      }
      if (e.target.closest('[data-open-cart]')) { e.preventDefault(); GX.openCart(); return; }
      if (e.target.closest('[data-plus]')) { e.preventDefault(); GX.quickSheet(card); return; }
      if (e.target.closest('[data-qv]')) { e.preventDefault(); GX.quickView(p, card.dataset.v, card); return; }
      if (e.target.closest('[data-fav]')) { e.preventDefault(); GX.fav.toggle(p.id); return; }
      const fl = e.target.closest('a[data-flip]');
      if (fl && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); GX.flipFrom(card); GX.go(fl.getAttribute('href'), { flip: true }); }
    });
    if (fine) {
      root.addEventListener('pointerover', (e) => {
        const card = e.target.closest('.pc'); if (!card) return;
        const alt = $('.pc__alt[data-src]', card); if (alt) { alt.src = alt.dataset.src; alt.removeAttribute('data-src'); }
        const sw = e.target.closest('[data-sw]'); if (sw) setCardVariant(card, sw.dataset.sw);
      });
    }
  };

  /* mobil: rychlé přidání ve spodním panelu */
  GX.quickSheet = (card) => {
    const p = GX.p(card.dataset.p), v = GX.v(p, card.dataset.v);
    const sh = $('#sheet');
    sh.innerHTML = `<div class="sheet__hd">${GX.pic(p, v, 0, { alt: '' })}<p><b>${esc(ty(p.name))}</b>${p.voucher ? 'Dárkový voucher' : esc(v.label) + ' · ' + money(GX.price(p, v))}</p><button class="x" type="button" data-close aria-label="Zavřít">${ICON.close}</button></div>
      <p class="cap" style="margin-bottom:12px">${p.voucher ? 'Hodnota' : 'Velikost'}</p>
      <div class="szs">${p.voucher ? p.v.map((x) => `<button class="sz" type="button" data-s="" data-vv="${esc(x.id)}">${money(GX.price(p, x))}</button>`).join('') : (() => { const a = GX.size.assess(p, v); const rec = a && a.rec.ok && GX.sizes(p, v).length > 1 ? a.rec.s : null; return GX.sizes(p, v).map(({ s, ok }) => `<button class="sz${s === rec ? ' is-rec' : ''}" type="button" data-s="${esc(s)}"${ok ? '' : ' disabled'}><span>${esc(s)}</span></button>`).join('') + '</div>' + (rec ? `<p class="note">Podtržená ${esc(rec)} vám podle „Sedne mi to?“ sedne nejlépe.</p>` : '') + '<div hidden>'; })()}</div>
      <a class="lnk" style="margin-top:18px" href="${GX.href(p, v)}">Detail produktu</a>`;
    GX.open('#sheet');
    sh.onclick = (e) => {
      if (e.target.closest('[data-close]')) { GX.closeAll(); return; }
      const b = e.target.closest('[data-s]'); if (!b || b.disabled) return;
      const size = b.dataset.s || null; const vid = b.dataset.vv || v.id;
      cart.add(p.id, vid, size); markDone(card, size || (b.dataset.vv ? GX.v(p, vid).label : null)); GX.closeAll(true); GX.added(p.id, vid, size, { open: false });
    };
  };

  /* rychlý náhled (desktop) */
  GX.quickView = (p, vid, card) => {
    let v = GX.v(p, vid); let size = null;
    const qv = $('#qv');
    const render = () => {
      const sizes = GX.sizes(p, v);
      if (sizes.length === 1 && sizes[0].ok) size = sizes[0].s;
      qv.innerHTML = `<button class="x qv__x" type="button" data-close aria-label="Zavřít náhled">${ICON.close}</button>
        <div style="position:relative"><div class="qv__gal" data-g>${v.img.slice(0, 8).map((_, i) => GX.pic(p, v, i, { eager: i === 0 })).join('')}</div>
          <div class="qv__nav"><button type="button" data-gp aria-label="Předchozí fotka">${ICON.prev}</button><button type="button" data-gn aria-label="Další fotka">${ICON.next}</button></div></div>
        <div class="qv__info">
          <div><p class="cap mut" style="margin-bottom:10px">${esc(GX.catName(p.cat.find((c) => GX.cats[c] && GX.cats[c].parent) || p.cat[0]))}</p><h2 class="d3">${esc(ty(p.name))}</h2><p style="margin-top:10px;font-size:18px">${GX.priceHTML(p, v)}</p></div>
          ${p.v.length > 1 ? `<div><p class="info__lbl"><span>${p.voucher ? 'Hodnota' : 'Barva'}: <b>${esc(v.label)}</b></span></p>${swatches(p, v, 'sws--lg', 20)}</div>` : ''}
          ${sizes.length ? `<div><p class="info__lbl"><span>Velikost${size ? ': <b>' + esc(size) + '</b>' : ''}</span></p><div class="szs szs--pdp">${(() => { const a = GX.size.assess(p, v); const rec = a && a.rec.ok && sizes.length > 1 ? a.rec.s : null; return sizes.map(({ s, ok }) => `<button class="sz${s === rec ? ' is-rec' : ''}" type="button" data-s="${esc(s)}"${ok ? '' : ' disabled'} aria-pressed="${s === size}"><span>${esc(s)}</span></button>`).join('') + '</div>' + (rec ? `<p class="note">Podtržená ${esc(rec)} vám podle „Sedne mi to?“ sedne nejlépe.</p>` : '') + '<div hidden>'; })()}</div></div>` : ''}
          <button class="btn btn--block${cart.has(p.id, v.id, size) && size ? ' is-done' : ''}" type="button" data-qadd>${cart.has(p.id, v.id, size) && (size || p.voucher) ? '✓ V košíku' + (size ? ' · ' + esc(size) : '') : (sizes.length && !size ? 'Vyberte velikost' : 'Přidat do košíku' + (size ? ' · ' + esc(size) : ''))}</button>
          <p style="font-size:13.5px;color:var(--ink-2)">${esc(ty((p.desc || '').split('. ').slice(0, 2).join('. ').replace(/\.?$/, '.')))}</p>
          <a class="lnk" href="${GX.href(p, v)}">Celý detail produktu</a></div>`;
      GX.pics(qv);
    };
    render(); GX.open('#qv');
    qv.onclick = (e) => {
      if (e.target.closest('[data-close]')) { GX.closeAll(); return; }
      const g = $('[data-g]', qv);
      if (e.target.closest('[data-gp]')) { g.scrollBy({ left: -g.clientWidth, behavior: reduce ? 'auto' : 'smooth' }); return; }
      if (e.target.closest('[data-gn]')) { g.scrollBy({ left: g.clientWidth, behavior: reduce ? 'auto' : 'smooth' }); return; }
      const sw = e.target.closest('[data-sw]'); if (sw) { v = GX.v(p, sw.dataset.sw); size = null; render(); return; }
      const s = e.target.closest('[data-s]'); if (s && !s.disabled) { size = s.dataset.s; render(); return; }
      if (e.target.closest('[data-qadd]')) {
        const sizes = GX.sizes(p, v);
        if (sizes.length && !size) { GX.toast('Vyberte velikost.'); return; }
        cart.add(p.id, v.id, size); if (card) markDone(card, size || v.label); render(); GX.closeAll(true); GX.added(p.id, v.id, size);
      }
    };
  };

  /* ---------- reveal ---------- */
  GX.reveal = (root = document) => {
    const els = $$('.rv, .lm, .cur', root).filter((el) => !el.classList.contains('is-in') && !el.classList.contains('hero-lm'));
    if (reduce || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
    els.forEach((el, i) => { if (el.classList.contains('rv') && !el.style.transitionDelay) el.style.transitionDelay = `${(i % 4) * 80}ms`; io.observe(el); });
  };
  GX.lines = (lines, cls = '') => `<span class="lm ${cls}">${lines.map((l) => `<span class="ln"><span>${esc(ty(l))}</span></span>`).join('')}</span>`;

  /* ---------- vodorovná řada (nativní scroll, šipky, průběh) ---------- */
  GX.rail = (el) => {
    const tr = $('.rail__track', el); const bar = $('.rail__bar i', el); const pv = $('[data-rp]', el); const nx = $('[data-rn]', el);
    const upd = () => {
      const max = tr.scrollWidth - tr.clientWidth; const k = max > 0 ? tr.scrollLeft / max : 1;
      const vis = tr.scrollWidth > 0 ? Math.min(1, tr.clientWidth / tr.scrollWidth) : 1;
      if (bar) bar.style.transform = `translateX(${(k * (1 - vis) / vis) * 100}%) scaleX(${vis})`;
      if (bar) bar.style.transformOrigin = 'left';
      if (pv) pv.disabled = tr.scrollLeft < 4; if (nx) nx.disabled = tr.scrollLeft > max - 4;
    };
    const step = () => { const c = tr.firstElementChild; return c ? (c.getBoundingClientRect().width + 16) * Math.max(1, Math.floor(tr.clientWidth / (c.getBoundingClientRect().width + 16)) - 1) : 300; };
    pv && pv.addEventListener('click', () => tr.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
    nx && nx.addEventListener('click', () => tr.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));
    tr.addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true });
    window.addEventListener('resize', upd); upd();
  };
  GX.railHTML = (inner, o = {}) => `<div class="rail ${o.cls || ''}"><div class="rail__track" style="${o.rw ? '--rw:' + o.rw : ''}">${inner}</div><div class="rail__ft"><span class="rail__bar"><i></i></span><div class="rail__ctl"><button type="button" data-rp aria-label="Posunout zpět">${ICON.prev}</button><button type="button" data-rn aria-label="Posunout dál">${ICON.next}</button></div>${o.link || ''}</div></div>`;

  /* ---------- přechod mezi stránkami ---------- */
  GX.go = (url, o = {}) => {
    if (reduce) { location.href = url; return; }
    GX.closeAll(true);
    if (o.flip) {
      store.sset('gx2-pt', 'flip');
      document.documentElement.classList.add('is-leaving');
      setTimeout(() => { location.href = url; }, 300);
      return;
    }
    store.sset('gx2-pt', 'curtain');
    const pt = $('.pt'); pt.classList.remove('is-lift'); void pt.offsetWidth; pt.classList.add('is-cover');
    setTimeout(() => { location.href = url; }, 560);
  };
  const internal = (href) => /^(index|kategorie|produkt)\.html/.test(href || '');
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank' || a.hasAttribute('download')) return;
    const href = a.getAttribute('href');
    if (href.startsWith('#') && href.length > 1) { const t = document.getElementById(href.slice(1)); if (t) { e.preventDefault(); GX.closeAll(true); t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); } return; }
    if (!internal(href)) return;
    const here = location.pathname.split('/').pop() || 'index.html';
    if (href.startsWith('index.html#') && here === 'index.html') { const t = document.getElementById(href.split('#')[1]); if (t) { e.preventDefault(); GX.closeAll(true); t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); return; } }
    e.preventDefault(); GX.go(href);
  });
  const arrive = () => {
    const html = document.documentElement; const mode = store.sget('gx2-pt'); store.sset('gx2-pt', null);
    if (html.classList.contains('pt-start')) {
      const pt = $('.pt');
      requestAnimationFrame(() => requestAnimationFrame(() => { html.classList.remove('pt-start'); pt.classList.add('is-lift'); setTimeout(() => pt.classList.remove('is-lift'), 900); }));
    }
    html.classList.remove('pt-flip');
    return mode;
  };
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) { document.documentElement.classList.remove('is-leaving', 'pt-start', 'pt-flip'); const pt = $('.pt'); pt && pt.classList.remove('is-cover', 'is-lift'); $$('.flipc').forEach((c) => c.remove()); }
  });

  /* ---------- shell: hlavička, menu, hledání, košík, patička ---------- */
  // 4. hodnota = priorita: když se menu nevejde vedle loga, schovají se nejdřív položky s vyšším číslem (logo zůstává vždy na středu)
  const NAV = [['novinky', 'Novinky', '', 1], ['obleceni', 'Oblečení', 'mega', 1], ['doplnky', 'Kabelky, doplňky', 'mega', 1], ['christmas', 'Christmas', '', 2], ['heavy-cotton', 'Heavy cotton', '', 3], ['bestsellery', 'Bestsellery', '', 4]];
  const MEGA_IMG = { obleceni: ['kabaty', 'saka', 'kalhoty'], doplnky: ['kabelky', 'rukavice', 'saly'] };
  const catUrl = (k) => `kategorie.html?k=${k}`;
  GX.catUrl = catUrl;
  GX.shell = (opts = {}) => {
    const S = GX.site;
    document.body.insertAdjacentHTML('afterbegin', `<a class="sr" href="#main">Přejít na obsah</a>
      <header class="hdr${opts.over ? ' hdr--over' : ''}" id="hdr"><div class="hdr__in">
        <div class="hdr__l"><button class="ibtn hdr__burger" type="button" id="menu-btn" aria-label="Menu" aria-expanded="false">${ICON.menu}</button>
          <nav class="hdr__nav" aria-label="Hlavní menu">${NAV.map(([k, l, t, pr]) => t === 'mega' ? `<button type="button" data-mega="${k}" data-pri="${pr}" aria-expanded="false" ${opts.active === k ? 'aria-current="page"' : ''}>${l}</button>` : `<a href="${catUrl(k)}" data-pri="${pr}" ${opts.active === k ? 'aria-current="page"' : ''}>${l}</a>`).join('')}</nav></div>
        <a class="hdr__logo${opts.mast ? ' is-hidden' : ''}" href="index.html" aria-label="GREY – úvodní stránka">${GX.logoSVG()}</a>
        <div class="hdr__act">
          <button class="t" type="button" data-search>Hledat</button>
          <a class="t" href="kategorie.html?k=oblibene">Oblíbené <span class="num" data-fav-n>(${GX.fav.list().length})</span></a>
          <button class="t" type="button" data-cart>Košík <span class="num cnt" data-cart-n data-style="paren">(0)</span></button>
          <button class="ibtn hdr__ico" type="button" data-search aria-label="Hledat">${ICON.search}</button>
          <button class="ibtn hdr__ico" type="button" data-cart aria-label="Košík">${ICON.bag}<span class="cnt num" data-cart-n data-n="0">0</span></button>
        </div></div></header>
      <div class="mega" id="mega" aria-hidden="true"><div class="mega__in" id="mega-in"></div></div>`);
    if (opts.mast) document.body.insertAdjacentHTML('beforeend', `<div class="mast" id="mast"><a href="index.html" aria-label="GREY – úvodní stránka">${GX.logoSVG()}</a></div>`);
    const tree = GX.tree.map((k) => [k, GX.cats[k]]);
    document.body.insertAdjacentHTML('beforeend', `
      <div class="scrim" id="scrim"></div>
      <aside class="panel drw" id="drw" role="dialog" aria-modal="true" aria-labelledby="drw-ttl" aria-hidden="true">
        <div class="panel__hd"><h2 id="drw-ttl">Košík</h2><button class="x" type="button" id="drw-close" data-close aria-label="Zavřít košík">${ICON.close}</button></div>
        <div class="drw__bd" id="drw-bd"></div>
        <div class="drw__ft" id="drw-ft" hidden>
          <div class="sumrow sumrow--big"><span>Mezisoučet</span><b class="num" id="drw-sum">0 Kč</b></div>
          <p class="drw__ship">Doprava Zásilkovnou: výdejní místo ${S.shipping[0].cz}${NB}Kč, na adresu ${S.shipping[1].cz}${NB}Kč. ${esc(S.dispatch)}</p>
          <button class="btn btn--block" type="button" data-demo="Ukázkový košík. V návrhu se nic neobjedná ani neplatí.">Pokračovat k objednávce</button>
          <p class="drw__demo">Ukázkový košík. Nic se neobjedná ani neplatí.</p>
        </div>
      </aside>
      <div class="panel sheet" id="sheet" role="dialog" aria-modal="true" aria-label="Rychlé přidání" aria-hidden="true"></div>
      <div class="panel qv" id="qv" role="dialog" aria-modal="true" aria-label="Rychlý náhled" aria-hidden="true"></div>
      <div class="panel mm" id="mm" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true">
        <div class="panel__hd"><span class="hdr__logo" style="width:92px;height:30px">${GX.logoSVG()}</span><button class="x" type="button" data-close aria-label="Zavřít menu">${ICON.close}</button></div>
        <div class="mm__bd"><ul class="mm__list">${tree.map(([k, c]) => c.sub && c.sub.length ? `<li><button type="button" data-mm="${k}" aria-expanded="false">${esc(c.l.toLowerCase())}<small>${c.n}</small></button><div class="mm__sub" id="mm-${k}"><a href="${catUrl(k)}"><span>Zobrazit vše</span><small>${c.n}</small></a>${c.sub.filter((s) => GX.cats[s].n).map((s) => `<a href="${catUrl(s)}"><span>${esc(GX.cats[s].l)}</span><small>${GX.cats[s].n}</small></a>`).join('')}</div></li>` : `<li><a href="${catUrl(k)}">${esc(c.l.toLowerCase())}<small>${c.n}</small></a></li>`).join('')}
          <li><a href="kategorie.html?k=oblibene">oblíbené<small data-fav-n>(${GX.fav.list().length})</small></a></li></ul></div>
        <div class="mm__foot">${esc(S.drop.text)}.<br><a href="mailto:${S.email}">${S.email}</a> · <a href="${S.ig}">Instagram</a></div>
      </div>
      <div class="panel srch" id="srch" role="dialog" aria-modal="true" aria-label="Hledání" aria-hidden="true"><div class="srch__in">
        <div class="srch__row"><label class="sr" for="srch-q">Hledat v obchodě</label><input id="srch-q" type="search" placeholder="Co hledáte?" autocomplete="off" enterkeyhint="search"><button class="x" type="button" data-close aria-label="Zavřít hledání">${ICON.close}</button></div>
        <div class="srch__meta"><span class="srch__hint" id="srch-hint">Oblíbené hledání</span><div class="srch__pop">${['croco', 'oblek', 'heavy cotton', 'trench coat', 'kožená kabelka', 'rukavice', 'džíny'].map((q) => `<button class="chip" type="button" data-q="${q}">${q}</button>`).join('')}</div></div>
        <div class="srch__grid"><div class="srch__cats" id="srch-cats"></div><div><div class="srch__res" id="srch-res"></div><div class="srch__all" id="srch-all"></div></div></div>
      </div></div>
      <div class="toast" id="toast" role="status" aria-live="polite"><span id="toast-msg"></span><button type="button" id="toast-btn" hidden></button></div>
      <div class="sv" id="sv" aria-hidden="true" role="dialog" aria-label="Stories s nákupem">
        <button class="sv__nav" type="button" id="sv-prev" aria-label="Předchozí příběh">${ICON.prev}</button>
        <div class="sv__box"><div class="sv__img" id="sv-img"></div>
          <div class="sv__top"><div class="sv__bars" id="sv-bars"></div><div class="sv__who"><span id="sv-who" style="display:flex;align-items:center;gap:10px;flex:1"></span><button type="button" id="sv-pause" aria-pressed="false">Pozastavit</button><button type="button" id="sv-close" aria-label="Zavřít stories">${ICON.close}</button></div></div>
          <div class="sv__panel" id="sv-panel"></div></div>
        <button class="sv__nav" type="button" id="sv-next" aria-label="Další příběh">${ICON.next}</button>
      </div>
      <div class="concept" aria-hidden="true">Neoficiální návrh MALUS/01</div>
      <div class="pt" aria-hidden="true">${GX.logoSVG()}</div>`);
    // patička
    const f = document.createElement('footer'); f.className = 'ftr';
    f.innerHTML = `<div class="wrap">
      <div class="ftr__top"><div><p class="ftr__claim">vše skladem.</p><p>${esc(S.dispatch)} ${esc(S.drop.text)}.</p></div>
        <div class="ftr__cols">
          <div><h4>Nakupování</h4><ul><li><a href="${S.shop}/jak-nakupovat/">Jak nakupovat</a></li><li><a href="${S.shop}/vraceni-reklamace/">Vrácení zboží a reklamace</a></li><li><a href="${S.shop}/obchodni-podminky/">Obchodní podmínky</a></li><li><a href="${S.shop}/podminky-ochrany-osobnich-udaju/">Ochrana osobních údajů</a></li><li><a href="${catUrl('vouchery')}">Dárkové vouchery</a></li></ul></div>
          <div><h4>Doprava a platba</h4><ul><li>Zásilkovna – výdejní místo ${S.shipping[0].cz}${NB}Kč</li><li>Zásilkovna – na adresu ${S.shipping[1].cz}${NB}Kč</li><li>Slovensko ${S.shipping[0].sk} / ${S.shipping[1].sk}</li><li>${S.payments.join(', ')}</li><li>${esc(S.dispatch)}</li></ul></div>
          <div><h4>Kontakt</h4><ul><li><a href="mailto:${S.email}">${S.email}</a></li><li>${esc(S.hours)}</li><li><a href="${S.ig}">Instagram ${S.igHandle}</a></li><li><a href="${S.fb}">Facebook</a></li><li>${S.company}, IČO ${S.ico}</li><li>${S.seat}</li></ul></div>
        </div></div>
      <div class="ftr__mark" aria-hidden="true">${GX.logoSVG()}</div>
      <div class="ftr__legal"><span>© 2026 ${S.company}</span><span>Neoficiální návrh studia MALUS/01. Fotky, produkty a texty patří GREY. · <a href="mailto:hello@malus01.com">hello@malus01.com</a></span></div>
    </div>`;
    document.body.append(f);

    // události
    cart.render();
    $$('[data-cart]').forEach((b) => b.addEventListener('click', GX.openCart));
    $('#scrim').addEventListener('click', () => GX.closeAll());
    document.addEventListener('click', (e) => { const c = e.target.closest('[data-close]'); if (!c) return; const pn = c.closest('.panel'); if (pn && pn.id !== 'sheet' && pn.id !== 'qv') GX.closeAll(); });
    $('#drw-bd').addEventListener('click', (e) => {
      const q = e.target.closest('[data-q]'); const rm = e.target.closest('[data-rm]');
      if (q) { const it = cart.items[+q.dataset.k]; it.q += +q.dataset.q; if (it.q < 1) cart.items.splice(+q.dataset.k, 1); cart.save(); }
      if (rm) { cart.items.splice(+rm.dataset.rm, 1); cart.save(); }
    });
    document.addEventListener('click', (e) => { const d = e.target.closest('[data-demo]'); if (d) { e.preventDefault(); GX.toast(d.dataset.demo); } });
    $('#menu-btn').addEventListener('click', () => GX.open('#mm'));
    $('#mm').addEventListener('click', (e) => { const b = e.target.closest('[data-mm]'); if (!b) return; const s = $('#mm-' + b.dataset.mm); const on = s.classList.toggle('is-on'); b.setAttribute('aria-expanded', on); });
    $$('[data-search]').forEach((b) => b.addEventListener('click', () => { GX.open('#srch', { focus: '#srch-q' }); }));
    // mega menu
    const mega = $('#mega'); const hdr = $('#hdr'); let mk = null, mt = 0;
    const megaHTML = (k) => {
      const c = GX.cats[k];
      return `<nav class="mega__list" aria-label="${esc(c.l)}">${c.sub.filter((s) => GX.cats[s].n).map((s) => `<a href="${catUrl(s)}">${esc(GX.cats[s].l.toLowerCase())}<small>${GX.cats[s].n}</small></a>`).join('')}<div class="mega__all"><a class="lnk" href="${catUrl(k)}">Zobrazit vše · ${c.n}</a></div></nav>
        <div class="mega__imgs">${(MEGA_IMG[k] || []).filter((s) => GX.cats[s] && GX.cats[s].n).map((s) => `<a href="${catUrl(s)}">${GX.catPic(s)}<span><span>${esc(GX.cats[s].l)}</span><span class="mut">${GX.cats[s].n}</span></span></a>`).join('')}</div>`;
    };
    const openMega = (k) => {
      clearTimeout(mt); if (mk === k) return; mk = k;
      $('#mega-in').innerHTML = megaHTML(k); GX.pics(mega); GX.typo(mega);
      mega.classList.add('is-on'); mega.setAttribute('aria-hidden', 'false'); hdr.classList.add('is-mega');
      $$('[data-mega]', hdr).forEach((b) => b.setAttribute('aria-expanded', b.dataset.mega === k));
    };
    const closeMega = () => { mk = null; mega.classList.remove('is-on'); mega.setAttribute('aria-hidden', 'true'); hdr.classList.remove('is-mega'); $$('[data-mega]', hdr).forEach((b) => b.setAttribute('aria-expanded', 'false')); };
    GX.closeMega = closeMega;
    $$('[data-mega]', hdr).forEach((b) => {
      b.addEventListener('click', () => (mk === b.dataset.mega ? closeMega() : openMega(b.dataset.mega)));
      if (fine) b.addEventListener('mouseenter', () => { clearTimeout(mt); mt = setTimeout(() => openMega(b.dataset.mega), 90); });
    });
    if (fine) {
      $$('.hdr__nav a', hdr).forEach((a) => a.addEventListener('mouseenter', () => { clearTimeout(mt); mt = setTimeout(closeMega, 120); }));
      [hdr, mega].forEach((el) => { el.addEventListener('mouseleave', () => { clearTimeout(mt); mt = setTimeout(closeMega, 220); }); el.addEventListener('mouseenter', () => { if (mk) clearTimeout(mt); }); });
    }
    // hledání
    const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const idx = GX.products.map((p) => ({ p, t: norm([p.name, p.v.map((v) => v.label).join(' '), p.material, p.cat.map(GX.catName).join(' ')].join(' ')) }));
    GX.search = (q) => { const toks = norm(q).split(/\s+/).filter(Boolean); if (!toks.length) return []; return idx.filter((x) => toks.every((t) => x.t.includes(t))).map((x) => x.p); };
    const runSearch = () => {
      const q = $('#srch-q').value.trim();
      const res = q.length < 2 ? [] : GX.search(q);
      const cats = q.length < 2 ? [] : Object.keys(GX.cats).filter((k) => GX.cats[k].n && norm(GX.cats[k].l).includes(norm(q)));
      $('#srch-hint').textContent = q.length < 2 ? 'Oblíbené hledání' : (res.length ? `Nalezeno: ${plural(res.length, 'produkt', 'produkty', 'produktů')}` : 'Nic jsme nenašli. Zkuste jiné slovo.');
      $('#srch-cats').innerHTML = cats.length ? `<p class="cap mut" style="margin-bottom:8px">Kategorie</p>${cats.map((k) => `<a href="${catUrl(k)}"><span>${esc(GX.cats[k].l)}</span><small>${GX.cats[k].n}</small></a>`).join('')}` : '';
      $('#srch-res').innerHTML = res.slice(0, 8).map((p) => GX.card(p)).join('');
      $('#srch-all').innerHTML = res.length > 8 ? `<a class="lnk" href="kategorie.html?q=${encodeURIComponent(q)}">Zobrazit všech ${res.length} výsledků</a>` : '';
      GX.pics($('#srch'));
    };
    let st = 0; $('#srch-q').addEventListener('input', () => { clearTimeout(st); st = setTimeout(runSearch, 120); });
    $('#srch-q').addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.value.trim().length > 1) GX.go(`kategorie.html?q=${encodeURIComponent(e.target.value.trim())}`); });
    $('.srch__pop').addEventListener('click', (e) => { const b = e.target.closest('[data-q]'); if (b) { $('#srch-q').value = b.dataset.q; runSearch(); $('#srch-q').focus(); } });
    GX.bindCards($('#srch-res'));
    // stories
    $('#sv-close').addEventListener('click', () => GX.stories.close());
    $('#sv-pause').addEventListener('click', () => GX.stories.toggle());
    $('#sv-img').addEventListener('click', (e) => { const t = e.target.closest('[data-tap]'); if (t) (t.dataset.tap === 'r' ? GX.stories.next : GX.stories.prev)(); });
    $('#sv-next').addEventListener('click', () => GX.stories.next()); $('#sv-prev').addEventListener('click', () => GX.stories.prev());
    $('#sv').addEventListener('click', (e) => { if (e.target.id === 'sv') GX.stories.close(); });
    $('#sv-panel').addEventListener('click', (e) => GX.stories.panel(e));
    let sx0 = null;
    $('#sv').addEventListener('pointerdown', (e) => { sx0 = e.clientX; }, { passive: true });
    $('#sv').addEventListener('pointerup', (e) => { if (sx0 === null) return; const dx = e.clientX - sx0; sx0 = null; if (Math.abs(dx) > 60) (dx < 0 ? GX.stories.next : GX.stories.prev)(); }, { passive: true });
    document.addEventListener('keydown', (e) => {
      const svOn = $('#sv').classList.contains('is-on');
      if (e.key === 'Escape') { if (svOn) GX.stories.close(); else { closeMega(); GX.closeAll(); } }
      if (svOn && e.key === 'ArrowRight') GX.stories.next();
      if (svOn && e.key === 'ArrowLeft') GX.stories.prev();
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden && $('#sv').classList.contains('is-on') && !SV.paused) GX.stories.toggle(); });

    // hlavička: nad úvodem průhledná, při scrollu dolů se schová, nahoru se ukáže
    let lastY = window.scrollY, hq = 0;
    const setHdr = () => {
      const y = window.scrollY;
      const hero = opts.over ? $('.hero') : null; const lim = hero ? hero.offsetHeight - 90 : 0;
      hdr.classList.toggle('hdr--over', !!hero && y < lim && !mk);
      const down = y > lastY + 4, up = y < lastY - 4;
      if (y > Math.max(lim, 400) && down && !mk) hdr.classList.add('hdr--hide');
      else if (up || y < Math.max(lim, 400)) hdr.classList.remove('hdr--hide');
      document.body.classList.toggle('hdr-shown', !hdr.classList.contains('hdr--hide'));
      document.body.classList.toggle('pg-top', y < 140);
      if (Math.abs(y - lastY) > 4) lastY = y;
    };
    window.addEventListener('scroll', () => { if (!hq) hq = requestAnimationFrame(() => { hq = 0; setHdr(); }); }, { passive: true });
    window.addEventListener('resize', setHdr);
    GX.setHdr = setHdr; setHdr();

    // menu vlevo se musí vejít do své poloviny, aby logo zůstalo přesně uprostřed; co se nevejde, schová se podle priority
    const navEl = $('.hdr__nav', hdr); const navCol = $('.hdr__l', hdr);
    const fitNav = () => {
      const items = [...navEl.children];
      items.forEach((el) => el.classList.remove('is-cut')); hdr.classList.remove('hdr--tight');
      if (getComputedStyle(navEl).display === 'none') return;
      const room = navCol.clientWidth - 40;
      const used = () => { const vis = items.filter((el) => !el.classList.contains('is-cut')); return vis.length ? vis[vis.length - 1].getBoundingClientRect().right - navEl.getBoundingClientRect().left : 0; };
      for (const el of items.slice().sort((a, b) => b.dataset.pri - a.dataset.pri)) { if (used() <= room) break; if (+el.dataset.pri > 1) el.classList.add('is-cut'); }
      if (used() > room) hdr.classList.add('hdr--tight');
    };
    let fq = 0; window.addEventListener('resize', () => { if (!fq) fq = requestAnimationFrame(() => { fq = 0; fitNav(); }); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNav);
    GX.fitNav = fitNav; fitNav();
    GX.typo(f); GX.typo($('#mm'));
    GX.arrival = arrive();
  };

  /* ---------- stories s nákupem ---------- */
  const SV = { set: 0, i: 0, t0: 0, dur: 5200, paused: false, raf: 0, size: null, elapsed: 0 };
  GX.stories = {
    sets() { return (GX.home && GX.home.stories) || []; },
    open(setIdx, i = 0) {
      lastFocus = document.activeElement; SV.set = setIdx; SV.i = i; SV.paused = false;
      const el = $('#sv'); el.classList.add('is-on'); el.setAttribute('aria-hidden', 'false'); lock(true);
      $('#sv-pause').textContent = 'Pozastavit';
      GX.stories.show(); setTimeout(() => $('#sv-close').focus(), 60);
      const seen = store.get('gx2-seen', []); const id = GX.stories.sets()[setIdx].id; if (!seen.includes(id)) { seen.push(id); store.set('gx2-seen', seen); }
      $$(`.stb[data-st="${setIdx}"]`).forEach((b) => b.classList.add('is-seen'));
    },
    close() { cancelAnimationFrame(SV.raf); const el = $('#sv'); el.classList.remove('is-on'); el.setAttribute('aria-hidden', 'true'); lock(false); lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); },
    show() {
      const set = GX.stories.sets()[SV.set]; const [pid, vid, ii] = set.items[SV.i];
      const p = GX.p(pid), v = GX.v(p, vid); const sizes = GX.sizes(p, v);
      SV.size = p.voucher ? '' : (sizes.length === 1 ? sizes[0].s : null);
      const [cp, cv, ci] = set.items[0];
      $('#sv-who').innerHTML = `${GX.pic(GX.p(cp), GX.v(GX.p(cp), cv), ci || 0, { alt: '' })}<span>${esc(set.label)} <span style="opacity:.6">· ${SV.i + 1}/${set.items.length}</span></span>`;
      $('#sv-bars').innerHTML = set.items.map((_, k) => `<span class="${k < SV.i ? 'done' : ''}"><i></i></span>`).join('');
      $('#sv-img').innerHTML = `${GX.pic(p, v, Math.min(ii || 0, v.img.length - 1), { eager: true })}<button class="sv__tap sv__tap--l" type="button" data-tap="l" aria-label="Předchozí příběh"></button><button class="sv__tap sv__tap--r" type="button" data-tap="r" aria-label="Další příběh"></button>`;
      GX.stories.paintPanel(); GX.pics($('#sv'));
      SV.elapsed = 0; GX.stories.run();
    },
    paintPanel() {
      const set = GX.stories.sets()[SV.set]; const [pid, vid] = set.items[SV.i]; const p = GX.p(pid), v = GX.v(p, vid); const sizes = GX.sizes(p, v);
      const inCart = SV.size !== null && cart.has(p.id, v.id, SV.size || null);
      $('#sv-panel').innerHTML = `<div class="sv__p1"><a href="${GX.href(p, v)}"><span>${p.voucher ? 'Dárkový voucher' : esc(v.label)}</span>${esc(ty(p.name))}</a><b class="num">${money(GX.price(p, v))}</b></div>
        ${sizes.length > 1 ? `<div class="sv__sizes" role="group" aria-label="Velikost">${sizes.map(({ s, ok }) => `<button type="button" data-svs="${esc(s)}" ${ok ? '' : 'disabled'} aria-pressed="${s === SV.size}">${esc(s)}${ok ? '' : ' · vyprodáno'}</button>`).join('')}</div>` : ''}
        <div class="sv__add"><button class="btn ${inCart ? 'is-done' : ''}" type="button" id="sv-add">${inCart ? '✓ V košíku' + (SV.size ? ' · ' + esc(SV.size) : '') : (SV.size === null ? 'Vyberte velikost' : 'Přidat do košíku' + (SV.size ? ' · ' + esc(SV.size) : ''))}</button></div>`;
    },
    panel(e) {
      const s = e.target.closest('[data-svs]');
      if (s && !s.disabled) { SV.size = s.dataset.svs; GX.stories.paintPanel(); return; }
      if (e.target.closest('#sv-add')) {
        const set = GX.stories.sets()[SV.set]; const [pid, vid] = set.items[SV.i]; const p = GX.p(pid); const v = GX.v(p, vid);
        if (SV.size === null) { GX.toast('Vyberte velikost.'); if (!SV.paused) GX.stories.toggle(); return; }
        cart.add(pid, v.id, SV.size || null); GX.stories.paintPanel();
        if (!SV.paused) GX.stories.toggle();
        GX.toast(`✓ V košíku · ${p.name}${SV.size ? ' · ' + SV.size : ''}`, { label: `Zobrazit košík (${cart.count()})`, fn: () => { GX.stories.close(); GX.openCart(); } });
      }
    },
    run() {
      cancelAnimationFrame(SV.raf); SV.t0 = performance.now() - SV.elapsed;
      const bar = $$('#sv-bars span i')[SV.i];
      const tick = (t) => {
        if (SV.paused) return;
        SV.elapsed = t - SV.t0; const k = Math.min(1, SV.elapsed / SV.dur);
        if (bar) bar.style.transform = `scaleX(${k})`;
        if (k >= 1) { GX.stories.next(); return; }
        SV.raf = requestAnimationFrame(tick);
      };
      if (!reduce) SV.raf = requestAnimationFrame(tick); else if (bar) bar.style.transform = 'scaleX(1)';
    },
    next() { const sets = GX.stories.sets(); const set = sets[SV.set]; if (SV.i < set.items.length - 1) { SV.i++; GX.stories.show(); } else if (SV.set < sets.length - 1) { SV.set++; SV.i = 0; GX.stories.show(); } else GX.stories.close(); },
    prev() { if (SV.i > 0) SV.i--; else if (SV.set > 0) { SV.set--; SV.i = GX.stories.sets()[SV.set].items.length - 1; } GX.stories.show(); },
    toggle() {
      SV.paused = !SV.paused; const b = $('#sv-pause');
      b.textContent = SV.paused ? 'Přehrát' : 'Pozastavit'; b.setAttribute('aria-pressed', SV.paused);
      if (!SV.paused) GX.stories.run(); else cancelAnimationFrame(SV.raf);
    }
  };
})();
