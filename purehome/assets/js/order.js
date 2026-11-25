/* PURE HOME v9 · rezervace úklidu
   Průvodce po krocích: druh, četnost, velikost domova (odhad času na ciferníku podle Ivaniných časů),
   znečištění (sazba podle četnosti a znečištění), doplňky, místo (vzdálenost od hranice Ostravy),
   termín v kalendáři s obsazeností (dopoledne / odpoledne, delší úklid celý den; v neděli zavřeno,
   v sobotu +25 %) a kontakt. Vedle se živě skládá lístek s cenou.
   Odeslání jde přes booking.js: v živém režimu do Ivanina Kalendáře Google, v ukázce jen do prohlížeče.
   Fotky zákazník pošle po rezervaci sám (sdílením, přes WhatsApp nebo e-mailem). */
(function (W, D) {
  'use strict';
  var C = W.PHC, P = W.PH, B = W.PHB, esc = C.esc, kc = C.kc;
  var host = C.$('[data-render="order"]'); if (!host || !P || !B) return;
  var PR = P.pricing, CT = P.contact, BK = P.booking;

  function fresh() {
    var c = { type: null, freq: null, size: null, hours: PR.hourly.start, level: null, addons: {}, travel: null, town: '',
      date: null, part: null, noSlot: false, f: { name: '', phone: '', email: '', address: '', note: '', web: '' }, t0: 0 };
    PR.addons.forEach(function (a) { c.addons[a.id] = { on: false, hours: 1 }; });
    return c;
  }
  var calc = fresh();
  function lvl(id) { return PR.levels.filter(function (l) { return l.id === id; })[0]; }
  function freqOf(id) { return PR.frequencies.filter(function (f) { return f.id === id; })[0]; }
  function sizeOf(id) { return PR.sizes.filter(function (z) { return z.id === id; })[0]; }
  function trOf(id) { return PR.travel.filter(function (x) { return x.id === id; })[0]; }
  function partOf(id) { return BK.parts.filter(function (x) { return x.id === id; })[0]; }
  function n1(v) { return String(v).replace('.', ','); }
  function hrs(h) { return n1(h) + ' h'; }
  function span(r) { return n1(r[0]) + '–' + n1(r[1]) + ' h'; }
  function mid(r) { return Math.round((r[0] + r[1]) / 2 / PR.hourly.step) * PR.hourly.step; }
  function range(z) { return calc.type === 'general' ? z.general : z.regular; }
  function hWord(h) { return h === 1 ? 'hodina' : (h % 1 === 0 && h < 5) ? 'hodiny' : 'hodin'; }
  function trPrice(t) { return t.price === null ? 'individuálně' : t.price === 0 ? 'zdarma' : kc(t.price); }
  function rateOf(type, f, l) { return type === 'general' ? l.general : l.regular[f]; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  var WD = ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'];
  function dLabel(iso) { var d = new Date(iso + 'T12:00:00'); return WD[d.getDay()] + ' ' + d.getDate() + '. ' + (d.getMonth() + 1) + '.'; }
  function dLong(iso) { return cap(new Date(iso + 'T12:00:00').toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long' })); }
  function isSat(iso) { return new Date(iso + 'T12:00:00').getDay() === 6; }
  var SAT = Math.round(PR.saturday * 100) + ' %';
  /* čas úklidu i s doplňky po hodinách: delší úklid zabere celý den */
  function totalHours() { var h = calc.hours; PR.addons.forEach(function (a) { if (a.unit === 'hour' && calc.addons[a.id].on) h += calc.addons[a.id].hours; }); return h; }
  function needDay() { return totalHours() > BK.halfDay; }
  function slotOn() { return !calc.noSlot && calc.date && calc.part; }

  /* ---------- výpočet ---------- */
  function compute() {
    var type = calc.type || 'regular', l = lvl(calc.level || 'bezna');
    var rate = rateOf(type, calc.freq || 'weekly', l), work = rate * calc.hours;
    var sat = slotOn() && isSat(calc.date), satExtra = sat ? work * PR.saturday : 0;
    var services = work + satExtra, from = false, adds = [];
    PR.addons.forEach(function (a) {
      var s = calc.addons[a.id]; if (!s.on) return;
      if (a.unit === 'fixed') { services += a.price; adds.push([a.label, kc(a.price)]); }
      else if (a.unit === 'from') { services += a.price; from = true; adds.push([a.label + ' (podle fotky)', 'od ' + kc(a.price)]); }
      else if (a.unit === 'hour') { services += a.price * s.hours; adds.push([a.label + ', ' + hrs(s.hours), kc(a.price * s.hours)]); }
      else { from = true; adds.push([a.label, 'individuálně']); }
    });
    var tr = trOf(calc.travel || 't0');
    var total = Math.max(services, PR.minimum) + (tr.price || 0);
    return { rate: rate, work: work, sat: sat, satExtra: satExtra, adds: adds, services: services, min: services < PR.minimum, tr: tr, total: total, from: from || tr.price === null };
  }

  /* ---------- obsah kroků ---------- */
  var CITY = 34, RINGS = [['t10', '10 km', 72], ['t20', '20 km', 106]], RAD = { t0: CITY, t10: 72, t20: 106, t99: 122 };   /* uprostřed je celá Ostrava, kruhy jsou vzdálenost od její hranice */
  function choice(k, v, title, sub, extra, cls) {
    return '<button type="button" class="choice ' + (cls || '') + '" data-k="' + k + '" data-v="' + v + '" aria-pressed="false"><b>' + title + '</b>' + (sub ? '<span>' + sub + '</span>' : '') + (extra ? '<small>' + extra + '</small>' : '') + '</button>';
  }
  function fld(name, label, type, ac, req, max, ph) {
    return '<label class="fld"><span>' + label + (req ? '' : ' <em>(nepovinné)</em>') + '</span><input data-f="' + name + '" type="' + type + '" autocomplete="' + ac + '" maxlength="' + max + '"' +
      (type === 'tel' ? ' inputmode="tel"' : '') + (req ? ' required aria-required="true"' : '') + (ph ? ' placeholder="' + ph + '"' : '') + '><i class="fld__err" aria-live="polite"></i></label>';
  }
  var DIAL = '<div class="dial"><div class="dial__face" role="slider" tabindex="0" aria-label="Odhad času v hodinách" aria-valuemin="' + PR.hourly.min + '" aria-valuemax="' + PR.hourly.max + '" aria-valuenow="' + PR.hourly.start + '">' +
    '<svg viewBox="0 0 230 230" aria-hidden="true"><circle cx="115" cy="115" r="95" fill="none" stroke="rgba(18,18,20,.12)" stroke-width="2"/>' +
    (function () { var t = ''; for (var h = PR.hourly.min; h <= PR.hourly.max; h++) { var a = (h - PR.hourly.min) / (PR.hourly.max - PR.hourly.min) * 330 - 90, rr = a * Math.PI / 180; t += '<line x1="' + (115 + Math.cos(rr) * 104).toFixed(1) + '" y1="' + (115 + Math.sin(rr) * 104).toFixed(1) + '" x2="' + (115 + Math.cos(rr) * 110).toFixed(1) + '" y2="' + (115 + Math.sin(rr) * 110).toFixed(1) + '" stroke="rgba(18,18,20,.35)" stroke-width="1"/>'; } return t; })() +
    '<circle class="dial__arc" cx="115" cy="115" r="95" fill="none" stroke="#121214" stroke-width="2" transform="rotate(-90 115 115)" stroke-dasharray="596.9" stroke-dashoffset="596.9"/>' +
    '<g class="dial__knob"><circle cx="115" cy="20" r="11" fill="#121214"/><circle cx="115" cy="20" r="4" fill="#F6F4F0"/></g></svg>' +
    '<div class="dial__val"><span class="num" data-h>3</span><small data-hw>hodiny</small></div></div>' +
    '<div class="dial__side"><p class="dial__est" data-est>Vyberte velikost a čas odhadneme.</p><div class="dial__btns"><button type="button" data-d="-1" aria-label="Méně času">−</button><button type="button" data-d="1" aria-label="Více času">+</button></div></div></div>';
  var L0 = PR.levels[0];
  var STEPS = {
    type: '<h3 class="ws__title">Jaký úklid potřebujete?</h3><p class="ws__hint">Generální úklid obsahuje všechno z běžného a jde víc do hloubky.</p><div class="choices choices--2">' +
      choice('type', 'regular', 'Běžný úklid', 'Udržíme domácnost v pořádku. Pravidelně, nebo jednorázově.', 'od ' + kc(L0.regular.weekly) + '/h', 'choice--big') +
      choice('type', 'general', 'Generální úklid', 'Do hloubky a do detailu, včetně dveří, lišt, parapetů a horních ploch skříní.', 'od ' + kc(L0.general) + '/h', 'choice--big') + '</div>',
    freq: '<h3 class="ws__title">Jak často?</h3><p class="ws__hint">Pravidelný úklid vychází levněji. Ceny platí při běžném znečištění.</p><div class="choices">' +
      PR.frequencies.map(function (f) { return choice('freq', f.id, esc(f.label), '', kc(L0.regular[f.id]) + '/h'); }).join('') + '</div>',
    size: '<h3 class="ws__title">Jak velký je váš domov?</h3><p class="ws__hint">Podle velikosti odhadneme, jak dlouho bude úklid trvat. Časy jsou orientační pro jednu uklízečku, platí se skutečně odpracovaný čas.</p>' +
      '<div class="sizes"><div class="choices">' + PR.sizes.map(function (z) { return choice('size', z.id, esc(z.label), z.hint ? esc(z.hint) : '', '<em data-sz="' + z.id + '"></em>'); }).join('') + '</div>' + DIAL + '</div>',
    level: '<h3 class="ws__title">Jak moc je potřeba uklidit?</h3><p class="ws__hint">Odhadněte to sami. Ivana míru znečištění potvrdí podle fotek.</p><div class="choices choices--3">' +
      PR.levels.map(function (l) { return choice('level', l.id, esc(l.label), '<i data-lt="' + l.id + '">' + esc(l.regularText) + '</i>', '<em data-lr="' + l.id + '"></em>'); }).join('') + '</div>',
    extra: '<h3 class="ws__title">Něco navíc?</h3><p class="ws__hint">Doplňkové služby se dělají k hlavnímu úklidu. Klidně přeskočte.</p><div class="toggles">' +
      PR.addons.map(function (a) {
        var pr = a.unit === 'fixed' ? '+ ' + kc(a.price) : a.unit === 'from' ? 'od ' + kc(a.price) : a.unit === 'hour' ? kc(a.price) + '/h' : 'individuálně';
        return '<div class="tg" role="button" tabindex="0" aria-pressed="false" data-a="' + a.id + '"><b>' + esc(a.label) + '</b><span>' + pr + '</span>' + (a.note ? '<small>' + esc(a.note) + '</small>' : '') +
          (a.unit === 'hour' ? '<div class="tg__hrs">Odhad času <span><i data-d="-1" role="button" aria-label="Méně">−</i><output>1 h</output><i data-d="1" role="button" aria-label="Více">+</i></span></div>' : '') + '</div>';
      }).join('') + '</div><p class="ws__no">' + esc(PR.addonsNo) + ' neděláme.</p>',
    place: '<h3 class="ws__title">Kde se bude uklízet?</h3><p class="ws__hint">V Ostravě je doprava zdarma. Mimo Ostravu se platí podle vzdálenosti od hranice Ostravy, jedním směrem. Nevíte přesně? Vyberte přibližně, Ivana to upřesní.</p>' +
      '<div class="place"><div class="rings"><svg viewBox="0 0 260 260" aria-hidden="true"><circle class="fillr" cx="130" cy="130" r="106"/>' +
      RINGS.map(function (r) { return '<circle class="r" data-v="' + r[0] + '" cx="130" cy="130" r="' + r[2] + '"/><text x="130" y="' + (130 - r[2] - 5) + '" text-anchor="middle">' + r[1] + '</text>'; }).join('') +
      '<circle class="city" cx="130" cy="130" r="' + CITY + '"/><text class="city__t" x="130" y="128" text-anchor="middle">Ostrava</text><text class="city__f" x="130" y="141" text-anchor="middle">zdarma</text></svg></div>' +
      '<div class="zones">' + PR.travel.map(function (t) { return choice('travel', t.id, esc(t.pick), '', trPrice(t)); }).join('') +
      '<p class="zones__note">' + esc(PR.parking.join(' ')) + '.</p></div></div>' +
      '<label class="town"><span>Obec nebo městská část <em>(nepovinné)</em></span><input type="text" data-town maxlength="60" autocomplete="off" placeholder="např. Poruba, Hlučín, Mariánské Hory"></label>',
    when: '<h3 class="ws__title">Kdy se vám to hodí?</h3><p class="ws__hint">V kalendáři vidíte volná dopoledne a odpoledne. V sobotu je příplatek ' + SAT + ' k hodinové sazbě, v neděli je zavřeno.</p>' +
      '<div class="when2"><div class="cal" aria-label="Kalendář volných termínů"><div class="cal__head"><button type="button" data-m="-1" aria-label="Předchozí měsíc">‹</button><b data-month></b><button type="button" data-m="1" aria-label="Další měsíc">›</button></div>' +
      '<div class="cal__wd" aria-hidden="true"><span>po</span><span>út</span><span>st</span><span>čt</span><span>pá</span><span class="is-sat">so</span><span class="is-sun">ne</span></div>' +
      '<div class="cal__body"><div class="cal__grid" data-grid></div><div class="cal__state" data-calstate aria-live="polite"></div></div>' +
      '<ul class="cal__legend" aria-hidden="true"><li><i class="lg"><b class="f"></b><b class="f"></b></i>volno dopoledne i odpoledne</li><li><i class="lg"><b class="f"></b><b class="x"></b></i>volno jen dopoledne</li>' +
      '<li><i class="lg lg--full">12</i>obsazeno</li><li><i class="lg lg--sat">so</i>+' + SAT + '</li><li><i class="lg lg--sun">ne</i>zavřeno</li></ul>' +
      (B.demo ? '<p class="cal__demo">Ukázka: obsazenost je vymyšlená a vaše rezervace se uloží jen v tomto prohlížeči. <button type="button" data-demoreset>Smazat ukázkové rezervace</button></p>' : '') + '</div>' +
      '<div class="when2__side" data-side aria-live="polite"></div></div>',
    contact: '<h3 class="ws__title">Kam se vám Ivana ozve?</h3><p class="ws__hint">Zavolá nebo napíše a potvrdí termín i cenu.</p>' +
      '<div class="form">' + fld('name', 'Jméno a příjmení', 'text', 'name', true, 80) + fld('phone', 'Telefon', 'tel', 'tel', true, 30) +
      fld('email', 'E-mail', 'email', 'email', false, 100) + fld('address', 'Adresa úklidu', 'text', 'street-address', false, 160, 'ulice a číslo, obec') +
      '<label class="fld fld--full"><span>Poznámka <em>(nepovinné)</em></span><textarea data-f="note" rows="3" maxlength="1000" placeholder="např. zvíře doma, předání klíčů, parkování"></textarea></label>' +
      '<label class="hp" aria-hidden="true">Nevyplňujte <input data-f="web" tabindex="-1" autocomplete="off"></label></div>' +
      '<div class="form__err" data-err role="alert" hidden></div>' +
      '<p class="form__legal">Údaje použije Ivana jen k domluvě a provedení úklidu, víc v <a href="osobni-udaje.html">informacích o zpracování osobních údajů</a>. Rezervace je nezávazná, smlouva vznikne až po potvrzení termínu a ceny.</p>'
  };
  var ORDER = ['type', 'freq', 'size', 'level', 'extra', 'place', 'when', 'contact'];

  var STAMP = '<svg class="stamp" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="stampPath" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"/></defs>' +
    '<circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="100" cy="100" r="56" fill="none" stroke="currentColor" stroke-width="1"/>' +
    '<text font-size="12" letter-spacing="3.35" fill="currentColor" data-stamp><textPath href="#stampPath">PURE HOME · OSTRAVA · TERMÍN REZERVOVÁN · </textPath></text>' +
    '<path d="M78 101l15 15 30-32" fill="none" stroke="currentColor" stroke-width="4"/></svg>';

  host.innerHTML = '<div class="wrap"><div class="order__head"><h2 class="h2" id="rezervace-t" data-split>Sestavte si úklid.</h2><p class="lead" data-rv>Za minutu máte orientační cenu i volný termín v Ivanině kalendáři. Rezervace je nezávazná, Ivana vám ji potvrdí.</p></div>' +
    '<div class="order__grid"><div class="wiz" data-rv><div class="wiz__top"><div class="wiz__steps" aria-hidden="true"></div><span class="wiz__count" aria-live="polite"></span></div>' +
    '<div class="wiz__view">' + ORDER.map(function (k) { return '<section class="ws" data-s="' + k + '" aria-hidden="true">' + STEPS[k] + '</section>'; }).join('') +
    '<section class="ws ws--done" data-s="done" aria-hidden="true"></section></div>' +
    '<div class="wiz__nav"><button type="button" class="btn btn--ghost" data-prev>Zpět</button><button type="button" class="btn" data-next>Pokračovat</button></div></div>' +
    '<aside class="ticket" aria-label="Lístek s rezervací"><div class="ticket__card">' +
    '<div class="tk tk--front"><div class="tk__top"><img src="assets/img/logo-word.svg" alt="PURE HOME Ostrava" width="1080" height="196"><small>Rezervace úklidu<br>' + new Date().toLocaleDateString('cs-CZ') + '</small></div>' +
    '<ul class="tk__lines"></ul><div class="tk__total"><span>Orientačně</span><span class="odo"><small data-from></small><span class="odo__n" aria-hidden="true"></span><small>Kč</small><span class="sr" data-sr></span></span></div>' +
    '<p class="tk__fine">' + PR.notes.map(esc).join(' ') + '</p></div>' +
    '<div class="tk tk--back"><div class="tk__top"><img src="assets/img/logo-word.svg" alt="" width="1080" height="196"><small data-no></small></div>' +
    '<p class="tk__ready" data-ready>Termín je rezervovaný</p><div class="tk__big"><span class="odo2"></span></div><ul class="tk__keys" data-keys></ul>' + STAMP +
    (B.demo ? '<button type="button" class="tk__back" data-again>Zkusit ukázku znovu</button>' : '') + '</div>' +
    '</div></aside></div>' + ratesHTML() + '</div>';

  /* ---------- platba (ikony kreslené čarou) ---------- */
  function payHTML(lead) {
    var ICO = {
      cash: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="6.5" width="19" height="11" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M5.5 9.5v5M18.5 9.5v5" stroke="currentColor" stroke-width="1.3"/></svg>',
      qr: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 3.5h6v6h-6zM14.5 3.5h6v6h-6zM3.5 14.5h6v6h-6z" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M6 6h1v1H6zM17 6h1v1h-1zM6 17h1v1H6z" fill="currentColor" stroke="currentColor"/><path d="M14.5 14.5h2.5v2.5h-2.5zM18 18h2.5v2.5H18zM18 14.5h2.5M14.5 20.5H17" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>'
    };
    return '<div class="pay"><span class="pay__lead">' + esc(lead) + '</span>' + CT.pay.map(function (p) { return '<span class="pay__it">' + ICO[p[0]] + esc(p[1]) + '</span>'; }).join('') + '</div>';
  }
  C.payHTML = payHTML;

  /* ---------- ceník pod průvodcem ---------- */
  function ratesHTML() {
    var F = PR.frequencies;
    var matrix = '<table class="rtab"><caption>Ceník <small>Kč za hodinu práce</small></caption><thead>' +
      '<tr><th scope="col" rowspan="2">Znečištění</th><th scope="colgroup" colspan="3" class="rtab__grp">Běžný úklid</th><th scope="col" rowspan="2" class="rtab__gen">Generální úklid</th></tr>' +
      '<tr>' + F.map(function (f) { return '<th scope="col">' + esc(f.label) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      PR.levels.map(function (l) {
        return '<tr><th scope="row">' + esc(l.row) + '<small>' + esc(l.regularText) + '</small></th>' +
          F.map(function (f) { return '<td>' + C.fmt(l.regular[f.id]) + '</td>'; }).join('') + '<td class="rtab__gen">' + C.fmt(l.general) + '</td></tr>';
      }).join('') + '</tbody></table>';
    var time = '<table><caption>Kolik času to zabere</caption><thead><tr><th scope="col">Byt nebo dům</th><th scope="col">Běžný</th><th scope="col">Generální</th></tr></thead><tbody>' +
      PR.sizes.map(function (z) { return '<tr><th scope="row">' + esc(z.label) + (z.hint ? '<small>' + esc(z.hint) + '</small>' : '') + '</th><td>' + span(z.regular) + '</td><td>' + span(z.general) + '</td></tr>'; }).join('') + '</tbody></table>';
    var travel = '<table><caption>Doprava</caption><thead><tr><th scope="col">Kam</th><th scope="col">Cena</th></tr></thead><tbody>' +
      PR.travel.map(function (t) { return '<tr><th scope="row">' + esc(t.pick) + '</th><td>' + trPrice(t) + '</td></tr>'; }).join('') +
      '<tr><th scope="row">' + esc(PR.parking[0]) + '</th><td class="is-txt">' + esc(PR.parking[1]) + '</td></tr></tbody></table>';
    var hours = '<table><caption>Pracovní doba</caption><tbody>' + CT.hours.map(function (h) { return '<tr><th scope="row">' + esc(h[0]) + '</th><td class="is-txt">' + esc(h[1]) + '</td></tr>'; }).join('') + '</tbody></table>';
    return '<div class="order__rates" id="cenik"><div class="rates__main" data-rv>' + matrix +
      '<p class="order__note">Ceny jsou konečné, Ivana není plátce DPH. Minimální cena návštěvy je ' + kc(PR.minimum) + '. Biologické nečistoty, plísně, škůdce ani nebezpečný odpad neuklízíme.</p>' +
      payHTML('Platba až po úklidu') + '</div>' +
      '<div data-rv>' + time + '<p class="order__note">' + esc(PR.sizesNote) + '</p></div>' +
      '<div data-rv style="--d:100ms">' + travel + '<p class="order__note">' + esc(PR.travelNote) + '</p></div>' +
      '<div data-rv style="--d:200ms">' + hours + '<p class="order__note">Volná dopoledne a odpoledne uvidíte v kalendáři. Přesný čas začátku domluví Ivana s vámi.</p></div></div>';
  }

  var root = host, wiz = C.$('.wiz', root), steps = C.$$('.ws', root), doneEl = C.$('.ws--done', root);
  var view = C.$('.wiz__view', root), backT, sending = false;   /* skryté kroky čekají vpravo mimo pole: pohled se nesmí posunout do strany */
  view.addEventListener('scroll', function () { if (view.scrollLeft) view.scrollLeft = 0; });
  var bars = C.$('.wiz__steps', root), count = C.$('.wiz__count', root), prev = C.$('[data-prev]', root), next = C.$('[data-next]', root), nav = C.$('.wiz__nav', root);
  var ticket = C.$('.ticket', root), lines = C.$('.tk__lines', root), odoN = C.$('.odo__n', root), odoFrom = C.$('[data-from]', root), odoSr = C.$('[data-sr]', root);

  function active() { return ORDER.filter(function (k) { return k !== 'freq' || calc.type !== 'general'; }); }
  var cur = 'type';
  function canNext() {
    if (cur === 'type') return !!calc.type;
    if (cur === 'freq') return !!calc.freq;
    if (cur === 'size') return !!calc.size;
    if (cur === 'level') return !!calc.level;
    if (cur === 'place') return !!calc.travel;
    if (cur === 'when') return !!slotOn() || calc.noSlot;
    return true;
  }
  function stepDone(k) { return k === 'contact' ? formOk() : k === cur ? canNext() : true; }
  function show(k, dir) {
    var list = active(), i = list.indexOf(k); cur = k;
    steps.forEach(function (s) {
      var on = s.dataset.s === k;
      s.classList.toggle('is-back', !on && dir < 0);
      s.classList.toggle('is-on', on); s.setAttribute('aria-hidden', String(!on));
    });
    nav.hidden = k === 'done';
    if (k === 'done') { bars.innerHTML = list.map(function () { return '<i class="done"></i>'; }).join(''); count.textContent = 'Hotovo'; return; }
    if (k === 'when') { validateSel(); if (!avail) loadAvail(); else { renderCal(0); renderSide(); } }
    if (k === 'contact') { if (!calc.t0) calc.t0 = Date.now(); prefillAddress(); }
    bars.innerHTML = list.map(function (_, j) { return '<i class="' + (j < i || (j === i && stepDone(k)) ? 'done' : '') + '"></i>'; }).join('');
    prev.disabled = i === 0;
    sync();
  }
  function scrollToWiz() {
    var t = wiz.getBoundingClientRect().top;
    if (t < 0 || t > W.innerHeight * .35) W.scrollTo({ top: W.pageYOffset + t - (C.mobile() ? 76 : 100), behavior: C.RM ? 'auto' : 'smooth' });
  }
  function go(d) {
    var list = active(), i = list.indexOf(cur);
    if (d > 0 && i === list.length - 1) { submit(); return; }
    show(list[C.clamp(i + d, 0, list.length - 1)], d);
    if (C.mobile()) scrollToWiz();
  }
  prev.addEventListener('click', function () { if (!sending) go(-1); });
  next.addEventListener('click', function () { go(1); });

  /* ---------- volby ---------- */
  root.addEventListener('click', function (e) {
    var ch = e.target.closest('.choice');
    if (ch && ch.dataset.k) {
      var k = ch.dataset.k;
      calc[k] = ch.dataset.v;
      C.$$('.choice[data-k="' + k + '"]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b === ch)); });
      if (k === 'type') { sizeHints(); levelSync(); }
      if (k === 'freq') levelSync();
      if (k === 'travel') ringsSync();
      if (k === 'size') { setHours(mid(range(sizeOf(calc.size))), true); estimate(); }
      sync();
      if (k === 'type' || k === 'freq') setTimeout(function () { if (canNext()) go(1); }, 380);
      return;
    }
    var st = e.target.closest('.tg__hrs i');
    if (st) { e.stopPropagation(); var id = st.closest('.tg').dataset.a, s = calc.addons[id]; s.hours = C.clamp(s.hours + Number(st.dataset.d), 1, 8); st.parentNode.querySelector('output').textContent = hrs(s.hours); sync(); return; }
    var tg = e.target.closest('.tg'); if (tg) { toggleAddon(tg); return; }
    var rsvg = e.target.closest('.rings svg');
    if (rsvg) {
      var bb = rsvg.getBoundingClientRect(), kk = 260 / bb.width;
      var dist = Math.sqrt(Math.pow((e.clientX - bb.left) * kk - 130, 2) + Math.pow((e.clientY - bb.top) * kk - 130, 2));
      calc.travel = dist <= CITY + 4 ? 't0' : dist <= RAD.t10 + 8 ? 't10' : dist <= RAD.t20 + 8 ? 't20' : 't99';
      C.$$('.choice[data-k="travel"]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === calc.travel)); });
      ringsSync(); sync(); return;
    }
    var m = e.target.closest('[data-m]'); if (m) { month = C.clamp(month + Number(m.dataset.m), 0, 2); renderCal(Number(m.dataset.m)); return; }
    var day = e.target.closest('[data-date]'); if (day && !day.disabled) { pickDate(day.dataset.date); return; }
    var sl = e.target.closest('[data-slot]'); if (sl && !sl.disabled) { calc.part = sl.dataset.slot; renderSide(); renderCal(0); sync(); return; }
    if (e.target.closest('[data-noslot]')) { calc.noSlot = !calc.noSlot; if (calc.noSlot) { calc.date = null; calc.part = null; } renderCal(0); renderSide(); sync(); return; }
    if (e.target.closest('[data-retry]')) { loadAvail(true); return; }
    if (e.target.closest('[data-demoreset]')) { B.reset(); calc.date = null; calc.part = null; loadAvail(true); C.toast('Ukázkové rezervace jsou smazané.'); return; }
    if (e.target.closest('[data-again]')) { resetAll(); return; }
    if (e.target.closest('[data-share]')) { share(); return; }
    var rm = e.target.closest('[data-rmphoto]'); if (rm) { URL.revokeObjectURL(photos[Number(rm.dataset.rmphoto)].url); photos.splice(Number(rm.dataset.rmphoto), 1); renderPhotos(); return; }
  });
  root.addEventListener('keydown', function (e) { var tg = e.target.closest('.tg'); if (tg && e.target === tg && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); toggleAddon(tg); } });
  root.addEventListener('input', function (e) {
    if (e.target.matches('[data-town]')) { calc.town = e.target.value.trim(); sync(); return; }
    var f = e.target.dataset && e.target.dataset.f;
    if (f) { calc.f[f] = e.target.value; if (e.target.closest('.fld.is-bad')) checkField(f); if (cur === 'contact') { C.$$('.wiz__steps i', root)[active().length - 1].classList.toggle('done', formOk()); } }
  });
  root.addEventListener('focusout', function (e) { var f = e.target.dataset && e.target.dataset.f; if (f && calc.f[f]) checkField(f); });
  function toggleAddon(tg) { var s = calc.addons[tg.dataset.a]; s.on = !s.on; tg.setAttribute('aria-pressed', String(s.on)); sync(); }
  /* u znečištění se ukazuje sazba pro zvolený druh a četnost úklidu */
  function levelSync() {
    var type = calc.type || 'regular', f = calc.freq || 'weekly';
    PR.levels.forEach(function (l) {
      var t = C.$('[data-lt="' + l.id + '"]', root), r = C.$('[data-lr="' + l.id + '"]', root);
      if (t) t.textContent = type === 'general' ? l.generalText : l.regularText;
      if (r) r.textContent = kc(rateOf(type, f, l)) + '/h';
    });
  }
  function sizeHints() { PR.sizes.forEach(function (z) { var el = C.$('[data-sz="' + z.id + '"]', root); if (el) el.textContent = span(range(z)); }); if (calc.size) { setHours(mid(range(sizeOf(calc.size))), true); estimate(); } }
  function estimate() {
    var el = C.$('[data-est]', root), z = sizeOf(calc.size); if (!el || !z) return;
    var r = range(z), e = mid(r);
    el.innerHTML = calc.hours === e ? '<b>' + esc(z.label) + '</b>: ' + (calc.type === 'general' ? 'generální' : 'běžný') + ' úklid trvá zhruba ' + span(r) + (z.hint ? ', ' + esc(z.hint) : '') + '. Do odhadu jsme dali ' + hrs(e) + ', ciferníkem ho můžete změnit.'
      : 'Upravili jste odhad na <b>' + hrs(calc.hours) + '</b>. Ivana ho potvrdí podle fotek.';
  }
  function ringsSync() {
    C.$$('circle.r', root).forEach(function (c) { c.classList.toggle('on', c.getAttribute('data-v') === calc.travel); });
    C.$('circle.city', root).classList.toggle('on', calc.travel === 't0');
    C.$('circle.fillr', root).style.transform = 'scale(' + (calc.travel ? RAD[calc.travel] / 106 : 0) + ')';
  }

  /* ---------- ciferník ---------- */
  var face = C.$('.dial__face', root), dialEl = C.$('.dial', root), arc = C.$('.dial__arc', root), knob = C.$('.dial__knob', root), hv = C.$('[data-h]', root), hw = C.$('[data-hw]', root);
  var MIN = PR.hourly.min, MAX = PR.hourly.max, STEP = PR.hourly.step, SPAN = 330;
  function setHours(h, auto) {
    calc.hours = C.clamp(Math.round(h / STEP) * STEP, MIN, MAX);
    var f = (calc.hours - MIN) / (MAX - MIN);
    dialEl.classList.toggle('is-auto', !!auto);
    arc.style.strokeDashoffset = (596.9 * (1 - f * SPAN / 360)).toFixed(1);
    knob.style.transform = 'rotate(' + (f * SPAN).toFixed(1) + 'deg)';
    hv.textContent = n1(calc.hours); hw.textContent = hWord(calc.hours);
    face.setAttribute('aria-valuenow', calc.hours); face.setAttribute('aria-valuetext', hrs(calc.hours));
    if (!auto) estimate();
    sync();
  }
  function fromPointer(e) {
    var b = face.getBoundingClientRect(), x = e.clientX - (b.left + b.width / 2), y = e.clientY - (b.top + b.height / 2);
    var a = Math.atan2(y, x) * 180 / Math.PI + 90; if (a < 0) a += 360;
    if (a > SPAN) a = a > SPAN + (360 - SPAN) / 2 ? 0 : SPAN;
    setHours(MIN + a / SPAN * (MAX - MIN));
  }
  face.addEventListener('pointerdown', function (e) { dialEl.classList.add('is-drag'); face.setPointerCapture(e.pointerId); fromPointer(e); });
  face.addEventListener('pointermove', function (e) { if (dialEl.classList.contains('is-drag')) fromPointer(e); });
  face.addEventListener('pointerup', function () { dialEl.classList.remove('is-drag'); });
  face.addEventListener('pointercancel', function () { dialEl.classList.remove('is-drag'); });
  face.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setHours(calc.hours + STEP); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setHours(calc.hours - STEP); }
  });
  C.$$('.dial__btns button', root).forEach(function (b) { b.addEventListener('click', function () { setHours(calc.hours + Number(b.dataset.d) * STEP); }); });

  /* ---------- kalendář s obsazeností ---------- */
  var month = 0, today = new Date(), avail = null, availErr = false;
  today.setHours(12, 0, 0, 0);
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function slotsOf(id) { return avail && avail.slots[id] || ''; }
  function fits(s) { return needDay() ? s === 'vv' : s.indexOf('v') >= 0; }
  function stateText(s) { return s === 'vv' ? 'volno dopoledne i odpoledne' : s === 'vx' ? 'volno jen dopoledne' : s === 'xv' ? 'volno jen odpoledne' : 'obsazeno'; }
  function loadAvail(force) {
    availErr = false; if (force) avail = null; renderCal(0); renderSide();
    B.load(force).then(function (j) { avail = j; validateSel(); renderCal(0); renderSide(); sync(); })
      .catch(function () { avail = null; availErr = true; renderCal(0); renderSide(); sync(); });
  }
  /* výběr musí sedět na aktuální obsazenost i délku úklidu (delší úklid zabere celý den) */
  function validateSel() {
    if (!calc.date || !avail) return;
    var s = slotsOf(calc.date), nd = needDay(), was = calc.part;
    if (!s || !fits(s)) { calc.date = null; calc.part = null; }
    else if (nd) calc.part = 'day';
    else if (calc.part === 'day' || (calc.part && s.charAt(calc.part === 'am' ? 0 : 1) !== 'v')) calc.part = s === 'vx' ? 'am' : s === 'xv' ? 'pm' : null;
    if (was && !calc.part) C.toast('Vybraný termín už nesedí, vyberte prosím jiný.');
  }
  function renderCal(dir) {
    var base = new Date(today.getFullYear(), today.getMonth() + month, 1, 12);
    C.$('[data-month]', root).textContent = base.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' });
    C.$('[data-m="-1"]', root).disabled = month === 0; C.$('[data-m="1"]', root).disabled = month === 2;
    var lead = (base.getDay() + 6) % 7, dim = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate(), html = '';
    for (var i = 0; i < lead; i++) html += '<span></span>';
    for (var d = 1; d <= dim; d++) {
      var dt = new Date(base.getFullYear(), base.getMonth(), d, 12), id = iso(dt), wd = dt.getDay(), s = slotsOf(id);
      var closed = BK.closed.indexOf(wd) >= 0 || s === 'zz', ok = !!s && !closed && fits(s), sel = !calc.noSlot && calc.date === id;
      var cls = 'd' + (wd === 6 ? ' is-sat' : '') + (closed ? ' is-closed' : '') + (s && !closed && !ok ? ' is-full' : '') + (sel ? ' is-sel' : '');
      var bar = s && !closed ? '<i class="d__s" aria-hidden="true"><b class="' + (s.charAt(0) === 'v' ? 'f' : 'x') + '"></b><b class="' + (s.charAt(1) === 'v' ? 'f' : 'x') + '"></b></i>' : '';
      var lab = dt.toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long' }) + ', ' + (closed ? 'zavřeno' : !s ? 'nelze rezervovat' : ok ? stateText(s) : 'obsazeno') + (wd === 6 && ok ? ', příplatek ' + SAT : '');
      html += '<button type="button" class="' + cls + '" data-date="' + id + '"' + (ok ? '' : ' disabled') + ' aria-pressed="' + sel + '" aria-label="' + lab + '"><span>' + d + '</span>' + bar + '</button>';
    }
    var g = C.$('[data-grid]', root); g.innerHTML = html;
    if (dir && !C.RM) { g.style.transition = 'none'; g.style.opacity = 0; g.style.transform = 'translateX(' + (dir * 24) + 'px)'; void g.offsetWidth; g.style.transition = ''; g.style.opacity = 1; g.style.transform = 'none'; }
    var stt = C.$('[data-calstate]', root);
    stt.innerHTML = avail ? '' : availErr ? '<p>Volné termíny se teď nepodařilo načíst.</p><button type="button" class="btn btn--ghost btn--sm" data-retry>Zkusit znovu</button>' : '<p class="is-load">Načítám volné termíny…</p>';
    stt.classList.toggle('is-on', !avail);
  }
  function renderSide() {
    var side = C.$('[data-side]', root), html = '', nd = needDay();
    if (calc.noSlot) html += '<h4>Termín domluvíte s Ivanou</h4><p class="side__p">Ozve se vám a domluvíte termín, který vám oběma sedne.</p>';
    else if (!calc.date) html += '<h4>Vyberte den</h4><p class="side__p">' + (avail ? 'Klepněte v kalendáři na den, kde je volno.' : availErr ? 'Kalendář se nenačetl. Zkuste to znovu, nebo termín domluvte s Ivanou.' : 'Načítám volné termíny…') + '</p>';
    else {
      var s = slotsOf(calc.date) || 'xx';
      var opts = nd ? [['day', s === 'vv']] : [['am', s.charAt(0) === 'v'], ['pm', s.charAt(1) === 'v']];
      html += '<h4 class="side__day">' + esc(dLong(calc.date)) + '</h4><div class="slots">' + opts.map(function (o) {
        var on = calc.part === o[0];
        return '<button type="button" class="slot" data-slot="' + o[0] + '" aria-pressed="' + on + '"' + (o[1] ? '' : ' disabled') + '><b>' + esc(partOf(o[0]).label) + '</b><span>' + (o[1] ? (on ? 'vybráno' : 'volno') : 'obsazeno') + '</span></button>';
      }).join('') + '</div>' + (isSat(calc.date) ? '<p class="side__sat">Sobota: příplatek ' + SAT + ' k hodinové sazbě.</p>' : '');
    }
    if (nd && !calc.noSlot) html += '<p class="side__p">Úklid zabere zhruba ' + hrs(totalHours()) + ', proto se rezervuje celý den.</p>';
    if (!calc.noSlot) html += '<p class="side__p side__time">Přesný čas začátku domluví Ivana s vámi.</p>';
    html += '<button type="button" class="side__no" data-noslot>' + (calc.noSlot ? 'Vybrat termín v kalendáři' : 'Žádný termín mi nevyhovuje') + '</button>';
    side.innerHTML = html;
  }
  function pickDate(id) {
    var s = slotsOf(id), nd = needDay();
    calc.noSlot = false; calc.date = id;
    calc.part = nd ? 'day' : s === 'vx' ? 'am' : s === 'xv' ? 'pm' : (calc.part === 'am' || calc.part === 'pm') ? calc.part : null;
    renderCal(0); renderSide(); sync();
    if (C.mobile()) { var sd = C.$('[data-side]', root), r = sd.getBoundingClientRect(); if (r.bottom > W.innerHeight - 90) W.scrollBy({ top: r.bottom - W.innerHeight + 110, behavior: C.RM ? 'auto' : 'smooth' }); }
  }

  /* ---------- kontakt ---------- */
  function okName() { return calc.f.name.trim().length >= 2; }
  function okPhone() { return calc.f.phone.replace(/\D/g, '').length >= 9; }
  function okEmail() { var v = calc.f.email.trim(); return !v || /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v); }
  function formOk() { return okName() && okPhone() && okEmail(); }
  var MSG = { name: 'Vyplňte prosím jméno.', phone: 'Zadejte prosím telefon, aspoň 9 číslic.', email: 'Tenhle e-mail nevypadá správně.' };
  function checkField(f) {
    var ok = f === 'name' ? okName() : f === 'phone' ? okPhone() : f === 'email' ? okEmail() : true;
    var inp = C.$('[data-f="' + f + '"]', root); if (!inp) return ok;
    var lab = inp.closest('.fld'); lab.classList.toggle('is-bad', !ok); inp.setAttribute('aria-invalid', String(!ok));
    var er = C.$('.fld__err', lab); if (er) er.textContent = ok ? '' : MSG[f];
    return ok;
  }
  function prefillAddress() { var a = C.$('[data-f="address"]', root); if (a && !a.value && calc.town) { a.value = calc.town; calc.f.address = calc.town; } }

  /* ---------- lístek ---------- */
  var lastKeys = '';
  function whenText() {
    if (calc.noSlot) return '';
    if (!calc.date) return '';
    return dLabel(calc.date) + (calc.part ? ', ' + partOf(calc.part).label.toLowerCase() : '');
  }
  function sync() {
    var res = compute(), L = [];
    if (calc.type) L.push([calc.type === 'regular' ? 'Běžný úklid' : 'Generální úklid', calc.type === 'regular' && calc.freq ? freqOf(calc.freq).label : '']);
    if (calc.size) L.push([sizeOf(calc.size).label, '', 'is-muted']);
    if (calc.level) L.push(['Znečištění: ' + lvl(calc.level).row.toLowerCase(), '']);
    if (calc.type) L.push([hrs(calc.hours) + ' × ' + kc(res.rate), kc(res.work)]);
    if (calc.type && res.sat) L.push(['Sobota, příplatek ' + SAT, '+ ' + kc(res.satExtra)]);
    res.adds.forEach(function (a) { L.push(a); });
    if (res.min && calc.type) L.push(['Doplatek do minima ' + kc(PR.minimum), '+ ' + kc(PR.minimum - res.services), 'is-muted']);
    if (calc.travel) L.push(['Doprava ' + res.tr.label + (calc.town ? ' (' + calc.town + ')' : ''), trPrice(res.tr)]);
    if (whenText()) L.push(['Termín: ' + whenText(), '', 'is-term']);
    else if (calc.noSlot) L.push(['Termín domluvíte s Ivanou', '', 'is-muted']);
    if (!L.length) L.push(['Vyberte druh úklidu', '', 'is-muted']);
    var keys = L.map(function (x) { return x[0]; }).join('|');
    lines.innerHTML = L.map(function (x) { return '<li class="' + (x[2] || '') + '"' + (keys === lastKeys ? ' style="animation:none"' : '') + '><span>' + esc(x[0]) + '</span><span>' + esc(x[1]) + '</span></li>'; }).join('');
    lastKeys = keys;
    odoFrom.textContent = res.from ? 'od' : ''; setOdo(odoN, calc.type ? res.total : PR.minimum); odoSr.textContent = (res.from ? 'od ' : '') + kc(res.total);
    if (cur && cur !== 'done') {
      var list = active(), i = list.indexOf(cur);
      C.$$('.wiz__steps i', root).forEach(function (b, j) { b.classList.toggle('done', j < i || (j === i && stepDone(cur))); });
      next.disabled = !canNext() || sending;
      if (!sending) next.textContent = i === list.length - 1 ? (calc.noSlot ? 'Odeslat poptávku' : 'Rezervovat termín') : 'Pokračovat';
      count.textContent = 'Krok ' + (i + 1) + ' z ' + list.length + (C.mobile() && calc.type ? ' · ' + (res.from ? 'od ' : '') + kc(res.total) : '');
    }
  }
  function setOdo(el, v) {
    var s = C.fmt(v).replace(/ /g, ' ');
    if (el.dataset.len !== String(s.length)) {
      el.innerHTML = s.split('').map(function (ch) { return ch === ' ' ? '<span class="odo__s"></span>' : '<span class="odo__d"><i>' + '0123456789'.split('').map(function (n) { return '<b>' + n + '</b>'; }).join('') + '</i></span>'; }).join('');
      el.dataset.len = String(s.length); void el.offsetWidth;
    }
    var ds = C.$$('.odo__d i', el), k = 0;
    s.split('').forEach(function (ch) { if (ch === ' ') return; var d = ds[k++]; if (d) d.style.transform = 'translateY(' + (-Number(ch)) + 'em)'; });
  }

  /* ---------- zpráva a shrnutí ---------- */
  function placeText(cap1) {   /* „Hlučín, do 10 km od hranice Ostravy“ nebo „V Ostravě“ */
    var t = compute().tr.place;
    return calc.town ? calc.town + ', ' + t : cap1 ? cap(t) : t;
  }
  function rows() {
    var res = compute(), z = calc.size ? sizeOf(calc.size) : null;
    return [['Úklid', (calc.type === 'regular' ? 'Běžný' : 'Generální') + (calc.type === 'regular' && calc.freq ? ', ' + freqOf(calc.freq).label.toLowerCase() : '')],
      ['Domov', z ? z.label + ', odhad ' + hrs(calc.hours) : hrs(calc.hours)], ['Znečištění', lvl(calc.level).row],
      ['Navíc', res.adds.length ? res.adds.map(function (a) { return a[0]; }).join(', ') : 'nic'],
      ['Místo', placeText(true)], ['Termín', whenText() || 'domluvíte s Ivanou'],
      ['Orientační cena', (res.from ? 'od ' : '') + kc(res.total)]];
  }
  function plain(s) { return s.replace(/ /g, ' '); }
  function message() {
    var res = compute(), l = lvl(calc.level || 'bezna'), f = freqOf(calc.freq || 'weekly'), z = calc.size ? sizeOf(calc.size) : null;
    var adds = PR.addons.filter(function (a) { return calc.addons[a.id].on; }).map(function (a) { return a.label.toLowerCase() + (a.unit === 'hour' ? ' (' + hrs(calc.addons[a.id].hours) + ')' : ''); });
    return plain('Dobrý den, Ivano,\nmám zájem o ' + (calc.type === 'regular' ? 'běžný úklid (' + f.label.toLowerCase() + ')' : 'generální úklid') + '.\n' +
      (z ? 'Domov: ' + z.label + ', odhad ' + hrs(calc.hours) + '.\n' : '') +
      'Znečištění podle mě: ' + l.row.toLowerCase() + '.\n' +
      (adds.length ? 'Navíc: ' + adds.join(', ') + '.\n' : '') +
      'Místo: ' + placeText() + ' (doprava ' + (res.tr.price === null ? 'po domluvě' : res.tr.price === 0 ? 'zdarma' : res.tr.price + ' Kč') + ').\n' +
      (whenText() ? 'Termín: ' + whenText() + '.\n' : 'Termín bych domluvil(a) s vámi.\n') +
      'Orientační cena z webu: ' + (res.from ? 'od ' : '') + kc(res.total) + '.');
  }
  /* krátká zpráva k fotkám po odeslání rezervace */
  function photoMsg() {
    return plain('Dobrý den, Ivano, posílám fotky ' + (whenText() ? 'k rezervaci na ' + whenText() : 'k poptávce úklidu') + '.' + (calc.f.name.trim() ? ' ' + calc.f.name.trim() : ''));
  }

  /* ---------- odeslání ---------- */
  function submit() {
    if (sending) return;
    var bad = ['name', 'phone', 'email'].filter(function (f) { return !checkField(f); });
    if (bad.length) { var first = C.$('[data-f="' + bad[0] + '"]', root); if (first) first.focus(); return; }
    if (!calc.noSlot && !slotOn()) { show('when', -1); return; }
    sending = true; next.disabled = true; prev.disabled = true; next.textContent = 'Odesílám…'; setErr('');
    var res = compute();
    var data = { date: slotOn() ? calc.date : '', part: slotOn() ? calc.part : '', when: whenText(),
      name: calc.f.name.trim(), phone: calc.f.phone.trim(), email: calc.f.email.trim(), address: calc.f.address.trim(), note: calc.f.note.trim(),
      lines: rows().map(function (r) { return plain(r[0] + ': ' + r[1]); }), message: message(), total: plain((res.from ? 'od ' : '') + kc(res.total)),
      web: calc.f.web, t: Date.now() - (calc.t0 || Date.now()) };
    B.book(data).then(function (j) {
      sending = false; prev.disabled = false;
      if (j && j.ok) { finish(); return; }
      var er = j && j.error;
      if (er === 'taken' || er === 'closed') { calc.date = null; calc.part = null; sync(); show('when', -1); loadAvail(true); C.toast('Tento termín si mezitím někdo rezervoval. Vyberte prosím jiný.'); return; }
      fail(er);
    }).catch(function () { sending = false; prev.disabled = false; fail('network'); });
  }
  function setErr(html) { var el = C.$('[data-err]', root); el.innerHTML = html; el.hidden = !html; }
  function fail(er) {
    sync();
    var wa = 'https://wa.me/' + CT.whatsapp + '?text=' + encodeURIComponent(message()), ml = 'mailto:' + CT.email + '?subject=' + encodeURIComponent('Rezervace úklidu') + '&body=' + encodeURIComponent(message());
    setErr(er === 'limit' ? '<p>Z tohoto čísla už přišlo několik rezervací za sebou. Ozvěte se prosím Ivaně přímo na <a href="' + C.tel(CT.phone) + '">' + esc(CT.phone) + '</a>.</p>'
      : er === 'invalid' ? '<p>Zkontrolujte prosím jméno a telefon.</p>'
      : '<p>Rezervaci se nepodařilo odeslat. Zkuste to prosím znovu, nebo pošlete poptávku přes <a href="' + wa + '" target="_blank" rel="noopener">WhatsApp</a> či <a href="' + ml + '">e-mail</a>.</p>');
  }
  function finish() {
    var res = compute(), booked = slotOn();
    done(booked); show('done', 1);
    C.$('[data-no]', root).textContent = (booked ? 'Rezervace ' : 'Poptávka ') + new Date().toLocaleDateString('cs-CZ');
    C.$('[data-ready]', root).textContent = booked ? 'Termín je rezervovaný' : 'Poptávka je odeslaná';
    C.$('.odo2', root).innerHTML = (res.from ? '<small>od</small>' : '') + '<span class="odo__n" data-big></span><small>Kč</small>';
    C.$('[data-keys]', root).innerHTML = [[calc.type === 'regular' ? 'Běžný úklid' : 'Generální úklid', hrs(calc.hours)], ['Termín', whenText() || 'domluvíte s Ivanou'], ['Místo', placeText(true)]]
      .map(function (k) { return '<li><span>' + esc(k[0]) + '</span><span>' + esc(k[1]) + '</span></li>'; }).join('');
    clearTimeout(backT); ticket.classList.add('is-back', 'is-flip');
    stampText(booked ? 'PURE HOME · OSTRAVA · TERMÍN REZERVOVÁN · ' : 'PURE HOME · OSTRAVA · POPTÁVKA ODESLÁNA · ');   /* až když je zadní strana vidět, jinak nejde změřit */
    setTimeout(function () { setOdo(C.$('[data-big]', root), res.total); ticket.classList.add('is-stamped'); }, C.RM ? 0 : 850);
    scrollToWiz();
  }
  /* text razítka se natáhne přesně po obvodu kruhu */
  function stampText(t) {
    var tx = C.$('[data-stamp]', root), tp = tx && tx.firstChild; if (!tp) return;
    tp.textContent = t; tx.setAttribute('letter-spacing', '0');
    try { var len = tx.getComputedTextLength(), ls = (2 * Math.PI * 72 - len) / t.length; tx.setAttribute('letter-spacing', Math.max(0, ls).toFixed(2)); } catch (e) { tx.setAttribute('letter-spacing', '3.2'); }
  }
  var photos = [];
  function sendLinks() {
    var msg = photoMsg(), wa = C.$('[data-wa]', root), ml = C.$('[data-mail]', root);
    if (wa) wa.href = 'https://wa.me/' + CT.whatsapp + '?text=' + encodeURIComponent(msg);
    if (ml) ml.href = 'mailto:' + CT.email + '?subject=' + encodeURIComponent('Fotky k rezervaci úklidu') + '&body=' + encodeURIComponent(msg);
  }
  function renderPhotos() {
    var g = C.$('[data-photos]', root); if (!g) return;
    g.innerHTML = photos.map(function (p, i) { return '<figure><img src="' + p.url + '" alt="Fotka ' + (i + 1) + '"><button type="button" data-rmphoto="' + i + '" aria-label="Odebrat fotku">×</button></figure>'; }).join('');
    var c = C.$('[data-pcount]', root); if (c) c.textContent = photos.length ? photos.length + ' / 8 fotek' : 'Doporučujeme 5 až 8 fotek';
    sendLinks();
  }
  function done(booked) {
    var framed = true; try { framed = W.self !== W.top; } catch (e) {}
    var canShare = !!(navigator.share) && !framed;   /* ve sdíleném náhledu (iframe) sdílení nefunguje */
    var phone = calc.f.phone.trim();
    doneEl.innerHTML = '<div class="done"><svg class="done__check" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M20 33l8 8 17-18" fill="none" stroke="currentColor" stroke-width="2"/></svg>' +
      '<h3 class="ws__title">' + (booked ? 'Termín je rezervovaný.' : 'Poptávka je odeslaná.') + '</h3>' +
      '<p class="ws__hint">' + (booked ? 'Rezervace čeká na potvrzení. ' : '') + 'Ivana se vám ozve' + (phone ? ' na ' + esc(phone) : '') + ' a potvrdí ' + (booked ? 'cenu i přesný čas začátku.' : 'termín i cenu.') + '</p>' +
      '<dl class="done__sum">' + rows().map(function (r, i) { return '<div style="--k:' + i + '"><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl>' +
      payHTML('Platíte až po úklidu') +
      '<div class="photos"><div class="photos__head"><h4>Pošlete Ivaně fotky</h4><span data-pcount></span></div><p class="photos__hint">Kuchyň, sporák, koupelna, toaleta, podlaha a celkový pohled. Podle nich Ivana potvrdí rozsah a cenu.</p><div class="photos__grid" data-photos></div>' +
      '<label class="photos__add"><input type="file" accept="image/*" multiple data-file><span>+ Vybrat fotky</span></label></div>' +
      '<div class="done__send">' + (canShare ? '<button type="button" class="btn" data-share>Poslat fotky Ivaně</button>' : '') +
      '<a class="btn ' + (canShare ? 'btn--ghost' : '') + '" href="https://wa.me/' + CT.whatsapp + '" target="_blank" rel="noopener" data-wa>Fotky přes WhatsApp</a><a class="btn btn--ghost" href="mailto:' + CT.email + '" data-mail>Fotky e-mailem</a></div>' +
      '<p class="done__tip">' + (canShare ? 'Poslat fotky Ivaně pošle fotky i zprávu aplikací, kterou si vyberete. ' : '') + 'WhatsApp a e-mail otevřou zprávu s termínem, fotky k ní přidejte přímo tam.</p>' +
      '<p class="done__legal">Potřebujete něco změnit? Zavolejte nebo napište Ivaně na <a href="' + C.tel(CT.phone) + '">' + esc(CT.phone) + '</a>. <a href="podminky.html">Obchodní podmínky</a> · <a href="osobni-udaje.html">Osobní údaje</a></p>' +
      (B.demo ? '<p class="done__demo">Ukázka: nic se neodeslalo, termín se jen označil jako obsazený v tomto prohlížeči. Po napojení na Ivanin Kalendář Google se rezervace zapíše přímo k ní a přijde jí e-mail. <button type="button" data-again>Zkusit znovu</button></p>' : '') + '</div>';
    C.$('[data-file]', doneEl).addEventListener('change', function (e) {
      Array.prototype.slice.call(e.target.files || []).forEach(function (f) { if (photos.length < 8 && /^image\//.test(f.type)) photos.push({ file: f, url: URL.createObjectURL(f) }); });
      e.target.value = ''; renderPhotos();
    });
    renderPhotos();
  }
  function share() {
    var data = { title: 'Fotky k rezervaci úklidu · PURE HOME', text: photoMsg() };
    var files = photos.map(function (p) { return p.file; });
    if (files.length && navigator.canShare && navigator.canShare({ files: files })) data.files = files;
    navigator.share(data).catch(function (er) { if (er && er.name !== 'AbortError') C.toast('Sdílení se nepovedlo. Zkuste WhatsApp nebo e-mail.'); });
  }

  /* ---------- znovu od začátku (ukázka) ---------- */
  function resetAll() {
    photos.forEach(function (p) { URL.revokeObjectURL(p.url); }); photos = [];
    calc = fresh(); lastKeys = ''; month = 0;
    C.$$('[aria-pressed="true"]', root).forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    C.$$('input, textarea', root).forEach(function (i) { if (i.type !== 'file') i.value = ''; });
    C.$$('.fld.is-bad', root).forEach(function (l) { l.classList.remove('is-bad'); });
    C.$$('.tg__hrs output', root).forEach(function (o) { o.textContent = hrs(1); });
    C.$('[data-est]', root).textContent = 'Vyberte velikost a čas odhadneme.';
    ticket.classList.remove('is-flip', 'is-stamped');
    clearTimeout(backT); backT = setTimeout(function () { if (!ticket.classList.contains('is-flip')) ticket.classList.remove('is-back'); }, C.RM ? 0 : 1150);
    setErr(''); setHours(PR.hourly.start, true); sizeHints(); levelSync(); ringsSync();
    show('type', -1); loadAvail(true); scrollToWiz();
  }

  setHours(PR.hourly.start, true);
  sizeHints(); levelSync();
  renderCal(0); renderSide();
  show('type', 1);
  sync();
  /* obsazenost se načte s předstihem, než zákazník dojde ke kalendáři */
  if ('IntersectionObserver' in W) {
    var pre = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { pre.disconnect(); if (!avail) loadAvail(); } }, { rootMargin: '100% 0px 100% 0px' });
    pre.observe(host);
  } else loadAvail();
})(window, document);
