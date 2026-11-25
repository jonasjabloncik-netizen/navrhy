/* PURE HOME Ostrava · koncept webu v8 od MALUS/01
   Veškerý obsah webu je tady. Stránky se z těchto dat vykreslují,
   takže úprava ceny, textu nebo kontaktu se dělá jen v tomto souboru.
   Právní texty (obchodní podmínky, poučení, formulář, osobní údaje) jsou v legal.js.

   Všechny kontakty, ceny, časy a údaje jsou od Ivany (podklady z 9. a 23. 11. 2026).
   K DOPLNĚNÍ před spuštěním:
   - contact.facebookUrl: odkaz na stránku PureHome Ostrava na Facebooku
   - legal.js: účinnost podmínek, konkrétní poskytovatelé a věta o cookies (návrh k potvrzení)
*/
window.PH = {
  brand: {
    name: 'PURE HOME',
    city: 'Ostrava',
    claim: 'Úklid domácností v Ostravě'
  },

  contact: {
    phone: '+420 728 614 373',
    whatsapp: '420728614373',                  /* číslo pro odkaz wa.me */
    email: 'purehomeostrava@gmail.com',
    instagram: 'purehomeostrava',
    facebook: 'PureHome Ostrava',
    facebookUrl: null,                         /* doplnit odkaz na stránku, do té doby jen název */
    owner: 'Ivana Hořínková',
    ico: '23691034',
    seat: 'Skalní 293/15, 793 42 Janovice u Rýmařova',
    vat: 'Neplátce DPH',
    area: 'Ostrava a okolí',
    hours: [['Pondělí–pátek', 'po domluvě'], ['Sobota', '+25\u00a0% k hodinové sazbě'], ['Neděle', 'zavřeno']],
    payment: 'Hotově nebo převodem přes QR kód, až po úklidu'
  },

  nav: [
    { id: 'den', label: 'Jak to probíhá' },
    { id: 'iva', label: 'Ivana' },
    { id: 'sluzby', label: 'Služby' },
    { id: 'rozsah', label: 'Co uděláme' },
    { id: 'poptavka', label: 'Poptávka' },
    { id: 'kontakt', label: 'Kontakt' }
  ],

  hero: {
    line: 'Úklid domácností · Ostrava a okolí',
    tag: 'Profesionální úklidové služby',       /* slogan z loga */
    title: 'Vrátíte se do čistého.',
    lead: 'Prémiový úklid domácností. Uklízí Ivana osobně, s vlastním vybavením. Cenu znáte předem.',
    cta: 'Poptat úklid',
    more: 'Jak to probíhá'
  },

  /* Příběh jednoho dne: slunce se při scrollu posouvá po stěně od rána do večera. */
  day: {
    label: 'Jak to probíhá',
    phases: [
      { when: 'Poptávka', title: 'Pošlete pár fotek.', text: 'Stačí 5 až 8 fotek nebo krátké video. Ivana podle nich potvrdí rozsah, termín i cenu.', chips: ['Kuchyň', 'Sporák', 'Koupelna', 'Toaleta', 'Podlaha', 'Celkový pohled'], photos: true },
      { when: 'Klíče', title: 'Nemusíte být doma.', text: 'Klíče můžete Ivaně předat předem. Jejich převzetí potvrdí předávacím protokolem, používá je jen k úklidu a nikomu je nedá.' },
      { when: 'Úklid', title: 'Ivana uklízí přesně podle domluvy.', text: 'Přijede ve sjednaný termín s vlastním vybavením a šetrnými prostředky. Od vás potřebuje jen přístup, vodu a elektřinu.', tasks: ['Podlahy vysáté a vytřené', 'Koupelna a baterie', 'Toaleta', 'Kuchyňská linka', 'Prach z přístupných ploch', 'Odpad vynesený'] },
      { when: 'Platba', title: 'Platíte až po úklidu.', text: 'Hotově nebo převodem přes QR kód. Domluvenou cenu bez vašeho souhlasu nenavýšíme.' },
      { when: 'Hotovo', title: 'Vrátíte se do čistého.', text: 'A příště stačí napsat. Každý týden, jednou za 14 dní, nebo jen když je potřeba.', cta: true }
    ]
  },

  /* Sekce o Ivaně. Text Ivana schválila, jen jméno je Ivana (ne Iva). */
  iva: {
    name: 'Ivana',
    role: 'Zakladatelka PURE HOME',
    photo: { src: 'assets/img/ivana-1086.webp', srcset: 'assets/img/ivana-720.webp 720w, assets/img/ivana-1086.webp 1086w', w: 1086, h: 1448, alt: 'Ivana, zakladatelka PURE HOME' },
    sig: { src: 'assets/img/podpis-ivana.svg', w: 1950, h: 719, alt: 'Podpis Ivany Hořínkové' },
    letter: [
      'Dobrý den, jsem Ivana a PURE HOME je moje firma.',
      'Ke každému úklidu přijedu sama, s vlastním vybavením a šetrnými prostředky. Než přijedu, poprosím vás o pár fotek, abychom se předem domluvili na rozsahu i ceně. Žádná překvapení, ani v ceně.',
      'Uklízím tak, jak bych to chtěla mít doma.'
    ],
    facts: [['Uklízí', 'Ivana osobně'], ['Kde', 'Ostrava a okolí'], ['Vybavení', 'vlastní, včetně prostředků'], ['Platba', 'až po úklidu']],
    team: 'Až nás bude víc, představím vám tu každou kolegyni.'
  },

  services: {
    title: 'Dva druhy úklidu. Vždy jasný rozsah.',
    regular: {
      name: 'Běžný úklid',
      text: 'Udržíme domácnost v pořádku. Každý týden, jednou za 14 dní, nebo jednorázově.',
      from: 400,
      rates: [['1× týdně', 400], ['1× za 14 dní', 430], ['Jednorázově', 450]],
      note: 'Sazby při běžném znečištění. Při zvýšeném od 480\u00a0Kč/h, při silném od 600\u00a0Kč/h.'
    },
    general: {
      name: 'Generální úklid',
      text: 'Do hloubky a do detailu. Kuchyň, koupelna, dveře, lišty, parapety i horní plochy skříní.',
      from: 500,
      rates: [['Běžné znečištění', 500], ['Zvýšené znečištění', 600], ['Silné znečištění', 700]]
    },
    note: 'Ceny jsou za hodinu práce a jsou konečné, Ivana není plátce DPH. V sobotu +25\u00a0% k hodinové sazbě, v neděli je zavřeno.'
  },

  /* Vybavení: přístroje jako výběr („mimo jiné“), body popisků jsou souřadnice na fotkách. */
  gear: {
    label: 'Vybavení',
    title: 'Profesionální vybavení.',
    lead: 'Všechno potřebné Ivana přiveze s sebou: přístroje, pomůcky i prostředky. Mimo jiné pracuje s těmito přístroji.',
    items: [
      { id: 'eta', kind: 'Aku vysavač', name: 'ETA Terier 3 v 1', text: 'Lehký bezsáčkový vysavač, který zvládne podlahy, koberce, spáry i čalounění.',
        stats: [['80', 'min', 'provozu na jedno nabití'], ['3 v 1', '', 'tyčový, ruční i na čalounění']],
        points: [[183, 1337, 'LED světla v hubici'], [262, 1262, 'Turbokartáč proti namotávání vlasů'], [992, 333, 'Cyklon bez sáčku'], [1060, 70, 'Senzor prachu sám přidá výkon']] },
      { id: 'karcher', kind: 'Parní čistič', name: 'Kärcher SC 3 EasyFix', text: 'Koupelny, spáry, baterie a dlažba jen horkou párou. Bez chemie, stačí čistá voda.',
        stats: [['3,5', 'bar', 'tlak páry'], ['30', 's', 'a je nahřátý']],
        points: [[150, 852, 'Pára pod tlakem až 3,5 baru'], [470, 600, 'Nahřeje se za 30 sekund'], [700, 470, 'Bez chemie, jen čistá voda']] }
    ],
    more: 'A k tomu šetrné prostředky Frosch'
  },

  /* Rozsah: co patří do běžného a co navíc do generálního úklidu (podle podkladů). */
  scope: {
    title: 'Co přesně uděláme.',
    lead: 'Rozsah je daný předem. Vyberte druh úklidu a uvidíte, co všechno obsahuje.',
    regularNote: 'Tohle uděláme při každém běžném úklidu.',
    generalNote: 'Generální úklid obsahuje všechno z běžného a navíc:',
    base: [
      'Vysajeme dostupné podlahy',
      'Utřeme prach z přístupných ploch',
      'Vyčistíme umyvadla a baterie',
      'Běžně vyčistíme sprchu nebo vanu',
      'Vytřeme podlahy',
      'Otřeme stoly a nábytek',
      'Vyčistíme toaletu',
      'Otřeme kuchyňskou pracovní desku',
      'Otřeme vnější plochy spotřebičů',
      'Vyneseme běžný odpad'
    ],
    general: [
      'Důkladněji vyčistíme kuchyň a koupelnu',
      'Umyjeme vnější plochy nábytku a spotřebičů',
      'Vyčistíme dveře, zárubně, kliky a vypínače',
      'Odstraníme prach i z horních ploch skříní',
      'Vyčistíme parapety a lišty',
      'Odsuneme nábytek, který jde bezpečně pohnout',
      'Odstraníme pavučiny',
      'Zvenku vyčistíme kuchyňská dvířka'
    ],
    excluded: [
      'Vnitřek trouby, lednice a kuchyňských skříněk (jde přiobjednat)',
      'Okna, vnitřní žaluzie, balkon, sklep a garáž (jde přiobjednat)',
      'Silně připálená mastnota',
      'Dlouhodobé nánosy vodního kamene',
      'Čištění koberců a tepování čalounění',
      'Posouvání těžkého nábytku a práce ve výškách',
      'Třídění osobních věcí',
      'Mytí nádobí',
      'Velký úklid rozházených věcí, třeba hraček'
    ],
    refuse: 'Biologické nečistoty, plísně, škůdce ani nebezpečný odpad neuklízíme.'
  },

  shelf: {
    title: 'Šetrné prostředky. Voní malinou.',
    text: 'Ivana uklízí ekologickými prostředky Frosch s ekoznačkou EU Ecolabel. Tři z nich voní malinou. Na připálenou troubu má český Real.'
  },
  pricing: {
    minimum: 1200,                             /* z prvních poznámek (7. 11.), v nových podmínkách není: potvrdit */
    hourly: { min: 2, max: 12, step: 0.5, start: 3 },
    saturday: 0.25,                            /* sobota +25 % k hodinové sazbě úklidu */
    /* Orientační časy pro jednu uklízečku (Ivana, 9. 11.). [od, do] v hodinách. */
    sizes: [
      { id: 's1', label: '1+kk nebo 1+1', regular: [2, 2.5], general: [3, 4] },
      { id: 's2', label: '2+kk nebo 2+1', regular: [2.5, 3.5], general: [5, 6] },
      { id: 's3', label: '3+kk nebo 3+1', regular: [4, 5], general: [6, 7] },
      { id: 's4', label: '4+kk nebo 4+1', regular: [5, 6], general: [6, 8.5] },
      { id: 's5', label: '5+kk nebo 5+1', regular: [6, 8], general: [8, 9.5] },
      { id: 's6', label: 'Rodinný dům', hint: 'záleží na velikosti', regular: [6, 10], general: [10, 11] }
    ],
    sizesNote: 'Uvedené časy jsou orientační pro jednu uklízečku. Skutečná délka úklidu závisí na velikosti nemovitosti, vybavení a míře znečištění.',
    /* Kdy se to hodí: Ivana nechce psát přesné časy, domlouvá je individuálně. */
    dayparts: [{ id: 'am', label: 'Dopoledne' }, { id: 'pm', label: 'Odpoledne' }, { id: 'any', label: 'Je mi to jedno' }],
    frequencies: [
      { id: 'weekly', label: '1× týdně' },
      { id: 'biweekly', label: '1× za 14 dní' },
      { id: 'once', label: 'Jednorázově' }
    ],
    /* Hodinové sazby: běžný úklid podle četnosti × znečištění, generální podle znečištění. */
    levels: [
      {
        id: 'bezna', label: 'Běžná', row: 'Běžné', regular: { weekly: 400, biweekly: 430, once: 450 }, general: 500,
        regularText: 'Udržovaná domácnost, běžný prach a nečistoty.',
        generalText: 'Domácnost se průběžně udržuje: prach, běžná mastnota a lehký vodní kámen.'
      },
      {
        id: 'zvysena', label: 'Zvýšená', row: 'Zvýšené', regular: { weekly: 480, biweekly: 510, once: 530 }, general: 600,
        regularText: 'Víc usazenin a mastnoty, zvířecí chlupy.',
        generalText: 'Dlouho neuklízená domácnost: výraznější mastnota, usazený vodní kámen, víc prachu a chlupů.'
      },
      {
        id: 'silna', label: 'Silná', row: 'Silné', regular: { weekly: 600, biweekly: 630, once: 650 }, general: 700,
        regularText: 'Dlouhodobě zanedbané plochy, výrazná mastnota, vodní kámen.',
        generalText: 'Silně zanesené povrchy, stará mastnota a výrazné usazeniny. Cenu upřesní podle fotek.'
      },
      {
        id: 'extremni', label: 'Extrémní', row: 'Extrémní', refuse: true,
        regularText: 'Biologické nečistoty, plísně, škůdci, nebezpečný odpad.',
        generalText: 'Biologické nečistoty, plísně, škůdci, nebezpečný odpad.'
      }
    ],
    addons: [
      { id: 'trouba', label: 'Trouba', note: 'běžné znečištění', price: 300, unit: 'fixed' },
      { id: 'lednice', label: 'Lednice', note: 'vyprázdněná', price: 250, unit: 'fixed' },
      { id: 'skrinky', label: 'Kuchyňské skříňky uvnitř', price: 380, unit: 'hour' },
      { id: 'okna', label: 'Okna včetně rámů', price: 390, unit: 'hour' },
      { id: 'zaluzie', label: 'Vnitřní žaluzie', price: 350, unit: 'hour' },
      { id: 'balkon', label: 'Balkon', note: 'pevná cena podle fotky', price: 350, unit: 'from' },
      { id: 'sklep', label: 'Sklep', price: 450, unit: 'hour' },
      { id: 'garaz', label: 'Garáž', price: 450, unit: 'hour' }
    ],
    addonsNo: 'Venkovní a elektrické žaluzie',
    /* Doprava podle vzdálenosti od hranice Ostravy, jedním směrem.
       label = krátce (lístek: „Doprava v Ostravě“), pick = volba v poptávce, place = do zprávy a přehledu. */
    travel: [
      { id: 't0', label: 'v Ostravě', pick: 'V Ostravě', place: 'v Ostravě', price: 0 },
      { id: 't10', label: 'do 10 km od Ostravy', pick: 'Do 10 km od hranice Ostravy', place: 'do 10 km od hranice Ostravy', price: 100 },
      { id: 't20', label: '10–20 km od Ostravy', pick: '10–20 km od hranice Ostravy', place: '10–20 km od hranice Ostravy', price: 200 },
      { id: 't99', label: 'dál než 20 km', pick: 'Dál než 20 km od Ostravy', place: 'dál než 20 km od Ostravy', price: null }
    ],
    parking: ['Placené parkování', 'podle skutečných nákladů'],
    travelNote: 'Vzdálenost se počítá od hranice Ostravy k místu úklidu jedním směrem. Případná cena dopravy bude vždy sdělena předem.',
    notes: [
      'Účtuje se podle skutečně odpracovaného času, nebo podle pevné ceny domluvené předem.',
      'Sjednanou cenu bez vašeho souhlasu nenavýšíme.',
      'Platíte až po úklidu, hotově nebo převodem přes QR kód.'
    ]
  },

  products: [
    {
      id: 'karcher', kind: 'tool', brand: 'Kärcher', name: 'SC 3 EasyFix Plus', type: 'Parní čistič',
      img: 'assets/img/karcher-sc3.webp', w: 1203, h: 998,
      text: 'Horkou párou čistíme podlahy, obklady, spáry a baterie. Podle výrobce čistí hygienicky a bez chemie.',
      facts: ['Tlak páry 3,5 baru', 'Příkon 1 900 W', 'Nádržka 1 l, dá se doplňovat za chodu']
    },
    {
      id: 'eta', kind: 'tool', brand: 'ETA', name: 'Terier 3 v 1', type: 'Aku tyčový vysavač',
      img: 'assets/img/eta-terier.webp', w: 1260, h: 1402,
      text: 'Bezsáčkový aku vysavač s LED osvětlením a turbokartáčem. S nástavci se dostane do spár i na čalounění.',
      facts: ['Provoz až 80 minut', 'LED osvětlení', 'Cyklonový, bez sáčku']
    },
    {
      id: 'spiritus', kind: 'bottle', tint: '#DDEBD8', brand: 'Frosch', name: 'Spiritus na sklo', vol: '500 ml',
      img: 'assets/img/p-spiritus.webp', w: 361, h: 1000, rel: 0.87, spray: [0.03, 0.03],
      text: 'Okna, zrcadla a sklo bez šmouh.', where: 'Koupelna, obývák, okna'
    },
    {
      id: 'soda', kind: 'bottle', tint: '#DCE7F1', brand: 'Frosch EKO', name: 'Sprej se sodou', vol: '500 ml',
      img: 'assets/img/p-soda.webp', w: 359, h: 1000, rel: 0.87, spray: [0.03, 0.035],
      text: 'Mastnota na kuchyňské lince a varné desce.', where: 'Kuchyň'
    },
    {
      id: 'univerzal', kind: 'bottle', tint: '#F6DCE4', malina: true, brand: 'Frosch EKO', name: 'Univerzální čistič Malina', vol: '1 l',
      img: 'assets/img/p-univerzal.webp', w: 343, h: 1000, rel: 1,
      text: 'S malinovým octem na povrchy v koupelně i kuchyni.', where: 'Celý byt'
    },
    {
      id: 'kamen', kind: 'bottle', tint: '#F4E1E7', malina: true, brand: 'Frosch EKO', name: 'Čistič vodního kamene s malinovým octem', vol: '500 ml',
      img: 'assets/img/p-kamen.webp', w: 359, h: 1000, rel: 0.87, spray: [0.03, 0.035],
      text: 'Baterie, sprchový kout a obklady.', where: 'Koupelna'
    },
    {
      id: 'wcgel', kind: 'bottle', tint: '#F2DDE5', malina: true, brand: 'Frosch EKO', name: 'WC gel Malina', vol: '750 ml',
      img: 'assets/img/p-wcgel.webp', w: 344, h: 1000, rel: 0.93,
      text: 'Toaleta bez vodního a močového kamene.', where: 'WC'
    },
    {
      id: 'real', kind: 'bottle', tint: '#E6E1DA', brand: 'Real', name: 'Na trouby, grily a krbová skla', vol: '550 g',
      img: 'assets/img/p-real.webp', w: 397, h: 1000, rel: 0.82,
      text: 'Připálená mastnota v troubě. Český výrobek.', where: 'Kuchyň, doplňková služba'
    }
  ],
  productsNote: 'Prostředky Frosch nesou ekoznačku EU Ecolabel a tři z nich voní malinou.',

  rules: {
    title: 'Férové podmínky, napsané jasně.',
    cancel: {
      title: 'Když potřebujete termín zrušit',
      free: ['Zdarma', 'zrušení nebo změna víc než 24 hodin předem'],
      late: ['Náhradní termín', 'později, nebo když se Ivana nedostane dovnitř'],
      axis: ['Domluva termínu', '24 h před', 'Začátek úklidu'],
      more: 'Celou cenu neprovedeného úklidu Ivana automaticky neúčtuje. Pokud vzniknou prokazatelné náklady, může požadovat jejich přiměřenou náhradu. Když termín zruší Ivana, neplatíte nic.'
    },
    items: [
      { title: 'Cena bez překvapení', text: 'Když je u vás víc práce, než ukázaly fotky, nejdřív se domluvíme. Bez vašeho souhlasu cenu nenavýšíme.' },
      { title: 'Klíče v bezpečí', text: 'Převzetí klíčů Ivana potvrdí předávacím protokolem. Používá je jen k úklidu a nikomu je nepředá.' },
      { title: 'Vaše soukromí', text: 'Fotky bytu slouží jen k nacenění. Bez vašeho svolení je nikdy nezveřejníme.' },
      { title: 'Reklamace', text: 'Když něco není v pořádku, dejte vědět co nejdřív. Oprávněnou reklamaci Ivana vyřeší nápravou nebo přiměřenou slevou, nejpozději do 30 dnů.' },
      { title: 'Co nebereme', text: 'Biologické nečistoty, plísně, škůdce ani nebezpečný odpad neuklízíme.' },
      { title: 'Platba', text: 'Až po úklidu, hotově nebo převodem přes QR kód. Na požádání dostanete doklad.' }
    ]
  },

  concept: {
    badge: 'Koncept od MALUS/01',
    footer: 'Návrh webu od studia MALUS/01. Pracovní verze. Produktové fotky patří jejich výrobcům (ETA, Kärcher, Frosch, Real).'
  }
};
