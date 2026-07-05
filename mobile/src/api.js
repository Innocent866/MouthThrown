// Point this at your machine's LAN IP when testing on a device
export const API_URL = 'http://localhost:5750/api';

const FALLBACK = Array.from({ length: 16 }, (_, i) => ({
  _id: `demo-${i}`,
  name: [
    'Aurora Air Fryer XL', 'Nordic Desk Lamp', 'Volt 65W GaN Charger', 'Kesa Linen Shirt',
    'Plume Wireless Earbuds', 'Cradle Baby Monitor', 'Pulse 4K Action Cam', 'Copper Chef Pan Set',
    'Strider Pro Controller', 'Brew Master Espresso', 'Slate Mechanical Keyboard', 'Halo 5G Smartphone',
    'Atlas Weekender Bag', 'Echo Smart Speaker', 'Prism LED Monitor 27"', 'Vertex Gaming Headset',
  ][i],
  price: 19 + ((i * 37) % 480),
  category: ['Electronics', 'Fashion', 'Gadget', 'Gaming'][i % 4],
  description: 'Thoughtfully designed, built to last, and backed by the MouthThrown quality promise.',
  images: [`https://picsum.photos/seed/mt${i}/640/640`],
  ratings: { averageRating: 3.5 + (i % 4) * 0.5, numberOfRatings: 12 + i * 3 },
  stock: 5 + (i % 20),
}));

export async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/item/getallproducts`);
    const data = await res.json();
    return Array.isArray(data) && data.length ? data : FALLBACK;
  } catch {
    return FALLBACK;
  }
}
