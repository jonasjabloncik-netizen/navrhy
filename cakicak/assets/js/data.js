/* Caki·Cak – data návrhu (MALUS/01)
   Zdroj: živý e-shop cakicak.cz, stav 11. 11. 2026 (ceny, velikosti, dostupnost, texty).
   Fotky produktů se načítají přímo z CDN e-shopu (orig), příběhy jsou z Instagramu @cakicak.cz.
   Všechno na webu se vykresluje z tohoto souboru – pro jinou značku stačí vyměnit data. */
(function () {
  const CDN = 'https://cdn.myshoptet.com/usr/www.cakicak.cz/user/shop/orig/';
  const SHOP = 'https://www.cakicak.cz/';

  /* Tabulka velikostí Čakičak (https://www.cakicak.cz/tabulka-velikosti/):
     velikost se vybírá podle výšky dítěte, mezi dvěma velikostmi doporučují větší. */
  const SIZES = [
    { id: '56', label: '0–3M', cm: 56, age: [0, 3] },
    { id: '62', label: '3–6M', cm: 62, age: [3, 6] },
    { id: '68', label: '6–9M', cm: 68, age: [6, 9] },
    { id: '74', label: '9–12M', cm: 74, age: [9, 12] },
    { id: '80', label: '12–18M', cm: 80, age: [12, 18] },
    { id: '86', label: '18–24M', cm: 86, age: [18, 24] },
    { id: '92', label: '2 roky', cm: 92, age: [24, 36] },
    { id: '98', label: '3 roky', cm: 98, age: [36, 48] },
    { id: '104', label: '4 roky', cm: 104, age: [48, 60] },
    { id: '110', label: '5 let', cm: 110, age: [60, 72] }
  ];

  // velikost produktu: [štítek, cm, skladem 1/0, pokryté standardní velikosti]
  const S = (l, cm, ok, covers) => ({ l, cm, ok: !!ok, covers: covers || [String(cm)] });
  const std = (flags) => ['56', '62', '68', '74', '80', '86'].map((id, i) => flags[i] === null ? null : S(SIZES[i].label, SIZES[i].cm, flags[i])).filter(Boolean);
  const from62 = (a, b, c, d, e) => std([null, a, b, c, d, e]);
  const from56 = (a, b, c, d) => std([a, b, c, d, null, null]);
  const only56 = () => std([1, null, null, null, null, null]);

  const GOTS_TEXT = 'GOTS je mezinárodní standard pro organický textil. Kontroluje nejen samotné pěstování bavlny, ale i zpracování, barvení a sociální podmínky ve výrobě. U dětského oblečení to v praxi znamená jistotu, že v látce nezůstaly zbytky nežádoucích chemikálií.';
  const CARE = 'Prát na max. 30 °C s podobnými barvami, nebělit, žehlit na nízkou teplotu z lícové strany, nečistit chemicky, nesušit v sušičce.';
  const MAKER = {
    BabyCosy: { name: 'BabyCosy', maker: 'BABEKS TEKSTİL SANAYİ VE TİCARET LTD. ŞTİ.', place: 'Uşak, Turecko' },
    Nipperland: { name: 'Nipperland', maker: 'NIPPERLAND TEKSTİL SANAYİ VE TİCARET LTD. ŞTİ.', place: 'Bursa, Turecko' }
  };

  const P = [
    /* ---------- SETY ---------- */
    { id: '10dilny-kojenecky-set-flowers---pudrove-ruzova', name: '10dílný kojenecký set Flowers – pudrově růžová', price: 1920, brand: 'BabyCosy', line: 'den', col: 'Flowers', for: 'holcicky', cat: 'Sety', color: 'pudrově růžová', mat: '100% organická bavlna', gots: 1, tip: 1, pieces: 10,
      sizes: only56(), img: '541_caki-cak-900x1200-floral35.jpg', w: 900, h: 1200, bg: '#fefefe',
      desc: ['Sada sladěných kousků je praktickým řešením pro první měsíce a zároveň dobrým dárkem k narození miminka. Vše je v jednom balení a v jednotném provedení.', 'Střih je navržený tak, aby miminku nikde nepřekážel. Zpracování je jednoduché, bez ozdob, které by tlačily. Látka se po vyprání nesráží a drží si tvar.'] },
    { id: '10dilny-kojenecky-set-zirafa-bila-svetle-hneda', name: '10dílný kojenecký set Žirafa – bílá / světle hnědá', price: 1920, brand: 'BabyCosy', line: 'den', col: 'Žirafa', for: 'oba', cat: 'Sety', color: 'bílá / světle hnědá', mat: '100% organická bavlna', gots: 1, tip: 1, pieces: 10,
      sizes: only56(), img: '565_10dilny-kojenecky-set--prirodni-bila-svetle-hneda--rozmer-0-3m-.jpg', w: 1200, h: 1200, bg: '#e6e6e6',
      gallery: ['565_10dilny-kojenecky-set--prirodni-bila-svetle-hneda--rozmer-0-3m-.jpg', '565-2_10dilny-kojenecky-set--prirodni-bila-svetle-hneda--rozmer-0-3m-.jpg', '565-1_10dilny-kojenecky-set--prirodni-bila-svetle-hneda--rozmer-0-3m-.jpg'],
      desc: ['Set, ve kterém najdete vše potřebné na první dny. Hebká organická bavlna s certifikací GOTS miminku nikde nepřekáží.'] },
    { id: '10dilny-kojenecky-set-morsky-svet-bezova-matova', name: '10dílný kojenecký set Mořský svět – béžová / mátová', price: 1920, brand: 'BabyCosy', line: 'den', col: 'Mořský svět', for: 'chlapecky', cat: 'Sety', color: 'béžová / mátová', mat: '100% organická bavlna', gots: 1, tip: 1, pieces: 10,
      sizes: only56(), img: '727-33_10dilny-kojenecky-set---bezova-matova-174-351.jpg', w: 1200, h: 1200, bg: '#eaeaec',
      desc: ['Set, ve kterém najdete vše potřebné na první dny. 100% organická bavlna s certifikací GOTS zajišťuje příjemný pocit na pokožce a dobrou prodyšnost.'] },
    { id: '10dilny-kojenecky-set-ovecka---bila', name: '10dílný kojenecký set Ovečka – bílá', price: 1920, brand: 'BabyCosy', line: 'den', col: 'Ovečka', for: 'oba', cat: 'Sety', color: 'bílá', mat: '100% organická bavlna', gots: 1, tip: 1, pieces: 10,
      sizes: only56(), img: '763_10dilny-kojenecky-set-ovecka---kremova-141-386.jpg', w: 1200, h: 1200, bg: '#fefefe',
      gallery: ['763_10dilny-kojenecky-set-ovecka---kremova-141-386.jpg', '763-1_10dilny-kojenecky-set-ovecka---kremova-142-386.jpg', '763-2_10dilny-kojenecky-set-ovecka---kremova-143-386.jpg'] },
    { id: '5dilny-kojenecky-set-ovecka---bila', name: '5dílný kojenecký set Ovečka – bílá', price: 960, brand: 'BabyCosy', line: 'den', col: 'Ovečka', for: 'oba', cat: 'Sety', color: 'bílá', mat: '100% organická bavlna', gots: 1, tip: 1, pieces: 5,
      sizes: only56(), img: '760_5dilny-kojenecky-set-ovecka---kremova-141-385.jpg', w: 1200, h: 1200, bg: '#fefefe',
      gallery: ['760_5dilny-kojenecky-set-ovecka---kremova-141-385.jpg', '760-3_5dilny-kojenecky-set-ovecka---kremova-144-385.jpg', '760-1_5dilny-kojenecky-set-ovecka---kremova-142-385.jpg', '760-2_5dilny-kojenecky-set-ovecka---kremova-143-385.jpg'],
      inSet: { note: 'podle fotky produktu', items: ['zavinovací kabátek', 'kalhoty s ťapkami', 'čepička', 'bryndáček', 'rukavičky'] },
      desc: ['Set, který pokryje první týdny doma i pobyt v porodnici. Hebká organická bavlna s certifikací GOTS miminku nikde nepřekáží.', 'Set šetří čas i rozhodování – místo skládání výbavičky po jednotlivých kouscích dostanete sladěný celek. Kousky se dají nosit společně i rozdělit ke zbytku šatníku.'] },
    { id: '5dilny-kojenecky-set-maslicky---kremova-a-pudrove-ruzova', name: '5dílný kojenecký set Mašličky – krémová a pudrově růžová', price: 960, brand: 'BabyCosy', line: 'den', col: 'Mašličky', for: 'holcicky', cat: 'Sety', color: 'krémová, pudrově růžová', mat: '100% organická bavlna', gots: 1, pieces: 5,
      sizes: only56(), img: '688-5_5dilny-kojenecky-set---kremova-a-pudrove-ruzova--rozmer-0-3m-.jpg', w: 800, h: 1200, bg: '#ffffff',
      desc: ['Set sladěných kousků, které se dají kombinovat mezi sebou. 100% organická bavlna s certifikací GOTS příjemně hřeje, dobře dýchá a na pokožce neškrábe.'] },
    { id: '5dilny-kojenecky-set-little-princess---ruzova', name: '5dílný kojenecký set Little Princess – růžová', price: 960, brand: 'BabyCosy', line: 'den', col: 'Little Princess', for: 'holcicky', cat: 'Sety', color: 'růžová', mat: '100% organická bavlna', gots: 1, tip: 1, pieces: 5,
      sizes: only56(), img: '820_5dilny-kojenecky-set---ruzova-141-437.jpg', w: 960, h: 1200, bg: '#ffffff' },
    { id: '5dilny-kojenecky-set-balonky---prirodni-bila-piskova', name: '5dílný kojenecký set Balónky – přírodní bílá / písková', price: 960, brand: 'BabyCosy', line: 'den', col: 'Balónky', for: 'oba', cat: 'Sety', color: 'přírodní bílá / písková', mat: '100% organická bavlna', gots: 1, pieces: 5,
      sizes: only56(), img: '502-2_5dilny-kojenecky-set---prirodni-bila-piskova-143-97.jpg', w: 800, h: 1200, bg: '#d4d5d7',
      desc: ['Set, který pokryje první týdny doma i pobyt v porodnici. Ušité ze 100% organické bavlny s certifikací GOTS, jemné i k té nejcitlivější dětské pokožce.'] },
    { id: '3dilny-set-flowers---ruzova', name: '3dílný set Flowers – růžová', price: 770, brand: 'BabyCosy', line: 'den', col: 'Flowers', for: 'holcicky', cat: 'Sety', color: 'růžová', mat: '100% organická bavlna', gots: 1, pieces: 3,
      sizes: from62(0, 1, 1, 1, 1), img: '523_caki-cak-900x1200-floral28.jpg', w: 900, h: 1200, bg: '#fefefe',
      desc: ['Set sladěných kousků, které se dají kombinovat mezi sebou. Měkká 100% organická bavlna s certifikací GOTS je příjemná po celý den, doma i venku.'] },
    { id: '8dilny-set-pro-miminko---bila', name: '8dílný set pro miminko – bílá', price: 2650, brand: 'Nipperland', line: 'premium', col: null, for: 'holcicky', cat: 'Sety', color: 'bílá', mat: '100% bavlna, šatičky 100% polyester', pieces: 8,
      sizes: only56(), img: '1735-1_8dilny-set-pro-miminko---bila-55-526.jpg', w: 1200, h: 1200, bg: '#e8e8e8',
      desc: ['Kompletní sada oblečení v jednom balení. Materiálem je 100% bavlna kromě šatiček, které jsou ze 100% polyesteru. Měkká na dotek a dobře prodyšná.'] },
    { id: '10dilny-set-pro-miminko---bezova', name: '10dílný set pro miminko – béžová', price: 2510, brand: 'Nipperland', line: 'premium', col: null, for: 'oba', cat: 'Sety', color: 'béžová', mat: '100% bavlna', tip: 1, pieces: 10,
      sizes: only56(), img: '1711_10dilny-set-pro-miminko---bezova-44-503.jpg', w: 1200, h: 1200, bg: '#e6e4e2' },

    /* ---------- COSY ---------- */
    { id: 'souprava-mikina-a-kalhoty-cosy---ruzova', name: 'Souprava mikina a kalhoty COSY – růžová', short: 'Souprava COSY', price: 660, brand: 'BabyCosy', line: 'den', col: 'COSY', for: 'holcicky', cat: 'Soupravy a komplety', color: 'růžová', swatch: '#efc9cf', mat: '47 % bavlna, 47 % modal, 6 % elastan',
      sizes: from62(0, 1, 0, 1, 0), img: '589_caki-cak-900x1200-cosy6.jpg', w: 900, h: 1200, bg: '#f6f6f6',
      desc: ['Souprava obsahuje dva sladěné díly, které se dají nosit dohromady i zvlášť. Odpadá dohledávání, co se k čemu hodí – stačí obléct a je hotovo.', 'Bavlna s modalem dává látce charakteristickou hladkost, kterou na dotek poznáte hned. Díky příměsi elastanu má materiál příjemnou pružnost, takže se dobře obléká a miminko v něm má volnost pohybu.', 'Souprava se hodí na doma, do školky, na návštěvu i na procházku.'] },
    { id: 'souprava-mikina-a-kalhoty-cosy---svetle-ruzova', name: 'Souprava mikina a kalhoty COSY – světle růžová', short: 'Souprava COSY', price: 660, brand: 'BabyCosy', line: 'den', col: 'COSY', for: 'holcicky', cat: 'Soupravy a komplety', color: 'světle růžová', swatch: '#f6dcd6', mat: '47 % bavlna, 47 % modal, 6 % elastan',
      sizes: from62(1, 1, 0, 0, 0), img: '598-1_teplakovka-ruzova-900x1200.jpg', w: 900, h: 1200, bg: '#f6f5f6',
      desc: ['Dvoudílná souprava, kde na sebe horní i spodní díl ladí. Hebká směs bavlny a modalu se příjemně přizpůsobí každému pohybu.'] },
    { id: 'souprava-mikina-a-kalhoty-cosy---nebesky-modra-2', name: 'Souprava mikina a kalhoty COSY – nebesky modrá', short: 'Souprava COSY', price: 660, brand: 'BabyCosy', line: 'den', col: 'COSY', for: 'chlapecky', cat: 'Soupravy a komplety', color: 'nebesky modrá', swatch: '#bcd5ee', mat: '47 % bavlna, 47 % modal, 6 % elastan',
      sizes: from62(0, 0, 0, 1, 0), img: '628_caki-cak-900x1200-cosy55.jpg', w: 900, h: 1200, bg: '#fbfafb',
      desc: ['Souprava pro dny, kdy je potřeba obléct miminko rychle. Bavlna s modalem dává materiálu hedvábně hladký omak a příjemnou pružnost.'] },
    { id: 'souprava-mikina-a-kalhoty-cosy---sedobezova', name: 'Souprava mikina a kalhoty COSY – šedobéžová', short: 'Souprava COSY', price: 660, brand: 'BabyCosy', line: 'den', col: 'COSY', for: 'chlapecky', cat: 'Soupravy a komplety', color: 'šedobéžová', swatch: '#c9bcad', mat: '47 % bavlna, 47 % modal, 6 % elastan',
      sizes: from62(0, 1, 0, 0, 0), img: '604_caki-cak-900x1200-cosy31.jpg', w: 900, h: 1200, bg: '#f6f5f5',
      desc: ['Praktická souprava na doma, do školky i na návštěvu. Materiál z bavlny a modalu je měkký, pružný a hezky drží tvar.'] },
    { id: 'souprava-mikina-a-kalhoty-cosy---prirodni-bila', name: 'Souprava mikina a kalhoty COSY – přírodní bílá', short: 'Souprava COSY', price: 660, brand: 'BabyCosy', line: 'den', col: 'COSY', for: 'chlapecky', cat: 'Soupravy a komplety', color: 'přírodní bílá', swatch: '#f1ece2', mat: '47 % bavlna, 47 % modal, 6 % elastan',
      sizes: from62(0, 1, 1, 1, 0), img: '616_caki-cak-900x1200-cosy44.jpg', w: 900, h: 1200, bg: '#f4f2f2',
      desc: ['Souprava, kterou lze nosit dohromady i rozdělit ke zbytku šatníku. Bavlna s příměsí modalu je hladká na dotek a dobře snáší časté praní.'] },
    { id: 'oversize-body-cosy---nebesky-modra', name: 'Oversize body COSY – nebesky modrá', short: 'Oversize body COSY', price: 440, brand: 'BabyCosy', line: 'den', col: 'COSY', for: 'chlapecky', cat: 'Body a dupačky', color: 'nebesky modrá', mat: '47 % bavlna, 47 % modal, 6 % elastan',
      sizes: from62(1, 1, 0, 0, 0), img: '622_caki-cak-900x1200-cosy49.jpg', w: 900, h: 1200, bg: '#fdfdfd',
      desc: ['Střih bodyčka je jednoduchý a promyšlený – nikde netlačí, nevyhrnuje se a pod dalším oblečením netvoří nepohodlné záhyby.', 'Modal je vlákno vyráběné z bukové celulózy a dodává látce hedvábně hladký omak a krásný splývavý vzhled.', 'Bodyčko je střižené s malou rezervou, aby miminku chvíli vydrželo a zároveň dobře sedělo. Pokud jste mezi dvěma velikostmi, vyplatí se sáhnout po větší – miminka rostou rychle.'] },
    { id: 'oversize-body-cosy---ruzova', name: 'Oversize body COSY – růžová', short: 'Oversize body COSY', price: 440, brand: 'BabyCosy', line: 'den', col: 'COSY', for: 'holcicky', cat: 'Body a dupačky', color: 'růžová', mat: '47 % bavlna, 47 % modal, 6 % elastan',
      sizes: from62(1, 1, 0, 0, 1), img: '586_caki-cak-900x1200-cosy3.jpg', w: 900, h: 1200, bg: '#fcfbfc',
      desc: ['Bodyčko s pohodlným střihem pro každodenní nošení. Směs bavlny a modalu je výjimečně hebká a krásně splývá po tělíčku. Patentky v rozkroku výrazně zrychlí přebalování.'] },
    { id: 'mikina-s-kapuci-cosy---nebesky-modra', name: 'Mikina s kapucí COSY – nebesky modrá', short: 'Mikina s kapucí COSY', price: 550, brand: 'BabyCosy', line: 'den', col: 'COSY', for: 'chlapecky', cat: 'Mikiny a svetry', color: 'nebesky modrá', mat: '47 % bavlna, 47 % modal, 6 % elastan',
      sizes: from62(1, 0, 0, 1, 0), img: '637_caki-cak-900x1200-cosy61.jpg', w: 900, h: 1200, bg: '#fdfdfd',
      desc: ['Vrstva navíc pro chladnější rána a večery. Modal ve složení zajišťuje jemnost a hladkost, elastan pak volnost pohybu.'] },
    { id: 'detske-kalhoty-cosy---sedobezova', name: 'Dětské kalhoty COSY – šedobéžová', short: 'Kalhoty COSY', price: 320, brand: 'BabyCosy', line: 'den', col: 'COSY', for: 'chlapecky', cat: 'Kalhoty a legíny', color: 'šedobéžová', mat: '47 % bavlna, 47 % modal, 6 % elastan',
      sizes: from62(0, 1, 0, 0, 0), img: '607_caki-cak-900x1200-cosy37.jpg', w: 900, h: 1200, bg: '#fdfdfd',
      desc: ['Jednoduché kalhoty, které v šatníku využijete denně. Bavlna s příměsí modalu je hladká na dotek a dobře snáší časté praní. Guma v pase je všitá tak, aby nezanechávala otlaky.'] },
    { id: 'hebke-ponozky-cosy--6-paru', name: 'Ponožky COSY, 6 párů', short: 'Ponožky COSY', price: 235, brand: 'BabyCosy', line: 'den', col: 'COSY', for: 'oba', cat: 'Ponožky', color: 'vícebarevná', mat: '100% bavlna',
      sizes: [S('0–6M', 62, 1, ['56', '62']), S('6–12M', 74, 1, ['68', '74']), S('12–24M', 86, 1, ['80', '86'])],
      img: '802_caki-cak-900x1200-corap14.jpg', w: 900, h: 1200, bg: '#fdfdfd',
      gallery: ['802_caki-cak-900x1200-corap14.jpg', '802-2_caki-cak-900x1200-corap12.jpg', '802-1_caki-cak-900x1200-corap11.jpg'],
      desc: ['Ponožky udrží nožičky v teple i ve dnech, kdy je doma chladněji. Lem je pružný, takže se nezařezává a ponožka zůstává na místě i při aktivním pohybu.', 'V balení najdete 6 párů. Díky tomu máte vždy čistý kus po ruce a nemusíte prát každý den.'] },

    /* ---------- FLOWERS & HOLČIČKY ---------- */
    { id: 'detske-saty-s-celenkou-flowers---prirodni-bila-2', name: 'Dětské šaty s čelenkou Flowers – přírodní bílá', short: 'Šaty s čelenkou Flowers', price: 490, brand: 'BabyCosy', line: 'den', col: 'Flowers', for: 'holcicky', cat: 'Šaty', color: 'přírodní bílá', mat: '100% organická bavlna', gots: 1,
      sizes: from62(0, 1, 1, 0, 1), img: '532_caki-cak-900x1200-floral32.jpg', w: 900, h: 1200, bg: '#f5f5f6',
      desc: ['Dětské šaty s jednoduchým, nadčasovým střihem. 100% organická bavlna s certifikací GOTS příjemně hřeje, dobře dýchá a na pokožce neškrábe. K šatům patří i čelenka.'] },
    { id: 'detske-dupacky-s-celenkou-flowers---ruzova', name: 'Dětské dupačky s čelenkou Flowers – růžová', short: 'Dupačky s čelenkou Flowers', price: 599, brand: 'BabyCosy', line: 'den', col: 'Flowers', for: 'holcicky', cat: 'Body a dupačky', color: 'růžová', mat: '100% organická bavlna', gots: 1,
      sizes: std([1, 1, null, null, null, null]), img: '514_caki-cak-900x1200-floral24.jpg', w: 900, h: 1200, bg: '#fefefe',
      desc: ['Dupačky s pohodlným střihem, ve kterých se miminko nevrtí. Základem je 100% organická bavlna s certifikací GOTS – prodyšná, hebká a šetrná k pokožce.'] },
    { id: 'kojenecke-kalhoty-s-tapkami-flowers--2-ks-v-baleni-kremova-a-ruzova', name: 'Kojenecké kalhoty s ťapkami Flowers, 2 ks – krémová a růžová', short: 'Kalhoty s ťapkami Flowers', price: 435, brand: 'BabyCosy', line: 'den', col: 'Flowers', for: 'holcicky', cat: 'Kalhoty a legíny', color: 'krémová, růžová', mat: '100% organická bavlna', gots: 1,
      sizes: std([1, 1, null, null, null, null]), img: '448_caki-cak-900x1200-floral19.jpg', w: 900, h: 1200, bg: '#fdfdfd',
      desc: ['Pohodlné kalhoty s všitými ťapkami ze 100% organické bavlny pro celodenní pohodlí. Měkká guma v pase neškrtí na bříšku a volánkový detail vypadá moc hezky.'] },
    { id: 'zatepleny-overal-na-zip-flowers---bila', name: 'Zateplený overál na zip Flowers – bílá', short: 'Zateplený overál Flowers', price: 710, brand: 'BabyCosy', line: 'den', col: 'Flowers', for: 'holcicky', cat: 'Body a dupačky', color: 'bílá', mat: '100% organická bavlna', gots: 1,
      sizes: [S('6–12M', 76, 1, ['68', '74']), S('12–18M', 80, 1), S('18–24M', 86, 0)], img: '553_caki-cak-900x1200-floral40.jpg', w: 900, h: 1200, bg: '#fbfbfb',
      desc: ['Praktický kousek, který nahradí celou sadu oblečení najednou. 100% organická bavlna s certifikací GOTS zajišťuje příjemný pocit na pokožce a dobrou prodyšnost.'] },

    /* ---------- CHLAPEČCI ---------- */
    { id: 'souprava-mikina-s-kapuci-a-kalhoty-zebra---seda', name: 'Souprava mikina s kapucí a kalhoty Zebra – šedá', short: 'Souprava Zebra', price: 599, brand: 'BabyCosy', line: 'den', col: 'Zebra', for: 'chlapecky', cat: 'Soupravy a komplety', color: 'šedá', mat: '70 % bavlna, 25 % polyester, 5 % elastan',
      sizes: from62(1, 0, 1, 0, 0), img: '643_souprava-mikina-s-kapuci-a-kalhoty---seda-141-271.jpg', w: 670, h: 1200, bg: '#f7f7f7',
      gallery: ['643_souprava-mikina-s-kapuci-a-kalhoty---seda-141-271.jpg', '643-1_souprava-mikina-s-kapuci-a-kalhoty---seda-142-271.jpg'],
      desc: ['Dvoudílná souprava s volnějším, pohodlným střihem. Praktická bavlněná směs, která si udrží barvu i tvar i při každodenním nošení.'] },
    { id: '2dilny-set-s-laclovym-overalem-zebra---seda', name: '2dílný set s laclovým overálem Zebra – šedá', short: 'Set s laclovým overálem Zebra', price: 550, brand: 'BabyCosy', line: 'den', col: 'Zebra', for: 'chlapecky', cat: 'Soupravy a komplety', color: 'šedá', mat: '70 % bavlna, 25 % polyester, 5 % elastan', pieces: 2,
      sizes: from62(1, 1, 1, 0, 0), img: '646_2dilny-set-s-laclovym-overalem---seda-141-276.jpg', w: 670, h: 1200, bg: '#ffffff',
      gallery: ['646_2dilny-set-s-laclovym-overalem---seda-141-276.jpg', '646-1_2dilny-set-s-laclovym-overalem---seda-142-276.jpg'],
      desc: ['Set, který pokryje první týdny doma i pobyt v porodnici. Praktická bavlněná směs, která si udrží barvu i tvar i při každodenním nošení.'] },
    { id: 'souprava-mikina-a-kalhoty-morsky-svet---bezova-matova', name: 'Souprava mikina a kalhoty Mořský svět – béžová / mátová', short: 'Souprava Mořský svět', price: 490, brand: 'BabyCosy', line: 'den', col: 'Mořský svět', for: 'chlapecky', cat: 'Soupravy a komplety', color: 'béžová / mátová', mat: '100% organická bavlna', gots: 1,
      sizes: from62(1, 1, 1, 1, 1), img: '718-9_souprava-mikina-a-kalhoty---bezova-matova-150-344.jpg', w: 1200, h: 1200, bg: '#f2f2f4',
      gallery: ['718-9_souprava-mikina-a-kalhoty---bezova-matova-150-344.jpg', '718-5_souprava-mikina-a-kalhoty---bezova-matova-146-344.jpg'],
      desc: ['Praktická souprava na doma, do školky i na návštěvu. Měkká 100% organická bavlna s certifikací GOTS je příjemná po celý den, doma i venku.'] },
    { id: 'souprava-mikina-s-kapuci-a-teplaky---indigo-modra', name: 'Souprava mikina s kapucí a tepláky Good – indigo modrá', short: 'Souprava Good', price: 480, brand: 'BabyCosy', line: 'den', col: 'Good', for: 'chlapecky', cat: 'Soupravy a komplety', color: 'indigo modrá', mat: '100% organická bavlna', gots: 1,
      sizes: from62(1, 0, 1, 0, 0), img: '577_souprava-bunda-s-kapuci-a-kalhoty---indigo-modra--rozmer-18-24m-.jpg', w: 1200, h: 1200, bg: '#eff0f5',
      desc: ['Souprava pro dny, kdy je potřeba obléct miminko rychle. 100% organická bavlna s certifikací GOTS zajišťuje příjemný pocit na pokožce a dobrou prodyšnost.'] },

    /* ---------- PRÉMIOVÁ ŘADA (Nipperland) ---------- */
    { id: 'detska-souprava-s-laclem---svetle-zelena', name: 'Dětská souprava s laclem – světle zelená', price: 1650, brand: 'Nipperland', line: 'premium', col: null, for: 'chlapecky', cat: 'Soupravy a komplety', color: 'světle zelená', mat: '100% bavlna', pieces: 3,
      sizes: from56(1, 0, 1, 1), img: '1705_detska-souprava-s-laclem---svetle-zelena-44-501.jpg', w: 1200, h: 1200, bg: '#e8e8e8',
      inSet: { note: 'z popisu produktu', items: ['pletený kardigan s copánkovým vzorem', 'bílé body s límečkem', 'laclové kalhoty na ramínka'] },
      desc: ['Třídílný set v olivově zelené barvě: pletený kardigan s copánkovým vzorem, bílé body s límečkem a laclové kalhoty na ramínka.'] },
    { id: 'detska-souprava-s-medvidkem---bezova', name: 'Dětská souprava s medvídkem – béžová', price: 1390, brand: 'Nipperland', line: 'premium', col: null, for: 'oba', cat: 'Soupravy a komplety', color: 'béžová', mat: '80 % akryl, 10 % elastan, 10 % polyamid',
      sizes: from56(1, 1, 1, 1), img: '1687_detska-souprava-s-medvidkem---bezova-44-483.jpg', w: 1200, h: 1200, bg: '#e8e8e8',
      desc: ['Béžový pletený set pro miminko se svetříkem s ozdobnou aplikací na přední straně a pletenými kalhotami. Svetřík se zapíná na knoflíky od ramene po bok a má žebrované lemy.'] },
    { id: 'detsky-overal-s-ousky---bezova', name: 'Dětský overal s oušky – béžová', price: 1530, brand: 'Nipperland', line: 'premium', col: null, for: 'oba', cat: 'Body a dupačky', color: 'béžová', mat: '100% bavlna',
      sizes: from56(1, 0, 1, 1), img: '1663_detsky-overal-s-ousky---bezova-44-466.jpg', w: 1200, h: 1200, bg: '#c9c5c5' },
    { id: 'detska-souprava-dzinova---seda', name: 'Dětská souprava džínová – šedá', price: 1999, brand: 'Nipperland', line: 'premium', col: null, for: 'chlapecky', cat: 'Soupravy a komplety', color: 'šedá', mat: '100% bavlna, košile 75 % bavlna a 25 % viskóza', pieces: 3,
      sizes: from62(1, 1, 1, 0, null), img: '1744_detska-souprava-dzinova---seda-44-535.jpg', w: 1200, h: 1200, bg: '#d5d0cd',
      inSet: { note: 'z popisu produktu', items: ['pletený kardigan s kapucí', 'lehká košile se stojáčkem', 'džínové kalhoty s manžetami'] },
      desc: ['Jednoduché kousky, které k sobě ladí a dají se rychle obléct. Kardigan, košile a džíny tvoří outfit vhodný na každý den i na příležitosti, kdy má dítě vypadat upraveně.', 'Kardigan je ze 100% bavlny, hrubě pletený a zapíná se na velké knoflíky, takže se snadno obléká a svléká. Kapuce chrání před chladem a žebrované lemy drží tvar.'] },
    { id: 'detsky-overal-lilya---pudrove-ruzova', name: 'Dětský overal Lilya – pudrově růžová', price: 1230, brand: 'Nipperland', line: 'premium', col: null, for: 'holcicky', cat: 'Body a dupačky', color: 'pudrově růžová', mat: '100% bavlna',
      sizes: from56(1, 1, 1, 1), img: '1696_detsky-overal-lilya---bezova-44-495.jpg', w: 1200, h: 1200, bg: '#e8e8e8' },
    { id: 'detska-souprava-ballerina---kremova', name: 'Dětská souprava Ballerina – krémová', price: 1410, brand: 'Nipperland', line: 'premium', col: null, for: 'holcicky', cat: 'Soupravy a komplety', color: 'krémová', mat: '100% bavlna',
      sizes: from56(1, 1, 1, 1), img: '1651_detska-souprava-ballerina---kremova-44-453.jpg', w: 1200, h: 1200, bg: '#e9e9e9' },

    /* ---------- DOPLŇKY ---------- */
    { id: 'detska-deka-s-oveckou---bila', name: 'Dětská deka s ovečkou – bílá', price: 550, brand: 'BabyCosy', line: 'den', col: 'Ovečka', for: 'oba', cat: 'Deky a dečky', color: 'bílá', mat: '100% organická bavlna', gots: 1,
      sizes: [], img: '772_detska-deka-s-oveckou---kremova-141-389.jpg', w: 800, h: 1200, bg: '#fdfdfd' }
  ];

  P.forEach((p) => {
    p.url = SHOP + p.id + '/';
    p.gallery = p.gallery || [p.img];
    p.maker = MAKER[p.brand];
  });

  const STORIES = [
    { id: 'cosy', title: 'COSY', img: 'assets/img/stories/pribeh-cosy.webp', pos: '50% 62%',
      text: 'Kdybych měla vybrat jedny z nejoblíbenějších kousků, tyhle teplákovky by tam rozhodně nesměly chybět. 🥹🤍',
      by: '@cakicak.cz', products: ['souprava-mikina-a-kalhoty-cosy---nebesky-modra-2', 'souprava-mikina-a-kalhoty-cosy---ruzova', 'souprava-mikina-a-kalhoty-cosy---svetle-ruzova', 'souprava-mikina-a-kalhoty-cosy---sedobezova', 'souprava-mikina-a-kalhoty-cosy---prirodni-bila'], pick: 'color' },
    { id: 'darky', title: 'Dárkové sety', img: 'assets/img/stories/pribeh-darkove-sety.webp', pos: '50% 70%',
      text: 'Pšššt… 🤫 Našly jsme dárek, který vykouzlí úsměv každé novopečené mamince. 🥹🎀',
      by: '@cakicak.cz', products: ['10dilny-kojenecky-set-ovecka---bila', '5dilny-kojenecky-set-little-princess---ruzova'], pick: 'list' },
    { id: 'overalky', title: 'Overálky', img: 'assets/img/stories/pribeh-overalky.webp', pos: '50% 55%',
      text: 'Naše dokonalé overálky na podzim a zimu! 🤍🍂 Některé s roztomilými oušky, jiné s bambulkou. 🧸',
      by: '@cakicak.cz', products: ['detsky-overal-s-ousky---bezova'], pick: 'one' },
    { id: 'zebra', title: 'Zebra', img: 'assets/img/stories/pribeh-zebra.webp', pos: '50% 40%',
      text: '🦓🤍 Zvířátka patří mezi nejoblíbenější motivy našich nejmenších.',
      by: '@cakicak.cz', products: ['2dilny-set-s-laclovym-overalem-zebra---seda', 'souprava-mikina-s-kapuci-a-kalhoty-zebra---seda'], pick: 'list' },
    { id: 'pribeh', title: 'Můj příběh', img: 'https://storage.googleapis.com/cakicak258424/monika-a-ruminka-uvod.jpg', pos: '30% 32%', contain: true,
      text: 'Vybírala jsem to, co bych vybrala pro svoji Ruminku.',
      by: '@bagarovamonika', products: [], link: { href: 'index.html#pribeh', label: 'Přečíst můj příběh' } }
  ];

  const SHIPPING = [
    { name: 'PPL Parcel CZ Smart – Box', price: 79 },
    { name: 'Balíkovna na výdejní místo', price: 89 },
    { name: 'GLS na výdejní místo', price: 95 },
    { name: 'Balíkovna na adresu', price: 109 },
    { name: 'GLS na adresu', price: 129 },
    { name: 'PPL na adresu', price: 149 }
  ];

  const HERO = {
    // Úvod jako na jejich webu: na prvních snímcích jsou Monika s Ruminkou (jejich vlastní slogany),
    // pak šev mezi světy Caki a Cak s kousky na ramínkách.
    scenes: [
      { id: 'radost', tab: 'Kousek radosti', dur: 7500, split: 0.5, mobile: 0.5, caki: 'detske-saty-s-celenkou-flowers---prirodni-bila-2', cak: 'souprava-mikina-a-kalhoty-cosy---nebesky-modra-2',
        portrait: {
          img: { src: 'assets/img/brand/monika-ruminka-studio.webp', alt: 'Monika Bagárová s dcerou Ruminkou v ateliéru Caki·Cak', pos: '50% 38%' },
          over: 'Ze srdce od Moniky Bagárové', title: ['Kousek', 'radosti'], lead: 'pro každý obyčejně neobyčejný den', cta: ['Chci krásný set', '#darky'],
          quote: 'Vybírala jsem to, co bych vybrala pro svoji Ruminku.', cite: 'Monika s Ruminkou' } },
      { id: 'laska', tab: 'Vybráno s láskou', dur: 7000, split: 0.5, mobile: 0.5, caki: 'detske-saty-s-celenkou-flowers---prirodni-bila-2', cak: 'souprava-mikina-a-kalhoty-cosy---nebesky-modra-2',
        portrait: {
          // banner z jejich webu, výřez s Monikou a malou Ruminkou (nad růžovou vlnou)
          img: { src: CDN.replace('/shop/orig/', '/banners/') + 'caki_cak2_-_1200x12002_pc2.jpg', alt: 'Monika se směje s malou Ruminkou v náručí', crop: { w: '438.1%', tx: '-58.58%' } },
          over: 'Ze srdce od Moniky Bagárové', title: ['Vybráno', 's láskou'], lead: 'jen pro vás', cta: ['Chci něco pěkného', '#vyber'],
          quote: 'Dětská móda mě bavila vždycky. Možná i víc než ta moje.', cite: 'Monika' } },
      { id: 'caki', tab: 'Caki · pro holčičky', split: 0.6, mobile: 0.86, caki: 'detske-saty-s-celenkou-flowers---prirodni-bila-2', cak: 'souprava-mikina-a-kalhoty-cosy---nebesky-modra-2' },
      { id: 'cak', tab: 'Cak · pro chlapečky', split: 0.4, mobile: 0.14, caki: 'detske-saty-s-celenkou-flowers---prirodni-bila-2', cak: 'souprava-mikina-a-kalhoty-cosy---nebesky-modra-2' }
    ]
  };

  window.CC = {
    CDN, SHOP, SIZES, PRODUCTS: P, STORIES, SHIPPING, HERO, GOTS_TEXT, CARE,
    byId: (id) => P.find((p) => p.id === id),
    img: (file) => (/^https?:|^assets\//.test(file) ? file : CDN + file),
    CONTACT: { mail: 'info@cakicak.cz', ig: 'https://www.instagram.com/cakicak.cz/', fb: 'https://www.facebook.com/share/1BgRtdUaww/', company: 'MB&TZ production s.r.o.', address: 'Školská 660/3, 110 00 Praha 1', ico: '29759986' },
    MONIKA: 'https://www.instagram.com/bagarovamonika/'
  };
})();
