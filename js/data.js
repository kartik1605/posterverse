/* ============================================
   POSTERVERSE — Product Catalog
   When connecting Shopify, map each product's
   `shopifyHandle` to the product handle in your
   Shopify store (see README-SHOPIFY.md).
   ============================================ */

/* Vibe taxonomy for stickers — used by the "Shop by Vibe" grid */
const VIBES = {
  humor:   { label: "Humor",        emoji: "😂", g: ["#C99408", "#8A6603"] },
  hustle:  { label: "Hustle",       emoji: "💪", g: ["#0E8A4C", "#075E32"] },
  desi:    { label: "Desi",         emoji: "🪷", g: ["#D14E0E", "#8F3204"] },
  cars:    { label: "Cars & Bikes", emoji: "🏎️", g: ["#C22525", "#7E1414"] },
  gaming:  { label: "Gaming",       emoji: "🎮", g: ["#0E7C8A", "#07515C"] },
  tech:    { label: "Tech & Code",  emoji: "💻", g: ["#1F52B5", "#123274"] },
  music:   { label: "Music",        emoji: "🎸", g: ["#C22566", "#7E1440"] },
  love:    { label: "Love",         emoji: "❤️", g: ["#C2254B", "#7E142E"] },
  space:   { label: "Space",        emoji: "🚀", g: ["#5B32C7", "#38187F"] },
  food:    { label: "Food",         emoji: "🍕", g: ["#C97808", "#8A5203"] },
  warning: { label: "Warning Signs",emoji: "⚠️", g: ["#B8860B", "#7A5807"] },
  animals: { label: "Animals",      emoji: "🐾", g: ["#B45309", "#7C3A05"] },
  abstract:{ label: "Abstract",     emoji: "🎨", g: ["#7C3AED", "#4C1D95"] },
  mystery: { label: "Mystery",      emoji: "🎁", g: ["#334155", "#0F172A"] }
};

const PRODUCTS = [
  // ---- STICKERS ----
  {
    id: "sticker-holo-cosmic",
    vibe: "space",
    name: "Cosmic Holo Pack",
    category: "stickers",
    price: 149,
    mrp: 399,
    img: "assets/img/p-sticker-holo.webp",
    badge: "hot",
    rating: 4.9,
    reviews: 214,
    desc: "A holographic die-cut sticker pack of stars, planets and lightning bolts that shift colour with every angle. Waterproof, scratch-proof vinyl — made for laptops, bottles and helmets.",
    options: { Finish: ["Holographic", "Matte", "Glossy"] },
    shopifyHandle: "cosmic-holo-pack"
  },
  {
    id: "sticker-retro-groove",
    vibe: "abstract",
    name: "Retro Groove Sheet",
    category: "stickers",
    price: 129,
    mrp: 349,
    img: "assets/img/p-sticker-retro.webp",
    badge: "new",
    rating: 4.8,
    reviews: 158,
    desc: "70s-inspired groovy sticker sheet — smiley suns, mushrooms and wavy rainbows in warm earthy tones. Premium kiss-cut vinyl that peels clean every time.",
    options: { Finish: ["Matte", "Glossy"] },
    shopifyHandle: "retro-groove-sheet"
  },
  {
    id: "sticker-laptop-kit",
    vibe: "tech",
    name: "Laptop Vibe Kit",
    category: "stickers",
    price: 199,
    mrp: 499,
    img: "assets/img/p-sticker-laptop.webp",
    badge: "sale",
    rating: 4.7,
    reviews: 302,
    desc: "A curated 12-piece kit to give your laptop a personality upgrade. Rockets, florals and rainbows — fade-proof, bubble-free application, leaves no residue.",
    options: { Finish: ["Matte", "Glossy"] },
    shopifyHandle: "laptop-vibe-kit"
  },
  {
    id: "sticker-smiley-pop",
    vibe: "humor",
    name: "Smiley Pop Pack",
    category: "stickers",
    price: 119,
    mrp: 299,
    img: "assets/img/cat-stickers.webp",
    badge: "",
    rating: 4.8,
    reviews: 96,
    desc: "Feel-good flowers, smileys and rainbows in our signature pop palette. 15 die-cut waterproof vinyl stickers per pack — the perfect mood-lifter.",
    options: { Finish: ["Glossy", "Holographic"] },
    shopifyHandle: "smiley-pop-pack"
  },

  // ---- STICKERS: VIBE DROPS (original designs) ----
  { id: "st-low-battery", name: "Social Battery: Low", category: "stickers", vibe: "humor", price: 19, mrp: 99, img: "assets/img/stickers/st-low-battery.svg", badge: "hot", rating: 4.9, reviews: 231, desc: "For the days when small talk costs extra. Waterproof die-cut vinyl, 9cm wide.", options: { Finish: ["Matte", "Glossy"] }, shopifyHandle: "social-battery-low" },
  { id: "st-overthinking", name: "Overthinking Club", category: "stickers", vibe: "humor", price: 29, mrp: 149, img: "assets/img/stickers/st-overthinking.svg", badge: "new", rating: 4.8, reviews: 187, desc: "Lifetime member badge. Meetings held nightly at 3 AM. Waterproof vinyl, 8cm.", options: { Finish: ["Matte", "Glossy", "Holographic"] }, shopifyHandle: "overthinking-club" },
  { id: "st-hustle-loading", name: "Hustle Loading 81%", category: "stickers", vibe: "hustle", price: 19, mrp: 99, img: "assets/img/stickers/st-hustle-loading.svg", badge: "", rating: 4.7, reviews: 142, desc: "Progress bar permanently stuck at almost-there. Keep grinding. 9cm die-cut vinyl.", options: { Finish: ["Matte", "Glossy"] }, shopifyHandle: "hustle-loading" },
  { id: "st-no-excuses", name: "No Excuses Bolt", category: "stickers", vibe: "hustle", price: 19, mrp: 99, img: "assets/img/stickers/st-no-excuses.svg", badge: "hot", rating: 4.9, reviews: 264, desc: "A lightning bolt with zero patience for maybe-tomorrow. 8cm waterproof vinyl.", options: { Finish: ["Matte", "Glossy"] }, shopifyHandle: "no-excuses-bolt" },
  { id: "st-chai-first", name: "Chai First.", category: "stickers", vibe: "desi", price: 19, mrp: 99, img: "assets/img/stickers/st-chai-first.svg", badge: "hot", rating: 4.9, reviews: 318, desc: "Priorities, sorted. The cutting-chai glass that starts every great plan. 8cm vinyl.", options: { Finish: ["Matte", "Glossy"] }, shopifyHandle: "chai-first" },
  { id: "st-jugaad", name: "100% Jugaad Certified", category: "stickers", vibe: "desi", price: 19, mrp: 99, img: "assets/img/stickers/st-jugaad.svg", badge: "new", rating: 4.8, reviews: 176, desc: "Official stamp of the Desi Engineering Department. If it works, it works. 8cm vinyl.", options: { Finish: ["Matte", "Glossy"] }, shopifyHandle: "jugaad-certified" },
  { id: "st-petrolhead", name: "Petrolhead Crest", category: "stickers", vibe: "cars", price: 25, mrp: 129, img: "assets/img/stickers/st-petrolhead.svg", badge: "", rating: 4.8, reviews: 153, desc: "Piston-and-shield crest for people who hear engines in their sleep. Helmet-safe vinyl, 9cm.", options: { Finish: ["Matte", "Glossy"] }, shopifyHandle: "petrolhead-crest" },
  { id: "st-full-send", name: "Full Send Meter", category: "stickers", vibe: "cars", price: 25, mrp: 129, img: "assets/img/stickers/st-full-send.svg", badge: "new", rating: 4.7, reviews: 118, desc: "Needle buried in the red, exactly where it belongs. Fuel-cap friendly vinyl, 8cm.", options: { Finish: ["Matte", "Glossy"] }, shopifyHandle: "full-send-meter" },
  { id: "st-respawn", name: "Eat Sleep Respawn", category: "stickers", vibe: "gaming", price: 29, mrp: 149, img: "assets/img/stickers/st-respawn.svg", badge: "hot", rating: 4.9, reviews: 289, desc: "The four food groups of every gamer. Controller-purple die-cut vinyl, 9cm.", options: { Finish: ["Matte", "Glossy", "Holographic"] }, shopifyHandle: "eat-sleep-respawn" },
  { id: "st-one-more-game", name: "Just One More Game", category: "stickers", vibe: "gaming", price: 19, mrp: 99, img: "assets/img/stickers/st-one-more-game.svg", badge: "", rating: 4.8, reviews: 167, desc: "(lies). The most repeated sentence in gaming history, now in sticker form. 8cm vinyl.", options: { Finish: ["Matte", "Glossy"] }, shopifyHandle: "one-more-game" },
  { id: "st-works-machine", name: "Works On My Machine", category: "stickers", vibe: "tech", price: 19, mrp: 99, img: "assets/img/stickers/st-works-machine.svg", badge: "hot", rating: 4.9, reviews: 342, desc: "The developer's oldest defence, certified with a green tick. Laptop-grade vinyl, 9cm.", options: { Finish: ["Matte", "Glossy"] }, shopifyHandle: "works-on-my-machine" },
  { id: "st-404", name: "404 Motivation Not Found", category: "stickers", vibe: "tech", price: 19, mrp: 99, img: "assets/img/stickers/st-404.svg", badge: "", rating: 4.7, reviews: 198, desc: "Server error in browser-window styling. Refresh and try again tomorrow. 9cm vinyl.", options: { Finish: ["Matte", "Glossy"] }, shopifyHandle: "404-motivation" },
  { id: "st-cassette", name: "Rewind The Vibe", category: "stickers", vibe: "music", price: 19, mrp: 99, img: "assets/img/stickers/st-cassette.svg", badge: "new", rating: 4.8, reviews: 134, desc: "A pink cassette for people who miss album art and mean it. 9cm die-cut vinyl.", options: { Finish: ["Matte", "Glossy"] }, shopifyHandle: "rewind-the-vibe" },
  { id: "st-self-love", name: "Self Love Club", category: "stickers", vibe: "love", price: 29, mrp: 149, img: "assets/img/stickers/st-self-love.svg", badge: "hot", rating: 4.9, reviews: 276, desc: "Membership requirement: being kind to yourself first. Glossy heart vinyl, 8cm.", options: { Finish: ["Glossy", "Holographic"] }, shopifyHandle: "self-love-club" },
  { id: "st-need-space", name: "I Need More Space", category: "stickers", vibe: "space", price: 29, mrp: 149, img: "assets/img/stickers/st-need-space.svg", badge: "", rating: 4.8, reviews: 156, desc: "A rocket leaving orbit — relatable. Deep-space die-cut vinyl, 8cm round.", options: { Finish: ["Matte", "Glossy", "Holographic"] }, shopifyHandle: "need-more-space" },
  { id: "st-pizza", name: "Powered By Pizza", category: "stickers", vibe: "food", price: 19, mrp: 99, img: "assets/img/stickers/st-pizza.svg", badge: "", rating: 4.7, reviews: 189, desc: "The official energy source of late nights and good decisions. Grease-proof vinyl, 9cm.", options: { Finish: ["Matte", "Glossy"] }, shopifyHandle: "powered-by-pizza" },
  { id: "st-big-ideas", name: "Caution: Big Ideas", category: "stickers", vibe: "warning", price: 19, mrp: 99, img: "assets/img/stickers/st-big-ideas.svg", badge: "new", rating: 4.8, reviews: 121, desc: "Hazard-sign styling for dangerously creative minds. Yellow diamond vinyl, 8cm.", options: { Finish: ["Matte", "Glossy"] }, shopifyHandle: "caution-big-ideas" },
  { id: "st-cat-person", name: "Professional Cat Person", category: "stickers", vibe: "animals", price: 19, mrp: 99, img: "assets/img/stickers/st-cat-person.svg", badge: "", rating: 4.9, reviews: 243, desc: "Qualified, experienced, permanently covered in fur. Scratch-proof vinyl, 8cm round.", options: { Finish: ["Matte", "Glossy"] }, shopifyHandle: "professional-cat-person" },
  { id: "st-mystery-box", name: "Mystery Pack — 25 Stickers", category: "stickers", vibe: "mystery", price: 299, mrp: 999, img: "assets/img/stickers/st-mystery-box.svg", badge: "hot", rating: 4.9, reviews: 412, desc: "25 assorted stickers from across the verse, sealed in a surprise pack. No duplicates, no boring ones. Best value in the store.", options: { Pack: ["25 stickers", "50 stickers"] }, shopifyHandle: "mystery-pack" },

  // ---- POSTERS ----
  {
    id: "poster-shape-study",
    name: "Shape Study Duo",
    category: "posters",
    price: 599,
    mrp: 899,
    img: "assets/img/cat-posters.webp",
    badge: "hot",
    rating: 4.9,
    reviews: 187,
    desc: "A matched pair of bold abstract art prints in electric orange, violet and teal. Printed on 300 GSM museum-grade matte paper with rich, archival inks.",
    options: { Size: ["A4", "A3", "A2"], Frame: ["Unframed", "Black frame"] },
    shopifyHandle: "shape-study-duo"
  },
  {
    id: "poster-abstract-flow",
    name: "Abstract Flow",
    category: "posters",
    price: 399,
    mrp: 599,
    img: "assets/img/p-poster-abstract.svg",
    badge: "new",
    rating: 4.8,
    reviews: null, // auto-filled below
    desc: "Matisse-inspired organic cutout shapes that make any wall feel like a gallery. Fade-resistant pigment print with a soft matte finish.",
    options: { Size: ["A4", "A3", "A2"], Frame: ["Unframed", "Black frame"] },
    shopifyHandle: "abstract-flow"
  },
  {
    id: "poster-sunset-drive",
    name: "Sunset Drive",
    category: "posters",
    price: 449,
    mrp: 649,
    img: "assets/img/p-poster-sunset.svg",
    badge: "",
    rating: 4.7,
    reviews: null, // auto-filled below
    desc: "Retro gradient sun over minimal horizon lines — pure golden-hour energy for your room. 300 GSM matte art paper, ships in a rigid tube.",
    options: { Size: ["A4", "A3", "A2"], Frame: ["Unframed", "Black frame"] },
    shopifyHandle: "sunset-drive"
  },
  {
    id: "poster-bauhaus-beat",
    name: "Bauhaus Beat",
    category: "posters",
    price: 499,
    mrp: 749,
    img: "assets/img/p-poster-bauhaus.svg",
    badge: "sale",
    rating: 4.9,
    reviews: null, // auto-filled below
    desc: "Geometric rhythm inspired by the Bauhaus masters — circles, arcs and grids in perfect balance. A statement piece for studios and workspaces.",
    options: { Size: ["A4", "A3", "A2"], Frame: ["Unframed", "Black frame"] },
    shopifyHandle: "bauhaus-beat"
  },

  // ---- CREATIVE CARDS ----
  {
    id: "card-botanical-set",
    name: "Botanical Notes Set",
    category: "cards",
    price: 329,
    mrp: 449,
    img: "assets/img/cat-cards.webp",
    badge: "hot",
    rating: 4.9,
    reviews: 143,
    desc: "Six hand-illustrated botanical greeting cards with kraft envelopes. Thick 350 GSM textured cardstock that feels as premium as it looks.",
    options: { Pack: ["Set of 6", "Set of 12"] },
    shopifyHandle: "botanical-notes-set"
  },
  {
    id: "card-birthday-blast",
    name: "Birthday Blast Cards",
    category: "cards",
    price: 279,
    mrp: 399,
    img: "assets/img/p-card-birthday.svg",
    badge: "new",
    rating: 4.8,
    reviews: null, // auto-filled below
    desc: "Confetti, candles and colour — birthday cards that actually feel like a celebration. Blank inside for your own words, envelope included.",
    options: { Pack: ["Set of 4", "Set of 8"] },
    shopifyHandle: "birthday-blast-cards"
  },
  {
    id: "card-minimal-lines",
    name: "Minimal Lines Set",
    category: "cards",
    price: 299,
    mrp: 429,
    img: "assets/img/p-card-minimal.svg",
    badge: "",
    rating: 4.7,
    reviews: null, // auto-filled below
    desc: "Single-stroke line art cards for people who say more with less. Elegant, gender-neutral designs for every occasion.",
    options: { Pack: ["Set of 6", "Set of 12"] },
    shopifyHandle: "minimal-lines-set"
  },

  // ---- BRAND LABELS ----
  {
    id: "label-artisan-jar",
    name: "Artisan Jar Labels",
    category: "labels",
    price: 449,
    mrp: 649,
    img: "assets/img/cat-labels.webp",
    badge: "hot",
    rating: 4.9,
    reviews: 121,
    desc: "Waterproof, oil-resistant custom labels for jars and bottles. Upload your logo after checkout — we colour-match, print and ship within 72 hours. 50 labels per roll.",
    options: { Material: ["Matte paper", "Waterproof vinyl", "Kraft"], Size: ["50mm round", "70x40mm", "Custom"] },
    shopifyHandle: "artisan-jar-labels"
  },
  {
    id: "label-candle-co",
    name: "Candle Co. Labels",
    category: "labels",
    price: 499,
    mrp: 699,
    img: "assets/img/p-label-candle.svg",
    badge: "new",
    rating: 4.8,
    reviews: null, // auto-filled below
    desc: "Heat-resistant premium labels made for candle brands — clean minimal layouts with your brand name front and centre. 50 labels per roll.",
    options: { Material: ["Matte paper", "Waterproof vinyl"], Size: ["60mm round", "80x50mm", "Custom"] },
    shopifyHandle: "candle-co-labels"
  },
  {
    id: "label-fresh-batch",
    name: "Fresh Batch Labels",
    category: "labels",
    price: 399,
    mrp: 549,
    img: "assets/img/p-label-food.svg",
    badge: "",
    rating: 4.7,
    reviews: null, // auto-filled below
    desc: "Food-safe labels for jams, pickles, bakes and small-batch magic. Smudge-proof inks that survive the fridge and the picnic. 50 labels per roll.",
    options: { Material: ["Matte paper", "Waterproof vinyl", "Kraft"], Size: ["50mm round", "70x40mm"] },
    shopifyHandle: "fresh-batch-labels"
  }
];

/* fill placeholder review counts */
PRODUCTS.forEach((p, i) => { if (typeof p.reviews !== "number") p.reviews = 68 + (i * 23) % 140; });

const CATEGORY_META = {
  stickers: { label: "Stickers", emoji: "⚡" },
  posters:  { label: "Posters", emoji: "🖼️" },
  cards:    { label: "Creative Cards", emoji: "💌" },
  labels:   { label: "Brand Labels", emoji: "🏷️" }
};

const FREE_SHIP_ABOVE = 499;

function formatINR(n) {
  return "₹" + n.toLocaleString("en-IN");
}
