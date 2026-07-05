// Web Worker — product search/filter/sort runs off the main thread
self.onmessage = ({ data: { products, query, category, sort } }) => {
  const q = (query || '').trim().toLowerCase();
  const out = products.filter((p) =>
    (category === 'All' || p.category === category) &&
    (!q || `${p.name} ${p.brand || ''} ${p.description}`.toLowerCase().includes(q))
  );
  if (sort === 'price-asc') out.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') out.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') out.sort((a, b) => (b.ratings?.averageRating || 0) - (a.ratings?.averageRating || 0));
  self.postMessage(out);
};
