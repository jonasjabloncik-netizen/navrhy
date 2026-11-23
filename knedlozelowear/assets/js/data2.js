/* Rozšíření dat pro koncept v2: lidé na runwayi, stories, archiv potisků, vitrína.
   Fotky, ceny a texty z www.knedlozelowear.cz (stav 6. 11. 2026). */
(function () {
  const D = window.KZW_DATA;
  const SHOP = 'https://cdn.myshoptet.com/usr/www.knedlozelowear.cz/user/shop/big/';
  const USER = 'https://cdn.myshoptet.com/usr/www.knedlozelowear.cz/user/';
  // klíč "soubor|ts" -> URL velké fotky
  D.u = key => {
    if (/^https?:/.test(key)) return key;
    const [f, ts] = key.split('|');
    return SHOP + f + '?ff=1&x=1024&y=1365&q=95&ts=' + ts + '&sg=29e66194';
  };
  D.fileOf = url => decodeURIComponent(String(url).split('?')[0].split('/').pop());
  D.mask = url => (window.KZW_MASKS || {})[D.fileOf(url)] || null;

  /* Barvy a slogany pro scénu (barvy podle potisků a bannerů KZW) */
  const stage = {
    'volno-heavy-box-hoody': { bg: '#4e5c78', fg: '#e8c25a', lines: ['Konečně', 'volno.'] },
    'sedativa-heavy-oversize-tee': { bg: '#efd48f', fg: '#b83a45', lines: ['Sedativa pro', 'Váš hezčí den'] },
    'milan-fashion-weak-heavy-oversize-tee': { bg: '#efc6a8', fg: '#000000', lines: ['Fashion weak,', 'attitude strong'] },
    'disconnect-heavy-oversize-tee': { bg: '#7fb5aa', fg: '#000000', lines: ['Disconnect', 'since 2011'] },
    'auto-moto-heavy-oversize-tee': { bg: '#e8834f', fg: '#000000', lines: ['Rurální', 'swag 3000'] },
    'auto-moto-longsleeve-tee': { bg: '#a9c9df', fg: '#000000', lines: ['Auto moto', 'swag 3000'] },
    'disconnect-turtleneck-longsleeve-tee': { bg: '#244648', fg: '#a2dea2', lines: ['Disconnection', 'services'] },
    'nazdar-spinach-green-dads-cap': { bg: '#244648', fg: '#e8c25a', lines: ['No', 'nazdar!'] },
    'nazdar-camo-dads-cap': { bg: '#6b6a45', fg: '#e8c25a', lines: ['No', 'nazdar!'] },
    'volno-sea-blue-dads-cap': { bg: '#3f4f7a', fg: '#e8c25a', lines: ['Konečně', 'volno!'] },
    'kulturni-doom-washed-black-dads-cap': { bg: '#1d1d1f', fg: '#7fd6cf', lines: ['Kulturní', 'doom'] },
    'ups-i-did-it-again-buck-dads-cap': { bg: '#5f5942', fg: '#e8b84a', lines: ['Kurýr', 'swag'] },
    'disbalance-laptop-bag': { bg: '#1f2740', fg: '#ffffff', lines: ['Work-life', 'disbalance'] },
    'call-me-denim-tote-bag': { bg: '#39456b', fg: '#e8c25a', lines: ['Call', 'meee'] }
  };
  Object.keys(stage).forEach(id => { if (D.byId[id]) D.byId[id].stage = stage[id]; });

  /* Doplňky do celého looku */
  D.looks = {
    'volno-heavy-box-hoody': ['volno-sea-blue-dads-cap', 'call-me-denim-tote-bag'],
    'sedativa-heavy-oversize-tee': ['ups-i-did-it-again-buck-dads-cap', 'call-me-denim-tote-bag'],
    'milan-fashion-weak-heavy-oversize-tee': ['nazdar-camo-dads-cap', 'call-me-denim-tote-bag'],
    'disconnect-heavy-oversize-tee': ['nazdar-spinach-green-dads-cap', 'disbalance-laptop-bag'],
    'auto-moto-heavy-oversize-tee': ['ups-i-did-it-again-buck-dads-cap', 'disbalance-laptop-bag'],
    'auto-moto-longsleeve-tee': ['volno-sea-blue-dads-cap', 'call-me-denim-tote-bag'],
    'disconnect-turtleneck-longsleeve-tee': ['nazdar-spinach-green-dads-cap', 'disbalance-laptop-bag']
  };

  /* Lidé na runwayi: výšky a velikosti podle popisů u produktů KZW */
  D.people = [
    { id: 'p170', who: 'Modelka', h: 170, looks: [
      { pid: 'auto-moto-longsleeve-tee', img: '2612-1_mari-gorki-produktovki-edited-25.jpg|69c55b13', size: 'S' },
      { pid: 'disconnect-turtleneck-longsleeve-tee', img: '2609-5_mari-gorki-produktovki-edited-29.jpg|69c55976', size: 'XS' }
    ] },
    { id: 'p163', who: 'Modelka', h: 163, looks: [
      { pid: 'volno-heavy-box-hoody', img: '2660-1_volno-hoodie-opr-4.jpg|6ac2b23f', size: 'XS' },
      { pid: 'volno-heavy-box-hoody', img: '2660-2_volno-hoodie-opr-5.jpg|6ac2b241', size: 'XS' }
    ] },
    { id: 'p187', who: 'Model', h: 187, looks: [
      { pid: 'volno-heavy-box-hoody', img: '2660-4_volno-hoodie-opr-8.jpg|6ac2b243', size: 'L' },
      { pid: 'sedativa-heavy-oversize-tee', img: '2654-2_produktovky-33.jpg|6ac2ae8f', size: 'M' },
      { pid: 'milan-fashion-weak-heavy-oversize-tee', img: '2657-4_produktovky-40.jpg|6ac2b108', size: 'M' }
    ] },
    { id: 'p183', who: 'Model', h: 183, looks: [
      { pid: 'disconnect-heavy-oversize-tee', img: '2606_mari-gorki-opr.jpg|69c557f6', size: 'M' },
      { pid: 'auto-moto-heavy-oversize-tee', img: '2615_mari-gorki-produktovki-edited-3.jpg|69c55d70', size: 'M', back: true },
      { pid: 'disconnect-heavy-oversize-tee', img: '2606-1_mari-gorki-produktovki-edited.jpg|69c557f7', size: 'M', back: true }
    ] }
  ];
  D.runwayStart = 1; // modelka 163 cm v mikině VOLNO

  /* Vitrína: kolaborace KZW × Nalejto a KZW × Eggo */
  const V = [
    ['nalejto-dim-sum', 'DIM SUM', 'Mělký talíř', 940, '2585_dim-sum-web.jpg|69371168', 'KZW × Nalejto'],
    ['nalejto-hodne-nikde', 'HODNĚ NIKDE', 'Široký talíř', 940, '1955_hodne-nikde-tali--r-26cm.png|642c9c0c', 'KZW × Nalejto'],
    ['nalejto-hell-low-kitty', 'HELL LOW Kitty', 'Hrnek 0,27 l', 550, '2588_kitty-web.jpg|69371242', 'KZW × Nalejto'],
    ['nalejto-konzum', 'KONZUM', 'Mělký talíř', 940, '2076_konzum.png|65690441', 'KZW × Nalejto'],
    ['nalejto-plat-mat', 'PLAT & MAT', 'Hrnek 0,36 l', 550, '1949_plat--stin--oprava.png|642ca540', 'KZW × Nalejto'],
    ['nalejto-greek-mycology', 'GREEK MYCOLOGY', 'Široký talíř', 940, '2582_mycology-web.jpg|693710c1', 'KZW × Nalejto'],
    ['nalejto-potraviny', 'POTRAVINY', 'Hrnek 0,27 l', 550, '2252_hrnek-potraviny.png|67597a91', 'KZW × Nalejto'],
    ['nalejto-delay', 'DELAY / Nestihl', 'Hrnek 0,27 l', 550, '2070_hrnek-delay-nestihl.png|65690191', 'KZW × Nalejto'],
    ['eggo-mikes', 'MIKEŠ', 'Kožená peněženka', 1599, '2627-3_mikes-produktovka.jpg|69e68390', 'KZW × Eggo', true],
    ['eggo-skrtecek', 'ŠKRTEČEK', 'Kožená peněženka', 1599, '2624-4_skrtecek-produktovka.jpg|69e682dd', 'KZW × Eggo', true]
  ];
  D.vitrina = V.map(([id, name, kind, price, img, collab, from]) => {
    const p = {
      id, name: name + ' ' + kind, short: name, kind, cat: collab.indexOf('Eggo') > 0 ? 'penezenky' : 'porcelan', price, from: !!from,
      tag: collab, collab, vitrine: true,
      desc: (from ? 'Kožená peněženka' : 'Porcelán') + ' z kolaborace ' + collab + '. ' + name + ', ' + kind.toLowerCase() + '.',
      bullets: [kind, 'Kolaborace ' + collab], sizes: [['Univerzální', 'na']], images: [D.u(img)]
    };
    D.products.push(p); D.byId[id] = p;
    return p;
  });
  D.cats.porcelan = 'Porcelán';
  D.cats.penezenky = 'Peněženky';

  /* Archiv potisků: detaily z produktových fotek */
  D.prints = [
    { pid: 'milan-fashion-weak-heavy-oversize-tee', img: '2657-1_produktovky-36.jpg|6ac2b100', name: 'Milan Fashion Weak', ink: '#e7b796', z: 1.08, o: '50% 58%', note: 'Potisk na hrudi, Heavy Oversize Tee' },
    { pid: 'sedativa-heavy-oversize-tee', img: '2654-3_produktovky-34.jpg|6ac2ae90', name: 'Sedativa', ink: '#b83a45', z: 1.25, o: '50% 66%', note: 'Potisk na hrudi, Heavy Oversize Tee' },
    { pid: 'disconnect-heavy-oversize-tee', img: '2606-1_mari-gorki-produktovki-edited.jpg|69c557f7', name: 'Disconnect', ink: '#7fb5aa', z: 1.9, o: '49% 45%', note: 'Velký potisk na zádech' },
    { pid: 'auto-moto-heavy-oversize-tee', img: '2615_mari-gorki-produktovki-edited-3.jpg|69c55d70', name: 'Auto moto', ink: '#e8834f', z: 1.75, o: '50% 50%', note: 'Velký potisk na zádech' },
    { pid: 'volno-heavy-box-hoody', img: '2660-5_produktovky-45.jpg|6ac2b269', name: 'Volno', ink: '#e8c25a', z: 1.7, o: '58% 40%', note: 'Logo Knedlo Zelo Wear dole u lemu' },
    { pid: 'nazdar-spinach-green-dads-cap', img: '2669-1_produktovky-20.jpg|6ac2b51b', name: 'Nazdar', ink: '#d9c45c', z: 1.7, o: '64% 33%', note: 'Výšivka na boku kšiltovky' }
  ];

  /* Stories: nakupovatelné příběhy (fotky z produktových focení KZW) */
  D.stories = [
    { id: 'drop', title: 'Nový drop', cover: '2660_volno-hoodie-opr-2.jpg|6ac2b23e', slides: [
      { img: '2660_volno-hoodie-opr-2.jpg|6ac2b23e', pid: 'volno-heavy-box-hoody', text: 'Konečně volno.' },
      { img: '2669-4_produktovky-23.jpg|6ac2b523', pid: 'nazdar-spinach-green-dads-cap', text: 'No nazdar!' },
      { img: '2657-4_produktovky-40.jpg|6ac2b108', pid: 'milan-fashion-weak-heavy-oversize-tee', text: 'Fashion weak, attitude strong' },
      { img: '2654-2_produktovky-33.jpg|6ac2ae8f', pid: 'sedativa-heavy-oversize-tee', text: 'Sedativa pro Váš hezčí den' },
      { img: '2672_produktovky-2.jpg|6ac2b70b', pid: 'disbalance-laptop-bag', text: 'The disbalance never ends' }
    ] },
    { id: 'volno', title: 'VOLNO', cover: '2660-3_volno-hoodie-opr-6.jpg|6ac2b242', slides: [
      { img: '2660-1_volno-hoodie-opr-4.jpg|6ac2b23f', pid: 'volno-heavy-box-hoody', text: 'Modelka 163 cm nosí XS' },
      { img: '2660-4_volno-hoodie-opr-8.jpg|6ac2b243', pid: 'volno-heavy-box-hoody', text: 'Model 187 cm nosí L' },
      { img: '2660-6_produktovky-46.jpg|6ac2b26a', pid: 'volno-heavy-box-hoody', text: '460 g/m², širší střih' },
      { img: '2660-5_produktovky-45.jpg|6ac2b269', pid: 'volno-heavy-box-hoody', text: 'Logo dole u lemu' },
      { img: '2663-3_produktovky-16.jpg|6ac2b40c', pid: 'volno-sea-blue-dads-cap', text: 'Do kompletu kšiltovka VOLNO' }
    ] },
    { id: 'nazdar', title: 'NAZDAR', cover: '2666-1_produktovky-27.jpg|6ac2b4b3', slides: [
      { img: '2669-4_produktovky-23.jpg|6ac2b523', pid: 'nazdar-spinach-green-dads-cap', text: 'Spinach Green' },
      { img: '2669-1_produktovky-20.jpg|6ac2b51b', pid: 'nazdar-spinach-green-dads-cap', text: 'Výšivky vpředu i na bocích' },
      { img: '2666-1_produktovky-27.jpg|6ac2b4b3', pid: 'nazdar-camo-dads-cap', text: 'Camo' },
      { img: '2666-3_produktovky-29.jpg|6ac2b4b7', pid: 'nazdar-camo-dads-cap', text: 'No nazdar!' }
    ] },
    { id: 'lide', title: 'Jak to sedí', cover: '2612-1_mari-gorki-produktovki-edited-25.jpg|69c55b13', slides: [
      { img: '2612-1_mari-gorki-produktovki-edited-25.jpg|69c55b13', pid: 'auto-moto-longsleeve-tee', text: 'Modelka 170 cm nosí S' },
      { img: '2609-5_mari-gorki-produktovki-edited-29.jpg|69c55976', pid: 'disconnect-turtleneck-longsleeve-tee', text: 'Modelka 170 cm nosí XS' },
      { img: '2606_mari-gorki-opr.jpg|69c557f6', pid: 'disconnect-heavy-oversize-tee', text: 'Model 183 cm nosí M' },
      { img: '2615_mari-gorki-produktovki-edited-3.jpg|69c55d70', pid: 'auto-moto-heavy-oversize-tee', text: 'Model 183 cm nosí M' }
    ] },
    { id: 'nalejto', title: 'Nalejto', cover: '2585_dim-sum-web.jpg|69371168', slides: [
      { img: '2585_dim-sum-web.jpg|69371168', pid: 'nalejto-dim-sum', text: 'Lokální porculán' },
      { img: '1955_hodne-nikde-tali--r-26cm.png|642c9c0c', pid: 'nalejto-hodne-nikde', text: 'High end stuff' },
      { img: '1949_plat--stin--oprava.png|642ca540', pid: 'nalejto-plat-mat', text: 'Pro tvou tabuli, kámo.' }
    ] },
    { id: 'dilna', title: 'Dílna', cover: USER + 'banners/karusel_da__mske___orchidej_verze3.jpg?6374217a', coverPos: '22% 40%', slides: [
      { img: USER + 'banners/karusel_da__mske___orchidej_verze3.jpg?6374217a', pos: '22% 50%', text: 'Všechno tiskneme sami', link: 'index.html#dilna', linkText: 'Kurz sítotisku' },
      { img: USER + 'banners/workshopy_vouchery_banner_eshop_copy.jpg?657e1a54', pos: '24% 50%', text: 'Voucher na workshop od 2 200 Kč', link: 'index.html#dilna', linkText: 'Vybrat voucher' }
    ] }
  ];
})();
