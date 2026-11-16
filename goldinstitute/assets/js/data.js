/* GOLD Institute · obsah webu na jednom místě. Úpravy textů, fotek a referencí dělejte tady. */
window.GOLD = {
  firma: {
    nazev: 'GOLD Institute s.r.o.',
    sidlo: 'Holečkova 789/49, 150 00 Praha 5',
    ico: '04693035',
    dic: 'CZ04693035',
    telefon: '',   // doplní GOLD Institute
    email: ''      // doplní GOLD Institute
  },

  /* Kapitola Mosty: další mosty pod 3D modelem */
  mosty: [
    { nazev: 'Barrandovský most', misto: 'Praha', pozn: 'Nejvytíženější most v Česku' },
    { nazev: 'Žďákovský most', misto: 'Orlická nádrž', pozn: '543 m, mostovka zhruba 50 m nad hladinou' },
    { nazev: 'Obloukový most', misto: 'Praha-Uhříněves', pozn: 'Podpěrné věže pod obloukem, 2026' }
  ],

  /* Kapitola Kampus */
  kampus: {
    fakta: [
      { cislo: '75 000', jednotka: 'm²', popis: 'plocha kampusu' },
      { cislo: '4', jednotka: 'budovy', popis: 'nové sídlo České spořitelny' },
      { cislo: '2027', jednotka: '', popis: 'plánované dokončení' }
    ],
    media: [
      { typ: 'video', src: 'assets/video/kampus-vyska', co: 'Po lešení nad stavbou', kdy: '07/2026' },
      { typ: 'img', src: 'assets/img/kampus-podpery', co: 'Podpěrná konstrukce pod betonáž', kdy: '2026', alt: 'Hustá podpěrná konstrukce z lešení PERI UP pod betonovým stropem' },
      { typ: 'video', src: 'assets/video/kampus-fasada', co: 'Fasádní lešení', kdy: '09/2026' },
      { typ: 'img', src: 'assets/img/kampus-fasady', co: 'Fasády administrativních budov', kdy: '2026', alt: 'Fasádní lešení na dvou administrativních budovách a jeřáb' }
    ]
  },

  /* Kapitola Festivaly: stěna referencí a záběry.
     logo: cesta k oficiálnímu logu festivalu, např. 'assets/loga/colours.svg'. Soubor se zobrazí tak, jak je. */
  festivaly: [
    { nazev: 'Colours of Ostrava', misto: 'Dolní Vítkovice, Ostrava', vel: 'xl', logo: '' },
    { nazev: 'Rock for People', misto: 'Hradec Králové', vel: 'xl', logo: '' },
    { nazev: 'Beats for Love', misto: 'Dolní Vítkovice, Ostrava', vel: 'l', logo: '' },
    { nazev: 'Let It Roll', misto: 'stage · město Most', vel: 'l', logo: '' },
    { nazev: 'Grape', misto: 'letiště Trenčín, Slovensko', vel: 'l', logo: '' },
    { nazev: 'MFF Karlovy Vary', misto: 'filmový festival', vel: 'l', logo: '' }
  ],
  festMedia: [
    { typ: 'img', src: 'assets/img/vitkovice-tribuna', kde: 'Beats for Love', co: 'Tribuna na lešení, Dolní Vítkovice', alt: 'Dřevěná tribuna postavená na lešení před halou v Dolních Vítkovicích' },
    { typ: 'img', src: 'assets/img/letitroll-shora', kde: 'Let It Roll', co: 'Pohled z konstrukce stage, dole materiál PERI UP', alt: 'Pohled z výšky konstrukce na festivalový areál a rozložený materiál PERI UP' },
    { typ: 'video', src: 'assets/video/karlovy-vary', kde: 'MFF Karlovy Vary', co: 'Podlahy připravené k montáži' },
    { typ: 'img', src: 'assets/img/vitkovice-terasa', kde: 'Beats for Love', co: 'Terasa s dřevěnou podlahou', alt: 'Lešení s vyvýšenou terasou a slunečníky v Dolních Vítkovicích' },
    { typ: 'video', src: 'assets/video/vitkovice', kde: 'Beats for Love', co: 'Montáž v Dolních Vítkovicích' },
    { typ: 'img', src: 'assets/img/karlovy-vary', kde: 'MFF Karlovy Vary', co: 'Montáž u hotelu Thermal', alt: 'Systémové podlahy připravené k montáži v Karlových Varech' }
  ],

  /* Systémy lešení. logo: cesta k oficiálnímu logu (např. 'assets/loga/peri.svg'), až ho GOLD Institute dodá. */
  znacky: [
    { nazev: 'PERI', popis: 'PERI UP · hlavní systém', logo: '' },
    { nazev: 'HAKI', popis: 'a další systémy podle stavby', logo: '' }
  ],

  /* Kapitola Zakázky: co jiní odmítnou (výkres = typ schématu) */
  specialni: [
    { nazev: 'Natáčení Spider-Mana', misto: 'Liberec', popis: 'Lešení pro natáčení filmu Spider-Man v Liberci.', vykres: 'film' },
    { nazev: 'BMW', misto: 'výrobní hala', popis: 'Speciální lešení v hale mezi stroji, kam se běžné lešení nevejde.', vykres: 'hala' },
    { nazev: 'Národní kulturní památky', misto: 'Česko', popis: 'Lešení na národní kulturní památky, s ohledem na památkovou péči.', vykres: 'pamatka' }
  ],

  /* Co postavíme */
  sluzby: [
    { nazev: 'Mosty', popis: 'Podpěrné věže, pracovní plošiny a přístup k nosné konstrukci.' },
    { nazev: 'Zavěšené lešení', popis: 'Pod mostovku, nad vodu i nad provoz. Na vlastní konstrukci na míru.' },
    { nazev: 'Podpěrné konstrukce', popis: 'Podpěry pod stropy a betonáž, i ve velkých výškách.' },
    { nazev: 'Fasády', popis: 'Od rodinného domu po administrativní budovy.' },
    { nazev: 'Festivaly a eventy', popis: 'Stage, tribuny, terasy a VIP zóny.' },
    { nazev: 'Film, průmysl a památky', popis: 'Natáčení, provozy mezi stroji a kulturní památky.' }
  ],

  /* Reference na mapě. pin = klíč do mapy (null = bez místa na mapě) */
  reference: [
    { nazev: 'Barrandovský most', misto: 'Praha', kat: 'mosty', pin: 'praha' },
    { nazev: 'Obloukový most', misto: 'Praha-Uhříněves', kat: 'mosty', pin: 'praha' },
    { nazev: 'Žďákovský most', misto: 'Orlická nádrž', kat: 'mosty', pin: 'zdakov' },
    { nazev: 'Kampus České spořitelny', misto: 'Praha-Smíchov', kat: 'stavby', pin: 'praha' },
    { nazev: 'Smíchovské nádraží', misto: 'Praha', kat: 'stavby', pin: 'praha' },
    { nazev: 'MFF Karlovy Vary', misto: 'Karlovy Vary', kat: 'festivaly', pin: 'kv' },
    { nazev: 'Colours of Ostrava', misto: 'Dolní Vítkovice, Ostrava', kat: 'festivaly', pin: 'ostrava' },
    { nazev: 'Beats for Love', misto: 'Dolní Vítkovice, Ostrava', kat: 'festivaly', pin: 'ostrava' },
    { nazev: 'Rock for People', misto: 'Hradec Králové', kat: 'festivaly', pin: 'hk' },
    { nazev: 'Let It Roll', misto: 'stage · město Most', kat: 'festivaly', pin: 'most' },
    { nazev: 'Grape', misto: 'Letiště Trenčín, Slovensko', kat: 'festivaly', pin: 'trencin' },
    { nazev: 'Natáčení Spider-Mana', misto: 'Liberec', kat: 'specialni', pin: 'liberec' },
    { nazev: 'BMW', misto: 'Speciální lešení v hale mezi stroji', kat: 'specialni', pin: null },
    { nazev: 'Národní kulturní památky', misto: 'Lešení s ohledem na památkovou péči', kat: 'specialni', pin: null }
  ],
  kategorie: [
    { id: 'vse', nazev: 'Vše' },
    { id: 'mosty', nazev: 'Mosty' },
    { id: 'stavby', nazev: 'Stavby' },
    { id: 'festivaly', nazev: 'Festivaly' },
    { id: 'specialni', nazev: 'Film a speciální' }
  ],
  pinNazvy: {
    praha: 'Praha', zdakov: 'Žďákovský most', kv: 'Karlovy Vary', ostrava: 'Ostrava',
    hk: 'Hradec Králové', most: 'Most', trencin: 'Trenčín', liberec: 'Liberec'
  },

  /* Poptávka: typy, jejich věta do textu a pozadí výkresu */
  poptavka: {
    typy: [
      { id: 'fasada', nazev: 'Fasáda', veta: 'fasádní lešení', delka: 'Délka fasády', vyska: 'Výška fasády' },
      { id: 'most', nazev: 'Most', veta: 'lešení na most', delka: 'Délka úseku', vyska: 'Výška nad terénem' },
      { id: 'zavesene', nazev: 'Zavěšené lešení', veta: 'zavěšené lešení', delka: 'Délka úseku', vyska: 'Výška nad terénem' },
      { id: 'podpery', nazev: 'Podpěry', veta: 'podpěrnou konstrukci', delka: 'Délka plochy', vyska: 'Výška podepření' },
      { id: 'event', nazev: 'Stage a tribuny', veta: 'lešení na akci', delka: 'Délka', vyska: 'Výška' },
      { id: 'jine', nazev: 'Něco jiného', veta: 'lešení', delka: 'Délka', vyska: 'Výška' }
    ],
    terminy: ['co nejdřív', 'do měsíce', 'do tří měsíců', 'později']
  },

  mapa: {"viewBox": "0 0 1000 499", "cz": "M640.8,233.5L638.4,233.7L633.1,236L626.1,236.7L618.7,236.5L613.1,240.2L607.7,246.3L602.1,250.6L599.1,254.5L597.4,258.5L578.4,269.6L575.7,274.3L573.7,280.7L572.7,289.4L571.4,297.1L568.4,301.3L558,304.7L555.4,306.5L553.7,310.4L547.7,316.6L541,322.3L528.7,329L515.7,331L498.3,328.7L488.3,326.3L483.3,329L476.7,337.6L469.6,352.5L466.6,363.6L464.3,360.4L460,348.5L455.3,347L449,346.1L444.3,344.3L434,337.4L428.6,335.4L422.6,334.9L416.6,338.9L412.3,343.6L398.6,343.6L383.6,341.4L361.9,325.8L356.6,325.5L350.6,326.3L341.2,322.6L322.9,312.4L314.2,310.2L308.9,311.4L304.2,313.6L300.5,314.1L298.5,310.7L291.9,306.7L284.9,306.2L282.9,308.7L280.8,331L278.5,338.9L269.2,338.6L265.8,342.3L258.5,353.2L256.8,363.4L244.2,361.4L238.2,359.7L232.8,361.2L226.8,366.8L210.5,366.3L197.5,363.1L191.8,350.3L185.8,345.1L178.4,340.6L175.8,339.6L171.4,332.7L163.8,324L151.1,312.2L141.1,312.7L137.4,309.7L135.7,305.2L131.7,297.8L127.1,292.4L121.4,290.4L113.4,283.7L102.4,269.4L92.4,259.2L83,259.5L77,254.3L70.7,247.3L66,240.7L59,224.3L54,215.2L50,209.5L45.4,204.8L43.7,201.1L49.4,192.4L51.4,188L53.7,184.7L55,181.3L55,178.8L50,170.1L43.4,164L33.3,157.8L27,149.9L24.3,142.7L23.7,138.7L19.3,133.5L16,125.6L16,120.9L16.7,119.4L20,119.4L23.7,122.6L29,129.1L33.3,138L36,134.5L40.7,124.9L49.7,114L58.4,107.8L66.4,107.3L73,105.6L78.4,102.3L88,103.6L95.1,105.8L97.1,104.6L100.1,98.9L101.7,93.9L117.1,91.2L122.4,81.6L125.1,81.8L128.7,80.3L131.7,76.6L135.1,75.1L137.4,77.1L140.8,78.1L144.1,75.9L149.1,65L151.8,63.5L165.1,61.8L183.4,55.3L192.8,49.6L201.8,46.7L211.5,41L227.1,35.8L227.8,33.6L220.8,28.1L218.1,24.7L216.5,20.9L219.1,17.2L222.5,16L226.8,17.5L239.8,20L243.5,22.2L244.8,27.9L248.2,32.8L250.8,33.6L249.8,42L253.8,45.2L259.8,47.7L263.8,47.2L266.8,43.7L267.8,41.5L275.8,41L283.9,37.5L284.5,31.6L284.2,20.9L284.9,19.2L297.2,22.4L309.5,27.1L311.2,38L314.5,43.2L318.5,48.2L322.2,50.4L328.5,50.6L345.2,57.1L353.2,58.3L361.6,62.8L368.2,67.5L373.6,68.2L375.9,73.4L378.9,76.6L384.3,74.1L404.3,70.4L411.6,75.4L416.3,80.6L416.9,82.1L414.6,86.8L413.3,90.2L411.3,92.5L404.3,94.9L400.6,99.1L397.6,103.3L399.6,107.8L405.3,110.8L409.3,111.5L410.6,114.7L423.3,128.3L433.6,146.4L437.3,149.4L441.3,149.9L445.3,147.4L450.3,141.4L456.3,137.2L461.3,135L470,130.1L470.3,126.8L463,114.7L458.6,104.8L459.6,103.1L469,104.6L485,110L509.3,127.6L513.7,127.6L522.3,126.1L531.7,123.4L536,120.2L537.7,121.4L539,131.1L536.7,136.2L525.4,141.4L526,143.9L529,147.4L534,149.6L540,155.8L544.4,163L548,166.2L552,167.9L562,164L565,161L566,158.8L568,159.3L571.7,162.7L572.7,164.9L582.4,168.9L588.1,173.9L591.7,176.1L595.7,173.9L611.4,177.8L615.7,181L617.1,186.5L616.1,189.7L618.7,198.3L638.4,218.9L640.4,229.3L640.8,233.5Z", "sk": "M984,296.1L982.7,302L979,308.7L974.3,315.9L970.3,324.3L965,342.6L961.7,351.3L947.3,367.8L946.3,391.1L944.3,392.8L912.6,400.7L908.3,399.5L903.9,395L901.6,391.6L899.9,389.4L897.3,382.9L893.6,378.2L888.3,374.5L883.3,370.3L876.9,370.1L859.6,376.2L847.6,376.7L839.9,374.8L829.2,371L808.5,370.6L794.2,373.8L792.9,378.2L779.9,406.7L760.8,417.3L744.2,428L739.5,430.2L731.2,426.7L721.8,420.5L714.1,417.1L708.5,418.6L702.1,425.7L699.5,433.1L680.8,438.6L648.1,441.6L636.8,448.7L633.1,457.6L632.8,464.1L635.8,469.8L632.1,476.4L630.8,479.2L607.7,480.7L577.1,482.6L558.7,482.1L541.4,481.6L529.7,476L515.3,464.8L500.3,450.2L498.7,449.7L496.7,448.2L487,447.3L484.7,448L479,443.3L477.3,437.1L468.3,420.8L458.3,393.8L458.3,385.9L462,377.2L465.6,370.3L466,365.1L466.6,363.6L469.6,352.5L476.7,337.6L483.3,329L488.3,326.3L498.3,328.7L515.7,331L528.7,329L541,322.3L547.7,316.6L553.7,310.4L555.4,306.5L558,304.7L568.4,301.3L571.4,297.1L572.7,289.4L573.7,280.7L575.7,274.3L578.4,269.6L597.4,258.5L599.1,254.5L602.1,250.6L607.7,246.3L613.1,240.2L618.7,236.5L626.1,236.7L633.1,236L638.4,233.7L640.8,233.5L650.4,235.5L652.1,242.4L653.1,249.8L670.1,249.3L679.5,233.5L684.1,231.5L692.1,226.1L697.1,221.1L700.5,224.3L705.8,234.5L711.1,242.6L714.1,245.9L714.5,248.3L717.8,249.8L723.8,250.8L727.8,253.3L729.2,260.9L729.2,267.9L727.2,272.8L726.2,277.3L730.5,279L736.8,277.3L741.2,274.8L754.2,280.5L758.8,267.9L763.8,261.2L770.9,258.2L776.9,254.3L782.5,251.5L786.2,251.5L787.9,250.6L792.9,250.8L798.2,252L805.9,250.6L816.2,253.8L822.9,259.5L829.2,261.4L836.6,261.2L841.6,258L848.9,246.8L854.2,246.8L862.2,245.1L873.9,245.4L900.6,247.6L907.6,252L924,257.5L931.3,263.7L934.3,271.3L936,276.5L953,284.5L978,294.8L984,296.1Z", "pins": {"barrandov": [230.6, 159.1], "smichov": [230.7, 155], "uhrineves": [248.6, 159.7], "zdakov": [211, 234.1], "liberec": [290.8, 54.5], "kv": [88.7, 131.2], "hk": [363.9, 127.8], "ostrava": [589.6, 189.2], "most": [160.4, 89.2], "trencin": [562.8, 325.6]}}
};
