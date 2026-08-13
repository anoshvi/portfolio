/* Store catalog data. Loaded on every page as window.STORE. */
window.STORE = (function () {
  const categories = [
    { id: "electronics", name: "Electronics", color: "#2b6cb0" },
    { id: "home", name: "Home & Kitchen", color: "#2f855a" },
    { id: "books", name: "Books", color: "#975a16" },
    { id: "fashion", name: "Fashion", color: "#b83280" },
    { id: "toys", name: "Toys & Games", color: "#c05621" },
    { id: "sports", name: "Sports & Outdoors", color: "#2c7a7b" },
    { id: "beauty", name: "Beauty", color: "#9f7aea" },
    { id: "grocery", name: "Grocery", color: "#38a169" },
  ];

  const products = [
    { id: "e1", title: "Aurora 27\" 4K UHD Monitor", category: "electronics", brand: "Aurora", price: 329.99, oldPrice: 399.99, rating: 4.6, reviews: 2143, prime: true, desc: "27-inch 4K UHD IPS display with 99% sRGB, HDR10, and USB-C 65W charging. Perfect for creative work and gaming." },
    { id: "e2", title: "Nimbus Wireless Noise-Cancelling Headphones", category: "electronics", brand: "Nimbus", price: 149.0, oldPrice: 199.0, rating: 4.7, reviews: 8821, prime: true, desc: "Up to 40 hours battery life, adaptive active noise cancellation, and multipoint Bluetooth 5.3." },
    { id: "e3", title: "Pulse Smartwatch Series 6", category: "electronics", brand: "Pulse", price: 219.99, oldPrice: 259.99, rating: 4.4, reviews: 3390, prime: true, desc: "AMOLED always-on display, GPS, heart-rate & SpO2 tracking, 7-day battery, 5ATM water resistance." },
    { id: "e4", title: "Bolt 100W USB-C GaN Charger", category: "electronics", brand: "Bolt", price: 39.99, oldPrice: 54.99, rating: 4.8, reviews: 1204, prime: true, desc: "Compact 3-port GaN charger. Charge a laptop and two phones simultaneously." },
    { id: "e5", title: "Echo Mini Bluetooth Speaker", category: "electronics", brand: "Echo", price: 27.5, oldPrice: 39.99, rating: 4.3, reviews: 5560, prime: false, desc: "Pocket-sized waterproof speaker with punchy bass and 12-hour playtime." },
    { id: "e6", title: "Vertex Mechanical Keyboard (Hot-swap)", category: "electronics", brand: "Vertex", price: 89.99, oldPrice: 119.99, rating: 4.6, reviews: 987, prime: true, desc: "75% layout, hot-swappable switches, PBT keycaps, RGB, and USB-C." },

    { id: "h1", title: "BrewMaster 12-Cup Programmable Coffee Maker", category: "home", brand: "BrewMaster", price: 59.99, oldPrice: 79.99, rating: 4.5, reviews: 4210, prime: true, desc: "Programmable timer, keep-warm plate, and reusable filter. Wake up to fresh coffee." },
    { id: "h2", title: "CloudSoft Memory Foam Pillow (2-Pack)", category: "home", brand: "CloudSoft", price: 34.99, oldPrice: 49.99, rating: 4.4, reviews: 7712, prime: true, desc: "Cooling gel-infused memory foam with a breathable, washable cover." },
    { id: "h3", title: "IronChef 10-Piece Nonstick Cookware Set", category: "home", brand: "IronChef", price: 89.0, oldPrice: 129.0, rating: 4.6, reviews: 3021, prime: true, desc: "Scratch-resistant nonstick coating, oven-safe, with tempered glass lids." },
    { id: "h4", title: "Lumen Smart LED Bulbs (4-Pack)", category: "home", brand: "Lumen", price: 32.99, oldPrice: 44.99, rating: 4.5, reviews: 2890, prime: false, desc: "16M colors, voice-assistant compatible, schedules and scenes via app." },
    { id: "h5", title: "PureAir HEPA Air Purifier", category: "home", brand: "PureAir", price: 119.99, oldPrice: 159.99, rating: 4.7, reviews: 1567, prime: true, desc: "Covers 400 sq ft, true HEPA + activated carbon, quiet sleep mode." },

    { id: "b1", title: "The Midnight Library", category: "books", brand: "Canongate", price: 11.99, oldPrice: 16.99, rating: 4.5, reviews: 152340, prime: true, desc: "A novel about all the choices that go into a life well lived. International bestseller." },
    { id: "b2", title: "Atomic Habits", category: "books", brand: "Avery", price: 13.49, oldPrice: 21.99, rating: 4.8, reviews: 289110, prime: true, desc: "An easy & proven way to build good habits and break bad ones." },
    { id: "b3", title: "Project Hail Mary", category: "books", brand: "Ballantine", price: 14.99, oldPrice: 19.99, rating: 4.7, reviews: 98432, prime: true, desc: "A lone astronaut must save the earth from disaster in this cinematic sci-fi thriller." },
    { id: "b4", title: "Clean Code", category: "books", brand: "Prentice Hall", price: 32.99, oldPrice: 44.99, rating: 4.6, reviews: 12903, prime: false, desc: "A handbook of agile software craftsmanship by Robert C. Martin." },

    { id: "f1", title: "Everyday Crewneck T-Shirt (3-Pack)", category: "fashion", brand: "Basics", price: 24.99, oldPrice: 34.99, rating: 4.3, reviews: 6721, prime: true, desc: "Soft combed cotton, pre-shrunk, tagless. Available in mixed neutrals." },
    { id: "f2", title: "TrailStep Waterproof Hiking Boots", category: "fashion", brand: "TrailStep", price: 79.99, oldPrice: 109.99, rating: 4.5, reviews: 2210, prime: true, desc: "Waterproof membrane, grippy lug outsole, cushioned midsole for all-day comfort." },
    { id: "f3", title: "Horizon Polarized Sunglasses", category: "fashion", brand: "Horizon", price: 21.99, oldPrice: 29.99, rating: 4.2, reviews: 3980, prime: false, desc: "UV400 polarized lenses, lightweight frame, includes case and cloth." },
    { id: "f4", title: "Cozy Sherpa Zip Hoodie", category: "fashion", brand: "Cozy", price: 42.0, oldPrice: 59.0, rating: 4.6, reviews: 1540, prime: true, desc: "Ultra-soft sherpa lining, kangaroo pocket, ribbed cuffs." },

    { id: "t1", title: "BrickBuild City Explorer Set (620 pcs)", category: "toys", brand: "BrickBuild", price: 44.99, oldPrice: 59.99, rating: 4.8, reviews: 4320, prime: true, desc: "Build a working crane, fire truck, and city block. Ages 7+." },
    { id: "t2", title: "Galaxy Remote Control Drone", category: "toys", brand: "Galaxy", price: 64.99, oldPrice: 89.99, rating: 4.3, reviews: 1870, prime: true, desc: "1080p camera, altitude hold, 2 batteries for 24 min flight time." },
    { id: "t3", title: "Strategy Night Board Game", category: "toys", brand: "TableTop", price: 29.99, oldPrice: 39.99, rating: 4.7, reviews: 990, prime: false, desc: "A modern classic of trading and building for 2-5 players." },

    { id: "s1", title: "FlexCore Adjustable Dumbbells (Pair)", category: "sports", brand: "FlexCore", price: 199.0, oldPrice: 279.0, rating: 4.6, reviews: 2130, prime: true, desc: "5-52.5 lb per hand, quick-dial adjustment. Replaces 15 sets of weights." },
    { id: "s2", title: "AquaFlow Insulated Water Bottle 32oz", category: "sports", brand: "AquaFlow", price: 24.99, oldPrice: 32.99, rating: 4.7, reviews: 15320, prime: true, desc: "Keeps drinks cold 24h / hot 12h. Leakproof lid, powder-coat finish." },
    { id: "s3", title: "TrailBlaze 35L Hiking Backpack", category: "sports", brand: "TrailBlaze", price: 54.99, oldPrice: 74.99, rating: 4.5, reviews: 1780, prime: false, desc: "Ventilated back panel, rain cover, hydration-compatible." },

    { id: "be1", title: "GlowSerum Vitamin C Facial Serum", category: "beauty", brand: "GlowSerum", price: 18.99, oldPrice: 26.99, rating: 4.4, reviews: 8890, prime: true, desc: "Brightening serum with 15% vitamin C, hyaluronic acid, and vitamin E." },
    { id: "be2", title: "SilkShine Hair Dryer 1875W", category: "beauty", brand: "SilkShine", price: 39.99, oldPrice: 59.99, rating: 4.5, reviews: 2340, prime: true, desc: "Ionic technology reduces frizz. 3 heat / 2 speed settings, cool shot." },

    { id: "g1", title: "Highland Single-Origin Coffee Beans 2lb", category: "grocery", brand: "Highland", price: 21.99, oldPrice: 27.99, rating: 4.7, reviews: 5640, prime: true, desc: "Medium roast, notes of chocolate and citrus. Whole bean, freshly roasted." },
    { id: "g2", title: "PureLeaf Organic Green Tea (100 bags)", category: "grocery", brand: "PureLeaf", price: 12.99, oldPrice: 17.99, rating: 4.6, reviews: 3210, prime: true, desc: "Organic sencha green tea in compostable bags. Smooth, non-bitter." },
    { id: "g3", title: "NutBar Protein Snack Bars (12-Pack)", category: "grocery", brand: "NutBar", price: 15.49, oldPrice: 19.99, rating: 4.3, reviews: 4120, prime: false, desc: "12g protein, no artificial sweeteners. Mixed chocolate & peanut flavors." },
  ];

  const catColor = {};
  categories.forEach((c) => (catColor[c.id] = c.color));
  products.forEach((p) => (p.color = catColor[p.category] || "#555"));

  return { categories, products, catColor };
})();
