/* MOONSUIT · concept by MALUS/01 · v2
   Everything the pages render comes from this file.
   Source: moonsuitactive.com (products.json, product pages, policies) and @moonsuitactive, read 19 Nov 2026.
   DEMO = example values for the concept (see `demo` flags). */
window.MS = {
  brand: {
    name: 'MOONSUIT',
    tagline: 'The Moonsuit effect',
    instagram: 'https://www.instagram.com/moonsuitactive/',
    igHandle: '@moonsuitactive',
    whatsapp: '+212 632 910 251',
    whatsappLink: 'https://wa.me/212632910251',
    email: 'mounia@moonsuitactive.com',
    company: 'MoonSuit Wear SARLAU',
    address: '21 Rue Abou Abdellah Nafii, Résidence Ben Omar, Étage 4, Appartement 10, Quartier Maarif, Casablanca, Morocco',
    store: 'https://moonsuitactive.com'
  },
  currency: 'Dh',
  freeShipping: 500,
  shipping: {
    free: 'Free delivery across Morocco on orders over 500 Dh',
    casablanca: 'Casablanca: 1–3 days',
    nationwide: 'Morocco nationwide: 3–7 business days',
    payment: 'Cash on delivery or bank transfer',
    returns: 'Returns within 24 hours of delivery. Unworn, with all tags attached. Store credit only.'
  },
  care: 'Wash inside out at 30°C with like colours. Bright colours may bleed, so wash them separately the first time. Do not tumble dry, bleach or iron.',
  fabric: '90% polyamide, 10% elastane. Seamless 3D-knit. Made in Turkey.',

  /* real size guide (moonsuitactive.com/pages/size-guide) */
  sizeGuide: {
    note: "Our seamless fabric has 4-way stretch. If you're between sizes, size up for a more relaxed fit or size down for a more sculpting effect.",
    rows: [
      { label: 'EU', xs: '34–36', ml: '38–40' },
      { label: 'Waist (cm)', xs: '60–67', ml: '68–76' },
      { label: 'Hips (cm)', xs: '86–93', ml: '94–102' },
      { label: 'Height (cm)', xs: '155–165', ml: '163–173' }
    ]
  },

  colors: {
    'Wine': '#642B3A', 'Burgundy': '#5A1F22', 'Red': '#C9301F', 'Orange': '#E8793A',
    'Pink': '#CF9DBB', 'Matcha': '#A7BE8A', 'Kaki': '#7E8C6A', 'Light Blue': '#A3BCD6',
    'Blue': '#3A5794', 'Blue Petrol': '#3F6B86', 'Navy': '#262C4A', 'Black': '#111113',
    'Grey': '#5E5759', 'Brown': '#4A2A1F'
  },
  colorOrder: ['Wine', 'Burgundy', 'Red', 'Orange', 'Pink', 'Matcha', 'Kaki', 'Light Blue', 'Blue', 'Blue Petrol', 'Navy', 'Black', 'Grey', 'Brown'],

  types: [
    { id: 'all', label: 'All' },
    { id: 'leggings', label: 'Leggings' },
    { id: 'bras', label: 'Sports bras' },
    { id: 'tops', label: 'Tops' },
    { id: 'shorts', label: 'Shorts' },
    { id: 'accessories', label: 'Accessories' }
  ],

  /* sizes: 'in' = in stock, 'out' = sold out, missing = not made in that colour */
  products: [
    {
      handle: 'sculpting-legging', name: 'Sculpting Legging', type: 'leggings', price: 600,
      tagline: 'Shapes where it counts. Holds where it matters.',
      bullets: ['Sculpting compression: smooths your shape without squeezing', 'Seamless fit: zero friction, zero visible seams', 'High-rise waistband: flatters and holds', 'Squat-proof: fully opaque, guaranteed', 'Matte finish: sleek and modern'],
      rating: { value: '5.0', count: 3 },
      suggest: ['square-neck-bra', 'seamless-crop-tee'],
      defaultColor: 'Red',
      colors: [
        { name: 'Red', img: ['legging-red', 'legging-red-2', 'legging-red-3', 'look-red'], sizes: { 'XS/S': 'in', 'M/L': 'in' } },
        { name: 'Brown', img: ['legging-brown', 'legging-court'], sizes: { 'XS/S': 'in', 'M/L': 'in' } },
        { name: 'Grey', img: ['legging-court'], sizes: { 'M/L': 'in' } },
        { name: 'Blue Petrol', img: ['legging-petrol', 'legging-petrol-2', 'tech-back'], sizes: { 'XS/S': 'in', 'M/L': 'out' } }
      ]
    },
    {
      handle: 'square-neck-bra', name: 'Square Neck Bra', type: 'bras', price: 350,
      tagline: 'Clean neckline. Quiet confidence.',
      bullets: ['Square neck: flattering on every body', 'Removable padding: wear it your way', 'Wire-free: no hardware, no digging', 'Seamless support: medium hold that disappears on you'],
      rating: { count: 1 },
      suggest: ['essential-legging', 'seamless-short'],
      defaultColor: 'Brown',
      colors: [
        { name: 'Brown', img: ['sq-bra-brown', 'sq-bra-grey'], sizes: { 'XS/S': 'in', 'M/L': 'in' } },
        { name: 'Black', img: [], sizes: { 'XS/S': 'in', 'M/L': 'in' } },
        { name: 'Red', img: ['sq-bra-red'], sizes: { 'XS/S': 'in', 'M/L': 'in' } },
        { name: 'Grey', img: ['sq-bra-grey'], sizes: { 'XS/S': 'in', 'M/L': 'in' } },
        { name: 'Blue Petrol', img: ['sq-bra-petrol', 'legging-petrol'], sizes: { 'XS/S': 'in', 'M/L': 'out' } }
      ]
    },
    {
      handle: 'essential-legging', name: 'Essential Legging', type: 'leggings', price: 550,
      tagline: 'Your go-to legging. Holds everything in place so you can focus on everything else.',
      bullets: ['Squat-proof: tested at full stretch, fully opaque', 'High-rise waistband: smooths and stays put, no rolling', '4-way stretch: moves with you, never against you', 'Matte finish: clean look, no shine', 'Breathable zones: ventilation where you need it most'],
      rating: { count: 2 },
      suggest: ['square-neck-bra', 'front-zip-crop'],
      defaultColor: 'Black',
      colors: [
        { name: 'Black', img: ['essential-legging-2', 'crop-tee-navy'], sizes: { 'XS/S': 'in', 'M/L': 'in' } },
        { name: 'Navy', img: ['essential-legging-1', 'crop-tee-2'], sizes: { 'XS/S': 'in', 'M/L': 'in' } }
      ]
    },
    {
      handle: 'seamless-short', name: 'Seamless Short', type: 'shorts', price: 350,
      tagline: 'Less fabric. Same confidence.',
      bullets: ['Mid-thigh cut: full range of motion', 'Anti-chafing: seamless means no rubbing, even on long runs', 'Squat-proof: opaque at full stretch', 'Compression fit: supportive without feeling tight'],
      rating: { count: 2 },
      suggest: ['square-neck-bra', 'sport-headband'],
      defaultColor: 'Matcha',
      colors: [
        { name: 'Matcha', img: ['hero-matcha', 'short-matcha-back'], sizes: { 'XS/S': 'in', 'M/L': 'in' } },
        { name: 'Wine', img: ['short-wine', 'hero-wine'], sizes: { 'XS/S': 'in', 'M/L': 'in' } },
        { name: 'Light Blue', img: ['hero-blue', 'strap-bra-blue'], sizes: { 'XS/S': 'in' } },
        { name: 'Burgundy', img: ['short-burgundy', 'strap-bra-burgundy'], sizes: { 'XS/S': 'in' } },
        { name: 'Grey', img: ['short-grey'], sizes: { 'XS/S': 'in' } },
        { name: 'Black', img: [], sizes: { 'XS/S': 'in', 'M/L': 'in' } },
        { name: 'Navy', img: [], sizes: { 'XS/S': 'in', 'M/L': 'in' } }
      ]
    },
    {
      handle: 'strap-bra', name: 'Strap Bra', type: 'bras', price: 350,
      tagline: 'Minimal straps. Maximum ease.',
      bullets: ['Slim strap design: delicate but secure', 'Wire-free: nothing pokes, nothing digs', 'Seamless construction: smooth under any layer', 'Medium hold: studio, gym, everyday'],
      suggest: ['seamless-short', 'sport-headband'],
      defaultColor: 'Matcha',
      colors: [
        { name: 'Matcha', img: ['strap-bra-matcha', 'strap-bra-matcha-detail', 'hero-matcha'], sizes: { 'XS/S': 'in', 'M/L': 'in' } },
        { name: 'Light Blue', img: ['strap-bra-blue', 'headband-brown'], sizes: { 'XS/S': 'in' } },
        { name: 'Burgundy', img: ['strap-bra-burgundy', 'short-burgundy'], sizes: { 'XS/S': 'in' } }
      ]
    },
    {
      handle: 'cross-back-bra', name: 'Cross-Back Bra', type: 'bras', price: 350,
      tagline: 'Looks as good from the back as from the front.',
      bullets: ['Cross-back design: made to be seen', 'Scoop neckline: open and flattering', 'Wire-free seamless construction', 'Lightweight hold: layer it or wear it solo'],
      suggest: ['seamless-short', 'long-sleeve-top'],
      defaultColor: 'Wine',
      colors: [
        { name: 'Wine', img: ['cross-bra-wine', 'cross-bra-wine-back', 'hero-wine'], sizes: { 'XS/S': 'in', 'M/L': 'in' } },
        { name: 'Black', img: [], sizes: { 'XS/S': 'in', 'M/L': 'in' } },
        { name: 'Blue', img: [], sizes: { 'XS/S': 'in', 'M/L': 'in' } }
      ]
    },
    {
      handle: 'front-zip-crop', name: 'Front-Zip Crop', type: 'tops', price: 400,
      tagline: 'One zip. Full control.',
      bullets: ['Front zip: on, off, adjusted in a second', 'Adjustable coverage: you decide how much', 'Seamless sides: no friction against your skin', 'Works alone or as a layer'],
      rating: { count: 1 },
      suggest: ['sculpting-legging', 'sport-headband'],
      defaultColor: 'Grey',
      colors: [
        { name: 'Grey', img: ['zip-grey', 'short-grey', 'headband-grey'], sizes: { 'XS/S': 'in', 'M/L': 'out' } },
        { name: 'Brown', img: ['zip-brown', 'legging-court'], sizes: { 'XS/S': 'in', 'M/L': 'in' } },
        { name: 'Black', img: ['essential-legging-2'], sizes: { 'XS/S': 'in', 'M/L': 'in' } }
      ]
    },
    {
      handle: 'long-sleeve-top', name: 'Long Sleeve Top', type: 'tops', price: 450,
      tagline: 'Full coverage. Zero weight.',
      bullets: ['Long sleeves, cropped length: covers without overheating', "Seamless construction: contours your body, doesn't cling", "Light enough to forget you're wearing it"],
      suggest: ['sculpting-legging', 'square-neck-bra'],
      defaultColor: 'Red',
      colors: [
        { name: 'Red', img: ['long-sleeve-red', 'look-red', 'legging-red-3'], sizes: { 'XS/S': 'in', 'M/L': 'in' } },
        { name: 'Wine', img: ['long-sleeve-wine'], sizes: { 'XS/S': 'in' } }
      ]
    },
    {
      handle: 'seamless-crop-tee', name: 'Seamless Crop Tee', type: 'tops', price: 350, isNew: true,
      tagline: "The piece you'll reach for every time.",
      bullets: ['Cropped, relaxed fit: pairs with everything', 'Seamless: no tags, no seams against your skin', 'Breathable and lightweight'],
      rating: { count: 2 },
      suggest: ['essential-legging', 'sport-headband'],
      defaultColor: 'Navy',
      colors: [
        { name: 'Navy', img: ['crop-tee-navy', 'crop-tee-2'], sizes: { 'XS/S': 'in', 'M/L': 'in' } }
      ]
    },
    {
      handle: 'sculpting-legging-summer', name: 'Sculpting Legging Summer', type: 'leggings', price: 480, compare: 600, summer: true, demo: true,
      tagline: 'Shapes where it counts. Holds where it matters.',
      bullets: ['Sculpting zones: smooth your shape without squeezing', 'Squat-proof: fully opaque, guaranteed', 'High-rise waistband: flatters and holds', '4-way stretch: full range of motion'],
      suggest: ['square-neck-bra-summer', 'strap-bra'],
      defaultColor: 'Pink',
      colors: [
        { name: 'Pink', img: ['hero-pink', 'sq-bra-summer-pink'], sizes: { 'XS/S': 'in' } },
        { name: 'Kaki', img: ['legging-summer-kaki', 'sq-bra-summer-kaki'], sizes: { 'XS/S': 'in' } }
      ]
    },
    {
      handle: 'square-neck-bra-summer', name: 'Square Neck Bra Summer', type: 'bras', price: 280, compare: 350, summer: true, demo: true,
      tagline: 'Clean neckline. Quiet confidence.',
      bullets: ['Square neck: flattering on every body', 'Removable padding: wear it your way', 'Wire-free: no hardware, no digging', 'Seamless support: medium hold that disappears on you'],
      suggest: ['sculpting-short-summer', 'sculpting-legging-summer'],
      defaultColor: 'Orange',
      colors: [
        { name: 'Orange', img: ['sq-bra-summer-orange', 'short-summer-orange'], sizes: { 'XS/S': 'in' } },
        { name: 'Pink', img: ['sq-bra-summer-pink', 'short-summer-pink'], sizes: { 'XS/S': 'in' } },
        { name: 'Kaki', img: ['sq-bra-summer-kaki', 'legging-summer-kaki'], sizes: { 'XS/S': 'in' } }
      ]
    },
    {
      handle: 'sculpting-short-summer', name: 'Sculpting Short Summer', type: 'shorts', price: 280, compare: 350, summer: true, demo: true,
      tagline: 'Made for the heat. Built to sculpt.',
      bullets: ['Seamless sculpting fabric', 'High-waisted fit for support and confidence', 'Breathable and sweat-wicking'],
      suggest: ['square-neck-bra-summer', 'sport-headband'],
      defaultColor: 'Pink',
      colors: [
        { name: 'Pink', img: ['short-summer-pink', 'short-summer-pink-back'], sizes: { 'XS/S': 'in' } },
        { name: 'Orange', img: ['short-summer-orange', 'headband-red'], sizes: { 'XS/S': 'in' } }
      ]
    },
    {
      handle: 'sport-headband', name: 'Sport Headband', type: 'accessories', price: 80, oneSize: true,
      tagline: "Stays put. You don't have to.",
      bullets: ['No-slip grip: from warm-up to cool-down', 'Seamless comfort: no pressure points', 'One size fits all'],
      rating: { count: 2 },
      suggest: ['front-zip-crop', 'sculpting-legging'],
      defaultColor: 'Brown',
      colors: [
        { name: 'Brown', img: ['headband-brown'], sizes: { 'One size': 'in' } },
        { name: 'Red', img: ['headband-red'], sizes: { 'One size': 'in' } },
        { name: 'Grey', img: ['headband-grey'], sizes: { 'One size': 'in' } },
        { name: 'Blue', img: [], sizes: { 'One size': 'in' } }
      ]
    }
  ],

  /* hero editions: captions are Moonsuit's own Instagram / collection copy */
  editions: [
    {
      id: 'wine', tab: 'Wine', title: ['Wine', 'edition'], label: 'Wine edition', caption: "Wine o'clock, but make it Moonsuit.",
      note: 'New this November', img: 'hero-wine', pos: '52% 30%',
      tint: '#2A141D', ink: '#F7EDF0', soft: 'rgba(247,237,240,.72)', swatch: '#642B3A',
      pieces: [['cross-back-bra', 'Wine'], ['seamless-short', 'Wine']]
    },
    {
      id: 'matcha', tab: 'Matcha', title: ['Matcha', 'set'], label: 'Matcha set', caption: 'A walking green flag.',
      note: 'Strap Bra + Seamless Short', img: 'hero-matcha', pos: '45% 34%',
      tint: '#232E1E', ink: '#EEF3E6', soft: 'rgba(238,243,230,.72)', swatch: '#A7BE8A',
      pieces: [['strap-bra', 'Matcha'], ['seamless-short', 'Matcha']]
    },
    {
      id: 'pink', tab: 'Pink', title: ['Pink', 'season'], label: 'Pink season', caption: 'Made for the heat. Built to move.',
      note: 'Summer Edition, now 20% off', img: 'hero-pink', pos: '55% 40%',
      tint: '#3A1D2A', ink: '#FBEDF2', soft: 'rgba(251,237,242,.72)', swatch: '#CF9DBB',
      pieces: [['square-neck-bra-summer', 'Pink'], ['sculpting-legging-summer', 'Pink']]
    },
    {
      id: 'blue', tab: 'Baby blue', title: ['Baby', 'blue'], label: 'Baby blue', caption: 'Elevate the fit. Elevate the mood.',
      note: 'Strap Bra + Seamless Short', img: 'hero-blue', pos: '42% 30%',
      tint: '#16263A', ink: '#E9F0F8', soft: 'rgba(233,240,248,.72)', swatch: '#A3BCD6',
      pieces: [['strap-bra', 'Light Blue'], ['seamless-short', 'Light Blue']]
    }
  ],

  look: {
    title: ['Red,', 'top to toe.'],
    img: 'look-red',
    caption: 'Long Sleeve Top + Sculpting Legging, shot on the Atlantic in Casablanca.',
    pieces: [
      { handle: 'long-sleeve-top', color: 'Red', spot: { x: 47, y: 36 } },
      { handle: 'sculpting-legging', color: 'Red', spot: { x: 45, y: 79 } }
    ]
  },

  /* real Loox reviews from moonsuitactive.com (names as published) */
  reviews: [
    { handle: 'square-neck-bra', name: 'Nora M.', date: '13 Jun 2026', item: 'Square Neck Bra · Red · XS/S', text: 'It feels like you are wearing nothing! It is so comfy on the body, so gentle, and it fits perfectly everywhere. I have washed it once so far and with Mouni\'s advice the colour is still shining.' },
    { handle: 'essential-legging', name: 'Soukaina E.', date: '18 Apr 2026', item: 'Essential Legging · Navy · M/L', text: 'The quality is indescribable. Once you put it on, it hugs and enhances your shape, while offering good support without flattening.' },
    { handle: 'seamless-crop-tee', name: 'Sarah B.', date: '14 Apr 2026', item: 'Seamless Crop Tee · Navy · XS/S', text: 'Super comfortable, very flattering, and fits really nicely without feeling tight or restrictive. I bought it with the matching leggings and the set looks great together.' },
    { handle: 'sculpting-legging', name: 'Nahid E.', date: '6 May 2026', item: 'Sculpting Legging · Brown · XS/S', text: 'Super qualité de tissu, maintien et shape incroyable.' },
    { handle: 'seamless-short', name: 'Zeina M.', date: '8 Aug 2026', item: 'Seamless Short', text: "J'ai adoré ce short, il taille super bien, la matière est très agréable à porter et légère." },
    { handle: 'sculpting-legging', name: 'Hicham B.', date: '18 Apr 2026', item: 'Sculpting Legging · Blue Petrol · XS/S', text: 'The best legging in the world.' }
  ],
  productReviews: {
    'sculpting-legging': [
      { name: 'Nora M.', date: '13 Jun 2026', item: 'Red · XS/S', text: 'Perfect set! Perfect delivery! Perfect everything.' },
      { name: 'Nahid E.', date: '6 May 2026', item: 'Brown · XS/S', text: 'Super qualité de tissu, maintien et shape incroyable.' },
      { name: 'Hicham B.', date: '18 Apr 2026', item: 'Blue Petrol · XS/S', text: 'The best legging in the world.' }
    ],
    'essential-legging': [
      { name: 'Soukaina E.', date: '18 Apr 2026', item: 'Navy · M/L', text: 'The quality is indescribable. Once you put it on, it hugs and enhances your shape, while offering good support without flattening.' },
      { name: 'Sarah B.', date: '14 Apr 2026', item: 'Navy · XS/S', text: 'The fit is really good: classic, flattering, and comfortable without feeling restrictive. The navy colour is such a great alternative to black.' }
    ],
    'seamless-crop-tee': [
      { name: 'Sarah B.', date: '14 Apr 2026', item: 'Navy · XS/S', text: 'Super comfortable, very flattering, and fits really nicely without feeling tight or restrictive. I bought it with the matching leggings and the set looks great together.' },
      { name: 'Nissrine A.', date: '3 May 2026', item: '', text: "Très beaux sets, qui galbent super bien la peau, qu'on ne voit pas en transparence. Je recommande." }
    ],
    'square-neck-bra': [
      { name: 'Nora M.', date: '13 Jun 2026', item: 'Red · XS/S', text: "It feels like you are wearing nothing! It is so comfy on the body, so gentle, and it fits perfectly everywhere." }
    ],
    'front-zip-crop': [
      { name: 'Sarah B.', date: '14 Apr 2026', item: 'Black · XS/S', text: "J'ai pris la taille XS/S et la coupe est vraiment flatteuse. Il est confortable sans être trop serré, et le zip à l'avant est à la fois pratique et stylé." }
    ],
    'seamless-short': [
      { name: 'Zeina M.', date: '8 Aug 2026', item: '', text: "J'ai adoré ce short, il taille super bien, la matière est très agréable à porter et légère." },
      { name: 'Hicham B.', date: '2 Aug 2026', item: 'Wine · XS/S', text: 'Perfect!!!' }
    ],
    'sport-headband': [
      { name: 'Nora M.', date: '13 Jun 2026', item: 'Red', text: 'I wore it to a workout of an hour and it remained in place!' },
      { name: 'Angela S.', date: '18 Jun 2026', item: 'Red', text: 'Excellente qualité de tissu, très jolie couleur.' }
    ]
  },

  /* full-size originals on the MOONSUIT Shopify CDN: online the page swaps in a sharper copy
     when the screen needs it and the framing matches; offline the local copy stays */
  hdBase: 'https://moonsuitactive.com/cdn/shop/files/',
  hd: {
    'look-red': 'Moonsuit-11_fc74460f-513c-4704-a543-98300489df85.jpg',
    'tech-back': 'Moonsuit-7.jpg',
    'crop-tee-navy': 'Moonsuit-129_bis.jpg',
    'essential-legging-1': 'Moonsuit-32bis.jpg',
    'essential-legging-2': 'Moonsuit-113.jpg',
    'crop-tee-2': 'Moonsuit-121.jpg',
    'legging-summer-kaki': 'moonsuitsummer-retouchee-55.jpg',
    'sq-bra-summer-orange': 'moonsuitsummer-retouchee-6.jpg',
    'sq-bra-summer-pink': 'moonsuitsummer-retouchee-10.jpg',
    'sq-bra-summer-kaki': 'moonsuitsummer-retouchee-58.jpg',
    'short-summer-pink': 'moonsuitsummer-retouchee-12.jpg',
    'short-summer-orange': 'moonsuitsummer-retouchee-3.jpg',
    'short-summer-pink-back': 'moonsuitsummer-retouchee-13.jpg',
    'short-wine': 'moonsuitsummer-retouchee-50.jpg',
    'short-burgundy': 'Moonsuit-27.jpg',
    'short-grey': 'Moonsuit-32_bis.jpg',
    'short-matcha-back': 'moonsuitsummer-retouchee-24.jpg',
    'strap-bra-matcha': 'moonsuitsummer-retouchee-32.jpg',
    'strap-bra-blue': 'moonsuitsummer-retouchee-42_4fb7910e-0673-4599-b0a1-3712e73a9e5b.jpg',
    'strap-bra-burgundy': 'Moonsuit-23_f2ea2cec-cb70-45da-98c8-51da7a6e636b.jpg',
    'strap-bra-matcha-detail': 'moonsuitsummer-retouchee-33.jpg',
    'cross-bra-wine': 'moonsuitsummer-retouchee-54.jpg',
    'cross-bra-wine-back': 'moonsuitsummer-retouchee-49.jpg',
    'long-sleeve-red': 'Moonsuit-9bis.jpg',
    'long-sleeve-wine': 'moonsuitsummer-retouchee-45.jpg',
    'zip-grey': 'Moonsuit-35bis.jpg',
    'zip-brown': 'moonsuit-68_bis.jpg',
    'headband-brown': 'moonsuitsummer-retouchee-35.jpg',
    'headband-grey': 'Handband_gris.jpg',
    'headband-red': 'moonsuitsummer-retouchee-3_afd5345a-5df5-4299-9b18-b1dbe7763428.jpg',
    'sq-bra-brown': 'Moonsuit-99bis.jpg',
    'sq-bra-grey': 'Moonsuit-86.jpg',
    'sq-bra-petrol': 'Moonsuit-4bis.jpg',
    'sq-bra-red': 'Moonsuit-9.jpg',
    'legging-red': 'Moonsuit-12.jpg',
    'legging-red-2': 'Moonsuit-10.jpg',
    'legging-red-3': 'Moonsuit-11.jpg',
    'legging-petrol': 'Moonsuit-5bis.jpg',
    'legging-petrol-2': 'Moonsuit-2bis.jpg',
    'legging-brown': 'Moonsuit-74.jpg',
    'legging-court': 'Moonsuit-77.jpg',
    'join-court': 'Moonsuit-74.jpg'
  },

  film: {
    src: 'https://moonsuitactive.com/cdn/shop/videos/c/vp/7e2f92f2f9f246e1a0df98d75cca3725/7e2f92f2f9f246e1a0df98d75cca3725.HD-1080p-7.2Mbps-79730288.mp4?v=0',
    poster: 'film-poster',
    label: 'MOONSUIT film from the homepage of moonsuitactive.com'
  },

  story: {
    quote: "There's a moment mid-workout where you stop thinking about your clothes and just move. That's the feeling I was chasing.",
    by: 'Mounia, founder of MOONSUIT',
    lead: "We couldn't find it. So we made it.",
    text: 'After years of training across 11 disciplines, Mounia still could not find activewear that was both strong and beautiful. So she built it: premium seamless fabrics made to European textile standards, squat-proof, shape-keeping, designed to move with you.'
  }
};
