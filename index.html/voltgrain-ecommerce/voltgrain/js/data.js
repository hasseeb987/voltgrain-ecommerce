/**
 * data.js
 * Static product catalog for VOLT & GRAIN.
 * In a real build this would come from an API; here it simulates
 * one so the rest of the app can be written against a stable contract.
 */

const CATEGORIES = [
  { slug: 'turntables', name: 'Turntables', icon: 'bi-disc' },
  { slug: 'headphones', name: 'Headphones', icon: 'bi-headphones' },
  { slug: 'speakers', name: 'Speakers', icon: 'bi-speaker' },
  { slug: 'amplifiers', name: 'Amplifiers', icon: 'bi-sliders' },
  { slug: 'accessories', name: 'Accessories', icon: 'bi-cassette' },
];

// Muted, material-led palette used to tint product panels (shown while a photo loads, or as a fallback).
const PANEL_COLORS = ['#2C2A26', '#7A4B2E', '#4C5C43', '#3C3A55', '#8A5A3C', '#33403C'];

// Two representative real photos per category (Unsplash, free license), so products
// in the same category don't all show the identical picture. Alternated by product id.
const CATEGORY_IMAGES = {
  turntables: [
    'https://images.unsplash.com/photo-1505672984986-b7c468c7a134',
    'https://images.unsplash.com/photo-1461360370896-922624d12aa1',
  ],
  headphones: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90',
  ],
  speakers: [
    'https://images.unsplash.com/photo-1609702847389-b8aec1b0b929',
    'https://images.unsplash.com/photo-1545454675-3531b543be5d',
  ],
  amplifiers: [
    'https://images.unsplash.com/photo-1516249255568-f8b6a5a52967',
    'https://images.unsplash.com/photo-1558865869-c93f6f8482af',
  ],
  accessories: [
    'https://images.unsplash.com/photo-1578744463215-93605b32e74e',
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc',
  ],
};

/**
 * Build a sized/cropped image URL for a product. `w` controls the requested
 * pixel width (Unsplash resizes + crops server-side), so cards and the
 * larger product-detail panel can both request an appropriately sized asset.
 * Alternates between the two category photos by product id, so a category
 * listing doesn't show the same image on every card.
 */
function productImageUrl(product, w = 600) {
  const variants = CATEGORY_IMAGES[product.category] || CATEGORY_IMAGES.accessories;
  const base = variants[product.id % variants.length];
  return `${base}?auto=format&fit=crop&w=${w}&q=75`;
}

const PRODUCTS = [
  { id: 1, sku: 'VG-TT-101', name: 'Ridgeline Belt-Drive Turntable', category: 'turntables', price: 349, oldPrice: null, rating: 4.7, reviews: 128, badge: 'Bestseller', icon: 'bi-disc', stock: 14,
    description: 'A belt-drive turntable built around a solid walnut plinth and a hand-balanced aluminium platter. Tuned for warmth, not hiss.',
    specs: { 'Drive type': 'Belt', 'Speeds': '33⅓ / 45 RPM', 'Cartridge': 'Moving magnet', 'Plinth': 'Solid walnut', 'Weight': '6.2 kg' } },
  { id: 2, sku: 'VG-TT-102', name: 'Fieldstone Direct-Drive Deck', category: 'turntables', price: 529, oldPrice: 599, rating: 4.8, reviews: 76, badge: 'Sale', icon: 'bi-disc', stock: 6,
    description: 'DJ-grade torque with a listening-room finish. Direct drive means instant start and rock-steady speed under a needle drop.',
    specs: { 'Drive type': 'Direct', 'Speeds': '33⅓ / 45 / 78 RPM', 'Cartridge': 'Included MM', 'Plinth': 'Brushed steel', 'Weight': '8.9 kg' } },
  { id: 3, sku: 'VG-TT-103', name: 'Meadow Portable Suitcase Player', category: 'turntables', price: 189, oldPrice: null, rating: 4.3, reviews: 54, badge: 'New', icon: 'bi-disc', stock: 22,
    description: 'Zip it shut and take the whole record collection with you. Built-in stereo speakers, USB-C charging, Bluetooth output.',
    specs: { 'Drive type': 'Belt', 'Speeds': '33⅓ / 45 RPM', 'Output': 'Bluetooth + AUX', 'Battery': '10 hr', 'Weight': '3.1 kg' } },
  { id: 4, sku: 'VG-TT-104', name: 'Northbend Audiophile Deck', category: 'turntables', price: 899, oldPrice: null, rating: 4.9, reviews: 41, badge: null, icon: 'bi-disc', stock: 5,
    description: 'The reference deck in our lineup. Isolated sub-chassis, damped tonearm, and a platter machined from a single billet.',
    specs: { 'Drive type': 'Belt', 'Speeds': '33⅓ / 45 RPM', 'Cartridge': 'Moving coil ready', 'Plinth': 'Isolated sub-chassis', 'Weight': '11.4 kg' } },
  { id: 5, sku: 'VG-HP-201', name: 'Overcast Open-Back Headphones', category: 'headphones', price: 219, oldPrice: null, rating: 4.6, reviews: 203, badge: 'Bestseller', icon: 'bi-headphones', stock: 31,
    description: 'Open-back drivers for a soundstage that feels like a room, not a box. Memory-foam earpads, replaceable cable.',
    specs: { 'Driver': '50mm dynamic', 'Impedance': '32 ohm', 'Back type': 'Open', 'Cable': 'Detachable, 2m', 'Weight': '285 g' } },
  { id: 6, sku: 'VG-HP-202', name: 'Basalt Closed-Back Studio Cans', category: 'headphones', price: 159, oldPrice: 189, rating: 4.5, reviews: 167, badge: 'Sale', icon: 'bi-headphones', stock: 18,
    description: 'Sealed for tracking sessions and city commutes alike. Flat response with just enough low-end warmth.',
    specs: { 'Driver': '45mm dynamic', 'Impedance': '38 ohm', 'Back type': 'Closed', 'Cable': 'Coiled, 3m', 'Weight': '310 g' } },
  { id: 7, sku: 'VG-HP-203', name: 'Sparrow Wireless Earbuds', category: 'headphones', price: 129, oldPrice: null, rating: 4.2, reviews: 289, badge: 'New', icon: 'bi-earbuds', stock: 47,
    description: 'True wireless, tuned by the same team that voices our full-size headphones. Case doubles as a 20-hour battery bank.',
    specs: { 'Driver': '10mm dynamic', 'Battery': '7 hr + 20 hr case', 'Water rating': 'IPX4', 'Codec': 'AAC / SBC', 'Weight': '5.4 g each' } },
  { id: 8, sku: 'VG-HP-204', name: 'Foundry Reference Headphones', category: 'headphones', price: 449, oldPrice: null, rating: 4.9, reviews: 38, badge: null, icon: 'bi-headphones', stock: 9,
    description: 'Hand-matched driver pairs and a CNC-milled aluminium yoke. Built for critical listening, not compromise.',
    specs: { 'Driver': '50mm beryllium-coated', 'Impedance': '60 ohm', 'Back type': 'Open', 'Cable': 'Balanced XLR4', 'Weight': '340 g' } },
  { id: 9, sku: 'VG-SP-301', name: 'Harborlight Bookshelf Speakers (Pair)', category: 'speakers', price: 399, oldPrice: null, rating: 4.7, reviews: 94, badge: 'Bestseller', icon: 'bi-speaker', stock: 12,
    description: 'Two-way bookshelf speakers with a walnut veneer and a bass port tuned for small rooms.',
    specs: { 'Configuration': '2-way, ported', 'Power handling': '80W RMS', 'Frequency range': '48Hz–22kHz', 'Finish': 'Walnut veneer', 'Weight': '5.6 kg each' } },
  { id: 10, sku: 'VG-SP-302', name: 'Coastal Powered Monitor (Pair)', category: 'speakers', price: 549, oldPrice: 629, rating: 4.6, reviews: 61, badge: 'Sale', icon: 'bi-speaker', stock: 7,
    description: 'Active studio monitors with built-in amplification and room-correction switches on the rear panel.',
    specs: { 'Configuration': '2-way, active', 'Power': '100W + 50W bi-amp', 'Inputs': 'XLR, RCA, Bluetooth', 'Finish': 'Matte black', 'Weight': '6.8 kg each' } },
  { id: 11, sku: 'VG-SP-303', name: 'Driftwood Portable Speaker', category: 'speakers', price: 99, oldPrice: null, rating: 4.1, reviews: 152, badge: 'New', icon: 'bi-speaker', stock: 40,
    description: 'A grab-and-go speaker with a fabric grille and 12 hours of battery. Pairs with two phones at once.',
    specs: { 'Power': '20W', 'Battery': '12 hr', 'Water rating': 'IPX6', 'Connectivity': 'Bluetooth 5.2', 'Weight': '620 g' } },
  { id: 12, sku: 'VG-SP-304', name: 'Cellar Floorstanding Towers (Pair)', category: 'speakers', price: 1299, oldPrice: null, rating: 4.8, reviews: 22, badge: null, icon: 'bi-speaker', stock: 3,
    description: 'Three-way floorstanders for rooms that deserve real headroom. Dual bass drivers, isolated crossover.',
    specs: { 'Configuration': '3-way, floorstanding', 'Power handling': '150W RMS', 'Frequency range': '32Hz–24kHz', 'Finish': 'Smoked oak', 'Weight': '24 kg each' } },
  { id: 13, sku: 'VG-AM-401', name: 'Anchor Integrated Amplifier', category: 'amplifiers', price: 429, oldPrice: null, rating: 4.6, reviews: 58, badge: 'Bestseller', icon: 'bi-sliders', stock: 11,
    description: 'A clean, class-AB integrated amp with a built-in phono stage — one box between your turntable and your speakers.',
    specs: { 'Power output': '2x60W @ 8ohm', 'Inputs': 'Phono, RCA x3, Bluetooth', 'Class': 'AB', 'Finish': 'Brushed aluminium', 'Weight': '7.4 kg' } },
  { id: 14, sku: 'VG-AM-402', name: 'Kettle Tube Headphone Amp', category: 'amplifiers', price: 259, oldPrice: 299, rating: 4.5, reviews: 33, badge: 'Sale', icon: 'bi-sliders', stock: 15,
    description: 'A small tube amp for headphones, with the warm-up glow to prove it. Dual 6.3mm and balanced outputs.',
    specs: { 'Tubes': '2x 12AU7', 'Outputs': '6.3mm + balanced 4-pin', 'Power output': '1.2W into 32ohm', 'Finish': 'Walnut cheeks', 'Weight': '2.1 kg' } },
  { id: 15, sku: 'VG-AM-403', name: 'Pocket Portable DAC/Amp', category: 'amplifiers', price: 149, oldPrice: null, rating: 4.4, reviews: 87, badge: 'New', icon: 'bi-sliders', stock: 26,
    description: 'A pocket-sized DAC and headphone amp for laptops and phones that need better sound than their own jack.',
    specs: { 'DAC chip': '32-bit / 384kHz', 'Output': '3.5mm + balanced 2.5mm', 'Battery': '8 hr', 'Connector': 'USB-C', 'Weight': '48 g' } },
  { id: 16, sku: 'VG-AC-501', name: 'Cotton-Braided RCA Cable Pair', category: 'accessories', price: 39, oldPrice: null, rating: 4.5, reviews: 210, badge: null, icon: 'bi-cassette', stock: 80,
    description: 'Oxygen-free copper conductors under a cotton braid that won\u2019t kink behind your rack.', 
    specs: { 'Length': '1.5 m', 'Conductor': 'OFC copper', 'Connector': 'Gold-plated RCA', 'Shielding': 'Double-layer', 'Weight': '90 g' } },
  { id: 17, sku: 'VG-AC-502', name: 'Record Cleaning Kit', category: 'accessories', price: 34, oldPrice: null, rating: 4.7, reviews: 176, badge: 'Bestseller', icon: 'bi-droplet', stock: 65,
    description: 'Carbon-fibre brush, cleaning fluid, and a microfibre cloth — everything a crate-digger needs before the first spin.',
    specs: { 'Includes': 'Brush, fluid 100ml, cloth', 'Fluid type': 'Alcohol-free', 'Storage case': 'Included', 'Weight': '180 g' } },
  { id: 18, sku: 'VG-AC-503', name: 'Walnut Headphone Stand', category: 'accessories', price: 44, oldPrice: 54, rating: 4.6, reviews: 98, badge: 'Sale', icon: 'bi-cassette', stock: 37,
    description: 'A single block of solid walnut, carved to cradle a headband and keep your cans off the desk.',
    specs: { 'Material': 'Solid walnut', 'Base': 'Weighted felt pad', 'Height': '22 cm', 'Weight': '650 g' } },
  { id: 19, sku: 'VG-AC-504', name: 'Anti-Static Record Sleeves (50-Pack)', category: 'accessories', price: 19, oldPrice: null, rating: 4.4, reviews: 145, badge: null, icon: 'bi-cassette', stock: 120,
    description: 'Rice-paper lined inner sleeves that keep static and dust off vinyl grooves between spins.',
    specs: { 'Pack size': '50 sleeves', 'Material': 'Rice-paper lined poly', 'Fits': '12-inch records', 'Weight': '340 g' } },
  { id: 20, sku: 'VG-AC-505', name: 'Replacement Stylus, Elliptical', category: 'accessories', price: 59, oldPrice: null, rating: 4.3, reviews: 62, badge: 'New', icon: 'bi-cassette', stock: 44,
    description: 'A drop-in elliptical stylus upgrade for our standard moving-magnet cartridges. Tighter tracking, less sibilance.',
    specs: { 'Tip shape': 'Elliptical', 'Compatibility': 'VG standard MM mount', 'Tracking force': '1.5–2.0g', 'Weight': '1.4 g' } },
  { id: 21, sku: 'VG-SP-305', name: 'Alcove Ceiling Speakers (Pair)', category: 'speakers', price: 219, oldPrice: null, rating: 4.2, reviews: 29, badge: null, icon: 'bi-speaker', stock: 16,
    description: 'Low-profile in-ceiling speakers for kitchens and bathrooms, paintable grille included.',
    specs: { 'Configuration': '2-way, in-ceiling', 'Power handling': '60W RMS', 'Cutout': '165mm', 'Finish': 'Paintable white', 'Weight': '1.1 kg each' } },
  { id: 22, sku: 'VG-HP-205', name: 'Junior On-Ear Headphones', category: 'headphones', price: 69, oldPrice: null, rating: 4.0, reviews: 71, badge: null, icon: 'bi-headphones', stock: 53,
    description: 'A lighter, smaller build of our closed-back cans, volume-limited for younger listeners.',
    specs: { 'Driver': '32mm dynamic', 'Impedance': '24 ohm', 'Volume limit': '85dB', 'Cable': 'Fixed, 1.2m', 'Weight': '160 g' } },
  { id: 23, sku: 'VG-TT-105', name: 'Cabin USB Turntable', category: 'turntables', price: 159, oldPrice: 179, rating: 4.1, reviews: 88, badge: 'Sale', icon: 'bi-disc', stock: 24,
    description: 'Digitise a record collection straight to a laptop over USB, or just play it back through the built-in preamp.',
    specs: { 'Drive type': 'Belt', 'Speeds': '33⅓ / 45 RPM', 'Output': 'USB + RCA', 'Preamp': 'Built-in, switchable', 'Weight': '4.8 kg' } },
  { id: 24, sku: 'VG-AC-506', name: 'Speaker Isolation Pads (Set of 4)', category: 'accessories', price: 29, oldPrice: null, rating: 4.5, reviews: 54, badge: null, icon: 'bi-cassette', stock: 70,
    description: 'Dense foam pads that decouple bookshelf speakers from the shelf, cleaning up bass response.',
    specs: { 'Set size': '4 pads', 'Material': 'High-density foam', 'Max load': '15 kg per pad', 'Weight': '220 g' } },
];

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === Number(id));
}

function getRelatedProducts(product, count = 4) {
  return PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, count);
}

function panelColorFor(id) {
  return PANEL_COLORS[id % PANEL_COLORS.length];
}