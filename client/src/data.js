// Demo catalogue shown when the API is unreachable or empty,
// so the storefront is always browsable.
export const CATEGORIES = [
  'Appliances', 'computer', 'Phone', 'Fashion', 'Gadget',
  'Baby Product', 'Books', 'Electronics', 'Kechine Items', 'Gaming',
];

const NAMES = [
  'Aurora Air Fryer XL', 'Nordic Desk Lamp', 'Volt 65W GaN Charger', 'Kesa Linen Shirt',
  'Plume Wireless Earbuds', 'Cradle Baby Monitor', 'The Quiet Architect (Hardcover)',
  'Pulse 4K Action Cam', 'Copper Chef Pan Set', 'Strider Pro Controller',
  'Brew Master Espresso', 'Slate Mechanical Keyboard', 'Halo 5G Smartphone',
  'Atlas Weekender Bag', 'Echo Smart Speaker', 'Nimbus Stroller Lite',
  'Ink & Ember (Novel)', 'Prism LED Monitor 27"', 'Sage Knife Block Set',
  'Vertex Gaming Headset', 'Zephyr Tower Fan', 'Orbit Laptop Stand',
  'Lumen Phone Case Duo', 'Weave Throw Blanket',
];

const BRANDS = ['Aria', 'Nordic', 'Volt', 'Kesa', 'Plume'];

const fallback = NAMES.map((name, i) => ({
  _id: `demo-${i}`,
  name,
  brand: BRANDS[i % BRANDS.length],
  description: `${name} — thoughtfully designed, built to last, and backed by the MouthThrown quality promise. Free returns within 30 days.`,
  price: 19 + ((i * 37) % 480),
  stock: 5 + (i % 20),
  category: CATEGORIES[i % CATEGORIES.length],
  images: [`https://picsum.photos/seed/mt${i}/640/640`],
  ratings: { averageRating: 3.5 + (i % 4) * 0.5, numberOfRatings: 12 + i * 3 },
}));

export default fallback;
