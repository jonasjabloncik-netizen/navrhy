/* Knedlo Zelo Wear – koncept e-shopu (MALUS/01)
   Data převzatá z www.knedlozelowear.cz (stav 6. 11. 2026): názvy, ceny, skladovost, popisy, fotky. */
(function () {
  const SHOP = 'https://cdn.myshoptet.com/usr/www.knedlozelowear.cz/user/shop/big/';
  const USER = 'https://cdn.myshoptet.com/usr/www.knedlozelowear.cz/user/';
  const img = (file, ts) => SHOP + file + '?ff=1&x=1024&y=1365&q=95&ts=' + ts + '&sg=29e66194';

  // stock: číslo = kusů skladem, 'obj' = tiskneme na objednávku, 0 = momentálně nedostupné
  const P = [
    {
      id: 'volno-heavy-box-hoody', name: 'VOLNO Heavy Box Hoody', cat: 'mikiny', price: 1690, drop: true,
      tag: 'Konečně volno',
      desc: 'Ultra heavy mikina z bavlny s gramáží 460 g/m². Širší box střih, dlouhé rukávy, nápis VOLNO na hrudi a malé logo Knedlo Zelo Wear dole u lemu.',
      bullets: ['Ultra heavy mikina s gramáží 460 g/m²', 'Širší střih, dlouhé rukávy', '100% bavlna'],
      fit: ['Model měří 187 cm a nosí velikost L', 'Modelka měří 163 cm a nosí velikost XS'],
      lead: 'Pokud není skladem, tiskneme na objednávku s dodáním 2–3 týdny.',
      sizes: [['XS', 2], ['S', 2], ['M', 3], ['L', 5], ['XL', 4], ['XXL', 'obj']],
      images: [
        img('2660-1_volno-hoodie-opr-4.jpg', '6ac2b23f'),
        img('2660-4_volno-hoodie-opr-8.jpg', '6ac2b243'),
        img('2660-3_volno-hoodie-opr-6.jpg', '6ac2b242'),
        img('2660_volno-hoodie-opr-2.jpg', '6ac2b23e'),
        img('2660-6_produktovky-46.jpg', '6ac2b26a'),
        img('2660-2_volno-hoodie-opr-5.jpg', '6ac2b241'),
        img('2660-5_produktovky-45.jpg', '6ac2b269')
      ],
      captions: { 0: 'Modelka 163 cm · XS', 1: 'Model 187 cm · L', 3: 'Modelka 163 cm · XS', 5: 'Modelka 163 cm · XS' },
      chart: img('2660-7_boxy-hoodie-prac-verze.jpg', '6ac2b2ea'),
      measure: { sizes: ['S', 'M', 'L', 'XL', 'XXL'], A: [65, 68, 71, 74, 77], B: [70.5, 71.5, 73.5, 75.5, 77.5], C: [71.1, 71.5, 71.9, 72.3, 72.7] },
      pair: 'volno-sea-blue-dads-cap'
    },
    {
      id: 'nazdar-spinach-green-dads-cap', name: "NAZDAR Spinach Green Dad's Cap", cat: 'cepice', price: 750, drop: true,
      tag: 'No nazdar!', color: 'Spinach Green', swatch: '#244648', family: 'nazdar',
      bullets: ["Klasický dad's cap střih", 'Výšivky vpředu a na obou stranách', 'Vzadu pásek s kovovou přezkou pro úpravu velikosti'],
      sizes: [['Univerzální', 5]],
      images: [img('2669-4_produktovky-23.jpg', '6ac2b523'), img('2669-1_produktovky-20.jpg', '6ac2b51b'), img('2669_produktovky-19.jpg', '6ac2b516'), img('2669-2_produktovky-21.jpg', '6ac2b51e')]
    },
    {
      id: 'milan-fashion-weak-heavy-oversize-tee', name: 'MILAN FASHION WEAK Heavy Oversize Tee', cat: 'trika', price: 850, drop: true,
      tag: 'Fashion weak, attitude strong',
      bullets: ['Tiskneme na jakostní fairtrade textil z organické bavlny', 'Oversize střih, doporučujeme objednávat o jednu až dvě velikosti menší', 'Gramáž cca 220 g/m²'],
      fit: ['Model měří 187 cm a nosí velikost M'],
      lead: 'Pokud není skladem, tiskneme na objednávku s dodáním cca 2–3 týdny.',
      sizes: [['XS', 1], ['S', 2], ['M', 1], ['L', 1], ['XL', 2]],
      images: [img('2657-4_produktovky-40.jpg', '6ac2b108'), img('2657-1_produktovky-36.jpg', '6ac2b100'), img('2657-3_produktovky-38.jpg', '6ac2b107'), img('2657-2_produktovky-37.jpg', '6ac2b105')],
      captions: { 0: 'Model 187 cm · M' },
      chart: img('2657_heavy-oversize.jpg', '6ac2afc8')
    },
    {
      id: 'sedativa-heavy-oversize-tee', name: 'SEDATIVA Heavy Oversize Tee', cat: 'trika', price: 850, drop: true,
      tag: 'Sedativa pro Váš hezčí den',
      bullets: ['Tiskneme na jakostní fairtrade textil z organické bavlny', 'Oversize střih, doporučujeme objednávat o jednu až dvě velikosti menší', 'Gramáž cca 220 g/m²'],
      fit: ['Modelka měří 165 cm a nosí velikost XS', 'Model měří 187 cm a nosí velikost M'],
      lead: 'Pokud není skladem, tiskneme na objednávku s dodáním cca 2–3 týdny.',
      sizes: [['XS', 2], ['S', 3], ['M', 3], ['L', 1], ['XL', 1]],
      images: [img('2654-2_produktovky-33.jpg', '6ac2ae8f'), img('2654-3_produktovky-34.jpg', '6ac2ae90'), img('2654-6_produktovky-43.jpg', '6ac2ae94'), img('2654-1_produktovky-32.jpg', '6ac2ae8f'), img('2654_produktovky-31.jpg', '6ac2ae8e'), img('2654-4_produktovky-41.jpg', '6ac2ae91')],
      captions: { 0: 'Model 187 cm · M' },
      chart: img('2654-5_heavy-oversize.jpg', '6ac2aee3')
    },
    {
      id: 'volno-sea-blue-dads-cap', name: "VOLNO Sea Blue Dad's Cap", cat: 'cepice', price: 750, drop: true,
      tag: 'Konečně volno!', color: 'Sea Blue', swatch: '#3f4f7a',
      bullets: ["Klasický dad's cap střih", 'Výšivky vpředu a na obou stranách', 'Vzadu pásek s kovovou přezkou pro úpravu velikosti'],
      sizes: [['Univerzální', 24]],
      images: [img('2663-3_produktovky-16.jpg', '6ac2b40c'), img('2663-2_produktovky-15.jpg', '6ac2b40b'), img('2663_produktovky-12.jpg', '6ac2b406'), img('2663-1_produktovky-13.jpg', '6ac2b409'), img('2663-4_produktovky-17.jpg', '6ac2b40d')]
    },
    {
      id: 'nazdar-camo-dads-cap', name: "NAZDAR Camo Dad's Cap", cat: 'cepice', price: 750, drop: true,
      tag: 'No nazdar!', color: 'Camo', swatch: 'linear-gradient(135deg,#4b4a2c 0 30%,#6f5a3a 30% 55%,#2f3d2a 55% 80%,#8a7f55 80%)', family: 'nazdar',
      bullets: ["Klasický dad's cap střih", 'Výšivky vpředu a na obou stranách', 'Vzadu pásek s kovovou přezkou pro úpravu velikosti'],
      sizes: [['Univerzální', 9]],
      images: [img('2666-1_produktovky-27.jpg', '6ac2b4b3'), img('2666-3_produktovky-29.jpg', '6ac2b4b7'), img('2666-2_produktovky-28.jpg', '6ac2b4b5'), img('2666-4_produktovky-30.jpg', '6ac2b4b8')]
    },
    {
      id: 'disbalance-laptop-bag', name: 'DISBALANCE Laptop Bag', cat: 'tasky', price: 990, drop: true,
      tag: 'The disbalance never ends',
      bullets: ['100% organická bavlna', 'Fairtrade výroba', 'Vhodné na laptop, nevhodné na stolní počítač'],
      lead: 'Pokud není skladem, tiskneme na objednávku s dodáním cca za 2–3 týdny.',
      colors: [
        { name: 'Tmavě modrá', swatch: '#1f2740', sizes: [['13"', 'obj'], ['15"', 2]] },
        { name: 'Lahvově zelená', swatch: '#1e4a3a', sizes: [['13"', 'obj'], ['15"', 'obj']] }
      ],
      sizeLabel: 'Velikost notebooku',
      images: [img('2672_produktovky-2.jpg', '6ac2b70b'), img('2672-1_produktovky-3.jpg', '6ac2b712'), img('2672-2_produktovky-4.jpg', '6ac2b715'), img('2672-3_produktovky-5.jpg', '6ac2b717')]
    },
    {
      id: 'call-me-denim-tote-bag', name: 'CALL ME Denim Tote Bag', cat: 'tasky', price: 450, drop: true,
      tag: 'Call meee',
      bullets: ['Fairtrade výroba z recyklovaných materiálů', '60% bavlna, 40% polyester', 'Gramáž 210 g/m²', 'Rozměry 38 × 42 cm'],
      lead: 'Pokud není skladem, tiskneme na objednávku s dodáním cca za 2–3 týdny.',
      sizes: [['38 × 42 cm', 4]],
      images: [img('2675-1_produktovky-7.jpg', '6ac2b8c9'), img('2675-3_produktovky-10.jpg', '6ac2b8d2'), img('2675_produktovky-6.jpg', '6ac2b8c5'), img('2675-2_produktovky-8.jpg', '6ac2b8ce')]
    },
    {
      id: 'auto-moto-longsleeve-tee', name: 'AUTO MOTO Longsleeve Tee', cat: 'trika', price: 990,
      tag: 'Rurální auto moto swag 3000',
      bullets: ['Tiskneme na kvalitní a pohodlná trika od výrobce BYB', 'Gramáž cca 220 g/m²'],
      fit: ['Modelka měří 170 cm a nosí velikost S', 'Model měří 183 cm a nosí velikost M'],
      lead: 'Pokud není skladem, tiskneme na objednávku s dodáním za 2–3 týdny.',
      sizes: [['S', 0], ['M', 1], ['L', 0], ['XL', 0], ['XXL', 0]],
      images: [img('2612-1_mari-gorki-produktovki-edited-25.jpg', '69c55b13'), img('2612-2_mari-gorki-produktovki-edited-31.jpg', '69c55b14'), img('2612_mari-gorki-produktovki-edited-24.jpg', '69c55b13'), img('2612-3_mari-gorki-produktovki-edited-32.jpg', '69c55b16'), img('2612-4_mari-gorki-produktovki-edited-33.jpg', '69c55b16')],
      captions: { 0: 'Modelka 170 cm · S', 1: 'Model 183 cm · M' },
      chart: img('2612-5_long-sleeve.jpg', '69c59c79')
    },
    {
      id: 'disconnect-turtleneck-longsleeve-tee', name: 'DISCONNECT Turtleneck Longsleeve Tee', cat: 'trika', price: 1090,
      tag: 'Disconnection services',
      bullets: ['Výšivka na límci, vepředu a vzadu sítotisk', 'Přiléhavější unisex střih', '100% bavlna, gramáž 220 g/m²'],
      fit: ['Modelka měří 170 cm a nosí velikost XS', 'Model měří 183 cm a nosí velikost M'],
      lead: 'Pokud není skladem, tiskneme na objednávku s dodáním cca 2–3 týdny.',
      sizes: [['XS', 2], ['S', 4], ['M', 3], ['L', 2], ['XL', 3]],
      images: [img('2609-5_mari-gorki-produktovki-edited-29.jpg', '69c55976'), img('2609-2_mari-gorki-produktovki-edited-15.jpg', '69c55971'), img('2609-4_mari-gorki-produktovki-edited-28.jpg', '69c55973'), img('2609_mari-gorki-produktovki-edited-13.jpg', '69c55971'), img('2609-3_mari-gorki-produktovki-edited-16.jpg', '69c55973')],
      captions: { 0: 'Modelka 170 cm · XS', 1: 'Model 183 cm · M' },
      chart: img('2609-1_turtle.jpg', '69c59c40')
    },
    {
      id: 'auto-moto-heavy-oversize-tee', name: 'AUTO MOTO Heavy Oversize Tee', cat: 'trika', price: 890,
      tag: 'Rurální swag 3000',
      bullets: ['Tiskneme na fair trade trika z organické bavlny', 'Vysoká gramáž cca 220 g/m²', 'Oversize střih, doporučujeme objednávat o jednu až dvě velikosti menší'],
      fit: ['Model měří 183 cm a nosí velikost M'],
      lead: 'Pokud není skladem, tiskneme na objednávku s dodáním cca do 14 dnů.',
      sizes: [['XS', 1], ['S', 1], ['M', 0], ['L', 0], ['XL', 0]],
      images: [img('2615_mari-gorki-produktovki-edited-3.jpg', '69c55d70'), img('2615-2_mari-gorki-produktovki-edited-6.jpg', '69c55d70'), img('2615-1_mari-gorki-produktovki-edited-5.jpg', '69c55d70')],
      captions: { 0: 'Model 183 cm · M', 1: 'Model 183 cm · M' },
      chart: img('2615-3_heavy-oversize.jpg', '69c59c88')
    },
    {
      id: 'disconnect-heavy-oversize-tee', name: 'DISCONNECT Heavy Oversize Tee', cat: 'trika', price: 850,
      tag: 'KZW disconnection services swag since 2011',
      bullets: ['Tiskneme na pohodlná a kvalitní trika z fairtrade bio bavlny', 'Vysoká gramáž 240 g/m²', 'Oversize střih, doporučujeme objednávat o jednu až dvě velikosti menší'],
      fit: ['Model měří 183 cm a nosí velikost M'],
      sizes: [['XS', 1], ['S', 2], ['M', 2], ['L', 'obj'], ['XL', 'obj']],
      images: [img('2606-1_mari-gorki-produktovki-edited.jpg', '69c557f7'), img('2606_mari-gorki-opr.jpg', '69c557f6')],
      captions: { 0: 'Model 183 cm · M', 1: 'Model 183 cm · M' },
      chart: img('2606-2_heavy-oversize.jpg', '69c59c5b')
    },
    {
      id: 'kulturni-doom-washed-black-dads-cap', name: "KULTURNÍ DOOM Washed Black Dad's Cap", cat: 'cepice', price: 750,
      tag: 'Kulturní doom is now', color: 'Washed Black', swatch: '#1d1d1f',
      bullets: ["Dad's cap střih", 'Výšivka vpředu a na straně', 'Vzadu pásek s kovovou přezkou pro úpravu velikosti'],
      sizes: [['Univerzální', 0]],
      images: [img('2618-2_mari-gorki-produktovki-edited-12.jpg', '69c56191'), img('2618_mari-gorki-produktovki-edited-10.jpg', '69c56173'), img('2618-3_kulturni-doom-washed-black-dad-s-cap.jpg', '69c561a4')]
    },
    {
      id: 'ups-i-did-it-again-buck-dads-cap', name: "UPS I did it again Buck Dad's Cap", cat: 'cepice', price: 750,
      tag: 'Kurýr swag', color: 'Buck', swatch: '#5f5942',
      bullets: ["Dad's cap střih", 'Výšivka vpředu a na straně', 'Vzadu pásek s kovovou přezkou pro úpravu velikosti'],
      sizes: [['Univerzální', 3]],
      images: [img('2621-2_mari-gorki-produktovki-edited-23.jpg', '69c5628c'), img('2621_mari-gorki-produktovki-edited-21.jpg', '69c5628a'), img('2621-1_mari-gorki-produktovki-edited-22.jpg', '69c5628c')]
    }
  ];

  const CATS = { mikiny: 'Mikiny', trika: 'Trika', cepice: 'Čepice', tasky: 'Tašky' };

  window.KZW_DATA = {
    products: P,
    byId: Object.fromEntries(P.map(p => [p.id, p])),
    cats: CATS,
    logo: USER + 'logos/kzw_logo_without_lines_wht_small.png',
    banners: {
      nalejto: USER + 'banners/nalejtokzw_zima23_cover_foto_eshop_copy_2.jpg?65690713',
      workshop: USER + 'banners/workshopy_vouchery_banner_eshop_copy.jpg?657e1a54',
      damske: USER + 'banners/karusel_da__mske___orchidej_verze3.jpg?6374217a',
      panske: USER + 'banners/karusel_pa__nske___les_is_more.jpg?637423bd'
    },
    collab: {
      eggo: img('2624-4_skrtecek-produktovka.jpg', '69e682dd'),
      sebe: img('2648-3_sebe-kzw-edited-16.jpg', '6ab632db')
    },
    // Pořadí pro sekci Jak to sedí: [id, index fotky, popisek]
    fitLook: [
      ['auto-moto-longsleeve-tee', 0, 'Modelka 170 cm', 'S'],
      ['volno-heavy-box-hoody', 1, 'Model 187 cm', 'L'],
      ['disconnect-turtleneck-longsleeve-tee', 0, 'Modelka 170 cm', 'XS'],
      ['milan-fashion-weak-heavy-oversize-tee', 0, 'Model 187 cm', 'M'],
      ['volno-heavy-box-hoody', 0, 'Modelka 163 cm', 'XS'],
      ['disconnect-heavy-oversize-tee', 0, 'Model 183 cm', 'M'],
      ['sedativa-heavy-oversize-tee', 0, 'Model 187 cm', 'M'],
      ['auto-moto-heavy-oversize-tee', 0, 'Model 183 cm', 'M']
    ],
    slogans: ['Konečně volno', 'No nazdar!', 'Fashion weak, attitude strong', 'Sedativa pro Váš hezčí den', 'Kulturní doom is now', 'Kurýr swag', 'Rurální swag 3000', 'The disbalance never ends', 'Call meee', 'Utrpení českého kutila is real']
  };
})();
