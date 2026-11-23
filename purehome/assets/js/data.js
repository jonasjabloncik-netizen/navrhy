/* PURE HOME Ostrava · koncept webu v7 od MALUS/01
   Veškerý obsah webu je tady. Stránky se z těchto dat vykreslují,
   takže úprava ceny, textu nebo kontaktu se dělá jen v tomto souboru.

   UKÁZKOVÉ HODNOTY (před spuštěním nahradit skutečnými):
   - contact.phone, contact.email, contact.ico  (kamarádka je zatím nemá)
   - iva.photo (fotka Ivy), iva.letter je návrh textu k úpravě
   - pricing.sizes: odhad času podle velikosti bytu je ukázkový, potvrdí Iva
   - pricing.starts: časy začátku jsou ukázkové (pracovní doba Ivy)
   - vop.provider.owner, vop.provider.seat, vop.validFrom
*/
window.PH = {
  brand: {
    name: 'PURE HOME',
    city: 'Ostrava',
    claim: 'Úklid domácností v Ostravě'
  },

  contact: {
    phone: '+420 123 456 789',
    email: 'info@purehome-ostrava.cz',
    ico: '12345678',
    sample: { phone: true, email: true, ico: true },
    area: 'Ostrava a okolí do 20\u00a0km',
    payment: 'Hotově nebo okamžitým převodem po úklidu'
  },

  nav: [
    { id: 'den', label: 'Jak to probíhá' },
    { id: 'iva', label: 'Iva' },
    { id: 'sluzby', label: 'Služby' },
    { id: 'rozsah', label: 'Co uděláme' },
    { id: 'poptavka', label: 'Poptávka' },
    { id: 'kontakt', label: 'Kontakt' }
  ],

  hero: {
    line: 'Úklid domácností · Ostrava a okolí',
    tag: 'Profesionální úklidové služby',       /* slogan z loga Ivy */
    title: 'Vrátíte se do čistého.',
    lead: 'Prémiový úklid domácností. Uklízí Iva osobně, s vlastním vybavením. Cenu znáte předem.',
    cta: 'Poptat úklid',
    more: 'Jak to probíhá'
  },

  /* Příběh jednoho dne: slunce se při scrollu posouvá po stěně od rána do večera. */
  day: {
    label: 'Jak to probíhá',
    phases: [
      { when: 'Poptávka', title: 'Pošlete pár fotek.', text: 'Stačí 5 až 8 fotek nebo krátké video. Iva podle nich potvrdí rozsah, termín i cenu.', chips: ['Kuchyň', 'Sporák', 'Koupelna', 'Toaleta', 'Podlaha', 'Celkový pohled'], photos: true },
      { when: 'Klíče', title: 'Nemusíte být doma.', text: 'Klíče můžete Ivě předat předem. Jejich převzetí potvrdí předávacím protokolem, používá je jen k úklidu a nikomu je nedá.' },
      { when: 'Úklid', title: 'Iva uklízí přesně podle domluvy.', text: 'Přijede ve sjednaný termín s vlastním vybavením a šetrnými prostředky. Od vás potřebuje jen přístup, vodu a elektřinu.', tasks: ['Podlahy vysáté a vytřené', 'Koupelna a baterie', 'Toaleta', 'Kuchyňská linka', 'Prach z přístupných ploch', 'Odpad vynesený'] },
      { when: 'Platba', title: 'Platíte až po úklidu.', text: 'Hotově nebo okamžitým převodem. Domluvenou cenu bez vašeho souhlasu nenavýšíme.' },
      { when: 'Hotovo', title: 'Vrátíte se do čistého.', text: 'A příště stačí napsat. Každý týden, jednou za 14 dní, nebo jen když je potřeba.', cta: true }
    ]
  },

  /* Sekce o Ivě. Text je návrh, Iva si ho upraví. Fotku doplníme do photo (cesta k souboru). */
  iva: {
    name: 'Iva',
    role: 'Zakladatelka PURE HOME',
    photo: null,
    letter: [
      'Dobrý den, jsem Iva a PURE HOME je moje firma.',
      'Ke každému úklidu přijedu sama, s vlastním vybavením a šetrnými prostředky. Než přijedu, poprosím vás o pár fotek, abychom se předem domluvili na rozsahu i ceně. Žádná překvapení, ani v ceně.',
      'Uklízím tak, jak bych to chtěla mít doma.'
    ],
    facts: [['Uklízí', 'Iva osobně'], ['Kde', 'Ostrava a okolí do 20\u00a0km'], ['Vybavení', 'vlastní, včetně prostředků'], ['Platba', 'až po úklidu']],
    team: 'Až nás bude víc, představím vám tu každou kolegyni.'
  },

  services: {
    title: 'Dva druhy úklidu. Vždy jasný rozsah.',
    regular: {
      name: 'Běžný úklid',
      text: 'Udržíme domácnost v pořádku. Každý týden, jednou za 14 dní, nebo jednorázově.',
      from: 400,
      rates: [['1× týdně', 400], ['1× za 14 dní', 430], ['Jednorázově', 450]]
    },
    general: {
      name: 'Generální úklid',
      text: 'Do hloubky a do detailu. Kuchyň, koupelna, dveře, lišty, parapety i horní plochy skříní.',
      from: 500,
      rates: [['Běžné znečištění', 500], ['Zvýšené znečištění', 600], ['Silné znečištění', 700]]
    }
  },

  /* Vybavení: přístroje jako výběr („mimo jiné“), body popisků jsou souřadnice na fotkách. */
  gear: {
    label: 'Vybavení',
    title: 'Profesionální vybavení.',
    lead: 'Všechno potřebné Iva přiveze s sebou: přístroje, pomůcky i prostředky. Mimo jiné pracuje s těmito přístroji.',
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
      'Okna, žaluzie, balkon, sklep a garáž (jde přiobjednat)',
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
    text: 'Iva uklízí ekologickými prostředky Frosch s ekoznačkou EU Ecolabel. Tři z nich voní malinou. Na připálenou troubu má český Real.'
  },
  pricing: {
    minimum: 1200,
    hourly: { min: 2, max: 10, step: 0.5, start: 3 },
    /* UKÁZKOVÝ odhad času podle velikosti (Iva ho potvrdí nebo upraví) */
    sizes: [
      { id: 's1', label: 'Garsoniéra nebo 1+kk', hint: 'do 35 m²', regular: 2, general: 4 },
      { id: 's2', label: '2+kk nebo 2+1', hint: '35 až 55 m²', regular: 3, general: 5 },
      { id: 's3', label: '3+kk nebo 3+1', hint: '55 až 80 m²', regular: 4, general: 6.5 },
      { id: 's4', label: '4+kk a větší', hint: '80 až 110 m²', regular: 5, general: 8 },
      { id: 's5', label: 'Rodinný dům', hint: 'nad 110 m²', regular: 6, general: 10 }
    ],
    starts: ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    frequencies: [
      { id: 'weekly', label: '1× týdně', rate: 400 },
      { id: 'biweekly', label: '1× za 14 dní', rate: 430 },
      { id: 'once', label: 'Jednorázově', rate: 450 }
    ],
    levels: [
      {
        id: 'bezna', label: 'Běžná', regular: 400, general: 500,
        regularText: 'Udržovaná domácnost, běžný prach a nečistoty.',
        generalText: 'Domácnost se průběžně udržuje: prach, běžná mastnota a lehký vodní kámen.'
      },
      {
        id: 'zvysena', label: 'Zvýšená', regular: 480, general: 600,
        regularText: 'Víc usazenin a mastnoty, zvířecí chlupy.',
        generalText: 'Dlouho neuklízená domácnost: výraznější mastnota, usazený vodní kámen, víc prachu a chlupů.'
      },
      {
        id: 'silna', label: 'Silná', regular: 600, general: 700,
        regularText: 'Dlouhodobě zanedbané plochy, výrazná mastnota, vodní kámen.',
        generalText: 'Silně zanesené povrchy, stará mastnota a výrazné usazeniny. Cenu upřesníme podle fotek.'
      },
      {
        id: 'extremni', label: 'Extrémní', refuse: true,
        regularText: 'Biologické nečistoty, plísně, škůdci, nebezpečný odpad.',
        generalText: 'Biologické nečistoty, plísně, škůdci, nebezpečný odpad.'
      }
    ],
    addons: [
      { id: 'trouba', label: 'Trouba', note: 'běžné znečištění', price: 300, unit: 'fixed' },
      { id: 'lednice', label: 'Lednice', note: 'vyprázdněná', price: 250, unit: 'fixed' },
      { id: 'skrinky', label: 'Kuchyňské skříňky uvnitř', price: 380, unit: 'hour' },
      { id: 'balkon', label: 'Balkon', note: 'pevná cena podle fotky', price: 350, unit: 'from' },
      { id: 'sklep', label: 'Sklep', price: 450, unit: 'hour' },
      { id: 'garaz', label: 'Garáž', price: 450, unit: 'hour' },
      { id: 'okna', label: 'Okna včetně rámů', unit: 'tbd' },
      { id: 'zaluzie', label: 'Žaluzie', unit: 'tbd' }
    ],
    /* Doprava se počítá od Ostravy, ne od centra: celá Ostrava a do 5 km od ní je zdarma.
       label = krátce (ceník, lístek), pick = volba v poptávce, place = do zprávy a přehledu. */
    travel: [
      { id: 't5', label: 'Ostrava a do 5 km', pick: 'Ostrava a do 5 km od ní', place: 'v Ostravě nebo do 5 km od ní', price: 0 },
      { id: 't10', label: '5–10 km', pick: '5–10 km od Ostravy', place: '5–10 km od Ostravy', price: 100 },
      { id: 't15', label: '10–15 km', pick: '10–15 km od Ostravy', place: '10–15 km od Ostravy', price: 150 },
      { id: 't20', label: '15–20 km', pick: '15–20 km od Ostravy', place: '15–20 km od Ostravy', price: 200 },
      { id: 't99', label: 'nad 20 km', pick: 'Dál než 20 km od Ostravy', place: 'dál než 20 km od Ostravy', price: null }
    ],
    notes: [
      'Účtujeme podle skutečně odpracovaného času, nebo podle pevné ceny domluvené předem.',
      'Sjednanou cenu bez vašeho souhlasu nenavýšíme.',
      'Platíte až po úklidu, hotově nebo okamžitým převodem.'
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

  process: [
    {
      title: 'Pošlete fotky',
      text: 'Stačí 5 až 8 fotek nebo krátké video. Podle nich poznáme, co vás čeká.',
      checklist: ['Kuchyň', 'Sporák', 'Koupelna', 'Toaleta', 'Podlaha', 'Celkový pohled']
    },
    {
      title: 'Domluvíme cenu',
      text: 'Ohodnotíme míru znečištění a domluvíme rozsah, termín a předpokládanou cenu.'
    },
    {
      title: 'Přijedeme a uklidíme',
      text: 'V domluvený čas, s vlastním vybavením a prostředky. Od vás potřebujeme jen přístup, vodu a elektřinu.'
    },
    {
      title: 'Zaplatíte po úklidu',
      text: 'Hotově nebo okamžitým převodem. Až když je hotovo.'
    }
  ],

  rules: {
    title: 'Férová pravidla, napsaná jasně.',
    cancel: [
      { when: 'Víc než 24 hodin předem', what: 'zdarma' },
      { when: 'Méně než 24 hodin předem', what: '50 % ceny' },
      { when: 'Po příjezdu nám neotevřete', what: '100 % ceny, nejvýš domluvená částka' }
    ],
    items: [
      { title: 'Cena bez překvapení', text: 'Když je u vás víc práce, než ukázaly fotky, nejdřív se domluvíme. Bez vašeho souhlasu cenu nenavýšíme.' },
      { title: 'Klíče v bezpečí', text: 'Převzetí klíčů potvrdíme předávacím protokolem. Klíče používáme jen k úklidu a nikomu je nepředáme.' },
      { title: 'Vaše soukromí', text: 'Fotky bytu slouží jen k nacenění. Bez vašeho svolení je nikdy nezveřejníme.' },
      { title: 'Co nebereme', text: 'Biologické nečistoty, plísně, škůdce ani nebezpečný odpad neuklízíme.' }
    ]
  },


  vop: {
    title: 'Všeobecné obchodní podmínky úklidových služeb',
    provider: { name: 'PURE HOME Ostrava', owner: null, seat: null },
    validFrom: null,
    sections: [
      { title: 'Objednání služby', items: [
        'Úklidové služby jsou poskytovány na základě individuální objednávky potvrzené oběma stranami.',
        'Před zahájením práce se sjednává zejména termín, místo, rozsah úklidu, způsob účtování a předpokládaná cena.',
        'Součástí objednávky jsou tyto obchodní podmínky a aktuální ceník, s nimiž je zákazník seznámen před uzavřením smlouvy.'
      ] },
      { title: 'Rozsah poskytovaných služeb', items: [
        'Poskytovatel provádí pouze sjednané úklidové práce.',
        'Běžný úklid zahrnuje vysávání, vytírání, utírání prachu, běžné čištění koupelny, WC a kuchyňských ploch.',
        'Mytí oken, čištění vnitřků spotřebičů, skříněk, žaluzií a další speciální činnosti jsou poskytovány na základě samostatné objednávky.',
        'Práce nad rámec původní objednávky se provádějí pouze po odsouhlasení zákazníkem.'
      ] },
      { title: 'Ceny a platba', items: [
        '@prices',
        'Minimální cena návštěvy činí 1 200 Kč.',
        'Cena se stanovuje podle skutečně odpracovaného času, případně podle předem sjednané pevné ceny.',
        'Případné zvýšení sjednaného rozpočtu vyžaduje předchozí souhlas zákazníka.',
        'Platba probíhá po dokončení úklidu hotově nebo okamžitým bankovním převodem, pokud nebylo předem sjednáno jinak.',
        'U rozsáhlejších zakázek může být sjednána záloha.'
      ] },
      { title: 'Stav a připravenost prostoru', items: [
        'Zákazník je povinen poskytnout pravdivé informace o stavu prostoru a upozornit na známé závady, křehké povrchy a předměty vyžadující zvláštní zacházení.',
        'Zákazník zajistí přístup k uklízeným prostorům, přívod vody a elektřiny a podmínky umožňující bezpečné provedení úklidu.',
        'Poskytovatel není povinen manipulovat s těžkým nábytkem, nebezpečnými látkami, biologickým odpadem nebo jinými rizikovými předměty.'
      ] },
      { title: 'Zvýšené znečištění', items: [
        'Pokud skutečný stav prostor podstatně neodpovídá předem sděleným informacím, poskytovatel může navrhnout změnu ceny nebo rozsahu úklidu.',
        'Zvýšená cena nebo další práce se uplatní pouze po souhlasu zákazníka.',
        'Nedojde-li k dohodě, mohou strany zakázku ukončit; vypořádání již provedené práce a případných nákladů se řídí smlouvou a právními předpisy.'
      ] },
      { title: 'Zrušení objednávky', items: [
        'Storno podmínky pro jednotlivé sjednané termíny:',
        { list: [
          'Více než 48 hodin před termínem: bez poplatku.',
          '24–48 hodin před termínem: bez poplatku.',
          'Méně než 24 hodin před termínem: storno poplatek 50 % ze sjednané ceny.',
          'Zmařený termín z důvodu neposkytnutí přístupu: storno poplatek 100 %, maximálně předem dohodnutá částka.'
        ] },
        'Storno poplatek se neuplatní, pokud by odporoval zákonnému právu spotřebitele odstoupit od smlouvy nebo jinému kogentnímu právnímu předpisu.',
        'Při mimořádných okolnostech může poskytovatel poplatek prominout.',
        'Pokud termín zruší poskytovatel, zákazníkovi storno poplatek nevzniká a případná záloha se vypořádá podle zákona.'
      ] },
      { title: 'Odpovědnost za škody', items: [
        'Poskytovatel odpovídá za škody způsobené při poskytování služeb v rozsahu stanoveném právními předpisy.',
        'Zákazník upozorní na známé poškození, nestabilní vybavení, citlivé materiály a zvláštní požadavky na čištění.',
        'Při zjištění poškození poskytovatel bez zbytečného odkladu informuje zákazníka a obě strany podle možností zdokumentují stav.'
      ] },
      { title: 'Reklamace', items: [
        'Zákazník může uplatnit reklamaci e-mailem nebo jiným sjednaným způsobem.',
        'Doporučuje se oznámit zjevné nedostatky co nejdříve po dokončení úklidu, ideálně do 24 hodin, aby bylo možné jejich stav spolehlivě posoudit.',
        'Toto doporučení neomezuje zákonná práva zákazníka.',
        'O reklamaci bude vydáno příslušné potvrzení a bude vyřízena v zákonné lhůtě, zpravidla nejpozději do 30 dnů.',
        'V případě oprávněné reklamace se způsob nápravy určí podle příslušných právních předpisů.'
      ] },
      { title: 'Bezpečnost a odmítnutí práce', items: [
        'Poskytovatel může odmítnout nebo přerušit práci, pokud podmínky představují důvodné riziko pro zdraví nebo bezpečnost.',
        'Jedná se zejména o agresivní chování, nebezpečné chemické látky, biologicky rizikový odpad, nebezpečné předměty nebo jiné závažné překážky bezpečného výkonu práce.',
        'O důvodu přerušení bude zákazník informován.'
      ] },
      { title: 'Klíče a přístup do nemovitosti', items: [
        'Převzetí klíčů se zaznamenává samostatným předávacím potvrzením.',
        'Klíče jsou používány výhradně k provedení sjednaných služeb a jsou zabezpečeny proti neoprávněnému použití.',
        'Poskytovatel nesmí bez oprávnění předávat klíče třetím osobám.',
        'Po skončení spolupráce budou klíče vráceny dohodnutým způsobem.'
      ] },
      { title: 'Fotodokumentace a soukromí', items: [
        'Fotodokumentace pro účely nacenění, doložení stavu nebo řešení případných škod se pořizuje pouze v přiměřeném a potřebném rozsahu a v souladu s právními předpisy.',
        'Fotografie interiéru nesmějí být použity k reklamě ani zveřejněny bez samostatného příslušného svolení zákazníka.',
        'Osobní údaje zákazníků jsou zpracovávány podle samostatných informací o ochraně osobních údajů.'
      ] },
      { title: 'Závěrečná ustanovení', items: [
        'Tyto obchodní podmínky se použijí na objednávky, u nichž byly zákazníkovi poskytnuty před uzavřením smlouvy a staly se součástí smluvního ujednání.',
        'Změny podmínek nemají zpětný účinek na již uzavřené objednávky bez odpovídající dohody stran.'
      ] }
    ]
  },

  concept: {
    badge: 'Koncept od MALUS/01',
    footer: 'Návrh webu od studia MALUS/01. Pracovní verze. Produktové fotky patří jejich výrobcům (ETA, Kärcher, Frosch, Real). Text o Ivě je návrh k úpravě.',
    sampleToast: 'V konceptu je zatím ukázkový kontakt. Před spuštěním doplníme skutečný.'
  }
};
