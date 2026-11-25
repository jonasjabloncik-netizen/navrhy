/* PURE HOME v9 · volné termíny a rezervace
   Živý režim: v data.js je booking.endpoint = adresa webové aplikace Google Apps Script,
   která čte a zapisuje Ivanin Kalendář Google (kód a návod: kalendar-google/).
   Ukázkový režim (endpoint je prázdný): obsazenost je vymyšlená a rezervace se uloží jen v tomto
   prohlížeči, a to jen den a část dne, žádné osobní údaje.

   Formát obsazenosti: { slots: { '2026-12-02': 'vx', ... } }, první znak je dopoledne, druhý odpoledne:
   v = volno, x = obsazeno, z = zavřeno. */
(function (W) {
  'use strict';
  var B = (W.PH && W.PH.booking) || {}, KEY = 'ph-ukazka-rezervace', pending = null;
  var demo = !B.endpoint;

  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  /* stálá „náhoda“ podle data, aby ukázka vypadala pokaždé stejně */
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; }
  function local() { try { return JSON.parse(W.localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }

  function demoSlots() {
    var t = new Date(); t.setHours(12, 0, 0, 0);
    var out = {}, from = '', to = '', days = B.days || 70, closed = B.closed || [0];
    for (var i = 1; i <= days; i++) {
      var d = new Date(t); d.setDate(t.getDate() + i);
      var k = iso(d), r = hash(k), r2 = hash(k + '/odpoledne'), near = i <= 10 ? .18 : 0;   /* nejbližší dny jsou plnější */
      out[k] = closed.indexOf(d.getDay()) >= 0 ? 'zz' : r < .06 + near / 3 ? 'xx' : (r < .3 + near ? 'x' : 'v') + (r2 < .34 + near ? 'x' : 'v');
      if (!from) from = k; to = k;
    }
    local().forEach(function (b) {
      var s = out[b.date]; if (!s || s === 'zz') return;
      var a = s.split(''); if (b.part !== 'pm') a[0] = 'x'; if (b.part !== 'am') a[1] = 'x'; out[b.date] = a.join('');
    });
    return { ok: true, from: from, to: to, slots: out, demo: true };
  }

  function timed(url, opt, ms) {
    var ctl = 'AbortController' in W ? new AbortController() : null, t;
    if (ctl) { opt.signal = ctl.signal; t = setTimeout(function () { ctl.abort(); }, ms); }
    return fetch(url, opt).then(function (r) { clearTimeout(t); if (!r.ok) throw new Error('http ' + r.status); return r.json(); });
  }

  W.PHB = {
    demo: demo,
    /* obsazenost; výsledek se drží v paměti, dokud se nic nerezervuje nebo se nevynutí nové načtení */
    load: function (force) {
      if (pending && !force) return pending;
      pending = demo ? new Promise(function (res) { setTimeout(function () { res(demoSlots()); }, 300); })
        : timed(B.endpoint + (B.endpoint.indexOf('?') < 0 ? '?' : '&') + 'action=slots&_=' + Date.now(), { method: 'GET' }, 12000)
          .then(function (j) { if (!j || !j.ok || !j.slots) throw new Error('data'); return j; });
      pending.catch(function () { pending = null; });
      return pending;
    },
    /* odeslání rezervace (s termínem) nebo poptávky (bez termínu) */
    book: function (data) {
      pending = null;
      if (demo) {
        return new Promise(function (res) {
          setTimeout(function () {
            if (data.date && data.part) {
              var l = local(); l.push({ date: data.date, part: data.part });
              try { W.localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) {}
            }
            res({ ok: true, demo: true });
          }, 900);
        });
      }
      /* text/plain: bez předběžného dotazu prohlížeče, Apps Script to přijme jako tělo požadavku */
      return timed(B.endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(data) }, 20000);
    },
    /* jen v ukázce: smaže rezervace uložené v tomto prohlížeči */
    reset: function () { try { W.localStorage.removeItem(KEY); } catch (e) {} pending = null; },
    hasLocal: function () { return local().length > 0; }
  };
})(window);
