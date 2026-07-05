import { useEffect, useRef, useState, useTransition } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container, Typography, TextField, InputAdornment, Chip, Stack,
  Select, MenuItem, Box, LinearProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VirtualProductGrid from '../components/VirtualProductGrid';
import Loader from '../components/Loader';
import { useProducts, useDebouncedValue } from '../hooks';
import { CATEGORIES } from '../data';

export default function Shop() {
  const products = useProducts();
  const [params] = useSearchParams();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(params.get('category') || 'All');
  const [sort, setSort] = useState('new');
  const [visible, setVisible] = useState(null);
  const [isPending, startTransition] = useTransition();
  const workerRef = useRef(null);

  // debounced search input — the worker only runs once typing settles
  const debouncedQuery = useDebouncedValue(query, 300);

  // web worker does filter + sort off the main thread;
  // useTransition keeps the input responsive while results swap in
  useEffect(() => {
    const worker = new Worker(new URL('../filter.worker.js', import.meta.url));
    workerRef.current = worker;
    worker.onmessage = (e) => startTransition(() => setVisible(e.data));
    return () => worker.terminate();
  }, []);

  useEffect(() => {
    if (products) workerRef.current?.postMessage({ products, query: debouncedQuery, category, sort });
  }, [products, debouncedQuery, category, sort]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom>Shop</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        {visible ? `${visible.length} products` : 'Loading catalogue…'}
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          fullWidth placeholder="Search products, brands…" value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        />
        <Select value={sort} onChange={(e) => setSort(e.target.value)} sx={{ minWidth: 200 }}>
          <MenuItem value="new">Newest</MenuItem>
          <MenuItem value="price-asc">Price: low to high</MenuItem>
          <MenuItem value="price-desc">Price: high to low</MenuItem>
          <MenuItem value="rating">Top rated</MenuItem>
        </Select>
      </Stack>

      <Stack direction="row" flexWrap="wrap" sx={{ gap: 1, mb: 4 }}>
        {['All', ...CATEGORIES].map((c) => (
          <Chip
            key={c} label={c} clickable
            color={category === c ? 'secondary' : 'default'}
            onClick={() => setCategory(c)}
          />
        ))}
      </Stack>

      {isPending && <LinearProgress color="secondary" sx={{ mb: 1 }} />}
      {visible === null ? (
        <Loader h="40vh" />
      ) : (
        <Box sx={{ opacity: isPending ? 0.6 : 1, transition: 'opacity .2s' }}>
          <VirtualProductGrid products={visible} />
        </Box>
      )}
    </Container>
  );
}
